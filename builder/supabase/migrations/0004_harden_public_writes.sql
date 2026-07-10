-- Durcissement de la seule surface d'écriture anonyme (audit post-Lot 3) :
-- builder_submissions accepte des INSERT anon sur calculateur publié — sans
-- borne, un bot pouvait y stocker des payloads de plusieurs Mo (pollution des
-- exports CSV clients, gonflement de la base).

alter table public.builder_submissions
  add constraint builder_submissions_payload_size
    check (pg_column_size(payload) < 8192),
  add constraint builder_submissions_email_shape
    check (email is null or (char_length(email) <= 254 and position('@' in email) > 1)),
  add constraint builder_submissions_referrer_len
    check (referrer is null or char_length(referrer) <= 2048);

-- Colonne créée au Lot 2 et jamais utilisée : les verrous de plan sont
-- finalement dynamiques (triggers relisant builder_subscriptions à chaque
-- écriture), ce qui est plus sûr qu'un instantané figé à la publication —
-- un downgrade fait revenir le badge tout seul. On la retire pour ne pas
-- laisser croire qu'elle porte quelque chose.
alter table public.builder_calculators drop column if exists plan_features_snapshot;
