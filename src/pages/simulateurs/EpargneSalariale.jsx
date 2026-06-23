import { useState, useMemo } from "react";
import { PASS } from "../../config/constants.js";
import { useFiscalProfile } from "../../hooks/useFiscalProfile.js";
import { track } from "@vercel/analytics";
import { useTheme } from "../../hooks/useTheme.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import ScenarioCompare from "../../components/ScenarioCompare.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import { readShareParams } from "../../hooks/useShareableUrl.js";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, useAnimatedNumber, fmtEur,
  SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";
import SimIcon from "../../data/simIcons.jsx";

// ─── Constantes 2025 ──────────────────────────────────────────────────────────
const ABONDEMENT_MAX_LEGAL = 0.08 * PASS; // 3 844,80 €

// ─── Calculs ──────────────────────────────────────────────────────────────────
function futureValue(annuel, taux, duree) {
  if (duree <= 0) return 0;
  if (taux === 0) return annuel * duree;
  const r = taux / 100;
  return annuel * ((Math.pow(1 + r, duree) - 1) / r) * (1 + r);
}

function calcEpargneSalariale({ versementMensuel, tauxAbondement, rendementAnnuel, duree, tmi }) {
  const versementSalarie = versementMensuel * 12;

  // Abondement : max(versement * taux, 3*versement, 3844.80€)
  const abondementSansCap = versementSalarie * (tauxAbondement / 100);
  const abondementMax = Math.min(versementSalarie * 3, ABONDEMENT_MAX_LEGAL);
  const abondementAnnuel = Math.min(abondementSansCap, abondementMax);

  const totalAnnuel = versementSalarie + abondementAnnuel;

  // Capital projeté avec abondement
  const capitalFinal = futureValue(totalAnnuel, rendementAnnuel, duree);

  // Capital projeté sans abondement (versement salarié seul)
  const capitalSansAbondement = futureValue(versementSalarie, rendementAnnuel, duree);

  // Gain total grâce à l'abondement
  const gainAbondement = capitalFinal - capitalSansAbondement;

  // Économie fiscale : l'abondement reçu est exonéré d'IR
  const economieIR = abondementAnnuel * (tmi / 100);

  // Versement net effectif salarié (économie annuelle sur l'abondement)
  const versementNetSalarie = versementSalarie - economieIR;

  // Total versé sur la durée
  const totalVerseSalarie = versementSalarie * duree;
  const totalAbondement = abondementAnnuel * duree;

  // Plafond atteint ?
  const plafondAtteint = abondementSansCap > abondementMax;

  return {
    versementSalarie,
    abondementAnnuel,
    totalAnnuel,
    capitalFinal,
    capitalSansAbondement,
    gainAbondement,
    economieIR,
    versementNetSalarie,
    totalVerseSalarie,
    totalAbondement,
    plafondAtteint,
    abondementMax,
  };
}

const TMI_OPTIONS = [0, 11, 30, 41, 45];

const DEFAULT = {
  versementMensuel: 200,
  tauxAbondement: 100,
  rendementAnnuel: 5,
  duree: 15,
  tmi: 30,
};

function fromParams(p) {
  if (!p) return DEFAULT;
  return {
    versementMensuel: Number(p.vm) || DEFAULT.versementMensuel,
    tauxAbondement:   Number(p.ta) || DEFAULT.tauxAbondement,
    rendementAnnuel:  Number.isFinite(Number(p.r)) ? Number(p.r) : DEFAULT.rendementAnnuel,
    duree:            Number(p.d)  || DEFAULT.duree,
    tmi:              Number(p.tmi) || DEFAULT.tmi,
  };
}

function toParams(v) {
  return { vm: v.versementMensuel, ta: v.tauxAbondement, r: v.rendementAnnuel, d: v.duree, tmi: v.tmi };
}

