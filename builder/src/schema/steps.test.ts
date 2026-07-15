import { describe, it, expect } from 'vitest';
import { isWizard, fieldStepIndex, groupByStep } from './steps';
import type { CalculatorSchema, Field } from './types';

const base: CalculatorSchema = { fields: [], variables: [], results: [], baremes: {} };
const field = (id: string, wizardStep?: number): Field => ({ id, type: 'number', label: id, default: 0, wizardStep });

describe('steps (wizard)', () => {
  it('isWizard : faux sans étapes, sans 1 étape ; vrai à partir de 2', () => {
    expect(isWizard(base)).toBe(false);
    expect(isWizard({ ...base, steps: [] })).toBe(false);
    expect(isWizard({ ...base, steps: [{ title: 'A' }] })).toBe(false);
    expect(isWizard({ ...base, steps: [{ title: 'A' }, { title: 'B' }] })).toBe(true);
  });

  it('fieldStepIndex : borne les valeurs hors plage et les absents à une étape valide', () => {
    expect(fieldStepIndex(field('a'), 3)).toBe(0); // absent → 0
    expect(fieldStepIndex(field('a', 1), 3)).toBe(1);
    expect(fieldStepIndex(field('a', 9), 3)).toBe(2); // au-delà → dernière étape
    expect(fieldStepIndex(field('a', -2), 3)).toBe(0); // négatif → 0
    expect(fieldStepIndex(field('a', 1.5), 3)).toBe(0); // non entier → 0
  });

  it('groupByStep : répartit les champs et conserve les étapes vides', () => {
    const fields = [field('a', 0), field('b', 2), field('c'), field('d', 1)];
    const groups = groupByStep(fields, 3);
    expect(groups).toHaveLength(3);
    expect(groups[0].map((f) => f.id)).toEqual(['a', 'c']); // c absent → étape 0
    expect(groups[1].map((f) => f.id)).toEqual(['d']);
    expect(groups[2].map((f) => f.id)).toEqual(['b']);
  });

  it('groupByStep : un champ pointant une étape supprimée retombe sur la dernière', () => {
    // étape 5 demandée mais il n'y a plus que 2 étapes → dernière (index 1).
    const groups = groupByStep([field('x', 5)], 2);
    expect(groups[1].map((f) => f.id)).toEqual(['x']);
  });
});
