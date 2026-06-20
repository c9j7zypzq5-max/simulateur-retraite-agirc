import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import ShareBar from "../../components/ShareBar.jsx";
import AffiliateCTA from "../../components/AffiliateCTA.jsx";
import ZoomableChart from "../../components/ZoomableChart.jsx";
import HistoricalReturnPicker from "../../components/HistoricalReturnPicker.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { useTheme } from "../../hooks/useTheme.js";
import { useProfile } from "../../hooks/useProfile.js";
import { useSimHistory } from "../../hooks/useSimHistory.js";
import { downloadCSV } from "../../utils/export.js";
import JsonLd from "../../components/JsonLd.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, Toggle, AccordionSection,
  Chip, useAnimatedNumber,
  SimulateurHeader,
} from "../../components/ui.jsx";
import { useMoney } from "../../i18n/CurrencyContext.jsx";
import { fmtCur, activeSymbol } from "../../i18n/currency.js";
import { useTranslation } from "../../i18n/index.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

// ─── Translations ──────────────────────────────────────────────────────────────
const TXT = {
  fr: {
    docTitle: "Simulateur Patrimoine Global 2026 — simfinly.com",
    metaDesc: "Projetez votre patrimoine global à l'âge cible : capital financier, immobilier et retraite réunis dans un seul simulateur. Gratuit, sans inscription.",
    badge: "Finances · Simulation 2026",
    pageTitle: "Patrimoine global",
    pageDesc: "Projetez votre fortune nette à l'âge cible : portefeuille financier, immobilier et retraite réunis dans une vision consolidée.",
    featureCapFinancier: "✓ Capital financier (PEA, AV, ETF…)",
    featureImmo: "✓ Immobilier locatif",
    featureRetraite: "✓ Retraite légale",
    featureLocal: "✓ 100 % local",
    sectionHorizon: "Horizon de projection",
    labelAgeActuel: "Âge actuel",
    labelAgeCible: "Âge cible",
    hintAgeCible: "Âge auquel projeter votre patrimoine",
    hintAgeCibleProjection: (n) => `Projection sur ${n} ans`,
    sectionEpargne: "Épargne & investissements",
    labelCapFinancier: "Capital financier actuel",
    hintCapFinancier: "PEA, assurance-vie, livrets, ETF… (hors résidence principale)",
    labelVersement: "Versement mensuel",
    hintVersementDefault: "Montant régulièrement investi chaque mois",
    hintVersementValue: (v) => `soit ${v} / an`,
    labelRendement: "Rendement annuel espéré",
    hintRendement: "Rendement réel après inflation (portefeuille actions diversifié ~5 %)",
    sectionImmo: "Immobilier locatif",
    optionnel: "(optionnel)",
    toggleImmo: "Inclure un bien immobilier locatif",
    labelValeurImmo: "Valeur actuelle du bien",
    labelLoyerNet: "Loyer net mensuel",
    hintLoyerNet: "Loyer après charges, taxe foncière, assurances",
    labelAppreciation: "Appréciation annuelle",
    hintAppreciation: "2 % en France en tendance longue (réel après inflation)",
    sectionRetraite: "Retraite légale",
    toggleRetraite: "Inclure une retraite légale estimée",
    labelPension: "Pension mensuelle estimée",
    hintPension: "Retraite brute mensuelle estimée (CNAV + complémentaire)",
    labelAgeRetraite: "Âge de départ en retraite",
    resultsTitle: (age) => `Votre patrimoine à ${age} ans`,
    resultsEmpty: "Renseignez votre capital ou votre versement mensuel pour démarrer.",
    heroLabel: "Patrimoine total projeté",
    heroSub: (v) => `dont ${v} / mois de revenus passifs`,
    chipCapFinancier: "Capital financier",
    chipValImmo: "Valeur immobilier",
    chipRevFinancier: "Revenu financier/mois",
    chipLoyer: "Loyer net/mois",
    chipRetraite: "Retraite/mois",
    chipRevTotal: "Revenu total/mois",
    compositionTitle: "Composition du patrimoine",
    financier: "Financier",
    immobilier: "Immobilier",
    projectionTitle: "Projection annuelle",
    disclaimer: "⚠️ <strong>Simulation indicative.</strong> Les rendements passés ne garantissent pas les rendements futurs. Calculs en euros constants (rendement réel après inflation).",
    btnSave: "Sauvegarder",
    btnSaved: "Sauvegardée",
    accordionTitle: "Détail année par année",
    accordionSubtitle: "Évolution de chaque composante du patrimoine",
    tableAge: "Âge",
    tableCapFinancier: "Capital financier",
    tableImmo: "Immobilier",
    tableTotal: "Total",
    ageSuffix: "ans",
    csvAge: "Âge",
    csvCapFinancier: "Capital financier (€)",
    csvImmo: "Immobilier (€)",
    csvTotal: "Patrimoine total (€)",
    aboutTitle: "À propos de ce simulateur",
    aboutP1: "Ce simulateur calcule la valeur projetée de votre patrimoine global à un âge cible en combinant trois sources de richesse : votre épargne financière (PEA, assurance-vie, ETF…), votre patrimoine immobilier locatif, et votre future pension de retraite.",
    aboutP2Fr: "Le",
    aboutP2CapFinancier: "capital financier",
    aboutP2Mid: "est projeté via les intérêts composés mensuels. La",
    aboutP2ValImmo: "valeur immobilière",
    aboutP2Mid2: "est projetée en appliquant un taux d'appréciation annuel à la valeur actuelle du bien. La",
    aboutP2Retraite: "retraite légale",
    aboutP2End: "s'ajoute comme revenu mensuel à partir de l'âge de départ renseigné.",
    aboutP3Pre: "Le revenu passif financier est estimé à",
    aboutP3Rule: "4 % du capital financier final par an",
    aboutP3Post: "(règle des 4 %, étude Trinity). Les loyers sont ceux actuels, non projetés à l'inflation. Tous les calculs sont en euros constants (rendement réel).",
    reportTitle: "Simulateur Patrimoine — Projection",
    reportHighlightLabel: "Patrimoine total projeté",
    reportParamAge: "Âge actuel",
    reportParamAgeCible: "Âge cible",
    reportParamCap: "Capital financier actuel",
    reportParamVers: "Versement mensuel",
    reportParamRend: "Rendement du portefeuille",
    reportPatTotal: "Patrimoine total projeté",
    reportCapFin: "Capital financier final",
    reportImmoFin: "Valeur immobilier final",
    reportRevTotal: "Revenu passif mensuel total",
    reportRevFin: "Revenu financier mensuel",
    reportNotes: "Calculs en euros constants (rendement réel après inflation).",
    historyLabel: (v, age) => `Patrimoine ${v} à ${age} ans`,
    chartAria: "Projection du patrimoine global",
    jsonLdName: "Simulateur de patrimoine global",
    jsonLdDesc: "Projetez votre patrimoine global : capital financier, immobilier et retraite réunis. Gratuit.",
  },
  en: {
    docTitle: "Net Worth Calculator — Track Your Wealth | Simfinly",
    metaDesc: "Consolidate your financial, real-estate and retirement assets to see your net worth and how it breaks down by asset class.",
    badge: "Finance · 2026 Simulation",
    pageTitle: "Net Worth Calculator",
    pageDesc: "Project your net worth at your target age: financial portfolio, real estate and retirement combined in one consolidated view.",
    featureCapFinancier: "✓ Financial capital (stocks, ETFs…)",
    featureImmo: "✓ Rental real estate",
    featureRetraite: "✓ State pension",
    featureLocal: "✓ 100 % local",
    sectionHorizon: "Projection horizon",
    labelAgeActuel: "Current age",
    labelAgeCible: "Target age",
    hintAgeCible: "Age at which to project your net worth",
    hintAgeCibleProjection: (n) => `Projection over ${n} years`,
    sectionEpargne: "Savings & investments",
    labelCapFinancier: "Current financial capital",
    hintCapFinancier: "Stocks, ETFs, savings accounts… (excluding primary residence)",
    labelVersement: "Monthly contribution",
    hintVersementDefault: "Amount regularly invested each month",
    hintVersementValue: (v) => `i.e. ${v} / year`,
    labelRendement: "Expected annual return",
    hintRendement: "Real return after inflation (diversified equity portfolio ~5 %)",
    sectionImmo: "Rental real estate",
    optionnel: "(optional)",
    toggleImmo: "Include a rental property",
    labelValeurImmo: "Current property value",
    labelLoyerNet: "Net monthly rent",
    hintLoyerNet: "Rent after expenses, property tax, insurance",
    labelAppreciation: "Annual appreciation",
    hintAppreciation: "Long-term trend ~2 % (real after inflation)",
    sectionRetraite: "State pension",
    toggleRetraite: "Include an estimated state pension",
    labelPension: "Estimated monthly pension",
    hintPension: "Estimated gross monthly pension (state + supplementary)",
    labelAgeRetraite: "Retirement age",
    resultsTitle: (age) => `Your net worth at age ${age}`,
    resultsEmpty: "Enter your capital or monthly contribution to get started.",
    heroLabel: "Projected total net worth",
    heroSub: (v) => `including ${v} / month in passive income`,
    chipCapFinancier: "Financial capital",
    chipValImmo: "Real estate value",
    chipRevFinancier: "Financial income/month",
    chipLoyer: "Net rent/month",
    chipRetraite: "Pension/month",
    chipRevTotal: "Total income/month",
    compositionTitle: "Net worth breakdown",
    financier: "Financial",
    immobilier: "Real estate",
    projectionTitle: "Annual projection",
    disclaimer: "⚠️ <strong>Indicative simulation.</strong> Past returns do not guarantee future returns. Figures in constant currency (real return after inflation).",
    btnSave: "Save",
    btnSaved: "Saved",
    accordionTitle: "Year-by-year detail",
    accordionSubtitle: "Evolution of each component of your net worth",
    tableAge: "Age",
    tableCapFinancier: "Financial capital",
    tableImmo: "Real estate",
    tableTotal: "Total",
    ageSuffix: "",
    csvAge: "Age",
    csvCapFinancier: "Financial capital (€)",
    csvImmo: "Real estate (€)",
    csvTotal: "Total net worth (€)",
    aboutTitle: "About this calculator",
    aboutP1: "This calculator projects the value of your total net worth at a target age by combining three sources of wealth: your financial savings (stocks, ETFs, savings accounts…), your rental real estate, and your future state pension.",
    aboutP2Fr: "Your",
    aboutP2CapFinancier: "financial capital",
    aboutP2Mid: "is projected using monthly compound interest. The",
    aboutP2ValImmo: "real-estate value",
    aboutP2Mid2: "is projected by applying an annual appreciation rate to the current property value. The",
    aboutP2Retraite: "state pension",
    aboutP2End: "is added as monthly income from the stated retirement age.",
    aboutP3Pre: "Passive financial income is estimated at",
    aboutP3Rule: "4 % of the final financial capital per year",
    aboutP3Post: "(the 4 % rule, Trinity study). Rents are current figures, not projected for inflation. All calculations are in constant currency (real return).",
    reportTitle: "Net Worth Calculator — Projection",
    reportHighlightLabel: "Projected total net worth",
    reportParamAge: "Current age",
    reportParamAgeCible: "Target age",
    reportParamCap: "Current financial capital",
    reportParamVers: "Monthly contribution",
    reportParamRend: "Portfolio return",
    reportPatTotal: "Projected total net worth",
    reportCapFin: "Final financial capital",
    reportImmoFin: "Final real estate value",
    reportRevTotal: "Total monthly passive income",
    reportRevFin: "Monthly financial income",
    reportNotes: "Figures in constant currency (real return after inflation).",
    historyLabel: (v, age) => `Net worth ${v} at age ${age}`,
    chartAria: "Net worth projection",
    jsonLdName: "Net Worth Calculator",
    jsonLdDesc: "Project your total net worth: financial capital, real estate and retirement combined. Free.",
  },
};

