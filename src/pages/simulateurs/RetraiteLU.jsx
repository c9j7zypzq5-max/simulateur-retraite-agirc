import { useState, useMemo } from "react";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { NumInput, StepperInput, SimulateurHeader, FaqSection, Chip } from "../../components/ui.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { FAQS } from '../../data/faqs.js';

// Paramètres CNAP 2025
// Valeur du point de pension (majoration au 1er janvier 2025)
const VALEUR_POINT = 10.77; // EUR/mois par année de contribution
const AGE_LEGAL = 65;
const DUREE_COMPLETE = 40; // années pour une carrière complète
const MAJORATION_FAMILLE = 0.05; // 5 % par enfant (max 3 enfants)

// Retraite anticipée
const AGE_ANTICIPE_MIN = 57; // avec 40 ans de cotisations
const AGE_ANTICIPE_40 = 60; // avec 40 ans de cotisations, sans condition carrière longue

// Pension minimale 2025 (40 ans de carrière)
const PENSION_MINIMUM_40ANS = 1_900; // EUR/mois (approximation 2025)

// Calcul simplifié CNAP Luxembourg (régime général des pensions)
// Formula: pension = (revenu_moyen * taux_base * années) + rente_fixe
// Taux de base : 1.85 % par année de cotisation
function calcLU({ salaireAnnuel, anneesTotal, ageDépart, nbEnfants }) {
  if (!salaireAnnuel || !anneesTotal) return null;

  // Revenus cotisables plafonnés à 5× le salaire social minimum
  // SSM 2025 : ~2 700 EUR brut/mois → plafond ~162 000 EUR/an
  const PLAFOND_ANNUEL = 162_000;
  const SAM = Math.min(salaireAnnuel, PLAFOND_ANNUEL);

  // Taux de pension : 1.85 % par année + forfait de 0.02 % par année
  const tauxBase = 0.0185;
  const anneesEffectives = Math.min(anneesTotal, 40);

  // Pension brute = revenu moyen × taux × années
  let pensionBrute = (SAM / 12) * tauxBase * anneesEffectives;

  // Majoration enfants (5 % par enfant, max 3)
  const enfantsEligibles = Math.min(nbEnfants || 0, 3);
  const majorationFamille = pensionBrute * MAJORATION_FAMILLE * enfantsEligibles;
  pensionBrute += majorationFamille;

  // Pension minimale garantie (si carrière ≥ 40 ans)
  if (anneesTotal >= DUREE_COMPLETE) {
    pensionBrute = Math.max(pensionBrute, PENSION_MINIMUM_40ANS);
  }

  // Retenue sociale : ~2.8 % (maladie) + 0 % sur pension (pas d'impôt retenu à la source au LU)
  const retenueAcc = pensionBrute * 0.028;
  const pensionNette = pensionBrute - retenueAcc;

  // Taux de remplacement
  const txRemplacement = (pensionNette / (salaireAnnuel / 12)) * 100;

  // Années manquantes pour la retraite anticipée
  const manqPourAnticiee = Math.max(0, DUREE_COMPLETE - anneesTotal);
  const agePossible = ageDépart >= AGE_LEGAL ? AGE_LEGAL : (anneesTotal >= DUREE_COMPLETE ? AGE_ANTICIPE_40 : null);

  return { pensionBrute, pensionNette, retenueAcc, txRemplacement, anneesEffectives, enfantsEligibles, majorationFamille, agePossible, manqPourAnticiee };
}

const FAQ_ITEMS = FAQS['/simulateurs/retraite-luxembourg'];

const STATUTS = [
  { key: "salarie",     label: "Salarié" },
  { key: "independant", label: "Indépendant" },
  { key: "frontalier",  label: "Frontalier" },
];

