// Routes statiques partagées entre le build (scripts/generate-static-html.mjs)
// et l'API sitemap dynamique (api/sitemap.js). Source unique de vérité pour
// éviter toute divergence entre les pages générées et le sitemap.
//
// Préfixe « _ » : Vercel ne traite pas ce fichier comme une route serverless.

import { BASE, ROUTE_META, ogImageForRoute, OG_IMAGE_BY_CAT, OG_IMAGE_DEFAULT } from './_meta.js';
export { BASE, ROUTE_META, OG_IMAGE_BY_CAT, OG_IMAGE_DEFAULT, ogImageForRoute } from './_meta.js';
import { ROUTE_META_EN, ROUTE_META_CH, ROUTE_META_BE, ROUTE_META_LU, ROUTE_META_QC } from './_meta-i18n.js';
export { ROUTE_META_EN, ROUTE_META_CH, ROUTE_META_BE, ROUTE_META_LU, ROUTE_META_QC } from './_meta-i18n.js';
import { GLOSSARY, GLOSSARY_BY_SLUG } from '../src/data/glossaire.js';
import { GUIDES, GUIDES_BY_SLUG } from '../src/data/guides.js';
import { COMPARATIFS, COMPARATIFS_BY_SLUG } from '../src/data/comparatifs.js';
import { FAQS } from '../src/data/faqs.js';
import { BAREMES_DATES } from '../src/data/baremesDates.js';
import { SEO_CONTENT } from './_seo.js';
import { EN_PATH_MAP, COUNTRY_ONLY_ROUTES } from '../src/i18n/paths.js';

// Configuration i18n côté build (miroir de src/i18n/config.js). Le français est
// la locale par défaut (servie à la racine) ; l'anglais est préfixé (/en/...).
export const I18N = { defaultLocale: 'fr', locales: ['fr', 'en'] };

// Date de dernière révision de contenu, STABLE d'un déploiement à l'autre. Ne PAS
// la remplacer par new Date() dans le sitemap : un <lastmod> qui change à chaque
// build est un faux signal que Google finit par ignorer. À bumper lors d'une
// révision réelle des contenus / barèmes.
export const SITE_LASTMOD = '2026-06-15';

// Surcharges de <lastmod> par route (révision plus récente que SITE_LASTMOD).
// Clé = route canonique FR (sans préfixe /en, /ch, /be).
// Dérivées de BAREMES_DATES (source unique : badge « Barèmes YYYY » côté UI et
// lastmod du sitemap racontent la même histoire), complétées de surcharges manuelles.
const MOIS_NUM = { janvier: '01', février: '02', mars: '03', avril: '04', mai: '05', juin: '06', juillet: '07', août: '08', septembre: '09', octobre: '10', novembre: '11', décembre: '12' };
export const ROUTE_DATES = {
  ...Object.fromEntries(Object.entries(BAREMES_DATES).map(([route, { annee, mois }]) =>
    [route, `${annee}-${MOIS_NUM[mois] || '01'}-01`]
  )),
  '/': '2026-06-15',
  '/retraite/guide-complet-2026': '2026-07-04',
};

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
  '/contact',
  '/simulateurs/donation',
  '/simulateurs/pension-reversion',
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

// Routes disponibles sous /lu/ (Luxembourg). Miroir de src/i18n/paths.js LU_ROUTES
// (hors /lu/guides et /lu/lexique, pré-rendus séparément comme pour BE).
export const LU_ROUTES = [
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
  '/simulateurs/impot-revenu-lu',
  '/simulateurs/succession-lu',
  '/simulateurs/retraite-luxembourg',
  '/mentions-legales',
  '/politique-de-confidentialite',
];

// Routes disponibles sous /qc/ (Québec). Miroir de src/i18n/paths.js QC_ROUTES
// (hors /qc/guides et /qc/lexique, pré-rendus séparément comme pour BE/LU).
export const QC_ROUTES = [
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
  '/simulateurs/retraite-quebec',
  '/simulateurs/impot-revenu-qc',
  '/mentions-legales',
  '/politique-de-confidentialite',
];

