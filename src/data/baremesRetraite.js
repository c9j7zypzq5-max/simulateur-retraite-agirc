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

// PMSS (plafond mensuel de la Sécurité sociale) — toujours dérivé de PASS_2026,
// jamais recopié en dur (a été la source d'une divergence : 3 864 €/mois périmé
// coexistait avec 48 060 €/an dans le repo).
export const getPmssMensuel = () => Math.round((PASS_2026 / 12) * 100) / 100;

// ─── Âge légal / durée d'assurance requise — régime général (CNAV) ───
// SOURCE UNIQUE pour tous les simulateurs retraite. Avant ce module, 5 fichiers
// (Cnav.jsx, RetraiteAnticipee.jsx, Trimestres.jsx, ComparaisonReforme.jsx,
// EmbedRetraite.jsx) réimplémentaient chacun leur propre table, avec des
// résultats divergents pour une même génération.
//
// Source : lassuranceretraite.fr (« Mon âge de départ à la retraite »).
// IMPORTANT (situation au 3 juillet 2026) : la loi de financement de la
// Sécurité sociale pour 2026 (LFSS 2026, promulguée le 16/12/2025) a GELÉ le
// calendrier de la réforme Borne 2023 pour les générations 1964-1968, pour
// les retraites prenant effet à compter du 1er septembre 2026, et ce jusqu'au
// 1er janvier 2028. La table ci-dessous reflète ce calendrier gelé (en
// vigueur), et non le calendrier Borne 2023 d'origine — à réviser si le gel
// est levé, prolongé ou remplacé par une nouvelle loi.
const CALENDRIER_RETRAITE = [
  // Générations nées avant 1955 : déjà toutes à la retraite ou sur le point de
  // l'être — simplifié à la dernière valeur stable de la réforme Touraine 2014
  // (166 trim.), sans nuance mensuelle (impact négligeable pour un simulateur
  // tourné vers des projections futures).
  { anneeMax: 1954, moisMax: 12, ageLegal: 62,    duree: 165 },
  { anneeMax: 1957, moisMax: 12, ageLegal: 62,    duree: 166 },
  { anneeMax: 1960, moisMax: 12, ageLegal: 62,    duree: 167 },
  { anneeMax: 1961, moisMax: 8,  ageLegal: 62,    duree: 168 },
  { anneeMax: 1961, moisMax: 12, ageLegal: 62.25, duree: 169 },
  { anneeMax: 1962, moisMax: 12, ageLegal: 62.5,  duree: 169 },
  { anneeMax: 1963, moisMax: 12, ageLegal: 62.75, duree: 170 },
  // Générations 1964-1968 : calendrier GELÉ par la LFSS 2026 (cf. commentaire ci-dessus)
  { anneeMax: 1964, moisMax: 12, ageLegal: 62.75, duree: 170 },
  { anneeMax: 1965, moisMax: 3,  ageLegal: 62.75, duree: 170 },
  { anneeMax: 1965, moisMax: 12, ageLegal: 63,    duree: 171 },
  { anneeMax: 1966, moisMax: 12, ageLegal: 63.25, duree: 172 },
  { anneeMax: 1967, moisMax: 12, ageLegal: 63.5,  duree: 172 },
  { anneeMax: 1968, moisMax: 12, ageLegal: 63.75, duree: 172 },
  // 1969 et au-delà : palier définitif de la réforme Borne 2023
  { anneeMax: Infinity, moisMax: 12, ageLegal: 64, duree: 172 },
];

/**
 * @param {number} anneeNaissance
 * @param {number} [moisNaissance] 1-12, optionnel. Utile seulement pour 1961 et
 *   1965 (bascule en cours d'année) ; par défaut on retient la valeur la plus
 *   conservatrice (2e moitié d'année) si le mois n'est pas fourni.
 */
export function getAgeLegal(anneeNaissance, moisNaissance) {
  return trouverLigne(anneeNaissance, moisNaissance).ageLegal;
}

export function getDureeRequise(anneeNaissance, moisNaissance) {
  return trouverLigne(anneeNaissance, moisNaissance).duree;
}

function trouverLigne(anneeNaissance, moisNaissance) {
  const mois = moisNaissance ?? 12; // par défaut : valeur la + conservatrice
  for (const ligne of CALENDRIER_RETRAITE) {
    if (anneeNaissance < ligne.anneeMax) return ligne;
    if (anneeNaissance === ligne.anneeMax && mois <= ligne.moisMax) return ligne;
  }
  return CALENDRIER_RETRAITE[CALENDRIER_RETRAITE.length - 1];
}

// Âge auquel le taux plein est acquis automatiquement, sans décote, quel que
// soit le nombre de trimestres validés — fixé à 67 ans pour toutes les
// générations depuis la réforme de 2010, inchangé par la réforme 2023.
export const AGE_TAUX_PLEIN_AUTOMATIQUE = 67;

// Décote CNAV (régime général) : 0,625 %/trimestre manquant, plafonnée à
// 20 trimestres (soit -12,5 % max). Ce taux est spécifique au régime général —
// d'autres régimes (fonction publique...) appliquent 1,25 %, à ne pas confondre.
const TAUX_DECOTE_TRIMESTRE = 0.00625;
const DECOTE_TRIMESTRES_MAX = 20;
export function getDecote(trimestresManquants) {
  return Math.min(Math.max(trimestresManquants, 0), DECOTE_TRIMESTRES_MAX) * TAUX_DECOTE_TRIMESTRE;
}

// Surcote CNAV : 1,25 %/trimestre supplémentaire travaillé après l'obtention
// du taux plein, sans plafond.
const TAUX_SURCOTE_TRIMESTRE = 0.0125;
export function getSurcote(trimestresSupplementaires) {
  return Math.max(trimestresSupplementaires, 0) * TAUX_SURCOTE_TRIMESTRE;
}
