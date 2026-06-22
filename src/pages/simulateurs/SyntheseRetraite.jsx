import { useState, useEffect, useRef, useMemo } from "react";
import { PS_RETRAITE } from "../../config/constants.js";
import SimIcon from "../../data/simIcons.jsx";
import { track } from '@vercel/analytics';
import { Link } from "../../lib/router.jsx";
import BarChart from "../../components/charts/BarChart.jsx";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import Footer from "../../components/Footer.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import {
  NumInput, AccordionSection, Chip, useAnimatedNumber,
  fmtEur, SimulateurHeader, FaqSection,
  FaqItem,
} from "../../components/ui.jsx";
import ShareBar from "../../components/ShareBar.jsx";
import AffiliateCTA from "../../components/AffiliateCTA.jsx";
import { readShareParams, buildShareUrl } from "../../hooks/useShareableUrl.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

// ─── Régimes de retraite agrégés ──────────────────────────────────────────────
// Chaque ligne renvoie vers le simulateur dédié pour chiffrer la pension brute.
const REGIMES = [
  { key: "cnav",     label: "CNAV — Régime général",  sub: "Salariés du privé",            path: "/simulateurs/cnav" },
  { key: "agirc",    label: "Agirc-Arrco",            sub: "Complémentaire des salariés",   path: "/simulateurs/agirc-arrco" },
  { key: "fpub",     label: "Fonction publique",      sub: "État, territorial, hospitalier", path: "/simulateurs/fonction-publique" },
  { key: "indep",    label: "Indépendants (SSI/RCI)", sub: "Artisans, commerçants",          path: "/simulateurs/independants" },
  { key: "ircantec", label: "IRCANTEC",               sub: "Contractuels du public",         path: "/simulateurs/ircantec" },
  { key: "msa",      label: "MSA",                    sub: "Exploitants & salariés agricoles", path: "/simulateurs/msa" },
  { key: "cipav",    label: "CIPAV",                  sub: "Professions libérales",          path: "/simulateurs/cnavpl" },
];

// Prélèvements sociaux retraités (CSG 8,3 + CRDS 0,5 + CASA 0,3 + maladie 1,0).
// Estimation : le taux exact dépend du revenu fiscal de référence.

const FAQ = [
  { q: "Comment fonctionne la synthèse tous régimes ?", a: "La plupart des actifs cotisent à plusieurs régimes : le régime de base (CNAV pour les salariés, RSI/SSI pour les indépendants, CNRACL pour les fonctionnaires) + un régime complémentaire (Agirc-Arrco pour les salariés du privé, IRCANTEC pour les contractuels publics). La synthèse additionne les pensions estimées de chaque régime pour obtenir la pension totale." },
  { q: "Quelle est la pension moyenne en France ?", a: "En 2024, la pension moyenne tous régimes confondus s'élève à environ 1 530 € bruts par mois (1 680 € pour les hommes, 1 390 € pour les femmes). Ces montants incluent les régimes de base et complémentaires. Le montant net perçu est en général 15-20 % inférieur (CSG, CRDS, mutuelle)." },
  { q: "Peut-on recevoir une pension de plusieurs régimes simultanément ?", a: "Oui, absolument. Une carrière mixte (salarié privé puis fonctionnaire, ou salarié puis indépendant) donne lieu à des pensions provenant de chaque régime au prorata de la carrière cotisée dans chacun. Il faut liquider chaque régime séparément et ils versent leurs pensions indépendamment." },
  { q: "Comment est calculée la pension de réversion ?", a: "La pension de réversion du régime général (CNAV) correspond à 54 % de la retraite du défunt, sous condition de ressources (plafond 2025 : 24 232 €/an pour une personne seule). La réversion Agirc-Arrco est de 60 % des points du défunt, sans condition de ressources." },
  { q: "Qu'est-ce que le minimum contributif ?", a: "Le minimum contributif (MICO) garantit une pension de base CNAV minimale pour ceux qui ont cotisé toute leur carrière avec de faibles salaires. En 2025, il s'élève à 876,91 € par mois pour une carrière complète au taux plein (majoré à 963,31 € si 120 trimestres cotisés avec revenus > 0,5 SMIC)." },
  { q: "La retraite est-elle imposable ?", a: "Oui, les pensions de retraite sont soumises à l'impôt sur le revenu, après abattement de 10 % (plafonné à 4 123 € par foyer en 2025). Elles supportent également la CSG à 8,3 % (avec possibilité de taux réduit à 3,8 % ou exonération selon les revenus) et la CRDS à 0,5 %." },
];

