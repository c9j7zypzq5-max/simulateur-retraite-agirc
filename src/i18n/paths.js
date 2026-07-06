import { DEFAULT_LOCALE } from './config.js';

// Mapping : chemin canonique FR → segment URL anglais (après /en).
// Source de vérité pour les deux sens de la traduction d'URL.
export const EN_PATH_MAP = {
  '/':                               '/',
  '/simulateurs/epargne':            '/simulators/savings',
  '/simulateurs/fire':               '/simulators/fire',
  '/simulateurs/budget':             '/simulators/budget',
  '/simulateurs/patrimoine':         '/simulators/wealth',
  '/simulateurs/cout-en-heures':     '/simulators/cost-in-hours',
  '/simulateurs/vie-en-semaines':    '/simulators/life-in-weeks',
  '/simulateurs/assurance-vie':      '/simulators/life-insurance',
  '/simulateurs/rendement-locatif':  '/simulators/rental-yield',
  '/simulateurs/emprunt-immobilier': '/simulators/mortgage',
  '/simulateurs/credit-conso':       '/simulators/consumer-credit',
  '/simulateurs/comparateur':        '/simulators/comparator',
  '/outils/qr-code':                 '/tools/qr-code',
  '/mentions-legales':               '/legal-notice',
  '/politique-de-confidentialite':   '/privacy-policy',
  '/simulateurs/rente-capital':      '/simulators/annuity-vs-withdrawal',
  '/simulateurs/inflation':          '/simulators/inflation',
  '/simulateurs/cnav':               '/simulators/french-pension',
  '/simulateurs/retraite-luxembourg': '/simulators/luxembourg-pension',
  '/connexion':                      '/login',
  '/compte':                         '/account',
  '/pro':                            '/pro',
  '/merci':                          '/thank-you',
  '/merci-pro':                      '/thank-you-pro',
  '/comparatifs':                    '/comparisons',
  '/lexique':                        '/glossary',
  '/simulateurs/donation':           '/simulators/donation',
  '/simulateurs/pension-reversion':  '/simulators/pension-reversion',
  '/contact':                        '/contact',
};

// Sens inverse : segment EN → chemin canonique FR.
const FR_PATH_MAP = Object.fromEntries(
  Object.entries(EN_PATH_MAP).map(([fr, en]) => [en, fr])
);

// Routes disponibles en anglais (clés FR canoniques).
export const EN_ROUTES = new Set(Object.keys(EN_PATH_MAP));

// Routes disponibles en Suisse.
export const CH_ROUTES = new Set([
  '/',
  '/simulateurs/lpp-deuxieme-pilier',
  '/simulateurs/impot-revenu-ch',
  '/simulateurs/prevoyance-ch',
  // Simulateurs universels disponibles sous /ch/
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
  '/ch/guides',
  '/ch/lexique',
]);

// Routes disponibles en Belgique (certaines avec règles belges spécifiques,
// d'autres partagées avec la version française).
export const BE_ROUTES = new Set([
  '/',
  // Universels (même logique que FR)
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
  // Belges — même route canonique, composant adapté
  '/simulateurs/impot-revenu',
  '/simulateurs/succession',
  // Belges uniquement
  '/simulateurs/pension-legale',
  // Légal
  '/mentions-legales',
  '/politique-de-confidentialite',
  // Contenu éditorial BE
  '/be/guides',
  '/be/lexique',
]);

// Routes disponibles au Luxembourg (certaines avec règles luxembourgeoises
// spécifiques, d'autres partagées avec la version française — devise EUR).
export const LU_ROUTES = new Set([
  '/',
  // Universels (même logique que FR)
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
  // Luxembourgeois uniquement
  '/simulateurs/impot-revenu-lu',
  '/simulateurs/succession-lu',
  '/simulateurs/retraite-luxembourg',
  // Légal
  '/mentions-legales',
  '/politique-de-confidentialite',
  // Contenu éditorial LU
  '/lu/guides',
  '/lu/lexique',
]);

// Routes disponibles au Québec (certaines avec règles québécoises
// spécifiques, d'autres partagées avec la version française — devise CAD).
export const QC_ROUTES = new Set([
  '/',
  // Universels (même logique que FR)
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
  // Québécois uniquement
  '/simulateurs/retraite-quebec',
  // Légal
  '/mentions-legales',
  '/politique-de-confidentialite',
  // Contenu éditorial QC
  '/qc/guides',
  '/qc/lexique',
]);

// Retourne le chemin localisé EN pour une route canonique FR.
// localePath('/simulateurs/epargne', 'en') → '/en/simulators/savings'
export function localePath(route, locale) {
  if (locale === DEFAULT_LOCALE || !EN_ROUTES.has(route)) return route;
  const enSeg = EN_PATH_MAP[route];
  return enSeg === '/' ? '/en' : `/en${enSeg}`;
}

