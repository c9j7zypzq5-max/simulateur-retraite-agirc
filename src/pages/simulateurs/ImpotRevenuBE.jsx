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
  NumInput, StepperInput, AccordionSection,
  Chip, Toggle, useAnimatedNumber, fmt, fmtEur,
  SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";

// ─── Barème IPP belge 2025 (exercice d'imposition 2025, revenus 2024) ─────────
const BAREME_BE = [
  { min: 0,      max: 15_820, taux: 0.25 },
  { min: 15_820, max: 27_920, taux: 0.40 },
  { min: 27_920, max: 48_320, taux: 0.45 },
  { min: 48_320, max: Infinity, taux: 0.50 },
];

// Quotité exemptée supplémentaire par enfant à charge (2025)
const QUOTITE_ENFANTS = [0, 1_990, 3_140, 4_720, 6_300];
const QUOTITE_BASE = 10_160; // quotité de base par contribuable

function fraisProfForfait(revenu) {
  // Forfait simplifié : 30 % plafonné à 5 040 € (approximation EI 2025)
  return Math.min(revenu * 0.30, 5_040);
}

function calcBracketsRaw(income) {
  let tax = 0;
  for (const { min, max, taux } of BAREME_BE) {
    if (income <= min) break;
    tax += (Math.min(income, max) - min) * taux;
  }
  return tax;
}

function calcIPP({ revenu, situation, nbEnfants, tauxCommunaux, fraisReels, quotientConjugal }) {
  const fraisPro = fraisReels !== null && fraisReels !== undefined
    ? fraisReels
    : fraisProfForfait(revenu);

  const revenuNet = Math.max(0, revenu - fraisPro);

  // Quotient conjugal : 30 % transféré au conjoint (plafond 12 550 €)
  let quotientAmount = 0;
  let revenuContrib = revenuNet;
  if (situation === 'marie' && quotientConjugal) {
    quotientAmount = Math.min(revenuNet * 0.30, 12_550);
    revenuContrib = revenuNet - quotientAmount;
  }

  // Quotité exemptée = base + enfants → réduction d'impôt au taux de la 1ʳᵉ tranche
  const extraEnfants = QUOTITE_ENFANTS[Math.min(nbEnfants, 4)];
  const quotiteTotal = QUOTITE_BASE + extraEnfants;
  const reductionQuotite = quotiteTotal * 0.25;

  const ippFederal = Math.max(0, calcBracketsRaw(revenuContrib) - reductionQuotite);
  const communales = ippFederal * (tauxCommunaux / 100);
  const ippTotal = ippFederal + communales;

  // TMI : taux de la dernière tranche atteinte
  let tmi = 0;
  for (const { min, taux } of BAREME_BE) {
    if (revenuContrib > min) tmi = taux;
  }
  const tauxMoyen = revenu > 0 ? ippTotal / revenu * 100 : 0;

  return {
    fraisPro, revenuNet, revenuContrib, quotiteTotal, reductionQuotite,
    ippFederal, communales, ippTotal, tmi, tauxMoyen, quotientAmount,
  };
}

const SITUATION_OPTIONS = [
  { value: "isole",  label: "Isolé(e)" },
  { value: "marie",  label: "Marié(e) / Cohabitant légal" },
];

const DEFAULT = { revenu: 45_000, situation: "isole", nbEnfants: 0, tauxCommunaux: 7, fraisReels: null, quotientConjugal: false };

function fromParams(p) {
  return {
    revenu:           Number(p.get("r")) || DEFAULT.revenu,
    situation:        p.get("s") || DEFAULT.situation,
    nbEnfants:        Number(p.get("e")) || DEFAULT.nbEnfants,
    tauxCommunaux:    Number(p.get("tc")) || DEFAULT.tauxCommunaux,
    fraisReels:       p.get("fr") ? Number(p.get("fr")) : null,
    quotientConjugal: p.get("qc") === "1",
  };
}
function toParams(v) {
  return {
    r: v.revenu, s: v.situation, e: v.nbEnfants, tc: v.tauxCommunaux,
    fr: v.fraisReels ?? "", qc: v.quotientConjugal ? "1" : "0",
  };
}

