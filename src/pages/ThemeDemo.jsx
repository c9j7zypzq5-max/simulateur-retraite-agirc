import { useState, useEffect } from "react";
import { useTheme } from "../hooks/useTheme.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

/* ──────────────────────────────────────────────
   Variant A — Sliding dual pill
   Both options always visible, gold pill slides
────────────────────────────────────────────── */
function VariantA({ dark, toggle }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={e => e.key === "Enter" && toggle()}
      aria-label="Basculer le thème"
      style={{
        display: "inline-flex",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 32, padding: 3, cursor: "pointer",
        userSelect: "none", gap: 0,
      }}
    >
      {[
        { id: "light", icon: "☀", label: "Clair" },
        { id: "dark",  icon: "🌙", label: "Sombre" },
      ].map(({ id, icon, label }) => {
        const active = dark ? id === "dark" : id === "light";
        return (
          <div key={id} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 18px", borderRadius: 24, fontSize: "0.82rem",
            fontWeight: active ? 600 : 400,
            background: active ? "linear-gradient(135deg,#b8934a,#e8c06a)" : "transparent",
            color: active ? "#060e1c" : "var(--text-secondary)",
            transition: "all 0.25s ease",
          }}>
            <span>{icon}</span>
            {label}
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Variant B — Minimal glow icon
   Circle button, halo on hover/dark
────────────────────────────────────────────── */
function VariantB({ dark, toggle }) {
  return (
    <button
      onClick={toggle}
      aria-label="Basculer le thème"
      style={{
        width: 46, height: 46, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid rgba(184,147,74,0.35)",
        background: dark ? "rgba(184,147,74,0.08)" : "rgba(0,0,0,0.06)",
        cursor: "pointer", fontSize: "1.25rem",
        boxShadow: dark ? "0 0 16px rgba(232,192,106,0.2)" : "none",
        transition: "all 0.3s ease",
        minHeight: 44,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 0 20px rgba(232,192,106,0.4)";
        e.currentTarget.style.borderColor = "rgba(184,147,74,0.7)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = dark ? "0 0 16px rgba(232,192,106,0.2)" : "none";
        e.currentTarget.style.borderColor = "rgba(184,147,74,0.35)";
      }}
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}

/* ──────────────────────────────────────────────
   Variant C — iOS switch with side labels
   Classic toggle switch, gold knob
────────────────────────────────────────────── */
function VariantC({ dark, toggle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, userSelect: "none" }}>
      <span style={{
        fontSize: "0.82rem", fontWeight: !dark ? 500 : 400,
        color: !dark ? "var(--gold)" : "var(--text-secondary)",
        transition: "color 0.2s",
      }}>
        ☀ Clair
      </span>
      <div
        role="switch"
        aria-checked={dark}
        tabIndex={0}
        onClick={toggle}
        onKeyDown={e => e.key === "Enter" && toggle()}
        style={{
          width: 50, height: 28, borderRadius: 14, cursor: "pointer",
          background: dark ? "rgba(184,147,74,0.3)" : "rgba(148,163,184,0.2)",
          border: "1px solid rgba(184,147,74,0.4)",
          position: "relative", transition: "background 0.25s",
          flexShrink: 0,
        }}
      >
        <div style={{
          position: "absolute", top: 4, left: dark ? 24 : 4,
          width: 18, height: 18, borderRadius: "50%",
          background: "linear-gradient(135deg,#b8934a,#e8c06a)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
      <span style={{
        fontSize: "0.82rem", fontWeight: dark ? 500 : 400,
        color: dark ? "var(--gold)" : "var(--text-secondary)",
        transition: "color 0.2s",
      }}>
        🌙 Sombre
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Variant D — Segmented control (Material style)
   Both buttons in a contained group
────────────────────────────────────────────── */
function VariantD({ dark, toggle }) {
  return (
    <div style={{
      display: "inline-flex",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid var(--border)",
      borderRadius: 12, padding: 4, gap: 2,
    }}>
      {[
        { id: "light", icon: "☀️", label: "Clair" },
        { id: "dark",  icon: "🌙", label: "Sombre" },
      ].map(({ id, icon, label }) => {
        const active = dark ? id === "dark" : id === "light";
        return (
          <button
            key={id}
            onClick={active ? undefined : toggle}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 16px", borderRadius: 8, fontSize: "0.82rem",
              border: "none", cursor: active ? "default" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              background: active ? "var(--card-bg)" : "transparent",
              color: active ? "var(--gold)" : "var(--text-secondary)",
              fontWeight: active ? 500 : 400,
              boxShadow: active ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
              transition: "all 0.2s",
              minHeight: 36,
            }}
          >
            {icon} {label}
          </button>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Demo page
────────────────────────────────────────────── */
export default function ThemeDemo() {
  const [theme, setTheme] = useTheme();
  const isDark = theme === "dark";

  const [stateA, setStateA] = useState(isDark);
  const [stateB, setStateB] = useState(isDark);
  const [stateC, setStateC] = useState(isDark);
  const [stateD, setStateD] = useState(isDark);

  useEffect(() => {
    document.title = "Variantes thème — mesimulateurs.fr";
  }, []);

  const variants = [
    {
      id: "A",
      name: "Double pill",
      desc: "Les deux options toujours visibles. Un fond doré glisse vers l'option active. Intuitif et moderne.",
      recommended: true,
      component: <VariantA dark={stateA} toggle={() => setStateA(d => !d)} />,
    },
    {
      id: "B",
      name: "Icône avec halo",
      desc: "Bouton circulaire minimaliste. Halo lumineux quand le mode sombre est actif. Très épuré.",
      component: <VariantB dark={stateB} toggle={() => setStateB(d => !d)} />,
    },
    {
      id: "C",
      name: "Switch iOS",
      desc: "Commutateur à bascule avec labels de chaque côté. Familier, explicite, accessible.",
      component: <VariantC dark={stateC} toggle={() => setStateC(d => !d)} />,
    },
    {
      id: "D",
      name: "Segmented control",
      desc: "Deux boutons dans un conteneur, l'actif est surélevé avec ombre. Style Material/Windows.",
      component: <VariantD dark={stateD} toggle={() => setStateD(d => !d)} />,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(184,147,74,0.1)", border: "1px solid var(--border-gold)",
            color: "var(--gold)", fontSize: "0.75rem", fontWeight: 500,
            letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "6px 16px", borderRadius: 20, marginBottom: 24,
          }}>
            ✦ Démo interactie
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 700,
            color: "var(--text)", marginBottom: 14, lineHeight: 1.2,
          }}>
            Choisissez votre bouton de thème
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 560 }}>
            4 propositions interactives — testez chacune puis dites-moi laquelle vous préférez pour l'implémenter sur tout le site.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 24 }}>
          {variants.map(v => (
            <div key={v.id} style={{
              background: "var(--card-bg)", border: "1px solid var(--border)",
              borderRadius: 16, padding: 28,
              display: "flex", flexDirection: "column", gap: 20,
              position: "relative", overflow: "hidden",
            }}>
              {v.recommended && (
                <div style={{
                  position: "absolute", top: 16, right: 16,
                  fontSize: 10, padding: "3px 10px", borderRadius: 12,
                  background: "rgba(184,147,74,0.12)", color: "var(--gold)",
                  border: "1px solid var(--border-gold)",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                  Recommandé
                </div>
              )}
              <div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.25rem", fontWeight: 700, color: "var(--text)",
                  marginBottom: 8,
                }}>
                  Variante {v.id} — {v.name}
                </div>
                <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{v.desc}</p>
              </div>
              {/* Preview zone */}
              <div style={{
                background: "rgba(255,255,255,0.02)", border: "1px dashed var(--border)",
                borderRadius: 12, padding: "28px 20px",
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: 90,
              }}>
                {v.component}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div style={{
          marginTop: 40, padding: "18px 24px",
          background: "rgba(184,147,74,0.06)", border: "1px solid var(--border-gold)",
          borderRadius: 12,
        }}>
          <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
            <strong style={{ color: "var(--gold)" }}>Note :</strong> chaque variante est indépendante — elles ne modifient pas le thème global du site. Dites-moi laquelle vous voulez, je l'implémente sur toutes les pages immédiatement.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
