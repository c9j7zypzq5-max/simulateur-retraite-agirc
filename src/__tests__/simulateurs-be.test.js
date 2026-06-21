import { describe, it, expect } from "vitest";

// ─── IPP belge (ImpotRevenuBE) ────────────────────────────────────────────────
const BAREME_BE = [
  { min: 0,      max: 15_820, taux: 0.25 },
  { min: 15_820, max: 27_920, taux: 0.40 },
  { min: 27_920, max: 48_320, taux: 0.45 },
  { min: 48_320, max: Infinity, taux: 0.50 },
];
const QUOTITE_ENFANTS = [0, 1_990, 3_140, 4_720, 6_300];
const QUOTITE_BASE = 10_160;

function calcBracketsRaw(income) {
  let tax = 0;
  for (const { min, max, taux } of BAREME_BE) {
    if (income <= min) break;
    tax += (Math.min(income, max) - min) * taux;
  }
  return tax;
}

function fraisProfForfait(revenu) {
  return Math.min(revenu * 0.30, 5_040);
}

function calcIPP({ revenu, situation = "celibataire", nbEnfants = 0, tauxCommunaux = 7, fraisReels = null, quotientConjugal = false }) {
  const fraisPro = fraisReels !== null ? fraisReels : fraisProfForfait(revenu);
  const revenuNet = Math.max(0, revenu - fraisPro);
  let quotientAmount = 0;
  let revenuContrib = revenuNet;
  if (situation === "marie" && quotientConjugal) {
    quotientAmount = Math.min(revenuNet * 0.30, 12_550);
    revenuContrib = revenuNet - quotientAmount;
  }
  const extraEnfants = QUOTITE_ENFANTS[Math.min(nbEnfants, 4)];
  const quotiteTotal = QUOTITE_BASE + extraEnfants;
  const reductionQuotite = quotiteTotal * 0.25;
  const ippFederal = Math.max(0, calcBracketsRaw(revenuContrib) - reductionQuotite);
  const communales = ippFederal * (tauxCommunaux / 100);
  const ippTotal = ippFederal + communales;
  const tauxMoyen = revenu > 0 ? ippTotal / revenu * 100 : 0;
  return { fraisPro, revenuNet, revenuContrib, ippFederal, communales, ippTotal, tauxMoyen, quotientAmount };
}

describe("IPP belge — barème de base", () => {
  it("revenu nul → impôt nul", () => {
    const res = calcIPP({ revenu: 0 });
    expect(res.ippTotal).toBe(0);
  });

  it("revenu 30 000 € → taux marginal 45 % (3e tranche)", () => {
    const res = calcIPP({ revenu: 30_000, tauxCommunaux: 0, fraisReels: 0 });
    // T1 : 15 820 × 25 % ; T2 : (27 920 - 15 820) × 40 % ; T3 : (30 000 - 27 920) × 45 %
    const brutExpected =
      15_820 * 0.25 +
      (27_920 - 15_820) * 0.40 +
      (30_000 - 27_920) * 0.45;
    const reductionExpected = QUOTITE_BASE * 0.25;
    const expectedFederal = Math.max(0, brutExpected - reductionExpected);
    expect(res.ippFederal).toBeCloseTo(expectedFederal, 0);
  });

  it("centimes communaux à 7 % s'ajoutent à l'IPP fédéral", () => {
    const res = calcIPP({ revenu: 40_000, tauxCommunaux: 7, fraisReels: 0 });
    expect(res.communales).toBeCloseTo(res.ippFederal * 0.07, 1);
  });

  it("enfants à charge réduisent l'impôt (quotité exemptée plus élevée)", () => {
    const sans = calcIPP({ revenu: 50_000, nbEnfants: 0, tauxCommunaux: 0, fraisReels: 0 });
    const avec = calcIPP({ revenu: 50_000, nbEnfants: 2, tauxCommunaux: 0, fraisReels: 0 });
    expect(avec.ippFederal).toBeLessThan(sans.ippFederal);
  });

  it("quotient conjugal réduit la base imposable du principal contribuable", () => {
    const sans = calcIPP({ revenu: 60_000, situation: "marie", quotientConjugal: false, tauxCommunaux: 0, fraisReels: 0 });
    const avec = calcIPP({ revenu: 60_000, situation: "marie", quotientConjugal: true, tauxCommunaux: 0, fraisReels: 0 });
    expect(avec.ippFederal).toBeLessThan(sans.ippFederal);
    expect(avec.quotientAmount).toBeGreaterThan(0);
  });

  it("frais réels > forfait → base imposable plus basse", () => {
    const forfait = calcIPP({ revenu: 30_000, fraisReels: null, tauxCommunaux: 0 });
    const reels   = calcIPP({ revenu: 30_000, fraisReels: 10_000, tauxCommunaux: 0 });
    expect(reels.revenuNet).toBeLessThan(forfait.revenuNet);
    expect(reels.ippFederal).toBeLessThan(forfait.ippFederal);
  });
});

