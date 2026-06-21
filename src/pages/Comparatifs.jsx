import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AdUnit from "../components/AdUnit.jsx";
import { COMPARATIFS } from "../data/comparatifs.js";

const DESC = "Comparatifs financiers : PER ou assurance-vie, louer ou acheter, freelance ou salarié… Des comparaisons claires, critère par critère, reliées à nos simulateurs gratuits.";

export default function Comparatifs() {
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    document.title = "Comparatifs financiers — PER vs assurance-vie, louer ou acheter… | simfinly.com";
    document.querySelector('meta[name="description"]')?.setAttribute("content", DESC);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = "https://www.simfinly.com/comparatifs";
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}
          <span style={{ color: "var(--text)" }}>Comparatifs</span>
        </div>

        <div style={{ padding: "16px 0 24px" }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px,5vw,42px)", fontWeight: 600, lineHeight: 1.15, color: "var(--text)", marginBottom: 16 }}>
            Comparatifs financiers
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--text-secondary)", borderLeft: "3px solid var(--gold)", paddingLeft: 18 }}>
            {DESC}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
          {COMPARATIFS.map(c => (
            <Link key={c.slug} to={`/comparatifs/${c.slug}`} style={{
              display: "block", padding: "20px", borderRadius: 16, textDecoration: "none",
              background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)",
              boxShadow: "var(--card-shadow)", transition: "border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-gold)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }} aria-hidden="true">{c.emoji}</div>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 6 }}>{c.category}</div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 8, lineHeight: 1.25 }}>{c.title}</h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{c.intro.slice(0, 120)}…</p>
            </Link>
          ))}
        </div>

        <div style={{ margin: "32px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
