import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "../lib/router.js";
import { useExporting } from "../utils/exportMode.js";
import { ROUTE_META } from "../../api/_routes.js";
import AutoLinkText from "./AutoLinkText.jsx";
import JsonLd from "./JsonLd.jsx";

// ─── Formatters ───────────────────────────────────────────────────────────────
export const fmt    = (n, d = 0) => (isNaN(n) ? 0 : n).toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
export const fmtEur = n => fmt(n) + " €";
export const signFmt = n => (n > 0 ? "+" : "") + fmtEur(n);

// ─── Animated number ─────────────────────────────────────────────────────────
export function useAnimatedNumber(target, duration = 700) {
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

// ─── NumInput ─────────────────────────────────────────────────────────────────
// Champ entier. Accepte les espaces et virgules comme séparateurs de milliers
// (ex: "100 000" ou "100,000" → 100000). Pas de décimales.
export function NumInput({ label, value, onChange, unit, hint, min = 0, max = 999999, id, tooltip }) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const hintId  = hint ? `${inputId}-hint` : undefined;
  const [raw, setRaw]     = useState(value === null || value === undefined ? "" : String(value));
  const [focused, setFoc] = useState(false);
  useEffect(() => {
    if (!focused) setRaw(value === null || value === undefined ? "" : String(value));
  }, [value, focused]);

  const handleChange = e => {
    // Garder uniquement les chiffres et espaces (séparateurs de milliers)
    const v = e.target.value.replace(/[^0-9\s]/g, "");
    setRaw(v);
    const normalized = v.replace(/\s/g, "");
    const n = Number(normalized);
    if (!isNaN(n) && normalized !== "") onChange(Math.min(Math.max(n, min), max));
  };
  const handleBlur = () => {
    setFoc(false);
    const normalized = raw.replace(/\s/g, "");
    const n = Number(normalized);
    if (isNaN(n) || normalized === "") setRaw(value === null || value === undefined ? "" : String(value));
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
          onFocus={e => { setFoc(true); setRaw(value === null || value === undefined ? "" : String(value)); const el = e.currentTarget; requestAnimationFrame(() => el.select()); }}
          onBlur={handleBlur}
          placeholder={unit ? `0 ${unit}` : "0"}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: "var(--text)", padding: "14px 0 14px 20px", width: 0 }} />
        {unit && <span style={{ padding: "0 20px", fontSize: 18, color: "var(--gold-mid)", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{unit}</span>}
      </div>
      {hint && <div id={hintId} style={{ marginTop: 8, fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>{hint}</div>}
    </div>
  );
}

// ─── StepperInput ─────────────────────────────────────────────────────────────
// Champ décimal. Accepte indifféremment "." et "," comme séparateur décimal
// (conventions française et anglaise). "3,5" est parsé comme 3.5.
export function StepperInput({ label, value, onChange, min, max, step = 1, unit = "", hint, tooltip }) {
  const [raw, setRaw] = useState(value === null || value === undefined ? "" : String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setRaw(value === null || value === undefined ? "" : String(value));
  }, [value, focused]);

  function clamp(n) { return Math.min(Math.max(n, min), max); }

  // Normalise "3,5" → "3.5", strip espaces
  function norm(s) { return String(s).replace(/,/g, ".").replace(/\s/g, ""); }

  function handleChange(e) {
    // Autoriser chiffres, séparateurs décimaux (. et ,), signe moins
    const v = e.target.value.replace(/[^0-9.,-]/g, "");
    setRaw(v);
    const n = norm(v);
    // Ne pas déclencher onChange sur valeur incomplète ("3." ou "3,")
    if (!n || n.endsWith(".")) return;
    const parsed = parseFloat(n);
    if (!isNaN(parsed)) onChange(clamp(parsed));
  }

  function handleBlur() {
    setFocused(false);
    const n = parseFloat(norm(raw));
    if (isNaN(n) || raw === "") { onChange(min); setRaw(String(min)); }
    else { const c = clamp(n); onChange(c); setRaw(String(c)); }
  }

  const dec = () => onChange(clamp(parseFloat(norm(String(raw || value || min))) - step));
  const inc = () => onChange(clamp(parseFloat(norm(String(raw || value || min))) + step));

  const btnStyle = {
    width: 40, height: 44, borderRadius: 10, border: "1.5px solid var(--border)",
    background: "var(--card-bg)", color: "var(--text)", fontSize: 20, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
        {label}
        {tooltip && <span title={tooltip} aria-label={tooltip} style={{ cursor: "help", marginLeft: 6, fontSize: 13, opacity: 0.6 }}>ⓘ</span>}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={dec} type="button" aria-label={`Diminuer ${label}`} style={btnStyle}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold-mid)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>−</button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", background: focused ? "rgba(184,147,74,0.08)" : "var(--card-bg)", border: `1.5px solid ${focused ? "var(--gold-mid)" : "var(--border)"}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s", boxShadow: focused ? "0 0 0 3px rgba(184,147,74,0.12)" : "none" }}>
          <input type="text" inputMode="decimal"
            value={focused ? raw : (value === null || value === undefined ? "" : String(value))}
            onChange={handleChange}
            onFocus={e => { setFocused(true); setRaw(value === null || value === undefined ? "" : String(value)); const el = e.currentTarget; requestAnimationFrame(() => el.select()); }}
            onBlur={handleBlur}
            placeholder="0"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: "var(--text)", padding: "10px 0 10px 16px", width: 0, textAlign: "center" }} />
          {unit && <span style={{ padding: "0 16px", fontSize: 16, color: "var(--gold-mid)", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{unit}</span>}
        </div>
        <button onClick={inc} type="button" aria-label={`Augmenter ${label}`} style={btnStyle}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold-mid)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>+</button>
      </div>
      {hint && <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>{hint}</div>}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
export function Toggle({ options, checked, onChange }) {
  const opts = options || ["Non", "Oui"];
  return (
    <div style={{ display: "flex", background: "var(--input-bg)", borderRadius: 10, padding: 3, gap: 2 }}>
      {opts.map((opt, i) => (
        <button key={opt} onClick={() => onChange(i === 1)}
          aria-pressed={String((i === 1) === checked)}
          style={{ padding: "9px 16px", borderRadius: 8, border: "none",
            background: (i === 1) === checked ? "rgba(184,147,74,0.25)" : "transparent",
            color: (i === 1) === checked ? "var(--gold)" : "var(--text-secondary)",
            fontSize: 13, cursor: "pointer", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" }}>
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
export function Chip({ label, value, accent, small }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: accent ? "rgba(184,147,74,0.12)" : "var(--card-bg)",
        border: `1px solid ${hovered ? "var(--border-gold)" : (accent ? "rgba(184,147,74,0.4)" : "var(--border)")}`,
        borderRadius: 10,
        padding: small ? "10px 12px" : "14px 16px",
        boxShadow: hovered ? "0 4px 18px rgba(184,147,74,0.1)" : "var(--card-shadow)",
        cursor: "default",
      }}
    >
      <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 5 }}>{label}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: small ? 16 : 20, fontWeight: 700, color: accent ? "var(--gold)" : "var(--text)" }}>{value}</div>
    </div>
  );
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────
export function ProgressBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  // Couleur sémantique auto si non spécifiée
  const autoColor = color || (
    pct >= 100 ? "#22c55e" :
    pct >= 75  ? "linear-gradient(90deg,var(--gold-mid),var(--gold))" :
    pct >= 40  ? "linear-gradient(90deg,#b8934a,var(--gold))" :
                 "linear-gradient(90deg,#94a3b8,var(--gold-mid))"
  );
  const complete = pct >= 100;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "var(--text-secondary)" }}>
        <span>{label}</span>
        <span style={{ color: complete ? "#22c55e" : "var(--text)", fontWeight: complete ? 600 : 400 }}>
          {fmt(value)} ({pct.toFixed(0)} %)
        </span>
      </div>
      <div style={{ height: 6, background: "var(--progress-track)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: autoColor,
          borderRadius: 3,
          transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
          boxShadow: complete ? "0 0 8px rgba(34,197,94,0.4)" : "none",
        }} />
      </div>
    </div>
  );
}

