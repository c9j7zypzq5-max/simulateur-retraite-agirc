import { createContext, useContext, useState, useCallback } from "react";

const KEY = "simfinly_fiscal_profile";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { tmi: 30 };
    return { tmi: 30, ...JSON.parse(raw) };
  } catch { return { tmi: 30 }; }
}

const FiscalProfileContext = createContext(null);

export function FiscalProfileProvider({ children }) {
  const [profile, setProfile] = useState(load);

  const update = useCallback((patch) => {
    setProfile(prev => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return (
    <FiscalProfileContext.Provider value={{ profile, update }}>
      {children}
    </FiscalProfileContext.Provider>
  );
}

export function useFiscalProfileContext() {
  return useContext(FiscalProfileContext) || { profile: { tmi: 30 }, update: () => {} };
}
