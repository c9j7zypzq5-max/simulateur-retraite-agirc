import { useState, useEffect, useRef } from "react";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import AdUnit from "../../components/AdUnit.jsx";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import {
  NumInput, AccordionSection,
  Chip, StatusBadge, useAnimatedNumber,
  fmtEur, SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";
import { FAQS } from '../../data/faqs.js';
import SimRecommendations from '../../components/SimRecommendations.jsx';
import { RECOMMENDATIONS } from '../../data/recommendations.js';
import AffiliateCTA from "../../components/AffiliateCTA.jsx";

// ─── Barème des frais d'acquisition (« frais de notaire ») ──────────────────────
// Les frais d'acquisition se décomposent en 4 postes. Valeurs INDICATIVES,
// isolées ici pour être corrigées facilement.
//
// 1) Droits de mutation (DMTO) : impôts reversés à l'État et aux collectivités.
//    - Ancien : ~5,80 % (taux départemental 4,50 % + communal 1,20 % + frais
//      d'assiette). Plusieurs départements appliquent désormais jusqu'à 6,30 %
//      depuis 2025 ; valeur par défaut prudente : 5,80 %.
//    - Neuf (VEFA / première vente) : 0,715 % (taxe de publicité foncière réduite).
// 2) Émoluments du notaire : barème dégressif réglementé (arrêté 2021), HT,
//    auquel s'ajoute la TVA à 20 %.
// 3) Contribution de sécurité immobilière (ex-salaire du conservateur) : 0,10 %.
// 4) Émoluments de formalités et débours : forfait (copies, état civil,
//    cadastre…). Estimé ~1 000 €.
const TAUX_DMTO = { ancien: 0.0580, neuf: 0.00715 };
const TAUX_CSI = 0.0010;        // contribution de sécurité immobilière
const TVA = 0.20;               // TVA sur les émoluments du notaire
const DEBOURS_FORFAIT = 1000;   // émoluments de formalités + débours (forfait)

// Barème proportionnel des émoluments du notaire (arrêté du 28/02/2020, en
// vigueur depuis 2021), exprimé HT par tranche d'assiette (prix du bien).
const TRANCHES_EMOLUMENTS = [
  { jusqua: 6500,    taux: 0.03870 },
  { jusqua: 17000,   taux: 0.01596 },
  { jusqua: 60000,   taux: 0.01064 },
  { jusqua: Infinity, taux: 0.00799 },
];

// Émoluments du notaire HT pour un prix donné (barème dégressif par tranches).
function emolumentsNotaireHT(prix) {
  if (!prix || prix <= 0) return 0;
  let bas = 0, total = 0;
  for (const t of TRANCHES_EMOLUMENTS) {
    const largeur = Math.min(prix, t.jusqua) - bas;
    if (largeur > 0) total += largeur * t.taux;
    bas = t.jusqua;
    if (prix <= t.jusqua) break;
  }
  return total;
}

const sectionTitle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 20 };

const FAQ = FAQS['/simulateurs/frais-notaire'];

