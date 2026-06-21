import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import EmbedSnippet from "../components/EmbedSnippet.jsx";

const WIDGETS = [
  { path: "/embed/epargne", height: 520, label: "le simulateur d'épargne", title: "Épargne & intérêts composés" },
  { path: "/embed/emprunt", height: 500, label: "le simulateur d'emprunt", title: "Emprunt immobilier" },
  { path: "/embed/fire", height: 560, label: "le simulateur FIRE", title: "Indépendance financière (FIRE)" },
];

const ALL_SIMULATORS = [
  { path: "/simulateurs/epargne",              label: "Épargne & intérêts composés" },
  { path: "/simulateurs/fire",                 label: "Indépendance financière (FIRE)" },
  { path: "/simulateurs/budget",               label: "Budget 50/30/20" },
  { path: "/simulateurs/patrimoine",           label: "Patrimoine global" },
  { path: "/simulateurs/credit-conso",         label: "Crédit à la consommation" },
  { path: "/simulateurs/assurance-vie",        label: "Assurance-vie" },
  { path: "/simulateurs/emprunt-immobilier",   label: "Emprunt immobilier" },
  { path: "/simulateurs/rendement-locatif",    label: "Rendement locatif" },
  { path: "/simulateurs/ptz",                  label: "Prêt à Taux Zéro (PTZ)" },
  { path: "/simulateurs/impot-revenu",         label: "Impôt sur le revenu" },
  { path: "/simulateurs/plus-value-immobiliere", label: "Plus-value immobilière" },
  { path: "/simulateurs/salaire",              label: "Salaire Net/Brut" },
  { path: "/simulateurs/agirc-arrco",          label: "Agirc-Arrco" },
  { path: "/simulateurs/cnav",                 label: "Retraite CNAV" },
  { path: "/simulateurs/succession",           label: "Succession" },
  { path: "/simulateurs/divorce",              label: "Divorce" },
  { path: "/simulateurs/donation",             label: "Donation vs Succession" },
  { path: "/simulateurs/deficit-foncier",      label: "Déficit foncier" },
  { path: "/simulateurs/epargne-salariale",    label: "Épargne salariale (PEE/PERCO)" },
  { path: "/simulateurs/retraite-anticipee",   label: "Retraite anticipée" },
  { path: "/simulateurs/cout-en-heures",       label: "Prix en heures de vie" },
  { path: "/simulateurs/comparateur",          label: "Comparateur d'actifs" },
];

export default function Widgets() {
  const [theme, setTheme] = useTheme();
  const [selectedSim, setSelectedSim] = useState(ALL_SIMULATORS[0].path);
  const [universalCopied, setUniversalCopied] = useState(false);

  useEffect(() => {
    document.title = "Widgets gratuits à intégrer | simfinly.com";
    document.querySelector('meta[name="description"]')?.setAttribute("content",
      "Intégrez gratuitement nos simulateurs financiers (épargne, emprunt, FIRE) sur votre site ou blog via un simple code iframe.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com/widgets';
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}<span style={{ color: "var(--text)" }}>Widgets</span>
        </div>

        <div style={{ padding: "12px 0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 36 }}>🧩</span>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px,5vw,40px)", fontWeight: 600, color: "var(--text)" }}>
              Widgets à intégrer
            </h1>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7, maxWidth: 560 }}>
            Ajoutez gratuitement un simulateur interactif sur votre site, blog ou article. Copiez le code, collez-le dans votre page : c'est tout. Un lien vers simfinly.com est inclus.
          </p>
        </div>

        {/* Widget universel : génère un code iframe pour n'importe quel simulateur */}
        <section style={{ marginBottom: 48, background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 22px" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
            Widget universel — n'importe quel simulateur
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>
            Choisissez un simulateur et copiez son code d'intégration.
          </p>
          <select
            value={selectedSim}
            onChange={e => setSelectedSim(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14, fontFamily: "'Hanken Grotesk', sans-serif", marginBottom: 14 }}
          >
            {ALL_SIMULATORS.map(s => (
              <option key={s.path} value={s.path}>{s.label}</option>
            ))}
          </select>
          {(() => {
            const label = ALL_SIMULATORS.find(s => s.path === selectedSim)?.label || "";
            const code = `<iframe src="https://www.simfinly.com${selectedSim}" width="100%" height="700" style="border:1px solid #e5e7eb;border-radius:12px;max-width:720px" title="${label} — simfinly.com" loading="lazy"></iframe>`;
            return (
              <>
                <pre style={{ margin: 0, overflowX: "auto", background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "var(--text-secondary)", whiteSpace: "pre-wrap", wordBreak: "break-all", fontFamily: "ui-monospace, monospace", marginBottom: 12 }}>{code}</pre>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(code).then(() => {
                      setUniversalCopied(true);
                      setTimeout(() => setUniversalCopied(false), 2000);
                    }).catch(() => {});
                  }}
                  style={{ padding: "9px 18px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", background: universalCopied ? "rgba(34,197,94,0.12)" : "rgba(43,92,230,0.1)", color: universalCopied ? "#22c55e" : "var(--gold)", border: `1px solid ${universalCopied ? "rgba(34,197,94,0.3)" : "var(--border-gold)"}` }}
                >
                  {universalCopied ? "Copié ✓" : "Copier le code"}
                </button>
              </>
            );
          })()}
        </section>

        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>Widgets compacts (optimisés pour l'intégration)</h2>

        {WIDGETS.map(w => (
          <section key={w.path} style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>{w.title}</h2>
            <div style={{ border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 6, background: "var(--input-bg)" }}>
              <iframe src={w.path} width="100%" height={w.height} style={{ border: "none", display: "block" }} title={`Aperçu — ${w.title}`} loading="lazy" />
            </div>
            <EmbedSnippet path={w.path} height={w.height} label={w.label} />
          </section>
        ))}
      </div>

      <Footer />
    </div>
  );
}
