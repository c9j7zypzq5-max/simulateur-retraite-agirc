import { useState, useEffect, useRef, useMemo } from "react";
import { useFiscalProfile } from "../../hooks/useFiscalProfile.js";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import ShareBar from "../../components/ShareBar.jsx";
import ScenarioCompare from "../../components/ScenarioCompare.jsx";
import AffiliateCTA from "../../components/AffiliateCTA.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, AccordionSection, Toggle,
  Chip, useAnimatedNumber, fmt, fmtEur, SimulateurHeader, FaqSection,
  FaqItem,
} from "../../components/ui.jsx";
import ZoomableChart from "../../components/ZoomableChart.jsx";
import BarChart from "../../components/charts/BarChart.jsx";

// ─── Barème IR 2026 (revenus 2025, revalorisé +0,9 %) ─────────────────────────
const BAREME = [
  { min: 0,       max: 11_600,  taux: 0    },
  { min: 11_600,  max: 29_579,  taux: 0.11 },
  { min: 29_579,  max: 84_577,  taux: 0.30 },
  { min: 84_577,  max: 181_917, taux: 0.41 },
  { min: 181_917, max: Infinity, taux: 0.45 },
];

function calcParts(situation, nbEnfants) {
  const base = situation === "marie" ? 2 : 1;
  let partsEnfants = 0;
  for (let i = 1; i <= nbEnfants; i++) {
    partsEnfants += i <= 2 ? 0.5 : 1;
  }
  return base + partsEnfants;
}

function calcIR(revenuBrut, situation, nbEnfants) {
  // Abattement 10% sur salaires (min 509€, max 14 555€)
  const abattement = Math.min(Math.max(revenuBrut * 0.10, 509), 14_555);
  const revenuImposable = Math.max(0, revenuBrut - abattement);

  const nbParts = calcParts(situation, nbEnfants);
  const quotient = revenuImposable / nbParts;

  // IR sur quotient familial
  let irQuotient = 0;
  for (const tranche of BAREME) {
    if (quotient <= tranche.min) break;
    irQuotient += (Math.min(quotient, tranche.max) - tranche.min) * tranche.taux;
  }

  const irBrut = irQuotient * nbParts;

  // Décote (2026): IR < 1 982€ (célibataire) ou < 3 277€ (couple)
  const seuilDecote = situation === "marie" ? 3_277 : 1_982;
  const decoteMax = situation === "marie" ? 1_483 : 897;
  let decote = 0;
  if (irBrut < seuilDecote) {
    decote = Math.max(0, decoteMax - 0.4525 * irBrut);
  }

  const irNet = Math.max(0, irBrut - decote);

  // TMI (taux marginal d'imposition)
  let tmi = 0;
  for (const tranche of BAREME) {
    if (quotient > tranche.min) tmi = tranche.taux;
  }

  // Taux moyen
  const tauxMoyen = revenuImposable > 0 ? irNet / revenuImposable * 100 : 0;

  return {
    revenuImposable, nbParts, quotient, irBrut, decote, irNet, tmi, tauxMoyen, abattement
  };
}

const FAQ = [
  { q: "Comment fonctionne le barème progressif de l'impôt 2025 ?", a: "Le barème IR 2025 (déclaré en 2026) comporte 5 tranches : 0 % jusqu'à 11 294 €, 11 % de 11 294 € à 28 797 €, 30 % de 28 797 € à 82 341 €, 41 % de 82 341 € à 177 106 €, et 45 % au-delà. Ce barème s'applique au revenu net imposable après abattement de 10 % sur les salaires et après division par le nombre de parts fiscales." },
  { q: "Quelle est la différence entre TMI et taux moyen d'imposition ?", a: "Le TMI (Taux Marginal d'Imposition) est le taux appliqué à votre dernier euro de revenu imposable. Le taux moyen est votre impôt total divisé par votre revenu imposable. Par exemple, avec un revenu imposable de 50 000 €, votre TMI peut être 30 % (tranche) mais votre taux moyen seulement 14 %, car les premières tranches sont imposées à 0 % et 11 %." },
  { q: "Qu'est-ce que le quotient familial ?", a: "Le quotient familial permet de diviser le revenu imposable par le nombre de parts pour calculer l'impôt, puis de le multiplier par ce même nombre de parts. Un célibataire a 1 part, un couple marié ou pacsé 2 parts. Chaque enfant à charge ajoute 0,5 part (les 2 premiers) puis 1 part à partir du 3e. Le gain fiscal par demi-part est plafonné à 1 759 € (2026)." },
  { q: "Comment déclarer mes revenus locatifs à l'impôt ?", a: "Les revenus de location nue (non meublée) sont déclarés en revenus fonciers. Si < 15 000 €/an, le régime micro-foncier s'applique avec un abattement forfaitaire de 30 %. Au-delà ou sur option, le régime réel permet de déduire toutes les charges réelles (travaux, intérêts d'emprunt, assurance, gestion). Les locations meublées relèvent des BIC (micro ou réel)." },
  { q: "Quelles principales réductions et crédits d'impôt sont disponibles ?", a: "Parmi les plus courants : crédit d'impôt pour emploi à domicile (50 % des dépenses, plafond 12 000 €), crédit d'impôt garde d'enfants (50 % des frais de crèche/assistante maternelle), réduction pour dons aux associations (66 % ou 75 % selon l'organisme), et réduction Pinel pour investissement locatif neuf (taux dégressif selon durée d'engagement)." },
  { q: "Qu'est-ce que la décote sur l'impôt sur le revenu ?", a: "La décote est une réduction automatique pour les contribuables modestes dont l'IR calculé est faible. En 2026 (revenus 2025), elle s'applique si l'IR brut est inférieur à 1 929 € (célibataire) ou 3 191 € (couple). La décote = 873 € (ou 1 444 €) moins 45,25 % de l'IR brut. Elle disparaît progressivement au-delà des seuils." },
];

