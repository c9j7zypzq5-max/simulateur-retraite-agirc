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

// Routes disponibles en version anglaise (/en/...).
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

// Routes disponibles sous /ch/ (Suisse). Miroir de src/i18n/paths.js CH_ROUTES.
export const CH_ROUTES = [
  '/',
  '/simulateurs/lpp-deuxieme-pilier',
  '/simulateurs/impot-revenu-ch',
  '/simulateurs/prevoyance-ch',
  '/simulateurs/epargne',
  '/simulateurs/fire',
  '/simulateurs/budget',
  '/simulateurs/patrimoine',
  '/simulateurs/comparateur',
  '/simulateurs/credit-conso',
  '/simulateurs/cout-en-heures',
  '/simulateurs/vie-en-semaines',
  '/simulateurs/emprunt-immobilier',
  '/simulateurs/rendement-locatif',
  '/simulateurs/assurance-vie',
  '/simulateurs/rente-capital',
  '/simulateurs/inflation',
  '/mentions-legales',
  '/politique-de-confidentialite',
];

// Routes disponibles sous /be/ (Belgique). Miroir de src/i18n/paths.js BE_ROUTES.
export const BE_ROUTES = [
  '/',
  '/simulateurs/epargne',
  '/simulateurs/fire',
  '/simulateurs/budget',
  '/simulateurs/patrimoine',
  '/simulateurs/comparateur',
  '/simulateurs/cout-en-heures',
  '/simulateurs/credit-conso',
  '/simulateurs/emprunt-immobilier',
  '/simulateurs/rendement-locatif',
  '/simulateurs/assurance-vie',
  '/simulateurs/impot-revenu',
  '/simulateurs/succession',
  '/simulateurs/pension-legale',
  '/mentions-legales',
  '/politique-de-confidentialite',
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
  '/simulateurs/emprunt-immobilier': { title: 'Mortgage Calculator — Monthly Payment & Borrowing Capacity | Simfinly', description: 'Work out your monthly payment, debt-to-income ratio and the total cost of a mortgage. Amortization schedule and total interest included.' },
  '/simulateurs/credit-conso':    { title: 'Personal Loan Calculator — Monthly Payment & Cost | Simfinly',   description: 'Calculate the monthly payment, total cost and total interest of a personal loan from the amount, APR and term. Includes optional insurance and an amortization schedule.' },
  '/simulateurs/comparateur':     { title: 'Asset Comparison Tool — ETFs, Stocks, Crypto | Simfinly',        description: 'Compare the historical performance of ETFs, stocks and cryptocurrencies over any period, from real data. Total return, CAGR, recurring contributions and base-100 index.' },
  '/outils/qr-code':              { title: 'Free Custom QR Code Generator — Color, Logo | Simfinly',         description: 'Create a custom QR code for free: pick the colors, enter any text or link and add your logo or an emoji in the center. High-resolution PNG, no sign-up.' },
  '/simulateurs/rente-capital':   { title: 'Annuity vs Programmed Withdrawal Simulator | Simfinly', description: 'Compare a life annuity and programmed withdrawals for your retirement savings. Monthly net income, break-even point and 20-year cumulative by tax bracket.' },
  '/simulateurs/inflation':       { title: 'Personal Inflation & Purchasing Power Simulator | Simfinly', description: 'Measure how inflation erodes your budget by spending category. Customize rates for food, housing, transport and more — project the impact over 10 to 30 years.' },
  '/mentions-legales':            { title: 'Legal notice — Simfinly',                                        description: 'Legal notice for simfinly.com: publisher, host, intellectual property and liability.' },
  '/politique-de-confidentialite':{ title: 'Privacy policy — Simfinly',                                       description: 'Privacy and cookie policy for simfinly.com: data collected, Google AdSense, GDPR.' },
};

// Méta suisses (title + description) pour le HTML statique /ch/...
export const ROUTE_META_CH = {
  '/': { title: 'Simfinly — Simulateurs gratuits LPP, pilier 3a, fiscalité & finances (Suisse)', description: 'Simulez votre 2e pilier LPP, votre pilier 3a, votre impôt cantonal et votre épargne. Simulateurs gratuits adaptés au droit suisse, sans inscription.' },
};

// Méta belges (title + description) pour le HTML statique /be/...
export const ROUTE_META_BE = {
  '/': { title: 'Simfinly — Simulateurs gratuits pension, IPP, succession & finances (Belgique)', description: 'Simulez votre pension légale ONSS, votre IPP, vos droits de succession et votre épargne. Simulateurs gratuits adaptés à la législation belge 2025, sans inscription.' },
};

// Méta d'une route pour une locale et un pays donnés.
export function routeMeta(route, locale = 'fr', country = 'fr') {
  if (locale === 'en' && ROUTE_META_EN[route]) return ROUTE_META_EN[route];
  if (country === 'ch' && ROUTE_META_CH[route]) return ROUTE_META_CH[route];
  if (country === 'be' && ROUTE_META_BE[route]) return ROUTE_META_BE[route];
  return ROUTE_META[route];
}

