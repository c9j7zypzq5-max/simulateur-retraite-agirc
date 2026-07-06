import { useState, useMemo, useEffect } from "react";
import { track } from '@vercel/analytics';
import { useTheme } from "../../hooks/useTheme.js";
import { useTranslation } from "../../i18n/index.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import { NumInput, StepperInput, SimulateurHeader, FaqSection } from "../../components/ui.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import SimRecommendations from '../../components/SimRecommendations.jsx';
import { RECOMMENDATIONS } from '../../data/recommendations.js';

// ─── Paramètres RRQ 2026 (Régime de rentes du Québec) ──────────────────────
// Source : Retraite Québec (retraitequebec.gouv.qc.ca) — maximum des gains
// admissibles (MGA), rentes maximales par âge de demande et facteurs
// d'ajustement selon l'âge. Le calcul officiel réel additionne les
// « meilleurs » mois cotisés entre 18 et 65 ans (85 % des mois de la
// période, régime de base + régime supplémentaire depuis 2019) : ce
// simulateur en donne une approximation simplifiée à partir du revenu de
// carrière moyen et du nombre d'années cotisées, calée sur les montants
// maximaux officiels 2026 pour rester cohérente à ratio plein (1.0).
const MGA_2026 = 74_600; // Maximum des gains admissibles 2026 ($/an)
const RENTE_MAX_65 = 1_507.65; // Rente mensuelle maximale à 65 ans, 2026 ($)
const AGE_NORMAL = 65;
const AGE_MIN = 60;
const AGE_MAX = 70;
const DUREE_COMPLETE = 40; // approximation d'une carrière cotisée complète
const REDUCTION_MENSUELLE = 0.006; // -0,6 %/mois avant 65 ans
const MAJORATION_MENSUELLE = 0.007; // +0,7 %/mois après 65 ans

function calcQC({ revenuMoyen, anneesCotisees, ageDepart }) {
  if (!revenuMoyen || !anneesCotisees) return null;

  const ratioRevenu = Math.min(revenuMoyen, MGA_2026) / MGA_2026;
  const ratioCarriere = Math.min(anneesCotisees, DUREE_COMPLETE) / DUREE_COMPLETE;
  const renteA65 = RENTE_MAX_65 * ratioRevenu * ratioCarriere;

  const moisEcart = Math.abs(ageDepart - AGE_NORMAL) * 12;
  const facteurAge = ageDepart < AGE_NORMAL
    ? 1 - REDUCTION_MENSUELLE * moisEcart
    : 1 + MAJORATION_MENSUELLE * moisEcart;

  const renteMensuelle = renteA65 * facteurAge;
  const renteAnnuelle = renteMensuelle * 12;
  const tauxRemplacement = (renteMensuelle / (revenuMoyen / 12)) * 100;

  return { renteA65, renteMensuelle, renteAnnuelle, facteurAge, tauxRemplacement, ratioRevenu, ratioCarriere };
}

