import { useState, useEffect, useRef } from "react";
import SimIcon from "../../data/simIcons.jsx";
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
  FaqItem,
} from "../../components/ui.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import ScenarioCompare from "../../components/ScenarioCompare.jsx";
import AffiliateCTA from "../../components/AffiliateCTA.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

// ─── Paramètres SSI 2026 ─────────────────────────────────────────────────────
// Régime de base : aligné sur CNAV depuis 2020
const PASS = 48_060;
const TAUX_PLEIN = 0.50;
const DUREE_REQUISE_BASE = 172; // trimestres (nés 1965+)

// Complémentaire SSI artisans/commerçants (RCI 2026)
const TAUX_RCI_T1  = 0.07; // 7 % jusqu'au PASS
const TAUX_RCI_T2  = 0.08; // 8 % de 1 à 4 PASS
const VALEUR_ACHAT_RCI   = 17.763; // €/point (2026 approx.)
const VALEUR_SERVICE_RCI = 0.6331; // €/point/an (2026 approx.)

function calcTNS({ revenu, anneesFaites, anneesRestantes, ageDépart, activite }) {
  if (!revenu) return {
    baseNette: 0, baseNetteMensuelle: 0,
    rciNette: 0, rciNetteMensuelle: 0,
    totalNette: 0,
    trimestresTotal: 0, dureeRequise: DUREE_REQUISE_BASE,
    pointsRci: 0, tauxEffectif: TAUX_PLEIN,
  };

  const trim = ((anneesFaites ?? 0) + (anneesRestantes ?? 0)) * 4;
  const revAnn = revenu * 12;
  const samPlafonné = Math.min(revAnn, PASS);

  // ── Régime de base (aligné CNAV) ──
  const trimManquants = Math.max(0, DUREE_REQUISE_BASE - trim);
  const trimSuppl     = Math.max(0, trim - DUREE_REQUISE_BASE);
  const ageDép = ageDépart ?? 64;

  let decote = 0, surcote = 0;
  if (ageDép < 67 && trimManquants > 0) decote = Math.min(trimManquants, 20) * 0.00625;
  if (trim >= DUREE_REQUISE_BASE && ageDép >= 64) surcote = trimSuppl * 0.0125;

  const tauxBase    = Math.max(0, TAUX_PLEIN - decote + surcote);
  const prorat      = Math.min(trim / DUREE_REQUISE_BASE, 1);
  const baseBrute   = (samPlafonné * tauxBase * prorat) / 12;
  const baseNetteMensuelle = baseBrute * 0.93;

  // ── Régime complémentaire RCI (artisans/commerçants) ──
  const annéesTotales = (anneesFaites ?? 0) + (anneesRestantes ?? 0);
  let pointsRci = 0;
  for (let i = 0; i < annéesTotales; i++) {
    const t1cot = Math.min(revAnn, PASS) * TAUX_RCI_T1;
    const t2cot = Math.max(0, Math.min(revAnn, 4 * PASS) - PASS) * TAUX_RCI_T2;
    pointsRci  += (t1cot + t2cot) / VALEUR_ACHAT_RCI;
  }
  const rciAnnuelle    = pointsRci * VALEUR_SERVICE_RCI;
  const rciNetteMensuelle = rciAnnuelle * 0.93 / 12;

  const totalNette = baseNetteMensuelle + rciNetteMensuelle;

  return {
    baseNette: baseBrute * 0.93 * 12, baseNetteMensuelle,
    rciNette: rciAnnuelle * 0.93, rciNetteMensuelle,
    totalNette,
    trimestresTotal: trim, dureeRequise: DUREE_REQUISE_BASE,
    pointsRci, tauxEffectif: tauxBase, decote, surcote, prorat,
  };
}

