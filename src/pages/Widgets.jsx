import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import EmbedSnippet from "../components/EmbedSnippet.jsx";

const WIDGETS = [
  { path: "/embed/epargne", height: 520, label: "le simulateur d'épargne", title: "Épargne & intérêts composés" },
  { path: "/embed/emprunt", height: 500, label: "le simulateur d'emprunt", title: "Emprunt immobilier" },
  { path: "/embed/fire", height: 560, label: "le simulateur FIRE", title: "Indépendance financière (FIRE)" },
];

export default function Widgets() {
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    document.title = "Widgets gratuits à intégrer | simfinly.com";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Intégrez gratuitement nos simulateurs financiers (épargne, emprunt, FIRE) sur votre site ou blog via un simple code iframe.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com/widgets';
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}<span style={{ color: "var(--text)" }}>Widgets</span>
        </div>

        <div style={{ padding: "12px 0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 36 }}>🧩</span>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px,5vw,40px)", fontWeight: 600, color: "var(--text)" }}>
              Widgets à intégrer
            </h1>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7, maxWidth: 560 }}>
            Ajoutez gratuitement un simulateur interactif sur votre site, blog ou article. Copiez le code, collez-le dans votre page : c'est tout. Un lien vers simfinly.com est inclus.
          </p>
        </div>

        {WIDGETS.map(w => (
          <section key={w.path} style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>{w.title}</h2>
            <div style={{ border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 6, background: "var(--input-bg)" }}>
              <iframe src={w.path} width="100%" height={w.height} style={{ border: "none", display: "block" }} title={`Aperçu — ${w.title}`} loading="lazy" />
            </div>
            <EmbedSnippet path={w.path} height={w.height} label={w.label} />
          </section>
        ))}
      </div>

      <Footer />
    </div>
  );
}
