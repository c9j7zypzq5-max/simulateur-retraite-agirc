// Barèmes retraite — SOURCE UNIQUE DE VÉRITÉ des valeurs partagées entre le
// simulateur Agirc-Arrco (src/SimulateurRetraite.jsx) et son test miroir
// (src/__tests__/simulateurs-be.test.js). Objectif : ces deux fichiers
// réimplémentaient les mêmes constantes en dur, ce qui les faisait diverger
// (l'incident valeur du point 1,4098 / 1,4107 / 1,4196…). Les revalorisations
// annuelles (Agirc-Arrco : chaque 1er novembre) se font désormais ICI, une fois.
//
// PASS : réexporté depuis tauxFiscaux.js pour ne garder qu'une seule définition.

import { PASS_2026 } from './tauxFiscaux.js';

export { PASS_2026 };

// Agirc-Arrco — valeurs 2026 (en vigueur depuis le 1er novembre 2025).
export const AGIRC_ARRCO_2026 = {
  valeurAchat:   20.1877, // prix d'achat d'un point (€)
  valeurService: 1.4386,  // valeur de service d'un point (€/an)
  // Seuls les taux CONTRACTUELS génèrent des points. Le taux d'appel (127 %)
  // est cotisé mais ne crée aucun droit — ne pas l'utiliser pour l'acquisition.
  tauxAcqT1: 0.0620, // tranche 1 (jusqu'au PASS)
  tauxAcqT2: 0.1700, // tranche 2 (1 à 8 PASS)
  gmpMinPts: 120,    // GMP cadres : minimum garanti de points/an sous le PASS
};
