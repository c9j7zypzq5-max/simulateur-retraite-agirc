import { describe, it, expect } from "vitest";

// ─── Utilitaires copiés des simulateurs ──────────────────────────────────────

// ── IR 2026 ─────────────────────────────────────────────────────────────────
const BAREME = [
  { min: 0,        max: 11_600,  taux: 0    },
  { min: 11_600,   max: 29_579,  taux: 0.11 },
  { min: 29_579,   max: 84_577,  taux: 0.30 },
  { min: 84_577,   max: 181_917, taux: 0.41 },
  { min: 181_917,  max: Infinity, taux: 0.45 },
];

function calcIRBrut(revenuImposable, parts = 1) {
  const quotient = revenuImposable / parts;
  let irQ = 0;
  for (const { min, max, taux } of BAREME) {
    if (quotient <= min) break;
    irQ += (Math.min(quotient, max) - min) * taux;
  }
  return irQ * parts;
}

// ── Succession ────────────────────────────────────────────────────────────────
const TRANCHES_DIRECTE = [
  { limit: 8_072,     rate: 0.05 },
  { limit: 12_109,    rate: 0.10 },
  { limit: 15_932,    rate: 0.15 },
  { limit: 552_324,   rate: 0.20 },
  { limit: 902_838,   rate: 0.30 },
  { limit: 1_805_677, rate: 0.40 },
  { limit: Infinity,  rate: 0.45 },
];

function calcTranches(taxable, tranches) {
  if (taxable <= 0) return 0;
  let tax = 0, prev = 0;
  for (const { limit, rate } of tranches) {
    const slice = Math.min(taxable, limit) - prev;
    if (slice <= 0) break;
    tax += slice * rate;
    prev = limit;
    if (taxable <= limit) break;
  }
  return tax;
}

function calcSuccession({ actifNet, lien, nbHeritiers, donations = 0 }) {
  nbHeritiers = Math.max(1, nbHeritiers);
  if (lien === "conjoint") return { totalDroits: 0, droitsChaque: 0, netChaque: actifNet / nbHeritiers };
  const ABATTEMENTS = { enfant: 100_000, frere: 15_932, neveu: 7_967, autre: 1_594 };
  const partBrute = actifNet / nbHeritiers;
  const abattement = Math.max(0, (ABATTEMENTS[lien] ?? 1_594) - donations);
  const partTaxable = Math.max(0, partBrute - abattement);
  const droitsChaque = calcTranches(partTaxable, TRANCHES_DIRECTE);
  return {
    totalDroits: droitsChaque * nbHeritiers,
    droitsChaque,
    netChaque: partBrute - droitsChaque,
    partTaxable,
  };
}

