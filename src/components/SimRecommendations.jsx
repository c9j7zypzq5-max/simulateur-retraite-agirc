import { Link } from "react-router-dom";

/**
 * Displays 2-4 contextual "next step" recommendations after a simulation.
 *
 * Props:
 *   items — array of { icon, label, description, to, cta }
 *   title — optional section title (default: "Aller plus loin avec votre profil")
 */
export default function SimRecommendations({ items, title }) {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ marginTop: 24, padding: "20px 22px", background: "rgba(184,147,74,0.05)", border: "1px solid rgba(184,147,74,0.2)", borderRadius: 16 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-mid, #c9a96e)", marginBottom: 8 }}>
        Recommandations personnalisées
      </div>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: "var(--text)", margin: "0 0 16px" }}>
        {title ?? "Aller plus loin avec votre profil"}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item, i) => (
          <Link
            key={i}
            to={item.to}
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14, background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", transition: "border-color 0.15s, transform 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.transform = "translateX(2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
          >
            <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis" }}>{item.description}</div>
            </div>
            <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
              {item.cta ?? "Simuler →"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
