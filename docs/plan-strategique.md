# Plan stratégique Simfinly — croissance, monétisation, expansion

*Vision CEO — juillet 2026. Complète `docs/plan-trafic.md` (acquisition) par un plan
produit + revenus + international, organisé en paliers déclenchés par des métriques,
pas par des dates.*

## Où on en est (état des lieux honnête)

**Actifs déjà construits** (souvent sous-exploités) :
- ~58 simulateurs FR couvrant retraite, immobilier, fiscalité, épargne — la plus
  large couverture francophone gratuite du marché.
- Déclinaisons pays déjà amorcées : Belgique, Suisse, Luxembourg, Québec
  (impôt + retraite + lexiques + guides).
- Version EN partielle (~10 simulateurs universels traduits).
- Pro particulier à **2,99 €/mois** : PDF Pro, sauvegardes illimitées, tableau de
  bord, synthèse patrimoniale, annotations, wizard retraite.
- Page B2B `/pro-conseiller` (CGP, experts-comptables) — vitrine sans offre payante dédiée.
- Widgets iframe embarquables, liens de partage pré-remplis, pages de partage
  public (`/api/share`, `PublicShare`), génération d'images OG.
- Blog automatisé, guides, comparatifs, lexique — machine SEO en place.

**Faiblesses** : un seul flux de revenus (Pro 2,99 €, prix bas, cible étroite),
pas d'affiliation, pas d'offre annuelle, B2B non monétisé, aucun mécanisme
communautaire — chaque visiteur repart sans en ramener d'autres.

---

## Les paliers

Chaque palier est déclenché par des seuils mesurables (Search Console + Vercel
Analytics + MRR Stripe), pas par le calendrier. On ne lance pas le palier N+1
tant que les critères de sortie du palier N ne sont pas atteints — c'est ce qui
évite de disperser un effectif d'une personne.

### Palier 0 — Mesurer et convertir (maintenant → ~10 k visites/mois)

Objectif : transformer le trafic existant en données et en premiers revenus récurrents.

1. **Instrumentation complète** : funnel visiteur → simulation terminée → partage /
   sauvegarde → inscription → Pro. Sans ça, tout le reste est du pilotage à vue.
2. **Offre annuelle Pro** : 2,99 €/mois **ou 19,90 €/an** (−45 %). L'annuel améliore
   la trésorerie et divise le churn ; le mensuel sert d'ancre.
3. **Affiliation — premier vrai levier de revenus** (voir § Monétisation) :
   3-4 partenariats sur les pages à intention forte (PER, assurance-vie,
   emprunt immobilier). C'est le modèle qui a fait vivre tous les comparateurs
   financiers ; le contenu existe déjà, il ne manque que les liens.
4. **Moments de conversion Pro** : proposer Pro au moment où l'utilisateur a le plus
   de valeur en main (fin de wizard retraite, 5e sauvegarde, export PDF), pas en
   bannière générique.

**Critères de sortie** : ≥ 10 k visites organiques/mois, taux visiteur→simulation
terminée connu, ≥ 50 abonnés Pro ou ≥ 150 €/mois toutes sources.

### Palier 1 — La boucle virale : « Scénarios publics remixables » (10 k → 50 k)

C'est **la** fonctionnalité demandée : permettre aux gens de modifier, améliorer
et **montrer** ce qu'ils ont fait — et que chaque publication ramène des visiteurs.

**Le concept : Simfinly Scénarios (fork & remix de plans financiers).**

1. Un utilisateur termine une simulation (FIRE, budget, retraite, achat immobilier…)
   et clique « Publier mon scénario ». Il choisit un titre
   (« FIRE à 45 ans avec 2 enfants en région lyonnaise »), un pseudo, et une courte
   description de sa stratégie. Les montants peuvent être publiés en relatif
   (« % du revenu ») pour lever la pudeur sur l'argent.
2. Le scénario devient une **page publique permanente** : graphiques, hypothèses,
   texte de l'auteur, image OG soignée pour X/LinkedIn/WhatsApp — chaque page est
   aussi une porte d'entrée SEO longue traîne (« plan FIRE prof des écoles »,
   « budget famille 4 personnes 3500 € »).
