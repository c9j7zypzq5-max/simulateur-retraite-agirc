// Route à ajouter dans src/App.jsx :
//   <Route path="/ch/simulateurs/prevoyance-ch" element={<PrevoyanceCH />} />

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
  NumInput, StepperInput, AccordionSection,
  Chip, useAnimatedNumber,
  SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";

// ─── Paramètres pilier 3a 2025 ────────────────────────────────────────────────
const PLAFOND_SALARIE     = 7_056;   // CHF/an — salarié affilié LPP (2025)
const PLAFOND_INDEPENDANT = 35_280;  // CHF/an — indépendant sans LPP (2025)
const PLAFOND_INDEPENDANT_PCT = 0.20; // 20 % du revenu net (plafonné à 35 280)
const AGE_RETRAITE        = 65;

function fmtCHF(val) {
  if (val === null || val === undefined || isNaN(val)) return "CHF 0";
  const rounded = Math.round(val);
  return "CHF " + rounded.toLocaleString("fr-CH");
}

function calcPrevoyance({ age, versementAnnuel, rendement, statut, revenuNet }) {
  const annees = Math.max(0, AGE_RETRAITE - age);
  const r = rendement / 100;

  // Plafond applicable
  const plafond = statut === 'independant'
    ? Math.min(revenuNet * PLAFOND_INDEPENDANT_PCT, PLAFOND_INDEPENDANT)
    : PLAFOND_SALARIE;

  const versementEffectif = Math.min(versementAnnuel, plafond);

  // Capital projeté avec intérêts composés
  let capital = 0;
  for (let i = 0; i < annees; i++) {
    capital = (capital + versementEffectif) * (1 + r);
  }

  // Économie fiscale annuelle estimée (TMI approximatif 20–35 %)
  // On utilise une approximation progressive basée sur le montant versé
  const tmiEstime = 0.25; // approximation moyenne (25 %)
  const economieFiscaleAnnuelle = versementEffectif * tmiEstime;
  const economieFiscaleTotale = economieFiscaleAnnuelle * annees;

  // Capital sans intérêts (épargne ordinaire sans rendement fiscal)
  const capitalSansRendement = versementEffectif * annees;

  // Capital épargne ordinaire (même versement, même rendement, sans déduction fiscale)
  // → net fiscal : versement - économie fiscale = versement * (1 - tmi)
  // Le gain net = capital 3a + économies fiscales cumulées - capital ordinaire
  const gainNetVsOrdinaire = capital + economieFiscaleTotale - capitalSansRendement;

  return {
    annees,
    plafond,
    versementEffectif,
    capital,
    capitalSansRendement,
    economieFiscaleAnnuelle,
    economieFiscaleTotale,
    gainNetVsOrdinaire,
    tmiEstime,
    depassePlafond: versementAnnuel > plafond,
  };
}

const FAQ = [
  {
    q: "Qu'est-ce que le pilier 3a en Suisse ?",
    a: "Le pilier 3a (prévoyance individuelle liée) est le troisième niveau d'épargne retraite en Suisse. Il permet aux salariés et indépendants de verser chaque année un montant dans un compte bancaire ou une police d'assurance dédié, en bénéficiant d'une déduction fiscale immédiate. Les fonds sont bloqués jusqu'à la retraite (65 ans pour les hommes, 64 ans pour les femmes, bientôt 65 ans pour tous).",
  },
  {
    q: "Quels sont les plafonds de déduction pour 2025 ?",
    a: "Pour 2025, les plafonds sont : 7 056 CHF/an pour les salariés affiliés à une caisse de pension (LPP) ; 20 % du revenu net indépendant, avec un maximum de 35 280 CHF, pour les indépendants sans 2e pilier. Ces montants sont révisés périodiquement par le Conseil fédéral en fonction de l'évolution de l'AVS.",
  },
  {
    q: "Quelle est la différence entre compte 3a bancaire et police d'assurance 3a ?",
    a: "Un compte 3a bancaire offre une grande flexibilité : vous pouvez verser le montant souhaité (jusqu'au plafond), gérer des fonds de placement, et retirer facilement. Une police d'assurance 3a combine épargne et couverture risques (décès, invalidité), mais engage sur une durée fixe avec des pénalités si vous résiliez avant terme. Pour la pure performance long terme, les fonds 3a en actions sont souvent préférables.",
  },
  {
    q: "Comment est imposé le retrait du pilier 3a ?",
    a: "Le capital accumulé dans le pilier 3a est imposé lors du retrait à un taux réduit, séparé du revenu ordinaire. Le taux varie selon le canton et le montant retiré, mais il est généralement de 5–10 % du capital. Pour minimiser l'impôt, il est conseillé d'échelonner les retraits sur plusieurs années et de détenir plusieurs comptes 3a ouverts à des années différentes.",
  },
  {
    q: "Puis-je retirer le 3a avant la retraite ?",
    a: "Oui, dans certains cas précis : achat d'une résidence principale en Suisse, financement d'une activité indépendante, départ définitif de Suisse, invalidité, ou décès (les ayants droit touchent le capital). En dehors de ces cas, le capital est bloqué jusqu'à 5 ans avant l'âge légal de retraite. Un retrait anticipé déclenche l'imposition du capital.",
  },
];