// Retourne le chemin FR canonique depuis n'importe quel URL (FR, /en/ ou /be/).
// canonicalPath('/be/simulateurs/epargne')    → '/simulateurs/epargne'
// canonicalPath('/en/simulators/savings')     → '/simulateurs/epargne'
// canonicalPath('/simulateurs/epargne')       → '/simulateurs/epargne'
export function canonicalPath(pathname) {
  // Retirer le préfixe pays suisse
  if (pathname === '/ch') return '/';
  if (pathname.startsWith('/ch/')) return pathname.slice(3);
  // Retirer le préfixe pays belge
  if (pathname === '/be') return '/';
  if (pathname.startsWith('/be/')) return pathname.slice(3);
  // Retirer le préfixe pays luxembourgeois
  if (pathname === '/lu') return '/';
  if (pathname.startsWith('/lu/')) return pathname.slice(3);
  // Retirer le préfixe pays québécois
  if (pathname === '/qc') return '/';
  if (pathname.startsWith('/qc/')) return pathname.slice(3);
  // Retirer le préfixe langue anglaise
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) {
    const enSeg = pathname.slice(3);
    return FR_PATH_MAP[enSeg] || enSeg;
  }
  return pathname;
}

// Retourne le chemin préfixé /be/ ou /ch/ pour une route canonique FR.
// countryPath('/simulateurs/epargne', 'be') → '/be/simulateurs/epargne'
// countryPath('/simulateurs/epargne', 'fr') → '/simulateurs/epargne'
// countryPath('/simulateurs/lpp-deuxieme-pilier', 'ch') → '/ch/simulateurs/lpp-deuxieme-pilier'
export function countryPath(route, country) {
  if (country === 'ch') {
    if (!CH_ROUTES.has(route)) return route;
    return route === '/' ? '/ch' : `/ch${route}`;
  }
  if (country === 'lu') {
    if (!LU_ROUTES.has(route)) return route;
    return route === '/' ? '/lu' : `/lu${route}`;
  }
  if (country === 'qc') {
    if (!QC_ROUTES.has(route)) return route;
    return route === '/' ? '/qc' : `/qc${route}`;
  }
  if (country === 'fr' || !BE_ROUTES.has(route)) return route;
  return route === '/' ? '/be' : `/be${route}`;
}

// Retourne le chemin vers la locale alternative pour l'URL courante (FR↔EN).
export function alternatePath(pathname, currentLocale) {
  const canon = canonicalPath(pathname);
  if (!EN_ROUTES.has(canon)) return null;
  return currentLocale === 'en' ? canon : localePath(canon, 'en');
}

// Retourne le chemin vers le pays alternatif (FR↔BE) pour l'URL courante.
// countryAlternatePath('/simulateurs/epargne', 'fr') → '/be/simulateurs/epargne'
// countryAlternatePath('/be/simulateurs/epargne', 'be') → '/simulateurs/epargne'
export function countryAlternatePath(pathname, currentCountry) {
  const canon = canonicalPath(pathname);
  if (!BE_ROUTES.has(canon)) return null;
  return currentCountry === 'be' ? canon : countryPath(canon, 'be');
}

// Retourne le chemin vers le pays alternatif (FR↔CH) pour l'URL courante.
// chCountryAlternatePath('/simulateurs/lpp-deuxieme-pilier', 'fr') → '/ch/simulateurs/lpp-deuxieme-pilier'
// chCountryAlternatePath('/ch/simulateurs/lpp-deuxieme-pilier', 'ch') → '/simulateurs/lpp-deuxieme-pilier'
export function chCountryAlternatePath(pathname, currentCountry) {
  const canon = canonicalPath(pathname);
  if (!CH_ROUTES.has(canon)) return null;
  return currentCountry === 'ch' ? canon : countryPath(canon, 'ch');
}

// Retourne le chemin vers le pays alternatif (FR↔LU) pour l'URL courante.
// luCountryAlternatePath('/simulateurs/retraite-luxembourg', 'fr') → '/lu/simulateurs/retraite-luxembourg'
// luCountryAlternatePath('/lu/simulateurs/retraite-luxembourg', 'lu') → '/simulateurs/retraite-luxembourg'
export function luCountryAlternatePath(pathname, currentCountry) {
  const canon = canonicalPath(pathname);
  if (!LU_ROUTES.has(canon)) return null;
  return currentCountry === 'lu' ? canon : countryPath(canon, 'lu');
}

// Retourne le chemin vers le pays alternatif (FR↔QC) pour l'URL courante.
// qcCountryAlternatePath('/simulateurs/retraite-quebec', 'fr') → '/qc/simulateurs/retraite-quebec'
// qcCountryAlternatePath('/qc/simulateurs/retraite-quebec', 'qc') → '/simulateurs/retraite-quebec'
export function qcCountryAlternatePath(pathname, currentCountry) {
  const canon = canonicalPath(pathname);
  if (!QC_ROUTES.has(canon)) return null;
  return currentCountry === 'qc' ? canon : countryPath(canon, 'qc');
}
