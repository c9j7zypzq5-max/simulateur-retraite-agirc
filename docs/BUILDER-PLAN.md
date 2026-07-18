# Simfinly Builder — Plan MVP

Constructeur no-code de simulateurs embarquables pour TPE/PME francophones
(courtiers, CGP, agences, artisans), adossé à simfinly.com. Ce document est le
plan de référence validé avant implémentation ; le périmètre décrit est un
**plafond**, pas un plancher (YAGNI strict).

## Architecture retenue

### Sous-application `builder/` dans ce repo

Le builder vit dans `builder/` avec son propre `package.json`, sa config Vite
et TypeScript. Raisons :

- Le site principal est plafonné à 13 fonctions serverless Vercel ; le builder
  sera un **projet Vercel séparé** (Root Directory = `builder/`) portant
  `app.simfinly.com` — zéro impact sur le site existant.
- Budget JS de la page publique (< 100 ko) isolé du bundle du site principal.
- Stack imposée (React 18 + TS) différente du site (React 19 + JS) : pas de
  conflit de dépendances grâce au package.json séparé.

### Un seul sous-domaine, deux entrées Vite (décision révisée)

Un seul DNS à poser (`app.simfinly.com`), routage par chemin plutôt que par
sous-domaine — même isolation de bundle et de SEO, sans complexité DNS
supplémentaire :

- `index.html` → SPA du builder (`app.simfinly.com/`) : auth, dashboard,
  éditeur, soumissions, landing. `noindex`.
- `s.html` → runtime public léger (`app.simfinly.com/s/{slug}`) : rendu du
  calculateur seul, indexé. L'embed est une iframe pointant vers
  `app.simfinly.com/s/{slug}?embed=1` injectée par un script une-ligne
  (`embed.js`, servi statiquement). Routage par chemin dans
  `builder/vercel.json` (`rewrites` : `/s/*` → `s.html`, reste → `index.html`).
- `s.simfinly.com` reste une option future si l'isolation par sous-domaine
  devient nécessaire (aucun changement de code, juste un domaine Vercel de plus).

### Réutilisation du repo existant

- Conventions reprises : styles inline + variables CSS (`--bg`, `--text`,
  `--primary`…), i18n à clés pointées (`src/i18n/fr.js` → `builder/src/i18n/fr.ts`),
  graphiques SVG maison (modèle : `src/components/charts/BarChart.jsx`).
- Templates Lot 4 convertis depuis : `src/utils/amortization.js` (mensualités),
  `src/pages/simulateurs/FraisNotaire.jsx` (barème émoluments par tranches),
  `src/pages/simulateurs/FreelanceVsSalarie.jsx` ou `Salaire.jsx` (TJM).
- Vitest + Playwright déjà en place au niveau racine ; le builder a ses
  propres scripts `test` (vitest) et l'e2e du parcours complet s'ajoute en Lot 3/4.

## Le schéma de calculateur (cœur du produit)

```ts
type CalculatorSchema = {
  fields: Field[];            // ordonné ; number | slider | select | radio | toggle
  variables: { name: string; formula: string }[];   // expressions type tableur
  results: { label: string; formula: string;        // 1 à 4
             format: 'eur' | 'pct' | 'number'; size: 'lg' | 'md' }[];
  chart?: { type: 'bars' | 'donut';
            items: { label: string; formula: string }[] };
  baremes: Record<string, { jusqua: number | null; taux: number }[]>;
}
```

- Évaluation : **expr-eval-fork** (fork patché d'expr-eval — l'original a deux
  advisories high sans correctif : pollution de prototype, injection ; le fork
  les corrige, API identique, sandboxé — pas de parseur maison). Assignations
  désactivées dans les formules. Enrichi de `IF/AND/OR/MIN/MAX/ROUND` et
  `BAREME(table, valeur)` (calcul progressif par tranches — la brique des
  barèmes fiscaux français).
- **Un seul composant de rendu** `CalculatorRenderer` consommé par les trois
  surfaces (aperçu éditeur, page hébergée, iframe). Toute duplication interdite.
