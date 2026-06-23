// Devises supportées par les simulateurs universels (épargne, FIRE, budget,
// patrimoine, coût en heures, crédit conso). Les simulateurs spécifiquement
// français (retraite Agirc-Arrco/CNAV/…, impôt FR, PER, assurance-vie) restent
// en euros et n'utilisent PAS ce module.
//
// Le formatage s'appuie sur Intl.NumberFormat : placement du symbole, séparateurs
// et décimales sont gérés automatiquement selon la locale de la devise
// (ex. « 12 345 € » en France, « $12,345 » aux USA, « 12'345 CHF » en Suisse).

export const CURRENCIES = {
  EUR: { code: 'EUR', locale: 'fr-FR', symbol: '€',   label: 'Euro' },
  USD: { code: 'USD', locale: 'en-US', symbol: '$',   label: 'Dollar US' },
  GBP: { code: 'GBP', locale: 'en-GB', symbol: '£',   label: 'Livre sterling' },
  CHF: { code: 'CHF', locale: 'de-CH', symbol: 'CHF', label: 'Franc suisse' },
  CAD: { code: 'CAD', locale: 'en-CA', symbol: 'CA$', label: 'Dollar canadien' },
  AUD: { code: 'AUD', locale: 'en-AU', symbol: 'A$',  label: 'Dollar australien' },
  JPY: { code: 'JPY', locale: 'ja-JP', symbol: '¥',   label: 'Yen', decimals: 0 },
  SEK: { code: 'SEK', locale: 'sv-SE', symbol: 'kr',  label: 'Couronne suédoise' },
  NOK: { code: 'NOK', locale: 'nb-NO', symbol: 'kr',  label: 'Couronne norvégienne' },
  DKK: { code: 'DKK', locale: 'da-DK', symbol: 'kr',  label: 'Couronne danoise' },
  PLN: { code: 'PLN', locale: 'pl-PL', symbol: 'zł',  label: 'Zloty' },
  CZK: { code: 'CZK', locale: 'cs-CZ', symbol: 'Kč',  label: 'Couronne tchèque' },
  BRL: { code: 'BRL', locale: 'pt-BR', symbol: 'R$',  label: 'Real brésilien' },
  MXN: { code: 'MXN', locale: 'es-MX', symbol: 'MX$', label: 'Peso mexicain' },
  INR: { code: 'INR', locale: 'en-IN', symbol: '₹',   label: 'Roupie indienne' },
  ZAR: { code: 'ZAR', locale: 'en-ZA', symbol: 'R',   label: 'Rand sud-africain' },
  SGD: { code: 'SGD', locale: 'en-SG', symbol: 'S$',  label: 'Dollar de Singapour' },
  HKD: { code: 'HKD', locale: 'en-HK', symbol: 'HK$', label: 'Dollar de Hong Kong' },
  NZD: { code: 'NZD', locale: 'en-NZ', symbol: 'NZ$', label: 'Dollar néo-zélandais' },
  AED: { code: 'AED', locale: 'ar-AE', symbol: 'AED', label: 'Dirham (EAU)' },
};

export const DEFAULT_CURRENCY = 'EUR';

// Pays (ISO 3166-1 alpha-2) → devise. La zone euro partage EUR.
export const COUNTRY_TO_CURRENCY = {
  // Zone euro
  FR: 'EUR', BE: 'EUR', DE: 'EUR', ES: 'EUR', IT: 'EUR', PT: 'EUR', NL: 'EUR',
  LU: 'EUR', IE: 'EUR', AT: 'EUR', FI: 'EUR', GR: 'EUR', SK: 'EUR', SI: 'EUR',
  EE: 'EUR', LV: 'EUR', LT: 'EUR', CY: 'EUR', MT: 'EUR', HR: 'EUR', MC: 'EUR',
  // Reste du monde
  US: 'USD', GB: 'GBP', CH: 'CHF', CA: 'CAD', AU: 'AUD', NZ: 'NZD', JP: 'JPY',
  SE: 'SEK', NO: 'NOK', DK: 'DKK', PL: 'PLN', CZ: 'CZK', BR: 'BRL', MX: 'MXN',
  IN: 'INR', ZA: 'ZAR', SG: 'SGD', HK: 'HKD', AE: 'AED',
};

export function currencyForCountry(country) {
  return COUNTRY_TO_CURRENCY[String(country || '').toUpperCase()] || DEFAULT_CURRENCY;
}

