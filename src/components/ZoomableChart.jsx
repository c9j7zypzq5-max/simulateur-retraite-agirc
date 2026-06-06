import { useState, useRef, useCallback, useEffect } from "react";

// Rend un graphique cliquable : au clic, son SVG est agrandi dans un modal
// plein écran (« voir en détail »). `innerRef` est transmis au conteneur du
// graphe pour rester compatible avec la capture PDF (ShareBar).
export default function ZoomableChart({ children, innerRef, style, caption }) {
  const localRef = useRef(null);
  const ref = innerRef || localRef;
  const [open, setOpen] = useState(false);
  const [svg, setSvg] = useState("");

  const openModal = useCallback(() => {
    const el = ref.current?.querySelector("svg");
    if (!el) return;
    // Force un dimensionnement responsive dans le modal (le 1er style l'emporte).
    setSvg(el.outerHTML.replace("<svg", '<svg style="width:100%;height:auto;max-height:80vh;display:block"'));
    setOpen(true);
  }, [ref]);

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
        ref={ref}
        onClick={openModal}
        title="Agrandir le graphique"
        style={{ cursor: "zoom-in", position: "relative", ...style }}
      >
        {children}
        <span data-noexport="true" aria-hidden="true" style={{
          position: "absolute", top: 8, right: 8, width: 26, height: 26, borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(184,147,74,0.15)", border: "1px solid var(--border-gold)",
          color: "var(--gold)", fontSize: 14, pointerEvents: "none",
        }}>⤢</span>
      </div>

      {open && (
        <div
          role="dialog" aria-modal="true" aria-label="Graphique agrandi"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "5vw",
          }}
        >
          <button onClick={() => setOpen(false)} aria-label="Fermer" style={{
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
            <div dangerouslySetInnerHTML={{ __html: svg }} />
            {caption && <div style={{ marginTop: 14, textAlign: "center", fontSize: 12, color: "var(--text-secondary)" }}>{caption}</div>}
          </div>
        </div>
      )}
    </>
  );
}
