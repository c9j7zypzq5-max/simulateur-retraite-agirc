import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import JsonLd from "../components/JsonLd.jsx";
import TableOfContents from "../components/TableOfContents.jsx";

const BASE = "https://www.simfinly.com";

const TOC_ITEMS = [
  { id: "simulateurs", label: "Les simulateurs immobilier" },
  { id: "capacite-emprunt", label: "Capacité d'emprunt : le calcul de référence" },
  { id: "frais-notaire", label: "Frais de notaire" },
  { id: "ptz", label: "Le PTZ" },
  { id: "investissement-locatif", label: "Investissement locatif : rendement et fiscalité" },
  { id: "etapes", label: "Les 5 étapes pour préparer un achat" },
  { id: "comparatifs", label: "Comparatifs immobilier" },
  { id: "lexique", label: "Lexique immobilier" },
];

const STATS = [
  { value: "35 %", label: "Taux d'endettement maximum", note: "Plafond HCSF, assurance comprise" },
  { value: "6,32 %", label: "Droits de mutation (ancien)", note: "Majorité des départements depuis 2025" },
  { value: "0,715 %", label: "Droits de mutation (neuf)", note: "TVA déjà incluse dans le prix" },
  { value: "50 %", label: "PTZ — quotité maximale", note: "Zone tendue, tranche de revenus la plus basse" },
];

const FAQ = [
  {
    q: "Comment calculer sa capacité d'emprunt en 2026 ?",
    a: "La capacité d'emprunt dépend du taux d'endettement maximum (35 % des revenus nets, assurance comprise, plafond fixé par le HCSF), du taux d'intérêt et de la durée du prêt. À mensualité maximale identique, allonger la durée augmente le montant empruntable mais aussi le coût total des intérêts. Le simulateur d'emprunt immobilier de simfinly calcule ce montant en tenant compte de vos revenus, charges et apport.",
  },
  {
    q: "Quels sont les frais de notaire en 2026 ?",
    a: "Dans l'ancien, les frais de notaire représentent 7 à 8 % du prix d'achat, dont l'essentiel (droits de mutation) est un impôt reversé à l'État et aux collectivités : 6,32 % dans la majorité des départements ayant voté la hausse de 2025, 5,81 % dans une minorité. Dans le neuf, les droits de mutation tombent à 0,715 %, ramenant les frais totaux à 2-3 % du prix.",
  },
  {
    q: "Qui peut bénéficier du PTZ (Prêt à Taux Zéro) ?",
    a: "Le PTZ est réservé aux primo-accédants (n'ayant pas été propriétaires de leur résidence principale les 2 dernières années), sous conditions de ressources. Depuis avril 2025, il est accessible dans toutes les zones géographiques. Son montant dépend de la zone (A, B1, B2, C), du type de bien (neuf ou ancien avec travaux) et de la composition du foyer — jusqu'à 50 % du coût de l'opération pour les revenus les plus modestes en zone tendue.",
  },
  {
    q: "Comment est calculé le rendement locatif ?",
    a: "Le rendement locatif brut = (loyers annuels ÷ prix d'achat) × 100. Le rendement net déduit les charges de copropriété, la taxe foncière, les frais de gestion et la vacance locative — il est généralement inférieur de 2 à 3 points au rendement brut. Le simulateur rendement locatif de simfinly calcule les deux, ainsi que le cash-flow mensuel après crédit.",
  },
  {
    q: "Qu'est-ce que le déficit foncier et comment l'utiliser ?",
    a: "En location nue au régime réel, si les charges déductibles (travaux, intérêts d'emprunt, taxe foncière) dépassent les loyers perçus, le déficit qui en résulte est imputable sur le revenu global dans la limite de 10 700 €/an (21 400 € pour le régime « louer abordable »). Le surplus éventuel est reportable sur les revenus fonciers des 10 années suivantes.",
  },
];

