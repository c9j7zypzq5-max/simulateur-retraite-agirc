import { useEffect } from "react";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function Section({ title, children }) {
  return (
    <div style={{ paddingLeft: 20, borderLeft: "2px solid var(--border-gold)", marginBottom: 40 }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "var(--gold)", marginBottom: 16 }}>{title}</h2>
      <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85 }}>{children}</div>
    </div>
  );
}

export default function APropos() {
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    document.title = "À propos — mesimulateurs.fr";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Découvrez mesimulateurs.fr : des outils de simulation financière gratuits, transparents et sans inscription pour vos décisions retraite, immobilier et fiscalité.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.mesimulateurs.fr/a-propos';
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 80px" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 700, lineHeight: 1.2, color: "var(--text)", marginBottom: 48 }}>
          À propos de <em style={{ fontStyle: "italic", color: "var(--gold)" }}>mesimulateurs.fr</em>
        </h1>

        <Section title="Notre mission">
          <p>mesimulateurs.fr propose des outils de simulation financière <strong style={{ color: "var(--text)" }}>gratuits, transparents et sans inscription</strong>. Pas de création de compte, pas de publicité intrusive, pas de collecte de données personnelles.</p>
          <p style={{ marginTop: 12 }}>Tous les calculs s'effectuent directement dans votre navigateur. Aucune donnée n'est transmise à nos serveurs : vos informations restent sur votre appareil.</p>
        </Section>

        <Section title="Qui sommes-nous ?">
          <p>Un projet indépendant créé pour rendre accessibles des calculs souvent complexes — retraite, immobilier, fiscalité, épargne, liberté financière. Ces sujets touchent tout le monde, mais les simulateurs officiels sont souvent opaques ou difficiles à utiliser.</p>
          <p style={{ marginTop: 12 }}>Notre objectif : des outils pédagogiques qui expliquent la logique derrière chaque résultat, pas seulement un chiffre.</p>
        </Section>

        <Section title="Nos simulateurs">
          <p style={{ marginBottom: 16 }}>Le site compte actuellement <strong style={{ color: "var(--text)" }}>16 simulateurs</strong> répartis en 4 catégories :</p>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { cat: "Retraite", count: 8, desc: "CNAV, Agirc-Arrco, Fonction publique, Indépendants, IRCANTEC, Retraite progressive, CIPAV, MSA" },
              { cat: "Immobilier", count: 2, desc: "Emprunt immobilier, Rendement locatif" },
              { cat: "Impôts", count: 2, desc: "Impôt sur le revenu, Plus-value immobilière" },
              { cat: "Finances & Vie", count: 4, desc: "Épargne & intérêts composés, FIRE, Le vrai prix en heures, Ma vie en semaines" },
            ].map(({ cat, count, desc }) => (
              <li key={cat} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px" }}>
                <span style={{ fontWeight: 600, color: "var(--text)" }}>{cat}</span>
                <span style={{ color: "var(--gold)", fontWeight: 500, marginLeft: 8, fontSize: 13 }}>{count} simulateurs</span>
                <span style={{ display: "block", fontSize: 12, marginTop: 4, color: "var(--text-secondary)" }}>{desc}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Contact">
          <p>Pour toute question, suggestion ou signalement d'erreur :</p>
          <a href="mailto:adrian.faragofer@gmail.com" style={{ color: "var(--gold)", fontWeight: 500, textDecoration: "none", display: "inline-block", marginTop: 8 }}>
            adrian.faragofer@gmail.com
          </a>
        </Section>

        <Section title="Technologies">
          <p>Le site est construit avec <strong style={{ color: "var(--text)" }}>React / Vite</strong>, hébergé sur <strong style={{ color: "var(--text)" }}>Vercel</strong>. Le code source est open source.</p>
          <p style={{ marginTop: 12 }}>Les simulations sont des estimations à titre indicatif. Elles ne constituent pas un conseil financier ou juridique.</p>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
