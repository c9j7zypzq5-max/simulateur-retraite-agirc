import type { Variable } from '../../schema/types';
import { t } from '../../i18n';
import { moveItem, removeItem, RowControls } from './listUtils';

export default function VariablesPanel({
  variables,
  onChange,
}: {
  variables: Variable[];
  onChange: (v: Variable[]) => void;
}) {
  const patch = (i: number, p: Partial<Variable>) =>
    onChange(variables.map((v, j) => (j === i ? { ...v, ...p } : v)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>{t('editor.variables.help')}</p>
      {variables.map((v, i) => (
        <div key={i} className="card" style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <label style={{ flex: 1 }}>
            <span className="lbl">{t('editor.variables.name')}</span>
            <input
              type="text"
              value={v.name}
              onChange={(e) => patch(i, { name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
            />
          </label>
          <label style={{ flex: 2 }}>
            <span className="lbl">{t('editor.variables.formula')}</span>
            <input
              type="text"
              value={v.formula}
              style={{ fontFamily: 'ui-monospace, monospace' }}
              onChange={(e) => patch(i, { formula: e.target.value })}
            />
          </label>
          <RowControls
            index={i}
            count={variables.length}
            onMove={(d) => onChange(moveItem(variables, i, d))}
            onRemove={() => onChange(removeItem(variables, i))}
          />
        </div>
      ))}
      <button
        className="btn primary"
        style={{ alignSelf: 'flex-start' }}
        onClick={() => onChange([...variables, { name: `var${variables.length + 1}`, formula: '' }])}
      >
        + {t('editor.variables.add')}
      </button>
    </div>
  );
}
