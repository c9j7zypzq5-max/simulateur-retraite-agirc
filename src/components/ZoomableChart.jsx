import { useState, useEffect, useCallback } from "react";

// Rend un graphique cliquable : au clic, le graphe est agrandi dans un modal
// plein écran (« voir en détail »). Le modal affiche le graphe VIVANT (mêmes
// `children`), pas une copie figée du SVG, afin de conserver l'interactivité —
// notamment l'infobulle qui suit la souris. `innerRef` est transmis au conteneur
// du graphe inline pour rester compatible avec la capture PDF (ShareBar).
export default function ZoomableChart({ children, innerRef, style, caption }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === "Escape") setOpen(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <div
        ref={innerRef}
        onClick={() => setOpen(true)}
        title="Agrandir le graphique"
        style={{ cursor: "zoom-in", position: "relative", ...style }}
      >
        {children}
        <span data-noexport="true" aria-hidden="true" style={{
          position: "absolute", top: 8, right: 8, width: 26, height: 26, borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(43,92,230,0.12)", border: "1px solid var(--border-gold)",
          color: "var(--gold)", fontSize: 14, pointerEvents: "none",
        }}>⤢</span>
      </div>

      {open && (
        <div
          role="dialog" aria-modal="true" aria-label="Graphique agrandi"
          onClick={close}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "5vw",
          }}
        >
          <button onClick={close} aria-label="Fermer" style={{
            position: "absolute", top: 16, right: 22, background: "none", border: "none",
            color: "#fff", fontSize: 30, cursor: "pointer", lineHeight: 1,
          }}>✕</button>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "min(1100px, 94vw)",
              background: "var(--card-bg)", border: "1px solid var(--border-gold)",
              borderRadius: 16, padding: "28px 28px 20px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Graphe vivant agrandi : l'infobulle au survol reste fonctionnelle. */}
            {children}
            {caption && <div style={{ marginTop: 14, textAlign: "center", fontSize: 12, color: "var(--text-secondary)" }}>{caption}</div>}
          </div>
        </div>
      )}
    </>
  );
}
