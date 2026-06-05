import { useState, useEffect, useRef } from "react";
import { track } from '@vercel/analytics';
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, Toggle, AccordionSection,
  Chip, ProgressBar, useAnimatedNumber,
  fmt, fmtEur, SimulateurHeader,
} from "../../components/ui.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";

// ─── Paramètres MSA 2026 ──────────────────────────────────────────────────────
const PASS = 47_100;
const TAUX_PLEIN = 0.50;

// Retraite Complémentaire Obligatoire (RCO) pour exploitants
const TAUX_RCO_T1 = 0.03; // 3 % sur tranche ≤ PASS
const TAUX_RCO_T2 = 0.06; // 6 % sur tranche PASS à 3PASS
const VALEUR_ACHAT_RCO = 0.65; // €/point (2026 estimate)
const VALEUR_SERVICE_RCO = 0.0196; // €/point/an (2026 estimate)

function getDureeRequise(anneeNaissance) {
  if (!anneeNaissance || anneeNaissance <= 1960) return 167;
  if (anneeNaissance <= 1962) return 169;
  if (anneeNaissance === 1963) return 170;
  if (anneeNaissance === 1964) return 171;
  return 172;
}

function getAgeLegal(anneeNaissance) {
  if (!anneeNaissance || anneeNaissance <= 1960) return 62;
  if (anneeNaissance === 1961) return 62.5;
  if (anneeNaissance === 1962) return 63;
  if (anneeNaissance === 1963) return 63.25;
  if (anneeNaissance === 1964) return 63.5;
  return 64;
}

function calcMsaExploitant({ revenu, anneesFaites, anneesRestantes, ageDépart, anneeNaissance }) {
  if (!revenu) return {
    pensionBaseNette: 0, pensionRCO: 0, pensionTotale: 0,
    trimestresTotal: 0, dureeRequise: getDureeRequise(anneeNaissance),
    tauxEffectif: 0, proratisation: 0, decote: 0, surcote: 0,
    totalPoints: 0, trimestresManquants: 0, trimestresSuppl: 0,
    cotisationAnnuelle: 0, ptsParAn: 0,
  };

  const dureeRequise = getDureeRequise(anneeNaissance);
  const ageLegal = getAgeLegal(anneeNaissance);

  const trimestresTotal = ((anneesFaites ?? 0) + (anneesRestantes ?? 0)) * 4;
  const revAnn = revenu * 12; // annual revenue
  const samBA = Math.min(revAnn, PASS);

  // Régime de base MSA (identical rules to CNAV)
  const trimestresManquants = Math.max(0, dureeRequise - trimestresTotal);
  const trimestresSuppl = Math.max(0, trimestresTotal - dureeRequise);
  const ageDép = ageDépart ?? 64;

  let decote = 0, surcote = 0;
  if (ageDép < 67 && trimestresManquants > 0) {
    decote = Math.min(trimestresManquants, 20) * 0.00625;
  }
  if (trimestresTotal >= dureeRequise && ageDép >= ageLegal) {
    surcote = trimestresSuppl * 0.0125;
  }

  const tauxEffectif = Math.max(0, TAUX_PLEIN - decote + surcote);
  const proratisation = Math.min(trimestresTotal / dureeRequise, 1);

  const pensionBaseBrute = (samBA * tauxEffectif * proratisation) / 12;
  const pensionBaseNette = pensionBaseBrute * 0.93;

  // Retraite Complémentaire Obligatoire (RCO) for exploitants
  const annéesTotales = (anneesFaites ?? 0) + (anneesRestantes ?? 0);
  const cotT1 = Math.min(revAnn, PASS) * TAUX_RCO_T1;
  const cotT2 = Math.max(0, Math.min(revAnn, 3 * PASS) - PASS) * TAUX_RCO_T2;
  const cotisationAnnuelle = cotT1 + cotT2;
  const ptsParAn = cotisationAnnuelle / VALEUR_ACHAT_RCO;
  const totalPoints = ptsParAn * annéesTotales;
  const pensionRCOAnnuelle = totalPoints * VALEUR_SERVICE_RCO;
  const pensionRCO = pensionRCOAnnuelle * 0.93 / 12;

  const pensionTotale = pensionBaseNette + pensionRCO;

  return {
    pensionBaseNette, pensionRCO, pensionTotale,
    trimestresTotal, dureeRequise,
    tauxEffectif, proratisation, decote, surcote,
    totalPoints, trimestresManquants, trimestresSuppl,
    cotisationAnnuelle, ptsParAn,
  };
}

