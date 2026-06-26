import { useState, useEffect, useRef, useMemo } from "react";
import { PASS } from "../../config/constants.js";
import { useFiscalProfile } from "../../hooks/useFiscalProfile.js";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import ZoomableChart from "../../components/ZoomableChart.jsx";
import LineAreaChart from "../../components/charts/LineAreaChart.jsx";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import AffiliateCTA from "../../components/AffiliateCTA.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import AdUnit from "../../components/AdUnit.jsx";
import ScenarioCompare from "../../components/ScenarioCompare.jsx";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, StatusBadge, useAnimatedNumber,
  fmtEur, SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";
import { FAQS } from '../../data/faqs.js';

// ─── Barème PER ────────────────────────────────────────────────────────────────
// Plan d'Épargne Retraite (PER individuel). Constantes 2026.
//
// ⚠ Valeurs INDICATIVES, isolées volontairement dans ce bloc pour être corrigées
// facilement. Le PASS (Plafond Annuel de la Sécurité Sociale) 2026 = 48 060 €.
// Le plafond de déduction des versements volontaires d'un salarié pour une année N
// est, par défaut : max(10 % × min(revenu net professionnel, 8×PASS) ; 10 % × PASS).
// → plancher = 10 % × PASS = 4 806 € ; plafond = 10 % × 8 × PASS = 38 448 €.
// Les figures projetées sont des estimations (2026), hors plafonds non
// utilisés des années antérieures et hors mutualisation entre conjoints.
const PLAFOND_PLANCHER = Math.round(0.10 * PASS);        // 4 806 € (= 10 % × PASS)
// Plafond max = 10 % × 8 × PASS = 38 448 € (appliqué dans plafondDeduction).

// Taux marginal d'imposition proposés (tranches du barème IR).
const TMI_OPTIONS = [0, 11, 30, 41, 45];

// Plafond de déduction annuel = max(10 % × min(revenu, 8×PASS) ; 10 % × PASS).
function plafondDeduction(revenuNetPro) {
  const base = 0.10 * Math.min(Math.max(revenuNetPro, 0), 8 * PASS);
  return Math.round(Math.max(base, PLAFOND_PLANCHER));
}

// Valeur future d'une suite de versements annuels constants capitalisés au taux r.
function capitalProjete(versement, tauxPct, annees) {
  if (versement <= 0 || annees <= 0) return 0;
  const r = tauxPct / 100;
  if (r === 0) return versement * annees;
  return versement * ((Math.pow(1 + r, annees) - 1) / r);
}

// Compute pur (mêmes formules que le rendu) réutilisé par la comparaison de 2
// scénarios. versement = versement ANNUEL.
function computePer({ versement, revenu, tmi, ageActuel, ageDepart, rendement }) {
  const plafond = plafondDeduction(revenu ?? 0);
  const versementAnnuel = versement ?? 0;
  const versementDeductible = Math.min(versementAnnuel, plafond);
  const economieAnnuelle = versementDeductible * ((tmi ?? 0) / 100);
  const annees = Math.max(0, (ageDepart ?? 0) - (ageActuel ?? 0));
  const capital = capitalProjete(versementAnnuel, rendement ?? 0, annees);
  return { economieAnnuelle, capital };
}

const sectionTitle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 20 };

const FAQ = FAQS['/simulateurs/per'];