const SIMULATEURS = [
  { path: "/simulateurs/emprunt-immobilier", label: "Emprunt immobilier", emoji: "🏠", desc: "Mensualité, capacité d'emprunt et tableau d'amortissement" },
  { path: "/simulateurs/ptz", label: "Prêt à Taux Zéro", emoji: "🔑", desc: "Éligibilité, zone et montant du PTZ 2026" },
  { path: "/simulateurs/frais-notaire", label: "Frais de notaire", emoji: "📜", desc: "Ancien vs neuf, droits de mutation par département" },
  { path: "/simulateurs/rendement-locatif", label: "Rendement locatif", emoji: "📈", desc: "Rendement brut, net et cash-flow d'un investissement" },
  { path: "/simulateurs/deficit-foncier", label: "Déficit foncier", emoji: "🧾", desc: "Optimiser la déduction fiscale des travaux" },
  { path: "/simulateurs/plus-value-immobiliere", label: "Plus-value immobilière", emoji: "💰", desc: "Impôt et abattements selon la durée de détention" },
];

const ETAPES = [
  { num: "1", title: "Évaluez votre capacité d'emprunt", desc: "Simulez votre mensualité maximale (35 % de vos revenus nets) pour connaître le budget total accessible avant de visiter des biens." },
  { num: "2", title: "Vérifiez votre éligibilité au PTZ", desc: "Primo-accédant ? Vérifiez la zone du bien et vos revenus : le PTZ peut financer jusqu'à 50 % de l'opération sans intérêts." },
  { num: "3", title: "Anticipez les frais d'acquisition", desc: "Comptez 7-8 % du prix dans l'ancien, 2-3 % dans le neuf — un poste souvent sous-estimé qui doit être couvert par l'apport." },
  { num: "4", title: "Comparez neuf et ancien", desc: "Le neuf coûte plus cher au m² mais réduit fortement les frais de notaire et n'a pas de travaux à prévoir à court terme." },
  { num: "5", title: "Pour un investissement locatif, calculez le rendement net", desc: "Le rendement brut affiché par les annonces ignore charges, vacance et fiscalité — calculez toujours le rendement net et le cash-flow réel." },
];

const TERMES_LEXIQUE = [
  ["taeg", "TAEG"],
  ["ptz", "PTZ"],
  ["taux-endettement", "Taux d'endettement"],
  ["capacite-emprunt", "Capacité d'emprunt"],
  ["frais-notaire", "Frais de notaire"],
  ["rendement-locatif", "Rendement locatif"],
  ["lmnp", "LMNP"],
  ["deficit-foncier", "Déficit foncier"],
  ["plus-value-immobiliere", "Plus-value immobilière"],
  ["dpe", "DPE"],
];

const COMPARATIFS_IMMO = [
  ["louer-ou-acheter", "Louer ou acheter ?"],
  ["scpi-vs-immobilier-direct", "SCPI ou immobilier direct ?"],
  ["lmnp-vs-location-nue", "LMNP ou location nue ?"],
  ["deficit-foncier-vs-micro-foncier", "Déficit foncier ou micro-foncier ?"],
  ["dpe-travaux-ou-vendre", "Rénover ou vendre (DPE) ?"],
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Guide complet immobilier 2026 : emprunt, frais de notaire, PTZ et fiscalité",
    description: "Tout sur l'achat immobilier en 2026 : capacité d'emprunt, frais de notaire, PTZ, rendement locatif et plus-value.",
    author: { "@type": "Organization", name: "Simfinly", url: BASE },
    publisher: { "@type": "Organization", name: "Simfinly", logo: { "@type": "ImageObject", url: `${BASE}/logo-mark.svg` } },
    url: `${BASE}/immobilier/guide-complet-2026`,
    datePublished: "2026-07-04",
    dateModified: "2026-07-04",
    inLanguage: "fr-FR",
    mainEntityOfPage: `${BASE}/immobilier/guide-complet-2026`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Comment préparer un achat immobilier en 2026",
    description: "Les 5 étapes pour préparer un achat immobilier en France en 2026.",
    step: ETAPES.map(e => ({ "@type": "HowToStep", position: parseInt(e.num), name: e.title, text: e.desc })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
      { "@type": "ListItem", position: 2, name: "Simulateurs immobilier", item: `${BASE}/simulateurs/emprunt-immobilier` },
      { "@type": "ListItem", position: 3, name: "Guide complet immobilier 2026", item: `${BASE}/immobilier/guide-complet-2026` },
    ],
  },
];

