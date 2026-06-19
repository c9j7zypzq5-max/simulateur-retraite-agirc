import { useState, useEffect, useRef } from "react";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import Terme from "../../components/Terme.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import AffiliateCTA from "../../components/AffiliateCTA.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import AdUnit from "../../components/AdUnit.jsx";
import ScenarioCompare from "../../components/ScenarioCompare.jsx";
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

// ─── Barème assurance-vie ────────────────────────────────────────────────────
// Fiscalité des rachats sur un contrat d'assurance-vie. Constantes 2025.
//
// ⚠ Valeurs INDICATIVES, isolées volontairement dans ce bloc pour être corrigées
// facilement. Ne portent que sur les gains (plus-values), jamais sur le capital
// versé. La fiscalité réelle dépend de la date des versements (avant/après 2017)
// et du montant total des primes ; les figures ci-dessous (2025/2026) supposent
// des versements postérieurs au 27/09/2017 et des primes ≤ 150 000 €.
const PS = 0.172;            // Prélèvements sociaux : 17,2 %
const PFU = 0.30;            // Prélèvement forfaitaire unique avant 8 ans (12,8 % IR + 17,2 % PS)
const PFL_APRES_8ANS = 0.075; // Prélèvement forfaitaire 7,5 % (primes ≤ 150 000 €) après 8 ans
const ABATTEMENT_SEUL = 4600;   // Abattement annuel sur les gains, personne seule
const ABATTEMENT_COUPLE = 9200; // Abattement annuel sur les gains, couple
const ABATTEMENT_SUCCESSION = 152500; // Abattement par bénéficiaire (primes avant 70 ans)

// Valeur future : versement initial capitalisé + versements mensuels (annuités).
// Compute pur (mêmes formules + fiscalité que le rendu) réutilisé par la
// comparaison de 2 scénarios. couple reste identique entre A et B.
function computeAV({ initial, mensuel, rendement, duree, couple }) {
  const vi = initial ?? 0, vm = mensuel ?? 0;
  const capital = capitalFinal(vi, vm, rendement ?? 0, duree ?? 0);
  const totalVerse = vi + vm * 12 * (duree ?? 0);
  const plusValue = Math.max(0, capital - totalVerse);
  let impot;
  if ((duree ?? 0) < 8) {
    impot = plusValue * PFU;
  } else {
    const abattement = couple ? ABATTEMENT_COUPLE : ABATTEMENT_SEUL;
    impot = Math.max(0, plusValue - abattement) * (PFL_APRES_8ANS + PS);
  }
  return { capitalNet: capital - impot, plusValue };
}

function capitalFinal(initial, mensuel, tauxPct, annees) {
  const r = tauxPct / 100;
  const versementAnnuel = mensuel * 12;
  const fvInitial = initial * Math.pow(1 + r, annees);
  let fvFlux;
  if (r === 0) fvFlux = versementAnnuel * annees;
  else fvFlux = versementAnnuel * ((Math.pow(1 + r, annees) - 1) / r);
  return fvInitial + fvFlux;
}

const sectionTitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 20 };

