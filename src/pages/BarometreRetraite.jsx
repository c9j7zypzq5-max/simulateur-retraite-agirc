import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useTheme } from "../hooks/useTheme.js";

const STATS = [
  { value: "1 503 €", label: "Pension brute mensuelle moyenne", sub: "tous régimes confondus, 2024", color: "var(--primary)" },
  { value: "1 312 €", label: "Pension nette mensuelle moyenne", sub: "après prélèvements sociaux", color: "var(--primary)" },
  { value: "63,5 ans", label: "Âge moyen de départ à la retraite", sub: "France, génération 1956", color: "var(--positive)" },
  { value: "74,9 %", label: "Taux de remplacement moyen", sub: "pension / dernier salaire net", color: "var(--positive)" },
  { value: "23,4 ans", label: "Durée moyenne de retraite", sub: "espérance de vie à 62 ans", color: "var(--warning)" },
  { value: "17,4 %", label: "Part des retraités sous le seuil de pauvreté", sub: "en 2022 (seuil à 60 %)", color: "var(--negative)" },
];

const BY_REGIME = [
  { regime: "Cadres du privé (Agirc-Arrco + CNAV)", median: "2 100 €", note: "brut mensuel médian" },
  { regime: "Non-cadres du privé (CNAV seul)", median: "1 150 €", note: "brut mensuel médian" },
  { regime: "Fonctionnaires (CNRACL / SRE)", median: "2 050 €", note: "brut mensuel médian" },
  { regime: "Artisans / commerçants (SSI)", median: "890 €", note: "brut mensuel médian" },
  { regime: "Professions libérales (CNAVPL)", median: "1 640 €", note: "brut mensuel médian" },
  { regime: "Agriculteurs (MSA)", median: "820 €", note: "brut mensuel médian" },
];

const PROJECTIONS = [
  {
    horizon: "2030",
    ratio: "1,7 actif pour 1 retraité",
    impact: "Pression croissante sur les cotisations, débat sur l'âge légal maintenu à 64 ans.",
  },
  {
    horizon: "2040",
    ratio: "1,5 actif pour 1 retraité",
    impact: "Le COR prévoit un déficit cumulé pouvant atteindre 150 Md€ sans réforme supplémentaire.",
  },
  {
    horizon: "2050",
    ratio: "1,3 actif pour 1 retraité",
    impact: "Les pensions pourraient perdre 15–20 % de pouvoir d'achat relatif en l'absence d'épargne complémentaire.",
  },
];

const TIPS = [
  {
    icon: "🕐",
    title: "Vérifier ses trimestres avant 50 ans",
    desc: "Consultez votre relevé de carrière sur Mon Compte Retraite. Une erreur corrigée tôt peut valoir plusieurs centaines d'euros par mois.",
    link: "/simulateurs/trimestres",
    cta: "Simuler mes trimestres",
  },
  {
    icon: "💰",
    title: "Ouvrir un PER avant 55 ans",
    desc: "Le Plan d'Épargne Retraite offre une déduction fiscale à l'entrée. Plus tôt vous commencez, plus l'effet compound joue en votre faveur.",
    link: "/simulateurs/per",
    cta: "Simuler mon PER",
  },
  {
    icon: "📈",
    title: "Calculer son taux de remplacement réel",
    desc: "La majorité des actifs surestiment leur future pension. Simulez vos droits tous régimes pour anticiper l'écart.",
    link: "/simulateurs/synthese-retraite",
    cta: "Voir ma synthèse retraite",
  },
  {
    icon: "🏠",
    title: "Intégrer l'immobilier dans la stratégie",
    desc: "Un appartement locatif remboursé avant la retraite peut compléter une pension faible. Calculez votre rendement net.",
    link: "/simulateurs/rendement-locatif",
    cta: "Simuler mon rendement",
  },
];

