import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import ShareBar from "../../components/ShareBar.jsx";
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
  fmtEur, SimulateurHeader,
} from "../../components/ui.jsx";

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
function StackedChart({ projectionData, immoActive }) {
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
    ? `${(v / 1_000_000).toFixed(1).replace('.', ',')}M€`
    : `${Math.round(v / 1000)}k€`;

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
      aria-label="Projection du patrimoine global"
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
          fill="var(--text-secondary)" fontFamily="DM Sans, sans-serif">
          {d.age} ans
        </text>
      ))}

      {/* Labels Y */}
      {yTicks.map((t, i) => (
        <text key={i} x={PAD.left - 6} y={t.yv + 4} textAnchor="end" fontSize="13"
          fill="var(--text-secondary)" fontFamily="DM Sans, sans-serif">
          {fmtK(t.val)}
        </text>
      ))}

      {/* Légende */}
      <circle cx={PAD.left + 2} cy={PAD.top - 8} r="4" fill="var(--gold)" />
      <text x={PAD.left + 10} y={PAD.top - 4} fontSize="13" fill="var(--text-secondary)" fontFamily="DM Sans, sans-serif">Financier</text>
      {immoActive && (
        <>
          <circle cx={PAD.left + 70} cy={PAD.top - 8} r="4" fill="#a855f7" opacity="0.8" />
          <text x={PAD.left + 78} y={PAD.top - 4} fontSize="13" fill="var(--text-secondary)" fontFamily="DM Sans, sans-serif">Immobilier</text>
        </>
      )}
    </svg>
  );
}

