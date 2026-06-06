import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../hooks/useTheme.js";
import ShareBar from "../../components/ShareBar.jsx";
import ZoomableChart from "../../components/ZoomableChart.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import Navbar from "../../components/Navbar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import Footer from "../../components/Footer.jsx";
import { NumInput, StepperInput, Chip, fmt, fmtEur } from "../../components/ui.jsx";

function useIsMobile(breakpoint = 680) {
  const [mobile, setMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", h, { passive: true });
    return () => window.removeEventListener("resize", h);
  }, [breakpoint]);
  return mobile;
}

// ─── Calculs ─────────────────────────────────────────────────────────────────
function calcSalaire({ brut, statut, age, evolution, horizon }) {
  const tauxCotisation = statut === "cadre" ? 0.25 : 0.23;
  const net = brut * (1 - tauxCotisation);

  const years = [];
  for (let y = 0; y <= horizon; y++) {
    const factor = Math.pow(1 + evolution / 100, y);
    const brutY = brut * factor;
    const netY  = brutY * (1 - tauxCotisation);
    years.push({ year: y, age: age + y, brutY, netY });
  }

  const last = years[years.length - 1];
  const gainBrut = last.brutY - brut;
  const gainNet  = last.netY  - net;
  const cumBrut  = years.reduce((s, r) => s + r.brutY, 0);
  const cumNet   = years.reduce((s, r) => s + r.netY,  0);

  // Inflation 2% par an — perte pouvoir d'achat
  const pouvAchat = years.map(r => ({
    ...r,
    realNet: r.netY / Math.pow(1.02, r.year),
  }));

  return { net, years, last, gainBrut, gainNet, cumBrut, cumNet, pouvAchat };
}

// ─── Hook useAnimatedValue ────────────────────────────────────────────────────
function useAnimatedValue(target, duration = 650) {
  const [display, setDisplay] = useState(target);
  const rafRef  = useRef(null);
  const prevRef = useRef(target);
  const first   = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; prevRef.current = target; setDisplay(target); return; }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const from = prevRef.current;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (target - from) * ease);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else prevRef.current = target;
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return display;
}

