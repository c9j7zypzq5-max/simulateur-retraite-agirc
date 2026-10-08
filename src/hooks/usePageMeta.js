import { useEffect } from "react";
import { ROUTE_META, OG_IMAGE_BY_CAT, OG_IMAGE_DEFAULT, BASE } from "../../api/_meta.js";
import { canonicalPath } from "../i18n/paths.js";
import { localeFromPath, countryFromPath } from "../i18n/config.js";

const setAttr = (selector, value) => {
  if (value == null) return;
  const el = document.querySelector(selector);
  if (el) el.setAttribute("content", value);
};

function applyTitle(title) {
  if (!title) return;
  document.title = title;
  setAttr('meta[property="og:title"]', title);
  setAttr('meta[name="twitter:title"]', title);
}

function applyDescription(description) {
  if (!description) return;
  setAttr('meta[name="description"]', description);
  setAttr('meta[property="og:description"]', description);
  setAttr('meta[name="twitter:description"]', description);
}

// Met à jour les métadonnées de la page lors de la navigation côté client (SPA).
// Le HTML statique pré-rendu (scripts/generate-static-html.mjs) couvre déjà les
// crawlers ; ce hook garde la cohérence quand l'utilisateur navigue sans
// rechargement : title, description, Open Graph, Twitter Card, og:image et canonical.
export function usePageMeta(title, description) {
  useEffect(() => {
    applyTitle(title);
    applyDescription(description);

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
    const path = window.location.pathname;
    const canon = canonicalPath(path);
    const meta = ROUTE_META[canon];
    if (meta) {
      const ogImg = meta.cat && OG_IMAGE_BY_CAT[meta.cat]
        ? `${BASE}/api/og?${new URLSearchParams({ t: meta.title, c: meta.cat }).toString()}`
        : `${BASE}${OG_IMAGE_DEFAULT}`;
      setAttr('meta[property="og:image"]', ogImg);
      setAttr('meta[name="twitter:image"]', ogImg);
    }

    // Pages localisées (/en, /ch, /be, /lu, /qc) : le titre et la description
    // localisés du HTML pré-rendu font foi. Sans cela, les pages qui ne passent
    // qu'un titre français (ou générique) l'imposaient au rendu JS — c'est ce
    // que Google indexe. Module chargé à la demande : rien pour les pages FR.
    const locale = localeFromPath(path);
    const country = countryFromPath(path);
    if (locale === "fr" && country === "fr") return;
    let cancelled = false;
    import("../../api/_meta-i18n.js")
      .then(({ localizedRouteMeta }) => {
        if (cancelled) return;
        const localized = localizedRouteMeta(canon, locale, country);
        if (!localized) return;
        applyTitle(localized.title);
        applyDescription(localized.description);
      })
      .catch(() => { /* chunk indisponible : on garde le titre de la page */ });
    return () => { cancelled = true; };
  }, [title, description]);
}
