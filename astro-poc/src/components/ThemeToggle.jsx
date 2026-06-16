import { useState } from "react";

// Island React de démonstration : prouve que les composants interactifs React
// (les simulateurs, dans la vraie migration) cohabitent avec le contenu statique
// rendu par Astro. Hydraté côté client via `client:load`.
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  return (
    <button
      onClick={() => setDark((d) => !d)}
      style={{
        margin: "16px 0",
        padding: "10px 16px",
        borderRadius: 10,
        border: "1px solid #b8934a",
        background: dark ? "#060e1c" : "#fff",
        color: dark ? "#e8c06a" : "#b8934a",
        cursor: "pointer",
        font: "inherit",
      }}
    >
      🏝️ Island React — thème {dark ? "sombre" : "clair"} (cliquez pour basculer)
    </button>
  );
}
