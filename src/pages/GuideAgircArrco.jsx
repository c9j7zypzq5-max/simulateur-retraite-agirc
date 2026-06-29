import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import JsonLd from "../components/JsonLd.jsx";

const BASE = "https://www.simfinly.com";

const STATS = [
  { value: "1,4107 €", label: "Valeur du point 2026", note: "Revalorisé de +2,2 % en nov. 2025" },
  { value: "37 M", label: "Bénéficiaires", note: "Actifs et retraités couverts" },
  { value: "60–35 %", label: "Part de la retraite", note: "Complémentaire / total (cadres)" },
  { value: "4 500 pts", label: "Carrière moyenne", note: "~530 €/mois à la liquidation" },
];

const FAQ = [
  {
    q: "Quelle est la valeur du point Agirc-Arrco en 2026 ?",
    a: "La valeur de service du point Agirc-Arrco est de 1,4107 € en 2026, revalorisée au 1er novembre 2025 (+2,2 % vs 2024). Votre pension annuelle = nombre de points × 1,4107 €.",
  },
  {
    q: "Comment éviter le malus Agirc-Arrco de -10 % ?",
    a: "Le coefficient de solidarité de -10 % s'applique si vous partez dès votre âge légal. Pour l'éviter : attendez 67 ans (taux plein automatique), différez d'1 an votre départ, ou bénéficiez d'une exonération (inaptitude, carrière longue, chômage longue durée).",
  },
  {
    q: "Comment connaître mon nombre de points Agirc-Arrco ?",
    a: "Connectez-vous à votre espace sur agirc-arrco.fr ou consultez votre relevé de carrière sur info-retraite.fr. Tous les points acquis chez tous vos employeurs privés sont regroupés sur un seul compte.",
  },
  {
    q: "Le malus Agirc-Arrco s'applique-t-il à tout le monde ?",
    a: "Non. Le malus ne s'applique pas en cas d'inaptitude, d'invalidité, de carrière longue, de chômage longue durée, de bénéficiaire de l'ASPA, ou d'aidant familial. Il ne s'applique pas non plus à partir de 67 ans.",
  },
  {
    q: "Combien de points Agirc-Arrco accumule-t-on par an ?",
    a: "Cela dépend du salaire. Un salarié au SMIC accumule environ 50–70 points/an. Un cadre avec un salaire de 4 000 €/mois accumule environ 180–220 points/an. Après 40 ans de carrière : 2 000 à 8 800 points respectivement.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Points Agirc-Arrco 2026 : valeur du point, calcul et simulateur",
    description: "Tout comprendre sur les points Agirc-Arrco 2026 : valeur 1,4107 €, malus/bonus, comment calculer sa pension complémentaire et simuler ses droits.",
    author: { "@type": "Organization", name: "Simfinly", url: BASE },
    publisher: { "@type": "Organization", name: "Simfinly", logo: { "@type": "ImageObject", url: `${BASE}/logo-mark.svg` } },
    url: `${BASE}/retraite/points-agirc-arrco`,
    datePublished: "2026-01-15",
    dateModified: "2026-06-01",
    inLanguage: "fr-FR",
    mainEntityOfPage: `${BASE}/retraite/points-agirc-arrco`,
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
      { "@type": "ListItem", position: 2, name: "Retraite", item: `${BASE}/simulateurs/agirc-arrco` },
      { "@type": "ListItem", position: 3, name: "Points Agirc-Arrco 2026", item: `${BASE}/retraite/points-agirc-arrco` },
    ],
  },
];

