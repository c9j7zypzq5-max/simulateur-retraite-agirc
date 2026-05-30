import { useState, useEffect, useRef } from "react";
import Footer from "./components/Footer.jsx";
import AdUnit from "./components/AdUnit.jsx";
import Navbar from "./components/Navbar.jsx";
import { useTheme } from "./hooks/useTheme.js";

// ─── Constants ────────────────────────────────────────────────────────────────
const PASS          = 47_100;
const VALEUR_ACHAT  = 7.46;
const VALEUR_SERVICE = 1.4098;
const TAUX_T1       = 0.0787;
const TAUX_T2       = 0.2159;
const TAUX_T1_SAL   = 0.0315;
const TAUX_T1_PAT   = 0.0472;
const TAUX_T2_SAL   = 0.0864;
const TAUX_T2_PAT   = 0.1295;
const GMP_MIN_PTS   = 120;

const COEF_TABLE = { 62:0.90, 63:0.90, 64:0.90, 65:0.90, 66:0.90, 67:1.00, 68:1.10, 69:1.20, 70:1.30 };
const getCoef      = age => COEF_TABLE[age] ?? 1.00;
const getCoefLabel = age =>
  !age ? "—" :
  age < 67  ? "−10 % (solidarité · 3 ans)" :
  age === 67 ? "Aucun — taux plein" :
               `+${(age - 67) * 10} % (bonus fidélité · 1 an)`;

const fmt    = (n, d = 0) => (isNaN(n) ? 0 : n).toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtEur = n => fmt(n) + " €";
const signFmt = n => (n > 0 ? "+" : "") + fmtEur(n);
const fmtPDF    = (n, d = 0) => Number(n).toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const fmtEurPDF = n => fmtPDF(Math.round(n)) + " EUR";

// ─── Calcul principal ─────────────────────────────────────────────────────────
function calcResult({ salaire, anneesFaites, anneesRestantes,
                      evolutionSalaire = 2, tauxReval = 1,
                      ageDépart = 65, bonus3Enfants = false, estCadre = false }) {
  if (!salaire && salaire !== 0) return {
    pensionNette: 0, pensionBrute: 0, totalPoints: 0, pointsAcquis: 0, pointsFuturs: 0,
    ptsParAn: 0, pensionBruteSansReval: 0, pensionNetteSansReval: 0,
    valServProj: VALEUR_SERVICE, salaireDépart: 0,
    coefAge: 1, coefEnfants: 1, coefTotal: 1, cotSalTotal: 0, cotPatTotal: 0,
  };

  const sal = Math.max(0, salaire);
  const af  = Math.max(0, anneesFaites ?? 0);
  const ar  = Math.max(0, anneesRestantes ?? 0);

  const salAnnActuel = sal * 12;
  const t1p = Math.min(salAnnActuel, PASS);
  const t2p = Math.max(0, Math.min(salAnnActuel, 8 * PASS) - PASS);
  let ptsParAn = ((t1p * TAUX_T1) + (t2p * TAUX_T2)) / VALEUR_ACHAT;
  if (estCadre && salAnnActuel < PASS) ptsParAn = Math.max(ptsParAn, GMP_MIN_PTS);
  const pointsAcquis = ptsParAn * af;
  const cotSalPassé  = (t1p * TAUX_T1_SAL + t2p * TAUX_T2_SAL) * af;
  const cotPatPassé  = (t1p * TAUX_T1_PAT + t2p * TAUX_T2_PAT) * af;

  let pointsFuturs = 0, cotSalFutur = 0, cotPatFutur = 0;
  let salCourant = sal;
  for (let i = 0; i < ar; i++) {
    const salAnn = salCourant * 12;
    const t1 = Math.min(salAnn, PASS);
    const t2 = Math.max(0, Math.min(salAnn, 8 * PASS) - PASS);
    let pts = ((t1 * TAUX_T1) + (t2 * TAUX_T2)) / VALEUR_ACHAT;
    if (estCadre && salAnn < PASS) pts = Math.max(pts, GMP_MIN_PTS);
    pointsFuturs  += pts;
    cotSalFutur   += t1 * TAUX_T1_SAL + t2 * TAUX_T2_SAL;
    cotPatFutur   += t1 * TAUX_T1_PAT + t2 * TAUX_T2_PAT;
    salCourant    *= (1 + (evolutionSalaire ?? 2) / 100);
  }
  const salaireDépart = sal * Math.pow(1 + (evolutionSalaire ?? 2) / 100, ar);
  const totalPoints   = pointsAcquis + pointsFuturs;

  const coefAge     = getCoef(ageDépart ?? 65);
  const coefEnfants = bonus3Enfants ? 1.10 : 1.00;
  const coefTotal   = coefAge * coefEnfants;

  const valServProj = VALEUR_SERVICE * Math.pow(1 + (tauxReval ?? 1) / 100, ar);
  const pensionBrute = (totalPoints * valServProj / 12) * coefTotal;
  const pensionNette = pensionBrute * 0.83;

  const pensionBruteSansReval = (totalPoints * VALEUR_SERVICE / 12) * coefTotal;
  const pensionNetteSansReval = pensionBruteSansReval * 0.83;

  return {
    pointsAcquis, pointsFuturs, totalPoints, ptsParAn,
    pensionBrute, pensionNette,
    pensionBruteSansReval, pensionNetteSansReval,
    valServProj, salaireDépart,
    coefAge, coefEnfants, coefTotal,
    cotSalTotal: cotSalPassé + cotSalFutur,
    cotPatTotal: cotPatPassé + cotPatFutur,
  };
}

