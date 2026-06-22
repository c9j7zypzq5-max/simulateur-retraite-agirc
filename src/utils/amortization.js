// Moteur d'amortissement de crédit immobilier — source unique pour la courbe,
// le tableau, les chips et le compte-rendu PDF du simulateur Emprunt immobilier.
//
// Gère deux tranches (principale au taux `taux`, PTZ au taux `primoTaux`), le
// suivi de l'ancienneté du prêt (mensualités déjà payées) et les versements
// anticipés (remboursements partiels) avec deux effets au choix :
//   - "duree"      : la mensualité est conservée, le prêt s'éteint plus tôt ;
//   - "mensualite" : la mensualité est recalculée, la durée est conservée.
// Les versements anticipés s'imputent d'abord sur la tranche la plus chère
// (principale), puis sur le PTZ — financièrement optimal.

// Mensualité d'un prêt à annuités constantes.
export function mensualite(capital, tauxAnnuel, dureeAns) {
  if (capital <= 0 || dureeAns <= 0) return 0;
  const r = tauxAnnuel / 100 / 12;
  const n = dureeAns * 12;
  if (r === 0) return capital / n;
  return (capital * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// Mensualité recalculée sur un capital et un nombre de mensualités restantes.
function paymentForRemaining(capital, tauxAnnuel, moisRestants) {
  if (capital <= 0 || moisRestants <= 0) return 0;
  const r = tauxAnnuel / 100 / 12;
  if (r === 0) return capital / moisRestants;
  return (capital * r * Math.pow(1 + r, moisRestants)) / (Math.pow(1 + r, moisRestants) - 1);
}

// Simulation mois par mois d'une tranche, avec versements anticipés optionnels.
// prepays : Map mois → montant à imputer ce mois-là (sur cette tranche).
// Retourne le détail mensuel { interet, restant } et le total d'intérêts.
function simulateTranche({ capital, tauxAnnuel, dureeAns, prepayMode, prepays }) {
  const totalMonths = dureeAns * 12;
  const r = tauxAnnuel / 100 / 12;
  let restant = capital;
  let men = mensualite(capital, tauxAnnuel, dureeAns);
  let totalInterets = 0;
  const monthly = []; // index 0 = fin du mois 1
  for (let m = 1; m <= totalMonths && restant > 0.005; m++) {
    const interet = restant * r;
    totalInterets += interet;
    let principal = men - interet;
    if (principal > restant) principal = restant;
    const paid = interet + principal; // mensualité réellement versée ce mois
    restant -= principal;
    // Versement anticipé en fin de mois.
    const extra = prepays?.get(m) || 0;
    if (extra > 0) {
      restant = Math.max(0, restant - extra);
      if (prepayMode === "mensualite") {
        // Recalcule la mensualité sur le capital restant et la durée restante.
        men = paymentForRemaining(restant, tauxAnnuel, totalMonths - m);
      }
      // mode "duree" : mensualité inchangée → le prêt s'éteint plus tôt.
    }
    monthly.push({ m, interet, mensualite: paid, restant: Math.max(0, restant) });
  }
  return { monthly, totalInterets, mensualiteInitiale: mensualite(capital, tauxAnnuel, dureeAns) };
}

// Répartit la liste de versements { month, amount } sur les deux tranches :
// d'abord la principale (capital le plus cher), puis le PTZ. Renvoie deux Map.
function splitPrepayments(prepayments, capitalPrincipal, primoCapital) {
  const mainMap = new Map();
  const ptzMap = new Map();
  // Suivi des capitaux théoriques restants pour ne pas sur-imputer une tranche.
  let mainLeft = capitalPrincipal;
  let ptzLeft = primoCapital;
  const sorted = [...prepayments]
    .filter(p => p && p.amount > 0 && p.month >= 1)
    .sort((a, b) => a.month - b.month);
  for (const p of sorted) {
    let amount = p.amount;
    const toMain = Math.min(amount, Math.max(0, mainLeft));
    if (toMain > 0) {
      mainMap.set(p.month, (mainMap.get(p.month) || 0) + toMain);
      mainLeft -= toMain;
      amount -= toMain;
    }
    if (amount > 0) {
      const toPtz = Math.min(amount, Math.max(0, ptzLeft));
      if (toPtz > 0) {
        ptzMap.set(p.month, (ptzMap.get(p.month) || 0) + toPtz);
        ptzLeft -= toPtz;
      }
    }
  }
  return { mainMap, ptzMap };
}

// Construit l'amortissement complet combiné (principale + PTZ).
export function buildAmortization({
  capitalPrincipal = 0,
  taux = 0,
  primoCapital = 0,
  primoTaux = 1.95,
  dureeAns = 0,
  elapsedMonths = 0,
  prepayments = [],
  prepayMode = "duree",
} = {}) {
  const capitalTotal = capitalPrincipal + primoCapital;
  const totalMonths = dureeAns * 12;

  const { mainMap, ptzMap } = splitPrepayments(prepayments, capitalPrincipal, primoCapital);

  const main = simulateTranche({ capital: capitalPrincipal, tauxAnnuel: taux, dureeAns, prepayMode, prepays: mainMap });
  const ptz = simulateTranche({ capital: primoCapital, tauxAnnuel: primoTaux, dureeAns, prepayMode, prepays: ptzMap });

  // Restant combiné mois par mois (une tranche peut s'éteindre avant l'autre).
  const lastMain = main.monthly.length ? main.monthly[main.monthly.length - 1].restant : 0;
  const lastPtz = ptz.monthly.length ? ptz.monthly[ptz.monthly.length - 1].restant : 0;
  const restantAt = (arr, idx, lastVal) => (idx < arr.length ? arr[idx].restant : lastVal);

  const monthly = [];
  let cumulInt = 0;
  for (let m = 1; m <= totalMonths; m++) {
    const iMain = m <= main.monthly.length ? main.monthly[m - 1].interet : 0;
    const iPtz = m <= ptz.monthly.length ? ptz.monthly[m - 1].interet : 0;
    const payMain = m <= main.monthly.length ? main.monthly[m - 1].mensualite : 0;
    const payPtz = m <= ptz.monthly.length ? ptz.monthly[m - 1].mensualite : 0;
    cumulInt += iMain + iPtz;
    const restant = restantAt(main.monthly, m - 1, lastMain) + restantAt(ptz.monthly, m - 1, lastPtz);
    monthly.push({ m, restant: Math.max(0, restant), interets: cumulInt, mensualite: payMain + payPtz });
    if (restant <= 0.005) break;
  }

  const dureeReelleMois = monthly.length;
  const totalInterets = main.totalInterets + ptz.totalInterets;
  const mensualiteInitiale = main.mensualiteInitiale + ptz.mensualiteInitiale;

  // Série annuelle pour le graphe : point 0 = capital initial, puis fin de chaque année.
  const yearly = [{ x: 0, restant: Math.round(capitalTotal), interets: 0, mensualite: mensualiteInitiale }];
  for (let yr = 1; yr <= dureeAns; yr++) {
    const idx = Math.min(yr * 12, monthly.length) - 1;
    if (idx < 0) break;
    const pt = monthly[idx];
    yearly.push({ x: yr, restant: Math.round(pt.restant), interets: Math.round(pt.interets), mensualite: pt.mensualite });
    if (pt.restant <= 0.005) break;
  }

  // Suivi « aujourd'hui » : capital restant après `elapsedMonths` mensualités.
  let capitalRestantAujourdhui = capitalTotal;
  if (elapsedMonths > 0 && monthly.length) {
    const idx = Math.min(elapsedMonths, monthly.length) - 1;
    capitalRestantAujourdhui = monthly[idx].restant;
  }
  const capitalRembourseAujourdhui = Math.max(0, capitalTotal - capitalRestantAujourdhui);

  // Économie d'intérêts vs scénario sans versement anticipé (mêmes tranches).
  let economieInterets = 0;
  if (prepayments.some(p => p && p.amount > 0)) {
    const base = buildAmortization({
      capitalPrincipal, taux, primoCapital, primoTaux, dureeAns,
      elapsedMonths: 0, prepayments: [], prepayMode,
    });
    economieInterets = Math.max(0, base.totalInterets - totalInterets);
  }

  return {
    monthly,
    yearly,
    totalInterets,
    mensualiteInitiale,
    dureeReelleMois,
    capitalRestantAujourdhui,
    capitalRembourseAujourdhui,
    economieInterets,
    capitalTotal,
  };
}
