import { useState, useMemo, useEffect } from "react";
import { track } from '@vercel/analytics';
import { useTheme } from "../../hooks/useTheme.js";
import { useTranslation } from "../../i18n/index.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import { NumInput, StepperInput, SimulateurHeader, FaqSection, Chip } from "../../components/ui.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import SimRecommendations from '../../components/SimRecommendations.jsx';
import { RECOMMENDATIONS } from '../../data/recommendations.js';

// Paramètres CNAP 2025 (dernières valeurs publiées)
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

// ─── Traductions ────────────────────────────────────────────────────────────
const TXT = {
  fr: {
    docTitle: "Retraite Luxembourg (CNAP) 2026 — simulateur frontaliers & pension",
    metaDesc: "Frontalier ou expatrié au Luxembourg ? Estimez votre pension CNAP selon votre carrière, salaire et âge de départ, et la totalisation avec vos droits français. Gratuit, sans inscription.",
    jsonLdName: "Simulateur retraite Luxembourg (CNAP)",
    jsonLdDesc: "Estimez votre pension du régime général luxembourgeois (CNAP) selon votre carrière, votre salaire cotisé et votre âge de départ.",
    badge: "Régime CNAP · Luxembourg 2026",
    title: "Simulateur Retraite Luxembourg",
    subtitle: "Frontaliers · Expatriés · Résidents",
    desc: "Estimez votre pension du régime général luxembourgeois (CNAP) : carrière, salaire cotisé, âge de départ et majoration famille.",
    situationTitle: "Votre situation",
    statutLabel: "Statut",
    statuts: [
      { key: "salarie", label: "Salarié" },
      { key: "independant", label: "Indépendant" },
      { key: "frontalier", label: "Frontalier" },
    ],
    salaireLabel: "Salaire annuel brut (€)",
    anneesFaitesLabel: "Années de cotisation déjà effectuées",
    anneesRestantesLabel: "Années de cotisation restantes estimées",
    ageDepartLabel: "Âge de départ souhaité",
    nbEnfantsLabel: "Nombre d'enfants élevés",
    heroLabel: "Pension nette mensuelle estimée",
    tauxLabel: (t) => `Taux de remplacement : ${t} %`,
    pensionBruteLabel: "Pension brute mensuelle",
    retenueLabel: "Retenue sociale (maladie)",
    carriereLabel: "Carrière totale",
    carriereValue: (n) => `${n} ans`,
    majorationLabel: (n) => `Majoration famille (${n} enfant${n > 1 ? "s" : ""})`,
    ageDepartValue: (a) => `${a} ans`,
    anticipeeNote: (n) => `Il vous manque ${n} an${n > 1 ? "s" : ""} de cotisations pour accéder à la retraite anticipée à 60 ans.`,
    note: "Ce simulateur est une estimation basée sur le régime général CNAP (dernières valeurs publiées, point 2025). Le calcul réel tient compte de l'historique complet des revenus cotisés. Pour une projection personnalisée, consultez votre relevé de carrière sur guichet.lu.",
    aboutTitle: "À propos de la retraite au Luxembourg",
    about: [
      {
        h3: "Le calcul de la pension CNAP",
        p: "La pension du régime général luxembourgeois (CNAP — Caisse Nationale d'Assurance Pension) combine deux éléments : une part proportionnelle au revenu cotisé (1,85 % du salaire moyen par année de carrière, dans la limite de 5 fois le salaire social minimum) et un forfait fixe indépendant du salaire, revalorisé chaque année. Une carrière complète de 40 ans donne ainsi un taux de remplacement parmi les plus élevés d'Europe, souvent proche de 70 à 75 % du dernier salaire.",
      },
      {
        h3: "Frontaliers : totaliser vos années françaises et luxembourgeoises",
        p: "Si vous résidez en France et travaillez au Luxembourg, le règlement européen de coordination (CE 883/2004) garantit la totalisation des périodes cotisées dans les deux pays pour déterminer votre taux plein. Chaque régime — CNAP au Luxembourg, CNAV et Agirc-Arrco en France — calcule ensuite sa propre pension, proportionnelle aux seules années cotisées chez lui, et la verse séparément à l'âge légal qui lui est propre. Simulez également votre CNAV française pour avoir une vision complète de votre retraite de frontalier.",
      },
      {
        h3: "Retraite anticipée : 57 ou 60 ans",
        p: "Le Luxembourg permet un départ avant l'âge légal de 65 ans dans deux cas : dès 60 ans avec au moins 40 années d'assurance (retraite anticipée ordinaire), ou dès 57 ans avec 40 années de cotisation effective — un dispositif proche de la carrière longue française, mais accessible trois ans plus tôt.",
      },
      {
        h3: "Pension minimale et majoration famille",
        p: "Les assurés justifiant d'au moins 40 années de carrière bénéficient d'une pension minimale garantie, quel que soit leur salaire cotisé — un filet de sécurité qui profite notamment aux carrières à revenus modestes. Une majoration de 5 % par enfant élevé (dans la limite de 3 enfants) s'ajoute par ailleurs à la pension calculée.",
      },
    ],
    faqTitle: "Questions fréquentes — Retraite Luxembourg",
    faq: [
      { q: "Comment fonctionne la retraite au Luxembourg (CNAP) ?", a: "Le régime général luxembourgeois (CNAP — Caisse Nationale d'Assurance Pension) est un régime par répartition. La pension est calculée sur la base des années de cotisation et du revenu moyen. Le taux de remplacement est l'un des plus élevés d'Europe : environ 73 % du dernier salaire en moyenne pour une carrière complète de 40 ans." },
      { q: "Quel est l'âge légal de retraite au Luxembourg ?", a: "L'âge légal est 65 ans pour une pension normale. Il est possible de partir à 60 ans avec 40 années d'assurance (retraite anticipée ordinaire), ou à 57 ans avec 40 années effectives de cotisation (retraite anticipée pour longues carrières). Il n'y a pas de réforme d'âge prévue à ce stade." },
      { q: "Comment est calculée la pension luxembourgeoise ?", a: "La pension est proportionnelle aux revenus cotisés et à la durée de carrière : environ 1,85 % du revenu moyen mensuel par année de cotisation, avec un forfait supplémentaire par année. Une pension minimale est garantie pour ceux qui ont cotisé au moins 40 ans." },
      { q: "Les frontaliers français ont-ils droit à la retraite luxembourgeoise ?", a: "Oui. Les travailleurs frontaliers qui ont cotisé au Luxembourg ont droit à une pension CNAP proportionnelle à leurs années de cotisation luxembourgeoises. La pension est ensuite versée en France, mais reste soumise à l'impôt luxembourgeois sous la plupart des conventions fiscales." },
      { q: "Puis-je cumuler pension luxembourgeoise et pension française ?", a: "Oui, le règlement européen (CE 883/2004) organise la coordination des régimes. Chaque pays calcule une pension « nationale » proportionnelle aux années cotisées dans ce pays. Vous percevrez une pension de chaque régime auquel vous avez cotisé, dans les conditions d'âge propres à chacun." },
    ],
    reportName: "Ma retraite Luxembourg (CNAP)",
    reportHighlight: "Pension nette estimée",
    reportPensionBrute: "Pension brute",
    reportRetenue: "Retenue sociale",
    reportCarriere: "Années de carrière",
    reportTaux: "Taux de remplacement",
  },
  en: {
    docTitle: "Luxembourg Pension (CNAP) 2026 — cross-border & expat calculator",
    metaDesc: "Cross-border worker or expat in Luxembourg? Estimate your CNAP pension from your career, salary and retirement age, plus totalisation with your French rights. Free, no sign-up.",
    jsonLdName: "Luxembourg Pension Calculator (CNAP)",
    jsonLdDesc: "Estimate your Luxembourg general pension scheme (CNAP) based on your career length, contributed salary and retirement age.",
    badge: "CNAP scheme · Luxembourg 2026",
    title: "Luxembourg Pension Calculator",
    subtitle: "Cross-border workers · Expats · Residents",
    desc: "Estimate your Luxembourg general pension scheme (CNAP): career length, contributed salary, retirement age and family bonus.",
    situationTitle: "Your situation",
    statutLabel: "Status",
    statuts: [
      { key: "salarie", label: "Employee" },
      { key: "independant", label: "Self-employed" },
      { key: "frontalier", label: "Cross-border worker" },
    ],
    salaireLabel: "Gross annual salary (€)",
    anneesFaitesLabel: "Years already contributed",
    anneesRestantesLabel: "Estimated remaining years of contribution",
    ageDepartLabel: "Desired retirement age",
    nbEnfantsLabel: "Number of children raised",
    heroLabel: "Estimated net monthly pension",
    tauxLabel: (t) => `Replacement rate: ${t}%`,
    pensionBruteLabel: "Gross monthly pension",
    retenueLabel: "Social contribution (health insurance)",
    carriereLabel: "Total career length",
    carriereValue: (n) => `${n} years`,
    majorationLabel: (n) => `Family bonus (${n} child${n > 1 ? "ren" : ""})`,
    ageDepartValue: (a) => `${a} years old`,
    anticipeeNote: (n) => `You need ${n} more year${n > 1 ? "s" : ""} of contributions to access early retirement at 60.`,
    note: "This calculator is an estimate based on the CNAP general scheme (latest published values, 2025 point). The actual calculation takes into account your full contribution history. For a personalised projection, check your career statement on guichet.lu.",
    aboutTitle: "About retirement in Luxembourg",
    about: [
      {
        h3: "How the CNAP pension is calculated",
        p: "The Luxembourg general pension scheme (CNAP — Caisse Nationale d'Assurance Pension) combines two components: a part proportional to contributed income (1.85% of average salary per year of career, capped at 5 times the minimum social wage) and a fixed flat-rate amount independent of salary, revalued every year. A full 40-year career therefore produces one of the highest replacement rates in Europe, often close to 70–75% of the last salary.",
      },
      {
        h3: "Cross-border workers: combining your French and Luxembourg years",
        p: "If you live in France and work in Luxembourg, the EU coordination regulation (EC 883/2004) guarantees that periods contributed in both countries are combined (totalised) to determine whether you qualify for a full pension. Each scheme — CNAP in Luxembourg, CNAV and Agirc-Arrco in France — then calculates and pays its own pension, proportional only to the years contributed in that country, each at its own legal retirement age. Also simulate your French CNAV pension to get the full picture of your cross-border retirement.",
      },
      {
        h3: "Early retirement: 57 or 60 years old",
        p: "Luxembourg allows retirement before the legal age of 65 in two cases: from age 60 with at least 40 years of insurance (ordinary early retirement), or from age 57 with 40 years of actual contributions — a scheme similar to the French 'long career' provision, but accessible three years earlier.",
      },
      {
        h3: "Minimum pension and family bonus",
        p: "Insured people with at least 40 years of career benefit from a guaranteed minimum pension, regardless of their contributed salary — a safety net that particularly benefits lower-income careers. A 5% bonus per child raised (up to 3 children) is also added to the calculated pension.",
      },
    ],
    faqTitle: "Frequently asked questions — Luxembourg pension",
    faq: [
      { q: "How does retirement work in Luxembourg (CNAP)?", a: "The Luxembourg general scheme (CNAP — Caisse Nationale d'Assurance Pension) is a pay-as-you-go scheme. The pension is calculated based on years of contribution and average income. Its replacement rate is one of the highest in Europe: around 73% of the last salary on average for a full 40-year career." },
      { q: "What is the legal retirement age in Luxembourg?", a: "The legal age is 65 for a normal pension. You can retire at 60 with at least 40 years of insurance (ordinary early retirement), or at 57 with 40 years of actual contributions (early retirement for long careers). No age reform is currently planned." },
      { q: "How is the Luxembourg pension calculated?", a: "The pension is proportional to contributed income and career length: roughly 1.85% of average monthly income per year of contribution, plus an additional flat-rate amount per year. A minimum pension is guaranteed for those with at least 40 years of contributions." },
      { q: "Are French cross-border workers entitled to a Luxembourg pension?", a: "Yes. Cross-border workers who contributed in Luxembourg are entitled to a CNAP pension proportional to their Luxembourg contribution years. The pension is then paid to France, but generally remains subject to Luxembourg tax under most tax treaties." },
      { q: "Can I combine a Luxembourg pension and a French pension?", a: "Yes, EU regulation (EC 883/2004) coordinates the schemes. Each country calculates a 'national' pension proportional to the years contributed there. You will receive a pension from each scheme you contributed to, under that scheme's own age conditions." },
    ],
    reportName: "My Luxembourg pension (CNAP)",
    reportHighlight: "Estimated net pension",
    reportPensionBrute: "Gross pension",
    reportRetenue: "Social contribution",
    reportCarriere: "Years of career",
    reportTaux: "Replacement rate",
  },
};

