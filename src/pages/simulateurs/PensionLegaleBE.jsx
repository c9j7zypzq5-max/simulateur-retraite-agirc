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

// ─── Paramètres pension légale belge 2024 ────────────────────────────────────
const PLAFOND_SALAIRE = 58_380;   // salaire plafonné annuel (limite de calcul)
const TAUX_ISOLE    = 0.60;       // taux « isolé »
const TAUX_MENAGE   = 0.75;       // taux « ménage » (soutien de famille)
const CARRIERE_PLEINE = 45;       // années pour carrière complète

// Pensions légales minimales mensuelles (carrière complète, EI 2025)
const MIN_ISOLE  = 1_729;
const MIN_MENAGE = 2_161;

// Âges légaux de retraite selon année de naissance
function ageLegal(birthYear) {
  if (birthYear <= 1962) return 65;
  if (birthYear <= 1965) return 66;
  return 67;
}

function calcPension({ salaireMoyen, carriereAns, tauxMenage, birthYear }) {
  const age = ageLegal(birthYear);
  const taux = tauxMenage ? TAUX_MENAGE : TAUX_ISOLE;
  const minPension = tauxMenage ? MIN_MENAGE : MIN_ISOLE;

  // Salaire plafonné
  const salairePlafonné = Math.min(salaireMoyen, PLAFOND_SALAIRE);

  // Carrière effective (max 45 pour le calcul de base)
  const carriereCoeff = Math.min(carriereAns, CARRIERE_PLEINE) / CARRIERE_PLEINE;

  // Pension mensuelle brute avant minima
  const pensionBrute = (salairePlafonné * taux * carriereCoeff) / 12;

  // Application du minimum garanti (proportionnel si carrière incomplète)
  const coeffMin = carriereAns >= CARRIERE_PLEINE ? 1 : carriereAns / CARRIERE_PLEINE;
  const minProrata = minPension * coeffMin;
  const pensionMensuelle = Math.max(pensionBrute, minProrata);

  // Précompte professionnel estimatif (≈ 11 % sur pension belge après déduction)
  const precompte = pensionMensuelle * 0.11;
  const pensionNette = pensionMensuelle - precompte;

  // Taux de remplacement (par rapport au salaire moyen mensuel brut)
  const salaireMensuel = salaireMoyen / 12;
  const tauxRemplacement = salaireMensuel > 0 ? pensionMensuelle / salaireMensuel : 0;

  // Bonus pension : +2 % par année supplémentaire au-delà de 45 ans (max 5 ans)
  const anneesBonus = Math.max(0, Math.min(carriereAns - CARRIERE_PLEINE, 5));
  const bonusPct = anneesBonus * 0.02;
  const pensionAvecBonus = pensionMensuelle * (1 + bonusPct);

  return {
    age, salairePlafonné, pensionMensuelle, pensionNette, pensionAvecBonus,
    tauxRemplacement, carriereCoeff, precompte, anneesBonus, bonusPct,
    isMinimum: pensionBrute < minProrata,
  };
}

const FAQ = FAQS['/simulateurs/pension-legale'];

const DEFAULT = { salaireMoyen: 3_200 * 12, carriereAns: 40, tauxMenage: false, birthYear: 1965 };

function fromParams(p) {
  return {
    salaireMoyen: Number(p.get("s")) || DEFAULT.salaireMoyen,
    carriereAns:  Number(p.get("c")) || DEFAULT.carriereAns,
    tauxMenage:   p.get("m") === "1",
    birthYear:    Number(p.get("b")) || DEFAULT.birthYear,
  };
}
function toParams(v) {
  return { s: v.salaireMoyen, c: v.carriereAns, m: v.tauxMenage ? "1" : "0", b: v.birthYear };
}

