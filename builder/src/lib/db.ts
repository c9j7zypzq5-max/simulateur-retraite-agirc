// Couche d'accès aux données Supabase — workspace (1 par user), calculateurs,
// publication, compteurs du dashboard. Toute la sécurité réelle est portée
// par les policies RLS (voir builder/supabase/migrations) ; ce module ne fait
// que composer des requêtes, jamais de vérification de droits côté client.

import { supabase } from './supabase';
import { slugify, withSuffix } from './slug';
import type { Calculator, CalculatorSchema, Theme } from '../schema/types';
import { DEFAULT_THEME } from '../schema/types';

interface CalculatorRow {
  id: string;
  workspace_id: string;
  slug: string | null;
  title: string;
  status: 'draft' | 'published';
  theme: Theme;
  schema: CalculatorSchema;
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
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
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

const SEVEN_DAYS_AGO = () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

async function countSince(table: 'builder_views' | 'builder_submissions', calculatorId: string): Promise<number> {
  const { count } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('calculator_id', calculatorId)
    .gte('created_at', SEVEN_DAYS_AGO());
  return count ?? 0;
}

export async function listCalculators(workspaceId: string): Promise<CalculatorListItem[]> {
  const { data, error } = await supabase
    .from('builder_calculators')
    .select('id, title, status, slug')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });
  if (error) throw error;

  return Promise.all(
    (data ?? []).map(async (c) => ({
      ...c,
      viewsSeven: await countSince('builder_views', c.id),
      submissionsSeven: await countSince('builder_submissions', c.id),
    })),
  );
}

export async function createCalculator(
  workspaceId: string,
  title: string,
  schema: CalculatorSchema,
): Promise<string> {
  const { data, error } = await supabase
    .from('builder_calculators')
    .insert({ workspace_id: workspaceId, title, schema, theme: DEFAULT_THEME })
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
  patch: { title?: string; theme?: Theme; schema?: CalculatorSchema },
): Promise<void> {
  const { error } = await supabase.from('builder_calculators').update(patch).eq('id', id);
  if (error) throw error;
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
