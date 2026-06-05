import { describe, it, expect } from 'vitest';
import { mensualite, mensualiteMois, futureValueAnnuity, futureValueLump } from './finance.js';

describe('mensualite (durée en années)', () => {
  it('taux 0 % = capital réparti à parts égales', () => {
    expect(mensualite(120000, 0, 10)).toBeCloseTo(1000, 5); // 120000 / 120
  });
  it('prêt 200 000 € à 3 % sur 20 ans ≈ 1109,20 €', () => {
    expect(mensualite(200000, 3, 20)).toBeCloseTo(1109.2, 1);
  });
  it('renvoie 0 pour des entrées non valides', () => {
    expect(mensualite(0, 3, 20)).toBe(0);
    expect(mensualite(100000, 3, 0)).toBe(0);
  });
});

describe('mensualiteMois (durée en mois)', () => {
  it('taux 0 % sur 36 mois', () => {
    expect(mensualiteMois(3600, 0, 36)).toBeCloseTo(100, 5);
  });
  it('crédit conso 10 000 € à 5 % sur 36 mois ≈ 299,71 €', () => {
    expect(mensualiteMois(10000, 5, 36)).toBeCloseTo(299.71, 1);
  });
});

describe('futureValueAnnuity', () => {
  it('taux 0 % = somme des versements', () => {
    expect(futureValueAnnuity(1000, 0, 10)).toBe(10000);
  });
  it('1000 €/an à 10 % sur 2 ans = 2100 €', () => {
    expect(futureValueAnnuity(1000, 10, 2)).toBeCloseTo(2100, 5);
  });
  it('1 an = un seul versement', () => {
    expect(futureValueAnnuity(1000, 5, 1)).toBeCloseTo(1000, 5);
  });
});

describe('futureValueLump', () => {
  it('10 000 € à 5 % sur 10 ans ≈ 16 288,95 €', () => {
    expect(futureValueLump(10000, 5, 10)).toBeCloseTo(16288.95, 1);
  });
  it('taux 0 % conserve le capital', () => {
    expect(futureValueLump(10000, 0, 10)).toBe(10000);
  });
});
