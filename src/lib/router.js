// Seam de routing — point d'import unique des primitives de navigation.
//
// Aujourd'hui : simple ré-export de react-router-dom → comportement strictement
// identique à l'existant. Les composants réutilisables (Navbar, Footer, ui…)
// importent leurs primitives ICI plutôt que directement depuis react-router-dom.
//
// Objectif migration Astro : quand ces composants seront montés en « islands »
// (hors d'un Router react-router), il suffira de remplacer ces ré-exports par des
// implémentations compatibles (ex. <a> natif + location dérivée de window) — sans
// toucher au code des composants.
export { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
