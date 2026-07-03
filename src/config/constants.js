// Constantes fiscales et sociales 2026 — source unique de vérité.
// Mettre à jour ici chaque année.

import { PASS_2026 } from '../data/tauxFiscaux.js';
import { getPmssMensuel } from '../data/baremesRetraite.js';

// Plafond Annuel de la Sécurité Sociale (PASS) 2026 — réexporté depuis
// tauxFiscaux.js (source unique) pour éviter toute divergence.
export const PASS = PASS_2026;

// Plafond Mensuel de la Sécurité Sociale (PMSS) 2026 — toujours dérivé de PASS,
// jamais recopié en dur (a été la source d'une divergence : 3 864 €/mois
// périmé coexistait avec 48 060 €/an dans le repo).
export const PMSS = getPmssMensuel();

// Prélèvements sociaux sur revenus du capital (17,2 %)
export const PS_CAPITAL = 0.172;

// SMIC horaire brut 2026 (pour validation trimestres)
export const SMIC_HORAIRE = 11.88;

// ─── Alertes changements fiscaux ─────────────────────────────────────────────
// Mettre à jour FISCAL_VERSION + FISCAL_CHANGES à chaque mise à jour annuelle.
export const FISCAL_VERSION = "2026";

export const FISCAL_CHANGES = [
  { label: "PASS 2026", value: "48 060 €", prev: "46 368 €", delta: "+3,6 %", icon: "📊" },
  { label: "PMSS 2026", value: "4 005 €/mois", prev: "3 864 €/mois", delta: "+3,6 %", icon: "💼" },
  { label: "Point Agirc-Arrco", value: "1,4386 €", prev: "1,3802 €", delta: "+4,2 %", icon: "⭐" },
  { label: "SMIC horaire", value: "11,88 €", prev: "11,65 €", delta: "+2,0 %", icon: "💶" },
  { label: "Tranche IR 11 %", value: "11 600 € – 29 579 €", prev: "11 295 € – 28 797 €", delta: "revalorisation", icon: "🏛️" },
];
