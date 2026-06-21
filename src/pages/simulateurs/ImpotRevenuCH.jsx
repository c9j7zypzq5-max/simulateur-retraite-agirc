// Route à ajouter dans src/App.jsx :
//   <Route path="/ch/simulateurs/impot-revenu-ch" element={<ImpotRevenuCH />} />

import { useState, useMemo } from "react";
import { track } from "@vercel/analytics";
import { useTheme } from "../../hooks/useTheme.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import SimIcon from "../../data/simIcons.jsx";
import {
  NumInput, AccordionSection,
  Chip, useAnimatedNumber, fmt,
  SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";

// ─── Barème IFD 2025 (personnes seules, CHF) ─────────────────────────────────
// Source : AFC (Administration fédérale des contributions)
const BAREME_IFD_CELIBATAIRE = [
  { min: 0,       max: 18_000,  taux: 0.000 },
  { min: 18_000,  max: 32_000,  taux: 0.0077 },
  { min: 32_000,  max: 44_000,  taux: 0.0088 },
  { min: 44_000,  max: 58_000,  taux: 0.0264 },
  { min: 58_000,  max: 76_000,  taux: 0.0297 },
  { min: 76_000,  max: 110_000, taux: 0.0594 },
  { min: 110_000, max: 134_000, taux: 0.0660 },
  { min: 134_000, max: 176_000, taux: 0.0880 },
  { min: 176_000, max: 755_200, taux: 0.1150 },
  { min: 755_200, max: Infinity,taux: 0.1150 },
];

// Barème IFD 2025 (mariés / partenaires enregistrés)
// Tarif couple = tarif célibataire appliqué sur revenu/2 × 2 (splitting CH)
// Pour simplification : multiplicateur cantonal selon les cantons sélectionnés

const CANTONS = [
  { code: "VD", label: "Vaud", multiplicateurCantonal: 1.55, multiplicateurCommunal: 0.75 },
  { code: "GE", label: "Genève", multiplicateurCantonal: 1.40, multiplicateurCommunal: 0.55 },
  { code: "ZH", label: "Zurich", multiplicateurCantonal: 1.20, multiplicateurCommunal: 0.60 },
  { code: "BE", label: "Berne", multiplicateurCantonal: 1.65, multiplicateurCommunal: 0.70 },
  { code: "BS", label: "Bâle-Ville", multiplicateurCantonal: 1.50, multiplicateurCommunal: 0.50 },
  { code: "FR", label: "Fribourg", multiplicateurCantonal: 1.60, multiplicateurCommunal: 0.80 },
  { code: "NE", label: "Neuchâtel", multiplicateurCantonal: 1.70, multiplicateurCommunal: 0.65 },
];

function fmtCHF(val) {
  if (val === null || val === undefined || isNaN(val)) return "CHF 0";
  const rounded = Math.round(val);
  return "CHF " + rounded.toLocaleString("fr-CH");
}

function calcIFD(revenuImposable, marie) {
  // Pour les mariés : splitting (revenu / 2, impôt × 2)
  const revenuCalc = marie ? revenuImposable / 2 : revenuImposable;
  let impot = 0;
  for (const tranche of BAREME_IFD_CELIBATAIRE) {
    if (revenuCalc <= tranche.min) break;
    const base = Math.min(revenuCalc, tranche.max) - tranche.min;
    impot += base * tranche.taux;
  }
  return marie ? impot * 2 : impot;
}

// TMI fédéral
function tmiIFD(revenuImposable, marie) {
  const revenuCalc = marie ? revenuImposable / 2 : revenuImposable;
  let tmi = 0;
  for (const tranche of BAREME_IFD_CELIBATAIRE) {
    if (revenuCalc > tranche.min) tmi = tranche.taux;
  }
  return tmi;
}

function calcImpot({ revenuBrut, marie, canton }) {
  // Déductions courantes
  const fraisPro = Math.min(Math.max(revenuBrut * 0.03, 2_000), 4_000);
  const cotisationsAVS = revenuBrut * 0.053; // AVS/AI/APG salarié ≈ 5,3 %
  const primesLAMal = 3_600; // forfait annuel

  const deductions = fraisPro + cotisationsAVS + primesLAMal;
  const revenuImposable = Math.max(0, revenuBrut - deductions);

  // Impôt fédéral direct
  const impotFederal = calcIFD(revenuImposable, marie);

  // Impôt cantonal et communal (coefficients simplifiés par canton)
  const cantonData = CANTONS.find(c => c.code === canton) || CANTONS[0];
  const impotCantonal = impotFederal * cantonData.multiplicateurCantonal;
  const impotCommunal = impotFederal * cantonData.multiplicateurCommunal;

  const impotTotal = impotFederal + impotCantonal + impotCommunal;
  const tauxEffectif = revenuBrut > 0 ? (impotTotal / revenuBrut) * 100 : 0;
  const tmi = tmiIFD(revenuImposable, marie);

  return {
    fraisPro,
    cotisationsAVS,
    primesLAMal,
    deductions,
    revenuImposable,
    impotFederal,
    impotCantonal,
    impotCommunal,
    impotTotal,
    tauxEffectif,
    tmi,
    cantonLabel: cantonData.label,
  };
}

const FAQ = [
  {
    q: "Comment fonctionne l'impôt fédéral direct (IFD) en Suisse ?",
    a: "L'IFD est un impôt progressif prélevé par la Confédération sur le revenu net des personnes physiques. Le barème 2025 part de 0 % pour les revenus inférieurs à 18 000 CHF et monte à 11,5 % pour les revenus dépassant 176 000 CHF. Les couples mariés bénéficient du splitting : le revenu est divisé par deux, l'impôt calculé puis multiplié par deux, ce qui réduit l'effet de la progressivité.",
  },
  {
    q: "Qu'est-ce que l'impôt cantonal et l'impôt communal ?",
    a: "En plus de l'IFD, chaque canton et commune perçoit ses propres impôts sur le revenu, calculés sur la base du revenu imposable cantonal (qui peut différer légèrement de la base fédérale). Les taux varient fortement selon le canton : Zoug est le moins imposé, Neuchâtel parmi les plus élevés. Ce simulateur utilise une approximation basée sur un multiplicateur de l'IFD.",
  },
  {
    q: "Quelles déductions puis-je appliquer en Suisse ?",
    a: "Les principales déductions pour un salarié comprennent : les frais professionnels (forfait 3 % du salaire, min 2 000 CHF, max 4 000 CHF), les cotisations sociales obligatoires (AVS/AI/APG ≈ 5,3 % du salaire brut), les primes d'assurance maladie LAMal (déduction forfaitaire), les versements au pilier 3a (max 7 056 CHF), les intérêts de dettes et les frais de garde d'enfants.",
  },
  {
    q: "Pourquoi l'impôt varie-t-il autant selon le canton ?",
    a: "La Suisse applique le principe du fédéralisme fiscal : chaque canton fixe librement ses taux d'imposition. Un contribuable gagnant 100 000 CHF peut payer presque deux fois plus d'impôts à Neuchâtel qu'à Zoug. En plus du canton, la commune de domicile ajoute un impôt supplémentaire (multiplicateur communal). Ce système crée une concurrence fiscale entre cantons.",
  },
  {
    q: "Comment sont traités les couples mariés ?",
    a: "En Suisse fédérale, les couples mariés et partenaires enregistrés bénéficient d'un tarif préférentiel (tarif du ménage ou splitting). Pour l'IFD, le revenu commun est divisé par deux, l'impôt calculé sur cette moitié puis multiplié par deux — ce qui réduit l'imposition par rapport à deux célibataires. Attention : dans certains cantons, les couples mariés à deux revenus peuvent être défavorisés par rapport aux concubins.",
  },
];

const DEFAULT = { revenuBrut: 90_000, marie: false, canton: "VD" };

function fromParams(p) {
  return {
    revenuBrut: Number(p.get("r")) || DEFAULT.revenuBrut,
    marie:      p.get("m") === "1",
    canton:     p.get("c") || DEFAULT.canton,
  };
}
function toParams(v) {
  return { r: v.revenuBrut, m: v.marie ? "1" : "0", c: v.canton };
}

export default function ImpotRevenuCH() {
  const [theme, setTheme] = useTheme();
  const init = useMemo(() => fromParams(readShareParams()), []);
  const [revenuBrut, setRevenuBrut] = useState(init.revenuBrut);
  const [marie, setMarie]           = useState(init.marie);
  const [canton, setCanton]         = useState(init.canton);

  const vals = { revenuBrut, marie, canton };
  const res  = useMemo(() => calcImpot(vals), [revenuBrut, marie, canton]); // eslint-disable-line react-hooks/exhaustive-deps

  const shareUrl = buildShareUrl(toParams(vals));

  usePageMeta({
    title: "Simulateur impôt revenu Suisse 2025 — IFD + cantonal | simfinly.com",
    description: "Calculez votre impôt fédéral direct (IFD) et cantonal en Suisse 2025. Barème progressif, déductions AVS, frais professionnels, comparaison entre cantons.",
  });

  const animTotal = useAnimatedNumber(res.impotTotal);
  const animTaux  = useAnimatedNumber(res.tauxEffectif);

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px" };

  function fmtCHFAnim(val) {
    return "CHF " + Math.round(val).toLocaleString("fr-CH");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Simulateur impôt revenu Suisse 2025",
        url: "https://www.simfinly.com/ch/simulateurs/impot-revenu-ch",
        description: "Calculez votre IFD et impôt cantonal suisse selon les barèmes 2025.",
        applicationCategory: "FinanceApplication",
        inLanguage: "fr-CH",
      }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/impot-revenu-ch" size={34} />}
          title="Impôt sur le revenu"
          subtitle="Suisse · IFD + cantonal 2025"
          desc="Estimez votre impôt fédéral direct (IFD) et votre impôt cantonal et communal selon votre canton de domicile. Barème progressif, déductions automatiques (AVS, frais pro, LAMal)."
          badge="🇨🇭 Suisse · Fiscalité"
        />

        <div style={{ background: "rgba(43,92,230,0.06)", border: "1px solid rgba(43,92,230,0.18)", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "var(--text-secondary)" }}>
          ℹ️ Estimation simplifiée. L'impôt cantonal est calculé comme un multiplicateur de l'IFD — les barèmes cantonaux réels diffèrent. Les résultats sont indicatifs.
        </div>

        <AdUnit slot="impot-ch-top" style={{ marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>
          {/* ─── Formulaire ─── */}
          <div style={{ ...card }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 22 }}>Votre situation</h2>

            <NumInput
              id="revenu-ch"
              label="Revenu brut annuel (CHF)"
              value={revenuBrut}
              onChange={v => { setRevenuBrut(v); track("impot_ch_revenu"); }}
              unit="CHF"
              min={0}
              max={2_000_000}
              hint="Salaire brut avant déductions sociales"
            />

            {/* Situation */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Situation familiale</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { value: false, label: "Célibataire" },
                  { value: true,  label: "Marié(e)" },
                ].map(opt => (
                  <button
                    key={String(opt.value)}
                    onClick={() => { setMarie(opt.value); track("impot_ch_situation"); }}
                    style={{
                      flex: 1, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                      background: marie === opt.value ? "rgba(43,92,230,0.10)" : "transparent",
                      border: marie === opt.value ? "1.5px solid var(--primary)" : "1.5px solid var(--border)",
                      color: marie === opt.value ? "var(--primary)" : "var(--text)",
                      fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif",
                      fontWeight: marie === opt.value ? 600 : 400,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Canton */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Canton de domicile</div>
              <select
                value={canton}
                onChange={e => { setCanton(e.target.value); track("impot_ch_canton"); }}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 10, fontSize: 13,
                  background: "var(--card-bg)", border: "1.5px solid var(--border)",
                  color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif",
                  cursor: "pointer",
                }}
              >
                {CANTONS.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 6 }}>
                Multiplicateur cantonal approximatif (vs IFD)
              </div>
            </div>

            {/* Déductions appliquées */}
            <div style={{ padding: "12px 14px", background: "rgba(0,0,0,0.02)", borderRadius: 10, border: "1px solid var(--border)", fontSize: 12, color: "var(--text-secondary)" }}>
              <div style={{ marginBottom: 6, fontWeight: 600, color: "var(--text)" }}>Déductions automatiques</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span>Frais professionnels (forfait 3 %)</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>− {Math.round(res.fraisPro).toLocaleString("fr-CH")} CHF</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span>AVS/AI/APG (5,3 %)</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>− {Math.round(res.cotisationsAVS).toLocaleString("fr-CH")} CHF</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Primes LAMal (forfait)</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>− 3 600 CHF</span>
              </div>
            </div>
          </div>

          {/* ─── Résultats ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Hero */}
            <div style={{ ...card, background: "rgba(43,92,230,0.05)", border: "1px solid rgba(43,92,230,0.2)", textAlign: "center", padding: "28px 22px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                Impôt total estimé
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "var(--primary)" }}>
                {fmtCHFAnim(animTotal)}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
                taux effectif {animTaux.toFixed(1)} % · TMI fédéral {(res.tmi * 100).toFixed(1)} %
              </div>
            </div>

            {/* Chips */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Chip label="IFD (fédéral)" value={fmtCHF(res.impotFederal)} />
              <Chip label={`Cantonal (${res.cantonLabel})`} value={fmtCHF(res.impotCantonal)} />
              <Chip label="Communal" value={fmtCHF(res.impotCommunal)} />
              <Chip label="Revenu imposable" value={fmtCHF(res.revenuImposable)} />
            </div>

            {/* Détail */}
            <AccordionSection title="Détail du calcul">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {[
                    ["Revenu brut annuel", fmtCHF(revenuBrut)],
                    ["Frais professionnels", `− ${fmtCHF(res.fraisPro)}`],
                    ["Cotisations AVS/AI/APG", `− ${fmtCHF(res.cotisationsAVS)}`],
                    ["Primes LAMal (forfait)", "− CHF 3 600"],
                    ["Revenu imposable", fmtCHF(res.revenuImposable)],
                    marie ? ["Splitting (÷ 2 pour IFD)", fmtCHF(res.revenuImposable / 2)] : null,
                    ["Impôt fédéral direct (IFD)", fmtCHF(res.impotFederal)],
                    [`Impôt cantonal (${res.cantonLabel})`, fmtCHF(res.impotCantonal)],
                    ["Impôt communal", fmtCHF(res.impotCommunal)],
                    ["Total impôt sur le revenu", fmtCHF(res.impotTotal)],
                    ["Taux effectif", `${res.tauxEffectif.toFixed(1)} %`],
                  ].filter(Boolean).map(([label, val], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "8px 0", color: "var(--text-secondary)" }}>{label}</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AccordionSection>

            {/* Barème IFD */}
            <div style={{ ...card, padding: "16px 18px" }}>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10, fontWeight: 600 }}>Barème IFD 2025 (célibataire)</div>
              {[
                [0, 18_000, 0],
                [18_000, 32_000, 0.77],
                [32_000, 44_000, 0.88],
                [44_000, 58_000, 2.64],
                [58_000, 76_000, 2.97],
                [76_000, 110_000, 5.94],
                [110_000, 134_000, 6.60],
                [134_000, 176_000, 8.80],
                [176_000, null, 11.50],
              ].map(([from, to, rate]) => {
                const revCalc = marie ? res.revenuImposable / 2 : res.revenuImposable;
                const active = revCalc > from && (to === null || revCalc <= to) && res.revenuImposable > 0;
                return (
                  <div key={rate + from} style={{
                    display: "flex", justifyContent: "space-between", fontSize: 12,
                    padding: "4px 8px", borderRadius: 6,
                    background: active ? "rgba(43,92,230,0.10)" : "transparent",
                    color: active ? "var(--primary)" : "var(--text-secondary)",
                    fontWeight: active ? 700 : 400,
                  }}>
                    <span>{fmt(from)} → {to ? fmt(to) : "∞"} CHF</span>
                    <span>{rate} %</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <AdUnit slot="impot-ch-mid" style={{ margin: "24px 0" }} />

        <AccordionSection title="Questions fréquentes" defaultOpen>
          <FaqSection items={FAQ} />
        </AccordionSection>

        <AccordionSection title="À propos de l'impôt suisse sur le revenu">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            En Suisse, les particuliers sont soumis à trois niveaux d'imposition sur le revenu : l'<strong>impôt fédéral direct (IFD)</strong>, prélevé par la Confédération avec un barème unique pour toute la Suisse ; l'<strong>impôt cantonal</strong>, dont les taux et barèmes varient fortement d'un canton à l'autre ; et l'<strong>impôt communal</strong>, calculé comme un pourcentage de l'impôt cantonal. La déclaration fiscale est annuelle et se fait au lieu de domicile au 31 décembre.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            <strong>Ce simulateur est une estimation indicative.</strong> Les barèmes cantonaux et communaux réels diffèrent du modèle simplifié utilisé ici (multiplicateur de l'IFD). Pour un calcul précis, utilisez le calculateur officiel de l'AFC (estv.admin.ch) ou celui de votre canton.
          </p>
        </AccordionSection>
      </div>
      <Footer />
    </div>
  );
}
