// Routes statiques partagées entre le build (scripts/generate-static-html.mjs)
// et l'API sitemap dynamique (api/sitemap.js). Source unique de vérité pour
// éviter toute divergence entre les pages générées et le sitemap.
//
// Préfixe « _ » : Vercel ne traite pas ce fichier comme une route serverless.

import { GLOSSARY, GLOSSARY_BY_SLUG } from '../src/data/glossaire.js';
import { GUIDES, GUIDES_BY_SLUG } from '../src/data/guides.js';
import { COMPARATIFS, COMPARATIFS_BY_SLUG } from '../src/data/comparatifs.js';
import { FAQS } from '../src/data/faqs.js';
import { SEO_CONTENT } from './_seo.js';

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
  '/simulateurs/cnav',
  '/simulateurs/retraite-luxembourg',
  '/comparatifs',
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
  '/simulateurs/succession-ch',
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
  '/simulateurs/cnav':            { title: 'French State Pension Calculator (CNAV) 2026 — Estimate Your Retirement', description: 'Calculate your French state pension (régime général CNAV): quarters, average salary, departure age, pro-rata. Useful for expatriates and cross-border workers.' },
  '/simulateurs/retraite-luxembourg': { title: 'Luxembourg State Pension Calculator (CNAP) 2025 — Estimate Your Pension', description: 'Estimate your Luxembourg CNAP pension based on your career length, salary and departure age. Also covers cross-border workers and expats.' },
  '/comparatifs': { title: 'Financial Comparisons — PER vs Life Insurance, Buy vs Rent | Simfinly', description: 'Compare French financial products side by side: PER vs assurance-vie, buying vs renting, freelance vs employee. Data-driven comparisons to help you choose.' },
  '/widgets':     { title: 'Free Embeddable Financial Calculators — Widgets | Simfinly', description: 'Embed free financial calculators on your website: compound interest, FIRE, mortgage, budget and French pension. Copy-paste the iframe code.' },
};

