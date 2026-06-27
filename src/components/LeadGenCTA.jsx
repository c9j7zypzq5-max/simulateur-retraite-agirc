import { Link } from "react-router-dom";

const CONFIGS = {
  retraite: {
    icon: "🎯",
    title: "Besoin d'un avis personnalisé ?",
    body: "Un simulateur donne des estimations. Un conseiller en gestion de patrimoine analyse votre situation complète : carrière, épargne, fiscalité.",
    cta: "Découvrir nos conseillers partenaires →",
    href: "/pro-conseiller",
  },
  patrimoine: {
    icon: "🏦",
    title: "Préparez votre stratégie patrimoniale",
    body: "PER, assurance-vie, immobilier locatif : optimiser la combinaison demande un regard professionnel sur votre situation fiscale et vos objectifs.",
    cta: "Parler à un conseiller →",
    href: "/pro-conseiller",
  },
};

export default function LeadGenCTA({ type = "retraite" }) {
  const cfg = CONFIGS[type] || CONFIGS.retraite;
  return (
    <div style={{
      display: "flex",
      gap: 16,
      alignItems: "flex-start",
      background: "var(--primary-soft)",
      border: "1px solid var(--border-gold)",
      borderRadius: 14,
      padding: "18px 20px",
      margin: "20px 0",
    }}>
      <span style={{ fontSize: 26, flexShrink: 0 }}>{cfg.icon}</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 5 }}>{cfg.title}</div>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 10px" }}>{cfg.body}</p>
        <Link to={cfg.href} style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)", textDecoration: "none" }}>
          {cfg.cta}
        </Link>
      </div>
    </div>
  );
}
