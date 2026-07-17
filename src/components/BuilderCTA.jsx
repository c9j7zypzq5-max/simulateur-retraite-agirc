import { track } from "@vercel/analytics";
import { useTranslation } from "../i18n/index.js";

/**
 * Carte de promotion du Builder (app.simfinly.com) — le maillage
 * simfinly.com → builder. `context` alimente l'utm_campaign et l'événement
 * analytics pour savoir quelle page convertit.
 */
export default function BuilderCTA({ context = "simulateur" }) {
  const { t } = useTranslation();
  const url = `https://app.simfinly.com/?utm_source=simfinly&utm_medium=referral&utm_campaign=${context}`;
  return (
    <a
      href={url}
      onClick={() => track("builder_cta_click", { from: context })}
      style={{
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        padding: "18px 22px", borderRadius: 16, textDecoration: "none",
        background: "var(--primary-soft, rgba(43,92,230,0.06))",
        border: "1px solid rgba(43,92,230,0.25)",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(43,92,230,0.25)"}
    >
      <span style={{ fontSize: 26, flexShrink: 0 }} aria-hidden="true">🛠️</span>
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--primary)", fontWeight: 600, marginBottom: 3 }}>
          {t("builderCta.kicker")}
        </div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>
          {t("builderCta.title")}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {t("builderCta.desc")}
        </div>
      </div>
      <span style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600, whiteSpace: "nowrap" }}>
        {t("builderCta.cta")}
      </span>
    </a>
  );
}
