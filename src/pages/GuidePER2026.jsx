import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import JsonLd from "../components/JsonLd.jsx";

const BASE = "https://www.simfinly.com";

const STATS = [
  { value: "10 %", label: "Plafond déductibilité", note: "Du revenu net imposable (max 35 194 €)" },
  { value: "3 types", label: "PER disponibles", note: "PER individuel, PER collectif, PER obligatoire" },
  { value: "64 ans", label: "Déblocage standard", note: "À l'âge légal de départ en retraite" },
  { value: "6 cas", label: "Déblocages anticipés", note: "Dont achat résidence principale" },
];

const FAQ = [
  {
    q: "Qu'est-ce que le PER (Plan d'Épargne Retraite) ?",
    a: "Le PER est un produit d'épargne retraite individuel créé par la loi PACTE en 2019, qui remplace les anciens PERP, Madelin, PERCO et Article 83. Il permet de constituer une épargne en vue de la retraite avec des avantages fiscaux à l'entrée (déduction des versements du revenu imposable) et de la flexibilité en sortie (capital ou rente).",
  },
  {
    q: "Les versements PER sont-ils déductibles des impôts ?",
    a: "Oui. Les versements volontaires sur un PER individuel sont déductibles de votre revenu imposable, dans la limite de 10 % de votre revenu net imposable de l'année précédente (avec un minimum de 10 % du PASS et un maximum de 10 % × 8 PASS = 35 194 € en 2026). Plus votre tranche marginale d'imposition est élevée, plus l'avantage est important : 30 % TMI = 300 € économisés pour 1 000 € versés.",
  },
  {
    q: "Peut-on sortir son PER en capital à la retraite ?",
    a: "Oui. Depuis la loi PACTE, la sortie en capital est possible pour les versements volontaires et l'épargne salariale (hors abondement et versements obligatoires qui restent en rente). Au moment de la retraite, vous pouvez choisir : tout en rente, tout en capital (imposable à l'IR sur la part correspondant aux versements déductibles), ou un mix. Le capital correspondant aux gains est soumis au PFU (30 %) ou au barème progressif.",
  },
  {
    q: "Qu'est-ce que le déblocage anticipé PER pour achat résidence principale ?",
    a: "Le PER permet un déblocage anticipé (avant la retraite) pour financer l'acquisition de votre résidence principale — c'est l'un des 6 cas de déblocage anticipé légaux. Seuls les versements volontaires et l'épargne salariale peuvent être débloqués pour ce motif (pas les versements obligatoires). Les sommes retirées sont imposées à l'IR sur la part déductible, et les gains sont soumis au PFU de 30 %.",
  },
  {
    q: "PER individuel vs assurance-vie : lequel choisir ?",
    a: "Règle de base : si votre TMI actuelle > 30 %, privilégiez le PER (économie fiscale immédiate importante). Si votre TMI est ≤ 11 %, privilégiez l'assurance-vie (plus de souplesse, pas d'imposition à l'entrée). Pour les TMI intermédiaires (30 %), comparez les deux scénarios avec notre simulateur PER vs assurance-vie. En pratique, les deux sont complémentaires : le PER pour l'avantage fiscal, l'assurance-vie pour la liquidité.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "PER 2026 : guide complet du Plan d'Épargne Retraite — avantages, fiscalité et comparatif",
    description: "Guide PER 2026 : avantages fiscaux (10 % déductibles), types de PER, différence PER individuel vs assurance-vie, déblocages anticipés et simulateur gratuit.",
    author: { "@type": "Organization", name: "Simfinly", url: BASE },
    publisher: { "@type": "Organization", name: "Simfinly", logo: { "@type": "ImageObject", url: `${BASE}/logo-mark.svg` } },
    url: `${BASE}/epargne/guide-per-2026`,
    datePublished: "2026-01-25",
    dateModified: "2026-06-29",
    inLanguage: "fr-FR",
    mainEntityOfPage: `${BASE}/epargne/guide-per-2026`,
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
      { "@type": "ListItem", position: 2, name: "Simulateur PER", item: `${BASE}/simulateurs/per` },
      { "@type": "ListItem", position: 3, name: "Guide PER 2026", item: `${BASE}/epargne/guide-per-2026` },
    ],
  },
];

