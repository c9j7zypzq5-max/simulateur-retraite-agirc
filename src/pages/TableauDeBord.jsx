import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useAuth } from "../hooks/useAuth.js";
import { useSimHistory } from "../hooks/useSimHistory.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import SimIcon from "../data/simIcons.jsx";
import { BarChart3, PiggyBank, Flame, Building2, Receipt, Gem, Trophy, Lock, Clock, TrendingUp, ArrowRight } from "lucide-react";

const QUICK_ACCESS = [
  { path: "/simulateurs/synthese-retraite", label: "Synthèse retraite", category: "Retraite" },
  { path: "/simulateurs/emprunt-immobilier", label: "Emprunt immobilier", category: "Immobilier" },
  { path: "/simulateurs/fire", label: "FIRE", category: "Finances" },
  { path: "/simulateurs/impot-revenu", label: "Impôt revenu", category: "Impôts" },
  { path: "/simulateurs/epargne", label: "Épargne", category: "Finances" },
  { path: "/simulateurs/patrimoine", label: "Patrimoine", category: "Finances" },
];

function relativeDate(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.floor(ms / 86400000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000);
  if (d > 1) return `il y a ${d} j`;
  if (d === 1) return "hier";
  if (h > 0) return `il y a ${h} h`;
  if (m > 0) return `il y a ${m} min`;
  return "à l'instant";
}

function categoryFromPath(path) {
  if (!path) return "Autre";
  if (path.includes("retraite") || path.includes("cnav") || path.includes("agirc") || path.includes("per") || path.includes("synthese") || path.includes("independant") || path.includes("ircantec") || path.includes("cnavpl") || path.includes("msa") || path.includes("fonction-publique")) return "Retraite";
  if (path.includes("emprunt") || path.includes("locatif") || path.includes("ptz") || path.includes("plus-value")) return "Immobilier";
  if (path.includes("impot")) return "Impôts";
  if (path.includes("fire") || path.includes("epargne") || path.includes("patrimoine") || path.includes("budget") || path.includes("comparateur") || path.includes("assurance") || path.includes("credit") || path.includes("salaire")) return "Finances";
  if (path.includes("heures") || path.includes("semaines")) return "Vie & Temps";
  return "Autre";
}

const CAT_COLORS = {
  Retraite:    { bg: "rgba(184,147,74,0.1)",  border: "rgba(184,147,74,0.3)",  text: "#b8934a" },
  Immobilier:  { bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.3)",  text: "#3b82f6" },
  Impôts:      { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)",   text: "#ef4444" },
  Finances:    { bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.3)",   text: "#22c55e" },
  "Vie & Temps": { bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.3)", text: "#a855f7" },
  Autre:       { bg: "var(--card-bg)",         border: "var(--border)",         text: "var(--text-secondary)" },
};

