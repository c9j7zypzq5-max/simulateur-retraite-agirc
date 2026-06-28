import { useEffect } from "react";
import { ROUTE_META, OG_IMAGE_BY_CAT, OG_IMAGE_DEFAULT, BASE } from "../../api/_routes.js";

// Met à jour les métadonnées de la page lors de la navigation côté client (SPA).
// Le HTML statique pré-rendu (scripts/generate-static-html.mjs) couvre déjà les
// crawlers ; ce hook garde la cohérence quand l'utilisateur navigue sans
// rechargement : title, description, Open Graph, Twitter Card, og:image et canonical.
export function usePageMeta(title, description) {
  useEffect(() => {
    const setAttr = (selector, value) => {
      if (value == null) return;
      const el = document.querySelector(selector);
      if (el) el.setAttribute("content", value);
    };

    if (title) {
      document.title = title;
      setAttr('meta[property="og:title"]', title);
      setAttr('meta[name="twitter:title"]', title);
    }
    if (description) {
      setAttr('meta[name="description"]', description);
      setAttr('meta[property="og:description"]', description);
      setAttr('meta[name="twitter:description"]', description);
    }

    // Canonical + og:url : inclut le paramètre ?s= quand présent (simulation
    // partagée), pour que chaque résultat ait sa propre URL canonique.
    const shareParam = new URLSearchParams(window.location.search).get('s');
    const canonicalUrl = window.location.origin + window.location.pathname + (shareParam ? `?s=${shareParam}` : '');
    setAttr('meta[property="og:url"]', canonicalUrl);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalUrl;

    // og:image + twitter:image : image de catégorie brandée (/api/og).
    // Évite que la navigation SPA laisse l'image générique de la home sur les
    // pages simulateurs visitées après une navigation interne.
    let canonPath = window.location.pathname;
    if (canonPath.startsWith('/en/')) canonPath = canonPath.slice(3);
    else if (canonPath.startsWith('/be/')) canonPath = canonPath.slice(3);
    else if (canonPath.startsWith('/ch/')) canonPath = canonPath.slice(3);
    const meta = ROUTE_META[canonPath];
    if (meta) {
      const ogImg = meta.cat && OG_IMAGE_BY_CAT[meta.cat]
        ? `${BASE}/api/og?${new URLSearchParams({ t: meta.title, c: meta.cat }).toString()}`
        : `${BASE}${OG_IMAGE_DEFAULT}`;
      setAttr('meta[property="og:image"]', ogImg);
      setAttr('meta[name="twitter:image"]', ogImg);
    }
  }, [title, description]);
}
