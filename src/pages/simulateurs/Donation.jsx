import { useState, useMemo } from "react";
import { track } from "@vercel/analytics";
import { useTheme } from "../../hooks/useTheme.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, useAnimatedNumber, fmtEur,
  SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";
import SimIcon from "../../data/simIcons.jsx";
import { FAQS } from '../../data/faqs.js';
import SimRecommendations from '../../components/SimRecommendations.jsx';
import { RECOMMENDATIONS } from '../../data/recommendations.js';

// ─── Barèmes fiscaux (identiques succession 2025) ────────────────────────────
const TRANCHES_DIRECTE = [
  { limit: 8_072,     rate: 0.05 },
  { limit: 12_109,    rate: 0.10 },
  { limit: 15_932,    rate: 0.15 },
  { limit: 552_324,   rate: 0.20 },
  { limit: 902_838,   rate: 0.30 },
  { limit: 1_805_677, rate: 0.40 },
  { limit: Infinity,  rate: 0.45 },
];

const TRANCHES_FRERES = [
  { limit: 24_430,   rate: 0.35 },
  { limit: Infinity, rate: 0.45 },
];

const TRANCHES_NEVEUX = [
  { limit: Infinity, rate: 0.55 },
];

function calcTranches(taxable, tranches) {
  if (taxable <= 0) return 0;
  let tax = 0, prev = 0;
  for (const { limit, rate } of tranches) {
    const slice = Math.min(taxable, limit) - prev;
    if (slice <= 0) break;
    tax += slice * rate;
    prev = limit;
    if (taxable <= limit) break;
  }
  return tax;
}

// ─── Abattements légaux donation par lien de parenté ─────────────────────────
// Note : le conjoint/PACS a un abattement de 80 724 € en DONATION
// (pas d'exonération totale comme en succession)
const ABATTEMENTS_DONATION = {
  enfant:   100_000,
  conjoint: 80_724,
  frere:    15_932,
  neveu:    7_967,
};

function getTranches(lien) {
  if (lien === "frere") return TRANCHES_FRERES;
  if (lien === "neveu") return TRANCHES_NEVEUX;
  return TRANCHES_DIRECTE; // enfant, conjoint
}

// ─── Calcul central ──────────────────────────────────────────────────────────
function calcDonation({
  valeurBien, lien, donationsAnterieures, anneesDernierDon,
}) {
  const abattBase = ABATTEMENTS_DONATION[lien] ?? 7_967;
  const tranches  = getTranches(lien);

  // ── Droits de donation maintenant ─────────────────────────────────────
  // Abattement restant = abattement total − donations des 15 dernières années
  const abattRestant = Math.max(0, abattBase - donationsAnterieures);
  const taxableDonation = Math.max(0, valeurBien - abattRestant);
  const droitsDonation = calcTranches(taxableDonation, tranches);

  // ── Droits de succession si on ne donne pas ───────────────────────────
  // L'abattement peut être partiellement reconstitué selon anneesDernierDon :
  // - Si donation < 15 ans : abattement réduit (rapportable fiscalement)
  // - Si donation ≥ 15 ans : abattement plein
  let abattReconstitueSi15 = abattBase; // si on attend que 15 ans soient écoulés
  let abattSuccessionSansAttente;

  if (anneesDernierDon >= 15) {
    // Abattement pleinement rechargé
    abattSuccessionSansAttente = abattBase;
  } else {
    // Donations antérieures encore rapportables (dans les 15 ans)
    // Abattement restant = abattBase - somme des donations rapportables
    abattSuccessionSansAttente = Math.max(0, abattBase - donationsAnterieures);
  }

  // Succession sans donation anticipée maintenant
  const taxableSuccSansAction = Math.max(0, valeurBien - abattSuccessionSansAttente);
  const droitsSuccSansAction = calcTranches(taxableSuccSansAction, tranches);

  // Succession si on fait la donation maintenant
  // Après la donation, la valeur transmise à la succession = valeurBien - valeurBien = 0
  // (le bien est sorti du patrimoine), mais les droits de donation ont déjà été payés.
  // Économie nette = droits succession évités - droits donation payés
  const economieFiscale = droitsSuccSansAction - droitsDonation;

  // Années restantes avant renouvellement complet de l'abattement
  const anneesAvantRenouvellement = Math.max(0, 15 - anneesDernierDon);
  const currentYear = new Date().getFullYear();
  const anneeRenouvellement = currentYear + anneesAvantRenouvellement;

  // Taux effectif donation
  const tauxEffectifDonation = valeurBien > 0 ? droitsDonation / valeurBien : 0;

  // TMI succession
  let tmiSucc = 0;
  let prev2 = 0;
  for (const { limit, rate } of tranches) {
    if (taxableSuccSansAction > prev2) tmiSucc = rate;
    prev2 = limit;
    if (taxableSuccSansAction <= limit) break;
  }

  return {
    abattBase, abattRestant, taxableDonation,
    droitsDonation: Math.round(droitsDonation),
    droitsSuccSansAction: Math.round(droitsSuccSansAction),
    economieFiscale: Math.round(economieFiscale),
    tauxEffectifDonation,
    taxableSuccSansAction,
    tmiSucc,
    anneesAvantRenouvellement,
    anneeRenouvellement,
    abattSuccessionSansAttente,
  };
}

