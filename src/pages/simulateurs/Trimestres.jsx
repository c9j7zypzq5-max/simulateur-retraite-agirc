import { useState, useMemo } from "react";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { NumInput, SimulateurHeader, FaqSection, fmtEur } from "../../components/ui.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import { usePageMeta } from "../../hooks/usePageMeta.js";
import { FAQS } from '../../data/faqs.js';
import SimRecommendations from '../../components/SimRecommendations.jsx';
import { RECOMMENDATIONS } from '../../data/recommendations.js';

// Durée d'assurance requise selon l'année de naissance (réforme 2023)
function getDureeRequise(annee) {
  if (!annee || annee <= 1960) return 167;
  if (annee === 1961) return 168;
  if (annee === 1962) return 169;
  if (annee === 1963) return 170;
  if (annee === 1964) return 171;
  return 172;
}

function getAgeLegal(annee) {
  if (!annee || annee <= 1960) return 62;
  if (annee === 1961) return 62.5;
  if (annee === 1962) return 63;
  if (annee === 1963) return 63.25;
  if (annee === 1964) return 63.5;
  return 64;
}

// Trimestres cotisés par type de période
const PERIODES = [
  { key: "salarie",    label: "Années de travail salarié",          type: "cotisé",    tauxAnnuel: 4 },
  { key: "independant",label: "Années en tant qu'indépendant",      type: "cotisé",    tauxAnnuel: 4 },
  { key: "chomage",    label: "Périodes de chômage indemnisé",       type: "assimilé",  tauxAnnuel: 4 },
  { key: "maladie",    label: "Arrêts maladie longue durée (ans)",   type: "assimilé",  tauxAnnuel: 4 },
  { key: "maternite",  label: "Congés maternité / paternité (ans)",  type: "assimilé",  tauxAnnuel: 4 },
  { key: "invalidite", label: "Invalidité (RQTH) — années",          type: "assimilé",  tauxAnnuel: 4 },
  { key: "service",    label: "Service militaire / civique (mois)",   type: "assimilé",  tauxAnnuel: 1/3 },
  { key: "education",  label: "Trimestres MDA (maternité/adoption)",  type: "assimilé",  tauxAnnuel: 1, unite: "trimestres" },
  { key: "aidant",     label: "Trimestres AVPF (aidant familial)",    type: "assimilé",  tauxAnnuel: 1, unite: "trimestres" },
];

function fmt(n) { return Math.round(n * 10) / 10; }

const FAQ_ITEMS = FAQS['/simulateurs/trimestres'];

