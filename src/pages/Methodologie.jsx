import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

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
      "Nous nous appuyons sur les sources officielles : service-public.fr, l'URSSAF, l'Agirc-Arrco, la CNAV, la Banque de France (taux d'usure), la DGFiP (barèmes fiscaux) et les textes réglementaires (décrets, lois de finances). Les données de marché du comparateur d'actifs proviennent de Yahoo Finance.",
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

  const today = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(new Date());

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}<span style={{ color: "var(--text)" }}>Méthodologie</span>
        </div>

        <div style={{ padding: "16px 0 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <span style={{ fontSize: 36 }}>🔬</span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px,5vw,40px)", fontWeight: 600, color: "var(--text)" }}>
              Méthodologie & sources
            </h1>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>Dernière mise à jour : {today}</p>
        </div>

        {SECTIONS.map((sec, i) => (
          <section key={i} style={{ marginBottom: 22 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>{sec.h2}</h2>
            {sec.body.map((p, j) => (
              <p key={j} style={{ fontSize: 15, lineHeight: 1.85, color: "var(--text-secondary)", marginBottom: 14 }}>{p}</p>
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
