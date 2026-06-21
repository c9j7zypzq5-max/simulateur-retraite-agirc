// Guides thématiques (pages pilier) : agrègent simulateurs, termes du lexique et
// articles de blog d'une même thématique. Sert le SEO (clusters) et la navigation.
//
// Champs : slug, title, icon (nom lucide-react), category, intro, sections[{h2, body[]}],
//          sims[chemins], terms[slugs lexique], blogCats[catégories blog].

export const GUIDES = [
  {
    slug: 'preparer-sa-retraite',
    title: 'Préparer sa retraite',
    icon: 'Clock',
    category: 'Retraite',
    intro: "De l'estimation de vos pensions à l'optimisation de votre départ : tous les outils et notions pour préparer sereinement votre retraite.",
    sections: [
      {
        h2: 'Estimer ses pensions',
        body: [
          "Votre future retraite combine une pension de base (régime général ou statutaire) et une ou plusieurs complémentaires. Commencez par estimer chaque brique avec le simulateur correspondant à votre statut, puis additionnez-les pour obtenir une vision d'ensemble.",
          "Pensez à vérifier votre nombre de trimestres et votre salaire annuel moyen, deux paramètres décisifs du calcul.",
        ],
      },
      {
        h2: 'Optimiser son départ',
        body: [
          "Partir avant d'avoir le taux plein entraîne une décote définitive ; continuer au-delà permet une surcote. Comparez plusieurs âges de départ pour mesurer l'impact sur votre pension.",
          "Un Plan d'Épargne Retraite (PER) peut compléter vos revenus tout en réduisant votre impôt pendant la vie active.",
        ],
      },
    ],
    sims: ['/simulateurs/agirc-arrco', '/simulateurs/cnav', '/simulateurs/fonction-publique', '/simulateurs/per', '/simulateurs/retraite-progressive'],
    terms: ['cnav', 'agirc-arrco', 'taux-plein', 'decote', 'surcote', 'trimestre', 'per', 'reversion'],
    blogCats: ['Retraite'],
  },
  {
    slug: 'acheter-sa-residence-principale',
    title: 'Acheter sa résidence principale',
    icon: 'Home',
    category: 'Immobilier',
    intro: "Capacité d'emprunt, coût du crédit, aides : le parcours complet pour financer l'achat de votre logement au meilleur coût.",
    sections: [
      {
        h2: 'Définir son budget',
        body: [
          "Avant de chercher un bien, déterminez votre capacité d'emprunt : elle dépend de vos revenus, de vos charges et du taux d'endettement maximal (≈ 35 %). N'oubliez pas l'apport et les frais de notaire.",
        ],
      },
      {
        h2: 'Comparer les offres de prêt',
        body: [
          "Le TAEG est le seul indicateur qui agrège intérêts, assurance et frais : c'est lui qu'il faut comparer. Si vous êtes primo-accédant, le Prêt à Taux Zéro peut compléter votre financement sous conditions de ressources.",
        ],
      },
    ],
    sims: ['/simulateurs/emprunt-immobilier', '/simulateurs/ptz', '/simulateurs/rendement-locatif'],
    terms: ['taeg', 'taux-endettement', 'capacite-emprunt', 'apport', 'frais-notaire', 'ptz', 'pel', 'taux-usure'],
    blogCats: ['Immobilier'],
  },
  {
    slug: 'construire-son-epargne',
    title: 'Construire son épargne et investir',
    icon: 'TrendingUp',
    category: 'Finances',
    intro: "Des livrets aux marchés actions : comment faire fructifier votre argent sur le long terme grâce aux intérêts composés et aux bonnes enveloppes.",
    sections: [
      {
        h2: 'Le moteur : les intérêts composés',
        body: [
          "Plus on commence tôt, plus l'effet boule de neige des intérêts composés est puissant. La régularité des versements compte souvent davantage que le montant ou le market timing.",
          "Visez un rendement réel positif (au-dessus de l'inflation) pour préserver et accroître votre pouvoir d'achat.",
        ],
      },
      {
        h2: 'Choisir ses enveloppes',
        body: [
          "Le PEA et l'assurance-vie offrent une fiscalité avantageuse sur le long terme. Au sein de chaque enveloppe, dosez fonds en euros et unités de compte (ETF, par exemple) selon votre horizon et votre tolérance au risque.",
          "La diversification réduit le risque sans sacrifier le rendement attendu.",
        ],
      },
    ],
    sims: ['/simulateurs/epargne', '/simulateurs/comparateur', '/simulateurs/assurance-vie', '/simulateurs/per', '/simulateurs/patrimoine'],
    terms: ['interets-composes', 'etf', 'pea', 'assurance-vie', 'diversification', 'dca', 'inflation', 'rendement-reel'],
    blogCats: ['Finances', 'Épargne'],
  },
  {
    slug: 'independance-financiere-fire',
    title: 'Atteindre l\'indépendance financière (FIRE)',
    icon: 'Flame',
    category: 'FIRE',
    intro: "Vivre de ses investissements et choisir quand travailler : la méthode FIRE, ses variantes et les leviers pour y parvenir en France.",
    sections: [
      {
        h2: 'Fixer son objectif',
        body: [
          "Le mouvement FIRE vise un capital d'environ 25 fois les dépenses annuelles, selon la règle des 4 %. En France, un horizon long et la fiscalité invitent à un taux de retrait un peu plus prudent.",
        ],
      },
      {
        h2: 'Le levier décisif',
        body: [
          "Plus que le rendement, c'est votre taux d'épargne qui détermine la vitesse vers l'indépendance. Réduire ses dépenses augmente l'épargne ET abaisse le capital cible : un double effet puissant.",
        ],
      },
    ],
    sims: ['/simulateurs/fire', '/simulateurs/epargne', '/simulateurs/budget', '/simulateurs/comparateur'],
    terms: ['fire', 'swr', 'taux-epargne', 'interets-composes', 'diversification'],
    blogCats: ['FIRE'],
  },
  {
    slug: 'reduire-ses-impots',
    title: 'Réduire ses impôts légalement',
    icon: 'Receipt',
    category: 'Impôts',
    intro: "Comprendre comment fonctionne l'impôt et activer les bons leviers : déductions, enveloppes et dispositifs pour payer moins, en toute légalité.",
    sections: [
      {
        h2: 'Comprendre avant d\'optimiser',
        body: [
          "Avant de chercher à réduire son impôt, il faut connaître sa tranche marginale d'imposition (TMI) : c'est elle qui détermine le gain réel d'une déduction. Plus votre TMI est élevée, plus une déduction rapporte.",
          "Distinguez aussi déduction (sur le revenu), réduction d'impôt et crédit d'impôt (remboursable) : leurs effets ne sont pas les mêmes.",
        ],
      },
      {
        h2: 'Les principaux leviers',
        body: [
          "Le PER déduit vos versements du revenu imposable, dans un plafond — d'autant plus efficace que votre TMI est haute. L'assurance-vie offre une fiscalité douce après 8 ans.",
          "Côté immobilier, le déficit foncier et le régime réel peuvent effacer une partie de vos revenus fonciers. Pensez aussi aux crédits d'impôt (emploi à domicile, garde d'enfants).",
        ],
      },
    ],
    sims: ['/simulateurs/impot-revenu', '/simulateurs/per', '/simulateurs/plus-value-immobiliere', '/simulateurs/assurance-vie', '/simulateurs/rendement-locatif'],
    terms: ['tmi', 'ir', 'per', 'pfu', 'abattement', 'deficit-foncier', 'credit-impot', 'micro-foncier'],
    blogCats: ['Fiscalité'],
  },
  {
    slug: 'investir-en-bourse',
    title: 'Investir en bourse',
    icon: 'BarChart2',
    category: 'Finances',
    intro: "ETF, PEA, assurance-vie : comprendre les marchés financiers et construire un portefeuille diversifié adapté à votre profil de risque.",
    sections: [
      {
        h2: 'Pourquoi investir en bourse',
        body: [
          "Sur longue période, les marchés actions ont historiquement délivré un rendement réel (après inflation) d'environ 5 à 7 % par an, bien au-dessus des livrets réglementés. La clé : accepter la volatilité à court terme pour profiter de la croissance long terme.",
          "Le DCA (investissement régulier) permet de lisser les points d'entrée et d'éviter le piège du market timing.",
        ],
      },
      {
        h2: 'Choisir les bonnes enveloppes',
        body: [
          "Le PEA (Plan d'Épargne en Actions) offre une exonération d'impôt sur les plus-values après 5 ans de détention, en contrepartie d'une limitation aux actions européennes et assimilées (via ETF monde).",
          "L'assurance-vie en unités de compte donne accès à des ETF monde sans plafond, avec une fiscalité douce après 8 ans et des avantages successoraux uniques en France.",
        ],
      },
    ],
    sims: ['/simulateurs/epargne', '/simulateurs/comparateur', '/simulateurs/patrimoine'],
    terms: ['etf', 'pea', 'assurance-vie', 'dca', 'diversification', 'volatilite', 'dividende', 'ter'],
    blogCats: ['Finances', 'Épargne'],
  },
  {
    slug: 'maitriser-son-budget',
    title: 'Maîtriser son budget mensuel',
    icon: 'PiggyBank',
    category: 'Budget',
    intro: "Méthodes de budgétisation, épargne de précaution et réduction des dépenses : les bases pour reprendre le contrôle de vos finances personnelles.",
    sections: [
      {
        h2: 'Faire le bilan',
        body: [
          "Commencez par lister toutes vos sources de revenus et vos dépenses sur trois mois. Catégorisez-les en fixes (loyer, abonnements) et variables (alimentation, loisirs) pour voir où votre argent part réellement.",
          "La règle 50/30/20 est un bon point de départ : 50 % pour les besoins essentiels, 30 % pour les envies, 20 % pour l'épargne.",
        ],
      },
      {
        h2: "Construire une épargne de précaution",
        body: [
          "Avant d'investir, constituez un matelas de sécurité de 3 à 6 mois de dépenses sur un livret liquide (Livret A, LDDS). C'est votre filet de protection contre les imprévus.",
          "Automatisez vos virements d'épargne dès le jour de paye : vous dépensez ce qui reste, pas l'inverse.",
        ],
      },
    ],
    sims: ['/simulateurs/budget', '/simulateurs/epargne', '/simulateurs/cout-en-heures'],
    terms: ['taux-epargne', 'reste-a-vivre', 'epargne-precaution', 'budget-50-30-20', 'livret-a', 'ldds'],
    blogCats: ['Budget'],
  },
  {
    slug: 'investissement-locatif',
    title: 'Investissement locatif',
    icon: 'Building2',
    category: 'Immobilier',
    intro: "Rendement brut et net, fiscalité des revenus fonciers, effet de levier : tout pour évaluer et optimiser un investissement dans la pierre.",
    sections: [
      {
        h2: 'Évaluer la rentabilité',
        body: [
          "Le rendement brut (loyers annuels / prix d'achat) donne une première indication, mais c'est le rendement net (après charges, taxe foncière et impôt) qui compte vraiment. Un bien à 5 % brut peut tomber à 2-3 % net selon la fiscalité.",
          "L'effet de levier du crédit amplifie le rendement sur fonds propres tant que le taux d'intérêt est inférieur au rendement de l'actif.",
        ],
      },
      {
        h2: 'Choisir son régime fiscal',
        body: [
          "En location vide, le régime micro-foncier (abattement 30 %) est simple sous 15 000 € de loyers ; le régime réel permet de déduire charges et intérêts d'emprunt, parfois créant un déficit foncier imputable sur le revenu.",
          "En meublé (LMNP), le régime réel avec amortissement du bien permet souvent d'effacer fiscalement vos revenus locatifs pendant de nombreuses années.",
        ],
      },
    ],
    sims: ['/simulateurs/rendement-locatif', '/simulateurs/emprunt-immobilier', '/simulateurs/plus-value-immobiliere'],
    terms: ['rendement-locatif', 'effet-levier', 'micro-foncier', 'deficit-foncier', 'lmnp', 'sci', 'plus-value-immobiliere', 'garantie-loyers-impayes'],
    blogCats: ['Immobilier'],
  },
  {
    slug: 'comprendre-sa-retraite-complementaire',
    title: 'Comprendre la retraite complémentaire',
    icon: 'Briefcase',
    category: 'Retraite',
    intro: "Fonctionnement par points, valeur du point, coefficient d'abattement : le guide complet sur l'Agirc-Arrco, régime complémentaire de millions de salariés du privé.",
    sections: [
      {
        h2: 'Comment fonctionnent les points',
        body: [
          "À chaque euro de cotisation correspond un nombre de points selon le salaire de référence de l'année. À la retraite, vos points sont multipliés par la valeur du point (fixée par l'Agirc-Arrco) pour obtenir votre pension complémentaire annuelle.",
          "Contrairement à la retraite de base (trimestres), le système par points est proportionnel : plus vous gagnez et cotisez, plus vous accumulez de points.",
        ],
      },
      {
        h2: "Le coefficient d'abattement temporaire",
        body: [
          "Si vous partez dès que vous avez le taux plein (sans attendre 1 à 4 ans de plus), l'Agirc-Arrco applique un coefficient d'abattement de 10 % pendant 3 ans. Pour l'éviter, il faut différer son départ.",
          "Ce mécanisme, souvent méconnu, peut réduire significativement votre première pension complémentaire. Notre simulateur vous aide à mesurer l'impact.",
        ],
      },
    ],
    sims: ['/simulateurs/agirc-arrco', '/simulateurs/cnav', '/simulateurs/retraite-progressive'],
    terms: ['agirc-arrco', 'points-retraite', 'pass', 'taux-plein', 'decote', 'surcote', 'sam', 'cumul-emploi-retraite'],
    blogCats: ['Retraite'],
  },
  {
    slug: 'gerer-ses-credits',
    title: 'Gérer et optimiser ses crédits',
    icon: 'CreditCard',
    category: 'Finances',
    intro: "Crédit conso, rachat de crédit, remboursement anticipé : les stratégies pour réduire le coût de vos emprunts et retrouver des marges de manœuvre financières.",
    sections: [
      {
        h2: 'Prioriser le remboursement',
        body: [
          "Tous les crédits ne se valent pas : un découvert bancaire ou un crédit renouvelable peut afficher un TAEG supérieur à 15 %, quand un prêt immobilier est souvent sous 4 %. Remboursez les crédits les plus chers en premier.",
          "La méthode « avalanche » (priorité au taux le plus élevé) minimise les intérêts totaux payés, même si la méthode « boule de neige » (priorité au solde le plus faible) est psychologiquement motivante.",
        ],
      },
      {
        h2: 'Rachat et renégociation',
        body: [
          "Si les taux ont baissé depuis votre souscription, renégocier avec votre banque ou faire racheter le crédit par un concurrent peut faire économiser des milliers d'euros. Comparez le gain avec les frais de remboursement anticipé.",
          "Le rachat de crédits regroupe plusieurs emprunts en un seul, réduisant la mensualité mais allongeant la durée et le coût total : à réserver aux situations de difficultés de trésorerie.",
        ],
      },
    ],
    sims: ['/simulateurs/credit-conso', '/simulateurs/emprunt-immobilier', '/simulateurs/comparateur'],
    terms: ['taeg', 'taux-endettement', 'amortissement', 'capacite-emprunt', 'pfu'],
    blogCats: ['Finances'],
  },
];

export const GUIDES_BY_SLUG = Object.fromEntries(GUIDES.map(g => [g.slug, g]));
