import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SimulateurRetraite from "./SimulateurRetraite.jsx";
import MentionsLegales from "./pages/MentionsLegales.jsx";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite.jsx";
import APropos from "./pages/APropos.jsx";
// Retraite
import Cnav from "./pages/simulateurs/Cnav.jsx";
import FonctionPublique from "./pages/simulateurs/FonctionPublique.jsx";
import Independants from "./pages/simulateurs/Independants.jsx";
import Ircantec from "./pages/simulateurs/Ircantec.jsx";
import RetraiteProgressive from "./pages/simulateurs/RetraiteProgressive.jsx";
import Cnavpl from "./pages/simulateurs/Cnavpl.jsx";
import Msa from "./pages/simulateurs/Msa.jsx";
// Immobilier
import EmpruntImmobilier from "./pages/simulateurs/EmpruntImmobilier.jsx";
import RendementLocatif from "./pages/simulateurs/RendementLocatif.jsx";
// Impôts
import ImpotRevenu from "./pages/simulateurs/ImpotRevenu.jsx";
import PlusValue from "./pages/simulateurs/PlusValue.jsx";
// Finances
import Budget from "./pages/simulateurs/Budget.jsx";
import Salaire from "./pages/simulateurs/Salaire.jsx";
import Epargne from "./pages/simulateurs/Epargne.jsx";
import Fire from "./pages/simulateurs/Fire.jsx";
// Vie & Temps
import CoutEnHeures from "./pages/simulateurs/CoutEnHeures.jsx";
import VieEnSemaines from "./pages/simulateurs/VieEnSemaines.jsx";
import DefiRichesse from "./pages/simulateurs/DefiRichesse.jsx";

export default function App() {
  return (
    <BrowserRouter>
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
        {/* Impôts */}
        <Route path="/simulateurs/impot-revenu" element={<ImpotRevenu />} />
        <Route path="/simulateurs/plus-value-immobiliere" element={<PlusValue />} />
        {/* Finances */}
        <Route path="/simulateurs/budget" element={<Budget />} />
        <Route path="/simulateurs/salaire" element={<Salaire />} />
        <Route path="/simulateurs/epargne" element={<Epargne />} />
        <Route path="/simulateurs/fire" element={<Fire />} />
        {/* Vie & Temps */}
        <Route path="/simulateurs/cout-en-heures" element={<CoutEnHeures />} />
        <Route path="/simulateurs/vie-en-semaines" element={<VieEnSemaines />} />
        <Route path="/simulateurs/defi-richesse" element={<DefiRichesse />} />
        {/* Légal */}
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="/a-propos" element={<APropos />} />
      </Routes>
    </BrowserRouter>
  );
}
