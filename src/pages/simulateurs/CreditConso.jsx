import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import Terme from "../../components/Terme.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import AffiliateCTA from "../../components/AffiliateCTA.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import AdUnit from "../../components/AdUnit.jsx";
import ScenarioCompare from "../../components/ScenarioCompare.jsx";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, StatusBadge, useAnimatedNumber,
  SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";
import { useMoney } from "../../i18n/CurrencyContext.jsx";
import { fmtCur, activeSymbol } from "../../i18n/currency.js";
import { useTranslation } from "../../i18n/index.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

// ─── Translations ─────────────────────────────────────────────────────────────
const TXT = {
  fr: {
    docTitle: "Simulateur Crédit Conso 2025 — Mensualité et coût du crédit",
    metaDesc: "Calculez la mensualité de votre crédit à la consommation, le coût total et le total des intérêts selon le montant, le TAEG et la durée. Tableau d'amortissement inclus.",
    jsonLdName: "Simulateur Crédit à la consommation 2025",
    jsonLdDesc: "Calculez la mensualité de votre crédit à la consommation, le coût total et le total des intérêts selon le montant, le TAEG et la durée.",
    jsonLdUrl: "https://www.simfinly.com/simulateurs/credit-conso",
    pageTitle: "Simulateur Crédit Conso",
    pageSubtitle: "Mensualité · Coût total · Amortissement",
    pageDesc: "Calculez la mensualité de votre crédit à la consommation, le coût total et le total des intérêts selon le montant emprunté, le TAEG et la durée. Tableau d'amortissement inclus.",
    badge: "Finances · Simulation 2025",
    formTitle: "Votre crédit",
    inputMontantLabel: "Montant emprunté",
    inputTaegLabel: "TAEG annuel",
    inputTaegTooltip: "Taux Annuel Effectif Global : inclut intérêts et frais obligatoires. Doit rester sous le taux d'usure.",
    inputDureeLabel: "Durée",
    inputDureeUnit: "mois",
    inputDureeHint: (d) => `soit ${(d / 12).toFixed(1)} an(s)`,
    inputAssuranceLabel: "Assurance optionnelle",
    inputAssuranceHint: (total, duree) => `Total assurance : ${total} sur ${duree} mois`,
    inputAssuranceHintEmpty: "Facultative pour un crédit conso",
    heroLabel: "Mensualité totale",
    heroEmpty: "Renseignez le montant emprunté pour voir votre estimation.",
    heroDuration: (d) => `/mois · sur ${d} mois (${(d / 12).toFixed(1)} an${d >= 24 ? "s" : ""})`,
    chipCoutCredit: "Coût total du crédit",
    chipInterets: "Total des intérêts",
    chipMontant: "Montant emprunté",
    chipDuree: "Durée",
    chipDureeVal: (d) => `${d} mois`,
    detailTitle: "Détail du calcul",
    detailMontant: "Montant emprunté",
    detailMensualiteHors: "Mensualité (hors assurance)",
    detailAssurance: "Assurance mensuelle",
    detailMensualiteTotale: "Mensualité totale",
    detailInterets: "Total des intérêts",
    detailTotalAssurance: "Total assurance",
    detailCoutCredit: "Coût total du crédit",
    detailTotalRembourse: "Total remboursé",
    amortTitle: "Tableau d'amortissement",
    amortSubtitle: (d) => `${d} mois · ${(d / 12).toFixed(1)} an(s)`,
    amortColAnnee: "Année",
    amortColMensualite: "Mensualité",
    amortColCapital: "Capital restant",
    aboutTitle: "À propos du crédit à la consommation",
    aboutH3_1: "La mensualité d'un crédit amortissable",
    aboutP1: "La mensualité d'un crédit à la consommation classique est calculée par la formule d'amortissement constant : M = C × r × (1+r)ⁿ / ((1+r)ⁿ − 1), où C est le montant emprunté, r le taux mensuel (TAEG ÷ 12) et n le nombre de mensualités. La mensualité reste fixe : au début, elle contient surtout des intérêts, puis la part de capital remboursé augmente progressivement, comme le montre le tableau d'amortissement.",
    aboutH3_2: "TAEG et taux d'usure",
    aboutP2_pre: "Le ",
    aboutP2_post: " est l'indicateur de référence pour comparer les offres : il agrège les intérêts et tous les frais obligatoires. La loi encadre son niveau via le taux d'usure, plafond légal révisé chaque trimestre par la Banque de France selon le montant et la durée du crédit. Un TAEG supérieur à ce seuil rend le prêt usuraire et illégal.",
    aboutH3_3: "Durée, assurance et coût total",
    aboutP3: "Le coût du crédit dépend fortement de la durée : plus elle est longue, plus la mensualité baisse mais plus les intérêts s'accumulent. L'assurance emprunteur, facultative pour un crédit conso, augmente la mensualité tout en sécurisant le remboursement. Le coût total du crédit correspond à la somme des intérêts et de l'assurance, soit l'écart entre le total remboursé et le montant emprunté.",
    disclaimer: "Simulation indicative (2025) · Le TAEG doit respecter le taux d'usure en vigueur · Ne constitue pas une offre de crédit",
    reportTitle: "Simulateur Crédit Conso",
    reportHighlightLabel: "Mensualité totale",
    reportHighlightVal: (v) => `${v}/mois`,
    reportMontantLabel: "Montant emprunté",
    reportTaegLabel: "TAEG annuel",
    reportDureeLabel: "Durée",
    reportDureeVal: (d) => `${d} mois (${(d / 12).toFixed(1)} an(s))`,
    reportAssuranceLabel: "Assurance optionnelle",
    reportAssuranceVal: (v) => `${v}/mois`,
    reportMensualiteLabel: "Mensualité totale",
    reportMensualiteVal: (v) => `${v}/mois`,
    reportMensualiteHors: "Mensualité (hors assurance)",
    reportInterets: "Total des intérêts",
    reportCoutCredit: "Coût total du crédit",
    reportTotalRembourse: "Total remboursé",
    reportNote: "Le TAEG accordé doit respecter le taux d'usure en vigueur publié par la Banque de France.",
    compareFieldMontant: "Montant emprunté",
    compareFieldTaeg: "TAEG",
    compareFieldDuree: "Durée",
    compareFieldAssurance: "Assurance / mois",
    compareMetricMensualite: "Mensualité",
    compareMetricCout: "Coût du crédit",
    statusAssurance: (v) => `+ ${v}/mois assurance`,
    faq: [
      {
        q: "Quelle différence entre TAEG et taux nominal ?",
        a: "Le taux nominal (ou taux débiteur) ne reflète que les intérêts du prêt. Le TAEG (Taux Annuel Effectif Global) intègre, en plus des intérêts, l'ensemble des frais obligatoires : frais de dossier, frais de garantie et, le cas échéant, l'assurance si elle est exigée. C'est le TAEG qui permet de comparer objectivement deux offres de crédit, car il reflète le coût réel total.",
      },
      {
        q: "Qu'est-ce que le taux d'usure ?",
        a: "Le taux d'usure est le TAEG maximum légal qu'un prêteur peut appliquer. Il est révisé chaque trimestre par la Banque de France et varie selon le type de crédit, le montant emprunté et la durée. Tout crédit proposé à un taux supérieur est considéré comme usuraire et donc illégal. Ce plafond protège les emprunteurs contre des conditions abusives.",
      },
      {
        q: "Comment la durée influence-t-elle le coût ?",
        a: "Allonger la durée réduit la mensualité, ce qui soulage le budget mensuel, mais augmente mécaniquement le coût total du crédit : vous payez des intérêts plus longtemps. À l'inverse, une durée courte fait grimper la mensualité mais réduit fortement les intérêts. Il faut arbitrer entre confort de remboursement et coût global.",
      },
      {
        q: "L'assurance emprunteur est-elle obligatoire ?",
        a: "Pour un crédit à la consommation, l'assurance emprunteur (décès, invalidité, parfois perte d'emploi) est généralement facultative, contrairement au crédit immobilier où elle est exigée en pratique. Elle augmente la mensualité mais sécurise le remboursement en cas d'aléa. Vous restez libre de l'accepter ou non, et de choisir un autre assureur que le prêteur.",
      },
      {
        q: "Quelle différence avec un crédit immobilier ?",
        a: "Le crédit à la consommation finance des biens ou besoins courants (voiture, travaux, trésorerie) pour des montants plafonnés (jusqu'à 75 000 €) et des durées plus courtes (souvent 12 à 84 mois). Le crédit immobilier finance l'achat d'un logement sur des montants et des durées bien plus importants, avec une garantie hypothécaire et une assurance obligatoire. Les TAEG et les règles diffèrent sensiblement.",
      },
      {
        q: "Ce simulateur est-il officiel ?",
        a: "Non. Il s'agit d'une estimation indicative basée sur une mensualité d'amortissement constant. Le coût réel dépend du TAEG effectivement accordé, des frais annexes et de l'assurance choisie. Le tableau d'amortissement est simplifié (lignes annuelles). Rapprochez-vous d'un établissement prêteur pour une offre personnalisée et un TAEG conforme au taux d'usure en vigueur.",
      },
    ],
  },
  en: {
    docTitle: "Personal Loan Calculator — Monthly Payment & Cost | Simfinly",
    metaDesc: "Calculate the monthly payment, total cost and total interest of a personal loan from the amount, APR and term. Includes amortization schedule.",
    jsonLdName: "Personal Loan Calculator 2025",
    jsonLdDesc: "Calculate the monthly payment, total cost and total interest of a personal loan from the amount, APR and term.",
    jsonLdUrl: "https://www.simfinly.com/en/simulateurs/credit-conso",
    pageTitle: "Personal Loan Calculator",
    pageSubtitle: "Monthly Payment · Total Cost · Amortization",
    pageDesc: "Calculate the monthly payment, total cost and total interest of a personal loan from the loan amount, APR and term. Includes amortization schedule.",
    badge: "Finance · Simulation 2025",
    formTitle: "Your loan",
    inputMontantLabel: "Loan amount",
    inputTaegLabel: "APR (Annual Percentage Rate)",
    inputTaegTooltip: "Annual Percentage Rate: includes interest and mandatory fees. Must remain below the legal usury rate.",
    inputDureeLabel: "Term",
    inputDureeUnit: "months",
    inputDureeHint: (d) => `i.e. ${(d / 12).toFixed(1)} year(s)`,
    inputAssuranceLabel: "Optional insurance",
    inputAssuranceHint: (total, duree) => `Total insurance: ${total} over ${duree} months`,
    inputAssuranceHintEmpty: "Optional for a personal loan",
    heroLabel: "Monthly payment",
    heroEmpty: "Enter the loan amount to see your estimate.",
    heroDuration: (d) => `/month · over ${d} months (${(d / 12).toFixed(1)} year${d >= 24 ? "s" : ""})`,
    chipCoutCredit: "Total cost of credit",
    chipInterets: "Total interest",
    chipMontant: "Loan amount",
    chipDuree: "Term",
    chipDureeVal: (d) => `${d} months`,
    detailTitle: "Calculation detail",
    detailMontant: "Loan amount",
    detailMensualiteHors: "Monthly payment (excl. insurance)",
    detailAssurance: "Monthly insurance",
    detailMensualiteTotale: "Total monthly payment",
    detailInterets: "Total interest",
    detailTotalAssurance: "Total insurance",
    detailCoutCredit: "Total cost of credit",
    detailTotalRembourse: "Total repaid",
    amortTitle: "Amortization schedule",
    amortSubtitle: (d) => `${d} months · ${(d / 12).toFixed(1)} year(s)`,
    amortColAnnee: "Year",
    amortColMensualite: "Monthly payment",
    amortColCapital: "Outstanding balance",
    aboutTitle: "About personal loans",
    aboutH3_1: "The monthly payment of a standard amortizing loan",
    aboutP1: "The monthly payment of a standard personal loan is calculated using the constant amortization formula: M = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1), where P is the loan amount, r the monthly rate (APR ÷ 12) and n the number of payments. The payment stays fixed: early on it is mostly interest, then the share of principal repaid gradually increases, as shown in the amortization schedule.",
    aboutH3_2: "APR and usury rate",
    aboutP2_pre: "The ",
    aboutP2_post: " is the reference indicator for comparing loan offers: it aggregates interest and all mandatory fees. The law caps its level via the usury rate, a legal ceiling revised each quarter by the Banque de France based on the amount and term of the loan. An APR above this threshold makes the loan usurious and illegal.",
    aboutH3_3: "Term, insurance and total cost",
    aboutP3: "The cost of a loan depends heavily on the term: the longer it is, the lower the monthly payment but the more interest accumulates. Payment protection insurance, optional for a personal loan, increases the monthly payment while securing repayment. The total cost of credit is the sum of interest and insurance — the gap between the total repaid and the amount borrowed.",
    disclaimer: "Indicative simulation · APR must comply with the applicable usury rate · Does not constitute a credit offer",
    reportTitle: "Personal Loan Calculator",
    reportHighlightLabel: "Monthly payment",
    reportHighlightVal: (v) => `${v}/month`,
    reportMontantLabel: "Loan amount",
    reportTaegLabel: "APR (annual)",
    reportDureeLabel: "Term",
    reportDureeVal: (d) => `${d} months (${(d / 12).toFixed(1)} year(s))`,
    reportAssuranceLabel: "Optional insurance",
    reportAssuranceVal: (v) => `${v}/month`,
    reportMensualiteLabel: "Total monthly payment",
    reportMensualiteVal: (v) => `${v}/month`,
    reportMensualiteHors: "Monthly payment (excl. insurance)",
    reportInterets: "Total interest",
    reportCoutCredit: "Total cost of credit",
    reportTotalRembourse: "Total repaid",
    reportNote: "The APR granted must comply with the applicable usury rate.",
    compareFieldMontant: "Loan amount",
    compareFieldTaeg: "APR",
    compareFieldDuree: "Term",
    compareFieldAssurance: "Insurance / month",
    compareMetricMensualite: "Monthly payment",
    compareMetricCout: "Cost of credit",
    statusAssurance: (v) => `+ ${v}/month insurance`,
    faq: [
      {
        q: "What is the difference between APR and nominal rate?",
        a: "The nominal rate (or borrowing rate) only reflects the interest on the loan. The APR (Annual Percentage Rate) also includes all mandatory fees: arrangement fees, guarantee fees and, where applicable, insurance if required. It is the APR that allows two loan offers to be compared objectively, as it reflects the total real cost.",
      },
      {
        q: "What is the usury rate?",
        a: "The usury rate is the maximum legal APR a lender can charge. It is revised each quarter by the Banque de France and varies according to the type of credit, the amount borrowed and the term. Any loan offered at a rate above this ceiling is considered usurious and therefore illegal. This cap protects borrowers against abusive conditions.",
      },
      {
        q: "How does the term affect the cost?",
        a: "Extending the term reduces the monthly payment, easing the monthly budget, but mechanically increases the total cost of the loan: you pay interest for longer. Conversely, a shorter term pushes up the monthly payment but significantly reduces interest. You need to balance repayment comfort against overall cost.",
      },
      {
        q: "Is payment protection insurance mandatory?",
        a: "For a personal loan, payment protection insurance (death, disability, sometimes job loss) is generally optional, unlike a mortgage where it is required in practice. It increases the monthly payment but secures repayment in the event of a mishap. You are free to accept it or not, and to choose a different insurer from the lender.",
      },
      {
        q: "What is the difference from a mortgage?",
        a: "A personal loan finances everyday goods or needs (car, home improvements, cash flow) up to a capped amount (up to €75,000) and over shorter terms (typically 12 to 84 months). A mortgage finances the purchase of a property over much larger amounts and terms, with a mortgage guarantee and mandatory insurance. APRs and rules differ significantly.",
      },
      {
        q: "Is this calculator official?",
        a: "No. This is an indicative estimate based on a constant-amortization monthly payment. The actual cost depends on the APR effectively granted, ancillary fees and the insurance chosen. The amortization schedule is simplified (annual rows). Please contact a lending institution for a personalised offer and an APR compliant with the applicable usury rate.",
      },
    ],
  },
};


