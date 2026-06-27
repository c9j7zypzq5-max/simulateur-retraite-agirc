// Logique pure de calcul des intérêts composés — sans dépendance React.
// Extraite de Epargne.jsx pour être testable et réutilisable.

export function calcEpargne({ capitalInitial, versement, tauxAnnuel, duree }) {
  if (!duree || duree <= 0 || (capitalInitial === null && versement === null)) {
    return { capitalFinal: 0, totalVerse: 0, totalInterets: 0, multiplicateur: 0, yearlyData: [] };
  }
  const cap = capitalInitial ?? 0;
  const vers = versement ?? 0;
  const r = tauxAnnuel / 100 / 12;
  const n = duree * 12;
  let capitalFinal;
  if (Math.abs(r) < 1e-10) {
    capitalFinal = cap + vers * n;
  } else {
    const factor = Math.pow(1 + r, n);
    capitalFinal = cap * factor + vers * ((factor - 1) / r);
  }
  const totalVerse = cap + vers * n;
  const totalInterets = Math.max(0, capitalFinal - totalVerse);
  const multiplicateur = totalVerse > 0 ? capitalFinal / totalVerse : 1;
  const yearlyData = [];
  for (let year = 1; year <= duree; year++) {
    const monthsElapsed = year * 12;
    let yearCap;
    if (Math.abs(r) < 1e-10) {
      yearCap = cap + vers * monthsElapsed;
    } else {
      const f = Math.pow(1 + r, monthsElapsed);
      yearCap = cap * f + vers * ((f - 1) / r);
    }
    const versementsCum = cap + vers * monthsElapsed;
    const interstsCum = Math.max(0, yearCap - versementsCum);
    yearlyData.push({ annee: year, capital: yearCap, versementsCum, interstsCum });
  }
  return { capitalFinal, totalVerse, totalInterets, multiplicateur, yearlyData };
}
