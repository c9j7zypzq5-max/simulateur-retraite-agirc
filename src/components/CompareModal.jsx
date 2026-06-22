import { Link } from "react-router-dom";

function parseNumeric(str) {
  if (!str) return null;
  const n = parseFloat(String(str).replace(/\s/g, "").replace(/[^\d.,-]/g, "").replace(",", "."));
  return isNaN(n) ? null : n;
}

function computeDiff(valA, valB) {
  if (valA === null || valB === null) return null;
  return valB - valA;
}

function formatDiff(diff, suffix) {
  if (diff === null) return null;
  const sign = diff >= 0 ? "+" : "";
  return `${sign}${diff.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}${suffix || ""}`;
}

function extractSuffix(str) {
  if (!str) return "";
  const m = String(str).match(/[€%a-zA-Z]+\s*$/);
  return m ? ` ${m[0].trim()}` : "";
}

export default function CompareSection({ entryA, entryB, onClose, locale = "fr" }) {
  const isEn = locale === "en";
  const snapshotA = entryA?.reportSnapshot;
  const snapshotB = entryB?.reportSnapshot;

  const hlA = snapshotA?.highlight;
  const hlB = snapshotB?.highlight;
  const numA = hlA ? parseNumeric(hlA.value) : null;
  const numB = hlB ? parseNumeric(hlB.value) : null;

  // Determine which is "recommended" (higher numeric value wins)
  const bIsRecommended = numA !== null && numB !== null && numB >= numA;
  const aIsRecommended = numA !== null && numB !== null && numA > numB;

  const highlightDiff = (numA !== null && numB !== null) ? computeDiff(numA, numB) : null;
  const suffix = hlA ? extractSuffix(hlA.value) : (hlB ? extractSuffix(hlB.value) : "");

  const allResults = (snapshotA?.results || snapshotB?.results || []).map(r => r.label);

  function getRowColor(isB, rLabel) {
    const snapOwn = isB ? snapshotB : snapshotA;
    const snapOther = isB ? snapshotA : snapshotB;
    const own = snapOwn?.results?.find(x => x.label === rLabel);
    const other = snapOther?.results?.find(x => x.label === rLabel);
    if (!own || !other) return "#0F1828";
    const vo = parseNumeric(own.value);
    const vot = parseNumeric(other.value);
    if (vo === null || vot === null || vo === vot) return "#0F1828";
    return vo > vot ? "#15A06B" : "#c2410c";
  }

  const verdictText = highlightDiff !== null && Math.abs(highlightDiff) > 0
    ? (isEn
        ? `Scenario ${bIsRecommended ? "B" : "A"} brings ${formatDiff(bIsRecommended ? highlightDiff : -highlightDiff, suffix)} (${Math.abs(Math.round((highlightDiff / (numA || 1)) * 100))}%) more on "${hlA?.label || hlB?.label}".`
        : `Le scénario ${bIsRecommended ? "B" : "A"} apporte ${formatDiff(bIsRecommended ? highlightDiff : -highlightDiff, suffix)} (+${Math.abs(Math.round((highlightDiff / (numA || 1)) * 100))}%) sur « ${hlA?.label || hlB?.label} ».`)
    : null;

  const columns = [
    { entry: entryA, snap: snapshotA, hl: hlA, isRecommended: aIsRecommended, label: isEn ? "Scenario A" : "Scénario A", dotColor: "#94a3b8", border: "1px solid #e7eaf0" },
    { entry: entryB, snap: snapshotB, hl: hlB, isRecommended: bIsRecommended, label: isEn ? "Scenario B" : "Scénario B", dotColor: "#2B5CE6", border: "1.5px solid #2B5CE6" },
  ];

  return (
    <div style={{ background: "#F5F6F8", borderRadius: 16, padding: "28px 30px 36px", marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em", color: "#0F1828", margin: 0 }}>
            {isEn ? "Compare two scenarios" : "Comparer deux scénarios"}
          </h2>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#b45309", background: "#fef3c7", border: "1px solid #fde68a", padding: "3px 9px", borderRadius: 20 }}>Pro</span>
        </div>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", color: "#5B6677", cursor: "pointer", fontSize: 18, padding: "4px 8px", lineHeight: 1 }}
          aria-label={isEn ? "Close" : "Fermer"}
        >✕</button>
      </div>
      <p style={{ fontSize: 13, color: "#5B6677", margin: "0 0 22px" }}>
        {isEn ? "Side-by-side comparison, line by line." : "Visualisez l'écart, ligne par ligne."}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {columns.map((col, idx) => (
          <div key={idx} style={{ background: "#fff", border: col.isRecommended ? "1.5px solid #2B5CE6" : "1px solid #e7eaf0", borderRadius: 16, padding: 24, position: "relative" }}>
            {col.isRecommended && (
              <span style={{ position: "absolute", top: -11, right: 20, fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#fff", background: "#15A06B", padding: "4px 11px", borderRadius: 20 }}>
                {isEn ? "Recommended" : "Recommandé"}
              </span>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: col.dotColor, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: "#0F1828" }}>
                {col.label} · {col.entry?.label}
              </span>
            </div>

            {col.hl ? (
              <>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a93a3", fontWeight: 600, marginBottom: 8 }}>
                  {col.hl.label}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 22 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 600, color: "#0F1828", lineHeight: 1 }}>
                    {col.hl.value}
                  </span>
                  {col.isRecommended && highlightDiff !== null && (
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#15A06B" }}>
                      {formatDiff(bIsRecommended ? highlightDiff : -highlightDiff, suffix)}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 13, color: "#8a93a3", marginBottom: 22, lineHeight: 1.6 }}>
                {isEn ? "No result data (old simulation). Reopen it to recalculate." : "Pas de données (simulation ancienne). Rouvrez-la pour recalculer."}
              </div>
            )}

            {allResults.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {allResults.map((label, i) => {
                  const snap = idx === 0 ? snapshotA : snapshotB;
                  const row = snap?.results?.find(r => r.label === label);
                  const color = getRowColor(idx === 1, label);
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderTop: "1px solid #f0f2f6", fontSize: 13.5 }}>
                      <span style={{ color: "#5B6677" }}>{label}</span>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color }}>{row?.value || "—"}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {col.entry?.shareUrl && (
              <Link
                to={col.entry.shareUrl.replace(/^https?:\/\/[^/]+/, "")}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, fontSize: 12.5, color: "#2B5CE6", textDecoration: "none", fontWeight: 600 }}
              >
                {isEn ? "Open simulation →" : "Ouvrir la simulation →"}
              </Link>
            )}
          </div>
        ))}
      </div>

      {verdictText && (
        <div style={{ background: "#0F1828", borderRadius: 14, padding: "20px 26px", marginTop: 18, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(21,160,107,0.18)", color: "#34D399", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          <div style={{ color: "#e2e6ee", fontSize: 14.5, lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: verdictText.replace(/\*\*(.+?)\*\*/g, "<b style='color:#fff'>$1</b>") }} />
        </div>
      )}
    </div>
  );
}
