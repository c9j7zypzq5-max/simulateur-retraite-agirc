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

// Télécharge un fichier Excel .xlsx à partir d'un ou plusieurs onglets
// sheets: [{ name: 'Feuille 1', rows: [{ Col1: val, Col2: val }] }]
export async function downloadXLSX(sheets, filename = 'export.xlsx') {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();

  sheets.forEach(({ name, rows }) => {
    if (!rows || !rows.length) return;
    const ws = XLSX.utils.json_to_sheet(rows);

    // Largeur automatique des colonnes
    const headers = Object.keys(rows[0]);
    ws['!cols'] = headers.map(h => ({
      wch: Math.max(h.length, ...rows.map(r => String(r[h] ?? '').length)) + 2,
    }));

    XLSX.utils.book_append_sheet(wb, ws, name);
  });

  XLSX.writeFile(wb, filename);
}

