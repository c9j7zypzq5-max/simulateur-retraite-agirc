import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import JsonLd from "../components/JsonLd.jsx";
import { useTheme } from "../hooks/useTheme.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { METIERS_LIST } from "../data/metiers.js";

const TOP_REGIMES = [
  { label: "Salarié du privé", desc: "CNAV + Agirc-Arrco", slugs: ["ingenieur-cadre", "chauffeur-routier", "caissiere", "ouvrier-usine"] },
  { label: "Fonctionnaire", desc: "SRE / CNRACL", slugs: ["fonctionnaire", "enseignant", "policier", "militaire", "gendarme", "pompier", "aide-soignante", "magistrat", "diplomate"] },
  { label: "Profession libérale", desc: "CNAVPL + caisse spécifique", slugs: ["medecin-liberal", "avocat", "pharmacien", "chirurgien-dentiste", "sage-femme", "veterinaire", "notaire", "expert-comptable", "architecte"] },
  { label: "Travailleur indépendant", desc: "SSI (anciennement RSI)", slugs: ["artisan", "commercant", "chef-entreprise", "auto-entrepreneur"] },
  { label: "Cas particuliers", desc: "Régimes spécifiques", slugs: ["agriculteur", "intermittent", "expatrie", "infirmiere"] },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Retraite par métier 2026 — 30 professions",
  "description": "Guides complets sur la retraite selon votre profession : médecin, fonctionnaire, avocat, militaire, auto-entrepreneur… Calculs, règles et simulateurs.",
  "url": "https://www.simfinly.com/retraite",
  "hasPart": METIERS_LIST.map(m => ({
    "@type": "Article",
    "name": m.title,
    "url": `https://www.simfinly.com/retraite/${m.slug}`,
  })),
};

export default function RetraiteIndex() {
  const [theme, setTheme] = useTheme();

  usePageMeta(
    "Retraite par métier 2026 — 30 professions, règles et calculs | simfinly.com",
    "Calculez votre retraite selon votre profession : médecin libéral, fonctionnaire, avocat, militaire, auto-entrepreneur… 30 guides complets avec simulateur gratuit."
  );

  const bySlug = Object.fromEntries(METIERS_LIST.map(m => [m.slug, m]));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <JsonLd data={JSON_LD} />
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>Accueil</Link>
          <span style={{ margin: "0 6px" }}>/</span>
          <span>Retraite par métier</span>
        </div>

        {/* Header */}
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 16, color: "var(--text)" }}>
          Retraite par métier 2026
        </h1>
        <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 700, marginBottom: 48 }}>
          Chaque profession a ses propres règles : régime de base, caisse complémentaire, âge de départ, taux de liquidation.
          Retrouvez ici nos 30 guides complets avec simulateur intégré pour calculer votre future pension.
        </p>

        {/* Par régime */}
        {TOP_REGIMES.map(regime => {
          const metiers = regime.slugs.map(s => bySlug[s]).filter(Boolean);
          if (!metiers.length) return null;
          return (
            <div key={regime.label} style={{ marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>
                  {regime.label}
                </h2>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{regime.desc}</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 12 }}>
                {metiers.map(m => (
                  <Link
                    key={m.slug}
                    to={`/retraite/${m.slug}`}
                    style={{
                      textDecoration: "none",
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      padding: "16px 18px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                      color: "var(--text)",
                      transition: "border-color 0.18s, box-shadow 0.18s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(43,92,230,0.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <span style={{ fontSize: 26, flexShrink: 0, lineHeight: 1 }}>{m.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, lineHeight: 1.3, marginBottom: 3 }}>{m.title}</div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>{m.subtitle}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* CTA simulateur */}
        <div style={{ marginTop: 40, padding: "24px 28px", background: "var(--primary-soft)", borderRadius: 14, border: "1px solid rgba(43,92,230,0.15)" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.05rem", fontWeight: 700, marginBottom: 8 }}>
            Besoin d'une estimation rapide tous régimes ?
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16 }}>
            Notre simulateur synthèse additionne toutes vos pensions (CNAV, Agirc-Arrco, indépendants…) en quelques clics.
          </p>
          <Link
            to="/simulateurs/synthese-retraite"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "var(--primary)", color: "#fff", borderRadius: 9, textDecoration: "none", fontWeight: 600, fontSize: 14 }}
          >
            Simulateur synthèse retraite →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