// For salariés agricoles (identical to CNAV)
function calcMsaSalarie({ salaire, anneesFaites, anneesRestantes, ageDépart, anneeNaissance }) {
  if (!salaire) return {
    pensionBaseNette: 0, trimestresTotal: 0,
    dureeRequise: getDureeRequise(anneeNaissance), tauxEffectif: 0,
    decote: 0, surcote: 0, proratisation: 0, sam: 0,
    trimestresManquants: 0, trimestresSuppl: 0,
  };

  const dureeRequise = getDureeRequise(anneeNaissance);
  const ageLegal = getAgeLegal(anneeNaissance);

  const trimestresTotal = ((anneesFaites ?? 0) + (anneesRestantes ?? 0)) * 4;
  const sam = salaire * 12;
  const samPlafonné = Math.min(sam, PASS);

  const trimestresManquants = Math.max(0, dureeRequise - trimestresTotal);
  const trimestresSuppl = Math.max(0, trimestresTotal - dureeRequise);
  const ageDép = ageDépart ?? 64;

  let decote = 0, surcote = 0;
  if (ageDép < 67 && trimestresManquants > 0) {
    decote = Math.min(trimestresManquants, 20) * 0.00625;
  }
  if (trimestresTotal >= dureeRequise && ageDép >= ageLegal) {
    surcote = trimestresSuppl * 0.0125;
  }

  const tauxEffectif = Math.max(0, TAUX_PLEIN - decote + surcote);
  const proratisation = Math.min(trimestresTotal / dureeRequise, 1);

  const pensionBrute = (samPlafonné * tauxEffectif * proratisation) / 12;
  const pensionBaseNette = pensionBrute * 0.93;

  return {
    pensionBaseNette, trimestresTotal, dureeRequise,
    tauxEffectif, decote, surcote, proratisation,
    sam, samPlafonné, trimestresManquants, trimestresSuppl,
  };
}

const FAQ = [
  {
    q: "Qu'est-ce que la MSA ?",
    a: "La Mutualité Sociale Agricole (MSA) est le régime de sécurité sociale des exploitants agricoles et des salariés agricoles. Elle gère l'assurance maladie, les allocations familiales et la retraite pour environ 1,3 million d'affiliés.",
  },
  {
    q: "Quelle est la différence entre exploitants et salariés agricoles ?",
    a: "Les exploitants agricoles (propriétaires ou fermiers) cotisent sur leur revenu professionnel et bénéficient d'une retraite complémentaire obligatoire (RCO). Les salariés agricoles relèvent d'un régime de base identique au régime général CNAV (salaire).",
  },
  {
    q: "Qu'est-ce que la RCO (Retraite Complémentaire Obligatoire) ?",
    a: "Depuis 2011, tous les exploitants agricoles cotisent obligatoirement à la RCO : 3 % sur les revenus jusqu'au PASS, et 6 % de 1 à 3 PASS. Cette retraite complémentaire est calculée par points et s'ajoute à la retraite de base MSA.",
  },
  {
    q: "Comment valider des trimestres en tant qu'exploitant agricole ?",
    a: "Un trimestre est validé pour un revenu professionnel déclaré d'au moins 1/4 du PASS annuel (environ 11 775 € en 2026). Les 4 trimestres annuels peuvent être validés quel que soit le montant du revenu si celui-ci ne rend pas compte d'une cessation d'activité.",
  },
  {
    q: "Qu'est-ce que la décote et la surcote MSA ?",
    a: "La décote MSA (−0,625 % par trimestre manquant, jusqu'à −12,5 %) s'applique si vous partez avant 67 ans sans avoir validé le nombre de trimestres requis. La surcote (+1,25 % par trimestre supplémentaire) s'applique après taux plein si vous continuez à travailler.",
  },
  {
    q: "À quel âge puis-je partir en retraite à la MSA ?",
    a: "L'âge légal de départ MSA varie selon votre année de naissance : 62 ans pour les nés avant 1961, progressivement jusqu'à 64 ans pour les nés après 1965. À 67 ans, vous pouvez partir automatiquement au taux plein.",
  },
];

