// Champ « date » : la valeur STOCKÉE est un nombre de jours depuis l'époque
// (entier, sérialisable comme les autres champs), mais la valeur EXPOSÉE aux
// formules est l'âge/ancienneté en années entières à la date du jour — le cas
// d'usage réel (âge de départ en retraite, durée de détention d'un bien…).

const MS_PER_DAY = 86_400_000;

export function todayEpochDays(now: number = Date.now()): number {
  return Math.floor(now / MS_PER_DAY);
}

// jours epoch → "yyyy-mm-dd" (UTC) pour <input type="date">.
export function epochDaysToInput(days: number): string {
  if (!Number.isFinite(days)) return '';
  return new Date(days * MS_PER_DAY).toISOString().slice(0, 10);
}

// "yyyy-mm-dd" → jours epoch (UTC). Chaîne vide/invalide → NaN.
export function inputToEpochDays(value: string): number {
  const ms = Date.parse(value); // "yyyy-mm-dd" est interprété en UTC
  return Number.isNaN(ms) ? NaN : Math.floor(ms / MS_PER_DAY);
}

// Âge en années entières entre la date stockée et aujourd'hui (borné à >= 0).
export function ageInYears(days: number, now: number = Date.now()): number {
  if (!Number.isFinite(days)) return 0;
  const d = new Date(days * MS_PER_DAY);
  const t = new Date(now);
  let age = t.getUTCFullYear() - d.getUTCFullYear();
  const monthDiff = t.getUTCMonth() - d.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && t.getUTCDate() < d.getUTCDate())) age--;
  return Math.max(0, age);
}
