import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import JsonLd from "../components/JsonLd.jsx";
import TableOfContents from "../components/TableOfContents.jsx";

const BASE = "https://www.simfinly.com";

const TOC_ITEMS = [
  { id: "simulateurs", label: "Les simulateurs épargne & FIRE" },
  { id: "regle-4-pourcent", label: "La règle des 4 %" },
  { id: "monte-carlo", label: "Simulation Monte Carlo" },
  { id: "taux-epargne", label: "Le taux d'épargne" },
  { id: "etapes", label: "Les 5 étapes vers l'indépendance financière" },
  { id: "comparatifs", label: "Comparatifs épargne" },
  { id: "lexique", label: "Lexique FIRE et épargne" },
];

const STATS = [
  { value: "25x", label: "Capital cible FIRE", note: "25 fois les dépenses annuelles (règle des 4 %)" },
  { value: "20 %", label: "Taux d'épargne minimum recommandé", note: "Règle du 50/30/20" },
  { value: "1928-2024", label: "Historique S&P 500 utilisé", note: "Simulation Monte Carlo par bootstrap" },
  { value: "4 600 €", label: "Abattement assurance-vie (8 ans)", note: "9 200 € pour un couple" },
];

const FAQ = [
  {
    q: "Combien faut-il épargner pour atteindre l'indépendance financière (FIRE) ?",
    a: "Selon la règle des 4 % (issue de l'étude Trinity), le capital cible est d'environ 25 fois vos dépenses annuelles. Pour vivre avec 2 000 €/mois (24 000 €/an), il faut environ 600 000 € de capital investi. Un taux de retrait plus prudent (3,5 %) est parfois recommandé pour un horizon très long, portant le capital cible à environ 686 000 €.",
  },
  {
    q: "Qu'est-ce que la simulation Monte Carlo sur le simulateur FIRE ?",
    a: "Plutôt que de supposer un rendement annuel constant, la simulation Monte Carlo tire aléatoirement des rendements réels parmi l'historique du S&P 500 (1928-2024, avec remise/bootstrap) sur des centaines de trajectoires simulées, pour afficher une fourchette réaliste (percentiles P10-P90) de l'évolution de votre capital plutôt qu'une seule projection optimiste.",
  },
  {
    q: "Pourquoi le taux d'épargne compte-t-il plus que le rendement ?",
    a: "À rendement identique, doubler son taux d'épargne réduit bien plus que de moitié le temps nécessaire pour atteindre l'indépendance financière : à 10 % de taux d'épargne, il faut environ 51 ans ; à 25 %, environ 32 ans ; à 50 %, environ 17 ans. Chaque euro épargné en plus réduit aussi les dépenses cibles, ce qui amplifie l'effet.",
  },
  {
    q: "Quelle est la différence entre Lean, Coast, Barista et Fat FIRE ?",
    a: "Le Lean FIRE vise un capital minimal pour un mode de vie frugal. Le Coast FIRE consiste à épargner intensément tôt puis laisser le capital croître sans plus rien ajouter jusqu'à la retraite légale. Le Barista FIRE combine un capital partiel avec un revenu d'appoint. Le Fat FIRE vise un capital confortable, bien au-delà du strict nécessaire.",
  },
  {
    q: "PEA ou assurance-vie pour investir en vue du FIRE ?",
    a: "Le PEA est optimal pour les actions et ETF européens : exonération d'impôt sur le revenu après 5 ans (seuls les prélèvements sociaux restent dus). L'assurance-vie offre plus de souplesse (pas de plafond strict, fonds euros disponibles) et un cadre de transmission avantageux après 8 ans. Les deux enveloppes sont complémentaires dans une stratégie FIRE.",
  },
];

const SIMULATEURS = [
  { path: "/simulateurs/fire", label: "Indépendance financière (FIRE)", emoji: "🔥", desc: "Capital cible et simulation Monte Carlo" },
  { path: "/simulateurs/epargne", label: "Épargne & intérêts composés", emoji: "💰", desc: "Projection du capital sur le long terme" },
  { path: "/simulateurs/budget", label: "Budget 50/30/20", emoji: "📊", desc: "Répartir son budget et dégager de l'épargne" },
  { path: "/simulateurs/patrimoine", label: "Patrimoine global", emoji: "🧮", desc: "Consolider actifs financiers, immo et retraite" },
  { path: "/simulateurs/comparateur", label: "Comparateur d'actifs", emoji: "📈", desc: "Performance historique ETF, actions, crypto" },
  { path: "/simulateurs/assurance-vie", label: "Assurance-vie", emoji: "🛡️", desc: "Rendement et fiscalité après 8 ans" },
];

