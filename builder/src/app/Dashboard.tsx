// Dashboard — liste des calculateurs du workspace (titre, statut, vues 7 j,
// soumissions 7 j) + bouton Nouveau (vierge ou exemple).

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import {
  ensureWorkspace,
  listCalculators,
  createCalculator,
  saveCalculator,
  duplicateCalculator,
  deleteCalculator,
  deleteAccount,
  type CalculatorListItem,
} from '../lib/db';
import { consumePendingIntent, clearLocalDraft, type PendingIntent } from '../lib/intent';
import { BLANK_SCHEMA } from '../schema/defaults';
import { TEMPLATES } from '../schema/templates';
import type { CalculatorSchema } from '../schema/types';
import { t } from '../i18n';
import { Header } from './Chrome';

// Quelques modèles mis en avant comme démarrage rapide (le reste via /modeles).
const QUICKSTART = TEMPLATES.slice(0, 5);

export default function Dashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<CalculatorListItem[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    init();
  }, []);

  // Au montage : d'abord honorer une intention en attente (modèle choisi ou
  // brouillon d'essai posé avant l'inscription — lib/intent), qui crée le
  // calculateur et ouvre l'éditeur ; sinon charger la liste normalement.
  async function init() {
    setError(null);
    try {
      const workspaceId = await ensureWorkspace();
      const intent = consumePendingIntent();
      if (intent) {
        const createdId = await applyIntent(workspaceId, intent);
        if (createdId) {
          navigate(`/editor/${createdId}`);
          return;
        }
      }
      setItems(await listCalculators(workspaceId));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function applyIntent(workspaceId: string, intent: PendingIntent): Promise<string | null> {
    if (intent.type === 'template') {
      const tpl = TEMPLATES.find((x) => x.id === intent.templateId);
      return tpl ? createCalculator(workspaceId, tpl.name, tpl.schema) : null;
    }
    // Brouillon d'essai : on recrée le calculateur travaillé en mode invité.
    const d = intent.draft;
    const createdId = await createCalculator(workspaceId, d.title, d.schema, d.theme);
    // createCalculator ne pose que titre/schéma/thème : on reporte les options
    // que l'invité aurait activées (le serveur reclampe selon le plan).
    if (d.captureEmail || d.hideBadge || !d.notifyEmail) {
      try {
        await saveCalculator(createdId, { captureEmail: d.captureEmail, hideBadge: d.hideBadge, notifyEmail: d.notifyEmail });
      } catch {
        /* non bloquant : le contenu est déjà créé */
      }
    }
    clearLocalDraft();
    return createdId;
  }

  async function load() {
    setError(null);
    try {
      const workspaceId = await ensureWorkspace();
      setItems(await listCalculators(workspaceId));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function handleNew(title: string, schema: CalculatorSchema) {
    setCreating(true);
    setError(null);
    try {
      const workspaceId = await ensureWorkspace();
      const id = await createCalculator(workspaceId, title, schema);
      navigate(`/editor/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setCreating(false);
    }
  }

  async function handleDuplicate(id: string) {
    setError(null);
    try {
      const newId = await duplicateCalculator(id);
      navigate(`/editor/${newId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(t('dashboard.deleteConfirm').replace('{title}', title))) return;
    setError(null);
    try {
      await deleteCalculator(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div>
      <Header
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/submissions" className="btn" style={{ textDecoration: 'none' }}>
              {t('submissions.title')}
            </Link>
            <button className="btn" onClick={() => signOut()}>{t('auth.signOut')}</button>
          </div>
        }
      />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 28, margin: '0 0 4px' }}>{t('dashboard.title')}</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '0 0 22px', fontSize: 14 }}>{t('dashboard.subtitle')}</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn primary" disabled={creating} onClick={() => handleNew(t('editor.untitled'), BLANK_SCHEMA)}>
            + {t('dashboard.newBlank')}
          </button>
          {QUICKSTART.map((tpl) => (
            <button key={tpl.id} className="btn" disabled={creating} title={tpl.description} onClick={() => handleNew(tpl.name, tpl.schema)}>
              + {tpl.name}
            </button>
          ))}
          <Link to="/modeles" className="btn" style={{ textDecoration: 'none' }}>
            {t('dashboard.browseModels').replace('{n}', String(TEMPLATES.length))}
          </Link>
        </div>

        {error && <p style={{ color: 'var(--negative)', fontSize: 13 }}>{error}</p>}

        {items === null ? null : items.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '44px 24px' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🛠️</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{t('dashboard.emptyTitle')}</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '0 auto', maxWidth: 380, lineHeight: 1.6 }}>{t('dashboard.emptyHelp')}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map((c) => (
              <div key={c.id} className="card interactive" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Space Grotesk', sans-serif" }}>{c.title}</div>
                  <span className={`status-pill ${c.status === 'published' ? 'published' : 'draft'}`} style={{ marginTop: 6 }}>
                    {t(`dashboard.status.${c.status}`)}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'right' }}>
                  <div>{t('dashboard.views7')} : {c.viewsSeven}</div>
                  <div>{t('dashboard.submissions7')} : {c.submissionsSeven}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn" onClick={() => navigate(`/editor/${c.id}`)}>{t('dashboard.open')}</button>
                {c.status === 'published' && (
                  <button className="btn" title={t('dashboard.stats')} onClick={() => navigate(`/stats/${c.id}`)}>📊</button>
                )}
                <button className="btn" title={t('dashboard.duplicate')} onClick={() => handleDuplicate(c.id)}>⧉</button>
                <button
                  className="btn"
                  title={t('dashboard.delete')}
                  style={{ color: 'var(--negative)' }}
                  onClick={() => handleDelete(c.id, c.title)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suppression de compte en libre-service (RGPD) : purge réelle via la
          RPC builder_delete_account — auth partagée, le compte Simfinly
          entier disparaît, d'où la confirmation très explicite. */}
      <div style={{ marginTop: 48, paddingTop: 16, borderTop: '1px solid var(--border)', textAlign: 'right' }}>
        <button
          className="btn"
          style={{ color: 'var(--negative)', borderColor: 'var(--negative)', fontSize: 12 }}
          onClick={async () => {
            if (!window.confirm(t('auth.deleteAccountConfirm'))) return;
            try {
              await deleteAccount();
            } catch {
              setError(t('auth.deleteAccountError'));
            }
          }}
        >
          {t('auth.deleteAccount')}
        </button>
        </div>
      </div>
    </div>
  );
}
