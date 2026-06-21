// Route à ajouter dans src/App.jsx :
//   <Route path="/synthese-patrimoniale" element={<SynthesePatrimoniale />} />

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import { useAuth } from "../hooks/useAuth.js";
import { useSimHistory } from "../hooks/useSimHistory.js";
import { usePageMeta } from "../hooks/usePageMeta.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AdUnit from "../components/AdUnit.jsx";
import { fmtEur, SimulateurHeader } from "../components/ui.jsx";
import { Lock, TrendingUp, Home, PiggyBank, Shield, ArrowRight, AlertCircle } from "lucide-react";

// ─── Catégorisation des simulations ─────────────────────────────────────────
const CATEGORIES = {
  retraite: [
    "/simulateurs/agirc-arrco",
    "/simulateurs/cnav",
    "/simulateurs/synthese-retraite",
    "/simulateurs/fonction-publique",
    "/simulateurs/independants",
    "/simulateurs/per",
    "/simulateurs/retraite-anticipee",
  ],
  immobilier: [
    "/simulateurs/emprunt-immobilier",
    "/simulateurs/rendement-locatif",
    "/simulateurs/ptz",
  ],
  epargne: [
    "/simulateurs/epargne",
    "/simulateurs/fire",
    "/simulateurs/assurance-vie",
    "/simulateurs/per",
  ],
  impots: [
    "/simulateurs/impot-revenu",
    "/simulateurs/plus-value-immobiliere",
    "/simulateurs/deficit-foncier",
  ],
};

function getCategoriesForPath(path) {
  if (!path) return ["autres"];
  const cats = [];
  for (const [cat, paths] of Object.entries(CATEGORIES)) {
    if (paths.some(p => path.startsWith(p))) cats.push(cat);
  }
  return cats.length > 0 ? cats : ["autres"];
}

// ─── Extraction des données utiles depuis l'URL d'une simulation ──────────────
// Les simulations sauvegardées stockent les params dans l'URL. On tente d'en
// extraire les valeurs numériques clés selon le simulateur.
function extractSimData(entry) {
  if (!entry?.shareUrl) return null;
  try {
    const url = new URL(entry.shareUrl.startsWith("http") ? entry.shareUrl : "https://simfinly.com" + entry.shareUrl);
    const params = Object.fromEntries(url.searchParams.entries());
    const path = url.pathname;

    // Retourne les params bruts + le path pour affichage
    return { params, path, label: entry.label };
  } catch {
    return null;
  }
}

// ─── Composants UI ───────────────────────────────────────────────────────────
function SectionCard({ icon, title, color = "var(--gold)", children }) {
  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: "22px 24px",
      marginBottom: 18,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${color}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color, flexShrink: 0,
        }}>
          {icon}
        </div>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 16, fontWeight: 600, margin: 0, color: "var(--text)",
        }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function MetricRow({ label, value, note, highlight }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 13,
    }}>
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: highlight ? 700 : 500,
        color: highlight ? "var(--text)" : "var(--text-secondary)", fontSize: highlight ? 15 : 13,
      }}>
        {value}
        {note && <span style={{ fontSize: 11, color: "var(--text-secondary)", marginLeft: 6 }}>{note}</span>}
      </span>
    </div>
  );
}

