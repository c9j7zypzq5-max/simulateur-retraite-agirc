import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { GUIDES } from "../data/guides.js";
import { GLOSSARY } from "../data/glossaire.js";

const SIMULATEURS = [
  { title: "Simulateur Agirc-Arrco 2026", path: "/simulateurs/agirc-arrco", cat: "Retraite" },
  { title: "Simulateur CNAV retraite", path: "/simulateurs/cnav", cat: "Retraite" },
  { title: "Simulateur PER — Plan d'Épargne Retraite", path: "/simulateurs/per", cat: "Épargne" },
  { title: "Simulateur épargne & intérêts composés", path: "/simulateurs/epargne", cat: "Épargne" },
  { title: "Simulateur FIRE — indépendance financière", path: "/simulateurs/fire", cat: "FIRE" },
  { title: "Simulateur budget 50/30/20", path: "/simulateurs/budget", cat: "Budget" },
  { title: "Simulateur emprunt immobilier", path: "/simulateurs/emprunt-immobilier", cat: "Immobilier" },
  { title: "Simulateur PTZ 2026", path: "/simulateurs/ptz", cat: "Immobilier" },
  { title: "Simulateur impôt sur le revenu", path: "/simulateurs/impot-revenu", cat: "Fiscalité" },
  { title: "Simulateur donation & succession", path: "/simulateurs/donation", cat: "Fiscalité" },
  { title: "Simulateur succession", path: "/simulateurs/succession", cat: "Fiscalité" },
  { title: "Simulateur assurance-vie", path: "/simulateurs/assurance-vie", cat: "Épargne" },
  { title: "Simulateur rendement locatif", path: "/simulateurs/rendement-locatif", cat: "Immobilier" },
  { title: "Simulateur salaire net/brut", path: "/simulateurs/salaire", cat: "Budget" },
  { title: "Simulateur retraite progressive", path: "/simulateurs/retraite-progressive", cat: "Retraite" },
  { title: "Simulateur patrimoine global", path: "/simulateurs/patrimoine", cat: "Finances" },
  { title: "Simulateur plus-value immobilière", path: "/simulateurs/plus-value-immobiliere", cat: "Immobilier" },
  { title: "Simulateur déficit foncier", path: "/simulateurs/deficit-foncier", cat: "Immobilier" },
  { title: "Simulateur épargne salariale PEE/PERCO", path: "/simulateurs/epargne-salariale", cat: "Épargne" },
  { title: "Simulateur retraite anticipée", path: "/simulateurs/retraite-anticipee", cat: "Retraite" },
  { title: "Simulateur trimestres retraite", path: "/simulateurs/trimestres", cat: "Retraite" },
  { title: "Simulateur pension de réversion", path: "/simulateurs/pension-reversion", cat: "Retraite" },
  { title: "Comparateur d'actifs financiers", path: "/simulateurs/comparateur", cat: "Finances" },
  { title: "Simulateur coût en heures de travail", path: "/simulateurs/cout-en-heures", cat: "Budget" },
];

function score(text, q) {
  const t = text.toLowerCase();
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  return terms.filter(w => t.includes(w)).length / terms.length;
}

function search(q) {
  if (!q || q.length < 2) return { sims: [], guides: [], glossary: [] };
  const sims = SIMULATEURS
    .map(s => ({ ...s, score: score(s.title + " " + s.cat, q) }))
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
  const guides = GUIDES
    .map(g => ({ ...g, score: score(g.title + " " + g.intro + " " + g.category, q) }))
    .filter(g => g.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  const glossary = GLOSSARY
    .map(t => ({ ...t, score: score(t.term + " " + (t.full || "") + " " + t.short, q) }))
    .filter(t => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
  return { sims, guides, glossary };
}

export default function Recherche() {
  const [theme, setTheme] = useTheme();
  const [params, setParams] = useSearchParams();
  const [input, setInput] = useState(params.get("q") || "");

  usePageMeta(
    "Recherche — simulateurs, guides et articles | simfinly.com",
    "Recherchez parmi les simulateurs financiers, guides thématiques et termes du lexique de simfinly.com."
  );

  useEffect(() => {
    const q = params.get("q") || "";
    setInput(q);
  }, [params]);

  const q = params.get("q") || "";
  const results = useMemo(() => search(q), [q]);
  const hasResults = results.sims.length + results.guides.length + results.glossary.length > 0;

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim()) setParams({ q: input.trim() });
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 600, marginBottom: 24 }}>
          Recherche
        </h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, marginBottom: 36 }}>
          <input
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="retraite, PER, immobilier…"
            style={{
              flex: 1, padding: "12px 16px", borderRadius: 10,
              border: "1px solid var(--border)", background: "var(--card)",
              color: "var(--text)", fontSize: 15, outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 22px", borderRadius: 10, border: "none",
              background: "var(--primary)", color: "#fff", fontWeight: 600,
              fontSize: 14, cursor: "pointer",
            }}
          >
            Rechercher
          </button>
        </form>

        {q && !hasResults && (
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Aucun résultat pour <strong>"{q}"</strong>. Essayez un autre terme.
          </p>
        )}

        {results.sims.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: 12 }}>
              Simulateurs
            </div>
            {results.sims.map(s => (
              <Link key={s.path} to={s.path} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", textDecoration: "none", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{s.title}</span>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "2px 10px" }}>{s.cat}</span>
              </Link>
            ))}
          </section>
        )}

        {results.guides.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: 12 }}>
              Guides
            </div>
            {results.guides.map(g => (
              <Link key={g.slug} to={`/guides/${g.slug}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", textDecoration: "none", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{g.title}</span>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "2px 10px" }}>{g.category}</span>
              </Link>
            ))}
          </section>
        )}

        {results.glossary.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: 12 }}>
              Lexique
            </div>
            {results.glossary.map(t => (
              <Link key={t.slug} to={`/lexique/${t.slug}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", textDecoration: "none", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--primary)" }}>{t.term}</span>
                <span style={{ fontSize: 13, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.short}</span>
              </Link>
            ))}
          </section>
        )}

        {!q && (
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Entrez un terme pour rechercher parmi les simulateurs, guides et définitions du lexique.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
