// Inflation historique France (source INSEE)
export const INFLATION_HISTORY = [
  { year: 2019, rate: 1.1 }, { year: 2020, rate: 0.5 }, { year: 2021, rate: 1.6 },
  { year: 2022, rate: 5.2 }, { year: 2023, rate: 4.9 }, { year: 2024, rate: 2.1 },
  { year: 2025, rate: 0.9 },
];

export const CATEGORIES = [
  { key: "alimentaire",   label: "Alimentation",        icon: "🛒", defaultShare: 22, defaultRate: 3.5 },
  { key: "logement",      label: "Logement & énergie",  icon: "🏠", defaultShare: 28, defaultRate: 4.2 },
  { key: "transport",     label: "Transport",            icon: "🚗", defaultShare: 14, defaultRate: 3.0 },
  { key: "sante",         label: "Santé",                icon: "💊", defaultShare: 8,  defaultRate: 2.8 },
  { key: "loisirs",       label: "Loisirs & culture",   icon: "🎭", defaultShare: 9,  defaultRate: 2.2 },
  { key: "autre",         label: "Autres dépenses",     icon: "📦", defaultShare: 19, defaultRate: 2.5 },
];

export function calcInflation({ budget, horizon, rates }) {
  const totalShare = CATEGORIES.reduce((s, c) => s + (rates[c.key]?.share ?? c.defaultShare), 0);
  const avgRate = CATEGORIES.reduce((s, c) => {
    const share = (rates[c.key]?.share ?? c.defaultShare) / totalShare;
    const rate  = (rates[c.key]?.rate  ?? c.defaultRate)  / 100;
    return s + share * rate;
  }, 0);

  const years = [];
  for (let y = 0; y <= horizon; y++) {
    const factor = Math.pow(1 + avgRate, y);
    years.push({
      year: y,
      budgetNeeded: budget * factor,
      powerLoss: budget * (1 - 1 / factor),
    });
  }

  const finalFactor = Math.pow(1 + avgRate, horizon);
  return {
    avgRate: avgRate * 100,
    budgetNeeded: budget * finalFactor,
    powerLoss: budget * (1 - 1 / finalFactor),
    cumulativePct: (finalFactor - 1) * 100,
    years,
  };
}
