import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { canonicalPath, localePath, EN_ROUTES } from '../i18n/paths.js';

const SITE = 'https://www.simfinly.com';

// Injecte dynamiquement les balises <link rel="alternate" hreflang> dans <head>
// pour signaler à Google les versions FR et EN de chaque page.
export default function HreflangTags() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

    const canon = canonicalPath(pathname);
    if (!EN_ROUTES.has(canon)) return;

    const frHref = SITE + (canon === '/' ? '/' : canon);
    const enHref = SITE + localePath(canon, 'en');

    [['fr', frHref], ['en', enHref], ['x-default', frHref]].forEach(([hreflang, href]) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.setAttribute('hreflang', hreflang);
      link.href = href;
      document.head.appendChild(link);
    });

    return () => {
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    };
  }, [pathname]);

  return null;
}
