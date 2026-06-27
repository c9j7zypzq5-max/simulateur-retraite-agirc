import { useEffect, useRef } from "react";

// Simple confirmation dialog that traps focus and closes on Escape.
// Usage: <ConfirmModal open={bool} title="..." body="..." onConfirm={fn} onCancel={fn} />
export default function ConfirmModal({ open, title, body, confirmLabel, cancelLabel, onConfirm, onCancel, danger = false }) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    confirmRef.current?.focus();
    const handleKey = e => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("keydown", handleKey); prev?.focus?.(); };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div style={{
        background: "var(--card-bg, #fff)", borderRadius: 16, padding: "28px 28px 24px",
        maxWidth: 400, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        fontFamily: "'Hanken Grotesk', sans-serif",
      }}>
        <h2 id="confirm-modal-title" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, margin: "0 0 10px", color: "var(--text)" }}>
          {title}
        </h2>
        {body && <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 24px" }}>{body}</p>}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid var(--border)", background: "none", color: "var(--text-secondary)", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
          >
            {cancelLabel || "Annuler"}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: danger ? "#dc2626" : "var(--primary, #2B5CE6)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            {confirmLabel || "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}