export default function RetraiteLU() {
  const [theme, setTheme] = useTheme();
  usePageMeta("Simulateur retraite Luxembourg (CNAP) 2025 — pension & taux de remplacement", "Estimez votre pension CNAP luxembourgeoise selon votre carrière, salaire et âge de départ. Conçu pour les frontaliers et expatriés travaillant au Luxembourg.");

  const [statut, setStatut] = useState("salarie");
  const [salaireAnnuel, setSalaireAnnuel] = useState(60000);
  const [anneesFaites, setAnneesFaites] = useState(20);
  const [anneesRestantes, setAnneesRestantes] = useState(15);
  const [ageDépart, setAgeDépart] = useState(65);
  const [nbEnfants, setNbEnfants] = useState(0);

  const anneesTotal = anneesFaites + anneesRestantes;
  const result = useMemo(() => calcLU({ salaireAnnuel, anneesTotal, ageDépart, nbEnfants }), [salaireAnnuel, anneesTotal, ageDépart, nbEnfants]);

  const eur = n => Math.round(n).toLocaleString("fr-FR") + " €";

  const REPORT_PARAMS = result ? {
    name: "Ma retraite Luxembourg (CNAP)",
    cat: "Retraite",
    highlight: { label: "Pension nette estimée", value: eur(result.pensionNette) },
    sections: [
      { title: "Pension brute", value: eur(result.pensionBrute) },
      { title: "Retenue sociale", value: eur(result.retenueAcc) },
      { title: "Années de carrière", value: `${anneesTotal} ans` },
      { title: "Taux de remplacement", value: `${Math.round(result.txRemplacement)} %` },
    ],
  } : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 80px" }}>
        <SimulateurHeader
          icon="🇱🇺"
          badge="Régime CNAP · Luxembourg 2025"
          title="Simulateur Retraite Luxembourg"
          subtitle="Frontaliers · Expatriés · Résidents"
          desc="Estimez votre pension du régime général luxembourgeois (CNAP) : carrière, salaire cotisé, âge de départ et majoration famille."
        />

        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", marginTop: 24 }}>
          {/* Saisie */}
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, border: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Votre situation</h2>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Statut</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {STATUTS.map(s => <Chip key={s.key} label={s.label} active={statut === s.key} onClick={() => setStatut(s.key)} />)}
              </div>
            </div>

            <NumInput label="Salaire annuel brut (€)" value={salaireAnnuel} onChange={setSalaireAnnuel} min={10000} max={300000} step={1000} />
            <NumInput label="Années de cotisation déjà effectuées" value={anneesFaites} onChange={setAnneesFaites} min={0} max={50} step={1} />
            <NumInput label="Années de cotisation restantes estimées" value={anneesRestantes} onChange={setAnneesRestantes} min={0} max={50} step={1} />
            <StepperInput label="Âge de départ souhaité" value={ageDépart} onChange={setAgeDépart} min={57} max={70} />
            <StepperInput label="Nombre d'enfants élevés" value={nbEnfants} onChange={setNbEnfants} min={0} max={10} />
          </div>

          {/* Résultats */}
          {result && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>Pension nette mensuelle estimée</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 38, fontWeight: 700, color: "var(--primary)", lineHeight: 1 }}>
                  {eur(result.pensionNette)}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
                  Taux de remplacement : {Math.round(result.txRemplacement)} %
                </div>
              </div>

              {[
                { label: "Pension brute mensuelle", value: eur(result.pensionBrute) },
                { label: "Retenue sociale (maladie)", value: `− ${eur(result.retenueAcc)}` },
                { label: "Carrière totale", value: `${anneesTotal} ans` },
                ...(result.enfantsEligibles > 0 ? [{ label: `Majoration famille (${result.enfantsEligibles} enfant${result.enfantsEligibles > 1 ? "s" : ""})`, value: `+ ${eur(result.majorationFamille)}` }] : []),
                { label: "Âge de départ", value: `${ageDépart} ans` },
              ].map((s, i) => (
                <div key={i} style={{ background: "var(--card)", borderRadius: 12, padding: "14px 20px", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.label}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "var(--text)" }}>{s.value}</span>
                </div>
              ))}

              {result.manqPourAnticiee > 0 && (
                <div style={{ padding: "14px 18px", background: "rgba(184,147,74,0.08)", border: "1px solid rgba(184,147,74,0.2)", borderRadius: 12, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Il vous manque <strong>{result.manqPourAnticiee} an{result.manqPourAnticiee > 1 ? "s" : ""}</strong> de cotisations pour accéder à la retraite anticipée à 60 ans.
                </div>
              )}
            </div>
          )}
        </div>

        {REPORT_PARAMS && <ShareBar params={{ salaireAnnuel, anneesFaites, anneesRestantes, ageDépart, nbEnfants }} resultsRef={null} name={REPORT_PARAMS.name} report={REPORT_PARAMS} />}

        <div style={{ marginTop: 24, padding: "16px 20px", background: "rgba(184,147,74,0.07)", border: "1px solid rgba(184,147,74,0.2)", borderRadius: 12, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          <strong>Note :</strong> Ce simulateur est une estimation basée sur le régime général CNAP 2025 (taux indicatifs). Le calcul réel tient compte de l'historique complet des revenus cotisés. Pour une projection personnalisée, consultez votre relevé de carrière sur <em>guichet.lu</em>.
        </div>

        <FaqSection items={FAQ_ITEMS} />
      </main>
      <Footer />
    </div>
  );
}