export default function ImpotRevenu() {
  const [theme, setTheme] = useTheme();
  const { setTmi: setProfileTmi } = useFiscalProfile();

  const [revenuBrut, setRevenuBrut]       = useState(null);
  const [situation, setSituation]         = useState("celibataire");
  const [nbEnfants, setNbEnfants]         = useState(0);

  const resultsRef = useRef(null);

  usePageMeta("Simulateur Impôt sur le Revenu 2026 — Calcul IR barème officiel", "Estimez votre impôt sur le revenu 2026 : barème progressif, quotient familial, décote, TMI et taux moyen d'imposition.");

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'impot-revenu' });
    if (!sessionStorage.getItem('tracked_impot-revenu')) {
      sessionStorage.setItem('tracked_impot-revenu', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'impot-revenu' })
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.revenuBrut !== undefined) setRevenuBrut(shared.revenuBrut);
      if (shared.situation !== undefined) setSituation(shared.situation);
      if (shared.nbEnfants !== undefined) setNbEnfants(shared.nbEnfants);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ revenuBrut, situation, nbEnfants }));
  }, [revenuBrut, situation, nbEnfants]);

  const res = revenuBrut ? calcIR(revenuBrut, situation, nbEnfants) : null;

  useEffect(() => {
    if (res?.tmi != null) setProfileTmi(Math.round(res.tmi * 100));
  }, [res?.tmi]); // eslint-disable-line react-hooks/exhaustive-deps

  const irNetAnim = useAnimatedNumber(res?.irNet || 0);

  const hasResult = res && res.irNet > 0;

  const tranchesChart = useMemo(() => {
    if (!res || res.irNet <= 0 || !res.nbParts) return [];
    return BAREME
      .filter(tranche => tranche.taux > 0 && res.quotient > tranche.min)
      .map(tranche => {
        const revInTranche = Math.max(0, Math.min(res.quotient, tranche.max) - tranche.min);
        const impotTranche = Math.round(revInTranche * tranche.taux * res.nbParts);
        const pct = Math.round(tranche.taux * 100);
        const color = pct <= 11 ? "#4ade80" : pct <= 30 ? "#f59e0b" : pct <= 41 ? "#f87171" : "#cc5555";
        return { label: `${pct}%`, segments: [{ value: impotTranche, color, label: `Tranche ${pct}%` }] };
      });
  }, [res]);

  const report = {
    title: "Simulateur Impôt sur le Revenu",
    highlight: { label: "Impôt net annuel", value: res ? fmtEur(Math.round(res.irNet)) : "—" },
    params: [
      { label: "Revenus annuels bruts", value: revenuBrut ? fmtEur(revenuBrut) : "—" },
      { label: "Situation familiale", value: situation === "marie" ? "Marié·e / Pacsé·e" : "Célibataire" },
      { label: "Nombre d'enfants", value: String(nbEnfants) },
    ],
    results: res ? [
      { label: "Impôt net annuel", value: fmtEur(Math.round(res.irNet)), strong: true },
      { label: "Impôt mensuel", value: fmtEur(Math.round(res.irNet / 12)) },
      { label: "TMI", value: `${(res.tmi * 100).toFixed(0)} %` },
      { label: "Taux moyen", value: `${res.tauxMoyen.toFixed(1)} %` },
      { label: "Revenu imposable", value: fmtEur(res.revenuImposable) },
      { label: "Parts fiscales", value: res.nbParts.toFixed(1) },
    ] : [],
    notes: res ? [
      res.irNet > 0
        ? `Tranche marginale d'imposition (TMI) de ${(res.tmi * 100).toFixed(0)} % · taux moyen de ${res.tauxMoyen.toFixed(1)} %.`
        : "Vous n'êtes pas imposable au titre de l'impôt sur le revenu.",
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur Impôt sur le revenu",
        "url": "https://www.simfinly.com/simulateurs/impot-revenu",
        "description": "Estimez votre impôt sur le revenu 2026 : barème progressif, quotient familial, décote, TMI et taux moyen d'imposition.",
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

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 16px 60px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/impot-revenu" size={34} />}
          badge="Impôts · Simulation 2026"
          title="Impôt sur le revenu"
          desc="Estimez votre impôt net, votre tranche marginale d'imposition (TMI) et votre taux moyen selon votre situation familiale."
        />

        {/* Réassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "rgba(43,92,230,0.06)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {["✓ Barème 2026 à jour", "✓ Décote incluse", "✓ Calcul 100 % local"].map((t, i) => <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>)}
        </div>

        {/* Formulaire */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", boxShadow: "var(--card-shadow)", marginBottom: 0 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>Votre situation</h2>

          <NumInput
            id="revenu-brut"
            label="Revenus annuels bruts"
            value={revenuBrut}
            onChange={setRevenuBrut}
            unit="€/an"
            min={0}
            max={1_000_000}
            hint={revenuBrut ? `Abattement 10 % : ${fmtEur(Math.min(Math.max(revenuBrut * 0.10, 509), 14_555))}` : "Salaire, pension, revenus d'activité, etc."}
          />

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
              Situation familiale
            </label>
            <Toggle
              options={["Célibataire", "Marié·e / Pacsé·e"]}
              checked={situation === "marie"}
              onChange={checked => setSituation(checked ? "marie" : "celibataire")}
            />
          </div>

          <StepperInput
            label="Nombre d'enfants"
            value={nbEnfants}
            onChange={setNbEnfants}
            min={0}
            max={8}
            step={1}
            hint={nbEnfants > 0 ? `Parts fiscales enfants : ${nbEnfants <= 2 ? nbEnfants * 0.5 : 1 + (nbEnfants - 2)}` : "Parts fiscales supplémentaires accordées"}
          />

          {/* Barre récapitulative */}
          {res && (
            <div style={{ background: "rgba(43,92,230,0.05)", border: "1px solid rgba(43,92,230,0.12)", borderRadius: 12, padding: "14px 20px", display: "flex", flexWrap: "wrap", marginTop: 4 }}>
              {[
                { l: "Revenu imposable", v: fmtEur(res.revenuImposable), gold: true },
                { l: "Parts fiscales", v: res.nbParts.toFixed(1) },
              ].map((item, i) => (
                <div key={i} style={{ flex: 1, minWidth: 100, padding: "4px 16px", borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{item.l}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 21, fontWeight: 700, color: item.gold ? "var(--gold)" : "var(--text)" }}>{item.v}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Résultats */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20, boxShadow: "var(--card-shadow)" }} ref={resultsRef}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>Votre impôt estimé</h2>

          <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'Hanken Grotesk', sans-serif", marginBottom: 6 }}>Impôt net annuel</div>
            {!hasResult ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>Saisissez vos paramètres pour voir votre estimation.</p>
            ) : (
              <>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 42, color: "var(--primary)", lineHeight: 1 }}
                  aria-label={`${Math.round(res.irNet)} euros d'impôt annuel`}>
                  {irNetAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                  soit <strong>{fmtEur(res.irNet / 12)}/mois</strong> d'impôt
                </div>
              </>
            )}
          </div>

          {hasResult && (
            <>
              {/* Chips */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
                <Chip label="TMI" value={`${(res.tmi * 100).toFixed(0)} %`} accent />
                <Chip label="Taux moyen" value={`${res.tauxMoyen.toFixed(1)} %`} />
                <Chip label="Revenu imposable" value={fmtEur(res.revenuImposable)} />
                <Chip label="Parts fiscales" value={res.nbParts.toFixed(1)} />
              </div>

              {/* Détails des tranches */}
              <AccordionSection title="Détail des tranches" subtitle="Calcul par tranche progressive">
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>Quotient familial (revenus imposables / parts)</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)" }}>{fmtEur(res.quotient)}</div>
                  </div>

                  <div style={{ background: "var(--card-bg)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12, color: "var(--text-secondary)" }}>IR brut par tranche</div>
                    {BAREME.map((tranche, i) => {
                      const revInTranche = Math.max(0, Math.min(res.quotient, tranche.max) - tranche.min);
                      const impotTranche = revInTranche * tranche.taux;
                      return (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
                          <span>{fmtEur(tranche.min)} à {tranche.max === Infinity ? "∞" : fmtEur(tranche.max)} ({(tranche.taux * 100).toFixed(0)} %)</span>
                          <span style={{ fontWeight: 600 }}>{fmtEur(impotTranche)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                    <div style={{ background: "var(--card-bg)", borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>Abattement</div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)" }}>{fmtEur(res.abattement)}</div>
                    </div>
                    <div style={{ background: "var(--card-bg)", borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>Décote</div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: res.decote > 0 ? "#4ade80" : "var(--text)" }}>
                        {res.decote > 0 ? "−" + fmtEur(res.decote) : "—"}
                      </div>
                    </div>
                  </div>

                  <div style={{ paddingTop: 12, borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text-secondary)" }}>
                    <div style={{ marginBottom: 6 }}>IR brut = (IR quotient × {res.nbParts.toFixed(1)} parts) = {fmtEur(res.irBrut)}</div>
                    <div>IR net = {fmtEur(res.irBrut)} − décote {fmtEur(res.decote)} = <strong style={{ color: "var(--text)" }}>{fmtEur(res.irNet)}</strong></div>
                  </div>
                </div>
              </AccordionSection>

              {tranchesChart.length > 1 && (
                <div style={{ marginTop: 24, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 12 }}>
                    Impôt par tranche
                  </div>
                  <ZoomableChart caption="Impôt par tranche du barème">
                    <BarChart
                      bars={tranchesChart}
                      yFmt={(v) => v >= 1000 ? `${Math.round(v / 1000)}k€` : `${v} €`}
                      aria="Répartition de l'impôt par tranche"
                    />
                  </ZoomableChart>
                </div>
              )}

              <div role="note" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16 }}>
                ⚠️ <strong>Calcul simplifié</strong>. Ce simulateur ne tient pas compte des crédits et réductions d'impôt, revenus fonciers, plus-values, cotisations Madelin, heures supplémentaires exonérées, etc. Pour un calcul exact : <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener" style={{ color: "var(--gold-mid)" }}>impots.gouv.fr</a> ou consultant un expert.
              </div>

              <ShareBar
                params={{ revenuBrut, situation, nbEnfants }}
                resultsRef={resultsRef}
                report={report}
                name="impot-revenu"
              />
              <AffiliateCTA type="assurance-vie" />
              <ScenarioCompare
                name="impot-revenu"
                base={{ revenuBrut, nbEnfants }}
                fields={[
                  { key: "revenuBrut", label: "Revenu annuel", type: "num", unit: "€", min: 0, max: 1000000, kind: "eur" },
                  { key: "nbEnfants", label: "Nombre d'enfants", type: "step", min: 0, max: 12, step: 1, unit: "" },
                ]}
                compute={(v) => calcIR(v.revenuBrut, situation, v.nbEnfants)}
                metrics={[{ label: "Impôt net annuel", get: r => r.irNet, fmt: fmtEur, higherBetter: false }]}
              />
            </>
          )}
        </div>

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos de ce simulateur</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>Le barème progressif 2026</h3>
            <p style={{ marginBottom: 16 }}>L'impôt sur le revenu français est calculé selon un barème progressif par tranches. Pour les revenus 2025 (déclarés en 2026), les taux sont : 0 % jusqu'à 11 600 €, 11 % de 11 600 € à 29 579 €, 30 % de 29 579 € à 84 577 €, 41 % de 84 577 € à 181 917 €, et 45 % au-delà. Ces tranches s'appliquent sur le revenu net imposable par part de quotient familial — pas sur le revenu brut.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Quotient familial et décote</h3>
            <p style={{ marginBottom: 16 }}>Le quotient familial réduit l'impôt des familles avec enfants : le revenu imposable est divisé par le nombre de parts (2 pour un couple, +0,5 par enfant en règle générale), l'impôt est calculé puis multiplié par ce nombre de parts. La décote efface partiellement la cotisation des foyers modestes : elle s'applique lorsque l'impôt brut est inférieur à 1 982 € (célibataire) ou 3 277 € (couple) en 2026.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>TMI et taux moyen : deux notions essentielles</h3>
            <p>Le Taux Marginal d'Imposition (TMI) est le taux de la tranche la plus haute dans laquelle vous cotisez. C'est lui qui détermine l'impact fiscal d'un revenu supplémentaire. Le taux moyen rapporte l'impôt total payé à l'ensemble du revenu imposable — il est toujours inférieur au TMI. Un contribuable avec un TMI à 30 % peut avoir un taux moyen de 12 %, ce qui signifie qu'il ne subit pas 30 % d'imposition sur l'ensemble de ses revenus.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Questions fréquentes — IR</h2>
          {FAQ.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          <p style={{ paddingTop: 20, fontSize: 12, color: "var(--text-secondary)" }}>
            Source officielle : <a href="https://www.impots.gouv.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>impots.gouv.fr</a>
          </p>
        </div>

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>
      </div>
      <Footer />
    </div>
  );
}