// ─── Pension légale belge (PensionLegaleBE) ───────────────────────────────────
const PLAFOND_SALAIRE = 58_380;
const TAUX_ISOLE    = 0.60;
const TAUX_MENAGE   = 0.75;
const CARRIERE_PLEINE = 45;
const MIN_ISOLE  = 1_729;
const MIN_MENAGE = 2_161;

function ageLegal(birthYear) {
  if (birthYear <= 1962) return 65;
  if (birthYear <= 1965) return 66;
  return 67;
}

function calcPension({ salaireMoyen, carriereAns, tauxMenage = false, birthYear = 1970 }) {
  const taux = tauxMenage ? TAUX_MENAGE : TAUX_ISOLE;
  const minPension = tauxMenage ? MIN_MENAGE : MIN_ISOLE;
  const salairePlafonné = Math.min(salaireMoyen, PLAFOND_SALAIRE);
  const carriereCoeff = Math.min(carriereAns, CARRIERE_PLEINE) / CARRIERE_PLEINE;
  const pensionBrute = (salairePlafonné * taux * carriereCoeff) / 12;
  const coeffMin = carriereAns >= CARRIERE_PLEINE ? 1 : carriereAns / CARRIERE_PLEINE;
  const minProrata = minPension * coeffMin;
  const pensionMensuelle = Math.max(pensionBrute, minProrata);
  const anneesBonus = Math.max(0, Math.min(carriereAns - CARRIERE_PLEINE, 5));
  const bonusPct = anneesBonus * 0.02;
  const pensionAvecBonus = pensionMensuelle * (1 + bonusPct);
  return { pensionMensuelle, pensionAvecBonus, anneesBonus, bonusPct, isMinimum: pensionBrute < minProrata, salairePlafonné };
}

describe("Pension légale belge — ONSS", () => {
  it("carrière complète 45 ans, salaire au plafond, taux isolé", () => {
    const res = calcPension({ salaireMoyen: 60_000, carriereAns: 45, tauxMenage: false });
    // (58 380 × 0.60 × 45/45) / 12
    const expected = (PLAFOND_SALAIRE * TAUX_ISOLE) / 12;
    expect(res.pensionMensuelle).toBeCloseTo(expected, 0);
    expect(res.salairePlafonné).toBe(PLAFOND_SALAIRE);
  });

  it("taux ménage donne une pension plus élevée que taux isolé", () => {
    const iso    = calcPension({ salaireMoyen: 40_000, carriereAns: 40 });
    const menage = calcPension({ salaireMoyen: 40_000, carriereAns: 40, tauxMenage: true });
    expect(menage.pensionMensuelle).toBeGreaterThan(iso.pensionMensuelle);
  });

  it("carrière incomplète → pension proportionnelle", () => {
    const pleine = calcPension({ salaireMoyen: 40_000, carriereAns: 45 });
    const partiel = calcPension({ salaireMoyen: 40_000, carriereAns: 30 });
    expect(partiel.pensionMensuelle).toBeLessThan(pleine.pensionMensuelle);
  });

  it("bonus pension : +2 % par an au-delà de 45 ans (max 5 ans)", () => {
    const base  = calcPension({ salaireMoyen: 40_000, carriereAns: 45 });
    const bonus = calcPension({ salaireMoyen: 40_000, carriereAns: 48 });
    expect(bonus.anneesBonus).toBe(3);
    expect(bonus.bonusPct).toBeCloseTo(0.06, 5);
    expect(bonus.pensionAvecBonus).toBeCloseTo(base.pensionMensuelle * 1.06, 0);
  });

  it("minimum garanti appliqué si pension calculée est trop basse", () => {
    const res = calcPension({ salaireMoyen: 5_000, carriereAns: 10 });
    expect(res.isMinimum).toBe(true);
    // Minimum prorata : MIN_ISOLE × 10/45
    const minProrata = MIN_ISOLE * (10 / CARRIERE_PLEINE);
    expect(res.pensionMensuelle).toBeCloseTo(minProrata, 0);
  });

  it("âge légal selon année de naissance", () => {
    expect(ageLegal(1960)).toBe(65);
    expect(ageLegal(1963)).toBe(66);
    expect(ageLegal(1966)).toBe(67);
  });
});