// Méta d'une route pour une locale et un pays donnés.
export function routeMeta(route, locale = 'fr', country = 'fr') {
  if (locale === 'en' && ROUTE_META_EN[route]) return ROUTE_META_EN[route];
  if (country === 'ch' && ROUTE_META_CH[route]) return ROUTE_META_CH[route];
  if (country === 'be' && ROUTE_META_BE[route]) return ROUTE_META_BE[route];
  if (country === 'lu' && ROUTE_META_LU[route]) return ROUTE_META_LU[route];
  if (country === 'qc' && ROUTE_META_QC[route]) return ROUTE_META_QC[route];
  return ROUTE_META[route];
}

// Liens hreflang d'une route pour le HTML statique.
// Émet toutes les variantes disponibles (fr, en, fr-CH, fr-BE, x-default) afin
// que Google comprenne le maillage international sans exécuter JavaScript.
export function hreflangLinks(route) {
  // Simulateur propre à un pays (ex. impôt LU) : pas d'autre version, donc pas
  // de hreflang (fr / x-default pointeraient vers une URL racine inexistante).
  if (COUNTRY_ONLY_ROUTES[route]) return '';
  const links = [];
  const fr = `${BASE}${route === '/' ? '/' : route}`;
  links.push(`<link rel="alternate" hreflang="fr" href="${fr}" />`);
  if (EN_ROUTES.includes(route)) {
    // Le segment anglais peut différer du chemin FR (ex. /simulateurs/cnav →
    // /simulators/french-pension) : toujours passer par EN_PATH_MAP, la même
    // table que le routeur client, plutôt qu'un préfixe `/en` naïf.
    const enSeg = EN_PATH_MAP[route] ?? route;
    links.push(`<link rel="alternate" hreflang="en" href="${BASE}/en${enSeg === '/' ? '' : enSeg}" />`);
  } else if (route === '/lexique') {
    // Le lexique n'est pas dans EN_ROUTES (pas de version EN complète) : seul un
    // sous-ensemble de termes est traduit, sous /en/glossary/.
    links.push(`<link rel="alternate" hreflang="en" href="${BASE}/en/glossary" />`);
  } else if (route.startsWith('/lexique/') && GLOSSARY_BY_SLUG[route.slice('/lexique/'.length)]?.en) {
    links.push(`<link rel="alternate" hreflang="en" href="${BASE}/en/glossary/${route.slice('/lexique/'.length)}" />`);
  }
  if (CH_ROUTES.includes(route)) {
    links.push(`<link rel="alternate" hreflang="fr-CH" href="${BASE}/ch${route === '/' ? '' : route}" />`);
  }
  if (BE_ROUTES.includes(route)) {
    links.push(`<link rel="alternate" hreflang="fr-BE" href="${BASE}/be${route === '/' ? '' : route}" />`);
  }
  if (LU_ROUTES.includes(route)) {
    links.push(`<link rel="alternate" hreflang="fr-LU" href="${BASE}/lu${route === '/' ? '' : route}" />`);
  }
  if (QC_ROUTES.includes(route)) {
    links.push(`<link rel="alternate" hreflang="fr-CA" href="${BASE}/qc${route === '/' ? '' : route}" />`);
  }
  links.push(`<link rel="alternate" hreflang="x-default" href="${fr}" />`);
  // Inutile si seulement fr + x-default (même URL = balisage inutile)
  if (links.length <= 2) return '';
  return links.join('\n    ');
}

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

// Sous-ensemble du lexique traduit en anglais (/en/glossary/:slug) : pré-rendues
// au build et incluses au sitemap EN.
export const LEXIQUE_SLUGS_EN = GLOSSARY.filter(t => t.en).map(t => `/lexique/${t.slug}`);

// Guides thématiques (/guides/:slug) : pré-rendus au build et inclus au sitemap.
export const GUIDES_SLUGS = GUIDES.map(g => `/guides/${g.slug}`);

// Pages comparatives (/comparatifs/:slug) : pré-rendues au build et incluses au sitemap.
export const COMPARATIFS_SLUGS = COMPARATIFS.map(c => `/comparatifs/${c.slug}`);

