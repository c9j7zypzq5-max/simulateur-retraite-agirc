import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AdUnit from "../components/AdUnit.jsx";
import JsonLd from "../components/JsonLd.jsx";
import { ROUTE_META } from "../../api/_routes.js";
import { COMPARATIFS_BY_SLUG } from "../data/comparatifs.js";
import { GLOSSARY_BY_SLUG } from "../data/glossaire.js";

function simLabel(path) {
  return ROUTE_META[path]?.title || path.replace("/simulateurs/", "").replace(/-/g, " ");
}

const colHead = { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, padding: "12px 14px", textAlign: "left" };
const cell = { fontSize: 14, lineHeight: 1.55, padding: "12px 14px", verticalAlign: "top", borderTop: "1px solid var(--border)", color: "var(--text-secondary)" };

function ProsCons({ title, pour, contre }) {
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 18px" }}>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 12, color: "var(--text)" }}>{title}</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 10px", display: "grid", gap: 6 }}>
        {pour.map((p, i) => <li key={i} style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>✅ {p}</li>)}
      </ul>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
        {contre.map((p, i) => <li key={i} style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>⚠️ {p}</li>)}
      </ul>
    </div>
  );
}

export default function Comparatif() {
  const [theme, setTheme] = useTheme();
  const { slug } = useParams();
  const c = COMPARATIFS_BY_SLUG[slug];

  useEffect(() => {
    if (!c) { document.title = "Comparatif introuvable | simfinly.com"; return; }
    document.title = `${c.title} | simfinly.com`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", c.intro);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = `https://www.simfinly.com/comparatifs/${slug}`;
  }, [c, slug]);

  const terms = c ? c.terms.map(s => GLOSSARY_BY_SLUG[s]).filter(Boolean) : [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}
          <Link to="/comparatifs" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Comparatifs</Link>
          {c && <>{" · "}<span style={{ color: "var(--text)" }}>{c.shortTitle}</span></>}
        </div>

        {!c ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, marginBottom: 12 }}>Comparatif introuvable</h1>
            <Link to="/comparatifs" style={{
              display: "inline-block", padding: "10px 24px", borderRadius: 10,
              background: "rgba(184,147,74,0.15)", color: "var(--gold)",
              border: "1px solid var(--border-gold)", textDecoration: "none", fontSize: 14,
            }}>← Tous les comparatifs</Link>
          </div>
        ) : (
          <>
            <JsonLd data={{
              "@context": "https://schema.org", "@type": "Article",
              "headline": c.title, "description": c.intro,
              "url": `https://www.simfinly.com/comparatifs/${c.slug}`,
              "author": { "@type": "Organization", "name": "simfinly.com", "url": "https://www.simfinly.com" },
              "publisher": { "@type": "Organization", "name": "simfinly.com", "logo": { "@type": "ImageObject", "url": "https://www.simfinly.com/logo-mark.svg" } },
            }} />

            <div style={{ padding: "16px 0 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <span style={{ fontSize: 40 }} aria-hidden="true">{c.emoji}</span>
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px,5vw,38px)", fontWeight: 600, lineHeight: 1.15, color: "var(--text)" }}>
                  {c.title}
                </h1>
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--text-secondary)", borderLeft: "3px solid var(--gold)", paddingLeft: 18 }}>
                {c.intro}
              </p>
            </div>

            {/* Pour / contre côte à côte */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14, marginBottom: 28 }}>
              <ProsCons title={c.a.name} pour={c.a.pour} contre={c.a.contre} />
              <ProsCons title={c.b.name} pour={c.b.pour} contre={c.b.contre} />
            </div>

            {/* Tableau comparatif */}
            <div style={{ marginBottom: 28, overflowX: "auto" }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>Comparaison critère par critère</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
                <thead>
                  <tr style={{ background: "var(--card-bg)" }}>
                    <th style={{ ...colHead, color: "var(--text-secondary)" }}>Critère</th>
                    <th style={{ ...colHead, color: "var(--gold)" }}>{c.a.name}</th>
                    <th style={{ ...colHead, color: "var(--gold)" }}>{c.b.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {c.criteres.map((row, i) => (
                    <tr key={i}>
                      <td style={{ ...cell, color: "var(--text)", fontWeight: 600 }}>{row.label}</td>
                      <td style={cell}>{row.a}</td>
                      <td style={cell}>{row.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sections */}
            {c.sections.map((sec, i) => (
              <section key={i} style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>{sec.h2}</h2>
                {sec.body.map((p, j) => (
                  <p key={j} style={{ fontSize: 15, lineHeight: 1.85, color: "var(--text-secondary)", marginBottom: 14 }}>{p}</p>
                ))}
              </section>
            ))}

            {/* Verdict */}
            <div style={{ background: "rgba(184,147,74,0.1)", border: "1px solid var(--border-gold)", borderRadius: 14, padding: "20px 22px", marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 700, color: "var(--gold)", marginBottom: 10 }}>Notre verdict</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text)" }}>{c.verdict}</p>
            </div>

            {/* Simulateurs liés */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>Faites le calcul</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
                {c.sims.map(path => (
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

            {/* Termes clés */}
            {terms.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>Les termes à connaître</h2>
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

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24 }}>
              <Link to="/comparatifs" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>← Tous les comparatifs</Link>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
