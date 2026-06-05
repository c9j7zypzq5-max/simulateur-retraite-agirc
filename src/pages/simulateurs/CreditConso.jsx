import { useState, useEffect, useRef } from "react";
import { track } from '@vercel/analytics';
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, StatusBadge, useAnimatedNumber,
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

// ─── Calculs crédit à la consommation ────────────────────────────────────────
// Crédit amortissable classique : mensualités constantes calculées à partir du
// TAEG (Taux Annuel Effectif Global) et de la durée exprimée EN MOIS.
//
// ⚠ Estimation INDICATIVE (2025/2026). Le coût réel d'un crédit dépend du TAEG
// effectivement appliqué, qui ne peut légalement dépasser le taux d'usure publié
// chaque trimestre par la Banque de France selon le montant et la durée du prêt.
// L'assurance emprunteur est ici facultative et ajoutée à la mensualité.

// Mensualité d'amortissement constant (taux mensuel = TAEG/12, durée en mois).
function mensualite(montant, taegPct, dureeMois) {
  if (montant <= 0 || dureeMois <= 0) return 0;
  const r = taegPct / 100 / 12;
  const n = dureeMois;
  if (r === 0) return montant / n;
  return (montant * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// ─── Tableau d'amortissement (lignes annuelles) ──────────────────────────────
function TableauAmortissement({ montant, taegPct, dureeMois }) {
  const rows = [];
  const r = taegPct / 100 / 12;
  const m = mensualite(montant, taegPct, dureeMois);
  let restant = montant;
  for (let i = 1; i <= dureeMois; i++) {
    const interet = restant * r;
    restant = Math.max(0, restant - (m - interet));
    if (i % 12 === 0 || i === dureeMois) {
      rows.push({ mois: i, annee: Math.ceil(i / 12), capitalRestant: restant });
    }
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Année", "Mensualité", "Capital restant"].map(h => (
              <th key={h} style={{ textAlign: "right", padding: "8px 10px", fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "rgba(184,147,74,0.02)" : "transparent" }}>
              <td style={{ padding: "8px 10px", textAlign: "right", color: "var(--text-secondary)" }}>{row.annee}</td>
              <td style={{ padding: "8px 10px", textAlign: "right", color: "var(--text)", fontFamily: "'Cormorant Garamond', serif", fontSize: 15 }}>{fmtEur(Math.round(m))}</td>
              <td style={{ padding: "8px 10px", textAlign: "right", color: row.capitalRestant <= 0 ? "var(--gold)" : "var(--text)", fontFamily: "'Cormorant Garamond', serif", fontSize: 15 }}>{fmtEur(Math.round(row.capitalRestant))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const sectionTitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 20 };

const FAQ = [
  {
    q: "Quelle différence entre TAEG et taux nominal ?",
    a: "Le taux nominal (ou taux débiteur) ne reflète que les intérêts du prêt. Le TAEG (Taux Annuel Effectif Global) intègre, en plus des intérêts, l'ensemble des frais obligatoires : frais de dossier, frais de garantie et, le cas échéant, l'assurance si elle est exigée. C'est le TAEG qui permet de comparer objectivement deux offres de crédit, car il reflète le coût réel total.",
  },
  {
    q: "Qu'est-ce que le taux d'usure ?",
    a: "Le taux d'usure est le TAEG maximum légal qu'un prêteur peut appliquer. Il est révisé chaque trimestre par la Banque de France et varie selon le type de crédit, le montant emprunté et la durée. Tout crédit proposé à un taux supérieur est considéré comme usuraire et donc illégal. Ce plafond protège les emprunteurs contre des conditions abusives.",
  },
  {
    q: "Comment la durée influence-t-elle le coût ?",
    a: "Allonger la durée réduit la mensualité, ce qui soulage le budget mensuel, mais augmente mécaniquement le coût total du crédit : vous payez des intérêts plus longtemps. À l'inverse, une durée courte fait grimper la mensualité mais réduit fortement les intérêts. Il faut arbitrer entre confort de remboursement et coût global.",
  },
  {
    q: "L'assurance emprunteur est-elle obligatoire ?",
    a: "Pour un crédit à la consommation, l'assurance emprunteur (décès, invalidité, parfois perte d'emploi) est généralement facultative, contrairement au crédit immobilier où elle est exigée en pratique. Elle augmente la mensualité mais sécurise le remboursement en cas d'aléa. Vous restez libre de l'accepter ou non, et de choisir un autre assureur que le prêteur.",
  },
  {
    q: "Quelle différence avec un crédit immobilier ?",
    a: "Le crédit à la consommation finance des biens ou besoins courants (voiture, travaux, trésorerie) pour des montants plafonnés (jusqu'à 75 000 €) et des durées plus courtes (souvent 12 à 84 mois). Le crédit immobilier finance l'achat d'un logement sur des montants et des durées bien plus importants, avec une garantie hypothécaire et une assurance obligatoire. Les TAEG et les règles diffèrent sensiblement.",
  },
  {
    q: "Ce simulateur est-il officiel ?",
    a: "Non. Il s'agit d'une estimation indicative basée sur une mensualité d'amortissement constant. Le coût réel dépend du TAEG effectivement accordé, des frais annexes et de l'assurance choisie. Le tableau d'amortissement est simplifié (lignes annuelles). Rapprochez-vous d'un établissement prêteur pour une offre personnalisée et un TAEG conforme au taux d'usure en vigueur.",
  },
];

// ─── Simulateur ───────────────────────────────────────────────────────────────
export default function CreditConso() {
  const [theme, setTheme] = useTheme();
  const isMobile = useIsMobile();

  const card = {
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: 20, padding: isMobile ? "20px 16px" : "28px 32px",
    marginBottom: 20, boxShadow: "var(--card-shadow)",
  };

  const [montant, setMontant]     = useState(null);
  const [taeg, setTaeg]           = useState(5);
  const [duree, setDuree]         = useState(36);
  const [assurance, setAssurance] = useState(0);

  const resultsRef = useRef(null);

  useEffect(() => {
    document.title = "Simulateur Crédit Conso 2025 — Mensualité et coût du crédit";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Calculez la mensualité de votre crédit à la consommation, le coût total et le total des intérêts selon le montant, le TAEG et la durée. Tableau d'amortissement inclus.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.mesimulateurs.fr' + window.location.pathname;
    track('simulator_view', { name: 'credit-conso' });
    if (!sessionStorage.getItem('tracked_credit-conso')) {
      sessionStorage.setItem('tracked_credit-conso', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'credit-conso' })
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.montant !== undefined) setMontant(shared.montant);
      if (shared.taeg !== undefined) setTaeg(shared.taeg);
      if (shared.duree !== undefined) setDuree(shared.duree);
      if (shared.assurance !== undefined) setAssurance(shared.assurance);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ montant, taeg, duree, assurance }));
  }, [montant, taeg, duree, assurance]);

  // ── Calculs ──
  const montantEmprunte = montant ?? 0;
  const m = mensualite(montantEmprunte, taeg, duree);
  const mensualiteTotale = m + (assurance ?? 0);
  const coutTotal = mensualiteTotale * duree;
  const coutCredit = coutTotal - montantEmprunte;
  const totalInterets = m * duree - montantEmprunte;
  const totalAssurance = (assurance ?? 0) * duree;

  const hasInput = montantEmprunte > 0 && duree > 0;

  const animMensualite = useAnimatedNumber(mensualiteTotale);
  const animCout = useAnimatedNumber(coutCredit);

  const report = {
    title: "Simulateur Crédit Conso",
    highlight: { label: "Mensualité totale", value: hasInput ? `${fmtEur(Math.round(mensualiteTotale))}/mois` : "—" },
    params: [
      { label: "Montant emprunté", value: montant ? fmtEur(montant) : "—" },
      { label: "TAEG annuel", value: `${taeg} %` },
      { label: "Durée", value: `${duree} mois (${(duree / 12).toFixed(1)} an(s))` },
      { label: "Assurance optionnelle", value: (assurance ?? 0) > 0 ? `${fmtEur(assurance)}/mois` : "—" },
    ],
    results: hasInput ? [
      { label: "Mensualité totale", value: `${fmtEur(Math.round(mensualiteTotale))}/mois`, strong: true },
      { label: "Mensualité (hors assurance)", value: fmtEur(Math.round(m)) },
      { label: "Total des intérêts", value: fmtEur(Math.round(totalInterets)) },
      { label: "Coût total du crédit", value: fmtEur(Math.round(coutCredit)) },
      { label: "Total remboursé", value: fmtEur(Math.round(coutTotal)) },
    ] : [],
    notes: hasInput ? [
      "Le TAEG accordé doit respecter le taux d'usure en vigueur publié par la Banque de France.",
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur Crédit à la consommation 2025",
        "url": "https://www.mesimulateurs.fr/simulateurs/credit-conso",
        "description": "Calculez la mensualité de votre crédit à la consommation, le coût total et le total des intérêts selon le montant, le TAEG et la durée.",
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
          icon="💳"
          badge="Finances · Simulation 2025"
          title="Simulateur Crédit Conso"
          subtitle="Mensualité · Coût total · Amortissement"
          desc="Calculez la mensualité de votre crédit à la consommation, le coût total et le total des intérêts selon le montant emprunté, le TAEG et la durée. Tableau d'amortissement inclus."
        />

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>

          {/* ── Colonne formulaire ── */}
          <div style={{ order: isMobile ? 2 : 1 }}>
            <div style={card}>
              <h2 style={sectionTitle}>Votre crédit</h2>
              <NumInput label="Montant emprunté" value={montant} onChange={setMontant} unit="€" min={200} max={100000} />
              <StepperInput label="TAEG annuel" value={taeg} onChange={setTaeg} min={0.1} max={25} step={0.1} unit="%"
                tooltip="Taux Annuel Effectif Global : inclut intérêts et frais obligatoires. Doit rester sous le taux d'usure." />
              <StepperInput label="Durée" value={duree} onChange={v => setDuree(Math.round(v))} min={3} max={120} step={1} unit="mois"
                hint={duree > 0 ? `soit ${(duree / 12).toFixed(1)} an(s)` : undefined} />
              <StepperInput label="Assurance optionnelle" value={assurance} onChange={setAssurance} min={0} max={200} step={1} unit="€/mois"
                hint={(assurance ?? 0) > 0 ? `Total assurance : ${fmtEur(totalAssurance)} sur ${duree} mois` : "Facultative pour un crédit conso"} />
            </div>
          </div>

          {/* ── Colonne résultats ── */}
          <div style={{ order: isMobile ? 1 : 2, minWidth: 0 }}>
            <div style={{ background: "linear-gradient(145deg, rgba(184,147,74,0.08), var(--card-bg))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginBottom: 20, textAlign: "center", boxShadow: "var(--card-shadow)" }} ref={resultsRef}>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 10 }}>
                Mensualité totale
              </div>
              {!hasInput ? (
                <p style={{ color: "var(--text-secondary)", padding: "20px 0", fontSize: 14 }}>
                  Renseignez le montant emprunté pour voir votre estimation.
                </p>
              ) : (
                <>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(44px,8vw,68px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {fmtEur(Math.round(animMensualite))}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
                    /mois · sur {duree} mois ({(duree / 12).toFixed(1)} an{duree >= 24 ? "s" : ""})
                  </div>
                  <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                    <StatusBadge status="gold" label={`TAEG ${taeg} %`} />
                    {(assurance ?? 0) > 0 && <StatusBadge status="info" label={`+ ${fmtEur(assurance)}/mois assurance`} />}
                  </div>
                </>
              )}

              <ShareBar
                params={{ montant, taeg, duree, assurance }}
                resultsRef={resultsRef}
                report={report}
                name="credit-conso"
              />
            </div>

            {hasInput && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <Chip label="Coût total du crédit" value={fmtEur(Math.round(animCout))} accent small />
                <Chip label="Total des intérêts" value={fmtEur(Math.round(totalInterets))} small />
                <Chip label="Montant emprunté" value={fmtEur(montantEmprunte)} small />
                <Chip label="Durée" value={`${duree} mois`} small />
              </div>
            )}

            {hasInput && (
              <AccordionSection title="Détail du calcul" defaultOpen>
                {[
                  { label: "Montant emprunté", value: fmtEur(montantEmprunte) },
                  { label: "Mensualité (hors assurance)", value: fmtEur(Math.round(m)) },
                  { label: "Assurance mensuelle", value: fmtEur(assurance ?? 0) },
                  { label: "Mensualité totale", value: fmtEur(Math.round(mensualiteTotale)), accent: true },
                  { label: "Total des intérêts", value: fmtEur(Math.round(totalInterets)) },
                  { label: "Total assurance", value: fmtEur(Math.round(totalAssurance)) },
                  { label: "Coût total du crédit", value: fmtEur(Math.round(coutCredit)), accent: true },
                  { label: "Total remboursé", value: fmtEur(Math.round(coutTotal)), accent: true },
                ].map(({ label, value, accent }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: accent ? "var(--gold)" : "var(--text)" }}>{value}</span>
                  </div>
                ))}
              </AccordionSection>
            )}

            {hasInput && (
              <AccordionSection title="Tableau d'amortissement" subtitle={`${duree} mois · ${(duree / 12).toFixed(1)} an(s)`}>
                <TableauAmortissement montant={montantEmprunte} taegPct={taeg} dureeMois={duree} />
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
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos du crédit à la consommation</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>La mensualité d'un crédit amortissable</h3>
            <p style={{ marginBottom: 16 }}>La mensualité d'un crédit à la consommation classique est calculée par la formule d'amortissement constant : M = C × r × (1+r)ⁿ / ((1+r)ⁿ − 1), où C est le montant emprunté, r le taux mensuel (TAEG ÷ 12) et n le nombre de mensualités. La mensualité reste fixe : au début, elle contient surtout des intérêts, puis la part de capital remboursé augmente progressivement, comme le montre le tableau d'amortissement.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>TAEG et taux d'usure</h3>
            <p style={{ marginBottom: 16 }}>Le TAEG est l'indicateur de référence pour comparer les offres : il agrège les intérêts et tous les frais obligatoires. La loi encadre son niveau via le taux d'usure, plafond légal révisé chaque trimestre par la Banque de France selon le montant et la durée du crédit. Un TAEG supérieur à ce seuil rend le prêt usuraire et illégal.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Durée, assurance et coût total</h3>
            <p>Le coût du crédit dépend fortement de la durée : plus elle est longue, plus la mensualité baisse mais plus les intérêts s'accumulent. L'assurance emprunteur, facultative pour un crédit conso, augmente la mensualité tout en sécurisant le remboursement. Le coût total du crédit correspond à la somme des intérêts et de l'assurance, soit l'écart entre le total remboursé et le montant emprunté.</p>
          </div>
        </div>

        {/* FAQ */}
        <FaqSection items={FAQ} />

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", opacity: 0.6, marginTop: 32 }}>
          Simulation indicative (2025) · Le TAEG doit respecter le taux d'usure en vigueur · Ne constitue pas une offre de crédit
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
