import { useState, useEffect, useRef } from "react";
import { track } from '@vercel/analytics';
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, ProgressBar, useAnimatedNumber,
  fmt, fmtEur, SimulateurHeader,
} from "../../components/ui.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";

// ─── Paramètres CNAV 2026 ────────────────────────────────────────────────────
const PASS = 47_100;
const TAUX_PLEIN = 0.50;

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

function calcCnav({ salaire, anneesFaites, anneesRestantes, ageDépart, anneeNaissance }) {
  if (!salaire) return {
    pensionBrute: 0, pensionNette: 0, trimestresTotal: 0,
    dureeRequise: getDureeRequise(anneeNaissance), tauxEffectif: 0,
    decote: 0, surcote: 0, proratisation: 0, sam: 0,
    trimestresManquants: 0, trimestresSuppl: 0,
  };

  const dureeRequise = getDureeRequise(anneeNaissance);
  const ageLegal     = getAgeLegal(anneeNaissance);

  const trimestresTotal = ((anneesFaites ?? 0) + (anneesRestantes ?? 0)) * 4;
  const sam = salaire * 12; // simplification : SAM = salaire actuel × 12
  const samPlafonné = Math.min(sam, PASS);

  const trimestresManquants = Math.max(0, dureeRequise - trimestresTotal);
  const trimestresSuppl     = Math.max(0, trimestresTotal - dureeRequise);
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
  const pensionNette = pensionBrute * 0.93;

  return {
    pensionBrute, pensionNette, trimestresTotal, dureeRequise,
    tauxEffectif, decote, surcote, proratisation,
    sam, samPlafonné, trimestresManquants, trimestresSuppl,
  };
}

const FAQ = [
  { q: "Comment est calculé le Salaire Annuel Moyen (SAM) ?", a: "Le SAM est la moyenne de vos 25 meilleures années de salaire (brut, plafonné au PASS chaque année). Ce simulateur utilise votre salaire actuel comme approximation. Pour un calcul précis, consultez votre relevé de carrière sur info-retraite.fr." },
  { q: "Qu'est-ce que la décote CNAV ?", a: "Si vous partez avant 67 ans sans avoir validé le nombre de trimestres requis, une décote de 0,625 % par trimestre manquant s'applique, dans la limite de 20 trimestres (soit −12,5 % maximum). À 67 ans, la décote ne s'applique plus quel que soit le nombre de trimestres." },
  { q: "Qu'est-ce que la surcote CNAV ?", a: "Si vous continuez à travailler après avoir atteint le taux plein (trimestres validés ≥ durée requise ET âge ≥ âge légal), vous cumulez une surcote de +1,25 % par trimestre supplémentaire, sans plafond." },
  { q: "CNAV et Agirc-Arrco : quelle différence ?", a: "La CNAV (Caisse Nationale d'Assurance Vieillesse) verse la retraite de base des salariés du privé, plafonnée à 50 % du PASS (23 550 €/an). L'Agirc-Arrco est la retraite complémentaire, calculée par points, qui vient s'y ajouter. Pour une retraite complète, il faut simuler les deux." },
];

