import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { GLOSSARY, LEXIQUE_CATEGORIES } from "../data/glossaire.js";

const CATEGORY_COLORS = {
  "FIRE":       { bg: "rgba(239,68,68,0.1)",   color: "#ef4444",  border: "rgba(239,68,68,0.25)" },
  "Finances":   { bg: "rgba(34,197,94,0.1)",   color: "#22c55e",  border: "rgba(34,197,94,0.25)" },
  "Retraite":   { bg: "rgba(99,102,241,0.1)",  color: "#818cf8",  border: "rgba(99,102,241,0.25)" },
  "Immobilier": { bg: "rgba(168,85,247,0.1)",  color: "#a855f7",  border: "rgba(168,85,247,0.25)" },
  "Impôts":     { bg: "rgba(249,115,22,0.1)",  color: "#f97316",  border: "rgba(249,115,22,0.25)" },
  "Budget":     { bg: "rgba(20,184,166,0.1)",  color: "#14b8a6",  border: "rgba(20,184,166,0.25)" },
};

function Badge({ category }) {
  const s = CATEGORY_COLORS[category] || { bg: "rgba(184,147,74,0.1)", color: "var(--gold)", border: "var(--border-gold)" };
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 600,
      padding: "3px 10px", borderRadius: 12, letterSpacing: "0.06em",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      {category}
    </span>
  );
}

function TermCard({ entry }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={`/lexique/${entry.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", textDecoration: "none",
        background: "var(--card-bg)",
        border: `1px solid ${hovered ? "var(--border-gold)" : "var(--border)"}`,
        borderRadius: 14, padding: "16px 18px",
        boxShadow: hovered ? "0 6px 24px rgba(184,147,74,0.12)" : "var(--card-shadow)",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 600, color: "var(--text)" }}>
          {entry.term}
        </span>
        <span style={{ fontSize: 12, color: "var(--gold)", flexShrink: 0 }}>Lire →</span>
      </div>
      {entry.full !== entry.term && (
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8, fontStyle: "italic" }}>{entry.full}</div>
      )}
      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{entry.short}</p>
    </Link>
  );
}

export default function Lexique() {
  const [theme, setTheme] = useTheme();
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "Lexique financier — définitions claires | mesimulateurs.fr";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Lexique des termes de finances personnelles : TAEG, PTZ, PER, TMI, FIRE, assurance-vie, Agirc-Arrco… Des définitions simples, reliées à nos simulateurs gratuits.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.mesimulateurs.fr/lexique';
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return GLOSSARY;
    return GLOSSARY.filter(t =>
      t.term.toLowerCase().includes(q) ||
      t.full.toLowerCase().includes(q) ||
      t.short.toLowerCase().includes(q) ||
      (t.aliases || []).some(a => a.toLowerCase().includes(q))
    );
  }, [q]);

  const byCategory = useMemo(() => {
    const groups = {};
    for (const t of filtered) (groups[t.category] ||= []).push(t);
    return groups;
  }, [filtered]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 80px" }}>

        {/* Fil d'Ariane */}
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}<span style={{ color: "var(--text)" }}>Lexique</span>
        </div>

        {/* Header */}
        <div style={{ padding: "12px 0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 36, height: 2, background: "linear-gradient(90deg,var(--gold-mid),var(--gold))" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-mid)" }}>
              Lexique · Finances personnelles
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 36 }}>📖</span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px,5vw,42px)", fontWeight: 600, color: "var(--text)" }}>
              Lexique financier
            </h1>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7, maxWidth: 560 }}>
            Tous les termes et acronymes (TAEG, PTZ, PER, TMI, FIRE…) expliqués simplement, et reliés aux simulateurs concernés.
          </p>
        </div>

        {/* Recherche */}
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher un terme…"
          aria-label="Rechercher un terme"
          style={{
            width: "100%", boxSizing: "border-box", padding: "12px 16px", marginBottom: 28,
            background: "var(--card-bg)", color: "var(--text)",
            border: "1px solid var(--border)", borderRadius: 12, fontSize: 15,
            fontFamily: "'DM Sans', sans-serif", outline: "none",
          }}
        />

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--text-secondary)", fontSize: 14 }}>
            Aucun terme ne correspond à « {query} ».
          </div>
        ) : (
          LEXIQUE_CATEGORIES.filter(cat => byCategory[cat]?.length).map(cat => (
            <section key={cat} style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Badge category={cat} />
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
                {byCategory[cat].map(entry => <TermCard key={entry.slug} entry={entry} />)}
              </div>
            </section>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}