3. N'importe quel visiteur peut cliquer **« Remixer ce scénario »** : les hypothèses
   se chargent dans le simulateur, il les adapte à sa situation, et peut republier
   sa variante. La page d'origine affiche « remixé 34 fois » et liste les variantes —
   la fierté de l'auteur devient le moteur de distribution.
4. Une **galerie /scenarios** (tri : populaires, récents, par thème) et un **profil
   public** par auteur (ses scénarios, ses remixes, badges). C'est le « montrer aux
   autres » : les power users construisent une réputation, et chaque partage de
   profil ou de scénario ramène des inconnus dans le funnel.

**Pourquoi ça peut marcher ici précisément** : 80 % de l'infrastructure existe déjà
(liens pré-remplis, `/api/share`, PublicShare, OG images, comptes Supabase). C'est
le mécanisme qui a fait décoller des produits comme les configs partagées de
r/vosfinances, les templates Notion ou les scénarios ProjectionLab — appliqué à un
marché francophone où il n'existe pas encore.

**Lien avec Pro** : publication et remix gratuits (c'est le moteur d'acquisition,
il ne faut pas le freiner). Pro débloque la personnalisation (image de couverture,
scénarios privés illimités, statistiques de vues, mise à jour du scénario dans le
temps « mon plan FIRE, an 2 »).

**Garde-fous** : modération a priori simple (pas de champ libre long sans filtre),
pseudonymat par défaut, montants relatifs optionnels, suppression en un clic (RGPD).

Aussi dans ce palier : passage du blog + guides en rythme de croisière EN,
extension des comparatifs, bloc « articles liés » sur chaque simulateur
(reste à faire du plan trafic).

**Critères de sortie** : ≥ 50 k visites/mois, ≥ 500 scénarios publiés,
≥ 10 % du trafic entrant par pages scénarios/partages, MRR ≥ 800 €.

### Palier 2 — Monétiser le B2B et l'audience (50 k → 200 k)

1. **Pro Conseiller payant** (19–29 €/mois) : la page vitrine existe, il manque le
   produit. Contenu : PDF **marque blanche** (logo + coordonnées du cabinet),
   dossiers clients (regrouper des simulations par client), widgets sans branding
   Simfinly, scénarios modèles à envoyer aux clients. Un CGP facture une consultation
   150 € ; 29 €/mois est indolore si l'outil fait gagner 30 minutes par dossier.
2. **Effet de place de marché avec les Scénarios** : un conseiller Pro peut publier
   des scénarios modèles signés de son cabinet dans la galerie → il obtient des
   leads, Simfinly obtient du contenu expert et du trafic. C'est la jonction
   B2C-viral / B2B-revenus.
3. **Widgets & API payants pour médias** : presse éco et blogs immobiliers intègrent
   les simulateurs (gratuit avec backlink, payant en marque blanche).
4. **Sponsoring contextuel** en alternative propre à la pub display : un partenaire
   par verticale (« Simulateur PER, avec <partenaire> »), mieux payé et moins
   destructeur d'expérience qu'AdSense. AdSense seulement sur blog/guides si besoin.

**Critères de sortie** : MRR ≥ 3 000 € dont ≥ 30 % B2B, 200 k visites/mois.

### Palier 3 — Expansion internationale sérieuse (200 k+)

Voir section dédiée ci-dessous : à ce palier, on passe des pages satellites
actuelles à de vrais lancements pays.

---

## Quand s'étendre à d'autres pays