const ETAPES = [
  { num: "1", title: "Calculez votre taux d'épargne actuel", desc: "Le simulateur budget 50/30/20 identifie combien vous épargnez réellement chaque mois et où se trouvent les marges de manœuvre." },
  { num: "2", title: "Fixez votre capital cible FIRE", desc: "Multipliez vos dépenses annuelles par 25 (règle des 4 %) pour obtenir une première estimation, ajustable selon votre horizon." },
  { num: "3", title: "Choisissez vos enveloppes d'investissement", desc: "PEA pour les actions européennes (fiscalité allégée après 5 ans), assurance-vie pour la diversification et la transmission." },
  { num: "4", title: "Investissez régulièrement (DCA)", desc: "Des versements programmés mensuels lissent le prix d'achat moyen et réduisent l'impact du risque de séquence des rendements." },
  { num: "5", title: "Testez la robustesse de votre plan avec Monte Carlo", desc: "Une projection à rendement constant est optimiste — la simulation Monte Carlo du simulateur FIRE montre une fourchette réaliste selon l'historique réel des marchés." },
];

const TERMES_LEXIQUE = [
  ["fire", "FIRE"],
  ["regle-4-pourcent", "Règle des 4 %"],
  ["taux-epargne", "Taux d'épargne"],
  ["interets-composes", "Intérêts composés"],
  ["coast-fire", "Coast FIRE"],
  ["lean-fire", "Lean FIRE"],
  ["fat-fire", "Fat FIRE"],
  ["dca", "DCA"],
  ["risque-sequence", "Risque de séquence"],
  ["pea", "PEA"],
];

const COMPARATIFS_FIRE = [
  ["per-vs-assurance-vie", "PER ou assurance-vie ?"],
  ["pea-vs-compte-titres", "PEA ou compte-titres ?"],
  ["fonds-euros-vs-etf", "Fonds euros ou ETF ?"],
  ["assurance-vie-vs-pea", "Assurance-vie ou PEA ?"],
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Guide complet FIRE et épargne 2026 : indépendance financière, calcul et simulation Monte Carlo",
    description: "Tout sur l'indépendance financière (FIRE) et l'épargne en 2026 : règle des 4 %, taux d'épargne, PEA vs assurance-vie et simulation Monte Carlo.",
    author: { "@type": "Organization", name: "Simfinly", url: BASE },
    publisher: { "@type": "Organization", name: "Simfinly", logo: { "@type": "ImageObject", url: `${BASE}/logo-mark.svg` } },
    url: `${BASE}/epargne/guide-complet-2026`,
    datePublished: "2026-07-04",
    dateModified: "2026-07-04",
    inLanguage: "fr-FR",
    mainEntityOfPage: `${BASE}/epargne/guide-complet-2026`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Comment atteindre l'indépendance financière (FIRE) en 2026",
    description: "Les 5 étapes pour bâtir un plan d'épargne et d'investissement vers l'indépendance financière.",
    step: ETAPES.map(e => ({ "@type": "HowToStep", position: parseInt(e.num), name: e.title, text: e.desc })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
      { "@type": "ListItem", position: 2, name: "Simulateurs épargne", item: `${BASE}/simulateurs/epargne` },
      { "@type": "ListItem", position: 3, name: "Guide complet FIRE et épargne 2026", item: `${BASE}/epargne/guide-complet-2026` },
    ],
  },
];

