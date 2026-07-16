-- Analytics par calculateur (écran /stats/:id) : deux vues agrégées lues en
-- une requête chacune. Comme builder_calculator_stats, elles sont
-- security_invoker = true → la RLS des tables sous-jacentes
-- (builder_views / builder_submissions, lecture réservée au propriétaire)
-- s'applique ; un utilisateur ne voit jamais les stats d'un autre. On révoque
-- quand même l'accès anon (défense en profondeur : la lecture publique des
-- calculateurs publiés ne doit pas fuiter d'agrégats via ces vues).

-- 1. Série quotidienne des vues et soumissions sur 30 jours. Les jours sans
--    activité sont absents (l'écran comble les trous côté client).
create or replace view public.builder_calculator_daily
with (security_invoker = true) as
select
  calculator_id,
  day,
  sum(views) as views,
  sum(submissions) as submissions
from (
  select calculator_id, (created_at at time zone 'UTC')::date as day, 1 as views, 0 as submissions
    from public.builder_views
    where created_at >= now() - interval '30 days'
  union all
  select calculator_id, (created_at at time zone 'UTC')::date as day, 0 as views, 1 as submissions
    from public.builder_submissions
    where created_at >= now() - interval '30 days'
) t
group by calculator_id, day;

revoke select on public.builder_calculator_daily from anon;

-- 2. Top référents (30 j) : on réduit l'URL de provenance à son hôte (sans
--    www) pour regrouper ; provenance vide/directe → « (direct) ».
create or replace view public.builder_referrer_stats
with (security_invoker = true) as
select
  calculator_id,
  coalesce(
    nullif(regexp_replace(referrer, '^https?://(www\.)?([^/?#]+).*$', '\2'), ''),
    '(direct)'
  ) as source,
  count(*) as views
from public.builder_views
where created_at >= now() - interval '30 days'
group by calculator_id, 2;

revoke select on public.builder_referrer_stats from anon;