const LIEN_OPTIONS = [
  { value: "enfant",   label: "Enfant",                hint: "Abattement 100 000 €" },
  { value: "conjoint", label: "Conjoint / PACS",       hint: "Abattement 80 724 €" },
  { value: "frere",    label: "Frère / Sœur",          hint: "Abattement 15 932 €" },
  { value: "neveu",    label: "Neveu / Nièce",         hint: "Abattement 7 967 €" },
];

const DEFAULT = {
  valeurBien: 200_000,
  lien: "enfant",
  ageDonateur: 65,
  donationsAnterieures: 0,
  anneesDernierDon: 0,
};

function fromParams(p) {
  return {
    valeurBien:           Number(p.get("v"))  || DEFAULT.valeurBien,
    lien:                 p.get("l")          || DEFAULT.lien,
    ageDonateur:          Number(p.get("ag")) || DEFAULT.ageDonateur,
    donationsAnterieures: Number(p.get("da")) || DEFAULT.donationsAnterieures,
    anneesDernierDon:     Number(p.get("ad")) || DEFAULT.anneesDernierDon,
  };
}
function toParams(v) {
  return { v: v.valeurBien, l: v.lien, ag: v.ageDonateur, da: v.donationsAnterieures, ad: v.anneesDernierDon };
}

const FAQ = FAQS['/simulateurs/donation'];

function Row({ label, value, highlight, positive, negative }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: highlight ? 700 : 500,
        color: positive ? "#22c55e" : negative ? "#ef4444" : highlight ? "var(--text)" : "var(--text-secondary)",
      }}>
        {value}
      </span>
    </div>
  );
}

