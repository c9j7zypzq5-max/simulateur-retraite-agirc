import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { track } from '@vercel/analytics';
import ShareBar from "../../components/ShareBar.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { useTheme } from "../../hooks/useTheme.js";
import { useProfile } from "../../hooks/useProfile.js";
import { useSimHistory } from "../../hooks/useSimHistory.js";
import { downloadCSV, downloadXLSX } from "../../utils/export.js";
import JsonLd from "../../components/JsonLd.jsx";
import HistoricalReturnPicker from "../../components/HistoricalReturnPicker.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, Toggle, AccordionSection,
  Chip, ProgressBar, StatusBadge, useAnimatedNumber,
  fmtEur, SimulateurHeader,
} from "../../components/ui.jsx";

// ─── Constantes ───────────────────────────────────────────────────────────────
const RENDEMENT_DEFAUT = 5;
const TAUX_RETRAIT_DEFAUT = 4;
const AGE_COAST_DEFAUT = 65;
const AGE_MAX = 80;

// ─── Helpers de calcul ─────────────────────────────────────────────────────────
// Nombre d'années (flottant) pour qu'un capital `cap`, abondé de `epargneMensuelle`
// et capitalisé à `rAnnual` %/an, atteigne `target`. Renvoie null si jamais atteint.
function yearsToTarget({ cap, epargneMensuelle, rAnnual, target }) {
  if (!target || target <= 0) return null;
  if (cap >= target) return 0;
  const epargne = epargneMensuelle || 0;
  const r = rAnnual / 100 / 12;
  if (r > 1e-10) {
    // target = cap·(1+r)ⁿ + épargne·[((1+r)ⁿ−1)/r]  ⟹  (1+r)ⁿ = (target+Sr)/(cap+Sr)
    const Sr = epargne / r;
    const ratio = (target + Sr) / (cap + Sr);
    if (ratio > 1) {
      const n = Math.log(ratio) / Math.log(1 + r);
      if (isFinite(n) && n > 0) return n / 12;
    }
    return null;
  }
  if (epargne > 0) return (target - cap) / (epargne * 12);
  return null;
}

// ─── Calcul principal ──────────────────────────────────────────────────────────
function calcFire({ ageActuel, capitalActuel, epargneMensuelle, rendementAnnuel, depensesAnnuelles, tauxRetrait, tauxImpot }) {
  const empty = {
    patrimoineCible: 0, depensesBrutes: 0, anneesRestantes: null, ageAtteinte: null,
    progressPct: 0, revenuPassifMensuel: 0, revenuPassifBrutMensuel: 0, projectionData: [],
  };
  if (!depensesAnnuelles || depensesAnnuelles <= 0) return empty;

  const swr = tauxRetrait / 100;
  // Retraits bruts nécessaires pour disposer de `depensesAnnuelles` nets après impôt
  const depensesBrutes = depensesAnnuelles / (1 - (tauxImpot || 0) / 100);
  const patrimoineCible = depensesBrutes / swr;

  const cap = capitalActuel || 0;
  const epargne = epargneMensuelle || 0;
  const ageRef = ageActuel || 30;
  const r = rendementAnnuel / 100 / 12;

  // Âge / années d'atteinte (formule analytique précise)
  let anneesRestantes = yearsToTarget({ cap, epargneMensuelle: epargne, rAnnual: rendementAnnuel, target: patrimoineCible });
  let ageAtteinte = anneesRestantes != null ? ageRef + Math.ceil(anneesRestantes) : null;
  if (ageAtteinte !== null && ageAtteinte > AGE_MAX) { ageAtteinte = null; anneesRestantes = null; }

  const progressPct = patrimoineCible > 0 ? Math.min((cap / patrimoineCible) * 100, 100) : 0;
  const revenuPassifMensuel = depensesAnnuelles / 12;
  const revenuPassifBrutMensuel = depensesBrutes / 12;

  // Projection annuelle détaillée (capital début, versements, intérêts, capital fin)
  const fireYear = anneesRestantes != null ? Math.ceil(anneesRestantes) : null;
  const maxAnnees = Math.min(AGE_MAX - ageRef, fireYear != null ? fireYear + 2 : 45);
  const projectionData = [{ annee: 0, age: ageRef, debut: cap, versements: 0, interets: 0, patrimoine: cap }];
  let patrimoine = cap;
  for (let a = 1; a <= Math.max(1, maxAnnees); a++) {
    const debut = patrimoine;
    let fin;
    if (r > 1e-10) {
      const factor = Math.pow(1 + r, 12);
      fin = debut * factor + epargne * ((factor - 1) / r);
    } else {
      fin = debut + epargne * 12;
    }
    const versements = epargne * 12;
    const interets = fin - debut - versements;
    patrimoine = fin;
    projectionData.push({ annee: a, age: ageRef + a, debut, versements, interets, patrimoine: fin });
    if (fin >= patrimoineCible) break;
  }

  return { patrimoineCible, depensesBrutes, anneesRestantes, ageAtteinte, progressPct, revenuPassifMensuel, revenuPassifBrutMensuel, projectionData };
}

