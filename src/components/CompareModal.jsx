import { Link } from "react-router-dom";

function parseNumeric(str) {
  if (!str) return null;
  const n = parseFloat(String(str).replace(/[^\d.,-]/g, "").replace(",", "."));
  return isNaN(n) ? null : n;
}

export default function CompareModal({ entryA, entryB, onClose }) {
  const snapshotA = entryA?.reportSnapshot;
  const snapshotB = entryB?.reportSnapshot;

  const allKeys = snapshotA?.results
    ? snapshotA.results.map(r => r.label)
    : snapshotB?.results?.map(r => r.label) || [];

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--border)",
        borderRadius: 20, width: "100%", maxWidth: 720,
        maxHeight: "90vh", overflowY: "auto",
        fontFamily: "'Hanken Grotesk', sans-serif",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, margin: 0, color: "var(--text)" }}>
            Comparaison
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: 18, cursor: "pointer", padding: "4px 8px" }}>✕</button>
        </div>

        {/* Side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {[entryA, entryB].map((entry, idx) => {
            const snap = entry?.reportSnapshot;
            const isA = idx === 0;
            return (
              <div key={idx} style={{
                padding: "20px 20px 24px",
                borderRight: isA ? "1px solid var(--border)" : "none",
              }}>
                {/* Label */}
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {isA ? "Simulation A" : "Simulation B"}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 16, lineHeight: 1.3 }}>
                  {entry?.label}
                </div>

                {/* Highlight */}
                {snap?.highlight && (
                  <div style={{
                    background: "rgba(184,147,74,0.08)", border: "1px solid rgba(184,147,74,0.25)",
                    borderRadius: 12, padding: "14px 16px", marginBottom: 16,
                  }}>
                    <div style={{ fontSize: 11, color: "var(--gold)", marginBottom: 4 }}>{snap.highlight.label}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: "var(--gold)" }}>
                      {snap.highlight.value}
                    </div>
                  </div>
                )}
                {!snap && (
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", padding: "10px 0", lineHeight: 1.6 }}>
                    Pas de données de résultats (simulation ancienne). Ouvrez-la pour recalculer.
                  </div>
                )}

                {/* Results */}
                {snap?.results && snap.results.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {snap.results.map((r, i) => {
                      const other = (isA ? snapshotB : snapshotA)?.results?.find(x => x.label === r.label);
                      const valA = parseNumeric(r.value);
                      const valO = other ? parseNumeric(other.value) : null;
                      let color = "var(--text)";
                      if (valA !== null && valO !== null && valA !== valO) {
                        color = valA > valO ? "#22c55e" : "#ef4444";
                      }
                      return (
                        <div key={i} style={{
                          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                          padding: "10px 0", borderBottom: i < snap.results.length - 1 ? "1px solid var(--border)" : "none",
                          gap: 8,
                        }}>
                          <span style={{ fontSize: 12, color: "var(--text-secondary)", flex: 1 }}>{r.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color, textAlign: "right", flexShrink: 0 }}>{r.value}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Link to open simulation */}
                {entry?.shareUrl && (
                  <Link
                    to={entry.shareUrl.replace(/^https?:\/\/[^/]+/, "")}
                    onClick={onClose}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      marginTop: 16, fontSize: 12, color: "var(--primary)",
                      textDecoration: "none", fontWeight: 500,
                    }}
                  >
                    Ouvrir la simulation →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
