import { useState, useEffect, useRef } from "react";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import ScenarioCompare from "../../components/ScenarioCompare.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import AdUnit from "../../components/AdUnit.jsx";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, StatusBadge, useAnimatedNumber,
  fmtEur, SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";
import { FAQS } from '../../data/faqs.js';
import SimRecommendations from '../../components/SimRecommendations.jsx';
import { RECOMMENDATIONS } from '../../data/recommendations.js';
import AffiliateCTA from "../../components/AffiliateCTA.jsx";

// ─── Barème de la pension de réversion ──────────────────────────────────────────
// Valeurs INDICATIVES 2026, isolées ici pour être corrigées facilement.
//
// Régime de base (CNAV) : 54 % de la pension du défunt, soumis à condition de
// ressources et à un âge minimum de 55 ans. Le plafond de ressources annuelles
// 2026 = 2 080 × SMIC horaire brut au 1er janvier 2026 = 25 001,60 € pour une
// personne seule, × 1,6 = 40 002,56 € pour un couple (marié/pacsé/en concubinage
// selon les règles CNAV). Source : circulaire Cnav n° 2025-29 du 22/12/2025,
// revalorisation au 1er janvier 2026. Si les ressources + la réversion dépassent
// ce plafond, la réversion est réduite à due concurrence (réversion différentielle).
//
// Régime complémentaire (Agirc-Arrco) : 60 % de la pension complémentaire du
// défunt, SANS condition de ressources, mais âge minimum 55 ans et suppression
// définitive en cas de remariage, Pacs ou concubinage (contrairement à la base,
// où le remariage n'a plus fait perdre le droit depuis la réforme de 2004 — il
// fait seulement entrer les ressources du nouveau foyer dans le plafond).
//
// Fonction publique (SRE pour l'État, CNRACL pour l'hospitalière/territoriale) :
// régime distinct, sans lien avec le régime général. Taux unique de 50 % (base
// ET retraite additionnelle RAFP), SANS condition de ressources et SANS âge
// minimum pour le conjoint survivant — mais droit supprimé en cas de remariage,
// Pacs ou concubinage, comme pour l'Agirc-Arrco.
const TAUX_BASE = 0.54;
const TAUX_COMPL = 0.60;
const TAUX_FP = 0.50;
const PLAFOND_SEUL = 25001.60;   // ressources annuelles, personne seule (2026)
const PLAFOND_COUPLE = 40002.56; // ressources annuelles, en couple (2026)
const AGE_MIN = 55;

const sectionTitle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 20 };

function calcReversion({ pensionBase, pensionCompl, ressources, situation, age, regime, remarie }) {
  if (regime === "fonction-publique") {
    // Fonction publique : remariage, Pacs ou concubinage supprime la TOTALITÉ du droit.
    if (remarie) return { reversionBaseMensuelle: 0, reversionComplMensuelle: 0, totalMensuel: 0 };
    const reversionBaseMensuelle = (pensionBase ?? 0) * TAUX_FP;
    const reversionComplMensuelle = (pensionCompl ?? 0) * TAUX_FP;
    return { reversionBaseMensuelle, reversionComplMensuelle, totalMensuel: reversionBaseMensuelle + reversionComplMensuelle };
  }

  // Régime général : le remariage ne supprime QUE la complémentaire Agirc-Arrco,
  // pas la réversion de base CNAV (règle depuis la réforme de 2004).
  const eligibleAge = (age ?? 0) >= AGE_MIN;
  const plafond = situation === "couple" ? PLAFOND_COUPLE : PLAFOND_SEUL;
  const reversionBaseBruteAnnuelle = (pensionBase ?? 0) * 12 * TAUX_BASE;
  const depassement = Math.max(0, (ressources ?? 0) + reversionBaseBruteAnnuelle - plafond);
  const reversionBaseMensuelle = eligibleAge ? Math.max(0, reversionBaseBruteAnnuelle - depassement) / 12 : 0;
  const reversionComplMensuelle = (!remarie && eligibleAge) ? (pensionCompl ?? 0) * TAUX_COMPL : 0;
  const totalMensuel = reversionBaseMensuelle + reversionComplMensuelle;
  return { reversionBaseMensuelle, reversionComplMensuelle, totalMensuel };
}

