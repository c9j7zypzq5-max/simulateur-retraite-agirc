import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../../hooks/useTheme.js";
import ShareBar from "../../components/ShareBar.jsx";
import ZoomableChart from "../../components/ZoomableChart.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import Navbar from "../../components/Navbar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import Footer from "../../components/Footer.jsx";
import { NumInput, useAnimatedNumber, fmt, fmtEur } from "../../components/ui.jsx";

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
function calcBudget({ revenus, fixe, variable, epargneActuelle }) {
  const rev = revenus ?? 0;
  if (rev <= 0) return null;
  const totalDepenses = (fixe ?? 0) + (variable ?? 0);
  const disponible = rev - totalDepenses;
  const epargne = Math.max(0, disponible);

  // Règle théorique 50/30/20
  const besoinsIdeal   = rev * 0.5;
  const enviesdeal     = rev * 0.3;
  const epargneIdeal   = rev * 0.2;

  const besoinsReel    = fixe ?? 0;
  const enviesReel     = variable ?? 0;
  const epargneReel    = Math.max(0, rev - besoinsReel - enviesReel);

  const tauxEpargne = rev > 0 ? (epargneReel / rev) * 100 : 0;
  const tauxBesoins = rev > 0 ? (besoinsReel / rev) * 100 : 0;
  const tauxEnvies  = rev > 0 ? (enviesReel  / rev) * 100 : 0;

  return {
    besoinsReel, enviesReel, epargneReel,
    besoinsIdeal, enviesdeal, epargneIdeal,
    tauxEpargne, tauxBesoins, tauxEnvies,
    totalDepenses, disponible,
  };
}

// ─── Hook useAnimatedValue (ancien→nouveau) ───────────────────────────────────
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

function DonutChart({ besoins, envies, epargne, total }) {
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

  const gap = 0.015; // gap entre segments (fraction du cercle)
  const segments = [
    { key: "besoins", ratio: arcs.besoins, color: "#b8934a", label: "Besoins" },
    { key: "envies",  ratio: arcs.envies,  color: "#818cf8", label: "Envies" },
    { key: "epargne", ratio: arcs.epargne, color: "#4ade80", label: "Épargne" },
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
      {/* Centre */}
      <circle cx={cx} cy={cy} r={48} fill="var(--card-bg)" />
      <text x={cx} y={cy - 6} textAnchor="middle" style={{ fill: "var(--text)", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
        {total > 0 ? `${Math.round((arcs.epargne) * 100)}%` : "—"}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" style={{ fill: "var(--text-secondary)", fontSize: 9, fontFamily: "'DM Sans', sans-serif" }}>
        épargné
      </text>
    </svg>
  );
}

// ─── Gauge animée ─────────────────────────────────────────────────────────────
function Gauge({ label, value, total, color, icon }) {
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
        <span style={{ color, fontWeight: 600 }}>{fmtEur(Math.round(value))}</span>
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
        {pct.toFixed(1)}% des revenus
      </div>
    </div>
  );
}


// ─── Barre de mois simulé ─────────────────────────────────────────────────────
function MonthProgress() {
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
        <span>📅 Mois simulé</span>
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
      <div style={{ fontSize: "0.73rem", color: "var(--text-secondary)", marginTop: 4 }}>Simulation d'un mois complet en 3 secondes</div>
    </div>
  );
}

