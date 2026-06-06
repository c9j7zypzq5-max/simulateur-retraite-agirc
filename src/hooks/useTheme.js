import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "");
    localStorage.setItem("theme", theme);
    // La couleur de la barre du navigateur (mobile) suit le fond du thème.
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "light" ? "#faf6ef" : "#060e1c");
  }, [theme]);

  return [theme, setTheme];
}
