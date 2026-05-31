import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300');
  const scores = await kv.hgetall('sim:views') || {};
  res.status(200).json(scores);
}
