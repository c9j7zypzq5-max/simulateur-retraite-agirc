// Dashboard — liste des calculateurs du workspace (titre, statut, vues 7 j,
// soumissions 7 j) + bouton Nouveau (vierge ou exemple).

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { ensureWorkspace, listCalculators, createCalculator, type CalculatorListItem } from '../lib/db';
import { BLANK_SCHEMA, SAMPLE_SCHEMA } from '../schema/defaults';
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

  async function handleNew(kind: 'blank' | 'sample') {
    setCreating(true);
    setError(null);
    try {
      const workspaceId = await ensureWorkspace();
      const title = kind === 'sample' ? 'Mensualité de prêt' : t('editor.untitled');
      const id = await createCalculator(workspaceId, title, kind === 'sample' ? SAMPLE_SCHEMA : BLANK_SCHEMA);
      navigate(`/editor/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setCreating(false);
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

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <button className="btn primary" disabled={creating} onClick={() => handleNew('blank')}>
          + {t('dashboard.newBlank')}
        </button>
        <button className="btn" disabled={creating} onClick={() => handleNew('sample')}>
          + {t('dashboard.newSample')}
        </button>
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
              <button className="btn" onClick={() => navigate(`/editor/${c.id}`)}>{t('dashboard.open')}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
