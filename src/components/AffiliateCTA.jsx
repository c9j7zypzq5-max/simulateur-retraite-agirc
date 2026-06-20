const PARTNERS = {
  retraite: {
    title: "Boostez votre pension avec un PER",
    subtitle: "Réduisez vos impôts aujourd'hui et améliorez votre retraite demain",
    partners: [
      { name: "Linxea Spirit PER", tagline: "0 frais d'entrée · 200+ fonds", url: "https://www.linxea.com/epargne-retraite/per/" },
      { name: "Yomoni Retraite", tagline: "Gestion pilotée · 100 % ETF", url: "https://yomoni.fr/per/" },
      { name: "Ramify PER", tagline: "Profils personnalisés · ESG", url: "https://ramify.fr/per/" },
    ],
  },
  per: {
    title: "Où ouvrir votre PER ?",
    subtitle: "Des contrats sans frais d'entrée pour maximiser l'avantage fiscal",
    partners: [
      { name: "Linxea Spirit PER", tagline: "0 frais entrée · 200+ supports", url: "https://www.linxea.com/epargne-retraite/per/" },
      { name: "Yomoni Retraite", tagline: "Gestion pilotée · ETF", url: "https://yomoni.fr/per/" },
      { name: "Ramify PER", tagline: "Profils personnalisés", url: "https://ramify.fr/per/" },
    ],
  },
  "assurance-vie": {
    title: "Où ouvrir votre assurance-vie ?",
    subtitle: "Des contrats en ligne sans frais d'entrée pour maximiser vos rendements",
    partners: [
      { name: "Linxea Avenir 2", tagline: "0 frais entrée · fonds euros 3,5 %", url: "https://www.linxea.com/assurance-vie/" },
      { name: "Fortuneo Vie", tagline: "Fonds euros compétitif · UC", url: "https://www.fortuneo.fr/assurance-vie" },
      { name: "Boursobank AV", tagline: "Leader digital · large gamme", url: "https://www.boursobank.com/patrimoine/assurance-vie/" },
    ],
  },
  emprunt: {
    title: "Comparez les offres de prêt",
    subtitle: "Trouvez le meilleur taux avec nos courtiers partenaires",
    partners: [
      { name: "Pretto", tagline: "Simulation 3 min · sans engagement", url: "https://www.pretto.fr/" },
      { name: "Meilleurtaux", tagline: "Leader depuis 25 ans · 300 banques", url: "https://www.meilleurtaux.com/credit-immobilier/" },
    ],
  },
  epargne: {
    title: "Investissez facilement",
    subtitle: "Des plateformes reconnues pour débuter ou diversifier votre épargne",
    partners: [
      { name: "Trade Republic", tagline: "ETF · actions · 1 € minimum", url: "https://www.traderepublic.com/fr-fr" },
      { name: "Bourse Direct", tagline: "Courtier français · CTO & PEA", url: "https://www.boursedirect.fr/" },
      { name: "Fortuneo", tagline: "Bourse + AV + livrets · tout-en-un", url: "https://www.fortuneo.fr/" },
    ],
  },
  credit: {
    title: "Comparez les offres de crédit conso",
    subtitle: "Trouvez le meilleur taux pour votre crédit à la consommation",
    partners: [
      { name: "Younited Credit", tagline: "100 % en ligne · réponse immédiate", url: "https://www.younited-credit.com/" },
      { name: "Cofidis", tagline: "Spécialiste crédit depuis 40 ans", url: "https://www.cofidis.fr/" },
      { name: "Cetelem", tagline: "Crédit responsable · BNP Paribas", url: "https://www.cetelem.fr/" },
    ],
  },
};

export default function AffiliateCTA({ type }) {
  const config = PARTNERS[type];
  if (!config) return null;

  return (
    <div style={{
      background: "rgba(43,92,230,0.04)",
      border: "1px solid var(--border-gold)",
      borderRadius: 16,
      padding: "18px 20px",
      margin: "20px 0",
    }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>
          {config.title}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{config.subtitle}</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {config.partners.map(p => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 130px",
              padding: "11px 13px",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              textDecoration: "none",
              transition: "border-color 0.15s, background 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--gold-mid)";
              e.currentTarget.style.background = "rgba(43,92,230,0.05)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.background = "var(--card-bg)";
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{p.name} ↗</span>
            <span style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>{p.tagline}</span>
          </a>
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 10, color: "var(--text-secondary)", opacity: 0.55 }}>
        Liens commerciaux · Simfinly peut percevoir une rémunération si vous souscrivez via ces liens · Cela ne modifie pas notre analyse
      </div>
    </div>
  );
}
