import { useLocation, useNavigate } from "../lib/router.jsx";
import { localeFromPath } from "../i18n/config.js";
import { alternatePath } from "../i18n/paths.js";

// Bouton de bascule FR ↔ EN. Affiché uniquement sur les routes disponibles dans
// les deux langues (EN_ROUTES). Sur les routes FR-only, retourne null.
export default function LangSwitch({ compact = false }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const locale = localeFromPath(pathname);
  const alt = alternatePath(pathname, locale);

  if (!alt) return null; // route non disponible en EN

  const label = locale === 'fr' ? 'EN' : 'FR';
  const title = locale === 'fr' ? 'Switch to English' : 'Passer en français';

  return (
    <button
      onClick={() => navigate(alt)}
      title={title}
      aria-label={title}
      style={{
        background: "var(--chip-bg)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        color: "var(--text-secondary)",
        cursor: "pointer",
        fontFamily: "'Hanken Grotesk', sans-serif",
        fontSize: compact ? 12 : 13,
        fontWeight: 600,
        letterSpacing: "0.04em",
        minHeight: 32,
        padding: compact ? "4px 10px" : "6px 14px",
      }}
    >
      {label}
    </button>
  );
}