// ─── Courbe SVG ──────────────────────────────────────────────────────────────
function GrowthCurve({ projectionData, patrimoineCible }) {
  const animKey = useMemo(() => {
    if (!projectionData || !projectionData.length) return "empty";
    const last = projectionData[projectionData.length - 1];
    return `${projectionData.length}_${Math.round(last?.patrimoine || 0)}_${Math.round(patrimoineCible)}`;
  }, [projectionData, patrimoineCible]);

  if (!projectionData || projectionData.length < 2 || patrimoineCible <= 0) return null;

  const PAD = { top: 24, right: 48, bottom: 36, left: 62 };
  const W = 600, H = 300;
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;

  const maxP = Math.max(...projectionData.map(d => d.patrimoine), patrimoineCible) * 1.1;
  const maxA = projectionData[projectionData.length - 1].annee || 1;

  const x = a => PAD.left + (a / maxA) * iW;
  const y = p => PAD.top + iH - (p / maxP) * iH;

  const pts = projectionData.map(d => `${x(d.annee).toFixed(1)},${y(d.patrimoine).toFixed(1)}`).join(" ");
  const cibleY = y(patrimoineCible).toFixed(1);

  const firePoint = projectionData.find(d => d.patrimoine >= patrimoineCible);
  const fireX = firePoint ? x(firePoint.annee) : null;
  const fireY = firePoint ? y(patrimoineCible) : null;

  const ages = projectionData.filter((_, i) => i % Math.ceil(projectionData.length / 5) === 0 || i === projectionData.length - 1);
  const yTicks = [0.25, 0.5, 0.75, 1].map(f => ({ val: maxP * f, yv: y(maxP * f) }));

  const fmtK = v => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1).replace(".", ",")}M€` : `${Math.round(v / 1000)}k€`;

  const fillPts = `${x(0).toFixed(1)},${(H - PAD.bottom).toFixed(1)} ${pts} ${x(maxA).toFixed(1)},${(H - PAD.bottom).toFixed(1)}`;

  const css = `
    @keyframes drawLine_${animKey} {
      from { stroke-dashoffset: 1000; }
      to   { stroke-dashoffset: 0; }
    }
    @keyframes fadeArea_${animKey} {
      from { opacity: 0; }
      to   { opacity: 0.15; }
    }
    .gcLine_${animKey} {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: drawLine_${animKey} 1.4s ease-out forwards;
    }
    .gcArea_${animKey} {
      opacity: 0;
      animation: fadeArea_${animKey} 1.2s ease-out 0.3s forwards;
    }
  `;

  return (
    <svg
      key={animKey}
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "min(300px, 55vw)", display: "block", overflow: "visible" }}
      aria-label="Courbe de croissance du patrimoine"
    >
      <defs><style>{css}</style></defs>

      {/* Zone remplie */}
      <polygon className={`gcArea_${animKey}`} points={fillPts} fill="rgba(184,147,74,1)" />

      {/* Ligne cible pointillée */}
      <line x1={PAD.left} y1={cibleY} x2={W - PAD.right} y2={cibleY}
        stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.5" />
      <text x={W - PAD.right + 4} y={parseFloat(cibleY) + 4} fontSize="10" fill="var(--gold)" opacity="0.75" fontFamily="DM Sans, sans-serif">
        {fmtK(patrimoineCible)}
      </text>

      {/* Ligne verticale FIRE + label */}
      {fireX !== null && (
        <>
          <line x1={fireX} y1={PAD.top} x2={fireX} y2={H - PAD.bottom}
            stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.55" />
          <text x={fireX + 5} y={PAD.top + 13} fontSize="9" fill="var(--gold)"
            fontFamily="DM Sans, sans-serif" opacity="0.9">
            Liberté financière
          </text>
        </>
      )}

      {/* Courbe */}
      <polyline
        className={`gcLine_${animKey}`}
        points={pts}
        fill="none"
        stroke="var(--gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1000"
      />

      {/* Point de départ */}
      <circle cx={x(0)} cy={y(projectionData[0]?.patrimoine || 0)} r="4" fill="var(--gold-mid)" />

      {/* Point FIRE pulsatant */}
      {fireX !== null && fireY !== null && (
        <>
          <circle cx={fireX} cy={fireY} r="8" fill="var(--gold)" opacity="0.25">
            <animate attributeName="r" values="6;12;6" dur="2s" begin="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.08;0.3" dur="2s" begin="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={fireX} cy={fireY} r="5" fill="var(--gold)" />
        </>
      )}

      {/* Point final si pas de FIRE */}
      {fireX === null && (
        <circle cx={x(maxA)} cy={y(projectionData[projectionData.length - 1]?.patrimoine || 0)} r="4" fill="var(--gold)" />
      )}

      {/* Labels âge (axe X) */}
      {ages.map(d => (
        <text key={d.age} x={x(d.annee)} y={H - 6} textAnchor="middle" fontSize="9"
          fill="var(--text-secondary)" fontFamily="DM Sans, sans-serif">
          {d.age} ans
        </text>
      ))}

      {/* Labels patrimoine (axe Y) */}
      {yTicks.map((t, i) => (
        <text key={i} x={PAD.left - 6} y={t.yv + 4} textAnchor="end" fontSize="9"
          fill="var(--text-secondary)" fontFamily="DM Sans, sans-serif">
          {fmtK(t.val)}
        </text>
      ))}

      {/* Axes */}
      <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom}
        stroke="var(--border)" strokeWidth="1" />
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom}
        stroke="var(--border)" strokeWidth="1" />
    </svg>
  );
}

// ─── Paliers FIRE (Barista / Lean / FIRE / Fat) ───────────────────────────────
function MilestonesTable({ milestones }) {
  if (!milestones || !milestones.length) return null;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th style={{ textAlign: "left", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>Palier</th>
            <th style={{ textAlign: "right", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>Capital requis</th>
            <th style={{ textAlign: "right", padding: "10px 8px", color: "var(--text-secondary)", fontWeight: 600 }}>Atteint à</th>
            <th style={{ textAlign: "right", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>Statut</th>
          </tr>
        </thead>
        <tbody>
          {milestones.map(m => (
            <tr key={m.key} style={{ borderBottom: "1px solid var(--border)", background: m.key === "fire" ? "rgba(184,147,74,0.08)" : "transparent" }}>
              <td style={{ padding: "12px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 15 }}>{m.icon}</span>
                  <div>
                    <div style={{ color: m.key === "fire" ? "var(--gold)" : "var(--text)", fontWeight: m.key === "fire" ? 600 : 400 }}>{m.label}</div>
                    <div style={{ fontSize: 10.5, color: "var(--text-secondary)", lineHeight: 1.3 }}>{m.desc}</div>
                  </div>
                </div>
              </td>
              <td style={{ textAlign: "right", padding: "12px 0", color: "var(--text)", whiteSpace: "nowrap" }}>{fmtEur(Math.round(m.target))}</td>
              <td style={{ textAlign: "right", padding: "12px 8px", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                {m.reached ? "—" : m.age != null ? `${m.age} ans` : "> 80 ans"}
              </td>
              <td style={{ textAlign: "right", padding: "12px 0" }}>
                {m.reached
                  ? <StatusBadge status="good" label="Atteint" />
                  : m.age != null
                    ? <StatusBadge status="gold" label={`${Math.ceil(m.years)} ans`} />
                    : <StatusBadge status="warn" label="Lointain" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Tableau année par année ──────────────────────────────────────────────────
function YearTable({ projectionData }) {
  if (!projectionData || projectionData.length < 2) return null;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th style={{ textAlign: "left", padding: "9px 0", color: "var(--text-secondary)", fontWeight: 600 }}>Âge</th>
            <th style={{ textAlign: "right", padding: "9px 8px", color: "var(--text-secondary)", fontWeight: 600 }}>Versements</th>
            <th style={{ textAlign: "right", padding: "9px 8px", color: "var(--text-secondary)", fontWeight: 600 }}>Intérêts</th>
            <th style={{ textAlign: "right", padding: "9px 0", color: "var(--text-secondary)", fontWeight: 600 }}>Patrimoine</th>
          </tr>
        </thead>
        <tbody>
          {projectionData.slice(1).map(d => (
            <tr key={d.annee} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "9px 0", color: "var(--text)" }}>{d.age} ans</td>
              <td style={{ textAlign: "right", padding: "9px 8px", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>+{fmtEur(Math.round(d.versements))}</td>
              <td style={{ textAlign: "right", padding: "9px 8px", color: "#22c55e", whiteSpace: "nowrap" }}>+{fmtEur(Math.round(d.interets))}</td>
              <td style={{ textAlign: "right", padding: "9px 0", color: "var(--text)", fontWeight: 500, whiteSpace: "nowrap" }}>{fmtEur(Math.round(d.patrimoine))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Table de sensibilité ─────────────────────────────────────────────────────
function SensibiliteTable({ depensesBrutes, tauxRetrait }) {
  const taux = [3, 3.5, 4, 4.5, 5];
  if (!depensesBrutes) return null;
  return (
    <div style={{ overflowX: "auto", marginBottom: 20 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th style={{ textAlign: "left", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>Taux retrait</th>
            <th style={{ textAlign: "right", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>Patrimoine cible</th>
            <th style={{ textAlign: "right", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>vs 4 %</th>
          </tr>
        </thead>
        <tbody>
          {taux.map(t => {
            const target = depensesBrutes / (t / 100);
            const target4 = depensesBrutes / 0.04;
            const diff = target4 - target;
            return (
              <tr key={t} style={{ borderBottom: "1px solid var(--border)", background: t === tauxRetrait ? "rgba(184,147,74,0.08)" : "transparent" }}>
                <td style={{ padding: "10px 0", color: t === tauxRetrait ? "var(--gold)" : "var(--text)" }}>{t} %</td>
                <td style={{ textAlign: "right", padding: "10px 0", color: t === tauxRetrait ? "var(--gold)" : "var(--text)" }}>{fmtEur(target)}</td>
                <td style={{ textAlign: "right", padding: "10px 0", color: diff >= 0 ? "#22c55e" : "#ef4444", fontSize: 11 }}>
                  {diff >= 0 ? "−" : "+"}{fmtEur(Math.abs(diff))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Référence taux d'épargne → années (rendement réel ~5 %) ──────────────────
const SAVINGS_REF = [
  { sr: 10, ans: 51 }, { sr: 15, ans: 43 }, { sr: 20, ans: 37 }, { sr: 25, ans: 32 },
  { sr: 30, ans: 28 }, { sr: 40, ans: 22 }, { sr: 50, ans: 17 }, { sr: 60, ans: 12.5 },
  { sr: 70, ans: 8.5 },
];

function SavingsRateTable({ savingsRate }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th style={{ textAlign: "left", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>Taux d'épargne</th>
            <th style={{ textAlign: "right", padding: "10px 0", color: "var(--text-secondary)", fontWeight: 600 }}>Années avant l'indépendance</th>
          </tr>
        </thead>
        <tbody>
          {SAVINGS_REF.map(({ sr, ans }, i) => {
            const next = SAVINGS_REF[i + 1];
            const active = savingsRate != null && savingsRate >= sr && (!next || savingsRate < next.sr);
            return (
              <tr key={sr} style={{ borderBottom: "1px solid var(--border)", background: active ? "rgba(184,147,74,0.1)" : "transparent" }}>
                <td style={{ padding: "10px 0", color: active ? "var(--gold)" : "var(--text)", fontWeight: active ? 600 : 400 }}>
                  {sr} %{active ? "  ← vous" : ""}
                </td>
                <td style={{ textAlign: "right", padding: "10px 0", color: active ? "var(--gold)" : "var(--text)" }}>
                  ~{String(ans).replace(".", ",")} ans
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 12, lineHeight: 1.6 }}>
        Hypothèses : rendement réel 5 %/an, retrait 4 %, en partant de zéro. Ce qui détermine
        l'âge de votre indépendance, ce n'est pas tant votre salaire que la <strong>part que vous épargnez</strong>.
      </p>
    </div>
  );
}

// ─── Comparaison de scénarios ─────────────────────────────────────────────────
function CompareSection({ resA, ageRef, epargneMensuelle, depensesAnnuelles, rendementAnnuel, tauxRetrait, tauxImpotEff, capitalActuel, ageActuel }) {
  const [active, setActive] = useState(false);
  const [compEpargne, setCompEpargne]     = useState(epargneMensuelle);
  const [compDepenses, setCompDepenses]   = useState(depensesAnnuelles);
  const [compRendement, setCompRendement] = useState(rendementAnnuel);

  // Reset Scénario B to current values when toggled on
  const enable = useCallback(() => {
    setCompEpargne(epargneMensuelle);
    setCompDepenses(depensesAnnuelles);
    setCompRendement(rendementAnnuel);
    setActive(true);
  }, [epargneMensuelle, depensesAnnuelles, rendementAnnuel]);

  const resB = active ? calcFire({
    ageActuel: ageActuel || 30,
    capitalActuel: capitalActuel || 0,
    epargneMensuelle: compEpargne,
    rendementAnnuel: compRendement,
    depensesAnnuelles: compDepenses,
    tauxRetrait,
    tauxImpot: tauxImpotEff,
  }) : null;

  const btnStyle = {
    padding: '7px 16px', borderRadius: 9,
    border: '1px solid var(--border-gold)',
    background: 'rgba(184,147,74,0.07)',
    color: 'var(--gold)', fontSize: 13, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  };

  if (!active) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0 4px' }}>
        <button onClick={enable} style={btnStyle}>⚖️ Comparer deux scénarios</button>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 8 }}>
          Testez l'impact d'une variation d'épargne, de dépenses ou de rendement
        </div>
      </div>
    );
  }

  // Build comparison rows
  const rows = [
    {
      label: 'Âge FIRE',
      a: resA.ageAtteinte != null ? `${resA.ageAtteinte} ans` : '> 80 ans',
      av: resA.ageAtteinte,
      b: resB.ageAtteinte != null ? `${resB.ageAtteinte} ans` : '> 80 ans',
      bv: resB.ageAtteinte,
      invert: true, unit: 'ans',
    },
    {
      label: 'Années restantes',
      a: resA.anneesRestantes != null ? `${Math.ceil(resA.anneesRestantes)}` : '—',
      av: resA.anneesRestantes != null ? Math.ceil(resA.anneesRestantes) : null,
      b: resB.anneesRestantes != null ? `${Math.ceil(resB.anneesRestantes)}` : '—',
      bv: resB.anneesRestantes != null ? Math.ceil(resB.anneesRestantes) : null,
      invert: true, unit: 'ans',
    },
    {
      label: 'Capital cible',
      a: fmtEur(Math.round(resA.patrimoineCible)),
      av: resA.patrimoineCible,
      b: fmtEur(Math.round(resB.patrimoineCible)),
      bv: resB.patrimoineCible,
      invert: false, unit: '€',
    },
    {
      label: 'Revenu passif / mois',
      a: fmtEur(Math.round(resA.revenuPassifMensuel)),
      av: resA.revenuPassifMensuel,
      b: fmtEur(Math.round(resB.revenuPassifMensuel)),
      bv: resB.revenuPassifMensuel,
      invert: false, unit: '€',
    },
  ];

  return (
    <div>
      {/* Inputs Scénario B */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 14 }}>
          Scénario B — paramètres modifiés
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
          <NumInput id="cmp-epargne"  label="Épargne mensuelle"      value={compEpargne}   onChange={setCompEpargne}   unit="€/mois" min={0}    max={50000}  />
          <NumInput id="cmp-depenses" label="Dépenses annuelles"     value={compDepenses}  onChange={setCompDepenses}  unit="€/an"   min={1000} max={500000} />
          <StepperInput               label="Rendement"              value={compRendement} onChange={setCompRendement} unit="%"      min={0}    max={15} step={0.5} />
        </div>
      </div>

      {/* Table de comparaison */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ textAlign: 'left',  padding: '10px 0',  color: 'var(--text-secondary)', fontWeight: 600 }}>Métrique</th>
              <th style={{ textAlign: 'right', padding: '10px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>Scénario A</th>
              <th style={{ textAlign: 'right', padding: '10px 8px', color: 'var(--gold)', fontWeight: 600 }}>Scénario B</th>
              <th style={{ textAlign: 'right', padding: '10px 0',  color: 'var(--text-secondary)', fontWeight: 600 }}>Δ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const diff = row.bv != null && row.av != null ? row.bv - row.av : null;
              const better = diff !== null && diff !== 0 ? (row.invert ? diff < 0 : diff > 0) : null;
              const diffLabel = diff !== null && diff !== 0
                ? (diff > 0 ? '+' : '') + (row.unit === '€' ? fmtEur(Math.abs(Math.round(diff))) : Math.round(Math.abs(diff)) + ' ' + row.unit)
                : '—';
              return (
                <tr key={row.label} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '11px 0', color: 'var(--text)' }}>{row.label}</td>
                  <td style={{ textAlign: 'right', padding: '11px 8px', color: 'var(--text-secondary)' }}>{row.a}</td>
                  <td style={{ textAlign: 'right', padding: '11px 8px', fontWeight: 500, color: better === null ? 'var(--text)' : better ? '#22c55e' : '#ef4444' }}>{row.b}</td>
                  <td style={{ textAlign: 'right', padding: '11px 0', fontSize: 11, color: better === null ? 'var(--text-secondary)' : better ? '#22c55e' : '#ef4444' }}>{diffLabel}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        <button onClick={() => setActive(false)} style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
          Fermer la comparaison
        </button>
      </div>
    </div>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQ = [
  { q: "Qu'est-ce que la règle des 25x ?", a: "La règle des 25x stipule que votre patrimoine de retraite doit être égal à 25 fois vos dépenses annuelles, ce qui correspond à un taux de retrait de 4 %/an. Exemple : 30 000 €/an de dépenses → 750 000 € de patrimoine cible." },
  { q: "Qu'est-ce que le Coast FIRE ?", a: "Le Coast FIRE est le montant que vous devez avoir investi aujourd'hui pour que, sans ajouter le moindre euro, la seule capitalisation suffise à atteindre votre objectif FIRE à l'âge de la retraite classique. Une fois ce palier franchi, vous pouvez cesser d'épargner pour la retraite : votre capital « roule en roue libre » jusqu'à l'objectif." },
  { q: "Barista, Lean, Fat FIRE : quelles différences ?", a: "Lean FIRE vise un train de vie frugal (capital moindre, grande discipline). Fat FIRE vise le confort sans contrainte (capital nettement plus élevé). Barista FIRE est hybride : un emploi à temps partiel couvre une partie des dépenses, ce qui réduit le capital nécessaire et laisse le portefeuille croître." },
  { q: "Quel est le taux de retrait sécurisé ?", a: "L'étude Trinity (1998) a conclu que 4 % est historiquement sûr sur 30 ans (probabilité de succès ~95 % avec un portefeuille actions/obligations). Pour une retraite anticipée longue (40+ ans), 3,25 à 3,5 % est plus prudent — c'est le « risque de séquence des rendements » : de mauvaises années en début de retraite font plus de dégâts." },
  { q: "Le rendement est-il avant ou après inflation ?", a: "Ce simulateur raisonne en rendement réel (après inflation) et en euros d'aujourd'hui. Un portefeuille d'actions diversifié a historiquement rapporté ~7 % nominal ; en retirant ~2 % d'inflation, on obtient ~5 % réel. Vos dépenses cibles restent donc exprimées en pouvoir d'achat actuel." },
  { q: "Et les impôts sur les revenus de placement ?", a: "Activez l'option fiscalité pour majorer le capital cible. En France, le PFU (« flat tax ») est de 30 % sur les gains, mais comme seule la part de plus-value d'un retrait est taxée, le taux effectif sur un retrait est souvent de l'ordre de 10 à 17 %. Les enveloppes PEA et assurance-vie (après 8 ans) réduisent fortement cette charge." },
  { q: "Dois-je compter ma résidence principale ?", a: "Si elle n'est pas louée, elle ne génère pas de revenus passifs et ne devrait pas entrer dans le capital FIRE. En revanche, le fait d'être propriétaire réduit vos dépenses annuelles cibles (pas de loyer), ce qui abaisse mécaniquement le capital nécessaire." },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button onClick={() => setOpen(o => !o)} aria-expanded={open}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, background: "none", border: "none", cursor: "pointer", padding: "18px 0", textAlign: "left" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: "var(--text)", lineHeight: 1.4 }}>{q}</span>
        <span aria-hidden="true" style={{ flexShrink: 0, fontSize: 18, color: open ? "var(--gold)" : "var(--text-secondary)" }}>{open ? "−" : "+"}</span>
      </button>
      {open && <p style={{ paddingBottom: 18, paddingRight: 32, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>{a}</p>}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function Fire() {
  const [theme, setTheme] = useTheme();

  const [ageActuel, setAge]               = useState(null);
  const [capitalActuel, setCapital]       = useState(null);
  const [epargneMensuelle, setEpargne]    = useState(null);
  const [revenuMensuel, setRevenu]        = useState(null);
  const [rendementAnnuel, setRendement]   = useState(RENDEMENT_DEFAUT);
  const [depensesAnnuelles, setDepenses]  = useState(null);
  const [tauxRetrait, setTauxRetrait]     = useState(TAUX_RETRAIT_DEFAUT);
  const [tauxImpot, setTauxImpot]         = useState(0);
  const [fiscaliteOn, setFiscaliteOn]     = useState(false);
  const [ageCoast, setAgeCoast]           = useState(AGE_COAST_DEFAUT);
  const [now] = useState(() => Date.now());
  const [historySaved, setHistorySaved] = useState(false);

  const resultsRef = useRef(null);
  const chartRef = useRef(null);
  const { getProfile, updateProfile } = useProfile();
  const { saveEntry } = useSimHistory();

  useEffect(() => {
    document.title = "Simulateur FIRE 2026 — Indépendance financière & Coast FIRE";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Calculez à quel âge vous atteindrez l'indépendance financière : règle des 4 %, Coast FIRE, paliers Lean/Barista/Fat FIRE, taux d'épargne, fiscalité et projection année par année.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.mesimulateurs.fr' + window.location.pathname;
    track('simulator_view', { name: 'fire' });
    if (!sessionStorage.getItem('tracked_fire')) {
      sessionStorage.setItem('tracked_fire', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'fire' })
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const shared = readShareParams();
    const profile = getProfile();
    if (shared) {
      if (shared.ageActuel !== undefined) setAge(shared.ageActuel);
      if (shared.capitalActuel !== undefined) setCapital(shared.capitalActuel);
      if (shared.epargneMensuelle !== undefined) setEpargne(shared.epargneMensuelle);
      if (shared.revenuMensuel !== undefined) setRevenu(shared.revenuMensuel);
      if (shared.rendementAnnuel !== undefined) setRendement(shared.rendementAnnuel);
      if (shared.depensesAnnuelles !== undefined) setDepenses(shared.depensesAnnuelles);
      if (shared.tauxRetrait !== undefined) setTauxRetrait(shared.tauxRetrait);
      if (shared.tauxImpot !== undefined) { setTauxImpot(shared.tauxImpot); if (shared.tauxImpot > 0) setFiscaliteOn(true); }
      if (shared.ageCoast !== undefined) setAgeCoast(shared.ageCoast);
    } else {
      // Pas d'URL partagée → pré-remplir depuis le profil sauvegardé
      if (profile.ageActuel !== undefined) setAge(profile.ageActuel);
      if (profile.capitalActuel !== undefined) setCapital(profile.capitalActuel);
      if (profile.epargneMensuelle !== undefined) setEpargne(profile.epargneMensuelle);
      if (profile.revenuMensuel !== undefined) setRevenu(profile.revenuMensuel);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Synchronise les champs "profil global" avec localStorage
  useEffect(() => {
    updateProfile({ ageActuel, capitalActuel, epargneMensuelle, revenuMensuel });
  }, [ageActuel, capitalActuel, epargneMensuelle, revenuMensuel]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ ageActuel, capitalActuel, epargneMensuelle, revenuMensuel, rendementAnnuel, depensesAnnuelles, tauxRetrait, tauxImpot, ageCoast }));
  }, [ageActuel, capitalActuel, epargneMensuelle, revenuMensuel, rendementAnnuel, depensesAnnuelles, tauxRetrait, tauxImpot, ageCoast]);

  const tauxImpotEff = fiscaliteOn ? tauxImpot : 0;
  const res = calcFire({ ageActuel, capitalActuel, epargneMensuelle, rendementAnnuel, depensesAnnuelles, tauxRetrait, tauxImpot: tauxImpotEff });
  const patrimoineAnim = useAnimatedNumber(res.patrimoineCible);

  const hasResult     = (depensesAnnuelles || 0) > 0;
  const isAlreadyFire = res.anneesRestantes === 0 && hasResult;
  const nonAtteint    = hasResult && !isAlreadyFire && res.ageAtteinte === null;

  const ageRef = ageActuel || 30;
  const swr = tauxRetrait / 100;

  // Taux d'épargne (métrique clé du mouvement FIRE)
  const savingsRate = (revenuMensuel && revenuMensuel > 0 && epargneMensuelle)
    ? Math.min((epargneMensuelle / revenuMensuel) * 100, 100)
    : null;

  // Coast FIRE : capital à avoir aujourd'hui pour atteindre la cible à l'âge `ageCoast` sans rien ajouter
  const yearsToCoast = (ageCoast || AGE_COAST_DEFAUT) - ageRef;
  const coastNumber = hasResult && yearsToCoast > 0
    ? res.patrimoineCible / Math.pow(1 + rendementAnnuel / 100, yearsToCoast)
    : res.patrimoineCible;
  const coastReached = (capitalActuel || 0) >= coastNumber;
  const coastPct = coastNumber > 0 ? Math.min(((capitalActuel || 0) / coastNumber) * 100, 100) : 0;

  // Paliers FIRE
  const milestoneDefs = [
    { key: "barista", icon: "☕", label: "Barista FIRE", mult: 0.5, desc: "Un mi-temps couvre l'autre moitié" },
    { key: "lean",    icon: "🌿", label: "Lean FIRE",    mult: 0.7, desc: "Train de vie frugal" },
    { key: "fire",    icon: "🔥", label: "FIRE",          mult: 1,   desc: "Indépendance complète (25×)" },
    { key: "fat",     icon: "🛋️", label: "Fat FIRE",      mult: 1.5, desc: "Confort, sans contrainte" },
  ];
  const milestones = hasResult ? milestoneDefs.map(m => {
    const target = (res.depensesBrutes * m.mult) / swr;
    const years = yearsToTarget({ cap: capitalActuel || 0, epargneMensuelle, rAnnual: rendementAnnuel, target });
    const reached = (capitalActuel || 0) >= target;
    const age = years != null && (ageRef + Math.ceil(years)) <= AGE_MAX ? ageRef + Math.ceil(years) : null;
    return { ...m, target, years, reached, age };
  }) : [];

  // Date d'atteinte FIRE
  const fireDate = res.anneesRestantes
    ? new Date(now + res.anneesRestantes * 365.25 * 86400000)
    : null;
  const fireDateLabel = fireDate ? fireDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : null;

  const handleSaveHistory = useCallback(() => {
    const label = isAlreadyFire
      ? 'FIRE déjà atteint 🎉'
      : res.ageAtteinte
        ? `FIRE à ${res.ageAtteinte} ans · ${fmtEur(Math.round(res.patrimoineCible))}`
        : `Cible ${fmtEur(Math.round(res.patrimoineCible))}`;
    saveEntry({ simulator: 'fire', label, shareUrl: window.location.pathname + window.location.search });
    setHistorySaved(true);
    setTimeout(() => setHistorySaved(false), 2500);
  }, [res, isAlreadyFire, saveEntry]);

  const totalEpargne = hasResult && res.anneesRestantes
    ? (epargneMensuelle || 0) * Math.ceil(res.anneesRestantes) * 12
    : 0;
  const interetsGeneres = hasResult && res.patrimoineCible > 0
    ? Math.max(0, res.patrimoineCible - (capitalActuel || 0) - totalEpargne)
    : 0;

  const fireChartData = useMemo(() => {
    if (!hasResult) return [];
    const cap = capitalActuel || 0;
    const vers = epargneMensuelle || 0;
    const r = rendementAnnuel / 100 / 12;
    const maxMonths = (Math.ceil(res.anneesRestantes || 30) + 2) * 12;
    const pts = [];
    for (let m = 0; m <= maxMonths; m++) {
      let val;
      if (r > 1e-10) {
        const f = Math.pow(1 + r, m);
        val = cap * f + vers * ((f - 1) / r);
      } else {
        val = cap + vers * m;
      }
      pts.push({ t: m / 12, value: val });
      if (res.patrimoineCible > 0 && val >= res.patrimoineCible * 1.02) break;
    }
    return pts;
  }, [capitalActuel, epargneMensuelle, rendementAnnuel, hasResult, res.anneesRestantes, res.patrimoineCible]);

  const report = {
    title: "Simulateur FIRE — Indépendance financière",
    highlight: {
      label: isAlreadyFire ? "Statut FIRE" : "Patrimoine cible (indépendance)",
      value: !hasResult ? "—" : isAlreadyFire ? "FIRE déjà atteint" : fmtEur(Math.round(res.patrimoineCible)),
    },
    params: [
      { label: "Âge actuel", value: ageActuel ? `${ageActuel} ans` : "—" },
      { label: "Capital actuel", value: fmtEur(capitalActuel ?? 0) },
      { label: "Épargne mensuelle", value: epargneMensuelle ? fmtEur(epargneMensuelle) : "—" },
      { label: "Dépenses annuelles visées", value: depensesAnnuelles ? fmtEur(depensesAnnuelles) : "—" },
      { label: "Rendement annuel réel", value: `${rendementAnnuel} %` },
      { label: "Taux de retrait (SWR)", value: `${tauxRetrait} %` },
    ],
    results: hasResult ? [
      { label: "Patrimoine cible", value: fmtEur(Math.round(res.patrimoineCible)), strong: true },
      ...(res.ageAtteinte ? [{ label: "Âge d'atteinte FIRE", value: `${res.ageAtteinte} ans` }] : []),
      ...(res.anneesRestantes ? [{ label: "Années restantes", value: `${Math.ceil(res.anneesRestantes)}` }] : []),
      { label: "Revenu passif mensuel", value: fmtEur(Math.round(res.revenuPassifMensuel)) },
      ...(savingsRate != null ? [{ label: "Taux d'épargne", value: `${Math.round(savingsRate)} %` }] : []),
    ] : [],
    notes: hasResult ? [
      isAlreadyFire
        ? "Votre capital actuel couvre déjà vos dépenses au taux de retrait choisi."
        : `Règle des ${tauxRetrait} % : patrimoine cible = dépenses annuelles ÷ ${(tauxRetrait / 100).toFixed(2)}.`,
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur FIRE — Indépendance financière",
        "url": "https://www.mesimulateurs.fr/simulateurs/fire",
        "description": "Calculez à quel âge vous atteindrez l'indépendance financière avec la règle des 4 %. Coast FIRE, paliers Lean/Fat/Barista, projection année par année.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": "fr-FR",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": FAQ.map(f => ({
          "@type": "Question", "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }} />
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 60px" }}>
        <SimulateurHeader
          icon="🔥"
          badge="Finances · Simulation 2026"
          title="Indépendance financière (FIRE)"
          desc="À quel âge pourrez-vous vivre de vos investissements ? Capital cible, Coast FIRE, paliers Lean / Barista / Fat et trajectoire année par année."
        />

        {/* Reassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "rgba(184,147,74,0.07)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {["✓ Règle des 25x (SWR 4 %)", "✓ Coast FIRE & paliers", "✓ Taux d'épargne", "✓ Calcul 100 % local"].map((t, i) => (
            <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>
          ))}
        </div>

        {/* Formulaire */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px 28px", boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>
            Situation actuelle
          </h2>

          <NumInput id="age-actuel" label="Âge actuel" value={ageActuel} onChange={setAge} unit="ans" min={15} max={79} hint="Votre âge pour estimer l'âge d'atteinte FIRE" />
          <NumInput id="capital-actuel" label="Capital actuel" value={capitalActuel} onChange={setCapital} unit="€" min={0} max={10000000} hint="Épargne + investissements (hors résidence principale)" />
          <NumInput id="epargne-mensuelle" label="Épargne mensuelle" value={epargneMensuelle} onChange={setEpargne} unit="€/mois" min={0} max={50000}
            hint={epargneMensuelle ? `${fmtEur(epargneMensuelle * 12)} / an épargnés` : "Montant réellement mis de côté chaque mois"} />
          <NumInput id="revenu-mensuel" label="Revenu net mensuel (optionnel)" value={revenuMensuel} onChange={setRevenu} unit="€/mois" min={0} max={100000}
            hint={savingsRate != null ? `Taux d'épargne : ${Math.round(savingsRate)} % de vos revenus` : "Pour calculer votre taux d'épargne"} />

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, marginTop: 32, fontWeight: 400 }}>
            Objectif FIRE
          </h2>

          <NumInput id="depenses-annuelles" label="Dépenses annuelles cibles" value={depensesAnnuelles} onChange={setDepenses} unit="€/an" min={1000} max={500000}
            hint={depensesAnnuelles ? `soit ${fmtEur(Math.round(depensesAnnuelles / 12))} / mois (euros d'aujourd'hui)` : "Vos dépenses estimées une fois à la retraite"} />
          <StepperInput label="Rendement annuel espéré" value={rendementAnnuel} onChange={setRendement} min={0} max={15} step={0.5} unit="%" hint="Rendement réel après inflation (portefeuille actions ~5 %)" tooltip="5 % réel = ~7 % nominal − 2 % inflation" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -10, marginBottom: 16 }}>
            <HistoricalReturnPicker duration={Math.ceil(res.anneesRestantes) || 30} onSelect={setRendement} />
          </div>
          <StepperInput label="Taux de retrait sécurisé" value={tauxRetrait} onChange={setTauxRetrait} min={1} max={6} step={0.25} unit="%" hint="4 % recommandé (étude Trinity) · 3,5 % pour une retraite très longue" tooltip="3,5 % = très conservateur · 4 % = équilibré · 5 % = agressif" />
          <StepperInput label="Âge de retraite « classique » (Coast FIRE)" value={ageCoast} onChange={setAgeCoast} min={Math.max(ageRef + 1, 50)} max={75} step={1} unit="ans" hint="Âge cible si vous laissez votre capital croître sans plus épargner" />

          {/* Fiscalité */}
          <div style={{ marginTop: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: fiscaliteOn ? 18 : 0 }}>
              <div>
                <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)" }}>Tenir compte de la fiscalité</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>Majore le capital cible pour absorber l'impôt sur les retraits</div>
              </div>
              <Toggle checked={fiscaliteOn} onChange={setFiscaliteOn} />
            </div>
            {fiscaliteOn && (
              <StepperInput label="Imposition effective sur les retraits" value={tauxImpot} onChange={setTauxImpot} min={0} max={30} step={1} unit="%"
                hint="PFU 30 % sur les gains → souvent ~10–17 % en effectif (PEA/assurance-vie réduisent ce taux)" tooltip="Seule la part de plus-value d'un retrait est taxée, pas le capital." />
            )}
          </div>
        </div>

        {/* Résultats */}
        <div style={{ background: "linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginTop: 20, boxShadow: "var(--card-shadow)" }} ref={resultsRef}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>
            Votre trajectoire FIRE
          </h2>

          {/* Héro */}
          <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
            {!hasResult ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>
                Renseignez vos dépenses annuelles pour démarrer.
              </p>
            ) : isAlreadyFire ? (
              <>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px,8vw,68px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Objectif atteint ! 🎉
                </div>
                <div style={{ marginTop: 12, fontSize: 14, color: "var(--text-secondary)" }}>
                  Votre patrimoine actuel peut déjà couvrir vos dépenses indéfiniment.
                </div>
              </>
            ) : nonAtteint ? (
              <>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Patrimoine cible</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px,8vw,68px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {fmtEur(Math.round(patrimoineAnim))}
                </div>
                <div style={{ marginTop: 12, fontSize: 14, color: "#e08030" }}>
                  Non atteint avant {AGE_MAX} ans avec ces paramètres. Augmentez l'épargne ou réduisez les dépenses cibles.
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
                  Âge d'atteinte FIRE
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(56px,12vw,88px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {res.ageAtteinte} ans
                </div>
                <div style={{ marginTop: 10, fontSize: 14, color: "var(--text-secondary)" }}>
                  {ageActuel ? `dans ${Math.ceil(res.anneesRestantes)} ans` : ""}{fireDateLabel ? ` · vers ${fireDateLabel}` : ""} · patrimoine cible{" "}
                  <strong style={{ color: "var(--text)" }}>{fmtEur(Math.round(res.patrimoineCible))}</strong>
                </div>
              </>
            )}
          </div>

          {hasResult && !isAlreadyFire && (
            <>
              {/* Barre de progression */}
              <ProgressBar
                label="Progression vers FIRE"
                value={capitalActuel || 0}
                total={res.patrimoineCible}
                color="linear-gradient(90deg,var(--gold-mid),var(--gold))"
              />

              {/* Courbe SVG */}
              {res.projectionData.length >= 2 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                    Courbe de croissance du patrimoine
                  </div>
                  <div ref={chartRef}>
                    <GrowthCurve projectionData={res.projectionData} patrimoineCible={res.patrimoineCible} />
                  </div>
                </div>
              )}

              {/* Chips */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
                {res.ageAtteinte && <Chip label="Âge FIRE" value={`${res.ageAtteinte} ans`} accent />}
                {res.anneesRestantes && <Chip label="Années restantes" value={`${Math.ceil(res.anneesRestantes)}`} />}
                <Chip label="Revenu passif mensuel" value={fmtEur(Math.round(res.revenuPassifMensuel))} accent />
                <Chip label="Capital cible" value={fmtEur(Math.round(res.patrimoineCible))} />
                {savingsRate != null && <Chip label="Taux d'épargne" value={`${Math.round(savingsRate)} %`} accent />}
                {totalEpargne > 0 && <Chip label="Total épargné" value={fmtEur(Math.round(totalEpargne))} />}
                {interetsGeneres > 0 && <Chip label="Intérêts générés" value={fmtEur(Math.round(interetsGeneres))} accent />}
                {tauxImpotEff > 0 && <Chip label="Retrait brut visé" value={fmtEur(Math.round(res.revenuPassifBrutMensuel))} />}
              </div>

              {/* Coast FIRE */}
              {yearsToCoast > 0 && (
                <div style={{ background: "var(--card-bg)", border: `1px solid ${coastReached ? "rgba(34,197,94,0.35)" : "var(--border)"}`, borderRadius: 14, padding: "18px 20px", marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 18 }}>🛟</span>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: "var(--text)" }}>Coast FIRE</span>
                    </div>
                    <StatusBadge status={coastReached ? "good" : "gold"} label={coastReached ? "Atteint ✓" : `${Math.round(coastPct)} %`} />
                  </div>
                  <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
                    {coastReached
                      ? <>Avec <strong style={{ color: "var(--text)" }}>{fmtEur(capitalActuel || 0)}</strong> déjà investis, vous pouvez cesser d'épargner pour la retraite : la seule capitalisation atteindra votre objectif vers {ageCoast} ans.</>
                      : <>Il vous faut <strong style={{ color: "var(--gold)" }}>{fmtEur(Math.round(coastNumber))}</strong> investis aujourd'hui pour atteindre votre objectif à {ageCoast} ans <em>sans plus rien épargner</em>. Au-delà de ce palier, votre capital « roule en roue libre ».</>}
                  </p>
                  <ProgressBar label="Vers le Coast FIRE" value={capitalActuel || 0} total={coastNumber} />
                </div>
              )}

              {/* Paliers FIRE */}
              {milestones.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
                    Vos paliers d'indépendance
                  </div>
                  <MilestonesTable milestones={milestones} />
                </div>
              )}
            </>
          )}

          {hasResult && (
            <div role="note" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              ⚠️ <strong>Simulation indicative.</strong> Ne constitue pas un conseil en investissement. Les marchés financiers sont volatils et les rendements passés ne garantissent pas les rendements futurs. Calculs en euros d'aujourd'hui (rendement réel).
            </div>
          )}

          {hasResult && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
              <button
                onClick={handleSaveHistory}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", borderRadius: 8,
                  border: `1px solid ${historySaved ? "rgba(34,197,94,0.4)" : "var(--border)"}`,
                  background: historySaved ? "rgba(34,197,94,0.08)" : "transparent",
                  color: historySaved ? "#22c55e" : "var(--text-secondary)",
                  fontSize: 12, cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {historySaved ? "✓" : "💾"}<span className="btn-text"> {historySaved ? "Sauvegardée" : "Sauvegarder cette simulation"}</span>
              </button>
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
<ShareBar
              params={{ ageActuel, capitalActuel, epargneMensuelle, revenuMensuel, rendementAnnuel, depensesAnnuelles, tauxRetrait, tauxImpot: tauxImpotEff, ageCoast }}
              resultsRef={resultsRef}
              chartRef={chartRef}
              report={report}
              name="fire"
            />
          </div>
        </div>

        {/* AdSense mid */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {hasResult && (
          <>
            <AccordionSection title="Détail année par année" subtitle="Versements, intérêts et patrimoine cumulé">
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 12 }}>
                <button
                  onClick={() => downloadCSV(
                    res.projectionData.slice(1).map(d => ({
                      'Âge': d.age,
                      'Versements (€)': Math.round(d.versements),
                      'Intérêts (€)': Math.round(d.interets),
                      'Patrimoine (€)': Math.round(d.patrimoine),
                    })),
                    'projection-fire.csv'
                  )}
                  style={{
                    padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)",
                    background: "transparent", color: "var(--text-secondary)",
                    fontSize: 12, cursor: "pointer",
                  }}
                >
                  ↓ CSV
                </button>
                <button
                  onClick={() => downloadXLSX(
                    [{ name: 'Projection FIRE', rows: res.projectionData.slice(1).map(d => ({
                      'Âge': d.age,
                      'Versements (€)': Math.round(d.versements),
                      'Intérêts (€)': Math.round(d.interets),
                      'Patrimoine (€)': Math.round(d.patrimoine),
                    })) }],
                    'projection-fire.xlsx'
                  )}
                  style={{
                    padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)",
                    background: "transparent", color: "var(--text-secondary)",
                    fontSize: 12, cursor: "pointer",
                  }}
                >
                  ↓ Excel
                </button>
              </div>
              <YearTable projectionData={res.projectionData} />
            </AccordionSection>

            <AccordionSection title="Le taux d'épargne, vrai moteur du FIRE" subtitle="Combien d'années selon la part que vous épargnez">
              <SavingsRateTable savingsRate={savingsRate} />
            </AccordionSection>

            <AccordionSection title="Comprendre la règle des 25x" subtitle="Math du taux de retrait sécurisé">
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                <p style={{ marginBottom: 14 }}>La <strong>règle des 25x</strong> : votre patrimoine doit être égal à 25 fois vos dépenses annuelles pour soutenir un taux de retrait de 4 % à perpétuité.</p>
                <p style={{ marginBottom: 14 }}><strong>Exemple :</strong> {fmtEur(depensesAnnuelles || 30000)} / an × 25 = <strong>{fmtEur((depensesAnnuelles || 30000) * 25)}</strong> de patrimoine cible.</p>
                <p>Cette règle repose sur l'<strong>étude Trinity (1998)</strong>, qui a analysé les marchés depuis 1926 et établi qu'un taux de 4 % résiste à 95 % des scénarios sur 30 ans.</p>
              </div>
            </AccordionSection>

            <AccordionSection title="Sensibilité : impact du taux de retrait" subtitle="Patrimoine cible selon différents taux">
              <SensibiliteTable depensesBrutes={res.depensesBrutes} tauxRetrait={tauxRetrait} />
            </AccordionSection>

            <AccordionSection title="⚖️ Comparer deux scénarios" subtitle="Mesurez l'impact d'une variation clé côte à côte">
              <CompareSection
                resA={res}
                ageRef={ageRef}
                epargneMensuelle={epargneMensuelle}
                depensesAnnuelles={depensesAnnuelles}
                rendementAnnuel={rendementAnnuel}
                tauxRetrait={tauxRetrait}
                tauxImpotEff={tauxImpotEff}
                capitalActuel={capitalActuel}
                ageActuel={ageActuel}
              />
            </AccordionSection>
          </>
        )}

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos de ce simulateur</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>La règle des 4 % et l'étude Trinity</h3>
            <p style={{ marginBottom: 16 }}>Le mouvement FIRE (Financial Independence, Retire Early) repose sur l'étude Trinity de 1998, qui a analysé la survie de portefeuilles d'investissement sur des périodes de 15 à 30 ans. Conclusion : un taux de retrait de 4 % par an sur un portefeuille diversifié actions/obligations a historiquement permis de ne jamais épuiser le capital sur 30 ans, avec un taux de succès supérieur à 95 %. Pour une retraite très anticipée (40 ans ou plus de retraits), beaucoup retiennent 3,25 à 3,5 % afin de se prémunir contre le risque de séquence des rendements — l'idée qu'une chute des marchés en début de retraite est bien plus dangereuse qu'une chute tardive.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Le taux d'épargne, métrique reine</h3>
            <p style={{ marginBottom: 16 }}>Contre-intuitivement, ce qui détermine la durée du chemin vers l'indépendance n'est pas tant le niveau de revenu que la <strong>part de ce revenu réellement épargnée</strong>. Une personne épargnant 50 % de ses revenus atteint l'indépendance en ~17 ans, contre ~37 ans à 20 % d'épargne, indépendamment du montant absolu. Augmenter son taux d'épargne agit à la fois en accélérant l'accumulation et en abaissant les dépenses cibles — donc le capital nécessaire.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Coast FIRE : le point de bascule</h3>
            <p style={{ marginBottom: 16 }}>Le Coast FIRE désigne le moment où votre capital investi est suffisant pour atteindre, par la seule magie des intérêts composés, votre objectif FIRE à l'âge de la retraite classique — sans avoir besoin d'épargner un euro de plus. Une fois ce palier franchi, vous n'avez plus à mettre de côté pour la retraite : vous pouvez réduire votre temps de travail, changer pour un métier moins rémunérateur mais plus épanouissant, et simplement couvrir vos dépenses courantes.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Les variantes : Lean, Fat et Barista FIRE</h3>
            <p>Le Lean FIRE cible un train de vie frugal, avec un capital modeste mais une grande discipline budgétaire. Le Fat FIRE vise le confort sans contrainte, nécessitant un patrimoine nettement plus élevé. Le Barista FIRE est une approche hybride : on atteint une indépendance partielle et on conserve un emploi à temps partiel pour couvrir une partie des dépenses, laissant le portefeuille croître sans retrait total.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>
            Questions fréquentes — FIRE
          </h2>
          {FAQ.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          <p style={{ paddingTop: 20, fontSize: 12, color: "var(--text-secondary)" }}>
            Ressources :{" "}
            <a href="https://www.earlyretirementnow.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>Early Retirement Now</a>
            {" · "}
            <a href="https://www.bogleheads.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>Bogleheads</a>
          </p>
        </div>

        {/* AdSense bas */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
