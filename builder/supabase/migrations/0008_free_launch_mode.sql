-- Mode « lancement gratuit » : le produit ne sera pas monétisé tant qu'il n'a
-- pas d'usage réel. On relâche les verrous de plan SANS démonter la mécanique
-- (triggers en place, il suffira de resserrer les valeurs pour réactiver les
-- plans payants) :
--   - free : 10 calculateurs publiés (au lieu de 1) — généreux mais borné
--     (anti-abus) ;
--   - capture d'email et webhook débloqués pour tous ;
--   - bandeau de dépassement : seuil relevé à 10 000 vues/30 j (mécanique
--     intacte, effectivement neutralisé) ;
--   - LE BADGE RESTE OBLIGATOIRE en free : c'est le moteur de croissance.
-- On ajoute aussi builder_views.referrer (analytics : top référents).

alter table public.builder_views
  add column if not exists referrer text
    check (referrer is null or char_length(referrer) <= 2048);

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

  -- Lancement gratuit : seul le badge reste verrouillé hors plans payants.
  if plan = 'free' then
    new.hide_badge := false;
  end if;

  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then
    select count(*) into published_count
      from public.builder_calculators
      where workspace_id = new.workspace_id and status = 'published' and id <> new.id;

    max_published := case plan when 'free' then 10 when 'pro' then 10 else null end;
    if max_published is not null and published_count >= max_published then
      raise exception 'Quota de calculateurs publiés atteint pour le plan %', plan
        using errcode = 'P0001';
    end if;
  end if;

  return new;
end;
$$;

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
  update public.builder_calculators
    set over_free_quota = (plan = 'free' and recent_views > 10000)
    where id = new.calculator_id;
  return new;
end;
$$;
