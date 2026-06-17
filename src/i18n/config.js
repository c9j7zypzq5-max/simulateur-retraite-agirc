export const DEFAULT_LOCALE = 'fr';

// Locales actives. Ajouter ici pour activer une langue.
export const LOCALES = ['fr', 'en'];

// Déduit la locale d'un chemin d'URL (premier segment). Le français (défaut) n'a
// pas de préfixe : seul un préfixe d'une AUTRE locale connue est reconnu.
export function localeFromPath(pathname = '') {
  const seg = (pathname || '').split('/')[1];
  return LOCALES.includes(seg) && seg !== DEFAULT_LOCALE ? seg : DEFAULT_LOCALE;
}
