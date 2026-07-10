-- Lot 3 — verrous de plan appliqués côté serveur (jamais uniquement côté
-- client). Le plan effectif d'un workspace vient toujours de
-- builder_subscriptions.plan (écrit par le webhook Stripe, service role) ;
-- ces triggers le relisent à chaque écriture et corrigent silencieusement
-- toute valeur que le client aurait tenté de s'attribuer.

alter table public.builder_calculators
  add column if not exists hide_badge boolean not null default false,
  add column if not exists capture_email boolean not null default false,
  add column if not exists over_free_quota boolean not null default false;

-- Plan effectif d'un workspace, 'free' par défaut si aucun abonnement.
create or replace function public.builder_workspace_plan(p_workspace_id uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select plan from public.builder_subscriptions where workspace_id = p_workspace_id),
    'free'
  );
$$;

-- N'est appelée qu'en interne par les triggers ci-dessous (qui s'exécutent
-- avec les privilèges du propriétaire de la fonction, indépendamment de ces
-- revoke). Sans eux, PostgREST expose aussi cette fonction en RPC directe
-- (/rest/v1/rpc/builder_workspace_plan?p_workspace_id=...), ce qui permettrait
-- à n'importe quel visiteur anonyme de connaître le plan d'un workspace en
-- devinant son UUID. Supabase accorde EXECUTE à anon/authenticated par un
-- privilège par défaut INDÉPENDANT de PUBLIC sur les nouvelles fonctions du
-- schéma public : il faut donc révoquer explicitement les deux (vérifié en
-- pratique — revoke ... from public seul ne suffit pas).
revoke execute on function public.builder_workspace_plan(uuid) from public, anon, authenticated;

-- Verrous à l'écriture d'un calculateur :
--  - badge retirable / capture email : clampés à false si le plan est free,
--    quelle que soit la valeur envoyée par le client.
--  - quota de calculateurs PUBLIÉS : 1 (free), 10 (pro), illimité (premium).
create or replace function public.builder_enforce_plan_limits()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  plan text;
  published_count int;
  max_published int;
begin
  plan := public.builder_workspace_plan(new.workspace_id);

  if plan = 'free' then
    new.hide_badge := false;
    new.capture_email := false;
  end if;

  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then
    select count(*) into published_count
      from public.builder_calculators
      where workspace_id = new.workspace_id and status = 'published' and id <> new.id;

    max_published := case plan when 'free' then 1 when 'pro' then 10 else null end;
    if max_published is not null and published_count >= max_published then
      raise exception 'Quota de calculateurs publiés atteint pour le plan %', plan
        using errcode = 'P0001';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists builder_calculators_plan_limits on public.builder_calculators;
create trigger builder_calculators_plan_limits before insert or update on public.builder_calculators
  for each row execute function public.builder_enforce_plan_limits();

-- Bandeau "au-delà de 200 vues" en gratuit — jamais de coupure, juste un
-- indicateur relu par la page publique (déjà exposée via builder_calc_public_read,
-- aucune nouvelle policy nécessaire). Fenêtre glissante de 30 jours : pas besoin
-- d'un job de remise à zéro mensuelle (même logique que les compteurs 7 j du
-- dashboard).
create or replace function public.builder_touch_view_quota()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  ws_id uuid;
  plan text;
  recent_views int;
begin
  select workspace_id into ws_id from public.builder_calculators where id = new.calculator_id;
  plan := public.builder_workspace_plan(ws_id);
  select count(*) into recent_views
    from public.builder_views
    where calculator_id = new.calculator_id
      and created_at >= now() - interval '30 days';
  -- Toujours recalculé (pas seulement en free) : s'auto-corrige dès la vue
  -- suivante après un upgrade, pas de flag qui reste bloqué à true.
  update public.builder_calculators
    set over_free_quota = (plan = 'free' and recent_views > 200)
    where id = new.calculator_id;
  return new;
end;
$$;

drop trigger if exists builder_views_quota on public.builder_views;
create trigger builder_views_quota after insert on public.builder_views
  for each row execute function public.builder_touch_view_quota();
