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
  Chip, useAnimatedNumber, fmt, fmtEur,
  SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";
import SimIcon from "../../data/simIcons.jsx";

// ─── Barème pension alimentaire (indicatif MJ 2022) ──────────────────────────
// % du revenu net mensuel du débiteur selon nombre d'enfants
// DVH = droit de visite et d'hébergement (garde principale chez l'autre parent)
const PA_DVH   = [0, 0.18, 0.26, 0.32, 0.37]; // index 0 inutilisé
const PA_ALTE  = [0, 0.12, 0.17, 0.21, 0.24]; // garde alternée (coûts partagés)

function getPaTaux(nbEnfants, garde) {
  const n = Math.min(Math.max(nbEnfants, 1), 4);
  if (garde === "alternee") return PA_ALTE[n];
  if (garde === "dvh")      return PA_DVH[n];
  return 0; // garde exclusive (débiteur) : l'autre parent pourrait payer
}

// ─── Calcul central ──────────────────────────────────────────────────────────
function calcDivorce({
  regime, actifCommun, revenu1, revenu2,
  dureeMariage, nbEnfants, garde,
  propres1, propres2,
}) {
  // ── Partage du patrimoine ──────────────────────────────────────────────
  let partCommune1 = 0, partCommune2 = 0, droitsPartage = 0;
  if (regime === "commun") {
    partCommune1 = actifCommun / 2;
    partCommune2 = actifCommun / 2;
    droitsPartage = actifCommun * 0.011; // droits de partage 1,1% depuis 2022
  }
  const total1 = partCommune1 + propres1;
  const total2 = partCommune2 + propres2;

  // ── Pension alimentaire ────────────────────────────────────────────────
  // Le parent le plus riche est généralement le débiteur (simplification)
  const payeur    = revenu1 >= revenu2 ? revenu1 : revenu2;
  const taux      = nbEnfants > 0 ? getPaTaux(nbEnfants, garde) : 0;
  const pensionAlim = payeur * taux;

  // ── Prestation compensatoire (très indicative) ─────────────────────────
  // S'applique si l'écart de revenus est significatif et durée de mariage > 2 ans
  // Formule approximative : écart × 12 × min(durée, 20) × 0.5
  // Extrêmement variable selon les cas — clause de non-responsabilité forte
  const ecart = Math.abs(revenu1 - revenu2);
  const pcEligible = ecart > 500 && dureeMariage >= 2;
  const prestComp = pcEligible
    ? ecart * 12 * Math.min(dureeMariage, 20) * 0.5
    : 0;
  // Qui la verse : le mieux rémunéré vers le moins rémunéré
  const pcPayeur = revenu1 >= revenu2 ? 1 : 2;

  // ── Frais estimés ─────────────────────────────────────────────────────
  const fraisAvocat = 3_000; // par conjoint (médiane, hors cas complexes)
  const fraisNotaire = regime === "commun" && actifCommun > 0
    ? actifCommun * 0.01 + 1_200   // ~1% + forfait actes
    : 500;
  const fraisTotal = fraisAvocat * 2 + fraisNotaire + droitsPartage;

  return {
    partCommune1, partCommune2, total1, total2,
    droitsPartage, pensionAlim, taux,
    prestComp, pcPayeur, pcEligible,
    fraisAvocat, fraisNotaire, fraisTotal,
    ecart,
  };
}

const REGIMES = [
  { value: "commun",  label: "Communauté réduite aux acquêts", hint: "Régime légal par défaut depuis 1966" },
  { value: "separe",  label: "Séparation de biens",            hint: "Chaque conjoint garde ses propres biens" },
];

const GARDES = [
  { value: "dvh",      label: "Garde principale (chez l'autre parent, DVH)" },
  { value: "alternee", label: "Garde alternée (50/50)" },
  { value: "exclusive",label: "Garde exclusive chez le débiteur" },
];

const DEFAULT = {
  regime: "commun", actifCommun: 250_000, revenu1: 3_500, revenu2: 2_000,
  dureeMariage: 12, nbEnfants: 1, garde: "dvh", propres1: 20_000, propres2: 0,
};

