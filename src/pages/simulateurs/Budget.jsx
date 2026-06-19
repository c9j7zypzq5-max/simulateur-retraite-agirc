import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../hooks/useTheme.js";
import ShareBar from "../../components/ShareBar.jsx";
import ZoomableChart from "../../components/ZoomableChart.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import Navbar from "../../components/Navbar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import Footer from "../../components/Footer.jsx";
import { NumInput } from "../../components/ui.jsx";
import { useMoney } from "../../i18n/CurrencyContext.jsx";
import { fmtCur, activeSymbol } from "../../i18n/currency.js";
import { useTranslation } from "../../i18n/index.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

const TXT = {
  fr: {
    docTitle: "Simulateur Budget 50/30/20 — Simfinly.com",
    metaDesc: "Répartissez votre budget mensuel selon la règle 50/30/20. Donut chart animé, jauges en temps réel, conseils personnalisés.",
    jsonLdName: "Simulateur Budget 50/30/20",
    jsonLdDesc: "Répartissez votre budget mensuel selon la règle 50/30/20. Donut chart animé, jauges en temps réel, conseils personnalisés.",
    badge: "Finances · Nouveau",
    title1: "Budget & Épargne",
    title2: "Règle 50 / 30 / 20",
    desc: "Répartissez votre budget mensuel selon la règle d'or : 50 % pour vos besoins, 30 % pour vos envies, 20 % pour l'épargne. Ajustez les curseurs et visualisez en temps réel.",
    inputSectionTitle: "Vos revenus & dépenses",
    inputRevenu: "Revenus nets mensuels",
    inputFixe: "Dépenses fixes",
    inputFixeHint: "Loyer, charges, abonnements...",
    inputVariable: "Dépenses variables",
    inputVariableHint: "Courses, loisirs, restaurants...",
    inputEpargne: "Épargne actuelle",
    inputEpargneHint: "Patrimoine déjà constitué",
    donutTitle: "Répartition du budget",
    gaugesTitle: "Jauges par catégorie",
    segBesoins: "Besoins",
    segEnvies: "Envies",
    segEpargne: "Épargne",
    donutCenter: "épargné",
    pctRevenu: "% des revenus",
    monthSim: "📅 Mois simulé",
    monthSimNote: "Simulation d'un mois complet en 3 secondes",
    solde: "Solde mensuel disponible",
    gaugeBesoins: "Besoins essentiels",
    gaugeEnvies: "Envies & loisirs",
    motivLowTitle: "Taux d'épargne faible",
    motivLowAdvice: "Essayez de réduire vos dépenses variables de 10-15 % — c'est souvent là que se cachent les économies les plus faciles.",
    motivMedTitle: "Bonne dynamique !",
    motivMedAdvice: "Vous êtes sur la bonne voie. Augmenter votre épargne de 5 points supplémentaires accélérerait considérablement votre patrimoine.",
    motivHighTitle: "Excellent taux d'épargne !",
    motivHighAdvice: "Vous dépassez la règle des 20 % — continuez ainsi et envisagez d'investir le surplus pour le faire travailler.",
    reportTitle: "Simulateur Budget 50/30/20",
    reportHighlightLabel: "Solde mensuel disponible",
    reportRevenu: "Revenus nets mensuels",
    reportFixe: "Dépenses fixes",
    reportVariable: "Dépenses variables",
    reportEpargne: "Épargne actuelle",
    reportEpargneMensuelle: "Épargne mensuelle",
    reportBesoins: "Besoins (fixes)",
    reportEnvies: "Envies (variables)",
    reportTauxEpargne: "Taux d'épargne",
    reportNote: (taux) => `Règle 50/30/20 : 50 % besoins, 30 % envies, 20 % épargne. Votre taux d'épargne est de ${taux} %.`,
  },
  en: {
    docTitle: "50/30/20 Budget Calculator — Needs, Wants, Savings | Simfinly",
    metaDesc: "Split your monthly income with the 50/30/20 rule: 50% needs, 30% wants, 20% savings. See your budget balance and savings rate in real time.",
    jsonLdName: "50/30/20 Budget Calculator",
    jsonLdDesc: "Split your monthly income with the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Real-time donut chart, gauges, and personalised tips.",
    badge: "Finance · Calculator",
    title1: "Budget & Savings",
    title2: "50 / 30 / 20 Rule",
    desc: "Allocate your monthly income using the golden rule: 50% for needs, 30% for wants, and 20% for savings. Adjust the inputs and see the result in real time.",
    inputSectionTitle: "Your income & expenses",
    inputRevenu: "Monthly net income",
    inputFixe: "Fixed expenses",
    inputFixeHint: "Rent, bills, subscriptions...",
    inputVariable: "Variable expenses",
    inputVariableHint: "Groceries, leisure, dining out...",
    inputEpargne: "Current savings",
    inputEpargneHint: "Wealth already built up",
    donutTitle: "Budget breakdown",
    gaugesTitle: "Category gauges",
    segBesoins: "Needs",
    segEnvies: "Wants",
    segEpargne: "Savings",
    donutCenter: "saved",
    pctRevenu: "% of income",
    monthSim: "📅 Simulated month",
    monthSimNote: "Simulating a full month in 3 seconds",
    solde: "Monthly balance",
    gaugeBesoins: "Essential needs",
    gaugeEnvies: "Wants & leisure",
    motivLowTitle: "Low savings rate",
    motivLowAdvice: "Try cutting variable expenses by 10-15% — that's usually where the easiest savings are hiding.",
    motivMedTitle: "Good momentum!",
    motivMedAdvice: "You're on the right track. Boosting your savings rate by 5 more points would significantly accelerate your wealth.",
    motivHighTitle: "Excellent savings rate!",
    motivHighAdvice: "You're beating the 20% rule — keep it up and consider investing the surplus to put it to work.",
    reportTitle: "50/30/20 Budget Calculator",
    reportHighlightLabel: "Monthly balance",
    reportRevenu: "Monthly net income",
    reportFixe: "Fixed expenses",
    reportVariable: "Variable expenses",
    reportEpargne: "Current savings",
    reportEpargneMensuelle: "Monthly savings",
    reportBesoins: "Needs (fixed)",
    reportEnvies: "Wants (variable)",
    reportTauxEpargne: "Savings rate",
    reportNote: (taux) => `50/30/20 rule: 50% needs, 30% wants, 20% savings. Your savings rate is ${taux}%.`,
  },
};

