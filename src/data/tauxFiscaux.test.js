import { describe, it, expect } from 'vitest';
import {
  BAREME_IR,
  TAUX_PFU_IR,
  TAUX_PS,
  TAUX_PFU,
  TAUX_PS_RCM,
  TAUX_PFU_RCM,
  TAUX_CSG_DED,
  ABATT_DIV,
  DETAIL_PS,
  PASS_2026,
  PLAFOND_PER_MAX,
  BAREME_SUCCESSION_LIGNE_DIRECTE,
  ABATT_LIGNE_DIRECTE,
  ABATT_CONJOINT,
  DELAI_RAPPEL_ANS,
} from './tauxFiscaux.js';

describe('PFU / flat tax', () => {
  it('TAUX_PFU = IR + PS = 30 %', () => {
    expect(TAUX_PFU).toBeCloseTo(TAUX_PFU_IR + TAUX_PS, 10);
    expect(TAUX_PFU).toBeCloseTo(0.30, 10);
  });

  it('TAUX_PFU_RCM = IR + PS_RCM = 31,4 %', () => {
    expect(TAUX_PFU_RCM).toBeCloseTo(TAUX_PFU_IR + TAUX_PS_RCM, 10);
    expect(TAUX_PFU_RCM).toBeCloseTo(0.314, 10);
  });

  it('TAUX_PFU_RCM > TAUX_PFU (PS RCM supérieur au PS standard)', () => {
    expect(TAUX_PFU_RCM).toBeGreaterThan(TAUX_PFU);
  });

  it('CSG déductible = 6,8 %', () => {
    expect(TAUX_CSG_DED).toBe(0.068);
  });

  it('abattement dividendes = 40 %', () => {
    expect(ABATT_DIV).toBe(0.40);
  });
});

describe('DETAIL_PS', () => {
  it('le total DETAIL_PS vaut 17,2 %', () => {
    const sum = DETAIL_PS.csg + DETAIL_PS.crds + DETAIL_PS.solidarite;
    expect(sum).toBeCloseTo(DETAIL_PS.total, 10);
    expect(DETAIL_PS.total).toBe(0.172);
  });
});

describe('BAREME_IR 2026', () => {
  it('contient 5 tranches', () => {
    expect(BAREME_IR).toHaveLength(5);
  });

  it('première tranche à 0 % commence à 0', () => {
    expect(BAREME_IR[0].min).toBe(0);
    expect(BAREME_IR[0].taux).toBe(0);
  });

  it('TMI max = 45 %', () => {
    expect(BAREME_IR[BAREME_IR.length - 1].taux).toBe(0.45);
    expect(BAREME_IR[BAREME_IR.length - 1].max).toBe(Infinity);
  });

  it('les tranches sont contigues (max[i] = min[i+1])', () => {
    for (let i = 0; i < BAREME_IR.length - 1; i++) {
      expect(BAREME_IR[i].max).toBe(BAREME_IR[i + 1].min);
    }
  });

  it('les taux croissent strictement', () => {
    for (let i = 1; i < BAREME_IR.length; i++) {
      expect(BAREME_IR[i].taux).toBeGreaterThan(BAREME_IR[i - 1].taux);
    }
  });
});

describe('PASS et PER', () => {
  it('PASS_2026 = 47 100 €', () => {
    expect(PASS_2026).toBe(47_100);
  });

  it('PLAFOND_PER_MAX = 10 % de 8 PASS = 37 680 €', () => {
    expect(PLAFOND_PER_MAX).toBeCloseTo(PASS_2026 * 8 * 0.10, 5);
    expect(PLAFOND_PER_MAX).toBe(37_680);
  });
});

describe('BAREME_SUCCESSION_LIGNE_DIRECTE', () => {
  it('contient 7 tranches', () => {
    expect(BAREME_SUCCESSION_LIGNE_DIRECTE).toHaveLength(7);
  });

  it('première tranche à 5 %, dernière à 45 %', () => {
    expect(BAREME_SUCCESSION_LIGNE_DIRECTE[0].taux).toBe(0.05);
    expect(BAREME_SUCCESSION_LIGNE_DIRECTE[BAREME_SUCCESSION_LIGNE_DIRECTE.length - 1].taux).toBe(0.45);
  });

  it('les tranches sont contigues', () => {
    for (let i = 0; i < BAREME_SUCCESSION_LIGNE_DIRECTE.length - 1; i++) {
      expect(BAREME_SUCCESSION_LIGNE_DIRECTE[i].max).toBe(BAREME_SUCCESSION_LIGNE_DIRECTE[i + 1].min);
    }
  });
});

describe('Abattements et délais', () => {
  it('abattement ligne directe = 100 000 €', () => {
    expect(ABATT_LIGNE_DIRECTE).toBe(100_000);
  });

  it('abattement conjoint = 80 724 €', () => {
    expect(ABATT_CONJOINT).toBe(80_724);
  });

  it('délai de rappel fiscal = 15 ans', () => {
    expect(DELAI_RAPPEL_ANS).toBe(15);
  });
});
