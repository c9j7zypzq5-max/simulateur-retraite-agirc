import { useState, useEffect, useRef } from "react";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import Terme from "../../components/Terme.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { mensualite } from "../../utils/finance.js";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, Toggle, StatusBadge, useAnimatedNumber,
  fmtEur, SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";

function useIsMobile(breakpoint = 680) {
  const [mob, setMob] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < breakpoint
  );
  useEffect(() => {
    const fn = () => setMob(window.innerWidth < breakpoint);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, [breakpoint]);
  return mob;
}

// ─── Barème PTZ ────────────────────────────────────────────────────────────────
// Source : décret n° 2025-299 du 29 mars 2025 (JO 30/03/2025), en vigueur depuis
// le 1ᵉʳ avril 2025. Le PTZ est rouvert à tous les logements neufs sur tout le
// territoire (appartements ET maisons individuelles) ; l'ancien reste réservé aux
// zones B2/C avec travaux ≥ 25 % du coût total.
//
// ⚠ Barème INDICATIF, isolé volontairement dans ce bloc pour être corrigé
// facilement. Les valeurs structurelles (quotités 50/40/40/20 %, coefficients
// familiaux, élargissement 2025) sont fiables ; les seuils de revenus par tranche
// et les plafonds d'opération doivent être confirmés sur le barème SGFGAS officiel.
const ZONES = [
  { id: "A",    label: "A / A bis", desc: "Paris, grandes métropoles tendues" },
  { id: "B1",   label: "B1",        desc: "Grandes agglomérations" },
  { id: "B2",   label: "B2",        desc: "Villes moyennes" },
  { id: "C",    label: "C",         desc: "Reste du territoire" },
];

// Coefficient familial (1 à 8 personnes et +) — revenu pris en compte = RFR ÷ coeff.
const COEFF_FAMILIAL = [1, 1.4, 1.7, 2, 2.3, 2.6, 2.9, 3.2];

// Seuils de revenu (RFR ÷ coefficient familial) délimitant les 4 tranches, par zone.
// Quotité associée à chaque tranche : T1 = 50 %, T2 = 40 %, T3 = 40 %, T4 = 20 %.
const TRANCHES = {
  A:  [25000, 31000, 37000, 49000],
  B1: [25000, 31000, 37000, 49000],
  B2: [21500, 26000, 30000, 40000],
  C:  [18000, 22500, 27000, 36000],
};
const QUOTITES = [0.50, 0.40, 0.40, 0.20];

// Plafond du coût de l'opération pour 1 personne (× coefficient familial ensuite).
const PLAFOND_OPERATION = { A: 150000, B1: 135000, B2: 110000, C: 100000 };

function coeff(personnes) {
  return COEFF_FAMILIAL[Math.min(personnes, COEFF_FAMILIAL.length) - 1];
}

// Renvoie l'index de tranche (0..3) ou -1 si au-dessus du plafond (non éligible).
function trancheIndex(zone, revenuPondere) {
  const seuils = TRANCHES[zone];
  for (let i = 0; i < seuils.length; i++) {
    if (revenuPondere <= seuils[i]) return i;
  }
  return -1;
}

function plafondRevenu(zone, personnes) {
  return TRANCHES[zone][TRANCHES[zone].length - 1] * coeff(personnes);
}

function plafondOperation(zone, personnes) {
  return Math.round(PLAFOND_OPERATION[zone] * coeff(personnes) / 1000) * 1000;
}

const sectionTitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 20 };

