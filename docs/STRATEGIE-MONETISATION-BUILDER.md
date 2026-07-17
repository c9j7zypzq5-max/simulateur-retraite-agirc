# Stratégie — Monétisation du builder & nouvelles opportunités

*Analyse du 17 juillet 2026 (état du code + données Supabase + étude de marché).*

## 1. État des lieux factuel

Le produit est prêt, la distribution est à zéro :

- **Builder live** sur app.simfinly.com : moteur de formules avec `BAREME` (barèmes
  fiscaux FR), wizard multi-étapes, capture d'email, webhook sortant, analytics,
  8 modèles, embed une-ligne, badge « Créé avec Simfinly ».
- **Usage réel (Supabase, 17/07/2026) : 0 workspace, 0 calculateur, 0 vue,
  0 soumission, 1 seul compte auth au total** (compte propriétaire/test).
- **Le site principal ne mentionne le builder nulle part** (`grep app.simfinly`
  et `builder` dans `src/` : zéro occurrence). Le point « badge sur les
  simulateurs gratuits → page de vente » du Lot 4 n'a jamais été câblé.
  Le trafic SEO de simfinly.com — le canal d'acquisition n° 1, gratuit —
  n'envoie donc personne vers le builder.
- **La mécanique payante est déjà codée et dormante** : plans free/pro/premium,
  verrous côté serveur (triggers RLS, migration `0003`), `lib/stripe.ts` et
  `builder/api/stripe.js` prêts. Basculer en payant = 1 migration + CTA +
  4 variables d'environnement Stripe.

**Conséquence stratégique** : le problème n'est pas le pricing, c'est la
distribution. Mais avec 0 compte existant, c'est précisément **le meilleur
moment pour basculer en payant** — aucun utilisateur acquis à froisser, aucun
grandfathering à gérer, et le paiement devient le test de validation du produit.
Rendre payant et acquérir doivent se faire ensemble, pas l'un après l'autre.

## 2. Le marché : ce que les gens paient déjà (et ce qui les insatisfait)

### Builders de calculateurs (généralistes, anglophones)

| Outil | Prix | Griefs documentés (G2/Capterra) |
|---|---|---|
| Outgrow | 14 $/mois (très limité) → 95 $/mois (branding Outgrow **toujours présent**) → 600 $/mois (white-label) | « Cost was crazy expensive », support qualifié de pire expérience client, lenteur, fonctions débloquées par surcoûts successifs (analytics, branding) |
| ConvertCalculator | ~18 $/mois et + | Courbe d'apprentissage des formules pour non-codeurs, limites peu claires → coûts surprises |
| Calconic | 5–14 $/mois | Limité aux calculettes simples |
| involve.me | 19 $/mois et + | Généraliste quiz/forms, pas pensé calculs |

**Aucun n'est français** : pas de barèmes fiscaux FR, pas de formats fr-FR
natifs, pas d'hébergement UE mis en avant, facturation **au lead** (le grief
n° 1 chez Outgrow). En France, le besoin est aujourd'hui servi par des
**agences** (Eficiens, Celuga, Script…) qui facturent le simulateur sur mesure
plusieurs milliers d'euros — preuve que la demande solvable existe.

### Logiciels pour CGP / courtiers (l'ancre de prix la plus intéressante)

- Acteurs historiques (Harvest/E-DIXIT, Capital Explorer…) : de l'ordre de
  **2 000 à 8 000 €/an/utilisateur** selon les comparatifs 2026.
- Patriom (entrant « moderne, moins cher », 18 simulateurs + PDF à la marque) :
  **449 €/mois, ou 2 990 €/an**.
- Il n'existe **rien de sérieux entre 0 et ~250 €/mois** pour un CGP/courtier
  indépendant qui veut des simulateurs à sa marque. Simfinly a déjà 30+
  simulateurs, des widgets embarquables, des liens de partage pré-remplis et
  l'export PDF : l'écart à combler est faible.

### Positionnement recommandé du builder

> **« Le créateur de simulateurs français : barèmes fiscaux FR intégrés,
> RGPD/hébergé en UE, leads illimités sans surcoût, prix TPE. »**

