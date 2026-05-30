import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

function IosToggle({ theme, setTheme, compact = false }) {
  const isDark = theme === "dark";
  return compact ? (
    <button
      onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      role="switch" aria-checked={isDark}
      style={{
        width: 54, height: 28, borderRadius: 14, padding: 0, border: "none",
        background: isDark ? "rgba(25,40,90,0.6)" : "rgba(255,210,80,0.2)",
        cursor: "pointer", position: "relative", flexShrink: 0,
        boxShadow: isDark
          ? "inset 0 1px 3px rgba(0,0,50,0.5), 0 0 0 1px rgba(80,120,210,0.22)"
          : "inset 0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(210,160,40,0.45)",
        transition: "background 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div style={{
        position: "absolute", top: 3,
        left: isDark ? 3 : 29,
        width: 22, height: 22, borderRadius: "50%",
        background: isDark
          ? "linear-gradient(145deg,#1c2f66,#2b4396)"
          : "linear-gradient(145deg,#f8d050,#e89010)",
        boxShadow: isDark ? "0 1px 6px rgba(40,80,200,0.4)" : "0 1px 6px rgba(240,160,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, userSelect: "none",
        transition: "left 0.28s cubic-bezier(0.4,0,0.2,1), background 0.35s ease, box-shadow 0.35s ease",
      }}>
        {isDark ? "🌙" : "☀️"}
      </div>
    </button>
  ) : (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 0" }}>
      <span style={{ fontSize: "0.86rem", color: "var(--text-secondary)" }}>
        {isDark ? "Mode sombre" : "Mode clair"}
      </span>
      <button
        onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
        aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
        role="switch" aria-checked={isDark}
        style={{
          width: 54, height: 28, borderRadius: 14, padding: 0, border: "none",
          background: isDark ? "rgba(25,40,90,0.6)" : "rgba(255,210,80,0.2)",
          cursor: "pointer", position: "relative", flexShrink: 0,
          boxShadow: isDark
            ? "inset 0 1px 3px rgba(0,0,50,0.5), 0 0 0 1px rgba(80,120,210,0.22)"
            : "inset 0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(210,160,40,0.45)",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <div style={{
          position: "absolute", top: 3,
          left: isDark ? 3 : 29,
          width: 22, height: 22, borderRadius: "50%",
          background: isDark
            ? "linear-gradient(145deg,#1c2f66,#2b4396)"
            : "linear-gradient(145deg,#f8d050,#e89010)",
          boxShadow: isDark ? "0 1px 6px rgba(40,80,200,0.4)" : "0 1px 6px rgba(240,160,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, userSelect: "none",
          transition: "left 0.28s cubic-bezier(0.4,0,0.2,1), background 0.35s ease, box-shadow 0.35s ease",
        }}>
          {isDark ? "🌙" : "☀️"}
        </div>
      </button>
    </div>
  );
}

const NAV_ITEMS = [
  { path: "/",                                  icon: "🏠", title: "Accueil",                 subtitle: "Tous les simulateurs" },
  { path: "/simulateurs/agirc-arrco",           icon: "🏆", title: "Agirc-Arrco",             subtitle: "Retraite complémentaire" },
  { path: "/simulateurs/cnav",                  icon: "🏛",  title: "CNAV",                    subtitle: "Régime général" },
  { path: "/simulateurs/fonction-publique",     icon: "⚖️", title: "Fonction publique",        subtitle: "Retraite statutaire" },
  { path: "/simulateurs/independants",          icon: "💼", title: "Indépendants / TNS",       subtitle: "SSI + RCI" },
  { path: "/simulateurs/ircantec",              icon: "🏢", title: "IRCANTEC",                 subtitle: "Agents non-titulaires" },
  { path: "/simulateurs/retraite-progressive",  icon: "📅", title: "Retraite progressive",     subtitle: "Mi-temps + pension" },
];

export default function Navbar({ theme, setTheme }) {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const onSim = pathname.startsWith("/simulateurs/");
  const current = NAV_ITEMS.find(i => i.path === pathname);

  const close = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    if (!drawerOpen) return;
    const handle = e => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [drawerOpen, close]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: theme === "dark" ? "rgba(6,14,28,0.92)" : "rgba(250,246,239,0.94)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 16px 0 4px",
        height: 56,
        display: "flex", alignItems: "center", gap: 4,
      }}>
        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Ouvrir la navigation"
          aria-expanded={drawerOpen}
          style={{
            background: "transparent", border: "none",
            color: "var(--text)", cursor: "pointer",
            padding: "10px 12px", borderRadius: 8,
            display: "flex", flexDirection: "column", gap: 5,
            alignItems: "center", justifyContent: "center",
            flexShrink: 0, minHeight: 44,
          }}
        >
          <span style={{ display: "block", width: 20, height: 2, background: "currentColor", borderRadius: 2 }} />
          <span style={{ display: "block", width: 20, height: 2, background: "currentColor", borderRadius: 2 }} />
          <span style={{ display: "block", width: 20, height: 2, background: "currentColor", borderRadius: 2 }} />
        </button>

        {/* Logo */}
        <Link to="/" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.15rem", fontWeight: 700,
          color: "var(--gold)", textDecoration: "none",
          letterSpacing: "0.02em", flexShrink: 0,
        }}>mesimulateurs.fr</Link>

        {/* Center breadcrumb — desktop only */}
        <div className="nav-center" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {onSim && (
            <Link to="/" style={{
              fontSize: 12, color: "var(--text-secondary)", textDecoration: "none",
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 20,
              border: "1px solid var(--border)",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--border-gold)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              ← Tous les simulateurs
            </Link>
          )}
          {!onSim && (
            <span style={{ fontSize: 12, color: "var(--text-secondary)", letterSpacing: "0.04em" }}>
              Données officielles 2026
            </span>
          )}
        </div>

        {/* Spacer on mobile (nav-center is hidden) */}
        <div style={{ flex: 1 }} aria-hidden="true" className="nav-center" />

        {/* Theme toggle — iOS slider */}
        <IosToggle theme={theme} setTheme={setTheme} compact />
      </nav>

      {/* Overlay */}
      <div
        className="nav-overlay"
        onClick={close}
        aria-hidden="true"
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.55)",
          opacity: drawerOpen ? 1 : 0,
          visibility: drawerOpen ? "visible" : "hidden",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Drawer */}
      <aside
        className="nav-drawer"
        aria-label="Navigation principale"
        aria-hidden={!drawerOpen}
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 300,
          width: 280,
          background: theme === "dark" ? "#0a1628" : "#faf6ef",
          borderRight: "1px solid var(--border)",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          display: "flex", flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Drawer header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 16px 0 20px",
          height: 56, flexShrink: 0,
          borderBottom: "1px solid var(--border)",
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.1rem", fontWeight: 700, color: "var(--gold)",
          }}>
            Navigation
          </span>
          <button
            onClick={close}
            aria-label="Fermer la navigation"
            style={{
              background: "transparent", border: "none",
              color: "var(--text-secondary)", fontSize: "1.1rem",
              cursor: "pointer", padding: "4px 8px", borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              minHeight: 44, minWidth: 44,
            }}
          >✕</button>
        </div>

        {/* Current page indicator (on simulator pages) */}
        {current && pathname !== "/" && (
          <div style={{
            padding: "12px 20px",
            borderBottom: "1px solid var(--border)",
            background: "rgba(184,147,74,0.06)",
            flexShrink: 0,
          }}>
            <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>
              Page actuelle
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "1.3rem" }}>{current.icon}</span>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--gold)" }}>{current.title}</div>
                <div style={{ fontSize: "0.73rem", color: "var(--text-secondary)" }}>{current.subtitle}</div>
              </div>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav style={{ padding: "12px", flex: 1 }} aria-label="Simulateurs disponibles">
          <div style={{ fontSize: 10, color: "var(--text-secondary)", letterSpacing: "0.07em", textTransform: "uppercase", padding: "4px 8px 10px" }}>
            Simulateurs
          </div>
          {NAV_ITEMS.map(item => {
            const isCurrent = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={close}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 10,
                  textDecoration: "none", marginBottom: 3,
                  background: isCurrent ? "rgba(184,147,74,0.1)" : "transparent",
                  border: `1px solid ${isCurrent ? "var(--border-gold)" : "transparent"}`,
                }}
                onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: "1.2rem", flexShrink: 0, width: 28, textAlign: "center" }}>{item.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: "0.88rem", fontWeight: isCurrent ? 500 : 400,
                    color: isCurrent ? "var(--gold)" : "var(--text)",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>{item.subtitle}</div>
                </div>
                {isCurrent && (
                  <span style={{ fontSize: 8, color: "var(--gold)", flexShrink: 0 }}>●</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer: theme toggle */}
        <div style={{ padding: "14px 20px 18px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
          <IosToggle theme={theme} setTheme={setTheme} />
        </div>
      </aside>
    </>
  );
}
