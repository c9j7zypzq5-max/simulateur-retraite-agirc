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
    short: "Imposition forfaitaire de 30 % sur les revenus du capital (12,8 % d'impôt + 17,2 % de prélèvements sociaux).",
    long: [
      "Le Prélèvement Forfaitaire Unique, ou « flat tax », taxe la plupart des revenus du capital (dividendes, intérêts, plus-values mobilières) à 30 % : 12,8 % au titre de l'impôt et 17,2 % de prélèvements sociaux.",
      "On peut renoncer au PFU pour opter pour le barème progressif si c'est plus avantageux (faible TMI).",
    ],
    sims: ['/simulateurs/assurance-vie', '/simulateurs/comparateur'],
    related: ['prelevements-sociaux', 'tmi', 'assurance-vie'],
  },
  {
    slug: 'prelevements-sociaux', term: 'Prélèvements sociaux', full: 'Prélèvements sociaux',
    aliases: ['prélèvements sociaux'], category: 'Impôts',
    short: "Contributions de 17,2 % (CSG, CRDS…) prélevées sur les revenus du capital.",
    long: [
      "Les prélèvements sociaux s'élèvent à 17,2 % et frappent les revenus du patrimoine et de placement : intérêts, dividendes, plus-values, loyers, gains d'assurance-vie.",
      "Ils s'ajoutent à l'impôt sur le revenu (ou sont inclus dans le PFU de 30 %).",
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
    short: "Montant de référence (47 100 € en 2025) servant au calcul de nombreuses cotisations et plafonds.",
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
      "Le PEA permet d'investir en actions et fonds européens. Après 5 ans de détention, les gains sont exonérés d'impôt sur le revenu (restent dus les 17,2 % de prélèvements sociaux).",
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
