import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { VideoRecordingProvider } from "./contexts/VideoRecordingContext";
import { CurrencyProvider } from "./i18n/CurrencyContext.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import VideoRecordingToast from "./components/VideoRecordingToast";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
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
const Lexique                 = lazy(() => import("./pages/Lexique.jsx"));
const LexiqueTerme            = lazy(() => import("./pages/LexiqueTerme.jsx"));
const Guides                  = lazy(() => import("./pages/Guides.jsx"));
const Guide                   = lazy(() => import("./pages/Guide.jsx"));
const MesSimulations          = lazy(() => import("./pages/MesSimulations.jsx"));
const Methodologie            = lazy(() => import("./pages/Methodologie.jsx"));
const EmbedEpargne            = lazy(() => import("./pages/embed/EmbedEpargne.jsx"));
const EmbedEmprunt            = lazy(() => import("./pages/embed/EmbedEmprunt.jsx"));
const EmbedFire               = lazy(() => import("./pages/embed/EmbedFire.jsx"));
const Widgets                 = lazy(() => import("./pages/Widgets.jsx"));
const NotFound                = lazy(() => import("./pages/NotFound.jsx"));
const Pro                     = lazy(() => import("./pages/Pro.jsx"));
const Merci                   = lazy(() => import("./pages/Merci.jsx"));
const MerciPro                = lazy(() => import("./pages/MerciPro.jsx"));
const Connexion               = lazy(() => import("./pages/Connexion.jsx"));
const Compte                  = lazy(() => import("./pages/Compte.jsx"));
// Retraite
const Cnav                = lazy(() => import("./pages/simulateurs/Cnav.jsx"));
const FonctionPublique    = lazy(() => import("./pages/simulateurs/FonctionPublique.jsx"));
const Independants        = lazy(() => import("./pages/simulateurs/Independants.jsx"));
const Ircantec            = lazy(() => import("./pages/simulateurs/Ircantec.jsx"));
const RetraiteProgressive = lazy(() => import("./pages/simulateurs/RetraiteProgressive.jsx"));
const Cnavpl              = lazy(() => import("./pages/simulateurs/Cnavpl.jsx"));
const Msa                 = lazy(() => import("./pages/simulateurs/Msa.jsx"));
const Per                 = lazy(() => import("./pages/simulateurs/Per.jsx"));
const SyntheseRetraite    = lazy(() => import("./pages/simulateurs/SyntheseRetraite.jsx"));
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
const AssuranceVie = lazy(() => import("./pages/simulateurs/AssuranceVie.jsx"));
const CreditConso  = lazy(() => import("./pages/simulateurs/CreditConso.jsx"));
// Vie & Temps
const CoutEnHeures  = lazy(() => import("./pages/simulateurs/CoutEnHeures.jsx"));
const VieEnSemaines = lazy(() => import("./pages/simulateurs/VieEnSemaines.jsx"));
const Comparateur   = lazy(() => import("./pages/simulateurs/Comparateur.jsx"));
// Outils
const QrCode        = lazy(() => import("./pages/outils/QrCode.jsx"));

// Remonte en haut de page à chaque changement de route (navigation interne).
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

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
    <AuthProvider>
    <VideoRecordingProvider>
    <CurrencyProvider>
    <BrowserRouter>
      <ScrollToTop />
      <VideoRecordingToast />
      <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* ── English versions (universal simulators only) ── */}
        <Route path="/en" element={<Home />} />
        <Route path="/en/simulateurs/epargne" element={<Epargne />} />
        <Route path="/en/simulateurs/fire" element={<Fire />} />
        <Route path="/en/simulateurs/budget" element={<Budget />} />
        <Route path="/en/simulateurs/patrimoine" element={<Patrimoine />} />
        <Route path="/en/simulateurs/cout-en-heures" element={<CoutEnHeures />} />
        <Route path="/en/simulateurs/credit-conso" element={<CreditConso />} />
        <Route path="/en/simulateurs/comparateur" element={<Comparateur />} />
        <Route path="/en/outils/qr-code" element={<QrCode />} />
        <Route path="/en/mentions-legales" element={<MentionsLegales />} />
        <Route path="/en/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
        {/* Retraite */}
        <Route path="/simulateurs/agirc-arrco" element={<SimulateurRetraite />} />
        <Route path="/simulateurs/cnav" element={<Cnav />} />
        <Route path="/simulateurs/fonction-publique" element={<FonctionPublique />} />
        <Route path="/simulateurs/independants" element={<Independants />} />
        <Route path="/simulateurs/ircantec" element={<Ircantec />} />
        <Route path="/simulateurs/retraite-progressive" element={<RetraiteProgressive />} />
        <Route path="/simulateurs/cnavpl" element={<Cnavpl />} />
        <Route path="/simulateurs/msa" element={<Msa />} />
        <Route path="/simulateurs/per" element={<Per />} />
        <Route path="/simulateurs/synthese-retraite" element={<SyntheseRetraite />} />
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
        <Route path="/simulateurs/assurance-vie" element={<AssuranceVie />} />
        <Route path="/simulateurs/credit-conso" element={<CreditConso />} />
        {/* Vie & Temps */}
        <Route path="/simulateurs/cout-en-heures" element={<CoutEnHeures />} />
        <Route path="/simulateurs/vie-en-semaines" element={<VieEnSemaines />} />
        {/* Comparateur */}
        <Route path="/simulateurs/comparateur" element={<Comparateur />} />
        {/* Outils */}
        <Route path="/outils/qr-code" element={<QrCode />} />
        {/* Blog */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Article />} />
        {/* Lexique */}
        <Route path="/lexique" element={<Lexique />} />
        <Route path="/lexique/:slug" element={<LexiqueTerme />} />
        {/* Guides */}
        <Route path="/guides" element={<Guides />} />
        <Route path="/guides/:slug" element={<Guide />} />
        {/* Widget embarquable (iframe) */}
        <Route path="/embed/epargne" element={<EmbedEpargne />} />
        <Route path="/embed/emprunt" element={<EmbedEmprunt />} />
        <Route path="/embed/fire" element={<EmbedFire />} />
        <Route path="/widgets" element={<Widgets />} />
        {/* Pages utilitaires */}
        <Route path="/mes-simulations" element={<MesSimulations />} />
        <Route path="/methodologie" element={<Methodologie />} />
        {/* Pro / Paiements */}
        <Route path="/pro" element={<Pro />} />
        <Route path="/en/pro" element={<Pro />} />
        <Route path="/merci" element={<Merci />} />
        <Route path="/en/merci" element={<Merci />} />
        <Route path="/merci-pro" element={<MerciPro />} />
        <Route path="/en/merci-pro" element={<MerciPro />} />
        {/* Comptes */}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/en/connexion" element={<Connexion />} />
        <Route path="/compte" element={<Compte />} />
        <Route path="/en/compte" element={<Compte />} />
        {/* Légal */}
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="/a-propos" element={<APropos />} />
        {/* 404 — attrape-tout */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
    </CurrencyProvider>
    </VideoRecordingProvider>
    </AuthProvider>
  );
}