export default function Trimestres() {
  const [theme, setTheme] = useTheme();
  usePageMeta("Simulateur trimestres retraite 2026 — durée d'assurance & taux plein", "Comptabilisez vos trimestres cotisés et assimilés (chômage, maladie, maternité, MDA) pour connaître votre durée d'assurance et l'âge de votre taux plein.");

  const [anneeNaissance, setAnneeNaissance] = useState(1970);
  const [valeurs, setValeurs] = useState({
    salarie: 20, independant: 0, chomage: 0, maladie: 0,
    maternite: 0, invalidite: 0, service: 0, education: 0, aidant: 0,
  });

  const set = (key, val) => setValeurs(v => ({ ...v, [key]: val }));

  const result = useMemo(() => {
    let cotises = 0, assimiles = 0;
    for (const p of PERIODES) {
      const v = valeurs[p.key] || 0;
      const trimestres = p.unite === "trimestres" ? v : Math.floor(v * p.tauxAnnuel);
      if (p.type === "cotisé") cotises += trimestres;
      else assimiles += trimestres;
    }
    const total = cotises + assimiles;
    const requis = getDureeRequise(anneeNaissance);
    const manquants = Math.max(0, requis - total);
    const surplus = Math.max(0, total - requis);
    const ageLegal = getAgeLegal(anneeNaissance);
    const ageActuel = new Date().getFullYear() - anneeNaissance;
    const anneesManquantes = manquants / 4;
    const ageTauxPlein = Math.max(ageLegal, ageActuel + anneesManquantes);
    const ageTauxPleinAuto = 67;
    return { cotises, assimiles, total, requis, manquants, surplus, ageLegal, ageTauxPlein: Math.min(ageTauxPlein, ageTauxPleinAuto), ageActuel };
  }, [anneeNaissance, valeurs]);

  const REPORT_PARAMS = {
    name: "Mes trimestres retraite",
    cat: "Retraite",
    highlight: { label: "Trimestres validés", value: `${result.total} / ${result.requis}` },
    sections: [
      { title: "Trimestres cotisés", value: `${result.cotises}` },
      { title: "Trimestres assimilés", value: `${result.assimiles}` },
      { title: "Durée requise", value: `${result.requis} trimestres` },
      { title: "Manquants", value: result.manquants > 0 ? `${result.manquants}` : "Durée atteinte ✓" },
      { title: "Âge taux plein estimé", value: `${fmt(result.ageTauxPlein)} ans` },
    ],
  };

  const pct = Math.min(100, Math.round((result.total / result.requis) * 100));
  const color = pct >= 100 ? "#22c55e" : pct >= 75 ? "#e8c06a" : "#ef4444";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 80px" }}>
        <SimulateurHeader
          icon="📅"
          badge="Durée d'assurance · Réforme 2023"
          title="Simulateur Trimestres Retraite"
          subtitle="Cotisés · Assimilés · Taux plein"
          desc="Comptabilisez vos trimestres cotisés et assimilés pour connaître votre durée d'assurance, les trimestres manquants et l'âge estimé du taux plein."
        />

        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", marginTop: 24 }}>
          {/* Saisie */}
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, border: "1px solid var(--border)" }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Vos périodes</h2>

            <NumInput label="Année de naissance" value={anneeNaissance} onChange={setAnneeNaissance} min={1940} max={2000} step={1} />

            <div style={{ marginTop: 20, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              {PERIODES.map(p => (
                <div key={p.key} style={{ marginBottom: 12 }}>
                  <NumInput
                    label={`${p.label}${p.unite === "trimestres" ? " (trimestres)" : " (années)"}`}
                    value={valeurs[p.key]}
                    onChange={v => set(p.key, v)}
                    min={0} max={p.unite === "trimestres" ? 40 : 50} step={p.unite === "trimestres" ? 1 : 0.5}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Résultats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Jauge */}
            <div style={{ background: "var(--card)", borderRadius: 16, padding: 24, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "var(--text-secondary)" }}>Progression</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color }}>
                  {result.total} <span style={{ fontSize: 15, opacity: 0.6 }}>/ {result.requis}</span>
                </span>
              </div>
              <div style={{ height: 10, background: "var(--border)", borderRadius: 5, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 5, transition: "width 0.4s" }} />
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>{pct} % de la durée requise ({result.requis} trimestres)</div>
            </div>

            {/* Stats */}
            {[
              { label: "Trimestres cotisés", value: result.cotises, note: "Emploi salarié ou indépendant" },
              { label: "Trimestres assimilés", value: result.assimiles, note: "Chômage, maladie, MDA…" },
              { label: result.manquants > 0 ? "Trimestres manquants" : "Trimestres en surplus", value: result.manquants > 0 ? result.manquants : result.surplus, color: result.manquants > 0 ? "#ef4444" : "#22c55e" },
              { label: "Âge légal de départ", value: `${result.ageLegal} ans` },
              { label: "Âge taux plein estimé", value: `${fmt(result.ageTauxPlein)} ans`, note: "Selon les périodes saisies" },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--card)", borderRadius: 12, padding: "16px 20px", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.label}</div>
                  {s.note && <div style={{ fontSize: 11, color: "var(--text-secondary)", opacity: 0.7 }}>{s.note}</div>}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: s.color || "var(--primary)" }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <ShareBar params={valeurs} resultsRef={null} name={REPORT_PARAMS.name} report={REPORT_PARAMS} />
        <SimRecommendations items={RECOMMENDATIONS['/simulateurs/trimestres']} />


        <FaqSection items={FAQ_ITEMS} />
      </main>
      <Footer />
    </div>
  );
}