// ─── Salary Reveal (machine à sous) ─────────────────────────────────────────
function SalaryReveal({ value }) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef(null);
  const prevRef = useRef(value);
  const first = useRef(true);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (first.current) {
      // Premier chargement : animation "machine à sous" sur 800ms
      first.current = false;
      const start = performance.now();
      const dur = 800;
      const to = value;
      const step = now => {
        const p = Math.min((now - start) / dur, 1);
        // Bruit sur les derniers 20% pour l'effet machine à sous
        const noise = p < 0.8 ? Math.random() * to : 0;
        const ease = 1 - Math.pow(1 - p, 4);
        setDisplayed(Math.round(ease * to + noise * (1 - p / 0.8)));
        if (p < 1) rafRef.current = requestAnimationFrame(step);
        else { setDisplayed(to); prevRef.current = to; }
      };
      rafRef.current = requestAnimationFrame(step);
    } else {
      // Changement de valeur : transition fluide
      const from = prevRef.current;
      const to = value;
      const start = performance.now();
      const step = now => {
        const p = Math.min((now - start) / 500, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setDisplayed(Math.round(from + (to - from) * ease));
        if (p < 1) rafRef.current = requestAnimationFrame(step);
        else prevRef.current = to;
      };
      rafRef.current = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return (
    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.6rem", fontWeight: 700, color: "var(--gold)", letterSpacing: "0.02em" }}>
      {Math.round(displayed).toLocaleString("fr-FR")} €
    </span>
  );
}

// ─── Courbe de carrière SVG interactive ──────────────────────────────────────
const SVG_W = 520, SVG_H = 210;
const PAD = { t: 20, b: 42, l: 46, r: 12 };

function CareerCurve({ years, net, pouvAchat }) {
  const [progress, setProgress] = useState(0);
  const [tooltip, setTooltip] = useState(null); // { svgX, idx } | null
  const rafRef  = useRef(null);
  const prevKey = useRef(null);
  const svgRef  = useRef(null);
  const key = `${net}-${years.length}`;

  useEffect(() => {
    if (key === prevKey.current) return;
    prevKey.current = key;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setProgress(0);
    setTooltip(null);
    const start = performance.now();
    const step = now => {
      const p    = Math.min((now - start) / 900, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setProgress(ease);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [key]);

  if (!years.length) return null;

  const w = SVG_W - PAD.l - PAD.r;
  const h = SVG_H - PAD.t - PAD.b;

  const allNetY  = years.map(r => r.netY);
  const allRealN = pouvAchat.map(r => r.realNet);
  const maxVal   = Math.max(...allNetY, ...allRealN) * 1.05;
  const minVal   = Math.min(...allNetY, ...allRealN) * 0.92;

  const xOf = i => PAD.l + (i / Math.max(years.length - 1, 1)) * w;
  const yOf = v => PAD.t + h - ((v - minVal) / (maxVal - minVal)) * h;

  const visCount = Math.max(2, Math.round(progress * years.length));
  const visYears = years.slice(0, visCount);
  const visPow   = pouvAchat.slice(0, visCount);

  const pathD = pts => pts.map((p, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(1)},${yOf(p).toFixed(1)}`).join(" ");
  const netPath  = pathD(visYears.map(r => r.netY));
  const realPath = pathD(visPow.map(r => r.realNet));
  const netArea  = visYears.length >= 2
    ? netPath + ` L${xOf(visYears.length - 1).toFixed(1)},${yOf(minVal).toFixed(1)} L${xOf(0).toFixed(1)},${yOf(minVal).toFixed(1)} Z`
    : "";

  // Y axis: 4 nice ticks
  const yTicks = Array.from({ length: 5 }, (_, i) => minVal + (i / 4) * (maxVal - minVal));

  // X axis: ticks every 5 years (or every 2 for short horizons)
  const horizon  = years.length - 1;
  const xStep    = horizon <= 10 ? 2 : 5;
  const xTicks   = [];
  for (let y = 0; y <= horizon; y += xStep) xTicks.push(y);
  if (xTicks[xTicks.length - 1] !== horizon) xTicks.push(horizon);

  // Pointer → tooltip
  const resolvePointer = clientX => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((clientX - rect.left) / rect.width) * SVG_W;
    const relX = svgX - PAD.l;
    if (relX < 0 || relX > w) { setTooltip(null); return; }
    const idx = Math.round((relX / w) * (years.length - 1));
    const clamped = Math.max(0, Math.min(years.length - 1, idx));
    setTooltip({ svgX: xOf(clamped), idx: clamped });
  };

  const ttRow = tooltip ? years[tooltip.idx] : null;
  const ttOnRight = tooltip ? tooltip.svgX < SVG_W * 0.6 : true;

  return (
    <div style={{ position: "relative", userSelect: "none" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ width: "100%", height: SVG_H, overflow: "visible", cursor: "crosshair", touchAction: "none" }}
        onMouseMove={e => resolvePointer(e.clientX)}
        onMouseLeave={() => setTooltip(null)}
        onTouchStart={e => { e.preventDefault(); resolvePointer(e.touches[0].clientX); }}
        onTouchMove={e => { e.preventDefault(); resolvePointer(e.touches[0].clientX); }}
        onTouchEnd={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="career-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#b8934a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#b8934a" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grille horizontale */}
        {yTicks.map((v, i) => (
          <g key={i}>
            <line
              x1={PAD.l} y1={yOf(v)} x2={PAD.l + w} y2={yOf(v)}
              stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 4"
            />
            <text x={PAD.l - 4} y={yOf(v) + 3.5} textAnchor="end"
              style={{ fill: "var(--text-secondary)", fontSize: 8, fontFamily: "'DM Sans', sans-serif" }}>
              {Math.round(v / 1000)}k
            </text>
          </g>
        ))}

        {/* Axe X */}
        <line x1={PAD.l} y1={PAD.t + h} x2={PAD.l + w} y2={PAD.t + h}
          stroke="var(--border)" strokeWidth={0.5} />
        {xTicks.map(y => (
          <g key={y}>
            <line x1={xOf(y)} y1={PAD.t + h} x2={xOf(y)} y2={PAD.t + h + 4}
              stroke="var(--border)" strokeWidth={0.5} />
            <text x={xOf(y)} y={PAD.t + h + 14} textAnchor="middle"
              style={{ fill: "var(--text-secondary)", fontSize: 8, fontFamily: "'DM Sans', sans-serif" }}>
              {y === 0 ? "Auj." : `+${y}a`}
            </text>
          </g>
        ))}

        {/* Zone dégradé */}
        {visYears.length >= 2 && <path d={netArea} fill="url(#career-grad)" />}

        {/* Courbe pouvoir d'achat */}
        {visPow.length >= 2 && (
          <path d={realPath} stroke="#f87171" strokeWidth={1.5} fill="none"
            strokeDasharray="5 4" opacity={0.6} />
        )}

        {/* Courbe salaire net */}
        {visYears.length >= 2 && (
          <path d={netPath} stroke="#b8934a" strokeWidth={2.5} fill="none"
            strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Points annuels */}
        {visYears.map((r, i) => (
          <circle key={i} cx={xOf(i)} cy={yOf(r.netY)} r={2.2}
            fill="#b8934a" opacity={0.65} />
        ))}

        {/* Trait vertical tooltip */}
        {tooltip && (
          <line x1={tooltip.svgX} y1={PAD.t} x2={tooltip.svgX} y2={PAD.t + h}
            stroke="var(--gold)" strokeWidth={1} strokeDasharray="3 3" opacity={0.85} />
        )}

        {/* Point surligné tooltip */}
        {tooltip && ttRow && (
          <circle cx={tooltip.svgX} cy={yOf(ttRow.netY)} r={5}
            fill="#b8934a" stroke="var(--card-bg)" strokeWidth={2} />
        )}

        {/* Légende */}
        <g>
          <line x1={PAD.l} y1={SVG_H - 6} x2={PAD.l + 18} y2={SVG_H - 6}
            stroke="#b8934a" strokeWidth={2} />
          <text x={PAD.l + 22} y={SVG_H - 2}
            style={{ fill: "var(--text-secondary)", fontSize: 8, fontFamily: "'DM Sans', sans-serif" }}>
            Salaire net
          </text>
          <line x1={PAD.l + 84} y1={SVG_H - 6} x2={PAD.l + 102} y2={SVG_H - 6}
            stroke="#f87171" strokeWidth={1.5} strokeDasharray="5 4" />
          <text x={PAD.l + 106} y={SVG_H - 2}
            style={{ fill: "var(--text-secondary)", fontSize: 8, fontFamily: "'DM Sans', sans-serif" }}>
            Pouvoir d'achat réel (inflation 2%)
          </text>
        </g>
      </svg>

      {/* Bulle tooltip HTML */}
      {tooltip && ttRow && (
        <div style={{
          position: "absolute",
          top: 28,
          ...(ttOnRight
            ? { left: `calc(${(tooltip.svgX / SVG_W) * 100}% + 10px)` }
            : { right: `calc(${((SVG_W - tooltip.svgX) / SVG_W) * 100}% + 10px)` }),
          background: "var(--card-bg)",
          border: "1px solid var(--border-gold)",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: "0.77rem",
          pointerEvents: "none",
          zIndex: 10,
          minWidth: 155,
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          whiteSpace: "nowrap",
        }}>
          <div style={{ fontWeight: 600, color: "var(--gold)", marginBottom: 5, fontSize: "0.82rem" }}>
            {ttRow.year === 0 ? "Aujourd'hui" : `Dans ${ttRow.year} an${ttRow.year > 1 ? "s" : ""}`}
            {ttRow.year > 0 && (
              <span style={{ fontWeight: 400, color: "var(--text-secondary)", marginLeft: 6 }}>
                ({ttRow.age} ans)
              </span>
            )}
          </div>
          <div style={{ color: "var(--text)", marginBottom: 3 }}>
            Net : <strong style={{ color: "#4ade80" }}>{fmtEur(Math.round(ttRow.netY))}/mois</strong>
          </div>
          <div style={{ color: "var(--text-secondary)" }}>
            Brut : {fmtEur(Math.round(ttRow.brutY))}/mois
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Timeline jalons ──────────────────────────────────────────────────────────
function Milestones({ years, horizon }) {
  const [visible, setVisible] = useState(0);
  const milestoneYears = [5, 10, Math.ceil(horizon / 2), horizon].filter(y => y <= horizon && y > 0);
  const unique = [...new Set(milestoneYears)];

  useEffect(() => {
    setVisible(0);
    unique.forEach((_, i) => {
      setTimeout(() => setVisible(v => v + 1), 300 + i * 250);
    });
  }, [years.length, horizon]);

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
      {unique.map((y, i) => {
        const row = years[y] ?? years[years.length - 1];
        return (
          <div
            key={y}
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              minWidth: 110,
              opacity: i < visible ? 1 : 0,
              transform: i < visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: 4 }}>Dans {y} an{y > 1 ? "s" : ""}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--gold)" }}>
              {row ? fmtEur(Math.round(row.netY)) : "—"}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>net/mois</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Comparaison barres ───────────────────────────────────────────────────────
function CompareBar({ label, value, maxValue, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth((value / maxValue) * 100), 120);
    return () => clearTimeout(t);
  }, [value, maxValue]);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.83rem", marginBottom: 6 }}>
        <span style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span style={{ color, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>{fmtEur(Math.round(value))}</span>
      </div>
      <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 5,
          width: `${width}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: `0 0 10px ${color}50`,
        }} />
      </div>
    </div>
  );
}

// ─── Indicateur pouvoir d'achat ───────────────────────────────────────────────
function PouvoirAchat({ ratio }) {
  const [width, setWidth] = useState(100);
  useEffect(() => {
    const t = setTimeout(() => setWidth(ratio * 100), 150);
    return () => clearTimeout(t);
  }, [ratio]);
  return (
    <div style={{ padding: "14px 16px", borderRadius: 10, border: "1px solid rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.83rem" }}>
        <span style={{ color: "var(--text-secondary)" }}>📉 Pouvoir d'achat à l'inflation (2%/an)</span>
        <span style={{ color: "#f87171", fontWeight: 600 }}>{Math.round(ratio * 100)}% conservé</span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 4,
          width: `${width}%`,
          background: "linear-gradient(90deg, #4ade80, #f87171)",
          transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
      <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: 4 }}>
        Un salaire fixe vaut {Math.round(ratio * 100)}% de sa valeur après {Math.round(-Math.log(ratio) / Math.log(1.02))} an{Math.round(-Math.log(ratio) / Math.log(1.02)) > 1 ? "s" : ""} d'inflation à 2%
      </div>
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────
export default function Salaire() {
  const [theme, setTheme] = useTheme();
  const [brut,      setBrut]      = useState(3500);
  const [statut,    setStatut]    = useState("non-cadre");
  const [age,       setAge]       = useState(35);
  const [evolution, setEvolution] = useState(2);
  const [horizon,   setHorizon]   = useState(20);

  const resultsRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    document.title = "Simulateur Salaire Net/Brut & Évolution de carrière — Mesimulateurs.fr";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Calculez votre salaire net, projetez votre évolution de carrière et visualisez l'impact de l'inflation sur votre pouvoir d'achat.");
  }, []);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.brut !== undefined) setBrut(shared.brut);
      if (shared.statut !== undefined) setStatut(shared.statut);
      if (shared.age !== undefined) setAge(shared.age);
      if (shared.evolution !== undefined) setEvolution(shared.evolution);
      if (shared.horizon !== undefined) setHorizon(shared.horizon);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ brut, statut, age, evolution, horizon }));
  }, [brut, statut, age, evolution, horizon]);

  const res = calcSalaire({ brut, statut, age, evolution, horizon });

  const animNet  = useAnimatedValue(res.net);
  const animGain = useAnimatedValue(res.gainNet);
  const maxNet   = Math.max(res.net, res.last.netY);

  const pouvoirRatio = res.pouvAchat[res.pouvAchat.length - 1]?.realNet / res.net;
  const isMobile = useIsMobile(680);

  const report = {
    title: "Simulateur Salaire Net / Brut & Carrière",
    highlight: { label: "Salaire net mensuel estimé", value: brut ? fmtEur(Math.round(res.net)) : "—" },
    params: [
      { label: "Salaire brut mensuel", value: brut ? fmtEur(brut) : "—" },
      { label: "Statut", value: statut === "cadre" ? "Cadre" : "Non-cadre" },
      { label: "Âge actuel", value: `${age} ans` },
      { label: "Évolution annuelle", value: `${evolution} %` },
      { label: "Horizon de projection", value: `${horizon} ans` },
    ],
    results: brut ? [
      { label: "Salaire net mensuel", value: fmtEur(Math.round(res.net)), strong: true },
      { label: `Net mensuel dans ${horizon} ans`, value: fmtEur(Math.round(res.last.netY)) },
      { label: "Gain net mensuel sur la période", value: fmtEur(Math.round(res.gainNet)) },
      { label: "Cumul net sur la carrière", value: fmtEur(Math.round(res.cumNet)) },
    ] : [],
    notes: brut ? [
      `Hypothèse d'inflation de 2 %/an : pouvoir d'achat réel à terme estimé à ${(pouvoirRatio * 100).toFixed(0)} % du net actuel.`,
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur Salaire Net/Brut & carrière",
        "url": "https://www.mesimulateurs.fr/simulateurs/salaire",
        "description": "Calculez votre salaire net, projetez votre évolution de carrière et visualisez l'impact de l'inflation sur votre pouvoir d'achat.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": "fr-FR",
      }} />
      <Navbar theme={theme} setTheme={setTheme} />

      {/* ── Header ── */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,147,74,0.1)", border: "1px solid var(--border-gold)", color: "var(--gold)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 20, marginBottom: 20 }}>
          Finances · Nouveau
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, color: "var(--text)", marginBottom: 12, lineHeight: 1.2 }}>
          Salaire Net/Brut<br />
          <em style={{ color: "var(--gold)", fontStyle: "italic" }}>& Évolution de carrière</em>
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 600, marginBottom: 40 }}>
          Calculez votre salaire net, projetez son évolution sur {horizon} ans et visualisez l'impact de l'inflation sur votre pouvoir d'achat réel.
        </p>
      </div>

      {/* ── Layout 2 colonnes ── */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "340px 1fr", gap: isMobile ? 0 : 32, alignItems: "start" }}>

        {/* ── Colonne gauche : inputs + salary reveal — passe en second sur mobile ── */}
        <div style={{ order: isMobile ? 2 : 1 }}>
          {/* Salary reveal */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)", borderRadius: 14, padding: 28, marginBottom: 24, textAlign: "center" }} ref={resultsRef}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Salaire net mensuel</div>
            <SalaryReveal value={res.net} />
            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 8 }}>
              pour {fmtEur(brut)} brut · cotisations {statut === "cadre" ? "25" : "23"}%
            </div>

            <ShareBar
              params={{ brut, statut, age, evolution, horizon }}
              resultsRef={resultsRef}
              chartRef={chartRef}
              report={report}
              name="salaire"
            />
          </div>

          {/* Inputs */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: 28 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>
              Paramètres
            </div>
            <NumInput label="Salaire brut mensuel" value={brut} onChange={setBrut} unit="€" min={500} max={50000} />

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: 10 }}>Statut</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["non-cadre", "cadre"].map(s => (
                  <button key={s} onClick={() => setStatut(s)} style={{
                    flex: 1, padding: "9px 0", borderRadius: 10, fontSize: "0.82rem", fontWeight: 500, cursor: "pointer",
                    border: `1px solid ${statut === s ? "var(--border-gold)" : "var(--border)"}`,
                    background: statut === s ? "rgba(184,147,74,0.1)" : "transparent",
                    color: statut === s ? "var(--gold)" : "var(--text-secondary)",
                    transition: "all 0.2s",
                  }}>
                    {s === "cadre" ? "Cadre (25%)" : "Non-cadre (23%)"}
                  </button>
                ))}
              </div>
            </div>

            <StepperInput label="Âge actuel" value={age} onChange={setAge} unit="ans" min={18} max={65} />
            <StepperInput label="Évolution annuelle" value={evolution} onChange={setEvolution} unit="%" min={0} max={15} />
            <StepperInput label="Horizon de projection" value={horizon} onChange={setHorizon} unit="ans" min={5} max={40} />
          </div>
        </div>

        {/* ── Colonne droite : visualisations — passe en premier sur mobile ── */}
        <div style={{ order: isMobile ? 1 : 2, marginBottom: isMobile ? 24 : 0 }}>
          {/* Courbe de carrière */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>
              Courbe de carrière
            </div>
            <ZoomableChart innerRef={chartRef}>
              <CareerCurve years={res.years} net={res.net} pouvAchat={res.pouvAchat} />
            </ZoomableChart>
          </div>

          {/* Timeline jalons */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
              Jalons de carrière
            </div>
            <Milestones years={res.years} horizon={horizon} />
          </div>

          {/* Comparaison barres */}
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>
              Salaire actuel vs dans {horizon} ans
            </div>
            <CompareBar label={`Aujourd'hui (${age} ans)`}    value={res.net}        maxValue={maxNet} color="#818cf8" />
            <CompareBar label={`Dans ${horizon} ans (${age + horizon} ans)`} value={res.last.netY} maxValue={maxNet} color="#b8934a" />
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              Gain projeté : <strong style={{ color: "#4ade80" }}>+{fmtEur(Math.round(animGain))}/mois</strong>
              {" · "}Cumulé sur {horizon} ans : <strong style={{ color: "var(--gold)" }}>{fmtEur(Math.round(res.cumNet))}</strong>
            </div>
          </div>

          {/* Pouvoir d'achat */}
          <PouvoirAchat ratio={pouvoirRatio ?? 1} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