const FAQ = FAQS['/simulateurs/pension-reversion'];

// ─── Simulateur ───────────────────────────────────────────────────────────────
export default function PensionReversion() {
  const [theme, setTheme] = useTheme();
  const isMobile = useIsMobile();

  const card = {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 16, padding: isMobile ? "20px 16px" : "24px 20px",
    marginBottom: 20, boxShadow: "var(--card-shadow)",
  };

  const [regime, setRegime]             = useState("prive"); // "prive" | "fonction-publique"
  const [pensionBase, setPensionBase]   = useState(null);   // mensuelle du défunt
  const [pensionCompl, setPensionCompl] = useState(null);   // mensuelle du défunt (Agirc-Arrco / RAFP)
  const [ressources, setRessources]     = useState(null);   // annuelles du survivant
  const [situation, setSituation]       = useState("seul"); // "seul" | "couple"
  const [age, setAge]                   = useState(60);
  const [remarie, setRemarie]           = useState(false);  // remariage/Pacs/concubinage depuis le décès

  const isFP = regime === "fonction-publique";

  const resultsRef = useRef(null);

  usePageMeta(
    "Simulateur pension de réversion 2026 — privé et fonction publique",
    "Estimez votre pension de réversion : régime général (54 % base + 60 % Agirc-Arrco, condition de ressources) ou fonction publique (50 %, sans condition de ressources). Calcul gratuit."
  );

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'pension-reversion' });
    if (!sessionStorage.getItem('tracked_pension-reversion')) {
      sessionStorage.setItem('tracked_pension-reversion', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'pension-reversion' })
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.regime !== undefined) setRegime(shared.regime);
      if (shared.pensionBase !== undefined) setPensionBase(shared.pensionBase);
      if (shared.pensionCompl !== undefined) setPensionCompl(shared.pensionCompl);
      if (shared.ressources !== undefined) setRessources(shared.ressources);
      if (shared.situation !== undefined) setSituation(shared.situation);
      if (shared.age !== undefined) setAge(shared.age);
      if (shared.remarie !== undefined) setRemarie(shared.remarie);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ regime, pensionBase, pensionCompl, ressources, situation, age, remarie }));
  }, [regime, pensionBase, pensionCompl, ressources, situation, age, remarie]);

  // ── Calculs ──
  const eligibleAge = isFP || age >= AGE_MIN;
  const plafond = situation === "couple" ? PLAFOND_COUPLE : PLAFOND_SEUL;

  // Fonction publique : remariage/Pacs/concubinage supprime la TOTALITÉ du droit.
  // Régime général : il ne supprime QUE la complémentaire Agirc-Arrco (la base
  // CNAV reste due depuis la réforme de 2004, sous condition de ressources).
  const baseSupprimee = isFP && remarie;
  const complSupprimee = remarie;

  // Réversion de base — 54 % (régime général) ou 50 % (fonction publique), soumise
  // à condition de ressources uniquement dans le régime général.
  const reversionBaseBruteAnnuelle = (pensionBase ?? 0) * 12 * (isFP ? TAUX_FP : TAUX_BASE);
  const ressourcesSurvivant = ressources ?? 0;
  const depassement = !isFP ? Math.max(0, ressourcesSurvivant + reversionBaseBruteAnnuelle - plafond) : 0;
  const reversionBaseAnnuelle = (!baseSupprimee && eligibleAge) ? Math.max(0, reversionBaseBruteAnnuelle - depassement) : 0;
  const reversionBaseMensuelle = reversionBaseAnnuelle / 12;

  // Réversion complémentaire — Agirc-Arrco (60 %) ou RAFP fonction publique (50 %).
  const reversionComplMensuelle = (!complSupprimee && eligibleAge) ? (pensionCompl ?? 0) * (isFP ? TAUX_FP : TAUX_COMPL) : 0;

  const totalMensuel = reversionBaseMensuelle + reversionComplMensuelle;
  const totalAnnuel = totalMensuel * 12;

  const hasInput = (pensionBase ?? 0) > 0 || (pensionCompl ?? 0) > 0;
  const reduiteRessources = depassement > 0 && eligibleAge && !baseSupprimee;

  const animTotal = useAnimatedNumber(totalMensuel);

  const labelBase = isFP ? "Réversion fonction publique (50 %)" : "Réversion de base (54 %)";
  const labelCompl = isFP ? "Réversion RAFP (50 %)" : "Réversion complémentaire (60 %)";

  const report = {
    title: "Simulateur pension de réversion",
    highlight: { label: "Pension de réversion estimée", value: hasInput ? `${fmtEur(Math.round(totalMensuel))}/mois` : "—" },
    params: [
      { label: "Régime", value: isFP ? "Fonction publique (SRE / CNRACL)" : "Salarié du privé / indépendant" },
      { label: isFP ? "Pension fonction publique du défunt" : "Pension de base du défunt", value: pensionBase ? `${fmtEur(pensionBase)}/mois` : "—" },
      { label: isFP ? "Retraite additionnelle (RAFP) du défunt" : "Pension complémentaire du défunt", value: pensionCompl ? `${fmtEur(pensionCompl)}/mois` : "—" },
      ...(isFP ? [] : [{ label: "Ressources du survivant", value: ressources ? `${fmtEur(ressources)}/an` : "—" }, { label: "Situation", value: situation === "couple" ? "En couple" : "Personne seule" }, { label: "Âge du survivant", value: `${age} ans` }]),
      { label: "Remarié(e) / Pacsé(e) / concubinage", value: remarie ? "Oui" : "Non" },
    ],
    results: hasInput ? [
      { label: "Réversion totale", value: `${fmtEur(Math.round(totalMensuel))}/mois`, strong: true },
      { label: labelBase, value: `${fmtEur(Math.round(reversionBaseMensuelle))}/mois` },
      { label: labelCompl, value: `${fmtEur(Math.round(reversionComplMensuelle))}/mois` },
      { label: "Soit par an", value: fmtEur(Math.round(totalAnnuel)) },
    ] : [],
    notes: hasInput ? [
      baseSupprimee ? "Remariage, Pacs ou concubinage depuis le décès : le droit à réversion est intégralement supprimé (fonction publique)." : null,
      (!isFP && remarie) ? "Remariage, Pacs ou concubinage : la complémentaire Agirc-Arrco est supprimée (la base CNAV reste due)." : null,
      (!isFP && !eligibleAge) ? `Âge inférieur à ${AGE_MIN} ans : aucune réversion n'est due à ce stade.` : null,
      reduiteRessources ? `Réversion de base réduite de ${fmtEur(Math.round(depassement))}/an pour respecter le plafond de ressources (${fmtEur(plafond)}).` : null,
    ].filter(Boolean) : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur pension de réversion 2026",
        "url": "https://www.simfinly.com/simulateurs/pension-reversion",
        "description": "Estimez la pension de réversion du conjoint survivant, salarié du privé (54 % de la base, 60 % de l'Agirc-Arrco, avec condition de ressources) ou fonctionnaire (50 % sans condition de ressources).",
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
        "name": "Comment calculer sa pension de réversion",
        "description": "Estimer la pension de réversion du conjoint survivant en trois étapes.",
        "step": [
          { "@type": "HowToStep", "name": "Choisir le régime du défunt", "text": "Sélectionnez salarié du privé / indépendant (CNAV + Agirc-Arrco) ou fonctionnaire (SRE / CNRACL)." },
          { "@type": "HowToStep", "name": "Saisir la pension du défunt", "text": "Indiquez la pension de retraite de base et, le cas échéant, complémentaire que percevait ou aurait perçue le défunt." },
          { "@type": "HowToStep", "name": "Renseigner votre situation", "text": "Précisez vos ressources annuelles, votre situation (seul ou en couple), votre âge et un éventuel remariage, Pacs ou concubinage." },
          { "@type": "HowToStep", "name": "Lire le résultat", "text": "Le simulateur applique le taux du régime concerné (54 %/60 % pour le privé, 50 % pour la fonction publique) pour estimer votre réversion." },
        ],
      }} />
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "28px 16px 60px" : "28px 24px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/pension-reversion" size={34} />}
          badge="Retraite · Simulation 2026"
          title="Simulateur pension de réversion"
          subtitle="Conjoint survivant · Privé & fonction publique"
          desc="Estimez la pension de réversion du conjoint survivant, salarié du privé (54 % de la base CNAV, 60 % de l'Agirc-Arrco, condition de ressources) ou fonctionnaire (50 % SRE/CNRACL, sans condition de ressources)."
        />

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>

          {/* ── Colonne formulaire ── */}
          <div style={{ order: isMobile ? 2 : 1 }}>
            <div style={card}>
              <h2 style={sectionTitle}>Régime du défunt</h2>
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {[{ k: "prive", l: "Privé / indépendant" }, { k: "fonction-publique", l: "Fonction publique" }].map(opt => {
                  const active = regime === opt.k;
                  return (
                    <button key={opt.k} onClick={() => setRegime(opt.k)}
                      aria-pressed={active}
                      style={{
                        flex: "1 1 0", padding: "12px 8px", borderRadius: 12, cursor: "pointer",
                        background: active ? "rgba(43,92,230,0.1)" : "var(--card-bg)",
                        border: `1.5px solid ${active ? "var(--gold-mid)" : "var(--border)"}`,
                        color: active ? "var(--gold)" : "var(--text)",
                        fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700,
                        transition: "border-color 0.2s, background 0.2s",
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = "var(--gold-mid)"; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = "var(--border)"; }}
                    >
                      {opt.l}
                    </button>
                  );
                })}
              </div>

              <h2 style={sectionTitle}>Pension du défunt</h2>
              <NumInput label={isFP ? "Pension fonction publique (SRE / CNRACL)" : "Retraite de base (CNAV)"} value={pensionBase} onChange={setPensionBase} unit="€/mois" min={0} max={5000}
                hint={isFP ? "Pension mensuelle que percevait (ou aurait perçue) le défunt" : "Pension de base mensuelle que percevait (ou aurait perçue) le défunt"} />
              <NumInput label={isFP ? "Retraite additionnelle (RAFP)" : "Retraite complémentaire (Agirc-Arrco)"} value={pensionCompl} onChange={setPensionCompl} unit="€/mois" min={0} max={5000}
                hint={isFP ? "Optionnel — pension RAFP mensuelle du défunt, si perçue" : "Optionnel — pension complémentaire mensuelle du défunt (salariés du privé)"} />
            </div>

            <div style={card}>
              <h2 style={sectionTitle}>Votre situation</h2>
              {!isFP && (
                <>
                  <NumInput label="Vos ressources annuelles" value={ressources} onChange={setRessources} unit="€/an" min={0} max={200000}
                    tooltip="Ressources annuelles du conjoint survivant (revenus, pensions personnelles…), servant à la condition de ressources de la réversion de base."
                    hint={`Plafond ${situation === "couple" ? "couple" : "personne seule"} : ${fmtEur(plafond)}/an`} />

                  <div style={{ marginTop: 16, marginBottom: 8 }}>
                    <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
                      Situation
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[{ k: "seul", l: "Personne seule" }, { k: "couple", l: "En couple" }].map(opt => {
                        const active = situation === opt.k;
                        return (
                          <button key={opt.k} onClick={() => setSituation(opt.k)}
                            aria-pressed={active}
                            style={{
                              flex: "1 1 0", padding: "12px 8px", borderRadius: 12, cursor: "pointer",
                              background: active ? "rgba(43,92,230,0.1)" : "var(--card-bg)",
                              border: `1.5px solid ${active ? "var(--gold-mid)" : "var(--border)"}`,
                              color: active ? "var(--gold)" : "var(--text)",
                              fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700,
                              transition: "border-color 0.2s, background 0.2s",
                            }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = "var(--gold-mid)"; }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = "var(--border)"; }}
                          >
                            {opt.l}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <StepperInput label="Votre âge" value={age} onChange={v => setAge(Math.round(v))} min={40} max={90} step={1} unit="ans"
                      hint={eligibleAge ? "Âge éligible (≥ 55 ans)" : `Réversion possible à partir de ${AGE_MIN} ans`} />
                  </div>
                </>
              )}

              <div style={{ marginTop: isFP ? 0 : 16 }}>
                <button onClick={() => setRemarie(r => !r)} aria-pressed={remarie}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, cursor: "pointer",
                    background: remarie ? "rgba(220,38,38,0.08)" : "var(--card-bg)",
                    border: `1.5px solid ${remarie ? "var(--negative)" : "var(--border)"}`,
                    color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 13, textAlign: "left",
                  }}
                >
                  <span style={{
                    width: 18, height: 18, borderRadius: 5, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1.5px solid ${remarie ? "var(--negative)" : "var(--border)"}`, background: remarie ? "var(--negative)" : "transparent", color: "#fff", fontSize: 12,
                  }}>
                    {remarie ? "✓" : ""}
                  </span>
                  Remarié(e), pacsé(e) ou en concubinage depuis le décès
                </button>
              </div>
            </div>
          </div>

          {/* ── Colonne résultats ── */}
          <div style={{ order: isMobile ? 1 : 2, minWidth: 0 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 20, textAlign: "center", boxShadow: "var(--card-shadow)" }} ref={resultsRef}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'Hanken Grotesk', sans-serif", marginBottom: 6 }}>
                Pension de réversion estimée
              </div>
              {!hasInput ? (
                <p style={{ color: "var(--text-secondary)", padding: "20px 0", fontSize: 14 }}>
                  Renseignez la pension du défunt pour estimer votre réversion.
                </p>
              ) : (
                <>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 42, color: "var(--primary)", lineHeight: 1 }}>
                    {fmtEur(Math.round(animTotal))}<span style={{ fontSize: 20, fontWeight: 600 }}>/mois</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
                    soit {fmtEur(Math.round(totalAnnuel))}/an
                  </div>
                  <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                    {!isFP && (!eligibleAge
                      ? <StatusBadge status="warn" label={`Âge < ${AGE_MIN} ans`} />
                      : <StatusBadge status="good" label="Âge éligible" />)}
                    {reduiteRessources && <StatusBadge status="warn" label="Réduite (ressources)" />}
                    {baseSupprimee && <StatusBadge status="warn" label="Droit supprimé (remariage)" />}
                    {!isFP && remarie && <StatusBadge status="warn" label="Complémentaire supprimée (remariage)" />}
                  </div>
                </>
              )}

              <ShareBar
                params={{ regime, pensionBase, pensionCompl, ressources, situation, age, remarie }}
                resultsRef={resultsRef}
                report={report}
                name="pension-reversion"
              />
            </div>

            {hasInput && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <Chip label={labelBase} value={`${fmtEur(Math.round(reversionBaseMensuelle))}/mois`} accent small />
                <Chip label={labelCompl} value={`${fmtEur(Math.round(reversionComplMensuelle))}/mois`} small />
              </div>
            )}

            {hasInput && (
              <AccordionSection title="Détail du calcul" defaultOpen>
                {[
                  { label: `${labelBase} — brute`, value: `${fmtEur(Math.round(reversionBaseBruteAnnuelle / 12))}/mois` },
                  ...(!isFP ? [{ label: "Plafond de ressources", value: `${fmtEur(plafond)}/an` }] : []),
                  ...(reduiteRessources ? [{ label: "Réduction (dépassement ressources)", value: `− ${fmtEur(Math.round(depassement / 12))}/mois`, accent: true }] : []),
                  { label: `${labelBase} — versée`, value: `${fmtEur(Math.round(reversionBaseMensuelle))}/mois`, accent: true },
                  { label: labelCompl, value: `${fmtEur(Math.round(reversionComplMensuelle))}/mois`, accent: true },
                  { label: "Total mensuel", value: `${fmtEur(Math.round(totalMensuel))}/mois`, accent: true },
                  { label: "Total annuel", value: fmtEur(Math.round(totalAnnuel)) },
                ].map(({ label, value, accent }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: accent ? "var(--gold)" : "var(--text)" }}>{value}</span>
                  </div>
                ))}
              </AccordionSection>
            )}
          </div>
        </div>

        {hasInput && (
          <ScenarioCompare
            name="pension-reversion"
            fields={[
              { key: "pensionBase",  label: "Retraite de base du défunt",   unit: "€/mois", type: "num",  min: 0, max: 5000,   kind: "eur" },
              { key: "pensionCompl", label: "Retraite complémentaire",      unit: "€/mois", type: "num",  min: 0, max: 5000,   kind: "eur" },
              { key: "ressources",   label: "Ressources du survivant",      unit: "€/an",   type: "num",  min: 0, max: 200000, kind: "eur" },
            ]}
            base={{ pensionBase, pensionCompl, ressources, situation, age, regime, remarie }}
            compute={calcReversion}
            metrics={[
              { label: "Réversion totale",       get: r => r.totalMensuel,            fmt: v => `${fmtEur(Math.round(v))}/mois`, higherBetter: true },
              { label: labelBase,                get: r => r.reversionBaseMensuelle,  fmt: v => `${fmtEur(Math.round(v))}/mois`, higherBetter: true },
            ]}
          />
        )}

        {hasInput && <AffiliateCTA type="retraite" />}

        {/* AdSense mid */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {/* À propos */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos de la pension de réversion</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>Une fraction de la pension du défunt</h3>
            <p style={{ marginBottom: 16 }}>La pension de réversion permet au conjoint survivant de percevoir une partie de la retraite dont bénéficiait ou aurait bénéficié son époux décédé. Elle se compose de la réversion de base, versée par le régime général (CNAV) à hauteur de 54 % de la pension du défunt, et de la réversion complémentaire Agirc-Arrco, égale à 60 % de la pension complémentaire pour les salariés du privé. Le seul mariage ouvre ce droit : le PACS et le concubinage en sont exclus.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>La condition de ressources</h3>
            <p style={{ marginBottom: 16 }}>La réversion de base est soumise à un plafond de ressources : en 2026, 25 001,60 € par an pour une personne seule et 40 002,56 € pour un couple. Si les ressources du survivant, augmentées de la réversion, dépassent ce plafond, la réversion de base est diminuée du montant excédentaire. La réversion complémentaire Agirc-Arrco échappe en revanche à cette condition, mais elle est supprimée en cas de remariage, Pacs ou concubinage — contrairement à la base, qui reste due (le remariage entre alors seulement dans le calcul des ressources du foyer).</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Le cas particulier de la fonction publique</h3>
            <p style={{ marginBottom: 16 }}>Les fonctionnaires (État via le SRE, hospitalière et territoriale via la CNRACL) relèvent d'un régime de réversion différent : le taux est de 50 % (pension principale et retraite additionnelle RAFP), sans aucune condition de ressources pour le conjoint survivant. En contrepartie, un remariage, un Pacs ou un concubinage supprime intégralement le droit à réversion — y compris la part principale, contrairement au régime général.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Âge et démarches</h3>
            <p>Dans le régime général, la réversion s'obtient à partir de 55 ans ; la fonction publique ne prévoit pas d'âge minimum pour le conjoint survivant. Elle n'est pas versée automatiquement : il faut en faire la demande auprès des caisses de retraite du défunt, idéalement via le service en ligne unique de demande de réversion. En cas de mariages multiples du défunt, la réversion est partagée entre les ex-conjoints au prorata de la durée de chaque mariage.</p>
          </div>
        </div>

        {/* Guide associé */}
        <a href="/retraite/calcul-pension-reversion" style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--primary-soft, rgba(212,175,55,0.08))", border: "1px solid var(--border-gold, rgba(212,175,55,0.3))", borderRadius: 12, padding: "14px 18px", marginTop: 20, textDecoration: "none", color: "var(--text)" }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>💞</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Guide complet pension de réversion 2026</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Taux, conditions, plafond de ressources et démarches pour tous les régimes</div>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 18, color: "var(--text-secondary)", flexShrink: 0 }}>›</span>
        </a>

        {/* FAQ */}
        <SimRecommendations items={RECOMMENDATIONS['/simulateurs/pension-reversion']} />

        <FaqSection items={FAQ} />

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", opacity: 0.6, marginTop: 32 }}>
          Simulation indicative basée sur les barèmes 2026 (54 % / 60 % pour le privé, 50 % pour la fonction publique, plafonds de ressources) · Le calcul réel dépend de tous les régimes du défunt · Ne constitue pas un conseil officiel
        </p>

        {/* AdSense bas */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
