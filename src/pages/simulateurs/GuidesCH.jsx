import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { GUIDES_CH } from "../../data/guidesCH.js";

const CAT_COLORS = {
  "Fiscalité":  { color: "#b45309", bg: "#fef3c7", border: "#fde68a" },
  "Retraite":   { color: "#2B5CE6", bg: "#EAF0FF", border: "#d6e2fb" },
  "Patrimoine": { color: "#7c3aed", bg: "#ede9fe", border: "#ddd6fe" },
  "Épargne":    { color: "#15803d", bg: "#dcfce7", border: "#bbf7d0" },
};

function CategoryBadge({ category }) {
  const s = CAT_COLORS[category] || { color: "var(--primary)", bg: "var(--primary-soft)", border: "var(--border)" };
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

function GuideCard({ guide }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14,
      padding: "24px", display: "flex", flexDirection: "column", gap: 14,
      boxShadow: "var(--card-shadow)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <CategoryBadge category={guide.category} />
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-secondary)" }}>
          <Clock size={13} />
          {guide.readTime} min
        </span>
      </div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: "var(--text)", margin: 0, lineHeight: 1.3 }}>
        {guide.title}
      </h2>
      <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
        {guide.excerpt}
      </p>
    </div>
  );
}

export default function GuidesCH() {
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    document.title = "Guides finances personnelles Suisse — LPP, 3a, fiscalité | simfinly.com";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Guides pratiques sur les finances personnelles en Suisse : 2e pilier LPP, pilier 3a, impôt cantonal, AVS et prévoyance. Conseils adaptés au droit suisse 2025.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com/ch/guides';
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>

        <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 28, display: "flex", gap: 6, alignItems: "center" }}>
          <Link to="/ch" style={{ color: "var(--primary)", textDecoration: "none" }}>Accueil CH</Link>
          <span style={{ opacity: 0.5 }}>›</span>
          <span>Guides suisses</span>
        </nav>

        <div style={{ marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(184,147,74,0.1)", border: "1px solid rgba(184,147,74,0.25)",
            color: "var(--primary)", fontSize: "0.72rem", fontWeight: 500,
            letterSpacing: "0.06em", textTransform: "uppercase",
            padding: "6px 14px", borderRadius: 20, marginBottom: 18,
          }}>
            Retraite · Fiscalité · Prévoyance
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: "var(--text)", marginBottom: 12, lineHeight: 1.2 }}>
            Guides financiers — <span style={{ color: "var(--primary)" }}>Suisse</span>
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 620, margin: 0 }}>
            Des guides pratiques sur les trois piliers suisses, la fiscalité cantonale et l'optimisation de votre prévoyance. Adaptés au droit helvétique 2025.
          </p>
        </div>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {GUIDES_CH.map((g, i) => <GuideCard key={i} guide={g} />)}
        </div>

        {/* Simulateurs liés */}
        <div style={{ marginTop: 48, padding: "24px", background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            Simulateurs suisses
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { to: "/ch/simulateurs/lpp-deuxieme-pilier", label: "2e pilier LPP" },
              { to: "/ch/simulateurs/prevoyance-ch", label: "Pilier 3a" },
              { to: "/ch/simulateurs/impot-revenu-ch", label: "Impôt cantonal" },
              { to: "/ch/simulateurs/epargne", label: "Épargne CHF" },
              { to: "/ch/simulateurs/rente-capital", label: "Rente vs capital" },
            ].map(l => (
              <Link key={l.to} to={l.to} style={{ fontSize: 13, color: "var(--primary)", textDecoration: "none", padding: "7px 14px", background: "rgba(184,147,74,0.1)", border: "1px solid rgba(184,147,74,0.2)", borderRadius: 8 }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