// Fuseaux horaires → pays (ISO) pour les zones les plus courantes. Sert de repli
// quand la langue du navigateur ne précise pas la région (ex. « en » sans pays).
const TZ_TO_COUNTRY = {
  'Europe/Paris': 'FR', 'Europe/Brussels': 'BE', 'Europe/Berlin': 'DE',
  'Europe/Madrid': 'ES', 'Europe/Rome': 'IT', 'Europe/Lisbon': 'PT',
  'Europe/Amsterdam': 'NL', 'Europe/Luxembourg': 'LU', 'Europe/Dublin': 'IE',
  'Europe/Vienna': 'AT', 'Europe/Helsinki': 'FI', 'Europe/Athens': 'GR',
  'Europe/London': 'GB', 'Europe/Zurich': 'CH', 'Europe/Stockholm': 'SE',
  'Europe/Oslo': 'NO', 'Europe/Copenhagen': 'DK', 'Europe/Warsaw': 'PL',
  'Europe/Prague': 'CZ',
  'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US',
  'America/Los_Angeles': 'US', 'America/Phoenix': 'US', 'America/Anchorage': 'US',
  'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Edmonton': 'CA',
  'America/Sao_Paulo': 'BR', 'America/Mexico_City': 'MX',
  'Asia/Tokyo': 'JP', 'Asia/Singapore': 'SG', 'Asia/Hong_Kong': 'HK',
  'Asia/Kolkata': 'IN', 'Asia/Dubai': 'AE',
  'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Perth': 'AU',
  'Pacific/Auckland': 'NZ', 'Africa/Johannesburg': 'ZA',
};

// Pays probable du visiteur déduit SANS appel réseau : CH ou BE selon la région
// de la langue navigateur (ex. « fr-CH ») ou le fuseau horaire. Renvoie null si
// aucune correspondance CH/BE (FR reste le défaut côté routing).
export function guessCountryFromBrowser() {
  try {
    const langs = (typeof navigator !== 'undefined' && (navigator.languages || [navigator.language])) || [];
    for (const l of langs) {
      const region = String(l || '').split('-')[1]?.toUpperCase();
      if (region === 'CH') return 'ch';
      if (region === 'BE') return 'be';
    }
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz === 'Europe/Zurich') return 'ch';
    if (tz === 'Europe/Brussels') return 'be';
  } catch { /* environnement sans navigator/Intl */ }
  return null;
}

// Devise probable du visiteur, déduite côté navigateur SANS appel réseau :
//  1. région de la/les langue(s) (ex. « en-US » → US) ;
//  2. sinon, fuseau horaire (ex. « America/New_York » → US) ;
//  3. sinon, euro.
export function guessCurrencyFromBrowser() {
  try {
    const langs = (typeof navigator !== 'undefined' && (navigator.languages || [navigator.language])) || [];
    for (const l of langs) {
      const region = String(l || '').split('-')[1];
      if (region && COUNTRY_TO_CURRENCY[region.toUpperCase()]) {
        return COUNTRY_TO_CURRENCY[region.toUpperCase()];
      }
    }
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const cc = TZ_TO_COUNTRY[tz];
    if (cc && COUNTRY_TO_CURRENCY[cc]) return COUNTRY_TO_CURRENCY[cc];
  } catch { /* environnement sans navigator/Intl : repli euro */ }
  return DEFAULT_CURRENCY;
}

// Formate un montant dans la devise donnée. `decimals` force le nombre de
// décimales (par défaut : 0, sauf devises sans subdivision comme le yen).
export function formatMoney(n, currencyCode = DEFAULT_CURRENCY, decimals) {
  const c = CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY];
  const d = decimals !== undefined ? decimals : (c.decimals !== undefined ? c.decimals : 0);
  const value = isNaN(n) ? 0 : n;
  try {
    return new Intl.NumberFormat(c.locale, {
      style: 'currency', currency: c.code,
      minimumFractionDigits: d, maximumFractionDigits: d,
    }).format(value);
  } catch {
    // Repli si la devise n'est pas reconnue par l'environnement.
    return `${value.toLocaleString(c.locale)} ${c.symbol}`;
  }
}

// Comme formatMoney mais avec signe explicite pour les variations (+/−).
export function signMoney(n, currencyCode = DEFAULT_CURRENCY, decimals) {
  return (n > 0 ? '+' : '') + formatMoney(n, currencyCode, decimals);
}

// ─── Devise active (état module) ──────────────────────────────────────────────
// Permet aux helpers `fmtCur` / `activeSymbol` de formater depuis n'importe quel
// composant (y compris les sous-composants) sans passer par un hook, exactement
// comme l'ancien `fmtEur`. Le CurrencyProvider met cette valeur à jour au rendu ;
// les pages s'abonnent au contexte (useMoney) pour déclencher un re-rendu — ce
// re-rendu propage la nouvelle devise jusqu'aux sous-composants.
let _active = DEFAULT_CURRENCY;

export function setActiveCurrency(code) {
  if (CURRENCIES[code]) _active = code;
}
export function getActiveCurrency() {
  return _active;
}
export function activeSymbol() {
  return (CURRENCIES[_active] || CURRENCIES[DEFAULT_CURRENCY]).symbol;
}
export function fmtCur(n, decimals) {
  return formatMoney(n, _active, decimals);
}
export function signCur(n, decimals) {
  return signMoney(n, _active, decimals);
}
