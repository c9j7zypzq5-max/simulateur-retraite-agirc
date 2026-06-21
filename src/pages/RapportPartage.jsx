// Route à ajouter dans src/App.jsx :
//   <Route path="/rapport/:id" element={<RapportPartage />} />

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function decodeId(id) {
  try {
    // Supporte base64url (remplace - par + et _ par /)
    const b64 = id.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

function relativeDate(iso) {
  if (!iso) return "";
  try {
    const ms = Date.now() - new Date(iso).getTime();
    const d = Math.floor(ms / 86400000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000);
    if (d > 30) return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    if (d > 0) return `il y a ${d} jour${d > 1 ? "s" : ""}`;
    if (h > 0) return `il y a ${h} heure${h > 1 ? "s" : ""}`;
    if (m > 0) return `il y a ${m} minute${m > 1 ? "s" : ""}`;
    return "à l'instant";
  } catch {
    return iso;
  }
}

function formatParamKey(key) {
  // Convertit camelCase en libellé lisible
  const labels = {
    salaire: "Salaire mensuel brut",
    salaireAnnuel: "Salaire annuel brut",
    anneeNaissance: "Année de naissance",
    anneesFaites: "Années cotisées",
    anneesRestantes: "Années restantes",
    trimestres: "Trimestres validés",
    ageDépart: "Âge de départ",
    revenu: "Revenu annuel",
    duree: "Durée",
    taux: "Taux",
    apport: "Apport",
    mensualite: "Mensualité",
  };
  return labels[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
}

function formatParamValue(key, val) {
  if (val === null || val === undefined) return "—";
  // Clés monétaires
  const moneyKeys = ["salaire", "salaireAnnuel", "revenu", "apport", "mensualite"];
  if (moneyKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
    return Number(val).toLocaleString("fr-FR") + " €";
  }
  // Clés pourcentage
  if (key.toLowerCase().includes("taux") && Number(val) < 100) {
    return Number(val).toLocaleString("fr-FR") + " %";
  }
  // Durée / trimestres
  if (key.toLowerCase().includes("annee") && !key.toLowerCase().includes("naissance")) {
    return `${val} ans`;
  }
  if (key.toLowerCase().includes("trimestre")) {
    return `${val} trim.`;
  }
  return String(val);
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function RapportPartage() {
  const [theme, setTheme] = useTheme();
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const [copyErr, setCopyErr] = useState(false);

  usePageMeta(
    "Rapport de simulation | simfinly.com",
    "Rapport de simulation partagé depuis simfinly.com.",
  );

  // noindex — contenu généré par l'utilisateur
  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, follow");
    return () => robots && robots.setAttribute("content", "index, follow");
  }, []);

  const data = id ? decodeId(id) : null;

  // ─── Gestion URL de retour vers le simulateur ────────────────────────────
  function buildSimulatorUrl() {
    if (!data) return "/";
    // shareUrl contient déjà l'URL complète avec ?s=...
    if (data.shareUrl) {
      // Extraire le pathname + search de la shareUrl
      try {
        const u = new URL(data.shareUrl, window.location.origin);
        return u.pathname + u.search;
      } catch {
        return data.shareUrl;
      }
    }
    // Fallback : reconstruire depuis path + params
    if (data.path) {
      const params = data.params
        ? "?" + Object.entries(data.params)
            .filter(([, v]) => v !== null && v !== undefined)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join("&")
        : "";
      return data.path + params;
    }
    return "/";
  }

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setCopyErr(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyErr(true);
      setTimeout(() => setCopyErr(false), 3000);
    }
  }

  // ─── Styles ───────────────────────────────────────────────────────────────
  const cardStyle = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "24px 20px",
    boxShadow: "var(--card-shadow)",
    marginBottom: 16,
  };

  const btnPrimary = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 22px",
    borderRadius: 12,
    border: "none",
    background: "var(--primary)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    textDecoration: "none",
  };

  const btnSecondary = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 22px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "none",
    color: "var(--text)",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "'Hanken Grotesk', sans-serif",
  };

  // ─── Erreur de décodage ───────────────────────────────────────────────────
  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
        <Navbar theme={theme} setTheme={setTheme} />
        <div style={{ maxWidth: 560, margin: "80px auto", padding: "0 16px", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>⚠️</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
            Rapport introuvable
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28 }}>
            Ce lien de rapport est invalide ou a été modifié. Vérifiez l'URL ou demandez un nouveau lien à son auteur.
          </p>
          <Link to="/" style={btnPrimary}>
            Retour à l'accueil
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── Extraire nom / date / params / label ─────────────────────────────────
  const simulatorName = data.simulator || data.name || "Simulation";
  const simLabel      = data.label || simulatorName;
  const savedAt       = data.savedAt;
  const simulatorUrl  = buildSimulatorUrl();

  // Paramètres à afficher : depuis data.params ou extraire les clés connues
  let paramsToShow = [];
  if (data.params && typeof data.params === "object") {
    paramsToShow = Object.entries(data.params)
      .filter(([, v]) => v !== null && v !== undefined && v !== "");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 16px 60px" }}>

        {/* Fil d'Ariane */}
        <div style={{ padding: "0 0 20px", fontSize: 12, color: "var(--text-secondary)" }}>
          <Link to="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          {" · "}<span style={{ color: "var(--text)" }}>Rapport partagé</span>
        </div>

        {/* En-tête du rapport */}
        <div style={{ ...cardStyle, borderColor: "var(--border-gold)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-mid)", marginBottom: 6 }}>
                Rapport de simulation
              </div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(20px,4vw,28px)", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                {simLabel}
              </h1>
              {savedAt && (
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  Sauvegardée {relativeDate(savedAt)}
                </div>
              )}
            </div>
            <div style={{ fontSize: 36 }}>📊</div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", marginTop: 16, paddingTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to={simulatorUrl} style={btnPrimary}>
              Ouvrir le simulateur →
            </Link>
            <button
              onClick={handleCopyUrl}
              style={{
                ...btnSecondary,
                borderColor: copied ? "rgba(34,197,94,0.4)" : "var(--border)",
                color: copied ? "#22c55e" : "var(--text)",
              }}
            >
              {copied ? "✓ Lien copié !" : "🔗 Partager"}
            </button>
            {copyErr && (
              <span style={{ fontSize: 12, color: "#f87171", alignSelf: "center" }}>
                Impossible de copier — copiez l'URL manuellement.
              </span>
            )}
          </div>
        </div>

        {/* Paramètres */}
        {paramsToShow.length > 0 && (
          <div style={cardStyle}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>
              Paramètres utilisés
            </h2>
            <div style={{ display: "grid", gap: 8 }}>
              {paramsToShow.map(([key, val]) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "var(--card-bg)",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    {formatParamKey(key)}
                  </span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--text)", flexShrink: 0 }}>
                    {formatParamValue(key, val)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note bas de page */}
        <div style={{ ...cardStyle, background: "var(--card-bg)" }}>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--text)" }}>Simulation calculée sur</strong>{" "}
            <a href="https://www.simfinly.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-mid)", textDecoration: "none" }}>
              simfinly.com
            </a>{" "}
            — Simulateurs financiers gratuits.
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            ⚠️ Ce rapport est à titre indicatif uniquement. Les résultats sont basés sur les paramètres saisis et les règles en vigueur à la date de la simulation. Ils ne constituent pas un conseil financier ou juridique.
          </div>
        </div>

        {/* Actions bas */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
          <Link to="/" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>
            ← Tous les simulateurs
          </Link>
          <span style={{ color: "var(--border)" }}>·</span>
          <Link to={simulatorUrl} style={{ fontSize: 13, color: "var(--gold-mid)", textDecoration: "none" }}>
            Ouvrir et modifier →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
