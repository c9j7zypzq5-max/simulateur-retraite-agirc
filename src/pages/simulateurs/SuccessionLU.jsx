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
import SimIcon from "../../data/simIcons.jsx";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, useAnimatedNumber, fmtEur,
  SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";
import { FAQS } from '../../data/faqs.js';

// ─── Droits de succession luxembourgeois ───────────────────────────────────
// Source : Administration de l'enregistrement, des domaines et de la TVA
// (portail pfi.public.lu). Taux de base par lien de parenté, appliqués à la
// part légale de chaque héritier ; majoration progressive au-delà de
// 10 000 € de part nette taxable (non applicable à la ligne directe ni au
// conjoint, exonérés). Les paliers intermédiaires de la majoration sont
// interpolés linéairement entre les bornes publiées (estimation indicative).
const TAUX_BASE_LU = {
  directe:    0,     // enfants, petits-enfants, ascendants — exonérés (dévolution légale)
  conjoint:   0,     // conjoint marié, ou partenaire enregistré depuis 3 ans+ — exonéré
  frere:      0.06,  // frères et sœurs
  oncleNeveu: 0.09,  // oncles/tantes ↔ neveux/nièces
  autre:      0.15,  // autres parents éloignés ou tiers sans lien de parenté
};

function lerp(x, x0, x1, y0, y1) {
  return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
}

// Multiplicateur de majoration (ex. 1.4 = part taxée à 240 % du taux de base)
// selon la part nette taxable de l'héritier.
function majorationMultiplier(part) {
  if (part <= 10_000) return 0;
  if (part <= 20_000) return 0.1;
  if (part <= 30_000) return 0.2;
  if (part <= 100_000) return lerp(part, 30_000, 100_000, 0.3, 0.6);
  if (part <= 250_000) return lerp(part, 100_000, 250_000, 0.7, 0.9);
  if (part <= 1_000_000) return lerp(part, 250_000, 1_000_000, 1.2, 1.7);
  if (part <= 1_750_000) return lerp(part, 1_000_000, 1_750_000, 1.8, 2.0);
  return 2.2;
}

function calcSuccessionLU({ actifNet, lien, nbHeritiers }) {
  nbHeritiers = Math.max(1, nbHeritiers);
  const partBrute = actifNet / nbHeritiers;

  if (lien === 'directe' || lien === 'conjoint') {
    return { totalDroits: 0, droitsChaque: 0, partBrute, netChaque: partBrute, tauxEffectif: 0, majoration: 0, tauxEffectifPart: 0 };
  }

  const tauxBase = TAUX_BASE_LU[lien];
  const majoration = majorationMultiplier(partBrute);
  const tauxEffectifPart = tauxBase * (1 + majoration);
  const droitsChaque = partBrute * tauxEffectifPart;
  const totalDroits = droitsChaque * nbHeritiers;
  const netChaque = partBrute - droitsChaque;
  const tauxEffectif = actifNet > 0 ? totalDroits / actifNet : 0;

  return { totalDroits, droitsChaque, partBrute, netChaque, tauxEffectif, majoration, tauxEffectifPart };
}

const LIEN_OPTIONS = [
  { value: "directe",    label: "Enfant(s) / Ligne directe" },
  { value: "conjoint",   label: "Conjoint / Partenaire" },
  { value: "frere",      label: "Frère / Sœur" },
  { value: "oncleNeveu", label: "Oncle-tante ↔ neveu-nièce" },
  { value: "autre",      label: "Autres (ami, tiers…)" },
];

const DEFAULT = { actifNet: 250_000, lien: "directe", nbHeritiers: 2 };

function fromParams(p) {
  if (!p) return { ...DEFAULT };
  return {
    actifNet:    Number(p.a) || DEFAULT.actifNet,
    lien:        p.l || DEFAULT.lien,
    nbHeritiers: Number(p.n) || DEFAULT.nbHeritiers,
  };
}
function toParams(v) {
  return { a: v.actifNet, l: v.lien, n: v.nbHeritiers };
}

