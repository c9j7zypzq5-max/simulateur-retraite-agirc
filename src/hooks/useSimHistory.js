const KEY = 'mesim_history_v1';
export const FREE_SIM_LIMIT = 5;

export function useSimHistory() {
  function getHistory() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  }

  // Sauvegarde une simulation ; déduplique par shareUrl
  function saveEntry({ simulator, label, shareUrl, reportSnapshot }) {
    try {
      const filtered = getHistory().filter(e => e.shareUrl !== shareUrl);
      const entry = {
        id: Date.now(), simulator, label, shareUrl,
        savedAt: new Date().toISOString(),
        ...(reportSnapshot ? { reportSnapshot } : {}),
      };
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

  function updateEntry(id, { label, note }) {
    try {
      const history = getHistory().map(e =>
        e.id === id ? { ...e, ...(label !== undefined ? { label } : {}), ...(note !== undefined ? { note } : {}) } : e
      );
      localStorage.setItem(KEY, JSON.stringify(history));
      return true;
    } catch { return false; }
  }

  // Sync cloud : sauvegarde d'abord dans localStorage puis dans Supabase en background
  async function saveEntryWithSync(entry, { user, supabaseClient } = {}) {
    saveEntry(entry);
    if (!supabaseClient || !user) return;
    try {
      await supabaseClient.from('simulations').upsert({
        user_id: user.id,
        simulator: entry.simulator || '',
        label: entry.label || '',
        share_url: entry.shareUrl || '',
        saved_at: new Date().toISOString(),
        report_snapshot: entry.reportSnapshot || null,
      }, { onConflict: 'user_id,share_url' });
    } catch { /* sync silencieuse */ }
  }

  async function removeEntryWithSync(id, { user, supabaseClient } = {}) {
    const entry = getHistory().find(e => e.id === id);
    removeEntry(id);
    if (!supabaseClient || !user || !entry) return;
    try {
      await supabaseClient.from('simulations')
        .delete().eq('user_id', user.id).eq('share_url', entry.shareUrl);
    } catch { /* sync silencieuse */ }
  }

  async function updateEntryWithSync(id, patch, { user, supabaseClient } = {}) {
    updateEntry(id, patch);
    if (!supabaseClient || !user) return;
    try {
      const entries = getHistory();
      const entry = entries.find(e => e.id === id);
      if (!entry) return;
      await supabaseClient.from('simulations')
        .update({
          ...(patch.label !== undefined ? { label: patch.label } : {}),
          ...(patch.note !== undefined ? { note: patch.note } : {}),
        })
        .eq('user_id', user.id).eq('share_url', entry.shareUrl);
    } catch { /* sync silencieuse */ }
  }

  return { getHistory, saveEntry, saveEntryWithSync, removeEntry, removeEntryWithSync, updateEntry, updateEntryWithSync, clearHistory };
}

// Fonction standalone (hors composant React) : merge les données Supabase dans localStorage
export async function syncFromCloud(user, supabaseClient) {
  if (!user || !supabaseClient) return;
  try {
    const { data } = await supabaseClient
      .from('simulations')
      .select('*')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });
    if (!data || data.length === 0) return;

    const raw = localStorage.getItem(KEY);
    const local = raw ? JSON.parse(raw) : [];
    const cloudUrls = new Set(data.map(e => e.share_url));
    const localOnly = local.filter(e => !cloudUrls.has(e.shareUrl));
    const merged = [
      ...data.map(e => ({
        id: e.id,
        simulator: e.simulator,
        label: e.label,
        shareUrl: e.share_url,
        savedAt: e.saved_at,
        note: e.note || '',
        reportSnapshot: e.report_snapshot || undefined,
      })),
      ...localOnly,
    ];
    localStorage.setItem(KEY, JSON.stringify(merged));
    // Déclenche les listeners storage (autres onglets + Compte.jsx)
    window.dispatchEvent(new StorageEvent('storage', { key: KEY }));
  } catch { /* sync silencieuse */ }
}
