// Routes des simulateurs « universels » : calculs purement mathématiques sans
// règle fiscale propre à un pays. Seuls ceux-ci adaptent leur devise via le
// sélecteur. Les simulateurs français (retraite, impôt FR, PER, assurance-vie,
// emprunt/PTZ, plus-value, rendement locatif/LMNP) restent en euros car ils
// embarquent des barèmes nationaux.
export const CURRENCY_AWARE_ROUTES = new Set([
  '/simulateurs/epargne',
  '/simulateurs/fire',
  '/simulateurs/budget',
  '/simulateurs/patrimoine',
  '/simulateurs/cout-en-heures',
  '/simulateurs/credit-conso',
  '/simulateurs/comparateur',
]);

export function isCurrencyAware(pathname) {
  return CURRENCY_AWARE_ROUTES.has(pathname);
}
