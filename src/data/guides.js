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
    steps: [
      { position: 1, name: 'Estimer ses pensions de base et complémentaire', text: 'Commencez par simuler votre pension CNAV (régime général) via le simulateur retraite de simfinly.com en renseignant votre salaire annuel moyen, votre nombre de trimestres et votre âge de départ souhaité. Ajoutez ensuite votre simulation Agirc-Arrco pour les salariés du privé.' },
      { position: 2, name: 'Calculer le taux de remplacement', text: 'Divisez votre pension nette totale (CNAV + Agirc-Arrco + autres régimes) par votre dernier salaire net. Le taux de remplacement est souvent de 60 à 75 % pour les salariés du privé — identifiez le gap avec votre niveau de vie cible.' },
      { position: 3, name: 'Estimer le gap d\'épargne complémentaire', text: 'Si votre taux de remplacement est insuffisant, calculez le capital supplémentaire nécessaire via le simulateur de rente. Un écart de 500 €/mois pendant 25 ans représente environ 100 000 à 150 000 € de capital selon les hypothèses.' },
      { position: 4, name: 'Ouvrir et alimenter un PER', text: 'Le Plan d\'Épargne Retraite est l\'outil privilégié : déductible de l\'IR (jusqu\'à 37 680 €/an), bloqué jusqu\'à la retraite, et convertible en rente ou capital. Commencez le plus tôt possible pour bénéficier de l\'effet des intérêts composés.' },
      { position: 5, name: 'Optimiser la date de départ', text: 'Comparez les scénarios 62, 64 et 67 ans : partir plus tôt donne moins de trimestres et une décote, partir plus tard donne une surcote (+1,25 %/trimestre). Le simulateur CNAV calcule le point d\'équilibre financier entre partir tôt (plus d\'années de pension) et tard (plus par an).' },
    ],
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
    steps: [
      { position: 1, name: "Calculer sa capacité d'emprunt", text: "Votre capacité d'emprunt se calcule à partir de vos revenus nets mensuels × 35 % (taux d'endettement maximal HCSF) − vos charges existantes. Le simulateur d'emprunt de simfinly.com effectue ce calcul instantanément selon le taux et la durée." },
      { position: 2, name: "Estimer les frais annexes", text: "Au prix du bien s'ajoutent les frais de notaire (7-8 % dans l'ancien, 2-3 % dans le neuf) et les frais de garantie (caution ou hypothèque). Prévoyez au minimum 10 % d'apport pour couvrir ces frais sans les intégrer dans le crédit." },
      { position: 3, name: "Vérifier son éligibilité au PTZ", text: "Si vous êtes primo-accédant (pas propriétaire de votre résidence principale depuis 2 ans), simulez votre éligibilité au PTZ. Depuis 2025, il est accessible sur tout le territoire et dans l'ancien. Le PTZ peut financer jusqu'à 50 % de l'achat en zones tendues." },
      { position: 4, name: "Comparer les offres via le TAEG", text: "Le TAEG (Taux Annuel Effectif Global) est le seul indicateur qui intègre les intérêts, l'assurance emprunteur et les frais de dossier. C'est lui qui permet de comparer vraiment deux offres de prêt. Une assurance déléguée moins chère peut réduire significativement le TAEG." },
      { position: 5, name: "Négocier et signer l'offre de prêt", text: "Une fois l'offre de prêt reçue, vous disposez d'un délai de réflexion obligatoire de 10 jours avant de signer. Utilisez ce délai pour comparer et éventuellement faire jouer la concurrence. L'offre est maintenue pendant 30 jours par la banque." },
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
    steps: [
      { position: 1, name: "Remplir l'épargne de précaution sur livrets réglementés", text: "Commencez par le LEP si vous y êtes éligible (3,5 % net en 2026), puis le Livret A (2,4 %, plafonné à 22 950 €) et le LDDS (2,4 %, plafonné à 12 000 €). Ces enveloppes défiscalisées constituent votre coussin de sécurité (3-6 mois de dépenses) avant tout investissement." },
      { position: 2, name: "Ouvrir un PEA pour les actions", text: "Ouvrez un PEA au plus tôt pour déclencher le compteur de 5 ans (exonération d'IR sur les plus-values). Investissez en ETF indiciels (MSCI World, CAC 40) — faibles frais, diversification instantanée. Plafond versements : 150 000 €." },
      { position: 3, name: "Ouvrir une assurance-vie pour diversifier", text: "L'assurance-vie permet de combiner fonds euros (capital garanti) et unités de compte (ETF, SCPI). Elle bénéficie d'une fiscalité avantageuse après 8 ans et d'un cadre successoral hors droits de succession. Complémentaire au PEA pour l'immobilier papier et la gestion de liquidités." },
      { position: 4, name: "Automatiser l'épargne par virements programmés", text: "Mettez en place des virements automatiques dès la réception de votre salaire. La règle de base : payer d'abord son avenir (épargne), puis ses besoins, puis ses envies. La régularité prime sur le montant et sur le timing de marché." },
      { position: 5, name: "Réajuster l'allocation selon l'horizon", text: "Plus l'horizon de placement est long, plus la part actions peut être élevée (rendement supérieur sur le long terme, mais plus volatil). Rééquilibrez une fois par an. Rapprochez-vous des actifs moins risqués (obligations, fonds euros) à mesure que la date d'utilisation des fonds approche." },
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
    steps: [
      { position: 1, name: "Calculer ses dépenses annuelles réelles", text: "Listez toutes vos dépenses sur 12 mois (logement, alimentation, transports, loisirs, santé, impôts…). Ce chiffre est la base de votre objectif FIRE — il doit refléter le niveau de vie que vous souhaitez maintenir à la retraite, pas seulement vos dépenses actuelles." },
      { position: 2, name: "Définir son objectif FIRE (25× les dépenses annuelles)", text: "Multipliez vos dépenses annuelles par 25 pour obtenir votre capital FIRE cible — c'est le corollaire de la règle des 4 %. Pour un horizon de retraite très long (40+ ans en France), beaucoup de praticiens recommandent 30× (taux de retrait de 3,3 %) pour plus de sécurité." },
      { position: 3, name: "Calculer son taux d'épargne actuel", text: "Divisez votre épargne mensuelle par vos revenus nets mensuels. À 10 % d'épargne, l'indépendance financière prend plusieurs décennies. À 50 %, environ 15-17 ans. C'est le levier le plus puissant — chaque point de taux d'épargne supplémentaire raccourcit significativement la trajectoire." },
      { position: 4, name: "Choisir les enveloppes fiscales adaptées", text: "Priorisez le PEA pour les actions (exonération d'IR après 5 ans), l'assurance-vie pour la diversification et la succession, le PER pour défiscaliser si votre TMI est élevée. En France, la retraite obligatoire réduira votre capital FIRE nécessaire après 62-64 ans — intégrez cette donnée dans votre simulation." },
      { position: 5, name: "Simuler sa trajectoire FIRE", text: "Utilisez le simulateur FIRE de simfinly.com pour projeter la croissance de votre patrimoine selon votre épargne mensuelle, le rendement attendu et l'inflation. Testez différents scénarios (rendement 5 %, 7 %, 9 %) pour évaluer la sensibilité à vos hypothèses et identifier votre date d'indépendance financière." },
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
    steps: [
      { position: 1, name: "Calculer sa Tranche Marginale d'Imposition (TMI)", text: "Votre TMI est le taux appliqué à votre dernier euro de revenu. Identifiez-la avec le simulateur IR de simfinly.com : elle détermine le gain réel de chaque dispositif de défiscalisation. Plus votre TMI est élevée (30-45 %), plus les déductions sont intéressantes." },
      { position: 2, name: "Maximiser les déductions du revenu imposable", text: "Le versement sur un PER est la déduction la plus universelle : jusqu'à 37 680 € (salarié, 2026), soit une économie de 37 680 × TMI. À 30 % de TMI = 11 304 € d'impôt économisé. Les frais réels professionnels peuvent remplacer l'abattement de 10 % si supérieurs." },
      { position: 3, name: "Utiliser le déficit foncier si propriétaire bailleur", text: "Les travaux de rénovation sur un bien locatif en régime réel génèrent un déficit foncier déductible du revenu global jusqu'à 10 700 € par an (21 400 € pour les travaux de rénovation énergétique). L'excédent est reportable 10 ans sur les revenus fonciers." },
      { position: 4, name: "Optimiser les revenus mobiliers via la flat tax ou le barème", text: "Les revenus de capitaux mobiliers (dividendes, intérêts) sont soumis à la flat tax de 30 % (12,8 % IR + 17,2 % prélèvements sociaux) par défaut. Si votre TMI est inférieure à 12,8 %, optez pour le barème progressif — l'option s'exerce chaque année lors de la déclaration." },
      { position: 5, name: "Vérifier les réductions et crédits d'impôt applicables", text: "Réductions : dons associatifs (66-75 % de l'impôt), investissement locatif Pinel (à l'extinction progressive). Crédits : garde d'enfants (50 % jusqu'à 1 150 €/enfant), emploi à domicile (50 % jusqu'à 12 000 €), borne de recharge électrique (75 % jusqu'à 300 €)." },
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
    steps: [
      { position: 1, name: 'Ouvrir le bon compte boursier', text: 'Pour la défiscalisation : PEA en banque en ligne (Boursorama, Fortuneo) pour les actions européennes et ETF monde. Pour la diversification élargie : assurance-vie en unités de compte. Pour une liberté totale : compte-titres ordinaire. La combinaison PEA + assurance-vie couvre 95 % des besoins d\'un investisseur particulier.' },
      { position: 2, name: 'Choisir un ETF monde diversifié', text: 'Investissez dans un ETF MSCI World (ex : Amundi MSCI World UCITS ETF - accumulation) : 1 600 entreprises, frais ~0,20 %/an, disponible sur PEA. Cela évite la sélection d\'actions individuelles et diversifie instantanément. Le rendement historique du MSCI World est de ~7-8 %/an sur 30 ans.' },
      { position: 3, name: 'Mettre en place un DCA mensuel', text: 'Programmez un achat automatique mensuel d\'un montant fixe, indépendamment du prix de l\'ETF. Cette technique de \'Dollar Cost Averaging\' lisse le prix d\'achat sur le temps et évite l\'erreur de market timing.' },
      { position: 4, name: 'Rééquilibrer le portefeuille annuellement', text: 'Une fois par an (ou lors d\'un écart >5 % de votre allocation cible), rééquilibrez en vendant les actifs surpondérés et en achetant les sous-pondérés. Cela maintient votre profil de risque et discipline votre comportement d\'investisseur.' },
      { position: 5, name: 'Ne jamais vendre lors des baisses', text: 'Les 10 meilleurs jours des marchés sur 20 ans représentent plus de 50 % de la performance totale. Ils surviennent souvent dans les 3 mois suivant un krach. Vendre lors d\'une baisse cristallise les pertes et rate le rebond. La seule raison légitime de vendre : avoir besoin des fonds pour un projet à court terme.' },
    ],
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
    steps: [
      { position: 1, name: 'Lister tous ses revenus et dépenses sur 3 mois', text: 'Exportez vos relevés bancaires des 3 derniers mois et catégorisez chaque dépense en : besoins fixes (loyer, abonnements, assurances), besoins variables (alimentation, transport), envies (restaurants, loisirs) et épargne. Utilisez le simulateur budget de simfinly pour cette analyse.' },
      { position: 2, name: 'Appliquer la règle 50/30/20', text: 'Vérifiez que vos besoins ne dépassent pas 50 % du revenu net, vos envies 30 %, et que 20 % minimum vont à l\'épargne. En Île-de-France, adaptez à 55/25/20 si le loyer dépasse 30 % du revenu. L\'essentiel est de fixer l\'épargne en premier.' },
      { position: 3, name: 'Automatiser l\'épargne le jour du salaire', text: 'Programmez un virement automatique vers votre Livret A le 1er de chaque mois (ou le jour du salaire). Montant cible : 20 % du revenu net. Une fois l\'épargne \'en sécurité\', le reste peut être dépensé sans calcul constant ni culpabilité.' },
      { position: 4, name: 'Identifier et éliminer les dépenses silencieuses', text: 'Abonnements oubliés, frais bancaires évitables, assurances redondantes : listez tous vos prélèvements automatiques et supprimez ce que vous n\'utilisez pas. Ces \'fuites\' représentent souvent 100-300 €/mois invisibles.' },
      { position: 5, name: 'Réévaluer le budget trimestriellement', text: 'Chaque trimestre, revoyez votre budget : les revenus ont-ils changé ? Des charges fixes ont-elles évolué ? Ajustez les montants des virements automatiques en conséquence. Un budget qui n\'évolue pas devient progressivement inexact et décourageant.' },
    ],
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
    steps: [
      { position: 1, name: 'Calculer le rendement brut et net du bien', text: 'Rendement brut = loyers annuels / prix d\'achat total (y compris frais de notaire). Rendement net = (loyers - charges - taxe foncière - impôts) / prix d\'achat. Visez un rendement net > 3 % minimum en zone tendue, > 5 % en province. Le simulateur rendement locatif de simfinly intègre toutes ces variables.' },
      { position: 2, name: 'Choisir son régime fiscal', text: 'Location nue < 15 000 €/an : micro-foncier (abattement 30 %, simple). Au-delà ou si les charges dépassent 30 % : régime réel (déduction charges + intérêts + amortissements en LMNP). En meublé (LMNP régime réel), l\'amortissement du bien peut effacer fiscalement les revenus pendant 15-20 ans.' },
      { position: 3, name: 'Estimer l\'effet de levier du crédit', text: 'Un bien à 5 % de rendement net financé à 70 % par crédit à 3,5 % génère un rendement sur fonds propres de ~10-12 %. C\'est l\'effet de levier. Vérifiez que le loyer couvre au moins 70-80 % de la mensualité (reste à charge net positif ou neutre).' },
      { position: 4, name: 'Anticiper la gestion et les risques', text: 'Charges de copropriété, taxe foncière, travaux imprévus (10 % du prix sur 10 ans en moyenne), vacance locative (1-2 mois/an), impayés : provisionnez ces risques dans votre calcul de rentabilité. Une assurance loyers impayés (GLI, ~2,5-4 % des loyers) peut sécuriser les revenus.' },
      { position: 5, name: 'Préparer la sortie (revente ou transmission)', text: 'Calculez la plus-value immobilière potentielle à la revente (exonérée après 22 ans de détention pour l\'IR, 30 ans pour les prélèvements sociaux). Si l\'objectif est la transmission, le démembrement ou une SCI peut optimiser la fiscalité successorale.' },
    ],
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
    steps: [
      { position: 1, name: 'Vérifier son relevé de points Agirc-Arrco', text: 'Accédez à votre espace personnel sur agirc-arrco.fr pour consulter votre relevé de points. Vérifiez chaque année que les points cotisés correspondent à votre salaire et signalez toute anomalie dans les 3 ans.' },
      { position: 2, name: 'Calculer sa pension complémentaire estimée', text: 'Utilisez le simulateur Agirc-Arrco de simfinly : entrez votre nombre de points actuels, votre salaire et votre âge de départ cible. La pension = points × valeur du point (1,4107 € en 2026). Additionnez votre CNAV pour obtenir la retraite totale.' },
      { position: 3, name: 'Comprendre le coefficient de solidarité', text: 'Si vous partez dès que vous avez votre taux plein CNAV (sans travailler 1 à 4 trimestres de plus), un malus de -10 % s\'applique sur votre pension Agirc-Arrco pendant 3 ans. Simulez l\'impact de travailler quelques trimestres supplémentaires pour éviter ce malus.' },
      { position: 4, name: 'Évaluer le bonus de fidélité', text: 'Travailler 1 à 3+ trimestres après votre taux plein donne un bonus temporaire de +10 à +30 % sur 1 an. Si vous hésitez à partir, comparez le coût de travailler encore (salaire - avantages perdus) avec le gain du bonus sur votre pension.' },
      { position: 5, name: 'Planifier le moment de départ optimal', text: 'Le meilleur âge de départ au regard de l\'Agirc-Arrco dépend de votre situation personnelle. Le simulateur calcule automatiquement la pension selon 3 scénarios : départ immédiat (avec malus), départ avec 1 trimestre de plus (sans malus), et départ avec bonus.' },
    ],
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
    steps: [
      { position: 1, name: 'Inventorier tous ses crédits et leurs taux', text: 'Listez chaque crédit avec son capital restant dû, son taux (TAEG), sa mensualité et sa durée restante. Classez-les du plus cher au moins cher. Prêt renouvelable/crédit conso : souvent 10-20 % TAEG. Prêt immo : souvent 3-5 %. Découvert bancaire : 15-20 %.' },
      { position: 2, name: 'Rembourser par ordre de taux (méthode avalanche)', text: 'Concentrez tout excédent budgétaire sur le crédit au taux le plus élevé. Une fois remboursé, reportez la mensualité libérée sur le crédit suivant. Cette méthode minimise le coût total en intérêts, même si la méthode \'boule de neige\' (plus petit solde en premier) est plus motivante psychologiquement.' },
      { position: 3, name: 'Renégocier ou faire racheter son crédit immobilier', text: 'Si les taux de marché sont inférieurs d\'au moins 0,5-0,7 % à votre taux actuel et qu\'il vous reste plus de 10 ans de crédit, une renégociation est rentable. Calculez le gain net après frais de remboursement anticipé (IRA, plafonnées à 6 mois d\'intérêts ou 3 % du capital restant).' },
      { position: 4, name: 'Éviter le crédit renouvelable et les découverts', text: 'Un découvert bancaire facturé en agios peut coûter 15-20 % TAEG. Mettez en place une autorisation de découvert à taux réduit ou un virement automatique d\'un livret pour couvrir les fins de mois tendues. Le crédit renouvelable doit être résilié dès que le solde est remboursé.' },
      { position: 5, name: 'Simuler l\'impact d\'un remboursement anticipé', text: 'Utilisez le simulateur de crédit de simfinly pour calculer l\'économie d\'un remboursement anticipé partiel (ex : placer 5 000 € en remboursement vs investir en bourse). Le remboursement anticipé est rentable si le taux du crédit est supérieur au rendement attendu de l\'investissement alternatif.' },
    ],
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
    steps: [
      { position: 1, name: 'Identifier ses revenus de capitaux mobiliers', text: 'Listez tous vos revenus concernés : dividendes (actions, ETF, SCPI), intérêts (obligations, livrets non réglementés), plus-values de cession de valeurs mobilières, gains sur contrats d\'assurance-vie. Les revenus de PEA après 5 ans et de Livret A sont exonérés et hors calcul.' },
      { position: 2, name: 'Calculer son TMI pour l\'année en cours', text: 'Utilisez le simulateur d\'impôt sur le revenu de simfinly pour connaître votre Tranche Marginale d\'Imposition (TMI). Si votre TMI est à 0 % ou 11 %, l\'option barème est avantageuse. À 30 %, le PFU (12,8 % + 17,2 % PS = 30 %) est équivalent. Au-delà, le PFU est généralement optimal.' },
      { position: 3, name: 'Comparer PFU vs barème pour les dividendes', text: 'Pour les dividendes, l\'option barème s\'applique avec un abattement de 40 % avant IR — ce qui réduit la base imposable. Exemple : 5 000 € de dividendes au barème à 30 % = 5 000 × 60 % × 30 % = 900 € d\'IR + PS. Au PFU : 5 000 × 12,8 % = 640 €. Dans ce cas, le PFU gagne. Simulez votre situation précise.' },
      { position: 4, name: 'Exercer l\'option barème si avantageuse', text: 'L\'option barème se cocher en case 2OP de votre déclaration de revenus (formulaire 2042). Elle est globale et irrévocable pour l\'année — elle s\'applique à tous vos revenus de capitaux mobiliers. Calculez avant de cocher : si vous avez des PEA ou assurance-vie, vérifiez que les gains concernés sont bien inclus dans votre calcul.' },
      { position: 5, name: 'Optimiser pour les années suivantes', text: 'Si vous anticipez de gros gains imposables, ouvrez un PEA (exonération après 5 ans) ou une assurance-vie (fiscalité réduite après 8 ans). Ces enveloppes permettent de différer ou d\'éviter la fiscalité sur les plus-values, quelle que soit l\'option retenue.' },
    ],
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
    steps: [
      { position: 1, name: 'Faire le point sur son patrimoine transmissible', text: 'Inventoriez ce que vous souhaitez transmettre : liquidités, valeurs mobilières, biens immobiliers, parts de société. Pour chaque actif, estimez la valeur et la plus-value latente. La donation \'purge\' cette plus-value pour les biens non-immobiliers (le donataire reprend à la valeur du jour).' },
      { position: 2, name: 'Vérifier les abattements disponibles', text: 'Abattements en ligne directe (parent → enfant) : 100 000 € par parent par enfant, renouvelables tous les 15 ans. Ajoutez le don familial de sommes d\'argent (80 724 € en franchise, donateur < 80 ans, donataire majeur). Calculez le total disponible pour chaque bénéficiaire.' },
      { position: 3, name: 'Choisir le type de donation', text: 'Donation simple (pleine propriété) : la plus courante. Donation avec réserve d\'usufruit (nue-propriété) : le donateur conserve l\'usage du bien, les droits sont calculés sur une valeur réduite selon l\'âge. Donation-partage : partage anticipé entre plusieurs héritiers, figé à la valeur du jour de la donation.' },
      { position: 4, name: 'Faire appel à un notaire pour l\'acte', text: 'Tout donation immobilière ou d\'une valeur > 15 000 € nécessite un acte notarié. Les dons manuels (argent, valeurs mobilières) peuvent se faire sans notaire mais doivent être déclarés (formulaire 2735) pour déclencher le délai de 15 ans.' },
      { position: 5, name: 'Déclarer et payer les droits', text: 'Après signature de l\'acte, le notaire dépose la déclaration et calcule les droits éventuels. Avec un abattement de 100 000 €, il n\'y a souvent rien à payer. Si des droits sont dus (barème de 5 % à 45 % en ligne directe), ils sont payables immédiatement ou sur 12 mois sur demande.' },
    ],
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
    steps: [
      { position: 1, name: 'Vérifier son éligibilité à la carrière longue', text: 'La retraite anticipée carrière longue (RACL) nécessite d\'avoir commencé à travailler avant 21 ans (pour partir à 63 ans) ou avant 18 ans (62 ans), voire avant 16 ans (58-60 ans). Vérifiez sur votre relevé de carrière Info Retraite que vos trimestres avant 21 ans sont bien enregistrés.' },
      { position: 2, name: 'Calculer ses trimestres cotisés et requis', text: 'Pour chaque borne d\'âge de la carrière longue, un nombre minimal de trimestres cotisés est requis (trimestres assimilés partiellement). Utilisez le simulateur trimestres de simfinly pour connaître exactement votre situation et identifier si vous manquez quelques trimestres rachetables.' },
      { position: 3, name: 'Simuler l\'impact financier d\'un départ anticipé', text: 'Comparez le cumul pension sur l\'espérance de vie entre : partir à 60 ans (moins par mois, mais pendant plus longtemps) vs partir à 64 ans (plus par mois, moins longtemps). Le \'point d\'équilibre\' est généralement autour de 75-80 ans — si vous vivez au-delà, partir tard est financièrement gagnant.' },
      { position: 4, name: 'Anticiper l\'Agirc-Arrco en cas de départ anticipé', text: 'Partir en retraite anticipée peut déclencher le coefficient d\'abattement Agirc-Arrco (-10 % pendant 3 ans) si vous n\'avez pas atteint un certain seuil de trimestres. Vérifiez ce point avec le simulateur Agirc-Arrco de simfinly.' },
      { position: 5, name: 'Déposer sa demande 4 mois à l\'avance', text: 'La demande de retraite doit être déposée au minimum 4 mois avant la date de départ souhaitée, auprès de la CNAV (info-retraite.fr) et de toutes les caisses complémentaires concernées. Préparez les justificatifs : bulletins de salaire anciens, attestation employeur, relevé de carrière.' },
    ],
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
    steps: [
      { position: 1, name: "Constituer son épargne de précaution", text: "Avant d'investir, conservez l'équivalent de 3 à 6 mois de dépenses sur un Livret A ou LDDS. Ce coussin de sécurité évite de devoir vendre vos placements à un mauvais moment en cas d'imprévu." },
      { position: 2, name: "Ouvrir un PEA", text: "Ouvrez un Plan d'Épargne en Actions (PEA) au plus tôt, même avec 100 €. Cela déclenche le compteur de 5 ans nécessaire pour profiter de l'exonération d'impôt sur les plus-values — vous ne pouvez pas rétroactivement bénéficier de l'ancienneté." },
      { position: 3, name: "Investir en ETF indiciels", text: "Choisissez des ETF (trackers) sur indices larges (MSCI World, S&P 500) : frais très bas (0,07-0,30 %/an), diversification mondiale instantanée, performance proche du marché. Évitez les stock-picking et les produits structurés complexes." },
      { position: 4, name: "Mettre en place un virement automatique mensuel (DCA)", text: "Investissez régulièrement la même somme chaque mois plutôt que tout d'un coup. Cette méthode (Dollar Cost Averaging) lisse l'effet du timing de marché et installe une discipline d'épargne durable." },
      { position: 5, name: "Réajuster son portefeuille une fois par an", text: "Une fois par an, vérifiez que la répartition de votre portefeuille correspond toujours à votre profil de risque. Rééquilibrez si nécessaire (vendre ce qui a surperformé, acheter ce qui a sous-performé) pour maintenir votre allocation cible." },
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
    steps: [
      { position: 1, name: "Calculer son revenu net imposable", text: "Partez de vos revenus bruts et soustrayez les abattements applicables : 10 % sur les salaires (plafonné à 14 171 € en 2026) ou frais réels si supérieurs, abattements sur retraites, revenus fonciers après charges. Le résultat est votre revenu net imposable." },
      { position: 2, name: "Appliquer le quotient familial", text: "Divisez votre revenu net imposable par le nombre de parts de votre foyer fiscal : 1 part (célibataire), 2 parts (couple), +0,5 par enfant (+1 pour le 3e). L'impôt est calculé sur le revenu par part, puis multiplié par le nombre de parts — c'est ainsi que la progressivité du barème bénéficie aux familles." },
      { position: 3, name: "Appliquer le barème progressif 2026", text: "Calculez l'impôt par tranche sur le revenu par part : 0 % jusqu'à 11 497 €, 11 % de 11 497 à 29 315 €, 30 % de 29 315 à 83 823 €, 41 % de 83 823 à 180 294 €, 45 % au-delà. Multipliez par le nombre de parts. Ce montant est l'impôt brut avant décote et réductions." },
      { position: 4, name: "Vérifier la décote", text: "Si votre impôt brut est inférieur à environ 1 929 € (célibataire) ou 3 191 € (couple), une décote réduit automatiquement votre impôt — elle peut l'annuler totalement pour les foyers les plus modestes. Elle est calculée automatiquement par l'administration." },
      { position: 5, name: "Soustraire les réductions et crédits d'impôt", text: "Impôt net = Impôt brut − décote − réductions d'impôt (Pinel, dons) − crédits d'impôt (garde d'enfants, emploi à domicile, borne de recharge). La différence entre réduction et crédit : la réduction est perdue si l'impôt est inférieur, le crédit est remboursé même si l'impôt est nul." },
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
    steps: [
      { position: 1, name: "Obtenir son relevé de carrière", text: "Téléchargez votre relevé de carrière sur info-retraite.fr. Vérifiez chaque ligne : trimestres validés, salaires enregistrés, périodes d'inactivité. Des erreurs existent parfois (stages, service militaire, premier emploi) — elles peuvent être corrigées jusqu'à 3 ans avant l'âge légal." },
      { position: 2, name: "Simuler sa pension CNAV et Agirc-Arrco", text: "Utilisez le simulateur CNAV de simfinly.com pour calculer votre pension de base selon différents âges de départ, puis le simulateur Agirc-Arrco pour la complémentaire. Additionnez les deux pour obtenir votre revenu de retraite global estimé." },
      { position: 3, name: "Identifier les trimestres manquants", text: "Comparez votre nombre de trimestres validés au nombre requis pour votre génération (entre 169 et 172). Chaque trimestre manquant entraîne une décote de 0,625 % sur la pension de base. Identifiez les périodes récupérables (chômage non indemnisé, maternité manquante, MDA)." },
      { position: 4, name: "Évaluer le rachat de trimestres", text: "Demandez une simulation de rachat de trimestres (VFR) à votre caisse de retraite. Comparez le coût (déductible fiscalement) à l'augmentation mensuelle de pension obtenue sur votre espérance de vie. Le rachat est généralement rentable si vous vivez 8-10 ans après la retraite." },
      { position: 5, name: "Ouvrir ou alimenter un PER", text: "À 50-55 ans, votre TMI est souvent à son maximum. C'est le moment idéal pour verser sur un PER : l'avantage fiscal est maximal à l'entrée, et à la retraite votre TMI sera probablement plus faible. Vérifiez vos plafonds reportables sur votre avis d'imposition." },
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
    steps: [
      { position: 1, name: "Inventorier son patrimoine transmissible", text: "Listez tous vos actifs : immobilier, placements financiers (PEA, assurance-vie, PER), liquidités, parts de société. Pour chaque actif, identifiez la fiscalité successorale applicable et les exonérations possibles. L'assurance-vie et le PER (avant liquidation) obéissent à des règles distinctes des droits de succession classiques." },
      { position: 2, name: "Calculer les droits de succession estimés", text: "Calculez la masse successorale nette (actifs − dettes) et appliquez les abattements légaux : 100 000 € par enfant pour les droits en ligne directe, renouvelables tous les 15 ans. Le simulateur de succession de simfinly.com calcule les droits selon la composition familiale et le patrimoine." },
      { position: 3, name: "Utiliser les donations de son vivant", text: "Donnez à vos enfants ou petits-enfants de votre vivant pour consommer les abattements (100 000 € par enfant tous les 15 ans, + 31 865 € de don familial d'argent). Plus tôt vous donnez, plus vous gagnez : les biens donnés sortent définitivement de votre succession, y compris leur future valorisation." },
      { position: 4, name: "Optimiser l'assurance-vie pour la transmission", text: "Les capitaux versés avant 70 ans bénéficient d'une franchise de droits de 152 500 € par bénéficiaire désigné — hors droits de succession. Rédigez une clause bénéficiaire détaillée (pas la clause standard) pour orienter précisément les capitaux vers chaque bénéficiaire selon votre volonté." },
      { position: 5, name: "Consulter un notaire pour la stratégie globale", text: "La transmission optimale combine donation, démembrement de propriété, assurance-vie et éventuellement SCI familiale. Un notaire peut établir un bilan patrimonial et successoral personnalisé, rédiger les actes de donation et conseiller sur les stratégies adaptées à votre situation familiale et fiscale." },
    ],
    sims: ['/simulateurs/donation', '/simulateurs/succession', '/simulateurs/assurance-vie'],
    terms: ['droits-succession', 'abattement-donation', 'assurance-vie-transmission', 'clause-beneficiaire', 'donation-partage', 'usufruit', 'nue-propriete', 'sci'],
    blogCats: ['Fiscalité', 'Immobilier'],
  },
];

export const GUIDES_BY_SLUG = Object.fromEntries(GUIDES.map(g => [g.slug, g]));
