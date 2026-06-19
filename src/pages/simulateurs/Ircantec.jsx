import { useState, useEffect, useRef, useMemo } from "react";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import ZoomableChart from "../../components/ZoomableChart.jsx";
import LineAreaChart from "../../components/charts/LineAreaChart.jsx";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, ProgressBar, useAnimatedNumber,
  fmt, fmtEur, SimulateurHeader, FaqItem,
} from "../../components/ui.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import ScenarioCompare from "../../components/ScenarioCompare.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";

// ─── Paramètres IRCANTEC 2026 ────────────────────────────────────────────────
const PASS = 48_060;

// Tranche A (≤ PASS) : taux global salarié+patronal
const TAUX_TA_SAL = 0.0224;
const TAUX_TA_PAT = 0.0441;
const TAUX_TA     = TAUX_TA_SAL + TAUX_TA_PAT; // 6.65 %

// Tranche B (PASS à 8×PASS) : taux global
const TAUX_TB_SAL = 0.0670;
const TAUX_TB_PAT = 0.1320;
const TAUX_TB     = TAUX_TB_SAL + TAUX_TB_PAT; // 19.90 %

// Valeur du point IRCANTEC 2026
const VALEUR_ACHAT   = 8.06;   // €/point
const VALEUR_SERVICE = 0.54076; // €/point/an

function calcIrcantec({ salaire, anneesFaites, anneesRestantes, ageDépart, tauxReval }) {
  if (!salaire) return {
    pensionBrute: 0, pensionNette: 0, pensionMensuelle: 0,
    pointsTA: 0, pointsTB: 0, totalPoints: 0,
    cotSalTotal: 0, cotPatTotal: 0,
    valServProj: VALEUR_SERVICE,
  };

  const sal = salaire;
  const af  = anneesFaites   ?? 0;
  const ar  = anneesRestantes ?? 0;
  const reval = tauxReval ?? 1;

  const salAnn = sal * 12;
  const ta = Math.min(salAnn, PASS);
  const tb = Math.max(0, Math.min(salAnn, 8 * PASS) - PASS);

  const ptsParAnTA = (ta * TAUX_TA) / VALEUR_ACHAT;
  const ptsParAnTB = (tb * TAUX_TB) / VALEUR_ACHAT;
  const ptsParAn   = ptsParAnTA + ptsParAnTB;

  const annéesTotales = af + ar;
  const pointsTA  = ptsParAnTA * annéesTotales;
  const pointsTB  = ptsParAnTB * annéesTotales;
  const totalPoints = pointsTA + pointsTB;

  // Revalorisation projetée sur les années restantes
  const valServProj = VALEUR_SERVICE * Math.pow(1 + reval / 100, ar);

  const pensionBrute    = totalPoints * valServProj; // annuelle
  const pensionNette    = pensionBrute * 0.93;
  const pensionMensuelle = pensionNette / 12;

  const cotSalTotal = (ta * TAUX_TA_SAL + tb * TAUX_TB_SAL) * annéesTotales;
  const cotPatTotal = (ta * TAUX_TA_PAT + tb * TAUX_TB_PAT) * annéesTotales;

  return {
    pensionBrute, pensionNette, pensionMensuelle,
    pointsTA, pointsTB, totalPoints, ptsParAn,
    cotSalTotal, cotPatTotal,
    valServProj,
  };
}

const FAQ = [
  { q: "Qui est concerné par l'IRCANTEC ?", a: "L'IRCANTEC (Institution de Retraite Complémentaire des Agents Non Titulaires de l'État et des Collectivités) couvre les agents contractuels de la fonction publique (État, collectivités territoriales, hôpitaux) ainsi que les élus locaux. Les fonctionnaires titulaires, eux, ne cotisent pas à l'IRCANTEC mais relèvent des régimes SRE ou CNRACL." },
  { q: "Comment fonctionne le régime par points IRCANTEC ?", a: "Chaque année, vos cotisations (salarié + employeur) sont divisées par la valeur d'achat du point (8,06 € en 2026) pour obtenir un nombre de points. À la retraite, ces points sont multipliés par la valeur de service du point (0,54076 €/point/an en 2026) pour calculer votre pension annuelle complémentaire." },
  { q: "L'IRCANTEC est-il cumulable avec d'autres régimes ?", a: "Oui. L'IRCANTEC est une retraite complémentaire. Les contractuels de l'État perçoivent également une retraite de base CNAV (régime général). Les contractuels territoriaux ou hospitaliers peuvent relever du régime de base de leur collectivité. L'IRCANTEC s'ajoute à ces pensions de base." },
  { q: "Comment est revalorisée la valeur de service du point IRCANTEC ?", a: "La valeur de service est revalorisée annuellement par décret, en général en lien avec l'évolution des prix (inflation). En 2026, elle s'établit à 0,54076 €/point/an. Ce simulateur permet d'appliquer une revalorisation projetée pour estimer l'impact de l'inflation sur votre future pension." },
];