const FAQ = [
  { q: "Quelle est la différence entre l'IPP et l'IR français ?", a: "L'IPP (Impôt des Personnes Physiques) est l'impôt belge sur le revenu. Il comporte 4 tranches (25 %, 40 %, 45 %, 50 %) contre 5 tranches en France. Le taux marginal maximum est de 50 % en Belgique vs 45 % en France. L'IPP comprend aussi des centimes additionnels communaux (en moyenne 7 %) qui s'ajoutent à l'impôt fédéral." },
  { q: "Qu'est-ce que la quotité exemptée d'impôt ?", a: "La quotité exemptée est la tranche de revenu totalement exonérée d'IPP. Elle s'élève à 10 160 € de base (EI 2025) pour chaque contribuable. Elle se traduit par une réduction d'impôt calculée au taux de 25 %. Des majorations s'appliquent en fonction du nombre d'enfants à charge." },
  { q: "Comment fonctionne le quotient conjugal ?", a: "Le quotient conjugal permet au conjoint qui gagne davantage de transférer 30 % de son revenu (plafonné à 12 550 €) vers son partenaire, chacun étant ensuite imposé séparément. Cela réduit l'imposition globale du ménage en limitant l'effet de la progressivité. Il ne s'applique que si le revenu du partenaire est inférieur à 30 % du total du ménage." },
  { q: "Que sont les centimes additionnels communaux ?", a: "Les communes belges perçoivent un pourcentage supplémentaire calculé sur l'impôt fédéral (en général entre 0 % et 9 %). La moyenne nationale est d'environ 7 %. Certaines communes (Lasne, Koksijde…) ont des taux très bas ; d'autres (Liège, Mons…) approchent le maximum. Ce taux est indiqué sur votre avertissement-extrait de rôle." },
  { q: "Qu'est-ce que le forfait de frais professionnels ?", a: "En Belgique, les frais professionnels peuvent être déduits de façon forfaitaire (30 % du revenu, plafond ~5 040 €) ou au réel si vos dépenses professionnelles sont supérieures. Le forfait est automatiquement appliqué si vous ne déclarez pas vos frais réels. Les travailleurs indépendants ont un calcul différent." },
];

