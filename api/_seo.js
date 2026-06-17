// Contenu SEO pré-rendu (H1 + intro) injecté EN DUR dans le HTML statique de
// chaque simulateur au build (scripts/generate-static-html.mjs). Objectif : du
// vrai texte crawlable présent sans exécution JS — complète le JSON-LD déjà
// injecté. Le bloc est placé dans #root ; React le remplace au montage côté
// client (rendu client, pas d'hydratation → aucun risque d'incohérence).
//
// Clé = chemin de route. Intro = 2-3 phrases factuelles et descriptives.
export const SEO_CONTENT = {
  '/simulateurs/agirc-arrco': {
    h1: "Simulateur retraite complémentaire Agirc-Arrco 2026",
    intro: "Estimez votre pension complémentaire Agirc-Arrco à partir de votre salaire, vos points acquis et votre âge de départ. Le calcul intègre la valeur du point, le coefficient de solidarité (bonus-malus), la GMP des cadres et une revalorisation projetée, pour une estimation nette mensuelle en quelques secondes.",
  },
  '/simulateurs/cnav': {
    h1: "Simulateur retraite de base CNAV — régime général",
    intro: "Calculez votre pension de base du régime général (CNAV) selon votre salaire annuel moyen, vos trimestres validés et votre âge de départ. Le simulateur applique le taux plein, la décote ou la surcote et estime votre future retraite de base, à compléter par vos régimes complémentaires.",
  },
  '/simulateurs/fonction-publique': {
    h1: "Simulateur retraite de la fonction publique",
    intro: "Évaluez votre pension de fonctionnaire d'État, territorial ou hospitalier à partir de votre indice majoré, votre durée de services et vos bonifications. Le calcul distingue catégorie sédentaire et active et intègre la décote/surcote selon votre âge de départ.",
  },
  '/simulateurs/independants': {
    h1: "Simulateur retraite des indépendants et TNS",
    intro: "Artisan, commerçant ou profession libérale : estimez votre retraite de base (SSI) et complémentaire selon vos revenus professionnels, vos années cotisées et votre âge de départ. Une projection claire de votre future pension de travailleur non salarié.",
  },
  '/simulateurs/ircantec': {
    h1: "Simulateur retraite IRCANTEC — contractuels publics",
    intro: "Agents non titulaires de la fonction publique et élus locaux : estimez votre retraite complémentaire IRCANTEC. Le simulateur convertit vos cotisations en points, applique la valeur de service du point et projette votre pension complémentaire annuelle et mensuelle.",
  },
  '/simulateurs/retraite-progressive': {
    h1: "Simulateur de retraite progressive",
    intro: "Vous envisagez de réduire votre activité avant la retraite complète ? Estimez le montant de votre pension partielle pendant la retraite progressive et l'impact de ce temps partiel sur votre future pension définitive, tous régimes confondus.",
  },
  '/simulateurs/cnavpl': {
    h1: "Simulateur retraite des professions libérales (CIPAV)",
    intro: "Estimez votre retraite de base et votre complémentaire CIPAV si vous exercez une profession libérale non réglementée. Le calcul tient compte de vos revenus, de vos années de cotisation et de votre âge de départ pour projeter votre pension.",
  },
  '/simulateurs/msa': {
    h1: "Simulateur retraite agricole MSA",
    intro: "Exploitant ou salarié agricole : calculez votre retraite de base MSA et votre retraite complémentaire obligatoire (RCO). Le simulateur projette votre pension selon vos revenus, votre statut et votre durée de carrière agricole.",
  },
  '/simulateurs/emprunt-immobilier': {
    h1: "Simulateur d'emprunt immobilier",
    intro: "Calculez la mensualité, la capacité d'emprunt, le coût total du crédit et le taux d'endettement de votre projet immobilier. Le simulateur inclut les frais de notaire, le cas primo-accédant et un tableau d'amortissement détaillé année par année.",
  },
  '/simulateurs/rendement-locatif': {
    h1: "Simulateur de rendement locatif",
    intro: "Évaluez la rentabilité brute et nette d'un investissement locatif à partir du prix, du loyer, des charges, de la fiscalité et des frais de gestion. Un calcul clair pour comparer vos opportunités d'investissement immobilier.",
  },
  '/simulateurs/ptz': {
    h1: "Simulateur PTZ 2025 — Prêt à Taux Zéro",
    intro: "Estimez le montant de votre Prêt à Taux Zéro selon votre zone, la composition de votre foyer et vos revenus. Le simulateur détermine votre tranche, la quotité finançable et le montant du PTZ, selon le barème 2025 (décret n° 2025-299).",
  },
  '/simulateurs/impot-revenu': {
    h1: "Simulateur d'impôt sur le revenu 2026",
    intro: "Estimez votre impôt sur le revenu net, votre tranche marginale d'imposition (TMI) et votre taux moyen selon votre situation familiale et votre revenu imposable. Le calcul applique le barème progressif et la décote pour une estimation fiable.",
  },
  '/simulateurs/plus-value-immobiliere': {
    h1: "Simulateur de plus-value immobilière",
    intro: "Calculez l'imposition de la plus-value lors de la vente d'un bien immobilier selon le prix d'achat, le prix de vente et la durée de détention. Le simulateur applique les abattements pour durée et estime l'impôt sur le revenu et les prélèvements sociaux dus.",
  },
  '/simulateurs/budget': {
    h1: "Simulateur de budget 50/30/20",
    intro: "Répartissez votre budget mensuel selon la règle d'or 50/30/20 : besoins, envies et épargne. Visualisez en temps réel l'équilibre de vos finances et votre taux d'épargne, avec des conseils personnalisés selon votre situation.",
  },
  '/simulateurs/salaire': {
    h1: "Simulateur salaire net / brut et carrière",
    intro: "Convertissez votre salaire brut en net, projetez son évolution sur plusieurs décennies et mesurez l'impact de l'inflation sur votre pouvoir d'achat réel. Un outil pour anticiper votre progression de rémunération.",
  },
  '/simulateurs/epargne': {
    h1: "Simulateur d'épargne et intérêts composés",
    intro: "Projetez la croissance de votre épargne sur le long terme grâce aux intérêts composés et à des versements réguliers. Visualisez le capital atteint selon le rendement, la durée et l'effort d'épargne mensuel.",
  },
  '/simulateurs/fire': {
    h1: "Simulateur FIRE — indépendance financière",
    intro: "Calculez le patrimoine nécessaire pour vivre de vos investissements et l'âge auquel vous atteindrez l'indépendance financière. Le simulateur applique la règle des 4 %, les paliers Lean/Coast/Fat FIRE et trace votre trajectoire année par année.",
  },
  '/simulateurs/per': {
    h1: "Simulateur PER — Plan d'Épargne Retraite",
    intro: "Estimez l'économie d'impôt liée à vos versements sur un PER et le capital projeté à la retraite. Le calcul applique le plafond de déduction (10 % des revenus, PASS 2025) selon votre tranche marginale d'imposition et votre horizon de placement.",
  },
  '/simulateurs/synthese-retraite': {
    h1: "Synthèse retraite tous régimes — votre pension totale",
    intro: "Additionnez les pensions de tous vos régimes de retraite (CNAV, Agirc-Arrco, fonction publique, indépendants, IRCANTEC, MSA, CIPAV) pour estimer votre retraite totale. Idéal pour les polypensionnés : pension brute et nette mensuelle, total annuel et taux de remplacement par rapport à votre dernier salaire.",
  },
  '/simulateurs/patrimoine': {
    h1: "Simulateur de patrimoine global",
    intro: "Consolidez l'ensemble de votre patrimoine — financier, immobilier et retraite — pour visualiser votre richesse nette et sa répartition par classe d'actifs. Une vue d'ensemble claire de votre situation patrimoniale.",
  },
  '/simulateurs/comparateur': {
    h1: "Comparateur d'actifs — ETF, actions, crypto",
    intro: "Comparez la performance historique d'ETF, d'actions et de cryptomonnaies sur la période de votre choix, à partir de données réelles. Retour total, rendement annualisé (CAGR), versements programmés et indice base 100 pour des comparaisons lisibles.",
  },
  '/simulateurs/assurance-vie': {
    h1: "Simulateur d'assurance-vie — rendement et fiscalité",
    intro: "Projetez la croissance de votre assurance-vie et estimez la fiscalité de vos gains au rachat : avantage des 8 ans de détention, abattement annuel, prélèvement forfaitaire et prélèvements sociaux de 17,2 %, selon les paramètres 2025.",
  },
  '/simulateurs/credit-conso': {
    h1: "Simulateur de crédit à la consommation",
    intro: "Calculez la mensualité, le coût total et le total des intérêts de votre crédit conso selon le montant emprunté, le TAEG et la durée. Le simulateur inclut une assurance facultative et un tableau d'amortissement.",
  },
  '/simulateurs/cout-en-heures': {
    h1: "Simulateur : le vrai prix en heures de vie",
    intro: "Convertissez n'importe quel achat en heures de travail réelles. À partir de votre salaire, découvrez le coût véritable d'un bien ou d'un abonnement, exprimé en temps de vie plutôt qu'en euros.",
  },
  '/simulateurs/vie-en-semaines': {
    h1: "Simulateur : ma vie en semaines",
    intro: "Visualisez l'intégralité de votre vie sous forme de grille, une case par semaine. Combien de semaines avez-vous vécues, combien vous en reste-t-il ? Une perspective marquante sur le temps qui passe.",
  },
  '/outils/qr-code': {
    h1: "Générateur de QR code personnalisé gratuit",
    intro: "Créez un QR code sur mesure : choisissez les couleurs, saisissez le texte ou le lien de votre choix et ajoutez votre logo ou un emoji au centre. Le code est généré dans votre navigateur — aucune donnée envoyée — et téléchargeable en PNG haute résolution, gratuitement et sans inscription.",
  },
};