Chaque mot attaque une insatisfaction documentée de la concurrence
(prix au lead, complexité, outils anglophones, données aux USA).

## 3. Grille tarifaire recommandée

Conserver la structure déjà codée (free / Pro 29 € / Premium 59 €) — elle est
bien calibrée par rapport au marché — avec ces réglages :

| | Free | Pro — 29 €/mois (24 € en annuel) | Premium — 59 €/mois (49 € en annuel) |
|---|---|---|---|
| Calculateurs publiés | 1 (brouillons illimités) | 10 | Illimités |
| Badge « Créé avec Simfinly » | Obligatoire (moteur de croissance) | Retirable | Retirable |
| Vues | 200/30 j puis bandeau (jamais de coupure) | Illimitées | Illimitées |
| Capture d'email (leads) | — | ✅ + **notification email à chaque lead** | ✅ |
| Export CSV des soumissions | — | ✅ | ✅ |
| PDF de résultat logoté (visiteur) | — | ✅ | ✅ |
| Webhook / Zapier / Make | — | — | ✅ |
| Domaine personnalisé | — | — | ✅ |
| Analytics avancées | Basique | ✅ | ✅ |

- **Facturer au nombre de calculateurs, jamais au lead ni à la vue** : c'est
  l'anti-Outgrow, et l'argument s'affiche tel quel sur la page pricing
  (« Vos leads sont à vous. Illimités. Sans surcoût. »).
- **Offre fondateur** : −50 % à vie pour les 50 premiers abonnés (coupon
  Stripe). Crée l'urgence, amorce la preuve sociale, et 14,50 €/mois reste
  au-dessus de Calconic avec dix fois plus de valeur.
- Prévoir dès le départ les **prix annuels** (2 mois offerts) : la cible TPE
  résilie peu mais aime « régler une bonne fois ».

## 4. Améliorations qui déclenchent le paiement (priorisées)

### P0 — avant/avec la bascule payante

1. **Notification email à chaque lead** *(la feature n° 1 de valeur perçue)*.
   Aujourd'hui les soumissions n'arrivent que dans le dashboard + webhook —
   or une TPE ne branchera jamais un webhook. Le lead doit arriver dans la
   boîte mail (Resend/Postmark via edge function ; `pg_net` est déjà utilisé
   pour le webhook, migration `0005` — même mécanique).
2. **Maillage simfinly.com → builder** *(coût 0, impact max)*. Carte/bandeau
   « Créez votre propre simulateur, à votre marque » sur les 30+ pages
   simulateurs, sur `/widgets` et sur `/pro-conseiller`. C'est le canal
   d'acquisition le moins cher qui existera jamais pour ce produit, et il
   est aujourd'hui débranché.
3. **PDF de résultat à la marque du client** (verrou Pro). Demande n° 1 des
   courtiers/CGP (Patriom en fait son argument central à 449 €/mois). Le
   savoir-faire PDF existe déjà côté site principal.

### P1 — dans les 6 semaines

4. **Génération de calculateur par IA** : « Décrivez votre simulateur » →
   schéma JSON prêt à éditer. Personne ne le fait en français ; démo
   spectaculaire pour la landing ; techniquement peu coûteux (le
   `CalculatorSchema` est déjà le format cible ; une fonction serverless du
   projet builder — qui n'est pas concerné par le plafond des 13 fonctions du
   site principal — appelle un LLM avec sortie structurée). Verrou : 3
   générations en free, illimité en Pro.
5. **Galerie de modèles ×3** : passer de 8 à 25–30 modèles métier. Chaque
   modèle = une page SEO indexable (`/modeles/:id`, déjà en place) + bouton
   « Utiliser ce modèle ». C'est à la fois du produit et de l'acquisition.
6. **Plugin WordPress officiel** (embed + shortcode). Les artisans/TPE
   françaises sont massivement sous WordPress et les plugins de « cost
   calculator » y sont très populaires ; le répertoire WP est un canal de
   distribution gratuit.

### P2 — ensuite

