import { useState, useEffect, useMemo } from "react";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, ProgressBar, useAnimatedNumber,
  fmt, fmtEur, SimulateurHeader,
} from "../../components/ui.jsx";

// ─── Constantes ───────────────────────────────────────────────────────────────
const RENDEMENT_DEFAUT = 5;
const TAUX_RETRAIT_DEFAUT = 4;
const AGE_MAX = 80;

// ─── Calculs ─────────────────────────────────────────────────────────────────
function calcFire({ ageActuel, capitalActuel, epargneMensuelle, rendementAnnuel, depensesAnnuelles, tauxRetrait }) {
  const empty = { patrimoineCible: 0, anneesRestantes: null, ageAtteinte: null, progressPct: 0, revenuPassifMensuel: 0, projectionData: [] };
  if (!depensesAnnuelles || depensesAnnuelles <= 0) return empty;

  const patrimoineCible = depensesAnnuelles / (tauxRetrait / 100);
  const cap = capitalActuel || 0;
  const epargne = epargneMensuelle || 0;
  const r = rendementAnnuel / 100 / 12;

  let anneesRestantes = null;
  let ageAtteinte = null;

  if (cap >= patrimoineCible) {
    anneesRestantes = 0;
    ageAtteinte = ageActuel || 0;
  } else if (epargne > 0 || cap > 0) {
    if (r > 1e-10) {
      const Sr = epargne / r;
      const ratio = (patrimoineCible - Sr) / (cap - Sr);
      if (ratio > 0) {
        const n = Math.log(ratio) / Math.log(1 + r);
        if (isFinite(n) && n > 0) {
          anneesRestantes = n / 12;
          const age = ageActuel || 30;
          ageAtteinte = age + Math.ceil(anneesRestantes);
        }
      }
    } else if (epargne > 0) {
      anneesRestantes = (patrimoineCible - cap) / (epargne * 12);
      ageAtteinte = (ageActuel || 30) + Math.ceil(anneesRestantes);
    }
  }

  // Plafonner à AGE_MAX
  const ageRef = ageActuel || 30;
  if (ageAtteinte !== null && ageAtteinte > AGE_MAX) {
    ageAtteinte = null; // Non atteint avant 80 ans
    anneesRestantes = null;
  }

  const progressPct = patrimoineCible > 0 ? Math.min((cap / patrimoineCible) * 100, 100) : 0;
  const revenuPassifMensuel = (patrimoineCible * tauxRetrait) / 100 / 12;

  // Projection annuelle jusqu'à min(ageAtteinte+5, AGE_MAX) ou AGE_MAX
  const maxAge = Math.min(AGE_MAX, ageAtteinte ? ageAtteinte + 3 : ageRef + 40);
  const maxAnnees = Math.max(1, maxAge - ageRef);
  const projectionData = [];
  let patrimoine = cap;
  projectionData.push({ annee: 0, patrimoine, age: ageRef });

  for (let a = 1; a <= maxAnnees; a++) {
    if (r > 1e-10) {
      const factor = Math.pow(1 + r, 12);
      patrimoine = patrimoine * factor + epargne * ((factor - 1) / r);
    } else {
      patrimoine += epargne * 12;
    }
    patrimoine = Math.min(patrimoine, patrimoineCible * 2);
    projectionData.push({ annee: a, patrimoine, age: ageRef + a });
    if (patrimoine >= patrimoineCible && a > 0) break;
  }

  // Fallback : formule analytique échoue (ratio ≤ 0) → source de vérité = simulation
  if (ageAtteinte === null) {
    for (let i = 1; i < projectionData.length; i++) {
      if (projectionData[i].patrimoine >= patrimoineCible) {
        anneesRestantes = projectionData[i].annee;
        const candidateAge = projectionData[i].age;
        ageAtteinte = candidateAge <= AGE_MAX ? candidateAge : null;
        break;
      }
    }
  }

  return { patrimoineCible, anneesRestantes, ageAtteinte, progressPct, revenuPassifMensuel, projectionData };
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

// ─── Table de sensibilité ─────────────────────────────────────────────────────
function SensibiliteTable({ depensesAnnuelles, tauxRetrait }) {
  const taux = [3, 3.5, 4, 4.5, 5];
  if (!depensesAnnuelles) return null;
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
            const target = depensesAnnuelles / (t / 100);
            const target4 = depensesAnnuelles / 0.04;
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

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQ = [
  { q: "Qu'est-ce que la règle des 25x ?", a: "La règle des 25x stipule que votre patrimoine de retraite doit être égal à 25 fois vos dépenses annuelles, ce qui correspond à un taux de retrait de 4 %/an. Exemple : 30 000 €/an de dépenses → 750 000 € de patrimoine cible." },
  { q: "Quel est le taux de retrait sécurisé ?", a: "L'étude Trinity (1998) a conclu que 4 % est historiquement sûr sur 30 ans (probabilité de succès ~95 % avec un portefeuille actions/obligations). Pour une retraite anticipée longue, 3,5 % est plus conservateur. 5 % est risqué sur 40+ ans." },
  { q: "Le rendement est-il avant ou après inflation ?", a: "Ce simulateur utilise un rendement réel (après inflation). Un portefeuille d'actions diversifié a historiquement rapporté ~7 % nominal. En soustrayant 2 % d'inflation moyenne, on obtient ~5 % réel. Ajustez selon votre allocation." },
  { q: "Dois-je compter mon capital immobilier ?", a: "Si votre résidence principale n'est pas mise en location, elle ne génère pas de revenus passifs et ne devrait pas être comptée dans le capital FIRE. Si vous avez des investissements locatifs, intégrez les revenus nets dans vos ressources." },
  { q: "Et les impôts sur les revenus de placement ?", a: "Ce simulateur ne tient pas compte de la fiscalité des plus-values et dividendes (PFU 30% en France). En pratique, l'impact dépend de vos enveloppes (PEA, assurance-vie) — consultez un conseiller fiscal pour optimiser." },
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
  const [rendementAnnuel, setRendement]   = useState(RENDEMENT_DEFAUT);
  const [depensesAnnuelles, setDepenses]  = useState(null);
  const [tauxRetrait, setTauxRetrait]     = useState(TAUX_RETRAIT_DEFAUT);

  useEffect(() => {
    document.title = "Simulateur FIRE 2025 — Liberté financière et indépendance";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Calculez à quel âge vous atteindrez la liberté financière avec la règle des 4% : capital cible, projection de patrimoine, courbe de croissance.");
  }, []);

  const res = calcFire({ ageActuel, capitalActuel, epargneMensuelle, rendementAnnuel, depensesAnnuelles, tauxRetrait });
  const patrimoineAnim = useAnimatedNumber(res.patrimoineCible);
  const progressAnim   = useAnimatedNumber(res.progressPct);

  const hasResult    = (depensesAnnuelles || 0) > 0;
  const isAlreadyFire = res.anneesRestantes === 0 && hasResult;
  const nonAtteint   = hasResult && !isAlreadyFire && res.ageAtteinte === null;

  const totalEpargne  = hasResult && res.anneesRestantes
    ? (epargneMensuelle || 0) * Math.ceil(res.anneesRestantes) * 12
    : 0;
  const interetsGeneres = hasResult && res.patrimoineCible > 0
    ? Math.max(0, res.patrimoineCible - (capitalActuel || 0) - totalEpargne)
    : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 60px" }}>
        <SimulateurHeader
          icon="🔥"
          badge="Finances · Simulation 2026"
          title="Indépendance financière (FIRE)"
          desc="À quel âge pourrez-vous vivre de vos investissements ? Calculez votre patrimoine cible et votre trajectoire vers la liberté financière."
        />

        {/* Reassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "rgba(184,147,74,0.07)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {["✓ Règle des 25x (SWR 4 %)", "✓ Courbe de projection SVG", "✓ Calcul 100 % local"].map((t, i) => (
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

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, marginTop: 32, fontWeight: 400 }}>
            Objectif FIRE
          </h2>

          <NumInput id="depenses-annuelles" label="Dépenses annuelles cibles" value={depensesAnnuelles} onChange={setDepenses} unit="€/an" min={1000} max={500000}
            hint={depensesAnnuelles ? `soit ${fmtEur(Math.round(depensesAnnuelles / 12))} / mois` : "Vos dépenses estimées une fois à la retraite"} />
          <StepperInput label="Rendement annuel espéré" value={rendementAnnuel} onChange={setRendement} min={0} max={15} step={0.5} unit="%" hint="Rendement réel après inflation (portefeuille actions ~5 %)" tooltip="5 % réel = ~7 % nominal − 2 % inflation" />
          <StepperInput label="Taux de retrait sécurisé" value={tauxRetrait} onChange={setTauxRetrait} min={1} max={6} step={0.5} unit="%" hint="4 % recommandé (étude Trinity)" tooltip="3,5 % = très conservateur · 4 % = équilibré · 5 % = agressif" />
        </div>

        {/* Résultats */}
        <div style={{ background: "linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginTop: 20, boxShadow: "var(--card-shadow)" }}>
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
                  {ageActuel ? `dans ${Math.ceil(res.anneesRestantes)} ans · ` : ""}patrimoine cible{" "}
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
                  <GrowthCurve projectionData={res.projectionData} patrimoineCible={res.patrimoineCible} />
                </div>
              )}

              {/* Chips */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
                {res.ageAtteinte && <Chip label="Âge FIRE" value={`${res.ageAtteinte} ans`} accent />}
                {res.anneesRestantes && <Chip label="Années restantes" value={`${Math.ceil(res.anneesRestantes)}`} />}
                <Chip label="Revenu passif mensuel" value={fmtEur(Math.round(res.revenuPassifMensuel))} accent />
                <Chip label="Capital cible" value={fmtEur(Math.round(res.patrimoineCible))} />
                {totalEpargne > 0 && <Chip label="Total épargné" value={fmtEur(Math.round(totalEpargne))} />}
                {interetsGeneres > 0 && <Chip label="Intérêts générés" value={fmtEur(Math.round(interetsGeneres))} accent />}
              </div>
            </>
          )}

          {hasResult && (
            <div role="note" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              ⚠️ <strong>Simulation indicative.</strong> Ne constitue pas un conseil en investissement. Les marchés financiers sont volatiles et les rendements passés ne garantissent pas les rendements futurs.
            </div>
          )}
        </div>

        {/* AdSense mid */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {hasResult && (
          <>
            <AccordionSection title="Comprendre la règle des 25x" subtitle="Math du taux de retrait sécurisé">
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                <p style={{ marginBottom: 14 }}>La <strong>règle des 25x</strong> : votre patrimoine doit être égal à 25 fois vos dépenses annuelles pour soutenir un taux de retrait de 4 % à perpetuité.</p>
                <p style={{ marginBottom: 14 }}><strong>Exemple :</strong> {fmtEur(depensesAnnuelles || 30000)} / an × 25 = <strong>{fmtEur((depensesAnnuelles || 30000) * 25)}</strong> de patrimoine cible.</p>
                <p>Cette règle repose sur l'<strong>étude Trinity (1998)</strong>, qui a analysé les marchés depuis 1926 et établi qu'un taux de 4 % résiste à 95 % des scénarios sur 30 ans.</p>
              </div>
            </AccordionSection>

            <AccordionSection title="Sensibilité : impact du taux de retrait" subtitle="Patrimoine cible selon différents taux">
              <SensibiliteTable depensesAnnuelles={depensesAnnuelles} tauxRetrait={tauxRetrait} />
            </AccordionSection>
          </>
        )}

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