const DEFAULT = { age: 35, versementAnnuel: 7_056, rendement: 2, statut: 'salarie', revenuNet: 80_000 };

function fromParams(p) {
  return {
    age:             Number(p.get("a")) || DEFAULT.age,
    versementAnnuel: Number(p.get("v")) || DEFAULT.versementAnnuel,
    rendement:       Number(p.get("r")) || DEFAULT.rendement,
    statut:          p.get("st") || DEFAULT.statut,
    revenuNet:       Number(p.get("rn")) || DEFAULT.revenuNet,
  };
}
function toParams(v) {
  return { a: v.age, v: v.versementAnnuel, r: v.rendement, st: v.statut, rn: v.revenuNet };
}

export default function PrevoyanceCH() {
  const [theme, setTheme] = useTheme();
  const init = useMemo(() => fromParams(readShareParams()), []);
  const [age, setAge]                       = useState(init.age);
  const [versementAnnuel, setVersement]     = useState(init.versementAnnuel);
  const [rendement, setRendement]           = useState(init.rendement);
  const [statut, setStatut]                 = useState(init.statut);
  const [revenuNet, setRevenuNet]           = useState(init.revenuNet);

  const vals = { age, versementAnnuel, rendement, statut, revenuNet };
  const res  = useMemo(() => calcPrevoyance(vals), [age, versementAnnuel, rendement, statut, revenuNet]); // eslint-disable-line react-hooks/exhaustive-deps

  const shareUrl = buildShareUrl(toParams(vals));

  usePageMeta({
    title: "Simulateur pilier 3a Suisse 2026 — Épargne retraite déductible | simfinly.com",
    description: "Projetez votre capital pilier 3a et vos économies fiscales. Plafonds 2025 (7 056 CHF salarié / 35 280 CHF indépendant), rendement personnalisé, comparaison avec épargne ordinaire.",
  });

  const animCapital  = useAnimatedNumber(res.capital);
  const animEconomie = useAnimatedNumber(res.economieFiscaleTotale);

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Simulateur pilier 3a Suisse 2026",
        url: "https://www.simfinly.com/ch/simulateurs/prevoyance-ch",
        description: "Projetez votre capital pilier 3a et vos économies fiscales selon les règles 2025.",
        applicationCategory: "FinanceApplication",
        inLanguage: "fr-CH",
      }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/prevoyance-ch" size={34} />}
          title="Pilier 3a — Prévoyance individuelle"
          subtitle="Suisse · Épargne retraite 2025"
          desc="Projetez votre capital épargne retraite du 3e pilier (3a) et estimez vos économies fiscales cumulées. Plafonds 2025, rendement personnalisé, comparaison avec une épargne ordinaire."
          badge="🇨🇭 Suisse · Prévoyance"
        />

        <AdUnit slot="prevoyance-ch-top" style={{ marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>
          {/* ─── Formulaire ─── */}
          <div style={{ ...card }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 22 }}>Votre situation</h2>

            <StepperInput
              label="Âge actuel"
              value={age}
              onChange={v => { setAge(v); track("prevoyance_ch_age"); }}
              min={18}
              max={64}
            />

            {/* Statut */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Statut professionnel</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { value: "salarie",      label: "Salarié(e)", desc: `Max ${(7_056).toLocaleString("fr-CH")} CHF` },
                  { value: "independant",  label: "Indépendant(e)", desc: "Max 20 % / 35 280 CHF" },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setStatut(opt.value); track("prevoyance_ch_statut"); }}
                    style={{
                      flex: 1, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                      background: statut === opt.value ? "rgba(43,92,230,0.10)" : "transparent",
                      border: statut === opt.value ? "1.5px solid var(--primary)" : "1.5px solid var(--border)",
                      color: statut === opt.value ? "var(--primary)" : "var(--text)",
                      fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif",
                    }}
                  >
                    <div style={{ fontWeight: statut === opt.value ? 600 : 400 }}>{opt.label}</div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Revenu net si indépendant */}
            {statut === 'independant' && (
              <NumInput
                id="revenu-net-ch"
                label="Revenu net indépendant (CHF)"
                value={revenuNet}
                onChange={v => { setRevenuNet(v); track("prevoyance_ch_revenu"); }}
                unit="CHF"
                min={0}
                max={500_000}
                hint={`Plafond = 20 % × revenu net (max CHF 35 280)`}
              />
            )}

            <NumInput
              id="versement-3a"
              label="Versement annuel (CHF)"
              value={versementAnnuel}
              onChange={v => { setVersement(v); track("prevoyance_ch_versement"); }}
              unit="CHF"
              min={0}
              max={PLAFOND_INDEPENDANT}
              hint={`Plafond déductible : ${fmtCHF(res.plafond)}/an`}
            />

            {res.depassePlafond && (
              <div style={{ marginBottom: 16, padding: "8px 12px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, fontSize: 12, color: "#d97706" }}>
                Le versement dépasse le plafond déductible ({fmtCHF(res.plafond)}). Seul ce montant sera pris en compte.
              </div>
            )}

            <NumInput
              id="rendement-3a"
              label="Rendement annuel (%)"
              value={rendement}
              onChange={v => { setRendement(v); track("prevoyance_ch_rendement"); }}
              unit="%"
              min={0}
              max={15}
              step={0.5}
              hint="Compte 3a bancaire ≈ 1 % · Fonds 3a actions ≈ 3–5 %"
            />
          </div>

          {/* ─── Résultats ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Hero capital */}
            <div style={{ ...card, background: "rgba(43,92,230,0.05)", border: "1px solid rgba(43,92,230,0.2)", textAlign: "center", padding: "28px 22px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                Capital projeté à 65 ans
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "var(--primary)" }}>
                {fmtCHF(animCapital)}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
                sur {res.annees} an{res.annees !== 1 ? "s" : ""} · {rendement} % de rendement
              </div>
            </div>

            {/* Économie fiscale */}
            <div style={{ ...card, background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)", textAlign: "center", padding: "20px 22px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                Économie fiscale cumulée
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 700, color: "#22c55e" }}>
                {fmtCHF(animEconomie)}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
                ≈ {fmtCHF(res.economieFiscaleAnnuelle)}/an (TMI estimé ~{(res.tmiEstime * 100).toFixed(0)} %)
              </div>
            </div>

            {/* Chips */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Chip label="Versement effectif/an" value={fmtCHF(res.versementEffectif)} />
              <Chip label="Plafond déductible" value={fmtCHF(res.plafond)} />
              <Chip label="Capital sans intérêts" value={fmtCHF(res.capitalSansRendement)} hint="Versements cumulés" />
              <Chip label="Gain net vs épargne ord." value={fmtCHF(res.gainNetVsOrdinaire)} />
            </div>

            {/* Comparaison épargne ordinaire */}
            <AccordionSection title="Comparaison avec épargne ordinaire">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {[
                    ["Versements cumulés (bruts)", fmtCHF(res.versementEffectif * res.annees)],
                    ["Capital 3a à terme (avec intérêts)", fmtCHF(res.capital)],
                    ["Économies fiscales cumulées", fmtCHF(res.economieFiscaleTotale)],
                    ["Total 3a + économies fiscales", fmtCHF(res.capital + res.economieFiscaleTotale)],
                    ["Capital épargne ordinaire (intérêts seuls)", fmtCHF(res.capitalSansRendement)],
                    ["Gain net vs épargne ordinaire", fmtCHF(res.gainNetVsOrdinaire)],
                  ].map(([label, val], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "8px 0", color: "var(--text-secondary)" }}>{label}</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AccordionSection>

            {/* Les 3 piliers */}
            <div style={{ ...card, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Les 3 piliers suisses
              </div>
              {[
                { num: "1", label: "AVS / AI", desc: "Rente d'État obligatoire", color: "var(--primary)" },
                { num: "2", label: "LPP (2e pilier)", desc: "Caisse de pension professionnelle", color: "#f59e0b" },
                { num: "3a", label: "3e pilier lié (ce simulateur)", desc: "Déductible fiscalement, bloqué", color: "#22c55e" },
              ].map(p => (
                <div key={p.num} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ minWidth: 28, height: 22, borderRadius: 6, background: p.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: "0 4px" }}>
                    <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{p.num}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AdUnit slot="prevoyance-ch-mid" style={{ margin: "24px 0" }} />

        <AccordionSection title="Questions fréquentes" defaultOpen>
          <FaqSection items={FAQ} />
        </AccordionSection>

        <AccordionSection title="À propos du pilier 3a suisse">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            Le pilier 3a est la composante volontaire et fiscalement avantageuse de la prévoyance individuelle suisse. Contrairement au pilier 3b (libre), le 3a est dit « lié » : les fonds sont bloqués jusqu'à la retraite et les possibilités de retrait anticipé sont limitées. En contrepartie, les versements sont <strong>entièrement déductibles du revenu imposable</strong> (IFD et impôt cantonal), ce qui génère une économie fiscale immédiate chaque année.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            Les produits 3a disponibles en Suisse comprennent les comptes d'épargne 3a (rendement faible mais sûr), les fonds de placement 3a en actions (plus volatils mais performants sur le long terme) et les polices d'assurance-vie 3a (combinant épargne et couverture risque). <strong>Ce simulateur est indicatif. Pour une stratégie personnalisée, consultez un conseiller en prévoyance ou votre banque.</strong>
          </p>
        </AccordionSection>
      </div>
      <Footer />
    </div>
  );
}