// ─── Export PDF ───────────────────────────────────────────────────────────────
async function generatePDF(inputs, res, setExp) {
  setExp(true);
  try {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const now = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
    const G = [184, 147, 74], D = [6, 14, 28], S = [100, 116, 139], W = [226, 232, 240];

    doc.setFillColor(...D); doc.rect(0, 0, 210, 297, "F");
    doc.setFillColor(...G); doc.rect(0, 0, 210, 2,   "F");

    doc.setTextColor(241, 228, 195); doc.setFont("helvetica", "bold"); doc.setFontSize(18);
    doc.text("Simulation Retraite Agirc-Arrco 2026", 20, 22);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...S);
    doc.text(`Générée le ${now} — Simulation indicative non contractuelle`, 20, 30);
    doc.setDrawColor(...G); doc.setLineWidth(0.3); doc.line(20, 34, 190, 34);

    let y = 44;
    const sec = t => { doc.setTextColor(232, 192, 106); doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text(t, 20, y); y += 8; };
    const row = (l, v) => { doc.setTextColor(...S); doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.text(l, 20, y); doc.setTextColor(...W); doc.text(String(v), 185, y, { align: "right" }); y += 6.5; };
    const div = () => { doc.setDrawColor(30, 41, 59); doc.line(20, y, 190, y); y += 8; };

    sec("Paramètres saisis");
    row("Salaire brut mensuel",          fmtEurPDF(inputs.salaire ?? 0));
    row("Années déjà cotisées",          `${inputs.anneesFaites ?? 0} ans`);
    row("Années restantes à cotiser",    `${inputs.anneesRestantes ?? 0} ans`);
    row("Âge de départ prévu",           `${inputs.ageDépart ?? "—"} ans`);
    row("Évolution annuelle du salaire", `${(inputs.evolutionSalaire ?? 0) >= 0 ? "+" : ""}${inputs.evolutionSalaire ?? 0} %`);
    row("Taux de revalorisation estimé", `${inputs.tauxReval ?? 0} %/an`);
    row("Statut",                        inputs.estCadre ? "Cadre" : "Non-cadre");
    row("Bonus 3 enfants ou plus",       inputs.bonus3Enfants ? "Oui (+10 %)" : "Non");
    div();

    sec("Points & coefficients");
    row("Points acquis (carrière passée)",   `${fmtPDF(res.pointsAcquis)} pts`);
    row("Points futurs estimés",             `${fmtPDF(res.pointsFuturs)} pts`);
    row("Total de points",                   `${fmtPDF(res.totalPoints)} pts`);
    row("Valeur de service projetée",        `${res.valServProj.toFixed(4)} EUR/point`);
    row("Coefficient appliqué",             `x ${res.coefTotal.toFixed(2)} (${getCoefLabel(inputs.ageDépart)}${inputs.bonus3Enfants ? " + 10 % enfants" : ""})`);
    y += 3;

    doc.setFillColor(15, 23, 42); doc.roundedRect(20, y, 170, 26, 3, 3, "F");
    doc.setDrawColor(...G); doc.setLineWidth(0.3); doc.roundedRect(20, y, 170, 26, 3, 3, "S");
    doc.setTextColor(...S); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.text("Pension nette mensuelle estimée", 30, y + 9);
    doc.setFont("helvetica", "bold"); doc.setFontSize(20); doc.setTextColor(...G);
    doc.text(fmtEurPDF(res.pensionNette), 30, y + 20);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...S);
    doc.text(`(${fmtEurPDF(res.pensionBrute)} brut/mois)`, 120, y + 20);
    y += 34;

    row("Avec revalorisation estimée",      `${fmtEurPDF(res.pensionNette)}/mois`);
    row("Sans revalorisation (base 2026)", `${fmtEurPDF(res.pensionNetteSansReval)}/mois`);
    row("Gain lié à la revalorisation",    `+${fmtEurPDF(res.pensionNette - res.pensionNetteSansReval)}/mois`);
    row("Salaire estimé au départ",         fmtEurPDF(res.salaireDépart));
    div();

    sec("Cotisations totales (carrière complète)");
    row("Part salariale",                  fmtEurPDF(res.cotSalTotal));
    row("Part patronale",                  fmtEurPDF(res.cotPatTotal));
    row("Total cotisé (salarié + employeur)", fmtEurPDF(res.cotSalTotal + res.cotPatTotal));
    y += 8;

    doc.setTextColor(...S); doc.setFont("helvetica", "italic"); doc.setFontSize(8);
    const disc = "Simulation indicative basée sur les paramètres Agirc-Arrco 2026 (PASS 47 100 €, valeur d'achat 7,46 €, valeur de service 1,4098 €/point). Les résultats réels dépendent de votre carrière exacte, des revalorisations futures et de la législation en vigueur. Pour un calcul officiel et personnalisé, consultez info-retraite.fr.";
    doc.text(doc.splitTextToSize(disc, 170), 20, y);
    doc.setTextColor(30, 41, 59); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
    doc.text("www.mesimulateurs.fr · Données officielles Agirc-Arrco 2026", 20, 287);

    doc.save("simulation-retraite-agirc-arrco.pdf");
  } catch (e) { console.error("PDF error:", e); }
  setExp(false);
}

// ─── Animated number hook ────────────────────────────────────────────────────
function useAnimatedNumber(target, duration = 700) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);
  const prevRef  = useRef(0);
  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const from = prevRef.current, start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (target - from) * ease);
      if (p < 1) frameRef.current = requestAnimationFrame(step);
      else prevRef.current = target;
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);
  return display;
}