export default function Ircantec() {
  const [theme, setTheme] = useTheme();

  const [salaire, setSalaire]             = useState(null);
  const [anneesFaites, setAnneesFaites]   = useState(null);
  const [anneesRestantes, setAnneesRest]  = useState(null);
  const [ageDépart, setAgeDépart]         = useState(null);
  const [tauxReval, setTauxReval]         = useState(null);

  const resultsRef = useRef(null);


  useEffect(() => {
    document.title = "Simulateur Retraite IRCANTEC 2025 — Contractuels fonction publique";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Calculez votre retraite IRCANTEC : points acquis, valeur du point, pension pour les agents non titulaires de l'État.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'ircantec' });
    if (!sessionStorage.getItem('tracked_ircantec')) {
      sessionStorage.setItem('tracked_ircantec', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'ircantec' })
      }).catch(() => {});
    }
  }, []);
  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.salaire !== undefined) setSalaire(shared.salaire); if (shared.anneesFaites !== undefined) setAnneesFaites(shared.anneesFaites); if (shared.ageDépart !== undefined) setAgeDépart(shared.ageDépart); if (shared.tauxReval !== undefined) setTauxReval(shared.tauxReval)
    }
  }, []);
  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ salaire, anneesFaites, anneesRestantes, ageDépart, tauxReval }));
  }, [salaire, anneesFaites, anneesRestantes, ageDépart, tauxReval]);



  const res = calcIrcantec({ salaire, anneesFaites, anneesRestantes, ageDépart, tauxReval });
  const pensionAnim = useAnimatedNumber(res.pensionMensuelle);
  const hasResult = res.pensionMensuelle > 0;

  const currentTotal = (anneesFaites ?? 0) + (anneesRestantes ?? 0);
  const ircantecChart = useMemo(() => {
    if (!salaire) return [];
    const maxAns = Math.max(40, currentTotal);
    return Array.from({ length: maxAns }, (_, i) => {
      const n = i + 1;
      const r = calcIrcantec({ salaire, anneesFaites: n, anneesRestantes: 0, ageDépart, tauxReval });
      return { x: n, y: r.pensionMensuelle };
    });
  }, [salaire, ageDépart, tauxReval, currentTotal]);

  const report = {
    title: "Simulateur Retraite IRCANTEC",
    highlight: { label: "Pension complémentaire nette mensuelle", value: hasResult ? fmtEur(res.pensionMensuelle) : "—" },
    params: [
      { label: "Salaire brut mensuel", value: salaire ? fmtEur(salaire) : "—" },
      { label: "Années déjà cotisées", value: anneesFaites !== null ? `${anneesFaites} ans` : "—" },
      { label: "Années restantes", value: anneesRestantes !== null ? `${anneesRestantes} ans` : "—" },
      { label: "Âge de départ prévu", value: ageDépart ? `${ageDépart} ans` : "—" },
      { label: "Revalorisation annuelle", value: tauxReval !== null ? `${tauxReval} %` : "—" },
    ],
    results: hasResult ? [
      { label: "Pension nette mensuelle", value: fmtEur(res.pensionMensuelle), strong: true },
      { label: "Pension brute mensuelle", value: fmtEur(res.pensionBrute / 12) },
      { label: "Total points acquis", value: fmt(res.totalPoints) },
      { label: "Valeur de service du point", value: `${res.valServProj.toFixed(5)} €/pt` },
      { label: "Total cotisé (carrière)", value: fmtEur(res.cotSalTotal + res.cotPatTotal) },
    ] : [],
    notes: hasResult ? [
      "Pension complémentaire à ajouter à votre pension de base (CNAV ou CNRACL).",
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur Retraite IRCANTEC",
        "url": "https://www.simfinly.com/simulateurs/ircantec",
        "description": "Calculez votre retraite IRCANTEC : points acquis, valeur du point, pension pour les agents non titulaires de l'État.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": "fr-FR",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": FAQ.map(f => ({
          "@type": "Question", "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }} />
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 60px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/ircantec" size={34} />}
          badge="Contractuels publics · Données 2026"
          title="Simulateur IRCANTEC"
          subtitle="Retraite complémentaire contractuels · Données 2026"
          desc="Estimez vos points et votre pension complémentaire IRCANTEC si vous êtes agent non-titulaire de la fonction publique ou élu local."
        />

        {/* Réassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "rgba(184,147,74,0.07)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {["✓ Valeur d'achat : 8,06 €/point", "✓ Valeur de service : 0,54076 €/pt/an", "✓ Tranche A + Tranche B"].map((t, i) => <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>)}
        </div>

        {/* Formulaire */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px 28px", boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>Votre situation</h2>

          <NumInput id="salaire" label="Salaire brut mensuel" value={salaire} onChange={setSalaire} unit="€" min={500} max={40000}
            hint={salaire ? `PASS 2026 : 4 005 €/mois · ${salaire * 12 > PASS ? "Tranche B activée" : "Tranche A uniquement"}` : "Salaire brut mensuel servant au calcul des cotisations IRCANTEC"}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <NumInput id="annees-faites" label="Années déjà cotisées" value={anneesFaites} onChange={setAnneesFaites} unit="ans" min={0} max={50}
              hint={anneesFaites !== null && salaire ? `${fmt((salaire * 12 <= PASS ? salaire * 12 * TAUX_TA : PASS * TAUX_TA + (salaire * 12 - PASS) * TAUX_TB) / VALEUR_ACHAT * anneesFaites)} pts acquis` : undefined}
            />
            <NumInput id="annees-restantes" label="Années restantes" value={anneesRestantes} onChange={setAnneesRest} unit="ans" min={0} max={50} />
          </div>

          {/* Résumé points */}
          <div style={{ background: "rgba(184,147,74,0.06)", border: "1px solid rgba(184,147,74,0.15)", borderRadius: 12, padding: "14px 20px", display: "flex", flexWrap: "wrap" }}>
            {[
              { l: "Points/an", v: salaire ? fmt(res.ptsParAn) : "—", gold: true },
              { l: "Points TA", v: fmt(res.pointsTA) },
              { l: "Points TB", v: fmt(res.pointsTB) },
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, minWidth: 100, padding: "4px 16px", borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{item.l}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 700, color: item.gold ? "var(--gold)" : "var(--text)" }}>{item.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Paramètres avancés */}
        <AccordionSection title="Paramètres avancés" subtitle="Âge de départ, revalorisation">
          <StepperInput label="Âge de départ prévu" value={ageDépart} onChange={setAgeDépart}
            min={62} max={70} unit=" ans"
            hint="La pension IRCANTEC est versée dès la liquidation de vos droits à la retraite"
          />
          <StepperInput
            label="Taux de revalorisation annuel estimé"
            value={tauxReval} onChange={setTauxReval}
            min={0} max={3} step={0.5} unit=" %"
            hint={tauxReval !== null && tauxReval > 0 ? `Valeur de service projetée : ${res.valServProj.toFixed(5)} €/pt` : "Valeur de service 2026 fixe : 0,54076 €/pt"}
            tooltip="La valeur de service IRCANTEC est revalorisée chaque année par décret selon l'inflation."
          />
        </AccordionSection>

        {/* Résultats */}
        <div ref={resultsRef} style={{ background: "linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginTop: 20, boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>Votre pension IRCANTEC estimée</h2>

          <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Pension complémentaire nette mensuelle</div>
            {!hasResult ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>Saisissez vos paramètres pour voir votre estimation.</p>
            ) : (
              <>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,10vw,72px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  aria-label={`${Math.round(res.pensionMensuelle)} euros par mois`}>
                  {pensionAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                  soit <strong>{fmtEur(res.pensionBrute / 12)}/mois brut</strong> · {fmtEur(res.pensionNette)}/an
                </div>
              </>
            )}
          </div>

          {hasResult && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                <Chip label="Total points" value={fmt(res.totalPoints)} accent />
                <Chip label="Val. service" value={`${res.valServProj.toFixed(4)} €/pt`} />
                <Chip label="Pension brute" value={`${fmtEur(res.pensionBrute / 12)}/mois`} />
              </div>

              <ProgressBar label="Points Tranche A" value={res.pointsTA} total={res.totalPoints} color="var(--progress-acquired)" />
              <ProgressBar label="Points Tranche B" value={res.pointsTB} total={res.totalPoints} color="linear-gradient(90deg,var(--gold-mid),var(--gold))" />

              {ircantecChart.length > 1 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                    Pension selon la durée de cotisation totale
                  </div>
                  <ZoomableChart caption="Pension nette mensuelle IRCANTEC selon le total d'années cotisées">
                    <LineAreaChart
                      series={[{ id: "pension", label: "Pension nette / mois", points: ircantecChart, color: "#b8934a" }]}
                      xFmt={v => `${v} ans`}
                      yFmt={v => `${Math.round(v)} €`}
                      annotations={currentTotal > 0 ? [{ x: currentTotal }] : []}
                      aria="Pension IRCANTEC selon les années de cotisation"
                    />
                  </ZoomableChart>
                </div>
              )}

              {/* Cotisations */}
              <AccordionSection title="Détail des cotisations" subtitle="Répartition salarié / employeur sur toute la carrière">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                  <Chip label="Part salariale" value={fmtEur(res.cotSalTotal)} small />
                  <Chip label="Part patronale" value={fmtEur(res.cotPatTotal)} small />
                  <Chip label="Total cotisé" value={fmtEur(res.cotSalTotal + res.cotPatTotal)} accent small />
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.9 }}>
                  <div>Taux TA — salarié : {(TAUX_TA_SAL * 100).toFixed(2)} % · employeur : {(TAUX_TA_PAT * 100).toFixed(2)} % · total : {(TAUX_TA * 100).toFixed(2)} %</div>
                  <div>Taux TB — salarié : {(TAUX_TB_SAL * 100).toFixed(2)} % · employeur : {(TAUX_TB_PAT * 100).toFixed(2)} % · total : {(TAUX_TB * 100).toFixed(2)} %</div>
                </div>
              </AccordionSection>

              <div role="note" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16 }}>
                ⚠️ <strong>Simulation indicative.</strong> Cette pension complémentaire s'ajoute à votre pension de base (CNAV ou CNRACL selon votre statut).
                Pour un relevé officiel : <a href="https://www.ircantec.fr" target="_blank" rel="noopener" style={{ color: "var(--gold-mid)" }}>ircantec.fr</a>.
              </div>
            </>
          )}
        </div>

        <ShareBar params={{ salaire, anneesFaites, anneesRestantes, ageDépart, tauxReval }} resultsRef={resultsRef} report={report} name="ircantec" />

        {hasResult && (
          <ScenarioCompare
            name="ircantec"
            base={{ ageDépart, anneesRestantes }}
            fields={[
              { key: "ageDépart", label: "Âge de départ", type: "step", min: 62, max: 70, step: 1, unit: "ans" },
              { key: "anneesRestantes", label: "Années restantes", type: "num", unit: "ans", min: 0, max: 50 },
            ]}
            compute={(v) => calcIrcantec({ salaire, anneesFaites, anneesRestantes, ageDépart, tauxReval, ...v })}
            metrics={[{ label: "Pension nette / mois", get: r => r.pensionMensuelle, fmt: fmtEur, higherBetter: true }]}
          />
        )}

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos de ce simulateur</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>Le régime des agents non titulaires de l'État</h3>
            <p style={{ marginBottom: 16 }}>L'IRCANTEC (Institution de Retraite Complémentaire des Agents Non Titulaires de l'État et des Collectivités) est le régime de retraite complémentaire obligatoire des agents contractuels de la fonction publique. Il couvre les contractuels de l'État, des collectivités territoriales, des hôpitaux publics et de nombreux organismes parapublics, soit environ 4 millions de cotisants actifs.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Un système de points, comme l'Agirc-Arrco</h3>
            <p style={{ marginBottom: 16 }}>L'IRCANTEC est un régime par points. Chaque année, vos cotisations sont converties en points : votre salaire brut est multiplié par un taux global (5,50 % jusqu'au PASS en 2026, 11,35 % au-delà), puis divisé par la valeur d'achat du point. En 2026, la valeur de service du point IRCANTEC est de 0,5204 € et la valeur d'achat de 12,516 €. À la liquidation, vos points accumulés sont multipliés par la valeur de service pour obtenir votre pension annuelle complémentaire.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Les conditions de liquidation</h3>
            <p>La pension IRCANTEC suit les mêmes règles d'âge que le régime général (64 ans pour les générations 1965+). Aucun taux plein n'est requis pour liquider : la pension est calculée proportionnellement aux points acquis, quel que soit l'âge ou la durée de cotisation. Les droits IRCANTEC s'ajoutent à la pension de base du régime général pour les agents qui y ont également cotisé.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Questions fréquentes — IRCANTEC</h2>
          {FAQ.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
        </div>

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>
      </div>
      <Footer />
    </div>
  );
}
