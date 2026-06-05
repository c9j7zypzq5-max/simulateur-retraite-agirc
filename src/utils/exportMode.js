import { useState, useEffect } from "react";

// Signal global « mode export » : quand il est actif, les sections repliables
// (AccordionSection) s'ouvrent pour que tableaux et détails soient inclus dans
// la capture PDF. ShareBar l'active le temps de la capture puis le désactive.
let exporting = false;
const subscribers = new Set();

export function setExporting(value) {
  exporting = value;
  subscribers.forEach(fn => fn(value));
}

export function isExporting() {
  return exporting;
}

export function useExporting() {
  const [val, setVal] = useState(exporting);
  useEffect(() => {
    const fn = v => setVal(v);
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }, []);
  return val;
}
