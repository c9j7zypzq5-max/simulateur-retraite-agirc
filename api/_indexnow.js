// IndexNow : notifie Bing/Yandex (et les autres moteurs participants) qu'une
// URL vient d'être publiée ou modifiée, au lieu d'attendre leur prochain
// passage de crawl. Best-effort : ne doit jamais faire échouer la publication
// si l'appel réseau échoue ou timeout.
//
// Clé générée une fois pour le site, vérifiée par le fichier statique
// public/{key}.txt (contenu = la clé elle-même), conformément au protocole.
const INDEXNOW_KEY = 'bed1de33c0b81e52e70aff319de1cf16';
const BASE = 'https://www.simfinly.com';

export async function pingIndexNow(urls) {
  const urlList = (Array.isArray(urls) ? urls : [urls]).filter(Boolean);
  if (!urlList.length) return;
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'www.simfinly.com',
        key: INDEXNOW_KEY,
        keyLocation: `${BASE}/${INDEXNOW_KEY}.txt`,
        urlList: urlList.map(u => (u.startsWith('http') ? u : `${BASE}${u}`)),
      }),
    });
  } catch {
    // best-effort — la publication ne doit jamais échouer à cause de ceci
  }
}
