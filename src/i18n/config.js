// Configuration i18n — fondations pour une future internationalisation.
//
// Principe : le français est la locale par défaut et reste servi à la racine (/).
// Ajouter une langue = (1) créer un dictionnaire dans ce dossier (ex. en.js),
// (2) l'enregistrer dans DICTIONARIES (src/i18n/index.js), (3) l'ajouter à LOCALES.
//
// Stratégie d'URL retenue (à implémenter lors de la migration du routing) :
// sous-chemin par locale, ex. /en/simulateurs/... — le français à la racine.
// La plomberie hreflang (api/_routes.js → hreflangLinks) s'active automatiquement
// dès qu'une 2e locale est ajoutée.

export const DEFAULT_LOCALE = 'fr';

// Locales actives. Étendre ici quand une traduction est prête : ['fr', 'en'].
export const LOCALES = ['fr'];

// Déduit la locale d'un chemin d'URL (premier segment). Le français (défaut) n'a
// pas de préfixe : seul un préfixe d'une AUTRE locale connue est reconnu.
export function localeFromPath(pathname = '') {
  const seg = (pathname || '').split('/')[1];
  return LOCALES.includes(seg) && seg !== DEFAULT_LOCALE ? seg : DEFAULT_LOCALE;
}
