import { describe, it, expect } from 'vitest';
import { bareme, evaluateSchema } from './evaluate';
import type { CalculatorSchema } from '../schema/types';

// Barème de test : tranches de l'impôt sur le revenu simplifiées.
const IR = [
  { jusqua: 10000, taux: 0 },
  { jusqua: 30000, taux: 0.11 },
  { jusqua: null, taux: 0.3 },
];

describe('bareme (calcul progressif par tranches)', () => {
  it('calcule le montant marginal tranche par tranche', () => {
    // 40 000 : 0 % sur 10 000 + 11 % sur 20 000 + 30 % sur 10 000
    expect(bareme(IR, 40000)).toBeCloseTo(0 + 2200 + 3000);
  });

  it('s’arrête à la tranche de la valeur', () => {
    expect(bareme(IR, 20000)).toBeCloseTo(1100);
    expect(bareme(IR, 10000)).toBe(0);
  });

  it('tableau de tranches vide → 0', () => {
    expect(bareme([], 50000)).toBe(0);
  });

  it('valeur négative ou nulle → 0', () => {
    expect(bareme(IR, -5000)).toBe(0);
    expect(bareme(IR, 0)).toBe(0);
  });

  it('valeur non finie → 0', () => {
    expect(bareme(IR, NaN)).toBe(0);
    expect(bareme(IR, Infinity)).toBe(0);
  });

  it('ignore une tranche dont le plafond est inférieur au plancher courant', () => {
    const desordre = [
      { jusqua: 10000, taux: 0.1 },
      { jusqua: 5000, taux: 0.5 }, // incohérente : ignorée
      { jusqua: null, taux: 0.2 },
    ];
    expect(bareme(desordre, 20000)).toBeCloseTo(10000 * 0.1 + 10000 * 0.2);
  });

  it('barème à tranche unique non bornée = taux simple', () => {
    expect(bareme([{ jusqua: null, taux: 0.2 }], 1000)).toBeCloseTo(200);
  });
});

function schemaWith(over: Partial<CalculatorSchema>): CalculatorSchema {
  return { fields: [], variables: [], results: [], baremes: {}, ...over };
}

describe('evaluateSchema', () => {
  const schema = schemaWith({
    fields: [
      { id: 'montant', type: 'number', label: 'Montant', default: 10000 },
      { id: 'taux', type: 'slider', label: 'Taux', default: 3, min: 0, max: 10, step: 0.1 },
      { id: 'duree', type: 'number', label: 'Durée (ans)', default: 5 },
    ],
    variables: [
      { name: 'tauxMensuel', formula: 'taux / 100 / 12' },
      { name: 'nbMois', formula: 'duree * 12' },
      {
        name: 'mensualite',
        formula:
          'IF(tauxMensuel == 0, montant / nbMois, montant * tauxMensuel / (1 - (1 + tauxMensuel)^(-nbMois)))',
      },
    ],
    results: [
      { label: 'Mensualité', formula: 'ROUND(mensualite, 2)', format: 'eur', size: 'lg' },
      { label: 'Coût total', formula: 'mensualite * nbMois - montant', format: 'eur', size: 'md' },
    ],
  });

  it('évalue champs → variables → résultats (mensualité de prêt)', () => {
    const r = evaluateSchema(schema, { montant: 10000, taux: 3, duree: 5 });
    expect(r.results[0]).toBeCloseTo(179.69, 2);
    expect(r.errors).toEqual({});
  });

  it('utilise la valeur par défaut d’un champ absent', () => {
    const r = evaluateSchema(schema, {});
    expect(r.scope.montant).toBe(10000);
    expect(r.results[0]).toBeCloseTo(179.69, 2);
  });

  it('taux nul : la branche IF évite la division par zéro', () => {
    const r = evaluateSchema(schema, { montant: 12000, taux: 0, duree: 10 });
    expect(r.results[0]).toBe(100);
  });

  it('division par zéro → NaN + erreur, sans exception', () => {
    const s = schemaWith({
      fields: [{ id: 'x', type: 'number', label: 'x', default: 0 }],
      results: [{ label: 'r', formula: '1 / x', format: 'number', size: 'lg' }],
    });
    const r = evaluateSchema(s, { x: 0 });
    expect(r.results[0]).toBeNaN();
    expect(r.errors['results.0']).toBeTruthy();
  });

  it('formule syntaxiquement invalide → NaN + erreur', () => {
    const s = schemaWith({
      results: [{ label: 'r', formula: '1 +* 2', format: 'number', size: 'lg' }],
    });
    const r = evaluateSchema(s, {});
    expect(r.results[0]).toBeNaN();
    expect(r.errors['results.0']).toBeTruthy();
  });

  it('variable inconnue dans une formule → erreur localisée', () => {
    const s = schemaWith({
      variables: [{ name: 'a', formula: 'inexistant * 2' }],
      results: [{ label: 'r', formula: 'a', format: 'number', size: 'lg' }],
    });
    const r = evaluateSchema(s, {});
    expect(r.errors['variables.a']).toBeTruthy();
  });

  it('BAREME est accessible en formule et les barèmes inconnus signalés', () => {
    const s = schemaWith({
      fields: [{ id: 'revenu', type: 'number', label: 'Revenu', default: 40000 }],
      results: [
        { label: 'Impôt', formula: 'BAREME("ir", revenu)', format: 'eur', size: 'lg' },
        { label: 'Erreur', formula: 'BAREME("absent", revenu)', format: 'eur', size: 'md' },
      ],
      baremes: { ir: IR },
    });
    const r = evaluateSchema(s, { revenu: 40000 });
    expect(r.results[0]).toBeCloseTo(5200);
    expect(r.results[1]).toBeNaN();
    expect(r.errors['results.1']).toMatch(/absent/);
  });

  it('AND / OR / MIN / MAX', () => {
    const s = schemaWith({
      fields: [
        { id: 'a', type: 'number', label: 'a', default: 5 },
        { id: 'b', type: 'number', label: 'b', default: 12 },
      ],
      results: [
        { label: 'r', formula: 'IF(AND(a > 0, b > 10), MIN(a, b), MAX(a, b))', format: 'number', size: 'lg' },
        { label: 'r2', formula: 'IF(OR(a > 100, b > 100), 1, 0)', format: 'number', size: 'md' },
      ],
    });
    const r = evaluateSchema(s, { a: 5, b: 12 });
    expect(r.results[0]).toBe(5);
    expect(r.results[1]).toBe(0);
  });

  it('le graphique est évalué comme les résultats', () => {
    const s = schemaWith({
      fields: [{ id: 'x', type: 'number', label: 'x', default: 100 }],
      results: [{ label: 'r', formula: 'x', format: 'number', size: 'lg' }],
      chart: {
        type: 'donut',
        items: [
          { label: 'Part A', formula: 'x * 0.7' },
          { label: 'Part B', formula: 'x * 0.3' },
        ],
      },
    });
    const r = evaluateSchema(s, { x: 200 });
    expect(r.chartValues).toEqual([140, 60]);
  });
});