function useIsMobile(breakpoint = 680) {
  const [mobile, setMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", h, { passive: true });
    return () => window.removeEventListener("resize", h);
  }, [breakpoint]);
  return mobile;
}

// ─── Calcul règle 50/30/20 ────────────────────────────────────────────────────
function calcBudget({ revenus, fixe, variable }) {
  const rev = revenus ?? 0;
  if (rev <= 0) return null;

  const besoinsReel = fixe ?? 0;
  const enviesReel  = variable ?? 0;
  const epargneReel = Math.max(0, rev - besoinsReel - enviesReel);

  const tauxEpargne = rev > 0 ? (epargneReel / rev) * 100 : 0;
  const tauxBesoins = rev > 0 ? (besoinsReel / rev) * 100 : 0;
  const tauxEnvies  = rev > 0 ? (enviesReel  / rev) * 100 : 0;

  return {
    besoinsReel, enviesReel, epargneReel,
    besoinsIdeal: rev * 0.5,
    enviesdeal:   rev * 0.3,
    epargneIdeal: rev * 0.2,
    tauxEpargne, tauxBesoins, tauxEnvies,
    totalDepenses: besoinsReel + enviesReel,
    disponible: rev - besoinsReel - enviesReel,
  };
}

// ─── Hook animation ───────────────────────────────────────────────────────────
function useAnimatedValue(target, duration = 600) {
  const [display, setDisplay] = useState(target);
  const frameRef = useRef(null);
  const prevRef  = useRef(target);
  const first    = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; prevRef.current = target; setDisplay(target); return; }
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const from = prevRef.current;
    const start = performance.now();
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

// ─── Donut SVG animé ──────────────────────────────────────────────────────────
const DONUT_R = 70;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_R;

