// Écran Soumissions — tableau filtrable par calculateur, export CSV.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ensureWorkspace, listCalculators, listSubmissions, type CalculatorListItem, type Submission } from '../lib/db';
import { downloadCSV } from '../lib/csv';
import { t } from '../i18n';

export default function Submissions() {
  const [calculators, setCalculators] = useState<CalculatorListItem[]>([]);
  const [calculatorId, setCalculatorId] = useState<string>('');
  const [rows, setRows] = useState<Submission[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ensureWorkspace().then(listCalculators).then(setCalculators).catch(() => {});
  }, []);

  useEffect(() => {
    setRows(null);
    listSubmissions(calculatorId || undefined)
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, [calculatorId]);

  function exportCsv() {
    if (!rows || rows.length === 0) return;
    const flat = rows.map((r) => ({
      date: new Date(r.createdAt).toLocaleString('fr-FR'),
      calculateur: r.calculatorTitle,
      email: r.email ?? '',
      source: r.source,
      ...r.payload,
    }));
    downloadCSV(flat, `soumissions-simfinly-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <Link to="/" style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none' }}>
        ← {t('publish.back')}
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0 20px', flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>{t('submissions.title')}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={calculatorId} onChange={(e) => setCalculatorId(e.target.value)}>
            <option value="">{t('submissions.all')}</option>
            {calculators.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <button className="btn" onClick={exportCsv} disabled={!rows || rows.length === 0}>
            {t('submissions.export')}
          </button>
        </div>
      </div>

      {error && <p style={{ color: 'var(--negative)', fontSize: 13 }}>{error}</p>}

      {rows === null ? null : rows.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>{t('submissions.empty')}</p>
      ) : (
        <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                {(['date', 'calculator', 'email', 'source'] as const).map((k) => (
                  <th key={k} style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {t(`submissions.${k}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>{new Date(r.createdAt).toLocaleString('fr-FR')}</td>
                  <td style={{ padding: '10px 14px' }}>{r.calculatorTitle}</td>
                  <td style={{ padding: '10px 14px' }}>{r.email ?? '—'}</td>
                  <td style={{ padding: '10px 14px' }}>{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
