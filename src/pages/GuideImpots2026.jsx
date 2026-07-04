import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import JsonLd from "../components/JsonLd.jsx";
import TableOfContents from "../components/TableOfContents.jsx";

const BASE = "https://www.simfinly.com";

const TOC_ITEMS = [
  { id: "simulateurs", label: "Les simulateurs fiscalité" },
  { id: "bareme-ir", label: "Le barème de l'impôt sur le revenu" },
  { id: "flat-tax", label: "Flat tax (PFU)" },
  { id: "plus-value", label: "Plus-value immobilière" },
  { id: "succession", label: "Succession et donation" },
  { id: "etapes", label: "Les 5 étapes pour optimiser sa fiscalité" },
  { id: "comparatifs", label: "Comparatifs fiscalité" },
  { id: "lexique", label: "Lexique fiscalité" },
];

const STATS = [
  { value: "45 %", label: "Taux marginal maximum (TMI)", note: "Au-delà de 181 917 € de revenu imposable" },
  { value: "31,4 %", label: "Flat tax (PFU) — dividendes/PV", note: "12,8 % IR + 18,6 % prélèvements sociaux" },
  { value: "100 000 €", label: "Abattement succession ligne directe", note: "Par enfant, renouvelable tous les 15 ans" },
  { value: "22 / 30 ans", label: "Exonération plus-value immo", note: "Détention totale : IR / prélèvements sociaux" },
];

const FAQ = [
  {
    q: "Quel est le barème de l'impôt sur le revenu en 2026 ?",
    a: "Le barème 2026 (revenus 2025) compte 5 tranches : 0 % jusqu'à 11 600 €, 11 % de 11 600 à 29 579 €, 30 % de 29 579 à 84 577 €, 41 % de 84 577 à 181 917 €, et 45 % au-delà. Ces taux s'appliquent par tranche, pas sur l'ensemble du revenu — c'est le principe du barème progressif.",
  },
  {
    q: "Flat tax ou barème progressif : comment choisir ?",
    a: "Le Prélèvement Forfaitaire Unique (PFU, 31,4 % pour les dividendes et plus-values mobilières depuis 2025) est automatique mais optionnel : vous pouvez choisir le barème progressif si votre TMI est basse (0 % ou 11 %), notamment grâce à l'abattement de 40 % sur les dividendes en cas d'option barème. Le simulateur flat tax de simfinly compare les deux options selon votre situation.",
  },
  {
    q: "Comment est taxée la plus-value immobilière ?",
    a: "La plus-value immobilière (hors résidence principale, exonérée) est taxée à 19 % d'impôt + prélèvements sociaux, avec des abattements progressifs pour durée de détention : exonération totale de l'impôt après 22 ans de détention, et des prélèvements sociaux après 30 ans.",
  },
  {
    q: "Quels sont les abattements sur les droits de succession ?",
    a: "En ligne directe (parent-enfant), l'abattement est de 100 000 € par enfant, renouvelable tous les 15 ans — c'est le principal levier de transmission sans droits. Entre époux ou partenaires de PACS, la transmission est totalement exonérée de droits de succession.",
  },
  {
    q: "Comment réduire son impôt sur le revenu légalement ?",
    a: "Les leviers principaux : versements sur un PER (déductibles du revenu imposable dans la limite de 10 % des revenus professionnels), dons aux associations (réduction de 66 à 75 % du don), emploi à domicile (crédit d'impôt de 50 %), et déficit foncier pour les propriétaires bailleurs. Le simulateur impôt sur le revenu de simfinly permet de tester l'impact de chaque levier.",
  },
];

const SIMULATEURS = [
  { path: "/simulateurs/impot-revenu", label: "Impôt sur le revenu", emoji: "📋", desc: "Barème 2026, TMI et taux moyen d'imposition" },
  { path: "/simulateurs/flat-tax", label: "Flat tax (PFU)", emoji: "⚖️", desc: "31,4 % ou barème progressif : que choisir ?" },
  { path: "/simulateurs/plus-value-immobiliere", label: "Plus-value immobilière", emoji: "🏠", desc: "Impôt et abattements selon la durée de détention" },
  { path: "/simulateurs/succession", label: "Droits de succession", emoji: "🕊️", desc: "Barème et abattements par lien de parenté" },
  { path: "/simulateurs/donation", label: "Donation", emoji: "🎁", desc: "Droits de donation et stratégies de transmission" },
  { path: "/simulateurs/deficit-foncier", label: "Déficit foncier", emoji: "🧾", desc: "Optimiser la fiscalité d'un investissement locatif" },
];

