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
  {
    slug: 'flat-tax-ou-bareme',
    title: 'Flat tax (PFU) ou barème progressif ?',
    icon: 'Percent',
    category: 'Impôts',
    intro: "Depuis 2018, les revenus de capitaux mobiliers (dividendes, plus-values, intérêts) sont imposés par défaut au Prélèvement Forfaitaire Unique (PFU) de 30 % — ou 31,4 % en 2026. Mais l'option pour le barème progressif peut être plus avantageuse si votre tranche marginale est basse. Guide complet pour choisir.",
    sections: [
      {
        h2: 'Le PFU : simple mais pas toujours optimal',
        body: [
          "Le Prélèvement Forfaitaire Unique agrège 12,8 % d'IR et 18,6 % de prélèvements sociaux (PS) depuis 2025, soit 31,4 % au total en 2026. Il s'applique automatiquement à tous vos revenus de capitaux mobiliers sans démarche particulière.",
          "Son principal avantage : la simplicité. Il est prélevé à la source sur les revenus bancaires et vous n'avez aucune case à cocher lors de votre déclaration (sauf pour exercer l'option barème).",
        ],
      },
      {
        h2: "Quand l'option barème est-elle gagnante ?",
        body: [
          "Si votre tranche marginale d'imposition (TMI) est à 0 % ou 11 %, l'option barème est presque toujours plus avantageuse : votre taux d'IR est inférieur à 12,8 %. Pour les dividendes, l'abattement de 40 % réduit encore la base imposable.",
          "À partir de 30 % de TMI, le PFU devient généralement optimal pour les dividendes et plus-values. Cependant, la CSG déductible de 6,8 % peut légèrement améliorer l'option barème pour les revenus élevés. Simulez les deux options pour comparer.",
          "Attention : l'option barème est globale — elle s'applique à tous vos revenus de capitaux mobiliers de l'année. Impossible d'optimiser revenu par revenu.",
        ],
      },
    ],
    sims: ['/simulateurs/flat-tax', '/simulateurs/impot-revenu', '/simulateurs/assurance-vie'],
    terms: ['pfu', 'tmi', 'dividende', 'plus-value-mobiliere', 'pea'],
    blogCats: ['Fiscalité'],
  },
  {
    slug: 'donation-du-vivant',
    title: 'Transmettre avec une donation de son vivant',
    icon: 'Gift',
    category: 'Patrimoine',
    intro: "La donation de son vivant est l'un des outils de transmission les plus efficaces : abattements renouvelables tous les 15 ans, droits réduits, et possibilité d'organiser sereinement sa succession. Mode d'emploi.",
    sections: [
      {
        h2: 'Les abattements : le cœur de l\'avantage fiscal',
        body: [
          "Chaque parent peut donner jusqu'à 100 000 € à chaque enfant en franchise de droits, tous les 15 ans. Un couple peut donc transmettre 200 000 € par enfant sans fiscalité. En commençant tôt, il est possible de transmettre un patrimoine significatif sur plusieurs cycles.",
          "Des abattements spécifiques s'ajoutent : 31 865 € pour les petits-enfants, 5 310 € pour les arrière-petits-enfants. Le don familial de sommes d'argent (80 724 € entre 18 et 80 ans, donateur et donataire) offre une exonération supplémentaire.",
        ],
      },
      {
        h2: 'Donation vs succession : ce qu\'il faut comparer',
        body: [
          "Donner de son vivant permet de « purger » la plus-value latente sur certains actifs (immobilier, parts de société) car le donataire reprend le bien à sa valeur du jour de la donation, non au coût d'acquisition du donateur. C'est un avantage considérable pour les biens fortement valorisés.",
          "La réserve héréditaire protège les enfants : toute donation dépouillant un héritier réservataire au-delà de la quotité disponible peut être remise en cause lors de la succession. Planifiez avec un notaire pour rester dans les limites légales.",
        ],
      },
    ],
    sims: ['/simulateurs/donation', '/simulateurs/succession'],
    terms: ['abattement', 'assurance-vie', 'tmi'],
    blogCats: ['Fiscalité'],
  },
  {
    slug: 'retraite-anticipee',
    title: 'Partir à la retraite anticipée',
    icon: 'CalendarCheck',
    category: 'Retraite',
    intro: "La retraite anticipée permet de partir avant l'âge légal (64 ans depuis la réforme 2023) pour les assurés ayant commencé à travailler tôt ou validé un nombre élevé de trimestres. Conditions, calcul et impact sur la pension.",
    sections: [
      {
        h2: 'Les deux régimes de retraite anticipée',
        body: [
          "La « carrière longue » (RACL) permet de partir avant 64 ans si vous avez commencé à travailler avant 21 ans et validé un nombre de trimestres supérieur à la durée requise pour votre génération. Quatre bornes d'âge s'appliquent (58, 60, 62, 63 ans) selon l'âge de début et les trimestres cotisés.",
          "La retraite anticipée pour handicap (RAH) permet de partir à 55 ans avec un taux d'incapacité permanente ≥ 50 % et un nombre de trimestres cotisés réduit. La pension est calculée au taux plein sans décote.",
        ],
      },
      {
        h2: 'Impact sur le montant de la pension',
        body: [
          "Partir tôt réduit mécaniquement votre pension : moins de trimestres cotisés = salaire annuel moyen (SAM) calculé sur moins d'années, et une durée de versement plus longue que l'assureur doit couvrir. L'impact sur l'Agirc-Arrco peut être significatif si vous partez avant le taux plein.",
          "Évaluez l'opportunité en comparant le cumul de pensions sur votre espérance de vie estimée : partir 2 ans plus tôt vous prive de 2 années de cotisations mais vous donne 2 années de pension de plus. Le simulateur calcule le point d'équilibre.",
        ],
      },
    ],
    sims: ['/simulateurs/trimestres', '/simulateurs/retraite-anticipee', '/simulateurs/agirc-arrco', '/simulateurs/cnav'],
    terms: ['taux-plein', 'trimestre', 'decote', 'cnav', 'agirc-arrco'],
    blogCats: ['Retraite'],
  },
  {
    slug: 'investir-son-premier-10k',
    title: 'Comment investir ses premiers 10 000 €',
    icon: 'Sprout',
    category: 'Finances',
    intro: "Vous avez épargné 10 000 € et vous vous demandez comment les faire fructifier intelligemment ? Ce guide vous donne une méthode concrète, des enveloppes aux supports, pour investir votre premier capital sans erreur de débutant.",
    sections: [
      {
        h2: "Étape 1 : constituer son épargne de précaution (0-3 000 €)",
        body: [
          "Avant tout investissement, conservez l'équivalent de 3 à 6 mois de dépenses sur un livret réglementé (Livret A ou LDDS). C'est votre coussin de sécurité : si une dépense imprévue survient, vous n'aurez pas à vendre vos placements à un mauvais moment. Pour un train de vie de 2 000 €/mois, visez 6 000-12 000 € en réserve avant d'investir.",
          "Avec 10 000 €, si vous n'avez pas encore votre épargne de précaution, commencez par y allouer 3 000-5 000 €. Le reste peut partir en investissement long terme.",
        ],
      },
      {
        h2: "Étape 2 : choisir les bonnes enveloppes fiscales",
        body: [
          "En France, deux enveloppes fiscales sont incontournables : le PEA (exonération d'IR sur les plus-values après 5 ans, plafond 150 000 €) et l'assurance-vie (fiscalité douce après 8 ans, outil de transmission). Pour un premier investissement de 5 000-7 000 €, ouvrez dès maintenant un PEA (même avec 100 €) pour démarrer le compteur de 5 ans — vous ne pouvez pas rétroactivement bénéficier de l'ancienneté.",
          "Si votre TMI est élevée (30 % ou plus), alimentez également un PER pour défiscaliser : chaque euro versé vous rembourse 30 centimes d'impôt immédiatement.",
        ],
      },
      {
        h2: "Étape 3 : investir en ETF avec la méthode DCA",
        body: [
          "Pour votre capital actions, les ETF indiciels (trackers MSCI World, S&P 500) sont le support le plus recommandé par les études académiques pour un investisseur particulier : frais très bas (0,07-0,30 %/an), diversification mondiale instantanée, performance proche du marché. Évitez de tout investir d'un coup — utilisez le DCA (investissement régulier mensuel) pour lisser le risque d'entrer au mauvais moment.",
          "Exemple de répartition pour 10 000 € : 3 000 € en Livret A (épargne de précaution), 5 000 € en ETF MSCI World sur PEA (investis en 5 fois, 1 000 €/mois), 2 000 € en assurance-vie fonds euros (réserve disponible). Cette répartition simple et diversifiée est efficace pour commencer.",
        ],
      },
      {
        h2: "Étape 4 : les erreurs à éviter",
        body: [
          "Les pièges classiques du débutant : investir en Bourse des fonds dont vous avez besoin dans moins de 5 ans (la Bourse peut baisser de 40 % et mettre 3-5 ans à se rétablir), acheter des actions individuelles sans diversification, suivre les « tuyaux » de réseaux sociaux, ou vendre lors des baisses par panique.",
          "La règle d'or : investissez seulement les fonds dont vous n'aurez pas besoin avant 5-10 ans minimum. Tout le reste doit rester liquide (livret, compte courant).",
        ],
      },
    ],
    sims: ['/simulateurs/epargne', '/simulateurs/patrimoine', '/simulateurs/per', '/simulateurs/comparateur'],
    terms: ['etf', 'dca', 'pea', 'assurance-vie', 'livret-a', 'taux-epargne', 'interets-composes', 'diversification'],
    blogCats: ['Épargne', 'Finances'],
  },
  {
    slug: 'comprendre-impot-revenu-2026',
    title: "Comprendre l'impôt sur le revenu en 2026",
    icon: 'Receipt',
    category: 'Impôts',
    intro: "Barème, tranches, quotient familial, taux marginal, taux moyen : l'impôt sur le revenu est complexe mais ses mécanismes sont logiques. Ce guide vous explique comment est calculé votre IR 2026 et comment vous pouvez légalement en réduire le montant.",
    sections: [
      {
        h2: "Le barème 2026 : comment fonctionnent les tranches ?",
        body: [
          "L'impôt sur le revenu français est progressif : chaque tranche de revenu est imposée à un taux différent. En 2026 (sur les revenus 2025), les taux sont : 0 % jusqu'à 11 497 €, 11 % de 11 497 à 29 315 €, 30 % de 29 315 à 83 823 €, 41 % de 83 823 à 180 294 €, 45 % au-delà.",
          "Ces taux s'appliquent par tranche, pas sur la totalité du revenu. Un contribuable avec 50 000 € de revenu imposable ne paie pas 30 % sur 50 000 €, mais 0 % sur les premiers 11 497 €, 11 % de 11 497 à 29 315 €, et 30 % de 29 315 à 50 000 €. Son taux marginal (TMI) est 30 %, mais son taux moyen est environ 16 %.",
        ],
      },
      {
        h2: "Le quotient familial : l'avantage des enfants",
        body: [
          "L'impôt n'est pas calculé sur les revenus bruts mais sur les revenus divisés par le nombre de parts : 1 part pour un célibataire, 2 pour un couple, +0,5 part par enfant (1 part pour le 3e enfant). Ce quotient familial réduit l'impôt en faisant « glisser » une partie des revenus vers des tranches plus basses.",
          "L'avantage fiscal du quotient familial est plafonné : en 2026, le gain par demi-part supplémentaire est limité à 1 759 € d'impôt économisé. Au-delà, le plafonnement s'applique et l'avantage est réduit.",
        ],
      },
      {
        h2: "Le prélèvement à la source : comment ça marche ?",
        body: [
          "Depuis 2019, l'impôt est prélevé directement sur vos revenus chaque mois par votre employeur. Le taux de prélèvement affiché sur votre bulletin de paie est calculé par l'administration fiscale en fonction de votre dernière déclaration. Vous déclarez vos revenus en avril-mai, et l'administration ajuste (remboursement ou complément) en septembre.",
          "Vous pouvez opter pour un taux neutre (confidentiel vis-à-vis de l'employeur, mais vous payez la différence directement à l'administration) ou un taux individualisé pour les couples.",
        ],
      },
      {
        h2: "Les principaux leviers de réduction de l'impôt",
        body: [
          "Déductions du revenu imposable : versements PER (10 % des revenus, max 37 094 € en 2026), pension alimentaire versée, frais réels professionnels si supérieurs à l'abattement de 10 %. Réductions d'impôt : investissement Pinel, dons aux associations (66 % ou 75 %). Crédits d'impôt : garde d'enfants (50 % des dépenses), emploi à domicile (50 %), transition énergétique.",
          "La différence clé : une déduction réduit le revenu imposable (économie = déduction × TMI), tandis qu'une réduction ou un crédit s'impute directement sur l'impôt dû (économie = montant de la réduction).",
        ],
      },
    ],
    sims: ['/simulateurs/impot-revenu', '/simulateurs/per'],
    terms: ['tmi', 'taux-moyen-imposition', 'quotient-familial', 'ir', 'rfr', 'prelevement-source', 'credit-impot', 'per', 'optimisation-fiscale'],
    blogCats: ['Fiscalité'],
  },
  {
    slug: 'preparer-retraite-50-ans',
    title: 'Préparer sa retraite à 50 ans : le guide complet',
    icon: 'CalendarClock',
    category: 'Retraite',
    intro: "À 50 ans, vous avez encore 14-18 ans de cotisations devant vous — et c'est exactement le bon moment pour agir. Les leviers sont encore nombreux et les effets sont puissants. Ce guide détaille les priorités pour préparer au mieux votre retraite.",
    sections: [
      {
        h2: "Faire le point sur ses droits acquis",
        body: [
          "Commencez par télécharger votre relevé de carrière sur info-retraite.fr. Vérifiez chaque ligne : les trimestres sont-ils tous validés ? Votre salaire annuel moyen (SAM) reflète-t-il bien vos 25 meilleures années ? Des erreurs existent parfois (stages, premier emploi, service national) et peuvent être corrigées jusqu'à 3 ans avant l'âge légal.",
          "Calculez votre projection : combien de trimestres aurez-vous à 64 ans ? Avez-vous le taux plein ou manquerez-vous de trimestres ? La réponse conditionne toutes vos décisions.",
        ],
      },
      {
        h2: "Alimenter un PER : l'ultime fenêtre d'optimisation",
        body: [
          "À 50-55 ans, votre TMI est souvent à son maximum (30-41 % ou plus pour les cadres). C'est le moment où le PER est le plus avantageux : chaque euro versé vous rembourse immédiatement 30-41 centimes d'impôt. À la retraite, votre TMI sera probablement plus faible — c'est là que vous récupérerez les fonds avec moins de fiscalité.",
          "Vous avez probablement des plafonds non utilisés des 3 dernières années reportables. Consultez votre avis d'imposition pour connaître votre enveloppe disponible. Un versement important cette année peut générer une économie fiscale substantielle.",
        ],
      },
      {
        h2: "Racheter des trimestres : est-ce rentable ?",
        body: [
          "Si vous manquez de trimestres pour le taux plein, le rachat de trimestres (VFR) est une option. Le coût augmente avec l'âge : il est plus élevé à 50 ans qu'à 40 ans, mais le délai de retour est aussi plus court (vous êtes plus proche de la retraite). En règle générale, le rachat est rentable si vous vivez au moins 8-10 ans après la retraite.",
          "Demandez une simulation à votre caisse de retraite avant de vous engager. Comparez le coût du rachat (déductible de l'impôt) à l'augmentation mensuelle de pension obtenue sur votre espérance de vie.",
        ],
      },
      {
        h2: "Préparer la transition : la retraite progressive",
        body: [
          "La retraite progressive (disponible à partir de 60 ans avec 150 trimestres) permet de réduire progressivement votre activité tout en touchant une fraction de votre pension. C'est une option intermédiaire qui peut réduire le stress du travail, maintenir des revenus et continuer à cotiser pour améliorer la pension finale.",
          "Si vous êtes artisan, commerçant ou profession libérale, vérifiez les spécificités de votre régime (SSI, CARMF, CIPAV…) — les règles et le taux de remplacement sont différents du régime général.",
        ],
      },
    ],
    sims: ['/simulateurs/cnav', '/simulateurs/agirc-arrco', '/simulateurs/per', '/simulateurs/trimestres', '/simulateurs/retraite-progressive'],
    terms: ['taux-remplacement', 'sam', 'taux-plein', 'rachat-trimestres', 'per', 'plafond-epargne-retraite', 'retraite-progressive', 'tmi'],
    blogCats: ['Retraite'],
  },
  {
    slug: 'optimiser-transmission-patrimoine',
    title: 'Optimiser la transmission de son patrimoine',
    icon: 'Gift',
    category: 'Impôts',
    intro: "Transmettre son patrimoine sans payer des droits de succession excessifs est possible — à condition de planifier suffisamment tôt. Donations, assurance-vie, démembrement de propriété : les outils sont nombreux et complémentaires.",
    sections: [
      {
        h2: "Commencer à donner tôt : la stratégie des 15 ans",
        body: [
          "L'arme la plus puissante de la transmission est le renouvellement des abattements tous les 15 ans. Chaque parent peut donner 100 000 € à chaque enfant sans impôt, et ce tous les 15 ans. Un couple avec deux enfants peut ainsi transmettre 400 000 € en franchise totale de droits sur 15 ans — et potentiellement 800 000 € sur 30 ans.",
          "Le don Sarkozy (don familial de sommes d'argent) permet en plus une exonération de 31 865 € supplémentaires si le donateur a moins de 80 ans et le donataire au moins 18 ans. Ces deux dispositifs se cumulent.",
        ],
      },
      {
        h2: "L'assurance-vie : l'outil de transmission par excellence",
        body: [
          "Les capitaux versés dans une assurance-vie avant 70 ans bénéficient d'une fiscalité hors succession : chaque bénéficiaire désigné reçoit jusqu'à 152 500 € en franchise totale de droits (puis 20 % jusqu'à 700 000 € et 31,25 % au-delà). Le conjoint ou partenaire de PACS est totalement exonéré.",
          "Cette exemption s'applique à chaque bénéficiaire : si vous désignez 3 enfants comme bénéficiaires, chacun reçoit 152 500 € sans impôt, soit 457 500 € transmis en franchise totale. La rédaction de la clause bénéficiaire est cruciale — ne vous contentez pas de la clause standard de l'assureur.",
        ],
      },
      {
        h2: "Le démembrement de propriété : donner sans se démunir",
        body: [
          "Le démembrement consiste à donner la nue-propriété d'un bien à ses enfants tout en conservant l'usufruit (droit d'usage et de jouissance). Les droits de donation sont calculés sur la valeur de la nue-propriété uniquement — environ 50-60 % de la valeur du bien selon l'âge de l'usufruitier. Au décès, les enfants récupèrent la pleine propriété sans aucun droit supplémentaire.",
          "Exemple : un immeuble valant 400 000 €, donné en nue-propriété à 60 ans. La valeur de la nue-propriété est de 60 % × 400 000 = 240 000 €. Droits de donation calculés sur 240 000 € (et non 400 000 €), avec abattement de 100 000 €, soit droits sur 140 000 €.",
        ],
      },
      {
        h2: "La SCI familiale : faciliter la transmission de l'immobilier",
        body: [
          "Une Société Civile Immobilière (SCI) familiale permet de détenir un bien immobilier à plusieurs et d'en transmettre des parts progressivement. Les parts de SCI sont valorisées avec une décote de liquidité de 10-15 % par rapport à la valeur des murs (car les parts sont moins liquides qu'un appartement). Cette décote réduit mécaniquement les droits.",
          "La SCI facilite aussi la gestion successorale : au lieu d'un indivision conflictuelle, les héritiers sont associés dans une structure avec des règles clairement définies dans les statuts.",
        ],
      },
    ],
    sims: ['/simulateurs/donation', '/simulateurs/succession', '/simulateurs/assurance-vie'],
    terms: ['droits-succession', 'abattement-donation', 'assurance-vie-transmission', 'clause-beneficiaire', 'donation-partage', 'usufruit', 'nue-propriete', 'sci'],
    blogCats: ['Fiscalité', 'Immobilier'],
  },
];

export const GUIDES_BY_SLUG = Object.fromEntries(GUIDES.map(g => [g.slug, g]));
