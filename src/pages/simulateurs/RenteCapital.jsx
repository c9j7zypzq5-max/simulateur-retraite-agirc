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
import {
  NumInput, StepperInput, Chip, fmtEur, SimulateurHeader, FaqSection,
} from "../../components/ui.jsx";

const FAQ = [
  {
    q: "Quelle est la différence entre rente viagère et retrait programmé ?",
    a: "La rente viagère convertit votre capital en un revenu mensuel garanti jusqu'à votre décès, quoi qu'il arrive. Le retrait programmé conserve votre capital et vous permet de retirer une mensualité sur une durée déterminée, avec la possibilité de transmettre le capital restant à votre décès.",
  },
  {
    q: "Qu'est-ce que le taux de conversion d'une rente ?",
    a: "Le taux de conversion (ou taux de rente) est le pourcentage annuel de votre capital converti en rente. Par exemple, avec un capital de 200 000 € et un taux de 4,5 %, vous recevrez 9 000 €/an soit 750 €/mois brut. Ce taux dépend de votre âge, de votre sexe et des conditions de marché (taux techniques de l'assureur).",
  },
  {
    q: "Comment est imposée la rente viagère ?",
    a: "La rente viagère issue d'un PER est imposée comme un revenu ordinaire (barème IR). Pour une rente issue d'une assurance-vie (rente à titre onéreux), seule une fraction est imposable : 40 % entre 60 et 69 ans, 30 % à partir de 70 ans — et les prélèvements sociaux s'appliquent sur cette même fraction.",
  },
  {
    q: "À quel âge la rente devient-elle plus avantageuse ?",
    a: "Le 'point de bascule' dépend des rendements, du taux de conversion et de votre espérance de vie. En général, si vous vivez plus de 20-25 ans après le départ, la rente viagère est plus avantageuse car elle continue indéfiniment. Le retrait programmé est préférable si vous souhaitez transmettre un capital ou anticipez une durée de retraite courte.",
  },
  {
    q: "Peut-on combiner les deux approches ?",
    a: "Oui, c'est souvent recommandé : convertir une partie du capital en rente pour couvrir les dépenses incompressibles (loyer, alimentation) et garder une autre partie en retrait programmé pour les dépenses variables et la transmission. Cette approche hybride réduit le risque de survie tout en conservant une flexibilité.",
  },
];

// ─── Constants ─────────────────────────────────────────────────────────────────
// Taux de conversion rente viagère indicatifs 2026 (assurance vie en rente)
// Source : FFSA / France Assureurs. Varient selon assureur (~3,5 % à 5,5 %).
const TAUX_CONVERSION_DEFAULT = 4.5; // %

function calcRente({ capital, tauxConversion, tmi }) {
  const mensuelBrut = (capital * tauxConversion / 100) / 12;
  // Rente viagère : fiscalité selon âge de liquidation (abattement 70 % pour 70 ans+, 60 % pour 60-69 ans)
  const abattement = 0.60; // 60 % = fraction imposable 40 % (60–69 ans)
  const imposable  = mensuelBrut * (1 - abattement);
  const cotSociale = mensuelBrut * 0.172 * (1 - abattement); // prélèvements sociaux sur fraction imposable
  const ir         = imposable * (tmi / 100);
  const mensuelNet = mensuelBrut - ir - cotSociale;
  return { mensuelBrut, mensuelNet, ir, cotSociale };
}

function calcRetrait({ capital, rendement, horizon, tmi }) {
  if (capital <= 0 || horizon <= 0) return { mensuelBrut: 0, mensuelNet: 0, totalNet: 0, capitalRestant20: 0 };
  const r = rendement / 100 / 12;
  const n = horizon * 12;
  // Annuité mensuelle (formule PMT) pour épuiser le capital en n mois
  const mensuelBrut = r > 0
    ? capital * r / (1 - Math.pow(1 + r, -n))
    : capital / n;
  // Fiscalité flat tax 30 % sur les intérêts (prélèvement forfaitaire unique)
  // Approximation : proportion d'intérêts ≈ rendement / (rendement + 1/horizon)
  const propInteret = r > 0 ? 1 - (n * r) / (Math.pow(1 + r, n) - 1) : 0;
  const irMoyen     = mensuelBrut * propInteret * (tmi === 0 ? 0 : 0.30);
  const mensuelNet  = mensuelBrut - irMoyen;
  // Capital restant après 20 ans (si horizon > 20)
  const n20     = Math.min(20 * 12, n);
  let cap20 = capital;
  for (let i = 0; i < n20; i++) cap20 = cap20 * (1 + r) - mensuelBrut;
  return { mensuelBrut, mensuelNet, totalNet: mensuelNet * n, capitalRestant20: Math.max(0, cap20) };
}