function DonutChart({ besoins, envies, epargne, total, txt }) {
  const prevRef = useRef({ besoins: 0, envies: 0, epargne: 0 });
  const animRef = useRef(null);
  const [arcs, setArcs] = useState({ besoins: 0, envies: 0, epargne: 0 });

  const targetArcs = total > 0
    ? { besoins: besoins / total, envies: envies / total, epargne: epargne / total }
    : { besoins: 0, envies: 0, epargne: 0 };

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const from = { ...prevRef.current };
    const start = performance.now();
    const duration = 700;
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const cur = {
        besoins: from.besoins + (targetArcs.besoins - from.besoins) * ease,
        envies:  from.envies  + (targetArcs.envies  - from.envies)  * ease,
        epargne: from.epargne + (targetArcs.epargne - from.epargne) * ease,
      };
      setArcs(cur);
      if (p < 1) animRef.current = requestAnimationFrame(step);
      else prevRef.current = targetArcs;
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [besoins, envies, epargne, total]);

  const gap = 0.015;
  const segments = [
    { key: "besoins", ratio: arcs.besoins, color: "#b8934a", label: txt.segBesoins },
    { key: "envies",  ratio: arcs.envies,  color: "#818cf8", label: txt.segEnvies },
    { key: "epargne", ratio: arcs.epargne, color: "#4ade80", label: txt.segEpargne },
  ];

  let offset = 0;
  const cx = 90, cy = 90;

  return (
    <svg viewBox="0 0 180 180" style={{ width: 180, height: 180, overflow: "visible" }}>
      {segments.map(seg => {
        const ratio = Math.max(0, seg.ratio - gap);
        const dashLen = ratio * DONUT_CIRCUMFERENCE;
        const dashGap = DONUT_CIRCUMFERENCE - dashLen;
        const rotationDeg = offset * 360 - 90;
        offset += seg.ratio;
        if (ratio < 0.005) return null;
        return (
          <circle
            key={seg.key}
            cx={cx} cy={cy} r={DONUT_R}
            fill="none"
            stroke={seg.color}
            strokeWidth={22}
            strokeDasharray={`${dashLen} ${dashGap}`}
            strokeLinecap="butt"
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              transform: `rotate(${rotationDeg}deg)`,
              transition: "stroke-dasharray 0.05s",
              filter: `drop-shadow(0 0 4px ${seg.color}40)`,
            }}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={48} fill="var(--card-bg)" />
      <text x={cx} y={cy - 6} textAnchor="middle" style={{ fill: "var(--text)", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
        {total > 0 ? `${Math.round((arcs.epargne) * 100)}%` : "—"}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" style={{ fill: "var(--text-secondary)", fontSize: 9, fontFamily: "'DM Sans', sans-serif" }}>
        {txt.donutCenter}
      </text>
    </svg>
  );
}

// ─── Gauge animée ─────────────────────────────────────────────────────────────
function Gauge({ label, value, total, color, icon, pctLabel }) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.85rem" }}>
        <span style={{ color: "var(--text)", fontWeight: 500 }}>{icon} {label}</span>
        <span style={{ color, fontWeight: 600 }}>{fmtCur(Math.round(value))}</span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 4,
          width: `${width}%`,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: `0 0 8px ${color}40`,
        }} />
      </div>
      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 4 }}>
        {pct.toFixed(1)} {pctLabel}
      </div>
    </div>
  );
}

// ─── Barre de mois simulé ─────────────────────────────────────────────────────
function MonthProgress({ txt }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 3000;
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: 6 }}>
        <span>{txt.monthSim}</span>
        <span style={{ color: "var(--text)", fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3,
          width: `${pct}%`,
          background: "linear-gradient(90deg, #b8934a, #f59e0b)",
          transition: "none",
          boxShadow: "0 0 6px rgba(184,147,74,0.4)",
        }} />
      </div>
      <div style={{ fontSize: "0.73rem", color: "var(--text-secondary)", marginTop: 4 }}>{txt.monthSimNote}</div>
    </div>
  );
}

