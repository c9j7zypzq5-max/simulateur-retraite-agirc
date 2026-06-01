// Télécharge un tableau de données au format CSV (compatible Excel avec BOM UTF-8)
export function downloadCSV(rows, filename = 'export.csv') {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(';'),
    ...rows.map(row =>
      headers.map(h => {
        const v = row[h];
        if (typeof v === 'number') return String(v).replace('.', ',');
        return String(v ?? '');
      }).join(';')
    ),
  ];
  const csv = '﻿' + lines.join('\r\n'); // BOM pour Excel
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
