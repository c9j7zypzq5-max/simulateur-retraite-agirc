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

  it('capacité : 4 000 € / 3,5 % / 20 ans → ~241 396 € empruntables', () => {
    // mensualité max 35 % = 1 400 ; capital = 1400 × (1-(1+i)^-240)/i, i=3,5 %/12.
    const r = evaluateSchema(byId('capacite'), { revenu: 4000, charges: 0, taux: 3.5, duree: 20 });
    expect(r.results[0]).toBeCloseTo(241396.08, 0);
    expect(r.results[1]).toBeCloseTo(1400, 2);
  });

  it('capacité : les charges en cours réduisent le capital', () => {
    const sans = evaluateSchema(byId('capacite'), { revenu: 4000, charges: 0, taux: 3.5, duree: 20 });
    const avec = evaluateSchema(byId('capacite'), { revenu: 4000, charges: 500, taux: 3.5, duree: 20 });
    expect(avec.results[0]).toBeLessThan(sans.results[0]);
  });

  it('épargne : 5 000 € + 200 €/mois à 5 % sur 10 ans → capital final ~39 291 €', () => {
    // capitalisation mensuelle : 5000×(1+i)^120 + 200×((1+i)^120-1)/i, i=5 %/12.
    const r = evaluateSchema(byId('epargne'), { capitalInitial: 5000, versement: 200, taux: 5, duree: 10 });
    expect(r.results[0]).toBeCloseTo(39291.5, 0);
    expect(r.results[1]).toBeCloseTo(29000, 2); // total versé
    expect(r.results[2]).toBeCloseTo(10291.5, 0); // intérêts
  });

  it('épargne : taux 0 % → capital final = total versé (pas de division par zéro)', () => {
    const r = evaluateSchema(byId('epargne'), { capitalInitial: 5000, versement: 200, taux: 0, duree: 10 });
    expect(r.results[0]).toBeCloseTo(29000, 2);
    expect(r.results[2]).toBeCloseTo(0, 2);
  });

  it('impôt : 30 000 € pour 1 part → 2 103,99 € (barème IR 2026)', () => {
    // 17 979×11 % + 421×30 % = 1 977,69 + 126,30 = 2 103,99.
    const r = evaluateSchema(byId('impot'), { revenu: 30000, parts: 1 });
    expect(r.results[0]).toBeCloseTo(2103.99, 2);
  });

  it('impôt : le quotient familial (2 parts) réduit l\'impôt', () => {
    // 60 000 € sur 2 parts = quotient 30 000 → impôt 2×2 103,99 = 4 207,98,
    // strictement inférieur à l\'impôt du même revenu sur 1 part.
    const deuxParts = evaluateSchema(byId('impot'), { revenu: 60000, parts: 2 });
    const unePart = evaluateSchema(byId('impot'), { revenu: 60000, parts: 1 });
    expect(deuxParts.results[0]).toBeCloseTo(4207.98, 2);
    expect(deuxParts.results[0]).toBeLessThan(unePart.results[0]);
  });

  it('devis : 40 m² × 25 € + 80 € forfait, TVA 10 % → 1 188 € TTC', () => {
    const r = evaluateSchema(byId('devis'), { surface: 40, prixM2: 25, deplacement: 80, tva: 0.1 });
    expect(r.results[0]).toBeCloseTo(1188, 2); // TTC
    expect(r.results[1]).toBeCloseTo(1080, 2); // HT
    expect(r.results[2]).toBeCloseTo(108, 2); // TVA
  });

  it('ROI : budget 2 000 €, CPC 0,80 €, conv 2 %, panier 60 €, marge 40 % → ROAS 1,5 / profit -800 €', () => {
    // 2 500 clics → 50 conversions → CA 3 000 ; profit 3000×40 %−2000 = −800.
    const r = evaluateSchema(byId('roi'), { budget: 2000, cpc: 0.8, conversion: 2, panier: 60, marge: 40 });
    expect(r.results[0]).toBeCloseTo(1.5, 4); // ROAS
    expect(r.results[1]).toBeCloseTo(3000, 2); // CA
    expect(r.results[2]).toBeCloseTo(-800, 2); // profit
    expect(r.results[3]).toBeCloseTo(50, 4); // conversions
  });
});
