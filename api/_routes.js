// Routes statiques partagées entre le build (scripts/generate-static-html.mjs)
// et l'API sitemap dynamique (api/sitemap.js). Source unique de vérité pour
// éviter toute divergence entre les pages générées et le sitemap.
//
// Préfixe « _ » : Vercel ne traite pas ce fichier comme une route serverless.

import { GLOSSARY, GLOSSARY_BY_SLUG } from '../src/data/glossaire.js';
import { GUIDES, GUIDES_BY_SLUG } from '../src/data/guides.js';
import { COMPARATIFS, COMPARATIFS_BY_SLUG } from '../src/data/comparatifs.js';

export const BASE = 'https://www.simfinly.com';

// Configuration i18n côté build (miroir de src/i18n/config.js). Le français est
// la locale par défaut (servie à la racine) ; l'anglais est préfixé (/en/...).
export const I18N = { defaultLocale: 'fr', locales: ['fr', 'en'] };

// Routes disposant d'une version anglaise (/en/...). Seuls les outils
// « universels » (non spécifiques à la France) sont traduits : les simulateurs
// de retraite, d'impôt, PER, etc. restent en français uniquement. Source unique
// de vérité partagée par le routing React (src/i18n/paths.js), le switcher de
// langue, le prérendu statique, le sitemap et les liens hreflang.
export const EN_ROUTES = [
  '/',
  '/simulateurs/epargne',
  '/simulateurs/fire',
  '/simulateurs/budget',
  '/simulateurs/patrimoine',
  '/simulateurs/cout-en-heures',
  '/simulateurs/vie-en-semaines',
  '/simulateurs/assurance-vie',
  '/simulateurs/rendement-locatif',
  '/simulateurs/emprunt-immobilier',
  '/simulateurs/credit-conso',
  '/simulateurs/comparateur',
  '/outils/qr-code',
  '/mentions-legales',
  '/politique-de-confidentialite',
  '/simulateurs/rente-capital',
  '/simulateurs/inflation',
];

// Méta anglaises (title + description) par route, pour le HTML statique /en/...
export const ROUTE_META_EN = {
  '/':                            { title: 'Free Financial Calculators — Savings, FIRE, Budget | Simfinly', description: 'Free online financial calculators: compound interest, FIRE & financial independence, 50/30/20 budget, net worth and more. Instant results, no sign-up.' },
  '/simulateurs/epargne':         { title: 'Compound Interest Calculator — Savings Growth | Simfinly',       description: 'Project how your savings grow over time with compound interest and regular contributions. See the final balance for any rate, duration and monthly deposit.' },
  '/simulateurs/fire':            { title: 'FIRE Calculator — Financial Independence, Retire Early | Simfinly', description: 'Calculate the net worth you need to live off your investments and the age you reach financial independence. Based on the 4% rule, with Lean/Coast/Fat FIRE milestones.' },
  '/simulateurs/budget':          { title: '50/30/20 Budget Calculator — Needs, Wants, Savings | Simfinly',  description: 'Split your monthly budget with the 50/30/20 rule: needs, wants and savings. See your balance and savings rate in real time, with tailored tips.' },
  '/simulateurs/patrimoine':      { title: 'Net Worth Calculator — Track Your Wealth | Simfinly',            description: 'Consolidate your financial, real-estate and retirement assets to see your net worth and how it breaks down by asset class.' },
  '/simulateurs/cout-en-heures':  { title: 'Cost in Hours of Work Calculator — True Price | Simfinly',       description: 'Turn any purchase into real hours of work. Based on your salary, discover what a product or subscription truly costs in life-time rather than money.' },
  '/simulateurs/vie-en-semaines': { title: 'Your Life in Weeks Calculator — Visualize Your Lifetime | Simfinly', description: 'Visualize your entire life as a grid, one square per week. See the weeks you have lived, the weeks left and the summers ahead. Inspired by Your Life in Weeks.' },
  '/simulateurs/assurance-vie':   { title: 'French Life Insurance Calculator — Capital & Tax | Simfinly', description: 'Project the growth of a French assurance-vie policy and estimate the tax on your gains at withdrawal: the 8-year advantage, allowance, flat tax and social levies.' },
  '/simulateurs/rendement-locatif': { title: 'Rental Yield Calculator — Buy-to-Let Profitability | Simfinly', description: 'Calculate the gross and net yield of a French rental investment: rent, costs, monthly cash flow and return on equity. Instant, free, no sign-up.' },
  '/simulateurs/emprunt-immobilier': { title: 'French Mortgage Calculator — Payment & Capacity | Simfinly', description: 'Work out your monthly payment, debt-to-income ratio and the total cost of a French mortgage. Notary fees, zero-rate loan (PTZ) and amortization schedule included.' },
  '/simulateurs/credit-conso':    { title: 'Personal Loan Calculator — Monthly Payment & Cost | Simfinly',   description: 'Calculate the monthly payment, total cost and total interest of a personal loan from the amount, APR and term. Includes optional insurance and an amortization schedule.' },
  '/simulateurs/comparateur':     { title: 'Asset Comparison Tool — ETFs, Stocks, Crypto | Simfinly',        description: 'Compare the historical performance of ETFs, stocks and cryptocurrencies over any period, from real data. Total return, CAGR, recurring contributions and base-100 index.' },
  '/outils/qr-code':              { title: 'Free Custom QR Code Generator — Color, Logo | Simfinly',         description: 'Create a custom QR code for free: pick the colors, enter any text or link and add your logo or an emoji in the center. High-resolution PNG, no sign-up.' },
  '/simulateurs/rente-capital':   { title: 'Annuity vs Programmed Withdrawal Simulator | Simfinly', description: 'Compare a life annuity and programmed withdrawals for your retirement savings. Monthly net income, break-even point and 20-year cumulative by tax bracket.' },
  '/simulateurs/inflation':       { title: 'Personal Inflation & Purchasing Power Simulator | Simfinly', description: 'Measure how inflation erodes your budget by spending category. Customize rates for food, housing, transport and more — project the impact over 10 to 30 years.' },
  '/mentions-legales':            { title: 'Legal notice — Simfinly',                                        description: 'Legal notice for simfinly.com: publisher, host, intellectual property and liability.' },
  '/politique-de-confidentialite':{ title: 'Privacy policy — Simfinly',                                       description: 'Privacy and cookie policy for simfinly.com: data collected, Google AdSense, GDPR.' },
};

