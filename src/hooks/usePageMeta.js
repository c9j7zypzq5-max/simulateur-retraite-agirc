import { useEffect } from "react";

// Met à jour les métadonnées de la page lors de la navigation côté client (SPA).
// Le HTML statique pré-rendu (scripts/generate-static-html.mjs) couvre déjà les
// crawlers ; ce hook garde la cohérence quand l'utilisateur navigue sans
// rechargement : title, description, Open Graph, Twitter Card et canonical.
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

    // Canonical + og:url pointent vers l'URL courante (sans query ni hash),
    // pour éviter le contenu dupliqué et un partage social incohérent.
    const canonicalUrl = window.location.origin + window.location.pathname;
    setAttr('meta[property="og:url"]', canonicalUrl);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalUrl;
  }, [title, description]);
}
