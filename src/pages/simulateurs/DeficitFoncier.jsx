import { useState, useMemo } from "react";
import { PS_CAPITAL } from "../../config/constants.js";
import { track } from "@vercel/analytics";
import { useTheme } from "../../hooks/useTheme.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import { readShareParams } from "../../hooks/useShareableUrl.js";
import {
  NumInput, AccordionSection,
  Chip, useAnimatedNumber, fmtEur,
  SimulateurHeader, FaqSection, Toggle,
} from "../../components/ui.jsx";
import SimIcon from "../../data/simIcons.jsx";
import { FAQS } from '../../data/faqs.js';

// ─── Constantes 2025 ──────────────────────────────────────────────────────────
const PS = PS_CAPITAL;
const PLAFOND_NORMAL  = 10_700;
const PLAFOND_ELEVE   = 21_400; // Régime "louer abordable" (anciennement Loc'Avantages)

const TMI_OPTIONS = [0, 11, 30, 41, 45];

// ─── Calculs ──────────────────────────────────────────────────────────────────
function calcDeficitFoncier({ loyersBruts, interetsEmprunt, taxeFonciere, chargesGestion, travaux, tmi, plafondEleve }) {
  const tmiRate = tmi / 100;
  const plafond = plafondEleve ? PLAFOND_ELEVE : PLAFOND_NORMAL;

  // Charges hors travaux
  const chargesHorsTravaux = interetsEmprunt + taxeFonciere + chargesGestion;

  // Résultat foncier avant travaux
  const resultatAvantTravaux = loyersBruts - chargesHorsTravaux;

  // Résultat foncier brut (avec travaux)
  // Note : les intérêts d'emprunt ne peuvent pas créer de déficit foncier
  // (ils sont déductibles uniquement à hauteur des revenus fonciers)
  // Simplification : on applique la règle simplifiée du plafond 10 700 €
  const deficitBrut = resultatAvantTravaux - travaux;

  const estDeficit = deficitBrut < 0;

  // Si bénéfice
  let imposition = 0;
  let imputationRevenuGlobal = 0;
  let reportFoncier = 0;
  let economieFiscaleImmédiate = 0;
  let economieFiscaleTotale = 0;

  if (estDeficit) {
    const deficitAbs = Math.abs(deficitBrut);

    // Part imputable sur le revenu global (plafonnée)
    imputationRevenuGlobal = Math.min(deficitAbs, plafond);

    // Le reste est reporté sur les revenus fonciers des 10 années suivantes
    reportFoncier = Math.max(0, deficitAbs - plafond);

    // Économie fiscale immédiate : IR + prélèvements sociaux sur la part imputable
    economieFiscaleImmédiate = imputationRevenuGlobal * (tmiRate + PS);

    // Économie totale (en supposant que le report sera utilisé au même taux)
    economieFiscaleTotale = deficitAbs * (tmiRate + PS);
  } else {
    // Bénéfice foncier → imposition IR + prélèvements sociaux
    imposition = deficitBrut * (tmiRate + PS);
  }

  // Taux de rendement fiscal (économie / travaux investis)
  const rendementFiscalTravaux = travaux > 0 && estDeficit
    ? (economieFiscaleImmédiate / travaux) * 100
    : 0;

  return {
    chargesHorsTravaux,
    resultatAvantTravaux,
    deficitBrut,
    estDeficit,
    imputationRevenuGlobal,
    reportFoncier,
    economieFiscaleImmédiate,
    economieFiscaleTotale,
    imposition,
    rendementFiscalTravaux,
    plafond,
  };
}

// ─── Defaults & URL params ────────────────────────────────────────────────────
const DEFAULT = {
  loyersBruts:     12_000,
  interetsEmprunt:  5_000,
  taxeFonciere:     1_500,
  chargesGestion:     800,
  travaux:         20_000,
  tmi:                 30,
  plafondEleve:     false,
};

function fromParams(p) {
  if (!p) return DEFAULT;
  return {
    loyersBruts:     Number(p.lb)  || DEFAULT.loyersBruts,
    interetsEmprunt: Number(p.ie)  || DEFAULT.interetsEmprunt,
    taxeFonciere:    Number(p.tf)  || DEFAULT.taxeFonciere,
    chargesGestion:  Number(p.cg)  || DEFAULT.chargesGestion,
    travaux:         Number(p.tr)  || DEFAULT.travaux,
    tmi:             Number(p.tmi) || DEFAULT.tmi,
    plafondEleve:    p.pe === "1" || p.pe === true,
  };
}