// ─── Message motivant ──────────────────────────────────────────────────────────
function MotivationMessage({ tauxEpargne }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, [tauxEpargne]);

  let color, icon, titre, conseil;
  if (tauxEpargne < 10) {
    color = "#f87171"; icon = "⚠️";
    titre = "Taux d'épargne faible";
    conseil = "Essayez de réduire vos dépenses variables de 10-15 % — c'est souvent là que se cachent les économies les plus faciles.";
  } else if (tauxEpargne < 20) {
    color = "#f59e0b"; icon = "⭐";
    titre = "Bonne dynamique !";
    conseil = "Vous êtes sur la bonne voie. Augmenter votre épargne de 5 points supplémentaires accélérerait considérablement votre patrimoine.";
  } else {
    color = "#4ade80"; icon = "🎉";
    titre = "Excellent taux d'épargne !";
    conseil = "Vous dépassez la règle des 20 % — continuez ainsi et envisagez d'investir le surplus pour le faire travailler.";
  }

  return (
    <div style={{
      padding: "16px 20px",
      borderRadius: 12,
      border: `1px solid ${color}40`,
      background: `${color}0d`,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(8px)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ fontSize: "0.88rem", fontWeight: 600, color, marginBottom: 6 }}>{icon} {titre}</div>
      <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{conseil}</div>
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────
export default function Budget() {
  const [theme, setTheme] = useTheme();
  const [revenus,   setRevenus]   = useState(3000);
  const [fixe,      setFixe]      = useState(1200);
  const [variable,  setVariable]  = useState(600);
  const [epargneActuelle, setEpargneActuelle] = useState(0);

  const resultsRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    document.title = "Simulateur Budget 50/30/20 — Mesimulateurs.fr";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Répartissez votre budget mensuel selon la règle 50/30/20. Donut chart animé, jauges en temps réel, conseils personnalisés.");
  }, []);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.revenus !== undefined) setRevenus(shared.revenus);
      if (shared.fixe !== undefined) setFixe(shared.fixe);
      if (shared.variable !== undefined) setVariable(shared.variable);
      if (shared.epargneActuelle !== undefined) setEpargneActuelle(shared.epargneActuelle);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ revenus, fixe, variable, epargneActuelle }));
  }, [revenus, fixe, variable, epargneActuelle]);

  const res = calcBudget({ revenus, fixe, variable });

  const animBesoins  = useAnimatedValue(res?.besoinsReel  ?? 0);
  const animEnvies   = useAnimatedValue(res?.enviesReel   ?? 0);
  const animEpargne  = useAnimatedValue(res?.epargneReel  ?? 0);
  const animTaux     = useAnimatedValue(res?.tauxEpargne  ?? 0);

  const isMobile = useIsMobile(680);

  const report = {
    title: "Simulateur Budget 50/30/20",
    highlight: { label: "Solde mensuel disponible", value: res ? `${res.epargneReel >= 0 ? "+" : ""}${fmtEur(Math.round(res.epargneReel))}` : "—" },
    params: [
      { label: "Revenus nets mensuels", value: revenus ? fmtEur(revenus) : "—" },
      { label: "Dépenses fixes", value: fmtEur(fixe ?? 0) },
      { label: "Dépenses variables", value: fmtEur(variable ?? 0) },
      { label: "Épargne actuelle", value: fmtEur(epargneActuelle ?? 0) },
    ],
    results: res ? [
      { label: "Épargne mensuelle", value: fmtEur(Math.round(res.epargneReel)), strong: true },
      { label: "Besoins (fixes)", value: `${fmtEur(Math.round(res.besoinsReel))} · ${res.tauxBesoins.toFixed(1)} %` },
      { label: "Envies (variables)", value: `${fmtEur(Math.round(res.enviesReel))} · ${res.tauxEnvies.toFixed(1)} %` },
      { label: "Taux d'épargne", value: `${res.tauxEpargne.toFixed(1)} %` },
    ] : [],
    notes: res ? [
      `Règle 50/30/20 : 50 % besoins, 30 % envies, 20 % épargne. Votre taux d'épargne est de ${res.tauxEpargne.toFixed(1)} %.`,
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur Budget 50/30/20",
        "url": "https://www.simfinly.com/simulateurs/budget",
        "description": "Répartissez votre budget mensuel selon la règle 50/30/20. Donut chart animé, jauges en temps réel, conseils personnalisés.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": "fr-FR",
      }} />
      <Navbar theme={theme} setTheme={setTheme} />

      {/* ── Header ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,147,74,0.1)", border: "1px solid var(--border-gold)", color: "var(--gold)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 20, marginBottom: 20 }}>
          Finances · Nouveau
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, color: "var(--text)", marginBottom: 12, lineHeight: 1.2 }}>
          Budget & Épargne<br />
          <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Règle 50 / 30 / 20</em>
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 600, marginBottom: 40 }}>
          Répartissez votre budget mensuel selon la règle d'or : 50 % pour vos besoins, 30 % pour vos envies, 20 % pour l'épargne. Ajustez les curseurs et visualisez en temps réel.
        </p>
      </div>

      {/* ── Main layout ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 0 : 32, alignItems: "start" }}>

        {/* ── Colonne gauche : inputs — passe en second sur mobile ── */}
        <div style={{ order: isMobile ? 2 : 1 }}>
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: 28, marginBottom: 24 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>
              Vos revenus & dépenses
            </div>
            <NumInput label="Revenus nets mensuels" value={revenus} onChange={setRevenus} unit="€/mois" min={0} max={50000} />
            <NumInput label="Dépenses fixes" value={fixe} onChange={setFixe} unit="€/mois" hint="Loyer, charges, abonnements..." min={0} max={20000} />
            <NumInput label="Dépenses variables" value={variable} onChange={setVariable} unit="€/mois" hint="Courses, loisirs, restaurants..." min={0} max={20000} />
            <NumInput label="Épargne actuelle" value={epargneActuelle} onChange={setEpargneActuelle} unit="€" hint="Patrimoine déjà constitué" min={0} max={9999999} />
          </div>

          <MonthProgress />

          {res && <MotivationMessage tauxEpargne={res.tauxEpargne} />}
        </div>

        {/* ── Colonne droite : visualisations — passe en premier sur mobile ── */}
        <div style={{ order: isMobile ? 1 : 2, marginBottom: isMobile ? 24 : 0 }}>
          {/* Donut */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: 28, marginBottom: 24 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>
              Répartition du budget
            </div>
            <ZoomableChart innerRef={chartRef} style={{ display: "flex", alignItems: "center", flexDirection: isMobile ? "column" : "row", gap: 24 }}>
              <DonutChart
                besoins={res?.besoinsReel ?? 0}
                envies={res?.enviesReel ?? 0}
                epargne={res?.epargneReel ?? 0}
                total={revenus ?? 1}
              />
              <div style={{ flex: 1 }}>
                {[
                  { label: "Besoins",  value: animBesoins, pct: res?.tauxBesoins ?? 0, color: "#b8934a" },
                  { label: "Envies",   value: animEnvies,  pct: res?.tauxEnvies  ?? 0, color: "#818cf8" },
                  { label: "Épargne",  value: animEpargne, pct: animTaux,              color: "#4ade80" },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                        <span style={{ color: "var(--text)", fontWeight: 500 }}>{s.label}</span>
                        <span style={{ color: s.color, fontWeight: 600 }}>{fmtEur(Math.round(s.value))}</span>
                      </div>
                      <div style={{ fontSize: "0.73rem", color: "var(--text-secondary)" }}>{s.pct.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </ZoomableChart>
          </div>

          {/* Jauges */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: 28 }} ref={resultsRef}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>
              Jauges par catégorie
            </div>
            <Gauge label="Besoins essentiels" value={res?.besoinsReel ?? 0} total={revenus ?? 1} color="#b8934a" icon="🏠" />
            <Gauge label="Envies & loisirs"   value={res?.enviesReel  ?? 0} total={revenus ?? 1} color="#818cf8" icon="🎯" />
            <Gauge label="Épargne"             value={res?.epargneReel ?? 0} total={revenus ?? 1} color="#4ade80" icon="💚" />

            <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 10, background: "rgba(184,147,74,0.06)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 4 }}>Solde mensuel disponible</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 700, color: (res?.epargneReel ?? 0) >= 0 ? "#4ade80" : "#f87171" }}>
                {res ? (res.epargneReel >= 0 ? "+" : "") + fmtEur(Math.round(animEpargne)) : "—"}
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
