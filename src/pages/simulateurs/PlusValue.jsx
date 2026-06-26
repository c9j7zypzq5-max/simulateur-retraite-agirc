import { useState, useEffect, useRef, useMemo } from "react";
import { PS_CAPITAL } from "../../config/constants.js";
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
  NumInput, AccordionSection, Toggle,
  Chip, useAnimatedNumber, fmtEur, SimulateurHeader, FaqSection,
  FaqItem,
} from "../../components/ui.jsx";
import ZoomableChart from "../../components/ZoomableChart.jsx";
import LineAreaChart from "../../components/charts/LineAreaChart.jsx";
import { FAQS } from '../../data/faqs.js';

// ─── Calcul abattements ────────────────────────────────────────────────────────
function calcAbattementIR(duree) {
  if (duree < 6) return 0;
  if (duree < 22) return Math.min((duree - 5) * 6, 96);
  return 100;
}

function calcAbattementPS(duree) {
  if (duree < 6) return 0;
  if (duree < 22) return Math.min((duree - 5) * 1.65, 26.4 + 1.6);
  if (duree < 30) return Math.min(26.4 + 1.6 + (duree - 22) * 9, 100);
  return 100;
}

function calcPlusValue({ prixAchat, anneeAchat, anneeVente, travaux, inclureFrais, prixVente }) {
  if (!prixAchat || !anneeAchat || !anneeVente || !prixVente) {
    return {
      duree: 0, pvBrute: 0, baseIR: 0, basePS: 0, impotIR: 0, impotPS: 0,
      totalImpot: 0, gainNet: 0, prixAchatNet: 0, abattIR: 0, abattPS: 0,
    };
  }

  // Durée de détention
  const duree = Math.floor(anneeVente - anneeAchat);

  // Frais d'acquisition
  const fraisAcq = inclureFrais ? prixAchat * 0.075 : 0;
  const prixAchatNet = prixAchat + fraisAcq + travaux;

  // Plus-value
  const pvBrute = Math.max(0, prixVente - prixAchatNet);

  // Abattements
  const abattIR = calcAbattementIR(duree);
  const abattPS = calcAbattementPS(duree);

  // Bases imposables
  const baseIR = pvBrute * (1 - abattIR / 100);
  const basePS = pvBrute * (1 - abattPS / 100);

  // Impôts
  const impotIR = baseIR * 0.19;
  const impotPS = basePS * PS_CAPITAL;
  const totalImpot = impotIR + impotPS;

  // Gain net vendeur
  const gainNet = prixVente - prixAchat - totalImpot;

  return {
    duree, pvBrute, baseIR, basePS, impotIR, impotPS,
    totalImpot, gainNet, prixAchatNet, abattIR, abattPS,
  };
}

const FAQ = FAQS['/simulateurs/plus-value-immobiliere'];

