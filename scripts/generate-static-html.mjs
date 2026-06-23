import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BASE, ROUTE_META, ROUTE_META_EN, ROUTE_META_CH, ROUTE_META_BE, EN_ROUTES, CH_ROUTES, BE_ROUTES, BLOG_SLUGS, LEXIQUE_SLUGS, GUIDES_SLUGS, COMPARATIFS_SLUGS, ogImageForRoute, structuredDataScripts, hreflangLinks } from '../api/_routes.js';
import { SEO_CONTENT, SEO_CONTENT_EN, seoHtmlForRoute, seoHtmlForArticle } from '../api/_seo.js';
import { GLOSSARY_BY_SLUG } from '../src/data/glossaire.js';
import { GUIDES_BY_SLUG } from '../src/data/guides.js';
import { COMPARATIFS_BY_SLUG } from '../src/data/comparatifs.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DESC_LEXIQUE = "Lexique des termes de finances personnelles : TAEG, PTZ, PER, TMI, FIRE, assurance-vie… Des définitions simples, reliées à nos simulateurs gratuits.";
const DESC_BLOG    = "Articles et guides sur l'épargne, le FIRE, la retraite, l'immobilier et la fiscalité en France, pour prendre de meilleures décisions financières.";
const DESC_GUIDES  = "Guides pratiques pour préparer sa retraite, acheter un logement, construire son épargne et viser l'indépendance financière : simulateurs, définitions et articles réunis.";