function StatCard({ icon, value, label }) {
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 22px", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(184,147,74,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

export default function TableauDeBord() {
  const [theme, setTheme] = useTheme();
  const { user, loading, isPro } = useAuth();
  const navigate = useNavigate();
  const { getHistory, removeEntry } = useSimHistory();
  const [history, setHistory] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("frequent");

  useEffect(() => {
    document.title = "Tableau de bord | simfinly.com";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement("meta"); robots.name = "robots"; document.head.appendChild(robots); }
    robots.setAttribute("content", "noindex, follow");
    return () => robots?.setAttribute("content", "index, follow");
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate("/connexion?next=/tableau-de-bord", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    setHistory(getHistory());
  }, [getHistory]);

  async function handleExportPdf() {
    if (!isPro || history.length === 0) return;
    setExporting(true);
    try {
      const { buildMultiReportPdf } = await import("../utils/pdfReport.js");
      await buildMultiReportPdf(history);
    } catch (e) {
      try { (await import("@sentry/react")).captureException(e); } catch { /* Sentry indisponible */ }
    } finally {
      setExporting(false);
    }
  }

  if (loading || !user) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
      Chargement…
    </div>
  );

  const categories = [...new Set(history.map(e => categoryFromPath(e.shareUrl?.split("?")[0])))];
  const recent = history.slice(0, 8);

  // Category counts for chart and insights
  const catCounts = {};
  history.forEach(e => {
    const c = categoryFromPath(e.shareUrl?.split("?")[0]);
    catCounts[c] = (catCounts[c] || 0) + 1;
  });

  // Insights
  const insights = [];
  const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0];
  if (topCat) insights.push(`Votre thématique principale : ${topCat[0]} (${topCat[1]} simulation${topCat[1] > 1 ? "s" : ""}).`);
  if (history.length >= 5) insights.push(`Vous êtes un utilisateur actif avec ${history.length} simulations sauvegardées.`);
  const retraiteCount = catCounts["Retraite"] || 0;
  if (retraiteCount === 0) insights.push(`Vous n'avez pas encore simulé votre retraite — commencez avec le Wizard Retraite.`);
  if (retraiteCount >= 3) insights.push(`Vous avez exploré votre retraite en profondeur (${retraiteCount} simulations).`);

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16 };

  // Stat card value for simulations count
  const simCountValue = isPro
    ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{history.length}<span style={{ fontSize: 14, color: "var(--gold)" }}>★</span></span>
    : `${history.length} / 5`;
  const simCountLabel = isPro ? "simulations sauvegardées" : "simulations (illimité en Pro)";

  // Bar chart data
  const catEntries = Object.entries(catCounts).filter(([, v]) => v > 0);
  const maxCount = catEntries.reduce((m, [, v]) => Math.max(m, v), 1);

  // Recent simulations for sidebar tab
  const recentForSidebar = history.slice(0, 4);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 80px" }}>
        {/* Breadcrumb */}
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}<span style={{ color: "var(--text)" }}>Tableau de bord</span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", padding: "16px 0 32px" }}>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px,5vw,38px)", fontWeight: 700, margin: "0 0 8px" }}>
              Tableau de bord
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
              Retrouvez vos simulations et accédez rapidement à vos outils.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {isPro && history.length > 0 && (
              <button
                onClick={handleExportPdf}
                disabled={exporting}
                style={{ fontSize: 13, color: exporting ? "var(--text-secondary)" : "var(--gold)", background: "none", border: "1px solid var(--border-gold)", borderRadius: 10, padding: "8px 14px", cursor: exporting ? "not-allowed" : "pointer", fontFamily: "'Hanken Grotesk', sans-serif" }}
              >
                {exporting ? "Génération…" : "↓ Exporter en PDF"}
              </button>
            )}
            {isPro && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "rgba(184,147,74,0.12)", border: "1px solid rgba(184,147,74,0.3)", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "var(--gold)" }}>
                ★ Pro
              </div>
            )}
          </div>
        </div>

        {/* Upsell banner (non-bloquant) pour les gratuits */}
        {!isPro && (
          <div style={{ background: "rgba(43,92,230,0.05)", border: "1px solid rgba(43,92,230,0.2)", borderRadius: 14, padding: "14px 20px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ fontSize: 14, color: "var(--text)" }}>
              <strong>Passez à Pro</strong> pour débloquer les graphiques, les insights et l'export PDF.
            </div>
            <Link to="/pro" style={{ display: "inline-block", padding: "8px 16px", borderRadius: 10, background: "#2B5CE6", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
              Découvrir Pro →
            </Link>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 32 }}>
          <StatCard icon={<BarChart3 size={20} />} value={simCountValue} label={simCountLabel} />
          <StatCard icon={<TrendingUp size={20} />} value={categories.length} label={`catégorie${categories.length > 1 ? "s" : ""} explorée${categories.length > 1 ? "s" : ""}`} />
          <StatCard icon={<Clock size={20} />} value={history.length > 0 ? relativeDate(history[0].savedAt) : "—"} label="dernière activité" />
        </div>

        {/* Category breakdown chart — Pro only */}
        {isPro && history.length > 0 && (
          <div style={{ ...card, padding: "22px 24px", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 18, margin: "0 0 18px" }}>
              Répartition par catégorie
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {catEntries.sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                const colors = CAT_COLORS[cat] || CAT_COLORS.Autre;
                const widthPct = (count / maxCount) * 100;
                return (
                  <div key={cat} style={{ display: "flex", alignItems: "center", gap: 12, height: 28 }}>
                    <span style={{ width: 100, flexShrink: 0, fontSize: 12, color: "var(--text-secondary)", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {cat}
                    </span>
                    <div style={{ flex: 1, position: "relative", height: 20, borderRadius: 6, background: "var(--surface, rgba(0,0,0,0.04))", overflow: "hidden" }}>
                      <svg width="100%" height="20" style={{ display: "block" }}>
                        <rect
                          x={0}
                          y={0}
                          width={`${widthPct}%`}
                          height={20}
                          rx={6}
                          fill={colors.bg}
                          stroke={colors.border}
                          strokeWidth={1}
                        />
                      </svg>
                    </div>
                    <span style={{ width: 24, flexShrink: 0, fontSize: 13, fontWeight: 600, color: colors.text, textAlign: "left" }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Insights — Pro only */}
        {isPro && history.length > 0 && insights.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
              Points clés
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {insights.map((insight, i) => (
                <div
                  key={i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 20,
                    fontSize: 13,
                    color: "var(--text)",
                    lineHeight: 1.4,
                  }}
                >
                  <span role="img" aria-hidden="true">💡</span>
                  {insight}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
          <div>
            {/* Recent simulations */}
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, marginBottom: 14 }}>
              Simulations récentes
            </h2>
            {history.length === 0 ? (
              <div style={{ ...card, padding: "36px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>
                  Aucune simulation sauvegardée. Lancez un simulateur et cliquez sur « Sauvegarder » pour la retrouver ici.
                </p>
                <Link to="/" style={{ display: "inline-block", padding: "10px 20px", borderRadius: 10, background: "rgba(184,147,74,0.12)", color: "var(--gold)", border: "1px solid var(--border-gold)", textDecoration: "none", fontSize: 14 }}>
                  Voir tous les simulateurs →
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {recent.map(entry => {
                  const path = entry.shareUrl?.split("?")[0] ?? "";
                  const cat = categoryFromPath(path);
                  const colors = CAT_COLORS[cat] || CAT_COLORS.Autre;
                  return (
                    <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 8, ...card, padding: "4px 4px 4px 0" }}>
                      <Link
                        to={entry.shareUrl.replace(/^https?:\/\/[^/]+/, "")}
                        style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", textDecoration: "none", color: "var(--text)" }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: colors.bg, border: `1px solid ${colors.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: colors.text, flexShrink: 0 }}>
                          <SimIcon path={path} size={17} strokeWidth={1.7} />
                        </div>
                        <span style={{ minWidth: 0 }}>
                          {entry.simulator && <span style={{ display: "block", fontSize: 11, color: colors.text, marginBottom: 1 }}>{cat}</span>}
                          <span style={{ display: "block", fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.label}</span>
                        </span>
                      </Link>
                      <span style={{ fontSize: 11, color: "var(--text-secondary)", flexShrink: 0, paddingRight: 8 }}>{relativeDate(entry.savedAt)}</span>
                      <button
                        onClick={() => { removeEntry(entry.id); setHistory(h => h.filter(e => e.id !== entry.id)); }}
                        aria-label="Supprimer"
                        style={{ flexShrink: 0, background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14, padding: "10px 12px" }}
                      >✕</button>
                    </div>
                  );
                })}
                {history.length > 8 && (
                  <Link to="/mes-simulations" style={{ fontSize: 13, color: "var(--gold)", textDecoration: "none", padding: "10px 0", textAlign: "center" }}>
                    Voir toutes les simulations ({history.length}) →
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Sidebar: Explorer with tabs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ ...card, padding: "20px" }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 14 }}>
                Explorer
              </h2>
              {/* Tab pills */}
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                <button
                  onClick={() => setActiveTab("frequent")}
                  style={{
                    flex: 1,
                    padding: "6px 10px",
                    borderRadius: 20,
                    border: "1px solid",
                    borderColor: activeTab === "frequent" ? "rgba(184,147,74,0.4)" : "var(--border)",
                    background: activeTab === "frequent" ? "rgba(184,147,74,0.12)" : "transparent",
                    color: activeTab === "frequent" ? "var(--gold)" : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: activeTab === "frequent" ? 600 : 400,
                    cursor: "pointer",
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    transition: "all 0.15s",
                  }}
                >
                  Fréquents
                </button>
                <button
                  onClick={() => setActiveTab("recent")}
                  style={{
                    flex: 1,
                    padding: "6px 10px",
                    borderRadius: 20,
                    border: "1px solid",
                    borderColor: activeTab === "recent" ? "rgba(184,147,74,0.4)" : "var(--border)",
                    background: activeTab === "recent" ? "rgba(184,147,74,0.12)" : "transparent",
                    color: activeTab === "recent" ? "var(--gold)" : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: activeTab === "recent" ? 600 : 400,
                    cursor: "pointer",
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    transition: "all 0.15s",
                  }}
                >
                  Récents
                </button>
              </div>

              {/* Tab content */}
              {activeTab === "frequent" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {QUICK_ACCESS.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, textDecoration: "none", color: "var(--text)", background: "transparent", transition: "background 0.15s", fontSize: 13 }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--surface)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ color: "var(--text-secondary)" }}>
                        <SimIcon path={item.path} size={15} strokeWidth={1.6} />
                      </span>
                      {item.label}
                      <ArrowRight size={12} style={{ marginLeft: "auto", color: "var(--text-secondary)" }} />
                    </Link>
                  ))}
                  <Link to="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 12px", borderRadius: 10, textDecoration: "none", color: "var(--gold)", fontSize: 13, marginTop: 4, border: "1px dashed var(--border-gold)" }}>
                    Tous les simulateurs →
                  </Link>
                </div>
              )}

              {activeTab === "recent" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {recentForSidebar.length === 0 ? (
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", padding: "8px 0" }}>
                      Aucune simulation récente.
                    </p>
                  ) : (
                    recentForSidebar.map(entry => {
                      const path = entry.shareUrl?.split("?")[0] ?? "";
                      const cat = categoryFromPath(path);
                      const colors = CAT_COLORS[cat] || CAT_COLORS.Autre;
                      return (
                        <Link
                          key={entry.id}
                          to={entry.shareUrl.replace(/^https?:\/\/[^/]+/, "")}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, textDecoration: "none", color: "var(--text)", background: "transparent", transition: "background 0.15s", fontSize: 13 }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--surface)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <span style={{ color: colors.text, flexShrink: 0 }}>
                            <SimIcon path={path} size={15} strokeWidth={1.6} />
                          </span>
                          <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {entry.label}
                          </span>
                          <span style={{ fontSize: 11, color: "var(--text-secondary)", flexShrink: 0 }}>
                            {relativeDate(entry.savedAt)}
                          </span>
                        </Link>
                      );
                    })
                  )}
                  <Link to="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 12px", borderRadius: 10, textDecoration: "none", color: "var(--gold)", fontSize: 13, marginTop: 4, border: "1px dashed var(--border-gold)" }}>
                    Tous les simulateurs →
                  </Link>
                </div>
              )}
            </div>

            {/* Wizard Retraite shortcut — Pro only */}
            {isPro && (
              <Link
                to="/wizard-retraite"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  background: "rgba(184,147,74,0.08)",
                  border: "1px solid rgba(184,147,74,0.25)",
                  borderRadius: 14,
                  textDecoration: "none",
                  color: "var(--gold)",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(184,147,74,0.14)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(184,147,74,0.08)"}
              >
                <span>Wizard Retraite</span>
                <ArrowRight size={15} />
              </Link>
            )}

            {!isPro && (
              <div style={{ ...card, padding: "20px", background: "rgba(184,147,74,0.06)", border: "1px solid rgba(184,147,74,0.2)" }}>
                <div style={{ fontSize: 20, marginBottom: 10 }}>★</div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--gold)" }}>Simfinly Pro</h3>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 14 }}>
                  Tableau de bord complet, 50 simulations sauvegardées et rapport PDF professionnel.
                </p>
                <Link to="/pro" style={{ display: "block", textAlign: "center", padding: "10px", borderRadius: 10, background: "var(--gold)", color: "#1a1000", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                  Voir Pro — 2,99 €/mois
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
