const KEY = 'mesim_history_v1';

export function useSimHistory() {
  function getHistory() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  }

  // Sauvegarde une simulation ; déduplique par shareUrl
  function saveEntry({ simulator, label, shareUrl }) {
    try {
      const filtered = getHistory().filter(e => e.shareUrl !== shareUrl);
      const entry = { id: Date.now(), simulator, label, shareUrl, savedAt: new Date().toISOString() };
      localStorage.setItem(KEY, JSON.stringify([entry, ...filtered]));
      return true;
    } catch { return false; }
  }

  function removeEntry(id) {
    try {
      localStorage.setItem(KEY, JSON.stringify(getHistory().filter(e => e.id !== id)));
    } catch {}
  }

  function clearHistory() {
    try { localStorage.removeItem(KEY); } catch {}
  }

  return { getHistory, saveEntry, removeEntry, clearHistory };
}
