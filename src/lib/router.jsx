// Seam de routing — point d'import unique des primitives de navigation.
export { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { localeFromPath, countryFromPath } from "../i18n/config.js";
import { localizedHref } from "../i18n/paths.js";

// Lien interne respectant le contexte pays/langue courant : préfixe /en/, /ch/,
// /be/, /lu/ ou /qc/ automatique quand la route existe dans ce contexte, et
// préfixe conservé pour les simulateurs propres à un pays (voir localizedHref).
export function LocaleLink({ to, children, ...props }) {
  const { pathname } = useLocation();
  return <Link to={localizedHref(to, pathname)} {...props}>{children}</Link>;
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
