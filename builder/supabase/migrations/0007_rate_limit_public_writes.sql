-- Rate limiting des écritures publiques (anti-spam bot), entièrement côté
-- serveur : un bot pouvait spammer builder_views (et pousser artificiellement
-- un client free au-dessus du quota de vues) ou noyer builder_submissions.
-- Fenêtre fixe d'une minute par IP (lue depuis les en-têtes PostgREST) :
--   - vues : 60/min/IP ; soumissions : 5/min/IP.
-- Les écritures hors PostgREST (SQL direct, service role) ne portent pas
-- d'en-têtes de requête et sont exemptées — le garde ne vise que la surface
-- HTTP publique.

create table if not exists public.builder_rate_limits (
  bucket text primary key, -- "<type>:<ip>"
  window_start timestamptz not null default now(),
  hits int not null default 1
);
-- RLS sans policy : la table n'est accessible qu'aux fonctions SECURITY
-- DEFINER ci-dessous, jamais aux clients.
alter table public.builder_rate_limits enable row level security;

create or replace function public.builder_rate_limit(kind text, max_hits int)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  headers text;
  ip text;
  b text;
  n int;
begin
  headers := current_setting('request.headers', true);
  if headers is null then
    return; -- pas de contexte HTTP (SQL direct / service role) : exempté
  end if;
  ip := split_part(coalesce(headers::json->>'x-forwarded-for', 'inconnu'), ',', 1);
  b := kind || ':' || ip;

  insert into public.builder_rate_limits as r (bucket, window_start, hits)
  values (b, now(), 1)
  on conflict (bucket) do update
    set hits = case when r.window_start < now() - interval '1 minute' then 1 else r.hits + 1 end,
        window_start = case when r.window_start < now() - interval '1 minute' then now() else r.window_start end
  returning hits into n;

  if n > max_hits then
    raise exception 'Trop de requêtes — réessayez dans une minute' using errcode = 'P0004';
  end if;

  -- Ménage opportuniste : purge des fenêtres mortes (~2 % des insertions),
  -- la table reste minuscule sans job pg_cron.
  if random() < 0.02 then
    delete from public.builder_rate_limits where window_start < now() - interval '10 minutes';
  end if;
end;
$$;

create or replace function public.builder_views_rate_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.builder_rate_limit('v', 60);
  return new;
end;
$$;

create or replace function public.builder_submissions_rate_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.builder_rate_limit('s', 5);
  return new;
end;
$$;

drop trigger if exists builder_views_rate on public.builder_views;
create trigger builder_views_rate before insert on public.builder_views
  for each row execute function public.builder_views_rate_guard();

drop trigger if exists builder_submissions_rate on public.builder_submissions;
create trigger builder_submissions_rate before insert on public.builder_submissions
  for each row execute function public.builder_submissions_rate_guard();