// og:image par catégorie (différenciation des aperçus de partage social).
// PNG (pas SVG) : c'est le format réellement rendu par Facebook/LinkedIn/X.
// Régénérables depuis les SVG via : node scripts/generate-og-png.mjs

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
  // URL réelle de la page : extra.urlPath pour les variantes /en/… (comparatifs,
  // lexique, articles), sinon la route canonique FR.
  const url = `${BASE}${extra.urlPath || route}`;

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
    const lastmod = ROUTE_DATES[route] || SITE_LASTMOD;
    const schemas = [
      breadcrumb([['Accueil', `${BASE}/`], ['Guides', `${BASE}/guides`], [g.title, url]]),
      {
        '@context': 'https://schema.org', '@type': 'Article',
        headline: g.title, description: g.intro, url, mainEntityOfPage: url,
        image: { '@type': 'ImageObject', url: ogImg, width: 1200, height: 630 },
        author: { '@type': 'Organization', name: 'simfinly.com', url: BASE },
        publisher: { '@type': 'Organization', name: 'simfinly.com', logo: { '@type': 'ImageObject', url: `${BASE}/logo-mark.svg` } },
        datePublished: lastmod, dateModified: lastmod,
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
    const lastmod = ROUTE_DATES[route] || SITE_LASTMOD;
    return [
      breadcrumb([['Accueil', `${BASE}/`], ['Comparatifs', `${BASE}/comparatifs`], [c.shortTitle, url]]),
      {
        '@context': 'https://schema.org', '@type': 'Article',
        headline: c.title, description: c.intro, url, mainEntityOfPage: url,
        image: { '@type': 'ImageObject', url: ogImg, width: 1200, height: 630 },
        author: { '@type': 'Organization', name: 'simfinly.com', url: BASE },
        publisher: { '@type': 'Organization', name: 'simfinly.com', logo: { '@type': 'ImageObject', url: `${BASE}/logo-mark.svg` } },
        datePublished: lastmod, dateModified: lastmod,
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
    // `image` est recommandé (pas obligatoire) pour l'éligibilité aux rich
    // results Article, mais ~55 articles statiques n'ont jamais eu de photo
    // Pexels associée — on retombe sur le visuel générique par catégorie
    // (déjà utilisé pour les guides/comparatifs) plutôt que de laisser le
    // champ vide.
    article.image = extra.image || `${BASE}${OG_IMAGE_BY_CAT[extra.category] || OG_IMAGE_DEFAULT}`;
    if (extra.content) article.articleBody = String(extra.content).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (extra.lang === 'en') article.inLanguage = 'en';
    const schemas = [
      extra.lang === 'en'
        ? breadcrumb([['Home', `${BASE}/en`], [extra.title, url]])
        : breadcrumb([['Accueil', `${BASE}/`], ['Blog', `${BASE}/blog`], [extra.title, url]]),
      article,
    ];
    if (extra.faqs && extra.faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: extra.faqs.map(({ q, a }) => ({
          '@type': 'Question', name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      });
    }
    return schemas;
  }

  const meta = ROUTE_META[route];
  if (!meta) return [];
  // Page d'accueil → rien : les schémas WebSite + Organization sont codés en dur
  // dans index.html (et le build saute la home dans patchHtml pour éviter le doublon).
  if (route === '/') return [];
  const out = [breadcrumb([['Accueil', `${BASE}/`], [meta.title, url]])];
  if (route.startsWith('/simulateurs/')) {
    const seoIntro = SEO_CONTENT[route]?.intro;
    // Même source que le <lastmod> du sitemap : les deux signaux doivent raconter
    // la même histoire de fraîcheur de contenu (sinon Google finit par ignorer les deux).
    const lastmod = ROUTE_DATES[route] || SITE_LASTMOD;
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
      dateModified: lastmod,
      // Pas d'aggregateRating : aucun système d'avis réel n'alimente cette note.
      // Un rich snippet d'avis fabriqué viole les règles Google (risque de
      // sanction manuelle) — à réintroduire uniquement avec de vrais avis vérifiables.
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
