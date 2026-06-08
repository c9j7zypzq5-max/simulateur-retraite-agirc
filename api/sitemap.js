import { Redis } from '@upstash/redis';
import { BASE, SITE_LASTMOD, ROUTE_META, BLOG_SLUGS, LEXIQUE_SLUGS, GUIDES_SLUGS } from './_routes.js';

// Sitemap dynamique : routes statiques (source unique _routes.js) + slugs des
// articles de blog lus depuis Redis, afin que les nouveaux articles publiés
// apparaissent sans redéploiement. Fallback sur BLOG_SLUGS si Redis indisponible.
//
// lastmod réels par page (meilleur signal de fraîcheur pour le crawl) :
//   • articles de blog → date de publication (score = timestamp dans blog:slugs)
//   • pages statiques / guides / lexique → SITE_LASTMOD (ou override m.lastmod)
function toDate(ms) {
  const d = new Date(Number(ms));
  return Number.isNaN(d.getTime()) ? SITE_LASTMOD : d.toISOString().slice(0, 10);
}

export default async function handler(req, res) {
  let blogSlugs = BLOG_SLUGS;
  // Map slug normalisé (/blog/xxx) → date de dernière modif (YYYY-MM-DD)
  const blogLastmod = new Map();

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      // withScores : renvoie un tableau plat [member, score, member, score, …]
      const flat = await redis.zrange('blog:slugs', 0, -1, { rev: true, withScores: true });
      if (Array.isArray(flat) && flat.length) {
        const slugs = [];
        for (let i = 0; i < flat.length; i += 2) {
          const raw = flat[i];
          const score = flat[i + 1];
          const loc = String(raw).startsWith('/blog/') ? String(raw) : `/blog/${raw}`;
          slugs.push(loc);
          blogLastmod.set(loc, toDate(score));
        }
        blogSlugs = slugs;
      }
    } catch {
      // garde le fallback statique
    }
  }

  const staticUrls = Object.entries(ROUTE_META).map(([route, m]) => ({
    loc: route,
    freq: m.freq || 'monthly',
    prio: m.prio || '0.5',
    lastmod: m.lastmod || SITE_LASTMOD,
  }));

  const blogUrls = blogSlugs.map(route => ({
    loc: route,
    freq: 'monthly',
    prio: '0.7',
    lastmod: blogLastmod.get(route) || SITE_LASTMOD,
  }));

  const lexiqueUrls = LEXIQUE_SLUGS.map(route => ({ loc: route, freq: 'monthly', prio: '0.6', lastmod: SITE_LASTMOD }));
  const guideUrls = GUIDES_SLUGS.map(route => ({ loc: route, freq: 'monthly', prio: '0.8', lastmod: SITE_LASTMOD }));

  const urls = [...staticUrls, ...blogUrls, ...lexiqueUrls, ...guideUrls].map(u => `  <url>
    <loc>${BASE}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
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
