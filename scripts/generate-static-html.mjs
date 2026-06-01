import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROUTES = [
  '/simulateurs/agirc-arrco', '/simulateurs/cnav', '/simulateurs/fonction-publique',
  '/simulateurs/independants', '/simulateurs/ircantec', '/simulateurs/retraite-progressive',
  '/simulateurs/cnavpl', '/simulateurs/msa', '/simulateurs/emprunt-immobilier',
  '/simulateurs/rendement-locatif', '/simulateurs/impot-revenu', '/simulateurs/plus-value-immobiliere',
  '/simulateurs/epargne', '/simulateurs/fire', '/simulateurs/cout-en-heures',
  '/simulateurs/vie-en-semaines', '/simulateurs/budget', '/simulateurs/salaire',
  '/simulateurs/ptz', '/simulateurs/per',
  '/a-propos', '/mentions-legales', '/politique-de-confidentialite',
  '/blog', '/blog/comment-calculer-retraite-2025',
  '/blog/fire-france-independance-financiere', '/blog/simuler-emprunt-immobilier'
];

const BASE = 'https://www.mesimulateurs.fr';
const TODAY = new Date().toISOString().slice(0, 10);

const PRIORITIES = {
  '/': { priority: '1.0', changefreq: 'weekly' },
  simulateurs: { priority: '0.9', changefreq: 'monthly' },
  blog:        { priority: '0.8', changefreq: 'weekly' },
  legal:       { priority: '0.3', changefreq: 'yearly' },
};

function routePriority(r) {
  if (r.startsWith('/simulateurs/')) return PRIORITIES.simulateurs;
  if (r.startsWith('/blog'))         return PRIORITIES.blog;
  if (['/mentions-legales', '/politique-de-confidentialite', '/a-propos'].includes(r)) return PRIORITIES.legal;
  return { priority: '0.7', changefreq: 'monthly' };
}

const distDir = path.resolve(__dirname, '../dist');
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// ── HTML statiques ─────────────────────────────────────────────────────────────
for (const route of ROUTES) {
  const dir = path.join(distDir, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);
}

// ── Sitemap.xml (regénéré à chaque build) ─────────────────────────────────────
const allRoutes = ['/', ...ROUTES];
const urls = allRoutes.map(r => {
  const { priority, changefreq } = routePriority(r);
  return `  <url>
    <loc>${BASE}${r}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);

console.log(`✓ Généré ${ROUTES.length} fichiers HTML statiques`);
console.log(`✓ Sitemap.xml mis à jour (${allRoutes.length} URLs, lastmod ${TODAY})`);