7. Domaine personnalisé (CNAME, verrou Premium).
8. **Plan Agence** (~99 €/mois) : gérer plusieurs workspaces clients — la
   table `builder_workspaces` a été conçue pour le multi dès le Lot 2. Les
   agences web revendent le simulateur à leurs clients (elles le font déjà,
   en le facturant des milliers d'euros).
9. Stats avancées / A-B testing.

## 5. Bascule technique (checklist)

1. **Migration `0010_activate_paid_plans.sql`** : restaurer les verrous de
   `0003` (free = 1 publié, `capture_email` clampée à false, seuil bandeau
   200 vues/30 j). La migration `0008` avait volontairement laissé la
   mécanique intacte : c'est ~20 lignes.
2. **UI** : remettre CTA Stripe et grille tarifaire dans `Landing.tsx` et
   `PlanPanel.tsx` (`lib/stripe.ts` est prêt, les clés i18n existent).
3. **Stripe** : créer les produits/prix (Pro et Premium, mensuel + annuel,
   coupon fondateur −50 %), renseigner dans le projet Vercel du builder :
   `STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID`, `STRIPE_PREMIUM_PRICE_ID`,
   `STRIPE_WEBHOOK_SECRET`, et pointer le webhook Stripe vers
   `app.simfinly.com/api/stripe?action=webhook`.
4. **Emails transactionnels** : compte Resend/Postmark (notifications de
   lead, P0-1).
5. Aucun grandfathering à gérer : 0 compte existant. Fenêtre idéale — basculer
   **avant** de pousser l'acquisition.

## 6. Autres opportunités (fort intérêt, concurrence faible ou décevante)

### A. ⭐ « Simfinly Cabinet » — licence CGP/courtiers (la plus forte)

**Constat** : plusieurs milliers de cabinets CGP indépendants et des dizaines
de milliers de courtiers en France ; leurs outils coûtent 2 000–8 000 €/an
(insatisfaction prix documentée), l'alternative « moderne » démarre à
249 €/mois. **Personne ne sert l'entrée de gamme.**

**Offre** : 49–99 €/mois — les 30+ simulateurs de simfinly.com en marque
blanche (PDF logoté, widgets sans badge, liens de partage pré-remplis
illimités, référentiels officiels à jour) + le builder Premium inclus.
La page `/pro-conseiller` existe déjà ; il manque la marque blanche et le
paiement. C'est l'actif le plus différenciant du repo : un concurrent du
builder peut copier l'éditeur, pas les 30 simulateurs réglementaires
entretenus.

### B. Vendre le builder **par métier**, pas comme un outil générique

Le mot-clé « créer un simulateur » est un petit marché ; « simulateur de devis
pour mon site de peintre » est un besoin concret payé aujourd'hui des milliers
d'euros à des agences. Décliner des landings verticales avec pack de modèles :

- **Courtiers** : capacité d'emprunt, mensualités, frais de notaire ;
- **Artisans BTP** : devis instantané (peinture, carrelage, rénovation) —
  gros volume, forte valeur du lead ;
- **Experts-comptables** : coût d'un salarié, choix de statut, TVA ;
- **Agences web** : plan Agence (revente à leurs clients).

### C. B2C : des **outils d'arbitrage**, pas des calculettes de plus

Le marché des calculettes simples est en cours de saturation par des sites
générés à la chaîne (constaté sur les niches LMNP et réversion). Ce qui manque
et convertit vers le Pro 2,99 € du site : des parcours multi-étapes avec
rapport PDF (le wizard du builder est réutilisable) :

- **« Réversion 2026 »** : la réforme (demande unique dématérialisée depuis
  mars 2026, nouveaux plafonds ~25 000 €/40 000 €, proratisation entre
  ex-conjoints) crée un pic d'intérêt ; l'outil officiel ne teste que
  l'*éligibilité*, pas le *montant* multi-régimes. Aligné avec l'ADN retraite
  du site (Agirc-Arrco).
- **« Vendre ou garder mon LMNP ? »** : les ~10 simulateurs apparus depuis la
  réforme (réintégration des amortissements, cessions depuis le 15/02/2025)
  font tous le calcul de plus-value ; aucun ne fait l'arbitrage complet
  (vendre maintenant vs dans N années vs passer en nu, TRI après impôt).
- **« PER vs assurance-vie à la retraite »** : arbitrage à forte valeur,
  mal servi.

### D. À éviter

- **Simulateur TVA micro-entrepreneur « réforme 25 000 € »** : la réforme a
  été abandonnée, les seuils 2026 sont inchangés (37 500 €/85 000 €) et
  l'URSSAF couvre le besoin.
- **Calculette LMNP plus-value simple** : ~10 concurrents apparus en 18 mois.
- **Builder généraliste en anglais contre Outgrow** : guerre d'acquisition
  payante perdue d'avance ; la fenêtre est francophone (FR/BE/CH/LU/QC — le
  site est déjà localisé pour ces marchés, le builder pourra suivre).