export default function BarometreRetraite() {
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    document.title = "Baromètre Retraite 2026 — Chiffres clés et tendances | simfinly.com";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Pension moyenne en France, taux de remplacement, âge de départ, projections démographiques : tous les chiffres clés de la retraite en 2026 et les actions concrètes pour préparer la vôtre.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = "https://www.simfinly.com/barometre-retraite";

    const dataset = {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "name": "Baromètre Retraite France 2026 — Chiffres clés",
      "description": "Statistiques de retraite en France : pensions moyennes par régime, taux de remplacement moyen, âge moyen de départ et projections démographiques jusqu'en 2050. Données agrégées issues de la DREES, du Conseil d'Orientation des Retraites (COR) et de l'INSEE.",
      "url": "https://www.simfinly.com/barometre-retraite",
      "creator": { "@type": "Organization", "name": "Simfinly", "url": "https://www.simfinly.com" },
      "license": "https://creativecommons.org/licenses/by-sa/4.0/",
      "dateModified": "2026-06",
      "keywords": ["retraite France", "pension moyenne", "taux de remplacement", "DREES", "COR", "âge départ retraite"],
      "spatialCoverage": "France",
      "temporalCoverage": "2024/2026",
    };
    document.getElementById('barometre-dataset-ld')?.remove();
    const s = document.createElement("script");
    s.id = "barometre-dataset-ld";
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(dataset);
    document.head.appendChild(s);

    return () => { document.getElementById('barometre-dataset-ld')?.remove(); };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />
      <main id="main-content" style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* Hero */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: "inline-block", fontSize: 13, fontWeight: 600, color: "var(--primary)", background: "var(--primary-soft)", padding: "5px 14px", borderRadius: 20, marginBottom: 16, letterSpacing: "0.03em" }}>
            Édition 2026
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px, 5vw, 42px)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 14 }}>
            Baromètre Retraite France
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 640 }}>
            Pension moyenne, taux de remplacement, âge de départ, projections démographiques : les chiffres essentiels pour comprendre le système et anticiper votre propre retraite.
          </p>
        </div>

        {/* Stats grid */}
        <section style={{ marginBottom: 60 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 700, marginBottom: 20, letterSpacing: "-0.01em" }}>
            Chiffres clés 2026
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 20px" }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: s.color, marginBottom: 6 }}>{s.value}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 12 }}>
            Sources : DREES (Les retraités et les retraites — édition 2024), COR (rapport annuel 2024), INSEE. Les montants sont des estimations basées sur les dernières données disponibles.
          </p>
        </section>

        {/* By regime */}
        <section style={{ marginBottom: 60 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 700, marginBottom: 20, letterSpacing: "-0.01em" }}>
            Pension médiane par régime
          </h2>
          <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            {BY_REGIME.map((r, i) => (
              <div
                key={r.regime}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 20px", borderBottom: i < BY_REGIME.length - 1 ? "1px solid var(--border)" : "none", flexWrap: "wrap" }}
              >
                <span style={{ fontSize: 14, color: "var(--text)", flex: 1, minWidth: 200 }}>{r.regime}</span>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: "var(--primary)" }}>{r.median}</span>
                  <span style={{ fontSize: 11, color: "var(--text-secondary)", marginLeft: 6 }}>{r.note}</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 10 }}>
            Source : DREES, enquête sur les retraités 2022–2024. Médianes brutes hors pension de réversion.
          </p>
        </section>

        {/* Projections */}
        <section style={{ marginBottom: 60 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em" }}>
            Projections démographiques
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.6 }}>
            Le vieillissement de la population française crée une pression structurelle sur le système par répartition.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PROJECTIONS.map(p => (
              <div key={p.horizon} style={{ display: "flex", gap: 20, background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px", alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, textAlign: "center", minWidth: 56 }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 700, color: "var(--primary)" }}>{p.horizon}</div>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{p.ratio}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{p.impact}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 10 }}>
            Source : COR (Conseil d'Orientation des Retraites), rapport annuel 2024.
          </p>
        </section>

        {/* Tips */}
        <section style={{ marginBottom: 60 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em" }}>
            4 actions concrètes pour préparer votre retraite
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
            Les statistiques montrent que la majorité des actifs découvrent le montant de leur future pension trop tard pour agir. Voici comment anticiper.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {TIPS.map(t => (
              <div key={t.title} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: "22px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 26 }}>{t.icon}</div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, margin: 0 }}>{t.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, flex: 1 }}>{t.desc}</p>
                <Link
                  to={t.link}
                  style={{ display: "inline-block", fontSize: 13, fontWeight: 600, color: "var(--primary)", textDecoration: "none", padding: "8px 0" }}
                >
                  {t.cta} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA block */}
        <div style={{ background: "var(--primary-soft)", border: "1px solid var(--border-gold)", borderRadius: 18, padding: "32px 28px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
            Et votre retraite, à combien s'élèvera-t-elle ?
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24, maxWidth: 480, margin: "0 auto 24px" }}>
            Estimez vos droits tous régimes confondus en quelques minutes. Calcul 100 % gratuit, sans inscription.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/simulateurs/synthese-retraite" style={{ display: "inline-block", padding: "12px 24px", borderRadius: 11, background: "var(--primary)", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
              Estimer ma pension →
            </Link>
            <Link to="/simulateurs/per" style={{ display: "inline-block", padding: "12px 24px", borderRadius: 11, background: "var(--card-bg)", color: "var(--text)", border: "1px solid var(--border)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
              Simuler mon PER
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
