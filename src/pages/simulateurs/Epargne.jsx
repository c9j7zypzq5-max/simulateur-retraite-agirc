import { useState, useEffect, useRef, useMemo } from "react";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import ShareBar from "../../components/ShareBar.jsx";
import AffiliateCTA from "../../components/AffiliateCTA.jsx";
import HistoricalReturnPicker from "../../components/HistoricalReturnPicker.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import EmbedSnippet from "../../components/EmbedSnippet.jsx";
import ZoomableChart from "../../components/ZoomableChart.jsx";
import LineAreaChart from "../../components/charts/LineAreaChart.jsx";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, ProgressBar, useAnimatedNumber,
  FaqItem, SimulateurHeader,
} from "../../components/ui.jsx";
import { useMoney } from "../../i18n/CurrencyContext.jsx";
import { useTranslation } from "../../i18n/index.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

const TXT = {
  fr: {
    docTitle: "Simulateur Épargne 2025 — Intérêts composés et capital final",
    docDesc: "Simulez la croissance de votre épargne avec les intérêts composés : capital final, intérêts générés, tableau annuel.",
    badge: "Finances · Simulation 2026",
    title: "Épargne & intérêts composés",
    desc: "Projetez la croissance de votre épargne sur le long terme grâce à la puissance des intérêts composés et des versements réguliers.",
    params: "Paramètres",
    capitalInitial: "Capital initial",
    capitalHint: "Votre épargne actuelle",
    capitalHint2: "Montant de départ (peut être 0)",
    versement: (sym) => `Versement mensuel`,
    versementUnit: (sym) => `${sym}/mois`,
    versementHint: "Apport régulier chaque mois",
    versementAnnuel: (v, fmt) => `Annualisé : ${fmt(v * 12)}/an`,
    taux: "Taux de rendement annuel",
    tauxHint: "Taux nominal constant supposé (non réinvestis manquants)",
    tauxTooltip: "Exemples : 1 % (compte courant), 3 % (assurance-vie fonds euros), 6 % (obligations/actions moyennes)",
    duree: "Durée de l'épargne",
    dureeHint: (n) => `${n * 12} mois d'épargne`,
    dureeUnit: " ans",
    projection: "Projection de votre épargne",
    capitalFinalLabel: "Capital final estimé",
    after: (n) => `après ${n} ${n > 1 ? "années" : "année"}`,
    at: (t) => `à ${t} % annuels`,
    totalVerse: "Total versé",
    interets: "Intérêts générés",
    multiplicateur: "Multiplicateur",
    gain: "Gain %",
    compo: "Composition : capital + intérêts",
    disclaimer: "⚠️ Simulation indicative. Les performances passées ne préjugent pas des performances futures. Taux de rendement constant supposé. Résultats avant fiscalité et inflation.",
    compareBtn: "⚖️ Comparer un 2ᵉ scénario",
    compareTitle: "Comparaison de scénarios",
    scenarioA: "Scénario A (actuel)",
    scenarioB: "Scénario B",
    capitalInitialLabel: "Capital initial",
    versementMensuel: "Versement mensuel",
    tauxLabel: "Taux annuel",
    dureeLabel: "Durée",
    capitalFinalResult: "Capital final",
    ecart: "Écart B − A",
    noResult: "Saisissez votre capital initial et/ou vos versements mensuels pour voir votre projection.",
    yearlyTable: "Évolution annuelle",
    yearlySubtitle: (n) => `Année par année sur ${n} ans`,
    colYear: "Année",
    colCapital: "Capital",
    colVersements: "Versements",
    colInterets: "Intérêts",
    rowYear: (n) => `Année ${n}`,
    aboutTitle: "À propos de ce simulateur",
    h3Magic: "La magie des intérêts composés",
    pMagic: "L'épargne à long terme tire toute sa puissance des intérêts composés : les intérêts générés chaque année s'ajoutent au capital et produisent eux-mêmes des intérêts l'année suivante. Ce mécanisme crée une croissance exponentielle. Ainsi, 10 000 € investis à 5 % par an valent 16 289 € après 10 ans, 26 533 € après 20 ans et 43 219 € après 30 ans — le capital a plus que quadruplé sans aucun versement supplémentaire.",
    h3Rule72: "La règle des 72",
    pRule72: "La règle des 72 est un raccourci mental pour estimer le temps nécessaire à un capital pour doubler : divisez 72 par le taux d'intérêt annuel. À 4 %, un capital double en environ 18 ans. À 6 %, en 12 ans. À 9 %, en 8 ans. Cette règle donne une intuition immédiate de l'impact du taux choisi sur la croissance de son épargne et souligne l'importance de chercher le meilleur rendement possible.",
    h3Duration: "Durée vs taux : l'arbitrage fondamental",
    pDuration: "Dans l'épargne de long terme, la durée a généralement plus d'impact que le taux. Un investisseur qui place 200 € par mois à 5 % pendant 30 ans accumule environ 166 000 €. S'il attend 10 ans pour commencer (20 ans seulement), il n'atteindra que 82 000 €. La régularité des versements et la durée d'investissement sont les deux leviers les plus accessibles pour construire un patrimoine significatif.",
    faqTitle: "Questions fréquentes",
    embedLabel: "ce simulateur d'épargne",
    reportTitle: "Simulateur Épargne — Intérêts composés",
    reportHighlight: "Capital final estimé",
    reportCapital: "Capital initial",
    reportVersement: "Versement mensuel",
    reportTaux: "Taux de rendement annuel",
    reportDuree: "Durée de l'épargne",
    reportAns: (n) => `${n} ans`,
    reportCapitalFinal: "Capital final",
    reportTotalVerse: "Total versé",
    reportInterets: "Intérêts générés",
    reportMulti: "Multiplicateur",
    reportGain: "Gain",
    reportNote: "Taux de rendement constant supposé. Résultats avant fiscalité et inflation.",
    chartAria: "Courbe de croissance du capital sur la durée d'épargne",
    chartYears: (n) => `${n} an${n > 1 ? "s" : ""}`,
    faq: [
      { q: "Comment fonctionnent les intérêts composés ?", a: "Les intérêts composés signifient que vous gagnez des intérêts sur vos intérêts. Chaque mois, le taux est appliqué à votre capital cumulé (capital initial + versements + intérêts antérieurs). Plus la durée est longue, plus cette composition joue en votre faveur (effet boule de neige)." },
      { q: "Quel taux de rendement supposer ?", a: "Cela dépend de votre placement : comptes épargne (0,5-1,5 %), fonds euros en assurance-vie (2-3 %), obligataires (3-5 %), actions/bourse (5-10 % en moyenne historique). Consultez votre conseiller pour un taux adapté à votre profil." },
      { q: "Quelle est la différence entre capital final et total versé ?", a: "Le total versé est la somme de votre capital initial et de tous vos versements mensuels. Le capital final ajoute les intérêts générés par votre épargne. La différence entre les deux est votre gain en intérêts." },
      { q: "Comment maximiser ses intérêts composés ?", a: "Commencez tôt (plus de temps = plus de composition), versez régulièrement (les versements mensuels bénéficient aussi de la composition), augmentez vos versements progressivement, et choisissez des placements avec un bon rendement adapté à votre risque toléré." },
    ],
  },
  en: {
    docTitle: "Compound Interest Calculator — Savings Growth | Simfinly",
    docDesc: "Project how your savings grow over time with compound interest and regular monthly contributions. See the final balance for any rate, duration and deposit.",
    badge: "Finance · Calculator",
    title: "Compound Interest & Savings",
    desc: "Project how your savings grow over the long term through the power of compound interest and regular contributions.",
    params: "Parameters",
    capitalInitial: "Initial capital",
    capitalHint: "Your current savings",
    capitalHint2: "Starting amount (can be 0)",
    versement: (sym) => `Monthly contribution`,
    versementUnit: (sym) => `${sym}/mo`,
    versementHint: "Regular monthly deposit",
    versementAnnuel: (v, fmt) => `Annualised: ${fmt(v * 12)}/year`,
    taux: "Annual return rate",
    tauxHint: "Constant nominal rate assumed",
    tauxTooltip: "Examples: 1% (savings account), 3% (bond funds), 6% (balanced), 9% (equities avg.)",
    duree: "Savings duration",
    dureeHint: (n) => `${n * 12} months of savings`,
    dureeUnit: " yrs",
    projection: "Your savings projection",
    capitalFinalLabel: "Estimated final balance",
    after: (n) => `after ${n} ${n > 1 ? "years" : "year"}`,
    at: (t) => `at ${t}% per year`,
    totalVerse: "Total invested",
    interets: "Interest earned",
    multiplicateur: "Multiplier",
    gain: "Gain %",
    compo: "Breakdown: contributions + interest",
    disclaimer: "⚠️ Indicative simulation. Past performance is not indicative of future results. Constant return rate assumed. Results before tax and inflation.",
    compareBtn: "⚖️ Compare a 2nd scenario",
    compareTitle: "Scenario comparison",
    scenarioA: "Scenario A (current)",
    scenarioB: "Scenario B",
    capitalInitialLabel: "Initial capital",
    versementMensuel: "Monthly contribution",
    tauxLabel: "Annual rate",
    dureeLabel: "Duration",
    capitalFinalResult: "Final balance",
    ecart: "Difference B − A",
    noResult: "Enter your initial capital and/or monthly contributions to see your projection.",
    yearlyTable: "Annual breakdown",
    yearlySubtitle: (n) => `Year by year over ${n} years`,
    colYear: "Year",
    colCapital: "Balance",
    colVersements: "Contributions",
    colInterets: "Interest",
    rowYear: (n) => `Year ${n}`,
    aboutTitle: "About this calculator",
    h3Magic: "The magic of compound interest",
    pMagic: "Long-term savings draw their power from compound interest: interest earned each year is added to the capital and itself earns interest the following year. This creates exponential growth. For example, €10,000 invested at 5% per year is worth €16,289 after 10 years, €26,533 after 20 years and €43,219 after 30 years — the capital more than quadrupled without any additional contributions.",
    h3Rule72: "The rule of 72",
    pRule72: "The rule of 72 is a mental shortcut to estimate how long it takes for a capital to double: divide 72 by the annual interest rate. At 4%, capital doubles in about 18 years. At 6%, in 12 years. At 9%, in 8 years. This rule gives an immediate intuition of the impact of the chosen rate on savings growth.",
    h3Duration: "Duration vs rate: the fundamental trade-off",
    pDuration: "In long-term savings, duration generally has more impact than the rate. An investor putting in 200/month at 5% for 30 years accumulates around 166,000. If they wait 10 years to start (only 20 years), they will reach only 82,000. The regularity of contributions and the investment duration are the two most accessible levers for building significant wealth.",
    faqTitle: "Frequently asked questions",
    embedLabel: "this savings calculator",
    reportTitle: "Compound Interest Calculator",
    reportHighlight: "Estimated final balance",
    reportCapital: "Initial capital",
    reportVersement: "Monthly contribution",
    reportTaux: "Annual return rate",
    reportDuree: "Savings duration",
    reportAns: (n) => `${n} years`,
    reportCapitalFinal: "Final balance",
    reportTotalVerse: "Total invested",
    reportInterets: "Interest earned",
    reportMulti: "Multiplier",
    reportGain: "Gain",
    reportNote: "Constant return rate assumed. Results before tax and inflation.",
    chartAria: "Savings growth curve over the investment period",
    chartYears: (n) => `${n} yr${n !== 1 ? "s" : ""}`,
    faq: [
      { q: "How does compound interest work?", a: "Compound interest means you earn interest on your interest. Each month, the rate is applied to your accumulated capital (initial capital + contributions + previous interest). The longer the duration, the more this compounding works in your favour (snowball effect)." },
      { q: "What return rate should I use?", a: "It depends on your investment: savings accounts (0.5–1.5%), bond funds in life insurance (2–3%), bond portfolios (3–5%), equities/stock market (5–10% historical average). Consult your financial advisor for a rate suited to your risk profile." },
      { q: "What is the difference between final balance and total invested?", a: "Total invested is the sum of your initial capital and all your monthly contributions. The final balance adds the interest generated by your savings. The difference between the two is your interest gain." },
      { q: "How can I maximise compound interest?", a: "Start early (more time = more compounding), contribute regularly, increase your contributions progressively, and choose investments with a good return suited to your risk tolerance." },
    ],
  },
};

