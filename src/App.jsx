import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VideoRecordingProvider } from "./contexts/VideoRecordingContext";
import VideoRecordingToast from "./components/VideoRecordingToast";
import Home from "./pages/Home.jsx";

// Pages chargées à la demande (code splitting) : chaque simulateur devient son
// propre chunk, téléchargé seulement quand l'utilisateur visite la route. La page
// d'accueil (Home) reste en import direct pour un premier rendu immédiat.
const SimulateurRetraite      = lazy(() => import("./SimulateurRetraite.jsx"));
const MentionsLegales         = lazy(() => import("./pages/MentionsLegales.jsx"));
const PolitiqueConfidentialite = lazy(() => import("./pages/PolitiqueConfidentialite.jsx"));
const APropos                 = lazy(() => import("./pages/APropos.jsx"));
const Blog                    = lazy(() => import("./pages/Blog.jsx"));
const Article                 = lazy(() => import("./pages/Article.jsx"));
// Retraite
const Cnav                = lazy(() => import("./pages/simulateurs/Cnav.jsx"));
const FonctionPublique    = lazy(() => import("./pages/simulateurs/FonctionPublique.jsx"));
const Independants        = lazy(() => import("./pages/simulateurs/Independants.jsx"));
const Ircantec            = lazy(() => import("./pages/simulateurs/Ircantec.jsx"));
const RetraiteProgressive = lazy(() => import("./pages/simulateurs/RetraiteProgressive.jsx"));
const Cnavpl              = lazy(() => import("./pages/simulateurs/Cnavpl.jsx"));
const Msa                 = lazy(() => import("./pages/simulateurs/Msa.jsx"));
// Immobilier
const EmpruntImmobilier = lazy(() => import("./pages/simulateurs/EmpruntImmobilier.jsx"));
const RendementLocatif  = lazy(() => import("./pages/simulateurs/RendementLocatif.jsx"));
const Ptz               = lazy(() => import("./pages/simulateurs/Ptz.jsx"));
// Impôts
const ImpotRevenu = lazy(() => import("./pages/simulateurs/ImpotRevenu.jsx"));
const PlusValue   = lazy(() => import("./pages/simulateurs/PlusValue.jsx"));
// Finances
const Budget     = lazy(() => import("./pages/simulateurs/Budget.jsx"));
const Salaire    = lazy(() => import("./pages/simulateurs/Salaire.jsx"));
const Epargne    = lazy(() => import("./pages/simulateurs/Epargne.jsx"));
const Fire       = lazy(() => import("./pages/simulateurs/Fire.jsx"));
const Patrimoine = lazy(() => import("./pages/simulateurs/Patrimoine.jsx"));
// Vie & Temps
const CoutEnHeures  = lazy(() => import("./pages/simulateurs/CoutEnHeures.jsx"));
const VieEnSemaines = lazy(() => import("./pages/simulateurs/VieEnSemaines.jsx"));
const Comparateur   = lazy(() => import("./pages/simulateurs/Comparateur.jsx"));

// Fallback affiché le temps de charger le chunk d'une route.
function RouteFallback() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif" }}>
      <span style={{ fontSize: 14, opacity: 0.7 }}>Chargement…</span>
    </div>
  );
}

export default function App() {
  return (
    <VideoRecordingProvider>
    <BrowserRouter>
      <VideoRecordingToast />
      <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Retraite */}
        <Route path="/simulateurs/agirc-arrco" element={<SimulateurRetraite />} />
        <Route path="/simulateurs/cnav" element={<Cnav />} />
        <Route path="/simulateurs/fonction-publique" element={<FonctionPublique />} />
        <Route path="/simulateurs/independants" element={<Independants />} />
        <Route path="/simulateurs/ircantec" element={<Ircantec />} />
        <Route path="/simulateurs/retraite-progressive" element={<RetraiteProgressive />} />
        <Route path="/simulateurs/cnavpl" element={<Cnavpl />} />
        <Route path="/simulateurs/msa" element={<Msa />} />
        {/* Immobilier */}
        <Route path="/simulateurs/emprunt-immobilier" element={<EmpruntImmobilier />} />
        <Route path="/simulateurs/rendement-locatif" element={<RendementLocatif />} />
        <Route path="/simulateurs/ptz" element={<Ptz />} />
        {/* Impôts */}
        <Route path="/simulateurs/impot-revenu" element={<ImpotRevenu />} />
        <Route path="/simulateurs/plus-value-immobiliere" element={<PlusValue />} />
        {/* Finances */}
        <Route path="/simulateurs/budget" element={<Budget />} />
        <Route path="/simulateurs/salaire" element={<Salaire />} />
        <Route path="/simulateurs/epargne" element={<Epargne />} />
        <Route path="/simulateurs/fire" element={<Fire />} />
        <Route path="/simulateurs/patrimoine" element={<Patrimoine />} />
        {/* Vie & Temps */}
        <Route path="/simulateurs/cout-en-heures" element={<CoutEnHeures />} />
        <Route path="/simulateurs/vie-en-semaines" element={<VieEnSemaines />} />
        {/* Comparateur */}
        <Route path="/simulateurs/comparateur" element={<Comparateur />} />
        {/* Blog */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Article />} />
        {/* Légal */}
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="/a-propos" element={<APropos />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
    </VideoRecordingProvider>
  );
}
