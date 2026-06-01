const KEY = 'mesim_profile_v1';

// Champs partagés entre simulateurs (âge, capital, épargne, revenu)
export function useProfile() {
  function getProfile() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch { return {}; }
  }

  function updateProfile(updates) {
    try {
      const next = { ...getProfile() };
      // N'écrase que les valeurs non-nulles
      Object.entries(updates).forEach(([k, v]) => {
        if (v !== null && v !== undefined) next[k] = v;
      });
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }

  return { getProfile, updateProfile };
}
