// LE composant de rendu — consommé tel quel par l'aperçu de l'éditeur, la
// page hébergée (s.simfinly.com) et l'iframe embed. Interdiction de dupliquer
// cette logique ailleurs : toute divergence entre surfaces est un bug.

import { useMemo, useState } from 'react';
import type { Calculator, Field } from '../schema/types';
import { evaluateSchema } from '../engine/evaluate';
import { epochDaysToInput, inputToEpochDays } from '../schema/date';
import { fieldVisible } from '../schema/visibility';
import { isWizard, groupByStep } from '../schema/steps';
import { formatValue } from './format';
import Chart from './Chart';
import { t } from '../i18n';

interface RendererProps {
  calculator: Pick<Calculator, 'title' | 'theme' | 'schema'>;
  values: Record<string, number>;
  onChange: (fieldId: string, value: number) => void;
  // Badge « Créé avec Simfinly » : retirable en Pro+ seulement (verrou serveur,
  // voir calculator.hideBadge côté appelant).
  showBadge?: boolean;
  // Capture email (Pro+) : masque le bloc résultats/graphique tant que
  // l'email n'a pas été saisi. Le formulaire de capture lui-même vit dans
  // PublicCalculator, pas ici — ce composant reste un pur rendu.
  hideResults?: boolean;
}

export default function CalculatorRenderer({ calculator, values, onChange, showBadge = true, hideResults = false }: RendererProps) {
  const { theme, schema } = calculator;
  const evaluation = useMemo(() => evaluateSchema(schema, values), [schema, values]);

  // Wizard : navigation interne (état d'UI, pas de donnée). Bornée à chaque
  // rendu au cas où l'auteur supprime des étapes dans l'éditeur.
  const wizard = isWizard(schema);
  const stepCount = schema.steps?.length ?? 1;
  const [rawStep, setRawStep] = useState(0);
  const step = Math.min(Math.max(rawStep, 0), stepCount - 1);
  const onLastStep = !wizard || step === stepCount - 1;

  const visibleFields = schema.fields.filter((f) => fieldVisible(f, evaluation.scope));
  // En mode wizard on ne montre que les champs de l'étape courante ; sinon tout.
  const fieldsToShow = wizard ? groupByStep(visibleFields, stepCount)[step] : visibleFields;

  const styleVars = {
    '--c-primary': theme.primary,
    '--c-bg': theme.background,
    '--c-text': theme.text,
    background: 'var(--c-bg)',
    color: 'var(--c-text)',
    fontFamily: theme.font || "'Hanken Grotesk', system-ui, sans-serif",
    borderRadius: 14,
    padding: '22px 24px',
    maxWidth: 560,
    width: '100%',
    boxSizing: 'border-box',
  } as React.CSSProperties;

  return (
    <div style={styleVars}>
      {theme.logoUrl && (
        <img src={theme.logoUrl} alt="" style={{ maxHeight: 40, maxWidth: 180, marginBottom: 12, display: 'block' }} />
      )}
      <h2 style={{ margin: '0 0 18px', fontSize: 20, fontWeight: 700 }}>{calculator.title}</h2>

      {wizard && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
            <span style={{ fontWeight: 600 }}>{schema.steps![step].title}</span>
            <span>{t('renderer.stepOf').replace('{i}', String(step + 1)).replace('{n}', String(stepCount))}</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: 'color-mix(in srgb, var(--c-text) 12%, transparent)' }}>
            <div style={{ height: '100%', borderRadius: 2, background: 'var(--c-primary)', width: `${((step + 1) / stepCount) * 100}%`, transition: 'width 0.2s' }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {fieldsToShow.map((f) => (
          <FieldInput key={f.id} field={f} value={values[f.id] ?? f.default} onChange={(v) => onChange(f.id, v)} />
        ))}
      </div>

      {wizard && (
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button
            type="button"
            onClick={() => setRawStep(step - 1)}
            disabled={step === 0}
            style={{ ...navButtonStyle, opacity: step === 0 ? 0.4 : 1, cursor: step === 0 ? 'default' : 'pointer', borderColor: 'color-mix(in srgb, var(--c-text) 22%, transparent)' }}
          >
            ← {t('renderer.prev')}
          </button>
          {step < stepCount - 1 && (
            <button
              type="button"
              onClick={() => setRawStep(step + 1)}
              style={{ ...navButtonStyle, marginLeft: 'auto', background: 'var(--c-primary)', color: '#fff', borderColor: 'var(--c-primary)', cursor: 'pointer' }}
            >
              {t('renderer.next')} →
            </button>
          )}
        </div>
      )}

      {onLastStep && !hideResults && schema.results.length > 0 && (
        <div style={{ marginTop: 22, padding: '16px 18px', borderRadius: 10, background: 'color-mix(in srgb, var(--c-primary) 8%, var(--c-bg))', display: 'flex', flexWrap: 'wrap', gap: '14px 28px' }}>
          {schema.results.map((r, i) => (
            <div key={i} style={{ minWidth: 120 }}>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 2 }}>{r.label}</div>
              <div style={{ fontSize: r.size === 'lg' ? 28 : 18, fontWeight: 700, color: 'var(--c-primary)' }}>
                {formatValue(evaluation.results[i], r.format)}
              </div>
            </div>
          ))}
        </div>
      )}

      {onLastStep && !hideResults && schema.chart && (
        <Chart
          type={schema.chart.type}
          items={schema.chart.items.map((it, i) => ({ label: it.label, value: evaluation.chartValues[i] }))}
          primary={theme.primary}
          fmt={(v) => formatValue(v, 'eur')}
        />
      )}

      {showBadge && (
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          {/* Cible = la landing du builder (boucle virale du produit), même
              origine que la page publique/l'embed : URL relative. */}
          <a
            href="/?utm_source=badge&utm_medium=calculator"
            target="_blank"
            rel="noopener"
            style={{ fontSize: 11, opacity: 0.55, color: 'var(--c-text)', textDecoration: 'none' }}
          >
            ⚡ {t('renderer.badge')}
          </a>
        </div>
      )}
    </div>
  );
}

