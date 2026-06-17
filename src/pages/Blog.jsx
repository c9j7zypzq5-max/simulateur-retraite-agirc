import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const CATEGORY_COLORS = {
  "FIRE":        { bg: "rgba(239,68,68,0.1)",    color: "#ef4444",   border: "rgba(239,68,68,0.25)" },
  "Épargne":     { bg: "rgba(34,197,94,0.1)",    color: "#22c55e",   border: "rgba(34,197,94,0.25)" },
  "Retraite":    { bg: "rgba(99,102,241,0.1)",   color: "#818cf8",   border: "rgba(99,102,241,0.25)" },
  "Immobilier":  { bg: "rgba(168,85,247,0.1)",   color: "#a855f7",   border: "rgba(168,85,247,0.25)" },
  "Fiscalité":   { bg: "rgba(249,115,22,0.1)",   color: "#f97316",   border: "rgba(249,115,22,0.25)" },
  "Budget":      { bg: "rgba(20,184,166,0.1)",   color: "#14b8a6",   border: "rgba(20,184,166,0.25)" },
};

function CategoryBadge({ category }) {
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

function ArticleCard({ article }) {
  const [hovered, setHovered] = useState(false);
  const date = article.publishedAt
    ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(article.publishedAt))
    : "";

  return (
    <Link
      to={`/blog/${article.slug}`}
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
      {article.image && (
        <img
          src={article.image}
          alt=""
          loading="lazy"
          style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 10, marginBottom: 16, display: "block" }}
        />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 10 }}>
        <CategoryBadge category={article.category} />
        <span style={{ fontSize: 11, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
          {article.readTime} min
        </span>
      </div>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(17px,2.5vw,20px)",
        fontWeight: 600, color: "var(--text)", lineHeight: 1.3, marginBottom: 12,
      }}>
        {article.title}
      </h2>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>
        {article.intro}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{date}</span>
        <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 500 }}>
          Lire →
        </span>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
      {[80, 200, 140, 60].map((w, i) => (
        <div key={i} style={{
          height: i === 1 ? 22 : 12, width: `${w}%`.replace("%", "px"),
          background: "var(--border)", borderRadius: 6, marginBottom: i === 1 ? 12 : 10,
          animation: "pulse 1.5s ease-in-out infinite",
        }} />
      ))}
    </div>
  );
}

export default function Blog() {
  const [theme, setTheme] = useTheme();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCat, setActiveCat] = useState("Tous");

  useEffect(() => {
    document.title = "Blog — Finances personnelles | simfinly.com";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Articles et guides sur l'épargne, le FIRE, la retraite, l'immobilier et la fiscalité en France. Rédigés pour vous aider à prendre de meilleures décisions financières.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com/blog';
  }, []);

  useEffect(() => {
    fetch('/api/articles')
      .then(r => r.json())
      .then(data => { setArticles(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError("Impossible de charger les articles."); setLoading(false); });
  }, []);

  // Tri par date décroissante (le plus récent d'abord), indépendamment de la catégorie.
  const sorted = [...articles].sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
  const cats = ["Tous", ...Array.from(new Set(sorted.map(a => a.category).filter(Boolean)))];
  const shown = activeCat === "Tous" ? sorted : sorted.filter(a => a.category === activeCat);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 80px" }}>

        {/* Header */}
        <div style={{ padding: "44px 0 32px", animation: "fadeUp .5s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 36, height: 2, background: "linear-gradient(90deg,var(--gold-mid),var(--gold))" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-mid)" }}>
              Blog · Finances personnelles
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 36 }}>📰</span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px,5vw,42px)", fontWeight: 600, color: "var(--text)" }}>
              Articles & Guides
            </h1>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7, maxWidth: 520 }}>
            Épargne, FIRE, retraite, immobilier, fiscalité — des articles pratiques pour progresser dans votre vie financière.
          </p>
        </div>

        {/* Filtre par catégorie (tri par date conservé à l'intérieur) */}
        {!loading && !error && articles.length > 0 && cats.length > 2 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }} role="tablist" aria-label="Filtrer par catégorie">
            {cats.map(c => {
              const active = activeCat === c;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  aria-pressed={active}
                  style={{
                    padding: "7px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    background: active ? "rgba(184,147,74,0.15)" : "var(--card-bg)",
                    color: active ? "var(--gold)" : "var(--text-secondary)",
                    border: `1px solid ${active ? "var(--border-gold)" : "var(--border)"}`,
                    transition: "border-color 0.2s, color 0.2s, background 0.2s",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        )}

        {/* Contenu */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)", fontSize: 14 }}>
            {error}
          </div>
        ) : articles.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "var(--text)", marginBottom: 12 }}>
              Aucun article pour l'instant
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
              Le premier article sera publié très prochainement.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 20 }}>
            {shown.map(a => <ArticleCard key={a.slug} article={a} />)}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
