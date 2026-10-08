// Erreurs de chargement de module/chunk : fréquentes quand un onglet ouvert
// avant un déploiement demande un ancien chunk dont le nom de fichier a disparu.
// Un rechargement complet récupère le nouvel index.html (donc les bons chunks).
export function isChunkLoadError(error) {
  const msg = `${error?.name || ''} ${error?.message || ''}`;
  return /ChunkLoadError|Loading chunk|dynamically imported module|Importing a module script failed|Failed to fetch dynamically|error loading dynamically/i.test(msg);
}

const KEY = 'chunk_reload_at';
const MIN_INTERVAL_MS = 10_000;

// Recharge la page, au plus une fois par fenêtre de 10 s : évite toute boucle si
// le chunk reste introuvable, sans bloquer une nouvelle récupération plus tard
// dans la session (prochain déploiement). Renvoie true si un rechargement part.
export function reloadOnceForChunkError() {
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0);
    if (Date.now() - last < MIN_INTERVAL_MS) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch { /* sessionStorage indisponible : on tente quand même */ }
  window.location.reload();
  return true;
}
