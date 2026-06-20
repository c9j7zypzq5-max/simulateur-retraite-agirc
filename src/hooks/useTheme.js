import { useEffect } from "react";

export function useTheme() {
  useEffect(() => {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("theme");
  }, []);

  return ["light", () => {}];
}
