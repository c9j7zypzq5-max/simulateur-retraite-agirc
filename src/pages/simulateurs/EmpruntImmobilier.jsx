import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import ZoomableChart from "../../components/ZoomableChart.jsx";
import LineAreaChart from "../../components/charts/LineAreaChart.jsx";

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
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import Footer from "../../components/Footer.jsx";
import Terme from "../../components/Terme.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import AffiliateCTA from "../../components/AffiliateCTA.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, StepperInput, AccordionSection,
  Chip, Toggle, useAnimatedNumber,
  fmt, fmtEur, SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";

// ─── Calculs ─────────────────────────────────────────────────────────────────
function fraisNotaire(prix, neuf) { return prix * (neuf ? 0.025 : 0.075); }

function mensualite(capital, tauxAnnuel, dureeAns) {
  if (capital <= 0 || dureeAns <= 0) return 0;
  const r = tauxAnnuel / 100 / 12;
  const n = dureeAns * 12;
  if (r === 0) return capital / n;
  return (capital * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// ─── Jauge d'endettement ─────────────────────────────────────────────────────
function JaugeEndettement({ taux }) {
  const color = taux <= 0 ? "var(--text-secondary)"
    : taux <= 25 ? "#6aaa6a"
    : taux <= 33 ? "var(--gold)"
    : taux <= 35 ? "#e08030"
    : "#cc5555";
  const label = taux <= 0 ? "—" : taux <= 25 ? "Excellent" : taux <= 33 ? "Acceptable" : taux <= 35 ? "Limite" : "Trop élevé";
  const pct = Math.min(100, (taux / 50) * 100);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Taux d'endettement
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color, fontWeight: 600 }}>{label}</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color, fontWeight: 700 }}>
            {taux > 0 ? taux.toFixed(1) : "—"}%
          </span>
        </div>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: "var(--progress-track)", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,#4a9a4a,${color})`, borderRadius: 4, transition: "width 0.4s, background 0.3s" }} />
        {[25, 33, 35].map(s => (
          <div key={s} style={{ position: "absolute", top: 0, left: `${s / 50 * 100}%`, width: 1, height: "100%", background: "rgba(255,255,255,0.15)" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: "var(--text-secondary)", opacity: 0.7 }}>
        <span>0%</span><span>25%</span><span>33%</span><span>35%</span><span>50%+</span>
      </div>
    </div>
  );
}

// ─── Tableau d'amortissement ─────────────────────────────────────────────────
function TableauAmortissement({ capital, tauxAnnuel, dureeAns, primoCapital, primoTaux }) {
  const rows = [];
  let rP = capital - primoCapital, rPr = primoCapital;
  const mP = mensualite(rP, tauxAnnuel, dureeAns);
  const mPr = mensualite(rPr, primoTaux, dureeAns);
  for (let i = 1; i <= dureeAns * 12; i++) {
    const iP = rP * (tauxAnnuel / 100 / 12); rP = Math.max(0, rP - (mP - iP));
    const iPr = rPr * (primoTaux / 100 / 12); rPr = Math.max(0, rPr - (mPr - iPr));
    if (i % 12 === 0) rows.push({ annee: i / 12, mensualite: mP + mPr, capitalRestant: rP + rPr });
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
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "rgba(184,147,74,0.02)" : "transparent" }}>
              <td style={{ padding: "8px 10px", textAlign: "right", color: "var(--text-secondary)" }}>{r.annee}</td>
              <td style={{ padding: "8px 10px", textAlign: "right", color: "var(--text)", fontFamily: "'Cormorant Garamond', serif", fontSize: 15 }}>{fmtEur(Math.round(r.mensualite))}</td>
              <td style={{ padding: "8px 10px", textAlign: "right", color: r.capitalRestant < 50000 ? "var(--gold)" : "var(--text)", fontFamily: "'Cormorant Garamond', serif", fontSize: 15 }}>{fmtEur(Math.round(r.capitalRestant))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── sectionTitle constant (pas de dépendance mobile) ────────────────────────
const sectionTitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 20 };

const FAQ = [
  {
    q: "Quel apport minimum est recommandé ?",
    a: "Les banques exigent généralement un apport d'au moins 10 % du prix d'achat pour couvrir les frais de notaire et réduire le risque. Un apport de 20 % ou plus améliore significativement les conditions d'emprunt (taux, durée). Sans apport, le dossier est très difficile à financer hors cas exceptionnels.",
  },
  {
    q: "Comment est calculée la mensualité ?",
    a: "La mensualité est calculée selon la formule des annuités constantes : M = C × r × (1+r)ⁿ / ((1+r)ⁿ − 1), où C est le capital emprunté, r le taux mensuel (taux annuel ÷ 12) et n le nombre total de mensualités. Elle reste fixe tout au long du prêt à taux fixe.",
  },
  {
    q: "Comment est calculé le taux d'endettement et quel est le plafond légal ?",
    a: "Le taux d'endettement (ou taux d'effort) = mensualités de crédit ÷ revenus nets × 100. Depuis janvier 2022, le HCSF (Haut Conseil de Stabilité Financière) impose un plafond légal de 35 % pour les banques françaises. Au-delà, le dossier est refusé dans la grande majorité des cas.",
  },
  {
    q: "Qu'est-ce que le PTZ (primo-accédant) ?",
    a: "Le Prêt à Taux Zéro (PTZ) est réservé aux primo-accédants achetant leur première résidence principale. Il finance jusqu'à 50 % de l'opération dans les zones tendues (A, Abis, B1) avec un taux à 0 %. Ce simulateur l'approxime à 10 % du capital à 1,95 % — les conditions réelles varient selon la zone, les revenus et le type de logement.",
  },
  {
    q: "Quelle durée d'emprunt choisir ?",
    a: "Une durée plus longue réduit la mensualité mais augmente le coût total des intérêts. Les banques françaises prêtent généralement jusqu'à 25 ans (27 ans pour le neuf avec travaux). Règle pratique : remboursez le moins longtemps possible tout en restant sous 35 % de taux d'endettement. Les durées de 20-25 ans sont les plus courantes.",
  },
  {
    q: "Comment sont estimés les frais de notaire ?",
    a: "Pour un logement ancien : ~7,5 % du prix (droits de mutation 5,8 %, émoluments notaire, frais de dossier). Pour le neuf : ~2,5 % (droits réduits car la TVA est déjà payée). Ces taux sont approximatifs — le simulateur en donne une estimation, votre notaire établira le montant exact.",
  },
  {
    q: "Assurance emprunteur : est-ce obligatoire ?",
    a: "L'assurance de prêt n'est pas légalement obligatoire, mais toutes les banques l'exigent en pratique. Elle couvre le décès, l'invalidité et parfois la perte d'emploi. Depuis la loi Lemoine (2022), vous pouvez changer d'assurance à tout moment, ce qui peut générer des économies significatives sur la durée.",
  },
];

// ─── Simulateur ───────────────────────────────────────────────────────────────
export default function EmpruntImmobilier() {
  const [theme, setTheme] = useTheme();
  const isMobile = useIsMobile();

  // card padding responsive : 28/32px desktop, 20/16px mobile
  const card = {
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: 20, padding: isMobile ? "20px 16px" : "28px 32px",
    marginBottom: 20, boxShadow: "var(--card-shadow)",
  };

  const [prix, setPrix]               = useState(null);
  const [neuf, setNeuf]               = useState(false);
  const [inclureNotaire, setInclure]  = useState(true);
  const [apport, setApport]           = useState(null);
  const [duree, setDuree]             = useState(20);
  const [taux, setTaux]               = useState(3.5);
  const [primo, setPrimo]             = useState(false);
  // Comparaison d'un 2e scénario (durée / taux), capital constant.
  const [compareOn, setCompareOn]     = useState(false);
  const [bDuree, setBDuree]           = useState(20);
  const [bTaux, setBTaux]             = useState(3.5);
  const [salaire, setSalaire]         = useState(null);
  const [coEmp, setCoEmp]             = useState(false);
  const [salaireCoEmp, setSalaireCoEmp] = useState(null);
  const [taxeFonc, setTaxeFonc]       = useState(0);
  const [charges, setCharges]         = useState(0);
  const [assurance, setAssurance]     = useState(0);

  const resultsRef = useRef(null);

  useEffect(() => {
    document.title = "Simulateur Emprunt Immobilier 2025 — Mensualité et capacité d'emprunt";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Calculez votre mensualité, taux d'endettement et coût total du crédit immobilier. Frais de notaire, PTZ, tableau d'amortissement inclus.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'emprunt-immobilier' });
    if (!sessionStorage.getItem('tracked_emprunt-immobilier')) {
      sessionStorage.setItem('tracked_emprunt-immobilier', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'emprunt-immobilier' })
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.prix !== undefined) setPrix(shared.prix);
      if (shared.apport !== undefined) setApport(shared.apport);
      if (shared.duree !== undefined) setDuree(shared.duree);
      if (shared.taux !== undefined) setTaux(shared.taux);
      if (shared.primo !== undefined) setPrimo(shared.primo);
      if (shared.salaire !== undefined) setSalaire(shared.salaire);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ prix, apport, duree, taux, primo, salaire }));
  }, [prix, apport, duree, taux, primo, salaire]);

  const fn = prix ? fraisNotaire(prix, neuf) : 0;
  const capitalEmprunte = Math.max(0, (prix ?? 0) + (inclureNotaire ? fn : 0) - (apport ?? 0));
  const primoCapital = primo ? capitalEmprunte * 0.1 : 0;
  const primoTaux = 1.95;
  const capitalPrincipal = capitalEmprunte - primoCapital;

  const mPrincipal = mensualite(capitalPrincipal, taux, duree);
  const mPrimo = mensualite(primoCapital, primoTaux, duree);
  const mTotal = mPrincipal + mPrimo;

  const coutTotal = mTotal * duree * 12;
  const coutInterets = coutTotal - capitalEmprunte;
  const revenuTotal = (salaire ?? 0) + (coEmp ? (salaireCoEmp ?? 0) : 0);
  const chargesTotal = taxeFonc / 12 + charges + assurance;
  const tauxEndet = revenuTotal > 0 ? (mTotal / revenuTotal) * 100 : 0;
  const resteAVivre = revenuTotal - mTotal - chargesTotal;
  const apportPct = prix && prix > 0 ? ((apport ?? 0) / prix * 100).toFixed(1) : 0;

  const animMensualite = useAnimatedNumber(mTotal);
  const animCapital = useAnimatedNumber(capitalEmprunte);
  const animInterets = useAnimatedNumber(coutInterets);
  const animTauxEndet = useAnimatedNumber(tauxEndet);
  const animReste = useAnimatedNumber(resteAVivre);

  const hasResult = prix && prix > 0;

  const amortChart = useMemo(() => {
    if (!hasResult || capitalEmprunte <= 0) return [];
    const r = taux / 100 / 12;
    const n = duree * 12;
    const men = r === 0 ? capitalEmprunte / n
      : (capitalEmprunte * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    let restant = capitalEmprunte;
    let cumulInt = 0;
    return Array.from({ length: duree + 1 }, (_, yr) => {
      if (yr === 0) return { x: 0, restant: capitalEmprunte, interets: 0 };
      for (let mo = 0; mo < 12; mo++) {
        const int = restant * r;
        cumulInt += int;
        restant = Math.max(0, restant - (men - int));
      }
      return { x: yr, restant: Math.round(restant), interets: Math.round(cumulInt) };
    });
  }, [hasResult, capitalEmprunte, taux, duree]);

  // Scénario B : on ne fait varier que la durée et le taux (capital identique).
  const mTotalB = mensualite(capitalPrincipal, bTaux, bDuree) + mensualite(primoCapital, primoTaux, bDuree);
  const coutTotalB = mTotalB * bDuree * 12;
  const deltaMensu = mTotalB - mTotal;
  const deltaCout = coutTotalB - coutTotal;
  function startCompare() {
    setBDuree(duree); setBTaux(taux); setCompareOn(true);
    track('compare_open', { name: 'emprunt-immobilier' });
  }

  const report = {
    title: "Simulateur Emprunt Immobilier",
    highlight: { label: "Mensualité totale", value: hasResult ? `${fmtEur(Math.round(mTotal))}/mois` : "—" },
    params: [
      { label: "Prix du bien", value: prix ? fmtEur(prix) : "—" },
      { label: "Apport", value: apport ? `${fmtEur(apport)} (${apportPct} %)` : "—" },
      { label: "Durée", value: `${duree} ans` },
      { label: "Taux", value: `${taux} %` },
      { label: "Primo-accédant (PTZ)", value: primo ? "Oui" : "Non" },
      { label: "Revenu mensuel net", value: salaire ? fmtEur(salaire) : "—" },
    ],
    results: hasResult ? [
      { label: "Mensualité totale", value: `${fmtEur(Math.round(mTotal))}/mois`, strong: true },
      { label: "Capital emprunté", value: fmtEur(Math.round(capitalEmprunte)) },
      { label: "Coût total des intérêts", value: fmtEur(Math.round(coutInterets)) },
      { label: "Taux d'endettement", value: `${tauxEndet.toFixed(1)} %` },
      { label: "Reste à vivre", value: `${fmtEur(Math.round(resteAVivre))}/mois` },
    ] : [],
    notes: hasResult && revenuTotal > 0 ? [
      `Taux d'endettement de ${tauxEndet.toFixed(1)} % (seuil HCSF : 35 %).`,
    ] : undefined,
  };

  const indicateurs = [
    { label: "Apport ≥ 10% du prix", ok: prix > 0 && (apport ?? 0) / prix >= 0.1 },
    { label: "Taux d'endettement ≤ 35%", ok: tauxEndet > 0 && tauxEndet <= 35 },
    { label: "Reste à vivre ≥ 1 200 €/mois", ok: resteAVivre >= 1200 },
    { label: "Durée ≤ 25 ans", ok: duree <= 25 },
    { label: "Taux de marché ≤ 5%", ok: taux <= 5 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur d'emprunt immobilier",
        "url": "https://www.simfinly.com/simulateurs/emprunt-immobilier",
        "description": "Calculez votre mensualité, taux d'endettement et coût total du crédit immobilier. Frais de notaire, PTZ, tableau d'amortissement inclus.",
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
          icon={<SimIcon path="/simulateurs/emprunt-immobilier" size={34} />}
          badge="Immobilier · Simulation 2026"
          title="Simulateur d'emprunt immobilier"
          subtitle="Mensualités · Capacité · Coût total"
          desc="Calculez vos mensualités, votre taux d'endettement et le coût total de votre crédit. Inclut frais de notaire, primo-accédant et tableau d'amortissement."
        />

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>

          {/* ── Colonne formulaire — visuellement 2e sur mobile (order 2) ── */}
          <div style={{ order: isMobile ? 2 : 1 }}>
            {/* Bien */}
            <div style={card}>
              <h2 style={sectionTitle}>Bien immobilier</h2>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Type de bien</span>
                <Toggle options={["Ancien", "Neuf"]} checked={neuf} onChange={setNeuf} />
              </div>
              <NumInput label="Prix du bien" value={prix} onChange={setPrix} unit="€" min={10000} max={5000000} />
              {prix > 0 && (
                <div style={{ background: "rgba(184,147,74,0.06)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Frais de notaire estimés</div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{neuf ? "2,5% (neuf)" : "7,5% (ancien)"}</div>
                    </div>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "var(--gold)" }}>{fmtEur(Math.round(fn))}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Inclure dans l'emprunt</span>
                    <Toggle options={["Non", "Oui"]} checked={inclureNotaire} onChange={setInclure} />
                  </div>
                </div>
              )}
              <NumInput label="Apport personnel" value={apport} onChange={setApport} unit="€" min={0} max={5000000}
                hint={prix > 0 && apport ? `${apportPct}% du prix` : undefined} />
              {prix > 0 && (
                <div style={{ display: "flex", gap: 8, marginTop: -12, marginBottom: 24 }}>
                  {[10, 20, 30].map(p => (
                    <button key={p} onClick={() => setApport(Math.round(prix * p / 100))}
                      style={{ flex: 1, padding: "7px 4px", background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: 8, cursor: "pointer", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold-mid)"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Prêt */}
            <div style={card}>
              <h2 style={sectionTitle}>Paramètres du prêt</h2>
              <StepperInput label="Durée" value={duree} onChange={v => setDuree(Math.round(v))} min={1} max={30} step={1} unit="ans" />
              <StepperInput label="Taux d'intérêt annuel" value={taux} onChange={setTaux} min={0.1} max={15} step={0.1} unit="%" />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, color: primo ? "var(--gold)" : "var(--text-secondary)", fontWeight: primo ? 500 : 400 }}>Primo-accédant (PTZ)</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>10% du capital à 1,95%/an</div>
                </div>
                <Toggle options={["Non", "Oui"]} checked={primo} onChange={setPrimo} />
              </div>
              {primo && capitalEmprunte > 0 && (
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 8 }}>
                  <Chip label="Tranche aidée (1,95%)" value={fmtEur(Math.round(primoCapital))} accent />
                  <Chip label="Tranche principale" value={fmtEur(Math.round(capitalPrincipal))} />
                </div>
              )}
            </div>

            {/* Revenus */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Revenus mensuels nets</h2>
                <Toggle options={["Seul", "À deux"]} checked={coEmp} onChange={setCoEmp} />
              </div>
              <NumInput label="Mon salaire net" value={salaire} onChange={setSalaire} unit="€/mois" />
              {coEmp && <NumInput label="Salaire co-emprunteur" value={salaireCoEmp} onChange={setSalaireCoEmp} unit="€/mois" />}
              {coEmp && salaire && salaireCoEmp && (
                <div style={{ marginTop: -8 }}>
                  <Chip label="Revenus cumulés" value={fmtEur(revenuTotal) + "/mois"} />
                </div>
              )}
            </div>

            {/* Charges optionnelles */}
            <AccordionSection title="Charges du bien (optionnel)">
              <StepperInput label="Taxe foncière" value={taxeFonc} onChange={setTaxeFonc} min={0} max={20000} step={50} unit="€/an"
                hint={taxeFonc > 0 ? `soit ${fmtEur(Math.round(taxeFonc / 12))}/mois` : undefined} />
              <StepperInput label="Charges de copropriété" value={charges} onChange={setCharges} min={0} max={5000} step={10} unit="€/mois" />
              <StepperInput label="Assurance emprunteur" value={assurance} onChange={setAssurance} min={0} max={2000} step={5} unit="€/mois" />
            </AccordionSection>
          </div>

          {/* ── Colonne résultats — visuellement 1e sur mobile (order 1) ── */}
          <div style={{ order: isMobile ? 1 : 2, minWidth: 0 }}>
            {/* Résultat principal */}
            <div style={{ background: "linear-gradient(145deg, rgba(184,147,74,0.08), var(--card-bg))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginBottom: 20, textAlign: "center", boxShadow: "var(--card-shadow)" }} ref={resultsRef}>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 10 }}>
                Mensualité crédit
              </div>
              {hasResult ? (
                <>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(44px,8vw,68px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {fmtEur(Math.round(animMensualite))}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
                    /mois · sur {duree} ans
                  </div>
                  {primo && (
                    <div style={{ marginTop: 14, padding: "10px 16px", background: "rgba(184,147,74,0.06)", border: "1px solid var(--border-gold)", borderRadius: 10, fontSize: 12, color: "var(--text-secondary)" }}>
                      <span style={{ color: "var(--gold)" }}>{fmtEur(Math.round(mPrimo))}/mois</span> à 1,95% (PTZ) ·{" "}
                      <span>{fmtEur(Math.round(mPrincipal))}/mois</span> principal
                    </div>
                  )}
                  {chargesTotal > 0 && (
                    <div style={{ marginTop: 14, padding: "10px 16px", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10 }}>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>Coût mensuel total (crédit + charges)</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: "var(--text)" }}>
                        {fmtEur(Math.round(mTotal + chargesTotal))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p style={{ color: "var(--text-secondary)", padding: "20px 0", fontSize: 14 }}>
                  Saisissez le prix du bien pour voir votre estimation.
                </p>
              )}

              <ShareBar
                params={{ prix, apport, duree, taux, primo, salaire }}
                resultsRef={resultsRef}
                report={report}
                name="emprunt-immobilier"
              />
            </div>

            {/* Taux d'endettement */}
            {hasResult && salaire && (
              <div style={card}>
                <JaugeEndettement taux={animTauxEndet} />
                {tauxEndet > 35 && (
                  <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(200,80,80,0.06)", border: "1px solid rgba(200,80,80,0.25)", borderRadius: 10, fontSize: 12, color: "#cc7070", lineHeight: 1.6 }}>
                    ⚠ Taux supérieur à 35 %. Augmentez l'apport, réduisez le montant ou rallongez la durée.
                  </div>
                )}
                <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Chip label="Reste à vivre" value={fmtEur(Math.round(animReste)) + "/mois"} accent={resteAVivre >= 1200} small />
                  <Chip label="Capacité max (35%)" value={fmtEur(Math.round(revenuTotal * 0.35)) + "/mois"} small />
                </div>
              </div>
            )}

            {/* Chips principaux — toujours 2 colonnes car la colonne résultats est pleine largeur sur mobile */}
            {hasResult && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <Chip label="Capital emprunté" value={fmtEur(Math.round(animCapital))} accent small />
                <Chip label="Dont intérêts" value={fmtEur(Math.round(animInterets))} small />
                <Chip label="Coût total crédit" value={fmtEur(Math.round(mTotal * duree * 12))} small />
                <Chip label="Frais de notaire" value={fmtEur(Math.round(fn))} small />
              </div>
            )}

            {/* Indicateurs */}
            {hasResult && salaire && (
              <AccordionSection title="Indicateurs bancaires" defaultOpen>
                {indicateurs.map(({ label, ok }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: ok ? "rgba(100,200,100,0.08)" : "rgba(200,80,80,0.08)", border: `1px solid ${ok ? "rgba(100,200,100,0.3)" : "rgba(200,80,80,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, color: ok ? "#6aaa6a" : "#cc5555" }}>
                      {ok ? "✓" : "✗"}
                    </div>
                    <span style={{ fontSize: 13, color: ok ? "var(--text)" : "var(--text-secondary)" }}>{label}</span>
                  </div>
                ))}
              </AccordionSection>
            )}

            {/* Récapitulatif */}
            {hasResult && (
              <AccordionSection title="Récapitulatif du projet">
                {[
                  { label: "Prix du bien", value: fmtEur(prix) },
                  { label: `Frais de notaire (${neuf ? "2,5" : "7,5"}%)`, value: fmtEur(Math.round(fn)) },
                  { label: "Apport personnel", value: "− " + fmtEur(apport ?? 0) },
                  { label: "Capital emprunté", value: fmtEur(Math.round(capitalEmprunte)), accent: true },
                ].map(({ label, value, accent }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: accent ? "var(--gold)" : "var(--text)" }}>{value}</span>
                  </div>
                ))}
              </AccordionSection>
            )}

            {/* Comparaison de 2 scénarios (durée / taux) */}
            {hasResult && capitalEmprunte > 0 && !compareOn && (
              <button
                onClick={startCompare}
                style={{ width: "100%", marginBottom: 20, padding: "14px 20px", borderRadius: 14, cursor: "pointer", background: "var(--card-bg)", border: "1px dashed var(--border-gold)", color: "var(--gold)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
              >
                ⚖️ Comparer durée / taux (2ᵉ scénario)
              </button>
            )}

            {hasResult && capitalEmprunte > 0 && compareOn && (
              <div style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 600, color: "var(--text)" }}>Comparaison de scénarios</h3>
                  <button onClick={() => setCompareOn(false)} aria-label="Fermer la comparaison" style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 16 }}>✕</button>
                </div>
                <div className="cmp-grid">
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>Scénario A (actuel)</div>
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.9 }}>
                      <li>Durée : <strong style={{ color: "var(--text)" }}>{duree} ans</strong></li>
                      <li>Taux : <strong style={{ color: "var(--text)" }}>{taux} %</strong></li>
                    </ul>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Mensualité</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: "var(--text)" }}>{fmtEur(Math.round(mTotal))}<span style={{ fontSize: 13 }}>/mois</span></div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 8 }}>Coût total</div>
                    <div style={{ fontSize: 15, color: "var(--text)" }}>{fmtEur(Math.round(coutTotal))}</div>
                  </div>
                  <div className="cmp-colB" style={{ borderLeft: "1px solid var(--border)", paddingLeft: 18 }}>
                    <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 10 }}>Scénario B</div>
                    <StepperInput label="Durée" value={bDuree} onChange={v => setBDuree(Math.round(v))} min={1} max={30} step={1} unit="ans" />
                    <StepperInput label="Taux annuel" value={bTaux} onChange={setBTaux} min={0.1} max={15} step={0.1} unit="%" />
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>Mensualité</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: "var(--gold)" }}>{fmtEur(Math.round(mTotalB))}<span style={{ fontSize: 13 }}>/mois</span></div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 8 }}>Coût total</div>
                    <div style={{ fontSize: 15, color: "var(--text)" }}>{fmtEur(Math.round(coutTotalB))}</div>
                  </div>
                </div>
                <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[{ label: "Écart mensualité", d: deltaMensu, suffix: "/mois" }, { label: "Écart coût total", d: deltaCout, suffix: "" }].map(({ label, d, suffix }) => (
                    <div key={label} style={{ padding: "12px 14px", borderRadius: 12, textAlign: "center", background: d <= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${d <= 0 ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}` }}>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>{label} (B − A)</div>
                      <strong style={{ fontSize: 16, color: d <= 0 ? "#22c55e" : "#ef4444" }}>{d <= 0 ? "−" : "+"}{fmtEur(Math.abs(Math.round(d)))}{suffix}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tableau d'amortissement */}
            {hasResult && capitalEmprunte > 0 && (
              <AccordionSection title="Tableau d'amortissement" subtitle={`${duree} ans · ${duree * 12} mensualités`}>
                <TableauAmortissement
                  capital={capitalEmprunte} tauxAnnuel={taux} dureeAns={duree}
                  primoCapital={primoCapital} primoTaux={primoTaux}
                />
              </AccordionSection>
            )}
          </div>
        </div>

        {/* Graphique amortissement */}
        {hasResult && amortChart.length > 1 && (
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "28px 24px", marginBottom: 24, boxShadow: "var(--card-shadow)" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 12 }}>
              Évolution du capital et des intérêts
            </div>
            <ZoomableChart caption="Courbe d'amortissement">
              <LineAreaChart
                series={[
                  { id: "restant", label: "Capital restant", points: amortChart.map(p => ({ x: p.x, y: p.restant })), color: "#b8934a", fillColor: "rgba(184,147,74,0.12)" },
                  { id: "interets", label: "Intérêts cumulés", points: amortChart.map(p => ({ x: p.x, y: p.interets })), color: "#6eb5d4", fillColor: "rgba(110,181,212,0.10)", dashed: true },
                ]}
                xFmt={(v) => `${v} an${v > 1 ? "s" : ""}`}
                yFmt={(v) => v >= 1_000_000 ? `${(v / 1e6).toFixed(1)}M€` : `${Math.round(v / 1000)}k€`}
                aria="Courbe d'amortissement"
              />
            </ZoomableChart>
          </div>
        )}

        {/* Affiliation */}
        {hasResult && <AffiliateCTA type="emprunt" />}

        {/* AdSense mid */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos de ce simulateur</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>La formule de calcul de la mensualité</h3>
            <p style={{ marginBottom: 16 }}>La mensualité d'un crédit immobilier est calculée par la formule d'amortissement constant : M = C × t / (1 − (1 + t)⁻ⁿ), où C est le capital emprunté, t le taux mensuel (taux annuel ÷ 12) et n la durée en mois. Au début du prêt, la mensualité se compose principalement d'intérêts ; au fil du temps, la part en capital augmente progressivement. Le tableau d'amortissement détaille cette décomposition mois par mois.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Le taux d'endettement et la règle HCSF des 35 %</h3>
            <p style={{ marginBottom: 16 }}>Depuis janvier 2022, les règles du Haut Conseil de Stabilité Financière (HCSF) sont contraignantes pour les banques : le <Terme slug="taux-endettement">taux d'endettement</Terme> ne peut pas dépasser 35 % des revenus nets (assurance comprise) et la durée du prêt est limitée à 25 ans (27 ans pour les achats dans le neuf avec différé). Ces règles visent à protéger les emprunteurs contre le surendettement. Les banques disposent d'un quota de dérogations limité à 20 % des dossiers.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Frais de notaire et coût total du crédit</h3>
            <p>Les frais de notaire représentent environ 7 à 8 % du prix d'achat dans l'ancien (droits de mutation, émoluments, débours) et seulement 2 à 3 % dans le neuf. Le coût total du crédit comprend les intérêts versés sur toute la durée, l'assurance emprunteur (souvent 0,2 à 0,5 % du capital par an) et les éventuelles garanties. Ce coût peut représenter 30 à 50 % du capital emprunté sur 20 ans.</p>
          </div>
        </div>

        {/* FAQ */}
        <FaqSection items={FAQ} />

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", opacity: 0.6, marginTop: 32 }}>
          Simulation indicative · Ne constitue pas un engagement de la banque
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