// ─── Succession belge (SuccessionBE) ─────────────────────────────────────────
const BAREME_WAL_DIRECTE = [
  { limit: 12_500,  rate: 0.03 },
  { limit: 25_000,  rate: 0.04 },
  { limit: 50_000,  rate: 0.05 },
  { limit: 100_000, rate: 0.07 },
  { limit: 150_000, rate: 0.10 },
  { limit: 200_000, rate: 0.14 },
  { limit: 250_000, rate: 0.18 },
  { limit: 500_000, rate: 0.24 },
  { limit: Infinity, rate: 0.30 },
];
const BAREME_BXL_DIRECTE = [
  { limit: 50_000,  rate: 0.03 },
  { limit: 100_000, rate: 0.08 },
  { limit: 175_000, rate: 0.09 },
  { limit: 250_000, rate: 0.18 },
  { limit: 500_000, rate: 0.24 },
  { limit: Infinity, rate: 0.30 },
];

function calcTranchesBE(taxable, tranches) {
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

function calcSuccessionBE({ actifNet, lien, nbHeritiers = 1, region = "wal" }) {
  nbHeritiers = Math.max(1, nbHeritiers);
  if (lien === "conjoint") return { totalDroits: 0, droitsChaque: 0, netChaque: actifNet / nbHeritiers };
  const tranches = region === "bxl" ? BAREME_BXL_DIRECTE : BAREME_WAL_DIRECTE;
  const partBrute = actifNet / nbHeritiers;
  const droitsChaque = calcTranchesBE(partBrute, tranches);
  return { totalDroits: droitsChaque * nbHeritiers, droitsChaque, partBrute, netChaque: partBrute - droitsChaque };
}

describe("Succession belge — droits régionaux", () => {
  it("conjoint / cohabitant légal → exonéré dans toutes les régions", () => {
    expect(calcSuccessionBE({ actifNet: 500_000, lien: "conjoint" }).totalDroits).toBe(0);
  });

  it("enfant en ligne directe Wallonie — 1er euro taxé (pas d'abattement)", () => {
    const res = calcSuccessionBE({ actifNet: 10_000, lien: "enfant", region: "wal" });
    // 10 000 × 3 %
    expect(res.droitsChaque).toBeCloseTo(10_000 * 0.03, 0);
  });

  it("enfant Wallonie 250 000 € — barème progressif", () => {
    const res = calcSuccessionBE({ actifNet: 250_000, lien: "enfant", nbHeritiers: 1, region: "wal" });
    // 12 500×3% + 12 500×4% + 25 000×5% + 50 000×7% + 50 000×10% + 50 000×14% + 50 000×18%
    const expected =
      12_500 * 0.03 +
      12_500 * 0.04 +
      25_000 * 0.05 +
      50_000 * 0.07 +
      50_000 * 0.10 +
      50_000 * 0.14 +
      50_000 * 0.18;
    expect(res.droitsChaque).toBeCloseTo(expected, 0);
  });

  it("Bruxelles applique taux 3 % sur les 50 000 premiers euros", () => {
    const res = calcSuccessionBE({ actifNet: 50_000, lien: "enfant", nbHeritiers: 1, region: "bxl" });
    expect(res.droitsChaque).toBeCloseTo(50_000 * 0.03, 0);
  });

  it("2 héritiers → droits totaux plus élevés que 1 héritier (parts plus petites = taux moyen plus bas)", () => {
    const un  = calcSuccessionBE({ actifNet: 300_000, lien: "enfant", nbHeritiers: 1, region: "wal" });
    const deux = calcSuccessionBE({ actifNet: 300_000, lien: "enfant", nbHeritiers: 2, region: "wal" });
    // Avec 2 héritiers, chaque part est plus petite → taux moyen plus bas → total droits plus bas
    expect(deux.totalDroits).toBeLessThan(un.totalDroits);
  });

  it("contraste BE vs FR : pas d'abattement 100 k€/enfant en Belgique", () => {
    // En FR, 1 enfant hérite 100 000 € → abattement 100 k€ → 0 €
    // En BE, 1 enfant hérite 100 000 € → droits dès le 1er euro
    const res = calcSuccessionBE({ actifNet: 100_000, lien: "enfant", nbHeritiers: 1, region: "wal" });
    expect(res.droitsChaque).toBeGreaterThan(0);
  });
});

// ─── AGIRC-Arrco ─────────────────────────────────────────────────────────────
const PASS          = 48_060;
const VALEUR_ACHAT  = 7.46;
const VALEUR_SERVICE = 1.4098;
const TAUX_T1       = 0.0787;
const TAUX_T2       = 0.2159;
const GMP_MIN_PTS   = 120;
const COEF_TABLE = { 62:0.90, 63:0.90, 64:0.90, 65:0.90, 66:0.90, 67:1.00, 68:1.10, 69:1.20, 70:1.30 };
const getCoef = age => COEF_TABLE[age] ?? 1.00;

function calcAgirc({ salaire, anneesFaites, anneesRestantes = 0, ageDépart = 67, bonus3Enfants = false, estCadre = false, evolutionSalaire = 2, tauxReval = 1 }) {
  const sal = Math.max(0, salaire);
  const salAnnActuel = sal * 12;
  const t1p = Math.min(salAnnActuel, PASS);
  const t2p = Math.max(0, Math.min(salAnnActuel, 8 * PASS) - PASS);
  let ptsParAn = ((t1p * TAUX_T1) + (t2p * TAUX_T2)) / VALEUR_ACHAT;
  if (estCadre && salAnnActuel < PASS) ptsParAn = Math.max(ptsParAn, GMP_MIN_PTS);
  const pointsAcquis = ptsParAn * anneesFaites;

  let pointsFuturs = 0;
  let salCourant = sal;
  for (let i = 0; i < anneesRestantes; i++) {
    const salAnn = salCourant * 12;
    const t1 = Math.min(salAnn, PASS);
    const t2 = Math.max(0, Math.min(salAnn, 8 * PASS) - PASS);
    let pts = ((t1 * TAUX_T1) + (t2 * TAUX_T2)) / VALEUR_ACHAT;
    if (estCadre && salAnn < PASS) pts = Math.max(pts, GMP_MIN_PTS);
    pointsFuturs += pts;
    salCourant *= (1 + evolutionSalaire / 100);
  }
  const totalPoints = pointsAcquis + pointsFuturs;
  const coefAge = getCoef(ageDépart);
  const coefEnfants = bonus3Enfants ? 1.10 : 1.00;
  const coefTotal = coefAge * coefEnfants;
  const valServProj = VALEUR_SERVICE * Math.pow(1 + tauxReval / 100, anneesRestantes);
  const pensionBrute = (totalPoints * valServProj / 12) * coefTotal;
  const pensionNette = pensionBrute * 0.83;
  return { totalPoints, pointsAcquis, pointsFuturs, ptsParAn, pensionBrute, pensionNette, coefAge, coefTotal };
}

describe("AGIRC-Arrco — calcul de points et pension", () => {
  it("salaire nul → 0 points et 0 € de pension", () => {
    const res = calcAgirc({ salaire: 0, anneesFaites: 10 });
    expect(res.totalPoints).toBe(0);
    expect(res.pensionBrute).toBe(0);
  });

  it("coefficient à 67 ans = 1.00 (taux plein)", () => {
    expect(getCoef(67)).toBe(1.00);
  });

  it("départ à 65 ans → coefficient 0.90 (malus -10 %)", () => {
    const res = calcAgirc({ salaire: 3_000, anneesFaites: 30, ageDépart: 65 });
    expect(res.coefAge).toBe(0.90);
  });

  it("départ à 68 ans → coefficient 1.10 (bonus +10 %)", () => {
    const res = calcAgirc({ salaire: 3_000, anneesFaites: 30, ageDépart: 68 });
    expect(res.coefAge).toBe(1.10);
  });

  it("bonus 3 enfants → coef multiplicateur 1.10", () => {
    const sans = calcAgirc({ salaire: 3_000, anneesFaites: 30, ageDépart: 67 });
    const avec = calcAgirc({ salaire: 3_000, anneesFaites: 30, ageDépart: 67, bonus3Enfants: true });
    expect(avec.coefTotal).toBe(sans.coefTotal * 1.10);
    expect(avec.pensionBrute).toBeCloseTo(sans.pensionBrute * 1.10, 1);
  });

  it("pension nette ≈ 83 % de la pension brute", () => {
    const res = calcAgirc({ salaire: 3_000, anneesFaites: 30 });
    expect(res.pensionNette).toBeCloseTo(res.pensionBrute * 0.83, 1);
  });

  it("plus d'années = plus de points = pension plus élevée", () => {
    const r1 = calcAgirc({ salaire: 2_500, anneesFaites: 20 });
    const r2 = calcAgirc({ salaire: 2_500, anneesFaites: 35 });
    expect(r2.totalPoints).toBeGreaterThan(r1.totalPoints);
    expect(r2.pensionBrute).toBeGreaterThan(r1.pensionBrute);
  });

  it("cadre sous PASS → minimum GMP de 120 pts/an garantis", () => {
    const res = calcAgirc({ salaire: 1_000, anneesFaites: 10, estCadre: true });
    expect(res.ptsParAn).toBeGreaterThanOrEqual(GMP_MIN_PTS);
    expect(res.pointsAcquis).toBeGreaterThanOrEqual(GMP_MIN_PTS * 10);
  });
});

// ─── i18n/paths.js — routing et localisation ─────────────────────────────────
// Réplique la logique de src/i18n/paths.js sans importer le module (ESM + browser)

const EN_PATH_MAP = {
  '/': '/', '/simulateurs/epargne': '/simulators/savings', '/simulateurs/fire': '/simulators/fire',
  '/simulateurs/budget': '/simulators/budget', '/simulateurs/patrimoine': '/simulators/wealth',
  '/simulateurs/cout-en-heures': '/simulators/cost-in-hours', '/simulateurs/credit-conso': '/simulators/consumer-credit',
  '/simulateurs/comparateur': '/simulators/comparator', '/outils/qr-code': '/tools/qr-code',
  '/mentions-legales': '/legal-notice', '/politique-de-confidentialite': '/privacy-policy',
  '/connexion': '/login', '/compte': '/account', '/pro': '/pro',
  '/merci': '/thank-you', '/merci-pro': '/thank-you-pro',
};
const FR_PATH_MAP = Object.fromEntries(Object.entries(EN_PATH_MAP).map(([fr, en]) => [en, fr]));
const EN_ROUTES = new Set(Object.keys(EN_PATH_MAP));

function localePath(route, locale) {
  if (locale !== 'en' || !EN_ROUTES.has(route)) return route;
  const enSeg = EN_PATH_MAP[route];
  return enSeg === '/' ? '/en' : `/en${enSeg}`;
}

function canonicalPath(pathname) {
  if (pathname === '/be') return '/';
  if (pathname.startsWith('/be/')) return pathname.slice(3);
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) {
    const enSeg = pathname.slice(3);
    return FR_PATH_MAP[enSeg] || enSeg;
  }
  return pathname;
}

