import { useState, useEffect } from "react";

// Mini-simulateur FIRE (indépendance financière) autonome pour iframe.

const eur = n => Math.round(n).toLocaleString("fr-FR") + " €";

// Années pour atteindre le capital cible (intérêts composés mensuels).
function yearsToTarget(capital, mensuel, taux, cible) {
  if (capital >= cible) return 0;
  if (mensuel <= 0 && taux <= 0) return Infinity;
  const r = taux / 100 / 12;
  let c = capital;
  for (let m = 1; m <= 80 * 12; m++) {
    c = c * (1 + r) + mensuel;
    if (c >= cible) return Math.round((m / 12) * 10) / 10;
  }
  return Infinity;
}

const field = { width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 8, border: "1px solid #d8dee8", fontSize: 15, fontFamily: "system-ui, sans-serif", color: "#0b1220", background: "#fff" };
const lab = { display: "block", fontSize: 12, color: "#5b6675", marginBottom: 4, fontWeight: 500 };

export default function EmbedFire() {
  const [depenses, setDepenses] = useState(24000);
  const [tauxRetrait, setTauxRetrait] = useState(4);
  const [capital, setCapital] = useState(20000);
  const [mensuel, setMensuel] = useState(800);
  const [rendement, setRendement] = useState(6);

  useEffect(() => {
    document.title = "Mini-simulateur FIRE — mesimulateurs.fr";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, follow');
    document.body.style.margin = "0";
    document.body.style.background = "transparent";
  }, []);

  const cible = tauxRetrait > 0 ? (depenses || 0) / (tauxRetrait / 100) : 0;
  const annees = yearsToTarget(capital || 0, mensuel || 0, rendement || 0, cible);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16, maxWidth: 560, margin: "0 auto", color: "#0b1220" }}>
      <div style={{ border: "1px solid #e5e9f0", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ background: "linear-gradient(135deg,#0b1220,#16233d)", color: "#e8c06a", padding: "12px 16px", fontWeight: 700, fontSize: 15 }}>🔥 Indépendance financière (FIRE)</div>
        <div style={{ padding: 16, background: "#fff" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div><label style={lab}>Dépenses (€/an)</label><input type="number" style={field} value={depenses} onChange={e => setDepenses(+e.target.value)} onFocus={e => e.target.select()} /></div>
            <div><label style={lab}>Taux de retrait (%)</label><input type="number" step="0.1" style={field} value={tauxRetrait} onChange={e => setTauxRetrait(+e.target.value)} onFocus={e => e.target.select()} /></div>
            <div><label style={lab}>Capital actuel (€)</label><input type="number" style={field} value={capital} onChange={e => setCapital(+e.target.value)} onFocus={e => e.target.select()} /></div>
            <div><label style={lab}>Épargne (€/mois)</label><input type="number" style={field} value={mensuel} onChange={e => setMensuel(+e.target.value)} onFocus={e => e.target.select()} /></div>
            <div><label style={lab}>Rendement (%/an)</label><input type="number" step="0.1" style={field} value={rendement} onChange={e => setRendement(+e.target.value)} onFocus={e => e.target.select()} /></div>
          </div>
          <div style={{ textAlign: "center", background: "#faf7f0", border: "1px solid #efe6d0", borderRadius: 10, padding: "14px 12px" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8a6322", marginBottom: 4 }}>Capital nécessaire</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#8a6322" }}>{eur(cible)}</div>
            <div style={{ fontSize: 12, color: "#5b6675", marginTop: 4 }}>
              {annees === Infinity ? "Augmentez l'épargne pour l'atteindre" : `Atteint dans ~${annees} ans`}
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <a href="https://www.mesimulateurs.fr/simulateurs/fire" target="_blank" rel="noopener" style={{ fontSize: 12, color: "#8a6322", textDecoration: "none" }}>Version complète sur mesimulateurs.fr →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
