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
  Chip, useAnimatedNumber, fmt, fmtEur,
  SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";

// ─── Barèmes droits de succession belges par région ───────────────────────────
// Source : SPF Finance / portails régionaux (en vigueur 2024)
const BAREME_WAL = {
  directe: [
    { limit: 12_500,  rate: 0.03 },
    { limit: 25_000,  rate: 0.04 },
    { limit: 50_000,  rate: 0.05 },
    { limit: 100_000, rate: 0.07 },
    { limit: 150_000, rate: 0.10 },
    { limit: 200_000, rate: 0.14 },
    { limit: 250_000, rate: 0.18 },
    { limit: 500_000, rate: 0.24 },
    { limit: Infinity, rate: 0.30 },
  ],
  frere: [
    { limit: 12_500,  rate: 0.20 },
    { limit: 25_000,  rate: 0.25 },
    { limit: 75_000,  rate: 0.35 },
    { limit: 175_000, rate: 0.50 },
    { limit: Infinity, rate: 0.65 },
  ],
  autre: [
    { limit: 12_500,  rate: 0.30 },
    { limit: 25_000,  rate: 0.35 },
    { limit: 75_000,  rate: 0.60 },
    { limit: Infinity, rate: 0.80 },
  ],
};

const BAREME_BXL = {
  directe: [
    { limit: 50_000,  rate: 0.03 },
    { limit: 100_000, rate: 0.08 },
    { limit: 175_000, rate: 0.09 },
    { limit: 250_000, rate: 0.18 },
    { limit: 500_000, rate: 0.24 },
    { limit: Infinity, rate: 0.30 },
  ],
  frere: [
    { limit: 75_000,  rate: 0.20 },
    { limit: 175_000, rate: 0.25 },
    { limit: Infinity, rate: 0.30 },
  ],
  autre: [
    { limit: 75_000,  rate: 0.40 },
    { limit: 175_000, rate: 0.55 },
    { limit: Infinity, rate: 0.65 },
  ],
};

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

function getBareme(region, lien) {
  const b = region === 'bxl' ? BAREME_BXL : BAREME_WAL;
  if (lien === 'enfant') return b.directe;
  if (lien === 'frere')  return b.frere;
  return b.autre; // neveu, autre
}

function calcSuccessionBE({ actifNet, lien, nbHeritiers, region }) {
  nbHeritiers = Math.max(1, nbHeritiers);

  // Conjoint / cohabitant légal : exonéré dans toutes les régions
  if (lien === 'conjoint') {
    return { totalDroits: 0, droitsChaque: 0, partBrute: actifNet / nbHeritiers, partTaxable: 0, netChaque: actifNet / nbHeritiers, tauxEffectif: 0, tmi: 0 };
  }

  const partBrute = actifNet / nbHeritiers;
  // En Belgique : pas d'abattement standard par héritier (contrairement à France)
  // Les droits s'appliquent dès le 1er euro (par tranche progressive)
  const tranches = getBareme(region, lien);
  const droitsChaque = calcTranches(partBrute, tranches);
  const totalDroits = droitsChaque * nbHeritiers;
  const netChaque = partBrute - droitsChaque;
  const tauxEffectif = actifNet > 0 ? totalDroits / actifNet : 0;

  let tmi = 0, prev = 0;
  for (const { limit, rate } of tranches) {
    if (partBrute > prev) tmi = rate;
    prev = limit;
    if (partBrute <= limit) break;
  }

  return { totalDroits, droitsChaque, partBrute, partTaxable: partBrute, netChaque, tauxEffectif, tmi };
}

const LIEN_OPTIONS = [
  { value: "enfant",   label: "Enfant(s) / Ligne directe" },
  { value: "conjoint", label: "Conjoint / Cohabitant légal" },
  { value: "frere",    label: "Frère / Sœur" },
  { value: "autre",    label: "Autres (neveu, ami, tiers…)" },
];

const DEFAULT = { actifNet: 250_000, lien: "enfant", nbHeritiers: 2, region: "wal" };

function fromParams(p) {
  return {
    actifNet:    Number(p.get("a")) || DEFAULT.actifNet,
    lien:        p.get("l") || DEFAULT.lien,
    nbHeritiers: Number(p.get("n")) || DEFAULT.nbHeritiers,
    region:      p.get("rg") || DEFAULT.region,
  };
}
function toParams(v) {
  return { a: v.actifNet, l: v.lien, n: v.nbHeritiers, rg: v.region };
}