const FAQ = [
  {
    q: "Comment fonctionne un contrat d'assurance-vie ?",
    a: "L'assurance-vie est une enveloppe d'épargne dans laquelle vous versez librement des sommes investies sur un fonds en euros (capital garanti, rendement modéré) et/ou des unités de compte (potentiellement plus rémunératrices mais risquées). Les sommes restent disponibles : vous pouvez effectuer des rachats à tout moment. La fiscalité ne s'applique qu'aux gains, lors d'un rachat.",
  },
  {
    q: "Pourquoi le cap des 8 ans est-il décisif ?",
    a: "Après 8 ans de détention, vous bénéficiez d'un abattement annuel sur les gains rachetés de 4 600 € (personne seule) ou 9 200 € (couple soumis à imposition commune). Au-delà de l'abattement, les gains issus de primes ≤ 150 000 € sont taxés à seulement 7,5 % d'impôt (au lieu de 12,8 %), auxquels s'ajoutent les prélèvements sociaux de 17,2 %. Avant 8 ans, les gains subissent le PFU de 30 %.",
  },
  {
    q: "PFU ou barème de l'impôt sur le revenu ?",
    a: "Par défaut, les gains des contrats sont soumis au prélèvement forfaitaire unique (PFU). Mais vous pouvez opter, lors de la déclaration, pour l'imposition au barème progressif de l'impôt sur le revenu si elle vous est plus favorable (typiquement si votre TMI est de 0 % ou 11 %). Cette option est globale et s'applique à l'ensemble de vos revenus de capitaux mobiliers de l'année.",
  },
  {
    q: "Les prélèvements sociaux de 17,2 % sont-ils toujours dus ?",
    a: "Oui. Quel que soit l'âge du contrat, les prélèvements sociaux de 17,2 % s'appliquent aux gains. Sur le fonds en euros, ils sont généralement prélevés chaque année « au fil de l'eau » ; sur les unités de compte, ils sont prélevés lors du rachat ou du dénouement. L'abattement après 8 ans ne concerne que la part « impôt sur le revenu », pas les prélèvements sociaux.",
  },
  {
    q: "Quel est l'avantage successoral de l'assurance-vie ?",
    a: "L'assurance-vie est un outil de transmission privilégié. Pour les versements effectués avant vos 70 ans, chaque bénéficiaire désigné profite d'un abattement de 152 500 € sur les capitaux transmis, au-delà duquel s'applique une taxation forfaitaire. Les sommes sont transmises hors succession dans la limite de ces règles, ce qui en fait un dispositif très utilisé pour organiser sa transmission.",
  },
  {
    q: "Ce simulateur est-il officiel ?",
    a: "Non. Il s'agit d'une estimation indicative basée sur les paramètres fiscaux 2025. Le calcul suppose un rendement constant et net de frais de gestion, des versements postérieurs à 2017 et des primes inférieures à 150 000 €. La fiscalité réelle dépend de votre situation et des dates exactes de versement. Rapprochez-vous de votre assureur ou d'un conseiller.",
  },
];

