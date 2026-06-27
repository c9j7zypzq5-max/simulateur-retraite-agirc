import { useState, useEffect } from "react";
import { useExporting } from "../utils/exportMode.js";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const isExporting = useExporting();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible || isExporting) return null;

  return (
    <>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Retour en haut de page"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 900,
          width: 44, height: 44, borderRadius: "50%",
          background: "var(--card-bg, #fff)", border: "1px solid var(--border, #e7eaf0)",
          color: "var(--text-secondary)", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          transition: "border-color 0.2s, color 0.2s, transform 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold-mid)"; e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.transform = "none"; }}
        onFocus={e => { e.currentTarget.style.outline = "2px solid var(--gold-mid)"; e.currentTarget.style.outlineOffset = "2px"; }}
        onBlur={e => { e.currentTarget.style.outline = "none"; }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  );
}