- Thème JSON : couleurs, logo, police → variables CSS injectées.
- **Page publique (`s.html`) : client REST nu (`lib/publicClient.ts`), pas le
  SDK `@supabase/supabase-js`.** Le SDK embarque auth + realtime + storage
  (inutiles pour 2 requêtes) et faisait passer le bundle public à 110 ko gzip,
  au-dessus du budget. Avec fetch nu vers PostgREST : ~59 ko gzip. L'app
  authentifiée (`lib/db.ts` + `lib/supabase.ts`) garde le SDK complet, sans
  contrainte de poids.

## Découpage en lots (chaque lot = déployable et démontrable)

### Lot 1 — Moteur + rendu + éditeur, 100 % local (ce lot)
- Scaffold `builder/` (Vite, React 18, TS, vitest).
- Types du schéma + évaluateur + `BAREME` + **tests unitaires** (division par
  zéro, tranches vides, valeurs négatives, dépendances entre variables).
- `CalculatorRenderer` : 5 types de champs, résultats formatés fr-FR,
  graphique SVG barres/donut, badge « Créé avec Simfinly ».
- Éditeur deux colonnes : gauche = champs/variables/résultats/onglet Thème,
  réordonnancement par flèches ; droite = aperçu live. Autosave localStorage.
- Démo : `cd builder && npm run dev`.

### Lot 2 — Auth + persistance + publication + page publique + embed
- Supabase (projet EU à créer, clés à fournir) : tables `workspaces`,
  `calculators`, `submissions`, `subscriptions` + RLS (un workspace par user).
- Auth email/mot de passe + magic link. Dashboard (liste, vues 7 j, soumissions 7 j).
- Publier → slug + snippets (lien public, script embed). Page publique `s.html`
  (méta OG, badge, < 100 ko JS) + `embed.js`.

### Lot 3 — Stripe + verrous + soumissions
- Checkout + Customer Portal (Pro 29 €, Premium 59 €), webhook en edge function.
- Verrous **côté serveur** (RLS/edge) : quotas calculateurs, badge retirable,
  capture email (consentement RGPD), 200 vues/mois gratuit → bandeau upgrade.
- Écran Soumissions : tableau filtrable + export CSV. Webhook sortant (Premium).

### Lot 4 — Landing + 3 templates importés
- Landing app.simfinly.com (3 démos interactives, pricing, CTA).
- Conversion en schémas JSON : mensualités de prêt, frais de notaire, TJM.
- Badge sur les simulateurs gratuits de simfinly.com → page de vente.
- Test e2e créer→publier→soumettre.

À la fin de chaque lot : revue critique (policies, duplication,
sur-ingénierie) + liste des dettes assumées dans ce fichier.

## Décisions et dettes assumées

| Décision | Justification |
|---|---|
| `BAREME` = calcul progressif (marginal) uniquement | C'est le besoin des barèmes fiscaux FR ; variante « lookup » ajoutée seulement si un template Lot 4 l'exige |
| Pas de routeur tiers dans le builder au Lot 1 | Un seul écran (éditeur) ; react-router n'arrive qu'avec le dashboard (Lot 2) |
| Graphique SVG maison (~100 lignes) | Aucune lib de chart dans le repo ; budget 100 ko de la page publique |
| en.ts préparé non traduit (miroir de fr.ts) | Exigence i18n : structure prête dès le départ, traduction hors MVP |
| `workspaces` créé dès le Lot 2 avec 1 workspace/user | Prévu pour multi plus tard sans le coder |

### Dettes assumées — Lot 1 (revue du 2026-07-08)
- `key={index}` sur les listes de l'éditeur : le focus clavier peut sauter lors
  d'un réordonnancement. Acceptable au MVP (réordonner est rare).
- Options des listes/radios éditées en textarea « libellé = valeur » appliquée
  au blur (champ non contrôlé) : simple et suffisant.