export default function GuideEpargneFire2026() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.title = "Guide FIRE et épargne 2026 : indépendance financière, Monte Carlo | simfinly";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Tout sur le FIRE et l'épargne 2026 : règle des 4 %, capital cible (25x dépenses), taux d'épargne, PEA vs assurance-vie, simulation Monte Carlo sur l'historique S&P 500.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = `${BASE}/epargne/guide-complet-2026`;
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
    formula: { background: "var(--primary-soft)", border: "1px solid var(--border-gold)", borderRadius: 10, padding: "16px 20px", fontWeight: 600, color: "var(--text)", margin: "16px 0", fontFamily: "'Space Grotesk', sans-serif" },
    infoBox: { background: "var(--positive-soft)", border: "1px solid var(--positive)", borderRadius: 10, padding: "14px 20px", margin: "16px 0", fontSize: 14, color: "var(--text)", lineHeight: 1.7 },
    warnBox: { background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "14px 20px", margin: "16px 0", fontSize: 14, color: "var(--text)", lineHeight: 1.7 },
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
          <span style={{ color: "var(--text)" }}>Guide FIRE et épargne 2026</span>
        </nav>

        <div style={s.hero}>
          <span style={s.badge}>Guide complet</span>
          <h1 style={s.h1}>FIRE et épargne 2026 : indépendance financière</h1>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12 }}>Mis à jour le 4 juillet 2026</p>
          <p style={s.sub}>
            Règle des 4 %, capital cible, taux d'épargne, intérêts composés, PEA vs assurance-vie et simulation
            Monte Carlo sur l'historique réel des marchés — le guide complet pour bâtir votre indépendance financière.
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

        <h2 id="simulateurs" style={s.h2}>Les simulateurs épargne & FIRE disponibles sur simfinly</h2>
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

        <h2 id="regle-4-pourcent" style={s.h2}>La règle des 4 % : combien faut-il pour être libre financièrement ?</h2>
        <div style={s.body}>
          <p>Issue de l'étude Trinity, la règle des 4 % (Safe Withdrawal Rate) estime qu'un retrait annuel de 4 % du capital initial, ajusté à l'inflation chaque année, a une forte probabilité de ne jamais épuiser le capital sur 30 ans.</p>
          <div style={s.formula}>Capital cible = Dépenses annuelles × 25</div>
          <div style={s.infoBox}>
            <strong>💡 Exemple :</strong> pour financer 2 000 €/mois (24 000 €/an), le capital cible est de 24 000 ÷ 0,04 = <strong>600 000 €</strong>.
            Pour un horizon très long (40-50 ans, typique d'un départ précoce), un taux plus prudent de 3,5 % porte le capital cible à environ 686 000 €.
          </div>
        </div>

        <h2 id="monte-carlo" style={s.h2}>Simulation Monte Carlo : au-delà de la projection à rendement constant</h2>
        <div style={s.body}>
          <p>Une projection classique suppose un rendement annuel constant — une hypothèse optimiste qui ignore la volatilité réelle des marchés. Le simulateur FIRE de simfinly propose un mode probabiliste : il tire aléatoirement des rendements annuels réels dans l'historique du S&P 500 (1928-2024, avec remise), sur environ 1 000 trajectoires simulées, pour afficher une fourchette réaliste (percentiles P10, P50, P90) de l'évolution de votre capital dans le temps.</p>
          <div style={s.warnBox}>
            <strong>⚠️ Risque de séquence des rendements :</strong> un krach boursier survenant juste après le début des retraits est bien plus dommageable qu'un krach survenant en fin de parcours — c'est ce que la simulation Monte Carlo permet de visualiser, contrairement à une projection à taux fixe.
          </div>
        </div>

        <h2 id="taux-epargne" style={s.h2}>Le taux d'épargne : le levier le plus puissant</h2>
        <div style={s.body}>
          <p>Le taux d'épargne (épargne mensuelle ÷ revenus nets) influence la vitesse d'accumulation du patrimoine bien plus que le rendement des placements, surtout dans les premières années :</p>
          <ul>
            <li><strong>10 % de taux d'épargne</strong> : environ 51 ans jusqu'à l'indépendance financière</li>
            <li><strong>25 % de taux d'épargne</strong> : environ 32 ans</li>
            <li><strong>50 % de taux d'épargne</strong> : environ 17 ans</li>
          </ul>
          <p>La règle du 50/30/20 (50 % besoins essentiels, 30 % envies, 20 % épargne minimum) est un point de départ ; les adeptes du FIRE visent souvent 40 à 60 %.</p>
        </div>

        <h2 id="etapes" style={s.h2}>Les 5 étapes vers l'indépendance financière</h2>
        <div style={s.etapes}>
          {ETAPES.map((e, i) => (
            <div key={i} style={s.etape}>
              <div style={s.etapeNum}>{e.num}</div>
              <div><div style={s.etapeTitle}>{e.title}</div><div style={s.etapeDesc}>{e.desc}</div></div>
            </div>
          ))}
        </div>

        <h2 id="comparatifs" style={s.h2}>Comparatifs épargne</h2>
        <div style={s.body}>
          <p>Pour arbitrer entre deux enveloppes ou stratégies concrètes :</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {COMPARATIFS_FIRE.map(([slug, label]) => (
              <Link key={slug} to={`/comparatifs/${slug}`} style={chip}>{label}</Link>
            ))}
          </div>
        </div>

        <h2 id="lexique" style={s.h2}>Lexique FIRE et épargne</h2>
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
            <Link to="/blog" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Articles FIRE et épargne du blog →</Link>
          </p>
        </div>

        <div style={s.faqSection}>
          <h2 style={s.faqH2}>Questions fréquentes sur le FIRE et l'épargne 2026</h2>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={s.faqItem}><div style={s.faqQ}>{q}</div><div style={s.faqA}>{a}</div></div>
          ))}
        </div>

        <div style={s.ctaBox}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
            Calculez votre capital FIRE en 3 minutes
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>
            Testez le mode déterministe et la simulation Monte Carlo pour visualiser une fourchette réaliste de votre indépendance financière.
          </p>
          <Link to="/simulateurs/fire" style={s.cta}>Lancer le simulateur FIRE →</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
