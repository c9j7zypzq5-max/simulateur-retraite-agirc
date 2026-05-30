import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SimulateurRetraite from "./SimulateurRetraite.jsx";
import MentionsLegales from "./pages/MentionsLegales.jsx";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite.jsx";
import Cnav from "./pages/simulateurs/Cnav.jsx";
import FonctionPublique from "./pages/simulateurs/FonctionPublique.jsx";
import Independants from "./pages/simulateurs/Independants.jsx";
import Ircantec from "./pages/simulateurs/Ircantec.jsx";
import RetraiteProgressive from "./pages/simulateurs/RetraiteProgressive.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulateurs/agirc-arrco" element={<SimulateurRetraite />} />
        <Route path="/simulateurs/cnav" element={<Cnav />} />
        <Route path="/simulateurs/fonction-publique" element={<FonctionPublique />} />
        <Route path="/simulateurs/independants" element={<Independants />} />
        <Route path="/simulateurs/ircantec" element={<Ircantec />} />
        <Route path="/simulateurs/retraite-progressive" element={<RetraiteProgressive />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
      </Routes>
    </BrowserRouter>
  );
}
