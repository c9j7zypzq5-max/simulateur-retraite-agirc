import { Redis } from '@upstash/redis';
import { pexelsImage } from './_pexels.js';
import { pingIndexNow } from './_indexnow.js';

// Publie un article fourni (JSON) dans le blog (Redis). Sert pour les articles
// « actualité » rédigés à la main, en complément du cron auto (generate-article).
// Sécurisé par Bearer CRON_SECRET (si défini). Une image libre de droits Pexels
// est ajoutée automatiquement selon la catégorie (si PEXELS_API_KEY est défini).
//
// POST /api/publish-article
// Body JSON : { title, slug?, intro, content, category, readTime?, image? }
//
// Relecture humaine des brouillons générés par le cron (generate-article) :
//   GET  /api/publish-article               → liste les brouillons en attente
//   POST /api/publish-article  { action: 'approve', slug } → publie le brouillon
//   POST /api/publish-article  { action: 'reject',  slug } → supprime le brouillon
// Ces trois routes exigent le même Bearer CRON_SECRET / PUBLISH_SECRET.

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
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.CRON_SECRET || process.env.PUBLISH_SECRET;
  if (!secret || req.headers['authorization'] !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return res.status(500).json({ error: 'Redis non configuré' });
  }

  const redisForReview = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  if (req.method === 'GET') {
    return listDrafts(redisForReview, res);
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }

  if (body?.action === 'approve') return approveDraft(redisForReview, body.slug, res);
  if (body?.action === 'reject') return rejectDraft(redisForReview, body.slug, res);

  if (!body || !body.title || !body.content || !body.category) {
    return res.status(400).json({ error: 'Champs requis manquants (title, content, category)' });
  }

  try {
    const redis = redisForReview;

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

    const url = `https://www.simfinly.com/blog/${article.slug}`;
    pingIndexNow(url); // best-effort, ne bloque pas la réponse
    res.status(200).json({ ok: true, slug: article.slug, url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Liste les brouillons en attente de relecture (les plus récents d'abord),
// contenu complet inclus pour permettre une relecture sans appel supplémentaire.
async function listDrafts(redis, res) {
  try {
    const slugs = await redis.zrange('blog:drafts', 0, -1, { rev: true });
    const drafts = (await Promise.all(
      (slugs || []).map(async slug => {
        const raw = await redis.get(`blog:draft:${slug}`);
        if (!raw) return null;
        return typeof raw === 'string' ? JSON.parse(raw) : raw;
      })
    )).filter(Boolean);
    res.status(200).json({ count: drafts.length, drafts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Approuve un brouillon : le publie tel quel (le contenu doit avoir été relu
// et, si besoin, corrigé en amont — cet endpoint ne réécrit pas le texte) et
// déclenche l'indexation. Le brouillon est retiré une fois publié.
async function approveDraft(redis, slug, res) {
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'slug requis' });
  }
  try {
    const raw = await redis.get(`blog:draft:${slug}`);
    if (!raw) return res.status(404).json({ error: 'Brouillon introuvable' });

    const article = typeof raw === 'string' ? JSON.parse(raw) : raw;
    delete article.status;
    article.publishedAt = new Date().toISOString();

    await redis.set(`blog:article:${article.slug}`, JSON.stringify(article));
    await redis.zadd('blog:slugs', { score: Date.now(), member: article.slug });
    await redis.del(`blog:draft:${slug}`);
    await redis.zrem('blog:drafts', slug);

    const url = `https://www.simfinly.com/blog/${article.slug}`;
    pingIndexNow(url); // best-effort, ne bloque pas la réponse
    res.status(200).json({ ok: true, slug: article.slug, url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Rejette (supprime) un brouillon jugé pas assez bon pour être publié.
async function rejectDraft(redis, slug, res) {
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'slug requis' });
  }
  try {
    await redis.del(`blog:draft:${slug}`);
    await redis.zrem('blog:drafts', slug);
    res.status(200).json({ ok: true, slug, rejected: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
