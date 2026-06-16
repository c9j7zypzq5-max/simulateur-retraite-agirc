# PoC Astro — blog · conclusions

Preuve de concept **isolée** (dossier `astro-poc/`, package.json + node_modules
séparés). Objectif : évaluer l'effort réel d'une migration Astro pour le site, en
rendant le blog en SSG + une island React. **Aucun impact sur la prod** (l'app
Vite reste la seule déployée). Ce dossier n'est pas destiné à être mergé/déployé.

## Ce qui marche (validé par le build)

- **SSG du contenu** : 7 pages générées (`/blog` + 6 articles) à partir du
  **contenu réel** (`../scripts/actualites-2026.mjs`, importé tel quel).
- **Corps d'article en HTML statique** : le texte est présent dans le HTML brut
  (vérifié : « barème progressif », « 11 600 » dans la source) → crawlable **sans
  exécuter de JS**, exactement l'objectif visé. Aujourd'hui en prod, ce corps est
  injecté par un script de patch maison ; Astro le fait nativement.
- **Islands React** : `ThemeToggle` (`client:load`) prouve que des composants
  interactifs React cohabitent avec le contenu statique → c'est le modèle pour
  les **simulateurs** (statique pour le contenu, island pour l'outil).
- **SEO natif** : `<title>`, meta description, `<link rel="canonical">` et JSON-LD
  par page, sans script de génération séparé.
- **Poids** : ~11,7 Ko par page d'article (HTML), JS d'hydratation chargé seulement
  pour l'island — bien plus léger que le shell SPA actuel.

## Difficultés réelles découvertes (pour la vraie migration)

1. **Couplage à react-router** — c'est LE point dur. Les composants existants
   (`Navbar`, `Footer`, pages simulateurs) utilisent `useLocation`/`Link` de
   `react-router-dom`. Dans une island Astro, il n'y a pas de Router : ces hooks
   plantent. Deux options :
   - découpler les composants du routing (passer l'URL/les liens en props, ou un
     petit shim) — recommandé, et ça sert aussi la portabilité ;
   - ou envelopper chaque island dans un `MemoryRouter` (rustine).
   Le PoC a volontairement utilisé un composant **sans** dépendance routeur, qui
   fonctionne sans accroc.
2. **Styles** : les styles inline (CSS-in-JS léger du projet) passent tels quels
   dans les islands. Pas de bloqueur.
3. **Données au build** : l'import du contenu fonctionne ; pour les articles en
   Redis, `getStaticPaths` peut faire un `await` (comme le script actuel
   `blogEntries()`). Pas de bloqueur.
4. **API `api/*`** : les fonctions serverless Vercel restent inchangées (OG,
   sitemap, articles…) — indépendantes du framework de rendu.
5. **i18n** : Astro a un routing i18n intégré (`/en/...`), qui remplacerait la
   plomberie `hreflangLinks` posée en Phase 1 — celle-ci reste utile en attendant.

## Estimation d'effort (indicative)

| Lot | Contenu | Effort |
|-----|---------|--------|
| A | Scaffold Astro à la racine + layout commun + styles globaux | ~0,5 j |
| B | Pages **contenu** en SSG : blog, lexique, guides, légal, à-propos | ~1–2 j |
| C | **Découplage routeur** des composants partagés (Navbar/Footer) | ~1 j |
| D | Simulateurs en islands (1 par 1, le plus gros poste) | ~3–6 j |
| E | Bascule routing + suppression du pré-rendu maison + i18n natif | ~1–2 j |

→ Ordre de grandeur : **1 à 2 semaines** pour une migration complète et soignée,
réalisable **incrémentalement** (les pages contenu d'abord, simulateurs ensuite),
sans casser la prod si on déploie lot par lot.

## Recommandation

Migration **viable et bénéfique** (SEO + perf + simplification). Le chemin le plus
sûr : commencer par les pages **contenu** (lot B), faire le **découplage routeur**
(lot C) qui est le vrai prérequis, puis migrer les simulateurs en islands un par un.
À décider avant de lancer : faire la migration à la racine dans une branche dédiée,
avec déploiements de préversion (preview) pour valider chaque lot.

## Reproduire

```bash
cd astro-poc
npm install
npm run build      # → astro-poc/dist/blog/*/index.html
npm run dev        # serveur local
```
