// Formules financières pures, partagées et testées (voir finance.test.js).
// Centraliser ici les calculs réutilisés par plusieurs simulateurs évite les
// divergences et permet de les couvrir par des tests unitaires.

// Mensualité d'un prêt amortissable à annuités constantes (durée en ANNÉES).
// M = C·r·(1+r)^n / ((1+r)^n − 1), r = taux mensuel, n = nombre de mensualités.
export function mensualite(capital, tauxAnnuel, dureeAns) {
  if (capital <= 0 || dureeAns <= 0) return 0;
  const r = tauxAnnuel / 100 / 12;
  const n = dureeAns * 12;
  if (r === 0) return capital / n;
  return (capital * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// Idem mais avec une durée exprimée directement en MOIS (crédit conso).
export function mensualiteMois(capital, tauxAnnuel, dureeMois) {
  if (capital <= 0 || dureeMois <= 0) return 0;
  const r = tauxAnnuel / 100 / 12;
  if (r === 0) return capital / dureeMois;
  return (capital * r * Math.pow(1 + r, dureeMois)) / (Math.pow(1 + r, dureeMois) - 1);
}

// Valeur future d'une suite de versements annuels constants capitalisés.
// FV = V · ((1+r)^n − 1) / r  (versements en fin de période).
export function futureValueAnnuity(versement, tauxPct, annees) {
  if (annees <= 0 || versement <= 0) return 0;
  const r = tauxPct / 100;
  if (r === 0) return versement * annees;
  return versement * ((Math.pow(1 + r, annees) - 1) / r);
}

// Valeur future d'un capital initial unique capitalisé sur n années.
export function futureValueLump(capital, tauxPct, annees) {
  if (capital <= 0 || annees <= 0) return capital > 0 ? capital : 0;
  return capital * Math.pow(1 + tauxPct / 100, annees);
}
