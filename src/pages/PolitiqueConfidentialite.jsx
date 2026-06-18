import { useEffect } from "react";
import { useTheme } from "../hooks/useTheme.js";
import { useLocale } from "../lib/router.jsx";
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

const code = { fontSize: 12, background: "rgba(255,255,255,0.06)", padding: "1px 5px", borderRadius: 4 };
const linkStyle = { color: "var(--gold-mid)", textDecoration: "none" };

const TXT = {
  fr: {
    docTitle: "Politique de confidentialité — simfinly.com",
    metaDesc: "Politique de confidentialité et cookies de simfinly.com : données collectées, Google AdSense, RGPD.",
    eyebrow: "Légal",
    h1: "Politique de confidentialité",
    updated: "Dernière mise à jour : 30 mai 2026",
  },
  en: {
    docTitle: "Privacy policy — simfinly.com",
    metaDesc: "Privacy and cookie policy for simfinly.com: data collected, Google AdSense, GDPR.",
    eyebrow: "Legal",
    h1: "Privacy policy",
    updated: "Last updated: 30 May 2026",
  },
};

function ContentFr() {
  return (
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
          La seule donnée conservée localement est votre <strong style={{ color: "var(--text)" }}>préférence de thème</strong> (clair / sombre), stockée dans le <code style={code}>localStorage</code> de votre navigateur. Vous pouvez la supprimer à tout moment en vidant les données du site.
        </p>
        <p style={{ marginTop: 14 }}>
          Ce site ne requiert ni inscription, ni création de compte, ni fourniture d'adresse e-mail ou d'identifiant personnel.
        </p>
      </Section>

      <Section title="Cookies et Google AdSense">
        <p>
          Ce site utilise <strong style={{ color: "var(--text)" }}>Google AdSense</strong> (identifiant éditeur : <code style={code}>ca-pub-1297423880558120</code>) pour afficher des publicités.
        </p>
        <p style={{ marginTop: 14 }}>
          Google AdSense peut déposer des <strong style={{ color: "var(--text)" }}>cookies publicitaires tiers</strong> afin de personnaliser les annonces en fonction de votre historique de navigation. Ces cookies ne sont pas indispensables au fonctionnement des simulateurs.
        </p>
        <p style={{ marginTop: 14 }}>
          Vous pouvez refuser ou gérer ces cookies via les paramètres de votre navigateur ou à l'adresse suivante :{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            google.com/settings/ads
          </a>.
        </p>
        <p style={{ marginTop: 14 }}>
          Pour en savoir plus sur la façon dont Google utilise ces données, consultez la{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>
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
          <a href="mailto:adrian.faragofer@gmail.com" style={linkStyle}>
            adrian.faragofer@gmail.com
          </a>
        </p>
        <p style={{ marginTop: 14 }}>
          Vous avez également le droit d'introduire une réclamation auprès de la{" "}
          <strong style={{ color: "var(--text)" }}>CNIL</strong> :{" "}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            cnil.fr
          </a>.
        </p>
      </Section>
    </div>
  );
}

function ContentEn() {
  return (
    <div style={{ display: "grid", gap: 36 }}>
      <Section title="Data collected">
        <p>
          <strong style={{ color: "var(--text)" }}>No personal data is collected</strong>{" "}
          when you use this site.
        </p>
        <p style={{ marginTop: 14 }}>
          The information you enter into the calculators is processed exclusively in your browser, in real time. It is never sent to a server, stored in a database or shared with third parties.
        </p>
        <p style={{ marginTop: 14 }}>
          The only data stored locally is your <strong style={{ color: "var(--text)" }}>theme preference</strong> (light / dark), kept in your browser's <code style={code}>localStorage</code>. You can delete it at any time by clearing the site data.
        </p>
        <p style={{ marginTop: 14 }}>
          This site requires no registration, no account creation and no email address or personal identifier.
        </p>
      </Section>

      <Section title="Cookies and Google AdSense">
        <p>
          This site uses <strong style={{ color: "var(--text)" }}>Google AdSense</strong> (publisher ID: <code style={code}>ca-pub-1297423880558120</code>) to display ads.
        </p>
        <p style={{ marginTop: 14 }}>
          Google AdSense may set <strong style={{ color: "var(--text)" }}>third-party advertising cookies</strong> to personalise ads based on your browsing history. These cookies are not essential to the operation of the calculators.
        </p>
        <p style={{ marginTop: 14 }}>
          You can refuse or manage these cookies through your browser settings or at the following address:{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            google.com/settings/ads
          </a>.
        </p>
        <p style={{ marginTop: 14 }}>
          To learn more about how Google uses this data, see{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            Google's privacy policy
          </a>.
        </p>
        <p style={{ marginTop: 14 }}>
          No analytics cookies (Google Analytics, Matomo, etc.) are used on this site.
        </p>
      </Section>

      <Section title="Analytics">
        <p>
          No analytics tool is installed on this site. No browsing data (pages visited, session duration, geographic origin) is collected or transmitted.
        </p>
      </Section>

      <Section title="Your rights (GDPR)">
        <p>Under the GDPR and applicable data-protection law, you have the following rights:</p>
        <ul style={{ marginTop: 14, paddingLeft: 20, display: "grid", gap: 8 }}>
          <li><strong style={{ color: "var(--text)" }}>Right of access</strong> — obtain confirmation that data concerning you is being processed;</li>
          <li><strong style={{ color: "var(--text)" }}>Right to rectification</strong> — correct inaccurate data;</li>
          <li><strong style={{ color: "var(--text)" }}>Right to erasure</strong> — request the deletion of your data;</li>
          <li><strong style={{ color: "var(--text)" }}>Right to object</strong> — object to processing for advertising purposes;</li>
          <li><strong style={{ color: "var(--text)" }}>Right to portability</strong> — receive your data in a structured format.</li>
        </ul>
        <p style={{ marginTop: 14 }}>
          As no identifying personal data is collected, these rights apply mainly to the AdSense cookies, which you can manage directly with Google.
        </p>
        <p style={{ marginTop: 14 }}>
          To exercise your rights or for any question, contact:{" "}
          <a href="mailto:adrian.faragofer@gmail.com" style={linkStyle}>
            adrian.faragofer@gmail.com
          </a>
        </p>
        <p style={{ marginTop: 14 }}>
          You also have the right to lodge a complaint with the French data-protection authority, the{" "}
          <strong style={{ color: "var(--text)" }}>CNIL</strong>:{" "}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            cnil.fr
          </a>.
        </p>
      </Section>
    </div>
  );
}

export default function PolitiqueConfidentialite() {
  const [theme, setTheme] = useTheme();
  const locale = useLocale();
  const txt = TXT[locale] || TXT.fr;

  useEffect(() => {
    const prevTitle = document.title;
    const prevDesc  = document.querySelector('meta[name="description"]')?.getAttribute("content");
    const robotsMeta = document.querySelector('meta[name="robots"]');
    document.title = txt.docTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", txt.metaDesc);
    if (robotsMeta) robotsMeta.setAttribute("content", "noindex, follow");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    return () => {
      document.title = prevTitle;
      if (prevDesc) document.querySelector('meta[name="description"]')?.setAttribute("content", prevDesc);
      if (robotsMeta) robotsMeta.setAttribute("content", "index, follow");
    };
  }, [txt]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 16px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 28, height: 2, background: "linear-gradient(90deg, var(--gold-mid), var(--gold))" }} />
          <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-mid)" }}>{txt.eyebrow}</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 600, color: "var(--text)", marginBottom: 16, lineHeight: 1.1 }}>
          {txt.h1}
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 48, letterSpacing: "0.03em" }}>
          {txt.updated}
        </p>

        {locale === "en" ? <ContentEn /> : <ContentFr />}
      </div>

      <Footer />
    </div>
  );
}
