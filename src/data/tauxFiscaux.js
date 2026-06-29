// ─── Taux fiscaux France 2026 (revenus 2025) ─────────────────────────────────
// Source de vérité centralisée pour tous les simulateurs. Importer depuis ce
// fichier plutôt que de dupliquer les constantes dans chaque composant.

// ── Barème IR 2026 (revenus 2025, revalorisation +0,9 %) ─────────────────────
export const BAREME_IR = [
  { min: 0,       max: 11_294,  taux: 0 },
  { min: 11_294,  max: 28_797,  taux: 0.11 },
  { min: 28_797,  max: 82_341,  taux: 0.30 },
  { min: 82_341,  max: 177_106, taux: 0.41 },
  { min: 177_106, max: Infinity, taux: 0.45 },
];

// ── Flat tax / Prélèvement Forfaitaire Unique (PFU) 2026 ─────────────────────
export const TAUX_PFU_IR  = 0.128;   // 12,8 % impôt sur le revenu
export const TAUX_PS      = 0.172;   // 17,2 % prélèvements sociaux (PS)
export const TAUX_PFU     = TAUX_PFU_IR + TAUX_PS; // 30 % total PFU

// Depuis la loi de finances 2024 : le taux PS passe de 17,2 % à 18,6 % pour
// les revenus de capitaux mobiliers (RCM) perçus à compter du 01/01/2025.
export const TAUX_PS_RCM  = 0.186;
export const TAUX_PFU_RCM = TAUX_PFU_IR + TAUX_PS_RCM; // 31,4 % dividendes / plus-values

// CSG déductible sur l'option barème (6,8 % de 17,2 %)
export const TAUX_CSG_DED = 0.068;

// Abattement de 40 % sur les dividendes (option barème uniquement)
export const ABATT_DIV = 0.40;

// ── Prélèvements sociaux sur revenus du patrimoine ───────────────────────────
// CSG 9,2 % + CRDS 0,5 % + Prélèvement solidarité 7,5 % = 17,2 %
export const DETAIL_PS = {
  csg:    0.092,
  crds:   0.005,
  solidarite: 0.075,
  total:  0.172,
};

// ── Abattement pour durée de détention (plus-value immobilière) ───────────────
// Applicable à l'IR et aux prélèvements sociaux (taux différents)
export const ABATT_PVI_IR = [
  { ans: 6,  taux: 0 },      // < 6 ans : aucun abattement
  { ans: 21, taux: 0.06 },   // 6-21 ans : 6 %/an
  { ans: 22, taux: 0.04 },   // 22e année : 4 %
];
export const ABATT_PVI_PS = [
  { ans: 5,  taux: 0 },
  { ans: 21, taux: 0.0165 }, // 6-21 ans : 1,65 %/an
  { ans: 22, taux: 0.0160 }, // 22e année
  { ans: 30, taux: 0.09 },   // 23-30 ans : 9 %/an
];

// ── PASS (Plafond Annuel de la Sécurité Sociale) 2026 ────────────────────────
export const PASS_2026 = 47_100;

// ── Plafonds PER (déduction des versements) ───────────────────────────────────
// 10 % des revenus professionnels N-1, plafonné à 10 % de 8 PASS
export const PLAFOND_PER_MAX = PASS_2026 * 8 * 0.10; // ≈ 37 680 €

// ── Droits de succession / donation (barème général) ─────────────────────────
export const BAREME_SUCCESSION_LIGNE_DIRECTE = [
  { min: 0,        max: 8_072,   taux: 0.05 },
  { min: 8_072,    max: 12_109,  taux: 0.10 },
  { min: 12_109,   max: 15_932,  taux: 0.15 },
  { min: 15_932,   max: 552_324, taux: 0.20 },
  { min: 552_324,  max: 902_838, taux: 0.30 },
  { min: 902_838,  max: 1_805_677, taux: 0.40 },
  { min: 1_805_677, max: Infinity, taux: 0.45 },
];

// Abattements donation/succession en ligne directe (par bénéficiaire)
export const ABATT_LIGNE_DIRECTE = 100_000; // enfants / parents
export const ABATT_CONJOINT      = 80_724;  // conjoint (donation uniquement, succession exonérée)
export const ABATT_PETITS_ENFANTS = 31_865;
export const ABATT_HANDICAP      = 159_325; // abattement spécifique handicap

// Délai de rappel fiscal des donations antérieures
export const DELAI_RAPPEL_ANS = 15;

// ── Taux cotisations sociales approximatifs (usage : freelance vs salarié) ────
export const COTIS_SALARIE_TAUX = 0.22;   // part salariale approximative
export const COTIS_PATRON_TAUX  = 0.42;   // part patronale approximative
