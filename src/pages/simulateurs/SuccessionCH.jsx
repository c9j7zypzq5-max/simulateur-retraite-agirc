import { useState, useMemo } from "react";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { NumInput, SimulateurHeader, FaqSection, Chip } from "../../components/ui.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import { usePageMeta } from "../../hooks/usePageMeta.js";

// Droits de succession suisses simplifiés par canton
// Sources : lois cantonales 2025. Ligne directe (enfants) = exonérée dans presque tous cantons.
// Seul Vaud impose encore modestement les petits-enfants dans certains cas.
const CANTONS = {
  "GE": { name: "Genève",        exonere: ["enfants", "conjoint"], taux: { fratrie: 0.06, autre: 0.12 } },
  "VD": { name: "Vaud",          exonere: ["enfants", "conjoint"], taux: { fratrie: 0.07, autre: 0.15 } },
  "ZH": { name: "Zurich",        exonere: ["enfants", "conjoint"], taux: { fratrie: 0.06, autre: 0.10 } },
  "BE": { name: "Berne",         exonere: ["enfants", "conjoint"], taux: { fratrie: 0.065, autre: 0.12 } },
  "BS": { name: "Bâle-Ville",    exonere: ["enfants", "conjoint"], taux: { fratrie: 0.05, autre: 0.115 } },
  "LU": { name: "Lucerne",       exonere: ["enfants", "conjoint"], taux: { fratrie: 0.04, autre: 0.10 } },
  "ZG": { name: "Zoug",          exonere: ["enfants", "conjoint", "fratrie"], taux: { fratrie: 0, autre: 0.06 } },
  "AG": { name: "Argovie",       exonere: ["enfants", "conjoint"], taux: { fratrie: 0.04, autre: 0.08 } },
  "SO": { name: "Soleure",       exonere: ["enfants", "conjoint"], taux: { fratrie: 0.04, autre: 0.10 } },
  "TI": { name: "Tessin",        exonere: ["enfants", "conjoint"], taux: { fratrie: 0.06, autre: 0.14 } },
  "FR": { name: "Fribourg",      exonere: ["enfants", "conjoint"], taux: { fratrie: 0.05, autre: 0.12 } },
  "VS": { name: "Valais",        exonere: ["enfants", "conjoint"], taux: { fratrie: 0.05, autre: 0.12 } },
  "NE": { name: "Neuchâtel",     exonere: ["enfants", "conjoint"], taux: { fratrie: 0.10, autre: 0.20 } },
  "GR": { name: "Grisons",       exonere: ["enfants", "conjoint"], taux: { fratrie: 0.04, autre: 0.10 } },
  "SG": { name: "Saint-Gall",    exonere: ["enfants", "conjoint"], taux: { fratrie: 0.04, autre: 0.10 } },
};

const LIENS = [
  { key: "conjoint",  label: "Conjoint / partenaire" },
  { key: "enfants",   label: "Enfants / petits-enfants" },
  { key: "fratrie",   label: "Frères et sœurs" },
  { key: "autre",     label: "Autres (neveux, amis…)" },
];

const eur = (n) => Math.round(n).toLocaleString("fr-CH") + " CHF";
const pct = (n) => (n * 100).toFixed(1) + " %";

const FAQ_ITEMS = [
  { q: "Les enfants paient-ils des droits de succession en Suisse ?", a: "Dans la grande majorité des cantons suisses, les descendants en ligne directe (enfants, petits-enfants) sont totalement exonérés de droits de succession. Seul Appenzell Rhodes-Intérieures impose encore les enfants à un taux symbolique. Le conjoint survivant est également exonéré dans tous les cantons." },
  { q: "Est-ce que la Confédération prélève des droits de succession ?", a: "Non. En Suisse, il n'existe pas de droits de succession fédéraux. Seuls les cantons (et parfois les communes) peuvent percevoir ces taxes. Chaque canton a sa propre loi, ce qui explique les disparités importantes entre Zoug (très peu taxé) et Neuchâtel (taux plus élevés pour les tiers)." },
  { q: "Qu'est-ce que la réserve héréditaire en droit suisse ?", a: "La réserve héréditaire protège certains héritiers légaux contre une déshérison totale. En droit suisse (réforme 2023), les enfants ont droit à 50 % de leur part légale comme réserve. Le conjoint survivant bénéficie d'une réserve de 25 % de sa part légale." },
  { q: "Peut-on réduire les droits de succession par donation de son vivant ?", a: "Oui. Les donations entre vifs permettent de transmettre son patrimoine de manière anticipée. En Suisse, les règles varient selon les cantons : certains assimilent les donations récentes à la succession, d'autres les exonèrent. La planification successorale avec un notaire est recommandée pour les patrimoines importants." },
];