const ETAPES = [
  { num: "1", title: "Identifiez votre tranche marginale d'imposition", desc: "Votre TMI détermine l'économie fiscale d'une déduction (PER, dons) : 1 000 € déduits économisent 300 € à 30 % de TMI, 410 € à 41 %." },
  { num: "2", title: "Vérifiez l'option barème sur vos revenus du capital", desc: "Si votre TMI est basse (0 ou 11 %), l'option barème progressif est souvent plus avantageuse que le PFU à 31,4 %, surtout pour les dividendes." },
  { num: "3", title: "Activez les niches fiscales pertinentes", desc: "PER, dons, emploi à domicile, déficit foncier — chaque levier a un plafond et des conditions propres à vérifier avant fin d'année." },
  { num: "4", title: "Anticipez la transmission de votre patrimoine", desc: "Les abattements de donation (100 000 €/enfant) se renouvellent tous les 15 ans — donner tôt et régulièrement réduit fortement les droits de succession." },
  { num: "5", title: "Simulez avant toute décision", desc: "Barème IR, flat tax, plus-value ou succession : chaque simulateur simfinly calcule l'impôt exact selon votre situation avant toute démarche." },
];

const TERMES_LEXIQUE = [
  ["tmi", "TMI"],
  ["ir", "Impôt sur le revenu"],
  ["pfu", "PFU / Flat tax"],
  ["quotient-familial", "Quotient familial"],
  ["abattement", "Abattement"],
  ["plus-value-immobiliere", "Plus-value immobilière"],
  ["csg", "CSG"],
  ["prelevement-source", "Prélèvement à la source"],
  ["ifi", "IFI"],
  ["rfr", "RFR"],
];

const COMPARATIFS_IMPOTS = [
  ["pfu-vs-bareme", "Flat tax ou barème progressif ?"],
  ["donation-vs-succession", "Donation ou succession ?"],
  ["deficit-foncier-vs-micro-foncier", "Déficit foncier ou micro-foncier ?"],
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Guide complet impôts 2026 : barème, flat tax, plus-value et succession",
    description: "Tout sur la fiscalité en 2026 : barème de l'impôt sur le revenu, flat tax, plus-value immobilière et droits de succession.",
    author: { "@type": "Organization", name: "Simfinly", url: BASE },
    publisher: { "@type": "Organization", name: "Simfinly", logo: { "@type": "ImageObject", url: `${BASE}/logo-mark.svg` } },
    url: `${BASE}/impots/guide-complet-2026`,
    datePublished: "2026-07-04",
    dateModified: "2026-07-04",
    inLanguage: "fr-FR",
    mainEntityOfPage: `${BASE}/impots/guide-complet-2026`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Comment optimiser sa fiscalité en 2026",
    description: "Les 5 étapes pour comprendre et réduire légalement son impôt en France en 2026.",
    step: ETAPES.map(e => ({ "@type": "HowToStep", position: parseInt(e.num), name: e.title, text: e.desc })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
      { "@type": "ListItem", position: 2, name: "Simulateurs impôts", item: `${BASE}/simulateurs/impot-revenu` },
      { "@type": "ListItem", position: 3, name: "Guide complet impôts 2026", item: `${BASE}/impots/guide-complet-2026` },
    ],
  },
];

