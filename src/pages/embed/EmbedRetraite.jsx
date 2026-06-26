import { useState, useEffect, useMemo } from "react";

// Mini-simulateur retraite CNAV simplifié, destiné à être intégré en <iframe>.
// Calcul rapide : salaire + trimestres → pension estimée.

const eur = n => Math.round(n).toLocaleString("fr-FR") + " €";
const field = { width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 8, border: "1px solid #d8dee8", fontSize: 15, fontFamily: "system-ui, sans-serif", color: "#0b1220", background: "#fff" };
const lab = { display: "block", fontSize: 12, color: "#5b6675", marginBottom: 4, fontWeight: 500 };

const PASS = 46368;

export default function EmbedRetraite() {
  const [salaire, setSalaire] = useState(2500);
  const [trimestres, setTrimestres] = useState(150);
  const [anneeNaissance, setAnneeNaissance] = useState(1970);

  useEffect(() => {
    document.title = "Mini-simulateur retraite CNAV — simfinly.com";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, follow');
    document.body.style.margin = "0";
    document.body.style.background = "transparent";
  }, []);

  const result = useMemo(() => {
    const requis = anneeNaissance >= 1965 ? 172 : 167;
    const manquants = Math.max(0, requis - trimestres);
    const sam = (salaire || 0) * 12;
    const samP = Math.min(sam, PASS);
    const decote = Math.min(manquants, 20) * 0.00625;
    const taux = Math.max(0, 0.5 - decote);
    const prorat = Math.min(trimestres / requis, 1);
    const brute = (samP * taux * prorat) / 12;
    const nette = brute * 0.93;
    const pct = Math.round((trimestres / requis) * 100);
    return { brute, nette, requis, manquants, pct };
  }, [salaire, trimestres, anneeNaissance]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16, maxWidth: 480, margin: "0 auto", color: "#0b1220" }}>
      <div style={{ border: "1px solid #e5e9f0", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ background: "linear-gradient(135deg,#0b1220,#16233d)", color: "#e8c06a", padding: "12px 16px", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
          🏛 Simulateur retraite CNAV
        </div>
        <div style={{ padding: 16, background: "#fff" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={lab}>Salaire mensuel net (€)</label>
              <input type="number" style={field} value={salaire} onChange={e => setSalaire(+e.target.value)} onFocus={e => e.target.select()} />
            </div>
            <div>
              <label style={lab}>Année de naissance</label>
              <input type="number" style={field} value={anneeNaissance} onChange={e => setAnneeNaissance(+e.target.value)} min={1940} max={1975} onFocus={e => e.target.select()} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lab}>Trimestres cotisés estimés</label>
              <input type="number" style={field} value={trimestres} onChange={e => setTrimestres(+e.target.value)} min={0} max={200} onFocus={e => e.target.select()} />
            </div>
          </div>

          {/* Jauge */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#5b6675", marginBottom: 3 }}>
              <span>{trimestres} / {result.requis} trimestres</span>
              <span>{result.pct} %</span>
            </div>
            <div style={{ height: 7, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${Math.min(100, result.pct)}%`, height: "100%", borderRadius: 4, background: result.pct >= 100 ? "#22c55e" : result.pct >= 75 ? "#e8c06a" : "#ef4444", transition: "width 0.3s" }} />
            </div>
          </div>

          <div style={{ textAlign: "center", background: "#faf7f0", border: "1px solid #efe6d0", borderRadius: 10, padding: "14px 12px" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8a6322", marginBottom: 4 }}>Pension nette mensuelle estimée</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#8a6322" }}>{eur(result.nette)}</div>
            {result.manquants > 0 && (
              <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>Il manque {result.manquants} trimestres pour le taux plein</div>
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: 12 }}>
            <a href="https://www.simfinly.com/simulateurs/cnav" target="_blank" rel="noopener" style={{ fontSize: 12, color: "#8a6322", textDecoration: "none" }}>
              Simulation détaillée sur simfinly.com →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
