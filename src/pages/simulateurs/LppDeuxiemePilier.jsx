// Route à ajouter dans src/App.jsx :
//   <Route path="/ch/simulateurs/lpp-deuxieme-pilier" element={<LppDeuxiemePilier />} />

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
  Chip, useAnimatedNumber, fmtEur,
  SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";

// ─── Paramètres LPP 2025 ─────────────────────────────────────────────────────
const DEDUCTION_COORDINATION = 25_725;   // CHF (2025)
const PLAFOND_SALAIRE_LPP    = 88_200;   // CHF (2025)
const TAUX_INTERET_LPP       = 0.0125;   // 1,25 % (taux minimum LPP 2025)
const TAUX_CONVERSION        = 0.068;    // 6,8 % (taux légal hommes, 65 ans)
const AGE_RETRAITE           = 65;

// Bonifications de vieillesse par tranche d'âge (% du salaire coordonné)
function tauxBonification(age) {
  if (age >= 55) return 0.18;
  if (age >= 45) return 0.15;
  if (age >= 35) return 0.10;
  return 0.07; // 25–34 ans
}

function fmtCHF(val) {
  if (val === null || val === undefined || isNaN(val)) return "CHF 0";
  const rounded = Math.round(val);
  return "CHF " + rounded.toLocaleString("fr-CH");
}

function calcLPP({ salaireBrut, age }) {
  // Salaire coordonné
  const salaireLPP = Math.min(salaireBrut, PLAFOND_SALAIRE_LPP);
  const salaireCoordonne = Math.max(0, salaireLPP - DEDUCTION_COORDINATION);

  if (salaireCoordonne <= 0) {
    return { salaireCoordonne: 0, avoirProjecte: 0, renteMensuelle: 0, renteAnnuelle: 0, anneesCotisation: 0, contributionAnnuelle: 0, repartition: [] };
  }

  const anneesCotisation = Math.max(0, AGE_RETRAITE - age);
  let avoir = 0;
  const repartition = [];

  // Simulation année par année jusqu'à 65 ans
  for (let i = 0; i < anneesCotisation; i++) {
    const ageAnnee = age + i;
    const taux = tauxBonification(ageAnnee);
    const bonification = salaireCoordonne * taux;
    // Intérêts sur l'avoir existant + demi-bonification (convention milieu d'année)
    const interets = avoir * TAUX_INTERET_LPP;
    avoir = avoir + interets + bonification;

    // Résumé par tranche
    const tranche = ageAnnee < 35 ? "25–34 ans" : ageAnnee < 45 ? "35–44 ans" : ageAnnee < 55 ? "45–54 ans" : "55–65 ans";
    const existing = repartition.find(r => r.tranche === tranche);
    if (existing) {
      existing.annees++;
      existing.bonificationTotale += bonification;
    } else {
      repartition.push({ tranche, taux, annees: 1, bonificationTotale: bonification });
    }
  }

  // Contribution annuelle courante (à l'âge actuel)
  const contributionAnnuelle = salaireCoordonne * tauxBonification(age);

  // Rente
  const renteAnnuelle = avoir * TAUX_CONVERSION;
  const renteMensuelle = renteAnnuelle / 12;

  return {
    salaireCoordonne,
    avoirProjecte: avoir,
    renteMensuelle,
    renteAnnuelle,
    anneesCotisation,
    contributionAnnuelle,
    repartition,
  };
}

const FAQ = [
  {
    q: "Qu'est-ce que le 2e pilier (LPP) en Suisse ?",
    a: "Le 2e pilier (Loi sur la prévoyance professionnelle, LPP) est l'épargne retraite obligatoire liée à votre emploi en Suisse. Avec l'AVS (1er pilier), il forme la base de votre retraite. Les cotisations sont versées par l'employeur et le salarié à parts égales dans une caisse de pension. L'objectif est de maintenir environ 60 % de votre dernier salaire à la retraite.",
  },
  {
    q: "Comment est calculé le salaire coordonné ?",
    a: "Le salaire coordonné est la part de votre salaire soumise aux cotisations LPP obligatoires. Il correspond à votre salaire annuel brut (plafonné à 88 200 CHF) duquel on déduit la déduction de coordination (25 725 CHF en 2025). Cette déduction représente la part couverte par l'AVS. Le minimum du salaire coordonné assurable est de 3 675 CHF.",
  },
  {
    q: "Que sont les bonifications de vieillesse ?",
    a: "Les bonifications de vieillesse sont les cotisations annuelles versées au 2e pilier, exprimées en % du salaire coordonné. Elles augmentent avec l'âge : 7 % de 25 à 34 ans, 10 % de 35 à 44 ans, 15 % de 45 à 54 ans, et 18 % de 55 à 65 ans. La moitié est payée par l'employeur, l'autre moitié déduite de votre salaire.",
  },
  {
    q: "Qu'est-ce que le taux de conversion de 6,8 % ?",
    a: "Le taux de conversion est le pourcentage appliqué à votre avoir de vieillesse accumulé pour calculer votre rente annuelle à la retraite. À 65 ans, un capital de 100 000 CHF donne une rente de 6 800 CHF par an (567 CHF/mois). Ce taux légal (6,8 %) s'applique à la part obligatoire LPP ; les caisses de pension peuvent appliquer un taux différent pour la part surobligatoire.",
  },
  {
    q: "Puis-je retirer mon 2e pilier en capital plutôt qu'en rente ?",
    a: "Oui, la loi suisse vous permet de retirer tout ou partie de votre avoir de vieillesse en capital à la retraite, plutôt qu'une rente viagère. Le retrait en capital offre plus de flexibilité mais transfère le risque de longévité sur vous. Ce retrait est imposé comme un revenu extraordinaire (taux réduit) l'année du retrait. Certaines caisses de pension limitent ou n'offrent pas cette option.",
  },
];