const FAQ = [
  {
    q: "Qu'est-ce que le prêt à taux zéro (PTZ) ?",
    a: "Le PTZ est un prêt sans intérêt ni frais de dossier, accordé sous conditions de ressources aux primo-accédants (personnes n'ayant pas été propriétaires de leur résidence principale au cours des deux dernières années) pour financer l'achat de leur résidence principale. Il complète un prêt principal et ne peut pas financer la totalité de l'opération.",
  },
  {
    q: "Quels logements sont éligibles au PTZ en 2025 ?",
    a: "Depuis le décret du 29 mars 2025, le PTZ est rouvert à tous les logements neufs (appartements comme maisons individuelles) sur l'ensemble du territoire. Les logements anciens restent éligibles uniquement en zones B2 et C, à condition de réaliser des travaux représentant au moins 25 % du coût total de l'opération. L'acquisition d'un logement social par son locataire est aussi possible.",
  },
  {
    q: "Comment est déterminé le montant du PTZ ?",
    a: "Le montant = quotité × coût de l'opération retenu (plafonné selon la zone et le nombre d'occupants). La quotité dépend de votre tranche de revenus : 50 % pour les ménages les plus modestes (tranche 1), 40 % pour les tranches 2 et 3, et 20 % pour la tranche 4. La tranche se détermine en divisant votre revenu fiscal de référence par un coefficient familial.",
  },
  {
    q: "Quels sont les plafonds de revenus ?",
    a: "L'éligibilité dépend du revenu fiscal de référence de l'année N-2 (ou du coût total ÷ 9 s'il est plus élevé), rapporté à un coefficient familial qui augmente avec le nombre d'occupants. Le plafond le plus élevé (tranche 4) atteint 49 000 € de revenu pondéré en zone A/B1. Au-delà, le foyer n'est pas éligible.",
  },
  {
    q: "Comment se rembourse le PTZ ?",
    a: "Le PTZ bénéficie d'un différé de remboursement : pendant cette période (jusqu'à plusieurs années selon vos revenus), vous ne remboursez rien sur le PTZ. La durée totale (différé + remboursement) s'échelonne entre 20 et 25 ans. Plus vos revenus sont modestes, plus le différé est long.",
  },
  {
    q: "Ce simulateur est-il officiel ?",
    a: "Non. Il s'agit d'une estimation indicative basée sur le barème 2025 (décret n° 2025-299). Le montant exact dépend de critères précis vérifiés par votre banque et le SGFGAS (zone exacte de la commune, composition du foyer, coût retenu de l'opération). Rapprochez-vous d'un établissement prêteur pour une étude personnalisée.",
  },
];