// Méta d'une route pour une locale donnée (EN si dispo, sinon repli FR).
export function routeMeta(route, locale = 'fr') {
  if (locale === 'en' && ROUTE_META_EN[route]) return ROUTE_META_EN[route];
  return ROUTE_META[route];
}

// Liens hreflang d'une route, pour le HTML statique. N'émet des balises que pour
// les routes réellement disponibles en anglais (EN_ROUTES) : Google découvre
// ainsi la version /en correspondante, sans alternate trompeur sur les pages
// françaises uniquement.
export function hreflangLinks(route) {
  if (I18N.locales.length < 2 || !EN_ROUTES.includes(route)) return '';
  const fr = `${BASE}${route === '/' ? '/' : route}`;
  const en = `${BASE}/en${route === '/' ? '' : route}`;
  return [
    `<link rel="alternate" hreflang="fr" href="${fr}" />`,
    `<link rel="alternate" hreflang="en" href="${en}" />`,
    `<link rel="alternate" hreflang="x-default" href="${fr}" />`,
  ].join('\n    ');
}

// Méta par route : title (HTML statique), cat (og:image par catégorie),
// prio / freq (sitemap).
export const ROUTE_META = {
  '/':                                    { title: 'simfinly.com — 25 simulateurs gratuits', emoji: '📊', cat: '',          prio: '1.0', freq: 'weekly'  },
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
  '/simulateurs/retraite-anticipee':      { title: 'Simulateur Retraite anticipée — carrières longues', emoji: '⏩', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/pension-reversion':       { title: 'Simulateur Pension de réversion 2025',        emoji: '💞', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/rente-capital':           { title: 'Simulateur Rente viagère vs retrait programmé', emoji: '⚖️', cat: 'Retraite',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/inflation':               { title: "Simulateur d'inflation & pouvoir d'achat",      emoji: '📈', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/emprunt-immobilier':      { title: 'Simulateur Emprunt immobilier',              emoji: '🏠', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  '/simulateurs/rendement-locatif':       { title: 'Simulateur Rendement locatif',               emoji: '📊', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  '/simulateurs/ptz':                     { title: 'Simulateur PTZ 2025 — Prêt à Taux Zéro',     emoji: '🏡', cat: 'Immobilier', prio: '0.8', freq: 'monthly' },
  '/simulateurs/frais-notaire':           { title: 'Simulateur Frais de notaire 2025',           emoji: '🖋', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  '/simulateurs/impot-revenu':            { title: 'Simulateur Impôt sur le revenu 2026',        emoji: '📋', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/plus-value-immobiliere':  { title: 'Simulateur Plus-value immobilière',          emoji: '📈', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/deficit-foncier':         { title: 'Simulateur Déficit foncier 2025',              emoji: '🏚', cat: 'Impôts',     prio: '0.8', freq: 'monthly' },
  '/simulateurs/budget':                  { title: 'Simulateur Budget 50/30/20',                 emoji: '📊', cat: 'Budget',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/salaire':                 { title: 'Simulateur Salaire Net/Brut',                emoji: '💼', cat: 'Finances',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/epargne':                 { title: 'Simulateur Épargne & intérêts composés',     emoji: '💰', cat: 'Finances',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/fire':                    { title: 'Simulateur FIRE — Indépendance financière',  emoji: '🔥', cat: 'FIRE',       prio: '0.9', freq: 'monthly' },
  '/simulateurs/patrimoine':              { title: 'Simulateur Patrimoine global 2026',           emoji: '💎', cat: 'Finances',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/comparateur':            { title: "Comparateur d'actifs — ETF, actions, crypto",  emoji: '📊', cat: 'Finances',   prio: '0.9', freq: 'weekly'  },
  '/simulateurs/assurance-vie':          { title: 'Simulateur Assurance-vie — fiscalité & rendement', emoji: '🛡️', cat: 'Finances',  prio: '0.8', freq: 'monthly' },
  '/simulateurs/epargne-salariale':      { title: 'Simulateur Épargne salariale — PEE PERCO PERO',  emoji: '🏢', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/donation':               { title: 'Simulateur Donation vs Succession',               emoji: '🎁', cat: 'Impôts',     prio: '0.8', freq: 'monthly' },
  '/simulateurs/credit-conso':           { title: 'Simulateur Crédit à la consommation',         emoji: '💳', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/cout-en-heures':          { title: 'Simulateur Prix en heures de vie',           emoji: '⏰', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/vie-en-semaines':         { title: 'Simulateur Ma vie en semaines',              emoji: '📅', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/outils/qr-code':                      { title: 'Générateur de QR code personnalisé (couleur, logo)', emoji: '🔳', cat: '', prio: '0.7', freq: 'monthly' },
  '/blog':                                { title: 'Blog — Finances personnelles',               emoji: '📰', cat: '',          prio: '0.8', freq: 'weekly'  },
  '/lexique':                             { title: 'Lexique financier — définitions',            emoji: '📖', cat: '',          prio: '0.7', freq: 'monthly' },
  '/guides':                              { title: 'Guides finances personnelles',               emoji: '📚', cat: '',          prio: '0.8', freq: 'monthly' },
  '/comparatifs':                         { title: 'Comparatifs financiers — PER, achat, freelance', emoji: '⚖️', cat: '',          prio: '0.7', freq: 'monthly' },
  '/methodologie':                        { title: 'Méthodologie & sources',                     emoji: '🔬', cat: '',          prio: '0.4', freq: 'yearly'  },
  '/widgets':                             { title: 'Widgets gratuits à intégrer',                emoji: '🧩', cat: '',          prio: '0.5', freq: 'yearly'  },
  '/a-propos':                            { title: 'À propos — simfinly.com',                emoji: '📊', cat: '',          prio: '0.3', freq: 'yearly'  },
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

// Pages comparatives (/comparatifs/:slug) : pré-rendues au build et incluses au sitemap.
export const COMPARATIFS_SLUGS = COMPARATIFS.map(c => `/comparatifs/${c.slug}`);

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
        author: { '@type': 'Organization', name: 'simfinly.com', url: BASE },
        publisher: { '@type': 'Organization', name: 'simfinly.com', logo: { '@type': 'ImageObject', url: `${BASE}/logo-mark.svg` } },
      },
    ];
  }

  // Page comparative → fil d'Ariane + Article
  if (route.startsWith('/comparatifs/')) {
    const c = COMPARATIFS_BY_SLUG[route.slice('/comparatifs/'.length)];
    if (!c) return [];
    return [
      breadcrumb([['Accueil', `${BASE}/`], ['Comparatifs', `${BASE}/comparatifs`], [c.shortTitle, url]]),
      {
        '@context': 'https://schema.org', '@type': 'Article',
        headline: c.title, description: c.intro, url, mainEntityOfPage: url,
        author: { '@type': 'Organization', name: 'simfinly.com', url: BASE },
        publisher: { '@type': 'Organization', name: 'simfinly.com', logo: { '@type': 'ImageObject', url: `${BASE}/logo-mark.svg` } },
      },
    ];
  }

  // Article de blog → Article
  if (route.startsWith('/blog/')) {
    if (!extra.title) return [];
    const article = {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: extra.title, description: extra.description || '', url, mainEntityOfPage: url,
      author: { '@type': 'Organization', name: 'simfinly.com', url: BASE },
      publisher: { '@type': 'Organization', name: 'simfinly.com', logo: { '@type': 'ImageObject', url: `${BASE}/logo-mark.svg` } },
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