export default function PensionLegaleBE() {
  const [theme, setTheme] = useTheme();
  const init = useMemo(() => fromParams(readShareParams()), []);
  const [salaireMoyen, setSalaireMoyen] = useState(init.salaireMoyen);
  const [carriereAns, setCarriereAns]   = useState(init.carriereAns);
  const [tauxMenage, setTauxMenage]     = useState(init.tauxMenage);
  const [birthYear, setBirthYear]       = useState(init.birthYear);

  const vals = { salaireMoyen, carriereAns, tauxMenage, birthYear };
  const res  = useMemo(() => calcPension(vals), [salaireMoyen, carriereAns, tauxMenage, birthYear]); // eslint-disable-line react-hooks/exhaustive-deps

  const shareUrl = buildShareUrl(toParams(vals));

  usePageMeta({
    title: "Simulateur pension légale Belgique 2026 — ONSS | simfinly.com",
    description: "Estimez votre pension de retraite légale belge (1er pilier ONSS) : formule officielle, taux isolé/ménage, bonus pension, minimum garanti. Calcul selon la réforme 2025.",
  });

  const animPension = useAnimatedNumber(res.pensionMensuelle);
  const animNette   = useAnimatedNumber(res.pensionNette);

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px" };

  const heroColor = res.isMinimum ? "#f59e0b" : "var(--primary)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Simulateur Pension Légale Belgique 2026", url: "https://www.simfinly.com/be/simulateurs/pension-legale", description: "Estimez votre pension légale belge (ONSS) selon la formule officielle.", applicationCategory: "FinanceApplication", inLanguage: "fr-BE" }} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/pension-legale" size={34} />}
          title="Pension légale — 1er pilier"
          subtitle="Belgique · ONSS 2025"
          desc="Estimez votre pension de retraite légale belge selon la formule officielle : salaire moyen, durée de carrière, taux isolé ou ménage, et bonus pension pour les longues carrières."
          badge="🇧🇪 Belgique · Retraite"
        />

        <AdUnit slot="pension-be-top" style={{ marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>
          {/* ─── Formulaire ─── */}
          <div style={{ ...card }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 22 }}>Votre situation</h2>

            <NumInput
              id="salaire-be"
              label="Salaire moyen annuel brut (carrière)"
              value={salaireMoyen}
              onChange={v => { setSalaireMoyen(v); track("pension_be_salaire"); }}
              unit="€"
              min={0}
              max={200_000}
              hint={`Plafonné à ${fmtEur(PLAFOND_SALAIRE)} pour le calcul de pension`}
            />

            <StepperInput
              label="Années de carrière projetées"
              value={carriereAns}
              onChange={setCarriereAns}
              min={1}
              max={50}
            />

            <NumInput
              id="birth-year"
              label="Année de naissance"
              value={birthYear}
              onChange={setBirthYear}
              unit=""
              min={1940}
              max={2000}
              hint={`Âge légal de retraite : ${res.age} ans`}
            />

            {/* Taux */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Taux applicable</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { value: false, label: "Isolé(e)", desc: "60 %" },
                  { value: true,  label: "Ménage",   desc: "75 %" },
                ].map(opt => (
                  <button
                    key={String(opt.value)}
                    onClick={() => setTauxMenage(opt.value)}
                    style={{
                      flex: 1, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                      background: tauxMenage === opt.value ? "rgba(43,92,230,0.10)" : "transparent",
                      border: tauxMenage === opt.value ? "1.5px solid var(--primary)" : "1.5px solid var(--border)",
                      color: tauxMenage === opt.value ? "var(--primary)" : "var(--text)",
                      fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif",
                    }}
                  >
                    <div style={{ fontWeight: tauxMenage === opt.value ? 600 : 400 }}>{opt.label}</div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 6 }}>
                Taux ménage = conjoint sans revenus propres
              </div>
            </div>
          </div>

          {/* ─── Résultats ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Hero */}
            <div style={{ ...card, background: "rgba(43,92,230,0.05)", border: `1px solid rgba(43,92,230,0.2)`, textAlign: "center", padding: "28px 22px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                Pension légale mensuelle brute
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: heroColor }}>
                {fmtEur(animPension)}
              </div>
              {res.isMinimum && (
                <div style={{ fontSize: 11.5, color: "#f59e0b", marginTop: 8, background: "rgba(245,158,11,0.1)", borderRadius: 8, padding: "6px 10px" }}>
                  ⚠️ Minimum garanti appliqué
                </div>
              )}
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
                soit {fmtEur(res.pensionMensuelle * 12)}/an · {(res.tauxRemplacement * 100).toFixed(0)} % de remplacement
              </div>
            </div>

            {/* Chips */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Chip label="Net estimé / mois" value={fmtEur(animNette)} hint="Après précompte ≈ 11 %" />
              <Chip label="Âge légal retraite" value={`${res.age} ans`} />
              <Chip label="Carrière (coeff)" value={`${(res.carriereCoeff * 100).toFixed(1)} %`} />
              <Chip label="Salaire plafonné" value={fmtEur(Math.min(salaireMoyen, PLAFOND_SALAIRE))} />
            </div>

            {/* Bonus pension */}
            {carriereAns > CARRIERE_PLEINE && (
              <div style={{ ...card, padding: "14px 16px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.25)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#22c55e", marginBottom: 6 }}>
                  Bonus pension actif (+{(res.bonusPct * 100).toFixed(0)} %)
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {res.anneesBonus} an(s) au-delà de 45 ans de carrière → pension portée à {fmtEur(res.pensionAvecBonus)}/mois
                </div>
              </div>
            )}

            {/* Détail */}
            <AccordionSection title="Détail du calcul">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {[
                    ["Salaire moyen plafonné", fmtEur(Math.min(salaireMoyen, PLAFOND_SALAIRE))],
                    ["Taux applicable", `${tauxMenage ? 75 : 60} %`],
                    ["Coefficient carrière", `${carriereAns} / 45 = ${(res.carriereCoeff * 100).toFixed(1)} %`],
                    ["Pension mensuelle brute calculée", fmtEur(salaireMoyen > 0 ? (Math.min(salaireMoyen, PLAFOND_SALAIRE) * (tauxMenage ? TAUX_MENAGE : TAUX_ISOLE) * res.carriereCoeff) / 12 : 0)],
                    res.isMinimum ? ["Minimum garanti (proratisé)", fmtEur(res.pensionMensuelle)] : null,
                    ["Précompte professionnel estimé", `− ${fmtEur(res.precompte)}`],
                    ["Pension nette mensuelle estimée", fmtEur(res.pensionNette)],
                  ].filter(Boolean).map(([label, val], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "8px 0", color: "var(--text-secondary)" }}>{label}</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AccordionSection>

            {/* 3 piliers */}
            <div style={{ ...card, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                Les 3 piliers de la pension belge
              </div>
              {[
                { num: "1", label: "Pension légale (ONSS)", desc: "Ce simulateur", color: "var(--primary)" },
                { num: "2", label: "Pension complémentaire", desc: "EIP, CPTI, fonds de pension (entreprise)", color: "#f59e0b" },
                { num: "3", label: "Épargne individuelle", desc: "Épargne-pension, VAPZE (indépendants)", color: "#22c55e" },
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

        <AdUnit slot="pension-be-mid" style={{ margin: "24px 0" }} />

        <AccordionSection title="Questions fréquentes" defaultOpen>
          <FaqSection items={FAQ} />
        </AccordionSection>

        <AccordionSection title="À propos de la pension légale belge">
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
            La pension légale belge (1er pilier) est calculée par le SDPSP (Service des pensions) pour les salariés et par l'INASTI pour les indépendants. Elle est basée sur le salaire moyen sur l'ensemble de la carrière, plafonné à un montant fixé chaque année (58 380 € en 2024), multiplié par un coefficient de carrière (années effectuées / 45) et un taux (60 % pour les isolés, 75 % pour les ménages).
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)", marginTop: 12 }}>
            <strong>Ce simulateur est une estimation indicative.</strong> Les règles effectives incluent des périodes assimilées (chômage, maladie, crédit-temps), des régimes spéciaux (fonctionnaires, marins, mineurs) et des réformes en cours. Pour une estimation personnalisée, consultez MyPension.be (le portail officiel belge).
          </p>
        </AccordionSection>

        <ShareBar url={shareUrl} title="Ma pension légale belge estimée" />
      </div>
      <Footer />
    </div>
  );
}
