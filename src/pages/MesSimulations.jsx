import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useAuth } from "../hooks/useAuth.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useSimHistory } from "../hooks/useSimHistory.js";

function relativeDate(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.floor(ms / 86400000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000);
  if (d > 0) return `il y a ${d} j`;
  if (h > 0) return `il y a ${h} h`;
  if (m > 0) return `il y a ${m} min`;
  return "à l'instant";
}

// Génère l'identifiant base64 pour la page /rapport/:id à partir d'une entrée d'historique
function buildRapportId(entry) {
  try {
    return btoa(JSON.stringify(entry));
  } catch {
    return null;
  }
}

export default function MesSimulations() {
  const [theme, setTheme] = useTheme();
  const { isPro } = useAuth();
  const { getHistory, removeEntry, clearHistory } = useSimHistory();
  const [history, setHistory] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [exportingXlsx, setExportingXlsx] = useState(false);
  const [copiedId, setCopiedId] = useState(null); // id de l'entrée dont le lien vient d'être copié

  useEffect(() => {
    document.title = "Mes simulations sauvegardées | simfinly.com";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, follow');
    setHistory(getHistory());
    return () => robots && robots.setAttribute('content', 'index, follow');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleExportPdf() {
    if (!isPro || history.length === 0) return;
    setExporting(true);
    try {
      const { buildMultiReportPdf } = await import("../utils/pdfReport.js");
      await buildMultiReportPdf(history);
    } catch (e) {
      console.error("PDF export failed", e);
    } finally {
      setExporting(false);
    }
  }

  async function handleShareEntry(entry) {
    const rapportId = buildRapportId(entry);
    if (!rapportId) return;
    const url = `${window.location.origin}/rapport/${rapportId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback : ouvrir la page
      window.open(url, "_blank", "noopener");
    }
  }

  async function handleExportXlsx() {
    if (history.length === 0) return;
    setExportingXlsx(true);
    try {
      const { downloadXLSX } = await import("../utils/export.js");
      const rows = history.map(e => ({
        Simulateur: e.simulator || "",
        Nom: e.label || "",
        Date: new Date(e.savedAt).toLocaleDateString("fr-FR"),
        Lien: e.shareUrl || "",
      }));
      await downloadXLSX(
        [{ name: "Simulations", rows }],
        `simfinly-simulations-${new Date().toISOString().slice(0,10)}.xlsx`
      );
    } catch (e) {
      console.error("XLSX export failed", e);
    } finally {
      setExportingXlsx(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}<span style={{ color: "var(--text)" }}>Mes simulations</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 0 24px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 36 }}>💾</span>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px,5vw,40px)", fontWeight: 600, color: "var(--text)" }}>
              Mes simulations
            </h1>
          </div>
          {history.length > 0 && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {isPro ? (
                <button
                  onClick={handleExportPdf}
                  disabled={exporting}
                  style={{ fontSize: 13, color: exporting ? "var(--text-secondary)" : "var(--gold)", background: "none", border: "1px solid var(--border-gold)", borderRadius: 10, padding: "8px 14px", cursor: exporting ? "not-allowed" : "pointer", fontFamily: "'Hanken Grotesk', sans-serif" }}
                >
                  {exporting ? "Génération…" : "↓ PDF"}
                </button>
              ) : (
                <Link to="/pro" style={{ fontSize: 13, color: "var(--text-secondary)", background: "none", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 10, color: "var(--gold)", fontWeight: 700 }}>PRO</span> PDF
                </Link>
              )}
              <button
                onClick={handleExportXlsx}
                disabled={exportingXlsx}
                style={{ fontSize: 13, color: exportingXlsx ? "var(--text-secondary)" : "var(--text)", background: "none", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 14px", cursor: exportingXlsx ? "not-allowed" : "pointer", fontFamily: "'Hanken Grotesk', sans-serif" }}
              >
                {exportingXlsx ? "Export…" : "↓ Excel"}
              </button>
              <button
                onClick={() => { clearHistory(); setHistory([]); }}
                style={{ fontSize: 13, color: "var(--text-secondary)", background: "none", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}
              >
                Tout effacer
              </button>
            </div>
          )}
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          Vos simulations sauvegardées sont conservées sur cet appareil (rien n'est envoyé sur nos serveurs). Cliquez pour les rouvrir avec les mêmes paramètres.
        </p>

        {history.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20 }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>🗂️</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, color: "var(--text)", marginBottom: 10 }}>Aucune simulation sauvegardée</h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20 }}>
              Lancez un simulateur puis utilisez « Sauvegarder » pour la retrouver ici.
            </p>
            <Link to="/" style={{ display: "inline-block", padding: "10px 22px", borderRadius: 10, background: "rgba(184,147,74,0.15)", color: "var(--gold)", border: "1px solid var(--border-gold)", textDecoration: "none", fontSize: 14 }}>
              Voir les simulateurs →
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {history.map(entry => (
              <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "4px 4px 4px 0" }}>
                <Link to={entry.shareUrl.replace(/^https?:\/\/[^/]+/, "")} style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", textDecoration: "none", color: "var(--text)" }}>
                  <span style={{ minWidth: 0 }}>
                    {entry.simulator && <span style={{ display: "block", fontSize: 11, color: "var(--gold-mid)", marginBottom: 2 }}>{entry.simulator}</span>}
                    <span style={{ display: "block", fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.label}</span>
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-secondary)", flexShrink: 0, marginLeft: 12 }}>{relativeDate(entry.savedAt)}</span>
                </Link>
                <button
                  onClick={() => handleShareEntry(entry)}
                  aria-label="Partager"
                  title={copiedId === entry.id ? "Lien copié !" : "Copier le lien de partage"}
                  style={{ flexShrink: 0, background: "none", border: "none", color: copiedId === entry.id ? "#22c55e" : "var(--text-secondary)", cursor: "pointer", fontSize: 13, padding: "10px 10px", fontFamily: "'Hanken Grotesk', sans-serif", transition: "color 0.2s" }}
                >{copiedId === entry.id ? "✓" : "🔗"}</button>
                <button
                  onClick={() => { removeEntry(entry.id); setHistory(h => h.filter(e => e.id !== entry.id)); }}
                  aria-label="Supprimer"
                  style={{ flexShrink: 0, background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14, padding: "10px 12px" }}
                >✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
