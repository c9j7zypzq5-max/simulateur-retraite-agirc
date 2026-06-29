import { Redis } from '@upstash/redis';
import { BASE, ROUTE_META, EN_ROUTES, ROUTE_META_EN, CH_ROUTES, BE_ROUTES, BLOG_SLUGS, EN_BLOG_SLUGS, LEXIQUE_SLUGS, GUIDES_SLUGS, COMPARATIFS_SLUGS, OG_IMAGE_BY_CAT, OG_IMAGE_DEFAULT } from './_routes.js';

// Sitemap dynamique : routes statiques (source unique _routes.js) + slugs des
// articles de blog lus depuis Redis, afin que les nouveaux articles publiés
// apparaissent sans redéploiement. Fallback sur BLOG_SLUGS si Redis indisponible.
export default async function handler(req, res) {
  const today = new Date().toISOString().slice(0, 10);

  let blogSlugs = BLOG_SLUGS;
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      const slugs = await redis.zrange('blog:slugs', 0, -1, { rev: true });
      if (Array.isArray(slugs) && slugs.length) {
        blogSlugs = slugs.map(s => (s.startsWith('/blog/') ? s : `/blog/${s}`));
      }
    } catch {
      // garde le fallback statique
    }
  }

  const staticUrls = Object.entries(ROUTE_META).map(([route, m]) => ({
    loc: route,
    freq: m.freq || 'monthly',
    prio: m.prio || '0.5',
  }));

  const blogUrls = blogSlugs.map(route => ({ loc: route, freq: 'monthly', prio: '0.7' }));
  const enBlogUrls = EN_BLOG_SLUGS.map(route => ({ loc: route, freq: 'monthly', prio: '0.7' }));

  const lexiqueUrls = LEXIQUE_SLUGS.map(route => ({ loc: route, freq: 'monthly', prio: '0.6' }));
  const guideUrls = GUIDES_SLUGS.map(route => ({ loc: route, freq: 'monthly', prio: '0.8' }));
  const comparatifUrls = COMPARATIFS_SLUGS.map(route => ({ loc: route, freq: 'monthly', prio: '0.7' }));

  // Pages EN (routes universelles disponibles en anglais)
  const enUrls = Array.from(EN_ROUTES).map(route => ({
    loc: route === '/' ? '/en' : `/en${route}`,
    freq: 'monthly',
    prio: ROUTE_META_EN[route] ? '0.8' : '0.7',
  }));

  // Pages CH (/ch/...) — hors mentions légales et confidentialité
  const legalRoutes = new Set(['/mentions-legales', '/politique-de-confidentialite']);
  const chUrls = CH_ROUTES.filter(r => !legalRoutes.has(r)).map(route => ({
    loc: route === '/' ? '/ch' : `/ch${route}`,
    freq: ROUTE_META[route]?.freq || 'monthly',
    prio: ROUTE_META[route]?.prio ? String(Math.min(parseFloat(ROUTE_META[route].prio) - 0.1, 0.9)) : '0.7',
  }));

  // Pages BE (/be/...) — hors mentions légales et confidentialité
  const beUrls = BE_ROUTES.filter(r => !legalRoutes.has(r)).map(route => ({
    loc: route === '/' ? '/be' : `/be${route}`,
    freq: ROUTE_META[route]?.freq || 'monthly',
    prio: ROUTE_META[route]?.prio ? String(Math.min(parseFloat(ROUTE_META[route].prio) - 0.1, 0.9)) : '0.7',
  }));

  const allUrls = [...staticUrls, ...blogUrls, ...enBlogUrls, ...lexiqueUrls, ...guideUrls, ...comparatifUrls, ...enUrls, ...chUrls, ...beUrls];

  function imageTagForRoute(route) {
    const meta = ROUTE_META[route];
    if (!meta || !meta.cat) return '';
    const img = (OG_IMAGE_BY_CAT[meta.cat] || OG_IMAGE_DEFAULT);
    const title = (meta.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `\n    <image:image><image:loc>${BASE}${img}</image:loc>${title ? `<image:title>${title}</image:title>` : ''}</image:image>`;
  }

  const urls = allUrls.map(u => {
    const route = u.loc.replace(/^\/(en|ch|be)/, '') || '/';
    const imgTag = imageTagForRoute(route);
    return `  <url>
    <loc>${BASE}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.prio}</priority>${imgTag}
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=UTF-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