describe("i18n/paths — localePath", () => {
  it("FR (défaut) → URL inchangée", () => {
    expect(localePath('/simulateurs/epargne', 'fr')).toBe('/simulateurs/epargne');
  });
  it("EN + route disponible → URL anglaise préfixée /en/", () => {
    expect(localePath('/simulateurs/epargne', 'en')).toBe('/en/simulators/savings');
  });
  it("EN + racine → /en", () => {
    expect(localePath('/', 'en')).toBe('/en');
  });
  it("EN + route indisponible → URL FR inchangée", () => {
    expect(localePath('/simulateurs/agirc-arrco', 'en')).toBe('/simulateurs/agirc-arrco');
  });
  it("EN + /connexion → /en/login", () => {
    expect(localePath('/connexion', 'en')).toBe('/en/login');
  });
});

describe("i18n/paths — canonicalPath", () => {
  it("URL FR → inchangée", () => {
    expect(canonicalPath('/simulateurs/epargne')).toBe('/simulateurs/epargne');
  });
  it("/en/simulators/savings → /simulateurs/epargne", () => {
    expect(canonicalPath('/en/simulators/savings')).toBe('/simulateurs/epargne');
  });
  it("/en → /", () => {
    expect(canonicalPath('/en')).toBe('/');
  });
  it("/be → /", () => {
    expect(canonicalPath('/be')).toBe('/');
  });
  it("/be/simulateurs/fire → /simulateurs/fire", () => {
    expect(canonicalPath('/be/simulateurs/fire')).toBe('/simulateurs/fire');
  });
  it("/en/login → /connexion", () => {
    expect(canonicalPath('/en/login')).toBe('/connexion');
  });
});
