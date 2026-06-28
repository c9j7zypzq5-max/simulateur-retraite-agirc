import { useState, useMemo, useEffect } from "react";
import { PMSS } from "../../config/constants.js";
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
  NumInput, StepperInput, AccordionSection,
  Chip, useAnimatedNumber, fmt, fmtEur,
  SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";
import SimIcon from "../../data/simIcons.jsx";
import { FAQS } from '../../data/faqs.js';
import SimRecommendations from '../../components/SimRecommendations.jsx';
import { RECOMMENDATIONS } from '../../data/recommendations.js';

// ─── Plafond mensuel de la sécurité sociale (PMSS 2025) ─────────────────────

// ─── Âge légal selon génération (réforme 2023 — Loi Borne) ──────────────────
function ageLegalAns(anneeNaissance) {
  if (anneeNaissance <= 1961) return 62;
  if (anneeNaissance === 1962) return 62 + 3 / 12;
  if (anneeNaissance === 1963) return 62 + 6 / 12;
  if (anneeNaissance === 1964) return 63;
  if (anneeNaissance === 1965) return 63 + 3 / 12;
  if (anneeNaissance === 1966) return 63 + 6 / 12;
  return 64; // 1967+
}

function ageLegalLabel(anneeNaissance) {
  if (anneeNaissance <= 1961) return "62 ans";
  if (anneeNaissance === 1962) return "62 ans 3 mois";
  if (anneeNaissance === 1963) return "62 ans 6 mois";
  if (anneeNaissance === 1964) return "63 ans";
  if (anneeNaissance === 1965) return "63 ans 3 mois";
  if (anneeNaissance === 1966) return "63 ans 6 mois";
  return "64 ans";
}

// ─── Durée de cotisation requise pour le taux plein ──────────────────────────
function dureeRequise(anneeNaissance) {
  if (anneeNaissance <= 1957) return 166;
  if (anneeNaissance <= 1960) return 168;
  if (anneeNaissance <= 1963) return 169;
  if (anneeNaissance <= 1965) return 170;
  if (anneeNaissance <= 1967) return 171;
  return 172; // 1968+
}

// ─── Éligibilité carrières longues (RACL) ────────────────────────────────────
// Retourne { eligible, ageDepart, motif } ou { eligible: false }
function checkCarrieresLongues(anneeNaissance, agePremierTrimestre, trimestresCotises, dureeRef) {
  const trimExig = dureeRef + 2; // durée requise + 2 trim supplémentaires

  // Départ à 58 ans : début avant 17 ans (5 trim avant 17e anniversaire)
  if (agePremierTrimestre <= 16 && trimestresCotises >= trimExig) {
    return { eligible: true, ageDepart: 58, motif: "Début de carrière avant 17 ans — départ possible dès 58 ans" };
  }

  // Départ à 60 ans : début ≤ 20 ans (5 trim avant 21e anniversaire) ET durée+2
  if (agePremierTrimestre <= 20 && trimestresCotises >= trimExig) {
    return { eligible: true, ageDepart: 60, motif: "Début de carrière avant 21 ans — départ possible dès 60 ans" };
  }

  return { eligible: false, ageDepart: null, motif: "" };
}