export default function GuideAgircArrco() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.title = "Points Agirc-Arrco 2026 — valeur du point, calcul et simulateur | simfinly";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Tout comprendre sur les points Agirc-Arrco 2026 : valeur 1,4107 €, coefficient de solidarité (malus), bonus de fidélité, et simulateur de pension complémentaire gratuit.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = `${BASE}/retraite/points-agirc-arrco`;
  }, []);

  const s = {
    page: { minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" },
    wrap: { maxWidth: 820, margin: "0 auto", padding: "0 20px 80px" },
    breadcrumb: { display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: "var(--text-secondary)", padding: "20px 0 0", flexWrap: "wrap" },
    hero: { padding: "32px 0 24px" },
    badge: { display: "inline-block", background: "var(--primary-soft)", color: "var(--primary)", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 14 },
    h1: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px,4.5vw,36px)", fontWeight: 700, lineHeight: 1.2, color: "var(--text)", margin: "0 0 14px", letterSpacing: "-0.02em" },
    sub: { fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 28px" },
    cta: { display: "inline-flex", alignItems: "center", gap: 8, background: "var(--primary)", color: "#fff", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 600, textDecoration: "none", marginBottom: 36, boxShadow: "0 2px 12px rgba(43,92,230,.25)", transition: "opacity .15s" },
    stats: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 40 },
    stat: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" },
    statVal: { fontSize: 22, fontWeight: 700, color: "var(--primary)", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 },
    statLabel: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 },
    statNote: { fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 },
    section: { marginBottom: 0 },
    h2: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(18px,3vw,22px)", fontWeight: 600, color: "var(--text)", margin: "36px 0 14px", lineHeight: 1.3 },
    body: { fontSize: 15, lineHeight: 1.85, color: "var(--text-secondary)" },
    table: { width: "100%", borderCollapse: "collapse", margin: "20px 0", fontSize: 14 },
    th: { background: "var(--primary-soft)", color: "var(--primary)", fontWeight: 600, padding: "10px 16px", textAlign: "left", borderBottom: "2px solid var(--border-gold)" },
    td: { padding: "10px 16px", borderBottom: "1px solid var(--border)", color: "var(--text)" },
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
          <Link to="/simulateurs/agirc-arrco" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Retraite complémentaire</Link>
          <span>›</span>
          <span style={{ color: "var(--text)" }}>Points Agirc-Arrco 2026</span>
        </nav>

        {/* Hero */}
        <div style={s.hero}>
          <span style={s.badge}>Retraite complémentaire</span>
          <h1 style={s.h1}>Points Agirc-Arrco 2026 : valeur du point, calcul et malus</h1>
          <p style={s.sub}>
            La retraite complémentaire Agirc-Arrco représente 30 à 65 % de la pension totale des salariés du privé.
            Comprendre comment fonctionnent vos points est essentiel pour optimiser votre départ.
          </p>
          <Link to="/simulateurs/agirc-arrco" style={s.cta}>
            🏆 Calculer ma retraite Agirc-Arrco
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
        <div style={s.section}>
          <h2 style={s.h2}>Qu'est-ce que l'Agirc-Arrco ?</h2>
          <div style={s.body}>
            <p>L'Agirc-Arrco est le régime de retraite complémentaire obligatoire de tous les salariés du secteur privé (cadres et non-cadres). Né de la fusion en 2019 de deux caisses distinctes, il couvre plus de 37 millions de personnes et verse 85 milliards d'euros de pensions par an.</p>
            <p>Contrairement à la retraite de base (calculée en trimestres et annuités via la CNAV), l'Agirc-Arrco fonctionne en <strong>points</strong> : à chaque cotisation versée, vous acquérez des points. À la retraite, ces points sont multipliés par la valeur de service pour obtenir votre pension annuelle.</p>
          </div>

          <h2 style={s.h2}>La valeur du point Agirc-Arrco en 2026</h2>
          <div style={s.body}>
            <p>Depuis le <strong>1er novembre 2025</strong>, la valeur de service du point est fixée à <strong>1,4107 €</strong> par point et par an, soit une revalorisation de +2,2 % par rapport à novembre 2024 (1,3799 €). Cette indexation est alignée sur l'évolution des prix à la consommation pour préserver le pouvoir d'achat des retraités.</p>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Date de revalorisation</th>
                  <th style={s.th}>Valeur du point</th>
                  <th style={s.th}>Hausse</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1er novembre 2022", "1,2841 €", "+5,12 %"],
                  ["1er novembre 2023", "1,3498 €", "+4,9 %"],
                  ["1er novembre 2024", "1,3799 €", "+2,2 %"],
                  ["1er novembre 2025", "1,4107 €", "+2,2 %"],
                ].map(([d, v, h], i) => (
                  <tr key={i}>
                    <td style={s.td}>{d}</td>
                    <td style={{ ...s.td, fontWeight: i === 3 ? 700 : 400, color: i === 3 ? "var(--primary)" : "var(--text)" }}>{v}</td>
                    <td style={s.td}>{h}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={s.h2}>Comment calculer sa pension Agirc-Arrco ?</h2>
          <div style={s.body}>
            <p>La formule est simple :</p>
            <p style={{ background: "var(--primary-soft)", border: "1px solid var(--border-gold)", borderRadius: 10, padding: "14px 20px", fontWeight: 600, color: "var(--text)" }}>
              Pension annuelle = Nombre de points × 1,4107 €
            </p>
            <p style={{ marginTop: 16 }}>Exemple : avec 4 500 points accumulés sur une carrière, la pension complémentaire sera de :</p>
            <ul>
              <li>4 500 × 1,4107 € = <strong>6 348 €/an</strong>, soit <strong>529 €/mois</strong></li>
            </ul>
            <p>Pour accumuler des points, vous cotisez via votre employeur sur deux tranches :</p>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Tranche</th>
                  <th style={s.th}>Assiette de cotisation</th>
                  <th style={s.th}>Taux total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Tranche 1", "0 à 1 PMSS (3 925 €/mois)", "7,87 %"],
                  ["Tranche 2", "1 à 8 PMSS (31 400 €/mois)", "21,59 %"],
                ].map(([t, a, tx], i) => (
                  <tr key={i}><td style={s.td}>{t}</td><td style={s.td}>{a}</td><td style={s.td}>{tx}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={s.h2}>Coefficient de solidarité (malus) et bonus de fidélité</h2>
          <div style={s.body}>
            <p>Depuis 2019, un système d'incitation au maintien en activité s'applique :</p>
            <ul>
              <li><strong>Malus de -10 %</strong> pendant 3 ans (ou jusqu'à 67 ans) si vous liquidez dès votre âge légal de départ</li>
              <li><strong>Bonus de +10 %</strong> pendant 1 an si vous travaillez 1 an de plus que votre âge de taux plein</li>
              <li><strong>Bonus de +20 %</strong> pendant 1 an pour 2 années supplémentaires</li>
              <li><strong>Bonus de +30 %</strong> pendant 1 an pour 3 années supplémentaires</li>
            </ul>
            <p>Le malus <strong>ne s'applique pas</strong> si vous avez : 67 ans, l'inaptitude ou l'invalidité, une carrière longue, été au chômage longue durée, ou êtes aidant familial. Il ne s'applique pas non plus aux conjoints survivants (réversion).</p>
            <p>Ce mécanisme peut représenter une différence significative : sur une pension de 600 €/mois, le malus coûte 60 €/mois pendant 3 ans, soit 2 160 € au total.</p>
          </div>

          <h2 style={s.h2}>Combien de points ai-je accumulés ?</h2>
          <div style={s.body}>
            <p>Pour connaître votre solde exact, connectez-vous sur <strong>agirc-arrco.fr</strong> ou consultez votre relevé de carrière sur <strong>info-retraite.fr</strong>. Voici des ordres de grandeur par profil :</p>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Profil</th>
                  <th style={s.th}>Points / an</th>
                  <th style={s.th}>Après 40 ans</th>
                  <th style={s.th}>Pension mensuelle</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Salarié au SMIC", "~55 pts", "~2 200 pts", "~259 €/mois"],
                  ["Salarié à 2 500 €/mois", "~120 pts", "~4 800 pts", "~565 €/mois"],
                  ["Cadre à 4 500 €/mois", "~250 pts", "~10 000 pts", "~1 176 €/mois"],
                  ["Cadre supérieur à 8 000 €/mois", "~570 pts", "~22 800 pts", "~2 682 €/mois"],
                ].map((row, i) => (
                  <tr key={i}>{row.map((cell, j) => <td key={j} style={s.td}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={s.h2}>Agirc-Arrco et stratégie de départ</h2>
          <div style={s.body}>
            <p>Votre stratégie optimale dépend de l'articulation entre retraite de base (CNAV) et complémentaire (Agirc-Arrco) :</p>
            <ul>
              <li>Si vous partez dès l'âge légal (62–64 ans selon votre génération) <strong>sans avoir tous vos trimestres</strong> pour le taux plein CNAV, vous subissez une décote CNAV ET un malus Agirc-Arrco. Double pénalité.</li>
              <li>Si vous partez à <strong>67 ans</strong> (taux plein automatique CNAV), le malus Agirc-Arrco disparaît, même si vous n'avez pas tous vos trimestres.</li>
              <li>Travailler 1 an de plus après le taux plein donne un <strong>bonus Agirc-Arrco de +10 %</strong> ET éventuellement une surcote CNAV (+1,25 %/trimestre).</li>
            </ul>
            <p>Utilisez le simulateur Agirc-Arrco de simfinly pour comparer précisément plusieurs scénarios de départ.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={s.faqSection}>
          <h2 style={s.faqH2}>Questions fréquentes sur les points Agirc-Arrco</h2>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={s.faqItem}>
              <div style={s.faqQ}>{q}</div>
              <div style={s.faqA}>{a}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={s.ctaBox}>
          <div style={s.ctaBoxTitle}>Calculez votre retraite Agirc-Arrco en 2 minutes</div>
          <p style={s.ctaBoxSub}>
            Renseignez votre salaire, votre année de naissance et obtenez une estimation de votre pension
            complémentaire avec et sans malus, selon différents âges de départ.
          </p>
          <Link to="/simulateurs/agirc-arrco" style={{ ...s.cta, marginBottom: 0 }}>
            Lancer le simulateur gratuit →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