export default function Msa() {
  const [theme, setTheme] = useTheme();

  const [type, setType] = useState("exploitant"); // "exploitant" or "salarie"
  const [revenuSalaire, setRevenuSalaire] = useState(null);

  const resultsRef = useRef(null);
  const [anneeNaissance, setAnneeNaiss] = useState(null);
  const [anneesFaites, setAnneesFaites] = useState(null);
  const [anneesRestantes, setAnneesRest] = useState(null);
  const [ageDépart, setAgeDépart] = useState(null);

  useEffect(() => {
    document.title = "Simulateur Retraite MSA 2025 — Agriculteurs";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Calculez votre retraite agricole MSA : exploitants et salariés agricoles, retraite de base et complémentaire RCO.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.mesimulateurs.fr' + window.location.pathname;
    track('simulator_view', { name: 'msa' });
    if (!sessionStorage.getItem('tracked_msa')) {
      sessionStorage.setItem('tracked_msa', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'msa' })
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.type !== undefined) setType(shared.type);
      if (shared.revenuSalaire !== undefined) setRevenuSalaire(shared.revenuSalaire);
      if (shared.anneeNaissance !== undefined) setAnneeNaiss(shared.anneeNaissance);
      if (shared.anneesFaites !== undefined) setAnneesFaites(shared.anneesFaites);
      if (shared.anneesRestantes !== undefined) setAnneesRest(shared.anneesRestantes);
      if (shared.ageDépart !== undefined) setAgeDépart(shared.ageDépart);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ type, revenuSalaire, anneeNaissance, anneesFaites, anneesRestantes, ageDépart }));
  }, [type, revenuSalaire, anneeNaissance, anneesFaites, anneesRestantes, ageDépart]);

  const isExploitant = type === "exploitant";
  const res = isExploitant
    ? calcMsaExploitant({ revenu: revenuSalaire, anneesFaites, anneesRestantes, ageDépart, anneeNaissance })
    : calcMsaSalarie({ salaire: revenuSalaire, anneesFaites, anneesRestantes, ageDépart, anneeNaissance });

  const pensionAnim = useAnimatedNumber(isExploitant ? res.pensionTotale : res.pensionBaseNette);
  const dureeRequise = getDureeRequise(anneeNaissance);
  const hasResult = (isExploitant ? res.pensionTotale : res.pensionBaseNette) > 0;

  const pensionTotaleMsa = isExploitant ? res.pensionTotale : res.pensionBaseNette;
  const report = {
    title: "Simulateur Retraite Agricole MSA",
    highlight: { label: isExploitant ? "Pension nette mensuelle (base + RCO)" : "Pension nette mensuelle (base MSA)", value: hasResult ? fmtEur(pensionTotaleMsa) : "—" },
    params: [
      { label: "Type d'affilié", value: isExploitant ? "Exploitant" : "Salarié agricole" },
      { label: isExploitant ? "Revenu professionnel annuel" : "Salaire brut mensuel", value: revenuSalaire ? fmtEur(revenuSalaire) : "—" },
      { label: "Année de naissance", value: anneeNaissance ? String(anneeNaissance) : "—" },
      { label: "Années déjà cotisées", value: anneesFaites !== null ? `${anneesFaites} ans` : "—" },
      { label: "Années restantes", value: anneesRestantes !== null ? `${anneesRestantes} ans` : "—" },
      { label: "Âge de départ prévu", value: ageDépart ? `${ageDépart} ans` : "—" },
    ],
    results: hasResult ? [
      { label: "Pension nette mensuelle", value: fmtEur(pensionTotaleMsa), strong: true },
      { label: "Régime de base MSA", value: fmtEur(res.pensionBaseNette) },
      ...(isExploitant ? [{ label: "Complémentaire RCO", value: fmtEur(res.pensionRCO) }] : []),
      { label: "Taux de liquidation", value: `${(res.tauxEffectif * 100).toFixed(2)} %` },
      { label: "Trimestres validés", value: `${res.trimestresTotal} / ${res.dureeRequise}` },
    ] : [],
    notes: hasResult ? [
      res.decote > 0 ? `Décote de ${(res.decote * 100).toFixed(2)} % appliquée (${Math.min(res.trimestresManquants, 20)} trimestres manquants).`
        : res.surcote > 0 ? `Surcote de ${(res.surcote * 100).toFixed(2)} % (${res.trimestresSuppl} trimestres supplémentaires).`
        : "Taux plein atteint — aucune décote ni surcote.",
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur Retraite agricole MSA",
        "url": "https://www.mesimulateurs.fr/simulateurs/msa",
        "description": "Calculez votre retraite agricole MSA : exploitants et salariés agricoles, retraite de base et complémentaire RCO.",
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
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 60px" }}>
        <SimulateurHeader
          icon="🌾"
          badge="Retraite agricole MSA · Données 2026"
          title="Simulateur Retraite Agricole MSA"
          subtitle="Exploitants & salariés agricoles · Données 2026"
          desc="Estimez votre pension de retraite de base MSA et votre retraite complémentaire obligatoire (RCO) en tant qu'exploitant ou salarié agricole."
        />

        {/* Réassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "rgba(184,147,74,0.07)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {["✓ Plafonnement PASS 2026 : 47 100 €", "✓ RCO depuis 2011", "✓ Calcul 100 % local"].map((t, i) => <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>)}
        </div>

        {/* Type toggle */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px 28px", boxShadow: "var(--card-shadow)", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>Votre profil</h2>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 12 }}>Type d'affilié MSA</div>
            <Toggle options={["Exploitant", "Salarié agricole"]} checked={type === "exploitant"} onChange={t => setType(t ? "exploitant" : "salarie")} />
          </div>
          {type === "salarie" && (
            <div role="note" style={{ background: "rgba(68,160,206,0.07)", border: "1px solid rgba(68,160,206,0.25)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              ℹ️ <strong>Régime identique au régime général CNAV.</strong> Les salariés agricoles relevant de la MSA ont les mêmes règles de retraite de base que les salariés du secteur privé (CNAV).
            </div>
          )}
        </div>

        {/* Formulaire */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px 28px", boxShadow: "var(--card-shadow)", marginBottom: 0 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>Votre situation</h2>
          <NumInput
            id="revenu-salaire"
            label={isExploitant ? "Revenu professionnel annuel moyen (BA/BNC)" : "Salaire brut mensuel actuel"}
            value={revenuSalaire}
            onChange={setRevenuSalaire}
            unit={isExploitant ? "€ (annuel)" : "€"}
            min={500}
            max={40000}
            hint={revenuSalaire ? (isExploitant
              ? `Montant annuel : ${fmtEur(revenuSalaire)} · plafonné PASS : ${fmtEur(Math.min(revenuSalaire, PASS))}`
              : `SAM estimé : ${fmtEur(revenuSalaire * 12)}/an · plafonné PASS : ${fmtEur(Math.min(revenuSalaire * 12, PASS))}/an`)
              : isExploitant ? "Revenu professionnel net déclaré (BA pour agriculteurs)" : "Utilisé comme approximation du Salaire Annuel Moyen"}
            tooltip={isExploitant
              ? "Renseignez votre revenu professionnel brut annuel moyen (Bénéfice Agricole). Ce simulateur utilise une moyenne comme approximation."
              : "Le SAM réel est la moyenne de vos 25 meilleures années (plafonnées au PASS). Ce simulateur utilise votre salaire actuel comme approximation."}
          />
          <NumInput id="annee-naissance" label="Année de naissance" value={anneeNaissance} onChange={setAnneeNaiss} min={1950} max={2000}
            hint={anneeNaissance ? `Durée requise : ${getDureeRequise(anneeNaissance)} trimestres · Âge légal de départ : ${getAgeLegal(anneeNaissance)} ans` : "Détermine la durée requise et l'âge légal"}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <NumInput id="annees-faites" label="Années déjà cotisées" value={anneesFaites} onChange={setAnneesFaites} unit="ans" min={0} max={50}
              hint={anneesFaites !== null ? `Soit ${anneesFaites * 4} trimestres validés` : undefined}
            />
            <NumInput id="annees-restantes" label="Années restantes" value={anneesRestantes} onChange={setAnneesRest} unit="ans" min={0} max={50}
              hint={anneesRestantes !== null ? `+${anneesRestantes * 4} trimestres futurs` : undefined}
            />
          </div>

          {/* Barre récapitulative */}
          <div style={{ background: "rgba(184,147,74,0.06)", border: "1px solid rgba(184,147,74,0.15)", borderRadius: 12, padding: "14px 20px", display: "flex", flexWrap: "wrap", marginTop: 4 }}>
            {[
              { l: "Trimestres totaux", v: `${((anneesFaites ?? 0) + (anneesRestantes ?? 0)) * 4}`, gold: true },
              { l: "Durée requise", v: `${dureeRequise} trim.` },
              { l: "Manquants", v: `${Math.max(0, dureeRequise - ((anneesFaites ?? 0) + (anneesRestantes ?? 0)) * 4)} trim.` },
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, minWidth: 100, padding: "4px 16px", borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{item.l}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 700, color: item.gold ? "var(--gold)" : "var(--text)" }}>{item.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Paramètres avancés */}
        <AccordionSection title="Paramètres avancés" subtitle="Âge de départ, décote/surcote">
          <StepperInput
            label="Âge de départ prévu"
            value={ageDépart} onChange={setAgeDépart} min={62} max={70} unit=" ans"
            hint={anneeNaissance ? `Âge légal : ${getAgeLegal(anneeNaissance)} ans · Âge d'annulation décote : 67 ans` : "Âge légal de départ en 2026 : 64 ans (nés 1965+)"}
            tooltip="Partir avant l'âge légal sans taux plein entraîne une décote. À 67 ans, le taux plein est automatique quelle que soit la durée cotisée."
          />
        </AccordionSection>

        {/* Résultats */}
        <div ref={resultsRef} style={{ background: "linear-gradient(135deg,rgba(184,147,74,0.08),rgba(232,192,106,0.03))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginTop: 20, boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>Votre pension estimée</h2>

          <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
              {isExploitant ? "Pension nette mensuelle estimée (base + RCO)" : "Pension nette mensuelle estimée (base MSA)"}
            </div>
            {!hasResult ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>Saisissez vos paramètres pour voir votre estimation.</p>
            ) : (
              <>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,10vw,72px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  aria-label={`${Math.round(isExploitant ? res.pensionTotale : res.pensionBaseNette)} euros par mois`}>
                  {pensionAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                  soit <strong>{isExploitant ? fmtEur((res.pensionBaseNette / 0.93) + (res.pensionRCO / 0.93)) : fmtEur(res.pensionBaseNette / 0.93)}/mois brut</strong> avant prélèvements (~7 %)
                </div>
              </>
            )}
          </div>

          {hasResult && (
            <>
              {/* Taux banner */}
              <div style={{ background: res.decote > 0 ? "rgba(239,68,68,0.07)" : res.surcote > 0 ? "rgba(34,197,94,0.07)" : "var(--card-bg)", border: `1px solid ${res.decote > 0 ? "rgba(239,68,68,0.25)" : res.surcote > 0 ? "rgba(34,197,94,0.25)" : "var(--border)"}`, borderRadius: 12, padding: "13px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 4 }}>Taux de liquidation</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    {res.decote > 0 && <span style={{ color: "#f87171" }}>Décote −{(res.decote * 100).toFixed(2)} % ({Math.min(res.trimestresManquants, 20)} trim. × 0,625 %)</span>}
                    {res.surcote > 0 && <span style={{ color: "#4ade80" }}>Surcote +{(res.surcote * 100).toFixed(2)} % ({res.trimestresSuppl} trim. × 1,25 %)</span>}
                    {res.decote === 0 && res.surcote === 0 && "Taux plein — aucune décote ni surcote"}
                  </div>
                </div>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: res.decote > 0 ? "#f87171" : res.surcote > 0 ? "#4ade80" : "var(--text-secondary)" }}>
                  {(res.tauxEffectif * 100).toFixed(2)} %
                </span>
              </div>

              {/* Chips */}
              {isExploitant ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                  <Chip label="Trimestres" value={`${res.trimestresTotal}`} />
                  <Chip label="Proratisation" value={`${(res.proratisation * 100).toFixed(0)} %`} />
                  <Chip label="Revenu plafonné" value={`${fmtEur(Math.min((revenuSalaire ?? 0) * res.proratisation, PASS) / 12)}/mois`} accent />
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                  <Chip label="Trimestres" value={`${res.trimestresTotal}`} />
                  <Chip label="Proratisation" value={`${(res.proratisation * 100).toFixed(0)} %`} />
                  <Chip label="SAM plafonné" value={`${fmtEur(res.samPlafonné * res.proratisation / 12)}/mois`} accent />
                </div>
              )}

              <ProgressBar label="Trimestres validés" value={res.trimestresTotal} total={res.dureeRequise} color="linear-gradient(90deg,var(--gold-mid),var(--gold))" />

              {/* Détails RCO for exploitants */}
              {isExploitant && (
                <AccordionSection title="Points RCO" subtitle="Retraite Complémentaire Obligatoire — Cotisation et points">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                    <Chip label="Cotisation annuelle" value={fmtEur(res.cotisationAnnuelle)} />
                    <Chip label="Points par an" value={fmt(res.ptsParAn)} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                    <Chip label="Points RCO totaux" value={fmt(res.totalPoints)} />
                    <Chip label="Valeur service" value={`${VALEUR_SERVICE_RCO} €/pt` } />
                  </div>
                  <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    <strong>Calcul RCO :</strong> Cotisation annuelle = 3 % × revenu jusqu'au PASS + 6 % × (revenu jusqu'à 3 PASS − PASS). Points annuels = cotisation / 0,65 € (valeur d'achat). Pension RCO = points × {VALEUR_SERVICE_RCO} €/an.
                  </div>
                </AccordionSection>
              )}

              {/* Détails Trimestres */}
              <AccordionSection title="Trimestres MSA" subtitle="Durée, validation et taux effectif">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  <Chip label="Trimestres total" value={`${res.trimestresTotal}`} />
                  <Chip label="Durée requise" value={`${res.dureeRequise}`} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  <Chip label="Manquants" value={`${Math.max(0, res.trimestresManquants)}`} />
                  <Chip label="Supplémentaires" value={`${Math.max(0, res.trimestresSuppl)}`} />
                </div>
                <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  <strong>Taux effectif :</strong> Base 50 % {res.decote > 0 ? `− décote de ${(res.decote * 100).toFixed(2)} %` : ""} {res.surcote > 0 ? `+ surcote de ${(res.surcote * 100).toFixed(2)} %` : ""} = <strong>{(res.tauxEffectif * 100).toFixed(2)} %</strong>
                </div>
              </AccordionSection>

              <div role="note" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16 }}>
                ⚠️ <strong>Simulation indicative.</strong> {isExploitant ? "Le SAM réel est calculé sur vos 25 meilleures années. La RCO utilise des paramètres 2026 estimés." : "Le SAM réel est calculé sur vos 25 meilleures années."} Pour un calcul officiel : <a href="https://www.info-retraite.fr" target="_blank" rel="noopener" style={{ color: "var(--gold-mid)" }}>info-retraite.fr</a>.
              </div>
            </>
          )}
        </div>

        <ShareBar params={{ type, revenuSalaire, anneeNaissance, anneesFaites, anneesRestantes, ageDépart }} resultsRef={resultsRef} report={report} name="msa" />

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos de ce simulateur</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>La Mutualité Sociale Agricole : un régime complet</h3>
            <p style={{ marginBottom: 16 }}>La MSA (Mutualité Sociale Agricole) est le guichet unique de protection sociale de l'agriculture française. Elle gère l'assurance maladie, la retraite, les allocations familiales et les accidents du travail pour les exploitants agricoles, leurs conjoints collaborateurs, et les salariés agricoles. Avec plus de 5 millions de bénéficiaires, c'est le deuxième régime de protection sociale français après le régime général.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Exploitants et salariés : deux régimes distincts</h3>
            <p style={{ marginBottom: 16 }}>La retraite MSA couvre deux populations différentes. Les salariés agricoles bénéficient d'un régime aligné sur le régime général (CNAV), avec les mêmes règles de trimestres, de SAM et de taux de liquidation. Les exploitants agricoles relèvent d'un régime spécifique où la retraite de base est calculée en points, sur la base des revenus professionnels agricoles déclarés chaque année.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>La Retraite Complémentaire Obligatoire (RCO)</h3>
            <p>En plus de la retraite de base, les exploitants agricoles bénéficient depuis 2003 d'une Retraite Complémentaire Obligatoire (RCO) par points. La loi Chassaigne de 2021 a renforcé ce dispositif en revalorisent les petites retraites agricoles au niveau de 85 % du SMIC net pour une carrière complète. La cotisation RCO est obligatoire pour tous les chefs d'exploitation depuis 2003, et étendue aux conjoints collaborateurs depuis 2011.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Questions fréquentes — MSA</h2>
          {FAQ.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          <p style={{ paddingTop: 20, fontSize: 12, color: "var(--text-secondary)" }}>
            Source officielle : <a href="https://www.msa.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>msa.fr</a> · <a href="https://www.info-retraite.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>info-retraite.fr</a>
          </p>
        </div>

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>
      </div>
      <Footer />
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button onClick={() => setOpen(o => !o)} aria-expanded={open}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, background: "none", border: "none", cursor: "pointer", padding: "18px 0", textAlign: "left" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: "var(--text)", lineHeight: 1.4 }}>{q}</span>
        <span aria-hidden="true" style={{ flexShrink: 0, fontSize: 18, color: open ? "var(--gold)" : "var(--text-secondary)" }}>{open ? "−" : "+"}</span>
      </button>
      {open && <p style={{ paddingBottom: 18, paddingRight: 32, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>{a}</p>}
    </div>
  );
}
