// Seam de routing — point d'import unique des primitives de navigation.
export { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { localeFromPath, countryFromPath } from "../i18n/config.js";
import { localePath, countryPath, EN_ROUTES, BE_ROUTES } from "../i18n/paths.js";

// Lien interne respectant le contexte pays/langue courant.
// En Belgique : préfixe /be/ automatique sur les routes disponibles.
// En anglais  : préfixe /en/ automatique sur les routes disponibles.
export function LocaleLink({ to, children, ...props }) {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const country = countryFromPath(pathname);

  let href = to;
  if (locale === 'en' && EN_ROUTES.has(to)) {
    href = localePath(to, 'en');
  } else if (country === 'be' && BE_ROUTES.has(to)) {
    href = countryPath(to, 'be');
  }
  return <Link to={href} {...props}>{children}</Link>;
}

// Retourne la locale courante (déduite de l'URL : 'fr' ou 'en').
export function useLocale() {
  const { pathname } = useLocation();
  return localeFromPath(pathname);
}

// Retourne le pays courant (déduit de l'URL : 'fr' ou 'be').
export function useCountry() {
  const { pathname } = useLocation();
  return countryFromPath(pathname);
}
