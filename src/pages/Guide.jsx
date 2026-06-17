import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AdUnit from "../components/AdUnit.jsx";
import { ROUTE_META } from "../../api/_routes.js";
import { GUIDES_BY_SLUG } from "../data/guides.js";
import { GLOSSARY_BY_SLUG } from "../data/glossaire.js";

function simLabel(path) {
  return ROUTE_META[path]?.title || path.replace("/simulateurs/", "").replace(/-/g, " ");
}

export default function Guide() {
  const [theme, setTheme] = useTheme();
  const { slug } = useParams();
  const guide = GUIDES_BY_SLUG[slug];
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!guide) { document.title = "Guide introuvable | simfinly.com"; return; }
    document.title = `${guide.title} — guide complet | simfinly.com`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", guide.intro);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = `https://www.simfinly.com/guides/${slug}`;
  }, [guide, slug]);

  useEffect(() => {
    if (!guide) { setArticles([]); return; }
    let alive = true;
    fetch('/api/articles')
      .then(r => r.json())
      .then(data => {
        if (!alive) return;
        const list = Array.isArray(data) ? data.filter(a => guide.blogCats.includes(a.category)).slice(0, 3) : [];
        setArticles(list);
      })
      .catch(() => setArticles([]));
    return () => { alive = false; };
  }, [guide]);

  const terms = guide ? guide.terms.map(s => GLOSSARY_BY_SLUG[s]).filter(Boolean) : [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}
          <Link to="/guides" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Guides</Link>
          {guide && <>{" · "}<span style={{ color: "var(--text)" }}>{guide.title}</span></>}
        </div>

        {!guide ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, marginBottom: 12 }}>Guide introuvable</h1>
            <Link to="/guides" style={{
              display: "inline-block", padding: "10px 24px", borderRadius: 10,
              background: "rgba(184,147,74,0.15)", color: "var(--gold)",
              border: "1px solid var(--border-gold)", textDecoration: "none", fontSize: 14,
            }}>← Tous les guides</Link>
          </div>
        ) : (
          <>
            <div style={{ padding: "16px 0 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <span style={{ fontSize: 40 }} aria-hidden="true">{guide.emoji}</span>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,5vw,42px)", fontWeight: 600, lineHeight: 1.15, color: "var(--text)" }}>
                  {guide.title}
                </h1>
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--text-secondary)", borderLeft: "3px solid var(--gold)", paddingLeft: 18 }}>
                {guide.intro}
              </p>
            </div>

            {/* Simulateurs du guide */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>Les simulateurs de ce guide</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
                {guide.sims.map(path => (
                  <Link key={path} to={path} style={{
                    display: "block", padding: "14px 16px", borderRadius: 12, textDecoration: "none",
                    background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text)",
                    fontSize: 14, fontWeight: 500, transition: "border-color 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-gold)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                  >
                    {simLabel(path)} →
                  </Link>
                ))}
              </div>
            </div>

            {/* Sections de contenu */}
            {guide.sections.map((sec, i) => (
              <section key={i} style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>{sec.h2}</h2>
                {sec.body.map((p, j) => (
                  <p key={j} style={{ fontSize: 15, lineHeight: 1.85, color: "var(--text-secondary)", marginBottom: 14 }}>{p}</p>
                ))}
              </section>
            ))}

            {/* Termes clés */}
            {terms.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>Les termes à connaître</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {terms.map(t => (
                    <Link key={t.slug} to={`/lexique/${t.slug}`} title={t.short} style={{
                      padding: "8px 14px", borderRadius: 20, textDecoration: "none",
                      background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 13,
                    }}>
                      {t.term}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div style={{ margin: "28px 0" }}>
              <AdUnit slot="auto" format="auto" />
            </div>

            {/* Articles liés */}
            {articles.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>À lire sur le blog</h2>
                <div style={{ display: "grid", gap: 10 }}>
                  {articles.map(a => (
                    <Link key={a.slug} to={`/blog/${a.slug}`} style={{
                      display: "block", padding: "14px 16px", borderRadius: 12, textDecoration: "none",
                      background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text)",
                    }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600 }}>{a.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24 }}>
              <Link to="/guides" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>← Tous les guides</Link>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
