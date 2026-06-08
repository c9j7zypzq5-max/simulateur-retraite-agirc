// Notifie les moteurs compatibles IndexNow (Bing, Yandex, Seznam, DuckDuckGo…)
// qu'une ou plusieurs URLs ont été créées/mises à jour, pour une (ré)indexation
// quasi immédiate. Google n'utilise pas IndexNow mais en bénéficie indirectement
// (les pages fraîches sont découvertes/recrawlées plus vite par l'écosystème).
//
// La clé IndexNow doit être exposée publiquement à
//   https://www.mesimulateurs.fr/<key>.txt
// → fichier public/0ee431ac70411af837b9a6b59f670007.txt (contenu = la clé).
// Surchargée par la variable d'env INDEXNOW_KEY si définie (le fichier public
// doit alors correspondre).
//
// Préfixe « _ » : Vercel ne traite pas ce fichier comme une route serverless.

const HOST = 'www.mesimulateurs.fr';

export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || '0ee431ac70411af837b9a6b59f670007';

// Endpoint partagé IndexNow : une seule soumission propage l'info à tous les
// moteurs participants (Bing, Yandex, Seznam…).
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

// Soumet une ou plusieurs URLs à IndexNow. Ne lève jamais : renvoie un objet de
// statut, afin de ne pas faire échouer la publication d'un article si le ping
// échoue.
export async function submitToIndexNow(urls) {
  const key = INDEXNOW_KEY;
  if (!key) return { ok: false, skipped: 'no-key' };

  const urlList = (Array.isArray(urls) ? urls : [urls]).filter(Boolean);
  if (!urlList.length) return { ok: false, skipped: 'no-urls' };

  const payload = {
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList,
  };

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok, status: res.status, count: urlList.length };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