export default function Cnav() {
  const [theme, setTheme] = useTheme();

  const [salaire, setSalaire]             = useState(null);
  const [anneeNaissance, setAnneeNaiss]   = useState(null);
  const [anneesFaites, setAnneesFaites]   = useState(null);
  const [anneesRestantes, setAnneesRest]  = useState(null);
  const [ageDépart, setAgeDépart]         = useState(null);

  const resultsRef = useRef(null);


  useEffect(() => {
    document.title = "Simulateur Retraite CNAV 2025 — Régime général salariés";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Estimez votre pension de retraite du régime général (CNAV) : trimestres validés, taux plein, décote et surcote.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.mesimulateurs.fr' + window.location.pathname;
    track('simulator_view', { name: 'cnav' });
    if (!sessionStorage.getItem('tracked_cnav')) {
      sessionStorage.setItem('tracked_cnav', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'cnav' })
      }).catch(() => {});
    }
  }, []);
  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.salaire !== undefined) setSalaire(shared.salaire); if (shared.anneesFaites !== undefined) setAnneesFaites(shared.anneesFaites); if (shared.ageDépart !== undefined) setAgeDépart(shared.ageDépart)
    }
  }, []);
  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ salaire, anneesFaites, anneesRestantes, ageDépart }));
  }, [salaire, anneesFaites, anneesRestantes, ageDépart]);



  const res = calcCnav({ salaire, anneesFaites, anneesRestantes, ageDépart, anneeNaissance });
  const pensionAnim = useAnimatedNumber(res.pensionNette);
  const dureeRequise = getDureeRequise(anneeNaissance);

  const hasResult = res.pensionNette > 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur Retraite CNAV — Régime général",
        "url": "https://www.mesimulateurs.fr/simulateurs/cnav",
        "description": "Estimez votre pension de retraite du régime général (CNAV) : trimestres validés, taux plein, décote et surcote.",
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
          icon="🏛"
          badge="Régime de base · Données 2026"
          title="Simulateur Retraite CNAV"
          subtitle="Estimation en 30 secondes · Données officielles 2026"
          desc="Estimez votre pension de retraite de base selon vos trimestres validés, votre salaire et votre âge de départ."
        />

        {/* Réassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "rgba(184,147,74,0.07)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {["✓ Plafonnement PASS 2026 : 47 100 €", "✓ Taux plein : 50 %", "✓ Calcul 100 % local"].map((t, i) => <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>)}
        </div>

        {/* Formulaire */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "32px 28px", boxShadow: "var(--card-shadow)", marginBottom: 0 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>Votre situation</h2>
          <NumInput id="salaire" label="Salaire brut mensuel actuel" value={salaire} onChange={setSalaire} unit="€" min={500} max={40000}
            hint={salaire ? `SAM estimé : ${fmtEur(salaire * 12)}/an · plafonné PASS : ${fmtEur(Math.min(salaire * 12, PASS))}/an` : "Utilisé comme approximation du Salaire Annuel Moyen"}
            tooltip="Le SAM réel est la moyenne de vos 25 meilleures années (plafonnées au PASS). Ce simulateur utilise votre salaire actuel comme approximation."
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
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Pension nette mensuelle estimée (base CNAV)</div>
            {!hasResult ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>Saisissez vos paramètres pour voir votre estimation.</p>
            ) : (
              <>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(48px,10vw,72px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  aria-label={`${Math.round(res.pensionNette)} euros par mois`}>
                  {pensionAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                  soit <strong>{fmtEur(res.pensionBrute)}/mois brut</strong> avant prélèvements (~7 %)
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                <Chip label="Trimestres" value={`${res.trimestresTotal}`} />
                <Chip label="Proratisation" value={`${(res.proratisation * 100).toFixed(0)} %`} />
                <Chip label="SAM plafonné" value={`${fmtEur(res.samPlafonné * res.proratisation / 12)}/mois`} accent />
              </div>

              <ProgressBar label="Trimestres validés" value={res.trimestresTotal} total={res.dureeRequise} color="linear-gradient(90deg,var(--gold-mid),var(--gold))" />

              <div role="note" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16 }}>
                ⚠️ <strong>Simulation indicative.</strong> Le SAM réel est calculé sur vos 25 meilleures années. Cette pension de base s'ajoute à la retraite complémentaire Agirc-Arrco.
                Pour un calcul officiel : <a href="https://www.info-retraite.fr" target="_blank" rel="noopener" style={{ color: "var(--gold-mid)" }}>info-retraite.fr</a>.
              </div>
            </>
          )}
        </div>

        <ShareBar params={{ salaire, anneesFaites, anneesRestantes, ageDépart }} resultsRef={resultsRef} name="cnav" />

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos de ce simulateur</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>Le régime général de la Sécurité Sociale</h3>
            <p style={{ marginBottom: 16 }}>La Caisse Nationale d'Assurance Vieillesse (CNAV) est le régime de retraite de base de tous les salariés du secteur privé. Elle verse une pension proportionnelle à vos revenus et à la durée de votre cotisation. En 2026, la pension de base est plafonnée à 50 % du Plafond Annuel de la Sécurité Sociale (PASS), soit 23 550 € brut par an au maximum.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Trimestres, SAM et taux de liquidation</h3>
            <p style={{ marginBottom: 16 }}>Votre pension CNAV dépend de trois variables. Le Salaire Annuel Moyen (SAM) correspond à la moyenne de vos 25 meilleures années de salaire brut, plafonné au PASS chaque année. Le taux de liquidation est de 50 % si vous avez validé le nombre de trimestres requis (entre 167 et 172 selon votre année de naissance) ou si vous avez 67 ans. La proratisation réduit la pension si vous n'avez pas atteint la durée complète de cotisation.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Décote et surcote : partir au bon moment</h3>
            <p>Si vous partez avant 67 ans sans avoir validé le nombre de trimestres requis, une décote de 0,625 % par trimestre manquant s'applique, jusqu'à 12,5 % maximum. À l'inverse, chaque trimestre cotisé après le taux plein génère une surcote de +1,25 %, sans plafond. L'âge légal de départ varie de 62 à 64 ans selon votre génération. À 67 ans, le taux plein est automatiquement attribué quelle que soit la durée de cotisation.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Questions fréquentes — CNAV</h2>
          {FAQ.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          <p style={{ paddingTop: 20, fontSize: 12, color: "var(--text-secondary)" }}>
            Source officielle : <a href="https://www.info-retraite.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>info-retraite.fr</a>
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
