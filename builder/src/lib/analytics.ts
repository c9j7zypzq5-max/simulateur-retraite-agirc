// Transformation pure des lignes renvoyées par les vues SQL
// (builder_calculator_daily / builder_referrer_stats) en objet Analytics prêt
// pour l'écran /stats/:id. Isolé de db.ts (qui touche le client Supabase) pour
// être testable sans réseau.

export interface DailyPoint {
  day: string; // 'YYYY-MM-DD'
  views: number;
  submissions: number;
}
export interface ReferrerStat {
  source: string;
  views: number;
}
export interface Analytics {
  daily: DailyPoint[]; // 30 jours, trous comblés à 0, ordre chronologique
  referrers: ReferrerStat[]; // top 8, décroissant
  totalViews: number;
  totalSubmissions: number;
  conversion: number; // soumissions / vues, 0 si aucune vue
}

export const DAYS_WINDOW = 30;

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Comble les jours sans activité : la vue SQL n'émet que les jours vus. Génère
// exactement DAYS_WINDOW points, du plus ancien au plus récent (jour `now`
// inclus). `now` injectable pour des tests déterministes.
export function fillDailyGaps(
  rows: { day: string; views: number; submissions: number }[],
  now: Date = new Date(),
): DailyPoint[] {
  const byDay = new Map(rows.map((r) => [r.day, r]));
  const out: DailyPoint[] = [];
  for (let i = DAYS_WINDOW - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const key = isoDay(d);
    const row = byDay.get(key);
    out.push({ day: key, views: row?.views ?? 0, submissions: row?.submissions ?? 0 });
  }
  return out;
}

export function buildAnalytics(
  dailyRows: { day: string; views: number; submissions: number }[],
  referrerRows: { source: string; views: number }[],
  now: Date = new Date(),
): Analytics {
  const daily = fillDailyGaps(dailyRows, now);
  const totalViews = daily.reduce((s, d) => s + d.views, 0);
  const totalSubmissions = daily.reduce((s, d) => s + d.submissions, 0);
  return {
    daily,
    referrers: referrerRows.map((r) => ({ source: r.source, views: Number(r.views) || 0 })),
    totalViews,
    totalSubmissions,
    conversion: totalViews > 0 ? totalSubmissions / totalViews : 0,
  };
}
