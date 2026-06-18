-- =============================================================================
-- Simfinly — schéma base de données + sécurité (Row-Level Security)
-- À exécuter dans Supabase → SQL Editor → New query → Run.
--
-- Principe de sécurité : RLS activé sur TOUTES les tables. Chaque utilisateur
-- ne peut lire/écrire QUE ses propres lignes. Le statut d'abonnement n'est
-- jamais modifiable par le client : seul le webhook Stripe (clé service_role,
-- qui contourne RLS) l'écrit. La clé "anon" exposée au navigateur ne permet
-- donc jamais de se promouvoir Pro ni de voir les données d'autrui.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) Profils : 1 ligne par utilisateur, créée automatiquement à l'inscription.
--    Contient le lien vers Stripe et le statut d'abonnement (écrit par webhook).
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text,
  stripe_customer_id  text unique,
  subscription_status text not null default 'free',  -- 'free' | 'active' | 'cancelled'
  current_period_end  timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- L'utilisateur peut LIRE son propre profil (pour savoir s'il est Pro).
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- L'utilisateur peut mettre à jour son profil MAIS PAS les champs d'abonnement.
-- (On verrouille via un trigger ci-dessous qui empêche toute modification
--  des colonnes sensibles côté client ; voir protect_subscription_fields.)
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Empêche le client de modifier les champs d'abonnement.
-- Le webhook utilise la clé service_role, qui n'exécute PAS ce contrôle
-- (session_user = postgres/service_role et non 'authenticated').
create or replace function public.protect_subscription_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if current_setting('request.jwt.claim.role', true) = 'authenticated' then
    if new.stripe_customer_id is distinct from old.stripe_customer_id
       or new.subscription_status is distinct from old.subscription_status
       or new.current_period_end is distinct from old.current_period_end then
      raise exception 'Champs d''abonnement non modifiables par le client';
    end if;
  end if;
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_protect_subscription_fields on public.profiles;
create trigger trg_protect_subscription_fields
  before update on public.profiles
  for each row execute function public.protect_subscription_fields();

-- -----------------------------------------------------------------------------
-- 2) Création automatique du profil à l'inscription d'un utilisateur.
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 3) Simulations sauvegardées : remplace le localStorage. RLS stricte par
--    propriétaire (CRUD complet uniquement sur ses propres lignes).
-- -----------------------------------------------------------------------------
create table if not exists public.simulations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  simulator   text not null,
  label       text,
  share_url   text not null,
  created_at  timestamptz not null default now()
);

create index if not exists simulations_user_idx on public.simulations(user_id, created_at desc);
-- Évite les doublons d'une même simulation pour un utilisateur.
create unique index if not exists simulations_user_share_uniq
  on public.simulations(user_id, share_url);

alter table public.simulations enable row level security;

drop policy if exists "simulations_select_own" on public.simulations;
create policy "simulations_select_own"
  on public.simulations for select
  using (auth.uid() = user_id);

drop policy if exists "simulations_insert_own" on public.simulations;
create policy "simulations_insert_own"
  on public.simulations for insert
  with check (auth.uid() = user_id);

drop policy if exists "simulations_update_own" on public.simulations;
create policy "simulations_update_own"
  on public.simulations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "simulations_delete_own" on public.simulations;
create policy "simulations_delete_own"
  on public.simulations for delete
  using (auth.uid() = user_id);
