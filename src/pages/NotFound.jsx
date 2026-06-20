import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const POPULAR = [
  { to: "/simulateurs/agirc-arrco", label: "Retraite Agirc-Arrco" },
  { to: "/simulateurs/emprunt-immobilier", label: "Emprunt immobilier" },
  { to: "/simulateurs/impot-revenu", label: "Impôt sur le revenu" },
  { to: "/simulateurs/epargne", label: "Épargne & intérêts composés" },
  { to: "/simulateurs/fire", label: "Indépendance financière (FIRE)" },
];

export default function NotFound() {
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    document.title = "Page introuvable (404) | simfinly.com";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, follow');
    return () => robots && robots.setAttribute('content', 'index, follow');
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 16px 80px", textAlign: "center" }}>
        <div style={{ fontSize: 64, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>404</div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px,5vw,34px)", fontWeight: 600, color: "var(--text)", margin: "12px 0 10px" }}>
          Cette page n'existe pas
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7, marginBottom: 28, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          Le lien est peut-être erroné ou la page a été déplacée. Retrouvez votre chemin parmi nos 25 simulateurs gratuits.
        </p>

        <Link to="/" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, background: "rgba(184,147,74,0.15)", color: "var(--gold)", border: "1px solid var(--border-gold)", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>
          ← Retour à l'accueil
        </Link>

        <div style={{ marginTop: 40, textAlign: "left" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 14, textAlign: "center" }}>
            Simulateurs populaires
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
            {POPULAR.map(p => (
              <Link key={p.to} to={p.to} style={{ display: "block", padding: "12px 16px", borderRadius: 12, textDecoration: "none", background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14 }}>
                {p.label} →
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 18, textAlign: "center", fontSize: 13, color: "var(--text-secondary)" }}>
            ou consultez le <Link to="/lexique" style={{ color: "var(--gold)", textDecoration: "none" }}>lexique</Link>, les <Link to="/guides" style={{ color: "var(--gold)", textDecoration: "none" }}>guides</Link> et le <Link to="/blog" style={{ color: "var(--gold)", textDecoration: "none" }}>blog</Link>.
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
