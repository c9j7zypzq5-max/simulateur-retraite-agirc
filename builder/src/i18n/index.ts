// i18n du builder : fr par défaut, en traduit (en.ts). Même mécanique de clés
// pointées que le site principal (src/i18n/index.js). La locale est déterminée
// une fois au chargement du module (avant le rendu React) : préférence
// explicite mémorisée > langue du navigateur > français. La bascule persiste
// puis recharge (t() n'est pas réactif — un rechargement relit tout avec la
// nouvelle locale, sans plomberie d'état).

import fr from './fr';
import en from './en';

const DICTIONARIES: Record<string, unknown> = { fr, en };
const LANG_KEY = 'builder:lang';
type Locale = 'fr' | 'en';

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'fr' || saved === 'en') return saved;
  } catch {
    /* mode privé : on retombe sur la langue du navigateur */
  }
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('en')) {
    return 'en';
  }
  return 'fr';
}

let locale: Locale = detectLocale();

// Reflète la locale sur <html lang> dès le chargement (a11y + SEO).
if (typeof document !== 'undefined') {
  document.documentElement.lang = locale;
}

export function getLocale(): Locale {
  return locale;
}

export function setLocale(l: Locale) {
  locale = l;
}

// Mémorise la langue choisie et recharge pour ré-évaluer tous les t().
export function setLocaleAndReload(l: Locale) {
  try {
    localStorage.setItem(LANG_KEY, l);
  } catch {
    /* mode privé : la bascule ne persistera pas, sans gravité */
  }
  if (typeof window !== 'undefined') window.location.reload();
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
