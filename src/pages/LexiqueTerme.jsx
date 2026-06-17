import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AdUnit from "../components/AdUnit.jsx";
import { ROUTE_META } from "../../api/_routes.js";
import { GLOSSARY_BY_SLUG } from "../data/glossaire.js";

const CATEGORY_COLORS = {
  "FIRE":       { bg: "rgba(239,68,68,0.1)",   color: "#ef4444",  border: "rgba(239,68,68,0.25)" },
  "Finances":   { bg: "rgba(34,197,94,0.1)",   color: "#22c55e",  border: "rgba(34,197,94,0.25)" },
  "Retraite":   { bg: "rgba(99,102,241,0.1)",  color: "#818cf8",  border: "rgba(99,102,241,0.25)" },
  "Immobilier": { bg: "rgba(168,85,247,0.1)",  color: "#a855f7",  border: "rgba(168,85,247,0.25)" },
  "Impôts":     { bg: "rgba(249,115,22,0.1)",  color: "#f97316",  border: "rgba(249,115,22,0.25)" },
  "Budget":     { bg: "rgba(20,184,166,0.1)",  color: "#14b8a6",  border: "rgba(20,184,166,0.25)" },
};

function simLabel(path) {
  return (ROUTE_META[path]?.title || path.replace("/simulateurs/", "").replace(/-/g, " "));
}

// Catégories du blog correspondant à une catégorie du lexique (pour les articles liés).
const BLOG_CATS_FOR = {
  Retraite: ["Retraite"], Immobilier: ["Immobilier"], "Impôts": ["Fiscalité"],
  Finances: ["Finances", "Épargne"], FIRE: ["FIRE"], Budget: ["Budget"],
};

export default function LexiqueTerme() {
  const [theme, setTheme] = useTheme();
  const { slug } = useParams();
  const entry = GLOSSARY_BY_SLUG[slug];
  const [relatedArticles, setRelatedArticles] = useState([]);

  // Articles de blog liés (même thématique que le terme).
  useEffect(() => {
    if (!entry) { setRelatedArticles([]); return; }
    const cats = BLOG_CATS_FOR[entry.category] || [];
    fetch('/api/articles')
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data.filter(a => cats.includes(a.category)).slice(0, 3) : [];
        setRelatedArticles(list);
      })
      .catch(() => setRelatedArticles([]));
  }, [entry]);

  useEffect(() => {
    if (!entry) { document.title = "Terme introuvable | simfinly.com"; return; }
    document.title = `${entry.term} : définition (${entry.full}) | simfinly.com`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", entry.short);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = `https://www.simfinly.com/lexique/${slug}`;
  }, [entry, slug]);

  const cat = entry ? (CATEGORY_COLORS[entry.category] || CATEGORY_COLORS["Finances"]) : null;
  const related = (entry?.related || []).map(s => GLOSSARY_BY_SLUG[s]).filter(Boolean);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 80px" }}>

        {/* Fil d'Ariane */}
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}
          <Link to="/lexique" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Lexique</Link>
          {entry && <>{" · "}<span style={{ color: "var(--text)" }}>{entry.term}</span></>}
        </div>

        {!entry ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, marginBottom: 12 }}>Terme introuvable</h1>
            <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Ce terme n'existe pas (encore) dans le lexique.</p>
            <Link to="/lexique" style={{
              display: "inline-block", padding: "10px 24px", borderRadius: 10,
              background: "rgba(184,147,74,0.15)", color: "var(--gold)",
              border: "1px solid var(--border-gold)", textDecoration: "none", fontSize: 14,
            }}>← Voir tout le lexique</Link>
          </div>
        ) : (
          <>
            <div style={{ padding: "20px 0 28px" }}>
              <div style={{ marginBottom: 16 }}>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 12, letterSpacing: "0.06em",
                  background: cat.bg, color: cat.color, border: `1px solid ${cat.border}`,
                }}>
                  {entry.category}
                </span>
              </div>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,5vw,42px)",
                fontWeight: 600, lineHeight: 1.2, color: "var(--text)", marginBottom: 8,
              }}>
                {entry.term}
              </h1>
              {entry.full !== entry.term && (
                <p style={{ fontSize: 16, color: "var(--text-secondary)", fontStyle: "italic", marginBottom: 16 }}>{entry.full}</p>
              )}
              <p style={{
                fontSize: 16, lineHeight: 1.75, color: "var(--text-secondary)",
                borderLeft: "3px solid var(--gold)", paddingLeft: 18,
              }}>
                {entry.short}
              </p>
            </div>

            {/* Définition détaillée */}
            <div>
              {entry.long.map((p, i) => (
                <p key={i} style={{ fontSize: 15, lineHeight: 1.85, color: "var(--text-secondary)", marginBottom: 16 }}>{p}</p>
              ))}
            </div>

            {/* Simulateurs liés */}
            {entry.sims?.length > 0 && (
              <div style={{
                background: "linear-gradient(135deg,rgba(184,147,74,0.1),rgba(232,192,106,0.04))",
                border: "1px solid var(--border-gold)", borderRadius: 16, padding: "20px 24px", margin: "28px 0",
              }}>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 12 }}>
                  Mettre en pratique
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {entry.sims.map(path => (
                    <Link key={path} to={path} style={{
                      padding: "9px 16px", borderRadius: 10,
                      background: "rgba(184,147,74,0.2)", color: "var(--gold)",
                      border: "1px solid var(--border-gold)", textDecoration: "none",
                      fontSize: 13, fontWeight: 500,
                    }}>
                      {simLabel(path)} →
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Ad */}
            <div style={{ margin: "28px 0" }}>
              <AdUnit slot="auto" format="auto" />
            </div>

            {/* Termes liés */}
            {related.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 12 }}>
                  Voir aussi
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {related.map(r => (
                    <Link key={r.slug} to={`/lexique/${r.slug}`} style={{
                      padding: "6px 14px", borderRadius: 20, fontSize: 13,
                      background: "var(--card-bg)", color: "var(--text)",
                      border: "1px solid var(--border)", textDecoration: "none",
                    }}>
                      {r.term}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Articles liés */}
            {relatedArticles.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 12 }}>
                  À lire sur le blog
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  {relatedArticles.map(a => (
                    <Link key={a.slug} to={`/blog/${a.slug}`} style={{
                      display: "block", padding: "12px 16px", borderRadius: 12, textDecoration: "none",
                      background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text)",
                    }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600 }}>{a.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24 }}>
              <Link to="/lexique" style={{
                fontSize: 13, color: "var(--text-secondary)", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                ← Tout le lexique
              </Link>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
