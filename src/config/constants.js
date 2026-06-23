// Constantes fiscales et sociales 2026 — source unique de vérité.
// Mettre à jour ici chaque année.

// Plafond Annuel de la Sécurité Sociale (PASS) 2026
export const PASS = 48_060;

// Plafond Mensuel de la Sécurité Sociale (PMSS) 2026
export const PMSS = 3_864;

// Prélèvements sociaux sur revenus du capital (17,2 %)
export const PS_CAPITAL = 0.172;

// Prélèvements sociaux sur retraites (10,1 % taux moyen pour simulation)
export const PS_RETRAITE = 0.101;

// SMIC horaire brut 2026 (pour validation trimestres)
export const SMIC_HORAIRE = 11.88;

// ─── Alertes changements fiscaux ─────────────────────────────────────────────
// Mettre à jour FISCAL_VERSION + FISCAL_CHANGES à chaque mise à jour annuelle.
export const FISCAL_VERSION = "2026";

export const FISCAL_CHANGES = [
  { label: "PASS 2026", value: "48 060 €", prev: "46 368 €", delta: "+3,6 %", icon: "📊" },
  { label: "PMSS 2026", value: "3 864 €/mois", prev: "3 864 €/mois", delta: "+3,6 %", icon: "💼" },
  { label: "Point Agirc-Arrco", value: "1,4098 €", prev: "1,3802 €", delta: "+2,1 %", icon: "⭐" },
  { label: "SMIC horaire", value: "11,88 €", prev: "11,65 €", delta: "+2,0 %", icon: "💶" },
  { label: "Tranche IR 11 %", value: "11 600 € – 29 579 €", prev: "11 295 € – 28 797 €", delta: "revalorisation", icon: "🏛️" },
];
