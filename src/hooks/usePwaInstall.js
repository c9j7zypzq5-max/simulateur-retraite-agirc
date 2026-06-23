import { useState, useEffect } from "react";

// Returns { canInstall, install } where install() shows the browser's native prompt.
// Works only in browsers that fire `beforeinstallprompt` (Chrome, Edge, Samsung Internet).
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(() =>
    localStorage.getItem("pwa_install_dismissed") === "1"
  );

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === "dismissed") {
      localStorage.setItem("pwa_install_dismissed", "1");
      setDismissed(true);
    }
  }

  function dismiss() {
    localStorage.setItem("pwa_install_dismissed", "1");
    setDismissed(true);
  }

  return {
    canInstall: !!deferredPrompt && !dismissed,
    install,
    dismiss,
  };
}