// ─── Message motivant ──────────────────────────────────────────────────────────
function MotivationMessage({ tauxEpargne, txt }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, [tauxEpargne]);

  let color, icon, titre, conseil;
  if (tauxEpargne < 10) {
    color = "#f87171"; icon = "⚠️";
    titre = txt.motivLowTitle;
    conseil = txt.motivLowAdvice;
  } else if (tauxEpargne < 20) {
    color = "#f59e0b"; icon = "⭐";
    titre = txt.motivMedTitle;
    conseil = txt.motivMedAdvice;
  } else {
    color = "#4ade80"; icon = "🎉";
    titre = txt.motivHighTitle;
    conseil = txt.motivHighAdvice;
  }

  return (
    <div style={{
      padding: "16px 20px", borderRadius: 12, border: `1px solid ${color}40`, background: `${color}0d`,
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)",
      transition: "opacity 0.4s ease, transform 0.4s ease", position: "relative", overflow: "hidden",
    }}>
      <div style={{ fontSize: "0.88rem", fontWeight: 600, color, marginBottom: 6 }}>{icon} {titre}</div>
      <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{conseil}</div>
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────
export default function Budget() {
  const [theme, setTheme] = useTheme();
  useMoney();
  const { locale } = useTranslation();
  const txt = TXT[locale] ?? TXT.fr;

  const [revenus,         setRevenus]         = useState(3000);
  const [fixe,            setFixe]            = useState(1200);
  const [variable,        setVariable]        = useState(600);
  const [epargneActuelle, setEpargneActuelle] = useState(0);

  const resultsRef = useRef(null);
  const chartRef   = useRef(null);

  usePageMeta(txt.docTitle, txt.metaDesc);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.revenus !== undefined)         setRevenus(shared.revenus);
      if (shared.fixe !== undefined)            setFixe(shared.fixe);
      if (shared.variable !== undefined)        setVariable(shared.variable);
      if (shared.epargneActuelle !== undefined) setEpargneActuelle(shared.epargneActuelle);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ revenus, fixe, variable, epargneActuelle }));
  }, [revenus, fixe, variable, epargneActuelle]);

  const res = calcBudget({ revenus, fixe, variable });

  const animBesoins = useAnimatedValue(res?.besoinsReel ?? 0);
  const animEnvies  = useAnimatedValue(res?.enviesReel  ?? 0);
  const animEpargne = useAnimatedValue(res?.epargneReel ?? 0);
  const animTaux    = useAnimatedValue(res?.tauxEpargne ?? 0);

  const isMobile = useIsMobile(680);

  const report = {
    title: txt.reportTitle,
    highlight: { label: txt.reportHighlightLabel, value: res ? `${res.epargneReel >= 0 ? "+" : ""}${fmtCur(Math.round(res.epargneReel))}` : "—" },
    params: [
      { label: txt.reportRevenu,   value: revenus ? fmtCur(revenus) : "—" },
      { label: txt.reportFixe,     value: fmtCur(fixe ?? 0) },
      { label: txt.reportVariable, value: fmtCur(variable ?? 0) },
      { label: txt.reportEpargne,  value: fmtCur(epargneActuelle ?? 0) },
    ],
    results: res ? [
      { label: txt.reportEpargneMensuelle, value: fmtCur(Math.round(res.epargneReel)), strong: true },
      { label: txt.reportBesoins, value: `${fmtCur(Math.round(res.besoinsReel))} · ${res.tauxBesoins.toFixed(1)} %` },
      { label: txt.reportEnvies,  value: `${fmtCur(Math.round(res.enviesReel))} · ${res.tauxEnvies.toFixed(1)} %` },
      { label: txt.reportTauxEpargne, value: `${res.tauxEpargne.toFixed(1)} %` },
    ] : [],
    notes: res ? [txt.reportNote(res.tauxEpargne.toFixed(1))] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": txt.jsonLdName,
        "url": locale === 'en' ? "https://www.simfinly.com/en/simulateurs/budget" : "https://www.simfinly.com/simulateurs/budget",
        "description": txt.jsonLdDesc,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": locale === 'en' ? 'en-US' : 'fr-FR',
      }} />
      <Navbar theme={theme} setTheme={setTheme} />

      {/* ── Header ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,147,74,0.1)", border: "1px solid var(--border-gold)", color: "var(--gold)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 20, marginBottom: 20 }}>
          {txt.badge}
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, color: "var(--text)", marginBottom: 12, lineHeight: 1.2 }}>
          {txt.title1}<br />
          <em style={{ color: "var(--gold)", fontStyle: "italic" }}>{txt.title2}</em>
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 600, marginBottom: 40 }}>
          {txt.desc}
        </p>
      </div>

      {/* ── Main layout ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 0 : 32, alignItems: "start" }}>

        {/* ── Colonne gauche : inputs ── */}
        <div style={{ order: isMobile ? 2 : 1 }}>
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: 28, marginBottom: 24 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>
              {txt.inputSectionTitle}
            </div>
            <NumInput label={txt.inputRevenu}   value={revenus}         onChange={setRevenus}         unit={`${activeSymbol()}/mois`} min={0} max={50000} />
            <NumInput label={txt.inputFixe}     value={fixe}            onChange={setFixe}            unit={`${activeSymbol()}/mois`} hint={txt.inputFixeHint}     min={0} max={20000} />
            <NumInput label={txt.inputVariable} value={variable}        onChange={setVariable}        unit={`${activeSymbol()}/mois`} hint={txt.inputVariableHint} min={0} max={20000} />
            <NumInput label={txt.inputEpargne}  value={epargneActuelle} onChange={setEpargneActuelle} unit={activeSymbol()}            hint={txt.inputEpargneHint}  min={0} max={9999999} />
          </div>

          <MonthProgress txt={txt} />

          {res && <MotivationMessage tauxEpargne={res.tauxEpargne} txt={txt} />}
        </div>

        {/* ── Colonne droite : visualisations ── */}
        <div style={{ order: isMobile ? 1 : 2, marginBottom: isMobile ? 24 : 0 }}>
          {/* Donut */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: 28, marginBottom: 24 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>
              {txt.donutTitle}
            </div>
            <ZoomableChart innerRef={chartRef} style={{ display: "flex", alignItems: "center", flexDirection: isMobile ? "column" : "row", gap: 24 }}>
              <DonutChart
                besoins={res?.besoinsReel ?? 0}
                envies={res?.enviesReel ?? 0}
                epargne={res?.epargneReel ?? 0}
                total={revenus ?? 1}
                txt={txt}
              />
              <div style={{ flex: 1 }}>
                {[
                  { label: txt.segBesoins, value: animBesoins, pct: res?.tauxBesoins ?? 0, color: "#b8934a" },
                  { label: txt.segEnvies,  value: animEnvies,  pct: res?.tauxEnvies  ?? 0, color: "#818cf8" },
                  { label: txt.segEpargne, value: animEpargne, pct: animTaux,              color: "#4ade80" },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                        <span style={{ color: "var(--text)", fontWeight: 500 }}>{s.label}</span>
                        <span style={{ color: s.color, fontWeight: 600 }}>{fmtCur(Math.round(s.value))}</span>
                      </div>
                      <div style={{ fontSize: "0.73rem", color: "var(--text-secondary)" }}>{s.pct.toFixed(1)} {txt.pctRevenu}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ZoomableChart>
          </div>

          {/* Jauges */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: 28 }} ref={resultsRef}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>
              {txt.gaugesTitle}
            </div>
            <Gauge label={txt.gaugeBesoins} value={res?.besoinsReel ?? 0} total={revenus ?? 1} color="#b8934a" icon="🏠" pctLabel={txt.pctRevenu} />
            <Gauge label={txt.gaugeEnvies}  value={res?.enviesReel  ?? 0} total={revenus ?? 1} color="#818cf8" icon="🎯" pctLabel={txt.pctRevenu} />
            <Gauge label={txt.segEpargne}   value={res?.epargneReel ?? 0} total={revenus ?? 1} color="#4ade80" icon="💚" pctLabel={txt.pctRevenu} />

            <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 10, background: "rgba(184,147,74,0.06)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 4 }}>{txt.solde}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 700, color: (res?.epargneReel ?? 0) >= 0 ? "#4ade80" : "#f87171" }}>
                {res ? (res.epargneReel >= 0 ? "+" : "") + fmtCur(Math.round(animEpargne)) : "—"}
              </div>
            </div>

            <ShareBar
              params={{ revenus, fixe, variable, epargneActuelle }}
              resultsRef={resultsRef}
              chartRef={chartRef}
              report={report}
              name="budget"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