// ─── Traductions ────────────────────────────────────────────────────────────
const TXT = {
  fr: {
    docTitle: "Simulateur retraite RRQ 2026 — rente du Régime de rentes du Québec",
    metaDesc: "Estimez votre rente RRQ selon votre revenu de carrière et l'âge de départ choisi (60 à 70 ans). Basé sur les paramètres 2026 de Retraite Québec.",
    jsonLdName: "Simulateur retraite RRQ (Québec)",
    jsonLdDesc: "Estimez votre rente de retraite du Régime de rentes du Québec (RRQ) selon votre revenu de carrière, vos années cotisées et l'âge de départ choisi.",
    badge: "Régime RRQ · Québec 2026",
    title: "Simulateur Retraite RRQ",
    subtitle: "Régime de rentes du Québec",
    desc: "Estimez votre rente de retraite du RRQ : revenu moyen de carrière, années cotisées et âge de départ, de 60 à 70 ans.",
    situationTitle: "Votre situation",
    revenuLabel: "Revenu de travail annuel moyen (CAD)",
    anneesCotiseesLabel: "Années de cotisation au RRQ",
    ageDepartLabel: "Âge de départ souhaité",
    heroLabel: "Rente mensuelle estimée",
    tauxLabel: (t) => `Taux de remplacement : ${t} %`,
    renteA65Label: "Rente équivalente à 65 ans",
    renteAnnuelleLabel: "Rente annuelle estimée",
    ageDepartValue: (a) => `${a} ans`,
    facteurLabel: "Ajustement selon l'âge de départ",
    facteurValue: (f) => `${f > 0 ? "+" : ""}${f} %`,
    note: "Ce simulateur est une estimation simplifiée à partir du revenu moyen de carrière et calée sur les montants maximaux publiés par Retraite Québec pour 2026. Le calcul officiel réel se base sur l'historique complet des gains cotisés (meilleurs mois entre 18 et 65 ans, régime de base et régime supplémentaire). Pour une projection personnalisée, consultez votre relevé de participation sur Mon dossier RRQ (retraitequebec.gouv.qc.ca).",
    aboutTitle: "À propos de la retraite RRQ au Québec",
    about: [
      {
        h3: "Le calcul de la rente RRQ",
        p: "La rente de retraite du Régime de rentes du Québec est calculée à partir du revenu de travail cotisé, plafonné chaque année au maximum des gains admissibles (MGA — 74 600 $ en 2026). Depuis 2019, le régime de base (taux de remplacement historique d'environ 25 %) est progressivement bonifié par un régime supplémentaire, qui portera le taux de remplacement effectif à un peu plus de 33 % du revenu cotisé pour les années de gains couvertes par la bonification. La rente maximale à 65 ans est de 1 507,65 $ par mois en 2026.",
      },
      {
        h3: "Un départ possible de 60 à 70 ans",
        p: "La rente RRQ peut être demandée dès 60 ans ou reportée jusqu'à 70 ans. Un départ avant 65 ans réduit la rente de 0,6 % par mois d'anticipation (soit -36 % maximum à 60 ans), tandis qu'un report après 65 ans l'augmente de 0,7 % par mois (soit +42 % maximum à 70 ans). Ce choix est définitif une fois la première rente versée.",
      },
      {
        h3: "RRQ, REER et CELI : trois piliers complémentaires",
        p: "Le RRQ constitue le premier pilier public de la retraite québécoise, complété par les régimes de retraite d'employeur et l'épargne personnelle (REER, CELI). Simulez également votre épargne et votre indépendance financière pour avoir une vision complète de votre stratégie de retraite.",
      },
    ],
    faqTitle: "Questions fréquentes — Retraite RRQ Québec",
    faq: [
      { q: "Qu'est-ce que le RRQ ?", a: "Le Régime de rentes du Québec (RRQ) est le régime public de base de retraite au Québec, financé par les cotisations des travailleurs et des employeurs. Il verse une rente de retraite, mais aussi des rentes d'invalidité et de survivant. Le reste du Canada cotise à un régime équivalent, le RPC (Régime de pensions du Canada)." },
      { q: "Quel est l'âge normal pour toucher sa rente RRQ ?", a: "L'âge normal est 65 ans. Il est possible de demander sa rente dès 60 ans (avec une réduction de 0,6 % par mois d'anticipation) ou de la reporter jusqu'à 70 ans (avec une majoration de 0,7 % par mois de report)." },
      { q: "Quelle est la rente RRQ maximale en 2026 ?", a: "En 2026, la rente maximale à 65 ans est de 1 507,65 $ par mois, soit environ 964,90 $ à 60 ans et 2 140,86 $ à 70 ans. Ces montants supposent d'avoir cotisé au maximum des gains admissibles (74 600 $ en 2026) pendant la quasi-totalité de sa carrière." },
      { q: "Comment est calculée la rente RRQ ?", a: "La rente dépend du revenu de travail cotisé (plafonné au MGA chaque année) sur la carrière, ajusté selon l'inflation, puis appliqué à un taux de remplacement (environ 25 % pour le régime de base, en hausse progressive vers 33,33 % grâce au régime supplémentaire instauré en 2019 pour les nouvelles années de gains)." },
      { q: "Le RRQ suffit-il à financer sa retraite au Québec ?", a: "Non : le RRQ ne remplace qu'une partie du revenu de travail (autour de 25 à 33 % selon les années cotisées). Il est généralement complété par un régime de retraite d'employeur, un REER ou un CELI, et par la pension de la Sécurité de la vieillesse (PSV) fédérale versée dès 65 ans." },
    ],
    reportName: "Ma retraite RRQ (Québec)",
    reportHighlight: "Rente mensuelle estimée",
    reportRenteA65: "Rente équivalente à 65 ans",
    reportRenteAnnuelle: "Rente annuelle",
    reportTaux: "Taux de remplacement",
  },
  en: {
    docTitle: "QPP Retirement Calculator 2026 — Quebec Pension Plan pension",
    metaDesc: "Estimate your QPP (RRQ) retirement pension based on your career income and chosen retirement age (60 to 70). Based on Retraite Québec's 2026 parameters.",
    jsonLdName: "QPP Retirement Calculator (Quebec)",
    jsonLdDesc: "Estimate your Quebec Pension Plan (QPP/RRQ) retirement pension based on your average career income, years contributed and chosen retirement age.",
    badge: "QPP scheme · Quebec 2026",
    title: "QPP Retirement Calculator",
    subtitle: "Quebec Pension Plan (RRQ)",
    desc: "Estimate your Quebec Pension Plan (QPP) retirement pension: average career income, years contributed and retirement age, from 60 to 70.",
    situationTitle: "Your situation",
    revenuLabel: "Average annual work income (CAD)",
    anneesCotiseesLabel: "Years contributed to the QPP",
    ageDepartLabel: "Desired retirement age",
    heroLabel: "Estimated monthly pension",
    tauxLabel: (t) => `Replacement rate: ${t}%`,
    renteA65Label: "Equivalent pension at 65",
    renteAnnuelleLabel: "Estimated annual pension",
    ageDepartValue: (a) => `${a} years old`,
    facteurLabel: "Adjustment for retirement age",
    facteurValue: (f) => `${f > 0 ? "+" : ""}${f}%`,
    note: "This calculator is a simplified estimate based on average career income, calibrated on the maximum amounts published by Retraite Québec for 2026. The actual official calculation is based on your full contribution history (best months between ages 18 and 65, base plan and enhanced plan). For a personalised projection, check your statement of participation on My Retraite Québec File (retraitequebec.gouv.qc.ca).",
    aboutTitle: "About QPP retirement in Quebec",
    about: [
      {
        h3: "How the QPP pension is calculated",
        p: "The Quebec Pension Plan retirement pension is calculated from contributed work income, capped each year at the maximum pensionable earnings (MPE — $74,600 in 2026). Since 2019, the base plan (historical replacement rate of about 25%) has been gradually enhanced by a supplementary plan, which will bring the effective replacement rate to a little over 33% of contributed income for years of earnings covered by the enhancement. The maximum pension at 65 is $1,507.65 per month in 2026.",
      },
      {
        h3: "Retirement possible from age 60 to 70",
        p: "The QPP pension can be requested as early as 60 or deferred until 70. Retiring before 65 reduces the pension by 0.6% per month of anticipation (up to -36% at 60), while deferring past 65 increases it by 0.7% per month (up to +42% at 70). This choice is final once the first pension payment is made.",
      },
      {
        h3: "QPP, RRSP and TFSA: three complementary pillars",
        p: "The QPP is the first public pillar of retirement income in Quebec, complemented by employer pension plans and personal savings (RRSP, TFSA). Also try our savings and financial independence calculators to get the full picture of your retirement strategy.",
      },
    ],
    faqTitle: "Frequently asked questions — QPP retirement Quebec",
    faq: [
      { q: "What is the QPP?", a: "The Quebec Pension Plan (QPP, or RRQ in French) is Quebec's public base retirement scheme, funded by worker and employer contributions. It pays retirement pensions as well as disability and survivor benefits. The rest of Canada contributes to an equivalent scheme, the CPP (Canada Pension Plan)." },
      { q: "What is the normal age to receive a QPP pension?", a: "The normal age is 65. You can request your pension as early as 60 (with a 0.6% reduction per month of anticipation) or defer it until 70 (with a 0.7% increase per month of deferral)." },
      { q: "What is the maximum QPP pension in 2026?", a: "In 2026, the maximum pension at 65 is $1,507.65 per month, about $964.90 at 60 and $2,140.86 at 70. These amounts assume contributing at the maximum pensionable earnings ($74,600 in 2026) for nearly all of one's career." },
      { q: "How is the QPP pension calculated?", a: "The pension depends on contributed work income (capped at the MPE each year) over the career, adjusted for inflation, then applied to a replacement rate (about 25% for the base plan, gradually rising toward 33.33% thanks to the supplementary plan introduced in 2019 for new years of earnings)." },
      { q: "Is the QPP enough to fund retirement in Quebec?", a: "No: the QPP only replaces part of work income (roughly 25 to 33% depending on years contributed). It is generally complemented by an employer pension plan, an RRSP or a TFSA, and by the federal Old Age Security (OAS) pension paid from age 65." },
    ],
    reportName: "My QPP retirement (Quebec)",
    reportHighlight: "Estimated monthly pension",
    reportRenteA65: "Equivalent pension at 65",
    reportRenteAnnuelle: "Annual pension",
    reportTaux: "Replacement rate",
  },
};

