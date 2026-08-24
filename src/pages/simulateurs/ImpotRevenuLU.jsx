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
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import SimIcon from "../../data/simIcons.jsx";
import {
  NumInput, AccordionSection,
  Chip, useAnimatedNumber, fmt, fmtEur,
  SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";
import { FAQS } from '../../data/faqs.js';

// ─── Barème de l'impôt sur le revenu luxembourgeois (classe 1, en vigueur
// depuis l'année d'imposition 2025) — 23 tranches de 0 % à 42 %.
// Source : Administration des contributions directes (impotsdirects.public.lu).
const BAREME_LU = [
  { min: 0,       max: 13_230,  taux: 0.00 },
  { min: 13_230,  max: 15_435,  taux: 0.08 },
  { min: 15_435,  max: 17_640,  taux: 0.09 },
  { min: 17_640,  max: 19_845,  taux: 0.10 },
  { min: 19_845,  max: 22_050,  taux: 0.11 },
  { min: 22_050,  max: 24_255,  taux: 0.12 },
  { min: 24_255,  max: 26_550,  taux: 0.14 },
  { min: 26_550,  max: 28_845,  taux: 0.16 },
  { min: 28_845,  max: 31_140,  taux: 0.18 },
  { min: 31_140,  max: 33_435,  taux: 0.20 },
  { min: 33_435,  max: 35_730,  taux: 0.22 },
  { min: 35_730,  max: 38_025,  taux: 0.24 },
  { min: 38_025,  max: 40_320,  taux: 0.26 },
  { min: 40_320,  max: 42_615,  taux: 0.28 },
  { min: 42_615,  max: 44_910,  taux: 0.30 },
  { min: 44_910,  max: 47_205,  taux: 0.32 },
  { min: 47_205,  max: 49_500,  taux: 0.34 },
  { min: 49_500,  max: 51_795,  taux: 0.36 },
  { min: 51_795,  max: 54_090,  taux: 0.38 },
  { min: 54_090,  max: 117_450, taux: 0.39 },
  { min: 117_450, max: 176_160, taux: 0.40 },
  { min: 176_160, max: 234_870, taux: 0.41 },
  { min: 234_870, max: Infinity, taux: 0.42 },
];

// Contribution au fonds pour l'emploi : 7 %, porté à 9 % au-delà d'un seuil
// qui dépend de la classe d'impôt.
const SEUIL_FONDS_EMPLOI_C2 = 300_000;
const SEUIL_FONDS_EMPLOI_C1 = 150_000;

function calcBracketsRaw(income) {
  let tax = 0;
  for (const { min, max, taux } of BAREME_LU) {
    if (income <= min) break;
    tax += (Math.min(income, max) - min) * taux;
  }
  return tax;
}

function tmiFor(income) {
  let tmi = 0;
  for (const { min, taux } of BAREME_LU) {
    if (income > min) tmi = taux;
  }
  return tmi;
}

function calcImpotLU({ revenu, classe }) {
  // Classe 2 (couples mariés/pacsés) : quotient conjugal (splitting) — le
  // revenu est divisé par 2, le barème appliqué, puis le résultat doublé.
  // Classe 1a (parent isolé, veuf/veuve, 65 ans+) : depuis la réforme 2025 le
  // barème a été rapproché de la classe 2, mais ce simulateur applique par
  // prudence le barème de la classe 1 pour la 1a (voir avertissement) —
  // la classe 1a bénéficie en pratique de crédits d'impôt complémentaires
  // (crédit d'impôt monoparental notamment) non modélisés ici.
  const base = classe === '2' ? revenu / 2 : revenu;
  const impotBase = calcBracketsRaw(base);
  const impotBareme = classe === '2' ? impotBase * 2 : impotBase;

  const seuil = classe === '2' ? SEUIL_FONDS_EMPLOI_C2 : SEUIL_FONDS_EMPLOI_C1;
  const tauxFondsEmploi = revenu > seuil ? 0.09 : 0.07;
  const fondsEmploi = impotBareme * tauxFondsEmploi;

  const impotTotal = impotBareme + fondsEmploi;
  const tmi = tmiFor(base);
  const tauxMoyen = revenu > 0 ? (impotTotal / revenu) * 100 : 0;

  return { impotBareme, fondsEmploi, tauxFondsEmploi, impotTotal, tmi, tauxMoyen, base };
}

const CLASSE_OPTIONS = [
  { value: "1",  label: "Classe 1", hint: "Célibataire, divorcé(e)" },
  { value: "1a", label: "Classe 1a", hint: "Parent isolé, veuf(ve), 65 ans+" },
  { value: "2",  label: "Classe 2", hint: "Marié(e) / pacsé(e)" },
];

const DEFAULT = { revenu: 55_000, classe: "1" };

function fromParams(p) {
  if (!p) return { ...DEFAULT };
  return {
    revenu: Number(p.r) || DEFAULT.revenu,
    classe: p.c || DEFAULT.classe,
  };
}
function toParams(v) {
  return { r: v.revenu, c: v.classe };
}

const FAQ = FAQS['/simulateurs/impot-revenu-lu'];

export default function ImpotRevenuLU() {
  const [theme, setTheme] = useTheme();
  const init = useMemo(() => fromParams(readShareParams()), []);
  const [revenu, setRevenu] = useState(init.revenu);
  const [classe, setClasse] = useState(init.classe);

  const vals = { revenu, classe };
  const res = useMemo(() => calcImpotLU(vals), [revenu, classe]); // eslint-disable-line react-hooks/exhaustive-deps
  const shareUrl = buildShareUrl(toParams(vals));

  usePageMeta(
    "Simulateur impôt sur le revenu Luxembourg 2026 — classes 1, 1a, 2 | simfinly.com",
    "Calculez votre impôt luxembourgeois selon le barème progressif à 23 tranches, votre classe d'impôt et la contribution au fonds pour l'emploi."
  );

  const animImpot = useAnimatedNumber(res.impotTotal);
  const animTaux = useAnimatedNumber(res.tauxMoyen);

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Simulateur impôt sur le revenu Luxembourg 2026", url: "https://www.simfinly.com/lu/simulateurs/impot-revenu-lu", description: "Calculez votre impôt luxembourgeois selon le barème progressif 2026 et votre classe d'impôt.", applicationCategory: "FinanceApplication", inLanguage: "fr-LU" }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/impot-revenu" size={34} />}
          title="Impôt sur le revenu"
          subtitle="Luxembourg · Barème 2026 (classes 1, 1a, 2)"
          desc="Estimez votre impôt luxembourgeois selon le barème progressif à 23 tranches (0–42 %), votre classe d'impôt et la contribution au fonds pour l'emploi."
          badge="🇱🇺 Luxembourg · Fiscalité"
        />

        {/* Note informationnelle */}
        <div style={{ background: "rgba(43,92,230,0.06)", border: "1px solid rgba(43,92,230,0.18)", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "var(--text-secondary)" }}>
          💡 Entrez votre <strong>revenu imposable annuel</strong> (revenu net après déductions et abattements standards).
        </div>

        <AdUnit placement="ipp-lu-top" style={{ marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>
          {/* ─── Formulaire ─── */}
          <div style={{ ...card }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 22 }}>Votre situation</h2>

            <NumInput
              id="revenu-lu"
              label="Revenu imposable annuel"
              value={revenu}
              onChange={v => { setRevenu(v); track("ipp_lu_revenu"); }}
              unit="€"
              min={0}
              max={500_000}
              tooltip="Revenu net imposable annuel, après déductions standards"
            />

            {/* Classe d'impôt */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Classe d'impôt</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {CLASSE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setClasse(opt.value)}
                    style={{
                      padding: "10px 14px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                      background: classe === opt.value ? "rgba(43,92,230,0.10)" : "transparent",
                      border: classe === opt.value ? "1.5px solid var(--primary)" : "1.5px solid var(--border)",
                      color: classe === opt.value ? "var(--primary)" : "var(--text)",
                      fontSize: 13, fontWeight: classe === opt.value ? 600 : 400,
                      fontFamily: "'Hanken Grotesk', sans-serif",
                    }}
                  >
                    {opt.label}
                    <span style={{ marginLeft: 8, fontSize: 11, color: "var(--text-secondary)" }}>{opt.hint}</span>
                  </button>
                ))}
              </div>
              {classe === '1a' && (
                <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 8, lineHeight: 1.5 }}>
                  ⚠️ La classe 1a bénéficie de crédits d'impôt complémentaires (crédit d'impôt monoparental notamment) non pris en compte ici — ce calcul applique par prudence le barème de la classe 1.
                </div>
              )}
              {classe === '2' && (
                <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 8 }}>
                  Quotient conjugal appliqué : revenu divisé par 2, barème appliqué, puis doublé.
                </div>
              )}
            </div>
          </div>

          {/* ─── Résultats ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Hero */}
            <div style={{ ...card, background: "rgba(43,92,230,0.05)", border: "1px solid rgba(43,92,230,0.2)", textAlign: "center", padding: "28px 22px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                Impôt total (barème + fonds pour l'emploi)
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "var(--primary)" }}>
                {fmtEur(animImpot)}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
                taux moyen {animTaux.toFixed(1)} % · TMI {(res.tmi * 100).toFixed(0)} %
              </div>
            </div>

            {/* Chips */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Chip label="Impôt (barème)" value={fmtEur(res.impotBareme)} />
              <Chip label="Fonds pour l'emploi" value={fmtEur(res.fondsEmploi)} />
              <Chip label={`Taux fonds emploi`} value={`${(res.tauxFondsEmploi * 100).toFixed(0)} %`} />
              <Chip label="Revenu net d'impôt" value={fmtEur(revenu - res.impotTotal)} />
            </div>

            {/* Détail */}
            <AccordionSection title="Détail du calcul">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {[
                    ["Revenu imposable déclaré", fmtEur(revenu)],
                    classe === '2' ? ["Base après splitting (÷2)", fmtEur(res.base)] : null,
                    ["Impôt (barème progressif)", fmtEur(res.impotBareme)],
                    [`Fonds pour l'emploi (${(res.tauxFondsEmploi * 100).toFixed(0)}%)`, fmtEur(res.fondsEmploi)],
                    ["Impôt total", fmtEur(res.impotTotal)],
                  ].filter(Boolean).map(([label, val], i) => (
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
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10, fontWeight: 600 }}>Barème classe 1 — 2026</div>
              {BAREME_LU.map(({ min, max, taux }) => {
                const active = res.tmi === taux && res.base > 0;
                return (
                  <div key={taux} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 8px", borderRadius: 6, background: active ? "rgba(43,92,230,0.10)" : "transparent", color: active ? "var(--primary)" : "var(--text-secondary)", fontWeight: active ? 700 : 400 }}>
                    <span>{fmt(min)} → {max === Infinity ? "∞" : fmt(max)} €</span>
                    <span>{(taux * 100).toFixed(0)} %</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Comparaison de scénarios */}
        <div style={{ marginTop: 28 }}>
          <ScenarioCompare
            name="ipp-lu"
            title="Comparer deux situations fiscales"
            cta="📊 Comparer avec une autre situation (ex : autre classe d'impôt)"
            fields={[
              { key: "revenu", label: "Revenu imposable annuel", type: "num", unit: "€", min: 0, max: 500_000, kind: "eur" },
            ]}
            base={vals}
            compute={v => calcImpotLU(v)}
            metrics={[
              { label: "Impôt total", get: r => r.impotTotal, fmt: fmtEur, higherBetter: false },
              { label: "Taux moyen", get: r => r.tauxMoyen, fmt: v => `${v.toFixed(1)} %`, higherBetter: false },
            ]}
          />
        </div>

        <AdUnit placement="ipp-lu-mid" style={{ margin: "24px 0" }} />

        <AccordionSection title="Questions fréquentes" defaultOpen>
          <FaqSection items={FAQ} />
        </AccordionSection>

        <AccordionSection title="À propos de l'impôt sur le revenu luxembourgeois" defaultOpen>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            L'impôt sur le revenu luxembourgeois suit un barème progressif à 23 tranches, de 0 % (jusqu'à 13 230 €) à 42 % (au-delà de 234 870 €). Le montant final dépend de la <strong>classe d'impôt</strong> : la classe 1 (célibataires), la classe 1a (parents isolés, veufs/veuves, 65 ans et plus) et la classe 2 (couples mariés ou pacsés, avec quotient conjugal). S'ajoute systématiquement une <strong>contribution au fonds pour l'emploi</strong> de 7 %, portée à 9 % au-delà de 150 000 € (classes 1/1a) ou 300 000 € (classe 2) de revenu imposable.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            Pour les <strong>frontaliers</strong>, l'imposition dépend de la convention fiscale entre le Luxembourg et le pays de résidence. <strong>Ce calcul est une estimation indicative</strong> qui ne prend pas en compte les crédits d'impôt (crédit d'impôt monoparental, CIS...) ni les déductions spécifiques (frais d'obtention, dépenses spéciales). Pour votre situation réelle, consultez l'Administration des contributions directes ou un fiduciaire.
          </p>
        </AccordionSection>

        <ShareBar url={shareUrl} title="Mon impôt luxembourgeois estimé" />
      </div>
      <Footer />
    </div>
  );
}
