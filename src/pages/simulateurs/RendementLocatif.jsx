import { useState, useEffect, useRef, useMemo } from "react";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import ShareBar from "../../components/ShareBar.jsx";
import AffiliateCTA from "../../components/AffiliateCTA.jsx";
import ZoomableChart from "../../components/ZoomableChart.jsx";
import BarChart from "../../components/charts/BarChart.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { useTheme } from "../../hooks/useTheme.js";
import { useTranslation } from "../../i18n/index.js";
import Navbar from "../../components/Navbar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, AccordionSection, Toggle,
  Chip, ProgressBar, useAnimatedNumber,
  fmt, fmtEur, SimulateurHeader, FaqSection,
  FaqItem,
} from "../../components/ui.jsx";

// ─── Logique de calcul rendement locatif ──────────────────────────────────────
function calcRendement({ prix, neuf, travaux, apport, loyer, chargesCopro, taxeFonciere, gestionLocative }) {
  if (!prix || !loyer) return {
    fraisNotaire: 0, prixRevient: 0, rendementBrut: 0,
    chargesAnnuelles: 0, gestionLocativeAnnuelle: 0,
    rendementNet: 0, cashflowMensuel: 0,
    rendementFondsPropres: 0, dureeAmortissement: 0,
  };

  const tauxNotaire = neuf ? 0.025 : 0.075;
  const fraisNotaire = prix * tauxNotaire;
  const prixRevient = prix + fraisNotaire + (travaux || 0);

  const gestionLocativeAnnuelle = gestionLocative ? loyer * 12 * 0.08 : 0;
  const chargesAnnuelles = chargesCopro * 12 + taxeFonciere + gestionLocativeAnnuelle;

  const rendementBrut = (loyer * 12) / prixRevient * 100;
  const rendementNet = chargesAnnuelles > 0
    ? ((loyer * 12 - chargesAnnuelles) / prixRevient) * 100
    : (loyer * 12) / prixRevient * 100;

  const cashflowMensuel = loyer - chargesCopro - (taxeFonciere / 12) - (gestionLocativeAnnuelle / 12);
  const cashflowAnnuel = loyer * 12 - chargesAnnuelles;
  const dureeAmortissement = cashflowAnnuel > 0 ? prixRevient / cashflowAnnuel : 0;

  const rendementFondsPropres = apport > 0
    ? (cashflowAnnuel / apport) * 100
    : 0;

  return {
    fraisNotaire,
    prixRevient,
    rendementBrut,
    chargesAnnuelles,
    gestionLocativeAnnuelle,
    rendementNet,
    cashflowMensuel,
    cashflowAnnuel,
    rendementFondsPropres,
    dureeAmortissement,
  };
}