// ─── Calcul central ──────────────────────────────────────────────────────────
function calcRetraiteAnticipee({
  anneeNaissance, ageFin, trimestresCotises,
  agePremierTrimestre, salaireMensuelBrut,
}) {
  const ageRef = ageLegalAns(anneeNaissance);
  const dureeRef = dureeRequise(anneeNaissance);
  const racl = checkCarrieresLongues(anneeNaissance, agePremierTrimestre, trimestresCotises, dureeRef);

  // Âge de départ minimum effectif
  const ageDepartMin = racl.eligible ? racl.ageDepart : ageRef;

  // Trimestres cotisés projetés à l'âge de départ souhaité
  // On estime les trimestres supplémentaires entre maintenant et ageFin
  // (simplification : on travaille avec ce que l'utilisateur saisit)
  const trimsAuDepart = trimestresCotises;

  // Écart par rapport au taux plein
  const ecartTrims = trimsAuDepart - dureeRef;

  // Décote / surcote
  let coef = 1;
  let decotePct = 0;
  let surcotePct = 0;
  if (ecartTrims < 0) {
    // Décote : -1.25% par trimestre manquant, max -25% (20 trim)
    const trimsManquants = Math.min(Math.abs(ecartTrims), 20);
    decotePct = trimsManquants * 1.25;
    coef = 1 - decotePct / 100;
  } else if (ecartTrims > 0) {
    // Surcote : +1.25% par trimestre supplémentaire (pas de max légal)
    surcotePct = ecartTrims * 1.25;
    coef = 1 + surcotePct / 100;
  }

  // Pension brute estimée (formule CNAV simplifiée)
  // Base = min(salaire brut, PMSS) × 50% × (trimestres / durée taux plein) × coef
  const salaireBase = Math.min(salaireMensuelBrut, PMSS);
  const tauxProrata = Math.min(trimsAuDepart / dureeRef, 1); // plafonné à 1 (la surcote joue via coef)
  const pensionBrute = salaireBase * 0.5 * tauxProrata * coef;

  // Éligibilité RACL

  // Départ souhaité vs départ minimal
  const ageDepartSouhaite = ageFin;
  const departPossible = Math.max(ageDepartMin, ageDepartSouhaite) === ageDepartSouhaite
    ? ageDepartSouhaite
    : ageDepartMin;

  // Année estimée de départ
  const anneeDepart = anneeNaissance + Math.floor(ageDepartMin);

  return {
    ageRef, ageRefLabel: ageLegalLabel(anneeNaissance),
    dureeRef,
    trimsAuDepart, ecartTrims,
    decotePct, surcotePct, coef,
    pensionBrute: Math.max(0, Math.round(pensionBrute)),
    racl,
    ageDepartMin,
    anneeDepart,
    salaireBase,
  };
}

const DEFAULT = {
  anneeNaissance: 1975,
  ageFin: 62,
  trimestresCotises: 120,
  agePremierTrimestre: 22,
  salaireMensuelBrut: 3_000,
};

function fromParams(p) {
  return {
    anneeNaissance:      Number(p.get("an")) || DEFAULT.anneeNaissance,
    ageFin:              Number(p.get("af")) || DEFAULT.ageFin,
    trimestresCotises:   Number(p.get("tc")) || DEFAULT.trimestresCotises,
    agePremierTrimestre: Number(p.get("ap")) || DEFAULT.agePremierTrimestre,
    salaireMensuelBrut:  Number(p.get("sm")) || DEFAULT.salaireMensuelBrut,
  };
}
function toParams(v) {
  return {
    an: v.anneeNaissance,
    af: v.ageFin,
    tc: v.trimestresCotises,
    ap: v.agePremierTrimestre,
    sm: v.salaireMensuelBrut,
  };
}

const FAQ = FAQS['/simulateurs/retraite-anticipee'];

function Row({ label, value, highlight, ok, warn }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: highlight ? 700 : 500,
        color: ok ? "#22c55e" : warn ? "#ef4444" : highlight ? "var(--text)" : "var(--text-secondary)",
      }}>
        {value}
      </span>
    </div>
  );
}

