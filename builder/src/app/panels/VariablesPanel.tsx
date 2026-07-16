import type { Variable } from '../../schema/types';
import { t } from '../../i18n';
import { moveItem, removeItem, RowControls, findDuplicates } from './listUtils';
import FormulaInput from './FormulaInput';

export default function VariablesPanel({
  variables,
  fieldIds,
  onChange,
}: {
  variables: Variable[];
  fieldIds: string[];
  onChange: (v: Variable[]) => void;
}) {
  const patch = (i: number, p: Partial<Variable>) =>
    onChange(variables.map((v, j) => (j === i ? { ...v, ...p } : v)));

  // Un nom de variable en collision avec un champ ou une autre variable écrase
  // silencieusement l'autre dans le scope d'évaluation partagé.
  const dupeNames = findDuplicates(variables.map((v) => v.name));
  const fieldIdSet = new Set(fieldIds);
  const collides = (name: string) => dupeNames.has(name) || fieldIdSet.has(name);

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
              style={collides(v.name) ? { borderColor: 'var(--negative)' } : undefined}
            />
            {collides(v.name) && (
              <span style={{ fontSize: 11, color: 'var(--negative)', display: 'block', marginTop: 2 }}>
                {t('editor.variables.duplicateName')}
              </span>
            )}
          </label>
          <label style={{ flex: 2 }}>
            <span className="lbl">{t('editor.variables.formula')}</span>
            {/* Une variable ne peut référencer que les champs et les variables
                déjà définies AU-DESSUS d'elle (évaluation séquentielle). */}
            <FormulaInput
              value={v.formula}
              refs={[...fieldIds, ...variables.slice(0, i).map((x) => x.name)]}
              onChange={(formula) => patch(i, { formula })}
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
