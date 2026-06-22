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
import {
  NumInput, StepperInput, AccordionSection,
  Chip, useAnimatedNumber, fmt, fmtEur,
  SimulateurHeader, FaqSection,
} from "../../components/ui.jsx"; // fmt utilisé dans le barème indicatif
import SimIcon from "../../data/simIcons.jsx";

// ─── Barème successoral 2025 ─────────────────────────────────────────────────
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
  { limit: 24_430,  rate: 0.35 },
  { limit: Infinity, rate: 0.45 },
];

const TRANCHES_NEVEUX = [
  { limit: Infinity, rate: 0.55 },
];

const TRANCHES_AUTRES = [
  { limit: Infinity, rate: 0.60 },
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

// abattements légaux par lien de parenté
const ABATTEMENTS = {
  enfant:   100_000,
  conjoint: 0,       // exonération totale
  frere:    15_932,
  neveu:    7_967,
  autre:    1_594,
};

function calcSuccession({ actifNet, lien, nbHeritiers, donations }) {
  nbHeritiers = Math.max(1, nbHeritiers);

  // Conjoint / PACS : exonération totale
  if (lien === "conjoint") {
    return {
      totalDroits: 0, droitsChaque: 0, partBrute: actifNet / nbHeritiers,
      abattementApplique: actifNet / nbHeritiers, partTaxable: 0,
      netChaque: actifNet / nbHeritiers, tauxEffectif: 0,
      tmi: 0, tranches: [],
    };
  }

  const partBrute = actifNet / nbHeritiers;
  const abattBase = ABATTEMENTS[lien] ?? 1_594;
  // Réduction des dons antérieurs (partagés entre tous les héritiers de même lien)
  const abattement = Math.max(0, abattBase - donations);
  const partTaxable = Math.max(0, partBrute - abattement);

  const tranches = lien === "frere" ? TRANCHES_FRERES
    : lien === "neveu" ? TRANCHES_NEVEUX
    : lien === "autre" ? TRANCHES_AUTRES
    : TRANCHES_DIRECTE; // enfant

  const droitsChaque = calcTranches(partTaxable, tranches);
  const totalDroits = droitsChaque * nbHeritiers;
  const netChaque = partBrute - droitsChaque;
  const tauxEffectif = actifNet > 0 ? totalDroits / actifNet : 0;

  // TMI (taux de la dernière tranche atteinte)
  let tmi = 0;
  let prev2 = 0;
  for (const { limit, rate } of tranches) {
    if (partTaxable > prev2) tmi = rate;
    prev2 = limit;
    if (partTaxable <= limit) break;
  }

  return {
    totalDroits, droitsChaque, partBrute, abattementApplique: abattement,
    partTaxable, netChaque, tauxEffectif, tmi,
  };
}

const LIEN_OPTIONS = [
  { value: "enfant",   label: "Enfant(s)" },
  { value: "conjoint", label: "Conjoint / Partenaire PACS" },
  { value: "frere",    label: "Frère / Sœur" },
  { value: "neveu",    label: "Neveu / Nièce" },
  { value: "autre",    label: "Autres (non lié, ami…)" },
];

const DEFAULT = { actifNet: 300_000, lien: "enfant", nbHeritiers: 2, donations: 0 };

function fromParams(p) {
  if (!p) return { ...DEFAULT };
  return {
    actifNet:    Number(p.a) || DEFAULT.actifNet,
    lien:        p.l || DEFAULT.lien,
    nbHeritiers: Number(p.n) || DEFAULT.nbHeritiers,
    donations:   Number(p.d) || DEFAULT.donations,
  };
}
function toParams(v) {
  return { a: v.actifNet, l: v.lien, n: v.nbHeritiers, d: v.donations };
}

const FAQ = [
  { q: "Comment fonctionne l'abattement pour un enfant ?", a: "Chaque enfant bénéficie d'un abattement de 100 000 € sur sa part successorale. Cet abattement se recharge tous les 15 ans. Les dons effectués dans les 15 années précédant le décès viennent en réduction de cet abattement." },
  { q: "Le conjoint est-il vraiment exonéré à 100 % ?", a: "Oui, depuis la loi TEPA de 2007, le conjoint survivant et le partenaire de PACS sont totalement exonérés de droits de succession, quelle que soit la valeur du patrimoine transmis." },
  { q: "Qu'est-ce que l'actif net successoral ?", a: "L'actif net successoral est la valeur totale du patrimoine transmis après déduction des dettes (emprunts immobiliers en cours, factures impayées, frais funéraires). C'est la base de calcul des droits." },
  { q: "Les dons antérieurs réduisent-ils l'abattement ?", a: "Oui : les donations effectuées dans les 15 ans précédant le décès s'imputent sur l'abattement disponible. Une donation de 50 000 € faite il y a 10 ans réduit l'abattement enfant de 100 000 € à 50 000 €. Au-delà de 15 ans, l'abattement est totalement rechargé." },
  { q: "Comment se calculent les droits entre frères et sœurs ?", a: "L'abattement est de 15 932 €. Les droits s'appliquent à taux de 35 % jusqu'à 24 430 € et 45 % au-delà. Ce taux élevé explique pourquoi les donations ou assurances-vie sont souvent utilisées pour transmettre à des collatéraux." },
  { q: "Peut-on réduire les droits de succession ?", a: "Oui, plusieurs stratégies existent : donations de son vivant (toutes les 15 ans, l'abattement se recharge), démembrement de propriété (donner la nue-propriété en conservant l'usufruit), assurance-vie (hors succession jusqu'à 152 500 € par bénéficiaire pour les primes versées avant 70 ans). Consultez un notaire pour votre situation." },
];

export default function Succession() {
  const [theme, setTheme] = useTheme();
  const init = useMemo(() => fromParams(readShareParams()), []);
  const [actifNet, setActifNet] = useState(init.actifNet);
  const [lien, setLien] = useState(init.lien);
  const [nbHeritiers, setNbHeritiers] = useState(init.nbHeritiers);
  const [donations, setDonations] = useState(init.donations);

  const vals = { actifNet, lien, nbHeritiers, donations };
  const res = useMemo(() => calcSuccession(vals), [actifNet, lien, nbHeritiers, donations]); // eslint-disable-line react-hooks/exhaustive-deps

  usePageMeta({
    title: "Simulateur Succession & Droits de Succession 2026 | simfinly.com",
    description: "Calculez les droits de succession selon le lien de parenté, l'actif net transmis et les donations antérieures. Barème officiel 2026 : enfants, conjoint, frères/sœurs, autres.",
  });

  const animDroits  = useAnimatedNumber(res.totalDroits);
  const animNet     = useAnimatedNumber(res.netChaque);
  const animTaux    = useAnimatedNumber(res.tauxEffectif * 100);

  const shareUrl = buildShareUrl(toParams(vals));

  const isExonere = lien === "conjoint";

  const heroColor = isExonere ? "#22c55e" : res.tauxEffectif < 0.1 ? "var(--gold)" : "#ef4444";

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Simulateur Succession 2026", url: "https://www.simfinly.com/simulateurs/succession", description: "Calculez les droits de succession selon le lien de parenté et le barème 2026.", applicationCategory: "FinanceApplication" }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/succession" size={34} />}
          title="Droits de succession"
          subtitle="Estimation · Barème 2026"
          desc="Calculez les droits à payer selon le lien de parenté, le patrimoine transmis et les donations antérieures. Abattements et barèmes légaux 2026."
          badge="Patrimoine · Succession"
        />

        <AdUnit slot="succession-top" style={{ marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>
          {/* ─── Formulaire ─── */}
          <div style={{ ...card }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 22 }}>Votre situation</h2>

            <NumInput
              id="actif-net"
              label="Actif net successoral"
              value={actifNet}
              onChange={v => { setActifNet(v); track("succession_actif"); }}
              unit="€"
              min={0}
              max={20_000_000}
              tooltip="Valeur totale du patrimoine transmis après déduction des dettes"
            />

            {/* Lien de parenté */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
                Lien de parenté
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {LIEN_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setLien(opt.value); track("succession_lien", { lien: opt.value }); }}
                    style={{
                      padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                      background: lien === opt.value ? "rgba(184,147,74,0.12)" : "transparent",
                      border: lien === opt.value ? "1.5px solid var(--border-gold)" : "1.5px solid var(--border)",
                      color: lien === opt.value ? "var(--gold)" : "var(--text)",
                      textAlign: "left", fontSize: 13, fontWeight: lien === opt.value ? 600 : 400,
                      fontFamily: "'Hanken Grotesk', sans-serif", transition: "all 0.15s",
                    }}
                  >
                    {opt.label}
                    {opt.value === "conjoint" && <span style={{ marginLeft: 8, fontSize: 11, color: "#22c55e" }}>✓ Exonéré</span>}
                    {opt.value === "enfant" && <span style={{ marginLeft: 8, fontSize: 11, color: "var(--text-secondary)" }}>100 k€/héritier</span>}
                  </button>
                ))}
              </div>
            </div>

            {lien !== "conjoint" && (
              <StepperInput
                label={lien === "enfant" ? "Nombre d'enfants" : "Nombre d'héritiers"}
                value={nbHeritiers}
                onChange={setNbHeritiers}
                min={1}
                max={10}
              />
            )}

            {lien !== "conjoint" && (
              <NumInput
                id="donations"
                label="Donations antérieures (15 dernières années)"
                value={donations}
                onChange={setDonations}
                unit="€"
                min={0}
                max={1_000_000}
                hint="Réduisent l'abattement disponible par héritier"
              />
            )}
          </div>

          {/* ─── Résultats ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Hero */}
            <div style={{ ...card, background: isExonere ? "rgba(34,197,94,0.07)" : "rgba(184,147,74,0.06)", border: `1px solid ${isExonere ? "rgba(34,197,94,0.3)" : "rgba(184,147,74,0.25)"}`, textAlign: "center", padding: "28px 22px" }}>
              {isExonere ? (
                <>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>✓</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: "#22c55e" }}>0 €</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>de droits de succession</div>
                  <div style={{ marginTop: 12, fontSize: 12, color: "#22c55e", background: "rgba(34,197,94,0.1)", borderRadius: 8, padding: "8px 12px" }}>
                    Le conjoint / partenaire PACS est totalement exonéré depuis 2007
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                    Total droits de succession
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: heroColor }}>
                    {fmtEur(animDroits)}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
                    taux effectif {animTaux.toFixed(1)} %
                  </div>
                </>
              )}
            </div>

            {/* Chips */}
            {!isExonere && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Chip label="Par héritier" value={fmtEur(res.droitsChaque)} />
                <Chip label="Net reçu / héritier" value={fmtEur(animNet)} />
                <Chip label="Abattement appliqué" value={fmtEur(res.abattementApplique)} />
                <Chip label="Part taxable / héritier" value={fmtEur(res.partTaxable)} />
              </div>
            )}

            {isExonere && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                <Chip label="Part reçue" value={fmtEur(res.netChaque)} />
              </div>
            )}

            {/* Détail calcul */}
            {!isExonere && (
              <AccordionSection title="Détail du calcul">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <tbody>
                    {[
                      ["Actif net successoral", fmtEur(actifNet)],
                      [`Part brute (÷ ${nbHeritiers})`, fmtEur(res.partBrute)],
                      ["Abattement légal", `− ${fmtEur(ABATTEMENTS[lien] ?? 0)}`],
                      donations > 0 ? ["Dons antérieurs imputés", `+ ${fmtEur(donations)}`] : null,
                      ["Part taxable", fmtEur(res.partTaxable)],
                      ["Droits / héritier", fmtEur(res.droitsChaque)],
                      [`TMI (taux marginal)`, `${(res.tmi * 100).toFixed(0)} %`],
                      ["Net reçu / héritier", fmtEur(res.netChaque)],
                      ["Total droits", fmtEur(res.totalDroits)],
                    ].filter(Boolean).map(([label, val], i) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "8px 0", color: "var(--text-secondary)" }}>{label}</td>
                        <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionSection>
            )}

            {/* Barème indicatif */}
            {!isExonere && lien === "enfant" && (
              <div style={{ ...card, padding: "16px 18px" }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10, fontWeight: 600 }}>Barème en ligne directe</div>
                {[
                  [0, 8_072, 5], [8_072, 12_109, 10], [12_109, 15_932, 15],
                  [15_932, 552_324, 20], [552_324, 902_838, 30],
                  [902_838, 1_805_677, 40], [1_805_677, null, 45],
                ].map(([from, to, rate]) => {
                  const inRange = res.partTaxable > from && (to === null || res.partTaxable > from);
                  const active = res.tmi * 100 === rate;
                  return (
                    <div key={rate} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 8px", borderRadius: 6, background: active ? "rgba(184,147,74,0.12)" : "transparent", color: active ? "var(--gold)" : "var(--text-secondary)", fontWeight: active ? 700 : 400 }}>
                      <span>{fmt(from)} → {to ? fmt(to) : "∞"} €</span>
                      <span>{rate} %</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ScenarioCompare */}
        <div style={{ marginTop: 28 }}>
          <ScenarioCompare
            name="succession"
            title="Comparer deux situations"
            cta="⚖️ Comparer un 2ᵉ scénario (ex : donation de votre vivant)"
            fields={[
              { key: "actifNet",  label: "Actif net", type: "num", unit: "€", min: 0, max: 20_000_000, kind: "eur" },
              { key: "donations", label: "Dons antérieurs", type: "num", unit: "€", min: 0, max: 1_000_000, kind: "eur" },
              { key: "nbHeritiers", label: "Nb héritiers", type: "step", min: 1, max: 10, step: 1 },
            ]}
            base={vals}
            compute={v => calcSuccession({ ...v, lien })}
            metrics={[
              { label: "Total droits", get: r => r.totalDroits, fmt: fmtEur, higherBetter: false },
              { label: "Net / héritier", get: r => r.netChaque,  fmt: fmtEur, higherBetter: true },
            ]}
          />
        </div>

        <AdUnit slot="succession-mid" style={{ margin: "24px 0" }} />

        {/* FAQ */}
        <AccordionSection title="Questions fréquentes" defaultOpen>
          <FaqSection items={FAQ} />
        </AccordionSection>

        {/* About */}
        <AccordionSection title="À propos des droits de succession">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            Les droits de succession sont calculés sur la valeur nette des biens transmis au décès, après abattements légaux qui varient selon le lien de parenté. Le barème est progressif : plus la part taxable est élevée, plus le taux marginal est fort — jusqu'à 45 % en ligne directe et 60 % pour des tiers non liés.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            L'abattement de 100 000 € par enfant (rechargeable tous les 15 ans) est le principal levier légal de réduction de la facture. Les donations effectuées de votre vivant consomment cet abattement mais permettent de transmettre en franchise de droits si elles respectent le délai de 15 ans avant le décès. Les dons jusqu'à 31 865 € (enfant majeur) ou 5 310 € (petit-enfant) peuvent même être totalement exonérés via le don familial.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            <strong>Ce simulateur est indicatif.</strong> Pour votre situation réelle, consultez un notaire ou un conseiller en gestion de patrimoine.
          </p>
        </AccordionSection>

        <ShareBar url={shareUrl} title="Droits de succession estimés" />
      </div>
      <Footer />
    </div>
  );
}
