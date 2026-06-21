export const DEFAULT_LOCALE = 'fr';

// Locales actives : 'fr' = défaut (pas de préfixe), 'en' = préfixé /en/.
export const LOCALES = ['fr', 'en'];

// Pays supportés : code → métadonnées affichées dans le sélecteur.
// Ajouter un pays ici pour activer son préfixe d'URL (/be/, /uk/, …).
export const COUNTRIES = {
  fr: { lang: 'fr', label: 'France',   flag: '🇫🇷', locale: 'fr' },
  be: { lang: 'fr', label: 'Belgique', flag: '🇧🇪', locale: 'fr' },
};
export const DEFAULT_COUNTRY = 'fr';
export const COUNTRY_CODES = Object.keys(COUNTRIES); // ['fr', 'be']

// Déduit la locale depuis le premier segment d'URL. Seul 'en' diffère du défaut.
export function localeFromPath(pathname = '') {
  const seg = (pathname || '').split('/')[1];
  return LOCALES.includes(seg) && seg !== DEFAULT_LOCALE ? seg : DEFAULT_LOCALE;
}

// Déduit le pays depuis le premier segment d'URL. Seul 'be' (etc.) diffère du défaut.
// '/be/simulateurs/epargne' → 'be'    '/simulateurs/epargne' → 'fr'
export function countryFromPath(pathname = '') {
  const seg = (pathname || '').split('/')[1];
  return COUNTRY_CODES.includes(seg) && seg !== DEFAULT_COUNTRY ? seg : DEFAULT_COUNTRY;
}