// ─── AccordionSection ────────────────────────────────────────────────────────
export function AccordionSection({ title, subtitle, children, gold = false, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [btnHovered, setBtnHovered] = useState(false);
  const exporting = useExporting();          // ouvre la section pendant l'export PDF
  const reallyOpen = open || exporting;
  const panelId = `acc-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 32)}`;
  return (
    <div style={{ background: gold ? "rgba(184,147,74,0.05)" : "var(--card-bg)", border: `1px solid ${gold ? "rgba(184,147,74,0.2)" : "var(--border)"}`, borderRadius: 20, overflow: "hidden", marginTop: 20, boxShadow: "var(--card-shadow)" }}>
      <button onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls={panelId}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 28px", background: btnHovered ? "rgba(184,147,74,0.04)" : "none", border: "none", cursor: "pointer" }}>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: gold ? "var(--gold)" : "var(--text)" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 3 }}>{subtitle}</div>}
        </div>
        <span style={{ color: open ? "var(--gold)" : "var(--text-secondary)", fontSize: 22, marginLeft: 16, flexShrink: 0, transition: "transform 0.2s ease, color 0.2s", transform: open ? "rotate(0deg)" : "rotate(0deg)" }} aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {reallyOpen && (
        <div id={panelId} role="region" aria-label={title} style={{ padding: "0 28px 28px", animation: "slideDown 0.18s ease" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── ResultCard ───────────────────────────────────────────────────────────────
export function ResultCard({ label, pension, subLabel, empty }) {
  return (
    <div role="status" aria-live="polite" style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>{label}</div>
      {empty ? (
        <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>
          Saisissez vos paramètres pour voir votre estimation.
        </p>
      ) : (
        <>
          <div key={pension} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,10vw,76px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "scaleIn 0.3s ease" }}>
            {pension}
          </div>
          {subLabel && <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>{subLabel}</div>}
        </>
      )}
    </div>
  );
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────
export function StatusBadge({ status, label }) {
  const palette = {
    good: { bg: "rgba(34,197,94,0.1)",    color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" },
    warn: { bg: "rgba(249,115,22,0.1)",   color: "#f97316", border: "1px solid rgba(249,115,22,0.25)" },
    bad:  { bg: "rgba(239,68,68,0.1)",    color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" },
    info: { bg: "rgba(99,102,241,0.1)",   color: "#818cf8", border: "1px solid rgba(99,102,241,0.25)" },
    gold: { bg: "rgba(184,147,74,0.1)",   color: "var(--gold)", border: "1px solid var(--border-gold)" },
  };
  const s = palette[status] || palette.info;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 12, ...s }}>
      {label}
    </span>
  );
}

// ─── FaqItem + FaqSection ────────────────────────────────────────────────────
export function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, background: "none", border: "none", cursor: "pointer", padding: "18px 0", textAlign: "left" }}
      >
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: "var(--text)", lineHeight: 1.4 }}>{q}</span>
        <span aria-hidden="true" style={{ flexShrink: 0, fontSize: 18, color: open ? "var(--gold)" : "var(--text-secondary)", transition: "color 0.2s" }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p style={{ paddingBottom: 18, paddingRight: 32, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, animation: "slideDown 0.18s ease" }}>
          <AutoLinkText>{a}</AutoLinkText>
        </p>
      )}
    </div>
  );
}