// ─── Graphique SVG en cercles concentriques ──────────────────────────────────
function PatrimoinePie({ parts }) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  if (total <= 0) return null;

  const RADIUS = 64;
  const STROKE = 18;
  const CX = 80, CY = 80;
  const circumference = 2 * Math.PI * RADIUS;

  let offset = 0;
  const arcs = parts.map(p => {
    const pct = p.value / total;
    const arc = { ...p, dasharray: pct * circumference, dashoffset: -offset * circumference };
    offset += pct;
    return arc;
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
      <svg width={160} height={160} style={{ flexShrink: 0 }}>
        <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke="var(--border)" strokeWidth={STROKE} />
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={CX} cy={CY} r={RADIUS}
            fill="none"
            stroke={arc.color}
            strokeWidth={STROKE}
            strokeDasharray={`${arc.dasharray} ${circumference - arc.dasharray}`}
            strokeDashoffset={arc.dashoffset}
            style={{ transition: "stroke-dasharray 0.6s ease" }}
            transform={`rotate(-90 ${CX} ${CY})`}
          />
        ))}
        <text x={CX} y={CY - 6} textAnchor="middle" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fill: "var(--text-secondary)" }}>Total</text>
        <text x={CX} y={CY + 12} textAnchor="middle" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, fill: "var(--text)" }}>{fmtEur(total)}</text>
      </svg>
      <div style={{ flex: 1, minWidth: 160 }}>
        {parts.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: p.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{p.label}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                {fmtEur(p.value)}
                <span style={{ fontSize: 11, color: "var(--text-secondary)", marginLeft: 6 }}>
                  ({((p.value / total) * 100).toFixed(0)} %)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mur Pro ─────────────────────────────────────────────────────────────────
function ProWall() {
  return (
    <div style={{
      background: "rgba(184,147,74,0.06)",
      border: "1px solid rgba(184,147,74,0.25)",
      borderRadius: 20,
      padding: "32px 28px",
      marginTop: 24,
    }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <Lock size={26} style={{ color: "var(--gold)", flexShrink: 0, marginTop: 2 }} />
        <div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 20, fontWeight: 700, marginBottom: 10, color: "var(--text)",
          }}>
            Synthèse patrimoniale — fonctionnalité Pro
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20 }}>
            La synthèse patrimoniale agrège toutes vos simulations sauvegardées pour dresser un tableau de bord
            complet de votre patrimoine : retraite estimée, capital épargne, immobilier et vue d'ensemble.
            Disponible avec l'abonnement Pro à 2,99 €/mois.
          </p>
          <Link
            to="/pro"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              borderRadius: 12,
              background: "var(--gold)",
              color: "#1a1000",
              fontSize: 15, fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Passer à Pro — 2,99 €/mois →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Notice données incomplètes ───────────────────────────────────────────────
function DataNotice({ paths }) {
  return (
    <div style={{
      background: "rgba(234,179,8,0.07)",
      border: "1px solid rgba(234,179,8,0.25)",
      borderRadius: 12,
      padding: "14px 18px",
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
      marginBottom: 18,
      fontSize: 13,
      color: "var(--text-secondary)",
      lineHeight: 1.6,
    }}>
      <AlertCircle size={16} style={{ color: "#eab308", flexShrink: 0, marginTop: 2 }} />
      <div>
        <strong style={{ color: "var(--text)" }}>Données limitées disponibles.</strong>{" "}
        Les simulations sauvegardées conservent les paramètres via l'URL mais pas les résultats calculés.
        Les estimations ci-dessous sont basées sur les paramètres d'entrée retrouvés.
        Pour des valeurs plus précises, relancez vos simulateurs — ils seront automatiquement mis à jour dans votre synthèse.
      </div>
    </div>
  );
}

