import { LocaleLink } from "../lib/router.jsx";
import { useTranslation } from "../i18n/index.js";

/**
 * Displays 2-4 contextual "next step" recommendations after a simulation.
 *
 * Props:
 *   items — array of { icon, label, description, to, cta, en? }
 *   title — optional section title (default: t("reco.title"))
 *
 * Sur une page anglaise, seuls les items dotés d'une version `en` (et donc
 * pointant vers une page traduite) sont affichés — jamais de bloc français.
 */
export default function SimRecommendations({ items, title }) {
  const { t, locale } = useTranslation();
  const list = locale === "en"
    ? (items || []).filter(i => i.en).map(i => ({ ...i, ...i.en }))
    : (items || []);
  if (list.length === 0) return null;

  return (
    <div style={{ marginTop: 24, padding: "20px 22px", background: "rgba(184,147,74,0.05)", border: "1px solid rgba(184,147,74,0.2)", borderRadius: 16 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold-mid, #c9a96e)", marginBottom: 8 }}>
        {t("reco.kicker")}
      </div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: "var(--text)", margin: "0 0 16px" }}>
        {title ?? t("reco.title")}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {list.map((item, i) => (
          <LocaleLink
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
              {item.cta ?? t("reco.cta")}
            </span>
          </LocaleLink>
        ))}
      </div>
    </div>
  );
}