// ─── UI Components ────────────────────────────────────────────────────────────
function NumInput({ label, value, onChange, unit, hint, min = 0, max = 999999, id, tooltip }) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const hintId  = hint ? `${inputId}-hint` : undefined;
  const [raw, setRaw]     = useState(value === null || value === undefined ? "" : String(value));
  const [focused, setFoc] = useState(false);
  useEffect(() => {
    if (!focused) setRaw(value === null || value === undefined ? "" : String(value));
  }, [value, focused]);
  const handleChange = e => {
    const v = e.target.value.replace(/[^0-9]/g, "");
    setRaw(v);
    const n = Number(v);
    if (!isNaN(n) && v !== "") onChange(Math.min(Math.max(n, min), max));
  };
  const handleBlur = () => {
    setFoc(false);
    const n = Number(raw);
    if (isNaN(n) || raw === "") setRaw(value === null || value === undefined ? "" : String(value));
    else { const c = Math.min(Math.max(n, min), max); onChange(c); setRaw(String(c)); }
  };
  return (
    <div style={{ marginBottom: 24 }}>
      <label htmlFor={inputId} style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
        {label}
        {tooltip && <span title={tooltip} aria-label={tooltip} style={{ cursor: "help", marginLeft: 6, fontSize: 13, opacity: 0.6, verticalAlign: "middle" }}>ⓘ</span>}
      </label>
      <div style={{ display: "flex", alignItems: "center", background: focused ? "rgba(184,147,74,0.08)" : "var(--input-bg)", border: `1.5px solid ${focused ? "rgba(184,147,74,0.6)" : "var(--border)"}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s, background 0.2s", boxShadow: focused ? "0 0 0 3px rgba(184,147,74,0.12)" : "var(--input-shadow)" }}>
        <input type="text" inputMode="numeric"
          id={inputId} name={inputId}
          aria-describedby={hintId}
          value={focused ? raw : (value === null || value === undefined ? "" : Number(value).toLocaleString("fr-FR"))}
          onChange={handleChange}
          onFocus={() => { setFoc(true); setRaw(value === null || value === undefined ? "" : String(value)); }}
          onBlur={handleBlur}
          placeholder={unit ? `0 ${unit}` : "0"}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: "var(--text)", padding: "14px 0 14px 20px", width: 0 }} />
        {unit && <span style={{ padding: "0 20px", fontSize: 18, color: "var(--gold-mid)", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{unit}</span>}
      </div>
      {hint && <div id={hintId} style={{ marginTop: 8, fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>{hint}</div>}
    </div>
  );
}

function StepperInput({ label, value, onChange, min, max, step = 1, unit = "", hint, tooltip }) {
  const [raw, setRaw] = useState(value === null || value === undefined ? "" : String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setRaw(value === null || value === undefined ? "" : String(value));
  }, [value, focused]);

  function clamp(n) { return Math.min(Math.max(n, min), max); }

  function handleChange(e) {
    const v = e.target.value.replace(/[^0-9.\-]/g, "");
    setRaw(v);
    const n = parseFloat(v);
    if (!isNaN(n)) onChange(clamp(n));
  }

  function handleBlur() {
    setFocused(false);
    const n = parseFloat(raw);
    if (isNaN(n) || raw === "") {
      onChange(min);
      setRaw(String(min));
    } else {
      const c = clamp(n);
      onChange(c);
      setRaw(String(c));
    }
  }

  const dec = () => onChange(clamp(parseFloat(raw || value || min) - step));
  const inc = () => onChange(clamp(parseFloat(raw || value || min) + step));

  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
        {label}
        {tooltip && <span title={tooltip} aria-label={tooltip} style={{ cursor: "help", marginLeft: 6, fontSize: 13, opacity: 0.6 }}>ⓘ</span>}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={dec}
          type="button"
          aria-label={`Diminuer ${label}`}
          style={{
            width: 40, height: 44, borderRadius: 10, border: "1.5px solid var(--border)",
            background: "var(--card-bg)", color: "var(--text)", fontSize: 20, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold-mid)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >−</button>
        <div style={{
          flex: 1, display: "flex", alignItems: "center",
          background: focused ? "rgba(184,147,74,0.08)" : "var(--card-bg)",
          border: `1.5px solid ${focused ? "var(--gold-mid)" : "var(--border)"}`,
          borderRadius: 12, overflow: "hidden",
          transition: "border-color 0.2s",
          boxShadow: focused ? "0 0 0 3px rgba(184,147,74,0.12)" : "none",
        }}>
          <input
            type="text"
            inputMode="decimal"
            value={focused ? raw : (value === null || value === undefined ? "" : String(value))}
            onChange={handleChange}
            onFocus={() => { setFocused(true); setRaw(value === null || value === undefined ? "" : String(value)); }}
            onBlur={handleBlur}
            placeholder="—"
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24, fontWeight: 600, color: "var(--text)",
              padding: "10px 0 10px 16px", width: 0, textAlign: "center",
            }}
          />
          {unit && <span style={{ padding: "0 16px", fontSize: 16, color: "var(--gold-mid)", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{unit}</span>}
        </div>
        <button
          onClick={inc}
          type="button"
          aria-label={`Augmenter ${label}`}
          style={{
            width: 40, height: 44, borderRadius: 10, border: "1.5px solid var(--border)",
            background: "var(--card-bg)", color: "var(--text)", fontSize: 20, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold-mid)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >+</button>
      </div>
      {hint && <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>{hint}</div>}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <div style={{ display: "flex", background: "var(--input-bg)", borderRadius: 10, padding: 3, gap: 2 }}>
      {["Non-cadre", "Cadre"].map((opt, i) => (
        <button key={opt} onClick={() => onChange(i === 1)}
          aria-pressed={String((i === 1) === checked)}
          style={{ padding: "7px 16px", borderRadius: 8, border: "none",
            background: (i === 1) === checked ? "rgba(184,147,74,0.25)" : "transparent",
            color: (i === 1) === checked ? "var(--gold)" : "var(--text-secondary)",
            fontSize: 13, cursor: "pointer", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" }}>
          {opt}
        </button>
      ))}
    </div>
  );
}

function Chip({ label, value, accent, small }) {
  return (
    <div style={{ background: accent ? "rgba(184,147,74,0.12)" : "var(--card-bg)", border: `1px solid ${accent ? "rgba(184,147,74,0.4)" : "var(--border)"}`, borderRadius: 10, padding: small ? "10px 12px" : "14px 16px", boxShadow: "var(--card-shadow)" }}>
      <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 5 }}>{label}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: small ? 16 : 20, fontWeight: 700, color: accent ? "var(--gold)" : "var(--text)" }}>{value}</div>
    </div>
  );
}

function ProgressBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "var(--text-secondary)" }}>
        <span>{label}</span>
        <span style={{ color: "var(--text)" }}>{fmt(value)} pts ({pct.toFixed(0)} %)</span>
      </div>
      <div style={{ height: 5, background: "var(--progress-track)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.5s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

function AccordionSection({ title, subtitle, children, gold = false, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `acc-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 32)}`;
  return (
    <div style={{ background: gold ? "rgba(184,147,74,0.05)" : "var(--card-bg)", border: `1px solid ${gold ? "rgba(184,147,74,0.2)" : "var(--border)"}`, borderRadius: 20, overflow: "hidden", marginTop: 20, boxShadow: "var(--card-shadow)" }}>
      <button onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 28px", background: "none", border: "none", cursor: "pointer" }}>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: gold ? "var(--gold)" : "var(--text)" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 3 }}>{subtitle}</div>}
        </div>
        <span style={{ color: open ? "var(--gold)" : "var(--text-secondary)", fontSize: 22, marginLeft: 16, flexShrink: 0 }} aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div id={panelId} role="region" aria-label={title} style={{ padding: "0 28px 28px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Editorial & FAQ content ─────────────────────────────────────────────────
const EDITORIAL = [
  { title: "Un régime par points pour tous les salariés du privé", text: "L'Agirc-Arrco est le régime de retraite complémentaire obligatoire de l'ensemble des salariés du secteur privé en France. Il fonctionne par accumulation de points : chaque année, une fraction de vos cotisations salariales et patronales est convertie en points de retraite. Au moment de votre départ, le total de vos points est multiplié par la valeur de service du point pour calculer votre pension complémentaire annuelle." },
  { title: "Tranche 1 et Tranche 2 : une cotisation progressive", text: "Vos cotisations sont calculées sur deux tranches définies par rapport au Plafond Annuel de la Sécurité Sociale (PASS, 47 100 € en 2026, soit 3 925 €/mois). La Tranche 1 couvre la part de salaire jusqu'au PASS, avec un taux global de 7,87 %. La Tranche 2 s'applique sur la part entre 1 et 8 PASS, avec un taux de 21,59 %. Cette progressivité explique que les hauts salaires accumulent proportionnellement plus de points chaque année." },
  { title: "Valeur d'achat et valeur de service : deux piliers du système", text: "Le mécanisme repose sur deux valeurs distinctes. La valeur d'achat (7,46 € en 2026) est le coût d'un point : elle détermine combien de points vous accumulez par euro de cotisation. La valeur de service (1,4098 €/point en 2026) est ce que vaut un point lors du versement de votre pension. Ces deux paramètres sont révisés chaque novembre par les partenaires sociaux pour tenir compte de l'inflation et de l'évolution des salaires." },
  { title: "Complémentaire et retraite de base : un duo indissociable", text: "La retraite Agirc-Arrco vient en complément de la retraite de base versée par la CNAV. Pour un salarié type, elle représente entre 30 % et 60 % du total de sa pension. Plus la carrière est longue et le salaire élevé, plus la part complémentaire est significative. La gestion est assurée paritairement par les organisations syndicales de salariés et les organisations patronales — sans intervention de l'État." },
];

const FAQ_ITEMS = [
  { q: "Quand est versée la retraite complémentaire Agirc-Arrco ?", a: "La pension complémentaire est versée mensuellement, à compter du premier jour du mois suivant la date d'effet de votre retraite. Elle est versée simultanément à votre retraite de base (CNAV). Comptez 3 à 6 mois entre la demande et les premiers paiements, le temps de la liquidation du dossier." },
  { q: "Puis-je partir à la retraite avant 67 ans avec l'Agirc-Arrco ?", a: "Oui, dès 62 ans (ou 60 ans en carrière longue). Mais sans avoir atteint le taux plein, un coefficient de solidarité de −10 % s'applique pendant 3 ans sur votre pension complémentaire. Pour l'éviter : attendre 67 ans, ou différer votre départ d'un an pour bénéficier d'un bonus de +10 % pendant 1 an. Exceptions : inaptes, invalides, bénéficiaires de l'AAH ou ayant au moins 4 trimestres de chômage non indemnisé." },
  { q: "Comment sont revalorisés les points Agirc-Arrco chaque année ?", a: "Chaque novembre, les partenaires sociaux (syndicats et patronat) révisent la valeur de service du point. Elle évolue en principe comme l'inflation (indice des prix à la consommation hors tabac) pour préserver le pouvoir d'achat des retraités. En 2026, la valeur de service est fixée à 1,4098 €/point." },
  { q: "Qu'est-ce que le coefficient de solidarité de −10 % ?", a: "Introduit en 2019, c'est une minoration temporaire de votre pension complémentaire pendant 3 ans si vous partez sans avoir atteint le taux plein. Son objectif est d'inciter les salariés à travailler au moins un trimestre de plus. Il ne s'applique pas aux personnes inaptes, invalides, bénéficiaires de l'AAH ou ayant au moins 4 trimestres de chômage non indemnisé." },
  { q: "Les fonctionnaires cotisent-ils à l'Agirc-Arrco ?", a: "Non. L'Agirc-Arrco est exclusivement réservé aux salariés du secteur privé et aux contractuels de droit privé. Les fonctionnaires titulaires relèvent du RAFP (Régime de retraite additionnelle de la Fonction Publique), qui fonctionne aussi par points mais est géré séparément." },
  { q: "Puis-je cumuler emploi et retraite Agirc-Arrco ?", a: "Oui. En cumul emploi-retraite total (toutes retraites liquidées), aucun plafond de revenus ne s'applique et les nouvelles cotisations génèrent des droits supplémentaires depuis 2023. En cumul partiel (retraite anticipée sans taux plein), vos revenus cumulés ne doivent pas dépasser 160 % du SMIC ou votre dernier salaire." },
  { q: "Comment consulter mes points Agirc-Arrco accumulés ?", a: "Sur info-retraite.fr (Relevé de Situation Individuelle gratuit) ou directement sur agirc-arrco.fr après création d'un espace personnel. Un relevé vous est automatiquement envoyé tous les 5 ans à partir de 35 ans." },
  { q: "La retraite complémentaire Agirc-Arrco est-elle imposable ?", a: "Oui, elle est soumise à l'impôt sur le revenu comme la retraite de base. Les prélèvements sociaux s'élèvent à environ 10,1 % pour la plupart des retraités : CSG (8,3 %), CRDS (0,5 %), Casa (0,3 %) et cotisation maladie (1 %). C'est pourquoi notre simulateur affiche une pension nette à 83 % de la pension brute." },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  const panelId = `faq-${q.substring(0, 24).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, background: "none", border: "none", cursor: "pointer", padding: "20px 0", textAlign: "left" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: "var(--text)", lineHeight: 1.4 }}>{q}</span>
        <span aria-hidden="true" style={{ flexShrink: 0, width: 26, height: 26, borderRadius: "50%", background: open ? "rgba(184,147,74,0.2)" : "var(--card-bg)", border: `1px solid ${open ? "rgba(184,147,74,0.5)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: open ? "var(--gold)" : "var(--text-secondary)", marginTop: 2 }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p id={panelId} role="region" aria-label={q} style={{ paddingBottom: 20, paddingRight: 42, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>{a}</p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SimulateurRetraite() {
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    document.title = "Simulateur Retraite Agirc-Arrco 2026 — mesimulateurs.fr";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Simulez gratuitement votre pension de retraite complémentaire Agirc-Arrco. Calcul de points, bonus-malus, GMP cadres, revalorisation projetée.");
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", "https://www.mesimulateurs.fr/simulateurs/agirc-arrco");
  }, []);

  // Base inputs — null = pas de valeur par défaut
  const [salaire, setSalaire]                 = useState(null);
  const [anneesFaites, setAnneesFaites]       = useState(null);
  const [anneesRestantes, setAnneesRestantes] = useState(null);
  // Paramètres avancés
  const [ageDépart, setAgeDépart]               = useState(null);
  const [evolutionSalaire, setEvolutionSalaire] = useState(null);
  const [tauxReval, setTauxReval]               = useState(null);
  const [estCadre, setEstCadre]                 = useState(false);
  const [bonus3Enfants, setBonus3Enfants]       = useState(false);
  // Scénario B
  const [salaireB, setSalaireB]     = useState(null);
  const [ageDépartB, setAgeDépartB] = useState(null);
  // UI
  const [exporting, setExporting] = useState(false);

  const inputs = { salaire, anneesFaites, anneesRestantes, evolutionSalaire, tauxReval, ageDépart, bonus3Enfants, estCadre };
  const res = calcResult(inputs);
  const anneesRestantesB = anneesRestantes !== null && ageDépartB !== null && ageDépart !== null
    ? Math.max(0, anneesRestantes + (ageDépartB - ageDépart))
    : 0;
  const resB = calcResult({ ...inputs, salaire: salaireB, ageDépart: ageDépartB, anneesRestantes: anneesRestantesB });

  const pensionAnimée = useAnimatedNumber(res.pensionNette);
  const totalAnnees   = (anneesFaites ?? 0) + (anneesRestantes ?? 0);

  const coefGt1 = res.coefTotal > 1.001;
  const coefLt1 = res.coefTotal < 0.999;
  const coefBg  = coefGt1 ? "rgba(34,197,94,0.08)"  : coefLt1 ? "rgba(239,68,68,0.08)"  : "var(--card-bg)";
  const coefBd  = coefGt1 ? "rgba(34,197,94,0.25)"  : coefLt1 ? "rgba(239,68,68,0.25)"  : "var(--border)";
  const coefClr = coefGt1 ? "#4ade80" : coefLt1 ? "#f87171" : "var(--text-secondary)";

  const diffB = resB.pensionNette - res.pensionNette;

  return (
    <div id="main-content" style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)", padding: "0 16px 60px" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      {/* ── Header ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 0 32px", animation: "fadeUp .5s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{ width: 36, height: 2, background: "linear-gradient(90deg,var(--gold-mid),var(--gold))" }} aria-hidden="true" />
          <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-mid)" }}>Simulation gratuite · Données 2026</span>
        </div>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px,6vw,50px)", fontWeight: 600, lineHeight: 1.1, color: "var(--text)", marginBottom: 8 }}>
          Votre retraite<br />complémentaire Agirc‑Arrco
        </h1>
        <p style={{ fontSize: 13, color: "var(--gold-mid)", letterSpacing: "0.05em", marginBottom: 12 }}>
          Estimation en 30 secondes · Données officielles 2026
        </p>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7, maxWidth: 500 }}>
          Saisissez votre salaire et votre parcours — obtenez une estimation détaillée de votre future pension complémentaire.
        </p>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gap: 0, animation: "fadeUp .5s .12s ease both", opacity: 0, animationFillMode: "forwards" }}>

        {/* ── Bandeau de réassurance ── */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 16,
          background: "rgba(184,147,74,0.07)", border: "1px solid var(--border-gold)",
          borderRadius: 12, padding: "12px 20px", marginBottom: 20,
          fontSize: 13, color: "var(--text-secondary)"
        }}>
          {["✓ Données officielles Agirc-Arrco 2026", "✓ Valeur du point : 1,4098 €", "✓ Aucune donnée conservée", "✓ Calcul 100 % local"].map((item, i) => (
            <span key={i} style={{ whiteSpace: "nowrap" }}>{item}</span>
          ))}
        </div>

        {/* ── Carte saisie principale ── */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px 28px", boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>Votre situation</h2>
          <NumInput
            id="salaire"
            label="Salaire brut mensuel"
            value={salaire} onChange={setSalaire} unit="€" min={500} max={40000}
            hint={salaire ? `PASS 2026 : 3 925 €/mois · ${salaire * 12 > PASS ? "Tranche 2 activée" : "Tranche 1 uniquement"}` : "PASS 2026 : 3 925 €/mois"}
            tooltip="Tranche 1 : salaire jusqu'au PASS (47 100 €/an). Tranche 2 : part entre 1× et 8× le PASS. Chaque tranche a un taux de cotisation différent."
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <NumInput
              id="annees-faites"
              label="Années déjà cotisées"
              value={anneesFaites} onChange={setAnneesFaites} unit="ans" min={0} max={50}
              hint={anneesFaites !== null ? `Début estimé : ${2026 - anneesFaites}` : undefined}
            />
            <NumInput
              id="annees-restantes"
              label="Années restantes"
              value={anneesRestantes} onChange={setAnneesRestantes} unit="ans" min={0} max={50}
              hint={anneesRestantes !== null ? `Départ estimé : ${2026 + anneesRestantes}` : undefined}
            />
          </div>
          {/* Summary bar */}
          <div style={{ marginTop: 4, background: "rgba(184,147,74,0.06)", border: "1px solid rgba(184,147,74,0.15)", borderRadius: 12, padding: "14px 20px", display: "flex", flexWrap: "wrap" }}>
            {[
              { l: "Carrière totale", v: totalAnnees > 0 ? `${totalAnnees} ans` : "—", gold: true },
              { l: "Points / an",     v: res.ptsParAn > 0 ? fmt(res.ptsParAn) : "—" },
              { l: "Tranche",         v: salaire && salaire * 12 > PASS ? "T1 + T2" : "T1 seule" },
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, minWidth: 100, padding: "4px 16px", borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{item.l}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 700, color: item.gold ? "var(--gold)" : "var(--text)" }}>{item.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Paramètres avancés (accordéon) ── */}
        <AccordionSection title="Paramètres avancés" subtitle="Âge de départ, revalorisation, salaire évolutif, statut, bonus enfants">

          <StepperInput
            label="Âge de départ prévu"
            value={ageDépart} onChange={setAgeDépart} min={62} max={70} unit=" ans"
            hint={anneesRestantes !== null ? `Départ prévu en ${2026 + anneesRestantes} — ajustez selon votre stratégie` : "Ajustez selon votre stratégie"}
            tooltip="Coefficient de minoration : partir avant 67 ans sans taux plein applique −10 % pendant 3 ans. Partir après 67 ans donne un bonus de +10 % par année supplémentaire."
          />
          <div style={{ background: coefBg, border: `1px solid ${coefBd}`, borderRadius: 10, padding: "12px 16px", marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Coefficient : {getCoefLabel(ageDépart)}</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: coefClr }}>× {res.coefAge.toFixed(2)}</span>
          </div>

          <StepperInput
            label="Évolution annuelle du salaire"
            value={evolutionSalaire} onChange={setEvolutionSalaire}
            min={-2} max={10} step={0.5} unit=" %"
            hint={evolutionSalaire !== null && evolutionSalaire !== 0 ? `Salaire estimé au départ : ${fmtEur(res.salaireDépart)}/mois` : evolutionSalaire === 0 ? "Salaire constant sur toute la carrière" : undefined}
          />

          <StepperInput
            label="Taux de revalorisation annuel estimé"
            value={tauxReval} onChange={setTauxReval}
            min={0} max={3} step={0.5} unit=" %"
            hint={tauxReval !== null && tauxReval > 0 ? `Valeur de service projetée : ${res.valServProj.toFixed(4)} €/pt (au lieu de ${VALEUR_SERVICE} €/pt)` : tauxReval === 0 ? "Aucune revalorisation — valeur de service 2026 fixe" : undefined}
            tooltip="La valeur de service (1,4098 €/point en 2026) est le montant qu'un point Agirc-Arrco rapporte chaque mois. Elle est revalorisée chaque novembre selon l'inflation."
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>Statut professionnel</div>
              {estCadre && salaire && salaire * 12 < PASS && (
                <div style={{ fontSize: 11, color: "var(--gold-mid)" }}>GMP : minimum {GMP_MIN_PTS} points/an garantis (Garantie Minimale de Points cadres)</div>
              )}
            </div>
            <Toggle checked={estCadre} onChange={setEstCadre} />
          </div>

          <div onClick={() => setBonus3Enfants(b => !b)}
            role="checkbox" aria-checked={bonus3Enfants} tabIndex={0}
            onKeyDown={e => (e.key === " " || e.key === "Enter") && setBonus3Enfants(b => !b)}
            style={{ display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer", padding: "12px 16px", borderRadius: 12, background: bonus3Enfants ? "rgba(184,147,74,0.08)" : "var(--card-bg)", border: `1px solid ${bonus3Enfants ? "rgba(184,147,74,0.3)" : "var(--border)"}`, transition: "all 0.2s" }}>
            <div aria-hidden="true" style={{ width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${bonus3Enfants ? "rgba(184,147,74,0.8)" : "var(--border)"}`, background: bonus3Enfants ? "rgba(184,147,74,0.3)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: "all 0.2s" }}>
              {bonus3Enfants && <span style={{ color: "var(--gold)", fontSize: 13, lineHeight: 1 }}>✓</span>}
            </div>
            <div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>3 enfants ou plus élevés</div>
              <div style={{ fontSize: 12, color: bonus3Enfants ? "var(--gold)" : "var(--text-secondary)", marginTop: 2 }}>Majoration de <strong>+10 %</strong> sur la pension complémentaire</div>
            </div>
          </div>
        </AccordionSection>

        {/* ── Carte résultats ── */}
        <div style={{ background: "linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginTop: 20, boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>Votre pension estimée</h2>

          {/* Pension principale */}
          <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Pension nette mensuelle estimée</div>
            {res.pensionNette < 1 ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>
                Saisissez votre salaire et vos années de carrière pour voir votre estimation.
              </p>
            ) : (
              <>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,10vw,76px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  aria-label={`${Math.round(res.pensionNette)} euros par mois`}>
                  {pensionAnimée.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                  soit <span>{fmtEur(res.pensionBrute)}/mois brut</span> avant prélèvements sociaux (~17 %)
                </div>
              </>
            )}
          </div>

          {/* Coefficient banner */}
          <div style={{ background: coefBg, border: `1px solid ${coefBd}`, borderRadius: 12, padding: "13px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 4 }}>Coefficient appliqué</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                {getCoefLabel(ageDépart)}
                {bonus3Enfants && <span style={{ marginLeft: 10, color: "#4ade80" }}>+ 10 % (3 enfants)</span>}
              </div>
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: coefClr }}>× {res.coefTotal.toFixed(2)}</span>
          </div>

          {/* Chips points */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
            <Chip label="Points acquis" value={fmt(res.pointsAcquis)} />
            <Chip label="Points futurs" value={fmt(res.pointsFuturs)} />
            <Chip label="Total points"  value={fmt(res.totalPoints)} accent />
          </div>

          {/* Progress bars */}
          <ProgressBar label="Points déjà acquis" value={res.pointsAcquis} total={res.totalPoints} color="var(--progress-acquired)" />
          <ProgressBar label="Points à venir"      value={res.pointsFuturs} total={res.totalPoints} color="linear-gradient(90deg,var(--gold-mid),var(--gold))" />

          {/* Revalorisation comparison */}
          {tauxReval !== null && tauxReval > 0 && (
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", marginTop: 4, marginBottom: 4 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 12 }}>Impact de la revalorisation ({tauxReval > 0 ? "+" : ""}{tauxReval} %/an)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: "var(--text-secondary)", marginBottom: 4 }}>Sans revalorisation (base 2026)</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "var(--text-secondary)" }}>{fmtEur(res.pensionNetteSansReval)}/mois</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "var(--text-secondary)", marginBottom: 4 }}>Avec {tauxReval} %/an ({anneesRestantes ?? 0} ans)</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "var(--gold)" }}>{fmtEur(res.pensionNette)}/mois</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#4ade80" }}>
                +{fmtEur(res.pensionNette - res.pensionNetteSansReval)}/mois · Valeur de service projetée : {res.valServProj.toFixed(4)} €/pt
              </div>
            </div>
          )}

          {/* Salaire au départ */}
          {evolutionSalaire !== null && evolutionSalaire !== 0 && (
            <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-secondary)" }}>
              Salaire estimé au départ : <span>{fmtEur(res.salaireDépart)}/mois brut</span>
              {" "}(évolution de {evolutionSalaire > 0 ? "+" : ""}{evolutionSalaire} %/an sur {anneesRestantes ?? 0} ans)
            </div>
          )}

          {/* Détail cotisations */}
          <AccordionSection title="Détail des cotisations" subtitle="Répartition salarié / employeur sur toute la carrière">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
              <Chip label="Part salariale" value={fmtEur(res.cotSalTotal)} small />
              <Chip label="Part patronale" value={fmtEur(res.cotPatTotal)} small />
              <Chip label="Total cotisé"   value={fmtEur(res.cotSalTotal + res.cotPatTotal)} accent small />
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.9 }}>
              <div>Taux T1 — salarié : {(TAUX_T1_SAL * 100).toFixed(2)} % · employeur : {(TAUX_T1_PAT * 100).toFixed(2)} % · total : {(TAUX_T1 * 100).toFixed(2)} %</div>
              <div>Taux T2 — salarié : {(TAUX_T2_SAL * 100).toFixed(2)} % · employeur : {(TAUX_T2_PAT * 100).toFixed(2)} % · total : {(TAUX_T2 * 100).toFixed(2)} %</div>
              {estCadre && salaire && salaire * 12 < PASS && (
                <div style={{ marginTop: 8, color: "var(--gold-mid)" }}>Cadre sous PASS : GMP appliquée — cotisation forfaitaire pour garantir au minimum {GMP_MIN_PTS} points/an.</div>
              )}
            </div>
          </AccordionSection>

          {/* Disclaimer */}
          <div role="note" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16 }}>
            ⚠️ <strong style={{ color: "var(--text-secondary)" }}>Simulation indicative.</strong> Paramètres Agirc-Arrco 2026 (valeur d'achat : {VALEUR_ACHAT} €, valeur de service : {VALEUR_SERVICE} €/pt). Résultats réels soumis à votre historique exact, aux revalorisations futures et aux coefficients définitifs. Pour un calcul officiel : <a href="https://www.info-retraite.fr" target="_blank" rel="noopener" style={{ color: "var(--gold-mid)" }}>info-retraite.fr</a>.
          </div>
        </div>

        {/* ── Bouton export PDF ── */}
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => generatePDF(inputs, res, setExporting)}
            disabled={exporting}
            aria-busy={exporting}
            aria-label={exporting ? "Génération du PDF en cours, veuillez patienter" : "Télécharger ma simulation en PDF"}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 12, border: "1px solid rgba(184,147,74,0.4)", background: exporting ? "rgba(184,147,74,0.05)" : "rgba(184,147,74,0.1)", color: exporting ? "var(--text-secondary)" : "var(--gold)", fontSize: 14, cursor: exporting ? "not-allowed" : "pointer", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.03em" }}>
            <span aria-hidden="true" style={{ fontSize: 18 }}>{exporting ? "⏳" : "⬇"}</span>
            {exporting ? "Génération du PDF en cours…" : "Télécharger ma simulation (PDF)"}
          </button>
        </div>

        {/* ── Comparateur ── */}
        <AccordionSection title="Comparer deux scénarios" subtitle="Simulez un départ ou un salaire différent et comparez les pensions côte à côte" gold>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 20 }}>Scénario B — vos paramètres alternatifs</div>
            <NumInput id="salaire-b" label="Salaire brut mensuel (B)" value={salaireB} onChange={setSalaireB} unit="€" min={500} max={40000} />
            <StepperInput label="Âge de départ (B)" value={ageDépartB} onChange={setAgeDépartB} min={62} max={70} unit=" ans"
              hint={ageDépartB !== null ? `Années restantes : ${anneesRestantesB} ans (départ estimé en ${2026 + anneesRestantesB})` : undefined} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Scénario A", age: ageDépart, sal: salaire, r: res, isRef: true },
              { label: "Scénario B", age: ageDépartB, sal: salaireB, r: resB, isRef: false },
            ].map(({ label, age, sal, r, isRef }) => (
              <div key={label} style={{ background: isRef ? "var(--card-bg)" : "rgba(184,147,74,0.08)", border: `1px solid ${isRef ? "var(--border)" : "rgba(184,147,74,0.3)"}`, borderRadius: 14, padding: "18px 16px" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: isRef ? "var(--text-secondary)" : "var(--gold-mid)", marginBottom: 12 }}>{label}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>{age ?? "—"} ans · {sal ? fmtEur(sal) : "—"}/mois</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12 }}>{fmt(r.totalPoints)} pts · coef × {r.coefTotal.toFixed(2)}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px,5vw,32px)", fontWeight: 700, color: isRef ? "var(--text)" : "var(--gold)" }}>
                  {r.pensionNette > 0 ? fmtEur(r.pensionNette) : "—"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>/mois net estimé</div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 12 }}>Écart B vs A</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>Différence mensuelle</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: diffB >= 0 ? "#4ade80" : "#f87171" }}>
                  {signFmt(diffB)}/mois
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>Impact sur 20 ans</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: diffB >= 0 ? "#4ade80" : "#f87171" }}>
                  {signFmt(diffB * 12 * 20)}
                </div>
              </div>
            </div>
          </div>
        </AccordionSection>

        <div style={{ textAlign: "center", paddingTop: 24, fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.06em" }}>
          Données officielles Agirc-Arrco · Mise à jour janvier 2026 · Simulation non contractuelle
        </div>
      </div>

      {/* ── Pub bloc 1 — après PDF, avant éditorial ── */}
      <div style={{ maxWidth: 760, margin: "8px auto" }}>
        <AdUnit slot="auto" format="auto" />
      </div>

      {/* ── Section éditoriale ── */}
      <div style={{ maxWidth: 760, margin: "20px auto 0" }}>
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "40px 32px", boxShadow: "var(--card-shadow)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 28, height: 2, background: "linear-gradient(90deg,var(--gold-mid),var(--gold))" }} aria-hidden="true" />
            <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-mid)" }}>Guide</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px,4vw,30px)", fontWeight: 600, color: "var(--text)", marginBottom: 36, lineHeight: 1.2 }}>
            Comment fonctionne l'Agirc-Arrco ?
          </h2>
          <div style={{ display: "grid", gap: 28 }}>
            {EDITORIAL.map((s, i) => (
              <div key={i} style={{ paddingLeft: 20, borderLeft: "2px solid var(--border-gold)" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--gold)", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ maxWidth: 760, margin: "20px auto 0" }}>
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "40px 32px", boxShadow: "var(--card-shadow)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 28, height: 2, background: "linear-gradient(90deg,var(--gold-mid),var(--gold))" }} aria-hidden="true" />
            <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-mid)" }}>FAQ</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px,4vw,30px)", fontWeight: 600, color: "var(--text)", marginBottom: 8, lineHeight: 1.2 }}>
            Questions fréquentes
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 32 }}>Tout ce qu'il faut savoir sur votre retraite complémentaire Agirc-Arrco.</p>
          {FAQ_ITEMS.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
          <p style={{ paddingTop: 24, fontSize: 12, color: "var(--text-secondary)" }}>
            Pour des informations officielles et personnalisées, consultez{" "}
            <a href="https://www.info-retraite.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>info-retraite.fr</a>
            {" "}ou{" "}
            <a href="https://www.agirc-arrco.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>agirc-arrco.fr</a>.
          </p>
        </div>
      </div>

      {/* ── Pub bloc 2 — après FAQ, avant footer ── */}
      <div style={{ maxWidth: 760, margin: "8px auto" }}>
        <AdUnit slot="auto" format="auto" />
      </div>

      <Footer />
    </div>
  );
}
