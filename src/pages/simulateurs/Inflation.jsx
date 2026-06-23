import { useState, useEffect, useMemo } from "react";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import SimRecommendations from "../../components/SimRecommendations.jsx";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { readShareParams } from "../../hooks/useShareableUrl.js";
import JsonLd from "../../components/JsonLd.jsx";
import { NumInput, StepperInput, Chip, fmtEur, SimulateurHeader, FaqSection } from "../../components/ui.jsx";

const FAQ = [
  {
    q: "Qu'est-ce que l'inflation par catégorie ?",
    a: "L'inflation n'est pas uniforme : l'alimentation, l'énergie et les services de santé augmentent souvent plus vite que la moyenne. L'INSEE mesure l'Indice des Prix à la Consommation (IPC) en pondérant chaque catégorie selon son poids dans le budget des ménages français.",
  },
  {
    q: "Comment se calcule le taux d'inflation moyen pondéré ?",
    a: "Chaque catégorie est pondérée par sa part dans votre budget. Si l'alimentation représente 25 % de vos dépenses et son inflation est de 4 %, sa contribution au taux moyen est de 0,25 × 4 % = 1 %. Le taux moyen est la somme de ces contributions.",
  },
  {
    q: "Quel taux d'inflation utiliser pour ses projections ?",
    a: "La Banque Centrale Européenne (BCE) vise une inflation de 2 % à moyen terme. Mais selon votre mode de vie, votre inflation personnelle peut être plus élevée : les ménages à faibles revenus subissent souvent une inflation plus forte car ils consacrent une plus grande part à l'alimentation et à l'énergie.",
  },
  {
    q: "Comment protéger son épargne de l'inflation ?",
    a: "L'investissement en actions sur le long terme (ETF monde, par exemple) a historiquement produit des rendements supérieurs à l'inflation. L'immobilier offre aussi une protection naturelle. Les fonds euros d'assurance-vie ou le Livret A protègent partiellement selon les taux en vigueur.",
  },
];

// Inflation historique France (source INSEE)
const INFLATION_HISTORY = [
  { year: 2019, rate: 1.1 }, { year: 2020, rate: 0.5 }, { year: 2021, rate: 1.6 },
  { year: 2022, rate: 5.2 }, { year: 2023, rate: 4.9 }, { year: 2024, rate: 2.1 },
  { year: 2025, rate: 0.9 },
];

// Catégories de dépenses avec inflation spécifique par catégorie
const CATEGORIES = [
  { key: "alimentaire",   label: "Alimentation",        icon: "🛒", defaultShare: 22, defaultRate: 3.5 },
  { key: "logement",      label: "Logement & énergie",  icon: "🏠", defaultShare: 28, defaultRate: 4.2 },
  { key: "transport",     label: "Transport",            icon: "🚗", defaultShare: 14, defaultRate: 3.0 },
  { key: "sante",         label: "Santé",                icon: "💊", defaultShare: 8,  defaultRate: 2.8 },
  { key: "loisirs",       label: "Loisirs & culture",   icon: "🎭", defaultShare: 9,  defaultRate: 2.2 },
  { key: "autre",         label: "Autres dépenses",     icon: "📦", defaultShare: 19, defaultRate: 2.5 },
];

function calcInflation({ budget, horizon, rates }) {
  // Compute weighted average inflation
  const totalShare = CATEGORIES.reduce((s, c) => s + (rates[c.key]?.share ?? c.defaultShare), 0);
  const avgRate = CATEGORIES.reduce((s, c) => {
    const share = (rates[c.key]?.share ?? c.defaultShare) / totalShare;
    const rate  = (rates[c.key]?.rate  ?? c.defaultRate)  / 100;
    return s + share * rate;
  }, 0);

  const years = [];
  for (let y = 0; y <= horizon; y++) {
    const factor = Math.pow(1 + avgRate, y);
    years.push({
      year: y,
      budgetNeeded: budget * factor,
      powerLoss: budget * (1 - 1 / factor),
    });
  }

  const finalFactor = Math.pow(1 + avgRate, horizon);
  return {
    avgRate: avgRate * 100,
    budgetNeeded: budget * finalFactor,
    powerLoss: budget * (1 - 1 / finalFactor),
    cumulativePct: (finalFactor - 1) * 100,
    years,
  };
}

