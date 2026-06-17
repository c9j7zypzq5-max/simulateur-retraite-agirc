// Routes statiques partagées entre le build (scripts/generate-static-html.mjs)
// et l'API sitemap dynamique (api/sitemap.js). Source unique de vérité pour
// éviter toute divergence entre les pages générées et le sitemap.
//
// Préfixe « _ » : Vercel ne traite pas ce fichier comme une route serverless.

import { GLOSSARY, GLOSSARY_BY_SLUG } from '../src/data/glossaire.js';
import { GUIDES, GUIDES_BY_SLUG } from '../src/data/guides.js';

export const BASE = 'https://www.mesimulateurs.fr';

// Configuration i18n côté build (miroir de src/i18n/config.js). Le français est
// la locale par défaut (servie à la racine) ; les autres langues seraient
// préfixées (/en/...).
export const I18N = { defaultLocale: 'fr', locales: ['fr'] };

// Liens hreflang d'une route, pour le HTML statique. DORMANT tant qu'une seule
// langue est active (renvoie '') : aucun effet sur le site actuel. Dès qu'une 2e
// locale est ajoutée à I18N.locales, les balises <link rel="alternate"> sont
// émises automatiquement (une par locale + x-default).
export function hreflangLinks(route) {
  if (I18N.locales.length < 2) return '';
  const href = (loc) => `${BASE}${loc === I18N.defaultLocale ? '' : '/' + loc}${route}`;
  const tags = I18N.locales.map(
    (loc) => `<link rel="alternate" hreflang="${loc}" href="${href(loc)}" />`
  );
  tags.push(`<link rel="alternate" hreflang="x-default" href="${href(I18N.defaultLocale)}" />`);
  return tags.join('\n    ');
}

