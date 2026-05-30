import { useEffect } from "react";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function Section({ title, children }) {
  return (
    <div style={{ paddingLeft: 20, borderLeft: "2px solid var(--border-gold)" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "var(--gold)", marginBottom: 16 }}>{title}</h2>
      <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85 }}>{children}</div>
    </div>
  );
}

export default function MentionsLegales() {
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    const prevTitle = document.title;
    const prevDesc  = document.querySelector('meta[name="description"]')?.getAttribute("content");
    const robotsMeta = document.querySelector('meta[name="robots"]');
    document.title = "Mentions légales — mesimulateurs.fr";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Mentions légales de mesimulateurs.fr — éditeur, hébergeur, propriété intellectuelle, responsabilité.");
    if (robotsMeta) robotsMeta.setAttribute("content", "noindex, follow");
    return () => {
      document.title = prevTitle;
      if (prevDesc) document.querySelector('meta[name="description"]')?.setAttribute("content", prevDesc);
      if (robotsMeta) robotsMeta.setAttribute("content", "index, follow");
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 16px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 28, height: 2, background: "linear-gradient(90deg, var(--gold-mid), var(--gold))" }} />
          <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-mid)" }}>Légal</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 600, color: "var(--text)", marginBottom: 48, lineHeight: 1.1 }}>
          Mentions légales
        </h1>

        <div style={{ display: "grid", gap: 36 }}>
          <Section title="Éditeur du site">
            <p>Ce site est édité à titre personnel et non commercial par :</p>
            <p style={{ marginTop: 14 }}>
              <strong style={{ color: "var(--text)" }}>Adrian Farago</strong><br />
              Particulier — site non commercial<br />
              Contact :{" "}
              <a href="mailto:adrian.faragofer@gmail.com" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>
                adrian.faragofer@gmail.com
              </a>
            </p>
            <p style={{ marginTop: 14 }}>
              Ce site est fourni gratuitement. Il n'est affilié à aucun organisme de retraite, conseiller financier ou assureur.
            </p>
          </Section>

          <Section title="Hébergeur">
            <p>
              <strong style={{ color: "var(--text)" }}>Vercel Inc.</strong><br />
              340 Pine Street Suite 701<br />
              San Francisco, CA 94104 — États-Unis<br />
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>
                vercel.com
              </a>
            </p>
          </Section>

          <Section title="Propriété intellectuelle">
            <p>
              L'ensemble du contenu de ce site (textes, design, code source) est la propriété d'Adrian Farago, sauf mention contraire, et est protégé par le droit d'auteur français et les conventions internationales.
            </p>
            <p style={{ marginTop: 14 }}>
              Toute reproduction, représentation, modification ou exploitation partielle ou totale du contenu, par quelque procédé que ce soit, est interdite sans autorisation préalable écrite.
            </p>
          </Section>

          <Section title="Responsabilité">
            <p>
              Les simulations proposées sur ce site sont des <strong style={{ color: "var(--text)" }}>estimations indicatives</strong> et ne constituent en aucun cas des conseils financiers, fiscaux ou juridiques personnalisés.
            </p>
            <p style={{ marginTop: 14 }}>
              L'éditeur s'efforce de maintenir les informations à jour et exactes, mais ne peut garantir l'exactitude, l'exhaustivité ou l'actualité des données présentées. En cas de doute, reportez-vous aux sources officielles.
            </p>
            <p style={{ marginTop: 14 }}>
              L'éditeur ne pourra être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce site ou de l'interprétation de ses résultats.
            </p>
          </Section>

          <Section title="Liens externes">
            <p>
              Ce site peut contenir des liens hypertextes vers des sites tiers. Ces liens sont fournis à titre informatif uniquement.
            </p>
            <p style={{ marginTop: 14 }}>
              L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur disponibilité ou leurs pratiques en matière de données personnelles.
            </p>
          </Section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