export default function GuideImpots2026() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.title = "Guide impôts 2026 : barème, flat tax, plus-value | simfinly";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Tout sur la fiscalité 2026 : barème IR (5 tranches, 0 à 45 %), flat tax 31,4 %, plus-value immobilière, droits de succession et donation.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = `${BASE}/impots/guide-complet-2026`;
  }, []);

  const s = {
    page: { minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" },
    wrap: { maxWidth: 860, margin: "0 auto", padding: "0 20px 80px" },
    breadcrumb: { display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: "var(--text-secondary)", padding: "20px 0 0", flexWrap: "wrap" },
    hero: { padding: "36px 0 24px" },
    badge: { display: "inline-block", background: "var(--primary-soft)", color: "var(--primary)", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 16 },
    h1: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px,4.5vw,40px)", fontWeight: 700, lineHeight: 1.2, color: "var(--text)", margin: "0 0 16px", letterSpacing: "-0.02em" },
    sub: { fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.65, margin: "0 0 28px", maxWidth: 700 },
    stats: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, margin: "0 0 40px" },
    stat: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" },
    statVal: { fontSize: 24, fontWeight: 700, color: "var(--primary)", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 },
    statLabel: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 },
    statNote: { fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 },
    h2: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(19px,3vw,24px)", fontWeight: 600, color: "var(--text)", margin: "40px 0 14px", lineHeight: 1.3 },
    body: { fontSize: 15, lineHeight: 1.85, color: "var(--text-secondary)" },
    table: { width: "100%", borderCollapse: "collapse", margin: "20px 0", fontSize: 14 },
    th: { background: "var(--primary-soft)", color: "var(--primary)", fontWeight: 600, padding: "10px 16px", textAlign: "left", borderBottom: "2px solid var(--border-gold)" },
    td: { padding: "10px 16px", borderBottom: "1px solid var(--border)", color: "var(--text)" },
    formula: { background: "var(--primary-soft)", border: "1px solid var(--border-gold)", borderRadius: 10, padding: "16px 20px", fontWeight: 600, color: "var(--text)", margin: "16px 0", fontFamily: "'Space Grotesk', sans-serif" },
    infoBox: { background: "var(--positive-soft)", border: "1px solid var(--positive)", borderRadius: 10, padding: "14px 20px", margin: "16px 0", fontSize: 14, color: "var(--text)", lineHeight: 1.7 },
    simGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, margin: "24px 0" },
    simCard: { display: "block", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", textDecoration: "none", transition: "border-color .2s, box-shadow .2s" },
    simEmoji: { fontSize: 24, marginBottom: 8 },
    simLabel: { fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4 },
    simDesc: { fontSize: 12, color: "var(--text-secondary)" },
    etapes: { display: "grid", gap: 0 },
    etape: { display: "flex", gap: 16, padding: "18px 0", borderBottom: "1px solid var(--border)" },
    etapeNum: { width: 36, height: 36, borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk', sans-serif", flexShrink: 0 },
    etapeTitle: { fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 6 },
    etapeDesc: { fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 },
    faqSection: { marginTop: 48 },
    faqH2: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(18px,3vw,22px)", fontWeight: 600, color: "var(--text)", marginBottom: 20 },
    faqItem: { borderBottom: "1px solid var(--border)", padding: "20px 0" },
    faqQ: { fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 10 },
    faqA: { fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 },
    cta: { display: "inline-flex", alignItems: "center", gap: 8, background: "var(--primary)", color: "#fff", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 600, textDecoration: "none", boxShadow: "0 2px 12px rgba(43,92,230,.25)" },
    ctaBox: { background: "var(--primary-soft)", border: "1px solid var(--border-gold)", borderRadius: 14, padding: "28px 32px", marginTop: 48, textAlign: "center" },
  };

  const chip = { background: "var(--chip-bg)", color: "var(--primary)", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 500, textDecoration: "none", border: "1px solid var(--border-gold)" };

  return (
    <div style={s.page}>
      {schemas.map((sc, i) => <JsonLd key={i} data={sc} />)}
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={s.wrap}>
        <nav style={s.breadcrumb} aria-label="Fil d'Ariane">
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          <span>›</span>
          <Link to="/simulateurs" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Simulateurs</Link>
          <span>›</span>
          <span style={{ color: "var(--text)" }}>Guide impôts 2026</span>
        </nav>

        <div style={s.hero}>
          <span style={s.badge}>Guide complet</span>
          <h1 style={s.h1}>Impôts 2026 : barème, flat tax, plus-value et succession</h1>
          <p style={s.sub}>
            Barème de l'impôt sur le revenu, flat tax vs option barème, fiscalité de la plus-value immobilière,
            droits de succession et donation — le guide complet pour comprendre et optimiser votre fiscalité en 2026.
          </p>
        </div>

        <TableOfContents items={TOC_ITEMS} />

        <div style={s.stats}>
          {STATS.map((st, i) => (
            <div key={i} style={s.stat}>
              <div style={s.statVal}>{st.value}</div>
              <div style={s.statLabel}>{st.label}</div>
              <div style={s.statNote}>{st.note}</div>
            </div>
          ))}
        </div>

        <h2 id="simulateurs" style={s.h2}>Les simulateurs fiscalité disponibles sur simfinly</h2>
        <p style={{ ...s.body, marginBottom: 0 }}>Tous nos simulateurs sont gratuits, sans inscription, et calculent en temps réel.</p>
        <div style={s.simGrid}>
          {SIMULATEURS.map((sim, i) => (
            <Link key={i} to={sim.path} style={s.simCard}>
              <div style={s.simEmoji}>{sim.emoji}</div>
              <div style={s.simLabel}>{sim.label}</div>
              <div style={s.simDesc}>{sim.desc}</div>
            </Link>
          ))}
        </div>

        <h2 id="bareme-ir" style={s.h2}>Le barème de l'impôt sur le revenu 2026</h2>
        <div style={s.body}>
          <p>L'impôt sur le revenu est calculé selon un barème progressif par tranches, appliqué au revenu imposable divisé par le nombre de parts du foyer fiscal (quotient familial) :</p>
          <table style={s.table}>
            <thead><tr><th style={s.th}>Tranche de revenu (par part)</th><th style={s.th}>Taux</th></tr></thead>
            <tbody>
              <tr><td style={s.td}>Jusqu'à 11 600 €</td><td style={s.td}>0 %</td></tr>
              <tr><td style={s.td}>De 11 600 € à 29 579 €</td><td style={s.td}>11 %</td></tr>
              <tr><td style={s.td}>De 29 579 € à 84 577 €</td><td style={s.td}>30 %</td></tr>
              <tr><td style={s.td}>De 84 577 € à 181 917 €</td><td style={s.td}>41 %</td></tr>
              <tr><td style={s.td}>Au-delà de 181 917 €</td><td style={s.td}>45 %</td></tr>
            </tbody>
          </table>
          <p>Chaque taux ne s'applique qu'à la fraction du revenu comprise dans sa tranche — c'est pourquoi votre taux moyen d'imposition est toujours inférieur à votre TMI (tranche marginale d'imposition).</p>
        </div>

        <h2 id="flat-tax" style={s.h2}>Flat tax (PFU) : 30 % ou 31,4 % selon le revenu</h2>
        <div style={s.body}>
          <p>Le Prélèvement Forfaitaire Unique taxe automatiquement les revenus du capital à un taux forfaitaire : 12,8 % d'impôt sur le revenu, plus des prélèvements sociaux dont le taux dépend du type de revenu depuis la hausse votée en 2025 (18,6 % pour les dividendes et plus-values mobilières dans la majorité des cas, contre 17,2 % pour d'autres revenus du capital) — soit 30 % ou 31,4 % au total.</p>
          <div style={s.infoBox}>
            <strong>💡 Option barème :</strong> vous pouvez renoncer au PFU pour opter pour le barème progressif — avantageux si votre TMI est de 0 % ou 11 %, notamment grâce à l'abattement de 40 % sur les dividendes disponible uniquement avec cette option.
          </div>
        </div>

        <h2 id="plus-value" style={s.h2}>Plus-value immobilière : l'abattement pour durée de détention</h2>
        <div style={s.body}>
          <p>La résidence principale est totalement exonérée. Pour les autres biens, la plus-value est taxée à 19 % d'impôt + prélèvements sociaux, avec un abattement progressif :</p>
          <ul>
            <li><strong>Impôt sur le revenu (19 %)</strong> : exonération totale après 22 ans de détention</li>
            <li><strong>Prélèvements sociaux</strong> : exonération totale après 30 ans de détention</li>
          </ul>
        </div>

        <h2 id="succession" style={s.h2}>Succession et donation : l'abattement de 100 000 € par enfant</h2>
        <div style={s.body}>
          <p>En ligne directe (parent-enfant), chaque parent peut transmettre 100 000 € par enfant en franchise de droits, un abattement <strong>renouvelable tous les 15 ans</strong>. Entre époux ou partenaires de PACS, la transmission par succession est totalement exonérée. Donner de son vivant, tôt et régulièrement, permet ainsi de transmettre un patrimoine important sans droits de succession.</p>
        </div>

        <h2 id="etapes" style={s.h2}>Les 5 étapes pour optimiser sa fiscalité</h2>
        <div style={s.etapes}>
          {ETAPES.map((e, i) => (
            <div key={i} style={s.etape}>
              <div style={s.etapeNum}>{e.num}</div>
              <div><div style={s.etapeTitle}>{e.title}</div><div style={s.etapeDesc}>{e.desc}</div></div>
            </div>
          ))}
        </div>

        <h2 id="comparatifs" style={s.h2}>Comparatifs fiscalité</h2>
        <div style={s.body}>
          <p>Pour arbitrer entre deux stratégies concrètes :</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {COMPARATIFS_IMPOTS.map(([slug, label]) => (
              <Link key={slug} to={`/comparatifs/${slug}`} style={chip}>{label}</Link>
            ))}
          </div>
        </div>

        <h2 id="lexique" style={s.h2}>Lexique fiscalité</h2>
        <div style={s.body}>
          <p>Les termes essentiels expliqués simplement :</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {TERMES_LEXIQUE.map(([slug, label]) => (
              <Link key={slug} to={`/lexique/${slug}`} style={chip}>{label}</Link>
            ))}
          </div>
          <p style={{ marginTop: 14 }}>
            <Link to="/lexique" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Voir tout le lexique →</Link>
            {" · "}
            <Link to="/blog" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Articles fiscalité du blog →</Link>
          </p>
        </div>

        <div style={s.faqSection}>
          <h2 style={s.faqH2}>Questions fréquentes sur les impôts 2026</h2>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={s.faqItem}><div style={s.faqQ}>{q}</div><div style={s.faqA}>{a}</div></div>
          ))}
        </div>

        <div style={s.ctaBox}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
            Calculez votre impôt sur le revenu en 3 minutes
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>
            Renseignez vos revenus et votre situation familiale pour un calcul personnalisé de votre impôt 2026.
          </p>
          <Link to="/simulateurs/impot-revenu" style={s.cta}>Lancer le simulateur impôt →</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
