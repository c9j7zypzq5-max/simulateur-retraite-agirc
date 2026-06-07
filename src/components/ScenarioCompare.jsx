import { useState } from "react";
import { track } from "@vercel/analytics";
import { NumInput, StepperInput, fmtEur } from "./ui.jsx";

// Comparaison générique de 2 scénarios, réutilisable par tous les simulateurs.
//
// props :
//   name     identifiant analytics
//   fields   champs éditables en B : [{ key, label, unit, type:'num'|'step', min, max, step, kind:'eur'|'num' }]
//   base     valeurs du scénario A (au moins les clés de `fields`)
//   compute  (values) => objet résultat   (values = base pour A, base+modifs pour B)
//   metrics  indicateurs comparés : [{ label, get:(r)=>number, fmt:(n)=>string, higherBetter:bool }]
//   title    titre du panneau (optionnel)
//   cta      libellé du bouton (optionnel)

function fieldDisplay(f, v) {
  if (v === null || v === undefined || v === "") return "—";
  if (f.kind === "eur") return fmtEur(v);
  return `${v}${f.unit ? " " + f.unit : ""}`;
}

export default function ScenarioCompare({ name, fields, base, compute, metrics, title = "Comparaison de scénarios", cta = "⚖️ Comparer un 2ᵉ scénario" }) {
  const [open, setOpen] = useState(false);
  const [b, setB] = useState(null);

  function start() {
    const init = {};
    for (const f of fields) init[f.key] = base[f.key];
    setB(init);
    setOpen(true);
    track("compare_open", { name });
  }

  if (!open) {
    return (
      <button
        onClick={start}
        style={{ width: "100%", marginBottom: 20, padding: "14px 20px", borderRadius: 14, cursor: "pointer", background: "var(--card-bg)", border: "1px dashed var(--border-gold)", color: "var(--gold)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
      >
        {cta}
      </button>
    );
  }

  const rA = compute(base);
  const rB = compute({ ...base, ...b });
  const setVal = (k, v) => setB(s => ({ ...s, [k]: v }));

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "24px", marginBottom: 20, boxShadow: "var(--card-shadow)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 600, color: "var(--text)" }}>{title}</h3>
        <button onClick={() => setOpen(false)} aria-label="Fermer la comparaison" style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {/* Scénario A */}
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Scénario A (actuel)</div>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.9 }}>
            {fields.map(f => (
              <li key={f.key}>{f.label} : <strong style={{ color: "var(--text)" }}>{fieldDisplay(f, base[f.key])}</strong></li>
            ))}
          </ul>
          {metrics.map(m => (
            <div key={m.label} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{m.label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: "var(--text)" }}>{m.fmt(m.get(rA))}</div>
            </div>
          ))}
        </div>

        {/* Scénario B */}
        <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 18 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 10 }}>Scénario B</div>
          {fields.map(f => (
            f.type === "step"
              ? <StepperInput key={f.key} label={f.label} value={b[f.key]} onChange={v => setVal(f.key, v)} min={f.min} max={f.max} step={f.step ?? 1} unit={f.unit ? (f.unit === "%" ? "%" : " " + f.unit) : ""} />
              : <NumInput key={f.key} id={`cmp-${name}-${f.key}`} label={f.label} value={b[f.key]} onChange={v => setVal(f.key, v)} unit={f.unit} min={f.min} max={f.max} />
          ))}
          {metrics.map(m => (
            <div key={m.label} style={{ marginTop: 6 }}>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{m.label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: "var(--gold)" }}>{m.fmt(m.get(rB))}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Écarts */}
      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: `repeat(${Math.min(metrics.length, 2)}, 1fr)`, gap: 12 }}>
        {metrics.map(m => {
          const d = m.get(rB) - m.get(rA);
          const good = m.higherBetter ? d >= 0 : d <= 0;
          return (
            <div key={m.label} style={{ padding: "12px 14px", borderRadius: 12, textAlign: "center", background: good ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${good ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}` }}>
              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>{m.label} (B − A)</div>
              <strong style={{ fontSize: 16, color: good ? "#22c55e" : "#ef4444" }}>{d >= 0 ? "+" : "−"}{m.fmt(Math.abs(d))}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}
