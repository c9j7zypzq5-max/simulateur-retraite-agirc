// Client de la page publique — fetch nu vers PostgREST, PAS le SDK
// @supabase/supabase-js (qui embarque auth + realtime + storage, inutiles ici
// et lourds). La page publique/embed a un budget de < 100 ko de JS ; l'app
// authentifiée (lib/db.ts + lib/supabase.ts) n'a pas cette contrainte.

import type { CalculatorSchema, Theme } from '../schema/types';

const BASE = `${import.meta.env.VITE_SUPABASE_URL as string}/rest/v1`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const HEADERS = {
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json',
};

export interface PublicCalculator {
  id: string;
  title: string;
  theme: Theme;
  schema: CalculatorSchema;
  // Champs bruts (snake_case, wire format PostgREST) — verrous de plan
  // recalculés côté serveur (voir builder_enforce_plan_limits / builder_touch_view_quota).
  hide_badge: boolean;
  capture_email: boolean;
  over_free_quota: boolean;
}

export async function getPublishedBySlug(slug: string): Promise<PublicCalculator | null> {
  const params = new URLSearchParams({
    slug: `eq.${slug}`,
    status: 'eq.published',
    select: 'id,title,theme,schema,hide_badge,capture_email,over_free_quota',
    limit: '1',
  });
  const res = await fetch(`${BASE}/builder_calculators?${params}`, { headers: HEADERS });
  if (!res.ok) return null;
  const rows = (await res.json()) as PublicCalculator[];
  return rows[0] ?? null;
}

// Fire-and-forget côté appelant : une vue ratée ne doit jamais bloquer l'affichage.
export async function recordView(calculatorId: string): Promise<void> {
  await fetch(`${BASE}/builder_views`, {
    method: 'POST',
    headers: { ...HEADERS, Prefer: 'return=minimal' },
    body: JSON.stringify({ calculator_id: calculatorId }),
  });
}

export async function recordSubmission(
  calculatorId: string,
  payload: Record<string, number>,
  source: 'hosted' | 'embed',
  email: string | null = null,
): Promise<void> {
  const res = await fetch(`${BASE}/builder_submissions`, {
    method: 'POST',
    headers: { ...HEADERS, Prefer: 'return=minimal' },
    body: JSON.stringify({ calculator_id: calculatorId, payload, source, email, referrer: document.referrer || null }),
  });
  if (!res.ok) throw new Error(`Échec de l'enregistrement (${res.status})`);
}
