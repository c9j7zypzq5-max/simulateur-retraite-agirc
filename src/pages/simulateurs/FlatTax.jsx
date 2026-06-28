import { useState, useEffect, useMemo, useRef } from "react";
import { track } from "@vercel/analytics";
import { useTheme } from "../../hooks/useTheme.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import {
  NumInput, AccordionSection,
  Chip, useAnimatedNumber, fmtEur,
  SimulateurHeader, FaqSection, StatusBadge,
} from "../../components/ui.jsx";
import SimIcon from "../../data/simIcons.jsx";
import { FAQS } from '../../data/faqs.js';
import SimRecommendations from '../../components/SimRecommendations.jsx';
import { RECOMMENDATIONS } from '../../data/recommendations.js';

// ─── Taux 2026 ────────────────────────────────────────────────────────────────
// Depuis la loi de financement de la SS 2026 : PS sur revenus du capital = 18,6 %
// (était 17,2 % jusqu'en 2025). PFU total = 12,8 % IR + 18,6 % PS = 31,4 %.
const TAUX_PFU_IR  = 0.128;
const TAUX_PS      = 0.186;
const TAUX_PFU     = TAUX_PFU_IR + TAUX_PS;   // 31,4 %
const TAUX_CSG_DED = 0.068;                    // CSG déductible (option barème)
const ABATT_DIV    = 0.40;                     // abattement 40 % sur dividendes

// ─── Calcul ──────────────────────────────────────────────────────────────────
function calcFlatTax({ dividendes, interets, plusValues, tmi }) {
  const div = dividendes ?? 0;
  const int = interets   ?? 0;
  const pv  = plusValues ?? 0;
  const total = div + int + pv;

  // PFU : taux fixe unique sur tout le capital
  const pfuIR    = total * TAUX_PFU_IR;
  const pfuPS    = total * TAUX_PS;
  const pfuTotal = total * TAUX_PFU;

  // Option barème : PS identiques + IR progressif avec avantages spécifiques
  const baremePS = total * TAUX_PS;

  // Dividendes : abattement 40 % avant IR, CSG 6,8 % déductible
  const irDiv = div * (1 - ABATT_DIV - TAUX_CSG_DED) * tmi;

  // Intérêts : pas d'abattement, CSG 6,8 % déductible
  const irInt = int * (1 - TAUX_CSG_DED) * tmi;

  // Plus-values mobilières : idem intérêts (abattements anciens supprimés en 2018)
  const irPV = pv * (1 - TAUX_CSG_DED) * tmi;

  const baremeIR    = Math.max(0, irDiv + irInt + irPV);
  const baremeTotal = baremePS + baremeIR;

  const diff = baremeTotal - pfuTotal; // positif = PFU avantageux

  return {
    total,
    pfuIR, pfuPS, pfuTotal,
    baremePS, baremeIR, baremeTotal,
    diff,
    gainNetPFU:    total - pfuTotal,
    gainNetBareme: total - baremeTotal,
    txEffBareme: total > 0 ? baremeTotal / total * 100 : 0,
  };
}

const TMI_OPTIONS = [
  { value: 0,    label: "0 %",  hint: "Non imposable" },
  { value: 0.11, label: "11 %", hint: "1re tranche" },
  { value: 0.30, label: "30 %", hint: "Tranche intermédiaire" },
  { value: 0.41, label: "41 %", hint: "Haute tranche" },
  { value: 0.45, label: "45 %", hint: "Tranche maximale" },
];

const FAQ = FAQS['/simulateurs/flat-tax'] ?? [];

