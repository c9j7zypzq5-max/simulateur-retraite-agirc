import { forwardRef } from "react";

// Compte-rendu (CR) imprimable d'une simulation, rendu hors-écran puis capturé
// en image (PNG/PDF/partage) par ShareBar. Palette FIXE (indépendante du thème)
// pour un rendu cohérent à l'impression et au partage.
//
// report = {
//   title:    "Simulateur PTZ",
//   highlight:{ label, value },          // résultat principal mis en avant
//   params:   [{ label, value }, ...],   // paramètres saisis
//   results:  [{ label, value }, ...],   // résultats détaillés
// }
const COL = {
  bg: "#ffffff", panel: "#faf7f0", ink: "#1c1208", soft: "#6b5c3e",
  gold: "#9a6f2a", goldSoft: "rgba(184,147,74,0.12)", border: "rgba(0,0,0,0.10)",
};

function Row({ label, value, strong }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, padding: "7px 0", borderBottom: `1px solid ${COL.border}` }}>
      <span style={{ fontSize: 13, color: COL.soft }}>{label}</span>
      <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: strong ? 700 : 600, color: strong ? COL.gold : COL.ink, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function Section({ heading, rows }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div style={{ flex: 1, minWidth: 240 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: COL.gold, fontWeight: 700, marginBottom: 6 }}>{heading}</div>
      {rows.map((r, i) => <Row key={i} {...r} />)}
    </div>
  );
}

const ReportCard = forwardRef(function ReportCard({ report, url }, ref) {
  if (!report) return null;
  const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div ref={ref} style={{
      width: 720, boxSizing: "border-box", padding: 36,
      background: COL.bg, color: COL.ink,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      border: `1px solid ${COL.border}`,
    }}>
      {/* En-tête de marque */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `2px solid ${COL.gold}`, paddingBottom: 14, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo-mark.svg" alt="" width={30} height={30} />
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: COL.gold }}>mesimulateurs.fr</span>
        </div>
        <span style={{ fontSize: 12, color: COL.soft }}>{date}</span>
      </div>

      {/* Titre */}
      <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 700, margin: "0 0 18px", color: COL.ink }}>
        {report.title}
      </h1>

      {/* Résultat principal */}
      {report.highlight && (
        <div style={{ background: COL.goldSoft, border: `1px solid rgba(184,147,74,0.3)`, borderRadius: 12, padding: "16px 20px", marginBottom: 22 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: COL.soft, marginBottom: 4 }}>{report.highlight.label}</div>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 40, fontWeight: 700, lineHeight: 1, color: COL.gold }}>{report.highlight.value}</div>
        </div>
      )}

      {/* Paramètres + Résultats */}
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 24 }}>
        <Section heading="Paramètres" rows={report.params} />
        <Section heading="Résultats" rows={report.results} />
      </div>

      {/* Pied : invitation + lien */}
      <div style={{ background: COL.panel, borderRadius: 12, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 13, color: COL.ink, fontWeight: 600 }}>Faites votre propre simulation gratuitement :</span>
        <span style={{ fontSize: 12, color: COL.gold, wordBreak: "break-all" }}>{url}</span>
      </div>

      <div style={{ marginTop: 14, fontSize: 10, color: COL.soft, textAlign: "center" }}>
        Simulation indicative et non contractuelle · mesimulateurs.fr
      </div>
    </div>
  );
});

export default ReportCard;