// ─── Calcul principal ──────────────────────────────────────────────────────────
function calcPatrimoine({
  ageActuel, ageCible,
  capitalFinancier, versementMensuel, rendementPortefeuille,
  immoActive, valeurImmo, loyerNet, appreciationImmo,
  retraiteActive, retraiteMensuelle, ageRetraite,
}) {
  const empty = {
    annees: 0, capitalFinancierFinal: 0, valeurImmoFinal: 0,
    patrimoineFinal: 0, revenuMensuelFinancier: 0,
    revenuMensuelLocatif: 0, revenuMensuelRetraite: 0,
    revenuMensuelTotal: 0, projectionData: [],
  };

  const age0 = ageActuel || 35;
  const ageTgt = ageCible || 65;
  if (ageTgt <= age0) return empty;

  const annees = ageTgt - age0;
  const cap0 = capitalFinancier || 0;
  const vers = versementMensuel || 0;
  const r = (rendementPortefeuille || 5) / 100 / 12;

  // Capital financier final (intérêts composés mensuels)
  let capFin;
  if (r > 1e-10) {
    const factor = Math.pow(1 + r, annees * 12);
    capFin = cap0 * factor + vers * ((factor - 1) / r);
  } else {
    capFin = cap0 + vers * annees * 12;
  }

  // Immobilier
  const immoFin = immoActive
    ? (valeurImmo || 0) * Math.pow(1 + (appreciationImmo || 2) / 100, annees)
    : 0;
  const loyerMensuel = immoActive ? (loyerNet || 0) : 0;

  // Retraite
  const ageRet = retraiteActive ? (ageRetraite || 64) : 0;
  const retraiteRev = retraiteActive && ageTgt >= ageRet ? (retraiteMensuelle || 0) : 0;

  const patrimoineFinal = capFin + immoFin;
  const revenuMensuelFinancier = capFin * 0.04 / 12;
  const revenuMensuelTotal = revenuMensuelFinancier + loyerMensuel + retraiteRev;

  // Projection annuelle
  const projectionData = [];
  let capCur = cap0;
  for (let a = 0; a <= annees; a++) {
    // capital financier
    let capA;
    if (r > 1e-10) {
      const f = Math.pow(1 + r, a * 12);
      capA = cap0 * f + vers * ((f - 1) / r);
    } else {
      capA = cap0 + vers * a * 12;
    }
    const immoA = immoActive
      ? (valeurImmo || 0) * Math.pow(1 + (appreciationImmo || 2) / 100, a)
      : 0;
    capCur = capA;
    projectionData.push({
      annee: a,
      age: age0 + a,
      capitalFinancier: capA,
      valeurImmo: immoA,
      patrimoine: capA + immoA,
    });
  }

  return {
    annees,
    capitalFinancierFinal: capFin,
    valeurImmoFinal: immoFin,
    patrimoineFinal,
    revenuMensuelFinancier,
    revenuMensuelLocatif: loyerMensuel,
    revenuMensuelRetraite: retraiteRev,
    revenuMensuelTotal,
    projectionData,
  };
}

