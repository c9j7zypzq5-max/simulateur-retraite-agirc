import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useAuth } from "../hooks/useAuth.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useSimHistory } from "../hooks/useSimHistory.js";
import CompareModal from "../components/CompareModal.jsx";
import { supabase } from "../lib/supabase.js";

function relativeDate(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.floor(ms / 86400000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000);
  if (d > 0) return `il y a ${d} j`;
  if (h > 0) return `il y a ${h} h`;
  if (m > 0) return `il y a ${m} min`;
  return "à l'instant";
}

function buildRapportId(entry) {
  try { return btoa(JSON.stringify(entry)); } catch { return null; }
}

export default function MesSimulations() {
  const [theme, setTheme] = useTheme();
  const { isPro, user } = useAuth();
  const { getHistory, removeEntryWithSync, clearHistory, updateEntryWithSync, updateEntry } = useSimHistory();
  const [history, setHistory] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [exportingXlsx, setExportingXlsx] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Inline rename state (Pro only)
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Note state (Pro only)
  const [openNoteId, setOpenNoteId] = useState(null);
  const [noteValue, setNoteValue] = useState("");

  // Compare state (Pro only)
  const [selected, setSelected] = useState(new Set());
  const [compareEntries, setCompareEntries] = useState(null);
  const [compareError, setCompareError] = useState("");

  useEffect(() => {
    document.title = "Mes simulations sauvegardées | simfinly.com";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, follow');
    const refresh = () => setHistory(getHistory());
    refresh();
    window.addEventListener("storage", refresh);
    return () => { robots && robots.setAttribute('content', 'index, follow'); window.removeEventListener("storage", refresh); };
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

  function handleSaveLabel(id) {
    updateEntryWithSync(id, { label: editValue }, { user, supabaseClient: supabase });
    setEditingId(null);
    setHistory(getHistory());
  }

  function handleRemove(id) {
    removeEntryWithSync(id, { user, supabaseClient: supabase });
    setHistory(h => h.filter(e => e.id !== id));
    setSelected(s => { const next = new Set(s); next.delete(id); return next; });
  }

  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); return next; }
      if (next.size >= 2) return prev; // max 2
      next.add(id);
      return next;
    });
    setCompareError("");
  }

  function handleCompare() {
    const [idA, idB] = [...selected];
    const a = history.find(e => e.id === idA);
    const b = history.find(e => e.id === idB);
    if (!a || !b) return;
    // Les simulateurs peuvent être différents - on compare quand même
    setCompareEntries([a, b]);
  }

  const authCtx = { user, supabaseClient: supabase };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      {compareEntries && (
        <CompareModal
          entryA={compareEntries[0]}
          entryB={compareEntries[1]}
          onClose={() => setCompareEntries(null)}
        />
      )}

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
              {isPro && selected.size === 2 && (
                <button
                  onClick={handleCompare}
                  style={{ fontSize: 13, color: "var(--gold)", background: "rgba(184,147,74,0.1)", border: "1px solid var(--border-gold)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600 }}
                >
                  ⇄ Comparer
                </button>
              )}
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
                onClick={() => { clearHistory(); setHistory([]); setSelected(new Set()); }}
                style={{ fontSize: 13, color: "var(--text-secondary)", background: "none", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}
              >
                Tout effacer
              </button>
            </div>
          )}
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          {user
            ? "Vos simulations sont synchronisées sur votre compte et accessibles sur tous vos appareils."
            : "Vos simulations sauvegardées sont conservées sur cet appareil (rien n'est envoyé sur nos serveurs). Cliquez pour les rouvrir avec les mêmes paramètres."}
        </p>

        {isPro && history.length >= 2 && selected.size === 0 && (
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16, padding: "8px 14px", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 10, display: "inline-block" }}>
            Cochez 2 simulations pour les comparer côte à côte ⇄
          </div>
        )}
        {compareError && (
          <div style={{ fontSize: 12, color: "#c0392b", marginBottom: 12 }}>{compareError}</div>
        )}

        {!isPro && history.length >= 8 && (
          <div style={{ background: "rgba(184,147,74,0.08)", border: "1px solid rgba(184,147,74,0.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "var(--gold)" }}>⚠️</span>
            <div>
              <span style={{ fontSize: 13, color: "var(--text)" }}>Limite de 8 simulations atteinte. </span>
              <Link to="/pro" style={{ fontSize: 13, color: "var(--gold)", textDecoration: "underline" }}>Passer à Pro pour des simulations illimitées →</Link>
            </div>
          </div>
        )}

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
            {history.map(entry => {
              const isChecked = selected.has(entry.id);
              return (
                <div
                  key={entry.id}
                  className="sim-entry"
                  style={{
                    background: "var(--card-bg)",
                    border: isChecked ? "1px solid var(--border-gold)" : "1px solid var(--border)",
                    borderRadius: 12, overflow: "hidden",
                    transition: "border-color 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 4px 4px 0" }}>
                    {/* Checkbox (Pro only) */}
                    {isPro && (
                      <button
                        onClick={() => toggleSelect(entry.id)}
                        title={isChecked ? "Désélectionner" : "Sélectionner pour comparer"}
                        style={{
                          flexShrink: 0, width: 22, height: 22, borderRadius: 6,
                          border: isChecked ? "2px solid var(--gold)" : "2px solid var(--border)",
                          background: isChecked ? "rgba(184,147,74,0.15)" : "transparent",
                          cursor: "pointer", marginLeft: 12,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "var(--gold)", fontSize: 12, transition: "all 0.15s",
                        }}
                      >
                        {isChecked ? "✓" : ""}
                      </button>
                    )}
                    <Link to={entry.shareUrl.replace(/^https?:\/\/[^/]+/, "")} style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", textDecoration: "none", color: "var(--text)" }}>
                      <span style={{ minWidth: 0 }}>
                        {entry.simulator && <span style={{ display: "block", fontSize: 11, color: "var(--gold-mid)", marginBottom: 2 }}>{entry.simulator}</span>}
                        {/* highlight si disponible */}
                        {entry.reportSnapshot?.highlight && (
                          <span style={{ display: "block", fontSize: 11, color: "var(--text-secondary)", marginBottom: 2 }}>
                            {entry.reportSnapshot.highlight.label} : <strong style={{ color: "var(--text)" }}>{entry.reportSnapshot.highlight.value}</strong>
                          </span>
                        )}
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {isPro && editingId === entry.id ? (
                            <input
                              autoFocus
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              onBlur={() => handleSaveLabel(entry.id)}
                              onKeyDown={e => {
                                if (e.key === "Enter") { e.preventDefault(); handleSaveLabel(entry.id); }
                                if (e.key === "Escape") { setEditingId(null); }
                              }}
                              onClick={e => e.preventDefault()}
                              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: "var(--text)", background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "2px 8px", width: "100%", maxWidth: 360, outline: "none" }}
                            />
                          ) : (
                            <>
                              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.label}</span>
                              {isPro && (
                                <button
                                  className="edit-pencil"
                                  onClick={e => { e.preventDefault(); setEditingId(entry.id); setEditValue(entry.label); }}
                                  aria-label="Renommer"
                                  title="Renommer"
                                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: "0 2px", color: "var(--text-secondary)", opacity: 0, transition: "opacity 0.15s", flexShrink: 0 }}
                                >✏️</button>
                              )}
                            </>
                          )}
                        </span>
                      </span>
                      <span style={{ fontSize: 11, color: "var(--text-secondary)", flexShrink: 0, marginLeft: 12 }}>{relativeDate(entry.savedAt)}</span>
                    </Link>
                    {isPro && (
                      <button
                        onClick={() => {
                          if (openNoteId === entry.id) {
                            setOpenNoteId(null);
                          } else {
                            setOpenNoteId(entry.id);
                            setNoteValue(entry.note || "");
                          }
                        }}
                        aria-label="Note"
                        title="Ajouter une note"
                        style={{ flexShrink: 0, background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 13, padding: "10px 8px", fontFamily: "'Hanken Grotesk', sans-serif", position: "relative" }}
                      >
                        📝{entry.note ? <span style={{ position: "absolute", top: 6, right: 4, width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} /> : null}
                      </button>
                    )}
                    <button
                      onClick={() => handleShareEntry(entry)}
                      aria-label="Partager"
                      title={copiedId === entry.id ? "Lien copié !" : "Copier le lien de partage"}
                      style={{ flexShrink: 0, background: "none", border: "none", color: copiedId === entry.id ? "#22c55e" : "var(--text-secondary)", cursor: "pointer", fontSize: 13, padding: "10px 10px", fontFamily: "'Hanken Grotesk', sans-serif", transition: "color 0.2s" }}
                    >{copiedId === entry.id ? "✓" : "🔗"}</button>
                    <button
                      onClick={() => handleRemove(entry.id)}
                      aria-label="Supprimer"
                      style={{ flexShrink: 0, background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14, padding: "10px 12px" }}
                    >✕</button>
                  </div>
                  {openNoteId === entry.id && (
                    <div style={{ padding: "8px 16px 12px", borderTop: "1px solid var(--border)" }}>
                      <textarea
                        value={noteValue}
                        onChange={e => setNoteValue(e.target.value)}
                        placeholder="Ajouter une note à cette simulation…"
                        style={{ width: "100%", minHeight: 60, padding: "8px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--input-bg)", color: "var(--text)", fontSize: 13, fontFamily: "'Hanken Grotesk', sans-serif", resize: "vertical", boxSizing: "border-box" }}
                      />
                      <button
                        onClick={() => {
                          updateEntryWithSync(entry.id, { note: noteValue }, authCtx);
                          setOpenNoteId(null);
                          setHistory(getHistory());
                        }}
                        style={{ marginTop: 6, padding: "5px 14px", borderRadius: 8, background: "var(--gold)", color: "#1a1000", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                      >
                        Enregistrer
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .sim-entry:hover .edit-pencil { opacity: 1 !important; }
      `}</style>

      <Footer />
    </div>
  );
}
