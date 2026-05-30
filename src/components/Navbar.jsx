import { Link, useLocation } from "react-router-dom";

export default function Navbar({ theme, setTheme }) {
  const { pathname } = useLocation();
  const onSim = pathname.startsWith("/simulateurs/");

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: theme === "dark" ? "rgba(6,14,28,0.92)" : "rgba(250,246,239,0.94)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      padding: "0 24px",
      height: 56,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      {/* Logo */}
      <Link to="/" style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.2rem", fontWeight: 700,
        color: "var(--gold)", textDecoration: "none",
        letterSpacing: "0.02em", flexShrink: 0,
      }}>mesimulateurs.fr</Link>

      {/* Center: breadcrumb on sim pages, link on home */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {onSim && (
          <Link to="/" style={{
            fontSize: 12, color: "var(--text-secondary)", textDecoration: "none",
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 20,
            border: "1px solid var(--border)",
            transition: "color 0.2s, border-color 0.2s",
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

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
        aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
        style={{
          background: "var(--card-bg)", border: "1px solid var(--border)",
          color: "var(--text-secondary)", fontSize: 12,
          padding: "6px 14px", borderRadius: 20,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          whiteSpace: "nowrap",
          transition: "all 0.2s",
        }}
      >
        {theme === "dark" ? "☀ Clair" : "🌙 Sombre"}
      </button>
    </nav>
  );
}