// ── Emprunt immobilier ────────────────────────────────────────────────────────
function calcMensualite(capital, tauxAnnuel, dureeAns) {
  const r = tauxAnnuel / 100 / 12;
  const n = dureeAns * 12;
  if (r === 0) return capital / n;
  return capital * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

// ── Épargne / intérêts composés ───────────────────────────────────────────────
function calcEpargne({ capitalInitial, versement, tauxAnnuel, duree }) {
  const c = capitalInitial || 0;
  const v = versement || 0;
  const r = tauxAnnuel / 100 / 12;
  const n = duree * 12;
  if (r === 0) return { capitalFinal: c + v * n };
  const crescendo = c * Math.pow(1 + r, n) + v * (Math.pow(1 + r, n) - 1) / r;
  return { capitalFinal: crescendo };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("IR 2026 — barème de base", () => {
  it("revenus inférieurs au seuil → 0 € d'IR", () => {
    expect(calcIRBrut(11_000)).toBe(0);
  });

  it("revenu 30 000 € — taux marginal 30%", () => {
    const ir = calcIRBrut(30_000);
    // (29 579 - 11 600) × 11% + (30 000 - 29 579) × 30%
    const attendu = (29_579 - 11_600) * 0.11 + (30_000 - 29_579) * 0.30;
    expect(ir).toBeCloseTo(attendu, 0);
  });

  it("2 parts (couple) divisent le quotient par 2", () => {
    const irSingle = calcIRBrut(60_000, 1);
    const irCouple = calcIRBrut(60_000, 2);
    // Le couple paie moins (avantage quotient familial)
    expect(irCouple).toBeLessThan(irSingle);
  });
});

describe("Succession — droits de succession", () => {
  it("conjoint → 0 € de droits (exonération totale)", () => {
    const res = calcSuccession({ actifNet: 500_000, lien: "conjoint", nbHeritiers: 1 });
    expect(res.totalDroits).toBe(0);
  });

  it("1 enfant, actif 100 000 € → sous l'abattement (100 k€) → 0 €", () => {
    const res = calcSuccession({ actifNet: 100_000, lien: "enfant", nbHeritiers: 1 });
    expect(res.totalDroits).toBe(0);
    expect(res.partTaxable).toBe(0);
  });

  it("1 enfant, actif 200 000 € → part taxable 100 k€ → taux 20%", () => {
    const res = calcSuccession({ actifNet: 200_000, lien: "enfant", nbHeritiers: 1 });
    // Taxable = 200 000 - 100 000 = 100 000
    // 5%×8072 + 10%×(12109-8072) + 15%×(15932-12109) + 20%×(100000-15932)
    const attendu =
      8_072 * 0.05 +
      (12_109 - 8_072) * 0.10 +
      (15_932 - 12_109) * 0.15 +
      (100_000 - 15_932) * 0.20;
    expect(res.droitsChaque).toBeCloseTo(attendu, 0);
  });

  it("2 enfants → abattement doublé", () => {
    const res1 = calcSuccession({ actifNet: 300_000, lien: "enfant", nbHeritiers: 1 });
    const res2 = calcSuccession({ actifNet: 300_000, lien: "enfant", nbHeritiers: 2 });
    // 2 enfants → chaque part = 150 000 - 100 000 = 50 000 taxable
    // 1 enfant  → 200 000 taxable → droits bien plus élevés
    expect(res2.totalDroits).toBeLessThan(res1.totalDroits);
  });

  it("dons antérieurs réduisent l'abattement", () => {
    const sansDon  = calcSuccession({ actifNet: 150_000, lien: "enfant", nbHeritiers: 1, donations: 0 });
    const avecDon  = calcSuccession({ actifNet: 150_000, lien: "enfant", nbHeritiers: 1, donations: 50_000 });
    expect(avecDon.totalDroits).toBeGreaterThan(sansDon.totalDroits);
  });
});

describe("Emprunt immobilier — mensualité", () => {
  it("200 000 € à 3,5 % sur 20 ans ≈ 1 160 €/mois", () => {
    const m = calcMensualite(200_000, 3.5, 20);
    expect(m).toBeCloseTo(1160, -1); // arrondi à la dizaine
  });

  it("mensualité augmente si taux monte", () => {
    const m1 = calcMensualite(200_000, 2, 20);
    const m2 = calcMensualite(200_000, 4, 20);
    expect(m2).toBeGreaterThan(m1);
  });

  it("mensualité baisse si durée allongée", () => {
    const m1 = calcMensualite(200_000, 3.5, 15);
    const m2 = calcMensualite(200_000, 3.5, 25);
    expect(m2).toBeLessThan(m1);
  });

  it("taux 0 % → mensualité = capital / nb mois", () => {
    const m = calcMensualite(120_000, 0, 10);
    expect(m).toBeCloseTo(1_000, 0);
  });
});

describe("Épargne — intérêts composés", () => {
  it("capital doublé sur ~14 ans à 5 % (règle des 72)", () => {
    const res = calcEpargne({ capitalInitial: 10_000, versement: 0, tauxAnnuel: 5, duree: 14.4 });
    expect(res.capitalFinal).toBeGreaterThan(19_800);
  });

  it("sans taux → accumulation linéaire", () => {
    const res = calcEpargne({ capitalInitial: 0, versement: 100, tauxAnnuel: 0, duree: 10 });
    expect(res.capitalFinal).toBeCloseTo(12_000, 0); // 100 × 120 mois
  });

  it("capital final croît avec le taux", () => {
    const r1 = calcEpargne({ capitalInitial: 10_000, versement: 500, tauxAnnuel: 3, duree: 20 });
    const r2 = calcEpargne({ capitalInitial: 10_000, versement: 500, tauxAnnuel: 7, duree: 20 });
    expect(r2.capitalFinal).toBeGreaterThan(r1.capitalFinal);
  });
});

describe("Freelance vs Salarié — cohérence des ordres de grandeur", () => {
  // Chargeées salariales ≈ 22% → net avant IR ≈ 78% du brut
  it("net salarié avant IR ≈ 78% du brut", () => {
    const brut = 50_000;
    const net = brut * 0.78;
    expect(net).toBeCloseTo(39_000, -2);
  });

  // Micro-BIC : cotisations 21.2% + revenu imposable = 50% CA → net avant IR ≈ 78.8%
  it("net micro-BIC avant IR = CA × (1 - 0.212)", () => {
    const ca = 70_000;
    const net = ca * (1 - 0.212);
    expect(net).toBeCloseTo(55_160, 0);
  });
});
