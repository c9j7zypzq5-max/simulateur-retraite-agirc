-- Conformité spec (queue post-audit) :
-- 1) Webhook sortant par soumission (Premium) — une simple URL POST, appelée
--    en asynchrone via pg_net à chaque nouvelle soumission.
-- 2) Suppression de compte en libre-service (RGPD) — purge réelle : supprimer
--    auth.users cascade vers identities/sessions ET builder_workspaces →
--    calculators → submissions/views/subscriptions (FK on delete cascade).

create extension if not exists pg_net;

alter table public.builder_calculators
  add column if not exists webhook_url text
    check (webhook_url is null or (webhook_url like 'https://%' and char_length(webhook_url) <= 2048));

-- Clamp par plan : le webhook sortant est Premium uniquement (même mécanique
-- que hide_badge/capture_email — la valeur est reclampée à chaque écriture,
-- quel que soit ce que le client envoie).
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
  if plan <> 'premium' then
    new.webhook_url := null;
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

-- POST asynchrone du payload de chaque soumission vers l'URL du calculateur.
-- pg_net est fire-and-forget : un endpoint client lent ou en panne n'affecte
-- jamais l'INSERT de la soumission.
create or replace function public.builder_notify_webhook()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target text;
begin
  select webhook_url into target from public.builder_calculators where id = new.calculator_id;
  if target is not null then
    perform net.http_post(
      url := target,
      body := jsonb_build_object(
        'calculator_id', new.calculator_id,
        'submission_id', new.id,
        'payload', new.payload,
        'email', new.email,
        'source', new.source,
        'created_at', new.created_at
      ),
      headers := '{"Content-Type": "application/json", "User-Agent": "Simfinly-Builder-Webhook/1"}'::jsonb
    );
  end if;
  return new;
end;
$$;

drop trigger if exists builder_submissions_webhook on public.builder_submissions;
create trigger builder_submissions_webhook after insert on public.builder_submissions
  for each row execute function public.builder_notify_webhook();

-- Suppression de compte en libre-service. SECURITY DEFINER : auth.users n'est
-- pas accessible aux clients ; auth.uid() garantit qu'on ne supprime que soi.
-- ⚠️ Auth partagée avec simfinly.com : supprime LE compte Simfinly entier
-- (profil du site, simulations, workspace builder) — c'est le sens d'une
-- purge RGPD, et l'UI l'annonce explicitement.
create or replace function public.builder_delete_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Non authentifié';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

-- RPC réservée aux connectés (les privilèges par défaut Supabase donnent
-- EXECUTE à anon/authenticated indépendamment de PUBLIC — cf. 0003).
revoke execute on function public.builder_delete_account() from public, anon;
grant execute on function public.builder_delete_account() to authenticated;