// Méta par route : title (HTML statique), cat (og:image par catégorie),
// prio / freq (sitemap).
export const ROUTE_META = {
  '/':                                    { title: 'mesimulateurs.fr — 25 simulateurs gratuits', emoji: '📊', cat: '',          prio: '1.0', freq: 'weekly'  },
  '/simulateurs/agirc-arrco':             { title: 'Simulateur Agirc-Arrco 2026',                emoji: '🏆', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/cnav':                    { title: 'Simulateur CNAV — Régime général',            emoji: '🏛', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/fonction-publique':       { title: 'Simulateur Retraite Fonction publique',       emoji: '⚖️', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/independants':            { title: 'Simulateur Retraite Indépendants / TNS',      emoji: '💼', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/ircantec':                { title: 'Simulateur IRCANTEC',                         emoji: '🏢', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/retraite-progressive':    { title: 'Simulateur Retraite progressive',             emoji: '📅', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/cnavpl':                  { title: 'Simulateur Professions libérales',            emoji: '👨‍⚕️', cat: 'Retraite', prio: '0.9', freq: 'monthly' },
  '/simulateurs/msa':                     { title: 'Simulateur Retraite agricole MSA',            emoji: '🌾', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/per':                     { title: 'Simulateur PER 2025 — Plan Épargne Retraite', emoji: '💼', cat: 'Retraite',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/synthese-retraite':       { title: 'Synthèse retraite tous régimes — pension totale', emoji: '🧮', cat: 'Retraite',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/emprunt-immobilier':      { title: 'Simulateur Emprunt immobilier',              emoji: '🏠', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  '/simulateurs/rendement-locatif':       { title: 'Simulateur Rendement locatif',               emoji: '📊', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  '/simulateurs/ptz':                     { title: 'Simulateur PTZ 2025 — Prêt à Taux Zéro',     emoji: '🏡', cat: 'Immobilier', prio: '0.8', freq: 'monthly' },
  '/simulateurs/impot-revenu':            { title: 'Simulateur Impôt sur le revenu 2026',        emoji: '📋', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/plus-value-immobiliere':  { title: 'Simulateur Plus-value immobilière',          emoji: '📈', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/budget':                  { title: 'Simulateur Budget 50/30/20',                 emoji: '📊', cat: 'Budget',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/salaire':                 { title: 'Simulateur Salaire Net/Brut',                emoji: '💼', cat: 'Finances',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/epargne':                 { title: 'Simulateur Épargne & intérêts composés',     emoji: '💰', cat: 'Finances',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/fire':                    { title: 'Simulateur FIRE — Indépendance financière',  emoji: '🔥', cat: 'FIRE',       prio: '0.9', freq: 'monthly' },
  '/simulateurs/patrimoine':              { title: 'Simulateur Patrimoine global 2026',           emoji: '💎', cat: 'Finances',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/comparateur':            { title: "Comparateur d'actifs — ETF, actions, crypto",  emoji: '📊', cat: 'Finances',   prio: '0.9', freq: 'weekly'  },
  '/simulateurs/assurance-vie':          { title: 'Simulateur Assurance-vie — fiscalité & rendement', emoji: '🛡️', cat: 'Finances',  prio: '0.8', freq: 'monthly' },
  '/simulateurs/credit-conso':           { title: 'Simulateur Crédit à la consommation',         emoji: '💳', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/cout-en-heures':          { title: 'Simulateur Prix en heures de vie',           emoji: '⏰', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/vie-en-semaines':         { title: 'Simulateur Ma vie en semaines',              emoji: '📅', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/blog':                                { title: 'Blog — Finances personnelles',               emoji: '📰', cat: '',          prio: '0.8', freq: 'weekly'  },
  '/lexique':                             { title: 'Lexique financier — définitions',            emoji: '📖', cat: '',          prio: '0.7', freq: 'monthly' },
  '/guides':                              { title: 'Guides finances personnelles',               emoji: '📚', cat: '',          prio: '0.8', freq: 'monthly' },
  '/methodologie':                        { title: 'Méthodologie & sources',                     emoji: '🔬', cat: '',          prio: '0.4', freq: 'yearly'  },
  '/widgets':                             { title: 'Widgets gratuits à intégrer',                emoji: '🧩', cat: '',          prio: '0.5', freq: 'yearly'  },
  '/a-propos':                            { title: 'À propos — mesimulateurs.fr',                emoji: '📊', cat: '',          prio: '0.3', freq: 'yearly'  },
  '/mentions-legales':                    { title: 'Mentions légales',                           emoji: '📊', cat: '',          prio: '0.2', freq: 'yearly'  },
  '/politique-de-confidentialite':        { title: 'Politique de confidentialité',               emoji: '📊', cat: '',          prio: '0.2', freq: 'yearly'  },
};

// Slugs de blog de secours : utilisés pour générer les HTML statiques au build
// et comme fallback du sitemap si Redis est indisponible.
export const BLOG_SLUGS = [
  '/blog/comment-calculer-retraite-2025',
  '/blog/fire-france-independance-financiere',
  '/blog/simuler-emprunt-immobilier',
  '/blog/reforme-retraites-suspension-2026',
  '/blog/bareme-impot-revenu-2026',
  '/blog/epargne-reglementee-2026-livret-a-lep',
  '/blog/ptz-2026-elargi-tout-le-territoire',
  '/blog/assurance-vie-2026-fonds-euros-fiscalite',
  '/blog/per-2026-plafonds-deduction-nouveautes',
];

// Fiches du lexique (/lexique/:slug) : pré-rendues au build et incluses au sitemap.
export const LEXIQUE_SLUGS = GLOSSARY.map(t => `/lexique/${t.slug}`);

// Guides thématiques (/guides/:slug) : pré-rendus au build et inclus au sitemap.
export const GUIDES_SLUGS = GUIDES.map(g => `/guides/${g.slug}`);

// og:image par catégorie (différenciation des aperçus de partage social).
// PNG (pas SVG) : c'est le format réellement rendu par Facebook/LinkedIn/X.
// Régénérables depuis les SVG via : node scripts/generate-og-png.mjs
export const OG_IMAGE_BY_CAT = {
  Retraite:   '/og-retraite.png',
  Immobilier: '/og-immobilier.png',
  Impôts:     '/og-impots.png',
  Finances:   '/og-finances.png',
  FIRE:       '/og-finances.png',
  Budget:     '/og-finances.png',
};
export const OG_IMAGE_DEFAULT = '/og-image.png';

export function ogImageForRoute(route) {
  const meta = ROUTE_META[route];
  return (meta && OG_IMAGE_BY_CAT[meta.cat]) || OG_IMAGE_DEFAULT;
}

// Fil d'Ariane schema.org à partir d'une liste [nom, url].
function breadcrumb(items) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
  };
}

// Données structurées schema.org injectées EN DUR dans le <head> du HTML statique
// au build (fiables sans exécution JS, contrairement aux blocs <JsonLd> rendus par
// React). BreadcrumbList partout + WebApplication (simulateurs), DefinedTerm
// (lexique) et Article (blog). `extra` porte les métadonnées blog (titre, intro…).
export function structuredData(route, extra = {}) {
  const url = `${BASE}${route}`;

  // Fiche du lexique → DefinedTerm
  if (route.startsWith('/lexique/')) {
    const t = GLOSSARY_BY_SLUG[route.slice('/lexique/'.length)];
    if (!t) return [];
    return [
      breadcrumb([['Accueil', `${BASE}/`], ['Lexique', `${BASE}/lexique`], [t.term, url]]),
      {
        '@context': 'https://schema.org', '@type': 'DefinedTerm',
        name: t.term, alternateName: t.full, description: t.short, url,
        inDefinedTermSet: `${BASE}/lexique`,
      },
    ];
  }

  // Guide thématique → fil d'Ariane + Article
  if (route.startsWith('/guides/')) {
    const g = GUIDES_BY_SLUG[route.slice('/guides/'.length)];
    if (!g) return [];
    return [
      breadcrumb([['Accueil', `${BASE}/`], ['Guides', `${BASE}/guides`], [g.title, url]]),
      {
        '@context': 'https://schema.org', '@type': 'Article',
        headline: g.title, description: g.intro, url, mainEntityOfPage: url,
        author: { '@type': 'Organization', name: 'mesimulateurs.fr', url: BASE },
        publisher: { '@type': 'Organization', name: 'mesimulateurs.fr', logo: { '@type': 'ImageObject', url: `${BASE}/logo-mark.svg` } },
      },
    ];
  }

  // Article de blog → Article
  if (route.startsWith('/blog/')) {
    if (!extra.title) return [];
    const article = {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: extra.title, description: extra.description || '', url, mainEntityOfPage: url,
      author: { '@type': 'Organization', name: 'mesimulateurs.fr', url: BASE },
      publisher: { '@type': 'Organization', name: 'mesimulateurs.fr', logo: { '@type': 'ImageObject', url: `${BASE}/logo-mark.svg` } },
    };
    if (extra.publishedAt) { article.datePublished = extra.publishedAt; article.dateModified = extra.dateModified || extra.publishedAt; }
    if (extra.image) article.image = extra.image;
    if (extra.content) article.articleBody = String(extra.content).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return [
      breadcrumb([['Accueil', `${BASE}/`], ['Blog', `${BASE}/blog`], [extra.title, url]]),
      article,
    ];
  }

  const meta = ROUTE_META[route];
  if (!meta || route === '/') return [];
  const out = [breadcrumb([['Accueil', `${BASE}/`], [meta.title, url]])];
  if (route.startsWith('/simulateurs/')) {
    out.push({
      '@context': 'https://schema.org', '@type': 'WebApplication',
      name: meta.title, url,
      applicationCategory: 'FinanceApplication', operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      inLanguage: 'fr-FR',
    });
  }
  return out;
}

export function structuredDataScripts(route, extra = {}) {
  return structuredData(route, extra)
    .map(d => `<script type="application/ld+json">${JSON.stringify(d)}</script>`)
    .join('\n    ');
}
