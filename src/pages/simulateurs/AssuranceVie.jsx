import { useState, useEffect, useRef, useMemo } from "react";
import { PS_CAPITAL } from "../../config/constants.js";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import { useTheme } from "../../hooks/useTheme.js";
import { useTranslation } from "../../i18n/index.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import Terme from "../../components/Terme.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import AffiliateCTA from "../../components/AffiliateCTA.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import ZoomableChart from "../../components/ZoomableChart.jsx";
import LineAreaChart from "../../components/charts/LineAreaChart.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import AdUnit from "../../components/AdUnit.jsx";
import ScenarioCompare from "../../components/ScenarioCompare.jsx";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, Toggle, StatusBadge, useAnimatedNumber,
  fmtEur, SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";

// ─── Barème assurance-vie ────────────────────────────────────────────────────
// Fiscalité des rachats sur un contrat d'assurance-vie. Constantes 2025.
//
// ⚠ Valeurs INDICATIVES, isolées volontairement dans ce bloc pour être corrigées
// facilement. Ne portent que sur les gains (plus-values), jamais sur le capital
// versé. La fiscalité réelle dépend de la date des versements (avant/après 2017)
// et du montant total des primes ; les figures ci-dessous (2025/2026) supposent
// des versements postérieurs au 27/09/2017 et des primes ≤ 150 000 €.
const PS = PS_CAPITAL;
const PFU = 0.30;            // Prélèvement forfaitaire unique avant 8 ans (12,8 % IR + 17,2 % PS)
const PFL_APRES_8ANS = 0.075; // Prélèvement forfaitaire 7,5 % (primes ≤ 150 000 €) après 8 ans
const ABATTEMENT_SEUL = 4600;   // Abattement annuel sur les gains, personne seule
const ABATTEMENT_COUPLE = 9200; // Abattement annuel sur les gains, couple
const ABATTEMENT_SUCCESSION = 152500; // Abattement par bénéficiaire (primes avant 70 ans)

// Valeur future : versement initial capitalisé + versements mensuels (annuités).
// Compute pur (mêmes formules + fiscalité que le rendu) réutilisé par la
// comparaison de 2 scénarios. couple reste identique entre A et B.
function computeAV({ initial, mensuel, rendement, duree, couple }) {
  const vi = initial ?? 0, vm = mensuel ?? 0;
  const capital = capitalFinal(vi, vm, rendement ?? 0, duree ?? 0);
  const totalVerse = vi + vm * 12 * (duree ?? 0);
  const plusValue = Math.max(0, capital - totalVerse);
  let impot;
  if ((duree ?? 0) < 8) {
    impot = plusValue * PFU;
  } else {
    const abattement = couple ? ABATTEMENT_COUPLE : ABATTEMENT_SEUL;
    impot = Math.max(0, plusValue - abattement) * (PFL_APRES_8ANS + PS);
  }
  return { capitalNet: capital - impot, plusValue };
}

function capitalFinal(initial, mensuel, tauxPct, annees) {
  const r = tauxPct / 100;
  const versementAnnuel = mensuel * 12;
  const fvInitial = initial * Math.pow(1 + r, annees);
  let fvFlux;
  if (r === 0) fvFlux = versementAnnuel * annees;
  else fvFlux = versementAnnuel * ((Math.pow(1 + r, annees) - 1) / r);
  return fvInitial + fvFlux;
}

const sectionTitle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 20 };