// Contenu SEO en anglais (H1 + intro) pour les pages /en/...
export const SEO_CONTENT_EN = {
  '/': {
    h1: "Free Financial Calculators",
    intro: "Online financial calculators to plan your savings, reach financial independence, optimise your budget and more. Instant results, no sign-up required.",
  },
  '/simulateurs/epargne': {
    h1: "Compound Interest Calculator",
    intro: "Project how your savings grow over time with compound interest and regular monthly contributions. See the final balance for any interest rate, duration and savings effort.",
  },
  '/simulateurs/fire': {
    h1: "FIRE Calculator — Financial Independence, Retire Early",
    intro: "Calculate the net worth you need to live off your investments and the age at which you reach financial independence. Based on the 4% rule, with Lean FIRE, Coast FIRE and Fat FIRE milestones plotted year by year.",
  },
  '/simulateurs/budget': {
    h1: "50/30/20 Budget Calculator",
    intro: "Split your monthly income with the 50/30/20 rule: 50% needs, 30% wants, 20% savings. See your budget balance and savings rate in real time, with personalised tips for each category.",
  },
  '/simulateurs/patrimoine': {
    h1: "Net Worth Calculator",
    intro: "Consolidate your financial assets, real estate and retirement savings to see your total net worth and how it breaks down by asset class. A clear overview of your overall financial position.",
  },
  '/simulateurs/cout-en-heures': {
    h1: "Cost in Hours of Work Calculator",
    intro: "Turn any purchase into real hours of your life. Based on your salary, discover the true cost of a product or subscription expressed in time rather than money.",
  },
  '/simulateurs/credit-conso': {
    h1: "Personal Loan Calculator",
    intro: "Calculate the monthly payment, total cost and total interest of a personal loan from the amount borrowed, the APR and the term. Includes optional insurance and a full amortization schedule.",
  },
  '/simulateurs/comparateur': {
    h1: "Asset Comparison Tool — ETFs, Stocks, Crypto",
    intro: "Compare the historical performance of ETFs, stocks and cryptocurrencies over any period from real data. Total return, annualised CAGR, recurring contributions and a base-100 index for clean side-by-side comparisons.",
  },
  '/outils/qr-code': {
    h1: "Free Custom QR Code Generator",
    intro: "Create a custom QR code: choose the colors, enter any text or URL and add your logo or an emoji in the center. Generated in your browser — no data sent — and downloadable as high-resolution PNG, completely free with no sign-up.",
  },
};

