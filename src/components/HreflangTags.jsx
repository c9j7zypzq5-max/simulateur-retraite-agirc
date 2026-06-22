import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { canonicalPath, localePath, countryPath, EN_ROUTES, BE_ROUTES, CH_ROUTES } from '../i18n/paths.js';

const SITE = 'https://www.simfinly.com';

// Injecte dynamiquement les balises <link rel="alternate" hreflang> dans <head>.
// Couvre FR (canonique), CH (/ch/ — fr-CH), BE (/be/ — fr-BE), et EN (/en/).
export default function HreflangTags() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

    const canon = canonicalPath(pathname);
    const hasEN = EN_ROUTES.has(canon);
    const hasBE = BE_ROUTES.has(canon);
    const hasCH = CH_ROUTES.has(canon);

    if (!hasEN && !hasBE && !hasCH) return;

    const frHref = SITE + (canon === '/' ? '/' : canon);
    const tags = [
      ['fr', frHref],
      ['x-default', frHref],
    ];

    if (hasCH) {
      tags.push(['fr-CH', SITE + countryPath(canon, 'ch')]);
    }
    if (hasBE) {
      tags.push(['fr-BE', SITE + countryPath(canon, 'be')]);
    }
    if (hasEN) {
      tags.push(['en', SITE + localePath(canon, 'en')]);
    }

    tags.forEach(([hreflang, href]) => {
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
