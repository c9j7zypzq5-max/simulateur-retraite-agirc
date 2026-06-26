# Audit SEO / Acquisition de Trafic — simfinly.com
> Date : juin 2026 — Audit en lecture seule, aucune modification de code

---

## Synthèse (5 lignes)

Le site a des fondations SEO solides (prérendu HTML statique, sitemap dynamique, schema.org WebApplication + BreadcrumbList, FAQ côté client, hreflang FR/EN/CH/BE). Les trois problèmes **les plus bloquants** sont : **(1)** 16 simulateurs déployés sans H1/intro dans le HTML statique (crawlers ne voient qu'un `<div id="root">` vide avant exécution JS) ; **(2)** les données structurées `FAQPage` ne sont générées que côté client, donc absentes du premier rendu indexé par Google — l'éligibilité aux rich results est compromise ; **(3)** le maillage interne est très lacunaire : `SimRecommendations` n'est actif que sur 3 pages sur 40+ simulateurs, et il n'existe aucun bloc "articles liés" sur les pages simulateurs.

---

## Données non vérifiables sans accès aux outils

Les éléments suivants ne peuvent pas être audités depuis le code seul — ils nécessitent un accès humain :

| Donnée manquante | Outil à utiliser |
|---|---|
| Positions réelles sur Google (top 10, featured snippets obtenus) | Google Search Console |
| Taux de crawl et délais d'indexation | Google Search Console > Couverture |
| Core Web Vitals réels terrain (LCP, CLS, INP p75) | Google Search Console > Expérience utilisateur |
| Volumes de recherche des mots-clés cibles | Google Search Console, Ahrefs, SEMrush |
| Taux de rebond et temps passé par simulateur | Vercel Analytics ou Plausible |
| Profil de backlinks existant | Ahrefs, Majestic, Search Console > Liens |
| Indexation réelle (site:simfinly.com) | Requête directe Google |
| Performance AdSense (RPM, CTR) | Google AdSense |

---

## Tableau priorisé

| # | Action | Impact (1-5) | Effort (1-5) | Catégorie |
|---|---|---|---|---|
| 1 | Ajouter les entrées `SEO_CONTENT` manquantes pour 16 simulateurs dans `api/_seo.js` | 5 | 1 | SEO technique — thin content |
| 2 | Injecter les JSON-LD `FAQPage` dans le HTML statique (build) via `structuredDataScripts` | 5 | 2 | SEO technique — rich results |
| 3 | Fixer le `lastmod` du sitemap : date de mise à jour réelle, pas `today` pour toutes les URLs | 4 | 2 | SEO technique — sitemap |
| 4 | Déployer `SimRecommendations` sur les 10 simulateurs à fort trafic (Epargne, Fire, Emprunt, Budget, PER, ImpôtRevenu, Succession…) | 4 | 2 | Maillage interne |
| 5 | Ajouter un bloc "Articles liés" sur chaque page simulateur (lien vers 2–3 posts de blog de la même catégorie) | 4 | 2 | Maillage interne + contenu |
| 6 | Remplacer les OG images `.webp` par `.png` dans le HTML statique pour la compatibilité Twitter/X | 3 | 1 | SEO technique — social |
| 7 | Corriger la police Google Fonts : passer en `font-display: swap` avec preload + lien `rel="preload"` non-render-blocking | 3 | 1 | Core Web Vitals — LCP |
| 8 | Ajouter un newsletter/email capture (exit intent ou fin de simulation) | 4 | 3 | Rétention |
| 9 | Étendre les pages `/retraite/:metier` (actuellement 4 métiers) à 10+ (médecin, avocat, policier, militaire, cadre…) | 4 | 3 | Contenu — longue traîne |
| 10 | Créer simulateurs manquants à fort volume (APL, droits au chômage, indemnité de licenciement) | 5 | 4 | Contenu — nouveaux mots-clés |
| 11 | Ajouter un bloc "Articles liés" sur les fiches `/guides/:slug` et `/lexique/:slug` | 3 | 2 | Maillage interne |
| 12 | Migration vers SSR/SSG véritable (ex. Astro + îles React, ou Next.js) | 5 | 5 | SEO technique — long terme |
| 13 | Implémenter la gestion des balises `hreflang` dans le sitemap XML | 3 | 2 | SEO international |
| 14 | Outreach backlinks : annuaires d'outils, forums finance, sites presse | 4 | 4 | Off-site |

---

## Détail technique des quick wins (< 1 jour de dev)

### #1 — 16 simulateurs sans H1/intro statique (`api/_seo.js`)

**Problème identifié** : Le script `scripts/generate-static-html.mjs` injecte un H1 + intro dans `<div id="root">` uniquement si la route a une entrée dans `SEO_CONTENT` (`api/_seo.js`). Sans cette entrée, le HTML servi à Googlebot contient un `<div id="root"></div>` vide — Google doit exécuter le JS pour voir le contenu.

**Routes affectées (no entry in `SEO_CONTENT`)** :
- `/simulateurs/donation`
- `/simulateurs/divorce`
- `/simulateurs/freelance-vs-salarie`
- `/simulateurs/epargne-salariale`
- `/simulateurs/deficit-foncier`
- `/simulateurs/succession`
- `/simulateurs/retraite-anticipee`
- `/simulateurs/trimestres`
- `/simulateurs/comparaison-reforme`
- `/simulateurs/rente-capital` *(existe dans SEO_CONTENT_CH et SEO_CONTENT_BE seulement)*
- `/simulateurs/inflation` *(idem)*
- `/simulateurs/lpp-deuxieme-pilier` *(route FR — SEO_CONTENT_CH ne couvre que /ch/...)*
- `/simulateurs/impot-revenu-ch` *(idem)*
- `/simulateurs/prevoyance-ch` *(idem)*
- `/simulateurs/succession-ch` *(idem)*
- `/simulateurs/retraite-luxembourg` *(idem)*

**Correctif** : Ajouter pour chacune un bloc `{ h1: '...', intro: '...' }` dans `SEO_CONTENT` (`api/_seo.js` avant la ligne `};` de clôture). Les H1 et intros peuvent être copiés depuis les `ROUTE_META` (title) et les paragraphes FAQ déjà présents dans les composants JSX correspondants. Effort : ~2h rédaction + tests build.

**Impact immédiat** : Google voit du texte à la première visite de Googlebot, accélère l'indexation et la classification thématique des pages.

---

### #2 — FAQPage JSON-LD absent du HTML statique

**Problème identifié** : `FaqSection` (dans `src/components/ui.jsx`, lignes ~327–344) émet dynamiquement le JSON-LD `FAQPage` côté client via React. Ce schema **n'est pas présent dans le HTML statique** livré au build. La fonction `structuredDataScripts` dans `api/_routes.js` n'inclut que `BreadcrumbList` + `WebApplication`.

Conséquence : Google doit rendre la page en JS pour découvrir le FAQPage. En pratique, les rich results "Questions fréquentes" ne sont pas garantis car la découverte dépend du second rendu différé de Googlebot.

**Correctif** : Exporter les FAQ depuis chaque simulateur dans un fichier de données partagé, puis les importer dans `structuredDataScripts` pour les injecter dans le HTML statique au build. Effort : 1 jour.

---

### #3 — `lastmod` dans le sitemap = aujourd'hui pour toutes les URLs

**Code concerné** : `api/sitemap.js`, ligne 8 :
```js
const today = new Date().toISOString().slice(0, 10);
```
Toutes les URLs reçoivent `<lastmod>${today}</lastmod>` — la date du jour à chaque requête. Google interprète ces dates comme "everything changed today every day" et finit par ignorer le signal `lastmod`.

**Correctif** : Maintenir dans `_routes.js` une date de dernière modification réelle par route (ex. date du dernier barème). Pour les routes statiques immuables, utiliser une date fixe (date de création). Effort : ~3h.

---

### #6 — OG image en `.webp` : incompatibilité Twitter/X

**Problème identifié** : `index.html` et le script de génération statique utilisent `.webp` pour `og:image` (ex. `/og-image.webp`). Twitter/X ne supporte pas le format WebP pour les Twitter Cards — l'aperçu sera un placeholder vide lors des partages sur X.

Les fichiers `.png` existent déjà dans `/public` (`og-image.png`, `og-retraite.png`, etc.).

**Correctif** : Remplacer les `.webp` par `.png` dans `OG_IMAGE_BY_CAT` et `OG_IMAGE_DEFAULT` dans `api/_routes.js`. Effort : 15 minutes.

---

### #7 — Google Fonts render-blocking (risque LCP)

**Problème identifié** : `index.html` charge deux familles Google Fonts via deux balises `<link rel="stylesheet">` synchrones (lignes 22–23), plus un `<link rel="preload" as="style">` redondant. Le navigateur **bloque le premier rendu** en attendant les feuilles de style fonts.googleapis.com.

```html
<!-- Actuel — bloque le rendu -->
<link href="https://fonts.googleapis.com/css2?..." rel="stylesheet" fetchpriority="high">
<link rel="preload" href="https://fonts.googleapis.com/..." as="style" crossorigin>
```

**Correctif recommandé** :
```html
<!-- Non-blocking : load CSS async via onload trick -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"></noscript>
```

Effort : 15 minutes.

---

## Analyse contenu & mots-clés

### Points forts

- **40+ simulateurs** couvrant les principaux thèmes finances personnelles FR, plus des variantes BE et CH : couverture thématique très large.
- **Lexique** (~60 termes), **Guides** (thématiques cluster) et **Comparatifs** : trois couches de contenu éditorial qui renforcent l'autorité thématique.
- **Blog dynamique** via Redis/Upstash avec génération d'articles automatiques : contenu frais régulier.
- **Pages `/retraite/:metier`** (fonctionnaire, infirmière, enseignant, agriculteur) : excellent levier longue traîne à fort volume, bien exécuté.
- **FAQ** riche dans presque tous les simulateurs (39/40) : éligible rich results FAQPage une fois corrigé (voir #2).
- **Textes SEO présents** (H1 + 2–3 lignes d'intro) sur ~24/40 simulateurs FR.

### Thin content — simulateurs sans contenu textuel

Les 16 pages listées au #1 ci-dessus ont une `<h1>` générée dynamiquement (JS uniquement) et aucune intro textuelle dans le HTML statique. Pour Googlebot premier passage : page quasi-vide.

De plus, même les simulateurs ayant une intro statique restent **très courts en contenu textuel** : le bloc simulateur est une UI interactive (formulaire + graphique), pas du texte indexable. Seules l'intro (2–3 phrases) et la FAQ (3–5 questions) constituent le contenu indexable réel. Ce n'est pas un problème bloquant pour les pages où les mots-clés sont précis, mais c'est limitant pour les mots-clés informationnels.

### Mots-clés à fort volume non couverts

Les lacunes les plus significatives par rapport aux volumes français :

| Mot-clé / sujet | Volume estimé* | Type | Note |
|---|---|---|---|
| Simulateur APL / aide au logement | Très élevé | Transactionnel | Forte demande, aucun simulateur |
| Simulateur droits au chômage (ARE / Pôle Emploi) | Très élevé | Transactionnel | Aucun simulateur |
| Calculateur indemnité de licenciement | Élevé | Transactionnel | Aucun simulateur |
| Simulateur préavis de départ | Moyen-élevé | Transactionnel | Aucun simulateur |
| Simulateur prime de partage de la valeur (PPV) | Moyen | Transactionnel | Aucun simulateur |
| Simulateur prélèvement à la source | Moyen | Informationnel | Partiellement couvert par impôt-revenu |
| Simulateur capital décès | Moyen | Informationnel | Aucun simulateur |
| Simulateur retraite médecin / chirurgien (CARMF) | Moyen | Longue traîne | Manque dans RetraiteMetier |
| Simulateur retraite avocat (CNBF) | Faible-moyen | Longue traîne | Manque dans RetraiteMetier |

*Volumes non vérifiables sans Search Console/Ahrefs — à confirmer.

---

## Architecture & maillage interne

### Points forts

- `SimulateurHeader` inclut un **fil d'Ariane visuel** + JSON-LD BreadcrumbList, ainsi que des **chips "Voir aussi"** pointant vers 3 simulateurs de la même catégorie.
- `SimRecommendations` (recommandations contextuelles inter-simulateurs) — composant bien conçu, réutilisable.
- `AutoLinkText` : lie automatiquement les termes du lexique dans les textes des simulateurs.
- Guides et Comparatifs fonctionnent comme des **topic clusters** (ils listent les simulateurs liés + termes du lexique).

### Points faibles

**SimRecommendations n'est utilisé que sur 3 pages** (`ImpotRevenu`, `Inflation`, `RenteCapital`) sur 40+ simulateurs. Les simulateurs les plus trafiqués (Epargne, Fire, EmpruntImmobilier, Per, Budget) n'ont aucun lien de recommandation vers d'autres simulateurs au-delà des chips "Voir aussi".

**Aucun bloc "Articles liés" sur les pages simulateurs**. Chaque page simulateur est une impasse éditoriale : l'utilisateur ne voit pas les articles de blog qui approfondissent le sujet. Ce bidirectionnel blog↔simulateur est mentionné comme TODO dans `docs/plan-trafic.md` mais non implémenté.

**Breadcrumb non cliquable pour la catégorie** : le chip "Retraite" ou "Immobilier" dans le fil d'Ariane (`HeaderBreadcrumb`, `ui.jsx` ligne 374) n'est pas un lien vers une page de catégorie — c'est un `<span>` passif. Il n'existe pas de page `/simulateurs/retraite` ou `/simulateurs/immobilier` qui regrouperait les simulateurs de cette catégorie et capturerait les requêtes génériques.

---

## Conversion & rétention

### Mécanismes de partage existants (bien implémentés)

- **URL partageable avec paramètres** : `buildShareUrl` sérialise l'état du simulateur dans l'URL. ✓
- **PDF export** (jsPDF + html2canvas) : téléchargeable sans inscription. ✓
- **Boutons sociaux** (X, LinkedIn, WhatsApp) : actifs dès qu'un résultat `highlight` est défini. ✓
- **Lien public Pro** : partage d'une simulation sur une URL propre (`/s/:id`). ✓ (réservé Pro)
- **OG image dynamique** via `/api/og` : personnalisée avec la valeur simulée (ex. "Votre pension estimée : 1 843 €/mois"). ✓

### Mécanismes de rétention inexistants

- **Pas de newsletter** : aucun formulaire d'email dans le codebase. C'est le manque le plus critique pour la rétention. Une capture email à la fin d'une simulation ("Recevoir une mise à jour quand les barèmes changent") pourrait convertir à taux élevé car le visiteur est en contexte d'intérêt direct.
- **Pas de notification de mise à jour des barèmes** : `BaremeUpdateBadge` existe mais n'est pas exploité pour créer une incitation à revenir (push ou email).
- **Historique des simulations** : `useSimHistory` sauvegarde en localStorage mais reste invisible si l'utilisateur n'est pas connecté — l'historique est perdu d'une session à l'autre pour les anonymes.
- **PWA install** : hook `usePwaInstall` présent mais aucun prompt ou CTA visible dans le code des pages principales.

### Skeleton / loading UX

- Les simulations côté client sont **instantanées** (calculs synchrones, pas d'API call) — pas de besoin de skeleton sur les simulateurs. ✓
- Le `Blog.jsx` a un `SkeletonCard` pour le chargement des articles. ✓
- `RouteFallback` ("Chargement…") pour les chunks lazy : minimaliste mais fonctionnel.

---

## SEO technique détaillé

### Stratégie de prérendu — État réel

Le site utilise une stratégie **HTML statique patché au build** (`scripts/generate-static-html.mjs`) qui :
1. Génère un build Vite standard (SPA)
2. Pour chaque route connue, copie `dist/index.html` dans `dist/<route>/index.html`
3. Patche title, description, og:image, og:url, canonical, hreflang, JSON-LD et (si disponible) H1+intro dans `#root`

**Ce n'est PAS du SSR/SSG complet** : le corps interactif du simulateur (formulaire, graphique) est toujours rendu côté client. Seul le haut de page (H1, intro 2–3 phrases) est inclus dans le HTML statique. Googlebot reçoit donc :
- Les métadonnées complètes ✓
- Un H1 et une intro pour les 24 simulateurs ayant une entrée dans `SEO_CONTENT` ✓
- Un `<div id="root">` vide pour les 16 autres ❌
- Le contenu du simulateur lui-même uniquement après exécution JS (second rendu différé Googlebot)

### robots.txt

Fichier bien configuré (`public/robots.txt`) :
- Bloque les routes privées (`/embed/`, `/mes-simulations`, `/compte`, `/connexion`, `/tableau-de-bord`, `/rapport/`, `/partage/`)
- Autorise `/api/og` (les crawlers sociaux doivent accéder à la génération d'images)
- Autorise les bots IA (GPTBot, ClaudeBot, Google-Extended, PerplexityBot) ✓
- Pointe vers `https://www.simfinly.com/sitemap.xml` ✓

**Anomalie** : `/simulateurs/lpp-deuxieme-pilier`, `/simulateurs/impot-revenu-ch`, `/simulateurs/prevoyance-ch` sont des simulateurs accessibles sur le domaine principal FR mais correspondent à des produits suisses — ils ne sont pas bloqués, ce qui est correct. Mais leur présence sans SEO content FR les rend thin.

### Sitemap XML

Généré dynamiquement par `api/sitemap.js` via une fonction serverless Vercel. Points positifs :
- Inclut les slugs de blog en temps réel depuis Redis ✓
- Inclut images OG par route ✓
- Couvre FR + EN + CH + BE ✓
- Cache `s-maxage=3600` ✓

**Problème** : `lastmod` = date du jour pour toutes les URL (voir #3). Google peut ignorer ce signal si toutes les pages "changent" en permanence.

**Absence de sitemap index** : avec 200+ URLs (estimé : 50 FR + 20 EN + 20 CH + 15 BE + lexique + guides + comparatifs + blog ≈ 200–250 URLs), un fichier unique reste en dessous du seuil des 50 000 URLs. Pas de problème à ce stade.

**`hreflang` absent du sitemap** : les hreflang ne sont injectés que dans le `<head>` HTML (via `hreflangLinks()` au build + `HreflangTags` côté client). Leur absence dans le sitemap n'est pas bloquante mais réduire le risque de mauvaise interprétation inter-locales demanderait de les ajouter.

### Structured Data — Inventaire complet

| Schema type | Couverture | Méthode | Problème |
|---|---|---|---|
| `WebSite` + `SearchAction` | 1 page (home) | HTML statique (index.html) | ✓ OK |
| `Organization` | 1 page (home) | HTML statique | ✓ OK |
| `BreadcrumbList` | Tous simulateurs | HTML statique (build) | ✓ OK |
| `WebApplication` | Tous simulateurs | HTML statique (build) | ✓ OK |
| `FAQPage` | 39 simulateurs | **Client-side uniquement** | ❌ Absent HTML statique |
| `HowTo` | ~25 simulateurs | Client-side (JSX) | ❌ Absent HTML statique |
| `Article` | Blog + Guides + Comparatifs | HTML statique (build) | ✓ OK |
| `DefinedTerm` | Lexique (~60 termes) | HTML statique (build) | ✓ OK |

Le schema `FAQPage` client-only est le gap le plus impactant : les rich results "Questions fréquentes" permettraient d'occuper 2× plus de place dans les SERP pour des requêtes comme "comment calculer retraite agirc-arrco" ou "comment fonctionne le per".

### Core Web Vitals — Risques identifiés

| Signal | Observation | Risque | Sévérité |
|---|---|---|---|
| LCP | Google Fonts chargées en bloquant (2 familles : Hanken Grotesk + Space Grotesk) | LCP > 2,5s probable sur connexion lente | Élevé |
| LCP | Pas d'images hero au-dessus de la ligne de flottaison (simulateurs) | Pas de problème, LCP sera le texte H1 | Faible |
| CLS | Polices web sans `font-display: swap` → FOIT (flash of invisible text) | Léger CLS possible | Moyen |
| INP | Calculs synchrones dans les gestionnaires `onChange` | Pas de travail lourd identifié | Faible |
| Bundle JS | Chunk splitting minimal (seul `react-dom` séparé) | Chunk initial potentiellement lourd | Moyen |
| AdSense | Script async dans `<head>` | Parsing différé mais pas bloquant | Faible |

**Note bundle** : `html2canvas`, `jsPDF` et `xlsx` sont dans `dependencies` mais sont chargés en lazy import (`await import(...)`) à l'intérieur des handlers async — ils ne gonflent pas le bundle initial. ✓

---

## Opportunités d'acquisition externe (analyse, pas d'action immédiate)

### Backlinks naturels pertinents

Le site a un atout "linkable" fort : **des simulateurs techniques gratuits avec calculs officiels français** (barèmes Agirc-Arrco, CNAV, MSA, CIPAV, PTZ…). Ces outils sont difficiles à recréer et ont une valeur réelle pour les journalistes et sites de conseil.

Pistes les plus réalistes :

1. **Forums** : `r/vosfinances` (Reddit), MoneyVox communauté, Forum-Retraite.com — posting utile avec lien contextuel dans les réponses.
2. **Médias finance personnelle** : Moneyvox.fr, LeRevenu.com, Capital.fr, BFM Business — les journalistes citent souvent des simulateurs dans les articles barèmes annuels (PTZ 2026, PER 2026, revalorisation retraite). Un email avec "nous avons un simulateur à jour" peut obtenir un lien.
3. **Comparateurs et annuaires** : LesNumériques, Meilleur Banque, Que Choisir ont des dossiers finances avec outils — potentiel de liens éditoriaux.
4. **Institutionnels** : France Travail, CAF, et les caisses de retraite ont des pages "liens utiles" — probabilité faible mais liens très puissants.
5. **Embed / widgets** : La page `/widgets` et le composant `EmbedSnippet` existent mais n'est activé que sur 1 simulateur (Épargne). Activer l'embed sur Emprunt immobilier et PER permettrait aux blogs finance de l'intégrer, générant des backlinks naturels.

### Asset "linkable" le plus fort

Le simulateur **Agirc-Arrco avec barèmes 2026** est unique : très peu de sites proposent un calcul gratuit avec le coefficient de solidarité et la GMP cadres. C'est la page la plus susceptible d'obtenir des citations press/media. Un article de blog "Comment calculer sa retraite complémentaire en 2026" avec résultats chiffrés et infographie (générable depuis la fonctionnalité export vidéo déjà dans le repo) serait très shareable.

---

## Détail des actions long terme

### Migration SSR/SSG complète

L'approche actuelle (HTML patching) fonctionne pour les métadonnées mais ne résout pas le problème de fond : **le contenu des simulateurs (formulaire, graphiques, résultats) est invisible sans JS**. Google exécute le JS en deuxième passe mais avec délai variable.

Options par ordre de complexité croissante :

1. **Astro + React Islands** (recommandé) : pages statiques complètes avec des composants React "hydratés" uniquement là où nécessaire. Le H1, l'intro, la FAQ et le JSON-LD sont statiques ; le formulaire s'hydrate à l'interaction. Effort : 3–5 jours de migration par simulateur, mais très progressif.

2. **Next.js App Router** : SSR ou SSG full page. Bundle plus lourd, mais écosystème mature et bien supporté sur Vercel. Effort : réécriture substantielle.

3. **Amélioration incrémentale de l'approche actuelle** : ajouter le H2 "Comment utiliser ce simulateur" et 3–4 paragraphes de contexte (400–600 mots) dans `_seo.js` pour chaque simulateur, injectés dans le `#root` static. Pas de SSR mais beaucoup plus de contenu crawlable. Effort : 1–2 jours pour 10 simulateurs prioritaires.

**Recommandation pragmatique** : la solution #3 est la plus rapide et compatible avec l'architecture actuelle. Enrichir `_seo.js` avec 2–3 sections de contenu (H2 + paragraphes) pour les simulateurs à fort volume (Agirc-Arrco, CNAV, PER, Emprunt, Impôt) avant d'envisager une migration d'architecture.

---

## Checklist prioritaire immédiate

```
[ ] 1. Remplir les 16 entrées manquantes dans api/_seo.js (< 2h)
[ ] 2. Corriger og:image webp → png dans api/_routes.js (15 min)
[ ] 3. Rendre les Google Fonts non-bloquantes dans index.html (15 min)
[ ] 4. Fixer lastmod dans api/sitemap.js (1h)
[ ] 5. Valider le site dans Google Search Console + soumettre sitemap
[ ] 6. Ajouter SimRecommendations aux 5 simulateurs top trafic (2h)
[ ] 7. Ajouter bloc "Articles liés" sur les pages simulateurs (3h)
[ ] 8. Activer EmbedSnippet sur EmpruntImmobilier et PER (30 min)
[ ] 9. Migrer FAQPage JSON-LD dans le build statique (1 jour)
[ ] 10. Ajouter capture email en fin de simulation (3h)
```