// ─── Simulateur ───────────────────────────────────────────────────────────────
export default function AssuranceVie() {
  const [theme, setTheme] = useTheme();
  const isMobile = useIsMobile();

  const card = {
    background: "var(--card-bg)", border: "1px solid var(--border)",
    borderRadius: 20, padding: isMobile ? "20px 16px" : "28px 32px",
    marginBottom: 20, boxShadow: "var(--card-shadow)",
  };

  const [initial, setInitial]   = useState(null);
  const [mensuel, setMensuel]   = useState(0);
  const [rendement, setRendement] = useState(2.5);
  const [duree, setDuree]       = useState(8);
  const [couple, setCouple]     = useState(false);

  const resultsRef = useRef(null);

  usePageMeta("Simulateur Assurance-Vie 2025 — Capital, gains et fiscalité", "Projetez la croissance de votre assurance-vie et estimez la fiscalité de vos gains au rachat : avantage des 8 ans, abattement, PFU et prélèvements sociaux. Paramètres 2025.");

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'assurance-vie' });
    if (!sessionStorage.getItem('tracked_assurance-vie')) {
      sessionStorage.setItem('tracked_assurance-vie', '1');
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'assurance-vie' })
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const shared = readShareParams();
    if (shared) {
      if (shared.initial !== undefined) setInitial(shared.initial);
      if (shared.mensuel !== undefined) setMensuel(shared.mensuel);
      if (shared.rendement !== undefined) setRendement(shared.rendement);
      if (shared.duree !== undefined) setDuree(shared.duree);
      if (shared.couple !== undefined) setCouple(shared.couple);
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ initial, mensuel, rendement, duree, couple }));
  }, [initial, mensuel, rendement, duree, couple]);

  // ── Calculs ──
  const versementInitial = initial ?? 0;
  const versementMensuel = mensuel ?? 0;
  const capital = capitalFinal(versementInitial, versementMensuel, rendement, duree);
  const totalVerse = versementInitial + versementMensuel * 12 * duree;
  const plusValue = Math.max(0, capital - totalVerse);

  const apres8ans = duree >= 8;
  let impot;
  if (!apres8ans) {
    impot = plusValue * PFU;
  } else {
    const abattement = couple ? ABATTEMENT_COUPLE : ABATTEMENT_SEUL;
    const base = Math.max(0, plusValue - abattement);
    impot = base * (PFL_APRES_8ANS + PS);
  }
  const capitalNet = capital - impot;

  const hasInput = capital > 0 && totalVerse > 0;

  const animNet = useAnimatedNumber(capitalNet);
  const animPlusValue = useAnimatedNumber(plusValue);

  const report = {
    title: "Simulateur Assurance-Vie",
    highlight: { label: "Capital net à terme", value: hasInput ? fmtEur(Math.round(capitalNet)) : "—" },
    params: [
      { label: "Versement initial", value: fmtEur(versementInitial) },
      { label: "Versement mensuel", value: versementMensuel > 0 ? fmtEur(versementMensuel) : "—" },
      { label: "Rendement annuel net", value: `${rendement} %` },
      { label: "Durée de détention", value: `${duree} ans` },
      { label: "Situation fiscale", value: couple ? "Couple" : "Seul" },
    ],
    results: hasInput ? [
      { label: "Capital net après impôt", value: fmtEur(Math.round(capitalNet)), strong: true },
      { label: "Capital brut à terme", value: fmtEur(Math.round(capital)) },
      { label: "Total versé", value: fmtEur(totalVerse) },
      { label: "Plus-value (gains)", value: fmtEur(Math.round(plusValue)) },
      { label: "Impôt estimé sur les gains", value: fmtEur(Math.round(impot)) },
    ] : [],
    notes: hasInput ? [
      apres8ans
        ? `Après 8 ans : abattement de ${fmtEur(couple ? ABATTEMENT_COUPLE : ABATTEMENT_SEUL)} puis 7,5 % d'impôt + 17,2 % de prélèvements sociaux.`
        : "Avant 8 ans : gains soumis au prélèvement forfaitaire unique de 30 %.",
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur Assurance-Vie 2025",
        "url": "https://www.simfinly.com/simulateurs/assurance-vie",
        "description": "Projetez la croissance de votre assurance-vie et estimez la fiscalité de vos gains au rachat : avantage des 8 ans, abattement, PFU et prélèvements sociaux.",
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
          icon={<SimIcon path="/simulateurs/assurance-vie" size={34} />}
          badge="Finances · Simulation 2025"
          title="Simulateur Assurance-Vie"
          subtitle="Capital projeté · Fiscalité des gains"
          desc="Projetez la croissance de votre contrat et estimez l'impôt sur les gains au rachat selon l'âge du contrat (avant ou après 8 ans). Abattement, PFU et prélèvements sociaux inclus."
        />

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>

          {/* ── Colonne formulaire ── */}
          <div style={{ order: isMobile ? 2 : 1 }}>
            {/* Versements */}
            <div style={card}>
              <h2 style={sectionTitle}>Vos versements</h2>
              <NumInput label="Versement initial" value={initial} onChange={setInitial} unit="€" min={0} max={2000000} />
              <NumInput label="Versement mensuel (optionnel)" value={mensuel} onChange={setMensuel} unit="€" min={0} max={50000}
                hint={versementMensuel > 0 ? `soit ${fmtEur(versementMensuel * 12)}/an` : "Laissez à 0 si aucun versement programmé"} />
            </div>

            {/* Paramètres */}
            <div style={card}>
              <h2 style={sectionTitle}>Paramètres du contrat</h2>
              <StepperInput label="Rendement annuel net de frais de gestion" value={rendement} onChange={setRendement} min={0} max={12} step={0.1} unit="%" />
              <StepperInput label="Durée de détention" value={duree} onChange={v => setDuree(Math.round(v))} min={1} max={40} step={1} unit="ans"
                hint={apres8ans ? "≥ 8 ans : fiscalité réduite + abattement annuel" : "Avant 8 ans : gains soumis au PFU de 30 %"} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Situation fiscale</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                    Abattement après 8 ans : {fmtEur(couple ? ABATTEMENT_COUPLE : ABATTEMENT_SEUL)}
                  </div>
                </div>
                <Toggle options={["Seul", "Couple"]} checked={couple} onChange={setCouple} />
              </div>
            </div>
          </div>

          {/* ── Colonne résultats ── */}
          <div style={{ order: isMobile ? 1 : 2, minWidth: 0 }}>
            <div style={{ background: "linear-gradient(145deg, rgba(184,147,74,0.08), var(--card-bg))", border: "1px solid var(--border-gold)", borderRadius: 20, padding: "32px 28px", marginBottom: 20, textAlign: "center", boxShadow: "var(--card-shadow)" }} ref={resultsRef}>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 10 }}>
                Capital net à terme
              </div>
              {!hasInput ? (
                <p style={{ color: "var(--text-secondary)", padding: "20px 0", fontSize: 14 }}>
                  Renseignez un versement initial ou mensuel pour voir votre estimation.
                </p>
              ) : (
                <>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(44px,8vw,68px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,var(--gold),var(--gold-mid))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {fmtEur(Math.round(animNet))}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
                    après {duree} ans à {rendement} % · net d'impôt sur les gains
                  </div>
                  <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                    {apres8ans
                      ? <StatusBadge status="good" label="Fiscalité réduite (≥ 8 ans)" />
                      : <StatusBadge status="warn" label="Avant 8 ans (PFU 30 %)" />}
                  </div>
                </>
              )}

              <ShareBar
                params={{ initial, mensuel, rendement, duree, couple }}
                resultsRef={resultsRef}
                report={report}
                name="assurance-vie"
              />
            </div>

            {hasInput && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <Chip label="Total versé" value={fmtEur(totalVerse)} small />
                <Chip label="Plus-value" value={fmtEur(Math.round(animPlusValue))} accent small />
                <Chip label="Impôt estimé" value={fmtEur(Math.round(impot))} small />
                <Chip label="Capital brut" value={fmtEur(Math.round(capital))} small />
              </div>
            )}

            {hasInput && (
              <div style={card}>
                <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 }}>
                  Fiscalité appliquée aux gains
                </div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {apres8ans ? (
                    <>
                      Après 8 ans : abattement de {fmtEur(couple ? ABATTEMENT_COUPLE : ABATTEMENT_SEUL)} sur les gains, puis {Math.round(PFL_APRES_8ANS * 100 * 10) / 10} % d'impôt (primes ≤ 150 000 €) + {Math.round(PS * 1000) / 10} % de prélèvements sociaux sur la part imposable.
                    </>
                  ) : (
                    <>
                      Avant 8 ans : les gains ({fmtEur(Math.round(plusValue))}) sont soumis au prélèvement forfaitaire unique de 30 % (12,8 % d'impôt + 17,2 % de prélèvements sociaux).
                    </>
                  )}
                </div>
              </div>
            )}

            {hasInput && (
              <AccordionSection title="Détail du calcul" defaultOpen>
                {[
                  { label: "Versement initial", value: fmtEur(versementInitial) },
                  { label: "Versements mensuels cumulés", value: fmtEur(versementMensuel * 12 * duree) },
                  { label: "Total versé", value: fmtEur(totalVerse) },
                  { label: "Capital brut à terme", value: fmtEur(Math.round(capital)), accent: true },
                  { label: "Plus-value (gains)", value: fmtEur(Math.round(plusValue)) },
                  { label: apres8ans ? `Abattement (${couple ? "couple" : "seul"})` : "Abattement", value: apres8ans ? fmtEur(couple ? ABATTEMENT_COUPLE : ABATTEMENT_SEUL) : "—" },
                  { label: "Impôt estimé sur les gains", value: fmtEur(Math.round(impot)), accent: true },
                  { label: "Capital net après impôt", value: fmtEur(Math.round(capitalNet)), accent: true },
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

        {/* Comparaison de 2 scénarios */}
        {hasInput && (
          <ScenarioCompare
            name="assurance-vie"
            base={{ initial, mensuel, rendement, duree, couple }}
            compute={computeAV}
            fields={[
              { key: "initial", label: "Versement initial", unit: "€", kind: "eur", type: "num", min: 0, max: 500000 },
              { key: "mensuel", label: "Versement mensuel", unit: "€", kind: "eur", type: "num", min: 0, max: 10000 },
              { key: "rendement", label: "Rendement", unit: "%", type: "step", min: 0, max: 10, step: 0.5 },
              { key: "duree", label: "Durée", unit: "ans", type: "step", min: 1, max: 40, step: 1 },
            ]}
            metrics={[
              { label: "Capital net", get: r => r.capitalNet, fmt: n => fmtEur(Math.round(n)), higherBetter: true },
              { label: "Plus-value", get: r => r.plusValue, fmt: n => fmtEur(Math.round(n)), higherBetter: true },
            ]}
          />
        )}

        {/* Affiliation */}
        {hasInput && <AffiliateCTA type="assurance-vie" />}

        {/* AdSense mid */}
        <div style={{ margin: "24px 0" }}>
          <AdUnit slot="auto" format="auto" />
        </div>

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>À propos de l'assurance-vie</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>Une enveloppe souple et fiscalement avantageuse</h3>
            <p style={{ marginBottom: 16 }}>L'assurance-vie reste le placement préféré des Français. Elle combine souplesse (versements et rachats libres), diversité des supports (fonds en euros sécurisés, unités de compte plus dynamiques) et une fiscalité avantageuse qui se renforce avec le temps. La fiscalité ne porte que sur les gains : le capital que vous avez versé n'est jamais taxé lors d'un rachat.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>L'avantage des 8 ans</h3>
            <p style={{ marginBottom: 16 }}>Avant 8 ans, les gains rachetés sont soumis au <Terme slug="pfu">prélèvement forfaitaire unique</Terme> de 30 % (12,8 % d'impôt + 17,2 % de <Terme slug="prelevements-sociaux">prélèvements sociaux</Terme>). À partir de 8 ans de détention, vous profitez chaque année d'un <Terme slug="abattement">abattement</Terme> de 4 600 € (personne seule) ou 9 200 € (couple) sur les gains rachetés, et la part issue de primes ≤ 150 000 € n'est taxée qu'à 7,5 % d'impôt. C'est pourquoi il est conseillé de « prendre date » le plus tôt possible.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Transmission et succession</h3>
            <p>L'assurance-vie est aussi un outil de transmission. Pour les primes versées avant 70 ans, chaque bénéficiaire désigné bénéficie d'un abattement de {fmtEur(ABATTEMENT_SUCCESSION)} sur les capitaux transmis, hors succession. Cette enveloppe permet ainsi d'organiser la transmission de son patrimoine dans un cadre fiscal favorable, en désignant librement les bénéficiaires via la clause bénéficiaire.</p>
          </div>
        </div>

        {/* FAQ */}
        <FaqSection items={FAQ} />

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", opacity: 0.6, marginTop: 32 }}>
          Simulation indicative basée sur la fiscalité 2025 · Le rendement n'est pas garanti · Ne constitue pas un conseil en investissement
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
