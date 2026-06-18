const KEY = 'simfinly_pro_v1';

export function useAuth() {
  function getProStatus() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { isPro: false, email: null };
      const data = JSON.parse(raw);
      // Expire after 35 days — renewed each time subscription is verified active
      if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
        localStorage.removeItem(KEY);
        return { isPro: false, email: null };
      }
      return { isPro: !!data.isPro, email: data.email || null };
    } catch { return { isPro: false, email: null }; }
  }

  function activatePro(email) {
    try {
      const expiresAt = new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem(KEY, JSON.stringify({ isPro: true, email: email || '', expiresAt }));
      return true;
    } catch { return false; }
  }

  function deactivatePro() {
    try { localStorage.removeItem(KEY); } catch {}
  }

  return { ...getProStatus(), activatePro, deactivatePro };
}
