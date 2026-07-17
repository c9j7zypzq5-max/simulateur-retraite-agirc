-- Notification email à chaque soumission (lead) — la feature de rétention
-- n° 1 : une TPE ne branche pas de webhook, le lead doit arriver dans sa
-- boîte mail. Même mécanique fire-and-forget que le webhook sortant (0005) :
-- un trigger pg_net POSTe l'id de la soumission vers /api/notify (projet
-- Vercel du builder), qui relit les données avec la service role, envoie
-- l'email (Resend) et marque la soumission comme notifiée.
--
-- Sécurité : le POST ne transporte que l'UUID (pas de PII en clair vers un
-- endpoint « nu ») ; /api/notify ne fait confiance à rien d'autre que ce que
-- la base lui renvoie, et l'horodatage notified_at (écrit en service role,
-- jamais exposé en RLS à l'écriture) rend l'appel idempotent — rejouer le
-- même id n'envoie pas deux emails.

alter table public.builder_calculators
  add column if not exists notify_email boolean not null default true;

alter table public.builder_submissions
  add column if not exists notified_at timestamptz;

create or replace function public.builder_notify_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  enabled boolean;
begin
  select notify_email into enabled
    from public.builder_calculators where id = new.calculator_id;
  if coalesce(enabled, false) then
    perform net.http_post(
      url := 'https://app.simfinly.com/api/notify',
      body := jsonb_build_object('submission_id', new.id),
      headers := '{"Content-Type": "application/json", "User-Agent": "Simfinly-Builder-Notify/1"}'::jsonb
    );
  end if;
  return new;
end;
$$;

drop trigger if exists builder_submissions_email on public.builder_submissions;
create trigger builder_submissions_email after insert on public.builder_submissions
  for each row execute function public.builder_notify_email();
