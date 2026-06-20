import { useState } from "react";

// Encart « Intégrer ce simulateur » : affiche le code <iframe> et un bouton copier.
export default function EmbedSnippet({ path = "/embed/epargne", height = 520, label = "ce simulateur" }) {
  const [copied, setCopied] = useState(false);
  const code = `<iframe src="https://www.simfinly.com${path}" width="100%" height="${height}" style="border:1px solid #e5e7eb;border-radius:12px;max-width:560px" title="Simulateur — simfinly.com" loading="lazy"></iframe>`;

  function copy() {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px", marginTop: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)" }}>Intégrer {label} sur votre site</h3>
        <button
          onClick={copy}
          style={{ padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", background: copied ? "rgba(34,197,94,0.12)" : "rgba(184,147,74,0.12)", color: copied ? "#22c55e" : "var(--gold)", border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "var(--border-gold)"}` }}
        >
          {copied ? "Copié ✓" : "Copier le code"}
        </button>
      </div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
        Gratuit et libre : collez ce code HTML dans votre article ou page web. Un lien vers simfinly.com est inclus.
      </p>
      <pre style={{ margin: 0, overflowX: "auto", background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "var(--text-secondary)", whiteSpace: "pre-wrap", wordBreak: "break-all", fontFamily: "ui-monospace, monospace" }}>{code}</pre>
    </div>
  );
}