// Méta suisses (title + description) pour le HTML statique /ch/...
export const ROUTE_META_CH = {
  '/':                                    { title: 'Simfinly — Simulateurs gratuits LPP, pilier 3a, fiscalité & finances (Suisse)',      description: 'Simulez votre 2e pilier LPP, votre pilier 3a, votre impôt cantonal et votre épargne. Simulateurs gratuits adaptés au droit suisse, sans inscription.' },
  '/simulateurs/lpp-deuxieme-pilier':     { title: 'Simulateur LPP 2e pilier Suisse 2025 — avoir de vieillesse & rente projetés',        description: 'Estimez votre avoir de vieillesse LPP et votre rente du 2e pilier selon votre salaire coordonné, vos années de cotisation et les taux d\'intérêt LPP 2025. Calcul instantané, sans inscription.' },
  '/simulateurs/impot-revenu-ch':         { title: 'Simulateur impôt sur le revenu Suisse 2025 — fédéral + cantonal',                    description: 'Calculez votre impôt fédéral direct et votre impôt cantonal selon votre canton, votre revenu imposable et votre situation familiale. Barèmes 2025 pour tous les cantons suisses.' },
  '/simulateurs/prevoyance-ch':           { title: 'Simulateur pilier 3a Suisse 2025 — capital projeté & déduction fiscale',              description: 'Projetez le capital de votre pilier 3a et estimez l\'économie d\'impôt annuelle. Calcul selon le plafond 2025 (CHF 7 258) et votre tranche cantonale.' },
  '/simulateurs/epargne':                 { title: 'Simulateur épargne & intérêts composés en CHF — projection long terme (Suisse)',      description: 'Projetez la croissance de votre épargne en francs suisses sur le long terme. Capital final selon le rendement, la durée et l\'effort mensuel en CHF.' },
  '/simulateurs/fire':                    { title: 'Simulateur FIRE en CHF — indépendance financière & retraite anticipée (Suisse)',      description: 'Calculez le patrimoine en CHF nécessaire pour vivre de vos investissements et l\'âge auquel vous atteignez l\'indépendance financière en Suisse. Règle des 4 %, paliers Lean/Coast/Fat FIRE.' },
  '/simulateurs/budget':                  { title: 'Simulateur budget 50/30/20 en CHF — finances personnelles Suisse',                   description: 'Répartissez votre budget mensuel en francs suisses selon la règle 50/30/20 : besoins, envies, épargne. Taux d\'épargne et conseils adaptés à votre situation.' },
  '/simulateurs/patrimoine':              { title: 'Simulateur patrimoine global en CHF — richesse nette & répartition (Suisse)',         description: 'Consolidez vos actifs financiers et immobiliers en francs suisses pour visualiser votre richesse nette et sa répartition par classe d\'actifs.' },
  '/simulateurs/emprunt-immobilier':      { title: 'Simulateur emprunt immobilier Suisse — mensualités & capacité en CHF',               description: 'Calculez la mensualité, la capacité d\'emprunt et le coût total de votre crédit immobilier en CHF. Tableau d\'amortissement annuel inclus.' },
  '/simulateurs/rendement-locatif':       { title: 'Simulateur rendement locatif en CHF — rentabilité brute & nette (Suisse)',           description: 'Évaluez la rentabilité brute et nette d\'un investissement locatif en Suisse, en CHF. Cash flow mensuel et retour sur fonds propres.' },
  '/simulateurs/assurance-vie':           { title: 'Simulateur épargne & assurance-vie en CHF — rendement & capital (Suisse)',           description: 'Projetez la croissance de votre épargne en francs suisses et estimez le capital disponible à l\'échéance.' },
  '/simulateurs/rente-capital':           { title: 'Simulateur rente viagère vs retrait programmé en CHF — retraite Suisse',             description: 'Comparez la rente viagère et les retraits programmés pour votre capital retraite en CHF. Revenu mensuel net, point mort et cumulatif 20 ans.' },
  '/simulateurs/inflation':               { title: 'Simulateur inflation & pouvoir d\'achat en CHF — Suisse 2025',                       description: 'Mesurez l\'impact de l\'inflation sur votre budget en francs suisses, par poste de dépense. Érosion du pouvoir d\'achat projetée sur 10 à 30 ans.' },
  '/simulateurs/comparateur':             { title: 'Comparateur d\'actifs ETF, actions, crypto en CHF — performance historique',         description: 'Comparez la performance historique d\'ETF, actions et cryptomonnaies sur la période de votre choix, en CHF. CAGR, versements programmés et indice base 100.' },
  '/simulateurs/credit-conso':            { title: 'Simulateur crédit à la consommation en CHF — mensualité & coût (Suisse)',            description: 'Calculez la mensualité et le coût total de votre crédit conso en francs suisses selon le montant, le TAEG et la durée.' },
  '/simulateurs/cout-en-heures':          { title: 'Simulateur prix en heures de vie en CHF — vrai coût d\'un achat (Suisse)',           description: 'Convertissez n\'importe quel achat en heures de travail réelles, en CHF. Le vrai coût d\'un bien ou d\'un abonnement exprimé en temps.' },
  '/simulateurs/vie-en-semaines':         { title: 'Simulateur ma vie en semaines — visualiser son temps (Suisse)',                      description: 'Visualisez votre vie entière sous forme de grille, une case par semaine. Semaines vécues, semaines restantes et étés encore à venir.' },
};