export function FaqSection({ title = "Questions fréquentes", items }) {
  // Données structurées FAQPage (schema.org) → éligibilité aux rich results.
  const faqLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: (items || []).map(({ q, a }) => ({
      "@type": "Question", name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
      {items?.length > 0 && <JsonLd data={faqLd} />}
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>
        {title}
      </h2>
      {items.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
    </div>
  );
}

// Fil d'Ariane visible (en plus du BreadcrumbList JSON-LD statique).
function HeaderBreadcrumb() {
  const { pathname } = useLocation();
  const meta = ROUTE_META[pathname];
  return (
    <nav aria-label="Fil d'Ariane" style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 14 }}>
      <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
      {meta?.cat && <>{" · "}<span>{meta.cat}</span></>}
      {meta?.title && <>{" · "}<span style={{ color: "var(--text)" }}>{meta.title}</span></>}
    </nav>
  );
}

// ─── SimulateurHeader ─────────────────────────────────────────────────────────
export function SimulateurHeader({ icon, badge, title, subtitle, desc }) {
  return (
    <div style={{ padding: "28px 0 28px", animation: "fadeUp .5s ease both" }}>
      <HeaderBreadcrumb />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ width: 36, height: 2, background: "linear-gradient(90deg,var(--gold-mid),var(--gold))" }} aria-hidden="true" />
        <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-mid)" }}>{badge}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
        <span style={{ fontSize: 36 }} aria-hidden="true">{icon}</span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px,5vw,42px)", fontWeight: 600, lineHeight: 1.1, color: "var(--text)" }}>{title}</h1>
      </div>
      {subtitle && <p style={{ fontSize: 13, color: "var(--gold-mid)", letterSpacing: "0.05em", marginBottom: 10 }}><AutoLinkText>{subtitle}</AutoLinkText></p>}
      {desc && <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7, maxWidth: 520 }}><AutoLinkText>{desc}</AutoLinkText></p>}
    </div>
  );
}
