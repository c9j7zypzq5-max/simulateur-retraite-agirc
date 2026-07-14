import type { Chart, ChartItem, ResultItem, ResultFormat } from '../../schema/types';
import { t } from '../../i18n';
import { moveItem, removeItem, RowControls } from './listUtils';
import FormulaInput from './FormulaInput';

const MAX_RESULTS = 4;

export default function ResultsPanel({
  results,
  chart,
  refs,
  onChange,
}: {
  results: ResultItem[];
  chart: Chart | undefined;
  refs: string[];
  onChange: (results: ResultItem[], chart: Chart | undefined) => void;
}) {
  const patch = (i: number, p: Partial<ResultItem>) =>
    onChange(results.map((r, j) => (j === i ? { ...r, ...p } : r)), chart);

  const patchChartItem = (i: number, p: Partial<ChartItem>) => {
    if (!chart) return;
    onChange(results, { ...chart, items: chart.items.map((it, j) => (j === i ? { ...it, ...p } : it)) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {results.map((r, i) => (
        <div key={i} className="card" style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <label style={{ flex: '1 1 120px' }}>
            <span className="lbl">{t('editor.results.label')}</span>
            <input type="text" value={r.label} onChange={(e) => patch(i, { label: e.target.value })} />
          </label>
          <label style={{ flex: '2 1 180px' }}>
            <span className="lbl">{t('editor.results.formula')}</span>
            <FormulaInput value={r.formula} refs={refs} onChange={(formula) => patch(i, { formula })} />
          </label>
          <label style={{ width: 84 }}>
            <span className="lbl">{t('editor.results.format')}</span>
            <select value={r.format} onChange={(e) => patch(i, { format: e.target.value as ResultFormat })}>
              {(['eur', 'pct', 'number'] as const).map((f) => (
                <option key={f} value={f}>{t(`editor.results.formats.${f}`)}</option>
              ))}
            </select>
          </label>
          <label style={{ width: 92 }}>
            <span className="lbl">{t('editor.results.size')}</span>
            <select value={r.size} onChange={(e) => patch(i, { size: e.target.value as 'lg' | 'md' })}>
              <option value="lg">{t('editor.results.sizes.lg')}</option>
              <option value="md">{t('editor.results.sizes.md')}</option>
            </select>
          </label>
          <RowControls
            index={i}
            count={results.length}
            onMove={(d) => onChange(moveItem(results, i, d), chart)}
            onRemove={() => onChange(removeItem(results, i), chart)}
          />
        </div>
      ))}
      {results.length < MAX_RESULTS ? (
        <button
          className="btn primary"
          style={{ alignSelf: 'flex-start' }}
          onClick={() =>
            onChange([...results, { label: `${t('editor.results.label')} ${results.length + 1}`, formula: '', format: 'eur', size: results.length === 0 ? 'lg' : 'md' }], chart)
          }
        >
          + {t('editor.results.add')}
        </button>
      ) : (
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>{t('editor.results.max')}</p>
      )}

      {/* Graphique unique optionnel */}
      <div className="card" style={{ marginTop: 8 }}>
        <label style={{ display: 'block', marginBottom: chart ? 10 : 0 }}>
          <span className="lbl">{t('editor.results.chart')}</span>
          <select
            value={chart?.type ?? 'none'}
            onChange={(e) => {
              const v = e.target.value;
              if (v === 'none') onChange(results, undefined);
              else onChange(results, { type: v as Chart['type'], items: chart?.items ?? [{ label: '', formula: '' }] });
            }}
          >
            <option value="none">{t('editor.results.chartNone')}</option>
            <option value="bars">{t('editor.results.chartBars')}</option>
            <option value="donut">{t('editor.results.chartDonut')}</option>
          </select>
        </label>
        {chart && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="lbl">{t('editor.results.chartItems')}</span>
            {chart.items.map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder={t('editor.results.label')}
                  value={it.label}
                  style={{ flex: 1 }}
                  onChange={(e) => patchChartItem(i, { label: e.target.value })}
                />
                <div style={{ flex: 2 }}>
                  <FormulaInput
                    value={it.formula}
                    refs={refs}
                    placeholder={t('editor.results.formula')}
                    onChange={(formula) => patchChartItem(i, { formula })}
                  />
                </div>
                <button
                  className="icon"
                  title={t('editor.fields.remove')}
                  onClick={() => onChange(results, { ...chart, items: removeItem(chart.items, i) })}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              className="btn"
              style={{ alignSelf: 'flex-start' }}
              onClick={() => onChange(results, { ...chart, items: [...chart.items, { label: '', formula: '' }] })}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