const DEFAULT = { salaireBrut: 80_000, age: 35 };

function fromParams(p) {
  return {
    salaireBrut: Number(p.get("s")) || DEFAULT.salaireBrut,
    age:         Number(p.get("a")) || DEFAULT.age,
  };
}
function toParams(v) {
  return { s: v.salaireBrut, a: v.age };
}

export default function LppDeuxiemePilier() {
  const [theme, setTheme] = useTheme();
  const init = useMemo(() => fromParams(readShareParams()), []);
  const [salaireBrut, setSalaireBrut] = useState(init.salaireBrut);
  const [age, setAge]                 = useState(init.age);

  const vals = { salaireBrut, age };
  const res  = useMemo(() => calcLPP(vals), [salaireBrut, age]); // eslint-disable-line react-hooks/exhaustive-deps

  const shareUrl = buildShareUrl(toParams(vals));

  usePageMeta({
    title: "Simulateur LPP 2e pilier Suisse 2026 — Avoir & rente | simfinly.com",
    description: "Estimez votre avoir de vieillesse LPP (2e pilier suisse) et votre rente mensuelle projetée à 65 ans. Bonifications par tranche d'âge, taux d'intérêt 2025, taux de conversion 6,8 %.",
  });

  const animAvoir  = useAnimatedNumber(res.avoirProjecte);
  const animRente  = useAnimatedNumber(res.renteMensuelle);

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Simulateur LPP 2e pilier Suisse 2026",
        url: "https://www.simfinly.com/ch/simulateurs/lpp-deuxieme-pilier",
        description: "Estimez votre avoir LPP et votre rente de retraite suisse selon les règles 2025.",
        applicationCategory: "FinanceApplication",
        inLanguage: "fr-CH",
      }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/lpp-deuxieme-pilier" size={34} />}
          title="LPP — 2e pilier"
          subtitle="Suisse · Prévoyance professionnelle 2025"
          desc="Estimez votre avoir de vieillesse accumulé et votre rente mensuelle à 65 ans selon les règles LPP 2025 : bonifications par tranche d'âge, taux d'intérêt minimal et taux de conversion."
          badge="🇨🇭 Suisse · Retraite"
        />

        <AdUnit slot="lpp-ch-top" style={{ marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>
          {/* ─── Formulaire ─── */}
          <div style={{ ...card }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 22 }}>Votre situation</h2>

            <NumInput
              id="salaire-lpp"
              label="Salaire annuel brut (CHF)"
              value={salaireBrut}
              onChange={v => { setSalaireBrut(v); track("lpp_ch_salaire"); }}
              unit="CHF"
              min={0}
              max={500_000}
              hint={`Plafonné à CHF 88 200 pour le calcul LPP obligatoire`}
            />

            <StepperInput
              label="Âge actuel"
              value={age}
              onChange={v => { setAge(v); track("lpp_ch_age"); }}
              min={17}
              max={64}
            />

            {/* Récapitulatif des paramètres */}
            <div style={{ marginTop: 8, padding: "12px 14px", background: "rgba(0,0,0,0.02)", borderRadius: 10, border: "1px solid var(--border)", fontSize: 12, color: "var(--text-secondary)" }}>
              <div style={{ marginBottom: 6, fontWeight: 600, color: "var(--text)" }}>Paramètres LPP 2025</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span>Déduction de coordination</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CHF 25 725</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span>Taux d'intérêt LPP minimum</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>1,25 %</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Taux de conversion (65 ans)</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>6,8 %</span>
              </div>
            </div>
          </div>

          {/* ─── Résultats ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Hero avoir */}
            <div style={{ ...card, background: "rgba(43,92,230,0.05)", border: "1px solid rgba(43,92,230,0.2)", textAlign: "center", padding: "28px 22px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                Avoir projeté à 65 ans
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "var(--primary)" }}>
                {fmtCHF(animAvoir)}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
                sur {res.anneesCotisation} an{res.anneesCotisation !== 1 ? "s" : ""} de cotisation
              </div>
            </div>

            {/* Hero rente */}
            <div style={{ ...card, background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)", textAlign: "center", padding: "20px 22px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                Rente mensuelle estimée
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 700, color: "#22c55e" }}>
                {fmtCHF(animRente)}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
                soit {fmtCHF(res.renteAnnuelle)}/an (taux conv. 6,8 %)
              </div>
            </div>

            {/* Chips */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Chip label="Salaire coordonné" value={fmtCHF(res.salaireCoordonne)} />
              <Chip label="Cotisation annuelle" value={fmtCHF(res.contributionAnnuelle)} hint={`${(tauxBonification(age) * 100).toFixed(0)} % du sal. coordonné`} />
              <Chip label="Capital vs rente/mois" value={res.renteMensuelle > 0 ? `${(res.avoirProjecte / res.renteMensuelle / 12).toFixed(1)} ans` : "—"} hint="Temps pour récupérer le capital" />
              <Chip label="Âge de retraite" value="65 ans" />
            </div>

            {/* Détail par tranche */}
            {res.repartition.length > 0 && (
              <AccordionSection title="Bonifications par tranche d'âge">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <th style={{ padding: "6px 0", textAlign: "left", color: "var(--text-secondary)", fontWeight: 500 }}>Tranche</th>
                      <th style={{ padding: "6px 0", textAlign: "center", color: "var(--text-secondary)", fontWeight: 500 }}>Taux</th>
                      <th style={{ padding: "6px 0", textAlign: "center", color: "var(--text-secondary)", fontWeight: 500 }}>Années</th>
                      <th style={{ padding: "6px 0", textAlign: "right", color: "var(--text-secondary)", fontWeight: 500 }}>Bonifications</th>
                    </tr>
                  </thead>
                  <tbody>
                    {res.repartition.map(r => (
                      <tr key={r.tranche} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "8px 0", color: "var(--text)" }}>{r.tranche}</td>
                        <td style={{ padding: "8px 0", textAlign: "center", fontFamily: "'Space Grotesk', sans-serif" }}>{(r.taux * 100).toFixed(0)} %</td>
                        <td style={{ padding: "8px 0", textAlign: "center" }}>{r.annees}</td>
                        <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{fmtCHF(r.bonificationTotale)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionSection>
            )}

            {/* Comparaison capital vs rente */}
            <AccordionSection title="Capital vs rente : quelle option choisir ?">
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                <p style={{ marginBottom: 10 }}>
                  <strong style={{ color: "var(--text)" }}>Option rente :</strong> vous recevez {fmtCHF(res.renteMensuelle)}/mois à vie. Idéal si vous avez une espérance de vie élevée.
                  Au bout de {res.renteMensuelle > 0 ? Math.round(res.avoirProjecte / (res.renteMensuelle * 12)) : "—"} ans de rente, vous récupérez votre capital.
                </p>
                <p>
                  <strong style={{ color: "var(--text)" }}>Option capital :</strong> vous percevez {fmtCHF(res.avoirProjecte)} en une fois (imposé à taux réduit). Vous gérez vous-même votre épargne.
                  Adapté si vous avez d'autres revenus ou souhaitez transmettre un patrimoine.
                </p>
              </div>
            </AccordionSection>

            {/* Les 3 piliers */}
            <div style={{ ...card, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Les 3 piliers de la retraite suisse
              </div>
              {[
                { num: "1", label: "AVS / AI", desc: "Assurance vieillesse et survivants", color: "var(--primary)" },
                { num: "2", label: "LPP (ce simulateur)", desc: "Prévoyance professionnelle obligatoire", color: "#f59e0b" },
                { num: "3", label: "Pilier 3a / 3b", desc: "Épargne individuelle volontaire", color: "#22c55e" },
              ].map(p => (
                <div key={p.num} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: p.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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

        <AdUnit slot="lpp-ch-mid" style={{ margin: "24px 0" }} />

        <AccordionSection title="Questions fréquentes" defaultOpen>
          <FaqSection items={FAQ} />
        </AccordionSection>

        <AccordionSection title="À propos du 2e pilier suisse">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            La Loi sur la Prévoyance Professionnelle (LPP) oblige les employeurs suisses à assurer leurs salariés gagnant plus de 22 050 CHF/an (seuil d'entrée 2025) auprès d'une caisse de pension. Les cotisations sont versées sur la base du salaire coordonné (salaire brut − déduction de coordination). Elles sont investies par la caisse et fructifient au taux d'intérêt minimum fixé chaque année par le Conseil fédéral (1,25 % en 2025).
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            <strong>Ce simulateur est une estimation indicative basée sur la part obligatoire LPP.</strong> Votre caisse de pension peut offrir une couverture surobligatoire (salaires plus élevés, taux de conversion différents, garanties supplémentaires). Pour une projection personnalisée, consultez votre certificat de prévoyance annuel ou contactez votre caisse de pension.
          </p>
        </AccordionSection>
      </div>
      <Footer />
    </div>
  );
}