function fromParams(p) {
  return {
    regime:       p.get("r")  || DEFAULT.regime,
    actifCommun:  Number(p.get("a"))  || DEFAULT.actifCommun,
    revenu1:      Number(p.get("r1")) || DEFAULT.revenu1,
    revenu2:      Number(p.get("r2")) || DEFAULT.revenu2,
    dureeMariage: Number(p.get("d"))  || DEFAULT.dureeMariage,
    nbEnfants:    Number(p.get("n"))  || DEFAULT.nbEnfants,
    garde:        p.get("g")  || DEFAULT.garde,
    propres1:     Number(p.get("p1")) || DEFAULT.propres1,
    propres2:     Number(p.get("p2")) || DEFAULT.propres2,
  };
}
function toParams(v) {
  return { r: v.regime, a: v.actifCommun, r1: v.revenu1, r2: v.revenu2, d: v.dureeMariage, n: v.nbEnfants, g: v.garde, p1: v.propres1, p2: v.propres2 };
}

const FAQ = [
  { q: "Qu'est-ce que le régime de communauté réduite aux acquêts ?", a: "C'est le régime matrimonial légal par défaut en France. Les biens acquis pendant le mariage (acquêts) sont communs et partagés 50/50 en cas de divorce. Les biens possédés avant le mariage ou reçus par donation/héritage restent des « propres » qui ne sont pas partagés." },
  { q: "Comment est calculée la pension alimentaire ?", a: "Il n'existe pas de formule légale obligatoire en France, mais le Ministère de la Justice publie un barème indicatif basé sur le revenu net du débiteur et le nombre d'enfants. Le juge reste libre de fixer un montant différent selon la situation réelle de chaque famille. Ce simulateur utilise ce barème indicatif." },
  { q: "La prestation compensatoire est-elle systématique ?", a: "Non. Elle est accordée par le juge uniquement si le divorce crée une disparité significative dans les conditions de vie des époux. Elle prend en compte : la durée du mariage, les sacrifices professionnels consentis, les revenus et patrimoines respectifs, l'âge et l'état de santé. Elle peut être refusée même en cas d'écart de revenus important." },
  { q: "Qu'est-ce que les droits de partage ?", a: "Les droits de partage sont une taxe perçue par l'État lors de la liquidation du régime matrimonial. Depuis 2022, ils sont fixés à 1,1% de la valeur du patrimoine commun partagé (contre 2,5% auparavant). Un bien immobilier commun de 300 000 € génère donc 3 300 € de droits de partage." },
  { q: "Ces estimations sont-elles fiables ?", a: "Ce simulateur donne des ordres de grandeur indicatifs pour vous aider à anticiper votre situation financière. Les montants réels seront fixés par le juge aux affaires familiales ou dans la convention homologuée (divorce par consentement mutuel). Consultez impérativement un avocat spécialisé en droit de la famille pour votre situation." },
];

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 14, fontWeight: 700, marginTop: 20 }}>
      {children}
    </div>
  );
}

function Row({ label, value, highlight, negative }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
      <span style={{ color: highlight ? "var(--text)" : "var(--text-secondary)" }}>{label}</span>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: highlight ? 700 : 500, color: negative ? "#ef4444" : highlight ? "var(--text)" : "var(--text-secondary)" }}>
        {value}
      </span>
    </div>
  );
}