const navButtonStyle: React.CSSProperties = {
  padding: '9px 16px',
  borderRadius: 8,
  border: '1px solid transparent',
  background: 'transparent',
  color: 'inherit',
  fontSize: 14,
  fontWeight: 600,
  fontFamily: 'inherit',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '9px 12px',
  borderRadius: 8,
  border: '1px solid color-mix(in srgb, var(--c-text) 18%, transparent)',
  background: 'transparent',
  color: 'var(--c-text)',
  fontSize: 15,
  fontFamily: 'inherit',
};

function FieldInput({ field, value, onChange }: { field: Field; value: number; onChange: (v: number) => void }) {
  const label = (
    <span style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
      {field.label}
      {field.suffix ? <span style={{ opacity: 0.6, fontWeight: 400 }}> ({field.suffix})</span> : null}
    </span>
  );

  switch (field.type) {
    case 'number':
      return (
        <label>
          {label}
          <input
            type="number"
            value={Number.isFinite(value) ? value : ''}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(e) => onChange(e.target.value === '' ? NaN : Number(e.target.value))}
            style={inputStyle}
          />
        </label>
      );
    case 'date':
      // value = jours epoch stockés ; la formule verra l'âge en années.
      return (
        <label>
          {label}
          <input
            type="date"
            value={epochDaysToInput(value)}
            onChange={(e) => onChange(inputToEpochDays(e.target.value))}
            style={inputStyle}
          />
        </label>
      );
    case 'slider':
      return (
        <label>
          {label}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="range"
              value={value}
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={field.step ?? 1}
              onChange={(e) => onChange(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--c-primary)' }}
            />
            <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 14, fontWeight: 600, minWidth: 64, textAlign: 'right' }}>
              {new Intl.NumberFormat('fr-FR').format(value)} {field.suffix ?? ''}
            </span>
          </div>
        </label>
      );
    case 'select':
      return (
        <label>
          {label}
          <select value={value} onChange={(e) => onChange(Number(e.target.value))} style={inputStyle}>
            {(field.options ?? []).map((o, i) => (
              <option key={i} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      );
    case 'radio':
      return (
        <div>
          {label}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(field.options ?? []).map((o, i) => {
              const active = value === o.value;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onChange(o.value)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    border: `1px solid ${active ? 'var(--c-primary)' : 'color-mix(in srgb, var(--c-text) 18%, transparent)'}`,
                    background: active ? 'color-mix(in srgb, var(--c-primary) 12%, transparent)' : 'transparent',
                    color: active ? 'var(--c-primary)' : 'inherit',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
      );
    case 'toggle': {
      const on = value === 1;
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{field.label}</span>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => onChange(on ? 0 : 1)}
            style={{
              width: 42,
              height: 24,
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              background: on ? 'var(--c-primary)' : 'color-mix(in srgb, var(--c-text) 25%, transparent)',
              transition: 'background 0.15s',
            }}
          >
            <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }} />
          </button>
        </div>
      );
    }
  }
}
