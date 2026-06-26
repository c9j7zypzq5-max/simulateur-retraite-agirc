import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useLocale } from "../lib/router.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AdUnit from "../components/AdUnit.jsx";
import SimRecommendations from "../components/SimRecommendations.jsx";
import { GUIDES } from "../data/guides.js";
import { autolinkTermsHtml } from "../utils/autolinkTerms.js";
import DOMPurify from "dompurify";

const CATEGORY_COLORS = {
  "FIRE":        { bg: "rgba(239,68,68,0.1)",   color: "#ef4444",   border: "rgba(239,68,68,0.25)" },
  "Épargne":     { bg: "rgba(34,197,94,0.1)",   color: "#22c55e",   border: "rgba(34,197,94,0.25)" },
  "Retraite":    { bg: "rgba(99,102,241,0.1)",  color: "#818cf8",   border: "rgba(99,102,241,0.25)" },
  "Immobilier":  { bg: "rgba(168,85,247,0.1)",  color: "#a855f7",   border: "rgba(168,85,247,0.25)" },
  "Fiscalité":   { bg: "rgba(249,115,22,0.1)",  color: "#f97316",   border: "rgba(249,115,22,0.25)" },
  "Budget":      { bg: "rgba(20,184,166,0.1)",  color: "#14b8a6",   border: "rgba(20,184,166,0.25)" },
};

const CATEGORY_RECOMMENDATIONS = {
  "Retraite": [
    { icon: "🏛", label: "CNAV — régime général",        description: "Estimez votre pension de base",           to: "/simulateurs/cnav",               cta: "Simuler →" },
    { icon: "🏦", label: "Agirc-Arrco",                  description: "Votre retraite complémentaire salariés",  to: "/simulateurs/agirc-arrco",        cta: "Simuler →" },
    { icon: "💼", label: "Plan Épargne Retraite (PER)",  description: "Déduction fiscale + capital projeté",     to: "/simulateurs/per",                cta: "Simuler →" },
  ],
  "FIRE": [
    { icon: "🔥", label: "Indépendance financière",      description: "Règle des 25x et taux de retrait 4 %",   to: "/simulateurs/fire",               cta: "Simuler →" },
    { icon: "📈", label: "Épargne & intérêts composés",  description: "Projeter votre capital long terme",       to: "/simulateurs/epargne",            cta: "Simuler →" },
    { icon: "🌐", label: "Patrimoine global",            description: "Vision consolidée de vos actifs nets",    to: "/simulateurs/patrimoine",         cta: "Simuler →" },
  ],
  "Épargne": [
    { icon: "📈", label: "Épargne & intérêts composés",  description: "Capitalisation et versements programmés", to: "/simulateurs/epargne",            cta: "Simuler →" },
    { icon: "🛡️", label: "Assurance-vie",                description: "Rendement, fiscalité et succession",      to: "/simulateurs/assurance-vie",      cta: "Simuler →" },
    { icon: "🌐", label: "Comparateur d'actifs",         description: "ETF, actions, crypto comparés",           to: "/simulateurs/comparateur",        cta: "Simuler →" },
  ],
  "Immobilier": [
    { icon: "🏠", label: "Emprunt immobilier",           description: "Mensualités, capacité et coût total",     to: "/simulateurs/emprunt-immobilier", cta: "Simuler →" },
    { icon: "🏘️", label: "Rendement locatif",            description: "Rentabilité brute et nette",              to: "/simulateurs/rendement-locatif",  cta: "Simuler →" },
    { icon: "🏡", label: "Prêt à Taux Zéro (PTZ)",      description: "PTZ primo-accédant 2026",                 to: "/simulateurs/ptz",                cta: "Simuler →" },
  ],
  "Fiscalité": [
    { icon: "📊", label: "Impôt sur le revenu",          description: "TMI, taux moyen et niches fiscales",      to: "/simulateurs/impot-revenu",       cta: "Simuler →" },
    { icon: "📉", label: "Déficit foncier",              description: "Économie d'impôt sur les travaux",        to: "/simulateurs/deficit-foncier",    cta: "Simuler →" },
    { icon: "🏛️", label: "Droits de succession",         description: "Barème officiel et abattements 2026",     to: "/simulateurs/succession",         cta: "Simuler →" },
  ],
  "Budget": [
    { icon: "📋", label: "Budget 50/30/20",              description: "Répartition et épargne mensuelle",        to: "/simulateurs/budget",             cta: "Simuler →" },
    { icon: "💵", label: "Salaire Net/Brut & Carrière",  description: "Projection et pouvoir d'achat",           to: "/simulateurs/salaire",            cta: "Simuler →" },
    { icon: "💳", label: "Crédit conso",                 description: "Mensualité et coût total réel",           to: "/simulateurs/credit-conso",       cta: "Simuler →" },
  ],
};

