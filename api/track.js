// Endpoint multi-usage (POST) : compteur de vues des simulateurs + inscription
// newsletter. Regroupés ici pour ne pas dépasser la limite de 13 fonctions
// serverless Vercel. Toutes les données vont dans Upstash Redis.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const hasRedis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
  const getRedis = async () => {
    const { Redis } = await import('@upstash/redis');
    return new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
  };

  // ── Inscription newsletter ────────────────────────────────────────────────
  if (req.body?.action === 'subscribe') {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email) || email.length > 120) return res.status(400).json({ error: 'invalid_email' });
    const source = String(req.body.source || '').slice(0, 60);
    if (!hasRedis) return res.status(200).json({ ok: true });
    try {
      const redis = await getRedis();
      // Hash email → source|date : déduplique et garde la provenance.
      const added = await redis.hset('newsletter:subscribers', {
        [email]: JSON.stringify({ source, at: new Date().toISOString() }),
      });
      // Compteur d'inscriptions distinctes (approx. via longueur du hash).
      if (added) await redis.incr('newsletter:count');
      return res.status(200).json({ ok: true });
    } catch {
      return res.status(200).json({ ok: true });
    }
  }

  // ── Compteur de vues (comportement historique) ────────────────────────────
  const { slug } = req.body || {};
  if (!slug || typeof slug !== 'string' || slug.length > 50) return res.status(400).end();
  if (!hasRedis) return res.status(200).json({ ok: true });
  try {
    const redis = await getRedis();
    await redis.hincrby('sim:views', slug, 1);
    res.status(200).json({ ok: true });
  } catch {
    res.status(200).json({ ok: true });
  }
}
