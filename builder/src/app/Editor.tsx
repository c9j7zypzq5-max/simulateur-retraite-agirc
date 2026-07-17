// Éditeur — deux colonnes : formulaire d'édition à gauche (onglets Champs /
// Variables / Résultats / Thème), aperçu live à droite via LE composant de
// rendu partagé. Autosave Supabase (débouncé). Publier → slug + snippets.
//
// Mode invité (`guest`, route /essai) : même UI, mais le calculateur est un
// brouillon local (localStorage, aucun compte requis) — c'est le retrait de
// friction « personne ne crée un compte juste pour essayer ». La publication
// bascule alors vers l'inscription en emportant le brouillon (lib/intent).

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import type { Calculator, CalculatorSchema, Plan, Theme } from '../schema/types';
import { DEFAULT_THEME } from '../schema/types';
import { BLANK_SCHEMA } from '../schema/defaults';
import { TEMPLATES } from '../schema/templates';
import { evaluateSchema } from '../engine/evaluate';
import CalculatorRenderer from '../render/CalculatorRenderer';
import { ensureWorkspace, getCalculator, getWorkspacePlan, saveCalculator, publishCalculator } from '../lib/db';
import { getLocalDraft, saveLocalDraft, setPendingIntent, type LocalDraft } from '../lib/intent';
import { t } from '../i18n';
import FieldsPanel from './panels/FieldsPanel';
import VariablesPanel from './panels/VariablesPanel';
import ResultsPanel from './panels/ResultsPanel';
import ThemePanel from './panels/ThemePanel';
import PlanPanel from './panels/PlanPanel';
import PublishPanel from './panels/PublishPanel';

type Tab = 'fields' | 'variables' | 'results' | 'theme' | 'plan';
const TABS: Tab[] = ['fields', 'variables', 'results', 'theme', 'plan'];

// Fabrique un calculateur local (mode invité) : mêmes champs que la ligne
// Supabase, valeurs par défaut côté « free », id sentinelle 'local'.
function makeGuestCalc(
  title: string,
  schema: CalculatorSchema,
  theme: Theme,
  flags?: { hideBadge: boolean; captureEmail: boolean; notifyEmail: boolean },
): Calculator {
  const now = new Date().toISOString();
  return {
    id: 'local', slug: null, title, status: 'draft', theme, schema,
    hideBadge: flags?.hideBadge ?? false,
    captureEmail: flags?.captureEmail ?? false,
    overFreeQuota: false,
    webhookUrl: null,
    notifyEmail: flags?.notifyEmail ?? true,
    createdAt: now, updatedAt: now,
  };
}

const calcToDraft = (c: Calculator): LocalDraft => ({
  title: c.title, schema: c.schema, theme: c.theme,
  hideBadge: c.hideBadge, captureEmail: c.captureEmail, notifyEmail: c.notifyEmail,
});

