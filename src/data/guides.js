// Guides thématiques (pages pilier) : agrègent simulateurs, termes du lexique et
// articles de blog d'une même thématique. Sert le SEO (clusters) et la navigation.
//
// Champs : slug, title, emoji, category, intro, sections[{h2, body[]}],
//          sims[chemins], terms[slugs lexique], blogCats[catégories blog].

export const GUIDES = [
  {
    slug: 'preparer-sa-retraite',
    title: 'Préparer sa retraite',
    emoji: '🏦',
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
    emoji: '🏡',
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
    emoji: '💰',
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
    emoji: '🔥',
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
    emoji: '🧾',
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
];

export const GUIDES_BY_SLUG = Object.fromEntries(GUIDES.map(g => [g.slug, g]));
