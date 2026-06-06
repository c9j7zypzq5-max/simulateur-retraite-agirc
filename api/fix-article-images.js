import { Redis } from '@upstash/redis';
import { pexelsPool, toImage } from './_pexels.js';

// Maintenance : réattribue une photo *distincte* à chaque article existant.
// À lancer une fois pour corriger les articles publiés en masse qui partagent
// tous la même image (un seul appel Pexels per_page=1 par catégorie auparavant).
//
// POST /api/fix-article-images
// Header : Authorization: Bearer <CRON_SECRET>  (si défini)
// Renvoie la liste des articles mis à jour.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.CRON_SECRET || process.env.PUBLISH_SECRET;
  if (secret && req.headers['authorization'] !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return res.status(500).json({ error: 'Redis non configuré' });
  }
  if (!process.env.PEXELS_API_KEY) {
    return res.status(500).json({ error: 'PEXELS_API_KEY non configurée' });
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // Tous les slugs, du plus ancien au plus récent (ordre stable).
    const slugs = await redis.zrange('blog:slugs', 0, -1);
    if (!slugs || !slugs.length) {
      return res.status(200).json({ ok: true, updated: 0, articles: [] });
    }

    // Charge tous les articles.
    const articles = [];
    for (const slug of slugs) {
      const raw = await redis.get(`blog:article:${slug}`);
      if (!raw) continue;
      articles.push(typeof raw === 'string' ? JSON.parse(raw) : raw);
    }

    // Pool de photos récupéré une seule fois par catégorie, puis on pioche une
    // image distincte pour chaque article (compteur par catégorie).
    const pools = {};
    const counters = {};
    const updated = [];

    for (const a of articles) {
      const cat = a.category || 'Finances';
      if (!(cat in pools)) {
        pools[cat] = await pexelsPool(cat);
        counters[cat] = 0;
      }
      const pool = pools[cat];
      if (!pool.length) continue;

      const idx = counters[cat]++ % pool.length;
      const pic = toImage(pool[idx]);
      a.image = pic.image;
      a.imageAlt = pic.imageAlt || a.title;
      a.imageCredit = pic.imageCredit;

      await redis.set(`blog:article:${a.slug}`, JSON.stringify(a));
      updated.push({ slug: a.slug, category: cat, image: a.image });
    }

    res.status(200).json({ ok: true, updated: updated.length, articles: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
