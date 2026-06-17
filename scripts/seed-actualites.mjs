// Publie les articles d'actualité (scripts/actualites-2026.mjs) dans le blog via
// l'endpoint POST /api/publish-article, qui les stocke dans Redis et leur ajoute
// une image libre de droits (Pexels) selon la catégorie.
//
// Usage :
//   SITE_URL=https://www.simfinly.com CRON_SECRET=xxxx node scripts/seed-actualites.mjs
//
// Variables d'environnement :
//   SITE_URL     URL de base du site déployé (défaut : https://www.simfinly.com)
//   CRON_SECRET  (ou PUBLISH_SECRET) Bearer attendu par /api/publish-article si défini côté serveur
//
// Idempotent : republier un même slug écrase l'article existant (set Redis) sans
// créer de doublon (zadd sur le même membre met juste le score à jour).

import { ACTUALITES } from './actualites-2026.mjs';

const SITE_URL = (process.env.SITE_URL || 'https://www.simfinly.com').replace(/\/$/, '');
const SECRET = process.env.CRON_SECRET || process.env.PUBLISH_SECRET || '';
const ENDPOINT = `${SITE_URL}/api/publish-article`;

async function publish(article) {
  const headers = { 'Content-Type': 'application/json' };
  if (SECRET) headers['Authorization'] = `Bearer ${SECRET}`;

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify(article),
  });

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 200) }; }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} — ${data.error || data.raw || 'erreur inconnue'}`);
  }
  return data;
}

async function main() {
  console.log(`→ Publication de ${ACTUALITES.length} article(s) sur ${ENDPOINT}`);
  if (!SECRET) {
    console.warn('  ⚠ Aucun CRON_SECRET/PUBLISH_SECRET fourni : l\'appel échouera si le serveur en exige un.');
  }

  let ok = 0;
  for (const article of ACTUALITES) {
    try {
      const r = await publish(article);
      console.log(`  ✓ ${article.slug}  →  ${r.url || r.slug || 'publié'}`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ${article.slug}  →  ${err.message}`);
    }
  }

  console.log(`\nTerminé : ${ok}/${ACTUALITES.length} article(s) publié(s).`);
  if (ok < ACTUALITES.length) process.exitCode = 1;
}

main();
