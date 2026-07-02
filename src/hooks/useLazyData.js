import { useState, useEffect } from "react";

// Chargement différé des gros modules de données de contenu (glossaire, guides,
// métiers — ~400 K cumulés). Ces modules ne doivent JAMAIS être importés
// statiquement par du code présent sur toutes les pages (Footer, ui.jsx,
// AutoLinkText…) : ils resteraient dans le bundle initial. Ici, ils ne sont
// téléchargés qu'au premier usage réel, avec un cache au niveau du module.
function makeLazyHook(importer) {
  let mod = null;
  let promise = null;
  const load = () => {
    if (mod) return Promise.resolve(mod);
    if (!promise) promise = importer().then(m => (mod = m)).catch(() => null);
    return promise;
  };
  return function useLazyModule(enabled = true) {
    const [state, setState] = useState(mod);
    useEffect(() => {
      if (!enabled || state) return;
      let alive = true;
      load().then(m => { if (alive && m) setState(m); });
      return () => { alive = false; };
    }, [enabled, state]);
    return state;
  };
}

export const useGlossaire = makeLazyHook(() => import("../data/glossaire.js"));
export const useGuides    = makeLazyHook(() => import("../data/guides.js"));
export const useMetiers   = makeLazyHook(() => import("../data/metiers.js"));
