// i18n minimal du builder : fr par défaut, en préparé (non traduit).
// Même mécanique de clés pointées que le site principal (src/i18n/index.js).

import fr from './fr';
import en from './en';

const DICTIONARIES: Record<string, unknown> = { fr, en };
let locale = 'fr';

export function setLocale(l: 'fr' | 'en') {
  locale = l;
}

function resolve(dict: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>(
    (o, k) => (o == null ? undefined : (o as Record<string, unknown>)[k]),
    dict,
  );
}

export function t(key: string): string {
  const v = resolve(DICTIONARIES[locale], key) ?? resolve(DICTIONARIES.fr, key);
  return typeof v === 'string' ? v : key;
}