export default function Editor({ guest = false }: { guest?: boolean }) {
  const params = useParams<{ id?: string; templateId?: string }>();
  const id = params.id;
  const navigate = useNavigate();

  const [calc, setCalc] = useState<Calculator | null>(null);
  const [plan, setPlan] = useState<Plan>('free');
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState<Tab>('fields');
  const [previewValues, setPreviewValues] = useState<Record<string, number>>({});
  const [saveState, setSaveState] = useState<{ status: 'idle' | 'saving' | 'saved' | 'error'; at?: string }>({ status: 'idle' });
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Chargement initial. Invité : brouillon local existant, sinon amorce depuis
  // le modèle passé en URL (/essai/:templateId), sinon vierge. Connecté :
  // calculateur Supabase + garde d'appartenance (défense en profondeur ; la
  // vraie barrière est la RLS, ceci évite juste une UI trompeuse).
  useEffect(() => {
    if (guest) {
      const existing = getLocalDraft();
      if (existing) {
        setCalc(makeGuestCalc(existing.title, existing.schema, existing.theme, {
          hideBadge: existing.hideBadge,
          captureEmail: existing.captureEmail,
          notifyEmail: existing.notifyEmail,
        }));
      } else {
        const tpl = params.templateId ? TEMPLATES.find((x) => x.id === params.templateId) : null;
        setCalc(makeGuestCalc(tpl ? tpl.name : t('editor.untitled'), tpl ? tpl.schema : BLANK_SCHEMA, DEFAULT_THEME));
      }
      return;
    }
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
  }, [id, guest, params.templateId]);

  // Autosave. Invité : écriture localStorage synchrone (instantanée).
  // Connecté : débouncé vers Supabase.
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const skipNextSave = useRef(true); // ne pas sauver le chargement initial
  useEffect(() => {
    if (!calc) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    if (guest) {
      saveLocalDraft(calcToDraft(calc));
      setSaveState({ status: 'saved', at: new Date().toLocaleTimeString('fr-FR') });
      return;
    }
    if (!id) return;
    clearTimeout(timer.current);
    setSaveState({ status: 'saving' });
    timer.current = setTimeout(() => {
      saveCalculator(id, {
        title: calc.title,
        theme: calc.theme,
        schema: calc.schema,
        hideBadge: calc.hideBadge,
        captureEmail: calc.captureEmail,
        webhookUrl: calc.webhookUrl,
        notifyEmail: calc.notifyEmail,
      })
        .then(() => setSaveState({ status: 'saved', at: new Date().toLocaleTimeString('fr-FR') }))
        // Ne plus avaler l'échec en silence : l'utilisateur doit savoir que sa
        // dernière modification n'est pas persistée (session expirée, réseau…).
        .catch(() => setSaveState({ status: 'error' }));
    }, 600);
    return () => clearTimeout(timer.current);
  }, [calc, id, guest]);

  const patchSchema = (patch: Partial<CalculatorSchema>) =>
    setCalc((c) => (c ? { ...c, schema: { ...c.schema, ...patch } } : c));
  const patchTheme = (patch: Partial<Theme>) =>
    setCalc((c) => (c ? { ...c, theme: { ...c.theme, ...patch } } : c));
  const patchPlanFields = (patch: { hideBadge?: boolean; captureEmail?: boolean; webhookUrl?: string | null; notifyEmail?: boolean }) =>
    setCalc((c) => (c ? { ...c, ...patch } : c));

  const errors = useMemo(
    () => (calc ? evaluateSchema(calc.schema, previewValues).errors : {}),
    [calc, previewValues],
  );
  const errorEntries = Object.entries(errors);

  async function handlePublish() {
    if (!calc) return;
    // Invité : on ne publie pas sans compte — on emporte le brouillon vers
    // l'inscription, qui le créera puis ouvrira l'éditeur (consommé au
    // Dashboard). Zéro perte de travail.
    if (guest) {
      setPendingIntent({ type: 'draft', draft: calcToDraft(calc) });
      navigate('/login?intent=publish');
      return;
    }
    if (!id) return;
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
    <div>
      {guest && (
        <div style={{ background: 'var(--primary-soft)', borderBottom: '1px solid var(--border)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: 'var(--text)' }}>
            <strong>{t('essai.bannerTitle')}</strong> — {t('essai.bannerHelp')}
          </span>
          <button className="btn primary" style={{ padding: '6px 16px', fontSize: 13 }} onClick={handlePublish}>
            {t('essai.publishCta')}
          </button>
        </div>
      )}
      <div style={{ display: 'flex', minHeight: '100vh', flexWrap: 'wrap' }}>
        {/* Colonne gauche : édition */}
        <div style={{ flex: '1 1 420px', maxWidth: 640, padding: 20, borderRight: '1px solid var(--border)' }}>
          <Link to={guest ? '/modeles' : '/'} style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none' }}>
            ← {guest ? t('essai.back') : t('publish.back')}
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
              {guest ? t('essai.publishShort') : publishing ? '…' : calc.status === 'published' ? t('publish.republish') : t('publish.button')}
            </button>
          </div>
          {publishError && <p style={{ color: 'var(--negative)', fontSize: 12 }}>{publishError}</p>}
          {!guest && calc.status === 'published' && calc.slug && <PublishPanel slug={calc.slug} />}

          <div style={{ display: 'flex', gap: 6, margin: '16px 0' }}>
            {TABS.map((tb) => (
              <button
                key={tb}
                className={`btn chip${tab === tb ? ' active' : ''}`}
                onClick={() => setTab(tb)}
              >
                {t(`editor.tabs.${tb}`)}
              </button>
            ))}
            <span
              style={{
                marginLeft: 'auto',
                alignSelf: 'center',
                fontSize: 11,
                color: saveState.status === 'error' ? 'var(--negative)' : 'var(--text-secondary)',
                fontWeight: saveState.status === 'error' ? 600 : 400,
              }}
            >
              {saveState.status === 'saving' && t('editor.saving')}
              {saveState.status === 'saved' && `${guest ? t('essai.savedLocal') : t('editor.saved')} · ${saveState.at}`}
              {saveState.status === 'error' && `⚠ ${t('editor.saveError')}`}
            </span>
          </div>

          {tab === 'fields' && (
            <FieldsPanel
              fields={calc.schema.fields}
              steps={calc.schema.steps}
              onChange={(fields) => patchSchema({ fields })}
              onStepsChange={(steps) => patchSchema({ steps })}
            />
          )}
          {tab === 'variables' && (
            <VariablesPanel
              variables={calc.schema.variables}
              fieldIds={calc.schema.fields.map((f) => f.id)}
              onChange={(variables) => patchSchema({ variables })}
            />
          )}
          {tab === 'results' && (
            <ResultsPanel
              results={calc.schema.results}
              chart={calc.schema.chart}
              refs={[...calc.schema.fields.map((f) => f.id), ...calc.schema.variables.map((v) => v.name)]}
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
              notifyEmail={calc.notifyEmail}
              onChange={patchPlanFields}
            />
          )}
        </div>

        {/* Colonne droite : aperçu live */}
        <div style={{ flex: '1 1 380px', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <span className="lbl" style={{ alignSelf: 'flex-start', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t('editor.preview')}
          </span>
          <div className="card" style={{ padding: 0, overflow: 'hidden', width: '100%', maxWidth: 560 }}>
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
    </div>
  );
}
