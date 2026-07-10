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

## Prérequis externes
1. ✅ **Supabase EU provisionné** — projet existant `supabase-simfinly`
   (`gzwtfayxmpinhniulxed`, région eu-west-3 Paris) réutilisé plutôt que d'en
   créer un second (YAGNI, zéro coût supplémentaire). Schéma builder appliqué :
   4 tables `builder_*` + RLS + trigger `updated_at` (migration
   `builder/supabase/migrations/0001_builder_mvp_schema.sql`). Advisor sécurité :
   seule alerte propre corrigée (search_path figé) ; les autres préexistent au site.
   Clés dans `builder/.env.example`.
2. Compte Stripe test + 2 prix (Pro/Premium) — bloquant Lot 3.
3. DNS `app.` et `s.` simfinly.com → Vercel — bloquant déploiement Lot 2.

### Décision : projet Supabase partagé site + builder
Auth partagée (`auth.users`), données isolées par RLS et préfixe `builder_`.
Un utilisateur du site et du builder est le même compte Supabase. Séparation en
projet dédié possible plus tard sans changer le code applicatif (mêmes noms de
tables, autre URL/clé).
