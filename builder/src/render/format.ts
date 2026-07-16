// Formatage des valeurs de résultats, fr-FR uniquement au MVP.

import type { ResultFormat } from '../schema/types';

const EUR = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
});
const PCT = new Intl.NumberFormat('fr-FR', {
  style: 'percent',
  maximumFractionDigits: 2,
});
const NUM = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 });

// La valeur (nombre de mois) → « X ans Y mois ». Arrondie au mois entier.
function formatDuration(months: number): string {
  const total = Math.max(0, Math.round(months));
  const y = Math.floor(total / 12);
  const m = total % 12;
  const parts: string[] = [];
  if (y > 0) parts.push(`${y} an${y > 1 ? 's' : ''}`);
  if (m > 0 || y === 0) parts.push(`${m} mois`);
  return parts.join(' ');
}

export function formatValue(value: number, format: ResultFormat): string {
  if (!Number.isFinite(value)) return '—';
  switch (format) {
    case 'eur':
      return EUR.format(value);
    case 'pct':
      return PCT.format(value / 100); // la formule produit 4.5 pour 4,5 %
    case 'number':
      return NUM.format(value);
    case 'duration':
      return formatDuration(value);
  }
}
