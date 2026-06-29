import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import JsonLd from "../components/JsonLd.jsx";

const BASE = "https://www.simfinly.com";

const STATS = [
  { value: "64 ans", label: "Âge légal 2026", note: "Pour les nés après le 1er sept. 1961" },
  { value: "172 trimestres", label: "Taux plein générations 1965+", note: "43 années de cotisation" },
  { value: "50 %", label: "Taux de liquidation CNAV", note: "Taux plein sur le SAM (25 meilleures années)" },
  { value: "1,4107 €", label: "Valeur point Agirc-Arrco 2026", note: "Retraite complémentaire salariés privés" },
];

const FAQ = [
  {
    q: "Quel est l'âge de départ à la retraite en 2026 ?",
    a: "En 2026, l'âge légal de départ à la retraite est de 63 ans pour ceux nés entre le 1er septembre 1961 et le 31 décembre 1961, et de 64 ans pour ceux nés à partir du 1er janvier 1962. L'âge du taux plein automatique (sans décote quelle que soit votre durée de cotisation) reste fixé à 67 ans.",
  },
  {
    q: "Comment calculer sa retraite de base CNAV ?",
    a: "La pension CNAV = SAM × Taux × (Durée assurée / Durée de référence). SAM = Salaire Annuel Moyen des 25 meilleures années ; Taux = 50 % (taux plein) à 37,5 % (décote max) ; Durée de référence = 172 trimestres (génération 1965+). Le simulateur CNAV de simfinly effectue ce calcul automatiquement.",
  },
  {
    q: "À combien s'élève la retraite moyenne en France en 2026 ?",
    a: "Selon la DREES, la pension de retraite brute moyenne (tous régimes confondus) est d'environ 1 550 €/mois en 2026. Elle varie fortement : les anciens fonctionnaires perçoivent en moyenne 2 200 €/mois, les ex-salariés du privé environ 1 450 €/mois, et les anciens travailleurs indépendants 800–1 000 €/mois.",
  },
  {
    q: "Qu'est-ce que le minimum vieillesse (ASPA) en 2026 ?",
    a: "L'Allocation de Solidarité aux Personnes Âgées (ASPA) garantit un revenu minimum de 1 034 €/mois (personne seule) ou 1 605 €/mois (couple) en 2026. Elle est versée à partir de 65 ans (ou de l'âge légal de départ en retraite) et est soumise à récupération sur succession au-delà de 39 000 €.",
  },
  {
    q: "Qu'est-ce que la surcote retraite ?",
    a: "La surcote est une majoration de pension accordée aux assurés qui continuent à travailler après avoir rempli toutes les conditions du taux plein (durée et âge). Elle est de +1,25 % par trimestre supplémentaire cotisé (soit +5 % par année supplémentaire), sans limite. La surcote s'applique uniquement sur la retraite de base CNAV.",
  },
];

const SIMULATEURS = [
  { path: "/simulateurs/cnav", label: "Retraite de base (CNAV)", emoji: "🏛️", desc: "Calcul pension régime général — salariés du privé" },
  { path: "/simulateurs/agirc-arrco", label: "Agirc-Arrco", emoji: "🏆", desc: "Retraite complémentaire — points et valeur 2026" },
  { path: "/simulateurs/trimestres", label: "Trimestres retraite", emoji: "📅", desc: "Nombre de trimestres cotisés et manquants" },
  { path: "/simulateurs/pension-reversion", label: "Pension de réversion", emoji: "💞", desc: "Droits du conjoint survivant" },
  { path: "/simulateurs/per", label: "PER vs Assurance-vie", emoji: "📈", desc: "Optimiser votre épargne retraite" },
  { path: "/simulateurs/retraite-progressive", label: "Retraite progressive", emoji: "⏩", desc: "Réduire le temps de travail avant la retraite" },
];

