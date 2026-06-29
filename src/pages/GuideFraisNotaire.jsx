import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import JsonLd from "../components/JsonLd.jsx";

const BASE = "https://www.simfinly.com";

const STATS = [
  { value: "7–8 %", label: "Taux ancien (existant)", note: "Du prix de vente pour les biens anciens" },
  { value: "2–3 %", label: "Taux neuf", note: "Pour les logements neufs (< 5 ans)" },
  { value: "5,80 %", label: "Droits de mutation", note: "Principal poste (taxe collectivités)" },
  { value: "1 %", label: "Honoraires notaire", note: "Environ 1 % du prix pour un bien > 150 k€" },
];

const FAQ = [
  {
    q: "Qui paie les frais de notaire, l'acheteur ou le vendeur ?",
    a: "En France, c'est l'acheteur qui paie les frais de notaire lors d'une transaction immobilière. Le vendeur paye uniquement ses propres honoraires de négociation si l'agent immobilier est mandaté par lui (ce qui est le cas dans la plupart des ventes). Les frais de notaire représentent un surcoût de 7–8 % pour un bien ancien.",
  },
  {
    q: "Peut-on négocier les frais de notaire ?",
    a: "Les droits de mutation (environ 5,80 % du prix) sont fixés par la loi et ne se négocient pas. Les émoluments du notaire (sa rémunération) sont réglementés par décret — ils sont donc identiques chez tous les notaires pour un même prix. Seuls les débours (frais de dossier, hypothèque, etc.) peuvent marginalement varier. En pratique, les frais de notaire ne se négocient pas.",
  },
  {
    q: "Comment réduire les frais de notaire lors d'un achat ?",
    a: "Principales stratégies légales : (1) Acheter dans le neuf (TVA remplace les droits de mutation, frais réduits à 2–3 %) ; (2) Distinguer le prix du bien des meubles inclus — les meubles (cuisine équipée, électroménager) peuvent être facturés séparément et ne sont pas soumis aux droits de mutation ; (3) Ne pas inclure les frais d'agence dans le prix de vente — si le mandat est de l'acheteur, ces frais n'entrent pas dans l'assiette des droits.",
  },
  {
    q: "Les frais de notaire sont-ils déductibles des impôts ?",
    a: "Non, pour une résidence principale. Pour un investissement locatif en régime réel, les frais de notaire sont déductibles des revenus fonciers l'année du paiement, ou intégrés à la valeur du bien et amortis en LMNP. En SCI à l'IS, ils sont amortissables sur la durée du bien.",
  },
  {
    q: "Quels sont les frais de notaire pour un bien à 300 000 € ?",
    a: "Pour un bien ancien à 300 000 €, les frais de notaire sont d'environ 22 000–24 000 € (7,5–8 %). Décomposés : droits de mutation ≈ 17 400 €, émoluments notaire ≈ 2 800 €, contribution de sécurité immobilière ≈ 1 050 €, débours divers ≈ 750 €. Utilisez le simulateur frais de notaire de simfinly pour un calcul exact.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Frais de notaire 2026 : taux, calcul et simulateur gratuit",
    description: "Comprendre les frais de notaire en 2026 : taux 7–8 % (ancien) vs 2–3 % (neuf), décomposition des postes, moyens légaux de les réduire et simulateur de calcul.",
    author: { "@type": "Organization", name: "Simfinly", url: BASE },
    publisher: { "@type": "Organization", name: "Simfinly", logo: { "@type": "ImageObject", url: `${BASE}/logo-mark.svg` } },
    url: `${BASE}/immobilier/frais-notaire`,
    datePublished: "2026-02-05",
    dateModified: "2026-06-01",
    inLanguage: "fr-FR",
    mainEntityOfPage: `${BASE}/immobilier/frais-notaire`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
      { "@type": "ListItem", position: 2, name: "Simulateurs immobilier", item: `${BASE}/simulateurs/frais-notaire` },
      { "@type": "ListItem", position: 3, name: "Frais de notaire 2026", item: `${BASE}/immobilier/frais-notaire` },
    ],
  },
];

