// Simulation Monte Carlo par bootstrap historique — sans dépendance React.
// Ré-échantillonne avec remise les rendements annuels réels du S&P 500
// (src/data/sp500Returns.js, 1928-2024) pour produire une fourchette
// d'incertitude (percentiles 10/50/90) sur une projection d'épargne, au lieu
// d'un unique scénario déterministe à taux constant.
import { SP500_ANNUAL_RETURNS } from '../data/sp500Returns.js';

const HISTORICAL_RETURNS = Object.values(SP500_ANNUAL_RETURNS);

function pickRandomReturn() {
  return HISTORICAL_RETURNS[Math.floor(Math.random() * HISTORICAL_RETURNS.length)];
}

function percentile(sortedValues, p) {
  const idx = Math.floor(p * (sortedValues.length - 1));
  return sortedValues[idx];
}

/**
 * @param {object} params
 * @param {number} params.capitalInitial
 * @param {number} params.epargneMensuelle
 * @param {number} params.nbAnnees
 * @param {number} [params.nbSimulations=1000]
 * @param {number} [params.target] - capital cible, pour calculer une probabilité d'atteinte
 * @returns {{ yearly: {annee:number,p10:number,p50:number,p90:number}[], probabiliteAtteinte: number|null }}
 */
export function simulateMonteCarlo({ capitalInitial, epargneMensuelle, nbAnnees, nbSimulations = 1000, target }) {
  if (!nbAnnees || nbAnnees <= 0) return { yearly: [], probabiliteAtteinte: null };

  const cap0 = capitalInitial || 0;
  const epargne = epargneMensuelle || 0;
  const nbAns = Math.min(Math.round(nbAnnees), 60); // borne raisonnable (perf + horizon réaliste)

  const finalValues = [];
  // Valeurs par année pour toutes les simulations, transposées ensuite en percentiles
  const parAnnee = Array.from({ length: nbAns + 1 }, () => []);
  parAnnee[0] = new Array(nbSimulations).fill(cap0);

  for (let s = 0; s < nbSimulations; s++) {
    let capital = cap0;
    for (let y = 1; y <= nbAns; y++) {
      const rAnnual = pickRandomReturn();
      const rMonthly = Math.pow(1 + rAnnual / 100, 1 / 12) - 1;
      for (let m = 0; m < 12; m++) {
        capital = capital * (1 + rMonthly) + epargne;
      }
      parAnnee[y][s] = capital;
    }
    finalValues.push(capital);
  }

  const yearly = parAnnee.map((vals, annee) => {
    const sorted = [...vals].sort((a, b) => a - b);
    return {
      annee,
      p10: percentile(sorted, 0.10),
      p50: percentile(sorted, 0.50),
      p90: percentile(sorted, 0.90),
    };
  });

  let probabiliteAtteinte = null;
  if (target && target > 0) {
    const atteints = finalValues.filter(v => v >= target).length;
    probabiliteAtteinte = (atteints / finalValues.length) * 100;
  }

  return { yearly, probabiliteAtteinte };
}
