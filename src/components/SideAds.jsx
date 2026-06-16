import { useState, useEffect } from "react";
import { useLocation } from "../lib/router.js";
import AdUnit from "./AdUnit.jsx";

// Bannières verticales (skyscrapers) fixées dans les marges, uniquement sur les
// pages simulateurs et sur grand écran (≥ 1300px) où il reste de la place de
// chaque côté de la colonne centrale. Remplit/monétise l'espace vide sans
// élargir le formulaire (lisibilité préservée).
export default function SideAds() {
  const { pathname } = useLocation();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const check = () => setWide(window.innerWidth >= 1300);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!wide || !pathname.startsWith("/simulateurs/")) return null;

  const rail = (side) => ({
    position: "fixed", top: 90, [side]: 24, width: 160, zIndex: 5,
  });

  return (
    <>
      <div style={rail("left")} aria-hidden="true">
        <AdUnit slot="auto" format="vertical" style={{ width: 160 }} />
      </div>
      <div style={rail("right")} aria-hidden="true">
        <AdUnit slot="auto" format="vertical" style={{ width: 160 }} />
      </div>
    </>
  );
}
