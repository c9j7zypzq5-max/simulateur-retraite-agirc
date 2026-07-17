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

  it('rendement locatif : 200 000 €, loyer 800 €, charges 1 200 € + TF 900 € → brut 4,8 % / net 3,75 %', () => {
    // Loyers 9 600 ; net annuel 9600−1200−900 = 7 500 → 3,75 % du prix.
    const r = evaluateSchema(byId('rendement-locatif'), { prix: 200000, loyer: 800, charges: 1200, taxeFonciere: 900 });
    expect(r.results[0]).toBeCloseTo(3.75, 4); // net
    expect(r.results[1]).toBeCloseTo(4.8, 4); // brut
    expect(r.results[2]).toBeCloseTo(7500, 2); // revenu net annuel
  });

  it('cash-flow locatif : taux 0 % (120 000 € / 20 ans) → mensualité 500 € exacte, cash-flow 50 €', () => {
    // 700 − 500 − 100 − 600/12 = 50.
    const r = evaluateSchema(byId('cashflow-locatif'), { loyer: 700, montant: 120000, taux: 0, duree: 20, charges: 100, taxeFonciere: 600 });
    expect(r.results[0]).toBeCloseTo(50, 2); // cash-flow mensuel
    expect(r.results[1]).toBeCloseTo(500, 2); // mensualité
    expect(r.results[2]).toBeCloseTo(600, 2); // annuel
  });

  it('cash-flow locatif : un taux plus élevé dégrade le cash-flow', () => {
    const sans = evaluateSchema(byId('cashflow-locatif'), { loyer: 700, montant: 120000, taux: 0, duree: 20, charges: 100, taxeFonciere: 600 });
    const avec = evaluateSchema(byId('cashflow-locatif'), { loyer: 700, montant: 120000, taux: 3.5, duree: 20, charges: 100, taxeFonciere: 600 });
    expect(avec.results[0]).toBeLessThan(sans.results[0]);
  });

  it('assurance emprunteur : 200 000 € à 0,34 % sur 20 ans → 56,67 €/mois, 13 600 € au total', () => {
    const r = evaluateSchema(byId('assurance-emprunteur'), { capital: 200000, tauxAssurance: 0.34, duree: 20 });
    expect(r.results[0]).toBeCloseTo(56.67, 2);
    expect(r.results[1]).toBeCloseTo(13600, 2);
    expect(r.results[2]).toBeCloseTo(680, 2);
  });

  it('net vendeur : 300 000 € FAI à 4,5 % → honoraires 13 500 €, net 286 500 €', () => {
    const r = evaluateSchema(byId('frais-agence'), { prix: 300000, commission: 4.5 });
    expect(r.results[0]).toBeCloseTo(286500, 2);
    expect(r.results[1]).toBeCloseTo(13500, 2);
  });

  it('location saisonnière : 100 €/nuit, 50 % d\'occupation, 20 % de commission, 200 € de charges → 1 016 €/mois', () => {
    // 15,2 nuitées → brut 1 520 ; commission 304 ; net 1 016 ; annuel 12 192.
    const r = evaluateSchema(byId('location-saisonniere'), { prixNuit: 100, occupation: 50, commission: 20, charges: 200 });
    expect(r.results[0]).toBeCloseTo(1016, 2);
    expect(r.results[1]).toBeCloseTo(1520, 2);
    expect(r.results[2]).toBeCloseTo(12192, 2);
  });

  it('micro-entrepreneur : 40 000 € en BNC (26,1 %) → 10 440 € de cotisations (taux 2026)', () => {
    const r = evaluateSchema(byId('charges-micro'), { ca: 40000, activite: 0.261 });
    expect(r.results[0]).toBeCloseTo(29560, 2); // revenu
    expect(r.results[1]).toBeCloseTo(10440, 2); // cotisations
  });

  it('rente : 1 000 €/mois à 4 % de taux de retrait → 300 000 € de capital', () => {
    const r = evaluateSchema(byId('rente'), { rente: 1000, taux: 4 });
    expect(r.results[0]).toBeCloseTo(300000, 2);
    expect(r.results[1]).toBeCloseTo(12000, 2);
  });

  it('objectif d\'épargne : taux 0 % → versement = effort restant / nb de mois', () => {
    // Futur capital = 10 000 ; effort 40 000 sur 120 mois = 333,33 €.
    const r = evaluateSchema(byId('epargne-objectif'), { objectif: 50000, capitalInitial: 10000, duree: 10, taux: 0 });
    expect(r.results[0]).toBeCloseTo(333.33, 2);
    expect(r.results[1]).toBeCloseTo(10000, 2);
    expect(r.results[2]).toBeCloseTo(40000, 2);
  });

  it('objectif d\'épargne : un rendement positif réduit le versement ; objectif déjà atteint → 0', () => {
    const sans = evaluateSchema(byId('epargne-objectif'), { objectif: 50000, capitalInitial: 10000, duree: 10, taux: 0 });
    const avec = evaluateSchema(byId('epargne-objectif'), { objectif: 50000, capitalInitial: 10000, duree: 10, taux: 4 });
    expect(avec.results[0]).toBeGreaterThan(0);
    expect(avec.results[0]).toBeLessThan(sans.results[0]);
    const atteint = evaluateSchema(byId('epargne-objectif'), { objectif: 5000, capitalInitial: 10000, duree: 10, taux: 4 });
    expect(atteint.results[0]).toBeCloseTo(0, 4);
  });

  it('TVA : ventes 30 000 € à 20 %, achats 8 000 € à 20 % → 4 400 € à reverser', () => {
    const r = evaluateSchema(byId('tva'), { caHT: 30000, tauxVente: 0.2, achatsHT: 8000, tauxAchats: 0.2 });
    expect(r.results[0]).toBeCloseTo(4400, 2);
    expect(r.results[1]).toBeCloseTo(6000, 2);
    expect(r.results[2]).toBeCloseTo(1600, 2);
  });

  it('indemnités km : 4 000 km en 5 CV (0,636 €/km) → 2 544 €', () => {
    const r = evaluateSchema(byId('indemnites-km'), { km: 4000, tarif: 0.636 });
    expect(r.results[0]).toBeCloseTo(2544, 2);
    expect(r.results[1]).toBeCloseTo(212, 2);
  });

  it('taux horaire : 2 500 € net + 800 € de fixes à 45 % de cotisations sur 25 h/sem → CA 6 000 €, ~55,43 €/h', () => {
    // (2500+800)/0,55 = 6 000 ; 25×4,33 = 108,25 h → 55,43 €/h.
    const r = evaluateSchema(byId('taux-horaire'), { revenuCible: 2500, chargesFixes: 800, cotisations: 45, heures: 25 });
    expect(r.results[0]).toBeCloseTo(55.43, 1);
    expect(r.results[1]).toBeCloseTo(6000, 2);
  });

  it('coût salarié : brut 3 000 € à 42 % + 100 € d\'avantages → 4 360 €/mois, coefficient 1,45', () => {
    const r = evaluateSchema(byId('cout-salarie'), { brut: 3000, tauxPatronal: 42, avantages: 100 });
    expect(r.results[0]).toBeCloseTo(4360, 2);
    expect(r.results[1]).toBeCloseTo(52320, 2);
    expect(r.results[2]).toBeCloseTo(4360 / 3000, 4);
  });

  it('seuil de rentabilité : 4 000 € de fixes à 60 % de marge → 6 666,67 €/mois, 80 000 €/an', () => {
    const r = evaluateSchema(byId('seuil-rentabilite'), { chargesFixes: 4000, margeVariable: 60, joursOuvres: 21 });
    expect(r.results[0]).toBeCloseTo(6666.67, 1);
    expect(r.results[1]).toBeCloseTo(317.46, 1);
    expect(r.results[2]).toBeCloseTo(80000, 1);
  });

  it('marge produit : vente 60 € TTC (TVA 20 %), achat 20 € + 5 € de frais + 15 % de commission → marge 16 € (32 %)', () => {
    // HT 50 ; commission 9 (sur TTC) ; coûts 34 ; marge 16 → 32 % du HT.
    const r = evaluateSchema(byId('marge-produit'), { prixVente: 60, tva: 0.2, prixAchat: 20, frais: 5, commission: 15 });
    expect(r.results[0]).toBeCloseTo(16, 2);
    expect(r.results[1]).toBeCloseTo(32, 2);
    expect(r.results[2]).toBeCloseTo(34, 2);
  });

  it('coût matière : assiette 5 € vendue 22 € TTC (TVA 10 %) → ratio 25 %, marge 15 €, coefficient 4', () => {
    // HT 20 ; 5/20 = 25 % ; marge 15 ; coefficient 20/5 = 4.
    const r = evaluateSchema(byId('food-cost'), { coutMatiere: 5, prixVente: 22, tva: 0.1 });
    expect(r.results[0]).toBeCloseTo(25, 2);
    expect(r.results[1]).toBeCloseTo(15, 2);
    expect(r.results[2]).toBeCloseTo(4, 4);
  });

  it('solaire : 6 kWc × 1 100 kWh, 50 % autoconsommés à 0,25 €, surplus à 0,04 € → gain 957 €/an', () => {
    // Production 6 600 kWh ; autoconso 825 € ; revente 132 € ; 14 000/957 ≈ 14,63 ans.
    const r = evaluateSchema(byId('solaire'), { puissance: 6, productible: 1100, autoconso: 50, prixKwh: 0.25, tarifRachat: 0.04, cout: 14000 });
    expect(r.results[0]).toBeCloseTo(957, 2);
    expect(r.results[1]).toBeCloseTo(825, 2);
    expect(r.results[2]).toBeCloseTo(14.63, 2);
  });
});
