// Persistance Lot 1 : localStorage uniquement. Remplacé par Supabase au Lot 2
// derrière la même interface load/save.

import type { Calculator } from '../schema/types';
import { blankCalculator, SAMPLE_SCHEMA } from '../schema/defaults';
import { t } from '../i18n';

const KEY = 'simfinly-builder:calculator';

export function loadCalculator(): Calculator {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Calculator;
  } catch {
    // JSON corrompu : on repart de l'exemple
  }
  return blankCalculator(t('editor.untitled'), SAMPLE_SCHEMA);
}

export function saveCalculator(calc: Calculator): void {
  localStorage.setItem(KEY, JSON.stringify({ ...calc, updatedAt: new Date().toISOString() }));
}
