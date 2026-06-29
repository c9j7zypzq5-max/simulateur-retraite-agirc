import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import JsonLd from "../components/JsonLd.jsx";

const BASE = "https://www.simfinly.com";

const STATS = [
  { value: "5 tranches", label: "Barème 2026", note: "De 0 % à 45 % d'imposition" },
  { value: "11 294 €", label: "Seuil d'imposition", note: "Revenu net imposable par part (2025)" },
  { value: "10 %", label: "Abattement pro auto.", note: "Sur salaires et pensions (plafonné)" },
  { value: "1,0 à 2,5", label: "Parts fiscales", note: "Selon composition du foyer" },
];

const BAREME = [
  ["Jusqu'à 11 294 €", "0 %"],
  ["11 294 € à 28 797 €", "11 %"],
  ["28 797 € à 82 341 €", "30 %"],
  ["82 341 € à 177 106 €", "41 %"],
  ["Plus de 177 106 €", "45 %"],
];

const FAQ = [
  {
    q: "Comment calculer son impôt sur le revenu 2026 ?",
    a: "Étape 1 : calculez votre revenu net imposable (salaire brut − cotisations sociales − 10 % abattement pro, plafonné à 14 426 €). Étape 2 : divisez par votre nombre de parts (quotient familial). Étape 3 : appliquez le barème progressif 2026. Étape 4 : multipliez par le nombre de parts. Utilisez le simulateur impôt sur le revenu de simfinly pour un calcul automatisé.",
  },
  {
    q: "Qu'est-ce que la tranche marginale d'imposition (TMI) ?",
    a: "La TMI est le taux applicable sur le dernier euro de revenu imposable — ce n'est pas le taux moyen sur l'ensemble de vos revenus. Exemple : avec 40 000 € de revenu net imposable (1 part), votre TMI est 30 %, mais votre taux moyen effectif est d'environ 8–9 %. La TMI sert à calculer l'économie d'impôts d'une déduction (PER, dons...) : 1 000 € de déduction avec TMI à 30 % = 300 € d'économie.",
  },
  {
    q: "Quand doit-on déclarer ses revenus en 2026 ?",
    a: "La campagne de déclaration des revenus 2025 se déroule en mai-juin 2026. La date limite varie selon votre département : entre fin mai et mi-juin pour les déclarations en ligne. Les contribuables déclarant pour la première fois ou sur papier ont une date limite début mai. Pour les revenus professionnels des indépendants, la déclaration complémentaire (2042-C PRO) est associée.",
  },
  {
    q: "Vaut-il mieux opter pour le barème progressif ou le PFU (30 %) sur mes revenus de placement ?",
    a: "Le PFU (Prélèvement Forfaitaire Unique) de 30 % s'applique par défaut aux revenus du capital (dividendes, intérêts, plus-values). Si votre TMI est inférieure à 12,8 % (tranche 11 % ou 0 %), vous avez intérêt à opter pour le barème progressif. Au-delà, le PFU est généralement plus avantageux. L'option globale pour le barème s'applique à l'ensemble des revenus de placement — impossible de la faire au cas par cas.",
  },
  {
    q: "Comment réduire son impôt sur le revenu légalement en 2026 ?",
    a: "Principaux leviers : (1) Versements sur un PER (déductibles jusqu'à 10 % du revenu, soit jusqu'à 35 194 € en 2026) ; (2) Dons aux associations (réduction d'impôt de 66 à 75 %) ; (3) Emploi à domicile (crédit d'impôt 50 % des dépenses) ; (4) Déficit foncier (imputable sur le revenu global) ; (5) Investissement Pinel (dernier exercice 2024, mais certains travaux restent déductibles).",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Impôt sur le revenu 2026 : barème, calcul et simulateur",
    description: "Barème IR 2026 complet (5 tranches de 0 % à 45 %), comment calculer son impôt étape par étape, TMI, quotient familial et principaux leviers de réduction d'impôts.",
    author: { "@type": "Organization", name: "Simfinly", url: BASE },
    publisher: { "@type": "Organization", name: "Simfinly", logo: { "@type": "ImageObject", url: `${BASE}/logo-mark.svg` } },
    url: `${BASE}/impots/simulateur-impot-revenu`,
    datePublished: "2026-01-10",
    dateModified: "2026-06-29",
    inLanguage: "fr-FR",
    mainEntityOfPage: `${BASE}/impots/simulateur-impot-revenu`,
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
      { "@type": "ListItem", position: 2, name: "Simulateur impôt revenu", item: `${BASE}/simulateurs/impot-revenu` },
      { "@type": "ListItem", position: 3, name: "Guide IR 2026", item: `${BASE}/impots/simulateur-impot-revenu` },
    ],
  },
];

