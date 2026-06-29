import { useParams, Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import JsonLd from "../components/JsonLd.jsx";
import { FaqSection } from "../components/ui.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { METIERS, METIERS_LIST } from "../data/metiers.js";


function ProfessionStats({ stats }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, margin: "24px 0" }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 22, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "var(--primary)", marginBottom: 4 }}>{s.value}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{s.label}</div>
          <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>{s.note}</div>
        </div>
      ))}
    </div>
  );
}

function ProfessionSection({ title, content }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(17px, 3vw, 21px)", fontWeight: 600, color: "var(--text)", marginBottom: 14, lineHeight: 1.3 }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, lineHeight: 1.85, color: "var(--text-secondary)" }}>
        {content.split("\n").map((line, i) => {
          if (!line.trim()) return <br key={i} />;
          // Bold markdown
          const parts = line.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p key={i} style={{ marginBottom: 10 }}>
              {parts.map((part, j) =>
                part.startsWith("**") ? <strong key={j} style={{ color: "var(--text)" }}>{part.slice(2, -2)}</strong> : part
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default function RetraiteMetier() {
  const { metier } = useParams();
  const [theme, setTheme] = useTheme();
  const data = METIERS[metier];

  usePageMeta(
    data ? data.metaTitle : "Retraite par métier — simfinly.com",
    data ? data.metaDesc : "Guides retraite par métier : fonctionnaire, infirmière, enseignant, agriculteur."
  );

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
        <Navbar theme={theme} setTheme={setTheme} />
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28 }}>Profession introuvable</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Ce guide métier n'existe pas encore.</p>
          <Link to="/" style={{ color: "var(--gold)", textDecoration: "none" }}>← Accueil</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const canonicalUrl = `https://www.simfinly.com/retraite/${metier}`;
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.metaTitle,
    description: data.metaDesc,
    url: canonicalUrl,
    author: { "@type": "Organization", name: "Simfinly", url: "https://www.simfinly.com" },
    publisher: { "@type": "Organization", name: "Simfinly", url: "https://www.simfinly.com", logo: { "@type": "ImageObject", url: "https://www.simfinly.com/og-image.webp" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.simfinly.com/" },
      { "@type": "ListItem", position: 2, name: "Retraite par métier", item: "https://www.simfinly.com/retraite/fonctionnaire" },
      { "@type": "ListItem", position: 3, name: data.title },
    ],
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <JsonLd data={faqLd} />
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
      <Navbar theme={theme} setTheme={setTheme} />

      <main id="main-content" style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px 80px" }}>
        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}
          <span style={{ color: "var(--text)" }}>Retraite par métier</span>
          {" · "}
          <span style={{ color: "var(--text)" }}>{data.title}</span>
        </nav>

        {/* En-tête */}
        <div style={{ padding: "20px 0 8px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(184,147,74,0.1)", border: "1px solid rgba(184,147,74,0.25)", borderRadius: 20, padding: "4px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: 15 }}>{data.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--gold)", letterSpacing: "0.07em" }}>GUIDE RETRAITE · 2026</span>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 600, color: "var(--text)", lineHeight: 1.2, marginBottom: 10 }}>
            {data.title}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 8 }}>{data.subtitle}</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-secondary)", borderLeft: "3px solid var(--gold)", paddingLeft: 16, margin: "16px 0 0" }}>
            {data.intro}
          </p>
        </div>

        {/* Stats clés */}
        <ProfessionStats stats={data.stats} />

        {/* CTA simulateur */}
        <div style={{ background: "linear-gradient(135deg,rgba(184,147,74,0.1),rgba(232,192,106,0.04))", border: "1px solid var(--border-gold)", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 4 }}>Passez à la pratique</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--text)" }}>{data.simulateurLabel}</div>
          </div>
          <Link to={data.simulateurPath} style={{ padding: "10px 22px", borderRadius: 10, flexShrink: 0, background: "rgba(184,147,74,0.2)", color: "var(--gold)", border: "1px solid var(--border-gold)", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
            Lancer le simulateur →
          </Link>
        </div>

        {/* Sections de contenu */}
        {data.sections.map((s, i) => (
          <ProfessionSection key={i} title={s.title} content={s.content} />
        ))}

        {/* FAQ */}
        <div style={{ marginTop: 8 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>
            Questions fréquentes
          </h2>
          <FaqSection items={data.faq} />
        </div>

        {/* Liens vers d'autres métiers */}
        <div style={{ marginTop: 40, padding: "20px 24px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>Autres guides retraite par métier</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {METIERS_LIST.filter(m => m.slug !== metier).slice(0, 12).map(m => (
              <Link key={m.slug} to={`/retraite/${m.slug}`} style={{ fontSize: 13, color: "var(--gold)", textDecoration: "none", padding: "6px 14px", borderRadius: 20, border: "1px solid var(--border-gold)", background: "rgba(184,147,74,0.07)" }}>
                {m.icon} {m.title}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