export default function ImpotRevenuBE() {
  const [theme, setTheme] = useTheme();
  const init = useMemo(() => fromParams(readShareParams()), []);
  const [revenu, setRevenu]                   = useState(init.revenu);
  const [situation, setSituation]             = useState(init.situation);
  const [nbEnfants, setNbEnfants]             = useState(init.nbEnfants);
  const [tauxCommunaux, setTauxCommunaux]     = useState(init.tauxCommunaux);
  const [fraisReelMode, setFraisReelMode]     = useState(init.fraisReels !== null);
  const [fraisReels, setFraisReels]           = useState(init.fraisReels ?? 0);
  const [quotientConjugal, setQuotientConjugal] = useState(init.quotientConjugal);

  const vals = {
    revenu, situation, nbEnfants, tauxCommunaux,
    fraisReels: fraisReelMode ? fraisReels : null,
    quotientConjugal: situation === 'marie' ? quotientConjugal : false,
  };

  const res = useMemo(() => calcIPP(vals), [revenu, situation, nbEnfants, tauxCommunaux, fraisReelMode, fraisReels, quotientConjugal]); // eslint-disable-line react-hooks/exhaustive-deps
  const shareUrl = buildShareUrl(toParams(vals));

  usePageMeta({
    title: "Simulateur IPP belge 2026 — Impôt sur le revenu Belgique | simfinly.com",
    description: "Calculez votre impôt belge (IPP) 2025 : 4 tranches (25–50 %), quotité exemptée, frais professionnels, centimes additionnels communaux et quotient conjugal.",
  });

  const animIPP  = useAnimatedNumber(res.ippTotal);
  const animTaux = useAnimatedNumber(res.tauxMoyen);

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Simulateur IPP Belgique 2025", url: "https://www.simfinly.com/be/simulateurs/impot-revenu", description: "Calculez votre IPP belge selon les barèmes 2026.", applicationCategory: "FinanceApplication", inLanguage: "fr-BE" }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/impot-revenu" size={34} />}
          title="IPP — Impôt sur le revenu"
          subtitle="Belgique · EI 2025 (revenus 2024)"
          desc="Estimez votre IPP selon le barème belge : 4 tranches progressives (25–50 %), quotité exemptée, centimes additionnels communaux et quotient conjugal."
          badge="🇧🇪 Belgique · Fiscalité"
        />

        {/* Note informationnelle */}
        <div style={{ background: "rgba(43,92,230,0.06)", border: "1px solid rgba(43,92,230,0.18)", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "var(--text-secondary)" }}>
          💡 Entrez votre <strong>revenu professionnel brut annuel</strong> (avant déduction des frais pro mais après ONSS si vous êtes salarié — correspond à la case 250 de votre déclaration fiscale).
        </div>

        <AdUnit slot="ipp-be-top" style={{ marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>
          {/* ─── Formulaire ─── */}
          <div style={{ ...card }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 22 }}>Votre situation</h2>

            <NumInput
              id="revenu-be"
              label="Revenu professionnel annuel brut"
              value={revenu}
              onChange={v => { setRevenu(v); track("ipp_be_revenu"); }}
              unit="€"
              min={0}
              max={500_000}
              tooltip="Revenu avant frais professionnels, après cotisations ONSS (case 250 de la déclaration)"
            />

            {/* Situation */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Situation</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {SITUATION_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSituation(opt.value); if (opt.value === 'isole') setQuotientConjugal(false); }}
                    style={{
                      flex: 1, padding: "9px 12px", borderRadius: 10, cursor: "pointer",
                      background: situation === opt.value ? "rgba(43,92,230,0.10)" : "transparent",
                      border: situation === opt.value ? "1.5px solid var(--primary)" : "1.5px solid var(--border)",
                      color: situation === opt.value ? "var(--primary)" : "var(--text)",
                      fontSize: 13, fontWeight: situation === opt.value ? 600 : 400,
                      fontFamily: "'Hanken Grotesk', sans-serif",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quotient conjugal */}
            {situation === 'marie' && (
              <div style={{ marginBottom: 20, padding: "10px 14px", background: "rgba(43,92,230,0.05)", borderRadius: 10, border: "1px solid var(--border)" }}>
                <Toggle
                  label="Quotient conjugal applicable"
                  checked={quotientConjugal}
                  onChange={setQuotientConjugal}
                />
                <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 6 }}>
                  30 % transféré au conjoint (max 12 550 €) — si revenu du conjoint {"<"} 30 % du total
                </div>
              </div>
            )}

            <StepperInput
              label="Enfants à charge"
              value={nbEnfants}
              onChange={setNbEnfants}
              min={0}
              max={6}
            />

            <NumInput
              id="taux-communaux"
              label="Centimes additionnels communaux"
              value={tauxCommunaux}
              onChange={setTauxCommunaux}
              unit="%"
              min={0}
              max={10}
              step={0.5}
              hint="Varie selon votre commune (0–9 %). Moyenne nationale ≈ 7 %"
            />

            {/* Frais professionnels */}
            <div style={{ marginBottom: 20, padding: "10px 14px", background: "rgba(0,0,0,0.02)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <Toggle
                label="Frais professionnels réels (au lieu du forfait)"
                checked={fraisReelMode}
                onChange={v => { setFraisReelMode(v); track("ipp_be_frais_reels"); }}
              />
              {fraisReelMode ? (
                <NumInput
                  id="frais-reels"
                  label="Frais réels déclarés"
                  value={fraisReels}
                  onChange={setFraisReels}
                  unit="€"
                  min={0}
                  max={100_000}
                  hint="Montant total des frais professionnels réels"
                />
              ) : (
                <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 8 }}>
                  Forfait appliqué : {fmtEur(res.fraisPro)} (30 %, max 5 040 €)
                </div>
              )}
            </div>
          </div>

          {/* ─── Résultats ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Hero */}
            <div style={{ ...card, background: "rgba(43,92,230,0.05)", border: "1px solid rgba(43,92,230,0.2)", textAlign: "center", padding: "28px 22px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                IPP total (fédéral + communal)
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "var(--primary)" }}>
                {fmtEur(animIPP)}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
                taux moyen {animTaux.toFixed(1)} % · TMI {(res.tmi * 100).toFixed(0)} %
              </div>
            </div>

            {/* Chips */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Chip label="IPP fédéral" value={fmtEur(res.ippFederal)} />
              <Chip label="Centimes communaux" value={fmtEur(res.communales)} />
              <Chip label="Revenu net imposable" value={fmtEur(res.revenuNet)} />
              <Chip label="Quotité exemptée" value={fmtEur(res.quotiteTotal)} />
            </div>

            {/* Détail */}
            <AccordionSection title="Détail du calcul">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {[
                    ["Revenu brut déclaré", fmtEur(revenu)],
                    ["Frais professionnels", `− ${fmtEur(res.fraisPro)}`],
                    res.quotientAmount > 0 ? ["Quotient conjugal transféré", `− ${fmtEur(res.quotientAmount)}`] : null,
                    ["Revenu net imposable", fmtEur(res.revenuContrib)],
                    ["Quotité exemptée (×25%)", `− ${fmtEur(res.reductionQuotite)}`],
                    ["IPP fédéral", fmtEur(res.ippFederal)],
                    [`Centimes communaux (${tauxCommunaux}%)`, fmtEur(res.communales)],
                    ["IPP total", fmtEur(res.ippTotal)],
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
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10, fontWeight: 600 }}>Barème IPP belge 2025</div>
              {[
                [0, 15_820, 25], [15_820, 27_920, 40],
                [27_920, 48_320, 45], [48_320, null, 50],
              ].map(([from, to, rate]) => {
                const active = res.tmi * 100 === rate && res.revenuContrib > 0;
                return (
                  <div key={rate} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 8px", borderRadius: 6, background: active ? "rgba(43,92,230,0.10)" : "transparent", color: active ? "var(--primary)" : "var(--text-secondary)", fontWeight: active ? 700 : 400 }}>
                    <span>{fmt(from)} → {to ? fmt(to) : "∞"} €</span>
                    <span>{rate} %</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Comparaison de scénarios */}
        <div style={{ marginTop: 28 }}>
          <ScenarioCompare
            name="ipp-be"
            title="Comparer deux situations fiscales"
            cta="📊 Comparer avec une autre situation (ex : changement de commune)"
            fields={[
              { key: "revenu",       label: "Revenu annuel",     type: "num",  unit: "€", min: 0, max: 500_000, kind: "eur" },
              { key: "tauxCommunaux",label: "Centimes communaux",type: "num",  unit: "%", min: 0, max: 10 },
              { key: "nbEnfants",    label: "Enfants à charge",  type: "step", min: 0, max: 6, step: 1 },
            ]}
            base={vals}
            compute={v => calcIPP({ ...v, fraisReels: fraisReelMode ? fraisReels : null })}
            metrics={[
              { label: "IPP total", get: r => r.ippTotal, fmt: fmtEur, higherBetter: false },
              { label: "Taux moyen", get: r => r.tauxMoyen, fmt: v => `${v.toFixed(1)} %`, higherBetter: false },
            ]}
          />
        </div>

        <AdUnit slot="ipp-be-mid" style={{ margin: "24px 0" }} />

        <AccordionSection title="Questions fréquentes" defaultOpen>
          <FaqSection items={FAQ} />
        </AccordionSection>

        <AccordionSection title="À propos de l'IPP belge">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            L'IPP (Impôt des Personnes Physiques) est l'impôt belge sur les revenus des particuliers. Il se compose d'un <strong>impôt fédéral</strong> calculé sur un barème progressif à 4 tranches (25 %, 40 %, 45 %, 50 %) et d'une <strong>part communale</strong> (centimes additionnels), fixée par chaque commune. Le calcul tient compte d'une quotité exemptée d'impôt (10 160 € de base en EI 2025), éventuellement majorée pour les enfants à charge.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            Pour les travailleurs salariés, les cotisations ONSS (13,07 % du brut) ne sont pas reprises ici — elles sont déduites avant la déclaration fiscale. Ce simulateur traite donc du <em>revenu professionnel brut déclaré</em> (après ONSS), auquel on déduit ensuite les frais professionnels (forfait ou réels). <strong>Ce calcul est une estimation indicative. Pour votre situation réelle, consultez un comptable ou votre bureau des contributions.</strong>
          </p>
        </AccordionSection>

        <ShareBar url={shareUrl} title="Mon IPP belge estimé" />
      </div>
      <Footer />
    </div>
  );
}
