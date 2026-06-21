import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const OBJECTIVES = [
  {
    id: "retraite",
    emoji: "🏖️",
    label: "Préparer ma retraite",
    desc: "Estimer ma pension, optimiser mon départ",
    simulators: [
      { path: "/simulateurs/synthese-retraite", label: "Synthèse retraite tous régimes" },
      { path: "/simulateurs/agirc-arrco", label: "Complémentaire Agirc-Arrco" },
      { path: "/simulateurs/per", label: "Plan d'Épargne Retraite (PER)" },
    ],
  },
  {
    id: "immobilier",
    emoji: "🏠",
    label: "Acheter un bien immobilier",
    desc: "Calculer ma capacité d'emprunt et le coût",
    simulators: [
      { path: "/simulateurs/emprunt-immobilier", label: "Emprunt immobilier" },
      { path: "/simulateurs/ptz", label: "Prêt à Taux Zéro (PTZ)" },
      { path: "/simulateurs/rendement-locatif", label: "Rendement locatif" },
    ],
  },
  {
    id: "epargne",
    emoji: "💰",
    label: "Faire fructifier mon épargne",
    desc: "Intérêts composés, assurance-vie, budget",
    simulators: [
      { path: "/simulateurs/epargne", label: "Épargne & intérêts composés" },
      { path: "/simulateurs/assurance-vie", label: "Assurance-vie" },
      { path: "/simulateurs/budget", label: "Budget 50/30/20" },
    ],
  },
  {
    id: "fire",
    emoji: "🔥",
    label: "Viser l'indépendance financière",
    desc: "FIRE, patrimoine global, liberté financière",
    simulators: [
      { path: "/simulateurs/fire", label: "FIRE & liberté financière" },
      { path: "/simulateurs/patrimoine", label: "Patrimoine global" },
      { path: "/simulateurs/comparateur", label: "Comparateur d'actifs" },
    ],
  },
];

const LS_KEY = "simfinly_onboarded";

export function shouldShowOnboarding() {
  try { return !localStorage.getItem(LS_KEY); } catch { return false; }
}

export function markOnboarded() {
  try { localStorage.setItem(LS_KEY, "1"); } catch {}
}

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  function handleObjective(obj) {
    setSelected(obj);
    setStep(1);
  }

  function handleClose() {
    markOnboarded();
    onClose();
  }

  function handleSimulator(path) {
    handleClose();
    navigate(path);
  }

  const overlay = {
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "20px", fontFamily: "'Hanken Grotesk', sans-serif",
  };

  const box = {
    background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: 24, maxWidth: 460, width: "100%",
    padding: "32px 28px", position: "relative",
    boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
    maxHeight: "90vh", overflowY: "auto",
  };

  const closeBtn = {
    position: "absolute", top: 14, right: 14,
    background: "none", border: "none",
    color: "var(--text-secondary)", cursor: "pointer", padding: 6,
    borderRadius: 8, display: "flex",
  };

  const objBtn = {
    display: "flex", alignItems: "center", gap: 14,
    padding: "14px 16px", borderRadius: 14, cursor: "pointer",
    background: "var(--card-bg)", border: "1px solid var(--border)",
    textAlign: "left", fontFamily: "'Hanken Grotesk', sans-serif",
    width: "100%", transition: "border-color 0.15s",
  };

  const simBtn = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 16px", borderRadius: 12, cursor: "pointer",
    background: "rgba(184,147,74,0.08)", border: "1px solid var(--border-gold)",
    color: "var(--text)", textAlign: "left", width: "100%",
    fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 14, fontWeight: 500,
  };

  return (
    <div style={overlay} onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
      <div style={box}>
        <button onClick={handleClose} style={closeBtn} aria-label="Fermer">
          <X size={16} />
        </button>

        {step === 0 && (
          <>
            <div style={{ fontSize: 36, marginBottom: 12 }}>👋</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
              Bienvenue sur Simfinly
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
              Quel est votre objectif principal ? On vous guide vers les bons simulateurs.
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {OBJECTIVES.map(obj => (
                <button key={obj.id} onClick={() => handleObjective(obj)} style={objBtn}>
                  <span style={{ fontSize: 26, flexShrink: 0 }}>{obj.emoji}</span>
                  <span>
                    <span style={{ display: "block", fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{obj.label}</span>
                    <span style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{obj.desc}</span>
                  </span>
                </button>
              ))}
            </div>
            <p style={{ marginTop: 20, fontSize: 12, color: "var(--text-secondary)", textAlign: "center" }}>
              Tous les simulateurs restent accessibles depuis la page d'accueil.
            </p>
          </>
        )}

        {step === 1 && selected && (
          <>
            <button
              onClick={() => setStep(0)}
              style={{ fontSize: 12, color: "var(--gold)", background: "none", border: "none", cursor: "pointer", padding: "0 0 18px", fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              ← Retour
            </button>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{selected.emoji}</div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>
              Vos simulateurs recommandés
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.6 }}>
              Commencez par l'un de ces simulateurs — ils prennent moins de 2 minutes.
            </p>
            <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
              {selected.simulators.map(sim => (
                <button key={sim.path} onClick={() => handleSimulator(sim.path)} style={simBtn}>
                  <span>{sim.label}</span>
                  <span style={{ color: "var(--gold)", fontSize: 16 }}>→</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleClose}
              style={{ fontSize: 13, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              Explorer tous les simulateurs →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