export default function FlatTax() {
  const [theme, setTheme] = useTheme();
  const isMobile = useIsMobile();
  const resultsRef = useRef(null);

  const init = useMemo(() => {
    const shared = readShareParams();
    if (!shared) return { dividendes: null, interets: null, plusValues: null, tmi: 0.30 };
    return {
      dividendes: shared.d != null ? Number(shared.d) : null,
      interets:   shared.i != null ? Number(shared.i) : null,
      plusValues: shared.p != null ? Number(shared.p) : null,
      tmi:        shared.t != null ? Number(shared.t) : 0.30,
    };
  }, []);

  const [dividendes, setDividendes] = useState(init.dividendes);
  const [interets,   setInterets]   = useState(init.interets);
  const [plusValues, setPlusValues] = useState(init.plusValues);
  const [tmi,        setTmi]        = useState(init.tmi);

  usePageMeta(
    "Simulateur flat tax 2026 — PFU 31,4 % ou option barème ?",
    "Comparez l'imposition de vos revenus du capital (dividendes, intérêts, plus-values) en flat tax PFU à 31,4 % et en option barème progressif. Calculez la meilleure option selon votre TMI."
  );

  useEffect(() => {
    track('simulator_view', { name: 'flat-tax' });
    if (!sessionStorage.getItem('tracked_flat-tax')) {
      sessionStorage.setItem('tracked_flat-tax', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'flat-tax' }),
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ d: dividendes, i: interets, p: plusValues, t: tmi }));
  }, [dividendes, interets, plusValues, tmi]);

  const res = useMemo(
    () => calcFlatTax({ dividendes, interets, plusValues, tmi }),
    [dividendes, interets, plusValues, tmi]
  );

  const hasInput = (dividendes ?? 0) + (interets ?? 0) + (plusValues ?? 0) > 0;
  const pfuGagne    = hasInput && res.diff > 50;   // marge pour éviter "gagnant" à 1 €
  const baremeGagne = hasInput && res.diff < -50;

  const animPFU    = useAnimatedNumber(res.pfuTotal);
  const animBareme = useAnimatedNumber(res.baremeTotal);

  const report = {
    title: "Simulateur flat tax / PFU 2026",
    highlight: {
      label: pfuGagne ? "Meilleure option : PFU (flat tax)" : baremeGagne ? "Meilleure option : option barème" : "Résultat fiscal",
      value: hasInput
        ? (res.diff !== 0
            ? `Économie de ${fmtEur(Math.abs(Math.round(res.diff)))} avec ${pfuGagne ? "le PFU" : "le barème"}`
            : "Les deux options sont équivalentes")
        : "—",
    },
    params: [
      { label: "Dividendes bruts", value: dividendes ? fmtEur(dividendes) : "—" },
      { label: "Intérêts", value: interets ? fmtEur(interets) : "—" },
      { label: "Plus-values mobilières", value: plusValues ? fmtEur(plusValues) : "—" },
      { label: "TMI", value: `${(tmi * 100).toFixed(0)} %` },
    ],
    results: hasInput ? [
      { label: "Impôt en flat tax (PFU 31,4 %)", value: fmtEur(Math.round(res.pfuTotal)), strong: pfuGagne },
      { label: "Impôt en option barème", value: fmtEur(Math.round(res.baremeTotal)), strong: baremeGagne },
      { label: "Revenu net après impôt (PFU)", value: fmtEur(Math.round(res.gainNetPFU)) },
      { label: "Revenu net après impôt (barème)", value: fmtEur(Math.round(res.gainNetBareme)) },
    ] : [],
  };

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px" };
  const sectionTitle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 18, color: "var(--text)" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur flat tax (PFU) 2026",
        "url": "https://www.simfinly.com/simulateurs/flat-tax",
        "description": "Comparez l'imposition de vos revenus du capital en PFU (31,4 %) et en option barème progressif. Calculez la meilleure stratégie selon votre TMI — dividendes, intérêts, plus-values mobilières.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": "fr-FR",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": FAQ.map(f => ({
          "@type": "Question", "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "HowTo",
        "name": "Comment choisir entre la flat tax et l'option barème",
        "description": "Comparer l'imposition PFU et barème sur ses revenus du capital en trois étapes.",
        "step": [
          { "@type": "HowToStep", "name": "Saisir ses revenus du capital", "text": "Indiquez vos dividendes bruts, intérêts perçus et plus-values mobilières nettes réalisées dans l'année." },
          { "@type": "HowToStep", "name": "Choisir sa tranche marginale d'imposition (TMI)", "text": "Sélectionnez votre TMI parmi 0 %, 11 %, 30 %, 41 % ou 45 %. Elle figure sur votre avis d'imposition." },
          { "@type": "HowToStep", "name": "Comparer PFU et barème", "text": "Le simulateur calcule l'impôt total en flat tax (PFU 31,4 %) et en option barème avec abattement dividendes et CSG déductible, puis affiche la meilleure option." },
        ],
      }} />
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "28px 16px 60px" : "28px 24px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/flat-tax" size={34} />}
          title="Simulateur flat tax (PFU)"
          subtitle="Prélèvement forfaitaire unique 31,4 % · Option barème · 2026"
          desc="Comparez l'imposition de vos revenus du capital (dividendes, intérêts, plus-values mobilières) en flat tax à 31,4 % et en option barème progressif. Découvrez quelle option vous fait économiser le plus selon votre TMI."
          badge="Impôts · Capital 2026"
        />

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>

          {/* ── Formulaire ── */}
          <div style={{ order: isMobile ? 2 : 1 }}>
            <div style={{ ...card, marginBottom: 20 }}>
              <h2 style={sectionTitle}>Revenus du capital (année)</h2>
              <NumInput
                label="Dividendes bruts"
                value={dividendes}
                onChange={v => { setDividendes(v); track("flat_tax_dividendes"); }}
                unit="€"
                min={0}
                max={1_000_000}
                hint="Montant brut avant tout prélèvement — actions, ETF distribuants, SICAV…"
                tooltip="En option barème, l'abattement de 40 % s'applique sur les dividendes de sociétés françaises ou européennes éligibles (hors PEA, assurance-vie)."
              />
              <NumInput
                label="Intérêts perçus"
                value={interets}
                onChange={v => { setInterets(v); track("flat_tax_interets"); }}
                unit="€"
                min={0}
                max={500_000}
                hint="Comptes rémunérés fiscalisés, obligations, PEL, CEL…"
                tooltip="Les intérêts n'ont pas d'abattement en option barème. Le barème n'est avantageux que si votre TMI est inférieur à ~14 %."
              />
              <NumInput
                label="Plus-values mobilières nettes"
                value={plusValues}
                onChange={v => { setPlusValues(v); track("flat_tax_pv"); }}
                unit="€"
                min={0}
                max={1_000_000}
                hint="Gain net sur vente d'actions, ETF, OPCVM hors PEA et assurance-vie"
                tooltip="Aucun abattement pour durée de détention sur les titres acquis depuis 2018. En option barème, seule la CSG déductible (6,8 %) réduit la base imposable."
              />
            </div>

            <div style={card}>
              <h2 style={sectionTitle}>Votre TMI (tranche marginale d'imposition)</h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 0, marginBottom: 16, lineHeight: 1.6 }}>
                Le TMI est le taux appliqué à votre dernière tranche de revenu. Il figure sur votre avis d'imposition.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {TMI_OPTIONS.map(opt => {
                  const active = tmi === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => { setTmi(opt.value); track("flat_tax_tmi", { tmi: opt.label }); }}
                      aria-pressed={active}
                      style={{
                        padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                        background: active ? "rgba(184,147,74,0.10)" : "transparent",
                        border: `1.5px solid ${active ? "var(--border-gold)" : "var(--border)"}`,
                        color: active ? "var(--gold)" : "var(--text)",
                        textAlign: "left", fontSize: 13, fontWeight: active ? 600 : 400,
                        fontFamily: "'Hanken Grotesk', sans-serif", transition: "all 0.15s",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                      }}
                    >
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700 }}>{opt.label}</span>
                      <span style={{ fontSize: 12, color: active ? "var(--gold)" : "var(--text-secondary)" }}>{opt.hint}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Résultats ── */}
          <div style={{ order: isMobile ? 1 : 2, minWidth: 0 }} ref={resultsRef}>

            {/* Hero */}
            <div style={{
              ...card,
              background: !hasInput ? "var(--card-bg)" : pfuGagne ? "rgba(184,147,74,0.06)" : baremeGagne ? "rgba(43,92,230,0.06)" : "var(--card-bg)",
              border: `1px solid ${!hasInput ? "var(--border)" : pfuGagne ? "rgba(184,147,74,0.3)" : baremeGagne ? "rgba(43,92,230,0.3)" : "var(--border)"}`,
              textAlign: "center", padding: "28px 22px", marginBottom: 16,
            }}>
              {!hasInput ? (
                <p style={{ color: "var(--text-secondary)", padding: "12px 0", fontSize: 14 }}>
                  Saisissez vos revenus du capital pour comparer les deux régimes.
                </p>
              ) : (
                <>
                  <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
                    Meilleure option
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: pfuGagne ? "var(--gold)" : baremeGagne ? "var(--primary)" : "var(--text)", marginBottom: 6 }}>
                    {pfuGagne ? "Flat tax (PFU)" : baremeGagne ? "Option barème" : "Équivalent"}
                  </div>
                  {res.diff !== 0 && (
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
                      Économie de <strong style={{ color: "var(--text)" }}>{fmtEur(Math.abs(Math.round(res.diff)))}</strong> par rapport à l'autre option
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                    <StatusBadge status={pfuGagne ? "good" : "warn"} label={`PFU : ${fmtEur(Math.round(animPFU))}`} />
                    <StatusBadge status={baremeGagne ? "good" : "warn"} label={`Barème : ${fmtEur(Math.round(animBareme))}`} />
                  </div>
                </>
              )}
            </div>

            {/* Comparatif */}
            {hasInput && (
              <div style={{ ...card, marginBottom: 16 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 14 }}>Comparatif détaillé</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", paddingBottom: 10, color: "var(--text-secondary)", fontWeight: 400, fontSize: 12 }}></th>
                      <th style={{ textAlign: "right", paddingBottom: 10, color: "var(--gold)", fontWeight: 700, fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}>PFU (31,4 %)</th>
                      <th style={{ textAlign: "right", paddingBottom: 10, color: "var(--primary)", fontWeight: 700, fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}>Option barème</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Prélèvements sociaux", pfu: res.pfuPS, bar: res.baremePS, bold: false },
                      { label: "Impôt sur le revenu", pfu: res.pfuIR, bar: res.baremeIR, bold: false },
                      { label: "Total impôts", pfu: res.pfuTotal, bar: res.baremeTotal, bold: true },
                      { label: "Revenu net après impôt", pfu: res.gainNetPFU, bar: res.gainNetBareme, bold: true },
                    ].map(({ label, pfu, bar, bold }) => (
                      <tr key={label} style={{ borderTop: "1px solid var(--border)" }}>
                        <td style={{ padding: "10px 0", color: "var(--text-secondary)", fontWeight: bold ? 600 : 400 }}>{label}</td>
                        <td style={{ padding: "10px 0", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontWeight: bold ? 700 : 500, color: bold && pfuGagne ? "var(--gold)" : "var(--text)" }}>
                          {fmtEur(Math.round(pfu))}
                        </td>
                        <td style={{ padding: "10px 0", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontWeight: bold ? 700 : 500, color: bold && baremeGagne ? "var(--primary)" : "var(--text)" }}>
                          {fmtEur(Math.round(bar))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Chips */}
            {hasInput && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                <Chip label="Taux PFU" value="31,4 %" accent={pfuGagne} />
                <Chip label="Taux effectif barème" value={`${res.txEffBareme.toFixed(1)} %`} accent={baremeGagne} />
              </div>
            )}

            {/* Conseil contextuel selon TMI */}
            {hasInput && (
              <div style={{ ...card, background: "rgba(184,147,74,0.04)", border: "1px solid rgba(184,147,74,0.15)", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>À retenir</div>
                {(tmi === 0 || tmi === 0.11) && (
                  <>Le barème progressif est souvent plus avantageux en dessous de 30 % de TMI, surtout sur les dividendes grâce à l'abattement de 40 %. <strong style={{ color: "var(--text)" }}>Attention : l'option barème s'applique à l'ensemble de vos revenus du capital pour l'année</strong>, sans possibilité de panacher.</>
                )}
                {tmi === 0.30 && (
                  <>À 30 % de TMI, les situations sont très proches. Le PFU gagne sur les intérêts et plus-values (taux effectif barème : {res.txEffBareme.toFixed(1)} %), mais les dividendes peuvent être quasi-équivalents grâce à l'abattement 40 %. <strong style={{ color: "var(--text)" }}>Analysez votre mix de revenus avant de choisir.</strong></>
                )}
                {(tmi === 0.41 || tmi === 0.45) && (
                  <>À {(tmi * 100).toFixed(0)} % de TMI, la flat tax (PFU) est nettement avantageuse. Le taux effectif barème atteint {res.txEffBareme.toFixed(1)} % contre 31,4 % en PFU. <strong style={{ color: "var(--text)" }}>Pensez également aux enveloppes PEA et assurance-vie</strong> qui bénéficient d'une fiscalité encore plus favorable.</>
                )}
              </div>
            )}

            <ShareBar
              params={{ d: dividendes, i: interets, p: plusValues, t: tmi }}
              resultsRef={resultsRef}
              report={report}
              name="flat-tax"
            />
          </div>
        </div>

        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {/* À propos */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>Flat tax et PFU : tout comprendre</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>Le PFU : un taux unique sur les revenus du capital</h3>
            <p style={{ marginBottom: 14 }}>La <strong>flat tax</strong>, ou Prélèvement Forfaitaire Unique (PFU), soumet la plupart des revenus du capital à un taux fixe de <strong>31,4 % depuis 2026</strong> : 12,8 % d'impôt sur le revenu et 18,6 % de prélèvements sociaux (après la hausse de la CSG de 1,4 point votée en loi de financement de la Sécurité sociale pour 2026, contre 30 % au total auparavant). Elle s'applique aux dividendes, intérêts, et plus-values sur cession de valeurs mobilières hors enveloppes fiscales exonérées (PEA, assurance-vie).</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--text)", marginTop: 16, marginBottom: 10 }}>L'option barème : avantageuse seulement à faible TMI</h3>
            <p style={{ marginBottom: 14 }}>En optant pour le barème progressif, les revenus du capital s'ajoutent aux autres revenus et sont imposés à votre TMI. Sur les <strong>dividendes</strong>, un abattement de 40 % s'applique avant l'IR, et 6,8 % de CSG devient déductible du revenu imposable. Sur les <strong>intérêts et plus-values mobilières</strong>, seule la CSG déductible réduit la base. L'option barème n'est rentable que pour les contribuables à TMI 0 % ou 11 % sur les dividendes, et à TMI inférieur à ~14 % sur les intérêts et plus-values.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--text)", marginTop: 16, marginBottom: 10 }}>Règles importantes à connaître</h3>
            <p>L'option barème est <strong>globale</strong> : elle s'applique à tous les revenus du capital de l'année (dividendes, intérêts, plus-values), sans possibilité de panacher. La <strong>CEHR</strong> (Contribution Exceptionnelle sur les Hauts Revenus, 3 % à 4 %) peut s'ajouter pour les foyers dont le revenu fiscal de référence dépasse 250 000 € (célibataire) ou 500 000 € (couple) — elle est due quelle que soit l'option choisie. Pour les plus-values réalisées via un <strong>PEA</strong> après 5 ans, ou via une <strong>assurance-vie</strong> après 8 ans, des régimes encore plus favorables s'appliquent.</p>
          </div>
        </div>

        <SimRecommendations items={RECOMMENDATIONS['/simulateurs/flat-tax'] ?? []} />

        <FaqSection title="Questions fréquentes — Flat tax et PFU" items={FAQ} />

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", opacity: 0.6, marginTop: 32 }}>
          Simulation indicative — PFU 2026 : 12,8 % IR + 18,6 % PS = 31,4 % · L'option barème varie selon la composition du foyer et la nature des titres · CEHR non incluse · Consultez un conseiller fiscal
        </p>

        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