export default function SyntheseRetraite() {
  const [theme, setTheme] = useTheme();

  const [vals, setVals] = useState({});
  const [salaire, setSalaire] = useState(null);
  const [salaireFromWizard, setSalaireFromWizard] = useState(false);
  const setVal = (k, v) => setVals(s => ({ ...s, [k]: v }));

  const resultsRef = useRef(null);

  usePageMeta("Synthèse retraite tous régimes — pension totale (polypensionné) | simfinly.com", "Additionnez vos pensions de tous vos régimes de retraite (CNAV, Agirc-Arrco, fonction publique, indépendants, IRCANTEC, MSA, CIPAV) pour estimer votre retraite totale brute et nette.");

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com' + window.location.pathname;
    track('simulator_view', { name: 'synthese-retraite' });
    if (!sessionStorage.getItem('tracked_synthese-retraite')) {
      sessionStorage.setItem('tracked_synthese-retraite', '1');
      fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: 'synthese-retraite' }) }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    // Lire les params de partage (pattern readShareParams existant)
    const shared = readShareParams();
    if (shared) {
      const v = {};
      for (const r of REGIMES) if (shared[r.key] !== undefined) v[r.key] = shared[r.key];
      if (Object.keys(v).length) setVals(v);
      if (shared.salaire !== undefined) setSalaire(shared.salaire);
    }

    // Lire le param ?salaire= injecté depuis WizardRetraite (pré-remplissage)
    const urlParams = new URLSearchParams(window.location.search);
    const salaireParam = urlParams.get("salaire");
    if (salaireParam) {
      const val = parseFloat(salaireParam);
      if (!isNaN(val) && val > 0) {
        setSalaire(val);
        setSalaireFromWizard(true);
      }
    }
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', buildShareUrl({ ...vals, salaire }));
  }, [vals, salaire]);

  // ── Calculs ──
  const totalBrut = REGIMES.reduce((s, r) => s + (vals[r.key] ?? 0), 0);
  const totalNet = totalBrut * (1 - PS_RETRAITE);
  const totalAnnuel = totalBrut * 12;
  const tauxRemplacement = salaire > 0 ? (totalNet / salaire) * 100 : null;
  const nbRegimes = REGIMES.filter(r => (vals[r.key] ?? 0) > 0).length;
  const hasResult = totalBrut > 0;

  const SHORT_LABELS = { cnav: "CNAV", agirc: "Agirc", fpub: "Fn.pub.", indep: "Indép.", ircantec: "IRCAN.", msa: "MSA", cipav: "CIPAV" };
  const REGIME_COLORS = ["var(--primary)", "#6eb5d4", "#4ade80", "#f59e0b", "#a78bfa", "#f87171", "#34d399"];
  const regimesBars = useMemo(() => {
    if (!hasResult) return [];
    return REGIMES
      .filter(r => (vals[r.key] ?? 0) > 0)
      .map((r, i) => ({
        label: SHORT_LABELS[r.key] ?? r.key,
        segments: [{ value: vals[r.key], color: REGIME_COLORS[i % REGIME_COLORS.length] }],
      }));
  }, [vals, hasResult]);

  const netAnim = useAnimatedNumber(totalNet);

  const report = {
    title: "Synthèse retraite tous régimes",
    highlight: { label: "Pension totale brute mensuelle", value: hasResult ? fmtEur(totalBrut) : "—" },
    params: REGIMES.filter(r => (vals[r.key] ?? 0) > 0).map(r => ({ label: r.label, value: fmtEur(vals[r.key]) })),
    results: hasResult ? [
      { label: "Total brut mensuel", value: fmtEur(totalBrut), strong: true },
      { label: "Total net estimé mensuel", value: fmtEur(totalNet) },
      { label: "Total brut annuel", value: fmtEur(totalAnnuel) },
      ...(tauxRemplacement ? [{ label: "Taux de remplacement", value: `${tauxRemplacement.toFixed(0)} %` }] : []),
    ] : [],
    notes: hasResult ? [
      `Pension agrégée sur ${nbRegimes} régime${nbRegimes > 1 ? "s" : ""}.`,
      "Net estimé après prélèvements sociaux (~10,1 %), hors impôt sur le revenu.",
    ] : undefined,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Synthèse retraite tous régimes",
        "url": "https://www.simfinly.com/simulateurs/synthese-retraite",
        "description": "Additionnez vos pensions de tous vos régimes de retraite pour estimer votre retraite totale brute et nette.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": "fr-FR",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": FAQ.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
      }} />
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 16px 60px" }}>
        <SimulateurHeader
          icon={<SimIcon path="/simulateurs/synthese-retraite" size={34} />}
          badge="Retraite · Vue polypensionné"
          title="Synthèse retraite tous régimes"
          subtitle="Votre pension totale en un coup d'œil"
          desc="Additionnez les pensions de tous vos régimes pour estimer votre retraite totale. Chiffrez chaque régime avec son simulateur, puis reportez le montant ici."
        />

        {/* Réassurance */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          {["✓ 7 régimes couverts", "✓ Brut, net & annuel", "✓ Calcul 100 % local"].map((t, i) => <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span>)}
        </div>

        {/* Formulaire : une ligne par régime */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 8, fontWeight: 400 }}>Vos pensions par régime</h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>Saisissez la pension <strong>brute mensuelle</strong> de chaque régime auquel vous avez cotisé (laissez vide les autres).</p>

          {REGIMES.map(r => (
            <div key={r.key} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 2 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{r.label}</span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", marginLeft: 8 }}>{r.sub}</span>
                </div>
                <Link to={r.path} style={{ fontSize: 12, color: "var(--gold)", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>Chiffrer →</Link>
              </div>
              <NumInput id={`reg-${r.key}`} label="" value={vals[r.key] ?? null} onChange={v => setVal(r.key, v)} unit="€/mois" min={0} max={20000} />
            </div>
          ))}
        </div>

        {/* Taux de remplacement (optionnel) */}
        <AccordionSection title="Taux de remplacement (optionnel)" subtitle="Comparez votre retraite à votre dernier salaire">
          {salaireFromWizard && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.25)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 16,
              fontSize: 13, color: "#1d4ed8",
            }}>
              <span style={{ flexShrink: 0, fontSize: 16 }}>ℹ️</span>
              <span>
                <strong>Données pré-remplies depuis votre profil Wizard</strong> — le salaire mensuel brut a été injecté depuis le Wizard Retraite. Vous pouvez l'ajuster librement.
              </span>
            </div>
          )}
          <NumInput id="dernier-salaire" label="Dernier salaire net mensuel" value={salaire} onChange={v => { setSalaire(v); setSalaireFromWizard(false); }} unit="€" min={0} max={50000}
            hint={tauxRemplacement ? `Taux de remplacement : ${tauxRemplacement.toFixed(0)} % de votre dernier salaire net` : "Pour calculer le rapport pension nette / dernier salaire"}
          />
        </AccordionSection>

        {/* Résultats */}
        <div ref={resultsRef} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20, boxShadow: "var(--card-shadow)" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>Votre retraite totale estimée</h2>

          <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'Hanken Grotesk', sans-serif", marginBottom: 6 }}>Pension totale nette estimée par mois</div>
            {!hasResult ? (
              <p style={{ color: "var(--text-secondary)", fontSize: 14, padding: "16px 0" }}>Renseignez au moins un régime pour voir votre total.</p>
            ) : (
              <>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 42, color: "var(--primary)", lineHeight: 1 }}
                  aria-label={`${Math.round(totalNet)} euros nets par mois`}>
                  {netAnim.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
                  soit <strong>{fmtEur(totalBrut)}/mois brut</strong> · {fmtEur(totalAnnuel)}/an brut
                </div>
              </>
            )}
          </div>

          {hasResult && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                <Chip label="Régimes cumulés" value={`${nbRegimes}`} />
                <Chip label="Total brut/mois" value={fmtEur(totalBrut)} />
                <Chip label={tauxRemplacement ? "Taux remplacement" : "Net/an estimé"} value={tauxRemplacement ? `${tauxRemplacement.toFixed(0)} %` : fmtEur(totalNet * 12)} accent />
              </div>

              {/* Répartition par régime */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 12 }}>Répartition de votre pension brute</div>
                {REGIMES.filter(r => (vals[r.key] ?? 0) > 0).map(r => {
                  const part = totalBrut > 0 ? (vals[r.key] / totalBrut) * 100 : 0;
                  return (
                    <div key={r.key} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                        <span style={{ color: "var(--text)" }}>{r.label}</span>
                        <span style={{ color: "var(--text-secondary)" }}>{fmtEur(vals[r.key])} · {part.toFixed(0)} %</span>
                      </div>
                      <div style={{ height: 8, background: "var(--border)", borderRadius: 6, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${part}%`, background: "linear-gradient(90deg,var(--gold-mid),var(--gold))", borderRadius: 6 }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {regimesBars.length > 1 && (
                <div style={{ marginBottom: 20 }}>
                  <BarChart
                    bars={regimesBars}
                    yFmt={v => `${Math.round(v)} €`}
                    aria="Pension brute mensuelle par régime"
                  />
                </div>
              )}

              <div role="note" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "13px 16px", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 16 }}>
                ⚠️ <strong>Estimation indicative.</strong> Le total net applique un taux moyen de prélèvements sociaux (~10,1 %) et n'inclut pas l'impôt sur le revenu. Le taux exact dépend de votre revenu fiscal de référence.
                Pour l'impôt, utilisez le <Link to="/simulateurs/impot-revenu" style={{ color: "var(--gold-mid)" }}>simulateur d'impôt sur le revenu</Link>.
              </div>
            </>
          )}
        </div>

        <ShareBar params={{ ...vals, salaire }} resultsRef={resultsRef} report={report} name="synthese-retraite" />
        {hasResult && <AffiliateCTA type="retraite" />}
        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>

        {/* À propos */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Comprendre la retraite des polypensionnés</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 0, marginBottom: 10 }}>Une carrière, plusieurs régimes</h3>
            <p style={{ marginBottom: 16 }}>Rares sont les carrières linéaires. Beaucoup de Français cotisent successivement (ou simultanément) à plusieurs régimes : régime général des salariés (CNAV) et sa complémentaire Agirc-Arrco, fonction publique, régime des indépendants, IRCANTEC pour les contractuels publics, MSA pour le monde agricole, ou CIPAV pour les professions libérales. À la retraite, chacun de ces régimes verse sa propre pension : on parle de « polypensionné ».</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Additionner pour y voir clair</h3>
            <p style={{ marginBottom: 16 }}>Comme chaque régime communique séparément, il est difficile d'avoir une vision consolidée de sa future retraite. Cette synthèse comble ce manque : estimez chaque pension avec le simulateur correspondant, reportez les montants bruts ici, et obtenez votre pension totale brute, une estimation du net après prélèvements sociaux, et votre taux de remplacement par rapport à votre dernier salaire.</p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Brut, net et impôt</h3>
            <p>Les pensions sont d'abord exprimées en brut. Des prélèvements sociaux (CSG, CRDS, CASA, cotisation d'assurance maladie pour les complémentaires) s'appliquent ensuite, pour environ 10 % en moyenne — avec des taux réduits ou des exonérations pour les revenus modestes. Enfin, la pension est soumise à l'impôt sur le revenu. Pour un relevé de carrière officiel tous régimes, consultez votre compte sur <a href="https://www.info-retraite.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)" }}>info-retraite.fr</a>.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Questions fréquentes — Synthèse retraite</h2>
          {FAQ.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          <p style={{ paddingTop: 20, fontSize: 12, color: "var(--text-secondary)" }}>
            Source officielle : <a href="https://www.info-retraite.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>info-retraite.fr</a>
          </p>
        </div>

        {/* Ad */}
        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>
      </div>
      <FaqSection items={FAQ} />
      <Footer />
    </div>
  );
}