// ── Helpers ────────────────────────────────────────────────────────────────────
function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Titre + description spécifiques à une route (sinon null → on garde la valeur
// par défaut de index.html). `extra` porte les métadonnées blog issues de Redis.
function seoForRoute(route, extra = {}, locale = 'fr', country = 'fr') {
  if (locale === 'en') {
    const meta = ROUTE_META_EN[route];
    if (meta) return { title: meta.title, description: meta.description };
    return { title: null, description: SEO_CONTENT_EN[route]?.intro || null };
  }
  if (country === 'ch') {
    const meta = ROUTE_META_CH[route];
    if (meta) return { title: meta.title, description: meta.description };
  }
  if (country === 'be') {
    const meta = ROUTE_META_BE[route];
    if (meta) return { title: meta.title, description: meta.description };
  }
  if (route.startsWith('/lexique/')) {
    const slug = route.slice('/lexique/'.length);
    const t = GLOSSARY_BY_SLUG[slug];
    if (t) return { title: `${t.term} : définition (${t.full}) | simfinly.com`, description: t.short };
  }
  if (route.startsWith('/guides/')) {
    const g = GUIDES_BY_SLUG[route.slice('/guides/'.length)];
    if (g) return { title: `${g.title} — guide complet | simfinly.com`, description: g.intro };
  }
  if (route.startsWith('/comparatifs/')) {
    const c = COMPARATIFS_BY_SLUG[route.slice('/comparatifs/'.length)];
    if (c) return { title: `${c.title} | simfinly.com`, description: c.intro };
  }
  if (route.startsWith('/blog/')) {
    return { title: extra.title ? `${extra.title} | simfinly.com` : null, description: extra.description || null };
  }
  if (route === '/lexique') return { title: ROUTE_META[route]?.title, description: DESC_LEXIQUE };
  if (route === '/guides')  return { title: ROUTE_META[route]?.title, description: DESC_GUIDES };
  if (route === '/methodologie') return { title: ROUTE_META[route]?.title, description: "Comment simfinly.com calcule ses estimations : formules, barèmes officiels, sources et limites." };
  if (route === '/blog')    return { title: ROUTE_META[route]?.title, description: DESC_BLOG };
  const meta = ROUTE_META[route];
  return { title: meta?.title || null, description: SEO_CONTENT[route]?.intro || null };
}

// og:image dynamique (brandé) pour les pages de contenu, via /api/og.
function ogImageUrl(route, extra) {
  let t = "", c = "";
  if (route.startsWith('/lexique/')) { const x = GLOSSARY_BY_SLUG[route.slice('/lexique/'.length)]; if (x) { t = x.term; c = x.category; } }
  else if (route.startsWith('/guides/')) { const g = GUIDES_BY_SLUG[route.slice('/guides/'.length)]; if (g) { t = g.title; c = g.category; } }
  else if (route.startsWith('/comparatifs/')) { const x = COMPARATIFS_BY_SLUG[route.slice('/comparatifs/'.length)]; if (x) { t = x.shortTitle; c = x.category; } }
  else if (route.startsWith('/blog/')) { t = extra.title || ''; }
  else if (ROUTE_META[route]) { t = ROUTE_META[route].title; c = ROUTE_META[route].cat || ''; }
  if (t) return `${BASE}/api/og?${new URLSearchParams({ t, c }).toString()}`;
  return `${BASE}${ogImageForRoute(route)}`;
}

function patchHtml(html, route, extra, locale = 'fr', country = 'fr') {
  const { title, description } = seoForRoute(route, extra, locale, country);
  const ogImg = ogImageUrl(route, extra);
  const ld = structuredDataScripts(route, extra);
  const seo = route.startsWith('/blog/') ? seoHtmlForArticle(extra) : seoHtmlForRoute(route, locale, country);
  let urlPath;
  if (locale === 'en') urlPath = `/en${route === '/' ? '' : route}`;
  else if (country === 'ch') urlPath = `/ch${route === '/' ? '' : route}`;
  else if (country === 'be') urlPath = `/be${route === '/' ? '' : route}`;
  else urlPath = route;
  const url = `${BASE}${urlPath}`;
  let out = html
    .replace(/content="\/og-image\.png"/g, `content="${escapeAttr(ogImg)}"`)
    .replace(/content="\/og-image\.svg"/g, `content="${escapeAttr(ogImg)}"`)
    .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${escapeAttr(url)}"`)
    .replace(/<html lang="[^"]*"/, `<html lang="${locale === 'en' ? 'en' : 'fr'}"`);

  if (locale === 'en') {
    out = out
      .replace(/<meta property="og:locale" content="[^"]*"/, '<meta property="og:locale" content="en_US"');
  } else if (country === 'ch') {
    out = out
      .replace(/<meta property="og:locale" content="[^"]*"/, '<meta property="og:locale" content="fr_CH"');
  } else if (country === 'be') {
    out = out
      .replace(/<meta property="og:locale" content="[^"]*"/, '<meta property="og:locale" content="fr_BE"');
  }

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

  const hreflang = hreflangLinks(route);
  out = out
    .replace('</head>', `    <link rel="canonical" href="${escapeAttr(url)}" />\n${hreflang ? `    ${hreflang}\n` : ''}${ld ? `    ${ld}\n` : ''}  </head>`)
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
      let title, description, publishedAt, image, content;
      try {
        const raw = await redis.get(`blog:article:${slug.replace(/^\/blog\//, '')}`);
        const a = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : null;
        title = a?.title; description = a?.intro; publishedAt = a?.publishedAt; image = a?.image; content = a?.content;
      } catch { /* titre par défaut */ }
      entries.push({ route, title, description, publishedAt, image, content });
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
  ...GUIDES_SLUGS.map(route => ({ route })),
  ...COMPARATIFS_SLUGS.map(route => ({ route })),
  ...blog,
];

for (const entry of routes) {
  const dir = path.join(distDir, entry.route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), patchHtml(indexHtml, entry.route, entry, 'fr'));
}

// ── Pages EN (routes universelles disponibles en anglais) ──────────────────────
const EN_ARRAY = Array.from(EN_ROUTES);
for (const route of EN_ARRAY) {
  const urlPath = route === '/' ? '/en' : `/en${route}`;
  const dir = path.join(distDir, urlPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), patchHtml(indexHtml, route, {}, 'en'));
}

// ── Pages CH (/ch/... routes disponibles en Suisse) ────────────────────────────
for (const route of CH_ROUTES) {
  const urlPath = route === '/' ? '/ch' : `/ch${route}`;
  const dir = path.join(distDir, urlPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), patchHtml(indexHtml, route, {}, 'fr', 'ch'));
}

// ── Pages BE (/be/... routes disponibles en Belgique) ─────────────────────────
for (const route of BE_ROUTES) {
  const urlPath = route === '/' ? '/be' : `/be${route}`;
  const dir = path.join(distDir, urlPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), patchHtml(indexHtml, route, {}, 'fr', 'be'));
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

console.log(`✓ Généré ${routes.length} fichiers HTML statiques FR + ${EN_ARRAY.length} EN + ${CH_ROUTES.length} CH + ${BE_ROUTES.length} BE`);
