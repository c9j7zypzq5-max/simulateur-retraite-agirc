// Préchargement du chunk d'une route au survol d'un lien : la page est déjà en
// cache au moment du clic → navigation quasi instantanée. Les imports utilisent
// les mêmes spécificateurs que React.lazy (App.jsx), donc Vite mutualise le chunk.

const importers = {
  "/simulateurs/agirc-arrco": () => import("../SimulateurRetraite.jsx"),
  "/simulateurs/cnav": () => import("../pages/simulateurs/Cnav.jsx"),
  "/simulateurs/fonction-publique": () => import("../pages/simulateurs/FonctionPublique.jsx"),
  "/simulateurs/independants": () => import("../pages/simulateurs/Independants.jsx"),
  "/simulateurs/ircantec": () => import("../pages/simulateurs/Ircantec.jsx"),
  "/simulateurs/retraite-progressive": () => import("../pages/simulateurs/RetraiteProgressive.jsx"),
  "/simulateurs/cnavpl": () => import("../pages/simulateurs/Cnavpl.jsx"),
  "/simulateurs/msa": () => import("../pages/simulateurs/Msa.jsx"),
  "/simulateurs/per": () => import("../pages/simulateurs/Per.jsx"),
  "/simulateurs/emprunt-immobilier": () => import("../pages/simulateurs/EmpruntImmobilier.jsx"),
  "/simulateurs/rendement-locatif": () => import("../pages/simulateurs/RendementLocatif.jsx"),
  "/simulateurs/ptz": () => import("../pages/simulateurs/Ptz.jsx"),
  "/simulateurs/impot-revenu": () => import("../pages/simulateurs/ImpotRevenu.jsx"),
  "/simulateurs/plus-value-immobiliere": () => import("../pages/simulateurs/PlusValue.jsx"),
  "/simulateurs/budget": () => import("../pages/simulateurs/Budget.jsx"),
  "/simulateurs/salaire": () => import("../pages/simulateurs/Salaire.jsx"),
  "/simulateurs/epargne": () => import("../pages/simulateurs/Epargne.jsx"),
  "/simulateurs/fire": () => import("../pages/simulateurs/Fire.jsx"),
  "/simulateurs/patrimoine": () => import("../pages/simulateurs/Patrimoine.jsx"),
  "/simulateurs/comparateur": () => import("../pages/simulateurs/Comparateur.jsx"),
  "/simulateurs/assurance-vie": () => import("../pages/simulateurs/AssuranceVie.jsx"),
  "/simulateurs/credit-conso": () => import("../pages/simulateurs/CreditConso.jsx"),
  "/simulateurs/cout-en-heures": () => import("../pages/simulateurs/CoutEnHeures.jsx"),
  "/simulateurs/vie-en-semaines": () => import("../pages/simulateurs/VieEnSemaines.jsx"),
  "/blog": () => import("../pages/Blog.jsx"),
  "/lexique": () => import("../pages/Lexique.jsx"),
  "/guides": () => import("../pages/Guides.jsx"),
};

const done = new Set();

export function prefetchRoute(path) {
  const fn = importers[path];
  if (fn && !done.has(path)) {
    done.add(path);
    fn().catch(() => done.delete(path));
  }
}
