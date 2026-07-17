// SEO côté client : l'app est une SPA à entrée unique (index.html), donc les
// pages marketing (/, /modeles, /modeles/:id) posent leur propre <title>,
// meta description, lien canonique et données structurées au montage. Google
// exécute le JS et indexe ce contenu ; les crawlers sociaux (OG) sont servis
// séparément côté serveur (api/meta).
import { useEffect } from 'react';

const BASE_TITLE = 'Simfinly Builder';
const ORIGIN = 'https://app.simfinly.com';

// Lien canonique : par défaut le chemin courant SANS query string (les UTM du
// maillage simfinly.com → builder ne doivent pas fragmenter l'URL indexée).
function upsertCanonical(href: string): string | null {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const previous = link?.getAttribute('href') ?? null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
  return previous;
}

export function usePageMeta(title: string, description: string, canonicalPath?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} — ${BASE_TITLE}`;

    const meta = document.querySelector('meta[name="description"]');
    const previousDesc = meta?.getAttribute('content') ?? null;
    if (meta) meta.setAttribute('content', description);

    const path = canonicalPath ?? window.location.pathname;
    const previousCanonical = upsertCanonical(`${ORIGIN}${path}`);

    return () => {
      document.title = previousTitle;
      if (meta && previousDesc !== null) meta.setAttribute('content', previousDesc);
      if (previousCanonical !== null) upsertCanonical(previousCanonical);
    };
  }, [title, description, canonicalPath]);
}

// Données structurées JSON-LD : injectées dans un <script> dédié au montage,
// retirées au démontage. `data` doit être stable (mémoïsé par l'appelant) pour
// ne pas réinjecter à chaque rendu.
export function useJsonLd(data: object | null) {
  useEffect(() => {
    if (!data) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
}
