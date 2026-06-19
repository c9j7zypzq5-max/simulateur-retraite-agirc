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

// Retourne le chemin localisé pour une route canonique (en FR) et une locale.
// localePath('/simulateurs/epargne', 'en') → '/en/simulators/savings'
// localePath('/simulateurs/epargne', 'fr') → '/simulateurs/epargne'
export function localePath(route, locale) {
  if (locale === DEFAULT_LOCALE || !EN_ROUTES.has(route)) return route;
  const enSeg = EN_PATH_MAP[route];
  return enSeg === '/' ? '/en' : `/en${enSeg}`;
}

// Retourne le chemin canonique FR depuis n'importe quel chemin (FR ou EN).
// canonicalPath('/en/simulators/savings') → '/simulateurs/epargne'
// canonicalPath('/simulateurs/epargne')   → '/simulateurs/epargne'
// canonicalPath('/en')                    → '/'
export function canonicalPath(pathname) {
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) {
    const enSeg = pathname.slice(3); // '/simulators/savings'
    return FR_PATH_MAP[enSeg] || enSeg;
  }
  return pathname;
}

// Retourne le chemin vers la locale alternative pour l'URL courante.
// alternatePath('/simulateurs/epargne', 'fr') → '/en/simulators/savings'
// alternatePath('/en/simulators/savings', 'en') → '/simulateurs/epargne'
export function alternatePath(pathname, currentLocale) {
  const canon = canonicalPath(pathname);
  if (!EN_ROUTES.has(canon)) return null;
  return currentLocale === 'en' ? canon : localePath(canon, 'en');
}