export default function RetraiteAnticipee() {
  const [theme, setTheme] = useTheme();
  const isMobile = useIsMobile();
  const init = useMemo(() => fromParams(readShareParams()), []);

  const [anneeNaissance,      setAnneeNaissance]      = useState(init.anneeNaissance);
  const [ageFin,              setAgeFin]              = useState(init.ageFin);
  const [trimestresCotises,   setTrimestresCotises]   = useState(init.trimestresCotises);
  const [agePremierTrimestre, setAgePremierTrimestre] = useState(init.agePremierTrimestre);
  const [salaireMensuelBrut,  setSalaireMensuelBrut]  = useState(init.salaireMensuelBrut);

  const vals = { anneeNaissance, ageFin, trimestresCotises, agePremierTrimestre, salaireMensuelBrut };
  const res = useMemo(() => calcRetraiteAnticipee(vals), [anneeNaissance, ageFin, trimestresCotises, agePremierTrimestre, salaireMensuelBrut]); // eslint-disable-line react-hooks/exhaustive-deps

  usePageMeta(
    "Simulateur retraite anticipée carrières longues 2026 — Départ avant l'âge légal",
    "Calculez votre éligibilité au départ anticipé pour carrières longues (RACL), votre pension CNAV estimée et l'impact de la décote ou surcote. Barème officiel par génération, réforme 2023."
  );

  useEffect(() => {
    track('simulator_view', { name: 'retraite-anticipee' });
    if (!sessionStorage.getItem('tracked_retraite-anticipee')) {
      sessionStorage.setItem('tracked_retraite-anticipee', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'retraite-anticipee' }),
      }).catch(() => {});
    }
  }, []);

  const animPension = useAnimatedNumber(res.pensionBrute);

  const shareUrl = buildShareUrl(toParams(vals));

  const isDecote = res.decotePct > 0;
  const isSurcote = res.surcotePct > 0;

  const report = {
    title: "Simulateur retraite anticipée carrières longues",
    highlight: { label: "Pension brute estimée (CNAV)", value: `${fmtEur(res.pensionBrute)}/mois` },
    params: [
      { label: "Année de naissance", value: String(anneeNaissance) },
      { label: "Âge souhaité de départ", value: `${ageFin} ans` },
      { label: "Trimestres cotisés", value: String(trimestresCotises) },
      { label: "Âge au 1er trimestre", value: `${agePremierTrimestre} ans` },
      { label: "Salaire mensuel brut", value: fmtEur(salaireMensuelBrut) },
    ],
    results: [
      { label: "Pension brute estimée (CNAV)", value: `${fmtEur(res.pensionBrute)}/mois`, strong: true },
      { label: "Âge légal de départ", value: res.ageRefLabel },
      { label: "Trimestres requis", value: `${res.dureeRef} trim` },
      { label: "Éligibilité RACL", value: res.racl.eligible ? `Éligible — départ à ${res.racl.ageDepart} ans` : "Non éligible" },
      ...(isDecote ? [{ label: "Décote appliquée", value: `−${res.decotePct.toFixed(2)} %` }] : []),
      ...(isSurcote ? [{ label: "Surcote appliquée", value: `+${res.surcotePct.toFixed(2)} %` }] : []),
    ],
  };

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur retraite anticipée carrières longues 2026",
        "url": "https://www.simfinly.com/simulateurs/retraite-anticipee",
        "description": "Calculez votre éligibilité au départ anticipé pour carrières longues (RACL), votre pension CNAV estimée et l'impact de la décote ou surcote selon la réforme 2023 (loi Borne).",
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
        "name": "Comment vérifier son éligibilité à la retraite anticipée carrières longues",
        "description": "Calculer son droit au départ anticipé RACL et estimer sa pension CNAV en quatre étapes.",
        "step": [
          { "@type": "HowToStep", "name": "Saisir son année de naissance", "text": "Votre année de naissance détermine l'âge légal de départ et la durée de cotisation requise pour le taux plein selon la réforme 2023." },
          { "@type": "HowToStep", "name": "Indiquer ses trimestres cotisés", "text": "Renseignez le nombre de trimestres validés, disponible sur votre relevé de carrière sur info-retraite.fr." },
          { "@type": "HowToStep", "name": "Préciser l'âge au premier trimestre cotisé", "text": "Si vous avez commencé à travailler avant 21 ans (ou 17 ans), vous pouvez être éligible au dispositif carrières longues (RACL) et partir dès 60 ou 58 ans." },
          { "@type": "HowToStep", "name": "Lire les résultats", "text": "Le simulateur indique votre éligibilité RACL, l'âge de départ possible, la décote ou surcote appliquée, et votre pension brute CNAV estimée." },
        ],
      }} />
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ maxWidth: 880, margin: "0 auto", padding: isMobile ? "0 16px 60px" : "0 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/retraite-anticipee" size={34} />}
          title="Retraite anticipée carrières longues"
          subtitle="Départ avant l'âge légal · Dispositif RACL · Réforme 2023"
          desc="Vérifiez votre éligibilité au départ anticipé pour carrières longues (RACL), estimez votre pension CNAV de base et l'impact de la décote ou surcote selon votre génération et vos trimestres cotisés."
          badge="Retraite · RACL 2026"
        />

        <AdUnit slot="retraite-anticipee-top" style={{ marginBottom: 24 }} />

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(0,1fr) minmax(0,1fr)", gap: 24, alignItems: "start" }}>
          {/* ─── Formulaire ─── */}
          <div style={{ ...card }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 22 }}>Votre situation</h2>

            <StepperInput
              label="Année de naissance"
              value={anneeNaissance}
              onChange={v => { setAnneeNaissance(v); track("racl_annee"); }}
              min={1950}
              max={2000}
              step={1}
              tooltip="Détermine l'âge légal et la durée de cotisation requise (réforme 2023)"
            />

            <StepperInput
              label="Âge souhaité de départ"
              value={ageFin}
              onChange={v => { setAgeFin(v); track("racl_age_fin"); }}
              min={55}
              max={70}
              step={1}
              unit="ans"
              tooltip="Âge auquel vous souhaitez partir à la retraite"
            />

            <NumInput
              id="trimestres-cotises"
              label="Trimestres cotisés à ce jour"
              value={trimestresCotises}
              onChange={v => { setTrimestresCotises(v); track("racl_trimestres"); }}
              min={0}
              max={200}
              hint="Disponible sur votre relevé de carrière (info-retraite.fr)"
              tooltip="Trimestres validés : travail, chômage indemnisé, maladie, maternité…"
            />

            <StepperInput
              label="Âge au 1er trimestre cotisé"
              value={agePremierTrimestre}
              onChange={v => { setAgePremierTrimestre(v); track("racl_age_debut"); }}
              min={14}
              max={30}
              step={1}
              unit="ans"
              hint="≤ 20 ans → éligible RACL 60 ans · ≤ 16 ans → éligible RACL 58 ans"
              tooltip="Âge à votre premier trimestre cotisé (activité réelle, hors assimilés pour ce critère)"
            />

            <NumInput
              id="salaire-brut"
              label="Salaire mensuel brut actuel"
              value={salaireMensuelBrut}
              onChange={v => { setSalaireMensuelBrut(v); track("racl_salaire"); }}
              unit="€"
              min={0}
              max={30_000}
              hint={`Plafonné au PMSS (${fmt(PMSS)} €/mois) pour le calcul de la pension de base`}
              tooltip="Utilisé comme proxy de votre salaire annuel moyen (SAM)"
            />
          </div>

          {/* ─── Résultats ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Hero pension */}
            <div style={{ ...card, background: "rgba(184,147,74,0.06)", border: "1px solid rgba(184,147,74,0.25)", textAlign: "center", padding: "28px 22px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>
                Pension brute estimée (CNAV de base)
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: "var(--gold)" }}>
                {fmtEur(Math.round(animPension))}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
                / mois · {trimestresCotises} trim cotisés / {res.dureeRef} requis
              </div>
              {isDecote && (
                <div style={{ marginTop: 12, fontSize: 12, color: "#ef4444", background: "rgba(239,68,68,0.08)", borderRadius: 8, padding: "8px 12px" }}>
                  Décote de {res.decotePct.toFixed(2)} % ({Math.round(res.decotePct / 1.25)} trim manquants)
                </div>
              )}
              {isSurcote && (
                <div style={{ marginTop: 12, fontSize: 12, color: "#22c55e", background: "rgba(34,197,94,0.08)", borderRadius: 8, padding: "8px 12px" }}>
                  Surcote de +{res.surcotePct.toFixed(2)} % ({Math.round(res.surcotePct / 1.25)} trim en plus)
                </div>
              )}
              {!isDecote && !isSurcote && (
                <div style={{ marginTop: 12, fontSize: 12, color: "#22c55e", background: "rgba(34,197,94,0.08)", borderRadius: 8, padding: "8px 12px" }}>
                  Taux plein — aucune décote ni surcote
                </div>
              )}
            </div>

            {/* Chips clés */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Chip label="Âge légal de départ" value={res.ageRefLabel} />
              <Chip label="Trimestres requis" value={`${res.dureeRef} trim`} />
              <Chip
                label={res.ecartTrims >= 0 ? "Trimestres en excédent" : "Trimestres manquants"}
                value={`${res.ecartTrims >= 0 ? "+" : ""}${res.ecartTrims} trim`}
                accent={res.ecartTrims >= 0}
              />
              <Chip
                label={isDecote ? "Décote appliquée" : isSurcote ? "Surcote appliquée" : "Coefficient"}
                value={isDecote ? `−${res.decotePct.toFixed(2)} %` : isSurcote ? `+${res.surcotePct.toFixed(2)} %` : "100 %"}
              />
            </div>

            {/* Éligibilité RACL */}
            <div style={{
              ...card,
              background: res.racl.eligible ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.05)",
              border: `1px solid ${res.racl.eligible ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.2)"}`,
            }}>
              <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
                Dispositif carrières longues (RACL)
              </div>
              {res.racl.eligible ? (
                <>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: "#22c55e", marginBottom: 6 }}>
                    Éligible — départ à {res.racl.ageDepart} ans
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{res.racl.motif}</div>
                  <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-secondary)" }}>
                    Année de départ estimée : <strong style={{ color: "var(--text)" }}>{res.anneeDepart}</strong>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: "#ef4444", marginBottom: 6 }}>
                    Non éligible au RACL
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {agePremierTrimestre > 20
                      ? `Votre 1er trimestre cotisé à ${agePremierTrimestre} ans dépasse les 20 ans requis pour le RACL 60 ans.`
                      : trimestresCotises < res.dureeRef + 2
                      ? `Il vous faut ${res.dureeRef + 2} trimestres (durée requise + 2) pour être éligible. Il vous en manque ${res.dureeRef + 2 - trimestresCotises}.`
                      : "Critères de début de carrière non remplis."
                    }
                  </div>
                  <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-secondary)" }}>
                    Départ minimal possible : <strong style={{ color: "var(--text)" }}>{res.ageRefLabel}</strong>
                  </div>
                </>
              )}
            </div>

            {/* Détail calcul */}
            <AccordionSection title="Détail du calcul de pension">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {[
                    ["Salaire mensuel brut", fmtEur(salaireMensuelBrut)],
                    ["PMSS 2025", fmtEur(PMSS)],
                    ["Base de calcul (min salaire, PMSS)", fmtEur(res.salaireBase)],
                    ["Taux de remplacement de base", "50 %"],
                    [`Prorata (${trimestresCotises} / ${res.dureeRef} trim)`, `${(Math.min(trimestresCotises / res.dureeRef, 1) * 100).toFixed(1)} %`],
                    isDecote ? [`Décote (−${res.decotePct.toFixed(2)} %)`, `× ${res.coef.toFixed(4)}`] : null,
                    isSurcote ? [`Surcote (+${res.surcotePct.toFixed(2)} %)`, `× ${res.coef.toFixed(4)}`] : null,
                    ["Pension brute mensuelle estimée", fmtEur(res.pensionBrute)],
                  ].filter(Boolean).map(([label, val], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "8px 0", color: "var(--text-secondary)" }}>{label}</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 12, fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                ⚠️ Estimation indicative basée sur le salaire actuel comme proxy du salaire annuel moyen (SAM, calculé sur vos 25 meilleures années). La retraite complémentaire (AGIRC-ARRCO) s'ajoute à ce montant.
              </div>
            </AccordionSection>
          </div>
        </div>

        <AdUnit slot="retraite-anticipee-mid" style={{ margin: "24px 0" }} />

        {/* À propos */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>À propos de la retraite anticipée carrières longues</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>Le dispositif carrières longues (RACL)</h3>
            <p style={{ marginBottom: 14 }}>Le dispositif de Retraite Anticipée pour Carrières Longues (RACL) permet aux assurés ayant commencé à travailler jeune de partir avant l'âge légal. Après la <strong>réforme 2023 (loi Borne)</strong>, un départ anticipé est possible dès <strong>60 ans</strong> si vous avez cotisé votre premier trimestre avant 21 ans, ou dès <strong>58 ans</strong> si vous avez commencé avant 17 ans. Dans les deux cas, vous devez avoir validé la durée requise pour votre génération augmentée de 2 trimestres supplémentaires.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--text)", marginTop: 16, marginBottom: 10 }}>L'impact de la réforme 2023 par génération</h3>
            <p style={{ marginBottom: 14 }}>La réforme 2023 a progressivement relevé l'âge légal à 64 ans et allongé la durée de cotisation jusqu'à 172 trimestres (43 ans) pour les générations nées à partir de 1968. Pour chaque génération, l'âge légal et la durée requise sont différents : consultez votre relevé de carrière sur <strong>info-retraite.fr</strong> pour connaître vos droits exacts.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--text)", marginTop: 16, marginBottom: 10 }}>Décote, surcote et pension CNAV</h3>
            <p>La <strong>pension de base CNAV</strong> est calculée selon la formule : salaire annuel moyen (25 meilleures années, plafonné au PMSS) × 50 % × prorata de trimestres × coefficient de décote ou surcote. Chaque trimestre manquant entraîne une décote de 1,25 % (jusqu'à −25 %) et chaque trimestre supplémentaire une surcote de +1,25 %, sans plafond. La retraite complémentaire AGIRC-ARRCO s'ajoute à ce montant et représente généralement 30 à 50 % de plus.</p>
          </div>
        </div>

        <SimRecommendations items={RECOMMENDATIONS['/simulateurs/retraite-anticipee']} />

        <FaqSection
          title="Questions fréquentes — Retraite anticipée carrières longues"
          items={FAQ}
        />

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", opacity: 0.6, marginTop: 32 }}>
          Simulation indicative basée sur la réforme 2023 (loi Borne) · Formule CNAV simplifiée · Consultez info-retraite.fr pour votre estimation personnalisée officielle
        </p>

        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        <ShareBar
          params={toParams(vals)}
          report={report}
          name="retraite-anticipee"
        />
      </main>
      <Footer />
    </div>
  );
}
