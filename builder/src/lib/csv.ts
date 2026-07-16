// Export CSV — même convention que src/utils/export.js du site principal
// (point-virgule, BOM UTF-8, virgule décimale, CRLF) pour un comportement
// cohérent avec le reste du produit.

export function downloadCSV(rows: Record<string, unknown>[], filename = 'export.csv'): void {
  if (!rows.length) return;
  const headers = Array.from(rows.reduce((set, r) => { Object.keys(r).forEach((k) => set.add(k)); return set; }, new Set<string>()));
  const lines = [
    headers.join(';'),
    ...rows.map((row) =>
      headers.map((h) => {
        const v = row[h];
        if (typeof v === 'number') return String(v).replace('.', ',');
        return String(v ?? '');
      }).join(';'),
    ),
  ];
  const csv = '﻿' + lines.join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
