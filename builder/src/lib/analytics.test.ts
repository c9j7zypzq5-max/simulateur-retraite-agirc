import { describe, it, expect } from 'vitest';
import { buildAnalytics, fillDailyGaps } from './analytics';

// Scénario identique aux données de vérification semées en base :
// 4 vues + 2 soumissions aujourd'hui, 2 vues il y a 5 jours ; référents
// google.com=4, t.co=1, (direct)=1. now figé pour un test déterministe.
const NOW = new Date('2026-07-15T12:00:00Z');

describe('analytics (mise en forme)', () => {
  it('fillDailyGaps : toujours 30 points chronologiques, dernier = jour courant', () => {
    const pts = fillDailyGaps([], NOW);
    expect(pts).toHaveLength(30);
    expect(pts[29].day).toBe('2026-07-15');
    expect(pts[0].day).toBe('2026-06-16'); // 29 jours avant
    expect(pts.every((p) => p.views === 0 && p.submissions === 0)).toBe(true);
  });

  it('buildAnalytics : totaux, conversion et comblage des trous', () => {
    const a = buildAnalytics(
      [
        { day: '2026-07-10', views: 2, submissions: 0 },
        { day: '2026-07-15', views: 4, submissions: 2 },
      ],
      [
        { source: 'google.com', views: 4 },
        { source: 't.co', views: 1 },
        { source: '(direct)', views: 1 },
      ],
      NOW,
    );

    expect(a.daily).toHaveLength(30);
    expect(a.daily[29]).toEqual({ day: '2026-07-15', views: 4, submissions: 2 });
    expect(a.daily.find((d) => d.day === '2026-07-10')).toEqual({ day: '2026-07-10', views: 2, submissions: 0 });
    // Les 28 autres jours sont à zéro.
    expect(a.daily.filter((d) => d.views === 0)).toHaveLength(28);

    expect(a.totalViews).toBe(6);
    expect(a.totalSubmissions).toBe(2);
    expect(a.conversion).toBeCloseTo(2 / 6, 6);

    expect(a.referrers[0]).toEqual({ source: 'google.com', views: 4 });
    expect(a.referrers.map((r) => r.source)).toEqual(['google.com', 't.co', '(direct)']);
  });

  it('buildAnalytics : conversion 0 quand aucune vue (pas de division par zéro)', () => {
    const a = buildAnalytics([], [], NOW);
    expect(a.totalViews).toBe(0);
    expect(a.conversion).toBe(0);
  });
});