// ─── Table annuelle ───────────────────────────────────────────────────────────
function YearTable({ projectionData, immoActive }) {
  if (!projectionData || projectionData.length < 2) return null;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ textAlign: 'left', padding: '9px 0', color: 'var(--text-secondary)', fontWeight: 600 }}>Âge</th>
            <th style={{ textAlign: 'right', padding: '9px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>Capital financier</th>
            {immoActive && <th style={{ textAlign: 'right', padding: '9px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>Immobilier</th>}
            <th style={{ textAlign: 'right', padding: '9px 0', color: 'var(--text-secondary)', fontWeight: 600 }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {projectionData.slice(1).map(d => (
            <tr key={d.annee} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '9px 0', color: 'var(--text)' }}>{d.age} ans</td>
              <td style={{ textAlign: 'right', padding: '9px 8px', color: 'var(--gold)', whiteSpace: 'nowrap' }}>{fmtEur(Math.round(d.capitalFinancier))}</td>
              {immoActive && <td style={{ textAlign: 'right', padding: '9px 8px', color: '#a855f7', whiteSpace: 'nowrap' }}>{fmtEur(Math.round(d.valeurImmo))}</td>}
              <td style={{ textAlign: 'right', padding: '9px 0', fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap' }}>{fmtEur(Math.round(d.patrimoine))}</td>
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

  useEffect(() => {
    document.title = "Simulateur Patrimoine Global 2026 — simfinly.com";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Projetez votre patrimoine global à l'âge cible : capital financier, immobilier et retraite réunis dans un seul simulateur. Gratuit, sans inscription.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com/simulateurs/patrimoine';
    track('simulator_view', { name: 'patrimoine' });
    if (!sessionStorage.getItem('tracked_patrimoine')) {
      sessionStorage.setItem('tracked_patrimoine', '1');
      fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: 'patrimoine' }) }).catch(() => {});
    }
  }, []);

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
    title: "Simulateur Patrimoine — Projection",
    highlight: { label: "Patrimoine total projeté", value: hasResult ? fmtEur(Math.round(res.patrimoineFinal)) : "—" },
    params: [
      { label: "Âge actuel", value: ageActuel ? `${ageActuel} ans` : "—" },
      { label: "Âge cible", value: ageCible ? `${ageCible} ans` : "—" },
      { label: "Capital financier actuel", value: fmtEur(capitalFinancier ?? 0) },
      { label: "Versement mensuel", value: versementMensuel ? fmtEur(versementMensuel) : "—" },
      { label: "Rendement du portefeuille", value: `${rendementPortefeuille} %` },
    ],
    results: hasResult ? [
      { label: "Patrimoine total projeté", value: fmtEur(Math.round(res.patrimoineFinal)), strong: true },
      { label: "Capital financier final", value: fmtEur(Math.round(res.capitalFinancierFinal)) },
      ...(immoActive ? [{ label: "Valeur immobilier final", value: fmtEur(Math.round(res.valeurImmoFinal)) }] : []),
      { label: "Revenu passif mensuel total", value: fmtEur(Math.round(res.revenuMensuelTotal)) },
      { label: "Revenu financier mensuel", value: fmtEur(Math.round(res.revenuMensuelFinancier)) },
    ] : [],
    notes: hasResult ? [
      "Calculs en euros constants (rendement réel après inflation).",
    ] : undefined,
  };

  const handleSaveHistory = useCallback(() => {
    const label = `Patrimoine ${fmtEur(Math.round(res.patrimoineFinal))} à ${ageCible || 65} ans`;
    saveEntry({ simulator: 'patrimoine', label, shareUrl: window.location.pathname + window.location.search });
    setHistorySaved(true);
    setTimeout(() => setHistorySaved(false), 2500);
  }, [res, ageCible, saveEntry]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif", color: 'var(--text)' }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur de patrimoine global",
        "url": "https://www.simfinly.com/simulateurs/patrimoine",
        "description": "Projetez votre patrimoine global : capital financier, immobilier et retraite réunis. Gratuit.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": "fr-FR",
      }} />

      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 16px 60px' }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/patrimoine" size={34} />}
          badge="Finances · Simulation 2026"
          title="Patrimoine global"
          desc="Projetez votre fortune nette à l'âge cible : portefeuille financier, immobilier et retraite réunis dans une vision consolidée."
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, background: 'rgba(184,147,74,0.07)', border: '1px solid var(--border-gold)', borderRadius: 12, padding: '12px 20px', marginBottom: 20, fontSize: 13, color: 'var(--text-secondary)' }}>
          {['✓ Capital financier (PEA, AV, ETF…)', '✓ Immobilier locatif', '✓ Retraite légale', '✓ 100 % local'].map((t, i) => (
            <span key={i} style={{ whiteSpace: 'nowrap' }}>{t}</span>
          ))}
        </div>

        {/* Formulaire */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px 28px', boxShadow: 'var(--card-shadow)' }}>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: 'var(--text-secondary)', marginBottom: 28, fontWeight: 400 }}>
            Horizon de projection
          </h2>
          <NumInput id="age-actuel" label="Âge actuel" value={ageActuel} onChange={setAge} unit="ans" min={15} max={80} />
          <StepperInput label="Âge cible" value={ageCible} onChange={setAgeCible} min={(ageActuel || 35) + 1} max={85} step={1} unit="ans"
            hint={ageActuel ? `Projection sur ${(ageCible || 65) - ageActuel} ans` : 'Âge auquel projeter votre patrimoine'} />

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: 'var(--text-secondary)', marginBottom: 28, marginTop: 32, fontWeight: 400 }}>
            Épargne & investissements
          </h2>
          <NumInput id="capital-financier" label="Capital financier actuel" value={capitalFinancier} onChange={setCapFin} unit="€" min={0} max={10000000}
            hint="PEA, assurance-vie, livrets, ETF… (hors résidence principale)" />
          <NumInput id="versement-mensuel" label="Versement mensuel" value={versementMensuel} onChange={setVers} unit="€/mois" min={0} max={50000}
            hint={versementMensuel ? `soit ${fmtEur((versementMensuel || 0) * 12)} / an` : 'Montant régulièrement investi chaque mois'} />
          <StepperInput label="Rendement annuel espéré" value={rendementPortefeuille} onChange={setRend} min={0} max={15} step={0.5} unit="%"
            hint="Rendement réel après inflation (portefeuille actions diversifié ~5 %)" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -10, marginBottom: 16 }}>
            <HistoricalReturnPicker duration={(ageCible || 65) - (ageActuel || 35)} onSelect={setRend} />
          </div>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: 'var(--text-secondary)', marginBottom: 20, marginTop: 32, fontWeight: 400 }}>
            Immobilier locatif <span style={{ fontSize: 12, fontFamily: "'DM Sans', sans-serif", opacity: 0.6 }}>(optionnel)</span>
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: immoActive ? 20 : 0 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Inclure un bien immobilier locatif</span>
            <Toggle checked={immoActive} onChange={setImmoActive} />
          </div>
          {immoActive && (
            <>
              <NumInput id="valeur-immo" label="Valeur actuelle du bien" value={valeurImmo} onChange={setValImmo} unit="€" min={0} max={5000000} />
              <NumInput id="loyer-net" label="Loyer net mensuel" value={loyerNet} onChange={setLoyer} unit="€/mois" min={0} max={20000}
                hint="Loyer après charges, taxe foncière, assurances" />
              <StepperInput label="Appréciation annuelle" value={appreciationImmo} onChange={setApprecImmo} min={0} max={10} step={0.5} unit="%"
                hint="2 % en France en tendance longue (réel après inflation)" />
            </>
          )}

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: 'var(--text-secondary)', marginBottom: 20, marginTop: 32, fontWeight: 400 }}>
            Retraite légale <span style={{ fontSize: 12, fontFamily: "'DM Sans', sans-serif", opacity: 0.6 }}>(optionnel)</span>
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: retraiteActive ? 20 : 0 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Inclure une retraite légale estimée</span>
            <Toggle checked={retraiteActive} onChange={setRetraiteActive} />
          </div>
          {retraiteActive && (
            <>
              <NumInput id="retraite-mensuelle" label="Pension mensuelle estimée" value={retraiteMensuelle} onChange={setRetraiteRev} unit="€/mois" min={0} max={20000}
                hint="Retraite brute mensuelle estimée (CNAV + complémentaire)" />
              <StepperInput label="Âge de départ en retraite" value={ageRetraite} onChange={setAgeRetraite} min={60} max={70} step={1} unit="ans" />
            </>
          )}
        </div>

        {/* Résultats */}
        <div style={{ background: 'linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))', border: '1px solid var(--border-gold)', borderRadius: 20, padding: '32px 28px', marginTop: 20, boxShadow: 'var(--card-shadow)' }} ref={resultsRef}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: 'var(--text-secondary)', marginBottom: 24, fontWeight: 400 }}>
            Votre patrimoine à {ageCible || 65} ans
          </h2>

          {!hasResult ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, padding: '16px 0' }}>
              Renseignez votre capital ou votre versement mensuel pour démarrer.
            </p>
          ) : (
            <>
              {/* Héro */}
              <div style={{ textAlign: 'center', padding: '16px 0 24px', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 10 }}>
                  Patrimoine total projeté
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(44px,9vw,80px)', fontWeight: 700, lineHeight: 1, background: 'linear-gradient(135deg,var(--gold),var(--gold-mid))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {fmtEur(Math.round(patrimoineAnim))}
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                  dont {fmtEur(Math.round(res.revenuMensuelTotal))} / mois de revenus passifs
                </div>
              </div>

              {/* Chips */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 20 }}>
                <Chip label="Capital financier" value={fmtEur(Math.round(res.capitalFinancierFinal))} accent />
                {immoActive && <Chip label="Valeur immobilier" value={fmtEur(Math.round(res.valeurImmoFinal))} />}
                <Chip label="Revenu financier/mois" value={fmtEur(Math.round(res.revenuMensuelFinancier))} accent />
                {immoActive && res.revenuMensuelLocatif > 0 && <Chip label="Loyer net/mois" value={fmtEur(Math.round(res.revenuMensuelLocatif))} />}
                {retraiteActive && res.revenuMensuelRetraite > 0 && <Chip label="Retraite/mois" value={fmtEur(Math.round(res.revenuMensuelRetraite))} />}
                <Chip label="Revenu total/mois" value={fmtEur(Math.round(res.revenuMensuelTotal))} accent />
              </div>

              {/* Composition */}
              {res.patrimoineFinal > 0 && (
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
                  <div style={{ fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 14 }}>
                    Composition du patrimoine
                  </div>
                  <div style={{ display: 'flex', gap: 4, height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 12 }}>
                    <div style={{ width: `${pctFinancier}%`, background: 'var(--gold)', borderRadius: '5px 0 0 5px', transition: 'width 0.6s' }} />
                    {immoActive && <div style={{ width: `${pctImmo}%`, background: '#a855f7', transition: 'width 0.6s' }} />}
                  </div>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--text-secondary)' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
                      Financier — {Math.round(pctFinancier)} %
                    </div>
                    {immoActive && res.valeurImmoFinal > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--text-secondary)' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#a855f7', flexShrink: 0 }} />
                        Immobilier — {Math.round(pctImmo)} %
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Graphique */}
              {res.projectionData.length >= 2 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>
                    Projection annuelle
                  </div>
                  <ZoomableChart innerRef={chartRef}>
                    <StackedChart projectionData={res.projectionData} immoActive={immoActive} />
                  </ZoomableChart>
                </div>
              )}

              <div role="note" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '13px 16px', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                ⚠️ <strong>Simulation indicative.</strong> Les rendements passés ne garantissent pas les rendements futurs. Calculs en euros constants (rendement réel après inflation).
              </div>

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
                  {historySaved ? '✓' : '💾'}<span className="btn-text"> {historySaved ? 'Sauvegardée' : 'Sauvegarder'}</span>
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
            </>
          )}
        </div>

        <div style={{ margin: '24px 0' }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {hasResult && (
          <AccordionSection title="Détail année par année" subtitle="Évolution de chaque composante du patrimoine">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button
                onClick={() => downloadCSV(
                  res.projectionData.slice(1).map(d => ({
                    'Âge': d.age,
                    'Capital financier (€)': Math.round(d.capitalFinancier),
                    'Immobilier (€)': Math.round(d.valeurImmo),
                    'Patrimoine total (€)': Math.round(d.patrimoine),
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
            <YearTable projectionData={res.projectionData} immoActive={immoActive} />
          </AccordionSection>
        )}

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px 28px', marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(20px,4vw,26px)', fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
            À propos de ce simulateur
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 14 }}>
            Ce simulateur calcule la valeur projetée de votre patrimoine global à un âge cible en combinant trois
            sources de richesse : votre épargne financière (PEA, assurance-vie, ETF…), votre patrimoine immobilier
            locatif, et votre future pension de retraite.
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 14 }}>
            Le <strong>capital financier</strong> est projeté via les intérêts composés mensuels. La <strong>valeur
            immobilière</strong> est projetée en appliquant un taux d'appréciation annuel à la valeur actuelle du bien.
            La <strong>retraite légale</strong> s'ajoute comme revenu mensuel à partir de l'âge de départ renseigné.
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            Le revenu passif financier est estimé à <strong>4 % du capital financier final par an</strong> (règle des 4 %,
            étude Trinity). Les loyers sont ceux actuels, non projetés à l'inflation. Tous les calculs sont en
            euros constants (rendement réel).
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