const ETAPES = [
  { num: "1", title: "Faites le point sur vos droits acquis", desc: "Consultez votre relevé de carrière sur info-retraite.fr — il récapitule tous vos trimestres et points Agirc-Arrco acquis à ce jour." },
  { num: "2", title: "Calculez votre âge optimal de départ", desc: "Comparez : partir à 62-64 ans avec décote vs. attendre 67 ans pour le taux plein automatique. La différence peut représenter 15-25 % de pension sur 20+ ans." },
  { num: "3", title: "Vérifiez vos régimes spéciaux", desc: "Médecin libéral (CARMF), avocat (CNBF), artisan (SSI), fonctionnaire (CNRACL) ? Chaque régime a ses règles propres — consultez les pages métier de simfinly." },
  { num: "4", title: "Estimez votre taux de remplacement", desc: "Calculez le rapport pension/salaire pour votre situation. Si ce taux est inférieur à 70 %, envisagez un PER ou une assurance-vie pour combler l'écart." },
  { num: "5", title: "Agissez sur les leviers disponibles", desc: "Rachats de trimestres, versements PER, retraite progressive, cumul emploi-retraite — autant de leviers à activer selon votre situation." },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Guide complet retraite 2026 : calcul, simulateurs et optimisation",
    description: "Tout savoir sur la retraite en 2026 : âge légal 64 ans, calcul CNAV et Agirc-Arrco, taux de remplacement, rachat de trimestres et stratégies d'optimisation.",
    author: { "@type": "Organization", name: "Simfinly", url: BASE },
    publisher: { "@type": "Organization", name: "Simfinly", logo: { "@type": "ImageObject", url: `${BASE}/logo-mark.svg` } },
    url: `${BASE}/retraite/guide-complet-2026`,
    datePublished: "2026-01-01",
    dateModified: "2026-06-29",
    inLanguage: "fr-FR",
    mainEntityOfPage: `${BASE}/retraite/guide-complet-2026`,
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
    "@type": "HowTo",
    name: "Comment préparer et calculer sa retraite en 2026",
    description: "Les 5 étapes pour calculer et optimiser sa retraite en France en 2026.",
    step: ETAPES.map(e => ({
      "@type": "HowToStep",
      position: parseInt(e.num),
      name: e.title,
      text: e.desc,
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
      { "@type": "ListItem", position: 2, name: "Simulateurs retraite", item: `${BASE}/simulateurs/cnav` },
      { "@type": "ListItem", position: 3, name: "Guide complet retraite 2026", item: `${BASE}/retraite/guide-complet-2026` },
    ],
  },
];

export default function GuideRetraite2026() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.title = "Guide retraite 2026 : calcul, simulateurs et optimisation | simfinly";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Tout sur la retraite 2026 : âge légal 64 ans, calcul CNAV (50 % × SAM × trimestres) et Agirc-Arrco (points × 1,4107 €), taux de remplacement, rachat de trimestres et PER.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = `${BASE}/retraite/guide-complet-2026`;
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
    h3: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(15px,2.5vw,18px)", fontWeight: 600, color: "var(--text)", margin: "24px 0 10px", lineHeight: 1.3 },
    body: { fontSize: 15, lineHeight: 1.85, color: "var(--text-secondary)" },
    table: { width: "100%", borderCollapse: "collapse", margin: "20px 0", fontSize: 14 },
    th: { background: "var(--primary-soft)", color: "var(--primary)", fontWeight: 600, padding: "10px 16px", textAlign: "left", borderBottom: "2px solid var(--border-gold)" },
    td: { padding: "10px 16px", borderBottom: "1px solid var(--border)", color: "var(--text)" },
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

  return (
    <div style={s.page}>
      {schemas.map((sc, i) => <JsonLd key={i} data={sc} />)}
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={s.wrap}>
        {/* Breadcrumb */}
        <nav style={s.breadcrumb} aria-label="Fil d'Ariane">
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          <span>›</span>
          <Link to="/simulateurs" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Simulateurs</Link>
          <span>›</span>
          <span style={{ color: "var(--text)" }}>Guide retraite 2026</span>
        </nav>

        {/* Hero */}
        <div style={s.hero}>
          <span style={s.badge}>Guide complet</span>
          <h1 style={s.h1}>Retraite 2026 : tout comprendre pour bien préparer la vôtre</h1>
          <p style={s.sub}>
            Âge légal, calcul de la pension CNAV et Agirc-Arrco, rachat de trimestres, taux de remplacement,
            PER, retraite progressive — le guide complet rédigé par nos experts pour toutes les générations.
          </p>
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

        {/* Simulateurs */}
        <h2 style={s.h2}>Les simulateurs retraite disponibles sur simfinly</h2>
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

        {/* Content */}
        <h2 style={s.h2}>Les fondamentaux de la retraite en France (2026)</h2>
        <div style={s.body}>
          <p>Le système de retraite français repose sur la <strong>répartition</strong> : les actifs d'aujourd'hui financent les pensions des retraités d'aujourd'hui. Il est organisé en plusieurs régimes obligatoires selon votre statut professionnel :</p>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Statut</th>
                <th style={s.th}>Régime de base</th>
                <th style={s.th}>Régime complémentaire</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Salarié privé (CDI, CDD)", "CNAV (Sécurité Sociale)", "Agirc-Arrco"],
                ["Fonctionnaire d'État", "SRE / CNRACL", "RAFP (retraite additionnelle)"],
                ["Artisan / Commerçant", "SSI (ex-RSI)", "SSI complémentaire"],
                ["Médecin libéral", "CNAV + CARMF", "CARMF section C"],
                ["Avocat", "CNBF (retraite de base)", "CNBF (retraite complémentaire)"],
                ["Agriculteur", "MSA (régime de base)", "MSA complémentaire"],
              ].map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j} style={s.td}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={s.h2}>Calcul de la retraite de base CNAV</h2>
        <div style={s.body}>
          <p>Pour les salariés du privé, la pension de base CNAV se calcule selon la formule :</p>
          <div style={s.formula}>
            Pension annuelle = SAM × Taux × (Trimestres assurés / Trimestres de référence)
          </div>
          <p>Avec :</p>
          <ul>
            <li><strong>SAM</strong> = Salaire Annuel Moyen des 25 meilleures années (limité au PASS, soit 47 100 €/an en 2026)</li>
            <li><strong>Taux</strong> = 50 % si taux plein, jusqu'à 37,5 % avec décote maximale (20 trimestres manquants)</li>
            <li><strong>Trimestres de référence</strong> = 172 pour les générations nées à partir de 1965</li>
          </ul>
          <div style={s.infoBox}>
            <strong>💡 Exemple :</strong> SAM de 35 000 €, 172 trimestres (taux plein), génération 1965+.<br/>
            Pension = 35 000 × 50 % × (172/172) = <strong>17 500 €/an</strong> soit <strong>1 458 €/mois</strong>
          </div>
          <p>Attention : le SAM est calculé sur votre salaire brut plafonné au Plafond de la Sécurité Sociale (PASS = 47 100 €/an en 2026). Un cadre gagnant 80 000 €/an ne sera pris en compte qu'à hauteur de 47 100 € dans le calcul CNAV.</p>
        </div>

        <h2 style={s.h2}>L'âge légal en 2026 selon votre génération</h2>
        <div style={s.body}>
          <p>La réforme des retraites de 2023 (loi Borne) a progressivement repoussé l'âge légal de 62 à 64 ans. En 2026 :</p>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Génération</th>
                <th style={s.th}>Âge légal de départ</th>
                <th style={s.th}>Durée requise (taux plein)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Avant le 1er sept. 1961", "62 ans", "168 trimestres"],
                ["1er sept. 1961 – 31 déc. 1961", "62 ans et 3 mois", "168 trimestres"],
                ["1962", "62 ans et 6 mois", "169 trimestres"],
                ["1963", "62 ans et 9 mois", "170 trimestres"],
                ["1964", "63 ans", "171 trimestres"],
                ["1965", "63 ans et 3 mois", "172 trimestres"],
                ["1966", "63 ans et 6 mois", "172 trimestres"],
                ["1967", "63 ans et 9 mois", "172 trimestres"],
                ["À partir de 1968", "64 ans", "172 trimestres"],
              ].map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j} style={s.td}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <div style={s.warnBox}>
            <strong>⚠️ Important :</strong> L'âge légal n'est pas forcément l'âge optimal. Partir exactement à 64 ans sans avoir vos 172 trimestres entraîne une <strong>décote de 1,25 %/trimestre manquant</strong> (jusqu'à -25 % max sur la pension CNAV).
          </div>
        </div>

        <h2 style={s.h2}>Décote, taux plein et surcote : les 3 scénarios</h2>
        <div style={s.body}>
          <p><strong>Décote (ou "coefficient d'abattement")</strong> : si vous partez avant d'avoir tous vos trimestres ET avant 67 ans, votre pension CNAV est réduite de <strong>1,25 % par trimestre manquant</strong> (plafonné à 20 trimestres = -25 %). La décote disparaît à 67 ans (âge du taux plein automatique).</p>
          <p><strong>Taux plein</strong> : vous avez cotisé le nombre de trimestres requis pour votre génération. Taux = 50 %. C'est le scénario optimal pour la plupart des salariés du privé avec une carrière complète.</p>
          <p><strong>Surcote</strong> : vous continuez à travailler après avoir atteint le taux plein. <strong>+1,25 % de pension par trimestre supplémentaire</strong> (soit +5 %/an). Cumulable avec le bonus Agirc-Arrco (+10 à +30 %).</p>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Scénario</th>
                <th style={s.th}>Impact sur pension CNAV</th>
                <th style={s.th}>Impact sur Agirc-Arrco</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Départ à l'âge légal (64 ans) avec taux plein", "+0 % (base 50 %)", "Malus -10 % pendant 3 ans"],
                ["Départ avec 10 trimestres manquants (-12,5 %)", "-12,5 % (43,75 %)", "Malus -10 % pendant 3 ans"],
                ["Départ à 67 ans (taux plein auto)", "Base 50 % garanti", "Pas de malus"],
                ["1 an après le taux plein (surcote +5 %)", "+5 % (52,5 %)", "Bonus +10 % pendant 1 an"],
              ].map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j} style={s.td}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={s.h2}>Rachat de trimestres : est-ce rentable ?</h2>
        <div style={s.body}>
          <p>Le rachat de trimestres CNAV permet d'augmenter votre durée d'assurance et/ou d'améliorer votre taux. Deux types :</p>
          <ul>
            <li><strong>Rachat pour durée manquante</strong> (option 1) : supprime la décote. Plus cher mais élimine une pénalité.</li>
            <li><strong>Rachat pour durée + taux</strong> (option 2) : améliore le taux de liquidation. Encore plus cher.</li>
          </ul>
          <p>Le prix d'un rachat dépend de votre âge au moment du rachat et de votre salaire. En 2026, rachat d'1 trimestre ≈ 3 000 à 12 000 € selon le profil. La rentabilité est généralement positive si vous vivez plus de 15 ans après la retraite et que votre pension augmente d'au moins 150–200 €/mois.</p>
          <p>Utilisez le <Link to="/simulateurs/trimestres" style={{ color: "var(--primary)" }}>simulateur trimestres</Link> pour calculer si un rachat est rentable dans votre situation.</p>
        </div>

        {/* Les 5 étapes */}
        <h2 style={s.h2}>Les 5 étapes pour préparer sa retraite en 2026</h2>
        <div style={s.etapes}>
          {ETAPES.map((e, i) => (
            <div key={i} style={s.etape}>
              <div style={s.etapeNum}>{e.num}</div>
              <div>
                <div style={s.etapeTitle}>{e.title}</div>
                <div style={s.etapeDesc}>{e.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Guides métier */}
        <h2 style={s.h2}>Retraite par profession</h2>
        <div style={s.body}>
          <p>Chaque régime a ses règles propres. Consultez le guide détaillé pour votre profession :</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {[
              ["fonctionnaire", "Fonctionnaire"],
              ["medecin-liberal", "Médecin libéral"],
              ["infirmiere", "Infirmière"],
              ["enseignant", "Enseignant"],
              ["artisan", "Artisan"],
              ["auto-entrepreneur", "Auto-entrepreneur"],
              ["ingenieur-cadre", "Cadre ingénieur"],
              ["agriculteur", "Agriculteur"],
              ["avocat", "Avocat"],
              ["policier", "Policier"],
              ["militaire", "Militaire"],
              ["aide-soignante", "Aide-soignante"],
            ].map(([slug, label]) => (
              <Link key={slug} to={`/retraite/${slug}`} style={{
                background: "var(--chip-bg)", color: "var(--primary)", borderRadius: 20,
                padding: "6px 14px", fontSize: 13, fontWeight: 500, textDecoration: "none",
                border: "1px solid var(--border-gold)",
              }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={s.faqSection}>
          <h2 style={s.faqH2}>Questions fréquentes sur la retraite 2026</h2>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={s.faqItem}>
              <div style={s.faqQ}>{q}</div>
              <div style={s.faqA}>{a}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={s.ctaBox}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
            Estimez votre pension en 3 minutes
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>
            Renseignez votre salaire, vos trimestres et votre année de naissance pour un calcul personnalisé CNAV + Agirc-Arrco.
          </p>
          <Link to="/simulateurs/cnav" style={s.cta}>
            Lancer le simulateur retraite →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
