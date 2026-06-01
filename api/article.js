import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  const { slug } = req.query;
  if (!slug || typeof slug !== 'string' || slug.length > 100 || !/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({ error: 'Slug invalide' });
  }

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return res.status(404).json({ error: 'Non trouvé' });
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const raw = await redis.get(`blog:article:${slug}`);
    if (!raw) return res.status(404).json({ error: 'Article introuvable' });

    const article = typeof raw === 'string' ? JSON.parse(raw) : raw;
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
