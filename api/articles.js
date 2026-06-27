import { Redis } from '@upstash/redis';
import { BASE } from './_routes.js';

const SITE = BASE;

export default async function handler(req, res) {
  const format = req.query?.format;

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (format === 'rss') { res.setHeader('Content-Type', 'application/rss+xml'); return res.status(200).send(emptyRss()); }
    return res.status(200).json([]);
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // 20 articles les plus récents (score = timestamp)
    const slugs = await redis.zrange('blog:slugs', 0, 19, { rev: true });
    if (!slugs || !slugs.length) {
      if (format === 'rss') { res.setHeader('Content-Type', 'application/rss+xml'); return res.status(200).send(emptyRss()); }
      return res.status(200).json([]);
    }

    const SLUG_RE = /^[a-z0-9-]{1,120}$/;
    const articles = (await Promise.all(
      slugs.map(async slug => {
        if (!SLUG_RE.test(String(slug))) return null;
        const raw = await redis.get(`blog:article:${slug}`);
        if (!raw) return null;
        const a = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return {
          slug: a.slug,
          title: a.title,
          intro: a.intro,
          excerpt: a.excerpt,
          category: a.category,
          readTime: a.readTime,
          publishedAt: a.publishedAt,
          image: a.image,
        };
      })
    )).filter(Boolean);

    if (format === 'rss') {
      res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
      return res.status(200).send(buildRss(articles));
    }

    res.status(200).json(articles);
  } catch {
    if (format === 'rss') { res.setHeader('Content-Type', 'application/rss+xml'); return res.status(200).send(emptyRss()); }
    res.status(200).json([]);
  }
}

function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function emptyRss() {
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Simfinly — Blog</title><link>${SITE}/blog</link><description>Actualités finances personnelles</description></channel></rss>`;
}

function buildRss(articles) {
  const items = articles.map(a => {
    const url = `${SITE}/blog/${a.slug}`;
    const pubDate = a.publishedAt ? new Date(a.publishedAt).toUTCString() : new Date().toUTCString();
    const desc = esc(a.excerpt || a.intro || '');
    const enclosure = a.image?.url ? `<enclosure url="${esc(a.image.url)}" type="image/jpeg" length="0" />` : '';
    return `<item><title>${esc(a.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${pubDate}</pubDate><description>${desc}</description>${enclosure}<category>${esc(a.category)}</category></item>`;
  }).join('\n    ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Simfinly — Blog finances personnelles</title>
    <link>${SITE}/blog</link>
    <description>Actualités, conseils et analyses sur les finances personnelles, la retraite, l'immobilier et l'épargne.</description>
    <language>fr-FR</language>
    <atom:link href="${SITE}/api/articles?format=rss" rel="self" type="application/rss+xml" />
    <image><url>${SITE}/og-image.png</url><title>Simfinly</title><link>${SITE}/blog</link></image>
    ${items}
  </channel>
</rss>`;
}