const FAQ = [
  { q: "Quelle est la différence majeure avec les droits de succession en France ?", a: "En France, les héritiers bénéficient d'un abattement de 100 000 € par enfant avant tout calcul. En Belgique, il n'existe pas d'abattement standard de ce type : les droits s'appliquent dès le 1er euro (par tranche progressive). Les taux belges de ligne directe commencent à 3 % (Wallonie) ou 3 % (Bruxelles) et montent jusqu'à 30 %, ce qui est moins élevé qu'en France (jusqu'à 45 % en ligne directe)." },
  { q: "Pourquoi les droits varient-ils selon la région belge ?", a: "Les droits de succession en Belgique sont régionaux : chaque région (Wallonie, Bruxelles-Capitale, Flandre) fixe ses propres taux et règles. La Flandre a par exemple supprimé les droits entre partenaires cohabitants légaux et offre des réductions importantes pour la transmission de l'habitation familiale. Ce simulateur couvre Wallonie et Bruxelles-Capitale." },
  { q: "Le conjoint est-il exonéré en Belgique ?", a: "Oui, le conjoint marié et le cohabitant légal sont entièrement exonérés de droits de succession dans les 3 régions belges. Cette exonération s'applique indépendamment du montant de l'héritage." },
  { q: "Existe-t-il des réductions ou planification possible ?", a: "Oui : la donation est un outil clé. En Wallonie et à Bruxelles, les donations immobilières sont taxées à 3,3 % (ligne directe) et les donations mobilières à 3 % (ligne directe). Après un délai de carence (3 ans en général), ces biens ne font plus partie de la succession. Les assurances-vie peuvent aussi permettre une transmission hors succession." },
  { q: "La maison familiale bénéficie-t-elle d'un régime particulier ?", a: "En Wallonie, la résidence principale transmise en ligne directe entre époux ou cohabitants légaux bénéficie d'une exonération totale de droits de succession. À Bruxelles, une réduction d'impôt s'applique pour la partie inférieure à 160 000 €. Ces régimes incitatifs visent à maintenir les familles dans leur logement." },
];

