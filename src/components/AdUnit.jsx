import { useEffect, useRef, useState } from "react";
import { AD_CLIENT, resolveAdSlot } from "../config/adsense.js";

// Unité publicitaire AdSense chargée à la demande : on n'injecte le bloc et on
// ne déclenche le remplissage que lorsqu'il approche du viewport (IntersectionObserver).
// Cela évite de charger des pubs hors écran et allège le rendu initial.
//
// L'ID de slot est résolu via src/config/adsense.js (prop `slot` explicite,
// sinon `placement`, sinon slot par défaut). Tant qu'aucun slot valide n'est
// configuré (compte AdSense en cours de validation), le composant n'affiche RIEN
// — pas de requête publicitaire invalide, pas de décalage de mise en page.
export default function AdUnit({ slot, placement, format = "auto", style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const adSlot = resolveAdSlot(slot, placement);

  useEffect(() => {
    if (!adSlot) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { setVisible(true); io.disconnect(); }
    }, { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, [adSlot]);

  useEffect(() => {
    if (!visible || !adSlot) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* AdSense indisponible */ }
  }, [visible, adSlot]);

  // Aucun slot AdSense valide → on n'injecte rien.
  if (!adSlot) return null;

  return (
    <div ref={ref} data-noprint style={{ textAlign: "center", overflow: "hidden", minHeight: 1, ...style }}>
      {visible && (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={adSlot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