export default function RenteCapital() {
  const [theme, setTheme] = useTheme();
  usePageMeta(
    "Rente viagère vs retrait programmé — simulateur 2026",
    "Comparez une rente viagère et un retrait programmé sur votre épargne retraite (PER, assurance-vie). Calculez le revenu mensuel net et le point de bascule selon votre espérance de vie."
  );

  const [capital, setCapital]           = useState(200000);
  const [tauxConversion, setTauxConv]   = useState(TAUX_CONVERSION_DEFAULT);
  const [rendement, setRendement]       = useState(3.5);
  const [horizon, setHorizon]           = useState(25);
  const [tmi, setTmi]                   = useState(11);

  useEffect(() => {
    const p = readShareParams();
    if (p.capital)        setCapital(Number(p.capital));
    if (p.tauxConversion) setTauxConv(Number(p.tauxConversion));
    if (p.rendement)      setRendement(Number(p.rendement));
    if (p.horizon)        setHorizon(Number(p.horizon));
    if (p.tmi)            setTmi(Number(p.tmi));
  }, []);

  const rente   = useMemo(() => calcRente({ capital, tauxConversion, tmi }), [capital, tauxConversion, tmi]);
  const retrait = useMemo(() => calcRetrait({ capital, rendement, horizon, tmi }), [capital, rendement, horizon, tmi]);

  // Point de bascule : nombre d'années où la rente devient plus avantageuse
  const breakEvenYears = useMemo(() => {
    if (rente.mensuelNet <= 0 || retrait.mensuelNet <= 0) return null;
    // Cumul rente vs cumul retrait (retrait s'arrête à horizon)
    for (let y = 1; y <= 50; y++) {
      const cumRente   = rente.mensuelNet * 12 * y;
      const cumRetrait = retrait.mensuelNet * 12 * Math.min(y, horizon);
      if (cumRente >= cumRetrait) return y;
    }
    return null;
  }, [rente, retrait, horizon]);

  const hasResult = capital > 0;
  const renteGagne = rente.mensuelNet >= retrait.mensuelNet;

  const fmt = n => n.toLocaleString("fr-FR", { maximumFractionDigits: 0 });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Simulateur Rente vs Capital — Retraite 2026",
        "url": "https://www.simfinly.com/simulateurs/rente-capital",
        "description": "Comparez rente viagère et retrait programmé pour vos économies retraite : mensualités nettes, point de bascule et cumul sur 20 ans selon votre situation fiscale.",
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
          icon="⚖️"
          title="Rente viagère ou retrait programmé ?"
          desc="Comparez deux stratégies de liquidation de votre épargne retraite (PER, assurance-vie) : rente viagère à vie ou retrait programmé sur une durée choisie."
          category="Retraite"
        />

        {/* ── Inputs ── */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "28px 24px", marginBottom: 20 }}>
          <NumInput label="Capital disponible" value={capital} onChange={setCapital} unit="€" min={0} max={2000000} id="capital-rente" />
          <StepperInput label="Taux de conversion rente" value={tauxConversion} onChange={setTauxConv} min={2} max={8} step={0.1} unit=" %" hint="Taux proposé par l'assureur pour convertir le capital en rente mensuelle (indicatif : 3,5 % – 5,5 %)" />
          <StepperInput label="Rendement annuel du capital" value={rendement} onChange={setRendement} min={0} max={10} step={0.5} unit=" %" hint="Pour le retrait programmé : rendement moyen annuel de l'épargne (fonds €, UC…)" />
          <StepperInput label="Horizon de retrait programmé" value={horizon} onChange={setHorizon} min={5} max={40} step={1} unit=" ans" hint="Durée sur laquelle épuiser le capital (ex. 25 ans = de 65 à 90 ans)" />
          <StepperInput label="Tranche marginale d'imposition" value={tmi} onChange={setTmi} min={0} max={45} step={11} unit=" %" hint="Votre TMI actuel, utilisé pour estimer l'imposition des revenus" />
        </div>

        {/* ── Résultats ── */}
        {hasResult && (
          <div style={{ marginBottom: 20 }}>
            {/* Comparaison côte à côte */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              {[
                {
                  label: "Rente viagère",
                  emoji: "♾️",
                  mensuelNet: rente.mensuelNet,
                  detail1: `Brut : ${fmtEur(Math.round(rente.mensuelBrut))}/mois`,
                  detail2: `Durée : à vie (garantie)`,
                  detail3: `Taux de conversion : ${tauxConversion} %`,
                  isWinner: renteGagne,
                  color: "#b8934a",
                },
                {
                  label: "Retrait programmé",
                  emoji: "📅",
                  mensuelNet: retrait.mensuelNet,
                  detail1: `Brut : ${fmtEur(Math.round(retrait.mensuelBrut))}/mois`,
                  detail2: `Durée : ${horizon} ans`,
                  detail3: retrait.capitalRestant20 > 0 ? `Capital à 20 ans : ${fmtEur(Math.round(retrait.capitalRestant20))}` : "Capital épuisé avant 20 ans",
                  isWinner: !renteGagne,
                  color: "#3b82f6",
                },
              ].map(({ label, emoji, mensuelNet, detail1, detail2, detail3, isWinner, color }) => (
                <div key={label} style={{ background: isWinner ? `${color}14` : "var(--card-bg)", border: `1px solid ${isWinner ? color : "var(--border)"}`, borderRadius: 16, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
                  {isWinner && <div style={{ position: "absolute", top: 10, right: 12, fontSize: 10, fontWeight: 700, color, letterSpacing: "0.1em", textTransform: "uppercase" }}>+ avantageux</div>}
                  <div style={{ fontSize: 11, color, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                    {emoji} {label}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(24px,5vw,32px)", fontWeight: 700, color: isWinner ? color : "var(--text)", marginBottom: 4 }}>
                    {fmtEur(Math.round(mensuelNet))}<span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-secondary)" }}>/mois net</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                    <span>{detail1}</span>
                    <span>{detail2}</span>
                    <span>{detail3}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chips indicateurs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
              <Chip label="Total retraite rente (20 ans)" value={fmtEur(Math.round(rente.mensuelNet * 12 * 20))} />
              <Chip label="Total retraite retrait (20 ans)" value={fmtEur(Math.round(retrait.mensuelNet * 12 * Math.min(20, horizon)))} />
              {breakEvenYears && <Chip label="Point de bascule" value={`${breakEvenYears} ans`} accent />}
            </div>

            {/* Point de bascule explication */}
            {breakEvenYears && (
              <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px", marginBottom: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Point de bascule : {breakEvenYears} ans</div>
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  La rente viagère devient plus avantageuse que le retrait programmé à partir de{" "}
                  <strong style={{ color: "var(--text)" }}>{breakEvenYears} ans de retraite</strong>.
                  Si vous vivez au-delà de ce point, la rente viagère vous aura procuré plus de revenus cumulés.
                  {breakEvenYears <= horizon
                    ? " Dans votre scénario, vous atteignez ce point avant la fin du retrait programmé."
                    : ` Ce point est après l'horizon de ${horizon} ans du retrait programmé — la rente viagère n'est avantageuse qu'en cas de très grande longévité.`}
                </p>
              </div>
            )}

            {/* Barre comparative cumulatif sur 20 ans */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 12 }}>
                Revenus cumulés sur 20 ans
              </div>
              {[
                { label: "Rente viagère", value: rente.mensuelNet * 12 * 20, color: "#b8934a" },
                { label: `Retrait programmé (${Math.min(20, horizon)} ans)`, value: retrait.mensuelNet * 12 * Math.min(20, horizon), color: "#3b82f6" },
              ].map(({ label, value, color }) => {
                const maxVal = Math.max(rente.mensuelNet * 12 * 20, retrait.mensuelNet * 12 * Math.min(20, horizon), 1);
                return (
                  <div key={label} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                      <span style={{ fontWeight: 700, color }}>{fmtEur(Math.round(value))}</span>
                    </div>
                    <div style={{ height: 10, borderRadius: 5, background: "var(--surface, rgba(0,0,0,0.06))", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 5, background: color, width: `${(value / maxVal) * 100}%`, transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <ShareBar
              params={{ capital, tauxConversion, rendement, horizon, tmi }}
              report={{
                highlight: { label: renteGagne ? "Rente mensuelle nette" : "Retrait mensuel net", value: fmtEur(Math.round(renteGagne ? rente.mensuelNet : retrait.mensuelNet)) + "/mois" },
                results: [
                  { label: "Rente viagère nette", value: `${fmtEur(Math.round(rente.mensuelNet))}/mois` },
                  { label: "Retrait programmé net", value: `${fmtEur(Math.round(retrait.mensuelNet))}/mois` },
                  ...(breakEvenYears ? [{ label: "Point de bascule", value: `${breakEvenYears} ans` }] : []),
                  { label: "Capital initial", value: fmtEur(capital) },
                ],
              }}
              name="rente-capital"
            />

            <SimRecommendations
              items={[
                { icon: "🏦", label: "Simulez la défiscalisation PER", description: "Le PER permet de constituer ce capital tout en réduisant votre impôt sur le revenu chaque année.", to: "/simulateurs/per", cta: "Simuler le PER →" },
                { icon: "📈", label: "Simulez votre assurance-vie", description: "L'assurance-vie est souvent le support de ce capital. Estimez sa croissance jusqu'à votre retraite.", to: "/simulateurs/assurance-vie", cta: "Simuler →" },
                { icon: "🎯", label: "Simulez votre épargne FIRE", description: "Calculez le capital minimum pour vivre de vos intérêts selon la règle des 4 %.", to: "/simulateurs/fire", cta: "Simuler FIRE →" },
              ]}
              title="Construire ce capital"
            />
          </div>
        )}

        <AdUnit slot="auto" format="auto" />

        {/* FAQ */}
        <FaqSection items={FAQ} />
      </main>

      <Footer />
    </div>
  );
}
