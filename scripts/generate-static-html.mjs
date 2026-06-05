import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ROUTE_META, BLOG_SLUGS, ogImageForRoute } from '../api/_routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Routes recevant un HTML statique pré-rendu (titre + og:image patchés).
const ROUTES = [
  ...Object.keys(ROUTE_META).filter(r => r !== '/'),
  ...BLOG_SLUGS,
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function patchHtml(html, route) {
  const meta = ROUTE_META[route] || { title: 'mesimulateurs.fr' };
  const ogImg = ogImageForRoute(route); // chemin relatif, ex: /og-immobilier.svg
  return html
    .replace(/content="\/og-image\.png"/g, `content="${ogImg}"`)
    .replace(/content="\/og-image\.svg"/g, `content="${ogImg}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
}

// ── Main ───────────────────────────────────────────────────────────────────────
const distDir  = path.resolve(__dirname, '../dist');
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// HTML statiques par route
for (const route of ROUTES) {
  const dir  = path.join(distDir, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), patchHtml(indexHtml, route));
}

// NB : le sitemap.xml n'est plus généré ici. Il est servi dynamiquement par
// api/sitemap.js (routes statiques + slugs blog depuis Redis), via le rewrite
// /sitemap.xml → /api/sitemap dans vercel.json. Un sitemap.xml statique aurait
// priorité sur le rewrite et masquerait les nouveaux articles.

console.log(`✓ Généré ${ROUTES.length} fichiers HTML statiques (og:image par catégorie)`);