// Bloc HTML SEO (sans dépendance, échappé) pour une route donnée.
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Bloc placé dans #root (remplacé par React au montage). Visuellement masqué
// (motif accessibilité) pour éviter tout flash avant le rendu, mais bien présent
// dans le HTML brut pour les crawlers et le rendu sans JS.
const SR_ONLY = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';

export function seoHtmlForRoute(route, locale = 'fr') {
  const dict = locale === 'en' ? SEO_CONTENT_EN : SEO_CONTENT;
  const c = dict[route];
  if (!c) return '';
  return `<div id="seo-prerender" style="${SR_ONLY}"><h1>${escapeHtml(c.h1)}</h1><p>${escapeHtml(c.intro)}</p></div>`;
}

// Nettoyage défensif du HTML d'article avant injection statique. Les articles ne
// contiennent normalement que h2/p/ul/li/strong/em, mais le contenu vient de Redis
// (endpoints publish-article / generate-article) : on retire tout élément actif et
// tout gestionnaire d'événement par précaution.
function sanitizeArticleHtml(html) {
  return String(html)
    .replace(/<\/?(?:script|style|iframe|object|embed|link|meta)\b[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript:/gi, '');
}

// Bloc SEO pré-rendu pour un article de blog : titre + intro + corps complet,
// injecté dans #root au build pour que le contenu soit crawlable sans exécuter le
// JS (React le remplace au montage). `extra` provient de Redis (title, intro,
// content). Renvoie '' si le corps n'est pas disponible (repli sans Redis).
export function seoHtmlForArticle(extra) {
  if (!extra || !extra.content) return '';
  const h1 = extra.title ? `<h1>${escapeHtml(extra.title)}</h1>` : '';
  const intro = extra.description ? `<p>${escapeHtml(extra.description)}</p>` : '';
  return `<div id="seo-prerender" style="${SR_ONLY}">${h1}${intro}${sanitizeArticleHtml(extra.content)}</div>`;
}
