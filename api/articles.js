import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return res.status(200).json([]);
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // 20 articles les plus récents (score = timestamp)
    const slugs = await redis.zrange('blog:slugs', 0, 19, { rev: true });
    if (!slugs || !slugs.length) return res.status(200).json([]);

    const articles = await Promise.all(
      slugs.map(async slug => {
        const raw = await redis.get(`blog:article:${slug}`);
        if (!raw) return null;
        const a = typeof raw === 'string' ? JSON.parse(raw) : raw;
        // Renvoie uniquement le résumé (pas le contenu HTML complet)
        return {
          slug: a.slug,
          title: a.title,
          intro: a.intro,
          category: a.category,
          readTime: a.readTime,
          publishedAt: a.publishedAt,
          image: a.image,
        };
      })
    );

    res.status(200).json(articles.filter(Boolean));
  } catch {
    res.status(200).json([]);
  }
}