const FAQ = [
  { q: "Quelle est la différence entre le régime de base SSI et le RCI ?", a: "Le régime de base SSI (Sécurité Sociale des Indépendants) est aligné sur le régime général CNAV depuis 2020 : mêmes règles de validation de trimestres et même formule de calcul, plafonné au PASS. Le RCI (Régime Complémentaire des Indépendants) est un régime par points, similaire à l'Agirc-Arrco des salariés." },
  { q: "Quels sont les profils concernés par ce simulateur ?", a: "Ce simulateur s'adresse aux artisans, commerçants et industriels affiliés à la SSI (ex-RSI). Les professions libérales réglementées (médecins, avocats, architectes…) relèvent de la CNAVPL et de caisses autonomes spécifiques (CARMF, CNBF, CIPAV…), qui feront l'objet d'un simulateur dédié à venir." },
  { q: "Comment valider des trimestres en tant qu'indépendant ?", a: "Un trimestre est validé pour chaque tranche de 600 SMIC horaires de revenu cotisé (soit environ 6 594 € en 2026). Il est donc possible de valider 4 trimestres avec un revenu annuel d'environ 26 376 €, même si ce revenu est inférieur au PASS." },
  { q: "La micro-entreprise (auto-entrepreneur) est-elle couverte ?", a: "Oui. Les micro-entrepreneurs sont affiliés à la SSI et cotisent à la retraite sur la base de leur chiffre d'affaires (après abattement forfaitaire). Le taux de cotisation retraite varie selon l'activité (12,8 % à 22 %). Ce simulateur vous permet d'approximer votre pension si vous renseignez votre revenu net après abattement." },
];