// ─── Action recommandée ───────────────────────────────────────────────────────
function ActionItem({ to, label, desc }) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderRadius: 12,
        border: "1px dashed var(--border)",
        background: "transparent",
        marginBottom: 8,
        transition: "background 0.15s",
        cursor: "pointer",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--surface)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)", marginBottom: 2 }}>{label}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{desc}</div>
        </div>
        <ArrowRight size={15} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
      </div>
    </Link>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function SynthesePatrimoniale() {
  const [theme, setTheme] = useTheme();
  const { user, loading, isPro } = useAuth();
  const { getHistory } = useSimHistory();
  const [history, setHistory] = useState([]);

  usePageMeta(
    "Synthèse patrimoniale — Vue d'ensemble | simfinly.com",
    "Agrégez vos simulations retraite, épargne et immobilier en une vue patrimoniale complète."
  );

  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement("meta"); robots.name = "robots"; document.head.appendChild(robots); }
    robots.setAttribute("content", "noindex, follow");
    return () => robots?.setAttribute("content", "index, follow");
  }, []);

  useEffect(() => {
    setHistory(getHistory());
  }, [getHistory]);

  // ─── Classification des entrées par catégorie ───────────────────────────────
  const byCategory = useMemo(() => {
    const result = { retraite: [], immobilier: [], epargne: [], impots: [], autres: [] };
    for (const entry of history) {
      const path = entry.shareUrl?.split("?")[0] ?? "";
      const cats = getCategoriesForPath(path);
      for (const cat of cats) {
        if (result[cat]) result[cat].push(entry);
      }
    }
    return result;
  }, [history]);

  // ─── Tentative d'extraction de métriques depuis les URL params ──────────────
  const metrics = useMemo(() => {
    // Retraite : cherche une simulation synthese-retraite ou cnav
    let pensionMensuelle = null;
    let pensionSource = null;
    const retraiteSims = byCategory.retraite;
    for (const entry of retraiteSims) {
      const data = extractSimData(entry);
      if (!data) continue;
      const p = data.params;
      // synthese-retraite stocke souvent un total
      if (data.path.includes("synthese-retraite") && p.total) {
        pensionMensuelle = Number(p.total);
        pensionSource = entry.label;
        break;
      }
      // cnav : salaire disponible → estimation grossière
      if (data.path.includes("cnav") && p.salaire) {
        const sam = Number(p.salaire) * 12;
        const samPlafonné = Math.min(sam, 48060);
        const duree = 172;
        const trimFaits = (Number(p.anneesFaites || 35) + Number(p.anneesRestantes || 0)) * 4;
        const prorata = Math.min(trimFaits / duree, 1);
        pensionMensuelle = (samPlafonné * 0.5 * prorata) / 12 * 0.93;
        pensionSource = entry.label;
        // Ne break pas : on préfère une synthèse si elle existe
      }
    }

    // Épargne : cherche simulation épargne ou fire
    let capitalFinal = null;
    let capitalSource = null;
    for (const entry of byCategory.epargne) {
      const data = extractSimData(entry);
      if (!data) continue;
      const p = data.params;
      if (p.capitalFinal) { capitalFinal = Number(p.capitalFinal); capitalSource = entry.label; break; }
      // Épargne mensuelle × durée × estimation
      if (p.mensualite && p.duree) {
        const m = Number(p.mensualite), d = Number(p.duree) * 12;
        const r = (Number(p.taux || 4) / 100) / 12;
        capitalFinal = r > 0
          ? m * ((Math.pow(1 + r, d) - 1) / r)
          : m * d;
        capitalFinal += Number(p.initial || 0) * Math.pow(1 + r, d);
        capitalSource = entry.label;
        break;
      }
      if (p.initial) {
        capitalFinal = Number(p.initial);
        capitalSource = entry.label;
        break;
      }
    }

    // Immobilier : cherche simulation emprunt
    let valeurBien = null;
    let immobilierSource = null;
    for (const entry of byCategory.immobilier) {
      const data = extractSimData(entry);
      if (!data) continue;
      const p = data.params;
      if (p.prixBien || p.prix || p.montant) {
        const prixAchat = Number(p.prixBien || p.prix || p.montant);
        const dureeAns = Number(p.duree || 20);
        // Revalorisation 1,5%/an sur la durée du crédit
        valeurBien = prixAchat * Math.pow(1.015, dureeAns);
        immobilierSource = entry.label;
        break;
      }
    }

    return { pensionMensuelle, pensionSource, capitalFinal, capitalSource, valeurBien, immobilierSource };
  }, [byCategory]);

  // ─── Vue d'ensemble patrimoniale ────────────────────────────────────────────
  const pieParts = useMemo(() => {
    const parts = [];
    if (metrics.capitalFinal > 0) parts.push({ label: "Épargne / Placements", value: Math.round(metrics.capitalFinal), color: "#22c55e" });
    if (metrics.valeurBien > 0) parts.push({ label: "Immobilier (valeur estimée)", value: Math.round(metrics.valeurBien), color: "#3b82f6" });
    // Capital retraite capitalisé (pension × 240 mois = 20 ans) comme proxy
    if (metrics.pensionMensuelle > 0) parts.push({ label: "Retraite (capital équiv. 20 ans)", value: Math.round(metrics.pensionMensuelle * 240), color: "#b8934a" });
    return parts;
  }, [metrics]);

  // ─── Actions recommandées ────────────────────────────────────────────────────
  const actions = useMemo(() => {
    const list = [];
    if (byCategory.retraite.length === 0) {
      list.push({ to: "/simulateurs/synthese-retraite", label: "Estimez votre retraite totale", desc: "Synthèse régimes de base + complémentaire" });
    }
    if (byCategory.epargne.length === 0) {
      list.push({ to: "/simulateurs/fire", label: "Calculez votre objectif FIRE", desc: "Indépendance financière & retraite anticipée" });
    }
    if (byCategory.immobilier.length === 0) {
      list.push({ to: "/simulateurs/emprunt-immobilier", label: "Simulez votre emprunt immobilier", desc: "Mensualités, coût total, capacité d'emprunt" });
    }
    if (byCategory.impots.length === 0) {
      list.push({ to: "/simulateurs/impot-revenu", label: "Optimisez votre fiscalité", desc: "Calcul impôt sur le revenu 2025" });
    }
    return list;
  }, [byCategory]);

  const hasData = metrics.pensionMensuelle || metrics.capitalFinal || metrics.valeurBien;
  const hasHistory = history.length > 0;

  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 16 };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontFamily: "'Hanken Grotesk', sans-serif" }}>
      Chargement…
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 80px" }}>
        {/* Breadcrumb */}
        <div style={{ padding: "24px 0 8px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}<span style={{ color: "var(--text)" }}>Synthèse patrimoniale</span>
        </div>

        <SimulateurHeader
          icon={<Shield size={34} />}
          badge="Pro · Vue agrégée"
          title="Synthèse patrimoniale"
          subtitle="Votre patrimoine global en un coup d'oeil"
          desc="Agrégation de vos simulations sauvegardées en une vue patrimoniale unifiée : retraite, épargne, immobilier et fiscalité."
        />

        {/* Mur Pro */}
        {!isPro && <ProWall />}

        {isPro && (
          <>
            {/* Aucune simulation */}
            {!hasHistory && (
              <div style={{ ...card, padding: "40px 28px", textAlign: "center", marginTop: 8 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
                  Aucune simulation sauvegardée
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 24px" }}>
                  Votre synthèse patrimoniale se construit automatiquement à partir de vos simulations.
                  Lancez un simulateur et cliquez sur « Sauvegarder » pour commencer.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <Link to="/simulateurs/synthese-retraite" style={{ padding: "10px 18px", borderRadius: 10, background: "rgba(184,147,74,0.12)", color: "var(--gold)", border: "1px solid rgba(184,147,74,0.3)", textDecoration: "none", fontSize: 13 }}>
                    Synthèse retraite →
                  </Link>
                  <Link to="/simulateurs/epargne" style={{ padding: "10px 18px", borderRadius: 10, background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)", textDecoration: "none", fontSize: 13 }}>
                    Simulateur épargne →
                  </Link>
                  <Link to="/simulateurs/emprunt-immobilier" style={{ padding: "10px 18px", borderRadius: 10, background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.25)", textDecoration: "none", fontSize: 13 }}>
                    Emprunt immobilier →
                  </Link>
                </div>
              </div>
            )}

            {hasHistory && (
              <>
                {/* Notice données */}
                <DataNotice />

                {/* Résumé nombre de simulations */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
                  {[
                    { label: "Retraite", count: byCategory.retraite.length, color: "#b8934a" },
                    { label: "Épargne", count: byCategory.epargne.length, color: "#22c55e" },
                    { label: "Immobilier", count: byCategory.immobilier.length, color: "#3b82f6" },
                    { label: "Impôts", count: byCategory.impots.length, color: "#ef4444" },
                  ].map(({ label, count, color }) => (
                    <div key={label} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 18px" }}>
                      <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color, marginBottom: 4 }}>{label}</div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: count > 0 ? "var(--text)" : "var(--text-secondary)" }}>
                        {count}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>simulation{count > 1 ? "s" : ""}</div>
                    </div>
                  ))}
                </div>

                {/* Section Retraite */}
                <SectionCard icon={<TrendingUp size={18} />} title="Votre retraite estimée" color="#b8934a">
                  {byCategory.retraite.length === 0 ? (
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", padding: "12px 0" }}>
                      Aucune simulation retraite sauvegardée.{" "}
                      <Link to="/simulateurs/synthese-retraite" style={{ color: "var(--gold)" }}>Lancer la synthèse retraite →</Link>
                    </div>
                  ) : (
                    <>
                      {metrics.pensionMensuelle ? (
                        <>
                          <div style={{ textAlign: "center", padding: "16px 0 20px" }}>
                            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 }}>
                              Pension mensuelle estimée (base CNAV)
                            </div>
                            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 38, fontWeight: 700, color: "#b8934a" }}>
                              {fmtEur(Math.round(metrics.pensionMensuelle))}
                            </div>
                            {metrics.pensionSource && (
                              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>
                                Source : {metrics.pensionSource}
                              </div>
                            )}
                          </div>
                          <MetricRow label="Simulation utilisée" value={metrics.pensionSource || "—"} />
                          <MetricRow label="Total sur 20 ans (240 mois)" value={fmtEur(Math.round(metrics.pensionMensuelle * 240))} highlight />
                        </>
                      ) : (
                        <div style={{ fontSize: 13, color: "var(--text-secondary)", padding: "8px 0" }}>
                          Simulations retraite trouvées ({byCategory.retraite.length}) mais paramètres insuffisants pour estimer la pension.{" "}
                          <Link to="/simulateurs/cnav" style={{ color: "var(--gold)" }}>Relancer le simulateur CNAV →</Link>
                        </div>
                      )}
                      <div style={{ marginTop: 10 }}>
                        {byCategory.retraite.slice(0, 3).map((e, i) => (
                          <div key={i} style={{ fontSize: 12, color: "var(--text-secondary)", padding: "3px 0" }}>
                            · <Link to={e.shareUrl?.replace(/^https?:\/\/[^/]+/, "") ?? "#"} style={{ color: "var(--text-secondary)", textDecoration: "underline dotted" }}>{e.label}</Link>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </SectionCard>

                {/* Section Épargne */}
                <SectionCard icon={<PiggyBank size={18} />} title="Votre capital épargne" color="#22c55e">
                  {byCategory.epargne.length === 0 ? (
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", padding: "12px 0" }}>
                      Aucune simulation épargne sauvegardée.{" "}
                      <Link to="/simulateurs/epargne" style={{ color: "#22c55e" }}>Lancer le simulateur épargne →</Link>
                    </div>
                  ) : (
                    <>
                      {metrics.capitalFinal ? (
                        <>
                          <div style={{ textAlign: "center", padding: "16px 0 20px" }}>
                            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 }}>
                              Capital projeté à terme
                            </div>
                            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 38, fontWeight: 700, color: "#22c55e" }}>
                              {fmtEur(Math.round(metrics.capitalFinal))}
                            </div>
                            {metrics.capitalSource && (
                              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>
                                Source : {metrics.capitalSource}
                              </div>
                            )}
                          </div>
                          <MetricRow label="Simulation utilisée" value={metrics.capitalSource || "—"} />
                        </>
                      ) : (
                        <div style={{ fontSize: 13, color: "var(--text-secondary)", padding: "8px 0" }}>
                          Simulations épargne trouvées ({byCategory.epargne.length}) mais paramètres insuffisants pour estimer le capital.{" "}
                          <Link to="/simulateurs/epargne" style={{ color: "#22c55e" }}>Relancer le simulateur épargne →</Link>
                        </div>
                      )}
                      <div style={{ marginTop: 10 }}>
                        {byCategory.epargne.slice(0, 3).map((e, i) => (
                          <div key={i} style={{ fontSize: 12, color: "var(--text-secondary)", padding: "3px 0" }}>
                            · <Link to={e.shareUrl?.replace(/^https?:\/\/[^/]+/, "") ?? "#"} style={{ color: "var(--text-secondary)", textDecoration: "underline dotted" }}>{e.label}</Link>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </SectionCard>

                {/* Section Immobilier */}
                <SectionCard icon={<Home size={18} />} title="Votre patrimoine immobilier" color="#3b82f6">
                  {byCategory.immobilier.length === 0 ? (
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", padding: "12px 0" }}>
                      Aucune simulation immobilière sauvegardée.{" "}
                      <Link to="/simulateurs/emprunt-immobilier" style={{ color: "#3b82f6" }}>Lancer le simulateur emprunt →</Link>
                    </div>
                  ) : (
                    <>
                      {metrics.valeurBien ? (
                        <>
                          <div style={{ textAlign: "center", padding: "16px 0 20px" }}>
                            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 6 }}>
                              Valeur estimée du bien (revalorisation +1,5 %/an)
                            </div>
                            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 38, fontWeight: 700, color: "#3b82f6" }}>
                              {fmtEur(Math.round(metrics.valeurBien))}
                            </div>
                            {metrics.immobilierSource && (
                              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>
                                Source : {metrics.immobilierSource}
                              </div>
                            )}
                          </div>
                          <MetricRow label="Simulation utilisée" value={metrics.immobilierSource || "—"} />
                          <MetricRow label="Revalorisation annuelle appliquée" value="+1,5 % / an" />
                        </>
                      ) : (
                        <div style={{ fontSize: 13, color: "var(--text-secondary)", padding: "8px 0" }}>
                          Simulations immobilières trouvées ({byCategory.immobilier.length}) mais prix du bien non retrouvé dans les paramètres.{" "}
                          <Link to="/simulateurs/emprunt-immobilier" style={{ color: "#3b82f6" }}>Relancer le simulateur →</Link>
                        </div>
                      )}
                      <div style={{ marginTop: 10 }}>
                        {byCategory.immobilier.slice(0, 3).map((e, i) => (
                          <div key={i} style={{ fontSize: 12, color: "var(--text-secondary)", padding: "3px 0" }}>
                            · <Link to={e.shareUrl?.replace(/^https?:\/\/[^/]+/, "") ?? "#"} style={{ color: "var(--text-secondary)", textDecoration: "underline dotted" }}>{e.label}</Link>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </SectionCard>

                {/* Vue d'ensemble */}
                {pieParts.length > 0 && (
                  <SectionCard icon={<Shield size={18} />} title="Vue d'ensemble — Répartition estimée" color="var(--gold)">
                    <PatrimoinePie parts={pieParts} />
                    <div style={{ marginTop: 14, fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      * La retraite est convertie en capital équivalent (pension × 240 mois) pour la comparaison.
                      Les montants sont des estimations indicatives basées sur vos paramètres de simulation.
                    </div>
                  </SectionCard>
                )}

                {/* Ad */}
                <div style={{ margin: "8px 0 18px" }}>
                  <AdUnit slot="auto" format="auto" />
                </div>

                {/* Actions recommandées */}
                {actions.length > 0 && (
                  <div style={{ ...card, padding: "22px 24px", marginBottom: 18 }}>
                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 14, color: "var(--text)" }}>
                      Actions recommandées
                    </h2>
                    {actions.map((a, i) => (
                      <ActionItem key={i} to={a.to} label={a.label} desc={a.desc} />
                    ))}
                  </div>
                )}

                {/* Lien vers tableau de bord */}
                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <Link to="/tableau-de-bord" style={{ fontSize: 13, color: "var(--gold)", textDecoration: "none" }}>
                    ← Retour au tableau de bord
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
