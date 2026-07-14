// Utilitaires communs aux panneaux de listes : réordonnancement par flèches
// (pas de drag-and-drop au MVP) et suppression.

import { t } from '../../i18n';

export function moveItem<T>(list: T[], index: number, delta: -1 | 1): T[] {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function removeItem<T>(list: T[], index: number): T[] {
  return list.filter((_, i) => i !== index);
}

// Ensemble des valeurs apparaissant plus d'une fois (détection de doublons
// d'identifiants : champs et variables partagent le même scope d'évaluation,
// un doublon en écrase silencieusement un autre).
export function findDuplicates(values: string[]): Set<string> {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const v of values) {
    if (seen.has(v)) dupes.add(v);
    seen.add(v);
  }
  return dupes;
}

export function RowControls({
  index,
  count,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  onMove: (delta: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      <button className="icon" title={t('editor.fields.up')} disabled={index === 0} onClick={() => onMove(-1)}>↑</button>
      <button className="icon" title={t('editor.fields.down')} disabled={index === count - 1} onClick={() => onMove(1)}>↓</button>
      <button className="icon" title={t('editor.fields.remove')} onClick={onRemove}>✕</button>
    </div>
  );
}
