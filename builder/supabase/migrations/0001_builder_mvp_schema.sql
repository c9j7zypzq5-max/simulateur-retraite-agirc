-- Simfinly Builder — schéma MVP (Lot 2). Coexiste avec les tables du site
-- (profiles, simulations, public_links) dans le même projet EU (eu-west-3).
-- Préfixe builder_ pour marquer la frontière produit ; auth partagée
-- (auth.users), données isolées par RLS.

-- 1 workspace par utilisateur au MVP (owner unique), prévu multi plus tard.
create table if not exists public.builder_workspaces (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Mon espace',
  created_at timestamptz not null default now(),
  unique (owner)
);

create table if not exists public.builder_calculators (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.builder_workspaces(id) on delete cascade,
  slug text unique,
  title text not null default 'Calculateur sans titre',
  status text not null default 'draft' check (status in ('draft','published')),
  theme jsonb not null default '{}'::jsonb,
  schema jsonb not null default '{}'::jsonb,
  -- Verrous de plan figés à la publication (badge retirable, capture email…).
  plan_features_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists builder_calculators_workspace_idx on public.builder_calculators(workspace_id);

create table if not exists public.builder_submissions (
  id uuid primary key default gen_random_uuid(),
  calculator_id uuid not null references public.builder_calculators(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  email text,
  source text not null default 'hosted' check (source in ('hosted','embed')),
  referrer text,
  created_at timestamptz not null default now()
);
create index if not exists builder_submissions_calculator_idx on public.builder_submissions(calculator_id);

-- 1 abonnement par workspace. Écrit uniquement par le webhook Stripe
-- (service role) — jamais par le client (Lot 3).
create table if not exists public.builder_subscriptions (
  workspace_id uuid primary key references public.builder_workspaces(id) on delete cascade,
  stripe_customer_id text,
  plan text not null default 'free' check (plan in ('free','pro','premium')),
  status text not null default 'active',
  updated_at timestamptz not null default now()
);

-- updated_at automatique. search_path figé (durcissement linter Supabase).
create or replace function public.builder_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists builder_calculators_touch on public.builder_calculators;
create trigger builder_calculators_touch before update on public.builder_calculators
  for each row execute function public.builder_touch_updated_at();

-- RLS ------------------------------------------------------------------
alter table public.builder_workspaces   enable row level security;
alter table public.builder_calculators  enable row level security;
alter table public.builder_submissions  enable row level security;
alter table public.builder_subscriptions enable row level security;

-- Workspaces : l'utilisateur ne voit et ne gère que le sien.
create policy builder_ws_select on public.builder_workspaces
  for select using (owner = (select auth.uid()));
create policy builder_ws_insert on public.builder_workspaces
  for insert with check (owner = (select auth.uid()));
create policy builder_ws_update on public.builder_workspaces
  for update using (owner = (select auth.uid()));

-- Calculateurs : CRUD réservé au propriétaire du workspace.
create policy builder_calc_owner_all on public.builder_calculators
  for all using (
    workspace_id in (select id from public.builder_workspaces where owner = (select auth.uid()))
  ) with check (
    workspace_id in (select id from public.builder_workspaces where owner = (select auth.uid()))
  );

-- Calculateurs publiés : lisibles par tous (page publique légère, clé anon).
create policy builder_calc_public_read on public.builder_calculators
  for select to anon using (status = 'published');

-- Soumissions : insérables par un visiteur (hosted/embed) uniquement si le
-- calculateur ciblé est publié ; lisibles seulement par le propriétaire.
create policy builder_sub_public_insert on public.builder_submissions
  for insert to anon, authenticated with check (
    calculator_id in (select id from public.builder_calculators where status = 'published')
  );
create policy builder_sub_owner_read on public.builder_submissions
  for select to authenticated using (
    calculator_id in (
      select c.id from public.builder_calculators c
      join public.builder_workspaces w on w.id = c.workspace_id
      where w.owner = (select auth.uid())
    )
  );

-- Abonnements : lisibles par le propriétaire ; aucune écriture client
-- (le service role du webhook Stripe contourne la RLS).
create policy builder_subs_owner_read on public.builder_subscriptions
  for select to authenticated using (
    workspace_id in (select id from public.builder_workspaces where owner = (select auth.uid()))
  );
