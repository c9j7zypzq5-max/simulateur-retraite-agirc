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

// ─── Barème de la pension de réversion ──────────────────────────────────────────
// Valeurs INDICATIVES 2025, isolées ici pour être corrigées facilement.
//
// Régime de base (CNAV) : 54 % de la pension du défunt, soumis à condition de
// ressources et à un âge minimum de 55 ans. Le plafond de ressources annuelles
// 2025 = 2 080 × SMIC horaire (11,88 €) = 24 710 € pour une personne seule,
// × 1,6 = 39 537 € pour un couple. Si les ressources + la réversion dépassent ce
// plafond, la réversion est réduite à due concurrence (réversion différentielle).
//
// Régime complémentaire (Agirc-Arrco) : 60 % de la pension complémentaire du
// défunt, SANS condition de ressources, mais âge minimum 55 ans et suppression en
// cas de remariage.
const TAUX_BASE = 0.54;
const TAUX_COMPL = 0.60;
const PLAFOND_SEUL = 24710;     // ressources annuelles, personne seule (2025)
const PLAFOND_COUPLE = 39537;   // ressources annuelles, en couple (2025)
const AGE_MIN = 55;

const sectionTitle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 20 };

function calcReversion({ pensionBase, pensionCompl, ressources, situation, age }) {
  const eligibleAge = (age ?? 0) >= AGE_MIN;
  const plafond = situation === "couple" ? PLAFOND_COUPLE : PLAFOND_SEUL;
  const reversionBaseBruteAnnuelle = (pensionBase ?? 0) * 12 * TAUX_BASE;
  const depassement = Math.max(0, (ressources ?? 0) + reversionBaseBruteAnnuelle - plafond);
  const reversionBaseMensuelle = eligibleAge ? Math.max(0, reversionBaseBruteAnnuelle - depassement) / 12 : 0;
  const reversionComplMensuelle = eligibleAge ? (pensionCompl ?? 0) * TAUX_COMPL : 0;
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

  const [pensionBase, setPensionBase]   = useState(null);   // mensuelle du défunt
  const [pensionCompl, setPensionCompl] = useState(null);   // mensuelle du défunt (Agirc-Arrco)
  const [ressources, setRessources]     = useState(null);   // annuelles du survivant
  const [situation, setSituation]       = useState("seul"); // "seul" | "couple"
  const [age, setAge]                   = useState(60);

  const resultsRef = useRef(null);

  usePageMeta(
    "Simulateur pension de réversion 2026 — conjoint survivant",
    "Estimez votre pension de réversion : 54 % de la retraite de base (CNAV) et 60 % de la complémentaire Agirc-Arrco, avec la condition de ressources. Calcul gratuit."
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
      if (shared.pensionBase !== undefined) setPensionBase(shared.pensionBase);
      if (shared.pensionCompl !== undefined) setPensionCompl(shared.pensionCompl);
      if (shared.ressources !== undefined) setRessources(shared.ressources);
      if (shared.situation !== undefined) setSituation(shared.situation);
      if (shared.age !== undefined) setAge(shared.age);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ pensionBase, pensionCompl, ressources, situation, age }));
  }, [pensionBase, pensionCompl, ressources, situation, age]);

  // ── Calculs ──
  const eligibleAge = age >= AGE_MIN;
  const plafond = situation === "couple" ? PLAFOND_COUPLE : PLAFOND_SEUL;

  // Réversion de base (54 %), soumise à condition de ressources.
  const reversionBaseBruteAnnuelle = (pensionBase ?? 0) * 12 * TAUX_BASE;
  const ressourcesSurvivant = ressources ?? 0;
  const depassement = Math.max(0, ressourcesSurvivant + reversionBaseBruteAnnuelle - plafond);
  const reversionBaseAnnuelle = eligibleAge ? Math.max(0, reversionBaseBruteAnnuelle - depassement) : 0;
  const reversionBaseMensuelle = reversionBaseAnnuelle / 12;

  // Réversion complémentaire (60 %), sans condition de ressources.
  const reversionComplMensuelle = eligibleAge ? (pensionCompl ?? 0) * TAUX_COMPL : 0;

  const totalMensuel = reversionBaseMensuelle + reversionComplMensuelle;
  const totalAnnuel = totalMensuel * 12;

  const hasInput = (pensionBase ?? 0) > 0 || (pensionCompl ?? 0) > 0;
  const reduiteRessources = depassement > 0 && eligibleAge;

  const animTotal = useAnimatedNumber(totalMensuel);

  const report = {
    title: "Simulateur pension de réversion",
    highlight: { label: "Pension de réversion estimée", value: hasInput ? `${fmtEur(Math.round(totalMensuel))}/mois` : "—" },
    params: [
      { label: "Pension de base du défunt", value: pensionBase ? `${fmtEur(pensionBase)}/mois` : "—" },
      { label: "Pension complémentaire du défunt", value: pensionCompl ? `${fmtEur(pensionCompl)}/mois` : "—" },
      { label: "Ressources du survivant", value: ressources ? `${fmtEur(ressources)}/an` : "—" },
      { label: "Situation", value: situation === "couple" ? "En couple" : "Personne seule" },
      { label: "Âge du survivant", value: `${age} ans` },
    ],
    results: hasInput ? [
      { label: "Réversion totale", value: `${fmtEur(Math.round(totalMensuel))}/mois`, strong: true },
      { label: "Réversion de base (54 %)", value: `${fmtEur(Math.round(reversionBaseMensuelle))}/mois` },
      { label: "Réversion complémentaire (60 %)", value: `${fmtEur(Math.round(reversionComplMensuelle))}/mois` },
      { label: "Soit par an", value: fmtEur(Math.round(totalAnnuel)) },
    ] : [],
    notes: hasInput ? [
      !eligibleAge ? `Âge inférieur à ${AGE_MIN} ans : aucune réversion n'est due à ce stade.` : null,
      reduiteRessources ? `Réversion de base réduite de ${fmtEur(Math.round(depassement))}/an pour respecter le plafond de ressources (${fmtEur(plafond)}).` : null,
    ].filter(Boolean) : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur pension de réversion 2026",
        "url": "https://www.simfinly.com/simulateurs/pension-reversion",
        "description": "Estimez la pension de réversion du conjoint survivant : 54 % de la retraite de base et 60 % de la complémentaire Agirc-Arrco, avec condition de ressources.",
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
          { "@type": "HowToStep", "name": "Saisir la pension du défunt", "text": "Indiquez la pension de retraite de base et, le cas échéant, complémentaire que percevait ou aurait perçue le défunt." },
          { "@type": "HowToStep", "name": "Renseigner votre situation", "text": "Précisez vos ressources annuelles, votre situation (seul ou en couple) et votre âge." },
          { "@type": "HowToStep", "name": "Lire le résultat", "text": "Le simulateur applique 54 % sur la base (sous condition de ressources) et 60 % sur la complémentaire pour estimer votre réversion." },
        ],
      }} />
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "28px 16px 60px" : "28px 24px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/pension-reversion" size={34} />}
          badge="Retraite · Simulation 2025"
          title="Simulateur pension de réversion"
          subtitle="Conjoint survivant · Base & complémentaire"
          desc="Estimez la pension de réversion du conjoint survivant : 54 % de la retraite de base (CNAV), 60 % de la complémentaire Agirc-Arrco, en tenant compte de la condition de ressources et de l'âge."
        />

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>

          {/* ── Colonne formulaire ── */}
          <div style={{ order: isMobile ? 2 : 1 }}>
            <div style={card}>
              <h2 style={sectionTitle}>Pension du défunt</h2>
              <NumInput label="Retraite de base (CNAV)" value={pensionBase} onChange={setPensionBase} unit="€/mois" min={0} max={5000}
                hint="Pension de base mensuelle que percevait (ou aurait perçue) le défunt" />
              <NumInput label="Retraite complémentaire (Agirc-Arrco)" value={pensionCompl} onChange={setPensionCompl} unit="€/mois" min={0} max={5000}
                hint="Optionnel — pension complémentaire mensuelle du défunt (salariés du privé)" />
            </div>

            <div style={card}>
              <h2 style={sectionTitle}>Votre situation</h2>
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
                    {!eligibleAge
                      ? <StatusBadge status="warn" label={`Âge < ${AGE_MIN} ans`} />
                      : <StatusBadge status="good" label="Âge éligible" />}
                    {reduiteRessources && <StatusBadge status="warn" label="Réduite (ressources)" />}
                  </div>
                </>
              )}

              <ShareBar
                params={{ pensionBase, pensionCompl, ressources, situation, age }}
                resultsRef={resultsRef}
                report={report}
                name="pension-reversion"
              />
            </div>

            {hasInput && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <Chip label="Réversion base (54 %)" value={`${fmtEur(Math.round(reversionBaseMensuelle))}/mois`} accent small />
                <Chip label="Réversion compl. (60 %)" value={`${fmtEur(Math.round(reversionComplMensuelle))}/mois`} small />
              </div>
            )}

            {hasInput && (
              <AccordionSection title="Détail du calcul" defaultOpen>
                {[
                  { label: "Réversion de base brute (54 %)", value: `${fmtEur(Math.round(reversionBaseBruteAnnuelle / 12))}/mois` },
                  { label: "Plafond de ressources", value: `${fmtEur(plafond)}/an` },
                  ...(reduiteRessources ? [{ label: "Réduction (dépassement ressources)", value: `− ${fmtEur(Math.round(depassement / 12))}/mois`, accent: true }] : []),
                  { label: "Réversion de base versée", value: `${fmtEur(Math.round(reversionBaseMensuelle))}/mois`, accent: true },
                  { label: "Réversion complémentaire (60 %)", value: `${fmtEur(Math.round(reversionComplMensuelle))}/mois`, accent: true },
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
            base={{ pensionBase, pensionCompl, ressources, situation, age }}
            compute={calcReversion}
            metrics={[
              { label: "Réversion totale",       get: r => r.totalMensuel,            fmt: v => `${fmtEur(Math.round(v))}/mois`, higherBetter: true },
              { label: "Réversion base (54 %)",  get: r => r.reversionBaseMensuelle,  fmt: v => `${fmtEur(Math.round(v))}/mois`, higherBetter: true },
            ]}
          />
        )}

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
            <p style={{ marginBottom: 16 }}>La réversion de base est soumise à un plafond de ressources : en 2025, 24 710 € par an pour une personne seule et 39 537 € pour un couple. Si les ressources du survivant, augmentées de la réversion, dépassent ce plafond, la réversion de base est diminuée du montant excédentaire. La réversion complémentaire Agirc-Arrco échappe en revanche à cette condition, mais est supprimée en cas de remariage.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Âge et démarches</h3>
            <p>La réversion s'obtient à partir de 55 ans. Elle n'est pas versée automatiquement : il faut en faire la demande auprès des caisses de retraite du défunt, idéalement via le service en ligne unique de demande de réversion. En cas de mariages multiples du défunt, la réversion est partagée entre les ex-conjoints au prorata de la durée de chaque mariage.</p>
          </div>
        </div>

        {/* FAQ */}
        <FaqSection items={FAQ} />

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", opacity: 0.6, marginTop: 32 }}>
          Simulation indicative basée sur les barèmes 2025 (taux 54 % / 60 %, plafonds de ressources) · Le calcul réel dépend de tous les régimes du défunt · Ne constitue pas un conseil officiel
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
