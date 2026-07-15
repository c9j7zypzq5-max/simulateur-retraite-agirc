// SEO côté client : l'app est une SPA à entrée unique (index.html), donc les
// pages marketing (/modeles, /modeles/:id) posent leur propre <title> et
// meta description au montage. Google exécute le JS et indexe ce contenu ;
// les crawlers sociaux (OG) sont servis séparément côté serveur (api/meta).
import { useEffect } from 'react';

const BASE_TITLE = 'Simfinly Builder';

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} — ${BASE_TITLE}`;

    const meta = document.querySelector('meta[name="description"]');
    const previousDesc = meta?.getAttribute('content') ?? null;
    if (meta) meta.setAttribute('content', description);

    return () => {
      document.title = previousTitle;
      if (meta && previousDesc !== null) meta.setAttribute('content', previousDesc);
    };
  }, [title, description]);
}