const FAQ = [
  {
    q: "Qu'est-ce que l'abondement employeur dans un PEE ?",
    a: "L'abondement est une contribution financière versée par votre employeur en complément de vos propres versements sur le Plan d'Épargne Entreprise (PEE) ou le PERCO/PERO. Il est encadré par la loi : l'employeur ne peut pas abonder plus de 3 fois votre versement, et le total de l'abondement ne peut dépasser 8 % du PASS (Plafond Annuel de la Sécurité Sociale), soit 3 844,80 € en 2025. C'est un avantage considérable : si votre employeur abonde à 100 %, chaque euro que vous versez est doublé.",
  },
  {
    q: "L'abondement est-il soumis à l'impôt sur le revenu ?",
    a: "Non, l'abondement versé par l'employeur est totalement exonéré d'impôt sur le revenu, dans la limite légale de 8 % du PASS. Il est également exonéré de cotisations sociales salariales (mais soumis à CSG/CRDS à 9,7 %). Cette double exonération fait de l'abondement l'un des avantages salariaux les plus avantageux fiscalement.",
  },
  {
    q: "Quelle est la différence entre PEE, PERCO et PERO ?",
    a: "Le PEE (Plan d'Épargne Entreprise) est bloqué 5 ans, avec une sortie en capital exonérée d'IR (hors prélèvements sociaux). Le PERCO (Plan d'Épargne Retraite Collectif) est bloqué jusqu'à la retraite, avec une sortie en rente ou en capital. Le PERO (Plan d'Épargne Retraite Obligatoire) fonctionne sur le même principe que le PERCO mais avec des versements obligatoires pour certaines catégories. Dans tous les cas, l'abondement est soumis aux mêmes règles légales.",
  },
  {
    q: "Quand peut-on débloquer son PEE avant les 5 ans ?",
    a: "La loi prévoit plusieurs cas de déblocage anticipé du PEE avant l'échéance des 5 ans : mariage ou PACS, naissance ou adoption d'un 3e enfant, divorce ou séparation, invalidité, décès du titulaire ou de son conjoint, rupture du contrat de travail (licenciement, démission, retraite), création ou reprise d'entreprise, achat de la résidence principale, surendettement. Ces déblocages restent exonérés d'impôt sur le revenu.",
  },
  {
    q: "Les versements volontaires dans le PEE sont-ils déductibles de l'IR ?",
    a: "Non, contrairement au PER individuel, les versements volontaires que vous effectuez dans un PEE ne sont pas déductibles de votre impôt sur le revenu. En revanche, les sommes issues de la participation, de l'intéressement ou de l'abondement employeur sont exonérées d'IR à l'entrée. Lors de la sortie, la plus-value réalisée est exonérée d'IR (mais soumise aux prélèvements sociaux de 17,2 %).",
  },
  {
    q: "Comment choisir entre verser dans son PEE et dans son PER individuel ?",
    a: "Le PEE est plus souple (déblocage à 5 ans) et bénéficie de l'abondement employeur, qui peut représenter un rendement immédiat très élevé. Le PER individuel permet en revanche de déduire les versements de l'IR, ce qui est intéressant si votre TMI est élevé (30 % ou plus). La stratégie optimale consiste souvent à maximiser l'abondement du PEE en premier, puis à compléter avec un PER si vous êtes dans une tranche élevée d'imposition.",
  },
  {
    q: "Quel rendement réaliste attendre de son PEE ?",
    a: "Le rendement dépend entièrement des fonds choisis. Les fonds monétaires offrent peu (2-3 % en période de taux hauts), les fonds obligataires 3-5 %, les fonds actions 5-9 % sur longue période. Beaucoup de PEE proposent des fonds investis en actions de l'entreprise, souvent avec une décote d'achat. Le simulateur utilise un rendement annuel moyen supposé constant, mais la réalité est plus volatile. Diversifiez vos supports si votre PEE le permet.",
  },
];