export default function Independants() {
  const [theme, setTheme] = useTheme();

  const [revenu, setRevenu]               = useState(null);
  const [anneesFaites, setAnneesFaites]   = useState(null);
  const [anneesRestantes, setAnneesRest]  = useState(null);
  const [ageDépart, setAgeDépart]         = useState(null);
  const [activite, setActivite]           = useState(false); // false=artisan/comm, true=liberal

  const resultsRef = useRef(null);

  usePageMeta("Simulateur Retraite Indépendants TNS 2025 — SSI", "Estimez votre retraite en tant qu'indépendant, artisan ou commerçant affilié à la Sécurité Sociale des Indépendants.");

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'independants' });
    if (!sessionStorage.getItem('tracked_independants')) {
      sessionStorage.setItem('tracked_independants', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'independants' })
      }).catch(() => {});
    }
  }, []);
  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.revenu !== undefined) setRevenu(shared.revenu); if (shared.anneesFaites !== undefined) setAnneesFaites(shared.anneesFaites); if (shared.ageDépart !== undefined) setAgeDépart(shared.ageDépart); if (shared.activite !== undefined) setActivite(shared.activite)
    }
  }, []);
  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ revenu, anneesFaites, anneesRestantes, ageDépart, activite }));
  }, [revenu, anneesFaites, anneesRestantes, ageDépart, activite]);



  const res = calcTNS({ revenu, anneesFaites, anneesRestantes, ageDépart, activite });
  const pensionAnim = useAnimatedNumber(res.totalNette);
  const hasResult = res.totalNette > 0;

  const report = {
    title: "Simulateur Retraite Indépendants — SSI",
    highlight: { label: "Pension nette mensuelle (base + RCI)", value: hasResult ? fmtEur(res.totalNette) : "—" },
    params: [
      { label: "Revenu net mensuel moyen", value: revenu ? fmtEur(revenu) : "—" },
      { label: "Années cotisées", value: anneesFaites !== null ? `${anneesFaites} ans` : "—" },
      { label: "Années restantes", value: anneesRestantes !== null ? `${anneesRestantes} ans` : "—" },
      { label: "Âge de départ prévu", value: ageDépart ? `${ageDépart} ans` : "—" },
    ],
    results: hasResult ? [
      { label: "Pension totale nette mensuelle", value: fmtEur(res.totalNette), strong: true },
      { label: "Régime de base SSI", value: fmtEur(res.baseNetteMensuelle) },
      { label: "Complémentaire RCI", value: fmtEur(res.rciNetteMensuelle) },
      { label: "Taux effectif (base)", value: `${(res.tauxEffectif * 100).toFixed(1)} %` },
      { label: "Trimestres validés", value: `${res.trimestresTotal} / ${res.dureeRequise}` },
    ] : [],
    notes: hasResult ? [
      "Les professions libérales (CNAVPL) ont des règles spécifiques non couvertes ici.",
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur Retraite Indépendants / TNS",
        "url": "https://www.simfinly.com/simulateurs/independants",
        "description": "Estimez votre retraite en tant qu'indépendant, artisan ou commerçant affilié à la Sécurité Sociale des Indépendants.",
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

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 16px 60px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/independants" size={34} />}
          badge="Indépendants & TNS · Données 2026"
          title="Simulateur Retraite Indépendants"
          subtitle="Régime SSI + complémentaire RCI · Données 2026"
          desc="Estimez votre pension de retraite (base + complémentaire) en tant qu'artisan, commerçant ou travailleur indépendant."
        />

        {/* Réassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {["✓ Base SSI alignée sur CNAV", "✓ Complémentaire RCI incluse", "✓ Valeur service : 0,6331 €/pt"].map((t, i) => <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>)}
        </div>

        {/* Formulaire */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 400 }}>Votre situation</h2>

          <NumInput id="revenu" label="Revenu net mensuel moyen" value={revenu} onChange={setRevenu} unit="€" min={0} max={40000}
            hint={revenu ? `Annuel : ${fmtEur(revenu * 12)} · ${revenu * 12 > PASS ? "Tranche 2 RCI activée" : "Tranche 1 RCI uniquement"}` : "Revenu net d'activité (hors charges sociales)"}
            tooltip="Renseignez votre revenu net d'activité professionnelle. Pour la micro-entreprise, appliquez l'abattement forfaitaire sur votre CA avant de saisir le montant."
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <NumInput id="annees-faites" label="Années cotisées" value={anneesFaites} onChange={setAnneesFaites} unit="ans" min={0} max={50}
              hint={anneesFaites !== null ? `${anneesFaites * 4} trimestres validés` : undefined}
            />
            <NumInput id="annees-restantes" label="Années restantes" value={anneesRestantes} onChange={setAnneesRest} unit="ans" min={0} max={50}
              hint={anneesRestantes !== null ? `+${anneesRestantes * 4} trimestres` : undefined}
            />
          </div>

          {/* Résumé */}
          <div style={{ background: "rgba(43,92,230,0.05)", border: "1px solid rgba(43,92,230,0.12)", borderRadius: 12, padding: "14px 20px", display: "flex", flexWrap: "wrap" }}>
            {[
              { l: "Trimestres", v: `${((anneesFaites ?? 0) + (anneesRestantes ?? 0)) * 4}`, gold: true },
              { l: "Points RCI/an", v: revenu ? fmt(((Math.min(revenu * 12, PASS) * TAUX_RCI_T1) + Math.max(0, Math.min(revenu * 12, 4 * PASS) - PASS) * TAUX_RCI_T2) / VALEUR_ACHAT_RCI) : "—" },
              { l: "Points RCI tot.", v: fmt(res.pointsRci) },
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, minWidth: 100, padding: "4px 16px", borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{item.l}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 21, fontWeight: 700, color: item.gold ? "var(--gold)" : "var(--text)" }}>{item.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Paramètres avancés */}
        <AccordionSection title="Paramètres avancés" subtitle="Âge de départ">
          <StepperInput label="Âge de départ prévu" value={ageDépart} onChange={setAgeDépart}
            min={62} max={70} unit=" ans"
            hint="Âge légal de départ SSI : 64 ans (nés 1965+) · Annulation décote : 67 ans"
            tooltip="Les règles de départ SSI sont alignées sur le régime général depuis 2020."
          />
        </AccordionSection>

        {/* Résultats */}
        <div ref={resultsRef} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20, boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>Votre pension totale estimée</h2>

          <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'Hanken Grotesk', sans-serif", marginBottom: 6 }}>Pension nette mensuelle estimée (base + RCI)</div>
            {!hasResult ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>Saisissez vos paramètres pour voir votre estimation.</p>
            ) : (
              <>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 42, color: "var(--primary)", lineHeight: 1 }}
                  aria-label={`${Math.round(res.totalNette)} euros par mois`}>
                  {pensionAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>pension nette mensuelle après prélèvements sociaux</div>
              </>
            )}
          </div>

          {hasResult && (
            <>
              {/* Décomposition */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px" }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 8 }}>Régime de base SSI</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: "var(--text)" }}>{fmtEur(res.baseNetteMensuelle)}</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>Taux effectif : {(res.tauxEffectif * 100).toFixed(1)} %</div>
                </div>
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px" }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 8 }}>Complémentaire RCI</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: "var(--gold)" }}>{fmtEur(res.rciNetteMensuelle)}</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>{fmt(res.pointsRci)} points × {VALEUR_SERVICE_RCI} €/an</div>
                </div>
              </div>

              <ProgressBar label="Régime de base" value={res.baseNetteMensuelle} total={res.totalNette} color="var(--progress-acquired)" />
              <ProgressBar label="Complémentaire RCI" value={res.rciNetteMensuelle} total={res.totalNette} color="linear-gradient(90deg,var(--gold-mid),var(--gold))" />

              <div role="note" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16 }}>
                ⚠️ <strong>Simulation indicative.</strong> Les professions libérales (CNAVPL) ont des règles spécifiques non couvertes ici.
                Pour un calcul officiel : <a href="https://www.info-retraite.fr" target="_blank" rel="noopener" style={{ color: "var(--gold-mid)" }}>info-retraite.fr</a>.
              </div>
            </>
          )}
        </div>

        <ShareBar params={{ revenu, anneesFaites, anneesRestantes, ageDépart, activite }} resultsRef={resultsRef} report={report} name="independants" />
        {hasResult && <AffiliateCTA type="retraite" />}
        {hasResult && (
          <ScenarioCompare
            name="independants"
            base={{ ageDépart, anneesRestantes }}
            fields={[
              { key: "ageDépart", label: "Âge de départ", type: "step", min: 62, max: 70, step: 1, unit: "ans" },
              { key: "anneesRestantes", label: "Années restantes", type: "num", unit: "ans", min: 0, max: 50 },
            ]}
            compute={(v) => calcTNS({ revenu, anneesFaites, anneesRestantes, ageDépart, activite, ...v })}
            metrics={[{ label: "Pension nette", get: r => r.totalNette, fmt: fmtEur, higherBetter: true }]}
          />
        )}

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>

        {/* À propos */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos de ce simulateur</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>La SSI, régime obligatoire des indépendants</h3>
            <p style={{ marginBottom: 16 }}>La Sécurité Sociale des Indépendants (SSI), anciennement appelée RSI, est le régime obligatoire des travailleurs non-salariés : artisans, commerçants, dirigeants de sociétés soumises à l'impôt sur le revenu. Depuis 2020, la SSI est intégrée au régime général géré par les URSSAF, mais les règles de calcul de la retraite restent distinctes. Elle couvre plus de 3 millions de cotisants actifs.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Des cotisations sur le revenu professionnel</h3>
            <p style={{ marginBottom: 16 }}>Contrairement aux salariés, les indépendants cotisent sur leur revenu professionnel net (bénéfice), non sur un salaire brut. Le taux de cotisation retraite de base s'élève à 17,75 % jusqu'au PASS et 0,60 % au-delà. La retraite de base fonctionne en trimestres, comme le régime général, avec les mêmes règles de décote et surcote. Une cotisation minimale assure la validation d'au moins 3 trimestres même en cas de faibles revenus.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Retraite complémentaire RCI</h3>
            <p>En plus de la retraite de base, les artisans et commerçants bénéficient d'une retraite complémentaire par points (RCI). Le taux de cotisation est de 7 % sur les revenus jusqu'à 37 960 € et de 8 % sur la tranche supérieure. La valeur du point RCI est révisée annuellement. Cette complémentaire représente en moyenne 30 à 40 % du total de la pension versée à la retraite.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Questions fréquentes — Indépendants</h2>
          {FAQ.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
        </div>

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>
      </div>
      <Footer />
    </div>
  );
}

