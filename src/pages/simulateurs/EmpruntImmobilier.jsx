import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import ZoomableChart from "../../components/ZoomableChart.jsx";
import LineAreaChart from "../../components/charts/LineAreaChart.jsx";

import { useIsMobile } from "../../hooks/useIsMobile.js";
import { useTheme } from "../../hooks/useTheme.js";
import { useTranslation } from "../../i18n/index.js";
import Navbar from "../../components/Navbar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import Footer from "../../components/Footer.jsx";
import Terme from "../../components/Terme.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import AffiliateCTA from "../../components/AffiliateCTA.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
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
function JaugeEndettement({ taux, txt }) {
  const color = taux <= 0 ? "var(--text-secondary)"
    : taux <= 25 ? "#6aaa6a"
    : taux <= 33 ? "var(--gold)"
    : taux <= 35 ? "#e08030"
    : "#cc5555";
  const label = taux <= 0 ? "—" : taux <= 25 ? txt.endetExcellent : taux <= 33 ? txt.endetAcceptable : taux <= 35 ? txt.endetLimite : txt.endetTropEleve;
  const pct = Math.min(100, (taux / 50) * 100);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {txt.endetTitle}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color, fontWeight: 600 }}>{label}</span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, color, fontWeight: 700 }}>
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
function TableauAmortissement({ capital, tauxAnnuel, dureeAns, primoCapital, primoTaux, headers }) {
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
            {headers.map(h => (
              <th key={h} style={{ textAlign: "right", padding: "8px 10px", fontSize: 11, color: "var(--text-secondary)", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "rgba(43,92,230,0.02)" : "transparent" }}>
              <td style={{ padding: "8px 10px", textAlign: "right", color: "var(--text-secondary)" }}>{r.annee}</td>
              <td style={{ padding: "8px 10px", textAlign: "right", color: "var(--text)", fontFamily: "'Space Grotesk', sans-serif", fontSize: 15 }}>{fmtEur(Math.round(r.mensualite))}</td>
              <td style={{ padding: "8px 10px", textAlign: "right", color: r.capitalRestant < 50000 ? "var(--gold)" : "var(--text)", fontFamily: "'Space Grotesk', sans-serif", fontSize: 15 }}>{fmtEur(Math.round(r.capitalRestant))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── sectionTitle constant (pas de dépendance mobile) ────────────────────────
const sectionTitle = { fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 20 };

// ─── Textes (FR / EN) ──────────────────────────────────────────────────────────
// Contenu décrivant le crédit immobilier français (frais de notaire, PTZ, règle
// HCSF), en français et en anglais (public expatrié / international).
const TXT = {
  fr: {
    docTitle: "Simulateur Emprunt Immobilier 2025 — Mensualité et capacité d'emprunt",
    docDesc: "Calculez votre mensualité, taux d'endettement et coût total du crédit immobilier. Frais de notaire, PTZ, tableau d'amortissement inclus.",
    appName: "Simulateur d'emprunt immobilier",
    badge: "Immobilier · Simulation 2026",
    title: "Simulateur d'emprunt immobilier",
    subtitle: "Mensualités · Capacité · Coût total",
    desc: "Calculez vos mensualités, votre taux d'endettement et le coût total de votre crédit. Inclut frais de notaire, primo-accédant et tableau d'amortissement.",
    pctSuffix: " %",
    perMonth: "/mois",
    yearsUnit: "ans",
    bienTitle: "Bien immobilier",
    typeLabel: "Type de bien",
    toggleAncien: "Ancien",
    toggleNeuf: "Neuf",
    prixLabel: "Prix du bien",
    fraisTitle: "Frais de notaire estimés",
    fraisPctNeuf: "2,5% (neuf)",
    fraisPctAncien: "7,5% (ancien)",
    inclureLabel: "Inclure dans l'emprunt",
    toggleNon: "Non",
    toggleOui: "Oui",
    apportLabel: "Apport personnel",
    apportHint: (pct) => `${pct}% du prix`,
    pretTitle: "Paramètres du prêt",
    dureeLabel: "Durée",
    tauxLabel: "Taux d'intérêt annuel",
    primoLabel: "Primo-accédant (PTZ)",
    primoHint: "10% du capital à 1,95%/an",
    chipTrancheAidee: "Tranche aidée (1,95%)",
    chipTranchePrincipale: "Tranche principale",
    revenusTitle: "Revenus mensuels nets",
    toggleSeul: "Seul",
    toggleDeux: "À deux",
    salaireLabel: "Mon salaire net",
    coEmpLabel: "Salaire co-emprunteur",
    chipRevenusCumules: "Revenus cumulés",
    chargesTitle: "Charges du bien (optionnel)",
    taxeFoncLabel: "Taxe foncière",
    taxeFoncHint: (m) => `soit ${fmtEur(m)}/mois`,
    chargesCoproLabel: "Charges de copropriété",
    assuranceLabel: "Assurance emprunteur",
    mensualiteLabel: "Mensualité crédit",
    perMonthDuree: (d) => `/mois · sur ${d} ans`,
    ptzDecomp: (mPrimo, mPrincipal) => <><span style={{ color: "var(--gold)" }}>{fmtEur(Math.round(mPrimo))}/mois</span> à 1,95% (PTZ) · <span>{fmtEur(Math.round(mPrincipal))}/mois</span> principal</>,
    coutMensuelTotalLabel: "Coût mensuel total (crédit + charges)",
    emptyMsg: "Saisissez le prix du bien pour voir votre estimation.",
    endetTitle: "Taux d'endettement",
    endetExcellent: "Excellent",
    endetAcceptable: "Acceptable",
    endetLimite: "Limite",
    endetTropEleve: "Trop élevé",
    warn35: "⚠ Taux supérieur à 35 %. Augmentez l'apport, réduisez le montant ou rallongez la durée.",
    chipResteAVivre: "Reste à vivre",
    chipCapaciteMax: "Capacité max (35%)",
    chipCapital: "Capital emprunté",
    chipInterets: "Dont intérêts",
    chipCoutTotal: "Coût total crédit",
    chipFrais: "Frais de notaire",
    indicateursTitle: "Indicateurs bancaires",
    indApport: "Apport ≥ 10% du prix",
    indEndet: "Taux d'endettement ≤ 35%",
    indReste: "Reste à vivre ≥ 1 200 €/mois",
    indDuree: "Durée ≤ 25 ans",
    indTaux: "Taux de marché ≤ 5%",
    recapTitle: "Récapitulatif du projet",
    recapPrix: "Prix du bien",
    recapFrais: (pct) => `Frais de notaire (${pct}%)`,
    recapApport: "Apport personnel",
    recapCapital: "Capital emprunté",
    compareBtn: "⚖️ Comparer durée / taux (2ᵉ scénario)",
    compareTitle: "Comparaison de scénarios",
    closeCompare: "Fermer la comparaison",
    scenarioA: "Scénario A (actuel)",
    scenarioB: "Scénario B",
    dureeLine: "Durée : ",
    tauxLine: "Taux : ",
    mensualiteWord: "Mensualité",
    coutTotalWord: "Coût total",
    bDureeLabel: "Durée",
    bTauxLabel: "Taux annuel",
    ecartMensu: "Écart mensualité",
    ecartCout: "Écart coût total",
    ecartSuffix: " (B − A)",
    amortTitle: "Tableau d'amortissement",
    amortSubtitle: (d) => `${d} ans · ${d * 12} mensualités`,
    amortHeaders: ["Année", "Mensualité", "Capital restant"],
    chartTitle: "Évolution du capital et des intérêts",
    chartCaption: "Courbe d'amortissement",
    serieRestant: "Capital restant",
    serieInterets: "Intérêts cumulés",
    chartXFmt: (v) => `${v} an${v > 1 ? "s" : ""}`,
    aboutTitle: "À propos de ce simulateur",
    aboutH1: "La formule de calcul de la mensualité",
    aboutP1: "La mensualité d'un crédit immobilier est calculée par la formule d'amortissement constant : M = C × t / (1 − (1 + t)⁻ⁿ), où C est le capital emprunté, t le taux mensuel (taux annuel ÷ 12) et n la durée en mois. Au début du prêt, la mensualité se compose principalement d'intérêts ; au fil du temps, la part en capital augmente progressivement. Le tableau d'amortissement détaille cette décomposition mois par mois.",
    aboutH2: "Le taux d'endettement et la règle HCSF des 35 %",
    aboutP2: <>Depuis janvier 2022, les règles du Haut Conseil de Stabilité Financière (HCSF) sont contraignantes pour les banques : le <Terme slug="taux-endettement">taux d'endettement</Terme> ne peut pas dépasser 35 % des revenus nets (assurance comprise) et la durée du prêt est limitée à 25 ans (27 ans pour les achats dans le neuf avec différé). Ces règles visent à protéger les emprunteurs contre le surendettement. Les banques disposent d'un quota de dérogations limité à 20 % des dossiers.</>,
    aboutH3: "Frais de notaire et coût total du crédit",
    aboutP3: "Les frais de notaire représentent environ 7 à 8 % du prix d'achat dans l'ancien (droits de mutation, émoluments, débours) et seulement 2 à 3 % dans le neuf. Le coût total du crédit comprend les intérêts versés sur toute la durée, l'assurance emprunteur (souvent 0,2 à 0,5 % du capital par an) et les éventuelles garanties. Ce coût peut représenter 30 à 50 % du capital emprunté sur 20 ans.",
    disclaimer: "Simulation indicative · Ne constitue pas un engagement de la banque",
    faq: [
      { q: "Quel apport minimum est recommandé ?", a: "Les banques exigent généralement un apport d'au moins 10 % du prix d'achat pour couvrir les frais de notaire et réduire le risque. Un apport de 20 % ou plus améliore significativement les conditions d'emprunt (taux, durée). Sans apport, le dossier est très difficile à financer hors cas exceptionnels." },
      { q: "Comment est calculée la mensualité ?", a: "La mensualité est calculée selon la formule des annuités constantes : M = C × r × (1+r)ⁿ / ((1+r)ⁿ − 1), où C est le capital emprunté, r le taux mensuel (taux annuel ÷ 12) et n le nombre total de mensualités. Elle reste fixe tout au long du prêt à taux fixe." },
      { q: "Comment est calculé le taux d'endettement et quel est le plafond légal ?", a: "Le taux d'endettement (ou taux d'effort) = mensualités de crédit ÷ revenus nets × 100. Depuis janvier 2022, le HCSF (Haut Conseil de Stabilité Financière) impose un plafond légal de 35 % pour les banques françaises. Au-delà, le dossier est refusé dans la grande majorité des cas." },
      { q: "Qu'est-ce que le PTZ (primo-accédant) ?", a: "Le Prêt à Taux Zéro (PTZ) est réservé aux primo-accédants achetant leur première résidence principale. Il finance jusqu'à 50 % de l'opération dans les zones tendues (A, Abis, B1) avec un taux à 0 %. Ce simulateur l'approxime à 10 % du capital à 1,95 % — les conditions réelles varient selon la zone, les revenus et le type de logement." },
      { q: "Quelle durée d'emprunt choisir ?", a: "Une durée plus longue réduit la mensualité mais augmente le coût total des intérêts. Les banques françaises prêtent généralement jusqu'à 25 ans (27 ans pour le neuf avec travaux). Règle pratique : remboursez le moins longtemps possible tout en restant sous 35 % de taux d'endettement. Les durées de 20-25 ans sont les plus courantes." },
      { q: "Comment sont estimés les frais de notaire ?", a: "Pour un logement ancien : ~7,5 % du prix (droits de mutation 5,8 %, émoluments notaire, frais de dossier). Pour le neuf : ~2,5 % (droits réduits car la TVA est déjà payée). Ces taux sont approximatifs — le simulateur en donne une estimation, votre notaire établira le montant exact." },
      { q: "Assurance emprunteur : est-ce obligatoire ?", a: "L'assurance de prêt n'est pas légalement obligatoire, mais toutes les banques l'exigent en pratique. Elle couvre le décès, l'invalidité et parfois la perte d'emploi. Depuis la loi Lemoine (2022), vous pouvez changer d'assurance à tout moment, ce qui peut générer des économies significatives sur la durée." },
    ],
    rTitle: "Simulateur Emprunt Immobilier",
    rMensualite: "Mensualité totale",
    rPrix: "Prix du bien",
    rApport: "Apport",
    rApportVal: (val, pct) => `${val} (${pct}${" %"})`,
    rDuree: "Durée",
    rTaux: "Taux",
    rPrimo: "Primo-accédant (PTZ)",
    rRevenu: "Revenu mensuel net",
    oui: "Oui",
    non: "Non",
    rCapital: "Capital emprunté",
    rInterets: "Coût total des intérêts",
    rEndet: "Taux d'endettement",
    rReste: "Reste à vivre",
    noteEndet: (pct) => `Taux d'endettement de ${pct} % (seuil HCSF : 35 %).`,
  },
  en: {
    docTitle: "French Mortgage Calculator 2025 — Monthly Payment & Borrowing Capacity",
    docDesc: "Work out your monthly payment, debt-to-income ratio and total cost of a French mortgage. Notary fees, zero-rate loan (PTZ) and amortization schedule included.",
    appName: "French mortgage calculator",
    badge: "Real estate · 2026 simulation",
    title: "Mortgage calculator",
    subtitle: "Payments · Capacity · Total cost",
    desc: "Work out your monthly payment, debt-to-income ratio and the total cost of your loan. Includes notary fees, first-time buyer loan (PTZ) and amortization schedule (French rules).",
    pctSuffix: "%",
    perMonth: "/mo",
    yearsUnit: "yrs",
    bienTitle: "Property",
    typeLabel: "Property type",
    toggleAncien: "Existing",
    toggleNeuf: "New build",
    prixLabel: "Property price",
    fraisTitle: "Estimated notary fees",
    fraisPctNeuf: "2.5% (new)",
    fraisPctAncien: "7.5% (existing)",
    inclureLabel: "Include in the loan",
    toggleNon: "No",
    toggleOui: "Yes",
    apportLabel: "Down payment",
    apportHint: (pct) => `${pct}% of the price`,
    pretTitle: "Loan settings",
    dureeLabel: "Term",
    tauxLabel: "Annual interest rate",
    primoLabel: "First-time buyer (PTZ)",
    primoHint: "10% of capital at 1.95%/yr",
    chipTrancheAidee: "Subsidised tranche (1.95%)",
    chipTranchePrincipale: "Main tranche",
    revenusTitle: "Net monthly income",
    toggleSeul: "Single",
    toggleDeux: "Joint",
    salaireLabel: "My net salary",
    coEmpLabel: "Co-borrower salary",
    chipRevenusCumules: "Combined income",
    chargesTitle: "Property charges (optional)",
    taxeFoncLabel: "Property tax (taxe foncière)",
    taxeFoncHint: (m) => `i.e. ${fmtEur(m)}/mo`,
    chargesCoproLabel: "Building service charges",
    assuranceLabel: "Loan insurance",
    mensualiteLabel: "Loan payment",
    perMonthDuree: (d) => `/mo · over ${d} years`,
    ptzDecomp: (mPrimo, mPrincipal) => <><span style={{ color: "var(--gold)" }}>{fmtEur(Math.round(mPrimo))}/mo</span> at 1.95% (PTZ) · <span>{fmtEur(Math.round(mPrincipal))}/mo</span> main</>,
    coutMensuelTotalLabel: "Total monthly cost (loan + charges)",
    emptyMsg: "Enter the property price to see your estimate.",
    endetTitle: "Debt-to-income ratio",
    endetExcellent: "Excellent",
    endetAcceptable: "Acceptable",
    endetLimite: "Borderline",
    endetTropEleve: "Too high",
    warn35: "⚠ Ratio above 35%. Increase the down payment, reduce the amount or extend the term.",
    chipResteAVivre: "Disposable income",
    chipCapaciteMax: "Max capacity (35%)",
    chipCapital: "Amount borrowed",
    chipInterets: "Of which interest",
    chipCoutTotal: "Total loan cost",
    chipFrais: "Notary fees",
    indicateursTitle: "Bank indicators",
    indApport: "Down payment ≥ 10% of price",
    indEndet: "Debt-to-income ≤ 35%",
    indReste: "Disposable income ≥ €1,200/mo",
    indDuree: "Term ≤ 25 years",
    indTaux: "Market rate ≤ 5%",
    recapTitle: "Project summary",
    recapPrix: "Property price",
    recapFrais: (pct) => `Notary fees (${pct}%)`,
    recapApport: "Down payment",
    recapCapital: "Amount borrowed",
    compareBtn: "⚖️ Compare term / rate (2nd scenario)",
    compareTitle: "Scenario comparison",
    closeCompare: "Close the comparison",
    scenarioA: "Scenario A (current)",
    scenarioB: "Scenario B",
    dureeLine: "Term: ",
    tauxLine: "Rate: ",
    mensualiteWord: "Payment",
    coutTotalWord: "Total cost",
    bDureeLabel: "Term",
    bTauxLabel: "Annual rate",
    ecartMensu: "Payment gap",
    ecartCout: "Total cost gap",
    ecartSuffix: " (B − A)",
    amortTitle: "Amortization schedule",
    amortSubtitle: (d) => `${d} years · ${d * 12} payments`,
    amortHeaders: ["Year", "Payment", "Remaining capital"],
    chartTitle: "Capital and interest over time",
    chartCaption: "Amortization curve",
    serieRestant: "Remaining capital",
    serieInterets: "Cumulative interest",
    chartXFmt: (v) => `${v} yr${v > 1 ? "s" : ""}`,
    aboutTitle: "About this calculator",
    aboutH1: "The monthly payment formula",
    aboutP1: "A mortgage payment is computed with the constant-amortization formula: M = C × t / (1 − (1 + t)⁻ⁿ), where C is the amount borrowed, t the monthly rate (annual rate ÷ 12) and n the term in months. At the start of the loan, the payment is mostly interest; over time, the principal share gradually increases. The amortization schedule details this breakdown month by month.",
    aboutH2: "Debt-to-income and the French 35% (HCSF) rule",
    aboutP2: <>Since January 2022, the rules of the French High Council for Financial Stability (HCSF) are binding for banks: the <Terme slug="taux-endettement">debt-to-income ratio</Terme> cannot exceed 35% of net income (insurance included) and the loan term is capped at 25 years (27 for new builds with a deferral). These rules aim to protect borrowers from over-indebtedness. Banks have a derogation quota limited to 20% of files.</>,
    aboutH3: "Notary fees and total cost of the loan",
    aboutP3: "Notary fees are about 7-8% of the price for existing properties (transfer duties, fees, disbursements) and only 2-3% for new builds. The total cost of the loan includes the interest paid over the whole term, the borrower's insurance (often 0.2 to 0.5% of capital per year) and any guarantees. This cost can represent 30 to 50% of the amount borrowed over 20 years.",
    disclaimer: "Indicative simulation · Not a commitment from the bank",
    faq: [
      { q: "What minimum down payment is recommended?", a: "Banks usually require a down payment of at least 10% of the purchase price to cover notary fees and reduce risk. A down payment of 20% or more significantly improves loan terms (rate, duration). Without any down payment, the file is very hard to finance except in exceptional cases." },
      { q: "How is the monthly payment calculated?", a: "The payment is computed with the constant-annuity formula: M = C × r × (1+r)ⁿ / ((1+r)ⁿ − 1), where C is the amount borrowed, r the monthly rate (annual rate ÷ 12) and n the total number of payments. It stays fixed throughout a fixed-rate loan." },
      { q: "How is the debt-to-income ratio calculated and what is the legal cap?", a: "The debt-to-income (or effort) ratio = loan payments ÷ net income × 100. Since January 2022, the HCSF (French High Council for Financial Stability) imposes a legal cap of 35% on French banks. Above that, the file is rejected in the vast majority of cases." },
      { q: "What is the PTZ (first-time buyer loan)?", a: "The zero-rate loan (PTZ) is reserved for first-time buyers purchasing their first main residence. It finances up to 50% of the operation in tight zones (A, Abis, B1) at a 0% rate. This calculator approximates it at 10% of the capital at 1.95% — actual conditions vary by zone, income and property type." },
      { q: "Which loan term should you choose?", a: "A longer term lowers the monthly payment but increases the total interest cost. French banks generally lend up to 25 years (27 for new builds with works). Rule of thumb: repay over the shortest possible term while staying under a 35% debt-to-income ratio. Terms of 20-25 years are the most common." },
      { q: "How are notary fees estimated?", a: "For an existing property: ~7.5% of the price (5.8% transfer duties, notary fees, processing fees). For a new build: ~2.5% (reduced duties since VAT is already paid). These rates are approximate — the calculator gives an estimate, your notary will set the exact amount." },
      { q: "Is borrower's insurance mandatory?", a: "Loan insurance is not legally mandatory, but all banks require it in practice. It covers death, disability and sometimes job loss. Since the Lemoine law (2022), you can change insurer at any time, which can generate significant savings over the term." },
    ],
    rTitle: "Mortgage Calculator",
    rMensualite: "Total monthly payment",
    rPrix: "Property price",
    rApport: "Down payment",
    rDuree: "Term",
    rTaux: "Rate",
    rPrimo: "First-time buyer (PTZ)",
    rRevenu: "Net monthly income",
    oui: "Yes",
    non: "No",
    rCapital: "Amount borrowed",
    rInterets: "Total interest cost",
    rEndet: "Debt-to-income ratio",
    rReste: "Disposable income",
    noteEndet: (pct) => `Debt-to-income ratio of ${pct}% (HCSF cap: 35%).`,
  },
};

// ─── Simulateur ───────────────────────────────────────────────────────────────
export default function EmpruntImmobilier() {
  const [theme, setTheme] = useTheme();
  const isMobile = useIsMobile();
  const { locale } = useTranslation();
  const txt = TXT[locale] || TXT.fr;
  const isEn = locale === "en";

  // card padding responsive : 28/32px desktop, 20/16px mobile
  const card = {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 16, padding: "24px 20px",
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

  usePageMeta(txt.docTitle, txt.docDesc);

  useEffect(() => {
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
    title: txt.rTitle,
    highlight: { label: txt.rMensualite, value: hasResult ? `${fmtEur(Math.round(mTotal))}${txt.perMonth}` : "—" },
    params: [
      { label: txt.rPrix, value: prix ? fmtEur(prix) : "—" },
      { label: txt.rApport, value: apport ? `${fmtEur(apport)} (${apportPct}${txt.pctSuffix})` : "—" },
      { label: txt.rDuree, value: `${duree} ${txt.yearsUnit}` },
      { label: txt.rTaux, value: `${taux}${txt.pctSuffix}` },
      { label: txt.rPrimo, value: primo ? txt.oui : txt.non },
      { label: txt.rRevenu, value: salaire ? fmtEur(salaire) : "—" },
    ],
    results: hasResult ? [
      { label: txt.rMensualite, value: `${fmtEur(Math.round(mTotal))}${txt.perMonth}`, strong: true },
      { label: txt.rCapital, value: fmtEur(Math.round(capitalEmprunte)) },
      { label: txt.rInterets, value: fmtEur(Math.round(coutInterets)) },
      { label: txt.rEndet, value: `${tauxEndet.toFixed(1)}${txt.pctSuffix}` },
      { label: txt.rReste, value: `${fmtEur(Math.round(resteAVivre))}${txt.perMonth}` },
    ] : [],
    notes: hasResult && revenuTotal > 0 ? [
      txt.noteEndet(tauxEndet.toFixed(1)),
    ] : undefined,
  };

  const indicateurs = [
    { label: txt.indApport, ok: prix > 0 && (apport ?? 0) / prix >= 0.1 },
    { label: txt.indEndet, ok: tauxEndet > 0 && tauxEndet <= 35 },
    { label: txt.indReste, ok: resteAVivre >= 1200 },
    { label: txt.indDuree, ok: duree <= 25 },
    { label: txt.indTaux, ok: taux <= 5 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": txt.appName,
        "url": `https://www.simfinly.com${isEn ? "/en/simulators/mortgage" : "/simulateurs/emprunt-immobilier"}`,
        "description": txt.docDesc,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": isEn ? "en-US" : "fr-FR",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": txt.faq.map(f => ({
          "@type": "Question", "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }} />
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ background: "var(--bg)", padding: "28px 16px 80px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/emprunt-immobilier" size={34} />}
          badge={txt.badge}
          title={txt.title}
          subtitle={txt.subtitle}
          desc={txt.desc}
        />

        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "330px 1fr", gap: 24, alignItems: "start" }}>

          {/* ── Colonne formulaire — visuellement 2e sur mobile (order 2) ── */}
          <div style={{ order: isMobile ? 2 : 1 }}>
            {/* Bien */}
            <div style={card}>
              <h2 style={sectionTitle}>{txt.bienTitle}</h2>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{txt.typeLabel}</span>
                <Toggle options={[txt.toggleAncien, txt.toggleNeuf]} checked={neuf} onChange={setNeuf} />
              </div>
              <NumInput label={txt.prixLabel} value={prix} onChange={setPrix} unit="€" min={10000} max={5000000} />
              {prix > 0 && (
                <div style={{ background: "rgba(43,92,230,0.05)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{txt.fraisTitle}</div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{neuf ? txt.fraisPctNeuf : txt.fraisPctAncien}</div>
                    </div>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--gold)" }}>{fmtEur(Math.round(fn))}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{txt.inclureLabel}</span>
                    <Toggle options={[txt.toggleNon, txt.toggleOui]} checked={inclureNotaire} onChange={setInclure} />
                  </div>
                </div>
              )}
              <NumInput label={txt.apportLabel} value={apport} onChange={setApport} unit="€" min={0} max={5000000}
                hint={prix > 0 && apport ? txt.apportHint(apportPct) : undefined} />
              {prix > 0 && (
                <div style={{ display: "flex", gap: 8, marginTop: -12, marginBottom: 24 }}>
                  {[10, 20, 30].map(p => (
                    <button key={p} onClick={() => setApport(Math.round(prix * p / 100))}
                      style={{ flex: 1, padding: "7px 4px", background: "var(--card-bg)", border: "1px solid var(--border)", color: "var(--text-secondary)", borderRadius: 8, cursor: "pointer", fontSize: 11, fontFamily: "'Hanken Grotesk', sans-serif" }}
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
              <h2 style={sectionTitle}>{txt.pretTitle}</h2>
              <StepperInput label={txt.dureeLabel} value={duree} onChange={v => setDuree(Math.round(v))} min={1} max={30} step={1} unit={txt.yearsUnit} />
              <StepperInput label={txt.tauxLabel} value={taux} onChange={setTaux} min={0.1} max={15} step={0.1} unit="%" />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, color: primo ? "var(--gold)" : "var(--text-secondary)", fontWeight: primo ? 500 : 400 }}>{txt.primoLabel}</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>{txt.primoHint}</div>
                </div>
                <Toggle options={[txt.toggleNon, txt.toggleOui]} checked={primo} onChange={setPrimo} />
              </div>
              {primo && capitalEmprunte > 0 && (
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 8 }}>
                  <Chip label={txt.chipTrancheAidee} value={fmtEur(Math.round(primoCapital))} accent />
                  <Chip label={txt.chipTranchePrincipale} value={fmtEur(Math.round(capitalPrincipal))} />
                </div>
              )}
            </div>

            {/* Revenus */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ ...sectionTitle, marginBottom: 0 }}>{txt.revenusTitle}</h2>
                <Toggle options={[txt.toggleSeul, txt.toggleDeux]} checked={coEmp} onChange={setCoEmp} />
              </div>
              <NumInput label={txt.salaireLabel} value={salaire} onChange={setSalaire} unit="€/mois" />
              {coEmp && <NumInput label={txt.coEmpLabel} value={salaireCoEmp} onChange={setSalaireCoEmp} unit="€/mois" />}
              {coEmp && salaire && salaireCoEmp && (
                <div style={{ marginTop: -8 }}>
                  <Chip label={txt.chipRevenusCumules} value={fmtEur(revenuTotal) + txt.perMonth} />
                </div>
              )}
            </div>

            {/* Charges optionnelles */}
            <AccordionSection title={txt.chargesTitle}>
              <StepperInput label={txt.taxeFoncLabel} value={taxeFonc} onChange={setTaxeFonc} min={0} max={20000} step={50} unit="€/an"
                hint={taxeFonc > 0 ? txt.taxeFoncHint(Math.round(taxeFonc / 12)) : undefined} />
              <StepperInput label={txt.chargesCoproLabel} value={charges} onChange={setCharges} min={0} max={5000} step={10} unit="€/mois" />
              <StepperInput label={txt.assuranceLabel} value={assurance} onChange={setAssurance} min={0} max={2000} step={5} unit="€/mois" />
            </AccordionSection>
          </div>

          {/* ── Colonne résultats — visuellement 1e sur mobile (order 1) ── */}
          <div style={{ order: isMobile ? 1 : 2, minWidth: 0 }}>
            {/* Résultat principal */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 20, textAlign: "center", boxShadow: "var(--card-shadow)" }} ref={resultsRef}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'Hanken Grotesk', sans-serif", marginBottom: 6 }}>
                {txt.mensualiteLabel}
              </div>
              {hasResult ? (
                <>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 42, color: "var(--primary)", lineHeight: 1 }}>
                    {fmtEur(Math.round(animMensualite))}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
                    {txt.perMonthDuree(duree)}
                  </div>
                  {primo && (
                    <div style={{ marginTop: 14, padding: "10px 16px", background: "rgba(43,92,230,0.05)", border: "1px solid var(--border-gold)", borderRadius: 10, fontSize: 12, color: "var(--text-secondary)" }}>
                      {txt.ptzDecomp(mPrimo, mPrincipal)}
                    </div>
                  )}
                  {chargesTotal > 0 && (
                    <div style={{ marginTop: 14, padding: "10px 16px", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10 }}>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>{txt.coutMensuelTotalLabel}</div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--text)" }}>
                        {fmtEur(Math.round(mTotal + chargesTotal))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p style={{ color: "var(--text-secondary)", padding: "20px 0", fontSize: 14 }}>
                  {txt.emptyMsg}
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
                <JaugeEndettement taux={animTauxEndet} txt={txt} />
                {tauxEndet > 35 && (
                  <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(200,80,80,0.06)", border: "1px solid rgba(200,80,80,0.25)", borderRadius: 10, fontSize: 12, color: "#cc7070", lineHeight: 1.6 }}>
                    {txt.warn35}
                  </div>
                )}
                <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Chip label={txt.chipResteAVivre} value={fmtEur(Math.round(animReste)) + txt.perMonth} accent={resteAVivre >= 1200} small />
                  <Chip label={txt.chipCapaciteMax} value={fmtEur(Math.round(revenuTotal * 0.35)) + txt.perMonth} small />
                </div>
              </div>
            )}

            {/* Chips principaux — toujours 2 colonnes car la colonne résultats est pleine largeur sur mobile */}
            {hasResult && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <Chip label={txt.chipCapital} value={fmtEur(Math.round(animCapital))} accent small />
                <Chip label={txt.chipInterets} value={fmtEur(Math.round(animInterets))} small />
                <Chip label={txt.chipCoutTotal} value={fmtEur(Math.round(mTotal * duree * 12))} small />
                <Chip label={txt.chipFrais} value={fmtEur(Math.round(fn))} small />
              </div>
            )}

            {/* Indicateurs */}
            {hasResult && salaire && (
              <AccordionSection title={txt.indicateursTitle} defaultOpen>
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
              <AccordionSection title={txt.recapTitle}>
                {[
                  { label: txt.recapPrix, value: fmtEur(prix) },
                  { label: txt.recapFrais(neuf ? (isEn ? "2.5" : "2,5") : (isEn ? "7.5" : "7,5")), value: fmtEur(Math.round(fn)) },
                  { label: txt.recapApport, value: "− " + fmtEur(apport ?? 0) },
                  { label: txt.recapCapital, value: fmtEur(Math.round(capitalEmprunte)), accent: true },
                ].map(({ label, value, accent }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: accent ? "var(--gold)" : "var(--text)" }}>{value}</span>
                  </div>
                ))}
              </AccordionSection>
            )}

            {/* Comparaison de 2 scénarios (durée / taux) */}
            {hasResult && capitalEmprunte > 0 && !compareOn && (
              <button
                onClick={startCompare}
                style={{ width: "100%", marginBottom: 20, padding: "14px 20px", borderRadius: 14, cursor: "pointer", background: "var(--card-bg)", border: "1px dashed var(--border-gold)", color: "var(--gold)", fontSize: 14, fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 500 }}
              >
                {txt.compareBtn}
              </button>
            )}

            {hasResult && capitalEmprunte > 0 && compareOn && (
              <div style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 600, color: "var(--text)" }}>{txt.compareTitle}</h3>
                  <button onClick={() => setCompareOn(false)} aria-label={txt.closeCompare} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 16 }}>✕</button>
                </div>
                <div className="cmp-grid">
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 10 }}>{txt.scenarioA}</div>
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.9 }}>
                      <li>{txt.dureeLine}<strong style={{ color: "var(--text)" }}>{duree} {txt.yearsUnit}</strong></li>
                      <li>{txt.tauxLine}<strong style={{ color: "var(--text)" }}>{taux}{txt.pctSuffix}</strong></li>
                    </ul>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{txt.mensualiteWord}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--text)" }}>{fmtEur(Math.round(mTotal))}<span style={{ fontSize: 13 }}>{txt.perMonth}</span></div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 8 }}>{txt.coutTotalWord}</div>
                    <div style={{ fontSize: 15, color: "var(--text)" }}>{fmtEur(Math.round(coutTotal))}</div>
                  </div>
                  <div className="cmp-colB" style={{ borderLeft: "1px solid var(--border)", paddingLeft: 18 }}>
                    <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 10 }}>{txt.scenarioB}</div>
                    <StepperInput label={txt.bDureeLabel} value={bDuree} onChange={v => setBDuree(Math.round(v))} min={1} max={30} step={1} unit={txt.yearsUnit} />
                    <StepperInput label={txt.bTauxLabel} value={bTaux} onChange={setBTaux} min={0.1} max={15} step={0.1} unit="%" />
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>{txt.mensualiteWord}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--gold)" }}>{fmtEur(Math.round(mTotalB))}<span style={{ fontSize: 13 }}>{txt.perMonth}</span></div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 8 }}>{txt.coutTotalWord}</div>
                    <div style={{ fontSize: 15, color: "var(--text)" }}>{fmtEur(Math.round(coutTotalB))}</div>
                  </div>
                </div>
                <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[{ label: txt.ecartMensu, d: deltaMensu, suffix: txt.perMonth }, { label: txt.ecartCout, d: deltaCout, suffix: "" }].map(({ label, d, suffix }) => (
                    <div key={label} style={{ padding: "12px 14px", borderRadius: 12, textAlign: "center", background: d <= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${d <= 0 ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}` }}>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>{label}{txt.ecartSuffix}</div>
                      <strong style={{ fontSize: 16, color: d <= 0 ? "#22c55e" : "#ef4444" }}>{d <= 0 ? "−" : "+"}{fmtEur(Math.abs(Math.round(d)))}{suffix}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tableau d'amortissement */}
            {hasResult && capitalEmprunte > 0 && (
              <AccordionSection title={txt.amortTitle} subtitle={txt.amortSubtitle(duree)}>
                <TableauAmortissement
                  capital={capitalEmprunte} tauxAnnuel={taux} dureeAns={duree}
                  primoCapital={primoCapital} primoTaux={primoTaux} headers={txt.amortHeaders}
                />
              </AccordionSection>
            )}
          </div>
        </div>

        {/* Graphique amortissement */}
        {hasResult && amortChart.length > 1 && (
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "28px 24px", marginBottom: 24, boxShadow: "var(--card-shadow)" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 12 }}>
              {txt.chartTitle}
            </div>
            <ZoomableChart caption={txt.chartCaption}>
              <LineAreaChart
                series={[
                  { id: "restant", label: txt.serieRestant, points: amortChart.map(p => ({ x: p.x, y: p.restant })), color: "var(--primary)", fillColor: "rgba(43,92,230,0.1)" },
                  { id: "interets", label: txt.serieInterets, points: amortChart.map(p => ({ x: p.x, y: p.interets })), color: "#6eb5d4", fillColor: "rgba(110,181,212,0.10)", dashed: true },
                ]}
                xFmt={txt.chartXFmt}
                yFmt={(v) => v >= 1_000_000 ? `${(v / 1e6).toFixed(1)}M€` : `${Math.round(v / 1000)}k€`}
                aria={txt.chartCaption}
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
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>{txt.aboutTitle}</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>{txt.aboutH1}</h3>
            <p style={{ marginBottom: 16 }}>{txt.aboutP1}</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.aboutH2}</h3>
            <p style={{ marginBottom: 16 }}>{txt.aboutP2}</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>{txt.aboutH3}</h3>
            <p>{txt.aboutP3}</p>
          </div>
        </div>

        {/* FAQ */}
        <FaqSection items={txt.faq} />

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", opacity: 0.6, marginTop: 32 }}>
          {txt.disclaimer}
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
