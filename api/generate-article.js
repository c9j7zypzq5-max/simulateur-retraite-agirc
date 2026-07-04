import { Redis } from '@upstash/redis';
import { pexelsImage } from './_pexels.js';
import { pingIndexNow } from './_indexnow.js';

// Sujets en rotation — 1 article généré par appel cron
const TOPICS = [
  { title: "L'impact des intérêts composés sur votre épargne à long terme",             category: "Épargne"     },
  { title: "FIRE en France : adapter la règle des 4 % au contexte français",            category: "FIRE"        },
  { title: "PEA vs Assurance-vie : quelle enveloppe choisir pour vos investissements ?", category: "Fiscalité"   },
  { title: "Comment optimiser sa retraite complémentaire Agirc-Arrco",                  category: "Retraite"    },
  { title: "Investissement locatif en 2026 : rendement brut vs rendement net",          category: "Immobilier"  },
  { title: "Règle des 50/30/20 : reprendre le contrôle de son budget",                  category: "Budget"      },
  { title: "Lean, Barista, Fat FIRE : quelle variante vous correspond ?",               category: "FIRE"        },
  { title: "Retraite à 62 ou 64 ans : ce que la réforme change vraiment",               category: "Retraite"    },
  { title: "ETF World vs ETF S&P 500 : quel choix pour un investisseur français ?",     category: "Épargne"     },
  { title: "Plus-value immobilière : comment réduire légalement l'imposition",          category: "Fiscalité"   },
  { title: "Épargner avec un petit salaire : stratégies concrètes",                     category: "Budget"      },
  { title: "Le Coast FIRE : la liberté de travailler sans obligation d'épargner",       category: "FIRE"        },
  { title: "Assurance-vie : les avantages fiscaux après 8 ans",                         category: "Fiscalité"   },
  { title: "Simuler son emprunt immobilier : les erreurs à ne pas commettre",           category: "Immobilier"  },
  { title: "Taux d'épargne : pourquoi 20 % est le minimum recommandé",                 category: "Budget"      },
  // Lot 2 — sujets ajoutés pour éviter la répétition (rotation modulo sur 15
  // sujets seulement : ~7 semaines à raison de 2 articles/semaine avant de
  // reboucler). Catégories alignées sur STATIC_ARTICLES (api/_static-articles.js).
  { title: "Rachat de trimestres de retraite : est-ce rentable selon votre âge ?",      category: "Retraite"    },
  { title: "Cumul emploi-retraite en 2026 : reprendre une activité sans perdre sa pension", category: "Retraite" },
  { title: "IRCANTEC : comprendre la retraite complémentaire des contractuels publics", category: "Retraite"    },
  { title: "Retraite des professions libérales (CIPAV) : ce qu'il faut savoir en 2026", category: "Retraite"    },
  { title: "Synthèse retraite : pourquoi additionner tous ses régimes change tout",     category: "Retraite"    },
  { title: "Retraite et divorce : partage des droits et pension de réversion",          category: "Retraite"    },
  { title: "Capacité d'emprunt : comment les banques calculent le taux d'endettement",  category: "Immobilier"  },
  { title: "Renégocier son crédit immobilier : quand est-ce vraiment rentable ?",       category: "Immobilier"  },
  { title: "Achat immobilier en couple : SCI, indivision ou séparation de biens ?",      category: "Immobilier"  },
  { title: "Investir dans le neuf ou l'ancien en 2026 : avantages et pièges",           category: "Immobilier"  },
  { title: "Flat tax ou barème progressif : comment choisir l'option la plus avantageuse", category: "Fiscalité" },
  { title: "Plus-values mobilières : ce qu'il faut savoir avant de vendre ses actions", category: "Fiscalité"   },
  { title: "Micro-foncier ou régime réel : quel régime fiscal pour votre location nue ?", category: "Fiscalité" },
  { title: "Réduire son impôt sur le revenu légalement : les leviers qui marchent vraiment", category: "Fiscalité" },
  { title: "Stratégies pour réduire les droits de succession entre générations",        category: "Fiscalité"   },
  { title: "SCPI en assurance-vie ou en direct : quelle fiscalité choisir ?",           category: "Finances"    },
  { title: "Pourquoi ne pas tout miser sur un seul placement : le cas pour la diversification", category: "Finances" },
  { title: "Combien épargner chaque mois pour préparer sa retraite ?",                 category: "Épargne"     },
  { title: "Le risque de séquence des rendements : pourquoi les premières années de retrait comptent le plus", category: "FIRE" },
  { title: "Fonds euros et unités de compte : comment répartir son assurance-vie multisupport", category: "Finances" },
  { title: "Épargne salariale : comment optimiser son abondement employeur",            category: "Épargne"     },
  { title: "FIRE et fiscalité française : optimiser ses retraits sans se faire rattraper par l'impôt", category: "FIRE" },
  { title: "Le taux de retrait sécurisé (4 %) est-il toujours valable en 2026 ?",       category: "FIRE"        },
  { title: "Combien de temps pour atteindre l'indépendance financière selon son taux d'épargne ?", category: "FIRE" },
  { title: "FIRE en couple : aligner deux stratégies d'épargne différentes",            category: "FIRE"        },
  { title: "Le coût en heures de travail : une autre façon d'évaluer ses dépenses",     category: "Budget"      },
  { title: "Calculer son reste à vivre avant de s'endetter",                            category: "Budget"      },
  { title: "Freelance ou salarié : comparer réellement son revenu net",                 category: "Budget"      },
  { title: "Crédit à la consommation : quand et comment l'utiliser sans se piéger",     category: "Budget"      },
  { title: "Divorce et patrimoine : comment se répartissent les biens et les dettes",   category: "Budget"      },
];

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
  // Auth : Vercel envoie automatiquement `Authorization: Bearer {CRON_SECRET}` pour les crons.
  // Si CRON_SECRET n'est pas défini, l'endpoint est ouvert (usage dev/test).
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers['authorization'];
    if (auth !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY non configurée' });
  }
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return res.status(500).json({ error: 'Redis non configuré' });
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // Rotation des sujets via un compteur Redis
    const count = await redis.incr('blog:article_count');
    const topic = TOPICS[(count - 1) % TOPICS.length];

    const prompt = `Tu es un rédacteur financier français expert. Rédige un article de blog informatif sur le thème suivant : "${topic.title}".

L'article est destiné au site simfinly.com qui propose des simulateurs financiers gratuits (retraite Agirc-Arrco, CNAV, épargne, FIRE, immobilier, impôts, budget).

Retourne UNIQUEMENT un objet JSON valide, sans texte avant ni après, avec cette structure exacte :
{
  "title": "Titre accrocheur (max 75 caractères)",
  "slug": "titre-kebab-case-sans-accents",
  "intro": "Introduction de 2-3 phrases qui accroche le lecteur et résume l'article.",
  "content": "<h2>...</h2><p>...</p>...",
  "category": "${topic.category}",
  "readTime": 5
}

Contraintes pour le champ content :
- HTML valide avec uniquement les balises : h2, p, ul, li, strong, em
- Entre 550 et 750 mots
- Ton : accessible, bienveillant, pratique, concret
- Contexte 100 % français (fiscalité, institutions et lois françaises)
- Aucune balise h1, script, style, a, img
- Terminer par un court paragraphe invitant à tester les simulateurs de simfinly.com`;

    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!apiRes.ok) {
      const err = await apiRes.text();
      return res.status(500).json({ error: 'Erreur API Anthropic', detail: err.slice(0, 300) });
    }

    const data = await apiRes.json();
    const text = (data.content?.[0]?.text || '').trim();

    let article;
    try {
      article = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return res.status(500).json({ error: 'JSON invalide reçu de Claude', raw: text.slice(0, 200) });
      article = JSON.parse(match[0]);
    }

    if (!article.title || !article.content) {
      return res.status(500).json({ error: 'Champs manquants dans l\'article généré' });
    }

    article.slug = slugify(article.slug || article.title);
    article.publishedAt = new Date().toISOString();
    article.category = article.category || topic.category;
    article.readTime = article.readTime || 5;

    // Image d'illustration libre de droits (Pexels) selon la catégorie. L'index
    // (compteur global d'articles) fait tourner le choix dans le pool pour éviter
    // d'avoir toujours la même photo sur une catégorie.
    if (process.env.PEXELS_API_KEY) {
      const pic = await pexelsImage(article.category, count - 1);
      if (pic) {
        article.image = pic.image;
        article.imageAlt = pic.imageAlt || article.title;
        article.imageCredit = pic.imageCredit;
      }
    }

    // Stockage Redis
    await redis.set(`blog:article:${article.slug}`, JSON.stringify(article));
    await redis.zadd('blog:slugs', { score: Date.now(), member: article.slug });

    pingIndexNow(`https://www.simfinly.com/blog/${article.slug}`); // best-effort, ne bloque pas la réponse
    res.status(200).json({ ok: true, slug: article.slug, title: article.title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
