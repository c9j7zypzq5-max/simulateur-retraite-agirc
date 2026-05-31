import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { slug } = req.body;
  if (!slug || typeof slug !== 'string') return res.status(400).end();
  await kv.hincrby('sim:views', slug, 1);
  res.status(200).json({ ok: true });
}