function toParams(v) {
  return {
    lb: v.loyersBruts,
    ie: v.interetsEmprunt,
    tf: v.taxeFonciere,
    cg: v.chargesGestion,
    tr: v.travaux,
    tmi: v.tmi,
    pe: v.plafondEleve ? "1" : "0",
  };
}

const FAQ = FAQS['/simulateurs/deficit-foncier'];

// ─── Composant principal ──────────────────────────────────────────────────────
export default function DeficitFoncier() {
  const [theme, setTheme] = useTheme();
  const init = useMemo(() => fromParams(readShareParams()), []);

  const [loyersBruts,     setLoyersBruts]     = useState(init.loyersBruts);
  const [interetsEmprunt, setInteretsEmprunt] = useState(init.interetsEmprunt);
  const [taxeFonciere,    setTaxeFonciere]    = useState(init.taxeFonciere);
  const [chargesGestion,  setChargesGestion]  = useState(init.chargesGestion);
  const [travaux,         setTravaux]         = useState(init.travaux);
  const [tmi,             setTmi]             = useState(init.tmi);
  const [plafondEleve,    setPlafondEleve]    = useState(init.plafondEleve);

  const vals = { loyersBruts, interetsEmprunt, taxeFonciere, chargesGestion, travaux, tmi, plafondEleve };
  const res  = useMemo(() => calcDeficitFoncier(vals), [loyersBruts, interetsEmprunt, taxeFonciere, chargesGestion, travaux, tmi, plafondEleve]); // eslint-disable-line react-hooks/exhaustive-deps

  usePageMeta({
    title: "Simulateur Déficit Foncier 2026 — Économie d'impôt & Report | simfinly.com",
    description: "Calculez votre déficit foncier 2025 : part imputable sur le revenu global (plafond 10 700 €), report sur 10 ans, économie d'IR et de prélèvements sociaux. Régime réel.",
  });

  const animEconomie = useAnimatedNumber(res.economieFiscaleImmédiate);
  const animDeficit  = useAnimatedNumber(Math.abs(res.deficitBrut));

  const card = {
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "20px 22px",
  };

  const heroColor = res.estDeficit ? "#22c55e" : "#ef4444";
  const heroBg    = res.estDeficit
    ? "rgba(34,197,94,0.06)"
    : "rgba(239,68,68,0.06)";
  const heroBorder = res.estDeficit
    ? "rgba(34,197,94,0.25)"
    : "rgba(239,68,68,0.25)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Simulateur Déficit Foncier 2026",
        url: "https://www.simfinly.com/simulateurs/deficit-foncier",
        description: "Calculez votre déficit foncier en régime réel : imputation sur le revenu global, report sur 10 ans, économie d'IR et de prélèvements sociaux. Plafond 2025.",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        inLanguage: "fr-FR",
      }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/plus-value-immobiliere" size={34} />}
          title="Déficit foncier"
          subtitle="Régime réel · Simulation 2025"
          desc="Estimez votre déficit foncier déductible du revenu global (plafond 10 700 €), le report sur 10 ans et l'économie d'impôt réelle (IR + prélèvements sociaux 17,2 %)."
          badge="Immobilier · Fiscalité"
        />

        <AdUnit slot="deficit-foncier-top" style={{ marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>

          {/* ─── Formulaire ─── */}
          <div style={{ ...card }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 22 }}>Votre bien immobilier</h2>

            <NumInput
              id="loyers-bruts"
              label="Loyers bruts annuels"
              value={loyersBruts}
              onChange={v => { setLoyersBruts(v); track("deficit_foncier_loyers"); }}
              unit="€"
              min={0}
              max={500_000}
              hint="Total des loyers perçus sur l'année, sans déduction"
            />

            <NumInput
              id="interets-emprunt"
              label="Intérêts d'emprunt annuels"
              value={interetsEmprunt}
              onChange={v => { setInteretsEmprunt(v); track("deficit_foncier_interets"); }}
              unit="€"
              min={0}
              max={200_000}
              tooltip="Intérêts du crédit immobilier, hors capital remboursé"
            />

            <NumInput
              id="taxe-fonciere"
              label="Taxe foncière annuelle"
              value={taxeFonciere}
              onChange={setTaxeFonciere}
              unit="€"
              min={0}
              max={50_000}
            />

            <NumInput
              id="charges-gestion"
              label="Charges de gestion & assurances"
              value={chargesGestion}
              onChange={setChargesGestion}
              unit="€"
              min={0}
              max={100_000}
              hint="Frais d'agence, charges de copropriété non récupérables, assurance PNO…"
            />

            <NumInput
              id="travaux"
              label="Travaux déductibles"
              value={travaux}
              onChange={v => { setTravaux(v); track("deficit_foncier_travaux"); }}
              unit="€"
              min={0}
              max={1_000_000}
              tooltip="Réparation, entretien, amélioration — pas les travaux de construction"
            />

            {/* TMI */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
                Tranche marginale d'imposition (TMI)
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TMI_OPTIONS.map(t => (
                  <button
                    key={t}
                    onClick={() => { setTmi(t); track("deficit_foncier_tmi", { tmi: t }); }}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 10,
                      cursor: "pointer",
                      background: tmi === t ? "rgba(184,147,74,0.12)" : "transparent",
                      border: tmi === t ? "1.5px solid var(--border-gold)" : "1.5px solid var(--border)",
                      color: tmi === t ? "var(--gold)" : "var(--text)",
                      fontSize: 13,
                      fontWeight: tmi === t ? 700 : 400,
                      fontFamily: "'Space Grotesk', sans-serif",
                      transition: "all 0.15s",
                    }}
                  >
                    {t} %
                  </button>
                ))}
              </div>
            </div>

            {/* Plafond élevé */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Régime « Louer abordable »</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                  Plafond 21 400 € (convention Anah)
                </div>
              </div>
              <Toggle
                options={["Non", "Oui"]}
                checked={plafondEleve}
                onChange={v => { setPlafondEleve(v); track("deficit_foncier_plafond", { eleve: v }); }}
              />
            </div>
          </div>

          {/* ─── Résultats ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Hero */}
            <div style={{ ...card, background: heroBg, border: `1px solid ${heroBorder}`, textAlign: "center", padding: "28px 22px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                {res.estDeficit ? "Déficit foncier brut" : "Bénéfice foncier"}
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: heroColor }}>
                {res.estDeficit ? "−" : "+"}{fmtEur(Math.round(animDeficit))}
              </div>
              {res.estDeficit ? (
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
                  imputable jusqu'à {fmtEur(res.plafond)} sur votre revenu global
                </div>
              ) : (
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
                  imposé à {tmi} % d'IR + 17,2 % de PS
                </div>
              )}
              {res.estDeficit && res.economieFiscaleImmédiate > 0 && (
                <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.1)", borderRadius: 8, padding: "10px 14px", border: "1px solid rgba(34,197,94,0.2)" }}>
                  Économie fiscale immédiate : {fmtEur(Math.round(animEconomie))}
                </div>
              )}
              {!res.estDeficit && (
                <div style={{ marginTop: 12, fontSize: 13, color: "#ef4444", background: "rgba(239,68,68,0.08)", borderRadius: 8, padding: "10px 14px" }}>
                  Impôt à payer estimé : {fmtEur(Math.round(res.imposition))}
                </div>
              )}
            </div>

            {/* Chips */}
            {res.estDeficit && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Chip label={`Imputation revenu global (plaf. ${fmtEur(res.plafond)})`} value={fmtEur(Math.round(res.imputationRevenuGlobal))} accent />
                <Chip label="Report sur rev. fonciers (10 ans)" value={fmtEur(Math.round(res.reportFoncier))} />
                <Chip label="Économie IR immédiate" value={fmtEur(Math.round(res.imputationRevenuGlobal * tmi / 100))} />
                <Chip label="Économie PS immédiate" value={fmtEur(Math.round(res.imputationRevenuGlobal * PS))} />
              </div>
            )}
            {!res.estDeficit && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                <Chip label="Impôt total à payer (IR + PS)" value={fmtEur(Math.round(res.imposition))} />
              </div>
            )}

            {/* Détail calcul */}
            <AccordionSection title="Détail du calcul">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {[
                    ["Loyers bruts annuels", fmtEur(loyersBruts)],
                    ["− Intérêts d'emprunt", `− ${fmtEur(interetsEmprunt)}`],
                    ["− Taxe foncière", `− ${fmtEur(taxeFonciere)}`],
                    ["− Charges de gestion", `− ${fmtEur(chargesGestion)}`],
                    ["= Résultat avant travaux", fmtEur(res.resultatAvantTravaux)],
                    ["− Travaux déductibles", `− ${fmtEur(travaux)}`],
                    ["= Résultat foncier brut", (res.deficitBrut < 0 ? "−" : "+") + fmtEur(Math.abs(res.deficitBrut))],
                    res.estDeficit ? ["Plafond d'imputation revenu global", fmtEur(res.plafond)] : null,
                    res.estDeficit ? ["Part imputée sur revenu global", fmtEur(res.imputationRevenuGlobal)] : null,
                    res.estDeficit && res.reportFoncier > 0 ? ["Report sur revenus fonciers (10 ans)", fmtEur(res.reportFoncier)] : null,
                    res.estDeficit ? [`Économie IR (${tmi} %)`, fmtEur(Math.round(res.imputationRevenuGlobal * tmi / 100))] : null,
                    res.estDeficit ? ["Économie PS (17,2 %)", fmtEur(Math.round(res.imputationRevenuGlobal * PS))] : null,
                    res.estDeficit ? ["Économie fiscale immédiate totale", fmtEur(Math.round(res.economieFiscaleImmédiate))] : null,
                    res.estDeficit && res.economieFiscaleTotale > res.economieFiscaleImmédiate
                      ? ["Économie fiscale totale (si report utilisé)", fmtEur(Math.round(res.economieFiscaleTotale))]
                      : null,
                    !res.estDeficit ? [`Impôt à payer (IR ${tmi} % + PS 17,2 %)`, fmtEur(Math.round(res.imposition))] : null,
                  ].filter(Boolean).map(([label, val], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "8px 0", color: "var(--text-secondary)" }}>{label}</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AccordionSection>

            {/* Rappel plafonds */}
            <div style={{ ...card, padding: "16px 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>Plafonds de déduction 2025</div>
              {[
                ["Plafond normal (régime réel)", fmtEur(PLAFOND_NORMAL) + "/an"],
                ["Plafond Louer abordable (Anah)", fmtEur(PLAFOND_ELEVE) + "/an"],
                ["Durée du report excédentaire", "10 ans"],
                ["Prélèvements sociaux sur rev. fonciers", "17,2 %"],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", color: "var(--text-secondary)" }}>
                  <span>{label}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "var(--text)" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AdUnit slot="deficit-foncier-mid" style={{ margin: "24px 0" }} />

        {/* FAQ */}
        <FaqSection items={FAQ} />

        {/* À propos */}
        <AccordionSection title="À propos du déficit foncier">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            Le déficit foncier est un mécanisme fiscal permettant aux propriétaires bailleurs en régime réel de déduire leurs charges (hors intérêts d'emprunt) de leur revenu global dans la limite de 10 700 € par an. Il est particulièrement intéressant lors d'années de gros travaux de rénovation. L'excédent de déficit est reportable pendant 10 ans sur les revenus fonciers.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            Attention : pour bénéficier du déficit foncier, le bien doit rester loué (non meublé, en régime réel) jusqu'au 31 décembre de la 3e année suivant l'imputation. Par ailleurs, les intérêts d'emprunt obéissent à des règles distinctes : ils sont déductibles uniquement des revenus fonciers (pas du revenu global) et ne peuvent donc pas amplifier le déficit imputable sur le revenu global.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            <strong>Ce simulateur est indicatif.</strong> La situation réelle dépend de la nature des travaux, des conventions signées et de votre déclaration fiscale. Consultez un expert-comptable ou un conseiller fiscal pour optimiser votre situation.
          </p>
        </AccordionSection>

        <ShareBar params={toParams(vals)} name="deficit-foncier" />
      </div>
      <Footer />
    </div>
  );
}
