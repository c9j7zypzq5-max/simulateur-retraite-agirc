// Couche d'accès aux données Supabase — workspace (1 par user), calculateurs,
// publication, compteurs du dashboard. Toute la sécurité réelle est portée
// par les policies RLS (voir builder/supabase/migrations) ; ce module ne fait
// que composer des requêtes, jamais de vérification de droits côté client.

import { supabase } from './supabase';
import { slugify, withSuffix } from './slug';
import { buildAnalytics, type Analytics } from './analytics';
import type { Calculator, CalculatorSchema, Plan, Theme } from '../schema/types';
import { DEFAULT_THEME } from '../schema/types';

export type { Analytics, DailyPoint, ReferrerStat } from './analytics';

interface CalculatorRow {
  id: string;
  workspace_id: string;
  slug: string | null;
  title: string;
  status: 'draft' | 'published';
  theme: Theme;
  schema: CalculatorSchema;
  hide_badge: boolean;
  capture_email: boolean;
  over_free_quota: boolean;
  webhook_url: string | null;
  created_at: string;
  updated_at: string;
}

function fromRow(row: CalculatorRow): Calculator & { workspaceId: string } {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    theme: row.theme,
    schema: row.schema,
    hideBadge: row.hide_badge,
    captureEmail: row.capture_email,
    overFreeQuota: row.over_free_quota,
    webhookUrl: row.webhook_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Suppression de compte en libre-service (RGPD) : purge réelle via la RPC
// builder_delete_account (SECURITY DEFINER, auth.uid() uniquement). Auth
// partagée avec simfinly.com : c'est LE compte Simfinly qui est supprimé —
// l'UI l'annonce explicitement avant l'appel.
export async function deleteAccount(): Promise<void> {
  const { error } = await supabase.rpc('builder_delete_account');
  if (error) throw error;
  await supabase.auth.signOut();
}

// Indication UI uniquement (grise les options réservées Pro+) : le vrai
// verrou est le trigger builder_enforce_plan_limits, qui reclampe toute
// valeur incohérente indépendamment de ce que montre l'écran.
export async function getWorkspacePlan(workspaceId: string): Promise<Plan> {
  const { data } = await supabase
    .from('builder_subscriptions')
    .select('plan')
    .eq('workspace_id', workspaceId)
    .maybeSingle();
  return (data?.plan as Plan | undefined) ?? 'free';
}

// Crée le workspace de l'utilisateur courant s'il n'existe pas encore
// (idempotent — appelé à chaque login). 1 workspace par user au MVP.
export async function ensureWorkspace(): Promise<string> {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) throw new Error('Non authentifié');

  const { data: existing, error: selErr } = await supabase
    .from('builder_workspaces')
    .select('id')
    .eq('owner', uid)
    .maybeSingle();
  if (selErr) throw selErr;
  if (existing) return existing.id;

  const { data: created, error: insErr } = await supabase
    .from('builder_workspaces')
    .insert({ owner: uid })
    .select('id')
    .single();
  if (insErr) throw insErr;
  return created.id;
}

export interface CalculatorListItem {
  id: string;
  title: string;
  status: 'draft' | 'published';
  slug: string | null;
  viewsSeven: number;
  submissionsSeven: number;
}

// Une seule requête sur la vue agrégée builder_calculator_stats (compteurs 7 j
// pré-calculés côté serveur) — plus de N+1. La vue est security_invoker, la
// RLS s'applique donc normalement.
export async function listCalculators(workspaceId: string): Promise<CalculatorListItem[]> {
  const { data, error } = await supabase
    .from('builder_calculator_stats')
    .select('id, title, status, slug, views_7d, submissions_7d')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((c) => ({
    id: c.id as string,
    title: c.title as string,
    status: c.status as 'draft' | 'published',
    slug: c.slug as string | null,
    viewsSeven: (c.views_7d as number) ?? 0,
    submissionsSeven: (c.submissions_7d as number) ?? 0,
  }));
}

export async function deleteCalculator(id: string): Promise<void> {
  const { error } = await supabase.from('builder_calculators').delete().eq('id', id);
  if (error) throw error;
}

// Duplique un calculateur en brouillon (slug null, jamais publié) — thème
// conservé, verrous de plan repartis à zéro (reclampés à l'insert par le
// trigger).
export async function duplicateCalculator(id: string): Promise<string> {
  const src = await getCalculator(id);
  if (!src) throw new Error('Calculateur introuvable');
  return createCalculator(src.workspaceId, `${src.title} (copie)`, src.schema, src.theme);
}

export async function createCalculator(
  workspaceId: string,
  title: string,
  schema: CalculatorSchema,
  theme: Theme = DEFAULT_THEME,
): Promise<string> {
  const { data, error } = await supabase
    .from('builder_calculators')
    .insert({ workspace_id: workspaceId, title, schema, theme })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function getCalculator(id: string): Promise<(Calculator & { workspaceId: string }) | null> {
  const { data, error } = await supabase.from('builder_calculators').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as CalculatorRow) : null;
}

