// Couleurs « -400 » des graphiques (lisibles en traits/aplats) → variante de
// TEXTE lisible sur fond clair (jetons --txt-*, voir styles.css). À utiliser
// quand une même couleur de série sert aussi à écrire un montant.
const TEXT_TONES = {
  "#4ade80": "var(--txt-green)", "#22c55e": "var(--txt-green)", "#34d399": "var(--txt-green)",
  "#ef4444": "var(--txt-red)", "#f87171": "var(--txt-red)", "#818cf8": "var(--txt-indigo)",
  "#a855f7": "var(--txt-purple)", "#f97316": "var(--txt-orange)", "#14b8a6": "var(--txt-teal)",
  "#f59e0b": "var(--txt-amber)", "#b8934a": "var(--txt-amber)", "#3b82f6": "var(--txt-blue)",
};
export const textTone = (c) => TEXT_TONES[String(c || "").toLowerCase()] || c;