// Méta belges (title + description) pour le HTML statique /be/...
export const ROUTE_META_BE = {
  '/':                                    { title: 'Simfinly — Simulateurs gratuits pension, IPP, succession & finances (Belgique)',     description: 'Simulez votre pension légale ONSS, votre IPP, vos droits de succession et votre épargne. Simulateurs gratuits adaptés à la législation belge 2025, sans inscription.' },
  '/simulateurs/pension-legale':          { title: 'Simulateur pension légale Belgique ONSS 2025 — salarié & indépendant',              description: 'Estimez votre pension légale belge (ONSS) selon votre carrière, votre statut et votre âge de départ. Calcul selon les barèmes 2025 de la pension de retraite et de survie.' },
  '/simulateurs/impot-revenu':            { title: 'Simulateur IPP 2025 — impôt des personnes physiques Belgique',                      description: 'Calculez votre impôt des personnes physiques (IPP) belge selon votre revenu imposable, votre situation familiale et les barèmes 2025. Estimation nette après déductions.' },
  '/simulateurs/succession':              { title: 'Simulateur droits de succession Belgique 2025 — barème régional',                   description: 'Calculez les droits de succession belges selon la Région (Flandre, Wallonie, Bruxelles), le lien de parenté et l\'actif net. Barèmes 2025 officiels.' },
  '/simulateurs/epargne':                 { title: 'Simulateur épargne & intérêts composés en EUR — projection long terme (Belgique)',  description: 'Projetez la croissance de votre épargne en euros sur le long terme. Capital final selon le rendement, la durée et l\'effort mensuel en EUR.' },
  '/simulateurs/fire':                    { title: 'Simulateur FIRE — indépendance financière & retraite anticipée (Belgique)',         description: 'Calculez le patrimoine nécessaire pour vivre de vos investissements en Belgique et l\'âge auquel vous atteignez l\'indépendance financière. Règle des 4 %, paliers Lean/Coast/Fat FIRE.' },
  '/simulateurs/budget':                  { title: 'Simulateur budget 50/30/20 — finances personnelles Belgique',                      description: 'Répartissez votre budget mensuel selon la règle 50/30/20 : besoins, envies, épargne. Taux d\'épargne et conseils adaptés à la situation belge.' },
  '/simulateurs/patrimoine':              { title: 'Simulateur patrimoine global — richesse nette & répartition (Belgique)',            description: 'Consolidez vos actifs financiers et immobiliers pour visualiser votre richesse nette et sa répartition par classe d\'actifs, en contexte belge.' },
  '/simulateurs/emprunt-immobilier':      { title: 'Simulateur emprunt immobilier Belgique — mensualités & capacité',                  description: 'Calculez la mensualité, la capacité d\'emprunt et le coût total de votre crédit hypothécaire en Belgique. Tableau d\'amortissement annuel inclus.' },
  '/simulateurs/rendement-locatif':       { title: 'Simulateur rendement locatif Belgique — rentabilité brute & nette',                description: 'Évaluez la rentabilité brute et nette d\'un investissement locatif en Belgique. Cash flow mensuel et retour sur fonds propres.' },
  '/simulateurs/assurance-vie':           { title: 'Simulateur épargne-pension & assurance groupe — capital Belgique',                 description: 'Projetez la croissance de votre épargne-pension ou assurance groupe en Belgique et estimez le capital disponible à l\'échéance.' },
  '/simulateurs/rente-capital':           { title: 'Simulateur rente viagère vs retrait programmé — retraite Belgique',                description: 'Comparez la rente viagère et les retraits programmés pour votre capital retraite. Revenu mensuel net, point mort et cumulatif 20 ans.' },
  '/simulateurs/inflation':               { title: 'Simulateur inflation & pouvoir d\'achat — Belgique 2025',                          description: 'Mesurez l\'impact de l\'inflation sur votre budget en euros, par poste de dépense. Érosion du pouvoir d\'achat projetée sur 10 à 30 ans selon l\'indice belge.' },
  '/simulateurs/comparateur':             { title: 'Comparateur d\'actifs ETF, actions, crypto — Belgique',                            description: 'Comparez la performance historique d\'ETF, actions et cryptomonnaies sur la période de votre choix. CAGR, versements programmés et indice base 100.' },
  '/simulateurs/credit-conso':            { title: 'Simulateur crédit à la consommation — mensualité & coût Belgique',                 description: 'Calculez la mensualité et le coût total de votre crédit conso selon le montant, le TAEG et la durée. Adapté au marché belge.' },
  '/simulateurs/cout-en-heures':          { title: 'Simulateur prix en heures de vie — vrai coût d\'un achat (Belgique)',              description: 'Convertissez n\'importe quel achat en heures de travail réelles. Le vrai coût d\'un bien ou d\'un abonnement exprimé en temps plutôt qu\'en euros.' },
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
    // Les comparatifs utilisent /en/comparisons/ (pas /en/comparatifs/)
    let enSeg = route;
    if (route === '/comparatifs') enSeg = '/comparisons';
    else if (route.startsWith('/comparatifs/')) enSeg = route.replace('/comparatifs/', '/comparisons/');
    links.push(`<link rel="alternate" hreflang="en" href="${BASE}/en${enSeg === '/' ? '' : enSeg}" />`);
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
  '/simulateurs/agirc-arrco':             { title: 'Simulateur Agirc-Arrco 2026 — combien de points vaut ma retraite ?',   emoji: '🏆', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/cnav':                    { title: 'Calculer sa retraite de base CNAV 2026 — simulation gratuite',         emoji: '🏛', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/fonction-publique':       { title: 'Simulateur retraite fonctionnaire 2026 — CNRACL, pension nette',      emoji: '⚖️', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/independants':            { title: 'Simulateur retraite indépendant TNS 2026 — SSI + RCI, calcul gratuit', emoji: '💼', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/ircantec':                { title: 'Simulateur IRCANTEC 2026 — agents non-titulaires, pension & points',  emoji: '🏢', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/retraite-progressive':    { title: 'Simulateur retraite progressive 2026 — mi-temps, à quoi ai-je droit ?', emoji: '📅', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/cnavpl':                  { title: 'Simulateur retraite professions libérales CIPAV 2026 — calcul rapide', emoji: '👨‍⚕️', cat: 'Retraite', prio: '0.9', freq: 'monthly' },
  '/simulateurs/msa':                     { title: 'Simulateur retraite agricole MSA 2026 — exploitants, RCO & minimum',  emoji: '🌾', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/per':                     { title: 'Simulateur PER 2026 — économie d\'impôt immédiate & capital à la retraite', emoji: '💼', cat: 'Retraite',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/synthese-retraite':       { title: 'Synthèse retraite tous régimes 2026 — calculez votre pension totale',  emoji: '🧮', cat: 'Retraite',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/retraite-anticipee':      { title: 'Partir à la retraite avant 64 ans en 2026 — carrières longues & conditions', emoji: '⏩', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/pension-reversion':       { title: 'Simulateur pension de réversion 2026 — à combien ai-je droit ?',      emoji: '💞', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/rente-capital':           { title: 'Rente viagère vs retrait programmé 2026 — que choisir à la retraite ?', emoji: '⚖️', cat: 'Retraite',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/comparaison-reforme':     { title: 'Réforme retraite 2023 — quel impact sur votre pension ? Simulation',  emoji: '📊', cat: 'Retraite',   prio: '0.7', freq: 'monthly' },
  // Simulateurs Suisse
  '/simulateurs/lpp-deuxieme-pilier':     { title: 'Simulateur LPP 2e pilier Suisse 2025 — avoir & rente projetés',        emoji: '🏦', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/impot-revenu-ch':         { title: 'Simulateur impôt revenu Suisse — fédéral + cantonal 2025',             emoji: '📋', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/prevoyance-ch':           { title: 'Simulateur pilier 3a Suisse — capital & déduction fiscale 2025',       emoji: '🏦', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  // Immobilier
  '/simulateurs/emprunt-immobilier':      { title: 'Simulateur prêt immobilier 2026 — mensualités, capacité et TAEG',     emoji: '🏠', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  '/simulateurs/rendement-locatif':       { title: 'Calculer la rentabilité locative 2026 — rendement brut & net',         emoji: '📊', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  '/simulateurs/ptz':                     { title: 'Simulateur PTZ 2026 — suis-je éligible ? Quel montant ?',             emoji: '🏡', cat: 'Immobilier', prio: '0.8', freq: 'monthly' },
  '/simulateurs/frais-notaire':           { title: 'Calculateur frais de notaire 2026 — ancien vs neuf, calcul gratuit',   emoji: '🖋', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  // Impôts
  '/simulateurs/impot-revenu':            { title: 'Calculateur impôt sur le revenu 2026 — TMI, taux moyen, simulation',   emoji: '📋', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/plus-value-immobiliere':  { title: 'Simulateur plus-value immobilière 2026 — combien d\'impôt ?',          emoji: '📈', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/deficit-foncier':         { title: 'Déficit foncier 2026 — calculez l\'économie d\'impôt sur vos travaux', emoji: '🏚', cat: 'Impôts',     prio: '0.8', freq: 'monthly' },
  '/simulateurs/succession':              { title: 'Simulateur droits de succession 2026 — calcul par héritier',           emoji: '🎁', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/donation':                { title: 'Simulateur donation 2026 — abattement 100 000 € & droits à payer',     emoji: '🎁', cat: 'Impôts',     prio: '0.8', freq: 'monthly' },
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
  // Nouveaux simulateurs
  '/simulateurs/flat-tax':               { title: 'Simulateur flat tax / PFU 2026 — PFU 31,4 % ou barème progressif ?',   emoji: '📊', cat: 'Impôts',    prio: '0.9', freq: 'monthly' },
  '/simulateurs/trimestres':              { title: 'Simulateur trimestres retraite 2026 — durée d\'assurance & taux plein', emoji: '📅', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/succession-ch':           { title: 'Simulateur droits de succession Suisse 2025 — par canton', emoji: '🏔', cat: 'Impôts',     prio: '0.8', freq: 'monthly' },
  '/simulateurs/retraite-luxembourg':     { title: 'Simulateur retraite Luxembourg (CNAP) 2025 — pension & taux remplacement', emoji: '🇱🇺', cat: 'Retraite', prio: '0.9', freq: 'monthly' },
  // Vie & Temps
  '/simulateurs/cout-en-heures':          { title: 'Simulateur prix en heures de vie — vrai coût d\'un achat',             emoji: '⏰', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/vie-en-semaines':         { title: 'Simulateur ma vie en semaines — visualiser son temps',                 emoji: '📅', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/outils/qr-code':                      { title: 'Générateur de QR code personnalisé — couleur, logo, texte libre',      emoji: '🔳', cat: '', prio: '0.7', freq: 'monthly' },
  // Retraite par métier (30 professions)
  '/retraite/fonctionnaire':         { title: 'Retraite fonctionnaire 2026 — âge, calcul, taux et pension nette',        emoji: '🏛️', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/infirmiere':            { title: 'Retraite infirmière 2026 — CNAV, FPH ou CARPIMKO',                        emoji: '🏥', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/enseignant':            { title: 'Retraite enseignant 2026 — âge, calcul de la pension et RAFP',            emoji: '📚', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/agriculteur':           { title: 'Retraite agriculteur 2026 — MSA, calcul et revalorisation',               emoji: '🌾', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/medecin-liberal':       { title: 'Retraite médecin libéral 2026 — CARMF, ASV et calcul de pension',         emoji: '⚕️', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/avocat':                { title: 'Retraite avocat 2026 — CNBF, calcul de la pension et cotisations',        emoji: '⚖️', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/artisan':               { title: 'Retraite artisan 2026 — SSI, RCI et validation des trimestres',           emoji: '🔨', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/commercant':            { title: 'Retraite commerçant 2026 — SSI, RCI et calcul de pension',                emoji: '🏪', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/pharmacien':            { title: 'Retraite pharmacien libéral 2026 — CAVP, calcul et âge de départ',        emoji: '💊', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/chirurgien-dentiste':   { title: 'Retraite dentiste libéral 2026 — CARCDSF, calcul et âge de départ',      emoji: '🦷', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/sage-femme':            { title: 'Retraite sage-femme 2026 — CARCDSF, FPH et calcul de pension',           emoji: '👶', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/veterinaire':           { title: 'Retraite vétérinaire libéral 2026 — CARPV, calcul et âge de départ',     emoji: '🐾', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/notaire':               { title: 'Retraite notaire 2026 — CRPCEN, calcul et âge de départ',                emoji: '📜', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/expert-comptable':      { title: 'Retraite expert-comptable 2026 — CAVEC, calcul et âge de départ',        emoji: '📊', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/architecte':            { title: 'Retraite architecte libéral 2026 — CIPAV, calcul et âge de départ',      emoji: '📐', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/ingenieur-cadre':       { title: 'Retraite cadre ingénieur 2026 — Agirc-Arrco, calcul et pension nette',   emoji: '💼', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/policier':              { title: 'Retraite policier 2026 — CNRACL, catégorie active et calcul de pension',  emoji: '🚔', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/militaire':             { title: 'Retraite militaire 2026 — pension militaire, calcul et âge de départ',   emoji: '🎖️', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/pompier':               { title: 'Retraite pompier professionnel 2026 — CNRACL, catégorie active',         emoji: '🚒', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/gendarme':              { title: 'Retraite gendarme 2026 — pension militaire, calcul et âge de départ',    emoji: '🫡', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/aide-soignante':        { title: 'Retraite aide-soignante 2026 — FPH catégorie active, calcul et pension', emoji: '🩺', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/magistrat':             { title: 'Retraite magistrat 2026 — SRE, calcul de pension et âge de départ',      emoji: '⚖️', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/chauffeur-routier':     { title: 'Retraite chauffeur routier 2026 — pénibilité, C2P et départ anticipé',   emoji: '🚛', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/caissiere':             { title: 'Retraite caissière 2026 — carrières longues, C2P et départ anticipé',    emoji: '🛒', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/ouvrier-usine':         { title: 'Retraite ouvrier industrie 2026 — pénibilité, C2P et départ anticipé',   emoji: '🏭', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/chef-entreprise':       { title: "Retraite chef d'entreprise 2026 — TNS, assimilé-salarié et stratégie",   emoji: '🏢', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/auto-entrepreneur':     { title: "Retraite auto-entrepreneur 2026 — SSI, points retraite et optimisation", emoji: '💻', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/intermittent':          { title: 'Retraite intermittent du spectacle 2026 — CNAV, Audiens et calcul',      emoji: '🎭', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/expatrie':              { title: "Retraite expatrié français 2026 — CFE, conventions bilatérales et droits", emoji: '✈️', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/diplomate':             { title: "Retraite diplomate fonctionnaire 2026 — SRE, bonifications et calcul",   emoji: '🏳️', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  // Retraite par situation de vie et calendrier
  '/retraite/calendrier-generations': { title: 'Âge départ retraite par année de naissance 2026 — tableau complet',      emoji: '📅', cat: 'Retraite', prio: '0.9', freq: 'monthly' },
  '/retraite/a-40-ans':              { title: 'Préparer sa retraite à 40 ans 2026 — PER, épargne et stratégie',          emoji: '🕐', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/a-50-ans':              { title: 'Préparer sa retraite à 50 ans 2026 — bilan, rachats, PER',                emoji: '📅', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/carriere-longue':       { title: 'Retraite carrière longue 2026 — conditions, âge de départ et calcul',     emoji: '⏩', cat: 'Retraite', prio: '0.9', freq: 'monthly' },
  '/retraite/parent-au-foyer':              { title: "Retraite parent au foyer 2026 — MDA, AVPF et droits complets",           emoji: '👶', cat: 'Retraite',   prio: '0.8', freq: 'monthly' },
  '/retraite/guide-complet-2026':           { title: 'Guide retraite 2026 — calcul, simulateurs et optimisation complète',     emoji: '📖', cat: 'Retraite',   prio: '1.0', freq: 'monthly' },
  '/retraite/points-agirc-arrco':           { title: 'Points Agirc-Arrco 2026 — valeur du point, calcul et malus',             emoji: '🏆', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/retraite/calcul-pension-reversion':     { title: 'Pension de réversion 2026 — calcul, taux et conditions',                 emoji: '💞', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/immobilier/frais-notaire':              { title: 'Frais de notaire 2026 — taux, calcul et comment les réduire',            emoji: '🏠', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  // Contenu éditorial
  '/blog':                                { title: 'Blog finances personnelles — retraite, immobilier, épargne, FIRE',     emoji: '📰', cat: '',          prio: '0.8', freq: 'weekly'  },
  '/lexique':                             { title: 'Lexique financier — définitions TAEG, PER, TMI, FIRE…',               emoji: '📖', cat: '',          prio: '0.7', freq: 'monthly' },
  '/guides':                              { title: 'Guides finances personnelles — retraite, immobilier, épargne',         emoji: '📚', cat: '',          prio: '0.8', freq: 'monthly' },
  '/comparatifs':                         { title: 'Comparatifs financiers — PER, achat vs location, freelance',          emoji: '⚖️', cat: '',          prio: '0.7', freq: 'monthly' },
  '/methodologie':                        { title: 'Méthodologie & sources — calculs simfinly.com',                        emoji: '🔬', cat: '',          prio: '0.4', freq: 'yearly'  },
  '/widgets':                             { title: 'Widgets gratuits à intégrer — simulateurs embarquables',               emoji: '🧩', cat: '',          prio: '0.5', freq: 'yearly'  },
  '/barometre-retraite':                  { title: 'Baromètre Retraite 2026 — Chiffres clés et tendances | simfinly.com',  emoji: '📊', cat: '',          prio: '0.7', freq: 'monthly' },
  '/recherche':                           { title: 'Recherche — simulateurs, guides et articles | simfinly.com',            emoji: '🔍', cat: '',          prio: '0.3', freq: 'weekly'  },
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
  // Longue traîne — articles ciblés par profession et thématique
  '/blog/calcul-trimestres-retraite-guide-complet',
  '/blog/retraite-infirmiere-fonctionnaire-hospitalier',
  '/blog/retraite-enseignant-education-nationale-calcul',
  '/blog/retraite-agriculteur-msa-exploitant',
  '/blog/droits-succession-suisse-cantons-heritiers',
  // Vague 2 — retraite : requêtes à fort volume (5 000-15 000/mois)
  '/blog/age-depart-retraite-generation-2026',
  '/blog/pension-reversion-calcul-conditions-2026',
  '/blog/retraite-progressive-mode-emploi-2026',
  '/blog/partir-retraite-avant-64-ans-carriere-longue-2026',
  // Vague 2 — fiscalité et immobilier (3 000-5 000/mois)
  '/blog/donation-abattement-100000-euros-2026',
  '/blog/frais-notaire-achat-immobilier-calcul-2026',
  '/blog/deficit-foncier-travaux-deductibles-2026',
  '/blog/succession-enfants-abattement-droits-2026',
  // Vague 2 — épargne salariale
  '/blog/epargne-salariale-pee-perco-abondement-2026',
  // Vague 3 — commit 4A (investissement, professions, cotisations)
  '/blog/investir-bourse-debutant-2026',
  '/blog/choisir-assurance-vie-2026',
  '/blog/dpe-renovation-travaux-2026',
  '/blog/retraite-medecin-liberal-carmf-2026',
  '/blog/retraite-artisan-commercant-ssi-2026',
  '/blog/comprendre-cotisations-sociales-2026',
  '/blog/retraite-cadre-agirc-arrco-calcul',
  '/blog/pea-comment-ouvrir-investir-2026',
  '/blog/micro-entrepreneur-retraite-droits',
  // Vague 3 — commit 4B (fiscalité, SCPI, budget, FIRE)
  '/blog/loi-de-finances-2026-changements',
  '/blog/scpi-investir-pierre-papier-2026',
  '/blog/budget-50-30-20-methode',
  '/blog/regle-4-pourcent-fire-france',
  '/blog/donation-nue-propriete-strategie',
  '/blog/plafond-per-deduction-2026',
  '/blog/epargne-precaution-combien-garder',
  '/blog/taux-remplacement-calcul-2026',
  // Vague 3 — commit 4C (LMNP, retraites spécifiques, immobilier)
  '/blog/lmnp-regime-reel-amortissement-2026',
  '/blog/retraite-auto-entrepreneur-ssi-calcul',
  '/blog/risque-sequence-fire-rentier',
  '/blog/abattement-succession-enfants-2026',
  '/blog/retraite-militaire-calcul-pension',
  '/blog/private-equity-investir-france',
  '/blog/vefa-achat-neuf-plan-2026',
  '/blog/location-meublee-lmnp-fiscalite',
  // Vague 3 — commit 4D (complément 50 articles)
  '/blog/investir-bourse-long-terme-strategie',
  '/blog/per-vs-assurance-vie-comparaison-2026',
];

// Articles de blog en anglais (/en/blog/:slug) — ciblent les expatriés et anglophones.
export const EN_BLOG_SLUGS = [
  '/en/blog/french-pension-system-explained-2026',
  '/en/blog/fire-movement-france-2026',
  '/en/blog/french-income-tax-explained-2026',
  '/en/blog/buying-property-france-expat-guide-2026',
  '/en/blog/assurance-vie-france-complete-guide-2026',
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

  // Fiche du lexique → DefinedTerm + FAQPage si le terme a des faqs
  if (route.startsWith('/lexique/')) {
    const t = GLOSSARY_BY_SLUG[route.slice('/lexique/'.length)];
    if (!t) return [];
    const schemas = [
      breadcrumb([['Accueil', `${BASE}/`], ['Lexique', `${BASE}/lexique`], [t.term, url]]),
      {
        '@context': 'https://schema.org', '@type': 'DefinedTerm',
        name: t.term, alternateName: t.full, description: t.short, url,
        inDefinedTermSet: `${BASE}/lexique`,
      },
    ];
    if (t.faqs && t.faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: t.faqs.map(({ q, a }) => ({
          '@type': 'Question', name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      });
    }
    return schemas;
  }

  // Guide thématique → fil d'Ariane + Article (+ HowTo si steps définis)
  if (route.startsWith('/guides/')) {
    const g = GUIDES_BY_SLUG[route.slice('/guides/'.length)];
    if (!g) return [];
    const ogImg = ogImageForRoute(route);
    const schemas = [
      breadcrumb([['Accueil', `${BASE}/`], ['Guides', `${BASE}/guides`], [g.title, url]]),
      {
        '@context': 'https://schema.org', '@type': 'Article',
        headline: g.title, description: g.intro, url, mainEntityOfPage: url,
        image: { '@type': 'ImageObject', url: ogImg, width: 1200, height: 630 },
        author: { '@type': 'Organization', name: 'simfinly.com', url: BASE },
        publisher: { '@type': 'Organization', name: 'simfinly.com', logo: { '@type': 'ImageObject', url: `${BASE}/logo-mark.svg` } },
      },
    ];
    if (g.steps && g.steps.length > 0) {
      schemas.push({
        '@context': 'https://schema.org', '@type': 'HowTo',
        name: g.title, description: g.intro,
        step: g.steps.map(s => ({ '@type': 'HowToStep', position: s.position, name: s.name, text: s.text })),
      });
    }
    return schemas;
  }

  // Page comparative → fil d'Ariane + Article
  if (route.startsWith('/comparatifs/')) {
    const c = COMPARATIFS_BY_SLUG[route.slice('/comparatifs/'.length)];
    if (!c) return [];
    const ogImg = ogImageForRoute(route);
    return [
      breadcrumb([['Accueil', `${BASE}/`], ['Comparatifs', `${BASE}/comparatifs`], [c.shortTitle, url]]),
      {
        '@context': 'https://schema.org', '@type': 'Article',
        headline: c.title, description: c.intro, url, mainEntityOfPage: url,
        image: { '@type': 'ImageObject', url: ogImg, width: 1200, height: 630 },
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
  if (!meta) return [];
  // Page d'accueil → WebSite + SiteLinksSearchBox + Organization
  if (route === '/') {
    return [
      {
        '@context': 'https://schema.org', '@type': 'WebSite',
        name: 'Simfinly', url: `${BASE}/`,
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/recherche?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@context': 'https://schema.org', '@type': 'Organization',
        name: 'Simfinly', url: `${BASE}/`,
        logo: { '@type': 'ImageObject', url: `${BASE}/logo-mark.svg` },
        description: 'Simulateurs financiers gratuits : retraite Agirc-Arrco, PER, immobilier, FIRE, impôt sur le revenu et patrimoine. Calculs instantanés, sans inscription.',
        sameAs: [],
        contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', availableLanguage: ['French', 'English'] },
      },
    ];
  }
  const out = [breadcrumb([['Accueil', `${BASE}/`], [meta.title, url]])];
  if (route.startsWith('/simulateurs/')) {
    const seoIntro = SEO_CONTENT[route]?.intro;
    out.push({
      '@context': 'https://schema.org', '@type': 'WebApplication',
      name: meta.title, url,
      description: seoIntro || meta.title,
      applicationCategory: 'FinanceApplication', operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      inLanguage: 'fr-FR',
      featureList: 'Calcul instantané, Export PDF, Partage de simulation, Graphiques interactifs, Comparaison de scénarios',
      screenshot: `${BASE}/og-image.webp`,
      author: { '@type': 'Organization', name: 'Simfinly', url: BASE },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '1284', bestRating: '5' },
    });
    out.push({
      '@context': 'https://schema.org', '@type': 'HowTo',
      name: `Comment utiliser : ${meta.title}`,
      tool: [{ '@type': 'HowToTool', name: 'simfinly.com — simulateur gratuit en ligne' }],
      step: [
        { '@type': 'HowToStep', position: 1, name: 'Saisir vos paramètres', text: 'Renseignez vos données personnelles (âge, salaire, durée de cotisation…) dans les champs du formulaire.' },
        { '@type': 'HowToStep', position: 2, name: 'Lire vos résultats', text: "Les résultats se calculent instantanément et s'affichent sous forme de graphiques et tableaux détaillés." },
        { '@type': 'HowToStep', position: 3, name: 'Comparer plusieurs scénarios', text: 'Ajustez les paramètres pour simuler différentes hypothèses et identifier la stratégie la plus avantageuse.' },
        { '@type': 'HowToStep', position: 4, name: 'Exporter ou partager', text: 'Téléchargez vos résultats en PDF ou partagez le lien de votre simulation avec votre conseiller financier.' },
      ],
    });
    const faqs = FAQS[route];
    if (faqs && faqs.length > 0) {
      out.push({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question', name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      });
    }
  }
  return out;
}

export function structuredDataScripts(route, extra = {}) {
  return structuredData(route, extra)
    .map(d => `<script type="application/ld+json">${JSON.stringify(d)}</script>`)
    .join('\n    ');
}
