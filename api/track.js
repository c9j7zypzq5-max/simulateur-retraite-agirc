import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { slug } = req.body;
  if (!slug || typeof slug !== 'string' || slug.length > 50) return res.status(400).end();
  await redis.hincrby('sim:views', slug, 1);
  res.status(200).json({ ok: true });
}
