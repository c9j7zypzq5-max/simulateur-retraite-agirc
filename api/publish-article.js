import { Redis } from '@upstash/redis';
import { pexelsImage } from './_pexels.js';

// Publie un article fourni (JSON) dans le blog (Redis). Sert pour les articles
// « actualité » rédigés à la main, en complément du cron auto (generate-article).
// Sécurisé par Bearer CRON_SECRET (si défini). Une image libre de droits Pexels
// est ajoutée automatiquement selon la catégorie (si PEXELS_API_KEY est défini).
//
// POST /api/publish-article
// Body JSON : { title, slug?, intro, content, category, readTime?, image? }

function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.CRON_SECRET || process.env.PUBLISH_SECRET;
  if (secret && req.headers['authorization'] !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return res.status(500).json({ error: 'Redis non configuré' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || !body.title || !body.content || !body.category) {
    return res.status(400).json({ error: 'Champs requis manquants (title, content, category)' });
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const article = {
      title: body.title,
      slug: slugify(body.slug || body.title),
      intro: body.intro || '',
      content: body.content,
      category: body.category,
      readTime: body.readTime || 5,
      publishedAt: new Date().toISOString(),
    };

    // Image fournie sinon récupérée depuis Pexels. Un index par catégorie fait
    // tourner le choix dans le pool pour éviter d'avoir toujours la même photo.
    if (body.image) {
      article.image = body.image;
      article.imageAlt = body.imageAlt || article.title;
      article.imageCredit = body.imageCredit || '';
    } else {
      const idx = await redis.incr(`blog:imgidx:${article.category}`);
      const pic = await pexelsImage(article.category, idx - 1);
      if (pic) {
        article.image = pic.image;
        article.imageAlt = pic.imageAlt || article.title;
        article.imageCredit = pic.imageCredit;
      }
    }

    await redis.set(`blog:article:${article.slug}`, JSON.stringify(article));
    await redis.zadd('blog:slugs', { score: Date.now(), member: article.slug });

    res.status(200).json({ ok: true, slug: article.slug, url: `https://www.simfinly.com/blog/${article.slug}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