// ─── Calculs crédit à la consommation ────────────────────────────────────────
// Crédit amortissable classique : mensualités constantes calculées à partir du
// TAEG (Taux Annuel Effectif Global) et de la durée exprimée EN MOIS.
//
// ⚠ Estimation INDICATIVE (2025/2026). Le coût réel d'un crédit dépend du TAEG
// effectivement appliqué, qui ne peut légalement dépasser le taux d'usure publié
// chaque trimestre par la Banque de France selon le montant et la durée du prêt.
// L'assurance emprunteur est ici facultative et ajoutée à la mensualité.

// Mensualité d'amortissement constant (taux mensuel = TAEG/12, durée en mois).
function mensualite(montant, taegPct, dureeMois) {
  if (montant <= 0 || dureeMois <= 0) return 0;
  const r = taegPct / 100 / 12;
  const n = dureeMois;
  if (r === 0) return montant / n;
  return (montant * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// Compute pur (mêmes formules que le rendu) réutilisé par la comparaison de 2 scénarios.
function computeCredit({ montant, taeg, duree, assurance }) {
  const m = mensualite(montant ?? 0, taeg ?? 0, duree ?? 0);
  const mensualiteTotale = m + (assurance ?? 0);
  const coutTotal = mensualiteTotale * (duree ?? 0);
  const coutCredit = coutTotal - (montant ?? 0);
  return { mensualiteTotale, coutCredit };
}

// ─── Tableau d'amortissement (lignes annuelles) ──────────────────────────────
function TableauAmortissement({ montant, taegPct, dureeMois, txt }) {
  const rows = [];
  const r = taegPct / 100 / 12;
  const m = mensualite(montant, taegPct, dureeMois);
  let restant = montant;
  for (let i = 1; i <= dureeMois; i++) {
    const interet = restant * r;
    restant = Math.max(0, restant - (m - interet));
    if (i % 12 === 0 || i === dureeMois) {
      rows.push({ mois: i, annee: Math.ceil(i / 12), capitalRestant: restant });
    }
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {[txt.amortColAnnee, txt.amortColMensualite, txt.amortColCapital].map(h => (
              <th key={h} style={{ textAlign: "right", padding: "8px 10px", fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "rgba(184,147,74,0.02)" : "transparent" }}>
              <td style={{ padding: "8px 10px", textAlign: "right", color: "var(--text-secondary)" }}>{row.annee}</td>
              <td style={{ padding: "8px 10px", textAlign: "right", color: "var(--text)", fontFamily: "'Space Grotesk', sans-serif", fontSize: 15 }}>{fmtCur(Math.round(m))}</td>
              <td style={{ padding: "8px 10px", textAlign: "right", color: row.capitalRestant <= 0 ? "var(--gold)" : "var(--text)", fontFamily: "'Space Grotesk', sans-serif", fontSize: 15 }}>{fmtCur(Math.round(row.capitalRestant))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const sectionTitle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 20 };

// ─── Simulateur ───────────────────────────────────────────────────────────────
export default function CreditConso() {
  const [theme, setTheme] = useTheme();
  useMoney(); // abonnement aux changements de devise
  const isMobile = useIsMobile();

  const { locale } = useTranslation();
  const txt = TXT[locale] ?? TXT.fr;

  const card = {
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: 20, padding: isMobile ? "20px 16px" : "28px 32px",
    marginBottom: 20, boxShadow: "var(--card-shadow)",
  };

  const [montant, setMontant]     = useState(null);
  const [taeg, setTaeg]           = useState(5);
  const [duree, setDuree]         = useState(36);
  const [assurance, setAssurance] = useState(0);

  const resultsRef = useRef(null);

  usePageMeta(txt.docTitle, txt.metaDesc);

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'credit-conso' });
    if (!sessionStorage.getItem('tracked_credit-conso')) {
      sessionStorage.setItem('tracked_credit-conso', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'credit-conso' })
      }).catch(() => {});
    }
  }, [txt.docTitle, txt.metaDesc]);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.montant !== undefined) setMontant(shared.montant);
      if (shared.taeg !== undefined) setTaeg(shared.taeg);
      if (shared.duree !== undefined) setDuree(shared.duree);
      if (shared.assurance !== undefined) setAssurance(shared.assurance);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ montant, taeg, duree, assurance }));
  }, [montant, taeg, duree, assurance]);

  // ── Calculs ──
  const montantEmprunte = montant ?? 0;
  const m = mensualite(montantEmprunte, taeg, duree);
  const mensualiteTotale = m + (assurance ?? 0);
  const coutTotal = mensualiteTotale * duree;
  const coutCredit = coutTotal - montantEmprunte;
  const totalInterets = m * duree - montantEmprunte;
  const totalAssurance = (assurance ?? 0) * duree;

  const hasInput = montantEmprunte > 0 && duree > 0;

  const animMensualite = useAnimatedNumber(mensualiteTotale);
  const animCout = useAnimatedNumber(coutCredit);

  const report = {
    title: txt.reportTitle,
    highlight: { label: txt.reportHighlightLabel, value: hasInput ? txt.reportHighlightVal(fmtCur(Math.round(mensualiteTotale))) : "—" },
    params: [
      { label: txt.reportMontantLabel, value: montant ? fmtCur(montant) : "—" },
      { label: txt.reportTaegLabel, value: `${taeg} %` },
      { label: txt.reportDureeLabel, value: txt.reportDureeVal(duree) },
      { label: txt.reportAssuranceLabel, value: (assurance ?? 0) > 0 ? txt.reportAssuranceVal(fmtCur(assurance)) : "—" },
    ],
    results: hasInput ? [
      { label: txt.reportMensualiteLabel, value: txt.reportMensualiteVal(fmtCur(Math.round(mensualiteTotale))), strong: true },
      { label: txt.reportMensualiteHors, value: fmtCur(Math.round(m)) },
      { label: txt.reportInterets, value: fmtCur(Math.round(totalInterets)) },
      { label: txt.reportCoutCredit, value: fmtCur(Math.round(coutCredit)) },
      { label: txt.reportTotalRembourse, value: fmtCur(Math.round(coutTotal)) },
    ] : [],
    notes: hasInput ? [txt.reportNote] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": txt.jsonLdName,
        "url": txt.jsonLdUrl,
        "description": txt.jsonLdDesc,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": locale === 'en' ? 'en-US' : 'fr-FR',
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": txt.faq.map(f => ({
          "@type": "Question", "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }} />
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ maxWidth: 940, margin: "0 auto", padding: isMobile ? "0 16px 60px" : "0 24px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/credit-conso" size={34} />}
          badge={txt.badge}
          title={txt.pageTitle}
          subtitle={txt.pageSubtitle}
          desc={txt.pageDesc}
        />

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>

          {/* ── Colonne formulaire ── */}
          <div style={{ order: isMobile ? 2 : 1 }}>
            <div style={card}>
              <h2 style={sectionTitle}>{txt.formTitle}</h2>
              <NumInput label={txt.inputMontantLabel} value={montant} onChange={setMontant} unit={activeSymbol()} min={200} max={100000} />
              <StepperInput label={txt.inputTaegLabel} value={taeg} onChange={setTaeg} min={0.1} max={25} step={0.1} unit="%"
                tooltip={txt.inputTaegTooltip} />
              <StepperInput label={txt.inputDureeLabel} value={duree} onChange={v => setDuree(Math.round(v))} min={3} max={120} step={1} unit={txt.inputDureeUnit}
                hint={duree > 0 ? txt.inputDureeHint(duree) : undefined} />
              <StepperInput label={txt.inputAssuranceLabel} value={assurance} onChange={setAssurance} min={0} max={200} step={1} unit={`${activeSymbol()}/mois`}
                hint={(assurance ?? 0) > 0 ? txt.inputAssuranceHint(fmtCur(totalAssurance), duree) : txt.inputAssuranceHintEmpty} />
            </div>
          </div>

          {/* ── Colonne résultats ── */}
          <div style={{ order: isMobile ? 1 : 2, minWidth: 0 }}>
            <div style={{ background: "linear-gradient(145deg, rgba(184,147,74,0.08), var(--card-bg))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginBottom: 20, textAlign: "center", boxShadow: "var(--card-shadow)" }} ref={resultsRef}>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 10 }}>
                {txt.heroLabel}
              </div>
              {!hasInput ? (
                <p style={{ color: "var(--text-secondary)", padding: "20px 0", fontSize: 14 }}>
                  {txt.heroEmpty}
                </p>
              ) : (
                <>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(44px,8vw,68px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {fmtCur(Math.round(animMensualite))}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
                    {txt.heroDuration(duree)}
                  </div>
                  <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                    <StatusBadge status="gold" label={`${txt.inputTaegLabel.split(" ")[0]} ${taeg} %`} />
                    {(assurance ?? 0) > 0 && <StatusBadge status="info" label={txt.statusAssurance(fmtCur(assurance))} />}
                  </div>
                </>
              )}

              <ShareBar
                params={{ montant, taeg, duree, assurance }}
                resultsRef={resultsRef}
                report={report}
                name="credit-conso"
              />
              {hasInput && <AffiliateCTA type="credit" />}
            </div>

            {hasInput && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <Chip label={txt.chipCoutCredit} value={fmtCur(Math.round(animCout))} accent small />
                <Chip label={txt.chipInterets} value={fmtCur(Math.round(totalInterets))} small />
                <Chip label={txt.chipMontant} value={fmtCur(montantEmprunte)} small />
                <Chip label={txt.chipDuree} value={txt.chipDureeVal(duree)} small />
              </div>
            )}

            {hasInput && (
              <AccordionSection title={txt.detailTitle} defaultOpen>
                {[
                  { label: txt.detailMontant, value: fmtCur(montantEmprunte) },
                  { label: txt.detailMensualiteHors, value: fmtCur(Math.round(m)) },
                  { label: txt.detailAssurance, value: fmtCur(assurance ?? 0) },
                  { label: txt.detailMensualiteTotale, value: fmtCur(Math.round(mensualiteTotale)), accent: true },
                  { label: txt.detailInterets, value: fmtCur(Math.round(totalInterets)) },
                  { label: txt.detailTotalAssurance, value: fmtCur(Math.round(totalAssurance)) },
                  { label: txt.detailCoutCredit, value: fmtCur(Math.round(coutCredit)), accent: true },
                  { label: txt.detailTotalRembourse, value: fmtCur(Math.round(coutTotal)), accent: true },
                ].map(({ label, value, accent }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: accent ? "var(--gold)" : "var(--text)" }}>{value}</span>
                  </div>
                ))}
              </AccordionSection>
            )}

            {hasInput && (
              <AccordionSection title={txt.amortTitle} subtitle={txt.amortSubtitle(duree)}>
                <TableauAmortissement montant={montantEmprunte} taegPct={taeg} dureeMois={duree} txt={txt} />
              </AccordionSection>
            )}
          </div>
        </div>

        {/* Comparaison de 2 scénarios */}
        {hasInput && (
          <ScenarioCompare
            name="credit-conso"
            base={{ montant: montantEmprunte, taeg, duree, assurance: assurance ?? 0 }}
            compute={computeCredit}
            moneyFmt={fmtCur}
            fields={[
              { key: "montant", label: txt.compareFieldMontant, unit: activeSymbol(), kind: "eur", type: "num", min: 0, max: 100000 },
              { key: "taeg", label: txt.compareFieldTaeg, unit: "%", type: "step", min: 0, max: 25, step: 0.1 },
              { key: "duree", label: txt.compareFieldDuree, unit: txt.inputDureeUnit, type: "step", min: 6, max: 120, step: 6 },
              { key: "assurance", label: txt.compareFieldAssurance, unit: activeSymbol(), kind: "eur", type: "num", min: 0, max: 200 },
            ]}
            metrics={[
              { label: txt.compareMetricMensualite, get: r => r.mensualiteTotale, fmt: n => fmtCur(Math.round(n)), higherBetter: false },
              { label: txt.compareMetricCout, get: r => r.coutCredit, fmt: n => fmtCur(Math.round(n)), higherBetter: false },
            ]}
          />
        )}

        {/* AdSense mid */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>{txt.aboutTitle}</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>{txt.aboutH3_1}</h3>
            <p style={{ marginBottom: 16 }}>{txt.aboutP1}</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.aboutH3_2}</h3>
            <p style={{ marginBottom: 16 }}>{txt.aboutP2_pre}<Terme slug="taeg">{locale === 'en' ? 'APR' : 'TAEG'}</Terme>{txt.aboutP2_post}</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.aboutH3_3}</h3>
            <p>{txt.aboutP3}</p>
          </div>
        </div>

        {/* FAQ */}
        <FaqSection items={txt.faq} />

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", opacity: 0.6, marginTop: 32 }}>
          {txt.disclaimer}
        </p>

        {/* AdSense bas */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
