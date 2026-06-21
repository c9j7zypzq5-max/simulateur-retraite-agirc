import { BAREMES_DATES } from "../data/baremesDates.js";

/**
 * Affiche un petit badge vert "Barèmes YYYY" pour un chemin de simulateur donné.
 * Retourne null si le chemin est absent de BAREMES_DATES.
 */
export default function BaremeUpdateBadge({ path }) {
  const entry = path ? BAREMES_DATES[path] : null;
  if (!entry) return null;

  return (
    <span
      style={{
        display: "inline-block",
        background: "rgba(34,197,94,0.12)",
        border: "1px solid rgba(34,197,94,0.3)",
        color: "#22c55e",
        fontSize: 11,
        borderRadius: 6,
        padding: "2px 7px",
        fontFamily: "inherit",
        fontWeight: 500,
        lineHeight: 1.5,
        whiteSpace: "nowrap",
      }}
      title={entry.mois ? `Barèmes mis à jour en ${entry.mois} ${entry.annee}` : `Barèmes ${entry.annee}`}
    >
      Barèmes {entry.annee}
    </span>
  );
}
