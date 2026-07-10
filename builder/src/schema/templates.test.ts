import { describe, it, expect } from 'vitest';
import { evaluateSchema } from '../engine/evaluate';
import { TEMPLATES } from './templates';

const byId = (id: string) => {
  const tpl = TEMPLATES.find((t) => t.id === id);
  if (!tpl) throw new Error(`template ${id} introuvable`);
  return tpl.schema;
};

describe('templates (fidélité aux simulateurs source)', () => {
  it('chaque template s\'évalue sans erreur avec ses valeurs par défaut', () => {
    for (const tpl of TEMPLATES) {
      const r = evaluateSchema(tpl.schema, {});
      expect(r.errors, `erreurs dans ${tpl.id}`).toEqual({});
      expect(r.results.every(Number.isFinite), `résultat non fini dans ${tpl.id}`).toBe(true);
    }
  });

  it('prêt : 15 000 € / 5 ans / 4,5 % → mensualité 279,65 € (amortization.js)', () => {
    const r = evaluateSchema(byId('pret'), { montant: 15000, duree: 5, taux: 4.5 });
    expect(r.results[0]).toBeCloseTo(279.65, 2);
  });

  it('notaire : 200 000 € ancien (hausse) sans mobilier → ~16 234 € (FraisNotaire.jsx)', () => {
    // droits 200000×6,32 % = 12 640 ; émoluments HT 1 995,25 → TTC 2 394,30 ;
    // CSI 200 + débours 1 000. Total 16 234,30.
    const r = evaluateSchema(byId('notaire'), { prix: 200000, tauxDmto: 0.0632, mobilier: 0 });
    expect(r.results[0]).toBeCloseTo(16234.3, 1);
    expect(r.results[1]).toBeCloseTo(12640, 2);
    expect(r.results[2]).toBeCloseTo(2394.3, 1);
  });

  it('notaire : le mobilier réduit l\'assiette', () => {
    const avec = evaluateSchema(byId('notaire'), { prix: 200000, tauxDmto: 0.0632, mobilier: 10000 });
    const sans = evaluateSchema(byId('notaire'), { prix: 200000, tauxDmto: 0.0632, mobilier: 0 });
    expect(avec.results[0]).toBeLessThan(sans.results[0]);
  });

  it('TJM : 500 € × 18 j → net mensuel ~5 894 € (FreelanceVsSalarie.jsx micro-BNC + barème IR 2026)', () => {
    // CA 108 000 ; cotisations 22 788 ; imposable 71 280 ;
    // IR = 17 979×11 % + 41 701×30 % = 1 977,69 + 12 510,30 = 14 487,99 ;
    // net annuel 70 724,01 → mensuel 5 893,67.
    const r = evaluateSchema(byId('tjm'), { tjm: 500, joursParMois: 18 });
    expect(r.results[0]).toBeCloseTo(5893.67, 1);
    expect(r.results[3]).toBeCloseTo(14487.99, 1);
  });
});
