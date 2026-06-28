import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useSimHistory } from "../hooks/useSimHistory.js";
import CompareSection from "../components/CompareModal.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { supabase } from "../lib/supabase.js";

function relativeDate(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.floor(ms / 86400000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000);
  if (d > 0) return `il y a ${d} j`;
  if (h > 0) return `il y a ${h} h`;
  if (m > 0) return `il y a ${m} min`;
  return "à l'instant";
}

function SimIcon({ simulator }) {
  const s = String(simulator || "").toLowerCase();
  const isRetraite = s.includes("retraite") || s.includes("agirc") || s.includes("arrco");
  const isImmo = s.includes("emprunt") || s.includes("immobil") || s.includes("credit") || s.includes("crédit");
  const isFire = s.includes("fire") || s.includes("epargne") || s.includes("épargne") || s.includes("indépendance");
  const isBudget = s.includes("budget");
  const isPatrimoine = s.includes("patrimoine") || s.includes("succession");

  let icon;
  if (isRetraite) {
    icon = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
  } else if (isImmo) {
    icon = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v9h14v-9"/></svg>;
  } else if (isFire) {
    icon = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-9"/><path d="M15 6h6v6"/></svg>;
  } else if (isBudget) {
    icon = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>;
  } else if (isPatrimoine) {
    icon = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L2 9l10 6 10-6-10-6z"/><path d="M2 17l10 6 10-6"/><path d="M2 13l10 6 10-6"/></svg>;
  } else {
    icon = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-9"/></svg>;
  }

  return (
    <div style={{ width: 42, height: 42, borderRadius: 11, background: "#EAF0FF", color: "#2B5CE6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {icon}
    </div>
  );
}

const NAV_ITEMS = [
  { label: "Mes simulations", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>, to: "/mes-simulations", tab: "list" },
  { label: "Comparaisons", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>, to: "/mes-simulations?tab=compare", tab: "compare" },
  { label: "Profil", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>, to: "/compte", tab: null },
  { label: "Abonnement", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v6M12 17v6M4.2 4.2l4.3 4.3M15.5 15.5l4.3 4.3M1 12h6M17 12h6"/></svg>, to: "/pro", tab: null },
];

export default function MesSimulations() {
  const { isPro, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "list";
  const { getHistory, removeEntryWithSync, clearHistory, updateEntryWithSync } = useSimHistory();
  const [history, setHistory] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [compareEntries, setCompareEntries] = useState(null);
  const [compareError, setCompareError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    document.title = "Mes simulations sauvegardées | simfinly.com";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.setAttribute('content', 'noindex, follow');
    const refresh = () => setHistory(getHistory());
    refresh();
    window.addEventListener("storage", refresh);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => {
      robots?.setAttribute('content', 'index, follow');
      window.removeEventListener("storage", refresh);
      window.removeEventListener("resize", handleResize);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleRemove(id) {
    removeEntryWithSync(id, { user, supabaseClient: supabase });
    setHistory(h => h.filter(e => e.id !== id));
    setSelected(s => { const next = new Set(s); next.delete(id); return next; });
    if (compareEntries?.some(e => e.id === id)) setCompareEntries(null);
    setConfirmDeleteId(null);
  }

  function handleSaveLabel(id) {
    updateEntryWithSync(id, { label: editValue }, { user, supabaseClient: supabase });
    setEditingId(null);
    setHistory(getHistory());
  }

  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); setCompareEntries(null); return next; }
      if (next.size >= 2) return prev;
      next.add(id);
      return next;
    });
    setCompareError("");
    setCompareEntries(null);
  }

  function handleCompare() {
    const [idA, idB] = [...selected];
    const a = history.find(e => e.id === idA);
    const b = history.find(e => e.id === idB);
    if (!a || !b) return;
    setCompareEntries([a, b]);
    if (activeTab !== "compare") navigate("/mes-simulations?tab=compare");
  }

  function handleReopenEntry(entry) {
    try {
      const path = entry.shareUrl.startsWith("http")
        ? entry.shareUrl.replace(/^https?:\/\/[^/]+/, "")
        : entry.shareUrl;
      navigate(path);
    } catch {
      window.location.href = entry.shareUrl;
    }
  }

  async function handleCopyLink(entry) {
    try {
      await navigator.clipboard.writeText(entry.shareUrl);
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      window.open(entry.shareUrl, "_blank", "noopener");
    }
  }


  return (
    <div style={{ minHeight: "100vh", background: "#F5F6F8", fontFamily: "'Hanken Grotesk', sans-serif", color: "#0F1828" }}>
      <ConfirmModal
        open={confirmDeleteId !== null}
        title="Supprimer cette simulation ?"
        body="Cette action est irréversible."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        danger
        onConfirm={() => handleRemove(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
      <Navbar />

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 16px 80px" }}>
        {/* Page layout */}
        <div style={{ display: isMobile ? "block" : "grid", gridTemplateColumns: "230px 1fr", gap: 0, alignItems: "start", marginTop: 24 }}>

          {/* Sidebar */}
          {!isMobile && (
            <div style={{ background: "#fff", borderRight: "1px solid #e7eaf0", padding: "28px 20px", minHeight: 520, borderRadius: "14px 0 0 14px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a93a3", fontWeight: 700, marginBottom: 14 }}>Mon compte</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {NAV_ITEMS.map(item => {
                  const isActive = item.tab
                    ? activeTab === item.tab
                    : window.location.pathname === item.to;
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        fontSize: 14, fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#2B5CE6" : "#5B6677",
                        background: isActive ? "#EAF0FF" : "transparent",
                        padding: "10px 12px", borderRadius: 10,
                        textDecoration: "none", transition: "background 0.15s",
                      }}
                    >
                      {item.icon}{item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main content */}
          <div style={{ background: "#fff", borderRadius: isMobile ? 14 : "0 14px 14px 0", border: "1px solid #e7eaf0", borderLeft: isMobile ? "1px solid #e7eaf0" : "none", padding: isMobile ? "20px 16px" : "28px 30px 36px" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: isMobile ? 22 : 26, fontWeight: 600, letterSpacing: "-0.01em", color: "#0F1828", margin: 0 }}>
                  {activeTab === "compare" ? "Comparaisons" : "Mes simulations"}
                </h1>
                {activeTab !== "compare" && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ fontSize: 13.5, color: "#8a93a3" }}>
                      {history.length} scénario{history.length !== 1 ? "s" : ""} sauvegardé{history.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                )}
              </div>
              <Link
                to="/simulateurs"
                style={{ display: "flex", alignItems: "center", gap: 7, fontSize: isMobile ? 13 : 13.5, fontWeight: 600, color: "#fff", background: "#2B5CE6", padding: isMobile ? "10px 12px" : "10px 16px", borderRadius: 10, textDecoration: "none", flexShrink: 0 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                {!isMobile && "Nouvelle simulation"}
              </Link>
            </div>

            {/* Compare tab content */}
            {activeTab === "compare" ? (
              compareEntries ? (
                <CompareSection
                  entryA={compareEntries[0]}
                  entryB={compareEntries[1]}
                  onClose={() => { setCompareEntries(null); setSelected(new Set()); }}
                />
              ) : (
                <div style={{ textAlign: "center", padding: "50px 20px" }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>⇄</div>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: "#0F1828", marginBottom: 10 }}>Aucune comparaison en cours</h2>
                  <p style={{ fontSize: 14, color: "#5B6677", lineHeight: 1.7, marginBottom: 20 }}>
                    Revenez dans « Mes simulations » et cliquez sur l'icône ⊞ sur 2 scénarios pour les comparer.
                  </p>
                  <Link to="/mes-simulations" style={{ display: "inline-block", padding: "10px 22px", borderRadius: 10, background: "#2B5CE6", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                    Aller à mes simulations →
                  </Link>
                </div>
              )
            ) : (
              <>
                {/* Hint for compare */}
                {history.length >= 2 && selected.size === 0 && (
                  <div style={{ fontSize: 12, color: "#8a93a3", marginBottom: 16, padding: "8px 14px", background: "#F5F6F8", border: "1px solid #e7eaf0", borderRadius: 10, display: "inline-block" }}>
                    Cliquez sur l'icône <span style={{ color: "#2B5CE6" }}>⊞</span> sur 2 simulations pour les comparer côte à côte
                  </div>
                )}
                {compareError && (
                  <div style={{ fontSize: 12, color: "#c2410c", marginBottom: 12, padding: "8px 14px", background: "#fff7ed", borderRadius: 10 }}>{compareError}</div>
                )}
                {selected.size === 2 && (
                  <div style={{ marginBottom: 16 }}>
                    <button
                      onClick={handleCompare}
                      style={{ fontSize: 13, color: "#fff", background: "#2B5CE6", border: "none", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 600 }}
                    >
                      ⇄ Comparer les 2 scénarios
                    </button>
                  </div>
                )}

                {history.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "50px 20px", background: "#F5F6F8", border: "1px solid #e7eaf0", borderRadius: 14 }}>
                    <div style={{ fontSize: 40, marginBottom: 14 }}>🗂️</div>
                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: "#0F1828", marginBottom: 10 }}>Aucune simulation sauvegardée</h2>
                    <p style={{ fontSize: 14, color: "#5B6677", lineHeight: 1.7, marginBottom: 20 }}>
                      Lancez un simulateur puis utilisez « Sauvegarder » pour la retrouver ici.
                    </p>
                    <Link to="/simulateurs" style={{ display: "inline-block", padding: "10px 22px", borderRadius: 10, background: "#2B5CE6", color: "#fff", textDecoration: "none", fontSize: 14 }}>
                      Voir les simulateurs →
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {history.map(entry => {
                      const isChecked = selected.has(entry.id);
                      return (
                        <div
                          key={entry.id}
                          style={{ background: "#fff", border: isChecked ? "1.5px solid #2B5CE6" : "1px solid #e7eaf0", borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s" }}
                        >
                          {isMobile ? (
                            /* Mobile card */
                            <div style={{ padding: 16 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                                <SimIcon simulator={entry.simulator} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  {editingId === entry.id ? (
                                    <input
                                      autoFocus
                                      value={editValue}
                                      onChange={e => setEditValue(e.target.value)}
                                      onBlur={() => handleSaveLabel(entry.id)}
                                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleSaveLabel(entry.id); } if (e.key === "Escape") setEditingId(null); }}
                                      style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14.5, fontWeight: 600, color: "#0F1828", background: "#F5F6F8", border: "1px solid #e7eaf0", borderRadius: 6, padding: "2px 8px", width: "100%", outline: "none" }}
                                    />
                                  ) : (
                                    <div
                                      style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14.5, fontWeight: 600, color: "#0F1828", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}
                                      onDoubleClick={() => { setEditingId(entry.id); setEditValue(entry.label); }}
                                    >
                                      {entry.label}
                                    </div>
                                  )}
                                  <div style={{ fontSize: 11.5, color: "#8a93a3", marginTop: 2 }}>{relativeDate(entry.savedAt)}</div>
                                </div>
                                {entry.reportSnapshot?.highlight && (
                                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "#0F1828" }}>{entry.reportSnapshot.highlight.value}</div>
                                    <div style={{ fontSize: 10.5, color: "#8a93a3" }}>{entry.reportSnapshot.highlight.label}</div>
                                  </div>
                                )}
                              </div>
                              <div style={{ display: "flex", gap: 8, paddingTop: 12, borderTop: "1px solid #f0f2f6" }}>
                                <button
                                  onClick={() => handleReopenEntry(entry)}
                                  style={{ flex: 1, textAlign: "center", fontSize: 12.5, fontWeight: 600, color: "#2B5CE6", background: "#EAF0FF", border: "none", padding: 8, borderRadius: 8, cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif" }}
                                >
                                  Rouvrir
                                </button>
                                <button
                                  onClick={() => toggleSelect(entry.id)}
                                  style={{ flex: 1, textAlign: "center", fontSize: 12.5, fontWeight: 600, color: isChecked ? "#2B5CE6" : "#5B6677", background: isChecked ? "#EAF0FF" : "#F5F6F8", border: isChecked ? "1px solid #2B5CE6" : "1px solid #e7eaf0", padding: 8, borderRadius: 8, cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif" }}
                                >
                                  {isChecked ? "✓ Sélectionné" : "Comparer"}
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(entry.id)}
                                  style={{ width: 36, height: 36, background: "none", border: "1px solid #e7eaf0", borderRadius: 8, cursor: "pointer", color: "#8a93a3", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Desktop card */
                            <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 20px" }}>
                              <SimIcon simulator={entry.simulator} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                {editingId === entry.id ? (
                                  <input
                                    autoFocus
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    onBlur={() => handleSaveLabel(entry.id)}
                                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleSaveLabel(entry.id); } if (e.key === "Escape") setEditingId(null); }}
                                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15.5, fontWeight: 600, color: "#0F1828", background: "#F5F6F8", border: "1px solid #e7eaf0", borderRadius: 6, padding: "2px 8px", width: "100%", maxWidth: 360, outline: "none" }}
                                  />
                                ) : (
                                  <div
                                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15.5, fontWeight: 600, color: "#0F1828", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}
                                    onDoubleClick={() => { setEditingId(entry.id); setEditValue(entry.label); }}
                                    title="Double-cliquer pour renommer"
                                  >
                                    {entry.label}
                                  </div>
                                )}
                                {entry.reportSnapshot?.highlight && (
                                  <div style={{ fontSize: 12.5, color: "#8a93a3", marginTop: 3 }}>
                                    {entry.reportSnapshot.highlight.label} · {relativeDate(entry.savedAt)}
                                  </div>
                                )}
                                {!entry.reportSnapshot?.highlight && (
                                  <div style={{ fontSize: 12.5, color: "#8a93a3", marginTop: 3 }}>{relativeDate(entry.savedAt)}</div>
                                )}
                              </div>
                              {entry.reportSnapshot?.highlight && (
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 600, color: "#0F1828" }}>{entry.reportSnapshot.highlight.value}</div>
                                  <div style={{ fontSize: 11, color: "#8a93a3" }}>{entry.reportSnapshot.highlight.label}</div>
                                </div>
                              )}
                              <div style={{ display: "flex", gap: 8, marginLeft: 8, flexShrink: 0 }}>
                                {/* Reopen button */}
                                <button
                                  onClick={() => handleReopenEntry(entry)}
                                  title="Rouvrir la simulation"
                                  style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid #e7eaf0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#5B6677", cursor: "pointer" }}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.4 2.6L3 8"/><path d="M3 3v5h5"/></svg>
                                </button>
                                {/* Compare toggle */}
                                <button
                                  onClick={() => toggleSelect(entry.id)}
                                  title={isChecked ? "Désélectionner" : "Sélectionner pour comparer"}
                                  style={{ width: 34, height: 34, borderRadius: 9, border: isChecked ? "1.5px solid #2B5CE6" : "1px solid #e7eaf0", background: isChecked ? "#EAF0FF" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: isChecked ? "#2B5CE6" : "#5B6677", cursor: "pointer", transition: "all 0.15s" }}
                                >
                                  {isChecked
                                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                                  }
                                </button>
                                {/* Copy link */}
                                <button
                                  onClick={() => handleCopyLink(entry)}
                                  title={copiedId === entry.id ? "Lien copié !" : "Copier le lien"}
                                  style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid #e7eaf0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: copiedId === entry.id ? "#15A06B" : "#5B6677", cursor: "pointer", transition: "color 0.2s" }}
                                >
                                  {copiedId === entry.id
                                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                  }
                                </button>
                                {/* Delete */}
                                <button
                                  onClick={() => setConfirmDeleteId(entry.id)}
                                  title="Supprimer"
                                  style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid #e7eaf0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#8a93a3", cursor: "pointer", fontSize: 14 }}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Inline compare section */}
                {compareEntries && activeTab !== "compare" && (
                  <CompareSection
                    entryA={compareEntries[0]}
                    entryB={compareEntries[1]}
                    onClose={() => { setCompareEntries(null); setSelected(new Set()); }}
                  />
                )}

                {history.length > 0 && (
                  <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => { clearHistory(); setHistory([]); setSelected(new Set()); setCompareEntries(null); }}
                      style={{ fontSize: 12, color: "#8a93a3", background: "none", border: "1px solid #e7eaf0", borderRadius: 8, padding: "6px 14px", cursor: "pointer" }}
                    >
                      Tout effacer
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