const FAQ = FAQS['/simulateurs/succession-lu'];

export default function SuccessionLU() {
  const [theme, setTheme] = useTheme();
  const init = useMemo(() => fromParams(readShareParams()), []);
  const [actifNet, setActifNet]       = useState(init.actifNet);
  const [lien, setLien]               = useState(init.lien);
  const [nbHeritiers, setNbHeritiers] = useState(init.nbHeritiers);

  const vals = { actifNet, lien, nbHeritiers };
  const res  = useMemo(() => calcSuccessionLU(vals), [actifNet, lien, nbHeritiers]); // eslint-disable-line react-hooks/exhaustive-deps

  usePageMeta(
    "Simulateur droits de succession Luxembourg 2026 — ligne directe, conjoint | simfinly.com",
    "Estimez les droits de succession luxembourgeois selon le lien de parenté : exonération en ligne directe et conjoint, barème progressif pour les autres héritiers."
  );

  const animDroits = useAnimatedNumber(res.totalDroits);
  const animNet    = useAnimatedNumber(res.netChaque);
  const animTaux   = useAnimatedNumber(res.tauxEffectif * 100);

  const shareUrl = buildShareUrl(toParams(vals));
  const isExonere = lien === "directe" || lien === "conjoint";
  const heroColor = isExonere ? "#22c55e" : res.tauxEffectif < 0.08 ? "var(--gold)" : "#ef4444";

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Simulateur Succession Luxembourg 2026", url: "https://www.simfinly.com/lu/simulateurs/succession-lu", description: "Calculez les droits de succession luxembourgeois selon le lien de parenté.", applicationCategory: "FinanceApplication", inLanguage: "fr-LU" }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/succession" size={34} />}
          title="Droits de succession"
          subtitle="Luxembourg · Barème 2026"
          desc="Estimez les droits de succession luxembourgeois selon le lien de parenté. La ligne directe (enfants, petits-enfants) et le conjoint sont totalement exonérés ; les autres héritiers sont taxés selon un barème progressif au-delà de 10 000 € de part nette."
          badge="🇱🇺 Luxembourg · Succession"
        />

        {/* Avertissement */}
        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "var(--text-secondary)" }}>
          ⚠️ La majoration progressive au-delà de 10 000 € est estimée par interpolation entre les paliers publiés. Pour le montant exact, consultez le barème officiel sur pfi.public.lu ou un notaire.
        </div>

        <AdUnit slot="succession-lu-top" style={{ marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>
          {/* ─── Formulaire ─── */}
          <div style={{ ...card }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 22 }}>Votre situation</h2>

            <NumInput
              id="actif-net-lu"
              label="Actif net successoral"
              value={actifNet}
              onChange={v => { setActifNet(v); track("succession_lu_actif"); }}
              unit="€"
              min={0}
              max={20_000_000}
              tooltip="Valeur totale du patrimoine transmis après déduction des dettes"
            />

            {/* Lien de parenté */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Lien de parenté</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {LIEN_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setLien(opt.value)}
                    style={{
                      padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                      background: lien === opt.value ? "rgba(184,147,74,0.12)" : "transparent",
                      border: lien === opt.value ? "1.5px solid var(--border-gold)" : "1.5px solid var(--border)",
                      color: lien === opt.value ? "var(--gold)" : "var(--text)",
                      textAlign: "left", fontSize: 13, fontWeight: lien === opt.value ? 600 : 400,
                      fontFamily: "'Hanken Grotesk', sans-serif",
                    }}
                  >
                    {opt.label}
                    {(opt.value === "directe" || opt.value === "conjoint") && <span style={{ marginLeft: 8, fontSize: 11, color: "#22c55e" }}>✓ Exonéré</span>}
                    {opt.value !== "directe" && opt.value !== "conjoint" && (
                      <span style={{ marginLeft: 8, fontSize: 11, color: "var(--text-secondary)" }}>{(TAUX_BASE_LU[opt.value] * 100).toFixed(0)} % de base</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {!isExonere && (
              <StepperInput
                label="Nombre d'héritiers"
                value={nbHeritiers}
                onChange={setNbHeritiers}
                min={1}
                max={10}
              />
            )}
          </div>

          {/* ─── Résultats ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ ...card, background: isExonere ? "rgba(34,197,94,0.07)" : "rgba(184,147,74,0.06)", border: `1px solid ${isExonere ? "rgba(34,197,94,0.3)" : "rgba(184,147,74,0.25)"}`, textAlign: "center", padding: "28px 22px" }}>
              {isExonere ? (
                <>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>✓</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: "#22c55e" }}>0 €</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>de droits de succession</div>
                  <div style={{ marginTop: 12, fontSize: 12, color: "#22c55e", background: "rgba(34,197,94,0.1)", borderRadius: 8, padding: "8px 12px" }}>
                    Exonération totale — {lien === 'conjoint' ? 'conjoint / partenaire' : 'ligne directe'} (dévolution légale)
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

            {!isExonere && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Chip label="Par héritier" value={fmtEur(res.droitsChaque)} />
                <Chip label="Net reçu / héritier" value={fmtEur(animNet)} />
                <Chip label="Part successorale" value={fmtEur(res.partBrute)} />
                <Chip label="Taux appliqué / part" value={`${(res.tauxEffectifPart * 100).toFixed(1)} %`} />
              </div>
            )}

            {!isExonere && (
              <div style={{ ...card, padding: "16px 18px" }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10, fontWeight: 600 }}>
                  Décomposition — {LIEN_OPTIONS.find(o => o.value === lien)?.label}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 8px", color: "var(--text-secondary)" }}>
                  <span>Taux de base</span>
                  <span>{(TAUX_BASE_LU[lien] * 100).toFixed(0)} %</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 8px", color: "var(--text-secondary)" }}>
                  <span>Majoration (part &gt; 10 000 €)</span>
                  <span>+{(res.majoration * 100).toFixed(0)} %</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 8px", borderRadius: 6, background: "rgba(184,147,74,0.10)", color: "var(--gold)", fontWeight: 700 }}>
                  <span>Taux effectif sur la part</span>
                  <span>{(res.tauxEffectifPart * 100).toFixed(1)} %</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <AdUnit slot="succession-lu-mid" style={{ margin: "24px 0" }} />

        <AccordionSection title="Questions fréquentes" defaultOpen>
          <FaqSection items={FAQ} />
        </AccordionSection>

        <AccordionSection title="À propos des droits de succession luxembourgeois">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            Au Luxembourg, les droits de succession sont particulièrement favorables en <strong>ligne directe</strong> : la part reçue par les enfants et petits-enfants, en dévolution légale, est totalement exonérée. Le <strong>conjoint marié</strong> et le partenaire lié par une déclaration de partenariat enregistrée depuis au moins 3 ans sont également exonérés. Les frères et sœurs sont taxés à 6 % de base, les oncles/tantes et neveux/nièces à 9 %, et les tiers sans lien de parenté à 15 %.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            Au-delà de 10 000 € de part nette taxable, ces taux de base sont majorés selon un barème progressif pouvant multiplier le taux jusqu'à 2,2 fois pour les parts dépassant 1 750 000 €. Cette majoration ne s'applique jamais à la part légale des héritiers en ligne directe ou du conjoint, déjà exonérée. <strong>Ce simulateur est indicatif.</strong> Pour votre situation réelle, consultez un notaire ou l'Administration de l'enregistrement, des domaines et de la TVA.
          </p>
        </AccordionSection>

        <ShareBar url={shareUrl} title="Droits de succession luxembourgeois estimés" />
      </div>
      <Footer />
    </div>
  );
}
