import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BASE, ROUTE_META, BLOG_SLUGS, LEXIQUE_SLUGS, ogImageForRoute, structuredDataScripts } from '../api/_routes.js';
import { SEO_CONTENT, seoHtmlForRoute } from '../api/_seo.js';
import { GLOSSARY_BY_SLUG } from '../src/data/glossaire.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DESC_LEXIQUE = "Lexique des termes de finances personnelles : TAEG, PTZ, PER, TMI, FIRE, assurance-vie… Des définitions simples, reliées à nos simulateurs gratuits.";
const DESC_BLOG    = "Articles et guides sur l'épargne, le FIRE, la retraite, l'immobilier et la fiscalité en France, pour prendre de meilleures décisions financières.";

// ── Helpers ────────────────────────────────────────────────────────────────────
function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Titre + description spécifiques à une route (sinon null → on garde la valeur
// par défaut de index.html). `extra` porte les métadonnées blog issues de Redis.
function seoForRoute(route, extra = {}) {
  if (route.startsWith('/lexique/')) {
    const slug = route.slice('/lexique/'.length);
    const t = GLOSSARY_BY_SLUG[slug];
    if (t) return { title: `${t.term} : définition (${t.full}) | mesimulateurs.fr`, description: t.short };
  }
  if (route.startsWith('/blog/')) {
    return { title: extra.title ? `${extra.title} | mesimulateurs.fr` : null, description: extra.description || null };
  }
  if (route === '/lexique') return { title: ROUTE_META[route]?.title, description: DESC_LEXIQUE };
  if (route === '/blog')    return { title: ROUTE_META[route]?.title, description: DESC_BLOG };
  const meta = ROUTE_META[route];
  return { title: meta?.title || null, description: SEO_CONTENT[route]?.intro || null };
}

function patchHtml(html, route, extra) {
  const { title, description } = seoForRoute(route, extra);
  const ogImg = ogImageForRoute(route); // chemin relatif, ex: /og-immobilier.png
  const ld = structuredDataScripts(route, extra);
  const seo = seoHtmlForRoute(route); // contenu crawlable injecté dans #root
  const url = `${BASE}${route}`;
  let out = html
    .replace(/content="\/og-image\.png"/g, `content="${ogImg}"`)
    .replace(/content="\/og-image\.svg"/g, `content="${ogImg}"`)
    .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${escapeAttr(url)}"`);

  if (title) {
    const t = escapeAttr(title);
    out = out
      .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
      .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
      .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`);
  }
  if (description) {
    const d = escapeAttr(description);
    out = out
      .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
      .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`);
  }

  // <link rel="canonical"> + JSON-LD + contenu SEO injecté.
  out = out
    .replace('</head>', `    <link rel="canonical" href="${escapeAttr(url)}" />\n${ld ? `    ${ld}\n` : ''}  </head>`)
    .replace('<div id="root"></div>', seo ? `<div id="root">${seo}</div>` : '<div id="root"></div>');
  return out;
}

// Articles de blog : titres/intros lus depuis Redis si configuré au build, afin
// de générer un HTML statique au bon titre. Repli sur la liste statique sinon.
async function blogEntries() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return BLOG_SLUGS.map(route => ({ route }));
  try {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({ url, token });
    const slugs = await redis.zrange('blog:slugs', 0, -1, { rev: true });
    if (!Array.isArray(slugs) || !slugs.length) return BLOG_SLUGS.map(route => ({ route }));
    const entries = [];
    for (const slug of slugs) {
      const route = slug.startsWith('/blog/') ? slug : `/blog/${slug}`;
      let title, description, publishedAt, image;
      try {
        const raw = await redis.get(`blog:article:${slug.replace(/^\/blog\//, '')}`);
        const a = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : null;
        title = a?.title; description = a?.intro; publishedAt = a?.publishedAt; image = a?.image;
      } catch { /* titre par défaut */ }
      entries.push({ route, title, description, publishedAt, image });
    }
    return entries;
  } catch {
    return BLOG_SLUGS.map(route => ({ route }));
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────
const distDir  = path.resolve(__dirname, '../dist');
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

const blog = await blogEntries();

// Routes recevant un HTML statique pré-rendu (titre + description + og patchés).
const routes = [
  ...Object.keys(ROUTE_META).filter(r => r !== '/').map(route => ({ route })),
  ...LEXIQUE_SLUGS.map(route => ({ route })),
  ...blog,
];

for (const entry of routes) {
  const dir = path.join(distDir, entry.route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), patchHtml(indexHtml, entry.route, entry));
}

// Versionne le cache du service worker à chaque build : le nom de cache change,
// donc l'ancien cache (anciens JS/CSS) est purgé à l'activation du nouveau SW.
try {
  const swPath = path.join(distDir, 'sw.js');
  const sw = fs.readFileSync(swPath, 'utf-8');
  fs.writeFileSync(swPath, sw.replace(/mesim-v1/g, `mesim-${Date.now()}`));
} catch { /* sw.js absent : on ignore */ }

// NB : le sitemap.xml n'est plus généré ici. Il est servi dynamiquement par
// api/sitemap.js (routes statiques + slugs blog depuis Redis), via le rewrite
// /sitemap.xml → /api/sitemap dans vercel.json.

console.log(`✓ Généré ${routes.length} fichiers HTML statiques (titres, descriptions & og:image par route)`);
