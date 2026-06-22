import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useLocale } from "../lib/router.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

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

function ArticleImageHeader({ article, height = 120 }) {
  const gradient = CAT_GRADIENTS[article?.category] || "linear-gradient(135deg,var(--primary-soft),var(--border-gold))";
  if (article?.image) {
    return (
      <img
        src={article.image}
        alt={article?.imageAlt || article?.title || ""}
        loading="lazy"
        style={{ width: "100%", height, objectFit: "cover", display: "block" }}
      />
    );
  }
  return <div style={{ height, background: gradient }} />;
}

function FeaturedArticle({ article }) {
  const [hovered, setHovered] = useState(false);
  const { locale } = useLocale();
  const isEn = locale === "en";
  const catStyle = CAT_COLORS[article.category] || { color: "var(--primary)", bg: "var(--primary-soft)", border: "var(--border-gold)" };
  const date = article.publishedAt
    ? new Intl.DateTimeFormat(isEn ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(article.publishedAt))
    : "";

  return (
    <Link
      to={`/blog/${article.slug}`}
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
      {/* Mobile: image on top */}
      <div className="featured-img-mobile">
        <div style={{ height: 160, background: `linear-gradient(135deg,var(--primary),#5B8CFF)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {article.image
            ? <img src={article.image} alt="" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
            : <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          }
        </div>
        <div style={{ padding: "20px 24px" }}>
          <span style={{ display: "inline-block", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", color: catStyle.color, background: catStyle.bg, border: `1px solid ${catStyle.border}`, padding: "3px 9px", borderRadius: 20, marginBottom: 12 }}>
            {isEn ? "Featured" : "À la une"}{article.category ? ` · ${article.category}` : ""}
          </span>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(18px,3vw,27px)", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--text)", margin: "0 0 10px", lineHeight: 1.2 }}>
            {article.title}
          </h2>
          {article.intro && (
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--text-secondary)", margin: "0 0 16px" }}>{article.intro}</p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "var(--text-secondary)", flexWrap: "wrap" }}>
            {date && <span>{date}</span>}
            {date && article.readTime && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--border)", display: "inline-block" }} />}
            {article.readTime && <span>{article.readTime} min</span>}
            <span style={{ marginLeft: "auto", color: "var(--primary)", fontWeight: 600 }}>{isEn ? "Read →" : "Lire →"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article }) {
  const [hovered, setHovered] = useState(false);
  const { locale } = useLocale();
  return (
    <Link
      to={`/blog/${article.slug}`}
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
      <ArticleImageHeader article={article} height={120} />
      <div style={{ padding: "16px 18px" }}>
        <div style={{ marginBottom: 8 }}>
          <CategoryBadge category={article.category} />
        </div>
        <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(15px,2vw,16.5px)", fontWeight: 600, color: "var(--text)", margin: "0 0 8px", lineHeight: 1.3 }}>
          {article.title}
        </h3>
        <div style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
          {article.readTime ? `${article.readTime} min ${locale === "en" ? "read" : "de lecture"}` : ""}
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ height: 120, background: "var(--border)" }} />
      <div style={{ padding: "16px 18px" }}>
        {[60, 140, 80].map((w, i) => (
          <div key={i} style={{ height: i === 1 ? 18 : 11, width: w, background: "var(--border)", borderRadius: 6, marginBottom: 10 }} />
        ))}
      </div>
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

  const sorted = [...articles].sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
  const cats = ["Tous", ...Array.from(new Set(sorted.map(a => a.category).filter(Boolean)))];
  const shown = activeCat === "Tous" ? sorted : sorted.filter(a => a.category === activeCat);
  const [featured, ...rest] = shown;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk',sans-serif", color: "var(--text)" }}>
      <style>{`
        .featured-img-mobile { display: flex; flex-direction: column; }
        @media (min-width: 680px) {
          .featured-img-mobile { flex-direction: row; }
          .featured-img-mobile > div:first-child { width: 280px; height: 100% !important; flex-shrink: 0; min-height: 200px; }
          .featured-img-mobile > div:last-child { flex: 1; }
        }
        .blog-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        @media (max-width: 840px) { .blog-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 540px) { .blog-grid { grid-template-columns: 1fr; } }
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
        {!loading && !error && cats.length > 2 && (
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

        {/* Content */}
        {loading ? (
          <div className="blog-grid">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)", fontSize: 14 }}>{error}</div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, color: "var(--text)", marginBottom: 12 }}>Aucun article pour l'instant</h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>Le premier article sera publié très prochainement.</p>
          </div>
        ) : (
          <>
            {featured && <FeaturedArticle article={featured} />}
            {rest.length > 0 && (
              <div className="blog-grid">
                {rest.map(a => <ArticleCard key={a.slug} article={a} />)}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