// ─── Logique de calcul intérêts composés ──────────────────────────────────────
function calcEpargne({ capitalInitial, versement, tauxAnnuel, duree }) {
  if (!duree || duree <= 0 || (capitalInitial === null && versement === null)) {
    return { capitalFinal: 0, totalVerse: 0, totalInterets: 0, multiplicateur: 0, yearlyData: [] };
  }
  const cap = capitalInitial ?? 0;
  const vers = versement ?? 0;
  const r = tauxAnnuel / 100 / 12;
  const n = duree * 12;
  let capitalFinal;
  if (Math.abs(r) < 1e-10) {
    capitalFinal = cap + vers * n;
  } else {
    const factor = Math.pow(1 + r, n);
    capitalFinal = cap * factor + vers * ((factor - 1) / r);
  }
  const totalVerse = cap + vers * n;
  const totalInterets = Math.max(0, capitalFinal - totalVerse);
  const multiplicateur = totalVerse > 0 ? capitalFinal / totalVerse : 1;
  const yearlyData = [];
  for (let year = 1; year <= duree; year++) {
    const monthsElapsed = year * 12;
    let yearCap;
    if (Math.abs(r) < 1e-10) {
      yearCap = cap + vers * monthsElapsed;
    } else {
      const f = Math.pow(1 + r, monthsElapsed);
      yearCap = cap * f + vers * ((f - 1) / r);
    }
    const versementsCum = cap + vers * monthsElapsed;
    const interstsCum = Math.max(0, yearCap - versementsCum);
    yearlyData.push({ annee: year, capital: yearCap, versementsCum, interstsCum });
  }
  return { capitalFinal, totalVerse, totalInterets, multiplicateur, yearlyData };
}