export default function RetraiteLU() {
  const [theme, setTheme] = useTheme();
  const { locale } = useTranslation();
  const txt = TXT[locale] ?? TXT.fr;

  usePageMeta(txt.docTitle, txt.metaDesc);

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'retraite-luxembourg' });
    if (!sessionStorage.getItem('tracked_retraite-luxembourg')) {
      sessionStorage.setItem('tracked_retraite-luxembourg', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'retraite-luxembourg' })
      }).catch(() => {});
    }
  }, [txt.docTitle, txt.metaDesc]);

  const [statut, setStatut] = useState("salarie");
  const [salaireAnnuel, setSalaireAnnuel] = useState(60000);
  const [anneesFaites, setAnneesFaites] = useState(20);
  const [anneesRestantes, setAnneesRestantes] = useState(15);
  const [ageDépart, setAgeDépart] = useState(65);
  const [nbEnfants, setNbEnfants] = useState(0);

  const anneesTotal = anneesFaites + anneesRestantes;
  const result = useMemo(() => calcLU({ salaireAnnuel, anneesTotal, ageDépart, nbEnfants }), [salaireAnnuel, anneesTotal, ageDépart, nbEnfants]);

  const eur = n => Math.round(n).toLocaleString(locale === 'en' ? "en-US" : "fr-FR") + " €";

  const REPORT_PARAMS = result ? {
    name: txt.reportName,
    cat: "Retraite",
    highlight: { label: txt.reportHighlight, value: eur(result.pensionNette) },
    sections: [
      { title: txt.reportPensionBrute, value: eur(result.pensionBrute) },
      { title: txt.reportRetenue, value: eur(result.retenueAcc) },
      { title: txt.reportCarriere, value: txt.carriereValue(anneesTotal) },
      { title: txt.reportTaux, value: `${Math.round(result.txRemplacement)} %` },
    ],
  } : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": txt.jsonLdName,
        "url": locale === 'en' ? "https://www.simfinly.com/en/simulators/luxembourg-pension" : "https://www.simfinly.com/simulateurs/retraite-luxembourg",
        "description": txt.jsonLdDesc,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": locale === 'en' ? 'en-US' : 'fr-FR',
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": txt.faq.map(f => ({
          "@type": "Question", "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }} />
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 80px" }}>
        <SimulateurHeader
          icon="🇱🇺"
          badge={txt.badge}
          title={txt.title}
          subtitle={txt.subtitle}
          desc={txt.desc}
        />

        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", marginTop: 24 }}>
          {/* Saisie */}
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, border: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>{txt.situationTitle}</h2>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>{txt.statutLabel}</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {txt.statuts.map(s => <Chip key={s.key} label={s.label} active={statut === s.key} onClick={() => setStatut(s.key)} />)}
              </div>
            </div>

            <NumInput label={txt.salaireLabel} value={salaireAnnuel} onChange={setSalaireAnnuel} min={10000} max={300000} step={1000} />
            <NumInput label={txt.anneesFaitesLabel} value={anneesFaites} onChange={setAnneesFaites} min={0} max={50} step={1} />
            <NumInput label={txt.anneesRestantesLabel} value={anneesRestantes} onChange={setAnneesRestantes} min={0} max={50} step={1} />
            <StepperInput label={txt.ageDepartLabel} value={ageDépart} onChange={setAgeDépart} min={57} max={70} />
            <StepperInput label={txt.nbEnfantsLabel} value={nbEnfants} onChange={setNbEnfants} min={0} max={10} />
          </div>

          {/* Résultats */}
          {result && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>{txt.heroLabel}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 38, fontWeight: 700, color: "var(--primary)", lineHeight: 1 }}>
                  {eur(result.pensionNette)}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
                  {txt.tauxLabel(Math.round(result.txRemplacement))}
                </div>
              </div>

              {[
                { label: txt.pensionBruteLabel, value: eur(result.pensionBrute) },
                { label: txt.retenueLabel, value: `− ${eur(result.retenueAcc)}` },
                { label: txt.carriereLabel, value: txt.carriereValue(anneesTotal) },
                ...(result.enfantsEligibles > 0 ? [{ label: txt.majorationLabel(result.enfantsEligibles), value: `+ ${eur(result.majorationFamille)}` }] : []),
                { label: txt.ageDepartLabel, value: txt.ageDepartValue(ageDépart) },
              ].map((s, i) => (
                <div key={i} style={{ background: "var(--card)", borderRadius: 12, padding: "14px 20px", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.label}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "var(--text)" }}>{s.value}</span>
                </div>
              ))}

              {result.manqPourAnticiee > 0 && (
                <div style={{ padding: "14px 18px", background: "rgba(184,147,74,0.08)", border: "1px solid rgba(184,147,74,0.2)", borderRadius: 12, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {txt.anticipeeNote(result.manqPourAnticiee)}
                </div>
              )}
            </div>
          )}
        </div>

        {REPORT_PARAMS && <ShareBar params={{ salaireAnnuel, anneesFaites, anneesRestantes, ageDépart, nbEnfants }} resultsRef={null} name={REPORT_PARAMS.name} report={REPORT_PARAMS} />}

        <div style={{ marginTop: 24, padding: "16px 20px", background: "rgba(184,147,74,0.07)", border: "1px solid rgba(184,147,74,0.2)", borderRadius: 12, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          <strong>{locale === 'en' ? "Note:" : "Note :"}</strong> {txt.note}
        </div>

        {/* À propos */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>{txt.aboutTitle}</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            {txt.about.map((section, i) => (
              <div key={i}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: i === 0 ? 0 : 20, marginBottom: 10 }}>{section.h3}</h3>
                <p style={{ marginBottom: i === txt.about.length - 1 ? 0 : 16 }}>{section.p}</p>
              </div>
            ))}
          </div>
        </div>

        <SimRecommendations items={RECOMMENDATIONS['/simulateurs/retraite-luxembourg']} />

        <FaqSection title={txt.faqTitle} items={txt.faq} />
      </main>
      <Footer />
    </div>
  );
}
