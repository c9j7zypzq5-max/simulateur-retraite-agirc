import { useState, useMemo } from "react";
import { track } from "@vercel/analytics";
import { useTheme } from "../../hooks/useTheme.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import ScenarioCompare from "../../components/ScenarioCompare.jsx";
import { readShareParams } from "../../hooks/useShareableUrl.js";
import SimIcon from "../../data/simIcons.jsx";
import {
  NumInput, AccordionSection,
  Chip, useAnimatedNumber, fmt,
  SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";
import { FAQS } from '../../data/faqs.js';

const fmtCad = n => fmt(n) + " $";

// ─── Paliers d'imposition Québec et fédéral, année d'imposition 2026 ───────
// Source : paliers officiels indexés pour 2026 (Retraite Québec / Agence du
// revenu du Canada). Le taux fédéral le plus bas est de 14 % depuis la
// « baisse d'impôt pour la classe moyenne » (loi C-4, sanctionnée en mars
// 2026), qui a réduit ce taux de 15 % à 14 % à compter du 1er juillet 2025 —
// 2026 est la première année civile complète où il s'applique en entier.
const QC_BAREME_2026 = [
  { min: 0,       max: 54_345,  taux: 0.14 },
  { min: 54_345,  max: 108_680, taux: 0.19 },
  { min: 108_680, max: 132_245, taux: 0.24 },
  { min: 132_245, max: Infinity, taux: 0.2575 },
];

const FED_BAREME_2026 = [
  { min: 0,       max: 58_523,  taux: 0.14 },
  { min: 58_523,  max: 117_045, taux: 0.205 },
  { min: 117_045, max: 181_440, taux: 0.26 },
  { min: 181_440, max: 258_482, taux: 0.29 },
  { min: 258_482, max: Infinity, taux: 0.33 },
];

// Montants personnels de base 2026 (génèrent un crédit non remboursable au
// taux le plus bas de chaque palier — 14 % fédéral et 14 % québécois).
const BPA_QC_2026 = 18_952;
const BPA_FED_2026 = 16_452;
const TAUX_CREDIT_BASE = 0.14;

// Abattement du Québec : réduction de 16,5 % de l'impôt fédéral autrement
// payable par les résidents du Québec (compensation historique du transfert
// de points d'impôt des années 1960).
const ABATTEMENT_QC = 0.165;

function calcBracketsRaw(income, bareme) {
  let tax = 0;
  for (const { min, max, taux } of bareme) {
    if (income <= min) break;
    tax += (Math.min(income, max) - min) * taux;
  }
  return tax;
}

function tmiFor(income, bareme) {
  let tmi = 0;
  for (const { min, taux } of bareme) {
    if (income > min) tmi = taux;
  }
  return tmi;
}

function calcImpotQC({ revenu }) {
  const impotQcBrut = calcBracketsRaw(revenu, QC_BAREME_2026);
  const creditQc = BPA_QC_2026 * TAUX_CREDIT_BASE;
  const impotQc = Math.max(0, impotQcBrut - creditQc);

  const impotFedBrut = calcBracketsRaw(revenu, FED_BAREME_2026);
  const creditFed = BPA_FED_2026 * TAUX_CREDIT_BASE;
  const impotFedApresCredit = Math.max(0, impotFedBrut - creditFed);
  const abattement = impotFedApresCredit * ABATTEMENT_QC;
  const impotFed = impotFedApresCredit - abattement;

  const impotTotal = impotQc + impotFed;
  const tmiQc = tmiFor(revenu, QC_BAREME_2026);
  const tmiFed = tmiFor(revenu, FED_BAREME_2026);
  const tmiCombine = tmiQc + tmiFed * (1 - ABATTEMENT_QC);
  const tauxMoyen = revenu > 0 ? (impotTotal / revenu) * 100 : 0;

  return { impotQc, impotFed, impotFedBrut, abattement, impotTotal, tmiQc, tmiFed, tmiCombine, tauxMoyen };
}

const DEFAULT = { revenu: 55_000 };

function fromParams(p) {
  if (!p) return { ...DEFAULT };
  return { revenu: Number(p.revenu) || DEFAULT.revenu };
}

const FAQ = FAQS['/simulateurs/impot-revenu-qc'];

export default function ImpotRevenuQC() {
  const [theme, setTheme] = useTheme();
  const init = useMemo(() => fromParams(readShareParams()), []);
  const [revenu, setRevenu] = useState(init.revenu);

  const vals = { revenu };
  const res = useMemo(() => calcImpotQC(vals), [revenu]); // eslint-disable-line react-hooks/exhaustive-deps

  usePageMeta(
    "Simulateur impôt sur le revenu Québec 2026 — provincial + fédéral | simfinly.com",
    "Calculez votre impôt québécois combiné (provincial et fédéral, avec l'abattement de 16,5 %) selon le barème progressif 2026."
  );

  const animImpot = useAnimatedNumber(res.impotTotal);
  const animTaux = useAnimatedNumber(res.tauxMoyen);

  const REPORT_PARAMS = {
    name: "Mon impôt québécois estimé",
    cat: "Impôts",
    highlight: { label: "Impôt total estimé", value: fmtCad(res.impotTotal) },
    sections: [
      { title: "Impôt provincial (Québec)", value: fmtCad(res.impotQc) },
      { title: "Impôt fédéral (après abattement)", value: fmtCad(res.impotFed) },
      { title: "Taux marginal combiné", value: `${(res.tmiCombine * 100).toFixed(1)} %` },
    ],
  };

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Simulateur impôt sur le revenu Québec 2026", url: "https://www.simfinly.com/qc/simulateurs/impot-revenu-qc", description: "Calculez votre impôt québécois combiné (provincial et fédéral) selon le barème progressif 2026.", applicationCategory: "FinanceApplication", inLanguage: "fr-CA" }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/impot-revenu" size={34} />}
          title="Impôt sur le revenu"
          subtitle="Québec · Barème 2026 (provincial + fédéral)"
          desc="Estimez votre impôt québécois combiné : paliers provinciaux, paliers fédéraux et abattement du Québec de 16,5 % sur l'impôt fédéral."
          badge="🇨🇦 Québec · Fiscalité"
        />

        {/* Note informationnelle */}
        <div style={{ background: "rgba(43,92,230,0.06)", border: "1px solid rgba(43,92,230,0.18)", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "var(--text-secondary)" }}>
          💡 Entrez votre <strong>revenu imposable annuel</strong> (revenu net après déductions, ex. cotisations REER).
        </div>

        <AdUnit slot="ipp-qc-top" style={{ marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>
          {/* ─── Formulaire ─── */}
          <div style={{ ...card }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 22 }}>Votre situation</h2>

            <NumInput
              id="revenu-qc"
              label="Revenu imposable annuel"
              value={revenu}
              onChange={v => { setRevenu(v); track("ipp_qc_revenu"); }}
              unit="$"
              min={0}
              max={500_000}
              tooltip="Revenu net imposable annuel, après déductions (ex. REER)"
            />
          </div>

          {/* ─── Résultats ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Hero */}
            <div style={{ ...card, background: "rgba(43,92,230,0.05)", border: "1px solid rgba(43,92,230,0.2)", textAlign: "center", padding: "28px 22px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                Impôt total estimé (provincial + fédéral)
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "var(--primary)" }}>
                {fmtCad(animImpot)}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
                taux moyen {animTaux.toFixed(1)} % · TMI combiné {(res.tmiCombine * 100).toFixed(1)} %
              </div>
            </div>

            {/* Chips */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Chip label="Impôt provincial (Québec)" value={fmtCad(res.impotQc)} />
              <Chip label="Impôt fédéral" value={fmtCad(res.impotFed)} />
              <Chip label="Abattement du Québec" value={`− ${fmtCad(res.abattement)}`} />
              <Chip label="Revenu net d'impôt" value={fmtCad(revenu - res.impotTotal)} />
            </div>

            {/* Détail */}
            <AccordionSection title="Détail du calcul">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {[
                    ["Revenu imposable déclaré", fmtCad(revenu)],
                    ["Impôt québécois (barème)", fmtCad(res.impotQc)],
                    ["Impôt fédéral avant abattement", fmtCad(res.impotFedBrut)],
                    ["Abattement du Québec (16,5 %)", `− ${fmtCad(res.abattement)}`],
                    ["Impôt fédéral net", fmtCad(res.impotFed)],
                    ["Impôt total", fmtCad(res.impotTotal)],
                  ].map(([label, val], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "8px 0", color: "var(--text-secondary)" }}>{label}</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AccordionSection>

            {/* Barème */}
            <div style={{ ...card, padding: "16px 18px" }}>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10, fontWeight: 600 }}>Palier provincial (Québec) — 2026</div>
              {QC_BAREME_2026.map(({ min, max, taux }) => {
                const active = res.tmiQc === taux && revenu > 0;
                return (
                  <div key={taux} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 8px", borderRadius: 6, background: active ? "rgba(43,92,230,0.10)" : "transparent", color: active ? "var(--primary)" : "var(--text-secondary)", fontWeight: active ? 700 : 400 }}>
                    <span>{fmt(min)} → {max === Infinity ? "∞" : fmt(max)} $</span>
                    <span>{(taux * 100).toFixed(2).replace(/\.?0+$/, "")} %</span>
                  </div>
                );
              })}
              <div style={{ fontSize: 12, color: "var(--text-secondary)", margin: "14px 0 10px", fontWeight: 600 }}>Palier fédéral — 2026</div>
              {FED_BAREME_2026.map(({ min, max, taux }) => {
                const active = res.tmiFed === taux && revenu > 0;
                return (
                  <div key={taux} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 8px", borderRadius: 6, background: active ? "rgba(43,92,230,0.10)" : "transparent", color: active ? "var(--primary)" : "var(--text-secondary)", fontWeight: active ? 700 : 400 }}>
                    <span>{fmt(min)} → {max === Infinity ? "∞" : fmt(max)} $</span>
                    <span>{(taux * 100).toFixed(1)} %</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Comparaison de scénarios */}
        <div style={{ marginTop: 28 }}>
          <ScenarioCompare
            name="ipp-qc"
            title="Comparer deux situations fiscales"
            cta="📊 Comparer avec un autre revenu"
            fields={[
              { key: "revenu", label: "Revenu imposable annuel", type: "num", unit: "$", min: 0, max: 500_000, kind: "eur" },
            ]}
            base={vals}
            compute={v => calcImpotQC(v)}
            moneyFmt={fmtCad}
            metrics={[
              { label: "Impôt total", get: r => r.impotTotal, fmt: fmtCad, higherBetter: false },
              { label: "Taux moyen", get: r => r.tauxMoyen, fmt: v => `${v.toFixed(1)} %`, higherBetter: false },
            ]}
          />
        </div>

        <AdUnit slot="ipp-qc-mid" style={{ margin: "24px 0" }} />

        <AccordionSection title="Questions fréquentes" defaultOpen>
          <FaqSection items={FAQ} />
        </AccordionSection>

        <AccordionSection title="À propos de l'impôt sur le revenu au Québec" defaultOpen>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            Le Québec est la seule province canadienne à percevoir son propre impôt sur le revenu de façon pleinement autonome : un résident québécois produit deux déclarations distinctes chaque année, une provinciale (Revenu Québec) et une fédérale (Agence du revenu du Canada). Chaque palier applique son propre barème progressif — 14 % à 25,75 % au provincial, 14 % à 33 % au fédéral en 2026.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            En compensation du transfert de points d'impôt survenu dans les années 1960 lorsque le Québec a mis en place son propre régime, les résidents du Québec bénéficient d'un <strong>abattement de 16,5 %</strong> sur l'impôt fédéral autrement payable. <strong>Ce calcul est une estimation indicative</strong> qui ne modélise que le montant personnel de base : elle ne prend pas en compte les autres crédits d'impôt (REER, cotisations RRQ/assurance-emploi, crédits pour personnes vivant seules, etc.). Pour votre situation réelle, consultez Revenu Québec ou un fiscaliste.
          </p>
        </AccordionSection>

        <ShareBar params={vals} resultsRef={null} name={REPORT_PARAMS.name} report={REPORT_PARAMS} />
      </div>
      <Footer />
    </div>
  );
}