export default function Donation() {
  const [theme, setTheme] = useTheme();
  const init = useMemo(() => fromParams(readShareParams()), []);

  const [valeurBien,           setValeurBien]           = useState(init.valeurBien);
  const [lien,                 setLien]                 = useState(init.lien);
  const [ageDonateur,          setAgeDonateur]          = useState(init.ageDonateur);
  const [donationsAnterieures, setDonationsAnterieures] = useState(init.donationsAnterieures);
  const [anneesDernierDon,     setAnneesDernierDon]     = useState(init.anneesDernierDon);

  const vals = { valeurBien, lien, ageDonateur, donationsAnterieures, anneesDernierDon };
  const res = useMemo(() => calcDonation(vals), [valeurBien, lien, ageDonateur, donationsAnterieures, anneesDernierDon]); // eslint-disable-line react-hooks/exhaustive-deps

  usePageMeta({
    title: "Simulateur Donation vs Succession 2026 — Économie fiscale | simfinly.com",
    description: "Comparez les droits de donation de votre vivant et les droits de succession. Calculez l'économie fiscale, l'abattement restant et la date de renouvellement. Barème officiel 2025.",
  });

  const animEconomie  = useAnimatedNumber(Math.max(0, res.economieFiscale));
  const animDonation  = useAnimatedNumber(res.droitsDonation);
  const animSucc      = useAnimatedNumber(res.droitsSuccSansAction);

  const shareUrl = buildShareUrl(toParams(vals));

  const isEconomie   = res.economieFiscale > 0;
  const isCouteux    = res.economieFiscale < 0;

  const heroColor = isEconomie ? "#22c55e" : isCouteux ? "#ef4444" : "var(--gold)";

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px" };

  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Simulateur Donation vs Succession 2026",
        url: "https://www.simfinly.com/simulateurs/donation",
        description: "Comparez les droits de donation et de succession pour optimiser la transmission de votre patrimoine. Barème 2025.",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
      },
    ],
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <JsonLd data={jsonLdData} />

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/donation" size={34} />}
          title="Donation vs Succession"
          subtitle="Optimisation fiscale · Barème 2025"
          desc="Comparez les droits à payer si vous donnez maintenant ou si vous laissez hériter. Calculez l'économie fiscale, l'abattement restant et la stratégie optimale."
          badge="Patrimoine · Transmission"
        />

        <AdUnit slot="donation-top" style={{ marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>
          {/* ─── Formulaire ─── */}
          <div style={{ ...card }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 22 }}>Votre situation</h2>

            <NumInput
              id="valeur-bien"
              label="Valeur du bien à transmettre"
              value={valeurBien}
              onChange={v => { setValeurBien(v); track("donation_valeur"); }}
              unit="€"
              min={0}
              max={10_000_000}
              tooltip="Valeur vénale du bien : immobilier, liquidités, valeurs mobilières…"
            />

            {/* Lien de parenté */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
                Lien de parenté avec le bénéficiaire
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {LIEN_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setLien(opt.value); track("donation_lien", { lien: opt.value }); }}
                    style={{
                      padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                      background: lien === opt.value ? "rgba(184,147,74,0.12)" : "transparent",
                      border: lien === opt.value ? "1.5px solid var(--border-gold)" : "1.5px solid var(--border)",
                      color: lien === opt.value ? "var(--gold)" : "var(--text)",
                      textAlign: "left", fontSize: 13, fontWeight: lien === opt.value ? 600 : 400,
                      fontFamily: "'Hanken Grotesk', sans-serif", transition: "all 0.15s",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}
                  >
                    <span>{opt.label}</span>
                    <span style={{ fontSize: 11, color: lien === opt.value ? "var(--gold)" : "var(--text-secondary)", marginLeft: 8 }}>
                      {opt.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <StepperInput
              label="Âge du donateur"
              value={ageDonateur}
              onChange={v => { setAgeDonateur(v); track("donation_age"); }}
              min={18}
              max={95}
              step={1}
              unit="ans"
              hint="Important pour une donation en nue-propriété (valeur de l'usufruit)"
              tooltip="L'âge détermine la valeur fiscale de l'usufruit en cas de donation démembrée"
            />

            <NumInput
              id="donations-anterieures"
              label="Donations antérieures (15 dernières années)"
              value={donationsAnterieures}
              onChange={v => { setDonationsAnterieures(v); track("donation_anterieures"); }}
              unit="€"
              min={0}
              max={5_000_000}
              hint="Réduisent l'abattement disponible jusqu'à leur expiration (15 ans)"
              tooltip="Somme des donations déjà reçues par ce même bénéficiaire dans les 15 dernières années"
            />

            <StepperInput
              label="Années depuis le dernier don"
              value={anneesDernierDon}
              onChange={v => { setAnneesDernierDon(v); track("donation_dernier_don"); }}
              min={0}
              max={20}
              step={1}
              unit="ans"
              hint="≥ 15 ans = abattement pleinement rechargé"
              tooltip="Détermine si les donations antérieures sont encore rapportables fiscalement"
            />
          </div>

          {/* ─── Résultats ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Hero : économie fiscale */}
            <div style={{
              ...card,
              background: isEconomie ? "rgba(34,197,94,0.06)" : isCouteux ? "rgba(239,68,68,0.06)" : "rgba(184,147,74,0.06)",
              border: `1px solid ${isEconomie ? "rgba(34,197,94,0.25)" : isCouteux ? "rgba(239,68,68,0.2)" : "rgba(184,147,74,0.25)"}`,
              textAlign: "center", padding: "28px 22px",
            }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                {isEconomie ? "Économie fiscale de la donation" : isCouteux ? "Surcoût de la donation" : "Résultat fiscal"}
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: heroColor }}>
                {isEconomie ? "+" : isCouteux ? "−" : ""}{fmtEur(Math.abs(Math.round(animEconomie)))}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
                {isEconomie
                  ? "en donnant maintenant plutôt qu'en laissant hériter"
                  : isCouteux
                  ? "la donation coûte plus que l'héritage dans cette situation"
                  : "donation et succession ont le même coût fiscal"}
              </div>
            </div>

            {/* Comparatif donation vs succession */}
            <div style={{ ...card }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 14 }}>
                Comparatif
              </div>
              <Row label="Valeur transmise" value={fmtEur(valeurBien)} highlight />
              <Row label="Droits si donation maintenant" value={fmtEur(Math.round(animDonation))} negative={animDonation > 0} />
              <Row label="Droits si succession (sans don)" value={fmtEur(Math.round(animSucc))} negative={animSucc > 0} />
              <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 10, background: isEconomie ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)", border: `1px solid ${isEconomie ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.15)"}` }}>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>
                  {isEconomie ? "Économie fiscale nette" : "Surcoût de la donation"}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: heroColor }}>
                  {isEconomie ? "+" : isCouteux ? "−" : ""}{fmtEur(Math.abs(res.economieFiscale))}
                </div>
              </div>
            </div>

            {/* Chips */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Chip label="Abattement disponible" value={fmtEur(res.abattRestant)} accent={res.abattRestant > 0} />
              <Chip label="Part taxable (donation)" value={fmtEur(res.taxableDonation)} />
              <Chip
                label="Taux effectif donation"
                value={valeurBien > 0 ? `${(res.tauxEffectifDonation * 100).toFixed(1)} %` : "0 %"}
              />
              <Chip
                label="Renouvellement abattement"
                value={res.anneesAvantRenouvellement === 0
                  ? "Disponible maintenant"
                  : `${res.anneeRenouvellement} (dans ${res.anneesAvantRenouvellement} an${res.anneesAvantRenouvellement > 1 ? "s" : ""})`
                }
              />
            </div>

            {/* Détail calcul */}
            <AccordionSection title="Détail du calcul">
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12, fontWeight: 600 }}>Donation maintenant</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 18 }}>
                <tbody>
                  {[
                    ["Valeur du bien", fmtEur(valeurBien)],
                    [`Abattement légal (${lien})`, `− ${fmtEur(res.abattBase)}`],
                    donationsAnterieures > 0 ? ["Donations antérieures imputées", `+ ${fmtEur(donationsAnterieures)}`] : null,
                    ["Abattement restant", fmtEur(res.abattRestant)],
                    ["Part taxable", fmtEur(res.taxableDonation)],
                    ["Droits de donation", fmtEur(res.droitsDonation)],
                  ].filter(Boolean).map(([label, val], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "7px 0", color: "var(--text-secondary)" }}>{label}</td>
                      <td style={{ padding: "7px 0", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12, fontWeight: 600 }}>Succession sans donation (référence)</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {[
                    ["Valeur transmise à la succession", fmtEur(valeurBien)],
                    ["Abattement succession disponible", `− ${fmtEur(res.abattSuccessionSansAttente)}`],
                    ["Part taxable succession", fmtEur(res.taxableSuccSansAction)],
                    ["Droits de succession", fmtEur(res.droitsSuccSansAction)],
                    [`TMI succession`, `${(res.tmiSucc * 100).toFixed(0)} %`],
                  ].map(([label, val], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "7px 0", color: "var(--text-secondary)" }}>{label}</td>
                      <td style={{ padding: "7px 0", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AccordionSection>

            {/* Conseil stratégique */}
            {res.anneesAvantRenouvellement > 0 && res.anneesAvantRenouvellement < 15 && (
              <div style={{ ...card, background: "rgba(184,147,74,0.05)", border: "1px solid rgba(184,147,74,0.2)", padding: "16px 18px" }}>
                <div style={{ fontSize: 12, color: "var(--gold)", fontWeight: 700, marginBottom: 8 }}>Conseil transmission</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  Votre abattement se renouvelle dans <strong style={{ color: "var(--text)" }}>{res.anneesAvantRenouvellement} an{res.anneesAvantRenouvellement > 1 ? "s" : ""}</strong> (en {res.anneeRenouvellement}).
                  Si vous attendez ce délai, vous bénéficierez d'un abattement plein de {fmtEur(res.abattBase)} pour une nouvelle donation.
                  Cette stratégie « glissante » tous les 15 ans est l'un des leviers les plus efficaces d'optimisation successorale.
                </div>
              </div>
            )}
          </div>
        </div>

        <AdUnit slot="donation-mid" style={{ margin: "24px 0" }} />

        {/* FAQ */}
        <SimRecommendations items={RECOMMENDATIONS['/simulateurs/donation']} />

        <FaqSection
          title="Questions fréquentes — Donation & Succession"
          items={FAQ}
        />

        {/* À propos */}
        <AccordionSection title="À propos de ce simulateur">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            Ce simulateur compare deux stratégies de transmission patrimoniale : donner de son vivant ou laisser les biens entrer dans la succession. Il applique les barèmes des <strong>droits de mutation à titre gratuit (DMTG) 2025</strong>, identiques pour les donations et les successions.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            La principale différence entre donation et succession tient aux <strong>abattements</strong> : en succession, le conjoint/partenaire PACS est totalement exonéré, tandis qu'en donation il bénéficie d'un abattement de 80 724 €. Pour les enfants, l'abattement de 100 000 € est identique dans les deux cas, mais en succession les donations des 15 dernières années sont rapportées et viennent l'amputer.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            Le <strong>don familial de sommes d'argent</strong> (jusqu'à 31 865 € exonérés, cumulable avec les abattements) et la <strong>donation en nue-propriété</strong> (qui réduit la base taxable selon l'âge du donateur) ne sont pas inclus dans ce simulateur. Un notaire peut vous présenter l'ensemble des leviers adaptés à votre situation.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            <strong>Ce simulateur est indicatif.</strong> Pour votre stratégie de transmission, consultez un notaire ou un conseiller en gestion de patrimoine.
          </p>
        </AccordionSection>

        <ShareBar url={shareUrl} title="Simulation donation vs succession" />
      </div>
      <Footer />
    </div>
  );
}