export default function EpargneSalariale() {
  const [theme, setTheme] = useTheme();
  const { tmi: profileTmi } = useFiscalProfile();
  const init = useMemo(() => fromParams(readShareParams()), []);

  const [versementMensuel, setVersementMensuel] = useState(init.versementMensuel);
  const [tauxAbondement, setTauxAbondement]     = useState(init.tauxAbondement);
  const [rendementAnnuel, setRendementAnnuel]   = useState(init.rendementAnnuel);
  const [duree, setDuree]                       = useState(init.duree);
  const [tmi, setTmi]                           = useState(() => init.tmi !== DEFAULT.tmi ? init.tmi : profileTmi);

  const vals = { versementMensuel, tauxAbondement, rendementAnnuel, duree, tmi };
  const res  = useMemo(() => calcEpargneSalariale(vals), [versementMensuel, tauxAbondement, rendementAnnuel, duree, tmi]); // eslint-disable-line react-hooks/exhaustive-deps

  usePageMeta({
    title: "Simulateur Épargne Salariale PEE PERCO 2026 — Abondement & Capital | simfinly.com",
    description: "Calculez l'impact de l'abondement employeur sur votre épargne salariale (PEE, PERCO, PERO). Capital projeté, économie fiscale et gain grâce à l'abondement. Plafonds 2025.",
  });

  const animCapital    = useAnimatedNumber(res.capitalFinal);
  const animGain       = useAnimatedNumber(res.gainAbondement);
  const animAbondement = useAnimatedNumber(res.abondementAnnuel);

  const card = {
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "20px 22px",
  };

  const hasAbondement = res.abondementAnnuel > 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Simulateur Épargne Salariale PEE PERCO 2026",
        url: "https://www.simfinly.com/simulateurs/epargne-salariale",
        description: "Calculez l'impact de l'abondement employeur sur votre PEE ou PERCO : capital projeté, gain grâce à l'abondement, économie fiscale. Plafonds 2025.",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        inLanguage: "fr-FR",
      }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/epargne" size={34} />}
          title="Épargne salariale"
          subtitle="PEE · PERCO · PERO — Simulation 2025"
          desc="Estimez l'impact de l'abondement employeur sur votre capital final. Plafond légal 2025 : 3 844,80 € (8 % du PASS), exonéré d'impôt sur le revenu."
          badge="Épargne · Salarié"
        />

        <AdUnit slot="epargne-salariale-top" style={{ marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>

          {/* ─── Formulaire ─── */}
          <div style={{ ...card }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 22 }}>Vos paramètres</h2>

            <NumInput
              id="versement-mensuel"
              label="Versement mensuel salarié"
              value={versementMensuel}
              onChange={v => { setVersementMensuel(v); track("epargne_salariale_versement"); }}
              unit="€"
              min={0}
              max={10_000}
              hint={`soit ${fmtEur(versementMensuel * 12)}/an`}
              tooltip="Montant que vous versez chaque mois sur le PEE/PERCO"
            />

            <StepperInput
              label="Taux d'abondement employeur"
              value={tauxAbondement}
              onChange={v => { setTauxAbondement(v); track("epargne_salariale_abondement"); }}
              min={0}
              max={300}
              step={10}
              unit="%"
              hint={tauxAbondement === 0
                ? "Aucun abondement"
                : tauxAbondement <= 100
                  ? `Votre employeur ajoute ${fmtEur(Math.min(versementMensuel * 12 * tauxAbondement / 100, ABONDEMENT_MAX_LEGAL))}/an`
                  : `Abondement supérieur à votre versement (${tauxAbondement} %)`}
              tooltip="100 % = l'employeur verse autant que vous. Max légal : 300 % de votre versement, plafonné à 3 844,80 €"
            />

            {res.plafondAtteint && (
              <div style={{ marginTop: -12, marginBottom: 16, fontSize: 12, color: "var(--gold)", background: "rgba(184,147,74,0.08)", border: "1px solid var(--border-gold)", borderRadius: 8, padding: "8px 12px" }}>
                Plafond légal atteint — abondement limité à {fmtEur(ABONDEMENT_MAX_LEGAL)}/an (8 % du PASS 2025)
              </div>
            )}

            <StepperInput
              label="Rendement annuel moyen"
              value={rendementAnnuel}
              onChange={setRendementAnnuel}
              min={0}
              max={12}
              step={0.5}
              unit="%"
              hint="Rendement net de frais de gestion des fonds choisis"
            />

            <StepperInput
              label="Durée d'épargne"
              value={duree}
              onChange={v => setDuree(Math.round(v))}
              min={1}
              max={40}
              step={1}
              unit="ans"
            />

            {/* TMI */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
                Tranche marginale d'imposition (TMI)
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TMI_OPTIONS.map(t => (
                  <button
                    key={t}
                    onClick={() => { setTmi(t); track("epargne_salariale_tmi", { tmi: t }); }}
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
              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 6 }}>
                Utilisée pour estimer l'économie d'IR sur l'abondement exonéré
              </div>
            </div>
          </div>

          {/* ─── Résultats ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Hero : capital final */}
            <div style={{ ...card, background: "rgba(43,92,230,0.05)", border: "1px solid rgba(43,92,230,0.2)", textAlign: "center", padding: "28px 22px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                Capital final après {duree} ans
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "var(--primary)" }}>
                {fmtEur(Math.round(animCapital))}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
                à {rendementAnnuel} % de rendement annuel
              </div>
              {hasAbondement && (
                <div style={{ marginTop: 12, fontSize: 12, color: "#22c55e", background: "rgba(34,197,94,0.08)", borderRadius: 8, padding: "8px 12px", border: "1px solid rgba(34,197,94,0.2)" }}>
                  dont {fmtEur(Math.round(animGain))} de gain grâce à l'abondement
                </div>
              )}
            </div>

            {/* Chips */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Chip label="Abondement annuel" value={fmtEur(Math.round(animAbondement))} accent />
              <Chip label="Capital sans abondement" value={fmtEur(Math.round(res.capitalSansAbondement))} />
              <Chip label="Économie IR / an" value={fmtEur(Math.round(res.economieIR))} />
              <Chip label="Versement net salarié/an" value={fmtEur(Math.round(res.versementNetSalarie))} />
            </div>

            {/* Détail */}
            <AccordionSection title="Détail du calcul">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {[
                    ["Versement mensuel salarié", fmtEur(versementMensuel)],
                    ["Versement annuel salarié", fmtEur(res.versementSalarie)],
                    [`Abondement employeur (${tauxAbondement} %)`, fmtEur(Math.round(res.abondementAnnuel))],
                    res.plafondAtteint ? ["Plafond légal appliqué", fmtEur(ABONDEMENT_MAX_LEGAL)] : null,
                    ["Total versé par an (salarié + employeur)", fmtEur(Math.round(res.totalAnnuel))],
                    ["Total versé sur " + duree + " ans", fmtEur(Math.round(res.totalVerseSalarie + res.totalAbondement))],
                    ["dont total abondement", fmtEur(Math.round(res.totalAbondement))],
                    [`Capital projeté avec abondement (${rendementAnnuel} %)`, fmtEur(Math.round(res.capitalFinal))],
                    [`Capital sans abondement (${rendementAnnuel} %)`, fmtEur(Math.round(res.capitalSansAbondement))],
                    ["Gain total grâce à l'abondement", fmtEur(Math.round(res.gainAbondement))],
                    [`Économie IR annuelle (TMI ${tmi} %)`, fmtEur(Math.round(res.economieIR))],
                  ].filter(Boolean).map(([label, val], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "8px 0", color: "var(--text-secondary)" }}>{label}</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AccordionSection>

            {/* Info plafonds */}
            <div style={{ ...card, padding: "16px 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>Plafonds légaux 2025</div>
              {[
                ["PASS 2026", fmtEur(PASS)],
                ["Abondement max légal (8 % PASS)", fmtEur(ABONDEMENT_MAX_LEGAL)],
                ["Max. abondement (3× versement salarié)", fmtEur(res.versementSalarie * 3)],
                ["Plafond effectif retenu", fmtEur(res.abondementMax)],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", color: "var(--text-secondary)" }}>
                  <span>{label}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "var(--text)" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AdUnit slot="epargne-salariale-mid" style={{ margin: "24px 0" }} />

        {/* FAQ */}
        <FaqSection items={FAQ} />

        {/* À propos */}
        <AccordionSection title="À propos de l'épargne salariale">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            L'épargne salariale regroupe plusieurs dispositifs collectifs permettant aux salariés de se constituer une épargne avec l'aide de leur employeur : PEE (Plan d'Épargne Entreprise, bloqué 5 ans), PERCO/PERO (Plan d'Épargne Retraite, bloqué jusqu'à la retraite). L'abondement de l'employeur est l'avantage central : il peut doubler voire tripler vos versements dans la limite légale.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            Les sommes issues de l'intéressement et de la participation peuvent également être versées dans ces plans, en exonération d'impôt sur le revenu. À la sortie du PEE, la plus-value est exonérée d'IR (mais soumise aux prélèvements sociaux de 17,2 %).
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            <strong>Ce simulateur est indicatif.</strong> Les résultats réels dépendent des performances des fonds, des frais de gestion et des règles propres à chaque accord d'entreprise.
          </p>
        </AccordionSection>

        <ShareBar params={toParams(vals)} name="epargne-salariale" />

        <ScenarioCompare
          name="epargne-salariale"
          fields={[
            { key: "versementMensuel", label: "Versement mensuel salarié", unit: "€", type: "num", min: 0, max: 10000, kind: "eur" },
            { key: "tauxAbondement",   label: "Taux d'abondement",         unit: "%", type: "step", min: 0, max: 300, step: 10 },
            { key: "rendementAnnuel",  label: "Rendement annuel",          unit: "%", type: "step", min: 0, max: 12,  step: 0.5 },
            { key: "duree",            label: "Durée",                     unit: "ans", type: "step", min: 1, max: 40, step: 1 },
          ]}
          base={vals}
          compute={calcEpargneSalariale}
          metrics={[
            { label: "Capital final", get: r => r.capitalFinal, fmt: v => fmtEur(Math.round(v)), higherBetter: true },
            { label: "Gain abondement", get: r => r.gainAbondement, fmt: v => fmtEur(Math.round(v)), higherBetter: true },
          ]}
        />
      </div>
      <Footer />
    </div>
  );
}