export async function saveCalculator(
  id: string,
  patch: {
    title?: string;
    theme?: Theme;
    schema?: CalculatorSchema;
    hideBadge?: boolean;
    captureEmail?: boolean;
    webhookUrl?: string | null;
  },
): Promise<void> {
  const { hideBadge, captureEmail, webhookUrl, ...rest } = patch;
  const row: Record<string, unknown> = { ...rest };
  if (hideBadge !== undefined) row.hide_badge = hideBadge;
  if (captureEmail !== undefined) row.capture_email = captureEmail;
  if (webhookUrl !== undefined) row.webhook_url = webhookUrl;
  const { error } = await supabase.from('builder_calculators').update(row).eq('id', id);
  if (error) throw error;
}

// --- Analytics (écran /stats/:id) ------------------------------------------

// Deux requêtes (série quotidienne + référents) sur des vues security_invoker :
// la RLS scope déjà les lignes aux calculateurs du propriétaire connecté. La
// mise en forme (comblage des jours, totaux, conversion) est faite par
// buildAnalytics (lib/analytics.ts), testable sans réseau.
export async function getAnalytics(calculatorId: string): Promise<Analytics> {
  const [dailyRes, refRes] = await Promise.all([
    supabase
      .from('builder_calculator_daily')
      .select('day, views, submissions')
      .eq('calculator_id', calculatorId)
      .order('day', { ascending: true }),
    supabase
      .from('builder_referrer_stats')
      .select('source, views')
      .eq('calculator_id', calculatorId)
      .order('views', { ascending: false })
      .limit(8),
  ]);
  if (dailyRes.error) throw dailyRes.error;
  if (refRes.error) throw refRes.error;

  return buildAnalytics(
    (dailyRes.data ?? []).map((r) => ({
      day: r.day as string,
      views: Number(r.views) || 0,
      submissions: Number(r.submissions) || 0,
    })),
    (refRes.data ?? []).map((r) => ({ source: r.source as string, views: Number(r.views) || 0 })),
  );
}

// La page publique (s.html) n'utilise PAS ce module : elle passe par
// lib/publicClient.ts (fetch nu) pour ne pas embarquer tout le SDK
// @supabase/supabase-js (auth + realtime + storage) dans son bundle — budget
// < 100 ko de JS. Ce fichier ne sert que l'app authentifiée.

const UNIQUE_VIOLATION = '23505';
const MAX_SLUG_ATTEMPTS = 6;

// Publie un calculateur : attribue un slug (s'il n'en a pas déjà un) et passe
// le statut à published. Résout les collisions de slug par suffixe numérique.
export async function publishCalculator(id: string, title: string, existingSlug: string | null): Promise<string> {
  const base = existingSlug ?? slugify(title);
  for (let attempt = 1; attempt <= MAX_SLUG_ATTEMPTS; attempt++) {
    const candidate = existingSlug ?? withSuffix(base, attempt);
    const { error } = await supabase
      .from('builder_calculators')
      .update({ status: 'published', slug: candidate })
      .eq('id', id);
    if (!error) return candidate;
    if (error.code !== UNIQUE_VIOLATION) throw error;
    // Collision de slug : on retente avec un suffixe, sauf si le slug était figé.
    if (existingSlug) throw error;
  }
  throw new Error('Impossible de générer un slug unique après plusieurs tentatives');
}

// --- Soumissions (écran Soumissions) ---------------------------------------

export interface Submission {
  id: string;
  calculatorId: string;
  calculatorTitle: string;
  payload: Record<string, number>;
  email: string | null;
  source: 'hosted' | 'embed';
  createdAt: string;
}

// Aucun paramètre workspace : la RLS (builder_sub_owner_read) scope déjà le
// résultat aux seuls calculateurs du workspace de l'utilisateur connecté.
export async function listSubmissions(calculatorId?: string): Promise<Submission[]> {
  let query = supabase
    .from('builder_submissions')
    .select('id, calculator_id, payload, email, source, created_at, builder_calculators(title)')
    .order('created_at', { ascending: false });
  if (calculatorId) query = query.eq('calculator_id', calculatorId);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((r) => {
    // PostgREST renvoie un objet pour un embed *-à-1, mais le typage
    // supabase-js (sans types générés) l'infère parfois en tableau : on gère
    // les deux formes runtime possibles.
    const rel = r.builder_calculators as unknown as { title: string } | { title: string }[] | null;
    const calculatorTitle = (Array.isArray(rel) ? rel[0]?.title : rel?.title) ?? '—';
    return {
      id: r.id as string,
      calculatorId: r.calculator_id as string,
      calculatorTitle,
      payload: r.payload as Record<string, number>,
      email: r.email as string | null,
      source: r.source as 'hosted' | 'embed',
      createdAt: r.created_at as string,
    };
  });
}
