// Logique des calculateurs multi-étapes (wizard), isolée du rendu pour être
// testable. Un schéma sans étapes (ou avec une seule) reste un calculateur
// d'un bloc : le mode wizard ne s'active qu'à partir de 2 étapes.

import type { CalculatorSchema, Field } from './types';

export function isWizard(schema: CalculatorSchema): boolean {
  return Array.isArray(schema.steps) && schema.steps.length > 1;
}

// Index d'étape d'un champ, borné à [0, stepCount-1]. Toute valeur absente,
// non entière ou hors bornes retombe sur une étape valide (0 ou la dernière) —
// jamais un champ « orphelin » invisible parce que son étape n'existe plus.
export function fieldStepIndex(field: Field, stepCount: number): number {
  const s = field.wizardStep;
  if (s == null || !Number.isInteger(s) || s < 0) return 0;
  return Math.min(s, stepCount - 1);
}

// Répartit des champs (déjà filtrés par visibilité si besoin) en un tableau de
// listes, une par étape. Les étapes vides restent présentes (tableau vide).
export function groupByStep(fields: Field[], stepCount: number): Field[][] {
  const groups: Field[][] = Array.from({ length: Math.max(stepCount, 1) }, () => []);
  for (const f of fields) groups[fieldStepIndex(f, stepCount)].push(f);
  return groups;
}
