# Simfinly — Guide Claude Code

## Projet
Suite de simulateurs financiers React 19 + Vite, déployée sur Vercel (simfinly.com).
Stack : React, Vite, Supabase (auth + BDD), Stripe (paiements), Vercel (serverless).

## Règle absolue : Internationalisation (i18n)

**Toute nouvelle page ou modification d'une page existante DOIT exister en français ET en anglais.**

### Système i18n en place
- Locale détectée depuis l'URL : `/en/...` = anglais, sans préfixe = français
- Dictionnaires : `src/i18n/fr.js` (source de vérité) et `src/i18n/en.js` (miroir complet)
- Hook : `useTranslation()` → `{ t, locale }` depuis `src/i18n/index.js`
- Routes EN disponibles : `src/i18n/paths.js` → `EN_ROUTES` Set
- Composant switch : `src/components/LangSwitch.jsx`
- Liens localisés : `src/lib/router.jsx` → `<LocaleLink>`

### Pour chaque nouvelle page
1. Ajouter la route `/en/<route>` dans `src/App.jsx`
2. Ajouter `'/<route>'` à `EN_ROUTES` dans `src/i18n/paths.js`
3. Dans le composant : utiliser `useTranslation()` et gérer `locale === 'en'` pour les contenus longs
4. Ajouter les nouvelles clés dans `src/i18n/fr.js` ET `src/i18n/en.js`
5. Vérifier que `<LangSwitch />` apparaît dans la Navbar sur cette page

### Pages existantes à maintenir en EN
Routes déjà en EN : `/`, `/simulateurs/epargne`, `/simulateurs/fire`, `/simulateurs/budget`,
`/simulateurs/patrimoine`, `/simulateurs/cout-en-heures`, `/simulateurs/credit-conso`,
`/simulateurs/comparateur`, `/outils/qr-code`, `/mentions-legales`, `/politique-de-confidentialite`

Routes ajoutées récemment — à internationaliser :
- `/connexion` → `/en/connexion`
- `/compte` → `/en/compte`
- `/pro` → `/en/pro`
- `/merci` → `/en/merci`
- `/merci-pro` → `/en/merci-pro`

## Limites Vercel
- Max 13 fonctions serverless (fichiers sans `_` dans `/api/`)
- Actuellement : 13 fonctions — ne pas en ajouter sans en renommer une avec `_`
- Toutes les actions Stripe sont dans `api/stripe.js` via `?action=<nom>`

## Sécurité
- `SUPABASE_SERVICE_ROLE_KEY` : jamais de préfixe `VITE_`, jamais côté client
- `VITE_SUPABASE_ANON_KEY` : public par design, sécurité assurée par RLS
- Statut Pro toujours lu depuis Supabase (jamais localStorage)
- Modifier `subscription_status` côté client est impossible (trigger BDD + RLS)

## Variables d'environnement requises
```
STRIPE_SECRET_KEY
STRIPE_PRO_PRICE_ID
STRIPE_WEBHOOK_SECRET
VITE_STRIPE_PUBLISHABLE_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
UPSTASH_REDIS_REST_URL      (optionnel, cache paiement)
UPSTASH_REDIS_REST_TOKEN    (optionnel)
```
