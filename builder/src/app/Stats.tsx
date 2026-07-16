// Écran analytics d'un calculateur (/stats/:id) : KPIs 30 jours, courbe des
// vues/soumissions par jour, top des référents. Réservé au propriétaire (garde
// d'appartenance + RLS des vues security_invoker). Lecture seule.

import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ensureWorkspace, getCalculator, getAnalytics, type Analytics } from '../lib/db';
import { t } from '../i18n';

export default function Stats() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState<string>('');
  const [data, setData] = useState<Analytics | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const [workspaceId, calc] = await Promise.all([ensureWorkspace(), getCalculator(id)]);
        if (!calc || calc.workspaceId !== workspaceId) {
          setNotFound(true);
          return;
        }
        setTitle(calc.title);
        setData(await getAnalytics(id));
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [id]);

  if (notFound) return <Navigate to="/" replace />;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 24 }}>
      <Link to="/" style={{ fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none' }}>← {t('publish.back')}</Link>
      <h1 style={{ fontSize: 22, margin: '10px 0 2px' }}>{title || '—'}</h1>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 20px' }}>{t('stats.window')}</p>

      {error && <p style={{ color: 'var(--negative)', fontSize: 13 }}>{error}</p>}
      {!data && !error ? null : data && (
        <>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            <Kpi label={t('stats.views')} value={data.totalViews.toLocaleString('fr-FR')} />
            <Kpi label={t('stats.submissions')} value={data.totalSubmissions.toLocaleString('fr-FR')} />
            <Kpi label={t('stats.conversion')} value={`${(data.conversion * 100).toFixed(1)} %`} />
          </div>

          <DailyChart data={data} />

          <h2 style={{ fontSize: 16, margin: '28px 0 10px' }}>{t('stats.topReferrers')}</h2>
          {data.referrers.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t('stats.noData')}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data.referrers.map((r) => (
                <div key={r.source} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px' }}>
                  <span style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.source}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>{r.views}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="card" style={{ flex: '1 1 160px', minWidth: 140 }}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--primary)' }}>{value}</div>
    </div>
  );
}

// Courbe simple en barres (vues) + points de soumission, SVG inline — pas de
// dépendance graphique. Les jours sont déjà comblés (30 points) côté db.ts.
export function DailyChart({ data }: { data: Analytics }) {
  const w = 820;
  const h = 160;
  const pad = { top: 10, right: 8, bottom: 20, left: 8 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const points = data.daily;
  const maxViews = Math.max(1, ...points.map((p) => p.views));
  const barW = innerW / points.length;

  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{t('stats.dailyViews')}</div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" role="img" aria-label={t('stats.dailyViews')} style={{ minWidth: 480 }}>
        {points.map((p, i) => {
          const barH = (p.views / maxViews) * innerH;
          const x = pad.left + i * barW;
          const y = pad.top + innerH - barH;
          const showLabel = i % 5 === 0 || i === points.length - 1;
          return (
            <g key={p.day}>
              <rect x={x + barW * 0.15} y={y} width={barW * 0.7} height={barH} rx={2} fill="var(--primary)" opacity={0.85}>
                <title>{`${p.day} · ${p.views} ${t('stats.views').toLowerCase()} · ${p.submissions} ${t('stats.submissions').toLowerCase()}`}</title>
              </rect>
              {p.submissions > 0 && (
                <circle cx={x + barW / 2} cy={y - 4} r={2.5} fill="var(--positive, #15A06B)">
                  <title>{`${p.day} · ${p.submissions}`}</title>
                </circle>
              )}
              {showLabel && (
                <text x={x + barW / 2} y={h - 6} textAnchor="middle" fontSize={9} fill="var(--text-secondary)">
                  {p.day.slice(5)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