// ─── Simulateur ───────────────────────────────────────────────────────────────
export default function Per() {
  const [theme, setTheme] = useTheme();
  const isMobile = useIsMobile();
  const { tmi: profileTmi } = useFiscalProfile();

  const card = {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 16, padding: isMobile ? "20px 16px" : "24px 20px",
    marginBottom: 20, boxShadow: "var(--card-shadow)",
  };

  const [versement, setVersement]   = useState(null);
  const [revenu, setRevenu]         = useState(null);
  const [tmi, setTmi]               = useState(profileTmi);
  const [ageActuel, setAgeActuel]   = useState(40);
  const [ageDepart, setAgeDepart]   = useState(64);
  const [rendement, setRendement]   = useState(3);

  const resultsRef = useRef(null);

  usePageMeta("Simulateur PER 2026 — Économie d'impôt et capital retraite", "Estimez l'avantage fiscal de votre Plan d'Épargne Retraite (PER) : économie d'impôt selon votre TMI, plafond de déduction et capital projeté à la retraite. Paramètres 2026.");

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'per' });
    if (!sessionStorage.getItem('tracked_per')) {
      sessionStorage.setItem('tracked_per', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'per' })
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.versement !== undefined) setVersement(shared.versement);
      if (shared.revenu !== undefined) setRevenu(shared.revenu);
      if (shared.tmi !== undefined) setTmi(shared.tmi);
      if (shared.ageActuel !== undefined) setAgeActuel(shared.ageActuel);
      if (shared.ageDepart !== undefined) setAgeDepart(shared.ageDepart);
      if (shared.rendement !== undefined) setRendement(shared.rendement);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ versement, revenu, tmi, ageActuel, ageDepart, rendement }));
  }, [versement, revenu, tmi, ageActuel, ageDepart, rendement]);

  // ── Calculs ──
  const plafond = plafondDeduction(revenu ?? 0);
  const versementAnnuel = versement ?? 0;
  const versementDeductible = Math.min(versementAnnuel, plafond);
  const economieAnnuelle = versementDeductible * (tmi / 100);
  const effortNet = versementAnnuel - economieAnnuelle;

  const annees = Math.max(0, ageDepart - ageActuel);
  const capital = capitalProjete(versementAnnuel, rendement, annees);
  const totalVerse = versementAnnuel * annees;
  const totalEconomie = economieAnnuelle * annees;

  const hasInput = versementAnnuel > 0 && annees > 0;
  const auDelaPlafond = versementAnnuel > plafond;

  const perChart = useMemo(() => {
    if (!hasInput) return [];
    return Array.from({ length: annees + 1 }, (_, y) => ({
      x: ageActuel + y,
      capital: capitalProjete(versementAnnuel, rendement, y),
      verse: versementAnnuel * y,
    }));
  }, [versementAnnuel, rendement, annees, ageActuel, hasInput]);

  const animCapital = useAnimatedNumber(capital);
  const animEconomie = useAnimatedNumber(economieAnnuelle);

  const report = {
    title: "Simulateur PER — Plan d'Épargne Retraite",
    highlight: { label: "Capital projeté à la retraite", value: hasInput ? fmtEur(Math.round(capital)) : "—" },
    params: [
      { label: "Versement annuel", value: versement ? fmtEur(versement) : "—" },
      { label: "Revenu net professionnel", value: revenu ? fmtEur(revenu) : "—" },
      { label: "Tranche marginale (TMI)", value: `${tmi} %` },
      { label: "Âge actuel", value: `${ageActuel} ans` },
      { label: "Âge de départ", value: `${ageDepart} ans` },
      { label: "Rendement annuel", value: `${rendement} %` },
    ],
    results: hasInput ? [
      { label: "Capital projeté à la retraite", value: fmtEur(Math.round(capital)), strong: true },
      { label: "Économie d'impôt annuelle", value: fmtEur(Math.round(economieAnnuelle)) },
      { label: "Effort net annuel", value: fmtEur(Math.round(effortNet)) },
      { label: "Total versé", value: fmtEur(Math.round(totalVerse)) },
      { label: "Économie d'impôt cumulée", value: fmtEur(Math.round(totalEconomie)) },
    ] : [],
    notes: hasInput ? [
      auDelaPlafond
        ? `Versement supérieur au plafond de déduction (${fmtEur(plafond)}) : seule la part déductible génère l'avantage fiscal.`
        : `Part déductible : ${fmtEur(versementDeductible)} (plafond ${fmtEur(plafond)}).`,
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur PER — Plan d'Épargne Retraite 2026",
        "url": "https://www.simfinly.com/simulateurs/per",
        "description": "Estimez l'avantage fiscal de votre Plan d'Épargne Retraite : économie d'impôt selon votre TMI, plafond de déduction et capital projeté à la retraite.",
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
      <main id="main-content" style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "28px 16px 60px" : "28px 24px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/per" size={34} />}
          badge="Retraite · Simulation 2026"
          title="Simulateur PER"
          subtitle="Plan d'Épargne Retraite · Avantage fiscal"
          desc="Estimez l'économie d'impôt de vos versements selon votre tranche marginale, votre plafond de déduction et le capital projeté à votre départ en retraite. Paramètres 2026."
        />

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>

          {/* ── Colonne formulaire ── */}
          <div style={{ order: isMobile ? 2 : 1 }}>
            {/* Versements */}
            <div style={card}>
              <h2 style={sectionTitle}>Vos versements</h2>
              <NumInput label="Versement annuel sur le PER" value={versement} onChange={setVersement} unit="€" min={0} max={50000}
                hint={hasInput ? `Part déductible : ${fmtEur(versementDeductible)} · plafond : ${fmtEur(plafond)}` : `Plafond de déduction : ${fmtEur(plafond)}`} />
              <NumInput label="Revenu net professionnel annuel" value={revenu} onChange={setRevenu} unit="€" min={0} max={500000}
                tooltip="Revenu professionnel net de l'année précédente, servant de base au calcul du plafond de déduction (10 %)."
                hint={`Détermine le plafond : max(10 % × min(revenu, 8×PASS) ; ${fmtEur(PLAFOND_PLANCHER)})`} />
            </div>

            {/* Fiscalité */}
            <div style={card}>
              <h2 style={sectionTitle}>Votre fiscalité</h2>
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
                  Tranche marginale d'imposition (TMI)
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {TMI_OPTIONS.map(t => {
                    const active = tmi === t;
                    return (
                      <button key={t} onClick={() => setTmi(t)}
                        aria-pressed={active}
                        style={{
                          flex: "1 1 0", minWidth: 56, padding: "10px 8px", borderRadius: 12, cursor: "pointer",
                          background: active ? "rgba(43,92,230,0.1)" : "var(--card-bg)",
                          border: `1.5px solid ${active ? "var(--gold-mid)" : "var(--border)"}`,
                          color: active ? "var(--gold)" : "var(--text)",
                          fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700,
                          transition: "border-color 0.2s, background 0.2s",
                        }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = "var(--gold-mid)"; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = "var(--border)"; }}
                      >
                        {t} %
                      </button>
                    );
                  })}
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>
                  Taux appliqué à votre dernier euro de revenu imposable.
                </div>
              </div>
            </div>

            {/* Horizon */}
            <div style={card}>
              <h2 style={sectionTitle}>Votre horizon</h2>
              <StepperInput label="Âge actuel" value={ageActuel} onChange={v => setAgeActuel(Math.round(v))} min={18} max={67} step={1} unit="ans" />
              <StepperInput label="Âge de départ en retraite" value={ageDepart} onChange={v => setAgeDepart(Math.round(v))} min={ageActuel + 1} max={70} step={1} unit="ans"
                hint={annees > 0 ? `Durée d'épargne : ${annees} ans` : "Doit être supérieur à l'âge actuel"} />
              <StepperInput label="Rendement annuel moyen" value={rendement} onChange={setRendement} min={0} max={10} step={0.1} unit="%" />
            </div>
          </div>

          {/* ── Colonne résultats ── */}
          <div style={{ order: isMobile ? 1 : 2, minWidth: 0 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 20, textAlign: "center", boxShadow: "var(--card-shadow)" }} ref={resultsRef}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'Hanken Grotesk', sans-serif", marginBottom: 6 }}>
                Capital projeté à la retraite
              </div>
              {!hasInput ? (
                <p style={{ color: "var(--text-secondary)", padding: "20px 0", fontSize: 14 }}>
                  Renseignez un versement annuel et un horizon d'épargne pour voir votre estimation.
                </p>
              ) : (
                <>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 42, color: "var(--primary)", lineHeight: 1 }}>
                    {fmtEur(Math.round(animCapital))}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
                    après {annees} ans à {rendement} % · {fmtEur(totalVerse)} versés
                  </div>
                  <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                    <StatusBadge status="gold" label={`TMI ${tmi} %`} />
                    {auDelaPlafond
                      ? <StatusBadge status="warn" label="Au-delà du plafond déductible" />
                      : <StatusBadge status="good" label="Versement intégralement déductible" />}
                  </div>
                </>
              )}

              <ShareBar
                params={{ versement, revenu, tmi, ageActuel, ageDepart, rendement }}
                resultsRef={resultsRef}
                report={report}
                name="per"
              />
            </div>

            {hasInput && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <Chip label="Économie d'impôt / an" value={fmtEur(Math.round(animEconomie))} accent small />
                <Chip label="Effort net / an" value={fmtEur(Math.round(effortNet))} small />
                <Chip label="Total versé" value={fmtEur(totalVerse)} small />
                <Chip label="Plafond de déduction" value={fmtEur(plafond)} small />
              </div>
            )}

            {hasInput && (
              <div style={card}>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 }}>
                  Économie d'impôt cumulée sur {annees} ans
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: "var(--gold)" }}>
                  ≈ {fmtEur(Math.round(totalEconomie))}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6, lineHeight: 1.6 }}>
                  En déduisant {fmtEur(versementDeductible)}/an à une TMI de {tmi} %, vous économisez environ {fmtEur(Math.round(economieAnnuelle))} d'impôt chaque année.
                </div>
              </div>
            )}

            {hasInput && perChart.length > 1 && (
              <div style={card}>
                <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                  Projection du capital dans le temps
                </div>
                <ZoomableChart caption="Capital PER et total versé selon l'âge">
                  <LineAreaChart
                    series={[
                      { id: "capital", label: "Capital projeté", points: perChart.map(p => ({ x: p.x, y: p.capital })), color: "var(--primary)" },
                      { id: "verse", label: "Total versé", points: perChart.map(p => ({ x: p.x, y: p.verse })), color: "#6eb5d4", strokeWidth: 1.5, dashed: true },
                    ]}
                    xFmt={v => `${v} ans`}
                    yFmt={v => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M€` : v >= 1000 ? `${Math.round(v / 1000)}k€` : `${Math.round(v)} €`}
                    aria="Projection du capital PER selon l'âge"
                  />
                </ZoomableChart>
              </div>
            )}

            {hasInput && (
              <AccordionSection title="Détail du calcul" defaultOpen>
                {[
                  { label: "Versement annuel", value: fmtEur(versementAnnuel) },
                  { label: "Plafond de déduction", value: fmtEur(plafond) },
                  { label: "Part déductible retenue", value: fmtEur(versementDeductible), accent: true },
                  { label: `Économie d'impôt (× ${tmi} %)`, value: fmtEur(Math.round(economieAnnuelle)), accent: true },
                  { label: "Effort net annuel", value: fmtEur(Math.round(effortNet)) },
                  { label: "Durée d'épargne", value: `${annees} ans` },
                  { label: "Total versé", value: fmtEur(totalVerse) },
                  { label: "Capital projeté", value: fmtEur(Math.round(capital)), accent: true },
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

        {/* Comparaison de 2 scénarios */}
        {hasInput && (
          <ScenarioCompare
            name="per"
            base={{ versement, revenu, tmi, ageActuel, ageDepart, rendement }}
            compute={computePer}
            fields={[
              { key: "versement", label: "Versement annuel", unit: "€", kind: "eur", type: "num", min: 0, max: 50000 },
              { key: "tmi", label: "TMI", unit: "%", type: "step", min: 0, max: 45, step: 1 },
              { key: "rendement", label: "Rendement", unit: "%", type: "step", min: 0, max: 10, step: 0.5 },
              { key: "ageDepart", label: "Âge de départ", type: "step", min: 55, max: 70, step: 1 },
            ]}
            metrics={[
              { label: "Économie d'impôt / an", get: r => r.economieAnnuelle, fmt: n => fmtEur(Math.round(n)), higherBetter: true },
              { label: "Capital à la retraite", get: r => r.capital, fmt: n => fmtEur(Math.round(n)), higherBetter: true },
            ]}
          />
        )}

        {/* Affiliation */}
        {hasInput && <AffiliateCTA type="per" />}

        {/* AdSense mid */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {/* À propos */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos du PER</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>Un produit d'épargne retraite défiscalisant</h3>
            <p style={{ marginBottom: 16 }}>Le Plan d'Épargne Retraite (PER), issu de la loi PACTE de 2019, permet de se constituer un complément de revenu pour la retraite tout en réduisant son impôt. Les versements volontaires sont déductibles du revenu imposable, ce qui génère une économie d'impôt proportionnelle à votre tranche marginale d'imposition (TMI) : plus celle-ci est élevée, plus l'avantage est important. L'épargne reste investie et bloquée jusqu'au départ en retraite.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Le plafond de déduction</h3>
            <p style={{ marginBottom: 16 }}>La déduction des versements est plafonnée : pour un salarié, elle correspond à 10 % des revenus professionnels nets de l'année précédente, dans la limite de 8 PASS (soit 38 448 € en 2026 avec un PASS à 48 060 €), avec un plancher de 10 % du PASS (4 806 €). Les plafonds non utilisés des trois dernières années sont reportables et les conjoints peuvent les mutualiser, ce qui peut considérablement augmenter la capacité de déduction.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>La fiscalité à la sortie</h3>
            <p>L'avantage fiscal à l'entrée se « paie » en partie à la sortie. En sortie en capital, la fraction correspondant aux versements déduits est soumise au barème de l'impôt sur le revenu, et les plus-values au prélèvement forfaitaire unique de 30 %. En rente viagère, les sommes sont imposées comme une pension. L'intérêt du PER est donc maximal lorsque la TMI est plus élevée pendant la vie active qu'à la retraite.</p>
          </div>
        </div>

        {/* FAQ */}
        <FaqSection items={FAQ} />

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", opacity: 0.6, marginTop: 32 }}>
          Simulation indicative basée sur les paramètres 2026 (PASS 48 060 €) · Le rendement n'est pas garanti · Ne constitue pas un conseil en investissement
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