const EXEMPLES = [
  ["100 000 €", "8 100 €", "3 000 €"],
  ["150 000 €", "11 800 €", "4 300 €"],
  ["200 000 €", "15 500 €", "5 600 €"],
  ["250 000 €", "19 200 €", "6 800 €"],
  ["300 000 €", "22 900 €", "8 100 €"],
  ["400 000 €", "30 400 €", "10 700 €"],
  ["500 000 €", "37 800 €", "13 300 €"],
];

export default function GuideFraisNotaire() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.title = "Frais de notaire 2026 — taux, calcul et simulateur | simfinly";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Tout savoir sur les frais de notaire en 2026 : taux 7–8 % (ancien) ou 2–3 % (neuf), décomposition des postes, comment les réduire légalement. Simulateur gratuit.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = `${BASE}/immobilier/frais-notaire`;
  }, []);

  const s = {
    page: { minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" },
    wrap: { maxWidth: 820, margin: "0 auto", padding: "0 20px 80px" },
    breadcrumb: { display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: "var(--text-secondary)", padding: "20px 0 0", flexWrap: "wrap" },
    hero: { padding: "32px 0 24px" },
    badge: { display: "inline-block", background: "#ede9fe", color: "#7c3aed", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 14 },
    h1: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px,4.5vw,36px)", fontWeight: 700, lineHeight: 1.2, color: "var(--text)", margin: "0 0 14px", letterSpacing: "-0.02em" },
    sub: { fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 28px" },
    cta: { display: "inline-flex", alignItems: "center", gap: 8, background: "var(--primary)", color: "#fff", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 600, textDecoration: "none", marginBottom: 36, boxShadow: "0 2px 12px rgba(43,92,230,.25)" },
    stats: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 40 },
    stat: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" },
    statVal: { fontSize: 22, fontWeight: 700, color: "var(--primary)", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 },
    statLabel: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 },
    statNote: { fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 },
    h2: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(18px,3vw,22px)", fontWeight: 600, color: "var(--text)", margin: "36px 0 14px", lineHeight: 1.3 },
    body: { fontSize: 15, lineHeight: 1.85, color: "var(--text-secondary)" },
    table: { width: "100%", borderCollapse: "collapse", margin: "20px 0", fontSize: 14 },
    th: { background: "#ede9fe", color: "#7c3aed", fontWeight: 600, padding: "10px 16px", textAlign: "left", borderBottom: "2px solid #ddd6fe" },
    td: { padding: "10px 16px", borderBottom: "1px solid var(--border)", color: "var(--text)" },
    infoBox: { background: "var(--positive-soft)", border: "1px solid var(--positive)", borderRadius: 10, padding: "14px 20px", margin: "16px 0", fontSize: 14, color: "var(--text)", lineHeight: 1.7 },
    formula: { background: "var(--primary-soft)", border: "1px solid var(--border-gold)", borderRadius: 10, padding: "14px 20px", fontWeight: 600, color: "var(--text)", margin: "16px 0" },
    faqSection: { marginTop: 48 },
    faqH2: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(18px,3vw,22px)", fontWeight: 600, color: "var(--text)", marginBottom: 20 },
    faqItem: { borderBottom: "1px solid var(--border)", padding: "20px 0" },
    faqQ: { fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 10 },
    faqA: { fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 },
    ctaBox: { background: "var(--primary-soft)", border: "1px solid var(--border-gold)", borderRadius: 14, padding: "28px 32px", marginTop: 48, textAlign: "center" },
    ctaBoxTitle: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 10 },
    ctaBoxSub: { fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 },
  };

  return (
    <div style={s.page}>
      {schemas.map((sc, i) => <JsonLd key={i} data={sc} />)}
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={s.wrap}>
        {/* Breadcrumb */}
        <nav style={s.breadcrumb} aria-label="Fil d'Ariane">
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          <span>›</span>
          <Link to="/simulateurs/frais-notaire" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Frais de notaire</Link>
          <span>›</span>
          <span style={{ color: "var(--text)" }}>Guide 2026</span>
        </nav>

        {/* Hero */}
        <div style={s.hero}>
          <span style={s.badge}>Immobilier</span>
          <h1 style={s.h1}>Frais de notaire 2026 : taux, calcul et comment les réduire</h1>
          <p style={s.sub}>
            Les frais de notaire représentent 7 à 8 % du prix d'un bien ancien — un poste souvent sous-estimé lors du budget d'achat.
            Voici leur décomposition exacte, des exemples par tranches de prix et les moyens légaux de les minimiser.
          </p>
          <Link to="/simulateurs/frais-notaire" style={s.cta}>
            🏠 Calculer mes frais de notaire
          </Link>
        </div>

        {/* Stats */}
        <div style={s.stats}>
          {STATS.map((st, i) => (
            <div key={i} style={s.stat}>
              <div style={s.statVal}>{st.value}</div>
              <div style={s.statLabel}>{st.label}</div>
              <div style={s.statNote}>{st.note}</div>
            </div>
          ))}
        </div>

        {/* Content */}
        <h2 style={s.h2}>À quoi servent les frais de notaire ?</h2>
        <div style={s.body}>
          <p>Contrairement à une idée reçue, <strong>80 % des "frais de notaire" ne vont pas au notaire</strong> — ils sont reversés à l'État et aux collectivités locales sous forme de droits de mutation (aussi appelés droits d'enregistrement ou "taxe de pub foncière"). Voici la décomposition exacte pour un bien ancien :</p>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Poste</th>
                <th style={s.th}>Taux approximatif</th>
                <th style={s.th}>Bénéficiaire</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Taxe départementale (DMD)", "4,50 %", "Département"],
                ["Taxe communale", "1,20 %", "Commune"],
                ["Frais d'assiette (frais perçus par l'État)", "0,10 %", "État"],
                ["Contribution de sécurité immobilière", "0,10 %", "État"],
                ["Émoluments du notaire", "~1,00 %", "Notaire"],
                ["Débours (frais divers)", "~0,50 %", "Tiers (géomètre, etc.)"],
              ].map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j} style={{ ...s.td, fontWeight: j === 0 ? 500 : 400 }}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <p><strong>Total : environ 7,40 %</strong> pour un bien ancien dans la grande majorité des départements. Quelques départements ont conservé un taux réduit (3,80 %) pour la taxe départementale (Indre, Isère, Morbihan, Mayotte) — dans ces cas, les frais totaux tombent à environ 5,5 %.</p>
        </div>

        <h2 style={s.h2}>Exemples de frais de notaire par prix d'achat</h2>
        <div style={s.body}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Prix d'achat</th>
                <th style={s.th}>Frais (bien ancien)</th>
                <th style={s.th}>Frais (bien neuf)</th>
              </tr>
            </thead>
            <tbody>
              {EXEMPLES.map(([prix, ancien, neuf], i) => (
                <tr key={i}>
                  <td style={s.td}>{prix}</td>
                  <td style={{ ...s.td, color: "#dc2626", fontWeight: 500 }}>{ancien}</td>
                  <td style={{ ...s.td, color: "#15A06B", fontWeight: 500 }}>{neuf}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Pour un calcul précis intégrant votre département et le type de bien, utilisez le <Link to="/simulateurs/frais-notaire" style={{ color: "var(--primary)" }}>simulateur frais de notaire</Link>.</p>
        </div>

        <h2 style={s.h2}>Frais de notaire dans le neuf vs l'ancien</h2>
        <div style={s.body}>
          <p>Pour un logement neuf (moins de 5 ans ou vendu en VEFA — vente en l'état futur d'achèvement), les frais de notaire sont nettement inférieurs :</p>
          <ul>
            <li>Les droits de mutation sont remplacés par la <strong>TVA (20 %)</strong> déjà incluse dans le prix affiché</li>
            <li>Seuls les émoluments du notaire et la contribution de sécurité immobilière s'appliquent</li>
            <li>Résultat : <strong>2 à 3 %</strong> de frais de notaire seulement</li>
          </ul>
          <div style={s.infoBox}>
            <strong>💡 Économie sur 300 000 € :</strong> Ancien → ~22 000 € de frais. Neuf → ~7 000 € de frais. Soit une économie de 15 000 €. Mais attention : le prix au m² dans le neuf est souvent 10–20 % plus élevé que dans l'ancien dans la même zone.
          </div>
        </div>

        <h2 style={s.h2}>3 stratégies légales pour réduire les frais de notaire</h2>
        <div style={s.body}>
          <p><strong>1. Facturer les meubles séparément</strong></p>
          <p>Les droits de mutation ne s'appliquent que sur les immeubles, pas sur les meubles. Si le bien inclut une cuisine équipée, des électroménagers, un dressing sur mesure, une bibliothèque intégrée — vous pouvez faire établir une liste valorisée de ces meubles (bon de vente mobilière) et les déduire du prix de vente. La déduction est limitée à <strong>5 % du prix total</strong> et doit être justifiée par des factures ou une expertise.</p>
          <p style={{ marginTop: 16 }}><strong>2. Distinguer honoraires d'agence et prix du bien</strong></p>
          <p>Si le mandat est à la charge de l'acheteur (mandat de recherche), les honoraires d'agence ne sont pas soumis aux droits de mutation et ne s'intègrent pas dans l'assiette des frais de notaire. Sur un bien à 300 000 € avec 15 000 € d'honoraires acheteur distincts : économie d'environ 900 € de droits.</p>
          <p style={{ marginTop: 16 }}><strong>3. Acheter dans un département à taux réduit</strong></p>
          <p>Les départements de l'Indre (36), l'Isère (38), le Morbihan (56) et Mayotte ont conservé le taux réduit de taxe départementale à 3,80 % (au lieu de 4,50 %). Les frais totaux tombent à environ 5,5 % — soit une économie de 5 000 € sur 300 000 €.</p>
        </div>

        <h2 style={s.h2}>Les frais de notaire sont-ils finançables par le crédit ?</h2>
        <div style={s.body}>
          <p>La plupart des banques refusent de financer les frais de notaire par le crédit immobilier classique — elles financent généralement jusqu'à 100 % du prix du bien, pas les frais annexes. Les frais de notaire doivent donc être couverts par votre <strong>apport personnel</strong>.</p>
          <p>Exception : certains prêts à 110 % (prix + frais) existent, notamment pour les primo-accédants sans apport. Les taux sont légèrement supérieurs et les conditions plus strictes.</p>
          <div style={s.formula}>
            Budget total à prévoir = Prix d'achat + Frais de notaire (7–8 %) + Travaux + Frais d'agence
          </div>
        </div>

        {/* FAQ */}
        <div style={s.faqSection}>
          <h2 style={s.faqH2}>Questions fréquentes sur les frais de notaire</h2>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={s.faqItem}>
              <div style={s.faqQ}>{q}</div>
              <div style={s.faqA}>{a}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={s.ctaBox}>
          <div style={s.ctaBoxTitle}>Calculez vos frais de notaire en 30 secondes</div>
          <p style={s.ctaBoxSub}>
            Renseignez le prix du bien, le département et le type (neuf/ancien) pour obtenir
            une décomposition précise poste par poste.
          </p>
          <Link to="/simulateurs/frais-notaire" style={{ ...s.cta, marginBottom: 0 }}>
            Lancer le simulateur →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
