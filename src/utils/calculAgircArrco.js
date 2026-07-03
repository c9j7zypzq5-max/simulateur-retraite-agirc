// Logique pure de calcul de la pension Agirc-Arrco — sans dépendance React.
// Extraite de SimulateurRetraite.jsx pour être testable (importée directement
// par src/__tests__/simulateurs-be.test.js, plus de copie manuelle du calcul)
// et réutilisable.
//
// Le coefficient de solidarité (malus -10 % / bonus +10 à +30 % selon l'âge de
// départ) a été SUPPRIMÉ par les partenaires sociaux Agirc-Arrco : il ne
// s'applique plus aux retraites prenant effet à compter du 1er décembre 2023,
// et a été aboli pour tous les retraités depuis le 1er avril 2024. Ce calcul
// ne l'applique donc plus — seule la majoration pour 3 enfants ou plus (+10 %,
// dispositif distinct et toujours en vigueur) subsiste.
import { PASS_2026, AGIRC_ARRCO_2026 } from '../data/baremesRetraite.js';
import { getTauxPrelevementPension } from '../data/tauxFiscaux.js';

const PASS           = PASS_2026;
const VALEUR_ACHAT    = AGIRC_ARRCO_2026.valeurAchat;
const VALEUR_SERVICE  = AGIRC_ARRCO_2026.valeurService;
const TAUX_T1_ACQ     = AGIRC_ARRCO_2026.tauxAcqT1;
const TAUX_T2_ACQ     = AGIRC_ARRCO_2026.tauxAcqT2;
const GMP_MIN_PTS     = AGIRC_ARRCO_2026.gmpMinPts;
const TAUX_T1_SAL     = 0.0315;
const TAUX_T1_PAT     = 0.0472;
const TAUX_T2_SAL     = 0.0864;
const TAUX_T2_PAT     = 0.1295;

export { PASS, VALEUR_ACHAT, VALEUR_SERVICE, TAUX_T1_ACQ, TAUX_T2_ACQ, GMP_MIN_PTS,
         TAUX_T1_SAL, TAUX_T1_PAT, TAUX_T2_SAL, TAUX_T2_PAT };

export function calcResult({ salaire, anneesFaites, anneesRestantes,
                      evolutionSalaire = 2, tauxReval = 1,
                      bonus3Enfants = false, estCadre = false,
                      rfr, nbParts }) {
  if (!salaire && salaire !== 0) return {
    pensionNette: 0, pensionBrute: 0, totalPoints: 0, pointsAcquis: 0, pointsFuturs: 0,
    ptsParAn: 0, pensionBruteSansReval: 0, pensionNetteSansReval: 0,
    valServProj: VALEUR_SERVICE, salaireDépart: 0,
    coefEnfants: 1, coefTotal: 1, cotSalTotal: 0, cotPatTotal: 0,
  };

  const sal = Math.max(0, salaire);
  const af  = Math.max(0, anneesFaites ?? 0);
  const ar  = Math.max(0, anneesRestantes ?? 0);

  const salAnnActuel = sal * 12;
  const t1p = Math.min(salAnnActuel, PASS);
  const t2p = Math.max(0, Math.min(salAnnActuel, 8 * PASS) - PASS);
  let ptsParAn = ((t1p * TAUX_T1_ACQ) + (t2p * TAUX_T2_ACQ)) / VALEUR_ACHAT;
  if (estCadre && salAnnActuel < PASS) ptsParAn = Math.max(ptsParAn, GMP_MIN_PTS);
  const pointsAcquis = ptsParAn * af;
  const cotSalPassé  = (t1p * TAUX_T1_SAL + t2p * TAUX_T2_SAL) * af;
  const cotPatPassé  = (t1p * TAUX_T1_PAT + t2p * TAUX_T2_PAT) * af;

  let pointsFuturs = 0, cotSalFutur = 0, cotPatFutur = 0;
  let salCourant = sal;
  for (let i = 0; i < ar; i++) {
    const salAnn = salCourant * 12;
    const t1 = Math.min(salAnn, PASS);
    const t2 = Math.max(0, Math.min(salAnn, 8 * PASS) - PASS);
    let pts = ((t1 * TAUX_T1_ACQ) + (t2 * TAUX_T2_ACQ)) / VALEUR_ACHAT;
    if (estCadre && salAnn < PASS) pts = Math.max(pts, GMP_MIN_PTS);
    pointsFuturs  += pts;
    cotSalFutur   += t1 * TAUX_T1_SAL + t2 * TAUX_T2_SAL;
    cotPatFutur   += t1 * TAUX_T1_PAT + t2 * TAUX_T2_PAT;
    salCourant    *= (1 + (evolutionSalaire ?? 2) / 100);
  }
  const salaireDépart = sal * Math.pow(1 + (evolutionSalaire ?? 2) / 100, ar);
  const totalPoints   = pointsAcquis + pointsFuturs;

  const coefEnfants = bonus3Enfants ? 1.10 : 1.00;
  const coefTotal   = coefEnfants;

  const tauxPS = getTauxPrelevementPension({ rfr, nbParts });

  const valServProj = VALEUR_SERVICE * Math.pow(1 + (tauxReval ?? 1) / 100, ar);
  const pensionBrute = (totalPoints * valServProj / 12) * coefTotal;
  const pensionNette = pensionBrute * (1 - tauxPS);

  const pensionBruteSansReval = (totalPoints * VALEUR_SERVICE / 12) * coefTotal;
  const pensionNetteSansReval = pensionBruteSansReval * (1 - tauxPS);

  return {
    pointsAcquis, pointsFuturs, totalPoints, ptsParAn,
    pensionBrute, pensionNette,
    pensionBruteSansReval, pensionNetteSansReval,
    valServProj, salaireDépart,
    coefEnfants, coefTotal, tauxPS,
    cotSalTotal: cotSalPassé + cotSalFutur,
    cotPatTotal: cotPatPassé + cotPatFutur,
  };
}
