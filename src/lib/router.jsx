// Seam de routing — point d'import unique des primitives de navigation.
// Aujourd'hui : ré-export de react-router-dom + helpers i18n.
export { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "../i18n/config.js";
import { localePath, EN_ROUTES } from "../i18n/paths.js";

// Lien interne respectant la locale courante : si l'utilisateur est en /en/...,
// les liens vers des routes disponibles en EN sont automatiquement préfixés /en.
// Remplace <Link> pour tous les liens de navigation inter-pages.
export function LocaleLink({ to, children, ...props }) {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const href = locale !== 'fr' && EN_ROUTES.has(to)
    ? localePath(to, locale)
    : to;
  return <Link to={href} {...props}>{children}</Link>;
}

// Hook qui retourne la locale courante (déduite de l'URL).
export function useLocale() {
  const { pathname } = useLocation();
  return localeFromPath(pathname);
}
