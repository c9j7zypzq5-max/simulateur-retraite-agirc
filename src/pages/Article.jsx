import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AdUnit from "../components/AdUnit.jsx";

const CATEGORY_COLORS = {
  "FIRE":        { bg: "rgba(239,68,68,0.1)",   color: "#ef4444",   border: "rgba(239,68,68,0.25)" },
  "Épargne":     { bg: "rgba(34,197,94,0.1)",   color: "#22c55e",   border: "rgba(34,197,94,0.25)" },
  "Retraite":    { bg: "rgba(99,102,241,0.1)",  color: "#818cf8",   border: "rgba(99,102,241,0.25)" },
  "Immobilier":  { bg: "rgba(168,85,247,0.1)",  color: "#a855f7",   border: "rgba(168,85,247,0.25)" },
  "Fiscalité":   { bg: "rgba(249,115,22,0.1)",  color: "#f97316",   border: "rgba(249,115,22,0.25)" },
  "Budget":      { bg: "rgba(20,184,166,0.1)",  color: "#14b8a6",   border: "rgba(20,184,166,0.25)" },
};

const CATEGORY_SIMULATEURS = {
  "FIRE":       { label: "Simulateur FIRE",               path: "/simulateurs/fire" },
  "Épargne":    { label: "Simulateur Épargne",            path: "/simulateurs/epargne" },
  "Retraite":   { label: "Simulateur Agirc-Arrco",        path: "/simulateurs/agirc-arrco" },
  "Immobilier": { label: "Simulateur Emprunt immobilier", path: "/simulateurs/emprunt-immobilier" },
  "Fiscalité":  { label: "Simulateur Impôt sur le revenu",path: "/simulateurs/impot-revenu" },
  "Budget":     { label: "Simulateur Budget 50/30/20",    path: "/simulateurs/budget" },
};

const PROSE_CSS = `
  .article-prose h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(18px, 3vw, 22px);
    font-weight: 600;
    color: var(--text);
    margin: 32px 0 12px;
    line-height: 1.3;
  }
  .article-prose p {
    font-size: 15px;
    line-height: 1.85;
    color: var(--text-secondary);
    margin-bottom: 16px;
  }
  .article-prose strong {
    color: var(--text);
    font-weight: 600;
  }
  .article-prose ul {
    margin: 0 0 18px 0;
    padding-left: 20px;
  }
  .article-prose li {
    font-size: 15px;
    line-height: 1.75;
    color: var(--text-secondary);
    margin-bottom: 6px;
  }
  .article-prose em {
    color: var(--text);
    font-style: italic;
  }
`;

export default function Article() {
  const [theme, setTheme] = useTheme();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    fetch(`/api/article?slug=${encodeURIComponent(slug)}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then(data => {
        if (!data) return;
        setArticle(data);
        setLoading(false);
        // SEO
        document.title = `${data.title} | mesimulateurs.fr`;
        document.querySelector('meta[name="description"]')?.setAttribute("content", data.intro || "");
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
        link.href = `https://www.mesimulateurs.fr/blog/${slug}`;
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  const categoryStyle = article ? (CATEGORY_COLORS[article.category] || CATEGORY_COLORS["Budget"]) : null;
  const relatedSim = article ? CATEGORY_SIMULATEURS[article.category] : null;

  const date = article?.publishedAt
    ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(article.publishedAt))
    : "";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <style>{PROSE_CSS}</style>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 80px" }}>

        {/* Fil d'Ariane */}
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}
          <Link to="/blog" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Blog</Link>
          {article && <>{" · "}<span style={{ color: "var(--text)" }}>{article.category}</span></>}
        </div>

        {/* Chargement */}
        {loading && (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <div style={{
              width: 36, height: 36, border: "3px solid var(--border)",
              borderTopColor: "var(--gold)", borderRadius: "50%",
              animation: "spin 0.8s linear infinite", margin: "0 auto",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* 404 */}
        {!loading && notFound && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, marginBottom: 12 }}>Article introuvable</h1>
            <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Cet article n'existe pas ou a été supprimé.</p>
            <Link to="/blog" style={{
              display: "inline-block", padding: "10px 24px", borderRadius: 10,
              background: "rgba(184,147,74,0.15)", color: "var(--gold)",
              border: "1px solid var(--border-gold)", textDecoration: "none", fontSize: 14,
            }}>← Retour au blog</Link>
          </div>
        )}

        {/* Article */}
        {!loading && article && (
          <>
            {/* En-tête */}
            <div style={{ padding: "20px 0 36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 12,
                  letterSpacing: "0.06em",
                  background: categoryStyle.bg, color: categoryStyle.color, border: `1px solid ${categoryStyle.border}`,
                }}>
                  {article.category}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{date}</span>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>· {article.readTime} min de lecture</span>
              </div>

              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px,5vw,42px)",
                fontWeight: 600, lineHeight: 1.2, color: "var(--text)", marginBottom: 20,
              }}>
                {article.title}
              </h1>

              <p style={{
                fontSize: 16, lineHeight: 1.75, color: "var(--text-secondary)",
                borderLeft: "3px solid var(--gold)", paddingLeft: 18,
              }}>
                {article.intro}
              </p>
            </div>

            {/* Image d'illustration (libre de droits) */}
            {article.image && (
              <figure style={{ margin: "0 0 32px" }}>
                <img
                  src={article.image}
                  alt={article.imageAlt || article.title}
                  loading="lazy"
                  style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 16, display: "block", border: "1px solid var(--border)" }}
                />
                {article.imageCredit && (
                  <figcaption style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 6, textAlign: "right" }}>
                    {article.imageCredit}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Contenu */}
            <div
              className="article-prose"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Ad */}
            <div style={{ margin: "32px 0" }}>
              <AdUnit slot="auto" format="auto" />
            </div>

            {/* CTA simulateur lié */}
            {relatedSim && (
              <div style={{
                background: "linear-gradient(135deg,rgba(184,147,74,0.1),rgba(232,192,106,0.04))",
                border: "1px solid var(--border-gold)", borderRadius: 16, padding: "24px 28px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 16, flexWrap: "wrap", marginBottom: 32,
              }}>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 6 }}>
                    Passez à la pratique
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)" }}>
                    {relatedSim.label}
                  </div>
                </div>
                <Link to={relatedSim.path} style={{
                  padding: "10px 24px", borderRadius: 10, flexShrink: 0,
                  background: "rgba(184,147,74,0.2)", color: "var(--gold)",
                  border: "1px solid var(--border-gold)", textDecoration: "none",
                  fontSize: 13, fontWeight: 500,
                }}>
                  Lancer le simulateur →
                </Link>
              </div>
            )}

            {/* Navigation */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24 }}>
              <Link to="/blog" style={{
                fontSize: 13, color: "var(--text-secondary)", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                ← Tous les articles
              </Link>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