export default function GuidePER2026() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.title = "PER 2026 — guide complet, avantages fiscaux et simulateur | simfinly";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Tout sur le PER en 2026 : déduction fiscale jusqu'à 35 194 €, 3 types de PER, sortie capital/rente, déblocages anticipés (résidence principale) et comparatif PER vs assurance-vie.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = `${BASE}/epargne/guide-per-2026`;
  }, []);

  const s = {
    page: { minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" },
    wrap: { maxWidth: 820, margin: "0 auto", padding: "0 20px 80px" },
    breadcrumb: { display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: "var(--text-secondary)", padding: "20px 0 0", flexWrap: "wrap" },
    hero: { padding: "32px 0 24px" },
    badge: { display: "inline-block", background: "var(--positive-soft)", color: "var(--positive)", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 14 },
    h1: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px,4.5vw,36px)", fontWeight: 700, lineHeight: 1.2, color: "var(--text)", margin: "0 0 14px", letterSpacing: "-0.02em" },
    sub: { fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 28px" },
    cta: { display: "inline-flex", alignItems: "center", gap: 8, background: "var(--primary)", color: "#fff", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 600, textDecoration: "none", marginBottom: 36, boxShadow: "0 2px 12px rgba(43,92,230,.25)" },
    stats: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 40 },
    stat: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" },
    statVal: { fontSize: 22, fontWeight: 700, color: "var(--positive)", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 },
    statLabel: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 },
    statNote: { fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 },
    h2: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(18px,3vw,22px)", fontWeight: 600, color: "var(--text)", margin: "36px 0 14px", lineHeight: 1.3 },
    body: { fontSize: 15, lineHeight: 1.85, color: "var(--text-secondary)" },
    table: { width: "100%", borderCollapse: "collapse", margin: "20px 0", fontSize: 14 },
    th: { background: "var(--positive-soft)", color: "var(--positive)", fontWeight: 600, padding: "10px 16px", textAlign: "left", borderBottom: "2px solid #bbf7d0" },
    td: { padding: "10px 16px", borderBottom: "1px solid var(--border)", color: "var(--text)" },
    infoBox: { background: "var(--primary-soft)", border: "1px solid var(--border-gold)", borderRadius: 10, padding: "14px 20px", margin: "16px 0", fontSize: 14, color: "var(--text)", lineHeight: 1.7 },
    warnBox: { background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "14px 20px", margin: "16px 0", fontSize: 14, color: "var(--text)", lineHeight: 1.7 },
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
        <nav style={s.breadcrumb} aria-label="Fil d'Ariane">
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          <span>›</span>
          <Link to="/simulateurs/per" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>PER</Link>
          <span>›</span>
          <span style={{ color: "var(--text)" }}>Guide PER 2026</span>
        </nav>

        <div style={s.hero}>
          <span style={s.badge}>Épargne retraite</span>
          <h1 style={s.h1}>PER 2026 : guide complet du Plan d'Épargne Retraite</h1>
          <p style={s.sub}>
            Le PER est le produit d'épargne retraite le plus avantageux fiscalement en France. Versements déductibles jusqu'à 35 194 €/an,
            sortie en capital ou en rente, déblocage anticipé possible — voici tout ce que vous devez savoir.
          </p>
          <Link to="/simulateurs/per" style={s.cta}>
            📈 Simuler mon économie d'impôts avec le PER
          </Link>
        </div>

        <div style={s.stats}>
          {STATS.map((st, i) => (
            <div key={i} style={s.stat}>
              <div style={s.statVal}>{st.value}</div>
              <div style={s.statLabel}>{st.label}</div>
              <div style={s.statNote}>{st.note}</div>
            </div>
          ))}
        </div>

        <h2 style={s.h2}>Qu'est-ce que le PER ?</h2>
        <div style={s.body}>
          <p>Le Plan d'Épargne Retraite (PER) a été créé par la loi PACTE du 22 mai 2019 pour simplifier et unifier l'épargne retraite en France. Il remplace depuis le 1er octobre 2020 les anciens produits (PERP, contrat Madelin, PERCO, article 83), tout en permettant le transfert des anciens contrats.</p>
          <p>Il existe trois types de PER :</p>
          <ul>
            <li><strong>PER individuel (PERIN)</strong> : souscrit à titre personnel auprès d'un assureur ou d'un gestionnaire. Le plus courant pour les particuliers.</li>
            <li><strong>PER collectif (PERCOL)</strong> : mis en place par l'employeur, alimenté par l'épargne salariale (intéressement, participation). Anciennement PERCO.</li>
            <li><strong>PER obligatoire (PERO)</strong> : certaines catégories de salariés ont l'obligation d'y adhérer. Anciennement article 83.</li>
          </ul>
        </div>

        <h2 style={s.h2}>L'avantage fiscal du PER individuel en 2026</h2>
        <div style={s.body}>
          <p>Le principal attrait du PER est la <strong>déductibilité des versements volontaires</strong> de votre revenu imposable. Concrètement :</p>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Revenu imposable</th>
                <th style={s.th}>Plafond déductible</th>
                <th style={s.th}>TMI</th>
                <th style={s.th}>Économie max</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["30 000 €", "3 000 €", "11 %", "330 €/an"],
                ["50 000 €", "5 000 €", "30 %", "1 500 €/an"],
                ["80 000 €", "8 000 €", "30 %", "2 400 €/an"],
                ["120 000 €", "12 000 €", "41 %", "4 920 €/an"],
                ["200 000 €+", "35 194 €", "45 %", "15 837 €/an"],
              ].map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j} style={s.td}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <div style={s.infoBox}>
            <strong>💡 À ne pas oublier :</strong> Si vous n'avez pas utilisé tout votre plafond sur les 3 dernières années, le reliquat est reportable. Vous pouvez donc "rattraper" des années faibles en effectuant des versements plus importants une année donnée. Votre plafond exact figure sur votre avis d'imposition.
          </div>
        </div>

        <h2 style={s.h2}>Les 6 cas de déblocage anticipé du PER</h2>
        <div style={s.body}>
          <p>Le PER est normalement bloqué jusqu'à la retraite. Mais 6 situations permettent un déblocage anticipé :</p>
          <ol>
            <li><strong>Achat de la résidence principale</strong> (pour les versements volontaires uniquement)</li>
            <li><strong>Invalidité</strong> de 2e ou 3e catégorie du titulaire, de son conjoint ou de ses enfants</li>
            <li><strong>Décès du conjoint</strong> ou du partenaire de PACS</li>
            <li><strong>Expiration des droits au chômage</strong></li>
            <li><strong>Surendettement</strong></li>
            <li><strong>Liquidation judiciaire</strong> d'une entreprise individuelle</li>
          </ol>
          <div style={s.warnBox}>
            <strong>⚠️ Fiscalité du déblocage anticipé :</strong> En cas de déblocage pour résidence principale, les versements déductibles sont imposés à l'IR (sans les 10 % d'abattement), et les plus-values sont soumises au PFU (30 %). Ce n'est pas un déblocage totalement neutre fiscalement.
          </div>
        </div>

        <h2 style={s.h2}>Sortie en rente ou en capital : que choisir ?</h2>
        <div style={s.body}>
          <p>À la retraite, vous pouvez opter pour :</p>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Mode de sortie</th>
                <th style={s.th}>Avantages</th>
                <th style={s.th}>Fiscalité</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Rente viagère", "Revenu garanti à vie, simple", "IR après abattement 10 % (comme retraite)"],
                ["Capital (versements déductibles)", "Liberté totale d'utilisation", "IR sur le capital, PFU 30 % sur les gains"],
                ["Mix rente + capital", "Équilibre flexibilité/sécurité", "Règles des deux modes combinées"],
              ].map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j} style={s.td}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <p>Pour la rente, votre âge à la liquidation détermine le montant (table de mortalité de l'assureur). Un capital de 100 000 € converti en rente à 65 ans génère environ 350–450 €/mois à vie.</p>
        </div>

        <h2 style={s.h2}>PER individuel vs assurance-vie : comparatif complet</h2>
        <div style={s.body}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Critère</th>
                <th style={s.th}>PER individuel</th>
                <th style={s.th}>Assurance-vie</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Déduction fiscale versements", "Oui (jusqu'à 35 194 €/an)", "Non"],
                ["Disponibilité avant retraite", "Bloqué (6 exceptions)", "Libre à tout moment"],
                ["Fiscalité à la sortie (retraite)", "IR sur capital + PFU sur gains", "Avantageuse après 8 ans (abattement 4 600 €)"],
                ["Plafond de versements", "Aucun (plafond déduction)", "Aucun"],
                ["Succession", "Intégré à la succession", "Jusqu'à 152 500 € hors succession/bénéficiaire"],
                ["Adapté pour", "TMI ≥ 30 %, épargne long terme", "Tous profils, épargne flexible"],
              ].map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j} style={s.td}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <p>La règle d'or : si votre TMI à l'entrée (aujourd'hui) est supérieure à votre TMI à la sortie (à la retraite), le PER est avantageux. La plupart des actifs en phase de pic de revenus (40–60 ans) sont dans ce cas. Utilisez le <Link to="/simulateurs/per" style={{ color: "var(--primary)" }}>simulateur PER</Link> pour comparer les deux scénarios sur votre durée d'épargne.</p>
        </div>

        <div style={s.faqSection}>
          <h2 style={s.faqH2}>Questions fréquentes sur le PER 2026</h2>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={s.faqItem}>
              <div style={s.faqQ}>{q}</div>
              <div style={s.faqA}>{a}</div>
            </div>
          ))}
        </div>

        <div style={s.ctaBox}>
          <div style={s.ctaBoxTitle}>Calculez votre économie d'impôts avec le PER</div>
          <p style={s.ctaBoxSub}>
            Comparez PER vs assurance-vie sur 10, 20 ou 30 ans selon votre tranche marginale d'imposition.
          </p>
          <Link to="/simulateurs/per" style={{ ...s.cta, marginBottom: 0 }}>
            Lancer le simulateur PER →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
