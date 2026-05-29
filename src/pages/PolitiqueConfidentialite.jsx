import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";

function Section({ title, children }) {
  return (
    <div style={{ paddingLeft: 20, borderLeft: "2px solid rgba(184,147,74,0.25)" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#e8c06a", marginBottom: 16 }}>{title}</h2>
      <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.85 }}>{children}</div>
    </div>
  );
}

export default function PolitiqueConfidentialite() {
  useEffect(() => {
    const prevTitle = document.title;
    const prevDesc  = document.querySelector('meta[name="description"]')?.getAttribute("content");
    const robotsMeta = document.querySelector('meta[name="robots"]');
    document.title = "Politique de confidentialité — mesimulateurs.fr";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Politique de confidentialité de mesimulateurs.fr — données collectées, cookies, RGPD, droits des utilisateurs.");
    if (robotsMeta) robotsMeta.setAttribute("content", "noindex, follow");
    return () => {
      document.title = prevTitle;
      if (prevDesc) document.querySelector('meta[name="description"]')?.setAttribute("content", prevDesc);
      if (robotsMeta) robotsMeta.setAttribute("content", "index, follow");
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#060e1c", fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0", padding: "0 16px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 0 60px" }}>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b", textDecoration: "none", marginBottom: 40, letterSpacing: "0.04em" }}>
          ← Retour au simulateur
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 28, height: 2, background: "linear-gradient(90deg,#b8934a,#e8c06a)" }} />
          <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#b8934a" }}>Légal</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 600, color: "#f1e4c3", marginBottom: 16, lineHeight: 1.1 }}>
          Politique de confidentialité
        </h1>
        <p style={{ fontSize: 13, color: "#475569", marginBottom: 48, letterSpacing: "0.03em" }}>
          Dernière mise à jour : mai 2026
        </p>

        <div style={{ display: "grid", gap: 36 }}>
          <Section title="Données collectées">
            <p>
              <strong style={{ color: "#e2e8f0" }}>Aucune donnée personnelle n'est collectée</strong>{" "}
              lors de l'utilisation du simulateur.
            </p>
            <p style={{ marginTop: 14 }}>
              Les informations que vous saisissez (salaire, années de cotisation) sont traitées exclusivement dans votre navigateur, en temps réel. Elles ne sont jamais transmises à un serveur, enregistrées dans une base de données ou communiquées à des tiers.
            </p>
            <p style={{ marginTop: 14 }}>
              Ce site ne requiert ni inscription, ni création de compte, ni fourniture d'adresse e-mail ou d'identifiant personnel.
            </p>
          </Section>

          <Section title="Cookies et traceurs">
            <p>Ce site utilise un nombre minimal de cookies :</p>
            <ul style={{ marginTop: 14, paddingLeft: 20, display: "grid", gap: 14 }}>
              <li>
                <strong style={{ color: "#e2e8f0" }}>Cookies techniques (Vercel)</strong> — indispensables au fonctionnement de l'hébergement (sécurité, routage). Ces cookies ne permettent pas de vous identifier personnellement.
              </li>
              <li>
                <strong style={{ color: "#e2e8f0" }}>Cookies publicitaires Google AdSense</strong> (le cas échéant) — si des annonces sont affichées, Google AdSense peut déposer des cookies pour personnaliser les publicités en fonction de votre historique de navigation. Vous pouvez gérer vos préférences sur{" "}
                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "#b8934a", textDecoration: "none" }}>
                  adssettings.google.com
                </a>.
              </li>
            </ul>
            <p style={{ marginTop: 14 }}>
              Aucun cookie analytique (Google Analytics, Matomo, etc.) n'est utilisé sur ce site.
            </p>
          </Section>

          <Section title="Finalités du traitement">
            <p>Les seules finalités de traitement sur ce site sont :</p>
            <ul style={{ marginTop: 14, paddingLeft: 20, display: "grid", gap: 8 }}>
              <li>Le calcul en temps réel de la simulation de retraite (traitement local, sans transmission) ;</li>
              <li>L'affichage éventuel de publicités via Google AdSense ;</li>
              <li>La sécurité et la disponibilité du service (hébergement Vercel).</li>
            </ul>
          </Section>

          <Section title="Base légale (RGPD)">
            <p>
              En l'absence de collecte de données personnelles identifiantes, la plupart des obligations du RGPD ne s'appliquent pas directement à ce site.
            </p>
            <p style={{ marginTop: 14 }}>
              Si des cookies publicitaires sont utilisés (Google AdSense), leur dépôt repose sur votre{" "}
              <strong style={{ color: "#e2e8f0" }}>consentement</strong> (article 6(1)(a) du RGPD), que vous pouvez retirer à tout moment via les paramètres de votre navigateur ou{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "#b8934a", textDecoration: "none" }}>
                adssettings.google.com
              </a>.
            </p>
          </Section>

          <Section title="Vos droits">
            <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
            <ul style={{ marginTop: 14, paddingLeft: 20, display: "grid", gap: 8 }}>
              <li><strong style={{ color: "#e2e8f0" }}>Droit d'accès</strong> — obtenir confirmation que des données vous concernant sont traitées ;</li>
              <li><strong style={{ color: "#e2e8f0" }}>Droit de rectification</strong> — corriger des données inexactes ;</li>
              <li><strong style={{ color: "#e2e8f0" }}>Droit à l'effacement</strong> — demander la suppression de vos données ;</li>
              <li><strong style={{ color: "#e2e8f0" }}>Droit d'opposition</strong> — vous opposer au traitement à des fins publicitaires ;</li>
              <li><strong style={{ color: "#e2e8f0" }}>Droit à la portabilité</strong> — recevoir vos données dans un format structuré.</li>
            </ul>
            <p style={{ marginTop: 14 }}>
              Compte tenu de l'absence de collecte de données personnelles, ces droits sont de portée limitée en pratique. Vous pouvez exercer vos droits liés aux cookies AdSense directement auprès de Google.
            </p>
          </Section>

          <Section title="Contact et réclamation">
            <p>Pour toute question relative à cette politique ou à l'exercice de vos droits :</p>
            <p style={{ marginTop: 14 }}>
              <strong style={{ color: "#e2e8f0" }}>Adrian Farago</strong><br />
              <a href="mailto:contact@mesimulateurs.fr" style={{ color: "#b8934a", textDecoration: "none" }}>
                contact@mesimulateurs.fr
              </a>
            </p>
            <p style={{ marginTop: 14 }}>
              Vous avez également le droit d'introduire une réclamation auprès de la{" "}
              <strong style={{ color: "#e2e8f0" }}>CNIL</strong> :{" "}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: "#b8934a", textDecoration: "none" }}>
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
