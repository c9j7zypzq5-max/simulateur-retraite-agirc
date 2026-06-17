import { useMemo } from 'react';
import { useLocation } from '../lib/router.js';
import { DEFAULT_LOCALE, localeFromPath } from './config.js';
import fr from './fr.js';
import en from './en.js';

const DICTIONARIES = { fr, en };

// Résout une clé pointée ("nav.blog") dans un objet imbriqué.
function resolve(dict, key) {
  return String(key).split('.').reduce((o, k) => (o == null ? undefined : o[k]), dict);
}

// Traduit une clé pour une locale donnée. Replis successifs : locale demandée →
// français → clé brute.
export function translate(locale, key) {
  const v = resolve(DICTIONARIES[locale] || DICTIONARIES[DEFAULT_LOCALE], key);
  if (v != null) return v;
  const fb = resolve(DICTIONARIES[DEFAULT_LOCALE], key);
  return fb != null ? fb : key;
}

// Hook de traduction. Locale déduite de l'URL, français par défaut.
export function useTranslation() {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const t = useMemo(() => (key) => translate(locale, key), [locale]);
  return { t, locale };
}