## 7. Séquence 90 jours & critère de validation

| Période | Actions |
|---|---|
| Semaines 1–2 | Maillage site → builder · notifications email de lead · bascule payante (migration 0010 + Stripe + CTA) · offre fondateur −50 % |
| Semaines 3–6 | PDF logoté · +15 modèles métier · landings verticales (courtier, artisan, expert-comptable) |
| Semaines 7–12 | Génération IA · plugin WordPress · lancement « Simfinly Cabinet » sur la base de `/pro-conseiller` · outreach direct 100 courtiers/CGP avec démo personnalisée (un simulateur à leur marque préparé à l'avance) |

**Critère** : 10 clients payants à 90 jours → continuer d'investir le builder.
Sinon → basculer l'effort sur l'offre Cabinet (la disposition à payer y est
déjà démontrée par les prix du marché), le builder devenant sa brique
« simulateurs sur mesure ».

## Sources

- Pricing/griefs Outgrow : [hackceleration.com](https://hackceleration.com/labs/outgrow-pricing), [outgrow.co/pricing](https://outgrow.co/pricing/), [Capterra — avis Outgrow](https://www.capterra.com/p/168229/Outgrow/reviews/), [G2 — avis Outgrow](https://www.g2.com/products/outgrow/reviews)
- Comparatifs builders : [involve.me/blog/best-calculator-builders](https://www.involve.me/blog/best-calculator-builders), [convertcalculator.com — vs Calconic](https://www.convertcalculator.com/blog/convert-vs-calconic/), [Capterra — avis ConvertCalculator](https://www.capterra.com/p/176575/ConvertCalculator/reviews/)
- Marché FR du sur-mesure : [eficiens.com](https://www.eficiens.com/simulateurs-calculateurs-eficiens/), [celuga.fr](https://www.celuga.fr/developpement-simulateur-calculateur), [agence-script.com](https://www.agence-script.com/creer-un-simulateur-no-code), [nocodefactory.fr](https://www.nocodefactory.fr/blog/creer-un-simulateur-avance-en-nocode)
- Logiciels CGP : [Top 7 logiciels CGP 2026 (majors.finance)](https://support.majors.finance/ressources/top-7-logiciels-CGP-2026.html), [patriom.app](https://patriom.app/), [capitalexplorer.fr](https://www.capitalexplorer.fr/)
- Réversion 2026 : [service-public.gouv.fr — simulateur de droit](https://www.service-public.gouv.fr/particuliers/vosdroits/R64787), [espace-senior.info](https://www.espace-senior.info/comment-faire-son-calcul-de-pension-de-reversion-sans-se-tromper/)
- Réforme LMNP : [lmnp.ai/plus-value-lmnp](https://lmnp.ai/plus-value-lmnp), [calculplusvalue.fr](https://www.calculplusvalue.fr/plus-value-lmnp), [qlower.com](https://www.qlower.com/en/blog/reintegration-des-amortissements-en-lmnp-comprendre-et-anticiper-les-changements)
- Seuils TVA micro 2026 : [autoentrepreneur.urssaf.fr](https://www.autoentrepreneur.urssaf.fr/portail/accueil/sinformer-sur-le-statut/toutes-les-actualites/2026--modification-des-seuils-de.html), [legifiscal.fr](https://www.legifiscal.fr/actualites-fiscales/4436-nouveaux-seuils-micro-entreprises-annee-2026.html)