export default function GuideImpotRevenu() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.title = "Impôt sur le revenu 2026 — barème, calcul et réductions | simfinly";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Barème IR 2026 : 5 tranches de 0 % à 45 %. Comment calculer son impôt, comprendre la TMI, le quotient familial et réduire son IR avec PER, dons et emploi à domicile. Simulateur gratuit.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = `${BASE}/impots/simulateur-impot-revenu`;
  }, []);

  const s = {
    page: { minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" },
    wrap: { maxWidth: 820, margin: "0 auto", padding: "0 20px 80px" },
    breadcrumb: { display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: "var(--text-secondary)", padding: "20px 0 0", flexWrap: "wrap" },
    hero: { padding: "32px 0 24px" },
    badge: { display: "inline-block", background: "#fef3c7", color: "#b45309", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 14 },
    h1: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px,4.5vw,36px)", fontWeight: 700, lineHeight: 1.2, color: "var(--text)", margin: "0 0 14px", letterSpacing: "-0.02em" },
    sub: { fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 28px" },
    cta: { display: "inline-flex", alignItems: "center", gap: 8, background: "var(--primary)", color: "#fff", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 600, textDecoration: "none", marginBottom: 36, boxShadow: "0 2px 12px rgba(43,92,230,.25)" },
    stats: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 40 },
    stat: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" },
    statVal: { fontSize: 22, fontWeight: 700, color: "#b45309", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 },
    statLabel: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2 },
    statNote: { fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 },
    h2: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(18px,3vw,22px)", fontWeight: 600, color: "var(--text)", margin: "36px 0 14px", lineHeight: 1.3 },
    body: { fontSize: 15, lineHeight: 1.85, color: "var(--text-secondary)" },
    table: { width: "100%", borderCollapse: "collapse", margin: "20px 0", fontSize: 14 },
    th: { background: "#fef3c7", color: "#b45309", fontWeight: 600, padding: "10px 16px", textAlign: "left", borderBottom: "2px solid #fde68a" },
    td: { padding: "10px 16px", borderBottom: "1px solid var(--border)", color: "var(--text)" },
    formula: { background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "14px 20px", fontWeight: 600, color: "var(--text)", margin: "16px 0" },
    infoBox: { background: "var(--positive-soft)", border: "1px solid var(--positive)", borderRadius: 10, padding: "14px 20px", margin: "16px 0", fontSize: 14, color: "var(--text)", lineHeight: 1.7 },
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
          <Link to="/simulateurs/impot-revenu" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Impôt revenu</Link>
          <span>›</span>
          <span style={{ color: "var(--text)" }}>Guide IR 2026</span>
        </nav>

        <div style={s.hero}>
          <span style={s.badge}>Fiscalité</span>
          <h1 style={s.h1}>Impôt sur le revenu 2026 : barème complet, calcul et réductions</h1>
          <p style={s.sub}>
            Le barème de l'impôt sur le revenu 2026 comporte 5 tranches, de 0 % à 45 %.
            Tout comprendre sur le quotient familial, la TMI, et comment réduire légalement sa note fiscale.
          </p>
          <Link to="/simulateurs/impot-revenu" style={s.cta}>
            💰 Calculer mon impôt 2026
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

        <h2 style={s.h2}>Le barème de l'impôt sur le revenu 2026</h2>
        <div style={s.body}>
          <p>Le barème progressif 2026 (applicable aux revenus perçus en 2025 déclarés en 2026) est le suivant, par part de quotient familial :</p>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Tranche de revenu imposable / part</th>
                <th style={s.th}>Taux</th>
              </tr>
            </thead>
            <tbody>
              {BAREME.map(([tranche, taux], i) => (
                <tr key={i}>
                  <td style={s.td}>{tranche}</td>
                  <td style={{ ...s.td, fontWeight: 600, color: parseInt(taux) > 0 ? "#b45309" : "var(--positive)" }}>{taux}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Ce barème est progressif : seule la fraction de revenu dans chaque tranche est taxée à ce taux. Un contribuable avec 50 000 € de revenu net imposable par part ne paye pas 30 % sur 50 000 € — il paye 11 % sur la tranche 11 294–28 797 €, puis 30 % sur la tranche 28 797–50 000 €.</p>
        </div>

        <h2 style={s.h2}>Comment calculer son impôt : les 4 étapes</h2>
        <div style={s.body}>
          <p><strong>Étape 1 — Calculer le revenu net imposable</strong></p>
          <p>Pour un salarié : salaire brut − cotisations sociales salariales − 10 % abattement professionnel (minimum 495 €, maximum 14 426 € en 2026). Des déductions spécifiques s'ajoutent : pension alimentaire versée, charges déductibles...</p>
          <p><strong>Étape 2 — Diviser par le nombre de parts</strong></p>
          <p>Le quotient familial divise votre revenu imposable par le nombre de parts du foyer. Une personne seule = 1 part ; un couple sans enfants = 2 parts ; couple + 1 enfant = 2,5 parts ; couple + 2 enfants = 3 parts. L'impact est majeur : un revenu de 60 000 € à 2 parts = 30 000 €/part (TMI 30 %), vs 60 000 € à 1 part (TMI 30 % également mais taux moyen plus élevé).</p>
          <p><strong>Étape 3 — Appliquer le barème progressif par tranche</strong></p>
          <div style={s.formula}>
            Impôt par part = 0 € (tranche 0 %) + 11 % × (28 797 − 11 294) + 30 % × (revenu/part − 28 797)...
          </div>
          <p><strong>Étape 4 — Multiplier par le nombre de parts</strong></p>
          <p>L'impôt total = impôt par part × nombre de parts. Puis appliquer les réductions et crédits d'impôt éventuels.</p>
          <div style={s.infoBox}>
            <strong>💡 Exemple :</strong> Couple (2 parts) avec 80 000 € de revenu net imposable total.<br/>
            Revenu/part = 40 000 €. Impôt/part = 0 + 1 925 € (tranche 11 %) + 3 360 € (tranche 30 %, de 28 797 à 40 000) = 5 285 €.<br/>
            Impôt total = 5 285 × 2 = <strong>10 570 €</strong>. Taux moyen = 13,2 %.
          </div>
        </div>

        <h2 style={s.h2}>Décote 2026 : les foyers modestes protégés</h2>
        <div style={s.body}>
          <p>La décote protège les contribuables à revenus modestes. En 2026 :</p>
          <ul>
            <li><strong>Personne seule</strong> : si l'impôt brut < 1 840 €, la décote = 873 − (impôt brut × 45,25 %). L'impôt net = impôt brut − décote.</li>
            <li><strong>Couple</strong> : si l'impôt brut < 3 045 €, décote = 1 444 − (impôt brut × 45,25 %).</li>
          </ul>
          <p>Cette décote supprime en pratique l'impôt pour environ 40 % des foyers fiscaux.</p>
        </div>

        <h2 style={s.h2}>5 leviers légaux pour réduire son impôt 2026</h2>
        <div style={s.body}>
          <p><strong>1. Plan d'Épargne Retraite (PER)</strong><br/>
          Versements déductibles jusqu'à 10 % de votre revenu net imposable (max 35 194 €). Un salarié en tranche 30 % qui verse 5 000 € sur son PER économise 1 500 € d'impôts. Le <Link to="/simulateurs/per" style={{ color: "var(--primary)" }}>simulateur PER</Link> calcule l'économie exacte.</p>
          <p style={{ marginTop: 16 }}><strong>2. Dons aux associations</strong><br/>
          Réduction d'impôt de 66 % du montant donné (75 % pour les associations aidant les personnes en difficulté), dans la limite de 20 % du revenu imposable. Un don de 300 € = 198 € de réduction d'impôt.</p>
          <p style={{ marginTop: 16 }}><strong>3. Emploi à domicile</strong><br/>
          Crédit d'impôt de 50 % des dépenses réelles (ménage, garde d'enfants, cours à domicile, jardinage...) dans la limite de 12 000 €/an (+ 1 500 € par enfant). Maximum 6 000 € de crédit d'impôt annuel.</p>
          <p style={{ marginTop: 16 }}><strong>4. Déficit foncier</strong><br/>
          Les travaux dans un logement loué nu peuvent créer un déficit foncier imputable sur le revenu global à hauteur de 10 700 €/an (ou 21 400 € pour les travaux favorisant la rénovation énergétique).</p>
          <p style={{ marginTop: 16 }}><strong>5. Rentes de travaux et intérêts d'emprunt immobilier locatif</strong><br/>
          Les intérêts d'un emprunt pour acquérir un bien locatif nu sont déductibles des revenus fonciers (régime réel), réduisant votre assiette imposable.</p>
        </div>

        <div style={s.faqSection}>
          <h2 style={s.faqH2}>Questions fréquentes sur l'impôt sur le revenu 2026</h2>
          {FAQ.map(({ q, a }, i) => (
            <div key={i} style={s.faqItem}>
              <div style={s.faqQ}>{q}</div>
              <div style={s.faqA}>{a}</div>
            </div>
          ))}
        </div>

        <div style={s.ctaBox}>
          <div style={s.ctaBoxTitle}>Calculez votre impôt 2026 en 2 minutes</div>
          <p style={s.ctaBoxSub}>
            Renseignez votre situation familiale, vos revenus et déductions pour obtenir votre impôt,
            taux moyen, TMI et simulation d'optimisation.
          </p>
          <Link to="/simulateurs/impot-revenu" style={{ ...s.cta, marginBottom: 0 }}>
            Lancer le simulateur →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
