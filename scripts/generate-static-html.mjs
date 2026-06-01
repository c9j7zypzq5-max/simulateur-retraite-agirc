import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE      = 'https://www.mesimulateurs.fr';
const TODAY     = new Date().toISOString().slice(0, 10);

// ── Méta par route ─────────────────────────────────────────────────────────────
const ROUTE_META = {
  '/':                                    { title: 'mesimulateurs.fr — 16 simulateurs gratuits', emoji: '📊', cat: '',          prio: '1.0', freq: 'weekly'  },
  '/simulateurs/agirc-arrco':             { title: 'Simulateur Agirc-Arrco 2026',                emoji: '🏆', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/cnav':                    { title: 'Simulateur CNAV — Régime général',            emoji: '🏛', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/fonction-publique':       { title: 'Simulateur Retraite Fonction publique',       emoji: '⚖️', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/independants':            { title: 'Simulateur Retraite Indépendants / TNS',      emoji: '💼', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/ircantec':                { title: 'Simulateur IRCANTEC',                         emoji: '🏢', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/retraite-progressive':    { title: 'Simulateur Retraite progressive',             emoji: '📅', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/cnavpl':                  { title: 'Simulateur Professions libérales',            emoji: '👨‍⚕️', cat: 'Retraite', prio: '0.9', freq: 'monthly' },
  '/simulateurs/msa':                     { title: 'Simulateur Retraite agricole MSA',            emoji: '🌾', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/emprunt-immobilier':      { title: 'Simulateur Emprunt immobilier',              emoji: '🏠', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  '/simulateurs/rendement-locatif':       { title: 'Simulateur Rendement locatif',               emoji: '📊', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  '/simulateurs/impot-revenu':            { title: 'Simulateur Impôt sur le revenu 2026',        emoji: '📋', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/plus-value-immobiliere':  { title: 'Simulateur Plus-value immobilière',          emoji: '📈', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/budget':                  { title: 'Simulateur Budget 50/30/20',                 emoji: '📊', cat: 'Budget',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/salaire':                 { title: 'Simulateur Salaire Net/Brut',                emoji: '💼', cat: 'Finances',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/epargne':                 { title: 'Simulateur Épargne & intérêts composés',     emoji: '💰', cat: 'Finances',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/fire':                    { title: 'Simulateur FIRE — Indépendance financière',  emoji: '🔥', cat: 'FIRE',       prio: '0.9', freq: 'monthly' },
  '/simulateurs/patrimoine':              { title: 'Simulateur Patrimoine global 2026',           emoji: '💎', cat: 'Finances',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/cout-en-heures':          { title: 'Simulateur Prix en heures de vie',           emoji: '⏰', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/vie-en-semaines':         { title: 'Simulateur Ma vie en semaines',              emoji: '📅', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/ptz':                     { title: 'Simulateur PTZ',                             emoji: '🏡', cat: 'Immobilier', prio: '0.8', freq: 'monthly' },
  '/simulateurs/per':                     { title: 'Simulateur PER',                             emoji: '💼', cat: 'Retraite',   prio: '0.8', freq: 'monthly' },
  '/blog':                                { title: 'Blog — Finances personnelles',               emoji: '📰', cat: '',          prio: '0.8', freq: 'weekly'  },
  '/a-propos':                            { title: 'À propos — mesimulateurs.fr',                emoji: '📊', cat: '',          prio: '0.3', freq: 'yearly'  },
  '/mentions-legales':                    { title: 'Mentions légales',                           emoji: '📊', cat: '',          prio: '0.2', freq: 'yearly'  },
  '/politique-de-confidentialite':        { title: 'Politique de confidentialité',               emoji: '📊', cat: '',          prio: '0.2', freq: 'yearly'  },
};

const BLOG_SLUGS = [
  '/blog/comment-calculer-retraite-2025',
  '/blog/fire-france-independance-financiere',
  '/blog/simuler-emprunt-immobilier',
];

const ROUTES = [
  ...Object.keys(ROUTE_META).filter(r => r !== '/'),
  ...BLOG_SLUGS,
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function patchHtml(html, route) {
  const meta = ROUTE_META[route] || { title: 'mesimulateurs.fr' };
  const ogImg = `${BASE}/og-image.svg`;
  return html
    .replace(/content="\/og-image\.png"/g, `content="${ogImg}"`)
    .replace(/content="\/og-image\.svg"/g, `content="${ogImg}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
}

// ── Main ───────────────────────────────────────────────────────────────────────
const distDir  = path.resolve(__dirname, '../dist');
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// HTML statiques
for (const route of ROUTES) {
  const dir  = path.join(distDir, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), patchHtml(indexHtml, route));
}

// Sitemap.xml
const allRoutes = ['/', ...ROUTES.filter(r => !BLOG_SLUGS.includes(r))];
const urls = allRoutes.map(r => {
  const m = ROUTE_META[r] || { prio: '0.5', freq: 'monthly' };
  return `  <url>
    <loc>${BASE}${r}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${m.freq}</changefreq>
    <priority>${m.prio}</priority>
  </url>`;
}).join('\n');

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);

console.log(`✓ Généré ${ROUTES.length} fichiers HTML statiques (og:image dynamique par route)`);
console.log(`✓ Sitemap.xml — ${allRoutes.length} URLs, lastmod ${TODAY}`);
