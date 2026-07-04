import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

// Date de dernière révision des barèmes affichés sur le site — à mettre à jour
// MANUELLEMENT à chaque révision de barème (PASS, IR, Agirc-Arrco, calendrier
// retraite...). Ne pas utiliser new Date() ici : cela affichait la date du
// jour de consultation, pas une vraie date de révision.
const DERNIERE_REVISION = "juillet 2026";

const SECTIONS = [
  {
    h2: "Notre objectif",
    body: [
      "simfinly.com propose des estimations claires et instantanées sur des sujets de finances personnelles : retraite, immobilier, impôts, épargne et indépendance financière. Tous les calculs sont effectués localement dans votre navigateur : aucune donnée saisie n'est envoyée sur nos serveurs.",
    ],
  },
  {
    h2: "Comment sont calculées les estimations",
    body: [
      "Chaque simulateur applique les formules et barèmes publics en vigueur (barème de l'impôt sur le revenu, valeur du point Agirc-Arrco, plafonds de la Sécurité sociale, règles du HCSF pour le crédit, abattements de plus-value, etc.).",
      "Les projections de long terme (épargne, FIRE, retraite) reposent sur des hypothèses que vous choisissez (rendement, inflation, durée). Une projection n'est pas une prévision : elle illustre l'effet de vos paramètres.",
    ],
  },
  {
    h2: "Sources",
    body: [
      "Nous nous appuyons exclusivement sur des sources officielles, citées ci-dessous pour vérification directe :",
    ],
    links: [
      { href: "https://www.service-public.fr", label: "service-public.fr" },
      { href: "https://www.urssaf.fr", label: "URSSAF" },
      { href: "https://www.agirc-arrco.fr", label: "Agirc-Arrco" },
      { href: "https://www.lassuranceretraite.fr", label: "L'Assurance Retraite (CNAV)" },
      { href: "https://www.banque-france.fr", label: "Banque de France (taux d'usure)" },
      { href: "https://www.impots.gouv.fr", label: "impots.gouv.fr / DGFiP (barèmes fiscaux)" },
      { href: "https://www.legifrance.gouv.fr", label: "Légifrance (décrets, lois de finances)" },
    ],
    bodyAfter: [
      "Les données de marché historiques du comparateur d'actifs et de la simulation Monte Carlo (FIRE) proviennent de Yahoo Finance et de séries longues du S&P 500 (1928-2024, Robert Shiller / Aswath Damodaran).",
    ],
  },
  {
    h2: "Qui écrit ces contenus",
    body: [
      "simfinly.com est un projet indépendant, sans rédaction financière tierce : les formules et barèmes de chaque simulateur sont codés directement à partir des textes réglementaires et des barèmes publiés par les organismes cités ci-dessus, puis testés par des scénarios de calcul automatisés (voir la section Vérification) pour détecter toute incohérence entre simulateurs traitant le même sujet.",
      "Nous ne sommes ni conseillers en gestion de patrimoine, ni experts-comptables, ni avocats fiscalistes. Le site ne remplace pas un avis professionnel personnalisé.",
    ],
  },
  {
    h2: "Vérification et cohérence des calculs",
    body: [
      "Chaque barème sensible (plafond de la Sécurité sociale, durée d'assurance requise par génération, taux de décote/surcote, barème de l'impôt sur le revenu) est centralisé dans un module unique partagé par tous les simulateurs concernés, plutôt que dupliqué : cela évite qu'un même paramètre affiche des valeurs différentes selon l'outil consulté.",
      "Une suite de tests automatisés s'exécute à chaque mise à jour du site pour vérifier que les valeurs affichées correspondent aux barèmes en vigueur et qu'aucune ancienne valeur périmée ne subsiste dans le code.",
    ],
  },
  {
    h2: "Mises à jour",
    body: [
      "Les barèmes sont révisés à chaque évolution réglementaire (généralement en début d'année et lors des lois de finances). Les simulateurs affichent l'année de référence des paramètres utilisés.",
    ],
  },
  {
    h2: "Limites et avertissement",
    body: [
      "Les résultats sont fournis à titre indicatif et pédagogique. Ils ne constituent ni un conseil personnalisé, ni un document contractuel, ni une offre. Pour une décision importante (achat immobilier, départ en retraite, placement), rapprochez-vous d'un professionnel ou de l'organisme compétent.",
    ],
  },
];

export default function Methodologie() {
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    document.title = "Méthodologie & sources | simfinly.com";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Comment simfinly.com calcule ses estimations : formules, barèmes officiels, sources (service-public, URSSAF, Agirc-Arrco, DGFiP…), mises à jour et limites.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com/methodologie';
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}<span style={{ color: "var(--text)" }}>Méthodologie</span>
        </div>

        <div style={{ padding: "16px 0 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <span style={{ fontSize: 36 }}>🔬</span>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px,5vw,40px)", fontWeight: 600, color: "var(--text)" }}>
              Méthodologie & sources
            </h1>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>Dernière mise à jour : {DERNIERE_REVISION}</p>
        </div>

        {SECTIONS.map((sec, i) => (
          <section key={i} style={{ marginBottom: 22 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>{sec.h2}</h2>
            {sec.body.map((p, j) => (
              <p key={j} style={{ fontSize: 15, lineHeight: 1.85, color: "var(--text-secondary)", marginBottom: 14 }}>{p}</p>
            ))}
            {sec.links && (
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 14px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                {sec.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer nofollow" style={{ fontSize: 13, color: "var(--gold)", textDecoration: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", display: "inline-block" }}>
                      {l.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {sec.bodyAfter && sec.bodyAfter.map((p, j) => (
              <p key={`after-${j}`} style={{ fontSize: 15, lineHeight: 1.85, color: "var(--text-secondary)", marginBottom: 14 }}>{p}</p>
            ))}
          </section>
        ))}

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24 }}>
          <Link to="/" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>← Retour à l'accueil</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
