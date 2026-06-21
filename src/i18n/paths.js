import { DEFAULT_LOCALE } from './config.js';

// Mapping : chemin canonique FR → segment URL anglais (après /en).
// Source de vérité pour les deux sens de la traduction d'URL.
const EN_PATH_MAP = {
  '/':                               '/',
  '/simulateurs/epargne':            '/simulators/savings',
  '/simulateurs/fire':               '/simulators/fire',
  '/simulateurs/budget':             '/simulators/budget',
  '/simulateurs/patrimoine':         '/simulators/wealth',
  '/simulateurs/cout-en-heures':     '/simulators/cost-in-hours',
  '/simulateurs/credit-conso':       '/simulators/consumer-credit',
  '/simulateurs/comparateur':        '/simulators/comparator',
  '/outils/qr-code':                 '/tools/qr-code',
  '/mentions-legales':               '/legal-notice',
  '/politique-de-confidentialite':   '/privacy-policy',
  '/connexion':                      '/login',
  '/compte':                         '/account',
  '/pro':                            '/pro',
  '/merci':                          '/thank-you',
  '/merci-pro':                      '/thank-you-pro',
};

// Sens inverse : segment EN → chemin canonique FR.
const FR_PATH_MAP = Object.fromEntries(
  Object.entries(EN_PATH_MAP).map(([fr, en]) => [en, fr])
);

// Routes disponibles en anglais (clés FR canoniques).
export const EN_ROUTES = new Set(Object.keys(EN_PATH_MAP));

// Routes disponibles en Belgique (même contenu que FR pour l'instant ;
// des règles belges spécifiques seront ajoutées par simulateur par la suite).
export const BE_ROUTES = new Set([
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
  '/simulateurs/succession',
  '/simulateurs/assurance-vie',
  '/mentions-legales',
  '/politique-de-confidentialite',
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
  // Retirer le préfixe pays belge
  if (pathname === '/be') return '/';
  if (pathname.startsWith('/be/')) return pathname.slice(3);
  // Retirer le préfixe langue anglaise
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) {
    const enSeg = pathname.slice(3);
    return FR_PATH_MAP[enSeg] || enSeg;
  }
  return pathname;
}

// Retourne le chemin préfixé /be/ pour une route canonique FR.
// countryPath('/simulateurs/epargne', 'be') → '/be/simulateurs/epargne'
// countryPath('/simulateurs/epargne', 'fr') → '/simulateurs/epargne'
export function countryPath(route, country) {
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