export default function GuideImmobilier2026() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.title = "Guide immobilier 2026 : emprunt, frais de notaire, PTZ | simfinly";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Tout sur l'achat immobilier 2026 : capacité d'emprunt (35 % max), frais de notaire (6,32 % DMTO), PTZ jusqu'à 50 %, rendement locatif et plus-value.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = `${BASE}/immobilier/guide-complet-2026`;
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
          <span style={{ color: "var(--text)" }}>Guide immobilier 2026</span>
        </nav>

        <div style={s.hero}>
          <span style={s.badge}>Guide complet</span>
          <h1 style={s.h1}>Immobilier 2026 : emprunt, frais de notaire et fiscalité</h1>
          <p style={s.sub}>
            Capacité d'emprunt, PTZ, frais de notaire, rendement locatif, déficit foncier et plus-value —
            le guide complet pour acheter, financer et rentabiliser un bien immobilier en France en 2026.
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

        <h2 id="simulateurs" style={s.h2}>Les simulateurs immobilier disponibles sur simfinly</h2>
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

        <h2 id="capacite-emprunt" style={s.h2}>Capacité d'emprunt : le calcul de référence</h2>
        <div style={s.body}>
          <p>Depuis janvier 2022, le Haut Conseil de Stabilité Financière (HCSF) impose aux banques un <strong>taux d'endettement maximum de 35 %</strong> (assurance emprunteur incluse), sauf dérogations marginales accordées par les banques (dossiers à hauts revenus notamment).</p>
          <div style={s.formula}>Mensualité maximale = Revenus nets mensuels × 35 %</div>
          <div style={s.infoBox}>
            <strong>💡 Exemple :</strong> avec 3 000 €/mois de revenus nets, la mensualité maximale est de 1 050 €.
            À 3,3 % sur 20 ans, cela correspond à une capacité d'emprunt d'environ 184 000 € ;
            sur 25 ans, environ 214 000 € (mensualité identique, coût total des intérêts plus élevé).
          </div>
          <p>Allonger la durée du prêt augmente le montant empruntable à mensualité égale, mais alourdit le coût total du crédit — un arbitrage à faire au cas par cas avec le simulateur d'emprunt immobilier.</p>
        </div>

        <h2 id="frais-notaire" style={s.h2}>Frais de notaire : 7-8 % dans l'ancien, 2-3 % dans le neuf</h2>
        <div style={s.body}>
          <p>Les « frais de notaire » sont en réalité des frais d'acquisition, dont le notaire ne conserve qu'une faible part. Environ 80 % du montant correspond aux droits de mutation à titre onéreux (DMTO), un impôt reversé au département, à la commune et à l'État.</p>
          <table style={s.table}>
            <thead><tr><th style={s.th}>Type de bien</th><th style={s.th}>Droits de mutation</th><th style={s.th}>Frais totaux</th></tr></thead>
            <tbody>
              <tr><td style={s.td}>Ancien (majorité des départements)</td><td style={s.td}>6,32 %</td><td style={s.td}>≈ 7-8 % du prix</td></tr>
              <tr><td style={s.td}>Ancien (départements sans la hausse 2025)</td><td style={s.td}>5,81 %</td><td style={s.td}>≈ 7-7,5 % du prix</td></tr>
              <tr><td style={s.td}>Neuf (VEFA)</td><td style={s.td}>0,715 %</td><td style={s.td}>≈ 2-3 % du prix</td></tr>
            </tbody>
          </table>
          <div style={s.warnBox}>
            <strong>⚠️ À anticiper :</strong> les frais de notaire s'ajoutent au prix d'achat et doivent être couverts par l'apport personnel — les banques financent rarement au-delà du prix du bien lui-même.
          </div>
        </div>

        <h2 id="ptz" style={s.h2}>Le PTZ : jusqu'à 50 % de l'achat sans intérêts</h2>
        <div style={s.body}>
          <p>Le Prêt à Taux Zéro est réservé aux primo-accédants sous conditions de ressources. Depuis avril 2025, il est accessible dans toutes les zones (A, B1, B2, C). La quotité finançable dépend de la zone, du type de bien et de la tranche de revenus :</p>
          <ul>
            <li><strong>Quotité maximale</strong> : 50 % du coût de l'opération pour les revenus les plus modestes</li>
            <li><strong>Ancien avec travaux</strong> : éligible uniquement en zones B2 et C, travaux ≥ 25 % du coût total</li>
            <li><strong>Plafond de l'opération</strong> : de 100 000 € (zone C) à 150 000 € (zone A), majoré selon la composition du foyer</li>
          </ul>
          <p>Utilisez le simulateur PTZ pour vérifier votre éligibilité exacte selon votre zone et vos revenus.</p>
        </div>

        <h2 id="investissement-locatif" style={s.h2}>Investissement locatif : rendement et fiscalité</h2>
        <div style={s.body}>
          <p>Le rendement locatif brut ignore les charges — c'est le rendement net qui reflète la rentabilité réelle :</p>
          <div style={s.formula}>Rendement net ≈ Rendement brut − 2 à 3 points (charges, taxe foncière, gestion, vacance)</div>
          <p>Côté fiscalité, le régime réel en location nue permet de déduire les charges (intérêts, travaux, taxe foncière) ; un déficit qui en résulte est imputable sur le revenu global dans la limite de <strong>10 700 €/an</strong> (21 400 € en régime « louer abordable »). En LMNP (location meublée), l'amortissement du bien permet souvent de neutraliser l'imposition des loyers pendant plusieurs années.</p>
        </div>

        <h2 id="etapes" style={s.h2}>Les 5 étapes pour préparer un achat immobilier</h2>
        <div style={s.etapes}>
          {ETAPES.map((e, i) => (
            <div key={i} style={s.etape}>
              <div style={s.etapeNum}>{e.num}</div>
              <div><div style={s.etapeTitle}>{e.title}</div><div style={s.etapeDesc}>{e.desc}</div></div>
            </div>
          ))}
        </div>

        <h2 id="comparatifs" style={s.h2}>Comparatifs immobilier</h2>
        <div style={s.body}>
          <p>Pour arbitrer entre deux stratégies concrètes :</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {COMPARATIFS_IMMO.map(([slug, label]) => (
              <Link key={slug} to={`/comparatifs/${slug}`} style={chip}>{label}</Link>
            ))}
          </div>
        </div>

        <h2 id="lexique" style={s.h2}>Lexique immobilier</h2>
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
            <Link to="/blog" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Articles immobilier du blog →</Link>
          </p>
        </div>

        <div style={s.faqSection}>
          <h2 style={s.faqH2}>Questions fréquentes sur l'immobilier 2026</h2>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={s.faqItem}><div style={s.faqQ}>{q}</div><div style={s.faqA}>{a}</div></div>
          ))}
        </div>

        <div style={s.ctaBox}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
            Calculez votre capacité d'emprunt en 3 minutes
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>
            Renseignez vos revenus, charges et apport pour un calcul personnalisé de mensualité et de budget total.
          </p>
          <Link to="/simulateurs/emprunt-immobilier" style={s.cta}>Lancer le simulateur emprunt →</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