const PROSE_CSS = `
  .article-prose h2 {
    font-family: 'Space Grotesk', sans-serif;
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
  .article-prose a.term-link {
    color: var(--gold);
    text-decoration: none;
    border-bottom: 1px dotted var(--border-gold);
    cursor: pointer;
  }
  .article-prose a.term-link:hover {
    border-bottom-style: solid;
  }
`;

export default function Article() {
  const [theme, setTheme] = useTheme();
  const { locale } = useLocale();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    fetch(`/api/article?slug=${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then(r => {
        clearTimeout(timer);
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then(data => {
        if (!data) return;
        setArticle(data);
        setLoading(false);
        // SEO
        document.title = `${data.title} | simfinly.com`;
        document.querySelector('meta[name="description"]')?.setAttribute("content", data.intro || "");
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
        link.href = `https://www.simfinly.com/blog/${slug}`;
        // Article JSON-LD for Google Discover
        document.getElementById('article-jsonld')?.remove();
        const ld = {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.title,
          description: data.intro || '',
          datePublished: data.publishedAt,
          dateModified: data.updatedAt || data.publishedAt,
          author: { '@type': 'Organization', name: 'Simfinly', url: 'https://www.simfinly.com' },
          publisher: { '@type': 'Organization', name: 'Simfinly', url: 'https://www.simfinly.com', logo: { '@type': 'ImageObject', url: 'https://www.simfinly.com/og-image.webp' } },
          image: data.image || `https://www.simfinly.com/og-image.webp`,
          mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.simfinly.com/blog/${slug}` },
        };
        const s = document.createElement('script');
        s.id = 'article-jsonld';
        s.type = 'application/ld+json';
        s.textContent = JSON.stringify(ld);
        document.head.appendChild(s);
      })
      .catch(() => { clearTimeout(timer); setNotFound(true); setLoading(false); });
    return () => { clearTimeout(timer); controller.abort(); document.getElementById('article-jsonld')?.remove(); };
  }, [slug]);

  const categoryStyle = article ? (CATEGORY_COLORS[article.category] || CATEGORY_COLORS["Budget"]) : null;
  const relatedRecs = article ? (CATEGORY_RECOMMENDATIONS[article.category] || null) : null;
  const relatedGuide = article ? (GUIDES.find(g => g.category === article.category) || null) : null;

  // Contenu enrichi : les termes connus (TAEG, PER, FIRE…) sont auto-liés vers le lexique.
  // Le HTML provient d'articles générés/stockés : on l'assainit avec DOMPurify
  // avant injection pour neutraliser tout script ou attribut malveillant (XSS).
  const contentHtml = useMemo(
    () => DOMPurify.sanitize(autolinkTermsHtml(article?.content || ""), { ADD_ATTR: ["target"] }),
    [article?.content]
  );

  // Les liens injectés (/lexique/…, /simulateurs/…) sont de simples <a> : on
  // intercepte le clic pour naviguer en SPA plutôt que recharger toute la page.
  const onContentClick = (e) => {
    const a = e.target.closest?.("a");
    if (!a) return;
    const href = a.getAttribute("href");
    if (href && href.startsWith("/")) {
      e.preventDefault();
      navigate(href);
    }
  };

  const date = article?.publishedAt
    ? new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(article.publishedAt))
    : "";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
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
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, marginBottom: 12 }}>Article introuvable</h1>
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
                fontFamily: "'Space Grotesk', sans-serif",
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
              onClick={onContentClick}
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* Ad */}
            <div style={{ margin: "32px 0" }}>
              <AdUnit slot="auto" format="auto" />
            </div>

            {/* Simulateurs liés */}
            {relatedRecs && (
              <div style={{ marginBottom: 32 }}>
                <SimRecommendations items={relatedRecs} />
              </div>
            )}

            {/* Lien vers le guide thématique */}
            {relatedGuide && (
              <Link to={`/guides/${relatedGuide.slug}`} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 20px", borderRadius: 12, textDecoration: "none",
                background: "var(--card-bg)", border: "1px solid var(--border)",
                gap: 12, marginBottom: 32,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <div>
                  <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 4 }}>Guide complet</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{relatedGuide.title} →</div>
                </div>
              </Link>
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