export default function SuccessionCH() {
  const [theme, setTheme] = useTheme();
  usePageMeta("Simulateur droits de succession Suisse 2025 — par canton et lien de parenté", "Estimez les droits de succession selon le canton suisse, le lien de parenté et l'actif net transmis. La plupart des cantons exonèrent les enfants et le conjoint.");

  const [canton, setCanton] = useState("GE");
  const [lien, setLien] = useState("enfants");
  const [actifNet, setActifNet] = useState(500000);
  const [nbHeritiers, setNbHeritiers] = useState(2);

  const result = useMemo(() => {
    const c = CANTONS[canton];
    if (!c) return null;
    const exonere = c.exonere.includes(lien);
    const taux = c.taux[lien] ?? c.taux["autre"] ?? 0;
    const partChacun = actifNet / (nbHeritiers || 1);
    const droitsChacun = exonere ? 0 : partChacun * taux;
    const droitsTotal = droitsChacun * (nbHeritiers || 1);
    const netChacun = partChacun - droitsChacun;
    return { exonere, taux, partChacun, droitsChacun, droitsTotal, netChacun, canton: c };
  }, [canton, lien, actifNet, nbHeritiers]);

  const REPORT_PARAMS = result ? {
    name: "Droits de succession Suisse",
    cat: "Impôts",
    highlight: { label: "Droits totaux estimés", value: eur(result.droitsTotal) },
    sections: [
      { title: "Canton", value: result.canton.name },
      { title: "Actif net successoral", value: eur(actifNet) },
      { title: "Part par héritier", value: eur(result.partChacun) },
      { title: "Taux appliqué", value: result.exonere ? "Exonéré" : pct(result.taux) },
      { title: "Droits par héritier", value: eur(result.droitsChacun) },
      { title: "Net reçu par héritier", value: eur(result.netChacun) },
    ],
  } : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 80px" }}>
        <SimulateurHeader
          icon="🏔"
          badge="Droits de succession · Suisse 2025"
          title="Simulateur Succession Suisse"
          subtitle="Par canton · Lien de parenté"
          desc="Estimez les droits de succession selon le canton suisse et le lien de parenté. Enfants et conjoint exonérés dans la quasi-totalité des cantons."
        />

        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", marginTop: 24 }}>
          {/* Saisie */}
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, border: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Paramètres</h2>

            {/* Canton */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>Canton</label>
              <select
                value={canton}
                onChange={e => setCanton(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 14 }}
              >
                {Object.entries(CANTONS).map(([k, v]) => (
                  <option key={k} value={k}>{v.name} ({k})</option>
                ))}
              </select>
            </div>

            {/* Lien de parenté */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Lien de parenté</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {LIENS.map(l => (
                  <Chip key={l.key} label={l.label} active={lien === l.key} onClick={() => setLien(l.key)} />
                ))}
              </div>
            </div>

            <NumInput label="Actif net successoral (CHF)" value={actifNet} onChange={setActifNet} min={0} max={100000000} step={10000} />
            <NumInput label="Nombre d'héritiers du même rang" value={nbHeritiers} onChange={setNbHeritiers} min={1} max={20} step={1} />
          </div>

          {/* Résultats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {result && (
              <>
                {result.exonere ? (
                  <div style={{ background: "#14532d22", border: "1px solid #22c55e44", borderRadius: 16, padding: 24 }}>
                    <div style={{ fontSize: 13, color: "#22c55e", fontWeight: 600, marginBottom: 4 }}>
                      Exonération totale ✓
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#22c55e" }}>0 CHF</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8 }}>
                      Le lien "{LIENS.find(l => l.key === lien)?.label}" est exonéré dans le canton de {result.canton.name}.
                    </div>
                  </div>
                ) : (
                  <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>Droits totaux estimés</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: "var(--primary)" }}>
                      {eur(result.droitsTotal)}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                      Taux : {pct(result.taux)} — Canton {result.canton.name}
                    </div>
                  </div>
                )}

                {[
                  { label: "Actif net successoral", value: eur(actifNet) },
                  { label: "Part brute par héritier", value: eur(result.partChacun) },
                  { label: "Droits par héritier", value: result.exonere ? "0 CHF" : eur(result.droitsChacun) },
                  { label: "Net reçu par héritier", value: eur(result.netChacun), accent: true },
                ].map((s, i) => (
                  <div key={i} style={{ background: "var(--card)", borderRadius: 12, padding: "14px 20px", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.label}</span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: s.accent ? "var(--primary)" : "var(--text)" }}>{s.value}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {REPORT_PARAMS && <ShareBar params={{ canton, lien, actifNet, nbHeritiers }} resultsRef={null} name={REPORT_PARAMS.name} report={REPORT_PARAMS} />}

        <div style={{ marginTop: 24, padding: "16px 20px", background: "rgba(184,147,74,0.07)", border: "1px solid rgba(184,147,74,0.2)", borderRadius: 12, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          <strong>Note :</strong> Ce simulateur fournit une estimation simplifiée basée sur des taux indicatifs 2025. Les droits réels peuvent varier selon les abattements communaux, les exonérations spécifiques et l'interprétation notariale. Consultez un notaire pour toute succession significative.
        </div>

        <FaqSection items={FAQ_ITEMS} />
      </main>
      <Footer />
    </div>
  );
}
