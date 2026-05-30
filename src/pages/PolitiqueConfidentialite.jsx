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

export default function PolitiqueConfidentialite() {
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    const prevTitle = document.title;
    const prevDesc  = document.querySelector('meta[name="description"]')?.getAttribute("content");
    const robotsMeta = document.querySelector('meta[name="robots"]');
    document.title = "Politique de confidentialité — mesimulateurs.fr";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Politique de confidentialité et cookies de mesimulateurs.fr : données collectées, Google AdSense, RGPD.");
    if (robotsMeta) robotsMeta.setAttribute("content", "noindex, follow");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.mesimulateurs.fr' + window.location.pathname;
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
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 600, color: "var(--text)", marginBottom: 16, lineHeight: 1.1 }}>
          Politique de confidentialité
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 48, letterSpacing: "0.03em" }}>
          Dernière mise à jour : 30 mai 2026
        </p>

        <div style={{ display: "grid", gap: 36 }}>
          <Section title="Données collectées">
            <p>
              <strong style={{ color: "var(--text)" }}>Aucune donnée personnelle n'est collectée</strong>{" "}
              lors de l'utilisation de ce site.
            </p>
            <p style={{ marginTop: 14 }}>
              Les informations que vous saisissez dans les simulateurs sont traitées exclusivement dans votre navigateur, en temps réel. Elles ne sont jamais transmises à un serveur, enregistrées dans une base de données ou communiquées à des tiers.
            </p>
            <p style={{ marginTop: 14 }}>
              La seule donnée conservée localement est votre <strong style={{ color: "var(--text)" }}>préférence de thème</strong> (clair / sombre), stockée dans le <code style={{ fontSize: 12, background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 4 }}>localStorage</code> de votre navigateur. Vous pouvez la supprimer à tout moment en vidant les données du site.
            </p>
            <p style={{ marginTop: 14 }}>
              Ce site ne requiert ni inscription, ni création de compte, ni fourniture d'adresse e-mail ou d'identifiant personnel.
            </p>
          </Section>

          <Section title="Cookies et Google AdSense">
            <p>
              Ce site utilise <strong style={{ color: "var(--text)" }}>Google AdSense</strong> (identifiant éditeur : <code style={{ fontSize: 12, background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 4 }}>ca-pub-1297423880558120</code>) pour afficher des publicités.
            </p>
            <p style={{ marginTop: 14 }}>
              Google AdSense peut déposer des <strong style={{ color: "var(--text)" }}>cookies publicitaires tiers</strong> afin de personnaliser les annonces en fonction de votre historique de navigation. Ces cookies ne sont pas indispensables au fonctionnement des simulateurs.
            </p>
            <p style={{ marginTop: 14 }}>
              Vous pouvez refuser ou gérer ces cookies via les paramètres de votre navigateur ou à l'adresse suivante :{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>
                google.com/settings/ads
              </a>.
            </p>
            <p style={{ marginTop: 14 }}>
              Pour en savoir plus sur la façon dont Google utilise ces données, consultez la{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>
                politique de confidentialité de Google
              </a>.
            </p>
            <p style={{ marginTop: 14 }}>
              Aucun cookie analytique (Google Analytics, Matomo, etc.) n'est utilisé sur ce site.
            </p>
          </Section>

          <Section title="Analytics">
            <p>
              Aucun outil d'analytics n'est installé sur ce site. Aucune donnée de navigation (pages visitées, durée de session, origine géographique) n'est collectée ni transmise.
            </p>
          </Section>

          <Section title="Vos droits (RGPD)">
            <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
            <ul style={{ marginTop: 14, paddingLeft: 20, display: "grid", gap: 8 }}>
              <li><strong style={{ color: "var(--text)" }}>Droit d'accès</strong> — obtenir confirmation que des données vous concernant sont traitées ;</li>
              <li><strong style={{ color: "var(--text)" }}>Droit de rectification</strong> — corriger des données inexactes ;</li>
              <li><strong style={{ color: "var(--text)" }}>Droit à l'effacement</strong> — demander la suppression de vos données ;</li>
              <li><strong style={{ color: "var(--text)" }}>Droit d'opposition</strong> — vous opposer au traitement à des fins publicitaires ;</li>
              <li><strong style={{ color: "var(--text)" }}>Droit à la portabilité</strong> — recevoir vos données dans un format structuré.</li>
            </ul>
            <p style={{ marginTop: 14 }}>
              En l'absence de collecte de données personnelles identifiantes, ces droits s'appliquent principalement aux cookies AdSense, que vous pouvez gérer directement auprès de Google.
            </p>
            <p style={{ marginTop: 14 }}>
              Pour exercer vos droits ou pour toute question, contactez :{" "}
              <a href="mailto:adrian.faragofer@gmail.com" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>
                adrian.faragofer@gmail.com
              </a>
            </p>
            <p style={{ marginTop: 14 }}>
              Vous avez également le droit d'introduire une réclamation auprès de la{" "}
              <strong style={{ color: "var(--text)" }}>CNIL</strong> :{" "}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>
                cnil.fr
              </a>.
            </p>
          </Section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