export default function Epargne() {
  const [theme, setTheme] = useTheme();
  const money = useMoney();
  const { locale } = useTranslation();
  const txt = TXT[locale] ?? TXT.fr;

  const [capitalInitial, setCapitalInitial]   = useState(null);
  const [versement, setVersement]             = useState(null);
  const [tauxAnnuel, setTauxAnnuel]           = useState(5);
  const [duree, setDuree]                     = useState(20);
  const [compareOn, setCompareOn]   = useState(false);
  const [bCapital, setBCapital]     = useState(null);
  const [bVersement, setBVersement] = useState(null);
  const [bTaux, setBTaux]           = useState(5);
  const [bDuree, setBDuree]         = useState(20);

  const resultsRef = useRef(null);
  const chartRef = useRef(null);

  usePageMeta(txt.docTitle, txt.docDesc);

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'epargne' });
    if (!sessionStorage.getItem('tracked_epargne')) {
      sessionStorage.setItem('tracked_epargne', '1');
      fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: 'epargne' }) }).catch(() => {});
    }
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.capitalInitial !== undefined) setCapitalInitial(shared.capitalInitial);
      if (shared.versement !== undefined) setVersement(shared.versement);
      if (shared.tauxAnnuel !== undefined) setTauxAnnuel(shared.tauxAnnuel);
      if (shared.duree !== undefined) setDuree(shared.duree);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ capitalInitial, versement, tauxAnnuel, duree }));
  }, [capitalInitial, versement, tauxAnnuel, duree]);

  const res = calcEpargne({ capitalInitial, versement, tauxAnnuel, duree });
  const capitalFinalAnim = useAnimatedNumber(res.capitalFinal);
  const hasResult = duree > 0 && ((capitalInitial ?? 0) > 0 || (versement ?? 0) > 0);

  const resB = calcEpargne({ capitalInitial: bCapital, versement: bVersement, tauxAnnuel: bTaux, duree: bDuree });
  const hasB = bDuree > 0 && ((bCapital ?? 0) > 0 || (bVersement ?? 0) > 0);
  const deltaFinal = resB.capitalFinal - res.capitalFinal;

  function startCompare() {
    setBCapital(capitalInitial); setBVersement(versement); setBTaux(tauxAnnuel); setBDuree(duree);
    setCompareOn(true);
    track('compare_open', { name: 'epargne' });
  }

  const epargneChartData = useMemo(() => {
    if (!hasResult) return [];
    const cap = capitalInitial ?? 0;
    const vers = versement ?? 0;
    const r = tauxAnnuel / 100 / 12;
    const pts = [];
    for (let m = 0; m <= duree * 12; m++) {
      let val;
      if (Math.abs(r) < 1e-10) { val = cap + vers * m; }
      else { const f = Math.pow(1 + r, m); val = cap * f + vers * ((f - 1) / r); }
      pts.push({ t: m / 12, value: val });
    }
    return pts;
  }, [capitalInitial, versement, tauxAnnuel, duree, hasResult]);

  const report = {
    title: txt.reportTitle,
    highlight: { label: txt.reportHighlight, value: hasResult ? money.fmt(Math.round(res.capitalFinal)) : "—" },
    params: [
      { label: txt.reportCapital, value: money.fmt(capitalInitial ?? 0) },
      { label: txt.reportVersement, value: versement ? money.fmt(versement) : "—" },
      { label: txt.reportTaux, value: `${tauxAnnuel} %` },
      { label: txt.reportDuree, value: txt.reportAns(duree) },
    ],
    results: hasResult ? [
      { label: txt.reportCapitalFinal, value: money.fmt(Math.round(res.capitalFinal)), strong: true },
      { label: txt.reportTotalVerse, value: money.fmt(Math.round(res.totalVerse)) },
      { label: txt.reportInterets, value: money.fmt(Math.round(res.totalInterets)) },
      { label: txt.reportMulti, value: `×${res.multiplicateur.toFixed(2)}` },
      { label: txt.reportGain, value: `+${((res.multiplicateur - 1) * 100).toFixed(1)} %` },
    ] : [],
    notes: hasResult ? [txt.reportNote] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": locale === 'en' ? "Compound Interest & Savings Calculator" : "Simulateur Épargne & intérêts composés",
        "url": `https://www.simfinly.com${window.location.pathname}`,
        "description": txt.docDesc,
        "applicationCategory": "FinanceApplication", "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": locale === 'en' ? "en-US" : "fr-FR",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": txt.faq.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
      }} />
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 16px 60px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/epargne" size={34} />}
          badge={txt.badge}
          title={txt.title}
          desc={txt.desc}
        />

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 20, boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>{txt.params}</h2>

          <NumInput id="capital-initial" label={txt.capitalInitial} value={capitalInitial} onChange={setCapitalInitial} unit={money.symbol} min={0} max={1000000}
            hint={capitalInitial ? txt.capitalHint2 : txt.capitalHint}
          />
          <NumInput id="versement" label={txt.versement(money.symbol)} value={versement} onChange={setVersement} unit={txt.versementUnit(money.symbol)} min={0} max={100000}
            hint={versement ? txt.versementAnnuel(versement, money.fmt) : txt.versementHint}
          />
          <StepperInput label={txt.taux} value={tauxAnnuel} onChange={setTauxAnnuel} min={0} max={20} step={0.1} unit="%" hint={txt.tauxHint} tooltip={txt.tauxTooltip} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -10, marginBottom: 16 }}>
            <HistoricalReturnPicker duration={duree} onSelect={setTauxAnnuel} />
          </div>
          <StepperInput label={txt.duree} value={duree} onChange={setDuree} min={1} max={40} step={1} unit={txt.dureeUnit} hint={txt.dureeHint(duree)} />
        </div>

        {hasResult && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 20, boxShadow: "var(--card-shadow)" }} ref={resultsRef}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>{txt.projection}</h2>

            <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'Hanken Grotesk', sans-serif", marginBottom: 6 }}>{txt.capitalFinalLabel}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 42, color: "var(--primary)", lineHeight: 1 }}>
                {money.fmt(Math.round(capitalFinalAnim))}
              </div>
              <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                {txt.after(duree)} {txt.at(tauxAnnuel)}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
              <Chip label={txt.totalVerse} value={money.fmt(res.totalVerse)} />
              <Chip label={txt.interets} value={money.fmt(Math.round(res.totalInterets * 100) / 100)} accent />
              <Chip label={txt.multiplicateur} value={`×${res.multiplicateur.toFixed(2)}`} small />
              <Chip label={txt.gain} value={`+${((res.multiplicateur - 1) * 100).toFixed(1)} %`} accent small />
            </div>

            {epargneChartData.length > 1 && (
              <ZoomableChart innerRef={chartRef} caption={txt.chartAria}>
                <LineAreaChart
                  series={[{
                    id: "capital",
                    label: txt.capitalFinalLabel,
                    points: epargneChartData.map(p => ({ x: p.t, y: p.value })),
                    color: "var(--gold)",
                    fillColor: "rgba(43,92,230,0.12)",
                  }]}
                  xFmt={(v) => txt.chartYears(Math.round(v))}
                  yFmt={(v) => {
                    const sym = money.symbol;
                    return v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M${sym}` : `${Math.round(v / 1000)}k${sym}`;
                  }}
                  aria={txt.chartAria}
                />
              </ZoomableChart>
            )}

            <div role="note" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16 }}>
              {txt.disclaimer}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <ShareBar params={{ capitalInitial, versement, tauxAnnuel, duree }} resultsRef={resultsRef} chartRef={chartRef} report={report} name="epargne" />
            </div>
          </div>
        )}

        {hasResult && !compareOn && (
          <button onClick={startCompare} style={{ width: "100%", marginBottom: 20, padding: "14px 20px", borderRadius: 14, cursor: "pointer", background: "var(--card-bg)", border: "1px dashed var(--border-gold)", color: "var(--gold)", fontSize: 14, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}>
            {txt.compareBtn}
          </button>
        )}

        {hasResult && compareOn && (
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "24px", marginBottom: 20, boxShadow: "var(--card-shadow)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "var(--text)" }}>{txt.compareTitle}</h2>
              <button onClick={() => setCompareOn(false)} aria-label="Fermer la comparaison" style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
            <div className="cmp-grid">
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 12 }}>{txt.scenarioA}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.9 }}>
                  <li>{txt.capitalInitialLabel} : <strong style={{ color: "var(--text)" }}>{money.fmt(capitalInitial ?? 0)}</strong></li>
                  <li>{txt.versementMensuel} : <strong style={{ color: "var(--text)" }}>{versement ? money.fmt(versement) + (locale === 'en' ? '/mo' : '/mois') : "—"}</strong></li>
                  <li>{txt.tauxLabel} : <strong style={{ color: "var(--text)" }}>{tauxAnnuel} %</strong></li>
                  <li>{txt.dureeLabel} : <strong style={{ color: "var(--text)" }}>{txt.reportAns(duree)}</strong></li>
                </ul>
                <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{txt.capitalFinalResult}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: "var(--text)" }}>{money.fmt(Math.round(res.capitalFinal))}</div>
              </div>
              <div className="cmp-colB" style={{ borderLeft: "1px solid var(--border)", paddingLeft: 18 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 12 }}>{txt.scenarioB}</div>
                <NumInput id="b-capital" label={txt.capitalInitialLabel} value={bCapital} onChange={setBCapital} unit={money.symbol} min={0} max={1000000} />
                <NumInput id="b-versement" label={txt.versementMensuel} value={bVersement} onChange={setBVersement} unit={`${money.symbol}/mo`} min={0} max={100000} />
                <StepperInput label={txt.tauxLabel} value={bTaux} onChange={setBTaux} min={0} max={20} step={0.1} unit="%" />
                <StepperInput label={txt.dureeLabel} value={bDuree} onChange={setBDuree} min={1} max={40} step={1} unit={txt.dureeUnit} />
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>{txt.capitalFinalResult}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: "var(--gold)" }}>{hasB ? money.fmt(Math.round(resB.capitalFinal)) : "—"}</div>
              </div>
            </div>
            {hasB && (
              <div style={{ marginTop: 18, padding: "14px 18px", borderRadius: 12, textAlign: "center", background: deltaFinal >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${deltaFinal >= 0 ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}` }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{txt.ecart} : </span>
                <strong style={{ fontSize: 18, color: deltaFinal >= 0 ? "#22c55e" : "#ef4444" }}>
                  {deltaFinal >= 0 ? "+" : "−"}{money.fmt(Math.abs(Math.round(deltaFinal)))}
                </strong>
              </div>
            )}
          </div>
        )}

        {!hasResult && (
          <div style={{ textAlign: "center", padding: "40px 28px", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, color: "var(--text-secondary)" }}>
            {txt.noResult}
          </div>
        )}

        {hasResult && res.yearlyData.length > 0 && (
          <AccordionSection title={txt.yearlyTable} subtitle={txt.yearlySubtitle(duree)}>
            <div style={{ overflowX: "auto", marginBottom: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, color: "var(--text)" }}>
                <thead>
                  <tr style={{ background: "var(--input-bg)", borderBottom: "2px solid var(--border)" }}>
                    <th style={{ padding: "10px 8px", textAlign: "left", color: "var(--text-secondary)", fontWeight: 600, fontSize: 11 }}>{txt.colYear}</th>
                    <th style={{ padding: "10px 8px", textAlign: "right", color: "var(--text-secondary)", fontWeight: 600, fontSize: 11 }}>{txt.colCapital}</th>
                    <th style={{ padding: "10px 8px", textAlign: "right", color: "var(--text-secondary)", fontWeight: 600, fontSize: 11 }}>{txt.colVersements}</th>
                    <th style={{ padding: "10px 8px", textAlign: "right", color: "var(--text-secondary)", fontWeight: 600, fontSize: 11 }}>{txt.colInterets}</th>
                  </tr>
                </thead>
                <tbody>
                  {res.yearlyData.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid var(--border)", background: row.annee % 2 === 0 ? "var(--input-bg)" : "transparent" }}>
                      <td style={{ padding: "10px 8px", textAlign: "left" }}>{txt.rowYear(row.annee)}</td>
                      <td style={{ padding: "10px 8px", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "var(--gold)" }}>{money.fmt(row.capital)}</td>
                      <td style={{ padding: "10px 8px", textAlign: "right", color: "var(--text-secondary)" }}>{money.fmt(row.versementsCum)}</td>
                      <td style={{ padding: "10px 8px", textAlign: "right", color: "var(--gold-mid)", fontWeight: 500 }}>{money.fmt(row.interstsCum)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionSection>
        )}

        {hasResult && <AffiliateCTA type="epargne" />}

        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>

        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>{txt.aboutTitle}</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>{txt.h3Magic}</h3>
            <p style={{ marginBottom: 16 }}>{txt.pMagic}</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.h3Rule72}</h3>
            <p style={{ marginBottom: 16 }}>{txt.pRule72}</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.h3Duration}</h3>
            <p>{txt.pDuration}</p>
          </div>
        </div>

        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>{txt.faqTitle}</h2>
          {txt.faq.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
        </div>

        <EmbedSnippet path="/embed/epargne" height={520} label={txt.embedLabel} />

        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>
      </div>
      <Footer />
    </div>
  );
}

