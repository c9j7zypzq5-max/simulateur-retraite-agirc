import { useState, useEffect } from "react";

// Mini-simulateur d'épargne autonome, destiné à être intégré en <iframe> sur des
// sites tiers. Pas de navbar/footer/pub, styles fixes (indépendants du thème) et
// lien retour vers simfinly.com (backlink).

function calc(capital, versement, taux, duree) {
  const r = taux / 100 / 12;
  const n = duree * 12;
  if (Math.abs(r) < 1e-10) return capital + versement * n;
  const f = Math.pow(1 + r, n);
  return capital * f + versement * ((f - 1) / r);
}
const eur = n => Math.round(n).toLocaleString("fr-FR") + " €";

const field = { width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 8, border: "1px solid #d8dee8", fontSize: 15, fontFamily: "system-ui, sans-serif", color: "#0b1220", background: "#fff" };
const lab = { display: "block", fontSize: 12, color: "#5b6675", marginBottom: 4, fontWeight: 500 };

export default function EmbedEpargne() {
  const [capital, setCapital] = useState(5000);
  const [versement, setVersement] = useState(200);
  const [taux, setTaux] = useState(5);
  const [duree, setDuree] = useState(20);

  useEffect(() => {
    document.title = "Mini-simulateur d'épargne — simfinly.com";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, follow');
    document.body.style.margin = "0";
    document.body.style.background = "transparent";
  }, []);

  const final = calc(capital || 0, versement || 0, taux || 0, duree || 0);
  const verse = (capital || 0) + (versement || 0) * (duree || 0) * 12;
  const interets = Math.max(0, final - verse);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16, maxWidth: 560, margin: "0 auto", color: "#0b1220" }}>
      <div style={{ border: "1px solid #e5e9f0", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ background: "linear-gradient(135deg,#0b1220,#16233d)", color: "#e8c06a", padding: "12px 16px", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
          💰 Simulateur d'épargne
        </div>
        <div style={{ padding: 16, background: "#fff" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div><label style={lab}>Capital initial (€)</label><input type="number" style={field} value={capital} onChange={e => setCapital(+e.target.value)} onFocus={e => e.target.select()} /></div>
            <div><label style={lab}>Versement (€/mois)</label><input type="number" style={field} value={versement} onChange={e => setVersement(+e.target.value)} onFocus={e => e.target.select()} /></div>
            <div><label style={lab}>Rendement (%/an)</label><input type="number" step="0.1" style={field} value={taux} onChange={e => setTaux(+e.target.value)} onFocus={e => e.target.select()} /></div>
            <div><label style={lab}>Durée (ans)</label><input type="number" style={field} value={duree} onChange={e => setDuree(+e.target.value)} onFocus={e => e.target.select()} /></div>
          </div>

          <div style={{ textAlign: "center", background: "#faf7f0", border: "1px solid #efe6d0", borderRadius: 10, padding: "14px 12px" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8a6322", marginBottom: 4 }}>Capital final estimé</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#8a6322" }}>{eur(final)}</div>
            <div style={{ fontSize: 12, color: "#5b6675", marginTop: 4 }}>dont {eur(interets)} d'intérêts · {eur(verse)} versés</div>
          </div>

          <div style={{ textAlign: "center", marginTop: 12 }}>
            <a href="https://www.simfinly.com/simulateurs/epargne" target="_blank" rel="noopener" style={{ fontSize: 12, color: "#8a6322", textDecoration: "none" }}>
              Version complète sur simfinly.com →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