// ─── Textes (FR / EN) ──────────────────────────────────────────────────────────
// Contenu décrivant l'investissement locatif en France (fiscalité, régimes), en
// français et en anglais (public expatrié / international).
const TXT = {
  fr: {
    docTitle: "Simulateur Rendement Locatif 2025 — Rentabilité investissement immobilier",
    docDesc: "Calculez le rendement brut et net de votre investissement locatif : loyers, charges, cash-flow mensuel et retour sur fonds propres.",
    appName: "Simulateur de rendement locatif",
    badge: "Immobilier · Simulation 2026",
    title: "Rendement locatif",
    desc: "Évaluez la rentabilité brute et nette d'un investissement locatif selon les charges, la fiscalité et les frais de gestion.",
    pctSuffix: " %",
    perMonth: "/mois",
    yearsUnit: "ans",
    bienTitle: "Le bien immobilier",
    prixLabel: "Prix d'achat",
    prixHint: (frais) => `Frais notaire estimés : ${fmtEur(frais)}`,
    prixHintEmpty: "Montant avant frais",
    typeLabel: "Type de bien",
    toggleAncien: "Ancien",
    toggleNeuf: "Neuf",
    travauxLabel: "Travaux et rénovation (optionnel)",
    travauxHintOn: "Ajouté au coût d'acquisition",
    travauxHintOff: "Laissez à 0 si pas de travaux prévus",
    apportLabel: "Apport personnel (optionnel)",
    apportHintOn: "Permet de calculer le rendement sur fonds propres",
    apportHintOff: "Votre contribution personnelle (hors emprunt)",
    revenusTitle: "Revenus et charges",
    loyerLabel: "Loyer mensuel",
    loyerHint: (annual) => `Annualisé : ${fmtEur(annual)}/an`,
    loyerHintEmpty: "Loyer hors charges",
    coproLabel: "Charges de copropriété",
    coproHint: (annual) => `Annualisées : ${fmtEur(annual)}/an`,
    coproHintEmpty: "Charges communes (immeuble)",
    taxeLabel: "Taxe foncière",
    taxeHint: "Charge annuelle fixe",
    gestionLabel: "Gestion locative (8 % du loyer)",
    toggleGestionNo: "Non facturée",
    toggleGestionYes: "Facturée par agence",
    rentabiliteTitle: "Rentabilité estimée",
    brutLabel: "Rendement brut",
    netLabel: "Rendement net (après charges)",
    fluxNeg: "⚠️ Flux négatif : charges supérieures aux revenus",
    chipPrixRevient: "Prix de revient",
    chipCashflow: "Cash-flow mensuel",
    chipFondsPropres: "Rendement fonds propres",
    chipDuree: "Durée amortissement",
    chartTitle: "Comparaison des rendements",
    barBrut: "Brut",
    barNet: "Net",
    barFonds: "Fonds propres",
    segBrut: "Rendement brut",
    segNet: "Rendement net",
    segFonds: "Rendement fonds propres",
    chartAria: "Comparaison rendement brut, net et sur fonds propres",
    compareBtn: "⚖️ Comparer un 2ᵉ scénario (prix / loyer)",
    compareTitle: "Comparaison de scénarios",
    closeCompare: "Fermer la comparaison",
    scenarioA: "Scénario A (actuel)",
    scenarioB: "Scénario B",
    prixLine: "Prix : ",
    loyerLine: "Loyer : ",
    rendNet: "Rendement net",
    cashflow: "Cash-flow",
    bPrixLabel: "Prix d'achat",
    bLoyerLabel: "Loyer mensuel",
    ecartNet: "Écart rendement net",
    ecartCash: "Écart cash-flow",
    ecartSuffix: " (B − A)",
    ptsUnit: "pts",
    emptyMsg: "Saisissez le prix du bien et le loyer pour voir votre estimation.",
    detailTitle: "Détail des charges annuelles",
    detailSubtitle: "Ventilation par type",
    dCopro: "Copropriété",
    dTaxe: "Taxe foncière",
    dGestion: "Gestion locative (8 %)",
    dTotal: "Total annuel",
    progressLabel: "Charges / Revenus locatifs",
    aboutTitle: "À propos de ce simulateur",
    aboutH1: "Rendement brut et rendement net",
    aboutP1: "Le rendement brut d'un investissement locatif se calcule simplement : (loyer annuel / prix d'acquisition) × 100. Il donne une première indication rapide mais ne tient pas compte des charges. Le rendement net déduit les charges non récupérables (taxe foncière, charges de copropriété, frais de gestion, entretien) et les impôts. Un rendement brut de 6 % peut tomber à 3,5 % net selon la fiscalité et les charges du bien.",
    aboutH2: "Charges déductibles et fiscalité",
    aboutP2: "En régime réel (location nue), les charges déductibles comprennent les intérêts d'emprunt, la taxe foncière, les primes d'assurance, les travaux d'entretien et de réparation, et les frais de gestion. Le déficit foncier est imputable sur le revenu global dans la limite de 10 750 € par an. En location meublée (LMNP), l'amortissement comptable du bien peut annuler fiscalement le revenu locatif pendant de nombreuses années.",
    aboutH3: "Le cash-flow : indicateur clé",
    aboutP3: "Le cash-flow mesure ce qu'il reste réellement dans votre poche chaque mois après avoir payé toutes les charges et le remboursement du crédit. Un cash-flow positif signifie que le loyer finance le bien et génère un surplus. Un cash-flow nul ou légèrement négatif est souvent acceptable si le bien prend de la valeur dans le temps — c'est la notion de rentabilité globale qui intègre la plus-value potentielle à la revente.",
    faqTitle: "Questions fréquentes",
    faq: [
      { q: "Quelle est la différence entre rendement brut et net ?", a: "Le rendement brut = (loyers annuels / prix d'achat) × 100. Le rendement net déduit les charges : taxe foncière, charges de copropriété non récupérables, assurance PNO, frais de gestion (7-10 % des loyers), vacance locative et provisions pour travaux. Le rendement net est typiquement 2 à 3 points inférieur au brut." },
      { q: "Qu'est-ce que le rendement net-net (après fiscalité) ?", a: "Le rendement net-net tient compte de la fiscalité des loyers. En régime réel, les charges et intérêts d'emprunt sont déductibles, ce qui peut créer un déficit foncier (plafonné à 10 700 €/an sur le revenu global). Au micro-foncier (recettes < 15 000 €/an), l'abattement forfaitaire de 30 % s'applique automatiquement." },
      { q: "Quel rendement locatif brut viser en 2025 ?", a: "Un rendement brut de 6 % ou plus est généralement considéré comme intéressant pour une location nue en France. Les zones tendues (Paris, Lyon, Bordeaux) offrent souvent 3-4 % brut mais plus de sécurité locative et de plus-value potentielle. Les villes moyennes et périphéries permettent d'atteindre 7-10 % brut avec des risques plus élevés." },
      { q: "Comment est imposée la location nue ?", a: "Les revenus fonciers s'ajoutent au revenu imposable. En dessous de 15 000 €/an : micro-foncier avec 30 % d'abattement. Au-delà ou sur option : régime réel avec déduction de toutes les charges. Les loyers supportent aussi les prélèvements sociaux (17,2 %)." },
      { q: "Qu'est-ce que la location meublée (LMNP) ?", a: "La location meublée non professionnelle (LMNP) relève des BIC. Au micro-BIC (recettes < 77 700 €/an), l'abattement est de 50 %. Au régime réel, l'amortissement du bien (sur 25-40 ans) et du mobilier permet souvent de générer un résultat nul ou déficitaire, éliminant la fiscalité pendant de nombreuses années." },
      { q: "Comment calculer la rentabilité d'un investissement locatif avec emprunt ?", a: "Le cash-flow mensuel = loyers − mensualité de crédit − charges non récupérables − taxe foncière mensuelle. Un cash-flow positif ou nul est l'objectif minimal. L'effet de levier du crédit améliore le rendement sur fonds propres si le coût du crédit (taux) est inférieur au rendement brut de l'actif." },
    ],
    rTitle: "Simulateur Rendement Locatif",
    rBrut: "Rendement brut",
    rPrix: "Prix d'achat",
    rTravaux: "Travaux",
    rApport: "Apport personnel",
    rLoyer: "Loyer mensuel",
    rCopro: "Charges de copropriété",
    rTaxe: "Taxe foncière",
    rNet: "Rendement net (après charges)",
    rCashflow: "Cash-flow mensuel",
    rPrixRevient: "Prix de revient",
    rFondsPropres: "Rendement sur fonds propres",
    noteNeg: "Flux de trésorerie négatif : les charges dépassent les revenus locatifs.",
    noteDuree: (n) => `Durée d'amortissement estimée : ${n} ans.`,
  },
  en: {
    docTitle: "Rental Yield Calculator 2025 — Buy-to-Let Profitability",
    docDesc: "Calculate the gross and net yield of a rental investment: rent, costs, monthly cash flow and return on equity.",
    appName: "Rental yield calculator",
    badge: "Real estate · 2026 simulation",
    title: "Rental yield",
    desc: "Assess the gross and net profitability of a rental investment based on costs, taxation and management fees (French rules).",
    pctSuffix: "%",
    perMonth: "/mo",
    yearsUnit: "yrs",
    bienTitle: "The property",
    prixLabel: "Purchase price",
    prixHint: (frais) => `Estimated notary fees: ${fmtEur(frais)}`,
    prixHintEmpty: "Amount before fees",
    typeLabel: "Property type",
    toggleAncien: "Existing",
    toggleNeuf: "New build",
    travauxLabel: "Renovation works (optional)",
    travauxHintOn: "Added to the acquisition cost",
    travauxHintOff: "Leave at 0 if no works planned",
    apportLabel: "Down payment (optional)",
    apportHintOn: "Used to compute the return on equity",
    apportHintOff: "Your own contribution (excluding the loan)",
    revenusTitle: "Income and costs",
    loyerLabel: "Monthly rent",
    loyerHint: (annual) => `Annualised: ${fmtEur(annual)}/year`,
    loyerHintEmpty: "Rent excluding charges",
    coproLabel: "Building service charges",
    coproHint: (annual) => `Annualised: ${fmtEur(annual)}/year`,
    coproHintEmpty: "Shared building charges",
    taxeLabel: "Property tax (taxe foncière)",
    taxeHint: "Fixed annual charge",
    gestionLabel: "Letting management (8% of rent)",
    toggleGestionNo: "Not charged",
    toggleGestionYes: "Charged by agency",
    rentabiliteTitle: "Estimated profitability",
    brutLabel: "Gross yield",
    netLabel: "Net yield (after costs)",
    fluxNeg: "⚠️ Negative flow: costs exceed income",
    chipPrixRevient: "Total cost price",
    chipCashflow: "Monthly cash flow",
    chipFondsPropres: "Return on equity",
    chipDuree: "Payback period",
    chartTitle: "Yield comparison",
    barBrut: "Gross",
    barNet: "Net",
    barFonds: "Equity",
    segBrut: "Gross yield",
    segNet: "Net yield",
    segFonds: "Return on equity",
    chartAria: "Comparison of gross, net and equity yield",
    compareBtn: "⚖️ Compare a 2nd scenario (price / rent)",
    compareTitle: "Scenario comparison",
    closeCompare: "Close the comparison",
    scenarioA: "Scenario A (current)",
    scenarioB: "Scenario B",
    prixLine: "Price: ",
    loyerLine: "Rent: ",
    rendNet: "Net yield",
    cashflow: "Cash flow",
    bPrixLabel: "Purchase price",
    bLoyerLabel: "Monthly rent",
    ecartNet: "Net yield gap",
    ecartCash: "Cash flow gap",
    ecartSuffix: " (B − A)",
    ptsUnit: "pts",
    emptyMsg: "Enter the property price and rent to see your estimate.",
    detailTitle: "Annual costs breakdown",
    detailSubtitle: "By type",
    dCopro: "Service charges",
    dTaxe: "Property tax",
    dGestion: "Letting management (8%)",
    dTotal: "Annual total",
    progressLabel: "Costs / rental income",
    aboutTitle: "About this calculator",
    aboutH1: "Gross yield and net yield",
    aboutP1: "The gross yield of a rental investment is simple: (annual rent / purchase price) × 100. It gives a quick first indication but ignores costs. The net yield deducts non-recoverable costs (property tax, service charges, management fees, maintenance) and taxes. A 6% gross yield can drop to 3.5% net depending on taxation and the property's costs.",
    aboutH2: "Deductible costs and taxation",
    aboutP2: "Under the French réel regime (unfurnished letting), deductible costs include loan interest, property tax, insurance premiums, maintenance and repair works, and management fees. The property deficit (déficit foncier) can be offset against overall income up to €10,750 per year. With furnished letting (LMNP), the property's accounting depreciation can cancel out the taxable rental income for many years.",
    aboutH3: "Cash flow: the key indicator",
    aboutP3: "Cash flow measures what actually stays in your pocket each month after paying all costs and the loan repayment. Positive cash flow means the rent funds the property and generates a surplus. A nil or slightly negative cash flow is often acceptable if the property appreciates over time — this is overall profitability, which factors in the potential capital gain on resale.",
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "What is the difference between gross and net yield?", a: "Gross yield = (annual rent / purchase price) × 100. Net yield deducts costs: property tax, non-recoverable service charges, landlord insurance, management fees (7-10% of rent), rental vacancy and maintenance provisions. Net yield is typically 2 to 3 points below gross." },
      { q: "What is the net-net yield (after tax)?", a: "The net-net yield factors in the taxation of rents. Under the French réel regime, costs and loan interest are deductible, which can create a property deficit (capped at €10,700/year against overall income). Under micro-foncier (income < €15,000/year), a flat 30% allowance applies automatically." },
      { q: "What gross rental yield should you target in 2025?", a: "A gross yield of 6% or more is generally considered attractive for unfurnished letting in France. Tight markets (Paris, Lyon, Bordeaux) often offer 3-4% gross but more rental security and potential capital gain. Mid-sized towns and suburbs can reach 7-10% gross with higher risk." },
      { q: "How is unfurnished letting taxed?", a: "Property income is added to your taxable income. Below €15,000/year: micro-foncier with a 30% allowance. Above that, or by election: the réel regime deducting all costs. Rents also bear social levies (17.2%)." },
      { q: "What is furnished letting (LMNP)?", a: "Non-professional furnished letting (LMNP) falls under the BIC category. Under micro-BIC (income < €77,700/year), the allowance is 50%. Under the réel regime, depreciating the property (over 25-40 years) and the furniture often produces a nil or loss result, removing taxation for many years." },
      { q: "How do you compute the profitability of a leveraged rental investment?", a: "Monthly cash flow = rent − loan payment − non-recoverable costs − monthly property tax. A positive or nil cash flow is the minimum target. Loan leverage improves the return on equity if the cost of credit (rate) is below the asset's gross yield." },
    ],
    rTitle: "Rental Yield Calculator",
    rBrut: "Gross yield",
    rPrix: "Purchase price",
    rTravaux: "Works",
    rApport: "Down payment",
    rLoyer: "Monthly rent",
    rCopro: "Building service charges",
    rTaxe: "Property tax",
    rNet: "Net yield (after costs)",
    rCashflow: "Monthly cash flow",
    rPrixRevient: "Total cost price",
    rFondsPropres: "Return on equity",
    noteNeg: "Negative cash flow: costs exceed rental income.",
    noteDuree: (n) => `Estimated payback period: ${n} years.`,
  },
};

