import type { CompareOp, Field, FieldType, ShowIf } from '../../schema/types';
import { t } from '../../i18n';
import { moveItem, removeItem, RowControls, findDuplicates } from './listUtils';
import { todayEpochDays, epochDaysToInput, inputToEpochDays } from '../../schema/date';

const FIELD_TYPES: FieldType[] = ['number', 'slider', 'select', 'radio', 'toggle', 'date'];

// "Libellé = valeur" ligne à ligne ↔ options structurées.
function parseOptions(text: string): Field['options'] {
  return text
    .split('\n')
    .map((line) => line.split('='))
    .filter((parts) => parts.length >= 2 && parts[0].trim() !== '')
    .map(([label, ...rest]) => ({ label: label.trim(), value: Number(rest.join('=').trim()) || 0 }));
}

function optionsToText(options: Field['options']): string {
  return (options ?? []).map((o) => `${o.label} = ${o.value}`).join('\n');
}

// Identifiant de formule sûr, dérivé du libellé : "Montant emprunté" → "montantEmprunte".
export function slugifyId(label: string): string {
  const words = label
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
  if (words.length === 0) return 'champ';
  const id = words.map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())).join('');
  return /^[0-9]/.test(id) ? `c${id}` : id;
}

export default function FieldsPanel({ fields, onChange }: { fields: Field[]; onChange: (f: Field[]) => void }) {
  const patch = (i: number, p: Partial<Field>) =>
    onChange(fields.map((f, j) => (j === i ? { ...f, ...p } : f)));

  const dupeIds = findDuplicates(fields.map((f) => f.id));

  const add = () => {
    const label = `${t('editor.fields.label')} ${fields.length + 1}`;
    onChange([...fields, { id: slugifyId(label), type: 'number', label, default: 0 }]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {fields.map((f, i) => (
        <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <label style={{ flex: 2 }}>
              <span className="lbl">{t('editor.fields.label')}</span>
              <input type="text" value={f.label} onChange={(e) => patch(i, { label: e.target.value })} />
            </label>
            <label style={{ flex: 1 }}>
              <span className="lbl">{t('editor.fields.type')}</span>
              <select
                value={f.type}
                onChange={(e) => {
                  const type = e.target.value as FieldType;
                  // Passer à « date » : la valeur par défaut devient aujourd'hui
                  // (jours epoch) — un défaut numérique n'aurait aucun sens.
                  patch(i, type === 'date' ? { type, default: todayEpochDays() } : { type });
                }}
              >
                {FIELD_TYPES.map((ty) => (
                  <option key={ty} value={ty}>{t(`editor.fields.types.${ty}`)}</option>
                ))}
              </select>
            </label>
            <RowControls
              index={i}
              count={fields.length}
              onMove={(d) => onChange(moveItem(fields, i, d))}
              onRemove={() => onChange(removeItem(fields, i))}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <label style={{ flex: 2 }}>
              <span className="lbl">{t('editor.fields.fieldId')}</span>
              <input
                type="text"
                value={f.id}
                onChange={(e) => patch(i, { id: slugifyId(e.target.value) || f.id })}
                style={dupeIds.has(f.id) ? { borderColor: 'var(--negative)' } : undefined}
              />
              {dupeIds.has(f.id) && (
                <span style={{ fontSize: 11, color: 'var(--negative)', display: 'block', marginTop: 2 }}>
                  {t('editor.fields.duplicateId')}
                </span>
              )}
            </label>
            {f.type === 'date' ? (
              <label style={{ flex: 1 }}>
                <span className="lbl">{t('editor.fields.default')}</span>
                <input
                  type="date"
                  value={epochDaysToInput(f.default)}
                  onChange={(e) => patch(i, { default: inputToEpochDays(e.target.value) })}
                />
              </label>
            ) : f.type !== 'toggle' ? (
              <label style={{ flex: 1 }}>
                <span className="lbl">{t('editor.fields.default')}</span>
                <input type="number" value={f.default} onChange={(e) => patch(i, { default: Number(e.target.value) || 0 })} />
              </label>
            ) : null}
          </div>

          {(f.type === 'number' || f.type === 'slider') && (
            <div style={{ display: 'flex', gap: 8 }}>
              {(['min', 'max', 'step'] as const).map((k) => (
                <label key={k} style={{ flex: 1 }}>
                  <span className="lbl">{t(`editor.fields.${k}`)}</span>
                  <input
                    type="number"
                    value={f[k] ?? ''}
                    onChange={(e) => patch(i, { [k]: e.target.value === '' ? undefined : Number(e.target.value) })}
                  />
                </label>
              ))}
              <label style={{ flex: 1 }}>
                <span className="lbl">{t('editor.fields.suffix')}</span>
                <input type="text" value={f.suffix ?? ''} onChange={(e) => patch(i, { suffix: e.target.value || undefined })} />
              </label>
            </div>
          )}

          {(f.type === 'select' || f.type === 'radio') && (
            <label>
              <span className="lbl">{t('editor.fields.options')}</span>
              <textarea
                rows={3}
                defaultValue={optionsToText(f.options)}
                onBlur={(e) => patch(i, { options: parseOptions(e.target.value) })}
              />
            </label>
          )}

          {/* Affichage conditionnel : n'afficher ce champ que si un autre
              champ remplit une condition. Choix limité aux champs définis
              AVANT celui-ci (évite les cycles). */}
          <ConditionEditor
            field={f}
            candidates={fields.slice(0, i).map((x) => x.id)}
            onChange={(showIf) => patch(i, { showIf })}
          />
        </div>
      ))}
      <button className="btn primary" onClick={add} style={{ alignSelf: 'flex-start' }}>
        + {t('editor.fields.add')}
      </button>
    </div>
  );
}

const OPS: CompareOp[] = ['==', '!=', '>', '>=', '<', '<='];

function ConditionEditor({
  field,
  candidates,
  onChange,
}: {
  field: Field;
  candidates: string[];
  onChange: (showIf: ShowIf | undefined) => void;
}) {
  const enabled = !!field.showIf;
  return (
    <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 8 }}>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
        <input
          type="checkbox"
          checked={enabled}
          disabled={!enabled && candidates.length === 0}
          onChange={(e) =>
            onChange(e.target.checked ? { field: candidates[0] ?? '', op: '==', value: 1 } : undefined)
          }
        />
        {t('editor.fields.showIf')}
        {candidates.length === 0 && <span> — {t('editor.fields.showIfNeedsPrev')}</span>}
      </label>
      {enabled && field.showIf && (
        <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={field.showIf.field}
            onChange={(e) => onChange({ ...field.showIf!, field: e.target.value })}
            style={{ width: 'auto' }}
          >
            {candidates.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={field.showIf.op}
            onChange={(e) => onChange({ ...field.showIf!, op: e.target.value as CompareOp })}
            style={{ width: 'auto', fontFamily: 'ui-monospace, monospace' }}
          >
            {OPS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <input
            type="number"
            value={field.showIf.value}
            onChange={(e) => onChange({ ...field.showIf!, value: Number(e.target.value) || 0 })}
            style={{ width: 90 }}
          />
        </div>
      )}
    </div>
  );
}