// ─── Graphique empilé ─────────────────────────────────────────────────────────
function StackedChart({ projectionData, immoActive, txt }) {
  if (!projectionData || projectionData.length < 2) return null;

  const PAD = { top: 24, right: 48, bottom: 36, left: 62 };
  const W = 600, H = 300;
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;

  const maxP = Math.max(...projectionData.map(d => d.patrimoine)) * 1.1 || 1;
  const maxA = projectionData[projectionData.length - 1].annee || 1;

  const x = a => PAD.left + (a / maxA) * iW;
  const y = p => PAD.top + iH - (p / maxP) * iH;

  const fmtK = v => v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(1).replace('.', ',')}M${activeSymbol()}`
    : `${Math.round(v / 1000)}k${activeSymbol()}`;

  const ages = projectionData.filter((_, i) => i % Math.ceil(projectionData.length / 5) === 0 || i === projectionData.length - 1);
  const yTicks = [0.25, 0.5, 0.75, 1].map(f => ({ val: maxP * f, yv: y(maxP * f) }));

  // Area financier (bottom)
  const finPts = projectionData.map(d => `${x(d.annee).toFixed(1)},${y(d.capitalFinancier).toFixed(1)}`).join(' ');
  const finFill = `${x(0).toFixed(1)},${(H - PAD.bottom).toFixed(1)} ${finPts} ${x(maxA).toFixed(1)},${(H - PAD.bottom).toFixed(1)}`;

  // Area immo (stacked on top of fin)
  const immoPts = projectionData.map(d => `${x(d.annee).toFixed(1)},${y(d.capitalFinancier + d.valeurImmo).toFixed(1)}`).join(' ');
  const immoFill = immoActive
    ? `${finPts.split(' ').slice().reverse().join(' ')} ${immoPts}`
    : '';

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'min(280px, 52vw)', display: 'block', overflow: 'visible' }}
      aria-label={txt.chartAria}
    >
      {/* Immo area */}
      {immoActive && (
        <polygon points={immoFill} fill="rgba(168,85,247,0.12)" />
      )}
      {/* Financier area */}
      <polygon points={finFill} fill="rgba(184,147,74,0.15)" />

      {/* Immo line */}
      {immoActive && (
        <polyline
          points={immoPts}
          fill="none"
          stroke="#a855f7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
      )}

      {/* Financier line */}
      <polyline
        points={finPts}
        fill="none"
        stroke="var(--gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Axes */}
      <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="var(--border)" strokeWidth="1" />
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="var(--border)" strokeWidth="1" />

      {/* Labels âge */}
      {ages.map(d => (
        <text key={d.age} x={x(d.annee)} y={H - 6} textAnchor="middle" fontSize="13"
          fill="var(--text-secondary)" fontFamily="Hanken Grotesk, sans-serif">
          {txt.ageSuffix ? `${d.age} ${txt.ageSuffix}` : d.age}
        </text>
      ))}

      {/* Labels Y */}
      {yTicks.map((t, i) => (
        <text key={i} x={PAD.left - 6} y={t.yv + 4} textAnchor="end" fontSize="13"
          fill="var(--text-secondary)" fontFamily="Hanken Grotesk, sans-serif">
          {fmtK(t.val)}
        </text>
      ))}

      {/* Légende */}
      <circle cx={PAD.left + 2} cy={PAD.top - 8} r="4" fill="var(--gold)" />
      <text x={PAD.left + 10} y={PAD.top - 4} fontSize="13" fill="var(--text-secondary)" fontFamily="Hanken Grotesk, sans-serif">{txt.financier}</text>
      {immoActive && (
        <>
          <circle cx={PAD.left + 70} cy={PAD.top - 8} r="4" fill="#a855f7" opacity="0.8" />
          <text x={PAD.left + 78} y={PAD.top - 4} fontSize="13" fill="var(--text-secondary)" fontFamily="Hanken Grotesk, sans-serif">{txt.immobilier}</text>
        </>
      )}
    </svg>
  );
}

// ─── Table annuelle ───────────────────────────────────────────────────────────
function YearTable({ projectionData, immoActive, txt }) {
  if (!projectionData || projectionData.length < 2) return null;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ textAlign: 'left', padding: '9px 0', color: 'var(--text-secondary)', fontWeight: 600 }}>{txt.tableAge}</th>
            <th style={{ textAlign: 'right', padding: '9px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>{txt.tableCapFinancier}</th>
            {immoActive && <th style={{ textAlign: 'right', padding: '9px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>{txt.tableImmo}</th>}
            <th style={{ textAlign: 'right', padding: '9px 0', color: 'var(--text-secondary)', fontWeight: 600 }}>{txt.tableTotal}</th>
          </tr>
        </thead>
        <tbody>
          {projectionData.slice(1).map(d => (
            <tr key={d.annee} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '9px 0', color: 'var(--text)' }}>{txt.ageSuffix ? `${d.age} ${txt.ageSuffix}` : d.age}</td>
              <td style={{ textAlign: 'right', padding: '9px 8px', color: 'var(--gold)', whiteSpace: 'nowrap' }}>{fmtCur(Math.round(d.capitalFinancier))}</td>
              {immoActive && <td style={{ textAlign: 'right', padding: '9px 8px', color: '#a855f7', whiteSpace: 'nowrap' }}>{fmtCur(Math.round(d.valeurImmo))}</td>}
              <td style={{ textAlign: 'right', padding: '9px 0', fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap' }}>{fmtCur(Math.round(d.patrimoine))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function Patrimoine() {
  const [theme, setTheme] = useTheme();
  useMoney(); // abonnement aux changements de devise
  const { locale } = useTranslation();
  const txt = TXT[locale] ?? TXT.fr;

  const [ageActuel, setAge]               = useState(null);
  const [ageCible, setAgeCible]           = useState(65);
  const [capitalFinancier, setCapFin]     = useState(null);
  const [versementMensuel, setVers]       = useState(null);
  const [rendementPortefeuille, setRend]  = useState(5);

  const [immoActive, setImmoActive]       = useState(false);
  const [valeurImmo, setValImmo]          = useState(null);
  const [loyerNet, setLoyer]              = useState(null);
  const [appreciationImmo, setApprecImmo] = useState(2);

  const [retraiteActive, setRetraiteActive]     = useState(false);
  const [retraiteMensuelle, setRetraiteRev]     = useState(null);
  const [ageRetraite, setAgeRetraite]           = useState(64);

  const [historySaved, setHistorySaved] = useState(false);
  const resultsRef = useRef(null);
  const chartRef = useRef(null);
  const { getProfile, updateProfile } = useProfile();
  const { saveEntry } = useSimHistory();

  usePageMeta(txt.docTitle, txt.metaDesc);

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = locale === 'en'
      ? 'https://www.simfinly.com/en/simulateurs/patrimoine'
      : 'https://www.simfinly.com/simulateurs/patrimoine';
    track('simulator_view', { name: 'patrimoine' });
    if (!sessionStorage.getItem('tracked_patrimoine')) {
      sessionStorage.setItem('tracked_patrimoine', '1');
      fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: 'patrimoine' }) }).catch(() => {});
    }
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const shared = readShareParams();
    const profile = getProfile();
    if (shared) {
      if (shared.ageActuel !== undefined) setAge(shared.ageActuel);
      if (shared.ageCible !== undefined) setAgeCible(shared.ageCible);
      if (shared.capitalFinancier !== undefined) setCapFin(shared.capitalFinancier);
      if (shared.versementMensuel !== undefined) setVers(shared.versementMensuel);
      if (shared.rendementPortefeuille !== undefined) setRend(shared.rendementPortefeuille);
    } else {
      if (profile.ageActuel !== undefined) setAge(profile.ageActuel);
      if (profile.capitalActuel !== undefined) setCapFin(profile.capitalActuel);
      if (profile.epargneMensuelle !== undefined) setVers(profile.epargneMensuelle);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    updateProfile({ ageActuel, capitalActuel: capitalFinancier, epargneMensuelle: versementMensuel });
  }, [ageActuel, capitalFinancier, versementMensuel]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ ageActuel, ageCible, capitalFinancier, versementMensuel, rendementPortefeuille }));
  }, [ageActuel, ageCible, capitalFinancier, versementMensuel, rendementPortefeuille]);

  const res = calcPatrimoine({
    ageActuel, ageCible,
    capitalFinancier, versementMensuel, rendementPortefeuille,
    immoActive, valeurImmo, loyerNet, appreciationImmo,
    retraiteActive, retraiteMensuelle, ageRetraite,
  });

  const patrimoineAnim = useAnimatedNumber(res.patrimoineFinal);
  const hasResult = (capitalFinancier || 0) > 0 || (versementMensuel || 0) > 0 || (immoActive && (valeurImmo || 0) > 0);

  const patrimoineChartData = useMemo(() => {
    if (!hasResult || !res.annees) return [];
    const cap0 = capitalFinancier || 0;
    const vers = versementMensuel || 0;
    const r = (rendementPortefeuille || 5) / 100 / 12;
    const pts = [];
    for (let m = 0; m <= res.annees * 12; m++) {
      let val;
      if (r > 1e-10) {
        const f = Math.pow(1 + r, m);
        val = cap0 * f + vers * ((f - 1) / r);
      } else {
        val = cap0 + vers * m;
      }
      pts.push({ t: m / 12, value: val });
    }
    return pts;
  }, [capitalFinancier, versementMensuel, rendementPortefeuille, res.annees, hasResult]);

  const pctFinancier = res.patrimoineFinal > 0 ? (res.capitalFinancierFinal / res.patrimoineFinal) * 100 : 0;
  const pctImmo = res.patrimoineFinal > 0 ? (res.valeurImmoFinal / res.patrimoineFinal) * 100 : 0;

  const report = {
    title: txt.reportTitle,
    highlight: { label: txt.reportHighlightLabel, value: hasResult ? fmtCur(Math.round(res.patrimoineFinal)) : "—" },
    params: [
      { label: txt.reportParamAge, value: ageActuel ? `${ageActuel} ${txt.ageSuffix || 'ans'}` : "—" },
      { label: txt.reportParamAgeCible, value: ageCible ? `${ageCible} ${txt.ageSuffix || 'ans'}` : "—" },
      { label: txt.reportParamCap, value: fmtCur(capitalFinancier ?? 0) },
      { label: txt.reportParamVers, value: versementMensuel ? fmtCur(versementMensuel) : "—" },
      { label: txt.reportParamRend, value: `${rendementPortefeuille} %` },
    ],
    results: hasResult ? [
      { label: txt.reportPatTotal, value: fmtCur(Math.round(res.patrimoineFinal)), strong: true },
      { label: txt.reportCapFin, value: fmtCur(Math.round(res.capitalFinancierFinal)) },
      ...(immoActive ? [{ label: txt.reportImmoFin, value: fmtCur(Math.round(res.valeurImmoFinal)) }] : []),
      { label: txt.reportRevTotal, value: fmtCur(Math.round(res.revenuMensuelTotal)) },
      { label: txt.reportRevFin, value: fmtCur(Math.round(res.revenuMensuelFinancier)) },
    ] : [],
    notes: hasResult ? [txt.reportNotes] : undefined,
  };

  const handleSaveHistory = useCallback(() => {
    const label = txt.historyLabel(fmtCur(Math.round(res.patrimoineFinal)), ageCible || 65);
    saveEntry({ simulator: 'patrimoine', label, shareUrl: window.location.pathname + window.location.search });
    setHistorySaved(true);
    setTimeout(() => setHistorySaved(false), 2500);
  }, [res, ageCible, saveEntry, txt]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Hanken Grotesk', sans-serif", color: 'var(--text)' }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": txt.jsonLdName,
        "url": locale === 'en'
          ? "https://www.simfinly.com/en/simulateurs/patrimoine"
          : "https://www.simfinly.com/simulateurs/patrimoine",
        "description": txt.jsonLdDesc,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": locale === 'en' ? 'en-US' : 'fr-FR',
      }} />

      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 16px 60px' }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/patrimoine" size={34} />}
          badge={txt.badge}
          title={txt.pageTitle}
          desc={txt.pageDesc}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, background: 'rgba(184,147,74,0.07)', border: '1px solid var(--border-gold)', borderRadius: 12, padding: '12px 20px', marginBottom: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
          {[txt.featureCapFinancier, txt.featureImmo, txt.featureRetraite, txt.featureLocal].map((t, i) => (
            <span key={i} style={{ whiteSpace: 'nowrap' }}>{t}</span>
          ))}
        </div>

        {/* Formulaire */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px 28px', boxShadow: 'var(--card-shadow)' }}>

          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: 'var(--text-secondary)', marginBottom: 28, fontWeight: 400 }}>
            {txt.sectionHorizon}
          </h2>
          <NumInput id="age-actuel" label={txt.labelAgeActuel} value={ageActuel} onChange={setAge} unit={txt.ageSuffix || "ans"} min={15} max={80} />
          <StepperInput label={txt.labelAgeCible} value={ageCible} onChange={setAgeCible} min={(ageActuel || 35) + 1} max={85} step={1} unit={txt.ageSuffix || "ans"}
            hint={ageActuel ? txt.hintAgeCibleProjection((ageCible || 65) - ageActuel) : txt.hintAgeCible} />

          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: 'var(--text-secondary)', marginBottom: 28, marginTop: 32, fontWeight: 400 }}>
            {txt.sectionEpargne}
          </h2>
          <NumInput id="capital-financier" label={txt.labelCapFinancier} value={capitalFinancier} onChange={setCapFin} unit={activeSymbol()} min={0} max={10000000}
            hint={txt.hintCapFinancier} />
          <NumInput id="versement-mensuel" label={txt.labelVersement} value={versementMensuel} onChange={setVers} unit={`${activeSymbol()}/mois`} min={0} max={50000}
            hint={versementMensuel ? txt.hintVersementValue(fmtCur((versementMensuel || 0) * 12)) : txt.hintVersementDefault} />
          <StepperInput label={txt.labelRendement} value={rendementPortefeuille} onChange={setRend} min={0} max={15} step={0.5} unit="%"
            hint={txt.hintRendement} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -10, marginBottom: 16 }}>
            <HistoricalReturnPicker duration={(ageCible || 65) - (ageActuel || 35)} onSelect={setRend} />
          </div>

          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: 'var(--text-secondary)', marginBottom: 20, marginTop: 32, fontWeight: 400 }}>
            {txt.sectionImmo} <span style={{ fontSize: 12, fontFamily: "'Hanken Grotesk', sans-serif", opacity: 0.6 }}>{txt.optionnel}</span>
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: immoActive ? 20 : 0 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{txt.toggleImmo}</span>
            <Toggle checked={immoActive} onChange={setImmoActive} />
          </div>
          {immoActive && (
            <>
              <NumInput id="valeur-immo" label={txt.labelValeurImmo} value={valeurImmo} onChange={setValImmo} unit={activeSymbol()} min={0} max={5000000} />
              <NumInput id="loyer-net" label={txt.labelLoyerNet} value={loyerNet} onChange={setLoyer} unit={`${activeSymbol()}/mois`} min={0} max={20000}
                hint={txt.hintLoyerNet} />
              <StepperInput label={txt.labelAppreciation} value={appreciationImmo} onChange={setApprecImmo} min={0} max={10} step={0.5} unit="%"
                hint={txt.hintAppreciation} />
            </>
          )}

          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: 'var(--text-secondary)', marginBottom: 20, marginTop: 32, fontWeight: 400 }}>
            {txt.sectionRetraite} <span style={{ fontSize: 12, fontFamily: "'Hanken Grotesk', sans-serif", opacity: 0.6 }}>{txt.optionnel}</span>
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: retraiteActive ? 20 : 0 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{txt.toggleRetraite}</span>
            <Toggle checked={retraiteActive} onChange={setRetraiteActive} />
          </div>
          {retraiteActive && (
            <>
              <NumInput id="retraite-mensuelle" label={txt.labelPension} value={retraiteMensuelle} onChange={setRetraiteRev} unit={`${activeSymbol()}/mois`} min={0} max={20000}
                hint={txt.hintPension} />
              <StepperInput label={txt.labelAgeRetraite} value={ageRetraite} onChange={setAgeRetraite} min={60} max={70} step={1} unit={txt.ageSuffix || "ans"} />
            </>
          )}
        </div>

        {/* Résultats */}
        <div style={{ background: 'linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))', border: '1px solid var(--border-gold)', borderRadius: 20, padding: '32px 28px', marginTop: 20, boxShadow: 'var(--card-shadow)' }} ref={resultsRef}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: 'var(--text-secondary)', marginBottom: 24, fontWeight: 400 }}>
            {txt.resultsTitle(ageCible || 65)}
          </h2>

          {!hasResult ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, padding: '16px 0' }}>
              {txt.resultsEmpty}
            </p>
          ) : (
            <>
              {/* Héro */}
              <div style={{ textAlign: 'center', padding: '16px 0 24px', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 10 }}>
                  {txt.heroLabel}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(44px,9vw,80px)', fontWeight: 700, lineHeight: 1, background: 'linear-gradient(135deg,var(--gold),var(--gold-mid))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {fmtCur(Math.round(patrimoineAnim))}
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                  {txt.heroSub(fmtCur(Math.round(res.revenuMensuelTotal)))}
                </div>
              </div>

              {/* Chips */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 20 }}>
                <Chip label={txt.chipCapFinancier} value={fmtCur(Math.round(res.capitalFinancierFinal))} accent />
                {immoActive && <Chip label={txt.chipValImmo} value={fmtCur(Math.round(res.valeurImmoFinal))} />}
                <Chip label={txt.chipRevFinancier} value={fmtCur(Math.round(res.revenuMensuelFinancier))} accent />
                {immoActive && res.revenuMensuelLocatif > 0 && <Chip label={txt.chipLoyer} value={fmtCur(Math.round(res.revenuMensuelLocatif))} />}
                {retraiteActive && res.revenuMensuelRetraite > 0 && <Chip label={txt.chipRetraite} value={fmtCur(Math.round(res.revenuMensuelRetraite))} />}
                <Chip label={txt.chipRevTotal} value={fmtCur(Math.round(res.revenuMensuelTotal))} accent />
              </div>

              {/* Composition */}
              {res.patrimoineFinal > 0 && (
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
                  <div style={{ fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 14 }}>
                    {txt.compositionTitle}
                  </div>
                  <div style={{ display: 'flex', gap: 4, height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 12 }}>
                    <div style={{ width: `${pctFinancier}%`, background: 'var(--gold)', borderRadius: '5px 0 0 5px', transition: 'width 0.6s' }} />
                    {immoActive && <div style={{ width: `${pctImmo}%`, background: '#a855f7', transition: 'width 0.6s' }} />}
                  </div>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--text-secondary)' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
                      {txt.financier} — {Math.round(pctFinancier)} %
                    </div>
                    {immoActive && res.valeurImmoFinal > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--text-secondary)' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#a855f7', flexShrink: 0 }} />
                        {txt.immobilier} — {Math.round(pctImmo)} %
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Graphique */}
              {res.projectionData.length >= 2 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>
                    {txt.projectionTitle}
                  </div>
                  <ZoomableChart innerRef={chartRef}>
                    <StackedChart projectionData={res.projectionData} immoActive={immoActive} txt={txt} />
                  </ZoomableChart>
                </div>
              )}

              <div role="note" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '13px 16px', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: txt.disclaimer }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '12px 0 4px' }}>
                <button
                  onClick={handleSaveHistory}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 14px', borderRadius: 8,
                    border: `1px solid ${historySaved ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
                    background: historySaved ? 'rgba(34,197,94,0.08)' : 'transparent',
                    color: historySaved ? '#22c55e' : 'var(--text-secondary)',
                    fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  {historySaved ? '✓' : '💾'}<span className="btn-text"> {historySaved ? txt.btnSaved : txt.btnSave}</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
<ShareBar
                  params={{ ageActuel, ageCible, capitalFinancier, versementMensuel, rendementPortefeuille }}
                  resultsRef={resultsRef}
                  chartRef={chartRef}
                  report={report}
                  name="patrimoine"
                />
              </div>
              <AffiliateCTA type="epargne" />
            </>
          )}
        </div>

        <div style={{ margin: '24px 0' }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {hasResult && (
          <AccordionSection title={txt.accordionTitle} subtitle={txt.accordionSubtitle}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button
                onClick={() => downloadCSV(
                  res.projectionData.slice(1).map(d => ({
                    [txt.csvAge]: d.age,
                    [txt.csvCapFinancier]: Math.round(d.capitalFinancier),
                    [txt.csvImmo]: Math.round(d.valeurImmo),
                    [txt.csvTotal]: Math.round(d.patrimoine),
                  })),
                  'patrimoine-global.csv'
                )}
                style={{
                  padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)',
                  background: 'transparent', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer',
                }}
              >
                ↓ CSV
              </button>
            </div>
            <YearTable projectionData={res.projectionData} immoActive={immoActive} txt={txt} />
          </AccordionSection>
        )}

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px 28px', marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(20px,4vw,26px)', fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
            {txt.aboutTitle}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 14 }}>
            {txt.aboutP1}
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 14 }}>
            {txt.aboutP2Fr} <strong>{txt.aboutP2CapFinancier}</strong> {txt.aboutP2Mid} <strong>{txt.aboutP2ValImmo}</strong> {txt.aboutP2Mid2} <strong>{txt.aboutP2Retraite}</strong> {txt.aboutP2End}
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            {txt.aboutP3Pre} <strong>{txt.aboutP3Rule}</strong> {txt.aboutP3Post}
          </p>
        </div>

        <div style={{ margin: '24px 0' }}>
          <AdUnit slot="auto" format="auto" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
