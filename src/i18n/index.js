import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_LOCALE, localeFromPath } from './config.js';
import fr from './fr.js';

// Registre des dictionnaires. Ajouter une langue : importer son fichier et
// l'enregistrer ici (ex. en: enDict).
const DICTIONARIES = { fr };

// Résout une clé pointée ("nav.blog") dans un objet imbriqué.
function resolve(dict, key) {
  return String(key).split('.').reduce((o, k) => (o == null ? undefined : o[k]), dict);
}

// Traduit une clé pour une locale donnée. Replis successifs : locale demandée →
// français → clé brute (jamais d'écran vide en cas de clé manquante).
export function translate(locale, key) {
  const v = resolve(DICTIONARIES[locale] || DICTIONARIES[DEFAULT_LOCALE], key);
  if (v != null) return v;
  const fb = resolve(DICTIONARIES[DEFAULT_LOCALE], key);
  return fb != null ? fb : key;
}

// Hook de traduction. La locale courante est déduite de l'URL (sous-chemin),
// avec le français par défaut. Usage : const { t } = useTranslation(); t('nav.blog').
export function useTranslation() {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const t = useMemo(() => (key) => translate(locale, key), [locale]);
  return { t, locale };
}