**Principe : ne pas s'étendre pour fuir un marché FR pas encore gagné.** Un nouveau
pays coûte : règles de calcul, barèmes à maintenir chaque année, SEO à zéro,
crédibilité à construire. Le déclencheur d'expansion n'est pas une date mais :
**(a)** la croissance organique FR ralentit (< +10 %/trimestre) **et**
**(b)** la conversion Pro est prouvée (on sait qu'un visiteur vaut X centimes) —
sinon on multiplie du trafic qu'on ne sait pas monétiser.

**Ordre recommandé** (coût marginal croissant) :

1. **Maintenant, à coût quasi nul — approfondir la francophonie déjà amorcée**
   (BE, CH, LU, QC). Les pages existent ; il manque le maillage, les guides dédiés,
   et 2-3 simulateurs de plus par pays (ex. BE : précompte immobilier ; CH : rachat
   LPP, 3e pilier ; QC : REER/CELI). Même langue, zéro coût de traduction,
   concurrence SEO plus faible qu'en France. **À faire dès le palier 1.**
2. **Palier 2 — pousser l'anglais générique** : les simulateurs universels
   (épargne, FIRE, budget, inflation, coût en heures) sont déjà en EN ; viser le
   trafic EN mondial sans spécificité réglementaire. Pas de promesse fiscale
   UK/US à ce stade.
3. **Palier 3 — premier vrai pays non francophone.** Candidats par ordre :
   **Espagne** (marché simulateurs peu mature, système de retraite anxiogène =
   forte demande, une seule langue), puis **Allemagne** (gros marché, forte
   culture de l'épargne, mais concurrence Finanztip/Finanzfluss déjà installée —
   y aller avec l'angle « scénarios communautaires » comme différenciateur, pas
   avec le simulateur nu). **UK/US en dernier** : concurrence maximale
   (NerdWallet, SmartAsset), CPC élevés, à n'attaquer qu'avec la boucle virale
   comme arme, jamais en frontal SEO.

**Règle de lancement pays** : 1 pays à la fois ; 5 simulateurs cœur (retraite,
impôt, salaire net, emprunt, épargne) + 10 guides + lexique ; 6 mois pour
atteindre 10 k visites/mois sinon on gèle et on passe au suivant.

---

## Créer l'envie — mécanismes de désir et de retour

Le prix bas supprime le frein ; ces mécanismes créent la *raison* de s'inscrire,
de revenir et de montrer le site aux autres. Classés par ratio impact/effort,
les trois premiers sont candidats au MVP avec les Scénarios.

1. **Score Simfinly (0–100)** — un score de santé financière / préparation
   retraite calculé à la fin de chaque simulation, avec jauge colorée et
   3 conseils pour l'améliorer. Les gens veulent *un chiffre* qui les résume,
   et surtout l'améliorer : chaque conseil renvoie vers un autre simulateur
   (boucle interne), et refaire la simulation pour voir le score monter est le
   moteur de retour. Badge image partageable (« Mon score retraite : 72/100 —
   et toi ? ») : le défi implicite fait venir les proches.
2. **Benchmark anonyme entre pairs** — « Vous épargnez plus que 68 % des
   30–35 ans » à partir des données agrégées et anonymisées des simulations.
   C'est la question que tout le monde se pose et que personne n'ose poser à
   ses amis. Aucun site FR gratuit ne le propose : différenciateur fort,
   irrésistible à partager. (Seuil : n ≥ 100 par tranche avant d'afficher,
   mention transparente de la méthode.)
3. **Pro gagné par l'action, pas seulement acheté** — publier son premier
   scénario = 1 mois Pro offert ; chaque filleul parrainé = 1 mois offert.
   Au prix fondateur, offrir un mois coûte moins d'1 € et transforme chaque
   utilisateur en canal d'acquisition. L'envie naît aussi de « débloquer ».
4. **Bilan annuel « Votre année financière »** (façon Spotify Wrapped) —
   en décembre, carte animée récapitulant score, progression, simulations
   faites, objectifs atteints. Rendez-vous annuel très partageable, presque
   gratuit à produire avec l'infra OG existante.
5. **Objectifs à progression visible** — l'utilisateur fixe un objectif
   (apport, âge FIRE, pension cible), obtient une barre de progression, des
   jalons célébrés (50 %, 75 %…) et peut rendre la barre publique sur son
   profil. Se marie naturellement aux Scénarios remixables.
6. **Défis communautaires saisonniers** — « 52 semaines d'épargne »,
   « mois sans dépense superflue », avec carte avant/après partageable et
   page de classement anonyme. Crée des pics de trafic récurrents et du
   contenu social sans coût éditorial.
7. **Rappels de progression** — « Il y a un an, votre score était de 61.
   Où en êtes-vous ? » : e-mail annuel/semestriel automatique qui fait revenir
   les comptes dormants au moment où ils peuvent constater un progrès.
8. **Mises en avant éditoriales** — « Scénario de la semaine », top remixeurs
   du mois sur la page d'accueil : la perspective d'être mis en avant pousse
   les auteurs à soigner et promouvoir leurs scénarios.

**Fil conducteur** : score → objectif → scénario publié → remix → benchmark.
Chaque mécanisme alimente le suivant ; aucun n'exige de payer, tous donnent
une raison de créer un compte — et le Pro fondateur à 0,99 € devient un achat
d'impulsion au premier moment de fierté.

---

## Monétisation — les flux, du plus sûr au plus ambitieux

| Flux | Prix | Palier | Potentiel | Risque |
|---|---|---|---|---|
| Pro particulier (existant) | lancement 0,99 €/mois · 9,90 €/an (fondateurs), puis 2,99 €/19,90 € | 0 | Moyen | Faible |
| **Affiliation** (PER, AV, courtiers crédit, banques en ligne) | CPA 30–100 €/lead | 0 | **Élevé** | Faible |
| Rapport one-shot (bilan retraite complet PDF, sans abonnement) | 9,90 € | 1 | Moyen | Faible |
| Pro Conseiller B2B (marque blanche, dossiers clients) | 19–29 €/mois | 2 | Élevé | Moyen |
| Widgets/API marque blanche pour médias | 49–99 €/mois | 2 | Moyen | Moyen |
| Sponsoring par verticale | forfait/mois | 2 | Élevé | Moyen |
| Leads qualifiés vers CGP partenaires (via scénarios/wizard) | 50–150 €/lead | 3 | Très élevé | Élevé (réglementaire) |

Points d'attention :
- **L'affiliation est le levier n° 1 négligé** : les pages PER, assurance-vie et
  emprunt captent exactement l'intention que les partenaires paient cher. À
  déployer avec transparence (mention claire) pour ne pas éroder la confiance,
  qui est l'actif du site.
- **Le rapport one-shot** capte les 95 % qui ne s'abonneront jamais mais paieraient
  une fois au moment d'une décision (départ retraite, achat immobilier). Stripe
  est déjà branché ; c'est un `?action=` de plus dans `api/stripe.js`.
- **La mise en relation CGP** (palier 3) est le modèle le plus lucratif du secteur,
  mais exige un statut/encadrement (CIF, démarchage) — à instruire juridiquement
  avant d'ouvrir.

---

## Les 90 prochains jours (dans l'ordre)

1. Funnel analytics complet + tableau de bord hebdo (visites, simulations, Pro, MRR).
2. Offre fondateur (0,99 €/mois · 9,90 €/an à vie, 1 000 places, compteur visible)
   + écrans d'upsell contextuels.
3. 3 partenariats d'affiliation en ligne (PER, assurance-vie, courtier crédit).
4. **MVP Scénarios publics** : publier + page publique + bouton « Remixer » sur
   3 simulateurs à fort potentiel émotionnel (FIRE, budget, retraite). Galerie
   minimale. Mesurer le taux de publication et le trafic entrant par scénario.
5. Approfondissement francophonie : 2 simulateurs + guides par pays BE/CH/QC.
6. Si le MVP Scénarios prend (≥ 5 % des simulations terminées publiées) :
   profils publics, remix count, badges — sinon itérer sur l'incitation avant
   d'élargir.

## KPI à suivre chaque semaine

- Visites organiques (Search Console) et pages d'entrée.
- Taux de complétion de simulation ; taux de partage/publication.
- **Coefficient viral** : visiteurs arrivés via scénarios/partages ÷ scénarios publiés.
- Conversion visiteur → compte → Pro ; MRR par flux ; churn mensuel vs annuel.
- Revenus d'affiliation par page.
