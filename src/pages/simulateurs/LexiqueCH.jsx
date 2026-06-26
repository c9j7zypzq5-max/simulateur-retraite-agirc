import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { GLOSSAIRE_CH } from "../../data/glossaireCH.js";

const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function TermRow({ entry }) {
  return (
    <div style={{ padding: "18px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
        {entry.terme}
      </div>
      <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>
        {entry.definition}
      </p>
    </div>
  );
}

export default function LexiqueCH() {
  const [theme, setTheme] = useTheme();
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "Lexique financier suisse — AVS, LPP, pilier 3a | simfinly.com";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Lexique des termes financiers suisses : AVS, LPP, pilier 3a, salaire coordonné, avoir de vieillesse, taux de conversion, ICC. Définitions claires adaptées au droit suisse.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com/ch/lexique';
  }, []);

  const q = norm(query.trim());
  const filtered = useMemo(() => {
    if (!q) return GLOSSAIRE_CH;
    return GLOSSAIRE_CH.filter(t =>
      norm(t.terme).includes(q) || norm(t.definition).includes(q)
    );
  }, [q]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px" }}>

        <nav aria-label="Fil d'Ariane" style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 28, display: "flex", gap: 6, alignItems: "center" }}>
          <Link to="/ch" style={{ color: "var(--primary)", textDecoration: "none" }}>Accueil CH</Link>
          <span style={{ opacity: 0.5 }}>›</span>
          <span>Lexique suisse</span>
        </nav>

        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          Lexique financier suisse
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 32, lineHeight: 1.6 }}>
          Définitions des termes clés de la prévoyance et de la fiscalité en Suisse : AVS, LPP, pilier 3a, impôt cantonal et plus.
        </p>

        {/* Barre de recherche */}
        <div style={{ position: "relative", marginBottom: 28 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", pointerEvents: "none" }} />
          <input
            type="search"
            placeholder="Rechercher un terme…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 36px 10px 36px", borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 14, fontFamily: "'Hanken Grotesk', sans-serif", outline: "none" }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex" }}>
              <X size={15} />
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Aucun terme trouvé pour « {query} ».</p>
        ) : (
          <div>
            {filtered.map((t, i) => <TermRow key={i} entry={t} />)}
          </div>
        )}

        {/* Lien retour vers les simulateurs CH */}
        <div style={{ marginTop: 40, padding: "20px 24px", background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)" }}>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 12px" }}>Simulateurs adaptés au droit suisse</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { to: "/ch/simulateurs/lpp-deuxieme-pilier", label: "2e pilier LPP" },
              { to: "/ch/simulateurs/prevoyance-ch", label: "Pilier 3a" },
              { to: "/ch/simulateurs/impot-revenu-ch", label: "Impôt cantonal" },
              { to: "/ch/simulateurs/epargne", label: "Épargne CHF" },
            ].map(l => (
              <Link key={l.to} to={l.to} style={{ fontSize: 13, color: "var(--primary)", textDecoration: "none", padding: "6px 12px", background: "rgba(184,147,74,0.1)", borderRadius: 8 }}>
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