export default function Inflation() {
  const [theme, setTheme] = useTheme();
  usePageMeta(
    "Simulateur d'inflation personnalisé — pouvoir d'achat 2026",
    "Mesurez l'érosion de votre pouvoir d'achat selon vos habitudes de consommation. Personnalisez le taux d'inflation par catégorie (alimentation, logement, santé…) et visualisez l'impact sur votre budget."
  );

  const [budget, setBudget]   = useState(3000);
  const [horizon, setHorizon] = useState(20);
  const [rates, setRates]     = useState(() =>
    Object.fromEntries(CATEGORIES.map(c => [c.key, { share: c.defaultShare, rate: c.defaultRate }]))
  );

  useEffect(() => {
    const p = readShareParams();
    if (p.budget)  setBudget(Number(p.budget));
    if (p.horizon) setHorizon(Number(p.horizon));
  }, []);

  const result = useMemo(() => calcInflation({ budget, horizon, rates }), [budget, horizon, rates]);

  const setRate  = (key, val) => setRates(r => ({ ...r, [key]: { ...r[key], rate:  Number(val) } }));
  const setShare = (key, val) => setRates(r => ({ ...r, [key]: { ...r[key], share: Number(val) } }));

  const fmt = n => Math.abs(n).toLocaleString("fr-FR", { maximumFractionDigits: 0 });

  const lossColor = result.cumulativePct > 50 ? "#ef4444" : result.cumulativePct > 25 ? "var(--gold)" : "#22c55e";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur d'Inflation Personnelle 2026",
        "url": "https://www.simfinly.com/simulateurs/inflation",
        "description": "Calculez l'impact de l'inflation sur votre budget par catégorie de dépenses : alimentation, logement, transport, santé. Projection du pouvoir d'achat sur 1 à 30 ans.",
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

      <main id="main-content" style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 80px" }}>
        <SimulateurHeader
          icon="📈"
          title="Inflation & pouvoir d'achat personnalisé"
          desc="Estimez comment l'inflation érode votre budget mensuel sur le long terme, catégorie par catégorie, selon votre profil de consommation."
          category="Finances"
        />

        {/* ── Inputs ── */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "28px 24px", marginBottom: 20 }}>
          <NumInput label="Budget mensuel actuel" value={budget} onChange={setBudget} unit="€" min={500} max={20000} id="budget-inflation" />
          <StepperInput label="Horizon de projection" value={horizon} onChange={setHorizon} min={1} max={40} step={1} unit=" ans" />

          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Inflation par catégorie
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CATEGORIES.map(c => (
                <div key={c.key} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <span style={{ fontSize: 18 }}>{c.icon}</span>
                    <span style={{ color: "var(--text)" }}>{c.label}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-secondary)", marginBottom: 3 }}>Part du budget</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <input type="number" min={0} max={100} step={1}
                        value={rates[c.key]?.share ?? c.defaultShare}
                        onChange={e => setShare(c.key, e.target.value)}
                        style={{ width: 52, padding: "4px 6px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontFamily: "inherit", fontSize: 13, textAlign: "right" }}
                      />
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>%</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--text-secondary)", marginBottom: 3 }}>Inflation /an</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <input type="number" min={0} max={20} step={0.1}
                        value={rates[c.key]?.rate ?? c.defaultRate}
                        onChange={e => setRate(c.key, e.target.value)}
                        style={{ width: 52, padding: "4px 6px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontFamily: "inherit", fontSize: 13, textAlign: "right" }}
                      />
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Résultats ── */}
        {budget > 0 && (
          <div style={{ marginBottom: 20 }}>
            {/* Headline */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "22px 22px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", marginBottom: 6 }}>
                Budget nécessaire dans {horizon} ans pour le même niveau de vie
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px,6vw,40px)", fontWeight: 700, color: lossColor }}>
                {fmtEur(Math.round(result.budgetNeeded))}/mois
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
                soit <strong style={{ color: lossColor }}>+{fmt(result.budgetNeeded - budget)} €/mois</strong> de plus qu'aujourd'hui — taux d'inflation moyen pondéré : {result.avgRate.toFixed(2)} %/an
              </div>
            </div>

            {/* Chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
              <Chip label={`Inflation cumulée sur ${horizon} ans`} value={`+${result.cumulativePct.toFixed(1)} %`} accent />
              <Chip label="Perte de pouvoir d'achat" value={fmtEur(Math.round(result.powerLoss)) + "/mois"} />
            </div>

            {/* Barre de progression des catégories */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 14 }}>
                Impact par catégorie
              </div>
              {CATEGORIES.map(c => {
                const share  = (rates[c.key]?.share ?? c.defaultShare) / 100;
                const rate   = (rates[c.key]?.rate  ?? c.defaultRate)  / 100;
                const catBudget = budget * share;
                const catFinal  = catBudget * Math.pow(1 + rate, horizon);
                const catLoss   = catFinal - catBudget;
                const pct = (rate * 100);
                const barColor = pct > 4 ? "#ef4444" : pct > 2.5 ? "var(--gold)" : "#22c55e";
                return (
                  <div key={c.key} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: "var(--text-secondary)" }}>{c.icon} {c.label}</span>
                      <span style={{ fontWeight: 700, color: barColor }}>+{fmtEur(Math.round(catLoss))}/mois dans {horizon} ans</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: "var(--surface, rgba(0,0,0,0.06))", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 4, background: barColor, width: `${Math.min(100, pct / 8 * 100)}%`, transition: "width 0.4s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Référence historique */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 20px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: 12 }}>
                Inflation France (source : INSEE)
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {INFLATION_HISTORY.map(({ year, rate }) => (
                  <div key={year} style={{ textAlign: "center", padding: "6px 10px", borderRadius: 8, background: rate > 3 ? "rgba(239,68,68,0.1)" : rate > 1.5 ? "rgba(184,147,74,0.1)" : "rgba(34,197,94,0.1)", border: `1px solid ${rate > 3 ? "rgba(239,68,68,0.3)" : rate > 1.5 ? "rgba(184,147,74,0.3)" : "rgba(34,197,94,0.3)"}` }}>
                    <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>{year}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: rate > 3 ? "#ef4444" : rate > 1.5 ? "var(--gold)" : "#22c55e" }}>{rate} %</div>
                  </div>
                ))}
              </div>
            </div>

            <ShareBar
              params={{ budget, horizon }}
              report={{
                highlight: { label: `Budget mensuel dans ${horizon} ans`, value: `${fmtEur(Math.round(result.budgetNeeded))}/mois` },
                results: [
                  { label: "Budget actuel", value: `${fmtEur(budget)}/mois` },
                  { label: `Budget dans ${horizon} ans`, value: `${fmtEur(Math.round(result.budgetNeeded))}/mois` },
                  { label: "Surcoût mensuel", value: `+${fmtEur(Math.round(result.budgetNeeded - budget))}` },
                  { label: "Inflation cumulée", value: `+${result.cumulativePct.toFixed(1)} %` },
                  { label: "Taux moyen pondéré", value: `${result.avgRate.toFixed(2)} %/an` },
                ],
              }}
              name="inflation"
            />

            <SimRecommendations
              items={[
                { icon: "📈", label: "Investissez pour battre l'inflation", description: "L'épargne placée à un taux supérieur à l'inflation préserve votre pouvoir d'achat sur le long terme.", to: "/simulateurs/epargne", cta: "Simuler →" },
                { icon: "🔥", label: "Calculez votre FIRE anti-inflation", description: "Le simulateur FIRE intègre l'inflation pour calculer le capital nécessaire à votre indépendance financière.", to: "/simulateurs/fire", cta: "Simuler FIRE →" },
                { icon: "🏦", label: "Protégez votre retraite de l'inflation", description: "La retraite Agirc-Arrco est revalorisée annuellement. Estimez votre pension pour vérifier qu'elle suit l'inflation.", to: "/simulateurs/agirc-arrco", cta: "Simuler →" },
              ]}
              title="Protéger votre pouvoir d'achat"
            />
          </div>
        )}

        <AdUnit slot="auto" format="auto" />

        <FaqSection items={FAQ} />
      </main>

      <Footer />
    </div>
  );
}
