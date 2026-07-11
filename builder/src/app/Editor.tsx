// Éditeur — deux colonnes : formulaire d'édition à gauche (onglets Champs /
// Variables / Résultats / Thème), aperçu live à droite via LE composant de
// rendu partagé. Autosave Supabase (débouncé). Publier → slug + snippets.

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import type { Calculator, CalculatorSchema, Plan, Theme } from '../schema/types';
import { evaluateSchema } from '../engine/evaluate';
import CalculatorRenderer from '../render/CalculatorRenderer';
import { ensureWorkspace, getCalculator, getWorkspacePlan, saveCalculator, publishCalculator } from '../lib/db';
import { t } from '../i18n';
import FieldsPanel from './panels/FieldsPanel';
import VariablesPanel from './panels/VariablesPanel';
import ResultsPanel from './panels/ResultsPanel';
import ThemePanel from './panels/ThemePanel';
import PlanPanel from './panels/PlanPanel';
import PublishPanel from './panels/PublishPanel';

type Tab = 'fields' | 'variables' | 'results' | 'theme' | 'plan';
const TABS: Tab[] = ['fields', 'variables', 'results', 'theme', 'plan'];

export default function Editor() {
  const { id } = useParams<{ id: string }>();

  const [calc, setCalc] = useState<Calculator | null>(null);
  const [plan, setPlan] = useState<Plan>('free');
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState<Tab>('fields');
  const [previewValues, setPreviewValues] = useState<Record<string, number>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Chargement initial + garde d'appartenance (défense en profondeur ; la
  // vraie barrière est la RLS, ceci évite juste une UI trompeuse).
  useEffect(() => {
    if (!id) return;
    (async () => {
      const [workspaceId, row] = await Promise.all([ensureWorkspace(), getCalculator(id)]);
      if (!row || row.workspaceId !== workspaceId) {
        setNotFound(true);
        return;
      }
      setCalc(row);
      getWorkspacePlan(workspaceId).then(setPlan).catch(() => {});
    })();
  }, [id]);

  // Autosave débouncé.
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const skipNextSave = useRef(true); // ne pas sauver le chargement initial
  useEffect(() => {
    if (!calc || !id) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      saveCalculator(id, {
        title: calc.title,
        theme: calc.theme,
        schema: calc.schema,
        hideBadge: calc.hideBadge,
        captureEmail: calc.captureEmail,
        webhookUrl: calc.webhookUrl,
      })
        .then(() => setSavedAt(new Date().toLocaleTimeString('fr-FR')))
        .catch(() => {});
    }, 600);
    return () => clearTimeout(timer.current);
  }, [calc, id]);

  const patchSchema = (patch: Partial<CalculatorSchema>) =>
    setCalc((c) => (c ? { ...c, schema: { ...c.schema, ...patch } } : c));
  const patchTheme = (patch: Partial<Theme>) =>
    setCalc((c) => (c ? { ...c, theme: { ...c.theme, ...patch } } : c));
  const patchPlanFields = (patch: { hideBadge?: boolean; captureEmail?: boolean; webhookUrl?: string | null }) =>
    setCalc((c) => (c ? { ...c, ...patch } : c));

  const errors = useMemo(
    () => (calc ? evaluateSchema(calc.schema, previewValues).errors : {}),
    [calc, previewValues],
  );
  const errorEntries = Object.entries(errors);

  async function handlePublish() {
    if (!calc || !id) return;
    setPublishing(true);
    setPublishError(null);
    try {
      const slug = await publishCalculator(id, calc.title, calc.slug);
      setCalc((c) => (c ? { ...c, status: 'published', slug } : c));
    } catch (e) {
      setPublishError(e instanceof Error ? e.message : String(e));
    } finally {
      setPublishing(false);
    }
  }

  if (notFound) return <Navigate to="/" replace />;
  if (!calc) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexWrap: 'wrap' }}>
      {/* Colonne gauche : édition */}
      <div style={{ flex: '1 1 420px', maxWidth: 640, padding: 20, borderRight: '1px solid var(--border)' }}>
        <Link to="/" style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none' }}>
          ← {t('publish.back')}
        </Link>

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', margin: '10px 0 14px' }}>
          <label style={{ flex: 1 }}>
            <span className="lbl">{t('editor.calculatorTitle')}</span>
            <input
              type="text"
              value={calc.title}
              onChange={(e) => setCalc((c) => (c ? { ...c, title: e.target.value } : c))}
            />
          </label>
          <button className="btn primary" disabled={publishing} onClick={handlePublish}>
            {publishing ? '…' : calc.status === 'published' ? t('publish.republish') : t('publish.button')}
          </button>
        </div>
        {publishError && <p style={{ color: 'var(--negative)', fontSize: 12 }}>{publishError}</p>}
        {calc.status === 'published' && calc.slug && <PublishPanel slug={calc.slug} />}

        <div style={{ display: 'flex', gap: 6, margin: '16px 0' }}>
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
        {tab === 'plan' && (
          <PlanPanel
            plan={plan}
            hideBadge={calc.hideBadge}
            captureEmail={calc.captureEmail}
            webhookUrl={calc.webhookUrl}
            onChange={patchPlanFields}
          />
        )}
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
            onChange={(fid, v) => setPreviewValues((p) => ({ ...p, [fid]: v }))}
            showBadge={!calc.hideBadge}
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
