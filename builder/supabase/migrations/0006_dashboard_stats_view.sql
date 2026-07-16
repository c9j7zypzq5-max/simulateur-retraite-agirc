-- Dashboard : remplace le N+1 (2 requêtes de comptage par calculateur) par
-- une vue agrégée lue en une seule requête. security_invoker = true : la vue
-- s'exécute avec les droits de l'appelant, donc la RLS des tables sous-jacentes
-- (builder_calculators/views/submissions) s'applique normalement — un
-- utilisateur ne voit jamais les stats d'un autre.

create or replace view public.builder_calculator_stats
with (security_invoker = true) as
select
  c.id,
  c.workspace_id,
  c.title,
  c.status,
  c.slug,
  coalesce(v.views_7d, 0) as views_7d,
  coalesce(s.submissions_7d, 0) as submissions_7d,
  c.created_at
from public.builder_calculators c
left join (
  select calculator_id, count(*) as views_7d
  from public.builder_views
  where created_at >= now() - interval '7 days'
  group by calculator_id
) v on v.calculator_id = c.id
left join (
  select calculator_id, count(*) as submissions_7d
  from public.builder_submissions
  where created_at >= now() - interval '7 days'
  group by calculator_id
) s on s.calculator_id = c.id;

-- La vue ne sert que le dashboard (authentifié). Sans ce revoke, un visiteur
-- anonyme pourrait la lire pour les calculateurs publiés (via la policy de
-- lecture publique de builder_calculators) et y récupérer leur workspace_id —
-- surface inutile. Les compteurs restent à 0 pour anon (pas de SELECT sur
-- builder_views/submissions), mais on ferme quand même l'accès.
revoke select on public.builder_calculator_stats from anon;