export default function RendementLocatif() {
  const [theme, setTheme] = useTheme();
  const { locale } = useTranslation();
  const txt = TXT[locale] || TXT.fr;
  const isEn = locale === "en";
  const pct = (n) => `${n.toFixed(2)}${txt.pctSuffix}`;

  const [prix, setPrix]               = useState(null);
  const [neuf, setNeuf]               = useState(false);
  const [travaux, setTravaux]         = useState(0);
  const [apport, setApport]           = useState(0);
  const [loyer, setLoyer]             = useState(null);
  const [chargesCopro, setChargesCopro] = useState(0);
  const [taxeFonciere, setTaxeFonciere] = useState(0);
  const [gestionLocative, setGestionLocative] = useState(false);

  // Comparaison d'un 2e scénario (prix négocié / loyer différent).
  const [compareOn, setCompareOn] = useState(false);
  const [bPrix, setBPrix]   = useState(null);
  const [bLoyer, setBLoyer] = useState(null);

  const resultsRef = useRef(null);

  usePageMeta(txt.docTitle, txt.docDesc);

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'rendement-locatif' });
    if (!sessionStorage.getItem('tracked_rendement-locatif')) {
      sessionStorage.setItem('tracked_rendement-locatif', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'rendement-locatif' })
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.prix !== undefined) setPrix(shared.prix);
      if (shared.travaux !== undefined) setTravaux(shared.travaux);
      if (shared.apport !== undefined) setApport(shared.apport);
      if (shared.loyer !== undefined) setLoyer(shared.loyer);
      if (shared.chargesCopro !== undefined) setChargesCopro(shared.chargesCopro);
      if (shared.taxeFonciere !== undefined) setTaxeFonciere(shared.taxeFonciere);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ prix, travaux, apport, loyer, chargesCopro, taxeFonciere }));
  }, [prix, travaux, apport, loyer, chargesCopro, taxeFonciere]);

  const res = calcRendement({ prix, neuf, travaux, apport, loyer, chargesCopro, taxeFonciere, gestionLocative });
  const rendementBrutAnim = useAnimatedNumber(res.rendementBrut);
  const rendementNetAnim = useAnimatedNumber(res.rendementNet);
  const cashflowAnim = useAnimatedNumber(res.cashflowMensuel);

  const hasResult = prix > 0 && loyer > 0;

  const rendChart = useMemo(() => {
    if (!hasResult || res.rendementBrut <= 0) return [];
    const bars = [
      { label: txt.barBrut, segments: [{ value: +res.rendementBrut.toFixed(2), color: "var(--primary)", label: txt.segBrut }] },
      { label: txt.barNet, segments: [{ value: +res.rendementNet.toFixed(2), color: "#6eb5d4", label: txt.segNet }] },
    ];
    if (apport > 0 && res.rendementFondsPropres > 0) {
      bars.push({ label: txt.barFonds, segments: [{ value: +res.rendementFondsPropres.toFixed(2), color: "#4ade80", label: txt.segFonds }] });
    }
    return bars;
  }, [hasResult, res, apport, txt]);

  // Scénario B : prix et loyer différents, autres paramètres identiques.
  const resB = calcRendement({ prix: bPrix, neuf, travaux, apport, loyer: bLoyer, chargesCopro, taxeFonciere, gestionLocative });
  const hasB = bPrix > 0 && bLoyer > 0;
  const deltaNet = resB.rendementNet - res.rendementNet;
  const deltaCash = resB.cashflowMensuel - res.cashflowMensuel;
  function startCompare() {
    setBPrix(prix); setBLoyer(loyer); setCompareOn(true);
    track('compare_open', { name: 'rendement-locatif' });
  }

  const report = {
    title: txt.rTitle,
    highlight: { label: txt.rBrut, value: hasResult ? pct(res.rendementBrut) : "—" },
    params: [
      { label: txt.rPrix, value: prix ? fmtEur(prix) : "—" },
      { label: txt.rTravaux, value: (travaux ?? 0) > 0 ? fmtEur(travaux) : "—" },
      { label: txt.rApport, value: (apport ?? 0) > 0 ? fmtEur(apport) : "—" },
      { label: txt.rLoyer, value: loyer ? fmtEur(loyer) : "—" },
      { label: txt.rCopro, value: (chargesCopro ?? 0) > 0 ? `${fmtEur(chargesCopro)}${txt.perMonth}` : "—" },
      { label: txt.rTaxe, value: (taxeFonciere ?? 0) > 0 ? `${fmtEur(taxeFonciere)}/${isEn ? "year" : "an"}` : "—" },
    ],
    results: hasResult ? [
      { label: txt.rBrut, value: pct(res.rendementBrut), strong: true },
      { label: txt.rNet, value: pct(res.rendementNet) },
      { label: txt.rCashflow, value: `${fmtEur(Math.round(res.cashflowMensuel * 100) / 100)}${txt.perMonth}` },
      { label: txt.rPrixRevient, value: fmtEur(Math.round(res.prixRevient)) },
      ...(apport > 0 ? [{ label: txt.rFondsPropres, value: pct(res.rendementFondsPropres) }] : []),
    ] : [],
    notes: hasResult ? [
      res.cashflowAnnuel <= 0
        ? txt.noteNeg
        : txt.noteDuree(Math.round(res.dureeAmortissement)),
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": txt.appName,
        "url": `https://www.simfinly.com${isEn ? "/en/simulators/rental-yield" : "/simulateurs/rendement-locatif"}`,
        "description": txt.docDesc,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": isEn ? "en-US" : "fr-FR",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": txt.faq.map(f => ({
          "@type": "Question", "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }} />
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 16px 60px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/rendement-locatif" size={34} />}
          badge={txt.badge}
          title={txt.title}
          desc={txt.desc}
        />

        {/* Formulaire — Bien */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 20, boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>{txt.bienTitle}</h2>
          <NumInput id="prix" label={txt.prixLabel} value={prix} onChange={setPrix} unit="€" min={20000} max={5000000}
            hint={prix ? txt.prixHint(prix * (neuf ? 0.025 : 0.075)) : txt.prixHintEmpty}
          />
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>{txt.typeLabel}</label>
            <Toggle options={[txt.toggleAncien, txt.toggleNeuf]} checked={neuf} onChange={setNeuf} />
          </div>
          <StepperInput
            label={txt.travauxLabel}
            value={travaux} onChange={setTravaux} min={0} max={500000} step={5000} unit=" €"
            hint={travaux > 0 ? txt.travauxHintOn : txt.travauxHintOff}
          />
          <StepperInput
            label={txt.apportLabel}
            value={apport} onChange={setApport} min={0} max={999999} step={10000} unit=" €"
            hint={apport > 0 ? txt.apportHintOn : txt.apportHintOff}
          />
        </div>

        {/* Formulaire — Revenus */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 20, boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>{txt.revenusTitle}</h2>
          <NumInput id="loyer" label={txt.loyerLabel} value={loyer} onChange={setLoyer} unit="€/mois" min={100} max={10000}
            hint={loyer ? txt.loyerHint(loyer * 12) : txt.loyerHintEmpty}
          />
          <NumInput id="charges-copro" label={txt.coproLabel} value={chargesCopro} onChange={setChargesCopro} unit="€/mois" min={0} max={2000}
            hint={chargesCopro > 0 ? txt.coproHint(chargesCopro * 12) : txt.coproHintEmpty}
          />
          <NumInput id="taxe-fonciere" label={txt.taxeLabel} value={taxeFonciere} onChange={setTaxeFonciere} unit="€/an" min={0} max={50000}
            hint={txt.taxeHint}
          />
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>{txt.gestionLabel}</label>
            <Toggle options={[txt.toggleGestionNo, txt.toggleGestionYes]} checked={gestionLocative} onChange={setGestionLocative} />
          </div>
        </div>

        {/* Résultats */}
        {hasResult && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 20, boxShadow: "var(--card-shadow)" }} ref={resultsRef}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>{txt.rentabiliteTitle}</h2>

            {/* Rendement brut */}
            <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'Hanken Grotesk', sans-serif", marginBottom: 6 }}>{txt.brutLabel}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 42, color: "var(--primary)", lineHeight: 1 }}>
                {pct(rendementBrutAnim)}
              </div>
            </div>

            {/* Rendement net */}
            <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'Hanken Grotesk', sans-serif", marginBottom: 6 }}>{txt.netLabel}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(36px,8vw,56px)", fontWeight: 700, lineHeight: 1, color: res.rendementNet > 0 ? "var(--text)" : "rgba(239,68,68,0.8)" }}>
                {pct(rendementNetAnim)}
              </div>
              {res.cashflowAnnuel <= 0 && (
                <div style={{ marginTop: 10, fontSize: 12, color: "rgba(239,68,68,0.8)" }}>
                  {txt.fluxNeg}
                </div>
              )}
            </div>

            {/* Chips récapitulatif */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
              <Chip label={txt.chipPrixRevient} value={fmtEur(res.prixRevient)} />
              <Chip label={txt.chipCashflow} value={fmtEur(Math.round(res.cashflowMensuel * 100) / 100)} accent={res.cashflowMensuel > 0} />
              {apport > 0 && <Chip label={txt.chipFondsPropres} value={pct(res.rendementFondsPropres)} accent />}
              {res.dureeAmortissement > 0 && <Chip label={txt.chipDuree} value={`${Math.round(res.dureeAmortissement)} ${txt.yearsUnit}`} />}
            </div>

            <ShareBar
              params={{ prix, travaux, apport, loyer, chargesCopro, taxeFonciere }}
              resultsRef={resultsRef}
              report={report}
              name="rendement-locatif"
            />
            <AffiliateCTA type="emprunt" />
          </div>
        )}

        {/* Graphique rendements */}
        {hasResult && rendChart.length > 0 && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 24, boxShadow: "var(--card-shadow)" }}>
            <div style={{ fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text-secondary)", marginBottom: 12 }}>
              {txt.chartTitle}
            </div>
            <ZoomableChart caption={txt.chartTitle}>
              <BarChart
                bars={rendChart}
                yFmt={(v) => `${v}${txt.pctSuffix}`}
                aria={txt.chartAria}
              />
            </ZoomableChart>
          </div>
        )}

        {/* Comparaison de 2 scénarios (prix / loyer) */}
        {hasResult && !compareOn && (
          <button
            onClick={startCompare}
            style={{ width: "100%", marginBottom: 20, padding: "14px 20px", borderRadius: 14, cursor: "pointer", background: "var(--surface)", border: "1px dashed var(--border)", color: "var(--primary)", fontSize: 14, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
          >
            {txt.compareBtn}
          </button>
        )}

        {hasResult && compareOn && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 20, boxShadow: "var(--card-shadow)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 600, color: "var(--text)" }}>{txt.compareTitle}</h3>
              <button onClick={() => setCompareOn(false)} aria-label={txt.closeCompare} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
            <div className="cmp-grid">
              <div>
                <div style={{ fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text-secondary)", marginBottom: 10 }}>{txt.scenarioA}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.9 }}>
                  <li>{txt.prixLine}<strong style={{ color: "var(--text)" }}>{fmtEur(prix)}</strong></li>
                  <li>{txt.loyerLine}<strong style={{ color: "var(--text)" }}>{fmtEur(loyer)}{txt.perMonth}</strong></li>
                </ul>
                <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{txt.rendNet}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--text)" }}>{pct(res.rendementNet)}</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 8 }}>{txt.cashflow}</div>
                <div style={{ fontSize: 15, color: "var(--text)" }}>{fmtEur(Math.round(res.cashflowMensuel))}{txt.perMonth}</div>
              </div>
              <div className="cmp-colB" style={{ borderLeft: "1px solid var(--border)", paddingLeft: 18 }}>
                <div style={{ fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--primary)", marginBottom: 10 }}>{txt.scenarioB}</div>
                <NumInput id="b-prix" label={txt.bPrixLabel} value={bPrix} onChange={setBPrix} unit="€" min={0} max={5000000} />
                <NumInput id="b-loyer" label={txt.bLoyerLabel} value={bLoyer} onChange={setBLoyer} unit="€" min={0} max={50000} />
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>{txt.rendNet}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--primary)" }}>{hasB ? pct(resB.rendementNet) : "—"}</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 8 }}>{txt.cashflow}</div>
                <div style={{ fontSize: 15, color: "var(--text)" }}>{hasB ? `${fmtEur(Math.round(resB.cashflowMensuel))}${txt.perMonth}` : "—"}</div>
              </div>
            </div>
            {hasB && (
              <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[{ label: txt.ecartNet, v: `${deltaNet >= 0 ? "+" : "−"}${Math.abs(deltaNet).toFixed(2)} ${txt.ptsUnit}`, good: deltaNet >= 0 }, { label: txt.ecartCash, v: `${deltaCash >= 0 ? "+" : "−"}${fmtEur(Math.abs(Math.round(deltaCash)))}${txt.perMonth}`, good: deltaCash >= 0 }].map(({ label, v, good }) => (
                  <div key={label} style={{ padding: "12px 14px", borderRadius: 12, textAlign: "center", background: good ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${good ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}` }}>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>{label}{txt.ecartSuffix}</div>
                    <strong style={{ fontSize: 16, color: good ? "#22c55e" : "#ef4444" }}>{v}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!hasResult && prix === null && loyer === null && (
          <div style={{ textAlign: "center", padding: "40px 28px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, color: "var(--text-secondary)" }}>
            {txt.emptyMsg}
          </div>
        )}

        {/* Détail charges */}
        {hasResult && (
          <AccordionSection title={txt.detailTitle} subtitle={txt.detailSubtitle}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>{txt.dCopro}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{fmtEur(chargesCopro * 12)}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>{txt.dTaxe}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{fmtEur(taxeFonciere)}</div>
              </div>
              {gestionLocative && (
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>{txt.dGestion}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{fmtEur(res.gestionLocativeAnnuelle)}</div>
                </div>
              )}
              <div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>{txt.dTotal}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--primary)" }}>{fmtEur(res.chargesAnnuelles)}</div>
              </div>
            </div>
            <ProgressBar label={txt.progressLabel} value={res.chargesAnnuelles} total={loyer * 12} color="linear-gradient(90deg,rgba(239,68,68,0.6),rgba(239,68,68,0.3))" />
          </AccordionSection>
        )}

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>

        {/* À propos */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>{txt.aboutTitle}</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>{txt.aboutH1}</h3>
            <p style={{ marginBottom: 16 }}>{txt.aboutP1}</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.aboutH2}</h3>
            <p style={{ marginBottom: 16 }}>{txt.aboutP2}</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.aboutH3}</h3>
            <p>{txt.aboutP3}</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>{txt.faqTitle}</h2>
          {txt.faq.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
        </div>

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>
      </div>
      <FaqSection items={txt.faq} />
      <Footer />
    </div>
  );
}