export default function SuccessionBE() {
  const [theme, setTheme] = useTheme();
  const init = useMemo(() => fromParams(readShareParams()), []);
  const [actifNet, setActifNet]       = useState(init.actifNet);
  const [lien, setLien]               = useState(init.lien);
  const [nbHeritiers, setNbHeritiers] = useState(init.nbHeritiers);
  const [region, setRegion]           = useState(init.region);

  const vals = { actifNet, lien, nbHeritiers, region };
  const res  = useMemo(() => calcSuccessionBE(vals), [actifNet, lien, nbHeritiers, region]); // eslint-disable-line react-hooks/exhaustive-deps

  usePageMeta({
    title: "Simulateur Droits de Succession Belgique 2024 — Wallonie & Bruxelles | simfinly.com",
    description: "Calculez les droits de succession belges (Wallonie et Bruxelles-Capitale) selon le lien de parenté et le patrimoine transmis. Barèmes régionaux officiels.",
  });

  const animDroits = useAnimatedNumber(res.totalDroits);
  const animNet    = useAnimatedNumber(res.netChaque);
  const animTaux   = useAnimatedNumber(res.tauxEffectif * 100);

  const shareUrl = buildShareUrl(toParams(vals));
  const isExonere = lien === "conjoint";
  const heroColor = isExonere ? "#22c55e" : res.tauxEffectif < 0.08 ? "var(--gold)" : "#ef4444";

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px" };

  const baremeActif = getBareme(region, lien);
  const regionLabel = region === 'bxl' ? 'Bruxelles-Capitale' : 'Wallonie';

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Simulateur Succession Belgique 2024", url: "https://www.simfinly.com/be/simulateurs/succession", description: "Calculez les droits de succession belges par région.", applicationCategory: "FinanceApplication", inLanguage: "fr-BE" }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/succession" size={34} />}
          title="Droits de succession"
          subtitle="Belgique · Barèmes régionaux 2024"
          desc="Estimez les droits de succession selon le barème de votre région (Wallonie ou Bruxelles-Capitale). En Belgique, il n'y a pas d'abattement standard par héritier — les droits s'appliquent dès le premier euro selon des tranches progressives."
          badge="🇧🇪 Belgique · Succession"
        />

        {/* Avertissement */}
        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "var(--text-secondary)" }}>
          ⚠️ Les taux présentés sont indicatifs. La Flandre (Vlaanderen) applique ses propres règles, non couvertes ici. Consultez un notaire pour votre situation réelle.
        </div>

        <AdUnit slot="succession-be-top" style={{ marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>
          {/* ─── Formulaire ─── */}
          <div style={{ ...card }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 22 }}>Votre situation</h2>

            {/* Sélection de région */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Région belge</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { value: "wal", label: "Wallonie" },
                  { value: "bxl", label: "Bruxelles" },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setRegion(opt.value)}
                    style={{
                      flex: 1, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                      background: region === opt.value ? "rgba(43,92,230,0.10)" : "transparent",
                      border: region === opt.value ? "1.5px solid var(--primary)" : "1.5px solid var(--border)",
                      color: region === opt.value ? "var(--primary)" : "var(--text)",
                      fontSize: 13, fontWeight: region === opt.value ? 600 : 400,
                      fontFamily: "'Hanken Grotesk', sans-serif",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <NumInput
              id="actif-net-be"
              label="Actif net successoral"
              value={actifNet}
              onChange={v => { setActifNet(v); track("succession_be_actif"); }}
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
                    {opt.value === "conjoint" && <span style={{ marginLeft: 8, fontSize: 11, color: "#22c55e" }}>✓ Exonéré</span>}
                    {opt.value === "enfant" && <span style={{ marginLeft: 8, fontSize: 11, color: "var(--text-secondary)" }}>Dès le 1er €</span>}
                  </button>
                ))}
              </div>
            </div>

            {lien !== "conjoint" && (
              <StepperInput
                label={lien === "enfant" ? "Nombre d'enfants héritiers" : "Nombre d'héritiers"}
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
                    Exonération totale — conjoint / cohabitant légal (toutes régions)
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                    Total droits de succession · {regionLabel}
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
                <Chip label="TMI" value={`${(res.tmi * 100).toFixed(0)} %`} />
              </div>
            )}

            {/* Barème actif */}
            {!isExonere && (
              <div style={{ ...card, padding: "16px 18px" }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10, fontWeight: 600 }}>
                  Barème {regionLabel} — {lien === 'enfant' ? 'ligne directe' : lien === 'frere' ? 'frère/sœur' : 'autres'}
                </div>
                {baremeActif.map(({ limit, rate }, i) => {
                  const from = i === 0 ? 0 : baremeActif[i - 1].limit;
                  const active = res.tmi * 100 === rate * 100 && res.partBrute > 0;
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 8px", borderRadius: 6, background: active ? "rgba(184,147,74,0.12)" : "transparent", color: active ? "var(--gold)" : "var(--text-secondary)", fontWeight: active ? 700 : 400 }}>
                      <span>{fmt(from)} → {limit === Infinity ? "∞" : fmt(limit)} €</span>
                      <span>{(rate * 100).toFixed(0)} %</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Comparaison avec France */}
            {!isExonere && lien === 'enfant' && (
              <AccordionSection title="🇫🇷 vs 🇧🇪 : Différence vs France">
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  En France, chaque enfant bénéficie d'un abattement de 100 000 €. Pour un actif de {fmtEur(actifNet)} avec {nbHeritiers} enfant(s), la part taxable française serait de {fmtEur(Math.max(0, actifNet / nbHeritiers - 100_000))} par héritier contre {fmtEur(res.partBrute)} en Belgique (pas d'abattement standard).
                </p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 8 }}>
                  Les taux belges sont cependant moins élevés en haut de barème (30 % max en ligne directe vs 45 % en France). La donation préalable est souvent plus avantageuse en Belgique (3 % sur biens mobiliers) qu'en France pour les transmissions importantes.
                </p>
              </AccordionSection>
            )}
          </div>
        </div>

        <AdUnit slot="succession-be-mid" style={{ margin: "24px 0" }} />

        <AccordionSection title="Questions fréquentes" defaultOpen>
          <FaqSection items={FAQ} />
        </AccordionSection>

        <AccordionSection title="À propos des droits de succession belges">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            Les droits de succession en Belgique sont régionaux. En Wallonie et à Bruxelles-Capitale, les taux progressifs commencent à 3 % (ligne directe) et montent jusqu'à 30 %. Contrairement à la France, il n'existe pas d'abattement standard de 100 000 € par héritier en ligne directe : les droits s'appliquent dès le premier euro selon les tranches progressives. Le conjoint marié et le cohabitant légal sont totalement exonérés dans les trois régions. La Flandre (Vlaanderen) applique un régime différent non couvert ici.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            <strong>Ce simulateur est indicatif.</strong> Pour votre situation réelle, consultez un notaire. Les règles incluent notamment des régimes spéciaux pour l'habitation familiale, des réductions pour certains héritiers et des abattements variables selon les régions.
          </p>
        </AccordionSection>

        <ShareBar url={shareUrl} title="Droits de succession belges estimés" />
      </div>
      <Footer />
    </div>
  );
}
