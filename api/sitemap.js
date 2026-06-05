import { Redis } from '@upstash/redis';
import { BASE, ROUTE_META, BLOG_SLUGS } from './_routes.js';

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

  const urls = [...staticUrls, ...blogUrls].map(u => `  <url>
    <loc>${BASE}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.prio}</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=UTF-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