export default function RetraiteQC() {
  const [theme, setTheme] = useTheme();
  const { locale } = useTranslation();
  const txt = TXT[locale] ?? TXT.fr;

  usePageMeta(txt.docTitle, txt.metaDesc);

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'retraite-quebec' });
    if (!sessionStorage.getItem('tracked_retraite-quebec')) {
      sessionStorage.setItem('tracked_retraite-quebec', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'retraite-quebec' })
      }).catch(() => {});
    }
  }, [txt.docTitle, txt.metaDesc]);

  const [revenuMoyen, setRevenuMoyen] = useState(55000);
  const [anneesCotisees, setAnneesCotisees] = useState(25);
  const [ageDepart, setAgeDepart] = useState(65);

  const result = useMemo(() => calcQC({ revenuMoyen, anneesCotisees, ageDepart }), [revenuMoyen, anneesCotisees, ageDepart]);

  const cad = n => Math.round(n).toLocaleString(locale === 'en' ? "en-CA" : "fr-CA") + " $";

  const REPORT_PARAMS = result ? {
    name: txt.reportName,
    cat: "Retraite",
    highlight: { label: txt.reportHighlight, value: cad(result.renteMensuelle) },
    sections: [
      { title: txt.reportRenteA65, value: cad(result.renteA65) },
      { title: txt.reportRenteAnnuelle, value: cad(result.renteAnnuelle) },
      { title: txt.reportTaux, value: `${Math.round(result.tauxRemplacement)} %` },
    ],
  } : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": txt.jsonLdName,
        "url": "https://www.simfinly.com/qc/simulateurs/retraite-quebec",
        "description": txt.jsonLdDesc,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CAD" },
        "inLanguage": locale === 'en' ? 'en-CA' : 'fr-CA',
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
          icon="🇨🇦"
          badge={txt.badge}
          title={txt.title}
          subtitle={txt.subtitle}
          desc={txt.desc}
        />

        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", marginTop: 24 }}>
          {/* Saisie */}
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, border: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>{txt.situationTitle}</h2>

            <NumInput label={txt.revenuLabel} value={revenuMoyen} onChange={setRevenuMoyen} min={10000} max={150000} step={1000} />
            <StepperInput label={txt.anneesCotiseesLabel} value={anneesCotisees} onChange={setAnneesCotisees} min={0} max={47} />
            <StepperInput label={txt.ageDepartLabel} value={ageDepart} onChange={setAgeDepart} min={AGE_MIN} max={AGE_MAX} />
          </div>

          {/* Résultats */}
          {result && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>{txt.heroLabel}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 38, fontWeight: 700, color: "var(--primary)", lineHeight: 1 }}>
                  {cad(result.renteMensuelle)}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
                  {txt.tauxLabel(Math.round(result.tauxRemplacement))}
                </div>
              </div>

              {[
                { label: txt.renteA65Label, value: cad(result.renteA65) },
                { label: txt.renteAnnuelleLabel, value: cad(result.renteAnnuelle) },
                { label: txt.ageDepartLabel, value: txt.ageDepartValue(ageDepart) },
                { label: txt.facteurLabel, value: txt.facteurValue(Math.round((result.facteurAge - 1) * 100)) },
              ].map((s, i) => (
                <div key={i} style={{ background: "var(--card)", borderRadius: 12, padding: "14px 20px", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.label}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "var(--text)" }}>{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {REPORT_PARAMS && <ShareBar params={{ revenuMoyen, anneesCotisees, ageDepart }} resultsRef={null} name={REPORT_PARAMS.name} report={REPORT_PARAMS} />}

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

        <SimRecommendations items={RECOMMENDATIONS['/simulateurs/retraite-quebec']} />

        <FaqSection title={txt.faqTitle} items={txt.faq} />
      </main>
      <Footer />
    </div>
  );
}
