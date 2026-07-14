// Dashboard — liste des calculateurs du workspace (titre, statut, vues 7 j,
// soumissions 7 j) + bouton Nouveau (vierge ou exemple).

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import {
  ensureWorkspace,
  listCalculators,
  createCalculator,
  duplicateCalculator,
  deleteCalculator,
  deleteAccount,
  type CalculatorListItem,
} from '../lib/db';
import { BLANK_SCHEMA } from '../schema/defaults';
import { TEMPLATES } from '../schema/templates';
import type { CalculatorSchema } from '../schema/types';
import { t } from '../i18n';

export default function Dashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<CalculatorListItem[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

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
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>{t('dashboard.title')}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/submissions" className="btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            {t('submissions.title')}
          </Link>
          <button className="btn" onClick={() => signOut()}>{t('auth.signOut')}</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        <button className="btn primary" disabled={creating} onClick={() => handleNew(t('editor.untitled'), BLANK_SCHEMA)}>
          + {t('dashboard.newBlank')}
        </button>
        {TEMPLATES.map((tpl) => (
          <button key={tpl.id} className="btn" disabled={creating} title={tpl.description} onClick={() => handleNew(tpl.name, tpl.schema)}>
            + {tpl.name}
          </button>
        ))}
      </div>

      {error && <p style={{ color: 'var(--negative)', fontSize: 13 }}>{error}</p>}

      {items === null ? null : items.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>{t('dashboard.empty')}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((c) => (
            <div key={c.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontWeight: 600 }}>{c.title}</div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 6,
                    display: 'inline-block',
                    marginTop: 4,
                    background: c.status === 'published' ? 'rgba(21,160,107,0.12)' : 'var(--input-bg)',
                    color: c.status === 'published' ? 'var(--positive, #15A06B)' : 'var(--text-secondary)',
                  }}
                >
                  {t(`dashboard.status.${c.status}`)}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'right' }}>
                <div>{t('dashboard.views7')} : {c.viewsSeven}</div>
                <div>{t('dashboard.submissions7')} : {c.submissionsSeven}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn" onClick={() => navigate(`/editor/${c.id}`)}>{t('dashboard.open')}</button>
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
  );
}
