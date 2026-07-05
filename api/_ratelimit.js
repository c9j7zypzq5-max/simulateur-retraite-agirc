// Limiteur de débit partagé (Upstash Redis), par IP + clé d'action.
// Préfixe « _ » : module partagé, pas une route serverless (cf. api/_routes.js).
//
// Retourne `true` si la limite est dépassée (l'appelant doit répondre 429),
// `false` si Redis n'est pas configuré (fail-open : pas de blocage en dev/preview).
export async function getRateLimit(ip, key, limit, windowSec) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return false;
  try {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
    const rk = `rl:${key}:${ip}`;
    const count = await redis.incr(rk);
    if (count === 1) await redis.expire(rk, windowSec);
    return count > limit;
  } catch { return false; }
}