export default function PlusValue() {
  const [theme, setTheme] = useTheme();

  const [prixAchat, setPrixAchat]         = useState(null);
  const [anneeAchat, setAnneeAchat]       = useState(null);
  const [anneeVente, setAnneeVente]       = useState(null);
  const [travaux, setTravaux]             = useState(0);
  const [inclureFrais, setInclureFrais]   = useState(true);
  const [prixVente, setPrixVente]         = useState(null);

  const resultsRef = useRef(null);

  usePageMeta("Simulateur Plus-Value Immobilière 2026 — Calcul IR et prélèvements sociaux", "Calculez la plus-value immobilière nette après abattements pour durée de détention : IR (22 ans) et prélèvements sociaux (30 ans).");

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'plus-value-immobiliere' });
    if (!sessionStorage.getItem('tracked_plus-value-immobiliere')) {
      sessionStorage.setItem('tracked_plus-value-immobiliere', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'plus-value-immobiliere' })
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.prixAchat !== undefined) setPrixAchat(shared.prixAchat);
      if (shared.anneeAchat !== undefined) setAnneeAchat(shared.anneeAchat);
      if (shared.anneeVente !== undefined) setAnneeVente(shared.anneeVente);
      if (shared.travaux !== undefined) setTravaux(shared.travaux);
      if (shared.prixVente !== undefined) setPrixVente(shared.prixVente);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ prixAchat, anneeAchat, anneeVente, travaux, prixVente }));
  }, [prixAchat, anneeAchat, anneeVente, travaux, prixVente]);

  const isValid = prixVente && prixVente > 0 && anneeAchat && anneeVente && anneeVente > anneeAchat;
  const res = isValid ? calcPlusValue({ prixAchat, anneeAchat, anneeVente, travaux, inclureFrais, prixVente }) : null;
  const totalImpotAnim = useAnimatedNumber(res?.totalImpot || 0);

  const hasResult = res && res.totalImpot > 0;

  const abattChart = useMemo(() => {
    return Array.from({ length: 31 }, (_, yr) => ({
      x: yr,
      ir: +(((1 - calcAbattementIR(yr) / 100) * 19)).toFixed(2),
      ps: +(((1 - calcAbattementPS(yr) / 100) * 17.2)).toFixed(2),
    }));
  }, []);

  const report = {
    title: "Simulateur Plus-Value Immobilière",
    highlight: { label: "Impôt total estimé", value: res ? fmtEur(Math.round(res.totalImpot)) : "—" },
    params: [
      { label: "Prix d'acquisition", value: prixAchat ? fmtEur(prixAchat) : "—" },
      { label: "Année d'achat", value: anneeAchat ? String(anneeAchat) : "—" },
      { label: "Année de vente", value: anneeVente ? String(anneeVente) : "—" },
      { label: "Travaux", value: (travaux ?? 0) > 0 ? fmtEur(travaux) : "—" },
      { label: "Prix de vente", value: prixVente ? fmtEur(prixVente) : "—" },
    ],
    results: res ? [
      { label: "Impôt total", value: fmtEur(Math.round(res.totalImpot)), strong: true },
      { label: "Plus-value brute", value: fmtEur(Math.round(res.pvBrute)) },
      { label: "Durée de détention", value: `${res.duree} ans` },
      { label: "Impôt sur le revenu (19 %)", value: fmtEur(Math.round(res.impotIR)) },
      { label: "Prélèvements sociaux (17,2 %)", value: fmtEur(Math.round(res.impotPS)) },
      { label: "Gain net vendeur", value: fmtEur(Math.round(res.gainNet)) },
    ] : [],
    notes: res ? [
      "Exonération IR totale après 22 ans de détention ; prélèvements sociaux après 30 ans.",
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur Plus-value immobilière",
        "url": "https://www.simfinly.com/simulateurs/plus-value-immobiliere",
        "description": "Calculez la plus-value immobilière nette après abattements pour durée de détention : IR (22 ans) et prélèvements sociaux (30 ans).",
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
          icon={<SimIcon path="/simulateurs/plus-value-immobiliere" size={34} />}
          badge="Impôts · Simulation 2025"
          title="Plus-value immobilière"
          desc="Calculez l'imposition de la plus-value lors de la vente d'un bien immobilier selon la durée de détention."
        />

        {/* Réassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {["✓ IR + Prélèvements sociaux", "✓ Abattements 2025 à jour", "✓ Résidence principale exonérée"].map((t, i) => <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>)}
        </div>

        {/* Formulaire */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", boxShadow: "var(--card-shadow)", marginBottom: 0 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>Votre bien et durée de détention</h2>

          <NumInput
            id="prix-achat"
            label="Prix d'acquisition"
            value={prixAchat}
            onChange={setPrixAchat}
            unit="€"
            min={0}
            max={10_000_000}
            hint="Prix effectivement payé (hors frais notaire si option activée ci-dessous)"
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <NumInput
              id="annee-achat"
              label="Année d'achat"
              value={anneeAchat}
              onChange={setAnneeAchat}
              min={1950}
              max={2024}
            />
            <NumInput
              id="annee-vente"
              label="Année de vente"
              value={anneeVente}
              onChange={setAnneeVente}
              min={2025}
              max={2060}
            />
          </div>

          <NumInput
            id="travaux"
            label="Travaux réalisés"
            value={travaux}
            onChange={setTravaux}
            unit="€"
            min={0}
            max={1_000_000}
            hint="Travaux réalisés par entreprise uniquement (avec facture)"
          />

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
              Frais d'acquisition
            </label>
            <Toggle
              options={["Exclure (prix net)", "Inclure 7,5 %"]}
              checked={inclureFrais}
              onChange={setInclureFrais}
            />
            <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-secondary)" }}>
              {inclureFrais && prixAchat ? `Frais notaire estimés : ${fmtEur(prixAchat * 0.075)}` : "Les frais notaire font partie du prix de revient"}
            </div>
          </div>

          <NumInput
            id="prix-vente"
            label="Prix de vente"
            value={prixVente}
            onChange={setPrixVente}
            unit="€"
            min={0}
            max={10_000_000}
            hint="Prix de vente hors frais d'agence"
          />

          {/* Barre récapitulative */}
          {res && res.pvBrute > 0 && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 20px", display: "flex", flexWrap: "wrap", marginTop: 4 }}>
              {[
                { l: "Plus-value brute", v: fmtEur(res.pvBrute), primary: true },
                { l: "Durée de détention", v: `${res.duree} ans` },
              ].map((item, i) => (
                <div key={i} style={{ flex: 1, minWidth: 100, padding: "4px 16px", borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text-secondary)", marginBottom: 4 }}>{item.l}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 21, fontWeight: 700, color: item.primary ? "var(--primary)" : "var(--text)" }}>{item.v}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Résultats */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20, boxShadow: "var(--card-shadow)" }} ref={resultsRef}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>Impôt et gain net</h2>

          <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'Hanken Grotesk', sans-serif", marginBottom: 6 }}>Impôt total (IR + PS)</div>
            {!hasResult ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>Saisissez vos paramètres pour voir votre estimation.</p>
            ) : (
              <>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 42, color: "var(--primary)", lineHeight: 1 }}
                  aria-label={`${Math.round(res.totalImpot)} euros d'impôt`}>
                  {totalImpotAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                  taux global : <strong>{(res.totalImpot / res.pvBrute * 100).toFixed(1)} %</strong> de la plus-value
                </div>
              </>
            )}
          </div>

          {hasResult && (
            <>
              {/* Chips */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 20 }}>
                <Chip label="IR (19 %)" value={fmtEur(res.impotIR)} accent />
                <Chip label="PS (17,2 %)" value={fmtEur(res.impotPS)} accent />
                <Chip label="Plus-value brute" value={fmtEur(res.pvBrute)} />
                <Chip label="Gain net vendeur" value={fmtEur(res.gainNet)} />
              </div>

              {/* Abattements par durée */}
              <AccordionSection title="Abattements pour durée de détention" subtitle={`Votre bien : ${res.duree} ans`}>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  <div style={{ background: "var(--surface)", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)" }}>
                          <th style={{ textAlign: "left", padding: 8, color: "var(--text-secondary)", fontWeight: 600 }}>Durée</th>
                          <th style={{ textAlign: "right", padding: 8, color: "var(--text-secondary)", fontWeight: 600 }}>Abatt. IR</th>
                          <th style={{ textAlign: "right", padding: 8, color: "var(--text-secondary)", fontWeight: 600 }}>Abatt. PS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { dur: "< 6 ans", ir: "0 %", ps: "0 %" },
                          { dur: "6 ans", ir: "6 %", ps: "1,65 %" },
                          { dur: "10 ans", ir: "30 %", ps: "8,25 %" },
                          { dur: "15 ans", ir: "60 %", ps: "16,5 %" },
                          { dur: "22 ans", ir: "96 %", ps: "27 %" },
                          { dur: "26 ans", ir: "100 %", ps: "63 %" },
                          { dur: "30 ans", ir: "100 %", ps: "100 %" },
                        ].map((row, i) => {
                          const highlight = (res.duree >= parseInt(row.dur)) && (i === 0 || res.duree < parseInt([
                            { dur: "< 6 ans" }, { dur: "6 ans" }, { dur: "10 ans" }, { dur: "15 ans" }, { dur: "22 ans" }, { dur: "26 ans" }, { dur: "30 ans" }
                          ][i + 1]?.dur || 999));
                          return (
                            <tr key={i} style={{
                              background: highlight ? "rgba(43,92,230,0.08)" : "transparent",
                              borderBottom: "1px solid var(--border)"
                            }}>
                              <td style={{ padding: 8, color: highlight ? "var(--primary)" : "var(--text)" }}>{row.dur}</td>
                              <td style={{ textAlign: "right", padding: 8, color: highlight ? "var(--primary)" : "var(--text)" }}>{row.ir}</td>
                              <td style={{ textAlign: "right", padding: 8, color: highlight ? "var(--primary)" : "var(--text)" }}>{row.ps}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text-secondary)", marginBottom: 6 }}>Votre abattement IR</div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--primary)" }}>{res.abattIR.toFixed(0)} %</div>
                      <div style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 4 }}>Gain : {fmtEur(res.pvBrute * res.abattIR / 100)}</div>
                    </div>
                    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text-secondary)", marginBottom: 6 }}>Votre abattement PS</div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--primary)" }}>{res.abattPS.toFixed(1)} %</div>
                      <div style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 4 }}>Gain : {fmtEur(res.pvBrute * res.abattPS / 100)}</div>
                    </div>
                  </div>

                  <div style={{ paddingTop: 12, borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 8 }}>
                      <strong style={{ color: "var(--text)" }}>Base IR :</strong> {fmtEur(res.pvBrute)} × (1 − {res.abattIR.toFixed(0)}%) = {fmtEur(res.baseIR)}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong style={{ color: "var(--text)" }}>Base PS :</strong> {fmtEur(res.pvBrute)} × (1 − {res.abattPS.toFixed(1)}%) = {fmtEur(res.basePS)}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong style={{ color: "var(--text)" }}>IR :</strong> {fmtEur(res.baseIR)} × 19% = {fmtEur(res.impotIR)}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong style={{ color: "var(--text)" }}>PS :</strong> {fmtEur(res.basePS)} × 17,2% = {fmtEur(res.impotPS)}
                    </div>
                    <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px solid var(--border)", color: "var(--text)" }}>
                      <strong>Gain net vendeur :</strong> {fmtEur(prixVente)} − {fmtEur(prixAchat)} − {fmtEur(res.totalImpot)} = {fmtEur(res.gainNet)}
                    </div>
                  </div>
                </div>
              </AccordionSection>

              <div role="note" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16 }}>
                ⚠️ <strong>Résidence principale exonérée.</strong> Hors surtaxe (plus-value {">"}50 k€) et cas particuliers (propriété démembrée, droits d'enregistrement, frais de vente agence). Votre notaire établira le calcul exact à partir du compromis de vente.
              </div>

        {/* Graphique abattements */}
        {isValid && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 24, boxShadow: "var(--card-shadow)" }}>
            <div style={{ fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text-secondary)", marginBottom: 12 }}>
              Taux d'imposition selon la durée de détention
            </div>
            <ZoomableChart caption="Abattements par durée de détention">
              <LineAreaChart
                series={[
                  { id: "ir", label: "IR effectif", points: abattChart.map(p => ({ x: p.x, y: p.ir })), color: "#f59e0b", fillColor: "rgba(245,158,11,0.10)" },
                  { id: "ps", label: "Prél. sociaux effectifs", points: abattChart.map(p => ({ x: p.x, y: p.ps })), color: "#6eb5d4", fillColor: "rgba(110,181,212,0.08)", dashed: true },
                ]}
                xFmt={(v) => `${v} ans`}
                yFmt={(v) => `${v} %`}
                annotations={res?.duree ? [{ x: res.duree, label: `Année ${res.duree}`, color: "var(--primary)", dashed: true }] : []}
                aria="Taux d'imposition selon la durée de détention"
              />
            </ZoomableChart>
          </div>
        )}
              <ShareBar
                params={{ prixAchat, anneeAchat, anneeVente, travaux, prixVente }}
                resultsRef={resultsRef}
                report={report}
                name="plus-value-immobiliere"
              />
              <AffiliateCTA type="assurance-vie" />
              <ScenarioCompare
                name="plus-value-immobiliere"
                base={{ anneeVente, prixVente }}
                fields={[
                  { key: "anneeVente", label: "Année de vente", type: "num", unit: "", min: 1990, max: 2100 },
                  { key: "prixVente", label: "Prix de vente", type: "num", unit: "€", min: 0, max: 10000000, kind: "eur" },
                ]}
                compute={(v) => calcPlusValue({ prixAchat, anneeAchat, anneeVente, travaux, inclureFrais, prixVente, ...v })}
                metrics={[
                  { label: "Impôt total", get: r => r.totalImpot, fmt: fmtEur, higherBetter: false },
                  { label: "Gain net", get: r => r.gainNet, fmt: fmtEur, higherBetter: true },
                ]}
              />
            </>
          )}
        </div>

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>

        {/* À propos */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos de ce simulateur</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>Le calcul de la plus-value imposable</h3>
            <p style={{ marginBottom: 16 }}>La plus-value immobilière brute est la différence entre le prix de cession (net vendeur) et le prix d'acquisition majoré des frais d'acquisition et des travaux. La plus-value nette imposable est obtenue après application des abattements pour durée de détention. Elle est soumise à l'impôt sur le revenu au taux forfaitaire de 19 % et aux prélèvements sociaux au taux de 17,2 %, soit une imposition globale de 36,2 % avant abattements.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Les abattements pour durée de détention</h3>
            <p style={{ marginBottom: 16 }}>Les abattements réduisent progressivement la plus-value imposable au-delà de la 5ème année. Pour l'impôt sur le revenu, l'abattement est de 6 % par an de la 6ème à la 21ème année, puis 4 % la 22ème — soit une exonération totale à partir de 22 ans de détention. Pour les prélèvements sociaux, l'abattement est de 1,65 % par an de la 6ème à la 21ème année, puis de 9 % par an jusqu'à la 30ème — exonération totale à 30 ans.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Résidence principale et autres exonérations</h3>
            <p>La plus-value réalisée sur la cession de votre résidence principale est totalement exonérée d'impôt et de prélèvements sociaux, sans condition de durée de détention. D'autres exonérations existent : cession dont le prix est inférieur à 15 000 €, première cession d'une résidence secondaire sous conditions, expropriation, et cessions par des personnes âgées ou invalides sous conditions de revenus.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Questions fréquentes — Plus-value</h2>
          {FAQ.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          <p style={{ paddingTop: 20, fontSize: 12, color: "var(--text-secondary)" }}>
            Conseil : consultez votre notaire ou un expert fiscal pour un calcul détaillé.
          </p>
        </div>

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>
      </div>
      <FaqSection items={FAQ} />
      <Footer />
    </div>
  );
}