export default function Divorce() {
  const [theme, setTheme] = useTheme();
  const init = useMemo(() => fromParams(readShareParams()), []);

  const [regime,       setRegime]       = useState(init.regime);
  const [actifCommun,  setActifCommun]  = useState(init.actifCommun);
  const [revenu1,      setRevenu1]      = useState(init.revenu1);
  const [revenu2,      setRevenu2]      = useState(init.revenu2);
  const [dureeMariage, setDuree]        = useState(init.dureeMariage);
  const [nbEnfants,    setNbEnfants]    = useState(init.nbEnfants);
  const [garde,        setGarde]        = useState(init.garde);
  const [propres1,     setPropres1]     = useState(init.propres1);
  const [propres2,     setPropres2]     = useState(init.propres2);

  const vals = { regime, actifCommun, revenu1, revenu2, dureeMariage, nbEnfants, garde, propres1, propres2 };
  const res = useMemo(() => calcDivorce(vals), [regime, actifCommun, revenu1, revenu2, dureeMariage, nbEnfants, garde, propres1, propres2]); // eslint-disable-line react-hooks/exhaustive-deps

  usePageMeta({
    title: "Simulateur Divorce & Partage Patrimoine 2025 | simfinly.com",
    description: "Estimez le partage du patrimoine, la pension alimentaire et la prestation compensatoire en cas de divorce. Barème indicatif 2025 — ne remplace pas un avocat.",
  });

  const animPension  = useAnimatedNumber(res.pensionAlim);
  const animPC       = useAnimatedNumber(res.prestComp);
  const animFrais    = useAnimatedNumber(res.fraisTotal);

  const shareUrl = buildShareUrl(toParams(vals));

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Simulateur Divorce 2025", url: "https://www.simfinly.com/simulateurs/divorce", description: "Estimez le partage du patrimoine et la pension alimentaire en cas de divorce.", applicationCategory: "FinanceApplication" }} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/divorce" size={34} />}
          title="Divorce & Partage de patrimoine"
          subtitle="Estimation financière · Indicatif 2025"
          desc="Estimez le partage du patrimoine commun, la pension alimentaire et la prestation compensatoire selon votre régime matrimonial et votre situation familiale."
          badge="Patrimoine · Famille"
        />

        {/* Disclaimer */}
        <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 24, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          ⚠️ <strong>Estimation indicative uniquement.</strong> La pension alimentaire et la prestation compensatoire sont fixées par un juge ou par convention homologuée. Ce simulateur utilise des barèmes moyens qui peuvent différer significativement de votre situation réelle. Consultez un avocat spécialisé en droit de la famille.
        </div>

        <AdUnit slot="divorce-top" style={{ marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>
          {/* ─── Formulaire ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Régime matrimonial */}
            <div style={{ ...card }}>
              <SectionTitle>Régime matrimonial</SectionTitle>
              {REGIMES.map(reg => (
                <button
                  key={reg.value}
                  onClick={() => { setRegime(reg.value); track("divorce_regime", { regime: reg.value }); }}
                  style={{
                    display: "block", width: "100%", padding: "12px 14px",
                    borderRadius: 10, cursor: "pointer", textAlign: "left",
                    background: regime === reg.value ? "rgba(184,147,74,0.1)" : "transparent",
                    border: regime === reg.value ? "1.5px solid var(--border-gold)" : "1.5px solid var(--border)",
                    color: regime === reg.value ? "var(--gold)" : "var(--text)",
                    fontFamily: "'Hanken Grotesk', sans-serif", marginBottom: 8,
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{reg.label}</span>
                  <span style={{ display: "block", fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{reg.hint}</span>
                </button>
              ))}
            </div>

            {/* Patrimoine */}
            <div style={{ ...card }}>
              <SectionTitle>Patrimoine</SectionTitle>
              {regime === "commun" && (
                <NumInput id="actif-commun" label="Actif commun (à partager)" value={actifCommun} onChange={setActifCommun} unit="€" min={0} max={10_000_000}
                  tooltip="Valeur des biens acquis pendant le mariage : immobilier, comptes joints, véhicules…"
                  hint="Partagé 50/50 entre les deux conjoints"
                />
              )}
              <NumInput id="propres1" label="Propres conjoint 1" value={propres1} onChange={setPropres1} unit="€" min={0} max={5_000_000}
                tooltip="Biens possédés avant le mariage ou reçus par donation/héritage — non partagés"
              />
              <NumInput id="propres2" label="Propres conjoint 2" value={propres2} onChange={setPropres2} unit="€" min={0} max={5_000_000} />
            </div>

            {/* Revenus & mariage */}
            <div style={{ ...card }}>
              <SectionTitle>Revenus & durée</SectionTitle>
              <NumInput id="revenu1" label="Revenu net mensuel · Conjoint 1" value={revenu1} onChange={setRevenu1} unit="€/mois" min={0} max={50_000} />
              <NumInput id="revenu2" label="Revenu net mensuel · Conjoint 2" value={revenu2} onChange={setRevenu2} unit="€/mois" min={0} max={50_000} />
              <StepperInput label="Durée du mariage" value={dureeMariage} onChange={setDuree} min={0} max={50} step={1} unit="ans" />
            </div>

            {/* Enfants */}
            <div style={{ ...card }}>
              <SectionTitle>Enfants</SectionTitle>
              <StepperInput label="Nombre d'enfants mineurs" value={nbEnfants} onChange={v => { setNbEnfants(v); track("divorce_enfants"); }} min={0} max={6} step={1} />
              {nbEnfants > 0 && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
                    Garde
                  </div>
                  {GARDES.map(g => (
                    <button
                      key={g.value}
                      onClick={() => setGarde(g.value)}
                      style={{
                        display: "block", width: "100%", padding: "10px 12px",
                        borderRadius: 8, cursor: "pointer", textAlign: "left",
                        background: garde === g.value ? "rgba(184,147,74,0.1)" : "transparent",
                        border: garde === g.value ? "1.5px solid var(--border-gold)" : "1.5px solid var(--border)",
                        color: garde === g.value ? "var(--gold)" : "var(--text)",
                        fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 12, marginBottom: 6,
                      }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ─── Résultats ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Partage du patrimoine */}
            <div style={{ ...card }}>
              <SectionTitle>Partage du patrimoine</SectionTitle>
              {regime === "commun" ? (
                <>
                  <Row label="Actif commun" value={fmtEur(actifCommun)} />
                  <Row label="Part Conjoint 1 (50%)" value={fmtEur(res.partCommune1)} highlight />
                  <Row label="Part Conjoint 2 (50%)" value={fmtEur(res.partCommune2)} highlight />
                  <Row label="Propres Conjoint 1" value={fmtEur(propres1)} />
                  <Row label="Propres Conjoint 2" value={fmtEur(propres2)} />
                  <Row label="Droits de partage (1,1%)" value={`− ${fmtEur(Math.round(res.droitsPartage))}`} negative />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                    <div style={{ padding: "14px", borderRadius: 12, background: "rgba(43,92,230,0.08)", border: "1px solid rgba(43,92,230,0.2)", textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>Total Conjoint 1</div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700 }}>{fmtEur(Math.round(res.total1))}</div>
                    </div>
                    <div style={{ padding: "14px", borderRadius: 12, background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>Total Conjoint 2</div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700 }}>{fmtEur(Math.round(res.total2))}</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Row label="Propres Conjoint 1" value={fmtEur(propres1)} highlight />
                  <Row label="Propres Conjoint 2" value={fmtEur(propres2)} highlight />
                  <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 8, background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", fontSize: 12, color: "var(--text-secondary)" }}>
                    En séparation de biens, chaque conjoint conserve ses biens personnels. Il n'y a pas d'actif commun à partager.
                  </div>
                </>
              )}
            </div>

            {/* Pension alimentaire */}
            {nbEnfants > 0 && (
              <div style={{ ...card }}>
                <SectionTitle>Pension alimentaire (enfants)</SectionTitle>
                <div style={{ textAlign: "center", padding: "14px 0 18px" }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "var(--gold)" }}>
                    {fmtEur(Math.round(animPension))}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                    / mois · {(res.taux * 100).toFixed(0)} % du revenu du débiteur
                  </div>
                </div>
                <Row label={`Revenu net débiteur (le plus élevé)`} value={`${fmtEur(Math.max(revenu1, revenu2))}/mois`} />
                <Row label={`${nbEnfants} enfant${nbEnfants > 1 ? "s" : ""} · ${GARDES.find(g => g.value === garde)?.label.split(" (")[0]}`} value={`Barème : ${(res.taux * 100).toFixed(0)} %`} />
                <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Barème indicatif du Ministère de la Justice 2022. Le montant réel est fixé par le juge.
                </div>
              </div>
            )}

            {/* Prestation compensatoire */}
            <div style={{ ...card, background: res.pcEligible ? "rgba(184,147,74,0.05)" : "var(--card-bg)" }}>
              <SectionTitle>Prestation compensatoire</SectionTitle>
              {res.pcEligible ? (
                <>
                  <div style={{ textAlign: "center", padding: "14px 0 18px" }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: "#f59e0b" }}>
                      {fmtEur(Math.round(animPC))}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                      capital indicatif · versé par Conjoint {res.pcPayeur}
                    </div>
                  </div>
                  <Row label="Écart de revenus" value={`${fmtEur(res.ecart)}/mois`} />
                  <Row label="Durée prise en compte" value={`${Math.min(dureeMariage, 20)} ans`} />
                  <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    ⚠️ Très indicatif. Le juge peut accorder 0 € ou un montant très différent selon les circonstances réelles (sacrifices professionnels, santé, patrimoine…).
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, padding: "8px 0" }}>
                  {dureeMariage < 2
                    ? "Mariage inférieur à 2 ans : prestation compensatoire rare."
                    : res.ecart <= 500
                    ? `Écart de revenus faible (${fmtEur(res.ecart)}/mois) : prestation compensatoire peu probable.`
                    : "Prestation compensatoire non applicable dans cette situation."}
                </div>
              )}
            </div>

            {/* Frais estimés */}
            <div style={{ ...card }}>
              <SectionTitle>Frais de divorce estimés</SectionTitle>
              <Row label="Honoraires avocats (×2)" value={`≈ ${fmtEur(res.fraisAvocat * 2)}`} />
              {regime === "commun" && actifCommun > 0 && (
                <Row label="Frais de notaire (liquidation)" value={`≈ ${fmtEur(Math.round(res.fraisNotaire))}`} />
              )}
              {regime === "commun" && actifCommun > 0 && (
                <Row label="Droits de partage (1,1%)" value={`≈ ${fmtEur(Math.round(res.droitsPartage))}`} />
              )}
              <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 10, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>Total frais estimés</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: "#ef4444" }}>
                  {fmtEur(Math.round(animFrais))}
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Hors procédure contentieuse (peut doubler les honoraires). Un divorce par consentement mutuel sans enfant est moins coûteux.
              </div>
            </div>
          </div>
        </div>

        <AdUnit slot="divorce-mid" style={{ margin: "24px 0" }} />

        <AccordionSection title="Questions fréquentes" defaultOpen>
          <FaqSection items={FAQ} />
        </AccordionSection>

        <AccordionSection title="À propos de ce simulateur">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            Ce simulateur s'appuie sur les règles générales du droit de la famille français et le barème indicatif de pension alimentaire publié par le Ministère de la Justice (2022). Il couvre les deux principaux régimes matrimoniaux : la <strong>communauté réduite aux acquêts</strong> (régime légal par défaut) et la <strong>séparation de biens</strong>.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            La <strong>prestation compensatoire</strong> est estimée par une formule indicative. En réalité, le juge dispose d'un large pouvoir d'appréciation et tient compte de nombreux facteurs : sacrifices professionnels d'un conjoint pour élever les enfants, état de santé, perspectives professionnelles, patrimoine existant, droits à la retraite futurs. Elle peut être nulle même avec un fort écart de revenus.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            <strong>Ce simulateur ne remplace pas un avocat.</strong> Pour toute situation réelle, consultez un avocat spécialisé en droit de la famille. De nombreux barreaux proposent une première consultation gratuite ou à tarif réduit.
          </p>
        </AccordionSection>

        <ShareBar url={shareUrl} title="Estimation financière divorce" />
      </div>
      <Footer />
    </div>
  );
}
