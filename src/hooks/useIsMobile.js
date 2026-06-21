import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 680) {
  const [mob, setMob] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < breakpoint
  );
  useEffect(() => {
    const fn = () => setMob(window.innerWidth < breakpoint);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, [breakpoint]);
  return mob;
}
