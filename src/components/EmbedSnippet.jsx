import { useState } from "react";

const SIZES = [
  { label: "Compact", width: "100%", height: 420, maxWidth: 480 },
  { label: "Standard", width: "100%", height: 560, maxWidth: 640 },
  { label: "Pleine largeur", width: "100%", height: 680, maxWidth: "100%" },
];

// Encart « Intégrer ce simulateur » : code iframe avec prévisualisation et options.
export default function EmbedSnippet({ path = "/embed/epargne", label = "ce simulateur", showPreview = true }) {
  const [copied, setCopied]     = useState(false);
  const [sizeIdx, setSizeIdx]   = useState(1);
  const [theme, setTheme]       = useState("auto");
  const [showLivePreview, setShowLivePreview] = useState(false);

  const { width, height, maxWidth } = SIZES[sizeIdx];

  // Build embed URL with options
  const embedUrl = `https://www.simfinly.com${path}${theme !== "auto" ? `?theme=${theme}` : ""}`;

  // Build iframe code
  const maxW = maxWidth === "100%" ? "100%" : `${maxWidth}px`;
  const code = `<iframe\n  src="${embedUrl}"\n  width="${width}"\n  height="${height}"\n  style="border:1px solid #e5e7eb;border-radius:12px;max-width:${maxW}"\n  title="${label.replace(/^ce /, "Simulateur ")} — simfinly.com"\n  loading="lazy"\n  allow="clipboard-write"\n></iframe>`;

  function copy() {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  }

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px", marginTop: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--text)", margin: "0 0 4px" }}>
            Intégrer {label} sur votre site
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
            Gratuit et sans publicité intrusive — un lien vers simfinly.com est inclus.
          </p>
        </div>
        <button
          onClick={copy}
          style={{ padding: "8px 18px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600, background: copied ? "rgba(34,197,94,0.12)" : "rgba(43,92,230,0.1)", color: copied ? "#22c55e" : "var(--gold)", border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "var(--border-gold)"}`, flexShrink: 0, transition: "all 0.2s" }}
        >
          {copied ? "✓ Copié !" : "Copier le code"}
        </button>
      </div>

      {/* Options */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Taille</div>
          <div style={{ display: "flex", gap: 6 }}>
            {SIZES.map((s, i) => (
              <button key={s.label} onClick={() => setSizeIdx(i)}
                style={{ padding: "5px 10px", borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: "inherit", border: "1px solid var(--border)", background: sizeIdx === i ? "rgba(43,92,230,0.1)" : "var(--bg)", color: sizeIdx === i ? "var(--gold)" : "var(--text-secondary)", fontWeight: sizeIdx === i ? 600 : 400 }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Thème</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ v: "auto", l: "Auto" }, { v: "light", l: "Clair" }, { v: "dark", l: "Sombre" }].map(({ v, l }) => (
              <button key={v} onClick={() => setTheme(v)}
                style={{ padding: "5px 10px", borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: "inherit", border: "1px solid var(--border)", background: theme === v ? "rgba(43,92,230,0.1)" : "var(--bg)", color: theme === v ? "var(--gold)" : "var(--text-secondary)", fontWeight: theme === v ? 600 : 400 }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {showPreview && (
          <button onClick={() => setShowLivePreview(p => !p)}
            style={{ marginLeft: "auto", padding: "5px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: "inherit", border: "1px solid var(--border)", background: showLivePreview ? "rgba(43,92,230,0.1)" : "var(--bg)", color: showLivePreview ? "var(--gold)" : "var(--text-secondary)" }}>
            {showLivePreview ? "Masquer la prévisualisation ↑" : "Prévisualiser ↓"}
          </button>
        )}
      </div>

      {/* Live preview */}
      {showLivePreview && (
        <div style={{ marginBottom: 14, borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)", background: "#f5f5f5" }}>
          <div style={{ padding: "8px 12px", background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--gold)" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: 11, color: "var(--text-secondary)", marginLeft: 4 }}>Aperçu de l'intégration</span>
          </div>
          <iframe
            src={embedUrl}
            width="100%"
            height={height}
            style={{ border: "none", display: "block" }}
            title={`Aperçu — ${label}`}
            loading="lazy"
          />
        </div>
      )}

      {/* Code block */}
      <pre style={{ margin: 0, overflowX: "auto", background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", fontSize: 12, color: "var(--text-secondary)", whiteSpace: "pre-wrap", wordBreak: "break-all", fontFamily: "ui-monospace,'Cascadia Code',monospace", lineHeight: 1.6 }}>{code}</pre>

      {/* Dimensions info */}
      <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-secondary)", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <span>Dimensions : {height}px de hauteur</span>
        <span>·</span>
        <span>Largeur maximale : {maxWidth === "100%" ? "illimitée" : `${maxWidth}px`}</span>
        <span>·</span>
        <span>Chargement différé (lazy)</span>
      </div>
    </div>
  );
}