// ─── Simulateur ───────────────────────────────────────────────────────────────
export default function Ptz() {
  const [theme, setTheme] = useTheme();
  const isMobile = useIsMobile();

  const card = {
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: 20, padding: isMobile ? "20px 16px" : "28px 32px",
    marginBottom: 20, boxShadow: "var(--card-shadow)",
  };

  const [zone, setZone]           = useState("A");
  const [neuf, setNeuf]           = useState(true);
  const [personnes, setPersonnes] = useState(2);
  const [rfr, setRfr]             = useState(null);
  const [cout, setCout]           = useState(null);
  // Pour la comparaison indicative avec un prêt classique
  const [duree, setDuree]         = useState(20);
  const [taux, setTaux]           = useState(3.5);

  const resultsRef = useRef(null);

  useEffect(() => {
    document.title = "Simulateur PTZ 2025 — Montant du Prêt à Taux Zéro";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Estimez votre Prêt à Taux Zéro 2025 : éligibilité, tranche de revenus, quotité et montant finançable selon votre zone et la composition de votre foyer. Barème décret n° 2025-299.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.mesimulateurs.fr' + window.location.pathname;
    track('simulator_view', { name: 'ptz' });
    if (!sessionStorage.getItem('tracked_ptz')) {
      sessionStorage.setItem('tracked_ptz', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'ptz' })
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.zone !== undefined) setZone(shared.zone);
      if (shared.neuf !== undefined) setNeuf(shared.neuf);
      if (shared.personnes !== undefined) setPersonnes(shared.personnes);
      if (shared.rfr !== undefined) setRfr(shared.rfr);
      if (shared.cout !== undefined) setCout(shared.cout);
      if (shared.duree !== undefined) setDuree(shared.duree);
      if (shared.taux !== undefined) setTaux(shared.taux);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ zone, neuf, personnes, rfr, cout, duree, taux }));
  }, [zone, neuf, personnes, rfr, cout, duree, taux]);

  // ── Calculs ──
  // Ancien éligible uniquement en B2/C (avec travaux ≥ 25 %).
  const ancienEligible = !neuf ? (zone === "B2" || zone === "C") : true;

  const cf = coeff(personnes);
  // Revenu pris en compte = max(RFR n-2, coût opération / 9), rapporté au coefficient.
  const revenuRetenu = Math.max(rfr ?? 0, (cout ?? 0) / 9);
  const revenuPondere = cf > 0 ? revenuRetenu / cf : 0;

  const plafRevenu = plafondRevenu(zone, personnes);
  const plafOp = plafondOperation(zone, personnes);

  const hasRevenu = rfr !== null && rfr > 0;
  const hasCout = cout !== null && cout > 0;
  const hasInput = hasRevenu && hasCout;

  const tIdx = hasInput ? trancheIndex(zone, revenuPondere) : -1;
  const eligibleRevenu = tIdx >= 0;
  const eligible = hasInput && eligibleRevenu && ancienEligible;

  const quotite = tIdx >= 0 ? QUOTITES[tIdx] : 0;
  const coutRetenu = Math.min(cout ?? 0, plafOp);
  const montantPtz = eligible ? Math.round(quotite * coutRetenu) : 0;

  // Comparaison indicative : coût d'intérêts évités si ce montant était emprunté
  // au taux du marché plutôt qu'à 0 %.
  const mClassique = mensualite(montantPtz, taux, duree);
  const interetsEvites = Math.max(0, mClassique * duree * 12 - montantPtz);

  const animMontant = useAnimatedNumber(montantPtz);
  const animEvites = useAnimatedNumber(interetsEvites);

  // Compte-rendu pour le téléchargement / partage (image + PDF).
  const report = {
    title: "Simulateur PTZ — Prêt à Taux Zéro",
    highlight: { label: "Montant PTZ estimé", value: eligible ? fmtEur(montantPtz) : "Non éligible" },
    params: [
      { label: "Zone", value: `Zone ${ZONES.find(z => z.id === zone)?.label || zone}` },
      { label: "Type de logement", value: neuf ? "Neuf" : "Ancien" },
      { label: "Personnes au foyer", value: String(personnes) },
      { label: "Coût de l'opération", value: cout ? fmtEur(cout) : "—" },
      { label: "Revenu fiscal de référence", value: rfr ? fmtEur(rfr) : "—" },
    ],
    results: eligible ? [
      { label: "Tranche de revenus", value: `Tranche ${tIdx + 1}` },
      { label: "Quotité", value: `${Math.round(quotite * 100)} %` },
      { label: "Coût retenu (plafonné)", value: fmtEur(coutRetenu) },
      { label: "Montant PTZ", value: fmtEur(montantPtz), strong: true },
      { label: "Reste à financer", value: fmtEur(Math.max(0, (cout ?? 0) - montantPtz)) },
    ] : [],
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur PTZ — Prêt à Taux Zéro 2025",
        "url": "https://www.mesimulateurs.fr/simulateurs/ptz",
        "description": "Estimez votre Prêt à Taux Zéro : éligibilité, tranche de revenus, quotité et montant finançable selon la zone et la composition du foyer.",
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
      <main id="main-content" style={{ maxWidth: 940, margin: "0 auto", padding: isMobile ? "0 16px 60px" : "0 24px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/ptz" size={34} />}
          badge="Immobilier · Simulation 2025"
          title="Simulateur PTZ"
          subtitle="Prêt à Taux Zéro · Primo-accédant"
          desc="Estimez le montant de votre Prêt à Taux Zéro selon votre zone, la composition de votre foyer et vos revenus. Tranche, quotité et montant finançable — barème 2025."
        />

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>

          {/* ── Colonne formulaire ── */}
          <div style={{ order: isMobile ? 2 : 1 }}>
            {/* Logement */}
            <div style={card}>
              <h2 style={sectionTitle}>Votre projet</h2>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
                  Zone du logement
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {ZONES.map(z => {
                    const active = zone === z.id;
                    return (
                      <button key={z.id} onClick={() => setZone(z.id)}
                        style={{
                          textAlign: "left", padding: "10px 14px", borderRadius: 12, cursor: "pointer",
                          background: active ? "rgba(184,147,74,0.12)" : "var(--card-bg)",
                          border: `1.5px solid ${active ? "var(--gold-mid)" : "var(--border)"}`,
                          transition: "border-color 0.2s, background 0.2s",
                        }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = "var(--gold-mid)"; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = "var(--border)"; }}
                      >
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: active ? "var(--gold)" : "var(--text)" }}>Zone {z.label}</div>
                        <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{z.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Type de logement</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                    {neuf ? "Neuf — éligible toutes zones" : "Ancien — zones B2/C avec travaux ≥ 25 %"}
                  </div>
                </div>
                <Toggle options={["Ancien", "Neuf"]} checked={neuf} onChange={setNeuf} />
              </div>

              <StepperInput label="Personnes dans le logement" value={personnes} onChange={v => setPersonnes(Math.round(v))} min={1} max={8} step={1} unit="pers."
                hint={`Coefficient familial : ${cf}`} />

              <NumInput label="Coût total de l'opération" value={cout} onChange={setCout} unit="€" min={10000} max={2000000}
                hint={hasCout && cout > plafOp ? `Plafonné à ${fmtEur(plafOp)} pour le calcul (zone ${zone}, ${personnes} pers.)` : `Plafond retenu : ${fmtEur(plafOp)}`} />
            </div>

            {/* Revenus */}
            <div style={card}>
              <h2 style={sectionTitle}>Vos revenus</h2>
              <NumInput label="Revenu fiscal de référence (N-2)" value={rfr} onChange={setRfr} unit="€" min={0} max={500000}
                tooltip="Revenu fiscal de référence du foyer, ligne 25 de votre avis d'imposition de l'année N-2."
                hint={hasRevenu ? `Revenu pondéré : ${fmtEur(Math.round(revenuPondere))} · plafond zone ${zone} : ${fmtEur(Math.round(plafRevenu))}` : undefined} />
            </div>

            {/* Comparaison prêt classique */}
            <AccordionSection title="Comparaison avec un prêt classique (optionnel)" subtitle="Estime les intérêts évités grâce au taux 0 %">
              <StepperInput label="Durée de remboursement" value={duree} onChange={v => setDuree(Math.round(v))} min={10} max={25} step={1} unit="ans" />
              <StepperInput label="Taux d'un prêt équivalent" value={taux} onChange={setTaux} min={0.1} max={10} step={0.1} unit="%" />
            </AccordionSection>
          </div>

          {/* ── Colonne résultats ── */}
          <div style={{ order: isMobile ? 1 : 2, minWidth: 0 }}>
            <div style={{ background: "linear-gradient(145deg, rgba(184,147,74,0.08), var(--card-bg))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginBottom: 20, textAlign: "center", boxShadow: "var(--card-shadow)" }} ref={resultsRef}>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 10 }}>
                Montant PTZ estimé
              </div>
              {!hasInput ? (
                <p style={{ color: "var(--text-secondary)", padding: "20px 0", fontSize: 14 }}>
                  Renseignez le coût de l'opération et votre revenu fiscal de référence.
                </p>
              ) : !ancienEligible ? (
                <div style={{ padding: "16px 0" }}>
                  <div style={{ marginBottom: 12 }}><StatusBadge status="bad" label="Non éligible" /></div>
                  <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
                    Dans le neuf le PTZ couvre toutes les zones, mais un logement <strong>ancien</strong> n'est éligible qu'en zones <strong>B2 et C</strong> (avec travaux ≥ 25 % du coût).
                  </p>
                </div>
              ) : !eligibleRevenu ? (
                <div style={{ padding: "16px 0" }}>
                  <div style={{ marginBottom: 12 }}><StatusBadge status="bad" label="Revenus trop élevés" /></div>
                  <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
                    Votre revenu pondéré ({fmtEur(Math.round(revenuPondere))}) dépasse le plafond de la zone {zone} ({fmtEur(Math.round(plafRevenu))}).
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(44px,8vw,68px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {fmtEur(Math.round(animMontant))}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
                    soit {Math.round(quotite * 100)} % du coût retenu ({fmtEur(coutRetenu)})
                  </div>
                  <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                    <StatusBadge status="good" label={`Éligible · Tranche ${tIdx + 1}`} />
                    <StatusBadge status="gold" label={`Quotité ${Math.round(quotite * 100)} %`} />
                  </div>
                </>
              )}

              <ShareBar
                params={{ zone, neuf, personnes, rfr, cout, duree, taux }}
                resultsRef={resultsRef}
                report={report}
                name="ptz"
              />
            </div>

            {eligible && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <Chip label="Montant PTZ" value={fmtEur(montantPtz)} accent small />
                <Chip label="Quotité" value={`${Math.round(quotite * 100)} %`} small />
                <Chip label="Coût retenu" value={fmtEur(coutRetenu)} small />
                <Chip label="Reste à financer" value={fmtEur(Math.max(0, (cout ?? 0) - montantPtz))} small />
              </div>
            )}

            {eligible && interetsEvites > 0 && (
              <div style={card}>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 }}>
                  Intérêts évités grâce au taux 0 %
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, color: "var(--gold)" }}>
                  ≈ {fmtEur(Math.round(animEvites))}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6, lineHeight: 1.6 }}>
                  Estimation des intérêts que vous auriez payés si ce montant ({fmtEur(montantPtz)}) avait été emprunté à {taux} % sur {duree} ans au lieu de 0 %.
                </div>
              </div>
            )}

            {eligible && (
              <AccordionSection title="Détail du calcul" defaultOpen>
                {[
                  { label: "Zone retenue", value: `Zone ${ZONES.find(z => z.id === zone)?.label}` },
                  { label: "Coefficient familial", value: String(cf) },
                  { label: "Revenu pondéré (RFR ÷ coeff.)", value: fmtEur(Math.round(revenuPondere)) },
                  { label: `Tranche de revenus`, value: `Tranche ${tIdx + 1} → ${Math.round(quotite * 100)} %` },
                  { label: "Plafond d'opération", value: fmtEur(plafOp) },
                  { label: "Coût retenu (plafonné)", value: fmtEur(coutRetenu), accent: true },
                  { label: "Montant PTZ", value: fmtEur(montantPtz), accent: true },
                ].map(({ label, value, accent }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: accent ? "var(--gold)" : "var(--text)" }}>{value}</span>
                  </div>
                ))}
              </AccordionSection>
            )}
          </div>
        </div>

        {/* AdSense mid */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos du PTZ 2025</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>Un prêt sans intérêts pour les primo-accédants</h3>
            <p style={{ marginBottom: 16 }}>Le Prêt à Taux Zéro (PTZ) finance une partie de l'achat de la résidence principale des ménages qui n'ont pas été propriétaires de leur logement au cours des deux années précédentes. Il ne comporte ni intérêts ni frais de dossier et vient en complément d'un prêt principal. Depuis le décret n° 2025-299 du 29 mars 2025, il a été rouvert à tous les logements neufs (appartements comme maisons) sur l'ensemble du territoire.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Tranches de revenus et quotité</h3>
            <p style={{ marginBottom: 16 }}>Le montant du <Terme slug="ptz">PTZ</Terme> dépend d'une quotité (part finançable du coût de l'opération) déterminée par votre tranche de revenus : 50 % pour les ménages les plus modestes, 40 % pour les tranches intermédiaires et 20 % pour la tranche la plus haute. La tranche se calcule en divisant le revenu fiscal de référence (ou le coût total ÷ 9 s'il est supérieur) par un coefficient familial qui croît avec le nombre d'occupants.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Différé et durée de remboursement</h3>
            <p>Le PTZ se rembourse sur une durée totale comprise entre 20 et 25 ans, incluant une période de différé pendant laquelle aucun remboursement n'est dû sur le PTZ. Plus les revenus sont modestes, plus le différé est long, ce qui allège l'effort des premières années. Le coût de l'opération retenu est plafonné selon la zone et la taille du foyer.</p>
          </div>
        </div>

        {/* FAQ */}
        <FaqSection items={FAQ} />

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", opacity: 0.6, marginTop: 32 }}>
          Simulation indicative basée sur le barème 2025 (décret n° 2025-299) · Ne constitue pas un accord de prêt
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
