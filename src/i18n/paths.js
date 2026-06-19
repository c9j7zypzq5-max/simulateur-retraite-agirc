import { DEFAULT_LOCALE } from './config.js';

// Routes disponibles en anglais (/en/...). Source unique de vérité côté client —
// miroir de EN_ROUTES dans api/_routes.js (évite d'importer le module Node en prod).
export const EN_ROUTES = new Set([
  '/',
  '/simulateurs/epargne',
  '/simulateurs/fire',
  '/simulateurs/budget',
  '/simulateurs/patrimoine',
  '/simulateurs/cout-en-heures',
  '/simulateurs/credit-conso',
  '/simulateurs/comparateur',
  '/outils/qr-code',
  '/mentions-legales',
  '/politique-de-confidentialite',
  '/connexion',
  '/compte',
  '/pro',
  '/merci',
  '/merci-pro',
]);

// Retourne le chemin localisé pour une route canonique (en FR) et une locale.
// localePath('/simulateurs/fire', 'en') → '/en/simulateurs/fire'
// localePath('/simulateurs/fire', 'fr') → '/simulateurs/fire'
export function localePath(route, locale) {
  if (locale === DEFAULT_LOCALE || !EN_ROUTES.has(route)) return route;
  return `/en${route === '/' ? '' : route}`;
}

// Retourne le chemin canonique FR depuis un chemin potentiellement préfixé /en.
// canonicalPath('/en/simulateurs/fire') → '/simulateurs/fire'
// canonicalPath('/simulateurs/fire')    → '/simulateurs/fire'
export function canonicalPath(pathname) {
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice(3);
  return pathname;
}

// Retourne le chemin vers la locale alternative pour l'URL courante.
// alternatePath('/simulateurs/fire', 'fr') → '/en/simulateurs/fire'
// alternatePath('/en/simulateurs/fire', 'en') → '/simulateurs/fire'
export function alternatePath(pathname, currentLocale) {
  const canon = canonicalPath(pathname);
  if (!EN_ROUTES.has(canon)) return null; // pas de version EN pour cette route
  return currentLocale === 'en' ? canon : localePath(canon, 'en');
}
