// Lexique financier — source unique de vérité pour :
//   • les pages /lexique et /lexique/:slug
//   • le composant <Terme> (lien + infobulle)
//   • l'auto-liaison des termes dans les articles de blog (utils/autolinkTerms.js)
//
// Chaque entrée :
//   slug      identifiant URL (/lexique/<slug>)
//   term      libellé court affiché (souvent l'acronyme)
//   full      intitulé complet
//   aliases   variantes détectées dans le texte pour l'auto-liaison (acronyme + formes)
//   category  catégorie éditoriale (réutilise les catégories du site)
//   short     définition d'une phrase (infobulle + méta description)
//   long      définition détaillée (tableau de paragraphes)
//   sims      simulateurs liés (chemins)
//   related   slugs d'autres termes liés

export const GLOSSARY = [
  // ── Immobilier / crédit ───────────────────────────────────────────────────
  {
    slug: 'taeg', term: 'TAEG', full: 'Taux Annuel Effectif Global',
    aliases: ['TAEG'], category: 'Immobilier',
    short: "Coût total d'un crédit exprimé en % par an : intérêts, assurance et frais inclus. Sert à comparer les offres.",
    long: [
      "Le TAEG (Taux Annuel Effectif Global) est l'indicateur de référence pour mesurer le coût réel d'un crédit. Il intègre le taux d'intérêt nominal, mais aussi l'assurance emprunteur, les frais de dossier et de garantie.",
      "C'est le seul taux qui permet de comparer objectivement deux offres de prêt : un taux nominal bas peut cacher des frais élevés. Le TAEG ne peut légalement pas dépasser le taux d'usure fixé par la Banque de France.",
    ],
    sims: ['/simulateurs/emprunt-immobilier', '/simulateurs/credit-conso'],
    related: ['taea', 'taux-endettement', 'amortissement'],
  },
  {
    slug: 'taea', term: 'TAEA', full: "Taux Annuel Effectif de l'Assurance",
    aliases: ['TAEA'], category: 'Immobilier',
    short: "Part du coût de l'assurance emprunteur dans le crédit, exprimée en % par an.",
    long: [
      "Le TAEA isole le coût de l'assurance emprunteur au sein du TAEG. Il permet de comparer les contrats d'assurance entre eux, indépendamment du taux du prêt.",
      "Depuis la loi Lemoine, l'assurance peut être résiliée et changée à tout moment, ce qui rend la comparaison du TAEA particulièrement utile pour réduire le coût total du crédit.",
    ],
    sims: ['/simulateurs/emprunt-immobilier'],
    related: ['taeg'],
  },
  {
    slug: 'ptz', term: 'PTZ', full: 'Prêt à Taux Zéro',
    aliases: ['PTZ'], category: 'Immobilier',
    short: "Prêt sans intérêt accordé sous conditions de ressources pour financer une première résidence principale.",
    long: [
      "Le Prêt à Taux Zéro (PTZ) est un prêt aidé par l'État, sans intérêts ni frais de dossier, réservé aux primo-accédants (qui n'ont pas été propriétaires de leur résidence principale les 2 dernières années).",
      "Son montant dépend de la zone géographique du logement, des revenus du foyer et de sa composition. Il complète un prêt principal et ne peut financer la totalité de l'achat.",
    ],
    sims: ['/simulateurs/ptz', '/simulateurs/emprunt-immobilier'],
    related: ['taeg', 'apport', 'frais-notaire'],
  },
  {
    slug: 'taux-endettement', term: "Taux d'endettement", full: "Taux d'endettement",
    aliases: ["taux d'endettement"], category: 'Immobilier',
    short: "Part de vos revenus consacrée au remboursement de vos crédits. Généralement plafonné à 35 %.",
    long: [
      "Le taux d'endettement rapporte le total de vos mensualités de crédit à vos revenus nets. Les banques le plafonnent en principe à 35 % (assurance comprise), conformément aux recommandations du HCSF.",
      "Au-delà, l'octroi d'un prêt devient difficile. Le « reste à vivre » (revenus moins charges) est aussi étudié par la banque.",
    ],
    sims: ['/simulateurs/emprunt-immobilier'],
    related: ['capacite-emprunt', 'taeg'],
  },
  {
    slug: 'capacite-emprunt', term: "Capacité d'emprunt", full: "Capacité d'emprunt",
    aliases: ["capacité d'emprunt"], category: 'Immobilier',
    short: "Montant maximal que vous pouvez emprunter compte tenu de vos revenus, charges et de la durée du prêt.",
    long: [
      "La capacité d'emprunt correspond à la somme qu'une banque accepte de vous prêter. Elle dépend de vos revenus, de vos charges, du taux d'endettement maximal (≈ 35 %), du taux d'intérêt et de la durée.",
      "Augmenter l'apport ou allonger la durée augmente le bien finançable, mais la durée fait grimper le coût total des intérêts.",
    ],
    sims: ['/simulateurs/emprunt-immobilier'],
    related: ['taux-endettement', 'apport'],
  },
  {
    slug: 'apport', term: 'Apport personnel', full: 'Apport personnel',
    aliases: ['apport personnel'], category: 'Immobilier',
    short: "Somme que vous financez vous-même dans un achat, en complément du prêt. Souvent ~10 % minimum.",
    long: [
      "L'apport personnel est la part du projet payée sans emprunter (épargne, donation, PEL…). Les banques demandent souvent au moins 10 % pour couvrir les frais de notaire et de garantie.",
      "Un apport élevé rassure la banque, peut faire baisser le taux et réduit le montant — donc le coût — du crédit.",
    ],
    sims: ['/simulateurs/emprunt-immobilier', '/simulateurs/ptz'],
    related: ['frais-notaire', 'capacite-emprunt'],
  },
  {
    slug: 'frais-notaire', term: 'Frais de notaire', full: "Frais de notaire (frais d'acquisition)",
    aliases: ['frais de notaire', "frais d'acquisition"], category: 'Immobilier',
    short: "Frais liés à l'achat immobilier (~7-8 % dans l'ancien, ~2-3 % dans le neuf), surtout des taxes.",
    long: [
      "Les « frais de notaire » regroupent les droits de mutation (taxes versées à l'État et aux collectivités), les débours et la rémunération du notaire. Ils représentent environ 7 à 8 % du prix dans l'ancien, 2 à 3 % dans le neuf.",
      "La part réellement perçue par le notaire (émoluments) est minoritaire : l'essentiel est constitué de taxes.",
    ],
    sims: ['/simulateurs/emprunt-immobilier'],
    related: ['apport', 'plus-value-immobiliere'],
  },
  {
    slug: 'amortissement', term: 'Amortissement', full: 'Amortissement du capital',
    aliases: ['amortissement'], category: 'Immobilier',
    short: "Remboursement progressif du capital emprunté. En début de prêt, la mensualité paie surtout des intérêts.",
    long: [
      "Dans un prêt amortissable, chaque mensualité rembourse une part d'intérêts et une part de capital. Le tableau d'amortissement détaille cette répartition mois par mois.",
      "Au début, la part d'intérêts domine ; elle diminue avec le temps tandis que la part de capital augmente.",
    ],
    sims: ['/simulateurs/emprunt-immobilier', '/simulateurs/credit-conso'],
    related: ['taeg', 'capacite-emprunt'],
  },
  {
    slug: 'rendement-locatif', term: 'Rendement locatif', full: 'Rendement locatif',
    aliases: ['rendement locatif'], category: 'Immobilier',
    short: "Rapport entre les loyers annuels et le prix du bien. On distingue rendement brut et net.",
    long: [
      "Le rendement locatif brut = (loyers annuels / prix d'achat) × 100. Le rendement net déduit les charges, la taxe foncière, les frais de gestion et la fiscalité.",
      "C'est l'indicateur clé pour comparer des investissements locatifs, à mettre en regard du risque de vacance et de la plus-value potentielle.",
    ],
    sims: ['/simulateurs/rendement-locatif'],
    related: ['lmnp', 'plus-value-immobiliere'],
  },
  {
    slug: 'lmnp', term: 'LMNP', full: 'Loueur en Meublé Non Professionnel',
    aliases: ['LMNP'], category: 'Immobilier',
    short: "Statut fiscal de la location meublée permettant d'amortir le bien et de réduire l'impôt sur les loyers.",
    long: [
      "Le statut LMNP s'applique à la location de logements meublés quand les recettes restent sous certains seuils. Au régime réel, il permet de déduire les charges et d'amortir le bien, réduisant fortement la fiscalité des loyers.",
      "Alternative : le régime micro-BIC, avec un abattement forfaitaire de 50 % (ou 30 % pour certains meublés de tourisme).",
    ],
    sims: ['/simulateurs/rendement-locatif'],
    related: ['rendement-locatif', 'abattement'],
  },

  // ── Impôts / fiscalité ─────────────────────────────────────────────────────
  {
    slug: 'tmi', term: 'TMI', full: "Tranche Marginale d'Imposition",
    aliases: ['TMI'], category: 'Impôts',
    short: "Taux d'imposition appliqué à la dernière tranche de vos revenus (0, 11, 30, 41 ou 45 %).",
    long: [
      "La TMI est le taux du barème progressif qui s'applique à la part la plus élevée de votre revenu imposable. Elle ne s'applique pas à tout le revenu, mais seulement à la fraction comprise dans cette tranche.",
      "La TMI sert à estimer l'économie d'impôt d'une déduction (versement PER, par exemple) : 1 000 € déduits à une TMI de 30 % font économiser 300 €.",
    ],
    sims: ['/simulateurs/impot-revenu', '/simulateurs/per'],
    related: ['ir', 'quotient-familial', 'per'],
  },
  {
    slug: 'ir', term: 'IR', full: 'Impôt sur le Revenu',
    aliases: ['impôt sur le revenu'], category: 'Impôts',
    short: "Impôt progressif calculé sur les revenus du foyer après application du quotient familial.",
    long: [
      "L'impôt sur le revenu (IR) est calculé selon un barème progressif par tranches, après division du revenu imposable par le nombre de parts (quotient familial). Une décote peut réduire l'impôt des foyers modestes.",
      "Il est prélevé à la source, avec régularisation l'année suivante selon la déclaration.",
    ],
    sims: ['/simulateurs/impot-revenu'],
    related: ['tmi', 'quotient-familial', 'decote'],
  },
  {
    slug: 'quotient-familial', term: 'Quotient familial', full: 'Quotient familial',
    aliases: ['quotient familial'], category: 'Impôts',
    short: "Nombre de parts du foyer fiscal servant à diviser le revenu pour calculer l'impôt.",
    long: [
      "Le quotient familial attribue des parts selon la composition du foyer (1 part par adulte, 0,5 part par enfant, etc.). Le revenu imposable est divisé par ce nombre de parts avant application du barème.",
      "Ce mécanisme réduit l'impôt des familles, dans la limite d'un plafond par demi-part.",
    ],
    sims: ['/simulateurs/impot-revenu'],
    related: ['ir', 'tmi'],
  },
  {
    slug: 'pfu', term: 'PFU', full: 'Prélèvement Forfaitaire Unique (flat tax)',
    aliases: ['PFU', 'flat tax'], category: 'Impôts',
    short: "Imposition forfaitaire de 31,4 % sur les revenus du capital (12,8 % d'impôt + 18,6 % de prélèvements sociaux depuis 2026).",
    long: [
      "Le Prélèvement Forfaitaire Unique, ou « flat tax », taxe la plupart des revenus du capital (dividendes, intérêts, plus-values mobilières) à 31,4 % depuis 2026 : 12,8 % au titre de l'impôt et 18,6 % de prélèvements sociaux (contre 30 % au total avant la hausse de la CSG votée en loi de financement de la Sécurité sociale pour 2026).",
      "On peut renoncer au PFU pour opter pour le barème progressif si c'est plus avantageux (faible TMI).",
    ],
    sims: ['/simulateurs/assurance-vie', '/simulateurs/comparateur'],
    related: ['prelevements-sociaux', 'tmi', 'assurance-vie'],
  },
  {
    slug: 'prelevements-sociaux', term: 'Prélèvements sociaux', full: 'Prélèvements sociaux',
    aliases: ['prélèvements sociaux'], category: 'Impôts',
    short: "Contributions (CSG, CRDS…) prélevées sur les revenus du capital : 18,6 % pour la plupart, 17,2 % pour quelques exceptions.",
    long: [
      "Depuis 2026, le taux des prélèvements sociaux sur les revenus du capital est passé de 17,2 % à 18,6 % (hausse de la CSG votée en loi de financement de la Sécurité sociale pour 2026) : intérêts, dividendes, plus-values mobilières, PEA.",
      "Quelques revenus restent exceptionnellement taxés à l'ancien taux de 17,2 % : les gains d'assurance-vie, les plus-values immobilières et les intérêts de Livret d'épargne (CEL/PEL).",
      "Ils s'ajoutent à l'impôt sur le revenu (ou sont inclus dans le PFU, désormais à 31,4 % au total pour les revenus concernés par la hausse).",
    ],
    sims: ['/simulateurs/assurance-vie', '/simulateurs/plus-value-immobiliere'],
    related: ['csg', 'pfu'],
  },
  {
    slug: 'csg', term: 'CSG', full: 'Contribution Sociale Généralisée',
    aliases: ['CSG'], category: 'Impôts',
    short: "Prélèvement social finançant la protection sociale, dû sur la plupart des revenus.",
    long: [
      "La CSG est un prélèvement social assis sur les revenus d'activité, de remplacement (retraites, chômage) et du capital. Son taux varie selon la nature du revenu (ex. 9,2 % sur les salaires).",
      "Une partie de la CSG est déductible du revenu imposable.",
    ],
    sims: ['/simulateurs/salaire', '/simulateurs/impot-revenu'],
    related: ['crds', 'prelevements-sociaux'],
  },
  {
    slug: 'crds', term: 'CRDS', full: 'Contribution au Remboursement de la Dette Sociale',
    aliases: ['CRDS'], category: 'Impôts',
    short: "Prélèvement social de 0,5 % destiné à résorber la dette de la Sécurité sociale.",
    long: [
      "La CRDS est une contribution de 0,5 % prélevée sur une assiette large de revenus, créée pour rembourser la dette sociale. Elle accompagne généralement la CSG.",
    ],
    sims: ['/simulateurs/salaire'],
    related: ['csg', 'prelevements-sociaux'],
  },
  {
    slug: 'plus-value-immobiliere', term: 'Plus-value immobilière', full: 'Plus-value immobilière',
    aliases: ['plus-value immobilière'], category: 'Impôts',
    short: "Gain réalisé à la revente d'un bien, taxé après abattements pour durée de détention.",
    long: [
      "La plus-value immobilière est la différence entre le prix de vente et le prix d'achat (majoré de certains frais). La résidence principale en est exonérée.",
      "Pour les autres biens, elle est taxée à 19 % d'impôt + 17,2 % de prélèvements sociaux, avec des abattements croissants selon la durée de détention (exonération totale après 22 ans pour l'impôt, 30 ans pour les prélèvements sociaux).",
    ],
    sims: ['/simulateurs/plus-value-immobiliere'],
    related: ['abattement', 'prelevements-sociaux'],
  },
  {
    slug: 'abattement', term: 'Abattement', full: 'Abattement fiscal',
    aliases: ['abattement'], category: 'Impôts',
    short: "Réduction appliquée à une base imposable avant calcul de l'impôt.",
    long: [
      "Un abattement diminue le montant soumis à l'impôt. Il peut être forfaitaire (ex. 10 % sur les salaires, 50 % en micro-BIC) ou dépendre d'une durée (plus-values).",
      "L'assurance-vie bénéficie d'un abattement annuel sur les gains après 8 ans (4 600 € seul / 9 200 € en couple).",
    ],
    sims: ['/simulateurs/assurance-vie', '/simulateurs/plus-value-immobiliere'],
    related: ['assurance-vie', 'plus-value-immobiliere'],
  },

  // ── Retraite ───────────────────────────────────────────────────────────────
  {
    slug: 'agirc-arrco', term: 'Agirc-Arrco', full: 'Régime de retraite complémentaire Agirc-Arrco',
    aliases: ['Agirc-Arrco', 'Agirc Arrco'], category: 'Retraite',
    short: "Retraite complémentaire obligatoire des salariés du privé, fonctionnant par points.",
    long: [
      "L'Agirc-Arrco est le régime complémentaire obligatoire des salariés du secteur privé. Vos cotisations sont converties en points ; à la retraite, la pension = nombre de points × valeur du point.",
      "Elle s'ajoute à la retraite de base de la CNAV. Un coefficient de solidarité (bonus-malus) peut s'appliquer selon l'âge de départ.",
    ],
    sims: ['/simulateurs/agirc-arrco'],
    related: ['cnav', 'points-retraite', 'taux-plein'],
  },
  {
    slug: 'cnav', term: 'CNAV', full: "Caisse Nationale d'Assurance Vieillesse",
    aliases: ['CNAV'], category: 'Retraite',
    short: "Régime de base de la retraite des salariés du privé (« régime général »).",
    long: [
      "La CNAV gère la retraite de base du régime général. La pension dépend du salaire annuel moyen (25 meilleures années), du taux (jusqu'à 50 % au taux plein) et du nombre de trimestres validés.",
      "Elle se complète avec l'Agirc-Arrco pour les salariés du privé.",
    ],
    sims: ['/simulateurs/cnav'],
    related: ['agirc-arrco', 'sam', 'taux-plein', 'trimestre'],
  },
  {
    slug: 'ircantec', term: 'IRCANTEC', full: 'Institution de Retraite Complémentaire des Agents Non Titulaires',
    aliases: ['IRCANTEC'], category: 'Retraite',
    short: "Retraite complémentaire par points des agents non titulaires du secteur public.",
    long: [
      "L'IRCANTEC est le régime complémentaire des contractuels de la fonction publique et de certains élus. Comme l'Agirc-Arrco, il fonctionne par points.",
    ],
    sims: ['/simulateurs/ircantec'],
    related: ['points-retraite', 'cnav'],
  },
  {
    slug: 'pass', term: 'PASS', full: 'Plafond Annuel de la Sécurité Sociale',
    aliases: ['PASS'], category: 'Retraite',
    short: "Montant de référence (48 060 € en 2026) servant au calcul de nombreuses cotisations et plafonds.",
    long: [
      "Le PASS est revalorisé chaque année. Il sert de référence à de multiples calculs : plafond de déduction du PER, tranches de cotisations retraite, calcul des indemnités, etc.",
      "On parle souvent en multiples du PASS (1 PASS, 8 PASS…).",
    ],
    sims: ['/simulateurs/per', '/simulateurs/independants'],
    related: ['per', 'smic'],
  },
  {
    slug: 'taux-plein', term: 'Taux plein', full: 'Retraite à taux plein',
    aliases: ['taux plein'], category: 'Retraite',
    short: "Taux maximal de la retraite de base (50 %), sans décote, sous condition de trimestres ou d'âge.",
    long: [
      "Le taux plein (50 % du salaire annuel moyen pour le régime général) s'obtient en réunissant le nombre de trimestres requis, ou automatiquement à l'âge du taux plein (67 ans).",
      "Partir sans le taux plein entraîne une décote ; le dépasser permet une surcote.",
    ],
    sims: ['/simulateurs/cnav', '/simulateurs/agirc-arrco'],
    related: ['decote', 'surcote', 'trimestre'],
  },
  {
    slug: 'decote', term: 'Décote', full: 'Décote de retraite',
    aliases: ['décote'], category: 'Retraite',
    short: "Réduction définitive de la pension en cas de départ sans le nombre de trimestres requis.",
    long: [
      "La décote s'applique quand on part à la retraite avant d'avoir le taux plein. Elle réduit le taux de pension d'un coefficient par trimestre manquant, de façon définitive.",
    ],
    sims: ['/simulateurs/cnav', '/simulateurs/agirc-arrco'],
    related: ['taux-plein', 'surcote', 'trimestre'],
  },
  {
    slug: 'surcote', term: 'Surcote', full: 'Surcote de retraite',
    aliases: ['surcote'], category: 'Retraite',
    short: "Majoration de la pension pour chaque trimestre travaillé au-delà du taux plein.",
    long: [
      "La surcote augmente la pension lorsqu'on continue à travailler après avoir atteint le taux plein et l'âge légal. Chaque trimestre supplémentaire majore la retraite de base.",
    ],
    sims: ['/simulateurs/cnav'],
    related: ['taux-plein', 'decote'],
  },
  {
    slug: 'trimestre', term: 'Trimestre', full: 'Trimestre de retraite',
    aliases: ['trimestre'], category: 'Retraite',
    short: "Unité de durée d'assurance. Il en faut ~172 (selon l'année de naissance) pour le taux plein.",
    long: [
      "Les trimestres se valident par les cotisations (un trimestre par tranche de revenu équivalente à 150 SMIC horaire) ou par des périodes assimilées (maladie, chômage, maternité…).",
      "Le nombre requis pour le taux plein dépend de l'année de naissance (172 trimestres = 43 ans pour les générations récentes).",
    ],
    sims: ['/simulateurs/cnav'],
    related: ['taux-plein', 'decote', 'sam'],
  },
  {
    slug: 'sam', term: 'SAM', full: 'Salaire Annuel Moyen',
    aliases: ['salaire annuel moyen'], category: 'Retraite',
    short: "Moyenne de vos 25 meilleures années de salaire, base du calcul de la retraite de base.",
    long: [
      "Le Salaire Annuel Moyen est calculé sur les 25 années où votre salaire (plafonné au PASS) a été le plus élevé. La retraite de base = SAM × taux × (trimestres acquis / trimestres requis).",
    ],
    sims: ['/simulateurs/cnav'],
    related: ['cnav', 'taux-plein', 'trimestre'],
  },
  {
    slug: 'points-retraite', term: 'Points de retraite', full: 'Points de retraite',
    aliases: ['points de retraite'], category: 'Retraite',
    short: "Unités acquises via les cotisations dans les régimes complémentaires ; converties en pension à la liquidation.",
    long: [
      "Dans les régimes par points (Agirc-Arrco, IRCANTEC…), les cotisations achètent des points à un « prix d'achat ». À la retraite, pension = nombre de points × valeur de service du point.",
      "La valeur du point est revalorisée périodiquement.",
    ],
    sims: ['/simulateurs/agirc-arrco', '/simulateurs/ircantec'],
    related: ['agirc-arrco', 'ircantec'],
  },
  {
    slug: 'per', term: 'PER', full: "Plan d'Épargne Retraite",
    aliases: ['PER'], category: 'Retraite',
    short: "Enveloppe d'épargne retraite : les versements sont déductibles du revenu imposable, dans un plafond.",
    long: [
      "Le PER permet d'épargner pour la retraite avec un avantage fiscal à l'entrée : les versements sont déductibles du revenu imposable, dans la limite d'un plafond (10 % des revenus, lié au PASS).",
      "L'économie d'impôt dépend de votre TMI. À la sortie (capital ou rente), l'épargne est imposée.",
    ],
    sims: ['/simulateurs/per'],
    related: ['tmi', 'pass', 'assurance-vie'],
  },
  {
    slug: 'smic', term: 'SMIC', full: 'Salaire Minimum Interprofessionnel de Croissance',
    aliases: ['SMIC'], category: 'Retraite',
    short: "Salaire horaire minimum légal. Sert notamment à valider les trimestres de retraite.",
    long: [
      "Le SMIC fixe la rémunération minimale légale. Au-delà du salaire, il sert de référence à divers calculs sociaux : la validation d'un trimestre de retraite requiert un revenu d'au moins 150 fois le SMIC horaire.",
    ],
    sims: ['/simulateurs/salaire'],
    related: ['trimestre', 'pass'],
  },

  // ── Épargne / placements / FIRE ────────────────────────────────────────────
  {
    slug: 'pea', term: 'PEA', full: "Plan d'Épargne en Actions",
    aliases: ['PEA'], category: 'Finances',
    short: "Enveloppe pour investir en actions européennes, exonérée d'impôt sur les gains après 5 ans.",
    long: [
      "Le PEA permet d'investir en actions et fonds européens. Après 5 ans de détention, les gains sont exonérés d'impôt sur le revenu (restent dus les prélèvements sociaux, passés à 18,6 % en 2026).",
      "Le plafond de versement est de 150 000 €. C'est une enveloppe privilégiée pour l'investissement long terme en ETF européens.",
    ],
    sims: ['/simulateurs/comparateur', '/simulateurs/epargne'],
    related: ['etf', 'assurance-vie', 'pfu'],
  },
  {
    slug: 'assurance-vie', term: 'Assurance-vie', full: 'Assurance-vie',
    aliases: ['assurance-vie', 'assurance vie'], category: 'Finances',
    short: "Placement souple à fiscalité avantageuse après 8 ans, avec abattement annuel sur les gains.",
    long: [
      "L'assurance-vie est l'enveloppe d'épargne préférée des Français. Elle mêle fonds en euros (sécurisé) et unités de compte (potentiellement plus rémunératrices mais risquées).",
      "Après 8 ans, les rachats bénéficient d'un abattement annuel (4 600 € seul / 9 200 € en couple) et d'une fiscalité réduite. C'est aussi un outil de transmission performant.",
    ],
    sims: ['/simulateurs/assurance-vie'],
    related: ['abattement', 'pfu', 'pea'],
  },
  {
    slug: 'etf', term: 'ETF', full: 'Exchange Traded Fund (tracker)',
    aliases: ['ETF', 'tracker'], category: 'Finances',
    short: "Fonds indiciel coté en bourse qui réplique un indice (ex. S&P 500, MSCI World) à frais réduits.",
    long: [
      "Un ETF, ou tracker, est un fonds qui réplique passivement la performance d'un indice. Ses frais de gestion sont très faibles comparés aux fonds actifs.",
      "Les ETF World ou S&P 500 sont des supports courants pour un investissement long terme diversifié, logeables en PEA ou assurance-vie.",
    ],
    sims: ['/simulateurs/comparateur', '/simulateurs/epargne'],
    related: ['pea', 'cagr', 'interets-composes'],
  },
  {
    slug: 'interets-composes', term: 'Intérêts composés', full: 'Intérêts composés',
    aliases: ['intérêts composés'], category: 'Finances',
    short: "Mécanisme où les intérêts génèrent eux-mêmes des intérêts, accélérant la croissance dans le temps.",
    long: [
      "Avec les intérêts composés, les gains d'une période s'ajoutent au capital et produisent à leur tour des gains. L'effet « boule de neige » devient spectaculaire sur le long terme.",
      "C'est le moteur principal de la constitution d'un patrimoine : plus on commence tôt, plus l'effet est puissant.",
    ],
    sims: ['/simulateurs/epargne', '/simulateurs/fire'],
    related: ['capitalisation', 'cagr', 'taux-epargne'],
  },
  {
    slug: 'capitalisation', term: 'Capitalisation', full: 'Capitalisation',
    aliases: ['capitalisation'], category: 'Finances',
    short: "Réinvestissement des revenus (intérêts, dividendes) pour faire croître le capital plutôt que les distribuer.",
    long: [
      "La capitalisation consiste à réinvestir automatiquement les revenus produits par un placement. Combinée à la durée, elle exploite pleinement les intérêts composés.",
      "Les ETF « capitalisants » réinvestissent les dividendes, contrairement aux ETF « distribuants ».",
    ],
    sims: ['/simulateurs/epargne'],
    related: ['interets-composes', 'etf'],
  },
  {
    slug: 'cagr', term: 'CAGR', full: 'Taux de croissance annuel moyen',
    aliases: ['CAGR'], category: 'Finances',
    short: "Rendement annualisé moyen d'un placement sur une période, lissant les variations.",
    long: [
      "Le CAGR (Compound Annual Growth Rate) exprime la croissance moyenne d'un investissement par an sur une durée donnée, comme si elle avait été régulière.",
      "Il permet de comparer des placements sur des périodes différentes, indépendamment de la volatilité année par année.",
    ],
    sims: ['/simulateurs/comparateur'],
    related: ['etf', 'interets-composes'],
  },
  {
    slug: 'fire', term: 'FIRE', full: 'Financial Independence, Retire Early',
    aliases: ['FIRE'], category: 'FIRE',
    short: "Mouvement visant l'indépendance financière pour pouvoir cesser de travailler bien avant l'âge de la retraite.",
    long: [
      "Le FIRE (indépendance financière, retraite anticipée) consiste à épargner et investir agressivement pour atteindre un capital permettant de vivre de ses placements.",
      "L'objectif est souvent estimé à 25 fois les dépenses annuelles (règle des 4 %). Il existe des variantes : Lean, Coast, Barista et Fat FIRE.",
    ],
    sims: ['/simulateurs/fire'],
    related: ['swr', 'taux-epargne', 'interets-composes'],
  },
  {
    slug: 'swr', term: 'Règle des 4 %', full: 'Taux de retrait sûr (règle des 4 %)',
    aliases: ['règle des 4 %', 'règle des 4%', 'SWR'], category: 'FIRE',
    short: "Hypothèse selon laquelle retirer 4 % de son capital par an permet de le faire durer ~30 ans.",
    long: [
      "La règle des 4 % (Safe Withdrawal Rate) découle de l'étude Trinity : retirer 4 % du portefeuille initial la première année, puis ajuster à l'inflation, offre une forte probabilité de ne pas épuiser le capital sur 30 ans.",
      "Elle implique un capital cible d'environ 25 fois les dépenses annuelles. À adapter au contexte français (fiscalité, horizon plus long).",
    ],
    sims: ['/simulateurs/fire'],
    related: ['fire', 'taux-epargne'],
  },
  {
    slug: 'taux-epargne', term: "Taux d'épargne", full: "Taux d'épargne",
    aliases: ["taux d'épargne"], category: 'Budget',
    short: "Part de vos revenus que vous épargnez chaque mois. Levier n°1 vers l'indépendance financière.",
    long: [
      "Le taux d'épargne = épargne / revenus nets. C'est le facteur qui influence le plus la vitesse à laquelle on construit un patrimoine — davantage que le rendement, surtout au début.",
      "La règle 50/30/20 suggère d'y consacrer au moins 20 % des revenus.",
    ],
    sims: ['/simulateurs/budget', '/simulateurs/fire', '/simulateurs/epargne'],
    related: ['fire', 'interets-composes'],
  },

  // ── Épargne réglementée & supports ──────────────────────────────────────────
  {
    slug: 'livret-a', term: 'Livret A', full: 'Livret A',
    aliases: ['Livret A'], category: 'Finances',
    short: "Livret d'épargne réglementé, sans risque, défiscalisé et disponible à tout moment.",
    long: [
      "Le Livret A est l'épargne de précaution par excellence : capital garanti, intérêts exonérés d'impôt et de prélèvements sociaux, retraits libres. Son taux est fixé par l'État.",
      "Son plafond est de 22 950 €. Idéal pour l'épargne de précaution (3 à 6 mois de dépenses), mais son rendement couvre rarement l'inflation sur le long terme.",
    ],
    sims: ['/simulateurs/epargne', '/simulateurs/budget'],
    related: ['ldds', 'inflation', 'taux-epargne'],
  },
  {
    slug: 'ldds', term: 'LDDS', full: 'Livret de Développement Durable et Solidaire',
    aliases: ['LDDS'], category: 'Finances',
    short: "Livret réglementé proche du Livret A, défiscalisé, plafonné à 12 000 €.",
    long: [
      "Le LDDS fonctionne comme le Livret A (capital garanti, intérêts nets d'impôt, retraits libres) avec un plafond de 12 000 €. Il finance l'économie sociale et la transition écologique.",
      "On le cumule souvent avec le Livret A pour augmenter sa réserve d'épargne défiscalisée.",
    ],
    sims: ['/simulateurs/epargne'],
    related: ['livret-a', 'taux-epargne'],
  },
  {
    slug: 'pel', term: 'PEL', full: "Plan d'Épargne Logement",
    aliases: ['PEL'], category: 'Immobilier',
    short: "Épargne bloquée rémunérée ouvrant droit à un prêt immobilier à taux fixé à l'ouverture.",
    long: [
      "Le PEL est un produit d'épargne destiné à préparer un achat immobilier. Il offre un taux de rémunération garanti et, après une phase d'épargne, un droit à prêt à un taux connu d'avance.",
      "Les intérêts des PEL récents sont fiscalisés (PFU). Son intérêt dépend fortement du contexte de taux au moment de l'ouverture.",
    ],
    sims: ['/simulateurs/emprunt-immobilier', '/simulateurs/epargne'],
    related: ['apport', 'pfu'],
  },
  {
    slug: 'fonds-euros', term: 'Fonds en euros', full: 'Fonds en euros',
    aliases: ['fonds en euros', 'fonds euros'], category: 'Finances',
    short: "Support d'assurance-vie à capital garanti, sécurisé mais peu rémunérateur.",
    long: [
      "Le fonds en euros est le compartiment sécurisé de l'assurance-vie : le capital est garanti et les intérêts acquis le sont définitivement (effet cliquet).",
      "En contrepartie de cette sécurité, son rendement est modeste. Il se combine souvent avec des unités de compte pour viser plus de performance.",
    ],
    sims: ['/simulateurs/assurance-vie'],
    related: ['assurance-vie', 'unites-de-compte'],
  },
  {
    slug: 'unites-de-compte', term: 'Unités de compte', full: 'Unités de compte (UC)',
    aliases: ['unités de compte', 'unité de compte'], category: 'Finances',
    short: "Supports d'assurance-vie investis en actions, fonds ou immobilier : plus de potentiel, mais risque de perte.",
    long: [
      "Les unités de compte (UC) sont les supports non garantis de l'assurance-vie : ETF, fonds actions, SCPI… Leur valeur fluctue avec les marchés.",
      "Elles offrent un meilleur potentiel de rendement que le fonds en euros sur le long terme, au prix d'un risque de perte en capital.",
    ],
    sims: ['/simulateurs/assurance-vie', '/simulateurs/comparateur'],
    related: ['fonds-euros', 'etf', 'scpi', 'volatilite'],
  },
  {
    slug: 'scpi', term: 'SCPI', full: 'Société Civile de Placement Immobilier',
    aliases: ['SCPI'], category: 'Immobilier',
    short: "« Pierre-papier » : on achète des parts d'un parc immobilier géré, pour toucher des loyers sans gestion directe.",
    long: [
      "Une SCPI collecte l'épargne de nombreux investisseurs pour acheter et gérer un patrimoine immobilier (bureaux, commerces, santé…). Les associés perçoivent des revenus proportionnels à leurs parts.",
      "Avantages : mutualisation, accessibilité, aucune gestion. Inconvénients : frais d'entrée élevés, liquidité limitée et fiscalité des revenus fonciers.",
    ],
    sims: ['/simulateurs/rendement-locatif', '/simulateurs/patrimoine'],
    related: ['rendement-locatif', 'unites-de-compte', 'deficit-foncier'],
  },
  {
    slug: 'dca', term: 'DCA', full: 'Dollar Cost Averaging (investissement programmé)',
    aliases: ['DCA'], category: 'Finances',
    short: "Investir une somme fixe à intervalles réguliers pour lisser le prix d'achat et réduire le risque de timing.",
    long: [
      "Le DCA (investissement programmé) consiste à placer un montant constant à intervalle régulier, quelles que soient les conditions de marché. On achète ainsi plus de parts quand les prix baissent, moins quand ils montent.",
      "Cette discipline lisse le prix de revient moyen et évite de tout investir au mauvais moment. C'est une stratégie courante pour les ETF.",
    ],
    sims: ['/simulateurs/epargne', '/simulateurs/comparateur'],
    related: ['etf', 'volatilite', 'interets-composes'],
  },
  {
    slug: 'diversification', term: 'Diversification', full: 'Diversification',
    aliases: ['diversification'], category: 'Finances',
    short: "Répartir ses placements (classes d'actifs, zones, secteurs) pour réduire le risque global.",
    long: [
      "La diversification consiste à ne pas concentrer son patrimoine sur un seul actif. En combinant des placements peu corrélés, on réduit l'impact d'une mauvaise performance isolée.",
      "C'est l'un des rares « repas gratuits » en finance : moins de risque pour un rendement attendu comparable.",
    ],
    sims: ['/simulateurs/patrimoine', '/simulateurs/comparateur'],
    related: ['volatilite', 'etf', 'unites-de-compte'],
  },
  {
    slug: 'volatilite', term: 'Volatilité', full: 'Volatilité',
    aliases: ['volatilité'], category: 'Finances',
    short: "Mesure de l'ampleur des variations d'un placement : plus elle est élevée, plus le risque est grand.",
    long: [
      "La volatilité quantifie l'amplitude des fluctuations de la valeur d'un actif. Une forte volatilité signifie des hausses et des baisses marquées, donc un risque plus élevé à court terme.",
      "Les actions sont plus volatiles que les fonds en euros. Sur le long terme, la diversification et la durée atténuent son impact.",
    ],
    sims: ['/simulateurs/comparateur'],
    related: ['diversification', 'etf', 'fire'],
  },
  {
    slug: 'inflation', term: 'Inflation', full: 'Inflation',
    aliases: ['inflation'], category: 'Finances',
    short: "Hausse générale des prix qui érode le pouvoir d'achat de l'épargne au fil du temps.",
    long: [
      "L'inflation correspond à l'augmentation moyenne des prix. Elle réduit la valeur réelle de l'argent : 1 000 € aujourd'hui achèteront moins de biens dans 10 ans.",
      "Pour préserver son pouvoir d'achat, il faut viser un rendement supérieur à l'inflation (rendement réel positif).",
    ],
    sims: ['/simulateurs/epargne', '/simulateurs/salaire'],
    related: ['rendement-reel', 'livret-a', 'interets-composes'],
  },
  {
    slug: 'rendement-reel', term: 'Rendement réel', full: 'Rendement réel',
    aliases: ['rendement réel'], category: 'Finances',
    short: "Rendement d'un placement après déduction de l'inflation : le vrai gain de pouvoir d'achat.",
    long: [
      "Le rendement réel = rendement nominal − inflation. C'est lui qui mesure l'enrichissement véritable : un livret à 3 % avec 2 % d'inflation ne rapporte réellement qu'environ 1 %.",
      "Un rendement réel négatif signifie une perte de pouvoir d'achat, même si le capital nominal augmente.",
    ],
    sims: ['/simulateurs/epargne'],
    related: ['inflation', 'interets-composes'],
  },
  {
    slug: 'effet-levier', term: 'Effet de levier', full: 'Effet de levier du crédit',
    aliases: ['effet de levier'], category: 'Immobilier',
    short: "Utiliser l'emprunt pour investir plus que son apport et amplifier la rentabilité des fonds propres.",
    long: [
      "L'effet de levier consiste à financer un investissement (souvent immobilier) par l'emprunt. Si la rentabilité du bien dépasse le coût du crédit, le rendement de votre apport est démultiplié.",
      "Le levier amplifie les gains mais aussi les pertes : c'est un outil puissant à manier avec prudence.",
    ],
    sims: ['/simulateurs/rendement-locatif', '/simulateurs/emprunt-immobilier'],
    related: ['rendement-locatif', 'taeg'],
  },

  // ── Fiscalité & patrimoine ──────────────────────────────────────────────────
  {
    slug: 'ifi', term: 'IFI', full: 'Impôt sur la Fortune Immobilière',
    aliases: ['IFI'], category: 'Impôts',
    short: "Impôt annuel sur le patrimoine immobilier net supérieur à 1,3 million d'euros.",
    long: [
      "L'IFI a remplacé l'ISF en 2018. Il ne porte que sur le patrimoine immobilier net (hors actifs financiers) lorsque sa valeur dépasse 1,3 million d'euros au 1er janvier.",
      "Le barème est progressif et la résidence principale bénéficie d'un abattement de 30 %.",
    ],
    sims: ['/simulateurs/patrimoine'],
    related: ['abattement', 'rfr'],
  },
  {
    slug: 'rfr', term: 'RFR', full: 'Revenu Fiscal de Référence',
    aliases: ['revenu fiscal de référence'], category: 'Impôts',
    short: "Indicateur global de vos revenus utilisé pour l'accès à de nombreux dispositifs et plafonds.",
    long: [
      "Le revenu fiscal de référence (RFR) figure sur votre avis d'imposition. Il agrège vos revenus nets imposables et certains revenus exonérés, donnant une mesure large de vos ressources.",
      "Il conditionne l'éligibilité au PTZ, à certaines aides, exonérations locales et barèmes (dont le PTZ et l'IFI).",
    ],
    sims: ['/simulateurs/impot-revenu', '/simulateurs/ptz'],
    related: ['ir', 'ptz'],
  },
  {
    slug: 'prelevement-source', term: 'Prélèvement à la source', full: 'Prélèvement à la source (PAS)',
    aliases: ['prélèvement à la source'], category: 'Impôts',
    short: "Collecte de l'impôt sur le revenu directement sur le salaire ou la pension, en temps réel.",
    long: [
      "Depuis 2019, l'impôt sur le revenu est prélevé à la source : l'employeur (ou la caisse de retraite) retient l'impôt chaque mois selon un taux transmis par l'administration.",
      "Une régularisation a lieu l'année suivante après la déclaration, pour tenir compte des revenus et réductions réels.",
    ],
    sims: ['/simulateurs/impot-revenu', '/simulateurs/salaire'],
    related: ['ir', 'tmi'],
  },
  {
    slug: 'deficit-foncier', term: 'Déficit foncier', full: 'Déficit foncier',
    aliases: ['déficit foncier'], category: 'Immobilier',
    short: "Excédent de charges sur les loyers, déductible du revenu global et reportable, pour réduire l'impôt.",
    long: [
      "En location nue au régime réel, quand les charges déductibles (travaux, intérêts…) dépassent les loyers, on crée un déficit foncier. Il s'impute sur le revenu global dans une certaine limite annuelle, le surplus étant reportable.",
      "C'est un levier d'optimisation pour les propriétaires réalisant des travaux.",
    ],
    sims: ['/simulateurs/rendement-locatif'],
    related: ['rendement-locatif', 'abattement'],
  },
  {
    slug: 'usufruit', term: 'Usufruit', full: 'Usufruit',
    aliases: ['usufruit'], category: 'Impôts',
    short: "Droit d'utiliser un bien et d'en percevoir les revenus, sans en être pleinement propriétaire.",
    long: [
      "L'usufruit confère le droit d'usage d'un bien et de ses fruits (loyers, dividendes). Il s'oppose à la nue-propriété : ensemble, ils forment la pleine propriété (démembrement).",
      "Le démembrement est très utilisé en transmission : donner la nue-propriété en conservant l'usufruit réduit les droits de donation.",
    ],
    sims: ['/simulateurs/patrimoine'],
    related: ['nue-propriete', 'assurance-vie'],
  },
  {
    slug: 'nue-propriete', term: 'Nue-propriété', full: 'Nue-propriété',
    aliases: ['nue-propriété'], category: 'Impôts',
    short: "Propriété d'un bien sans le droit d'en jouir : le nu-propriétaire récupère la pleine propriété au décès de l'usufruitier.",
    long: [
      "Le nu-propriétaire détient le bien mais n'en a ni l'usage ni les revenus tant que dure l'usufruit. À l'extinction de l'usufruit, il reconstitue la pleine propriété sans fiscalité supplémentaire.",
      "Acheter en nue-propriété permet d'investir avec une décote, en vue d'une transmission ou d'une revalorisation à terme.",
    ],
    sims: ['/simulateurs/patrimoine'],
    related: ['usufruit'],
  },

  // ── Retraite (compléments) ──────────────────────────────────────────────────
  {
    slug: 'reversion', term: 'Pension de réversion', full: 'Pension de réversion',
    aliases: ['pension de réversion', 'réversion'], category: 'Retraite',
    short: "Part de la retraite d'un défunt versée au conjoint survivant, sous conditions.",
    long: [
      "La pension de réversion permet au conjoint (ou ex-conjoint) survivant de percevoir une fraction de la retraite du défunt. Les conditions (âge, ressources, mariage) et le taux varient selon les régimes.",
      "Au régime général, elle représente 54 % de la pension de base, sous condition de ressources.",
    ],
    sims: ['/simulateurs/cnav', '/simulateurs/agirc-arrco'],
    related: ['cnav', 'agirc-arrco'],
  },
  {
    slug: 'aspa', term: 'ASPA', full: "Allocation de Solidarité aux Personnes Âgées",
    aliases: ['ASPA'], category: 'Retraite',
    short: "« Minimum vieillesse » : revenu minimal garanti aux retraités les plus modestes.",
    long: [
      "L'ASPA garantit un niveau de ressources minimal aux personnes âgées de 65 ans et plus disposant de faibles revenus. Elle complète les pensions pour atteindre un plancher fixé par l'État.",
      "Elle est récupérable sur la succession au-delà d'un certain montant d'actif net.",
    ],
    sims: ['/simulateurs/cnav'],
    related: ['cnav', 'minimum-contributif'],
  },
  {
    slug: 'minimum-contributif', term: 'Minimum contributif', full: 'Minimum contributif (Mico)',
    aliases: ['minimum contributif'], category: 'Retraite',
    short: "Pension de base minimale pour les salariés ayant cotisé à taux plein avec de faibles revenus.",
    long: [
      "Le minimum contributif (Mico) relève la pension de base des assurés qui partent au taux plein mais ont eu de faibles salaires. Son montant est majoré selon la durée cotisée.",
      "Il diffère de l'ASPA : il récompense la cotisation, sans condition de ressources aussi stricte.",
    ],
    sims: ['/simulateurs/cnav'],
    related: ['taux-plein', 'aspa'],
  },
  {
    slug: 'cumul-emploi-retraite', term: 'Cumul emploi-retraite', full: 'Cumul emploi-retraite',
    aliases: ['cumul emploi-retraite'], category: 'Retraite',
    short: "Possibilité de reprendre une activité rémunérée tout en percevant sa retraite.",
    long: [
      "Le cumul emploi-retraite autorise un retraité à travailler en touchant sa pension. En cumul intégral (taux plein et tous régimes liquidés), il n'y a aucun plafond de revenus.",
      "Depuis 2023, cette reprise peut générer de nouveaux droits à une seconde pension, sous conditions.",
    ],
    sims: ['/simulateurs/cnav', '/simulateurs/retraite-progressive'],
    related: ['taux-plein', 'surcote'],
  },

  // ── Crédit (compléments) ────────────────────────────────────────────────────
  {
    slug: 'taux-usure', term: "Taux d'usure", full: "Taux d'usure",
    aliases: ["taux d'usure"], category: 'Immobilier',
    short: "TAEG maximum légal qu'un prêteur peut appliquer, révisé chaque trimestre par la Banque de France.",
    long: [
      "Le taux d'usure est le plafond légal du TAEG. Tout crédit proposé au-dessus est considéré comme usuraire, donc illégal. Il protège les emprunteurs des conditions abusives.",
      "Il est révisé périodiquement et varie selon le type, le montant et la durée du crédit.",
    ],
    sims: ['/simulateurs/emprunt-immobilier', '/simulateurs/credit-conso'],
    related: ['taeg', 'taux-nominal'],
  },
  {
    slug: 'taux-nominal', term: 'Taux nominal', full: 'Taux nominal (taux débiteur)',
    aliases: ['taux nominal', 'taux débiteur'], category: 'Immobilier',
    short: "Taux d'intérêt « brut » d'un crédit, hors assurance et frais. À ne pas confondre avec le TAEG.",
    long: [
      "Le taux nominal (ou taux débiteur) ne couvre que les intérêts du prêt. Il sert à calculer les mensualités, mais ne reflète pas le coût total.",
      "Pour comparer des offres, c'est le TAEG — qui ajoute assurance et frais — qu'il faut regarder.",
    ],
    sims: ['/simulateurs/emprunt-immobilier', '/simulateurs/credit-conso'],
    related: ['taeg', 'taux-usure'],
  },

  // ── FIRE (variantes) ────────────────────────────────────────────────────────
  {
    slug: 'lean-fire', term: 'Lean FIRE', full: 'Lean FIRE',
    aliases: ['Lean FIRE'], category: 'FIRE',
    short: "Variante du FIRE visant l'indépendance avec un budget modeste, donc un capital cible plus faible.",
    long: [
      "Le Lean FIRE consiste à atteindre l'indépendance financière en optimisant fortement ses dépenses : un train de vie sobre abaisse le capital nécessaire (toujours environ 25 fois les dépenses annuelles).",
      "Il s'atteint plus vite, au prix d'un budget serré et d'une marge de sécurité réduite.",
    ],
    sims: ['/simulateurs/fire'], related: ['fire', 'fat-fire', 'taux-epargne'],
  },
  {
    slug: 'fat-fire', term: 'Fat FIRE', full: 'Fat FIRE',
    aliases: ['Fat FIRE'], category: 'FIRE',
    short: "Indépendance financière avec un niveau de vie confortable, donc un capital cible élevé.",
    long: [
      "Le Fat FIRE vise à vivre de ses placements sans réduire son niveau de vie. Le capital cible est élevé (souvent plus de 1,5 M€) car les dépenses annuelles le sont aussi.",
      "Il demande plus de temps ou de revenus, mais offre un confort et une sécurité supérieurs.",
    ],
    sims: ['/simulateurs/fire'], related: ['fire', 'lean-fire'],
  },
  {
    slug: 'coast-fire', term: 'Coast FIRE', full: 'Coast FIRE',
    aliases: ['Coast FIRE'], category: 'FIRE',
    short: "Avoir déjà assez investi pour que les intérêts composés financent seuls votre retraite, sans nouvel apport.",
    long: [
      "En Coast FIRE, vous avez accumulé un capital suffisant pour qu'il croisse seul jusqu'à la retraite grâce aux intérêts composés. Vous n'avez plus besoin d'épargner pour la retraite.",
      "Vous pouvez alors travailler juste assez pour couvrir vos dépenses courantes et lever le pied.",
    ],
    sims: ['/simulateurs/fire', '/simulateurs/epargne'], related: ['fire', 'interets-composes'],
  },
  {
    slug: 'barista-fire', term: 'Barista FIRE', full: 'Barista FIRE',
    aliases: ['Barista FIRE'], category: 'FIRE',
    short: "Semi-retraite : un petit emploi couvre une partie des dépenses (et la mutuelle), le reste venant des placements.",
    long: [
      "Le Barista FIRE combine un travail à temps partiel et des retraits modérés du portefeuille. Le job d'appoint apporte un complément de revenu et, souvent, une couverture santé.",
      "C'est un compromis entre liberté et sécurité, accessible plus tôt que le FIRE complet.",
    ],
    sims: ['/simulateurs/fire'], related: ['fire', 'coast-fire'],
  },

  // ── Placements & marchés ─────────────────────────────────────────────────────
  {
    slug: 'obligation', term: 'Obligation', full: 'Obligation',
    aliases: ['obligation'], category: 'Finances',
    short: "Titre de dette : en prêtant à un État ou une entreprise, vous percevez des intérêts (coupons).",
    long: [
      "Une obligation est un emprunt émis par un État ou une entreprise. L'investisseur prête une somme et reçoit des intérêts réguliers (coupons), puis le remboursement à l'échéance.",
      "Moins volatiles que les actions, les obligations apportent un revenu et de la stabilité à un portefeuille diversifié.",
    ],
    sims: ['/simulateurs/comparateur', '/simulateurs/patrimoine'], related: ['diversification', 'etf'],
  },
  {
    slug: 'dividende', term: 'Dividende', full: 'Dividende',
    aliases: ['dividende'], category: 'Finances',
    short: "Part des bénéfices d'une entreprise versée à ses actionnaires.",
    long: [
      "Le dividende est la rémunération versée aux actionnaires lorsqu'une société distribue une partie de ses profits. Toutes les entreprises n'en versent pas (certaines réinvestissent).",
      "Réinvestir ses dividendes amplifie l'effet des intérêts composés sur le long terme.",
    ],
    sims: ['/simulateurs/comparateur'], related: ['action', 'capitalisation', 'pfu'],
  },
  {
    slug: 'action', term: 'Action', full: 'Action (titre de propriété)',
    aliases: ['action en bourse'], category: 'Finances',
    short: "Part de propriété d'une entreprise cotée ; potentiel de gain élevé mais volatilité importante.",
    long: [
      "Détenir une action, c'est posséder une fraction d'une entreprise. On peut gagner via la hausse du cours et les dividendes — ou perdre si le cours baisse.",
      "Sur le long terme, les actions ont historiquement offert le meilleur rendement, au prix d'une volatilité élevée. La diversification (ETF) réduit le risque.",
    ],
    sims: ['/simulateurs/comparateur', '/simulateurs/epargne'], related: ['etf', 'dividende', 'volatilite'],
  },
  {
    slug: 'ter', term: 'TER', full: 'Total Expense Ratio (frais de gestion)',
    aliases: ['TER'], category: 'Finances',
    short: "Frais de gestion annuels d'un fonds ou ETF, exprimés en %. Plus ils sont bas, mieux c'est.",
    long: [
      "Le TER mesure le coût annuel de détention d'un fonds (ETF, OPCVM) en pourcentage des sommes investies. Il est prélevé automatiquement, réduisant la performance.",
      "Les ETF indiciels affichent des TER très bas (souvent 0,05 à 0,30 %), bien inférieurs aux fonds actifs — un avantage décisif sur le long terme.",
    ],
    sims: ['/simulateurs/comparateur'], related: ['etf', 'opcvm'],
  },
  {
    slug: 'opcvm', term: 'OPCVM', full: 'Organisme de Placement Collectif en Valeurs Mobilières',
    aliases: ['OPCVM'], category: 'Finances',
    short: "Fonds d'investissement (SICAV, FCP) regroupant l'argent de plusieurs épargnants, géré par des professionnels.",
    long: [
      "Un OPCVM (SICAV ou FCP) mutualise l'épargne pour investir en actions, obligations ou autres. Il permet de diversifier facilement avec un faible montant.",
      "Attention aux frais : les fonds gérés activement ont des frais plus élevés que les ETF, et battent rarement leur indice sur la durée.",
    ],
    sims: ['/simulateurs/comparateur'], related: ['etf', 'ter', 'diversification'],
  },

  // ── Épargne réglementée & immobilier (compléments) ──────────────────────────
  {
    slug: 'cel', term: 'CEL', full: "Compte Épargne Logement",
    aliases: ['CEL'], category: 'Immobilier',
    short: "Épargne réglementée souple ouvrant droit à un prêt immobilier, complément du PEL.",
    long: [
      "Le Compte Épargne Logement (CEL) est plus souple que le PEL : retraits libres, plafond plus bas, et droit à un prêt immobilier à taux réglementé.",
      "Il peut se cumuler avec un PEL pour préparer un achat immobilier.",
    ],
    sims: ['/simulateurs/emprunt-immobilier', '/simulateurs/epargne'], related: ['pel', 'livret-a'],
  },
  {
    slug: 'lep', term: 'LEP', full: "Livret d'Épargne Populaire",
    aliases: ['LEP'], category: 'Finances',
    short: "Livret réglementé réservé aux revenus modestes, au taux supérieur au Livret A et défiscalisé.",
    long: [
      "Le LEP est destiné aux contribuables sous un plafond de revenu fiscal de référence. Son taux est plus élevé que celui du Livret A et ses intérêts sont exonérés.",
      "C'est le placement sans risque le plus rémunérateur pour les foyers éligibles.",
    ],
    sims: ['/simulateurs/epargne'], related: ['livret-a', 'rfr'],
  },
  {
    slug: 'micro-foncier', term: 'Micro-foncier', full: 'Régime micro-foncier',
    aliases: ['micro-foncier'], category: 'Immobilier',
    short: "Régime fiscal simplifié des loyers (location nue) avec un abattement forfaitaire de 30 %.",
    long: [
      "Le micro-foncier s'applique automatiquement sous un plafond de revenus fonciers : un abattement de 30 % couvre forfaitairement les charges, et le reste est imposé.",
      "Au-delà, ou si vos charges réelles dépassent 30 %, le régime réel (avec déduction des charges et déficit foncier) est plus avantageux.",
    ],
    sims: ['/simulateurs/rendement-locatif'], related: ['deficit-foncier', 'abattement', 'lmnp'],
  },
  {
    slug: 'assurance-emprunteur', term: 'Assurance emprunteur', full: 'Assurance emprunteur',
    aliases: ['assurance emprunteur'], category: 'Immobilier',
    short: "Assurance couvrant le remboursement du prêt en cas de décès, invalidité ou incapacité.",
    long: [
      "Exigée par les banques pour un crédit immobilier, l'assurance emprunteur garantit le remboursement en cas d'accident de la vie. Elle représente une part importante du coût total (voir TAEA).",
      "Depuis la loi Lemoine, on peut en changer à tout moment : comparer les offres permet d'économiser plusieurs milliers d'euros.",
    ],
    sims: ['/simulateurs/emprunt-immobilier'], related: ['taea', 'taeg'],
  },

  // ── Impôts & budget (compléments) ───────────────────────────────────────────
  {
    slug: 'credit-impot', term: "Crédit d'impôt", full: "Crédit d'impôt",
    aliases: ["crédit d'impôt"], category: 'Impôts',
    short: "Avantage fiscal remboursé même si vous n'êtes pas imposable (contrairement à la réduction d'impôt).",
    long: [
      "Un crédit d'impôt vient en déduction de votre impôt ; s'il dépasse l'impôt dû, l'excédent vous est remboursé par l'administration (emploi à domicile, garde d'enfants…).",
      "Il diffère de la réduction d'impôt, qui ne peut pas générer de remboursement.",
    ],
    sims: ['/simulateurs/impot-revenu'], related: ['ir', 'tmi'],
  },
  {
    slug: 'reste-a-vivre', term: 'Reste à vivre', full: 'Reste à vivre',
    aliases: ['reste à vivre'], category: 'Budget',
    short: "Ce qu'il reste chaque mois une fois les charges fixes et crédits payés.",
    long: [
      "Le reste à vivre = revenus − charges fixes (loyer/crédit, énergie, assurances…). Les banques l'examinent autant que le taux d'endettement pour accorder un prêt.",
      "Un reste à vivre confortable sécurise votre budget et votre capacité d'épargne.",
    ],
    sims: ['/simulateurs/budget', '/simulateurs/emprunt-immobilier'], related: ['taux-endettement', 'taux-epargne'],
  },
];

// ── Index dérivés ────────────────────────────────────────────────────────────

// Accès par slug.
export const GLOSSARY_BY_SLUG = Object.fromEntries(GLOSSARY.map(t => [t.slug, t]));

// Liste plate { match, slug } triée par longueur décroissante (les expressions
// longues priment, ex. « plus-value immobilière » avant « plus-value »). Utilisée
// par l'auto-liaison et par le composant <Terme>.
export const TERM_MATCHERS = GLOSSARY
  .flatMap(t => [t.term, ...(t.aliases || [])].map(m => ({ match: m, slug: t.slug })))
  .sort((a, b) => b.match.length - a.match.length);

// Catégories dans l'ordre d'affichage du lexique.
export const LEXIQUE_CATEGORIES = ['Retraite', 'Immobilier', 'Impôts', 'Finances', 'FIRE', 'Budget'];
