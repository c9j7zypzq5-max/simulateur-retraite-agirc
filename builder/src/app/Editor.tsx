// Éditeur — deux colonnes : formulaire d'édition à gauche (onglets Champs /
// Variables / Résultats / Thème), aperçu live à droite via LE composant de
// rendu partagé. Autosave localStorage (Lot 1, sans auth).

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Calculator, CalculatorSchema, Theme } from '../schema/types';
import { evaluateSchema } from '../engine/evaluate';
import CalculatorRenderer from '../render/CalculatorRenderer';
import { loadCalculator, saveCalculator } from './storage';
import { t } from '../i18n';
import FieldsPanel from './panels/FieldsPanel';
import VariablesPanel from './panels/VariablesPanel';
import ResultsPanel from './panels/ResultsPanel';
import ThemePanel from './panels/ThemePanel';

type Tab = 'fields' | 'variables' | 'results' | 'theme';
const TABS: Tab[] = ['fields', 'variables', 'results', 'theme'];

export default function Editor() {
  const [calc, setCalc] = useState<Calculator>(loadCalculator);
  const [tab, setTab] = useState<Tab>('fields');
  // Valeurs jouées dans l'aperçu (indépendantes du schéma).
  const [previewValues, setPreviewValues] = useState<Record<string, number>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // Autosave débouncé.
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      saveCalculator(calc);
      setSavedAt(new Date().toLocaleTimeString('fr-FR'));
    }, 600);
    return () => clearTimeout(timer.current);
  }, [calc]);

  const patchSchema = (patch: Partial<CalculatorSchema>) =>
    setCalc((c) => ({ ...c, schema: { ...c.schema, ...patch } }));
  const patchTheme = (patch: Partial<Theme>) =>
    setCalc((c) => ({ ...c, theme: { ...c.theme, ...patch } }));

  // Erreurs de formules remontées sous l'aperçu (éditeur seulement).
  const errors = useMemo(
    () => evaluateSchema(calc.schema, previewValues).errors,
    [calc.schema, previewValues],
  );
  const errorEntries = Object.entries(errors);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexWrap: 'wrap' }}>
      {/* Colonne gauche : édition */}
      <div style={{ flex: '1 1 420px', maxWidth: 640, padding: 20, borderRight: '1px solid var(--border)' }}>
        <label style={{ display: 'block', marginBottom: 14 }}>
          <span className="lbl">{t('editor.calculatorTitle')}</span>
          <input
            type="text"
            value={calc.title}
            onChange={(e) => setCalc((c) => ({ ...c, title: e.target.value }))}
          />
        </label>

        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {TABS.map((tb) => (
            <button
              key={tb}
              className="btn"
              style={tab === tb ? { background: 'var(--primary-soft)', borderColor: 'var(--primary)', color: 'var(--primary)' } : undefined}
              onClick={() => setTab(tb)}
            >
              {t(`editor.tabs.${tb}`)}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: 11, color: 'var(--text-secondary)' }}>
            {savedAt ? `${t('editor.saved')} · ${savedAt}` : ''}
          </span>
        </div>

        {tab === 'fields' && <FieldsPanel fields={calc.schema.fields} onChange={(fields) => patchSchema({ fields })} />}
        {tab === 'variables' && <VariablesPanel variables={calc.schema.variables} onChange={(variables) => patchSchema({ variables })} />}
        {tab === 'results' && (
          <ResultsPanel
            results={calc.schema.results}
            chart={calc.schema.chart}
            onChange={(results, chart) => patchSchema({ results, chart })}
          />
        )}
        {tab === 'theme' && <ThemePanel theme={calc.theme} onChange={patchTheme} />}
      </div>

      {/* Colonne droite : aperçu live */}
      <div style={{ flex: '1 1 380px', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <span className="lbl" style={{ alignSelf: 'flex-start', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {t('editor.preview')}
        </span>
        <div style={{ boxShadow: '0 1px 4px rgba(15,24,40,0.07), 0 4px 16px rgba(15,24,40,0.05)', borderRadius: 14, width: '100%', maxWidth: 560 }}>
          <CalculatorRenderer
            calculator={calc}
            values={previewValues}
            onChange={(id, v) => setPreviewValues((p) => ({ ...p, [id]: v }))}
          />
        </div>
        {errorEntries.length > 0 && (
          <div className="card" style={{ width: '100%', maxWidth: 560, borderColor: 'var(--negative)' }}>
            <strong style={{ fontSize: 12, color: 'var(--negative)' }}>{t('editor.errors')}</strong>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 12, color: 'var(--text-secondary)' }}>
              {errorEntries.map(([k, msg]) => (
                <li key={k}><code>{k}</code> — {msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