- Pas de validation d'unicité des identifiants de champs ni des noms de
  variables : une collision écrase la valeur dans le scope sans avertir.
  À traiter au Lot 2 (au moment de publier).
- `color-mix()` CSS utilisé dans le rendu : baseline navigateurs 2023, OK pour
  la cible pro ; à revalider quand la page publique visera un reach maximal.
- URL de logo non validée (le rendu est chez l'auteur au Lot 1) : ajouter une
  contrainte https:// au Lot 2 quand le rendu devient public.

### Dettes assumées — Lot 2 (revue du 2026-07-10)
- Pas de validation d'unicité des identifiants de champs/variables toujours
  pas traitée (reportée : n'est pas un problème de sécurité, juste d'UX).
- URL de logo toujours non contrainte à https:// — la page publique est
  maintenant live ; à corriger avant Lot 3 si un client saisit une URL http.
- Pas de suppression de calculateur dans le dashboard (hors périmètre des 6
  écrans listés dans le prompt produit). Contournement : republier avec un
  autre titre. À ajouter seulement si demandé.
- OG meta génériques (pas de titre/description dynamiques par calculateur
  dans le HTML initial) : nécessiterait du SSR/prerendering, explicitement
  hors périmètre MVP.
- Environnement de vérification : ce bac à sable route les requêtes HTTPS via
  un proxy (`HTTPS_PROXY`) que Chromium ne respecte pas nativement ; une fois
  configuré, les appels `@supabase/supabase-js` depuis Chromium subissent un
  `ERR_CONNECTION_RESET` après ~13 s (curl direct sur le même proxy fonctionne
  en < 1 s). Le parcours complet a donc été vérifié en deux temps : logique
  RLS/données via des appels REST directs (les 12 requêtes exactes émises par
  `lib/db.ts`/`lib/publicClient.ts`, y compris les policies négatives), et
  logique UI/React via Playwright pour tout ce qui ne dépend pas d'un aller-
  retour réseau vers Supabase. Aucun signal que ceci affecterait Vercel/les
  navigateurs réels — artefact de ce bac à sable, pas du code.
- Rewrite `/s/(.*)` → `s.html` : seulement en prod (`vercel.json`). En dev
  local, visiter `/s/{slug}` retombe sur l'app (pas de fallback Vite pour un
  second point d'entrée HTML). Pour tester en local : ouvrir `/s.html`
  directement ou simuler le chemin via `history.replaceState`.

### Post-audit (2026-07-11) — dettes soldées
- ✅ Payload de soumission borné (8 Ko) + email/referrer contraints (migration 0004).
- ✅ `plan_features_snapshot` supprimée (verrous dynamiques assumés).
- ✅ Badge redirigé vers la landing du builder (URL relative, même origine).
- ✅ Landing publique sur `/` (visiteurs) : démos interactives des 3 templates,
  pricing, CTA — indexable. Dashboard inchangé pour les connectés.
- ✅ 3 templates convertis (prêt, frais de notaire, TJM micro-BNC) avec tests
  de fidélité au centime contre les règles source du site principal.
- ✅ Webhook sortant Premium : colonne `webhook_url` (https, clampée à null
  hors premium par le trigger de plan), POST asynchrone pg_net à chaque
  soumission (migration 0005). Vérifié en réel : HTTP 200 reçu d'un endpoint
  externe.
- ✅ Suppression de compte en libre-service (RGPD) : RPC `builder_delete_account`
  (SECURITY DEFINER, `auth.uid()` uniquement, anon révoqué), bouton dans le
  Dashboard avec confirmation explicite (auth partagée : le compte Simfinly
  entier est purgé). Vérifié en réel : cascade complète, 0 ligne résiduelle.
- ✅ Test e2e créer→publier→soumettre versionné (`builder/e2e/parcours.spec.ts`
  + `playwright.config.ts`). Nécessite `E2E_EMAIL`/`E2E_PASSWORD` (compte de
  test confirmé) ; se skippe proprement sans.
- ✅ Fail-soft `lib/supabase.ts` : env manquante ne fait plus crasher l'app à
  l'import (la landing se rend, seuls les appels réseau échouent).
- Restent ouverts : rate limiting des écritures publiques (bot spam), police
  custom Premium (theme.font sans UI), case HaveIBeenPwned (dashboard
  Supabase, action utilisateur), thème sombre du builder.

### Dettes assumées — Lot 3 (revue du 2026-07-10)
- **Fuite trouvée et corrigée en vérification** : la fonction SQL
  `builder_workspace_plan(uuid)` était appelable en RPC directe par un
  visiteur anonyme (`/rest/v1/rpc/builder_workspace_plan?p_workspace_id=...`),
  révélant le plan de n'importe quel workspace en devinant son UUID. `revoke
  ... from public` seul ne suffisait pas : Supabase accorde `EXECUTE` à
  `anon`/`authenticated` par un privilège par défaut indépendant de `PUBLIC`
  sur les nouvelles fonctions du schéma public. Corrigé en révoquant
  explicitement `anon, authenticated` — vérifié après coup (RPC → 401).
- Pas de rate limiting sur `api/stripe.js` (le site principal utilise Upstash
  Redis, non provisionné pour le builder). Trafic attendu faible au MVP ;
  à ajouter si abusé.
- `over_free_quota` : fenêtre glissante de 30 jours plutôt qu'un vrai
  calendrier mensuel, pour éviter un job de remise à zéro (pg_cron). Cohérent
  avec les compteurs « 7 j » déjà utilisés ailleurs dans le produit.
- Quota de calculateurs publiés compté par plan (free=1, pro=10,
  premium=illimité) — les brouillons ne comptent pas, seul le nombre de
  calculateurs *publiés* est limité, conforme à la spec produit.
- **Stripe non vérifiable en direct** : écrit selon le pattern éprouvé de
  `api/stripe.js` (site principal) mais sans clés réelles fournies. Chaque
  action répond `500 "Stripe not configured"` tant que
  `STRIPE_SECRET_KEY`/`STRIPE_PRO_PRICE_ID`/`STRIPE_PREMIUM_PRICE_ID`/
  `STRIPE_WEBHOOK_SECRET` ne sont pas renseignés (fail-soft, pas de crash).
  L'effet du webhook (upsert `builder_subscriptions`) a été simulé par écriture
  SQL directe et vérifié de bout en bout (déclenche bien les triggers de
  déverrouillage).
- Vérification live via navigateur toujours impossible dans ce bac à sable
  (même limitation proxy/Chromium que Lot 2) ; parcours revérifié en REST
  direct avec un compte de test jetable, nettoyé intégralement après coup
  (0 ligne résiduelle, confirmé par requête).

## Lot croissance (post-MVP) — acquisition avant monétisation

Décision produit : **ne pas monétiser tant que l'usage réel n'est pas là.**
Le badge « Créé avec Simfinly » reste le seul verrou gratuit (moteur de
croissance) ; toute la mécanique de plans reste en place, prête à être
resserrée. On priorise l'acquisition (SEO, viralité, rétention).

- **Mode lancement gratuit** (migration `0008`) : `free` passe à 10
  calculateurs publiés, capture d'email + webhook débloqués pour tous, seuil
  du bandeau de dépassement relevé à 10 000 vues/30 j (mécanique intacte,
  neutralisée). Landing et PlanPanel réécrits sans CTA Stripe. `lib/stripe.ts`
  et `api/stripe.js` conservés dormants pour réactivation ultérieure.
- **Galerie de modèles par métier** (`/modeles`, `/modeles/:id`) : 5 nouveaux
  templates métier (capacité d'emprunt, épargne, IR 2026, devis travaux, ROI
  pub) taggés `metier`, chacun couvert par un test de fidélité à valeur connue.
  Pages marketing indexables (SEO via `usePageMeta`), démo interactive avec le
  vrai renderer.
- **Calculateurs multi-étapes (wizard)** : `schema.steps` + `field.wizardStep`,
  rétrocompatible (sans étapes = un bloc). Logique isolée/testée
  (`schema/steps.ts`) ; renderer avec progression et navigation, résultats sur
  la dernière étape.
- **Analytics par calculateur** (`/stats/:id`, migration `0009`) : deux vues
  `security_invoker` (série quotidienne 30 j + top référents, hôte extrait de
  l'URL) révoquées à `anon` ; transform client pur/testé ; courbe SVG +
  conversion + référents. `recordView` enregistre désormais `document.referrer`.
- **OG dynamiques** (`api/meta.js`) : les crawlers sociaux (rewrite
  `vercel.json` sur user-agent) reçoivent un HTML avec `<title>`/`og:*` par
  slug (titre échappé — saisi par l'utilisateur) ; les moteurs de recherche
  ne sont **pas** routés là (pas de cloaking, ils exécutent le JS de la vraie
  page). Titre/description récupérés via la clé anon.

### Lot acquisition (2026-07-17) — maillage, galerie ×3, notifications de lead

Suite de la décision « acquisition avant monétisation » (stratégie détaillée :
`docs/STRATEGIE-MONETISATION-BUILDER.md`) :

- **Maillage simfinly.com → builder** (il n'existait aucun lien) : composant
  `src/components/BuilderCTA.jsx` du site principal, affiché sur toutes les
  pages `/simulateurs/*` (via le Footer, tous préfixes pays), sur `/widgets`,
  sur `/pro-conseiller`, + lien dans la nav du footer. UTM + événement
  `builder_cta_click` pour mesurer la conversion par emplacement. i18n FR/EN.
- **Galerie de modèles ×3** : 8 → 24 templates (rendement et cash-flow
  locatifs, assurance emprunteur, net vendeur, location saisonnière,
  micro-entrepreneur 2026, indemnités km, TVA, coût salarié, seuil de
  rentabilité, marge produit, taux horaire artisan, rente, objectif
  d'épargne, coût matière restauration, solaire), 4 nouveaux métiers dans
  `METIERS_ORDER`. Chaque template couvert par un test de fidélité à valeur
  connue (`templates.test.ts`). Le bundle public reste ~62 ko gzip (les
  templates ne sont chargés que par l'app/galerie).
- **Notification email de lead** (migration `0010`) : trigger pg_net →
  `POST /api/notify {submission_id}` ; l'endpoint (service role) revendique
  atomiquement `notified_at` (idempotent), relit calculateur + propriétaire
  et envoie l'email via Resend (fail-soft sans `RESEND_API_KEY`). Toggle
  `notify_email` (défaut ON) dans l'onglet Options de l'éditeur. Migration
  appliquée sur le projet Supabase (colonnes + trigger vérifiés). ⚠️ Reste à
  provisionner : compte Resend + `RESEND_API_KEY` (et domaine d'envoi) dans
  le projet Vercel du builder.

### Lot SEO + activation (2026-07-17)

Suite du lot acquisition. Deux fuites du tunnel colmatées : la découverte (SEO
technique) et l'activation (l'inscription faisait perdre le contexte).

**A. SEO technique du builder**
- `public/robots.txt` (pages marketing indexables, écrans applicatifs +
  `/api/` exclus) + `sitemap.xml` généré au build par un plugin Vite
  (`vite.config.ts`) depuis `TEMPLATES` — 26 URL (landing, galerie, 24 fiches),
  suit automatiquement l'ajout de modèles.
- Lien **canonical** posé par `usePageMeta` (chemin sans query : les UTM du
  maillage ne fragmentent plus l'URL indexée) ; ajouté à la landing.
- **JSON-LD** (`useJsonLd`) : `WebApplication` + `BreadcrumbList` sur les fiches
  modèles, `ItemList` sur la galerie.
- **Image OG de marque** (`public/og-cover.svg` → `og-cover.png` 1200×630 via
  `scripts/generate-og.mjs`, resvg) référencée dans `index.html` et
  `api/meta.js` ; Twitter passe en `summary_large_image`.

**B. Activation — parcours sans friction jusqu'à la publication**
- **Éditeur d'essai sans compte** (`/essai`, `/essai/:templateId`) : le même
  éditeur en mode invité, brouillon autosauvé en `localStorage` (`lib/intent`),
  aucun réseau. Vérifié au navigateur (amorce depuis modèle, autosave,
  restauration au reload, aperçu live).
- **Continuité modèle → inscription → éditeur** : « Personnaliser ce modèle »
  et « Publier » (mode invité) posent une *intention en attente*
  (`pendingIntent`) consommée une fois par le Dashboard après connexion — le
  modèle choisi / le brouillon d'essai est recréé et ouvert, zéro perte de
  travail (survit à l'aller-retour email/lien magique via `localStorage`).
- **Login contextuel** : arrivée avec intention → onglet Inscription par défaut
  + bandeau « Dernière étape… ».
- **Landing** : CTA hero et pricing pointent vers `/essai` (essayer sans
  compte) au lieu de `/login`.
- **Dashboard** : état vide guidé + démarrage rapide ramené à 5 modèles + lien
  « Parcourir les 24 modèles » (au lieu de 24 boutons bruts).

Dettes : og:image unique de marque (pas d'image par calculateur — YAGNI) ;
sitemap statique (pas de lastmod par modèle, tous à la date de build).

### Lot distribution + i18n EN (2026-07-17)

Cinq chantiers (tout sauf le thème sombre, écarté) :

- **Plugin WordPress** (`builder/wordpress-plugin/simfinly-calculators/`) :
  shortcode `[simfinly slug="…"]` + bloc Gutenberg (rendu serveur → shortcode,
  source unique), slug assaini, origine surchargeable via le filtre
  `simfinly_origin`. `readme.txt` prêt pour le répertoire WP. Le shortcode est
  proposé dans le `PublishPanel` à côté du lien et de l'embed. PHP et JS lintés.
- **Bouton de partage** sur la page publique (`ShareBar` dans
  `PublicCalculator`) : Web Share API (mobile) + X/LinkedIn/Facebook + copier
  le lien. Affiché en page hébergée uniquement (jamais dans l'iframe embed).
  Chaque partage rediffuse le badge — moteur de croissance.
- **Onboarding first-run** de l'éditeur (`EditorTips`) : trois repères,
  refermable, affiché une fois (`localStorage builder:editorTipsSeen`).
  Vérifié au navigateur (affichage, fermeture, persistance, reload).
- **Filtres + export des stats** : bascule 7 j / 30 j (recalcul client depuis
  la série de 30 j — aucune requête en plus) + export CSV de la série
  quotidienne. Référents restent sur 30 j (libellés).
- **Traduction EN du builder** : `en.ts` entièrement traduit (fin du statut
  miroir). Détection de locale au chargement (préférence mémorisée > langue du
  navigateur > fr), `<html lang>` synchronisé, bascule FR/EN (`LangSwitch` dans
  le Header) qui persiste et recharge. Vérifié au navigateur (rendu FR/EN,
  bascule, persistance, auto-détection). Le budget de la page publique reste
  ~65 ko gzip (< 100 ko) malgré les deux dictionnaires.

Non vérifiés en direct dans ce bac à sable (nécessitent Supabase authentifié /
un calculateur publié — même limite proxy que les lots précédents) : ShareBar,
toggle/export des stats, shortcode dans le PublishPanel. Build + typecheck +
67 tests OK ; logique pure (slicePeriod) calquée sur `buildAnalytics` déjà testé.

### Lot conformité + activation (2026-07-18)

Trois points (WordPress et Vercel Analytics reportés) :

- **Pages légales du builder** (`Legal.tsx`, routes `/mentions-legales` et
  `/confidentialite`, bilingues FR/EN) : le builder stocke des données
  (comptes, calculateurs, soumissions/leads, vues), ces pages le décrivent
  honnêtement — éditeur, hébergeur (Vercel), base EU (Supabase), et surtout la
  **distinction responsable/sous-traitant** pour les leads (l'auteur du
  calculateur est responsable, Simfinly sous-traitant). Liens dans le footer,
  ajoutées au sitemap. Important pour la cible pro (un CGP/courtier demande la
  politique de confidentialité avant d'intégrer une capture de leads).
- **Réinitialisation de mot de passe** : lien « Mot de passe oublié ? » →
  `resetPasswordForEmail` (email de reset) ; le retour sur `/login` déclenche
  l'événement `PASSWORD_RECOVERY` (suivi dans `AuthContext`) qui affiche le
  formulaire « nouveau mot de passe » (`updateUser`). Comblait un trou réel
  (un utilisateur bloqué n'avait que le lien magique comme contournement).
- **Fiches modèles enrichies (SEO)** : chaque `/modeles/:id` gagne « Pour qui »
  et « Base de calcul » (contenu curé `TEMPLATE_CONTENT`, exact d'après les
  règles source) + « Ce que l'outil calcule » / « Paramètres » dérivés du
  schéma (aucun texte inventé, ça suit les 24 modèles automatiquement).

Vérifié au navigateur (17 checks) : pages légales FR/EN + canonical, contenu
enrichi des fiches, bascule UI de réinitialisation. Build + typecheck + 67
tests OK. Page publique toujours ~65 ko gzip. Flux recovery (nouveau mot de
passe après clic email) non pilotable hors Supabase — logique standard
`onAuthStateChange` / `updateUser`.

### Dettes assumées — lot croissance
- OG sans image générée (`og:image` absent) : cartes en `summary` texte seul.
  Génération d'image dynamique volontairement hors périmètre (YAGNI).
- Analytics : fenêtre glissante 30 j (cohérente avec le reste), pas de
  filtres de période ni d'export ; courbe = vues/jour (soumissions en points).
- Wizard : pas de validation « champ requis » par étape (le moteur reste
  tolérant, NaN → message) ; navigation libre entre étapes.
- SEO `/modeles` : rendu côté client (Google exécute le JS) ; pas de SSR/
  prerender. Les balises OG statiques par modèle relèveraient d'`api/meta`
  si besoin plus tard.
- Vérifications faites malgré un bac à sable instable (MCP Supabase
  intermittent) : agrégats SQL et handler OG testés sur données réelles
  semées puis **purgées intégralement (0 ligne, confirmé en REST)** ; revoke
  `anon` des vues analytics confirmé (401) ; rendus vérifiés au navigateur
  (galerie, wizard, courbe stats).

## Prérequis externes
1. ✅ **Supabase EU provisionné** — projet existant `supabase-simfinly`
   (`gzwtfayxmpinhniulxed`, région eu-west-3 Paris) réutilisé plutôt que d'en
   créer un second (YAGNI, zéro coût supplémentaire). Schéma builder appliqué :
   4 tables `builder_*` + RLS + trigger `updated_at` (migration
   `builder/supabase/migrations/0001_builder_mvp_schema.sql`). Advisor sécurité :
   seule alerte propre corrigée (search_path figé) ; les autres préexistent au site.
   Clés dans `builder/.env.example`.
2. **Compte Stripe test + 2 prix (Pro 29 €/mois, Premium 59 €/mois)** —
   bloquant pour activer réellement `builder/api/stripe.js` (code prêt, voir
   dettes Lot 3 ci-dessus). Variables à fournir dans Vercel : `STRIPE_SECRET_KEY`,
   `STRIPE_PRO_PRICE_ID`, `STRIPE_PREMIUM_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`.
3. DNS `app.` et `s.` simfinly.com → Vercel — bloquant déploiement Lot 2.

### Décision : projet Supabase partagé site + builder
Auth partagée (`auth.users`), données isolées par RLS et préfixe `builder_`.
Un utilisateur du site et du builder est le même compte Supabase. Séparation en
projet dédié possible plus tard sans changer le code applicatif (mêmes noms de
tables, autre URL/clé).
