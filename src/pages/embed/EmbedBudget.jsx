import { useState, useEffect } from "react";

// Mini-simulateur budget 50/30/20, destiné à être intégré en <iframe>.
// Pas de navbar/footer/pub, styles fixes et lien retour vers simfinly.com.

const eur = n => Math.round(Math.abs(n)).toLocaleString("fr-FR") + " €";
const field = { width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 8, border: "1px solid #d8dee8", fontSize: 15, fontFamily: "system-ui, sans-serif", color: "#0b1220", background: "#fff" };
const lab = { display: "block", fontSize: 12, color: "#5b6675", marginBottom: 4, fontWeight: 500 };

function Bar({ pct, color }) {
  return (
    <div style={{ height: 8, background: "#eee", borderRadius: 4, overflow: "hidden", marginTop: 4 }}>
      <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.3s" }} />
    </div>
  );
}

export default function EmbedBudget() {
  const [revenu, setRevenu] = useState(2500);

  useEffect(() => {
    document.title = "Mini-simulateur budget 50/30/20 — simfinly.com";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, follow');
    document.body.style.margin = "0";
    document.body.style.background = "transparent";
  }, []);

  const net = revenu || 0;
  const besoins = net * 0.50;
  const envies  = net * 0.30;
  const epargne = net * 0.20;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16, maxWidth: 480, margin: "0 auto", color: "#0b1220" }}>
      <div style={{ border: "1px solid #e5e9f0", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ background: "linear-gradient(135deg,#0b1220,#16233d)", color: "#e8c06a", padding: "12px 16px", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
          📊 Budget 50/30/20
        </div>
        <div style={{ padding: 16, background: "#fff" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={lab}>Revenu mensuel net (€)</label>
            <input type="number" style={field} value={revenu} onChange={e => setRevenu(+e.target.value)} onFocus={e => e.target.select()} />
          </div>

          {[
            { label: "Besoins (50 %)", value: besoins, color: "#2B5CE6", note: "Loyer, alimentation, transport…" },
            { label: "Envies (30 %)", value: envies, color: "#a855f7", note: "Sorties, shopping, abonnements…" },
            { label: "Épargne (20 %)", value: epargne, color: "#22c55e", note: "Investissement, épargne de précaution…" },
          ].map(r => (
            <div key={r.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 13, color: "#5b6675" }}>{r.label}</span>
                <span style={{ fontWeight: 700, color: r.color }}>{eur(r.value)}/mois</span>
              </div>
              <Bar pct={net > 0 ? (r.value / net) * 100 : 0} color={r.color} />
              <div style={{ fontSize: 11, color: "#9aa4b2", marginTop: 2 }}>{r.note}</div>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: 12 }}>
            <a href="https://www.simfinly.com/simulateurs/budget" target="_blank" rel="noopener" style={{ fontSize: 12, color: "#8a6322", textDecoration: "none" }}>
              Version complète sur simfinly.com →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
