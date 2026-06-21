import { useFiscalProfileContext } from "../context/FiscalProfileContext.jsx";

// Retourne { tmi, setTmi } — TMI en % (ex: 30 pour 30 %)
// Persisté dans localStorage sous "simfinly_fiscal_profile"
export function useFiscalProfile() {
  const { profile, update } = useFiscalProfileContext();
  return {
    tmi: profile.tmi ?? 30,
    setTmi: (tmi) => update({ tmi }),
  };
}
