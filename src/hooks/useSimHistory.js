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

  // Met à jour le label et/ou la note d'une entrée existante
  function updateEntry(id, { label, note }) {
    try {
      const history = getHistory().map(e =>
        e.id === id ? { ...e, ...(label !== undefined ? { label } : {}), ...(note !== undefined ? { note } : {}) } : e
      );
      localStorage.setItem(KEY, JSON.stringify(history));
      return true;
    } catch { return false; }
  }

  return { getHistory, saveEntry, removeEntry, clearHistory, updateEntry };
}
