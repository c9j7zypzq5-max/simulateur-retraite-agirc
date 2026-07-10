-- Compteur de vues pour le dashboard ("vues 7 j"). Même modèle RLS que
-- builder_submissions : insertion anonyme si le calculateur est publié,
-- lecture réservée au propriétaire. Table append-only, pas de payload —
-- juste un timestamp par vue de la page publique.

create table if not exists public.builder_views (
  id uuid primary key default gen_random_uuid(),
  calculator_id uuid not null references public.builder_calculators(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists builder_views_calculator_idx on public.builder_views(calculator_id, created_at);

alter table public.builder_views enable row level security;

create policy builder_views_public_insert on public.builder_views
  for insert to anon, authenticated with check (
    calculator_id in (select id from public.builder_calculators where status = 'published')
  );

create policy builder_views_owner_read on public.builder_views
  for select to authenticated using (
    calculator_id in (
      select c.id from public.builder_calculators c
      join public.builder_workspaces w on w.id = c.workspace_id
      where w.owner = (select auth.uid())
    )
  );