// ─── Simulateur ───────────────────────────────────────────────────────────────
export default function FraisNotaire() {
  const [theme, setTheme] = useTheme();
  const isMobile = useIsMobile();

  const card = {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 16, padding: isMobile ? "20px 16px" : "24px 20px",
    marginBottom: 20, boxShadow: "var(--card-shadow)",
  };

  const [prix, setPrix]       = useState(null);
  const [type, setType]       = useState("ancien");   // "ancien" | "neuf"
  const [mobilier, setMobilier] = useState(null);     // valeur du mobilier déductible

  const resultsRef = useRef(null);

  usePageMeta(
    "Simulateur frais de notaire 2026 — ancien & neuf",
    "Calculez les frais de notaire (frais d'acquisition) de votre achat immobilier : droits de mutation, émoluments du notaire, débours. Estimation gratuite pour l'ancien et le neuf."
  );

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'frais-notaire' });
    if (!sessionStorage.getItem('tracked_frais-notaire')) {
      sessionStorage.setItem('tracked_frais-notaire', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'frais-notaire' })
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.prix !== undefined) setPrix(shared.prix);
      if (shared.type !== undefined) setType(shared.type);
      if (shared.mobilier !== undefined) setMobilier(shared.mobilier);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ prix, type, mobilier }));
  }, [prix, type, mobilier]);

  // ── Calculs ──
  const prixBien = prix ?? 0;
  const valMobilier = Math.min(mobilier ?? 0, prixBien);
  // Assiette des droits de mutation : prix net du mobilier déductible.
  const assiette = Math.max(0, prixBien - valMobilier);

  const droitsMutation = assiette * TAUX_DMTO[type];
  const emolumentsHT = emolumentsNotaireHT(assiette);
  const emolumentsTTC = emolumentsHT * (1 + TVA);
  const csi = assiette * TAUX_CSI;
  const debours = prixBien > 0 ? DEBOURS_FORFAIT : 0;

  const fraisTotal = droitsMutation + emolumentsTTC + csi + debours;
  const tauxGlobal = prixBien > 0 ? (fraisTotal / prixBien) * 100 : 0;
  const budgetTotal = prixBien + fraisTotal;

  const hasInput = prixBien > 0;

  const animFrais = useAnimatedNumber(fraisTotal);
  const animBudget = useAnimatedNumber(budgetTotal);

  const report = {
    title: "Simulateur frais de notaire",
    highlight: { label: "Frais de notaire estimés", value: hasInput ? fmtEur(Math.round(fraisTotal)) : "—" },
    params: [
      { label: "Prix du bien", value: prix ? fmtEur(prix) : "—" },
      { label: "Type de bien", value: type === "neuf" ? "Neuf (VEFA)" : "Ancien" },
      { label: "Mobilier déduit", value: valMobilier ? fmtEur(valMobilier) : "—" },
    ],
    results: hasInput ? [
      { label: "Frais de notaire estimés", value: fmtEur(Math.round(fraisTotal)), strong: true },
      { label: "Soit en % du prix", value: `${tauxGlobal.toFixed(1)} %` },
      { label: "Droits de mutation", value: fmtEur(Math.round(droitsMutation)) },
      { label: "Émoluments du notaire (TTC)", value: fmtEur(Math.round(emolumentsTTC)) },
      { label: "Contribution sécurité immobilière", value: fmtEur(Math.round(csi)) },
      { label: "Émoluments de formalités & débours", value: fmtEur(Math.round(debours)) },
      { label: "Budget total (bien + frais)", value: fmtEur(Math.round(budgetTotal)) },
    ] : [],
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur frais de notaire 2026",
        "url": "https://www.simfinly.com/simulateurs/frais-notaire",
        "description": "Calculez les frais de notaire de votre achat immobilier : droits de mutation, émoluments du notaire, débours, pour l'ancien et le neuf.",
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
        "name": "Comment calculer ses frais de notaire",
        "description": "Estimer les frais d'acquisition d'un bien immobilier en trois étapes.",
        "step": [
          { "@type": "HowToStep", "name": "Saisir le prix du bien", "text": "Indiquez le prix de vente net vendeur du logement que vous souhaitez acheter." },
          { "@type": "HowToStep", "name": "Choisir le type de bien", "text": "Sélectionnez « ancien » ou « neuf » : les droits de mutation sont bien plus faibles dans le neuf." },
          { "@type": "HowToStep", "name": "Lire le résultat", "text": "Le simulateur additionne droits de mutation, émoluments du notaire, contribution de sécurité immobilière et débours pour estimer vos frais." },
        ],
      }} />
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "28px 16px 60px" : "28px 24px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/frais-notaire" size={34} />}
          badge="Immobilier · Simulation 2025"
          title="Simulateur frais de notaire"
          subtitle="Frais d'acquisition · Ancien & neuf"
          desc="Estimez les frais de notaire de votre achat immobilier : droits de mutation, émoluments du notaire, contribution de sécurité immobilière et débours. Calcul instantané pour l'ancien et le neuf."
        />

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>

          {/* ── Colonne formulaire ── */}
          <div style={{ order: isMobile ? 2 : 1 }}>
            <div style={card}>
              <h2 style={sectionTitle}>Votre projet</h2>
              <NumInput label="Prix du bien" value={prix} onChange={setPrix} unit="€" min={0} max={5000000}
                hint="Prix de vente net vendeur (hors frais d'agence le cas échéant)" />

              <div style={{ marginTop: 16, marginBottom: 8 }}>
                <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>
                  Type de bien
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ k: "ancien", l: "Ancien" }, { k: "neuf", l: "Neuf (VEFA)" }].map(opt => {
                    const active = type === opt.k;
                    return (
                      <button key={opt.k} onClick={() => setType(opt.k)}
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
                <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>
                  Dans le neuf, les droits de mutation sont réduits (0,715 % contre ~5,80 %).
                </div>
              </div>
            </div>

            <div style={card}>
              <h2 style={sectionTitle}>Option</h2>
              <NumInput label="Mobilier déductible" value={mobilier} onChange={setMobilier} unit="€" min={0} max={prixBien || 1000000}
                tooltip="Valeur des meubles vendus avec le bien (cuisine équipée, électroménager…). Déduite de l'assiette des droits de mutation, dans une limite raisonnable."
                hint="Optionnel — réduit l'assiette des droits de mutation" />
            </div>
          </div>

          {/* ── Colonne résultats ── */}
          <div style={{ order: isMobile ? 1 : 2, minWidth: 0 }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 20, textAlign: "center", boxShadow: "var(--card-shadow)" }} ref={resultsRef}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'Hanken Grotesk', sans-serif", marginBottom: 6 }}>
                Frais de notaire estimés
              </div>
              {!hasInput ? (
                <p style={{ color: "var(--text-secondary)", padding: "20px 0", fontSize: 14 }}>
                  Renseignez le prix du bien pour estimer vos frais d'acquisition.
                </p>
              ) : (
                <>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 42, color: "var(--primary)", lineHeight: 1 }}>
                    {fmtEur(Math.round(animFrais))}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
                    soit {tauxGlobal.toFixed(1)} % du prix · budget total {fmtEur(Math.round(animBudget))}
                  </div>
                  <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                    <StatusBadge status="gold" label={type === "neuf" ? "Bien neuf" : "Bien ancien"} />
                    <StatusBadge status={type === "neuf" ? "good" : "warn"} label={`Droits de mutation ${(TAUX_DMTO[type] * 100).toFixed(type === "neuf" ? 3 : 2)} %`} />
                  </div>
                </>
              )}

              <ShareBar
                params={{ prix, type, mobilier }}
                resultsRef={resultsRef}
                report={report}
                name="frais-notaire"
              />
            </div>

            {hasInput && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <Chip label="Droits de mutation" value={fmtEur(Math.round(droitsMutation))} accent small />
                <Chip label="Émoluments notaire (TTC)" value={fmtEur(Math.round(emolumentsTTC))} small />
                <Chip label="Sécurité immobilière" value={fmtEur(Math.round(csi))} small />
                <Chip label="Formalités & débours" value={fmtEur(Math.round(debours))} small />
              </div>
            )}

            {hasInput && (
              <AccordionSection title="Détail du calcul" defaultOpen>
                {[
                  { label: "Prix du bien", value: fmtEur(prixBien) },
                  ...(valMobilier > 0 ? [{ label: "Mobilier déduit", value: `− ${fmtEur(valMobilier)}` }] : []),
                  { label: "Assiette des droits de mutation", value: fmtEur(Math.round(assiette)) },
                  { label: `Droits de mutation (${(TAUX_DMTO[type] * 100).toFixed(type === "neuf" ? 3 : 2)} %)`, value: fmtEur(Math.round(droitsMutation)), accent: true },
                  { label: "Émoluments notaire HT", value: fmtEur(Math.round(emolumentsHT)) },
                  { label: "Émoluments notaire TTC (TVA 20 %)", value: fmtEur(Math.round(emolumentsTTC)), accent: true },
                  { label: "Contribution sécurité immobilière (0,10 %)", value: fmtEur(Math.round(csi)) },
                  { label: "Émoluments de formalités & débours", value: fmtEur(Math.round(debours)) },
                  { label: "Total des frais", value: fmtEur(Math.round(fraisTotal)), accent: true },
                  { label: "Budget total (bien + frais)", value: fmtEur(Math.round(budgetTotal)) },
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

        {hasInput && <AffiliateCTA type="emprunt" />}

        {/* AdSense mid */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {/* À propos */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos des frais de notaire</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>Des frais d'acquisition, pas seulement de notaire</h3>
            <p style={{ marginBottom: 16 }}>Les « frais de notaire » sont en réalité des frais d'acquisition, dont le notaire ne conserve qu'une faible part. Environ 80 % du montant correspond aux droits de mutation à titre onéreux (DMTO), un impôt reversé au département, à la commune et à l'État. Viennent ensuite les émoluments du notaire (sa rémunération, encadrée par un barème national), la contribution de sécurité immobilière (0,10 %) et les débours (sommes avancées pour le compte de l'acheteur : documents d'urbanisme, état hypothécaire, géomètre…).</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Ancien ou neuf : un écart majeur</h3>
            <p style={{ marginBottom: 16 }}>Dans l'ancien, les frais représentent environ 7 à 8 % du prix d'achat, en raison de droits de mutation autour de 5,80 % (jusqu'à 6,30 % dans certains départements depuis 2025). Dans le neuf, les droits sont réduits à 0,715 %, ce qui ramène les frais à 2 à 3 % du prix. Cet écart explique en grande partie pourquoi un même budget n'offre pas la même surface selon que l'on achète dans l'ancien ou dans le neuf.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Comment réduire la note</h3>
            <p>Deux leviers principaux : déduire la valeur du mobilier vendu avec le bien (les meubles n'étant pas soumis aux droits de mutation) et, pour les biens de plus de 100 000 €, demander une remise sur les émoluments du notaire (jusqu'à 20 % sur la part au-delà de ce seuil). Les frais d'agence, s'ils sont à la charge de l'acquéreur, peuvent également être sortis du prix soumis aux droits selon leur mode de facturation.</p>
          </div>
        </div>

        {/* FAQ */}
        <SimRecommendations items={RECOMMENDATIONS['/simulateurs/frais-notaire']} />

        <FaqSection items={FAQ} />

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", opacity: 0.6, marginTop: 32 }}>
          Simulation indicative basée sur les barèmes 2024-2025 · Le montant exact figure dans le décompte du notaire et varie selon le département · Ne constitue pas un conseil juridique
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