// Liens hreflang d'une route pour le HTML statique.
// Émet toutes les variantes disponibles (fr, en, fr-CH, fr-BE, x-default) afin
// que Google comprenne le maillage international sans exécuter JavaScript.
export function hreflangLinks(route) {
  const links = [];
  const fr = `${BASE}${route === '/' ? '/' : route}`;
  links.push(`<link rel="alternate" hreflang="fr" href="${fr}" />`);
  if (EN_ROUTES.includes(route)) {
    links.push(`<link rel="alternate" hreflang="en" href="${BASE}/en${route === '/' ? '' : route}" />`);
  }
  if (CH_ROUTES.includes(route)) {
    links.push(`<link rel="alternate" hreflang="fr-CH" href="${BASE}/ch${route === '/' ? '' : route}" />`);
  }
  if (BE_ROUTES.includes(route)) {
    links.push(`<link rel="alternate" hreflang="fr-BE" href="${BASE}/be${route === '/' ? '' : route}" />`);
  }
  links.push(`<link rel="alternate" hreflang="x-default" href="${fr}" />`);
  // Inutile si seulement fr + x-default (même URL = balisage inutile)
  if (links.length <= 2) return '';
  return links.join('\n    ');
}

// Méta par route : title (HTML statique), cat (og:image par catégorie),
// prio / freq (sitemap).
export const ROUTE_META = {
  '/':                                    { title: 'simfinly.com — 35+ simulateurs gratuits retraite, immobilier, finances', emoji: '📊', cat: '',          prio: '1.0', freq: 'weekly'  },
  // Retraite
  '/simulateurs/agirc-arrco':             { title: 'Simulateur retraite Agirc-Arrco 2026 — points & pension nette',         emoji: '🏆', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/cnav':                    { title: 'Simulateur CNAV 2026 — régime général retraite de base',                emoji: '🏛', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/fonction-publique':       { title: 'Simulateur retraite Fonction publique 2026',                           emoji: '⚖️', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/independants':            { title: 'Simulateur retraite Indépendants & TNS 2026 — SSI + RCI',              emoji: '💼', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/ircantec':                { title: 'Simulateur IRCANTEC — agents non-titulaires de la fonction publique',  emoji: '🏢', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/retraite-progressive':    { title: 'Simulateur retraite progressive — mi-temps & pension partielle',       emoji: '📅', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/cnavpl':                  { title: 'Simulateur retraite professions libérales CIPAV 2026',                 emoji: '👨‍⚕️', cat: 'Retraite', prio: '0.9', freq: 'monthly' },
  '/simulateurs/msa':                     { title: 'Simulateur retraite agricole MSA — exploitants & salariés',            emoji: '🌾', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/per':                     { title: 'Simulateur PER 2026 — déduction fiscale & capital projeté',            emoji: '💼', cat: 'Retraite',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/synthese-retraite':       { title: 'Simulateur synthèse retraite tous régimes — pension totale 2026',      emoji: '🧮', cat: 'Retraite',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/retraite-anticipee':      { title: 'Simulateur retraite anticipée 2026 — carrières longues & conditions',  emoji: '⏩', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/pension-reversion':       { title: 'Simulateur pension de réversion 2026 — CNAV + Agirc-Arrco',           emoji: '💞', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/rente-capital':           { title: 'Simulateur rente viagère vs retrait programmé — retraite PER',         emoji: '⚖️', cat: 'Retraite',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/comparaison-reforme':     { title: 'Simulateur réforme retraite 2023 — comparaison avant/après',          emoji: '📊', cat: 'Retraite',   prio: '0.7', freq: 'monthly' },
  // Simulateurs Suisse
  '/simulateurs/lpp-deuxieme-pilier':     { title: 'Simulateur LPP 2e pilier Suisse 2025 — avoir & rente projetés',        emoji: '🏦', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/impot-revenu-ch':         { title: 'Simulateur impôt revenu Suisse — fédéral + cantonal 2025',             emoji: '📋', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/prevoyance-ch':           { title: 'Simulateur pilier 3a Suisse — capital & déduction fiscale 2025',       emoji: '🏦', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  // Immobilier
  '/simulateurs/emprunt-immobilier':      { title: 'Simulateur emprunt immobilier — mensualités, capacité, TAEG',          emoji: '🏠', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  '/simulateurs/rendement-locatif':       { title: 'Simulateur rendement locatif — rentabilité brute & nette',             emoji: '📊', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  '/simulateurs/ptz':                     { title: 'Simulateur PTZ 2026 — prêt à taux zéro primo-accédant',               emoji: '🏡', cat: 'Immobilier', prio: '0.8', freq: 'monthly' },
  '/simulateurs/frais-notaire':           { title: 'Simulateur frais de notaire 2026 — acquisition immobilière',           emoji: '🖋', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  // Impôts
  '/simulateurs/impot-revenu':            { title: 'Simulateur impôt sur le revenu 2026 — TMI & taux moyen',               emoji: '📋', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/plus-value-immobiliere':  { title: 'Simulateur plus-value immobilière — abattements & imposition',         emoji: '📈', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/deficit-foncier':         { title: 'Simulateur déficit foncier 2026 — économie impôt travaux',             emoji: '🏚', cat: 'Impôts',     prio: '0.8', freq: 'monthly' },
  '/simulateurs/succession':              { title: 'Simulateur droits de succession 2026 — barème officiel',               emoji: '🎁', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/donation':                { title: 'Simulateur donation vs succession — optimisation fiscale',              emoji: '🎁', cat: 'Impôts',     prio: '0.8', freq: 'monthly' },
  // Finances
  '/simulateurs/inflation':               { title: "Simulateur inflation & pouvoir d'achat personnalisé 2026",             emoji: '📈', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/budget':                  { title: 'Simulateur budget 50/30/20 — répartition & taux d\'épargne',           emoji: '📊', cat: 'Budget',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/salaire':                 { title: 'Simulateur salaire net/brut 2026 — évolution de carrière',             emoji: '💼', cat: 'Finances',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/epargne':                 { title: 'Simulateur épargne & intérêts composés — projection long terme',       emoji: '💰', cat: 'Finances',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/fire':                    { title: 'Simulateur FIRE — indépendance financière & retraite anticipée',       emoji: '🔥', cat: 'FIRE',       prio: '0.9', freq: 'monthly' },
  '/simulateurs/patrimoine':              { title: 'Simulateur patrimoine global 2026 — richesse nette & répartition',     emoji: '💎', cat: 'Finances',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/comparateur':             { title: "Comparateur d'actifs — ETF, actions, crypto : performance historique", emoji: '📊', cat: 'Finances',   prio: '0.9', freq: 'weekly'  },
  '/simulateurs/assurance-vie':           { title: 'Simulateur assurance-vie — rendement & fiscalité au rachat',           emoji: '🛡️', cat: 'Finances',  prio: '0.8', freq: 'monthly' },
  '/simulateurs/epargne-salariale':       { title: 'Simulateur épargne salariale PEE PERCO PERO — gain fiscal',            emoji: '🏢', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/credit-conso':            { title: 'Simulateur crédit à la consommation — mensualité & coût total',        emoji: '💳', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/freelance-vs-salarie':    { title: 'Simulateur freelance vs salarié — revenus nets comparés 2026',         emoji: '💼', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  // Patrimoine & Juridique
  '/simulateurs/divorce':                 { title: 'Simulateur divorce & partage de patrimoine — prestation compensatoire', emoji: '⚖️', cat: 'Patrimoine', prio: '0.7', freq: 'monthly' },
  // Simulateurs BE-spécifiques
  '/simulateurs/pension-legale':          { title: 'Simulateur pension légale Belgique (ONSS) 2025 — salarié & indépendant', emoji: '🏦', cat: 'Retraite',  prio: '0.9', freq: 'monthly' },
  // Vie & Temps
  '/simulateurs/cout-en-heures':          { title: 'Simulateur prix en heures de vie — vrai coût d\'un achat',             emoji: '⏰', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/vie-en-semaines':         { title: 'Simulateur ma vie en semaines — visualiser son temps',                 emoji: '📅', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/outils/qr-code':                      { title: 'Générateur de QR code personnalisé — couleur, logo, texte libre',      emoji: '🔳', cat: '', prio: '0.7', freq: 'monthly' },
  // Contenu éditorial
  '/blog':                                { title: 'Blog finances personnelles — retraite, immobilier, épargne, FIRE',     emoji: '📰', cat: '',          prio: '0.8', freq: 'weekly'  },
  '/lexique':                             { title: 'Lexique financier — définitions TAEG, PER, TMI, FIRE…',               emoji: '📖', cat: '',          prio: '0.7', freq: 'monthly' },
  '/guides':                              { title: 'Guides finances personnelles — retraite, immobilier, épargne',         emoji: '📚', cat: '',          prio: '0.8', freq: 'monthly' },
  '/comparatifs':                         { title: 'Comparatifs financiers — PER, achat vs location, freelance',          emoji: '⚖️', cat: '',          prio: '0.7', freq: 'monthly' },
  '/methodologie':                        { title: 'Méthodologie & sources — calculs simfinly.com',                        emoji: '🔬', cat: '',          prio: '0.4', freq: 'yearly'  },
  '/widgets':                             { title: 'Widgets gratuits à intégrer — simulateurs embarquables',               emoji: '🧩', cat: '',          prio: '0.5', freq: 'yearly'  },
  '/a-propos':                            { title: 'À propos — simfinly.com',                                             emoji: '📊', cat: '',          prio: '0.3', freq: 'yearly'  },
  '/mentions-legales':                    { title: 'Mentions légales — simfinly.com',                                      emoji: '📊', cat: '',          prio: '0.2', freq: 'yearly'  },
  '/politique-de-confidentialite':        { title: 'Politique de confidentialité — simfinly.com',                         emoji: '📊', cat: '',          prio: '0.2', freq: 'yearly'  },
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
