import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { GLOSSAIRE_BE } from "../../data/glossaireBE.js";

const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function TermRow({ entry }) {
  return (
    <div style={{
      padding: "18px 0",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
        {entry.terme}
      </div>
      <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
        {entry.definition}
      </p>
    </div>
  );
}

export default function LexiqueBE() {
  const [theme, setTheme] = useTheme();
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "Lexique financier belge | simfinly.com";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Lexique des termes financiers belges : IPP, précompte professionnel, pension légale, EIP, PLCI, droits d'enregistrement, revenu cadastral et plus. Définitions claires.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com/be/lexique';
  }, []);

  const q = norm(query.trim());
  const filtered = useMemo(() => {
    if (!q) return GLOSSAIRE_BE;
    return GLOSSAIRE_BE.filter(t =>
      norm(t.terme).includes(q) || norm(t.definition).includes(q)
    );
  }, [q]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 28, display: "flex", gap: 6, alignItems: "center" }}>
          <Link to="/be" style={{ color: "var(--primary)", textDecoration: "none" }}>Accueil BE</Link>
          <span style={{ opacity: 0.5 }}>›</span>
          <span>Lexique</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(43,92,230,0.08)", border: "1px solid rgba(43,92,230,0.2)",
            color: "var(--primary)", fontSize: "0.72rem", fontWeight: 500,
            letterSpacing: "0.06em", textTransform: "uppercase",
            padding: "6px 14px", borderRadius: 20, marginBottom: 18,
          }}>
            {GLOSSAIRE_BE.length} termes financiers belges
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: "var(--text)", marginBottom: 12, lineHeight: 1.2 }}>
            Lexique financier — <span style={{ color: "var(--primary)" }}>Belgique</span>
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 580, margin: 0 }}>
            Les termes clés de la fiscalité et des finances personnelles belges, expliqués simplement.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 32 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", display: "flex", pointerEvents: "none" }}>
            <Search size={17} />
          </span>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un terme (IPP, tantième, précompte…)"
            aria-label="Rechercher un terme du lexique belge"
            style={{
              width: "100%", padding: "11px 40px 11px 42px", borderRadius: 10,
              background: "var(--surface)", border: "1.5px solid var(--border)",
              color: "var(--text)", fontSize: 14,
              fontFamily: "'Hanken Grotesk', sans-serif", outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(43,92,230,0.12)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Effacer la recherche"
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center", padding: 8 }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Results count when filtering */}
        {q && (
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
            {filtered.length === 0
              ? `Aucun terme ne correspond à « ${query.trim()} ».`
              : `${filtered.length} terme${filtered.length > 1 ? "s" : ""} trouvé${filtered.length > 1 ? "s" : ""}`}
          </p>
        )}

        {/* Term list */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "0 24px" }}>
          {filtered.length > 0
            ? filtered.map((entry, i) => (
                <TermRow key={i} entry={entry} />
              ))
            : !q && (
                <p style={{ padding: "24px 0", color: "var(--text-secondary)", textAlign: "center" }}>Aucun terme disponible.</p>
              )}
        </div>

        {/* Back link */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 28, marginTop: 48 }}>
          <Link to="/be" style={{ color: "var(--primary)", textDecoration: "none", fontSize: 14, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6 }}>
            ← Retour à l'accueil Belgique
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
