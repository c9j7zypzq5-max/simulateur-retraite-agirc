import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Clock, Home, TrendingUp, Flame, Receipt,
  BarChart2, PiggyBank, Building2, Briefcase, CreditCard,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { GUIDES } from "../data/guides.js";

const GUIDE_ICONS = {
  Clock, Home, TrendingUp, Flame, Receipt,
  BarChart2, PiggyBank, Building2, Briefcase, CreditCard,
};

const CAT_GRADIENTS = {
  "Retraite":   "linear-gradient(135deg,#EAF0FF,#cdddfb)",
  "Immobilier": "linear-gradient(135deg,#ede9fe,#ddd6fe)",
  "Fiscalité":  "linear-gradient(135deg,#fef3c7,#fde68a)",
  "Épargne":    "linear-gradient(135deg,#dcfce7,#bbf7d0)",
  "FIRE":       "linear-gradient(135deg,#fee2e2,#fca5a5)",
  "Budget":     "linear-gradient(135deg,#e0f2fe,#bae6fd)",
};

const CAT_COLORS = {
  "Retraite":   { color: "#2B5CE6", bg: "#EAF0FF", border: "#d6e2fb" },
  "Immobilier": { color: "#7c3aed", bg: "#ede9fe", border: "#ddd6fe" },
  "Fiscalité":  { color: "#b45309", bg: "#fef3c7", border: "#fde68a" },
  "Épargne":    { color: "#15803d", bg: "#dcfce7", border: "#bbf7d0" },
  "FIRE":       { color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
  "Budget":     { color: "#0369a1", bg: "#e0f2fe", border: "#bae6fd" },
};

function CategoryBadge({ category }) {
  const s = CAT_COLORS[category] || { color: "var(--primary)", bg: "var(--primary-soft)", border: "var(--border-gold)" };
  return (
    <span style={{
      display: "inline-block", fontSize: 11, fontWeight: 700,
      letterSpacing: "0.06em", textTransform: "uppercase",
      padding: "4px 11px", borderRadius: 20,
      color: s.color, background: s.bg, border: `1px solid ${s.border}`,
    }}>
      {category}
    </span>
  );
}

function GuideIcon({ guide, size = 48, color = "var(--primary)" }) {
  const Icon = GUIDE_ICONS[guide.icon];
  if (!Icon) return null;
  return <Icon size={size} color={color} strokeWidth={1.5} />;
}

function FeaturedGuide({ guide }) {
  const [hovered, setHovered] = useState(false);
  const catStyle = CAT_COLORS[guide.category] || { color: "var(--primary)", bg: "var(--primary-soft)", border: "var(--border-gold)" };

  return (
    <Link
      to={`/guides/${guide.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", textDecoration: "none",
        background: "var(--surface)", border: `1px solid ${hovered ? "var(--primary)" : "var(--border)"}`,
        borderRadius: 16, marginBottom: 24, overflow: "hidden",
        boxShadow: hovered ? "0 8px 32px rgba(43,92,230,0.14)" : "var(--card-shadow)",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      <div className="featured-guide-inner">
        <div style={{ padding: "30px 32px", flex: 1 }}>
          <span style={{ display: "inline-block", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", color: catStyle.color, background: catStyle.bg, border: `1px solid ${catStyle.border}`, padding: "4px 12px", borderRadius: 20, marginBottom: 14 }}>
            À la une · {guide.category}
          </span>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(20px,3vw,27px)", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--text)", margin: "0 0 10px", lineHeight: 1.2 }}>
            {guide.title}
          </h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--text-secondary)", margin: "0 0 16px" }}>{guide.intro}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "var(--text-secondary)" }}>
            <span>{guide.sims.length} simulateurs</span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--border)", display: "inline-block" }} />
            <span>{guide.terms.length} définitions</span>
            <span style={{ marginLeft: "auto", color: "var(--primary)", fontWeight: 600 }}>Ouvrir →</span>
          </div>
        </div>
        <div className="featured-guide-img" style={{ background: "linear-gradient(135deg,var(--primary),#5B8CFF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <GuideIcon guide={guide} size={56} color="rgba(255,255,255,0.85)" />
        </div>
      </div>
    </Link>
  );
}

function GuideCard({ guide }) {
  const [hovered, setHovered] = useState(false);
  const gradient = CAT_GRADIENTS[guide.category] || "linear-gradient(135deg,var(--primary-soft),var(--border-gold))";
  return (
    <Link
      to={`/guides/${guide.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", textDecoration: "none",
        background: "var(--surface)", border: `1px solid ${hovered ? "var(--primary)" : "var(--border)"}`,
        borderRadius: 14, overflow: "hidden",
        boxShadow: hovered ? "0 6px 24px rgba(43,92,230,0.13)" : "var(--card-shadow)",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
        transform: hovered ? "translateY(-3px)" : "none",
      }}
    >
      <div style={{ height: 120, background: gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <GuideIcon guide={guide} size={40} color={CAT_COLORS[guide.category]?.color || "var(--primary)"} />
      </div>
      <div style={{ padding: "16px 18px" }}>
        <div style={{ marginBottom: 8 }}>
          <CategoryBadge category={guide.category} />
        </div>
        <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(15px,2vw,16.5px)", fontWeight: 600, color: "var(--text)", margin: "0 0 8px", lineHeight: 1.3 }}>
          {guide.title}
        </h3>
        <div style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
          {guide.sims.length} simulateurs · {guide.terms.length} définitions
        </div>
      </div>
    </Link>
  );
}

export default function Guides() {
  const [theme, setTheme] = useTheme();
  const [activeCat, setActiveCat] = useState("Tous");

  useEffect(() => {
    document.title = "Guides finances personnelles — retraite, immobilier, épargne | simfinly.com";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Guides pratiques pour préparer sa retraite, acheter un logement, construire son épargne et atteindre l'indépendance financière. Simulateurs, définitions et articles réunis.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com/guides';
  }, []);

  const cats = ["Tous", ...Array.from(new Set(GUIDES.map(g => g.category).filter(Boolean)))];
  const shown = activeCat === "Tous" ? GUIDES : GUIDES.filter(g => g.category === activeCat);
  const [featured, ...rest] = shown;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk',sans-serif", color: "var(--text)" }}>
      <style>{`
        .featured-guide-inner { display: flex; flex-direction: column; }
        .featured-guide-img { min-height: 160px; }
        @media (min-width: 680px) {
          .featured-guide-inner { flex-direction: row; align-items: stretch; }
          .featured-guide-img { width: 260px; min-height: 200px; flex-shrink: 0; }
        }
        .guides-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        @media (max-width: 840px) { .guides-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 540px) { .guides-grid { grid-template-columns: 1fr; } }
      `}</style>

      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "44px 0 30px", animation: "fadeUp .5s ease both" }}>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(28px,5vw,38px)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", margin: "0 0 12px" }}>
            Guides &amp; conseils
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", margin: 0 }}>
            Comprendre la retraite, l'immobilier et vos finances — expliqué simplement.
          </p>
        </div>

        {/* Category filters */}
        {cats.length > 2 && (
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
            {cats.map(c => {
              const active = activeCat === c;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  aria-pressed={active}
                  style={{
                    padding: active ? "8px 16px" : "7px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                    fontFamily: "'Hanken Grotesk',sans-serif",
                    background: active ? "var(--primary)" : "var(--bg)",
                    color: active ? "#fff" : "var(--text-secondary)",
                    border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
                    fontWeight: active ? 600 : 500,
                    transition: "all 0.2s",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        )}

        {/* Featured + grid */}
        {featured && <FeaturedGuide guide={featured} />}
        {rest.length > 0 && (
          <div className="guides-grid">
            {rest.map(g => <GuideCard key={g.slug} guide={g} />)}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
