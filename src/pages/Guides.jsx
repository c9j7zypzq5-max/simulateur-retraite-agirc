import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { GUIDES } from "../data/guides.js";

function GuideCard({ guide }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={`/guides/${guide.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", textDecoration: "none",
        background: "var(--card-bg)",
        border: `1px solid ${hovered ? "var(--border-gold)" : "var(--border)"}`,
        borderRadius: 16, padding: "24px",
        boxShadow: hovered ? "0 6px 24px rgba(184,147,74,0.12)" : "var(--card-shadow)",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <span style={{ fontSize: 32 }} aria-hidden="true">{guide.emoji}</span>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>
          {guide.title}
        </h2>
      </div>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 14 }}>{guide.intro}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{guide.sims.length} simulateurs · {guide.terms.length} définitions</span>
        <span style={{ fontSize: 13, color: "var(--gold)", fontWeight: 500 }}>Ouvrir le guide →</span>
      </div>
    </Link>
  );
}

export default function Guides() {
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    document.title = "Guides finances personnelles — retraite, immobilier, épargne | simfinly.com";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Guides pratiques pour préparer sa retraite, acheter un logement, construire son épargne et atteindre l'indépendance financière. Simulateurs, définitions et articles réunis.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com/guides';
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}<span style={{ color: "var(--text)" }}>Guides</span>
        </div>

        <div style={{ padding: "12px 0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 36, height: 2, background: "linear-gradient(90deg,var(--gold-mid),var(--gold))" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-mid)" }}>
              Guides · Finances personnelles
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 36 }}>📚</span>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px,5vw,42px)", fontWeight: 600, color: "var(--text)" }}>
              Guides pratiques
            </h1>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7, maxWidth: 560 }}>
            Des parcours complets qui réunissent les simulateurs, les définitions clés et les articles d'une même thématique.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
          {GUIDES.map(g => <GuideCard key={g.slug} guide={g} />)}
        </div>
      </div>

      <Footer />
    </div>
  );
}