// ─── Textes (FR / EN) ──────────────────────────────────────────────────────────
// Contenu décrivant la fiscalité française de l'assurance-vie, en français et en
// anglais (public expatrié / international intéressé par les produits français).
const TXT = {
  fr: {
    docTitle: "Simulateur Assurance-Vie 2025 — Capital, gains et fiscalité",
    docDesc: "Projetez la croissance de votre assurance-vie et estimez la fiscalité de vos gains au rachat : avantage des 8 ans, abattement, PFU et prélèvements sociaux. Paramètres 2025.",
    appName: "Simulateur Assurance-Vie 2025",
    ogDesc: "Projetez la croissance de votre assurance-vie et estimez la fiscalité de vos gains au rachat : avantage des 8 ans, abattement, PFU et prélèvements sociaux.",
    badge: "Finances · Simulation 2025",
    title: "Simulateur Assurance-Vie",
    subtitle: "Capital projeté · Fiscalité des gains",
    desc: "Projetez la croissance de votre contrat et estimez l'impôt sur les gains au rachat selon l'âge du contrat (avant ou après 8 ans). Abattement, PFU et prélèvements sociaux inclus.",
    versementsTitle: "Vos versements",
    initialLabel: "Versement initial",
    mensuelLabel: "Versement mensuel (optionnel)",
    mensuelHint: (annual) => `soit ${fmtEur(annual)}/an`,
    mensuelHintEmpty: "Laissez à 0 si aucun versement programmé",
    paramsTitle: "Paramètres du contrat",
    rendementLabel: "Rendement annuel net de frais de gestion",
    dureeLabel: "Durée de détention",
    dureeUnit: "ans",
    dureeHintAfter: "≥ 8 ans : fiscalité réduite + abattement annuel",
    dureeHintBefore: "Avant 8 ans : gains soumis au PFU de 30 %",
    situationLabel: "Situation fiscale",
    abattementSub: (ab) => `Abattement après 8 ans : ${fmtEur(ab)}`,
    toggleSeul: "Seul",
    toggleCouple: "Couple",
    netLabel: "Capital net à terme",
    emptyMsg: "Renseignez un versement initial ou mensuel pour voir votre estimation.",
    resultSub: (d, r) => `après ${d} ans à ${r} % · net d'impôt sur les gains`,
    badgeAfter: "Fiscalité réduite (≥ 8 ans)",
    badgeBefore: "Avant 8 ans (PFU 30 %)",
    chipTotal: "Total versé",
    chipPlusValue: "Plus-value",
    chipImpot: "Impôt estimé",
    chipBrut: "Capital brut",
    fiscaliteTitle: "Fiscalité appliquée aux gains",
    fiscaliteAfter: (ab, pfl, ps) => `Après 8 ans : abattement de ${fmtEur(ab)} sur les gains, puis ${pfl} % d'impôt (primes ≤ 150 000 €) + ${ps} % de prélèvements sociaux sur la part imposable.`,
    fiscaliteBefore: (pv) => `Avant 8 ans : les gains (${fmtEur(pv)}) sont soumis au prélèvement forfaitaire unique de 30 % (12,8 % d'impôt + 17,2 % de prélèvements sociaux).`,
    detailTitle: "Détail du calcul",
    dInitial: "Versement initial",
    dMensuelCumul: "Versements mensuels cumulés",
    dTotal: "Total versé",
    dBrut: "Capital brut à terme",
    dPlusValue: "Plus-value (gains)",
    dAbattement: (couple) => `Abattement (${couple ? "couple" : "seul"})`,
    dAbattementNo: "Abattement",
    dImpot: "Impôt estimé sur les gains",
    dNet: "Capital net après impôt",
    chartTitle: "Projection année par année",
    chartCaption: "Projection assurance-vie",
    serieVerse: "Total versé",
    serieBrut: "Capital brut",
    chartXFmt: (v) => `${v} an${v > 1 ? "s" : ""}`,
    annot8: "8 ans",
    scNet: "Capital net",
    scPlusValue: "Plus-value",
    fInitial: "Versement initial",
    fMensuel: "Versement mensuel",
    fRendement: "Rendement",
    fDuree: "Durée",
    aboutTitle: "À propos de l'assurance-vie",
    aboutH1: "Une enveloppe souple et fiscalement avantageuse",
    aboutP1: "L'assurance-vie reste le placement préféré des Français. Elle combine souplesse (versements et rachats libres), diversité des supports (fonds en euros sécurisés, unités de compte plus dynamiques) et une fiscalité avantageuse qui se renforce avec le temps. La fiscalité ne porte que sur les gains : le capital que vous avez versé n'est jamais taxé lors d'un rachat.",
    aboutH2: "L'avantage des 8 ans",
    aboutP2: <>Avant 8 ans, les gains rachetés sont soumis au <Terme slug="pfu">prélèvement forfaitaire unique</Terme> de 30 % (12,8 % d'impôt + 17,2 % de <Terme slug="prelevements-sociaux">prélèvements sociaux</Terme>). À partir de 8 ans de détention, vous profitez chaque année d'un <Terme slug="abattement">abattement</Terme> de 4 600 € (personne seule) ou 9 200 € (couple) sur les gains rachetés, et la part issue de primes ≤ 150 000 € n'est taxée qu'à 7,5 % d'impôt. C'est pourquoi il est conseillé de « prendre date » le plus tôt possible.</>,
    aboutH3: "Transmission et succession",
    aboutP3: (succ) => <>L'assurance-vie est aussi un outil de transmission. Pour les primes versées avant 70 ans, chaque bénéficiaire désigné bénéficie d'un abattement de {fmtEur(succ)} sur les capitaux transmis, hors succession. Cette enveloppe permet ainsi d'organiser la transmission de son patrimoine dans un cadre fiscal favorable, en désignant librement les bénéficiaires via la clause bénéficiaire.</>,
    disclaimer: "Simulation indicative basée sur la fiscalité 2025 · Le rendement n'est pas garanti · Ne constitue pas un conseil en investissement",
    faq: [
      { q: "Comment fonctionne un contrat d'assurance-vie ?", a: "L'assurance-vie est une enveloppe d'épargne dans laquelle vous versez librement des sommes investies sur un fonds en euros (capital garanti, rendement modéré) et/ou des unités de compte (potentiellement plus rémunératrices mais risquées). Les sommes restent disponibles : vous pouvez effectuer des rachats à tout moment. La fiscalité ne s'applique qu'aux gains, lors d'un rachat." },
      { q: "Pourquoi le cap des 8 ans est-il décisif ?", a: "Après 8 ans de détention, vous bénéficiez d'un abattement annuel sur les gains rachetés de 4 600 € (personne seule) ou 9 200 € (couple soumis à imposition commune). Au-delà de l'abattement, les gains issus de primes ≤ 150 000 € sont taxés à seulement 7,5 % d'impôt (au lieu de 12,8 %), auxquels s'ajoutent les prélèvements sociaux de 17,2 %. Avant 8 ans, les gains subissent le PFU de 30 %." },
      { q: "PFU ou barème de l'impôt sur le revenu ?", a: "Par défaut, les gains des contrats sont soumis au prélèvement forfaitaire unique (PFU). Mais vous pouvez opter, lors de la déclaration, pour l'imposition au barème progressif de l'impôt sur le revenu si elle vous est plus favorable (typiquement si votre TMI est de 0 % ou 11 %). Cette option est globale et s'applique à l'ensemble de vos revenus de capitaux mobiliers de l'année." },
      { q: "Les prélèvements sociaux de 17,2 % sont-ils toujours dus ?", a: "Oui. Quel que soit l'âge du contrat, les prélèvements sociaux de 17,2 % s'appliquent aux gains. Sur le fonds en euros, ils sont généralement prélevés chaque année « au fil de l'eau » ; sur les unités de compte, ils sont prélevés lors du rachat ou du dénouement. L'abattement après 8 ans ne concerne que la part « impôt sur le revenu », pas les prélèvements sociaux." },
      { q: "Quel est l'avantage successoral de l'assurance-vie ?", a: "L'assurance-vie est un outil de transmission privilégié. Pour les versements effectués avant vos 70 ans, chaque bénéficiaire désigné profite d'un abattement de 152 500 € sur les capitaux transmis, au-delà duquel s'applique une taxation forfaitaire. Les sommes sont transmises hors succession dans la limite de ces règles, ce qui en fait un dispositif très utilisé pour organiser sa transmission." },
      { q: "Ce simulateur est-il officiel ?", a: "Non. Il s'agit d'une estimation indicative basée sur les paramètres fiscaux 2025. Le calcul suppose un rendement constant et net de frais de gestion, des versements postérieurs à 2017 et des primes inférieures à 150 000 €. La fiscalité réelle dépend de votre situation et des dates exactes de versement. Rapprochez-vous de votre assureur ou d'un conseiller." },
    ],
    rTitle: "Simulateur Assurance-Vie",
    rNet: "Capital net à terme",
    rInitial: "Versement initial",
    rMensuel: "Versement mensuel",
    rRendement: "Rendement annuel net",
    rDuree: "Durée de détention",
    rSituation: "Situation fiscale",
    rNetAfter: "Capital net après impôt",
    rBrut: "Capital brut à terme",
    rTotal: "Total versé",
    rPlusValue: "Plus-value (gains)",
    rImpot: "Impôt estimé sur les gains",
    rNoteAfter: (ab) => `Après 8 ans : abattement de ${fmtEur(ab)} puis 7,5 % d'impôt + 17,2 % de prélèvements sociaux.`,
    rNoteBefore: "Avant 8 ans : gains soumis au prélèvement forfaitaire unique de 30 %.",
  },
  en: {
    docTitle: "French Life Insurance Calculator 2025 — Capital, Gains & Tax",
    docDesc: "Project the growth of a French life insurance (assurance-vie) policy and estimate the tax on your gains at withdrawal: the 8-year advantage, allowance, flat tax and social levies. 2025 figures.",
    appName: "French Life Insurance Calculator 2025",
    ogDesc: "Project the growth of a French life insurance policy and estimate the tax on your gains at withdrawal: 8-year advantage, allowance, flat tax and social levies.",
    badge: "Finance · 2025 simulation",
    title: "Life Insurance Calculator",
    subtitle: "Projected capital · Tax on gains",
    desc: "Project the growth of your French assurance-vie policy and estimate the tax on gains at withdrawal depending on the policy's age (before or after 8 years). Allowance, flat tax and social levies included.",
    versementsTitle: "Your payments",
    initialLabel: "Initial payment",
    mensuelLabel: "Monthly payment (optional)",
    mensuelHint: (annual) => `i.e. ${fmtEur(annual)}/year`,
    mensuelHintEmpty: "Leave at 0 if no scheduled payment",
    paramsTitle: "Policy settings",
    rendementLabel: "Annual return, net of management fees",
    dureeLabel: "Holding period",
    dureeUnit: "yrs",
    dureeHintAfter: "≥ 8 years: reduced tax + annual allowance",
    dureeHintBefore: "Before 8 years: gains taxed at the 30% flat tax",
    situationLabel: "Tax situation",
    abattementSub: (ab) => `Allowance after 8 years: ${fmtEur(ab)}`,
    toggleSeul: "Single",
    toggleCouple: "Couple",
    netLabel: "Net capital at maturity",
    emptyMsg: "Enter an initial or monthly payment to see your estimate.",
    resultSub: (d, r) => `after ${d} years at ${r}% · net of tax on gains`,
    badgeAfter: "Reduced tax (≥ 8 years)",
    badgeBefore: "Before 8 years (30% flat tax)",
    chipTotal: "Total paid in",
    chipPlusValue: "Gains",
    chipImpot: "Estimated tax",
    chipBrut: "Gross capital",
    fiscaliteTitle: "Tax applied to gains",
    fiscaliteAfter: (ab, pfl, ps) => `After 8 years: a ${fmtEur(ab)} allowance on gains, then ${pfl}% income tax (premiums ≤ €150,000) + ${ps}% social levies on the taxable portion.`,
    fiscaliteBefore: (pv) => `Before 8 years: gains (${fmtEur(pv)}) are subject to the 30% single flat tax (12.8% income tax + 17.2% social levies).`,
    detailTitle: "Calculation details",
    dInitial: "Initial payment",
    dMensuelCumul: "Cumulative monthly payments",
    dTotal: "Total paid in",
    dBrut: "Gross capital at maturity",
    dPlusValue: "Gains",
    dAbattement: (couple) => `Allowance (${couple ? "couple" : "single"})`,
    dAbattementNo: "Allowance",
    dImpot: "Estimated tax on gains",
    dNet: "Net capital after tax",
    chartTitle: "Year-by-year projection",
    chartCaption: "Life insurance projection",
    serieVerse: "Total paid in",
    serieBrut: "Gross capital",
    chartXFmt: (v) => `${v} yr${v > 1 ? "s" : ""}`,
    annot8: "8 years",
    scNet: "Net capital",
    scPlusValue: "Gains",
    fInitial: "Initial payment",
    fMensuel: "Monthly payment",
    fRendement: "Return",
    fDuree: "Duration",
    aboutTitle: "About French life insurance",
    aboutH1: "A flexible, tax-friendly wrapper",
    aboutP1: "Assurance-vie remains the favourite investment of French households. It combines flexibility (free payments and withdrawals), a range of underlying funds (secure euro funds, more dynamic unit-linked supports) and a tax treatment that improves over time. Tax applies only to gains: the capital you paid in is never taxed on a withdrawal.",
    aboutH2: "The 8-year advantage",
    aboutP2: <>Before 8 years, withdrawn gains are subject to the <Terme slug="pfu">single flat tax</Terme> of 30% (12.8% income tax + 17.2% <Terme slug="prelevements-sociaux">social levies</Terme>). From 8 years of holding, you benefit every year from an <Terme slug="abattement">allowance</Terme> of €4,600 (single) or €9,200 (couple) on withdrawn gains, and the share from premiums ≤ €150,000 is taxed at only 7.5% income tax. This is why it pays to "start the clock" as early as possible.</>,
    aboutH3: "Estate transfer and inheritance",
    aboutP3: (succ) => <>Assurance-vie is also an estate-planning tool. For premiums paid before age 70, each named beneficiary benefits from a {fmtEur(succ)} allowance on the capital transferred, outside the estate. This wrapper lets you organise the transfer of your wealth in a favourable tax framework, freely naming beneficiaries through the beneficiary clause.</>,
    disclaimer: "Indicative simulation based on 2025 French taxation · Returns are not guaranteed · Not investment advice",
    faq: [
      { q: "How does a life insurance (assurance-vie) policy work?", a: "Assurance-vie is a savings wrapper into which you freely pay sums invested in a euro fund (guaranteed capital, modest return) and/or unit-linked supports (potentially higher returns but risky). The money stays available: you can make withdrawals at any time. Tax applies only to gains, at withdrawal." },
      { q: "Why is the 8-year mark decisive?", a: "After 8 years of holding, you get an annual allowance on withdrawn gains of €4,600 (single) or €9,200 (couple taxed jointly). Beyond the allowance, gains from premiums ≤ €150,000 are taxed at just 7.5% income tax (instead of 12.8%), plus 17.2% social levies. Before 8 years, gains are subject to the 30% flat tax." },
      { q: "Flat tax or income tax scale?", a: "By default, gains are subject to the single flat tax (PFU). But you can elect, on your tax return, to be taxed at the progressive income tax scale if it is more favourable (typically if your marginal rate is 0% or 11%). This option is global and applies to all of your investment income for the year." },
      { q: "Are the 17.2% social levies always due?", a: "Yes. Whatever the policy's age, the 17.2% social levies apply to gains. On the euro fund they are generally taken each year as they accrue; on unit-linked supports they are taken at withdrawal or settlement. The post-8-year allowance only concerns the income-tax part, not the social levies." },
      { q: "What is the inheritance advantage of life insurance?", a: "Assurance-vie is a privileged transfer tool. For payments made before age 70, each named beneficiary benefits from a €152,500 allowance on the capital transferred, beyond which a flat taxation applies. Sums are transferred outside the estate within these rules, which makes it widely used to organise estate transfer." },
      { q: "Is this calculator official?", a: "No. It is an indicative estimate based on 2025 French tax parameters. The calculation assumes a constant return net of management fees, payments made after 2017 and premiums below €150,000. The actual tax depends on your situation and the exact payment dates. Speak to your insurer or an adviser." },
    ],
    rTitle: "Life Insurance Calculator",
    rNet: "Net capital at maturity",
    rInitial: "Initial payment",
    rMensuel: "Monthly payment",
    rRendement: "Annual net return",
    rDuree: "Holding period",
    rSituation: "Tax situation",
    rNetAfter: "Net capital after tax",
    rBrut: "Gross capital at maturity",
    rTotal: "Total paid in",
    rPlusValue: "Gains",
    rImpot: "Estimated tax on gains",
    rNoteAfter: (ab) => `After 8 years: ${fmtEur(ab)} allowance then 7.5% income tax + 17.2% social levies.`,
    rNoteBefore: "Before 8 years: gains subject to the 30% single flat tax.",
  },
};

// ─── Simulateur ───────────────────────────────────────────────────────────────
export default function AssuranceVie() {
  const [theme, setTheme] = useTheme();
  const isMobile = useIsMobile();
  const { locale } = useTranslation();
  const txt = TXT[locale] || TXT.fr;
  const isEn = locale === "en";

  const card = {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 16, padding: isMobile ? "20px 16px" : "24px 20px",
    marginBottom: 20, boxShadow: "var(--card-shadow)",
  };

  const [initial, setInitial]   = useState(null);
  const [mensuel, setMensuel]   = useState(0);
  const [rendement, setRendement] = useState(2.5);
  const [duree, setDuree]       = useState(8);
  const [couple, setCouple]     = useState(false);

  const resultsRef = useRef(null);

  usePageMeta(txt.docTitle, txt.docDesc);

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'assurance-vie' });
    if (!sessionStorage.getItem('tracked_assurance-vie')) {
      sessionStorage.setItem('tracked_assurance-vie', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'assurance-vie' })
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.initial !== undefined) setInitial(shared.initial);
      if (shared.mensuel !== undefined) setMensuel(shared.mensuel);
      if (shared.rendement !== undefined) setRendement(shared.rendement);
      if (shared.duree !== undefined) setDuree(shared.duree);
      if (shared.couple !== undefined) setCouple(shared.couple);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ initial, mensuel, rendement, duree, couple }));
  }, [initial, mensuel, rendement, duree, couple]);

  // ── Calculs ──
  const versementInitial = initial ?? 0;
  const versementMensuel = mensuel ?? 0;
  const capital = capitalFinal(versementInitial, versementMensuel, rendement, duree);
  const totalVerse = versementInitial + versementMensuel * 12 * duree;
  const plusValue = Math.max(0, capital - totalVerse);

  const apres8ans = duree >= 8;
  let impot;
  if (!apres8ans) {
    impot = plusValue * PFU;
  } else {
    const abattement = couple ? ABATTEMENT_COUPLE : ABATTEMENT_SEUL;
    const base = Math.max(0, plusValue - abattement);
    impot = base * (PFL_APRES_8ANS + PS);
  }
  const capitalNet = capital - impot;

  const hasInput = capital > 0 && totalVerse > 0;

  const animNet = useAnimatedNumber(capitalNet);
  const animPlusValue = useAnimatedNumber(plusValue);

  const avProjection = useMemo(() => {
    if (!hasInput || duree < 1) return [];
    return Array.from({ length: duree + 1 }, (_, y) => ({
      x: y,
      verse: versementInitial + versementMensuel * 12 * y,
      brut: y === 0 ? versementInitial : capitalFinal(versementInitial, versementMensuel, rendement, y),
    }));
  }, [versementInitial, versementMensuel, rendement, duree, hasInput]);

  const report = {
    title: txt.rTitle,
    highlight: { label: txt.rNet, value: hasInput ? fmtEur(Math.round(capitalNet)) : "—" },
    params: [
      { label: txt.rInitial, value: fmtEur(versementInitial) },
      { label: txt.rMensuel, value: versementMensuel > 0 ? fmtEur(versementMensuel) : "—" },
      { label: txt.rRendement, value: `${rendement} %` },
      { label: txt.rDuree, value: `${duree} ${txt.dureeUnit}` },
      { label: txt.rSituation, value: couple ? txt.toggleCouple : txt.toggleSeul },
    ],
    results: hasInput ? [
      { label: txt.rNetAfter, value: fmtEur(Math.round(capitalNet)), strong: true },
      { label: txt.rBrut, value: fmtEur(Math.round(capital)) },
      { label: txt.rTotal, value: fmtEur(totalVerse) },
      { label: txt.rPlusValue, value: fmtEur(Math.round(plusValue)) },
      { label: txt.rImpot, value: fmtEur(Math.round(impot)) },
    ] : [],
    notes: hasInput ? [
      apres8ans
        ? txt.rNoteAfter(couple ? ABATTEMENT_COUPLE : ABATTEMENT_SEUL)
        : txt.rNoteBefore,
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": txt.appName,
        "url": `https://www.simfinly.com${isEn ? "/en/simulators/life-insurance" : "/simulateurs/assurance-vie"}`,
        "description": txt.ogDesc,
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
      <main id="main-content" style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "28px 16px 60px" : "28px 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/assurance-vie" size={34} />}
          badge={txt.badge}
          title={txt.title}
          subtitle={txt.subtitle}
          desc={txt.desc}
        />

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "330px 1fr", gap: 24 }}>

          {/* ── Colonne formulaire ── */}
          <div style={{ order: isMobile ? 2 : 1 }}>
            {/* Versements */}
            <div style={card}>
              <h2 style={sectionTitle}>{txt.versementsTitle}</h2>
              <NumInput label={txt.initialLabel} value={initial} onChange={setInitial} unit="€" min={0} max={2000000} />
              <NumInput label={txt.mensuelLabel} value={mensuel} onChange={setMensuel} unit="€" min={0} max={50000}
                hint={versementMensuel > 0 ? txt.mensuelHint(versementMensuel * 12) : txt.mensuelHintEmpty} />
            </div>

            {/* Paramètres */}
            <div style={card}>
              <h2 style={sectionTitle}>{txt.paramsTitle}</h2>
              <StepperInput label={txt.rendementLabel} value={rendement} onChange={setRendement} min={0} max={12} step={0.1} unit="%" />
              <StepperInput label={txt.dureeLabel} value={duree} onChange={v => setDuree(Math.round(v))} min={1} max={40} step={1} unit={txt.dureeUnit}
                hint={apres8ans ? txt.dureeHintAfter : txt.dureeHintBefore} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{txt.situationLabel}</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                    {txt.abattementSub(couple ? ABATTEMENT_COUPLE : ABATTEMENT_SEUL)}
                  </div>
                </div>
                <Toggle options={[txt.toggleSeul, txt.toggleCouple]} checked={couple} onChange={setCouple} />
              </div>
            </div>
          </div>

          {/* ── Colonne résultats ── */}
          <div style={{ order: isMobile ? 1 : 2, minWidth: 0 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 20, textAlign: "center", boxShadow: "var(--card-shadow)" }} ref={resultsRef}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'Hanken Grotesk', sans-serif", marginBottom: 6 }}>
                {txt.netLabel}
              </div>
              {!hasInput ? (
                <p style={{ color: "var(--text-secondary)", padding: "20px 0", fontSize: 14 }}>
                  {txt.emptyMsg}
                </p>
              ) : (
                <>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 42, color: "var(--primary)", lineHeight: 1 }}>
                    {fmtEur(Math.round(animNet))}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
                    {txt.resultSub(duree, rendement)}
                  </div>
                  <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                    {apres8ans
                      ? <StatusBadge status="good" label={txt.badgeAfter} />
                      : <StatusBadge status="warn" label={txt.badgeBefore} />}
                  </div>
                </>
              )}

              <ShareBar
                params={{ initial, mensuel, rendement, duree, couple }}
                resultsRef={resultsRef}
                report={report}
                name="assurance-vie"
              />
            </div>

            {hasInput && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <Chip label={txt.chipTotal} value={fmtEur(totalVerse)} small />
                <Chip label={txt.chipPlusValue} value={fmtEur(Math.round(animPlusValue))} accent small />
                <Chip label={txt.chipImpot} value={fmtEur(Math.round(impot))} small />
                <Chip label={txt.chipBrut} value={fmtEur(Math.round(capital))} small />
              </div>
            )}

            {hasInput && (
              <div style={card}>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 }}>
                  {txt.fiscaliteTitle}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {apres8ans
                    ? txt.fiscaliteAfter(couple ? ABATTEMENT_COUPLE : ABATTEMENT_SEUL, Math.round(PFL_APRES_8ANS * 100 * 10) / 10, Math.round(PS * 1000) / 10)
                    : txt.fiscaliteBefore(Math.round(plusValue))}
                </div>
              </div>
            )}

            {hasInput && (
              <AccordionSection title={txt.detailTitle} defaultOpen>
                {[
                  { label: txt.dInitial, value: fmtEur(versementInitial) },
                  { label: txt.dMensuelCumul, value: fmtEur(versementMensuel * 12 * duree) },
                  { label: txt.dTotal, value: fmtEur(totalVerse) },
                  { label: txt.dBrut, value: fmtEur(Math.round(capital)), accent: true },
                  { label: txt.dPlusValue, value: fmtEur(Math.round(plusValue)) },
                  { label: apres8ans ? txt.dAbattement(couple) : txt.dAbattementNo, value: apres8ans ? fmtEur(couple ? ABATTEMENT_COUPLE : ABATTEMENT_SEUL) : "—" },
                  { label: txt.dImpot, value: fmtEur(Math.round(impot)), accent: true },
                  { label: txt.dNet, value: fmtEur(Math.round(capitalNet)), accent: true },
                ].map(({ label, value, accent }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: accent ? "var(--gold)" : "var(--text)" }}>{value}</span>
                  </div>
                ))}
              </AccordionSection>
            )}
          </div>
        </div>

        {/* Graphique projection */}
        {hasInput && avProjection.length > 1 && (
          <div style={{ ...card, marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 12 }}>
              {txt.chartTitle}
            </div>
            <ZoomableChart caption={txt.chartCaption}>
              <LineAreaChart
                series={[
                  { id: "verse", label: txt.serieVerse, points: avProjection.map(p => ({ x: p.x, y: p.verse })), color: "#8b9bb4", fillColor: "rgba(139,155,180,0.12)" },
                  { id: "brut", label: txt.serieBrut, points: avProjection.map(p => ({ x: p.x, y: p.brut })), color: "var(--primary)", fillColor: "rgba(43,92,230,0.12)" },
                ]}
                xFmt={txt.chartXFmt}
                yFmt={(v) => v >= 1_000_000 ? `${(v / 1e6).toFixed(1)}M€` : `${Math.round(v / 1000)}k€`}
                annotations={duree >= 8 ? [{ x: 8, label: txt.annot8, color: "var(--primary)", dashed: true }] : []}
                aria={txt.chartCaption}
              />
            </ZoomableChart>
          </div>
        )}

        {/* Comparaison de 2 scénarios */}
        {hasInput && (
          <ScenarioCompare
            name="assurance-vie"
            base={{ initial, mensuel, rendement, duree, couple }}
            compute={computeAV}
            fields={[
              { key: "initial", label: txt.fInitial, unit: "€", kind: "eur", type: "num", min: 0, max: 500000 },
              { key: "mensuel", label: txt.fMensuel, unit: "€", kind: "eur", type: "num", min: 0, max: 10000 },
              { key: "rendement", label: txt.fRendement, unit: "%", type: "step", min: 0, max: 10, step: 0.5 },
              { key: "duree", label: txt.fDuree, unit: txt.dureeUnit, type: "step", min: 1, max: 40, step: 1 },
            ]}
            metrics={[
              { label: txt.scNet, get: r => r.capitalNet, fmt: n => fmtEur(Math.round(n)), higherBetter: true },
              { label: txt.scPlusValue, get: r => r.plusValue, fmt: n => fmtEur(Math.round(n)), higherBetter: true },
            ]}
          />
        )}

        {/* Affiliation */}
        {hasInput && <AffiliateCTA type="assurance-vie" />}

        {/* AdSense mid */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {/* À propos */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>{txt.aboutTitle}</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>{txt.aboutH1}</h3>
            <p style={{ marginBottom: 16 }}>{txt.aboutP1}</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.aboutH2}</h3>
            <p style={{ marginBottom: 16 }}>{txt.aboutP2}</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.aboutH3}</h3>
            <p>{txt.aboutP3(ABATTEMENT_SUCCESSION)}</p>
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
