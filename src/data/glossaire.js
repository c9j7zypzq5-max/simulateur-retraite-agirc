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
    faqs: [
      { q: "Quelle est la différence entre TAEG et taux nominal ?", a: "Le taux nominal est le taux d'intérêt pur du prêt. Le TAEG inclut en plus l'assurance emprunteur, les frais de dossier et de garantie. C'est le TAEG qui reflète le coût réel total et qui doit être comparé entre offres." },
      { q: "Le TAEG peut-il dépasser le taux d'usure ?", a: "Non. Le taux d'usure est le plafond légal fixé chaque trimestre par la Banque de France. Tout prêt avec un TAEG supérieur au taux d'usure est illégal. Si votre assurance fait dépasser ce seuil, la banque doit refuser le dossier." },
      { q: "Comment réduire son TAEG ?", a: "Trois leviers : négocier le taux nominal, déléguer l'assurance emprunteur (contrat externe moins cher), et limiter les frais de garantie (caution plutôt qu'hypothèque). La délégation d'assurance est souvent le levier le plus puissant." },
    ],
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
    faqs: [
      { q: "Qui peut bénéficier du PTZ en 2026 ?", a: "Le PTZ est réservé aux primo-accédants (n'ayant pas été propriétaires de leur résidence principale au cours des 2 dernières années), sous conditions de ressources. Depuis le 1er avril 2025, il est accessible dans toutes les zones géographiques, y compris les zones rurales." },
      { q: "Quel est le montant maximum du PTZ en 2026 ?", a: "Le PTZ peut financer jusqu'à 50 % du prix d'achat pour un logement neuf en zone A/A bis, et jusqu'à 40 % pour un logement neuf en zones B et C ou dans l'ancien. Le montant est plafonné selon la zone et la composition du foyer." },
      { q: "Le PTZ est-il cumulable avec d'autres prêts ?", a: "Oui, le PTZ est un prêt complémentaire qui s'ajoute à un prêt principal. Il ne peut pas financer la totalité d'un achat. Il est cumulable avec un prêt bancaire classique, un PEL, un prêt Action Logement, etc." },
    ],
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
    faqs: [
      { q: "Quelle est ma TMI si je gagne 45 000 € nets imposables ?", a: "Pour un célibataire avec un revenu imposable de 45 000 €, la TMI est de 30 % en 2026 (tranche de 29 315 € à 83 823 €). Cela ne signifie pas que vous payez 30 % sur tout votre revenu, mais seulement sur la fraction au-dessus de 29 315 €." },
      { q: "Quelle différence entre TMI et taux moyen d'imposition ?", a: "La TMI est le taux appliqué au dernier euro de revenu. Le taux moyen est le rapport entre l'impôt total et le revenu imposable : il est toujours inférieur à la TMI. Le taux moyen indique ce que vous payez réellement en moyenne." },
      { q: "Pourquoi la TMI est-elle importante pour les décisions financières ?", a: "La TMI détermine l'économie fiscale d'une déduction : verser 1 000 € sur un PER économise 300 € d'impôt à 30 % de TMI, ou 410 € à 41 %. Elle influence aussi le choix entre PFU (31,4 %) et barème progressif pour les revenus du capital." },
    ],
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
    faqs: [
      { q: "À quel âge obtient-on le taux plein automatiquement ?", a: "Le taux plein s'obtient automatiquement à 67 ans pour toutes les générations, quelle que soit la durée de cotisation. Avant 67 ans, il faut avoir validé le nombre de trimestres requis (167 à 172 selon la génération)." },
      { q: "Que se passe-t-il si je pars à la retraite sans le taux plein ?", a: "Une décote s'applique : 0,625 % par trimestre manquant (soit 2,5 % par an manquant), dans la limite de 20 trimestres (25 % de réduction maximum). Cette décote est définitive et s'applique toute la vie." },
      { q: "Le taux plein Agirc-Arrco est-il le même que pour le régime général ?", a: "Non. L'Agirc-Arrco n'a pas de notion de 'taux plein' au sens du régime général. En revanche, un mécanisme de bonus-malus s'applique : partir sans avoir le taux plein CNAV entraîne un coefficient de solidarité de -10 % pendant 3 ans sur la pension Agirc-Arrco." },
    ],
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
    faqs: [
      { q: "Comment est calculé le SAM ?", a: "Le SAM (Salaire Annuel Moyen) est la moyenne de vos 25 meilleures années de salaire brut, plafonné chaque année au PASS (47 100 € en 2026). Les années avec un salaire inférieur ou les années sans revenus ne sont pas retenues si vous avez 25 années meilleures." },
      { q: "Le SAM inclut-il les primes et les heures supplémentaires ?", a: "Oui, le SAM est calculé sur le salaire brut soumis à cotisations, qui inclut primes et heures supplémentaires dans la limite du plafond annuel de la Sécurité sociale. En revanche, certaines indemnités exonérées de cotisations ne sont pas prises en compte." },
      { q: "Comment améliorer son SAM avant la retraite ?", a: "Le SAM étant une moyenne des 25 meilleures années, les stratégies pour l'améliorer sont : demander une augmentation ou une promotion en fin de carrière, éviter une période à temps partiel subi en fin de carrière, et racheter des années d'études (qui peuvent remplacer des années à faible salaire dans le calcul)." },
    ],
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
    faqs: [
      { q: "Quel est le plafond de déduction du PER en 2026 ?", a: "Pour un salarié, le plafond est de 10 % des revenus professionnels de l'année N-1, dans la limite de 10 % de 8 PASS (soit 37 680 € maximum en 2026). Le plancher est de 4 710 € (10 % d'1 PASS). Les plafonds non utilisés des 3 années précédentes sont reportables." },
      { q: "À partir de quelle TMI le PER est-il intéressant ?", a: "Le PER est particulièrement avantageux dès la TMI de 30 % : chaque 1 000 € versés économise 300 € d'impôt immédiatement. À 41 %, l'économie est de 410 €. À 11 %, l'avantage est limité et l'assurance-vie peut être plus souple." },
      { q: "Peut-on sortir du PER avant la retraite ?", a: "Oui, dans certains cas exceptionnels : acquisition de la résidence principale, invalidité, décès du conjoint, surendettement, expiration des droits au chômage, liquidation judiciaire. Ces cas permettent un déblocage anticipé en franchise d'impôt sur les versements volontaires." },
    ],
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
    faqs: [
      { q: "Quelle est la fiscalité du PEA après 5 ans ?", a: "Après 5 ans, les gains du PEA sont exonérés d'impôt sur le revenu lors des retraits. Les prélèvements sociaux restent dus (18,6 % en 2026). Un retrait avant 5 ans entraîne la clôture du PEA et une imposition des gains au PFU (31,4 %)." },
      { q: "Quel est le plafond de versement du PEA ?", a: "Le plafond de versements est de 150 000 € pour un PEA classique. Votre capital peut dépasser ce plafond grâce aux gains accumulés. Le PEA-PME permet des versements complémentaires jusqu'à 225 000 € au total (PEA + PEA-PME)." },
      { q: "PEA ou assurance-vie : que choisir ?", a: "Le PEA est idéal pour investir en actions européennes à long terme avec une exonération d'IR optimale. L'assurance-vie est plus souple (pas de plafond strict, fonds euros disponibles, transmission avantageuse). Les deux sont complémentaires : PEA pour les actions, assurance-vie pour la diversification et la transmission." },
    ],
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
    faqs: [
      { q: "Quand la fiscalité de l'assurance-vie devient-elle avantageuse ?", a: "Après 8 ans de détention du contrat, vous bénéficiez d'un abattement annuel de 4 600 € (seul) ou 9 200 € (couple) sur les gains lors des rachats. Les gains sont alors taxés à 7,5 % d'impôt + 17,2 % de prélèvements sociaux, contre 12,8 % + 17,2 % avant 8 ans." },
      { q: "L'assurance-vie est-elle transmissible hors succession ?", a: "Oui. Les capitaux transmis via une assurance-vie au décès ne font pas partie de la succession et bénéficient d'un régime fiscal propre : abattement de 152 500 € par bénéficiaire pour les primes versées avant 70 ans. C'est un des meilleurs outils de transmission patrimoniale." },
      { q: "Peut-on retirer de l'argent d'une assurance-vie avant 8 ans ?", a: "Oui, à tout moment (c'est un rachat partiel ou total). Mais avant 8 ans, les gains sont imposés au PFU (30 %) ou au barème progressif selon option. Il n'y a aucun blocage légal des fonds, contrairement au PEE ou au PER." },
    ],
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

  // ── Budget (nouveaux) ─────────────────────────────────────────────────────
  {
    slug: 'budget-50-30-20', term: 'Règle 50/30/20', full: 'Règle budgétaire 50/30/20',
    aliases: ['règle 50/30/20', '50/30/20'], category: 'Budget',
    short: "Méthode de budgétisation : 50 % des revenus pour les besoins, 30 % pour les envies, 20 % pour l'épargne.",
    long: [
      "La règle 50/30/20 est une méthode simple pour structurer son budget mensuel sans tableur. Elle divise les revenus nets en trois enveloppes : besoins essentiels (loyer, alimentation, transport), envies (restaurants, loisirs, abonnements non indispensables) et épargne.",
      "Elle n'est pas rigide : en région parisienne, le loyer seul peut dépasser 30 % des revenus. L'objectif est de garder l'épargne non négociable, quitte à ajuster les deux autres catégories.",
    ],
    sims: ['/simulateurs/budget'], related: ['taux-epargne', 'reste-a-vivre', 'epargne-precaution'],
  },
  {
    slug: 'epargne-precaution', term: "Épargne de précaution", full: "Épargne de précaution (fonds d'urgence)",
    aliases: ["épargne de précaution", "fonds d'urgence", "matelas de sécurité"], category: 'Budget',
    short: "Réserve liquide de 3 à 6 mois de dépenses pour faire face aux imprévus sans s'endetter.",
    long: [
      "L'épargne de précaution est la première brique de toute stratégie financière. Elle couvre les accidents de la vie (perte d'emploi, panne, santé) sans avoir à vendre des placements ou recourir au crédit.",
      "On recommande généralement 3 mois de dépenses fixes pour un salarié stable, 6 mois pour un indépendant ou une situation plus incertaine. Elle doit être logée sur un compte liquide (Livret A, LDDS) et non sur des placements risqués.",
    ],
    sims: ['/simulateurs/budget', '/simulateurs/epargne'], related: ['livret-a', 'ldds', 'taux-epargne'],
  },
  {
    slug: 'budget-base-zero', term: 'Budget base zéro', full: 'Méthode du budget base zéro',
    aliases: ['budget base zéro'], category: 'Budget',
    short: "Méthode où chaque euro de revenu est affecté à une dépense ou à l'épargne, jusqu'à atteindre zéro.",
    long: [
      "Le budget base zéro (ou « zero-based budget ») consiste à attribuer un rôle précis à chaque euro dès le début du mois. Revenus − (dépenses + épargne) = 0. Rien n'est laissé à la dérive.",
      "C'est la méthode la plus rigoureuse pour contrôler ses finances, mais aussi la plus chronophage. Elle convient particulièrement à ceux qui cherchent à maximiser leur taux d'épargne ou à sortir d'une situation d'endettement.",
    ],
    sims: ['/simulateurs/budget'], related: ['taux-epargne', 'budget-50-30-20', 'reste-a-vivre'],
  },

  // ── Retraite (nouveaux) ───────────────────────────────────────────────────
  {
    slug: 'retraite-progressive', term: 'Retraite progressive', full: 'Retraite progressive',
    aliases: ['retraite progressive'], category: 'Retraite',
    short: "Dispositif permettant de liquider une partie de sa retraite tout en continuant à travailler à temps partiel.",
    long: [
      "La retraite progressive permet, sous conditions d'âge et de trimestres, de percevoir une fraction de sa pension de retraite tout en exerçant une activité à temps partiel. Elle offre une transition douce vers la retraite complète.",
      "La fraction de pension versée est calculée en fonction du temps de travail restant. À la cessation totale d'activité, la pension est liquidée définitivement et intègre les droits acquis pendant la période progressive.",
    ],
    sims: ['/simulateurs/agirc-arrco', '/simulateurs/cnav'], related: ['cumul-emploi-retraite', 'taux-plein', 'surcote'],
  },
  {
    slug: 'carriere-longue', term: 'Carrière longue', full: 'Dispositif carrière longue',
    aliases: ['carrière longue', 'départ anticipé carrière longue'], category: 'Retraite',
    short: "Dispositif permettant de partir à la retraite avant l'âge légal pour les personnes ayant commencé à travailler jeunes.",
    long: [
      "Le dispositif carrière longue permet aux assurés ayant commencé à cotiser avant 20 ans (voire 18 ou 16 ans selon les périodes) et ayant validé un certain nombre de trimestres de partir avant l'âge légal de départ à la retraite.",
      "Les conditions précises (âge de début, nombre de trimestres cotisés) varient selon la génération. Ce dispositif a été étendu et modifié par les réformes successives des retraites.",
    ],
    sims: ['/simulateurs/cnav', '/simulateurs/agirc-arrco'], related: ['trimestre', 'taux-plein', 'decote'],
  },
  {
    slug: 'reversion', term: 'Pension de réversion', full: 'Pension de réversion',
    aliases: ['pension de réversion', 'réversion'], category: 'Retraite',
    short: "Fraction de la pension d'un assuré décédé reversée à son conjoint survivant, sous conditions.",
    long: [
      "La pension de réversion est versée au conjoint (ou ex-conjoint non remarié selon les cas) d'un assuré décédé. Son montant est une fraction (50 % au régime général, 60 % à l'Agirc-Arrco) de la retraite du défunt.",
      "Au régime général, elle est soumise à une condition de ressources. À l'Agirc-Arrco, elle n'est versée qu'aux conjoints mariés et sans condition de ressources, mais les concubins et partenaires de PACS en sont exclus.",
    ],
    sims: ['/simulateurs/cnav', '/simulateurs/agirc-arrco'], related: ['cnav', 'agirc-arrco', 'aspa'],
  },
  {
    slug: 'droits-derives', term: 'Droits dérivés', full: 'Droits dérivés à la retraite',
    aliases: ['droits dérivés'], category: 'Retraite',
    short: "Droits à la retraite acquis non pas par son propre travail, mais via le conjoint (réversion, majoration).",
    long: [
      "Les droits dérivés désignent les avantages de retraite qui ne découlent pas de la propre carrière de l'assuré, mais de sa situation familiale : pension de réversion au décès du conjoint, majorations pour enfants, assurance vieillesse des parents au foyer (AVPF).",
      "Ils jouent un rôle important dans la retraite des personnes ayant eu des carrières courtes ou interrompues pour élever des enfants.",
    ],
    sims: ['/simulateurs/cnav'], related: ['reversion', 'trimestre', 'aspa'],
  },

  // ── Immobilier (nouveaux) ─────────────────────────────────────────────────
  {
    slug: 'sci', term: 'SCI', full: 'Société Civile Immobilière',
    aliases: ['SCI', 'société civile immobilière'], category: 'Immobilier',
    short: "Structure juridique permettant à plusieurs personnes de détenir et gérer un patrimoine immobilier en commun.",
    long: [
      "La SCI (Société Civile Immobilière) permet de détenir un bien immobilier à plusieurs en évitant les contraintes de l'indivision. Elle facilite la transmission du patrimoine (donation de parts) et peut être soumise à l'IR ou à l'IS selon le régime choisi.",
      "Elle est souvent utilisée en famille pour organiser la succession ou par des investisseurs souhaitant séparer patrimoine professionnel et immobilier. Sa création implique des frais de notaire et une comptabilité annuelle.",
    ],
    sims: ['/simulateurs/rendement-locatif'], related: ['lmnp', 'nue-propriete', 'plus-value-immobiliere'],
  },
  {
    slug: 'garantie-loyers-impayes', term: 'GLI', full: "Garantie Loyers Impayés",
    aliases: ['GLI', 'garantie loyers impayés', "assurance loyers impayés"], category: 'Immobilier',
    short: "Assurance souscrite par le bailleur couvrant les impayés de loyer et les dégradations locatives.",
    long: [
      "La Garantie Loyers Impayés (GLI) est une assurance qui protège le propriétaire bailleur contre le risque de non-paiement du loyer, ainsi que contre les dégradations et les frais de contentieux. Elle coûte environ 2 à 4 % des loyers annuels.",
      "Pour y être éligible, le locataire doit en général justifier de revenus représentant 3 fois le loyer. La GLI est une alternative au garant personne physique ou à la caution bancaire.",
    ],
    sims: ['/simulateurs/rendement-locatif'], related: ['rendement-locatif', 'lmnp'],
  },
  {
    slug: 'viager', term: 'Viager', full: 'Vente en viager',
    aliases: ['viager', 'vente en viager'], category: 'Immobilier',
    short: "Vente immobilière où l'acheteur (débirentier) verse une rente viagère au vendeur (crédirentier) jusqu'à son décès.",
    long: [
      "Dans une vente en viager, l'acheteur (débirentier) verse un bouquet (apport initial) puis une rente mensuelle ou trimestrielle au vendeur (crédirentier) jusqu'au décès de ce dernier. Le prix total est donc aléatoire.",
      "Le viager occupé (le vendeur continue à vivre dans le bien) génère une décote de valeur d'usage (droit d'usage et d'habitation). C'est un outil patrimonial pour les seniors souhaitant compléter leur retraite sans vendre leur logement.",
    ],
    sims: ['/simulateurs/rendement-locatif'], related: ['nue-propriete', 'usufruit'],
  },
  {
    slug: 'copropriete', term: 'Copropriété', full: 'Copropriété',
    aliases: ['copropriété', 'charges de copropriété'], category: 'Immobilier',
    short: "Régime de propriété d'un immeuble partagé entre plusieurs propriétaires, chacun détenant des tantièmes.",
    long: [
      "La copropriété est le régime juridique qui s'applique lorsqu'un immeuble appartient à plusieurs propriétaires. Chaque copropriétaire détient un lot (appartement + quote-part des parties communes) exprimé en tantièmes.",
      "Les décisions collectives sont prises en assemblée générale selon des majorités définies par la loi. Les charges (entretien, gardien, assurance) sont réparties selon les tantièmes. Un syndic gère l'immeuble au quotidien.",
    ],
    sims: ['/simulateurs/emprunt-immobilier'], related: ['frais-notaire', 'rendement-locatif'],
  },

  // ── Finances / Investissement (nouveaux) ──────────────────────────────────
  {
    slug: 'patrimoine-net', term: 'Patrimoine net', full: 'Patrimoine net (valeur nette)',
    aliases: ['patrimoine net', 'valeur nette', 'net worth'], category: 'Finances',
    short: "Total de vos actifs (épargne, immobilier, placements) moins le total de vos dettes.",
    long: [
      "Le patrimoine net est l'indicateur central de votre situation financière : Actifs − Passifs. Actifs = liquidités, épargne, placements, valeur de marché des biens immobiliers ; Passifs = crédits en cours, dettes.",
      "Suivre son patrimoine net dans le temps permet de mesurer l'évolution réelle de sa richesse, indépendamment des fluctuations de revenus. C'est souvent une métrique centrale dans la philosophie FIRE.",
    ],
    sims: ['/simulateurs/patrimoine', '/simulateurs/epargne'], related: ['interets-composes', 'diversification', 'fire'],
  },
  {
    slug: 'frais-gestion', term: 'Frais de gestion', full: 'Frais de gestion (TER)',
    aliases: ['frais de gestion', 'frais annuels'], category: 'Finances',
    short: "Coût annuel prélevé par un fonds ou une assurance-vie, exprimé en % des encours. Réduit mécaniquement le rendement.",
    long: [
      "Les frais de gestion sont prélevés chaque année sur l'encours de votre placement. Pour un fonds, ils sont résumés dans le TER (Total Expense Ratio). Sur un contrat d'assurance-vie, il faut additionner les frais du contrat et ceux des unités de compte.",
      "Un écart de 1 % de frais par an paraît anodin mais, sur 30 ans, peut amputer le capital final de 20 à 25 %. C'est pourquoi les ETF indiciel (frais souvent < 0,25 %) surperforment statistiquement la plupart des fonds actifs sur longue période.",
    ],
    sims: ['/simulateurs/epargne', '/simulateurs/comparateur'], related: ['ter', 'etf', 'assurance-vie', 'rendement-reel'],
  },
  {
    slug: 'rente', term: 'Rente', full: 'Rente viagère ou financière',
    aliases: ['rente', 'rente viagère'], category: 'Finances',
    short: "Revenu périodique versé à vie (viagère) ou pour une durée déterminée, issu d'un capital converti.",
    long: [
      "Une rente est un revenu régulier versé sur une période déterminée ou jusqu'au décès du bénéficiaire (rente viagère). Elle peut provenir d'un contrat d'assurance-vie ou de retraite (PER) lors de la liquidation, ou d'un capital placé générant des intérêts prélevés périodiquement.",
      "La rente viagère offre une sécurité (revenus garantis à vie) mais sacrifie le capital transmissible. La stratégie de retrait programmé (SWR dans la philosophie FIRE) constitue une alternative plus flexible.",
    ],
    sims: ['/simulateurs/epargne', '/simulateurs/per'], related: ['per', 'assurance-vie', 'swr'],
  },
  {
    slug: 'crowdfunding', term: 'Crowdfunding', full: 'Financement participatif',
    aliases: ['crowdfunding', 'financement participatif', 'crowdlending'], category: 'Finances',
    short: "Financement de projets (immobilier, entreprises) par une foule d'investisseurs particuliers via des plateformes en ligne.",
    long: [
      "Le crowdfunding (financement participatif) permet à des particuliers d'investir directement dans des projets immobiliers ou des PME via des plateformes agréées. Le crowdlending est la version prêt (avec intérêts) ; le crowdequity est la version actions.",
      "Les rendements proposés sont élevés (6 à 12 % brut), mais le risque de perte en capital est réel (retards de projet, défaut). Ces placements ne bénéficient pas de la garantie des dépôts et doivent rester une part minoritaire d'un portefeuille diversifié.",
    ],
    sims: ['/simulateurs/comparateur'], related: ['diversification', 'rendement-reel'],
  },
  {
    slug: 'plus-value-mobiliere', term: 'Plus-value mobilière', full: 'Plus-value sur valeurs mobilières',
    aliases: ['plus-value mobilière', 'plus-values mobilières'], category: 'Impôts',
    short: "Gain réalisé lors de la vente de titres (actions, ETF, obligations) soumis en principe au PFU de 30 %.",
    long: [
      "La plus-value mobilière est la différence positive entre le prix de cession et le prix d'acquisition d'un titre financier (action, ETF, obligation, part de fonds). Elle est soumise au Prélèvement Forfaitaire Unique (PFU) de 30 % ou, sur option, au barème progressif de l'IR.",
      "Des abattements anciens existent encore pour les titres acquis avant 2018 dans certains cas. Les moins-values sont imputables sur les plus-values de même nature pendant 10 ans.",
    ],
    sims: ['/simulateurs/impot-revenu'], related: ['pfu', 'pea', 'tmi', 'plus-value-immobiliere'],
  },
  {
    slug: 'niches-fiscales', term: 'Niches fiscales', full: 'Niches fiscales (avantages fiscaux)',
    aliases: ['niches fiscales', 'niche fiscale'], category: 'Impôts',
    short: "Dispositifs légaux permettant de réduire son impôt : déductions, réductions et crédits d'impôt.",
    long: [
      "Les niches fiscales regroupent l'ensemble des déductions (réduction de la base imposable), réductions d'impôt (diminution directe de l'impôt dû) et crédits d'impôt (remboursables si excédentaires). Elles visent à encourager certains comportements économiques.",
      "Le législateur a plafonné leur montant global à 10 000 € par an (avec quelques exceptions à 18 000 €). Au-delà, l'excédent n'est pas reportable. L'optimisation fiscale consiste à utiliser les niches les plus adaptées à sa situation en respectant ce plafond.",
    ],
    sims: ['/simulateurs/impot-revenu', '/simulateurs/per'], related: ['credit-impot', 'abattement', 'per', 'tmi'],
  },
  {
    slug: 'flat-tax', term: 'Flat tax', full: 'Flat tax (Prélèvement Forfaitaire Unique)',
    aliases: ['flat tax', 'PFU'], category: 'Impôts',
    short: "Imposition forfaitaire de 30 % (12,8 % IR + 17,2 % PS) sur les revenus du capital mobilier.",
    long: [
      "La flat tax, ou PFU (Prélèvement Forfaitaire Unique), est un taux d'imposition fixe de 30 % sur les revenus du capital : dividendes, intérêts, plus-values mobilières. Elle se compose de 12,8 % d'IR et 17,2 % de prélèvements sociaux.",
      "Le contribuable peut opter pour le barème progressif de l'IR s'il est dans une tranche marginale basse (0 % ou 11 %). Cette option s'applique alors à l'ensemble des revenus mobiliers de l'année, pas seulement à certains.",
    ],
    sims: ['/simulateurs/impot-revenu'], related: ['pfu', 'tmi', 'dividende', 'plus-value-mobiliere'],
  },

  // ── FIRE (nouveaux) ───────────────────────────────────────────────────────
  {
    slug: 'numero-f', term: 'Nombre F', full: 'Nombre F (F.U. Number)',
    aliases: ['nombre F', 'F number', 'F.U. number'], category: 'FIRE',
    short: "Capital minimum permettant de ne plus dépendre d'un emploi indésirable, calculé selon la règle des 4 %.",
    long: [
      "Le « Nombre F » (ou F.U. Number, terme issu de la culture FIRE) désigne le capital à partir duquel vous pouvez refuser un emploi ou une situation que vous ne souhaitez plus subir. C'est une version personnalisée de l'objectif FIRE.",
      "Il se calcule comme vos dépenses annuelles incompressibles × 25 (règle des 4 %). Une fois ce seuil atteint, vous avez le choix de rester ou de partir, même si vous continuez à travailler. L'indépendance financière est une question de liberté, pas nécessairement de retraite anticipée.",
    ],
    sims: ['/simulateurs/fire', '/simulateurs/epargne'], related: ['fire', 'swr', 'taux-epargne'],
  },
  {
    slug: 'frugalisme', term: 'Frugalisme', full: 'Frugalisme',
    aliases: ['frugalisme', 'frugaliste'], category: 'FIRE',
    short: "Philosophie de vie consistant à réduire volontairement ses dépenses pour accélérer l'indépendance financière.",
    long: [
      "Le frugalisme est la pratique consistant à vivre en dessous de ses moyens de façon volontaire et réfléchie, non par contrainte, mais pour dégager un taux d'épargne élevé et accélérer l'atteinte de l'indépendance financière.",
      "Il ne s'agit pas de privation : les frugalistes optimisent leurs dépenses en alignant leur argent sur leurs valeurs. L'objectif n'est pas de dépenser zéro, mais d'éviter les dépenses qui n'apportent pas de bonheur durable.",
    ],
    sims: ['/simulateurs/fire', '/simulateurs/budget', '/simulateurs/cout-en-heures'], related: ['fire', 'lean-fire', 'taux-epargne', 'numero-f'],
  },
  {
    slug: 'chelo', term: 'CHELO', full: 'Coût en Heures de Liberté Obtenues',
    aliases: ['CHELO', 'coût en heures'], category: 'FIRE',
    short: "Méthode qui exprime le prix d'un achat en heures de travail nécessaires pour le financer.",
    long: [
      "Le CHELO (ou « coût en heures ») est une façon de réévaluer ses achats en les exprimant en temps de travail. On divise le prix d'un bien par son salaire horaire net pour obtenir le nombre d'heures à travailler pour le financer.",
      "Cette perspective peut modifier profondément les comportements de consommation : un abonnement à 20 €/mois peut représenter 2 h de travail mensuel, soit 24 h par an — est-ce que cela en vaut vraiment la peine ? Concept popularisé par le livre « Votre vie ou votre argent ».",
    ],
    sims: ['/simulateurs/cout-en-heures'], related: ['fire', 'frugalisme', 'taux-epargne'],
  },

  // ── Retraite (nouveaux) ───────────────────────────────────────────────────
  {
    slug: 'taux-remplacement', term: 'Taux de remplacement', full: 'Taux de remplacement retraite',
    aliases: ['taux de remplacement', 'taux de remplacement retraite'], category: 'Retraite',
    short: "Rapport entre la première pension et le dernier salaire net. En France il oscille entre 50 % et 75 % selon la carrière.",
    long: [
      "Le taux de remplacement mesure dans quelle proportion votre retraite remplace votre dernier revenu d'activité. Il se calcule en divisant votre première pension nette par votre dernier salaire net avant la retraite.",
      "En France, il varie fortement selon le statut : un salarié du privé obtient en moyenne 74 % (régime de base + Agirc-Arrco), un fonctionnaire environ 75 %, un indépendant parfois seulement 50-55 %. Plus vous partez tôt avec peu de trimestres, plus le taux baisse.",
      "Ce taux est le point de départ de tout plan de retraite : s'il est inférieur à 70 %, il faut envisager une épargne complémentaire (PER, assurance-vie) pour maintenir son niveau de vie. Attention : le taux brut et le taux net peuvent différer significativement selon les cotisations sociales sur pension.",
    ],
    sims: ['/simulateurs/cnav', '/simulateurs/agirc-arrco', '/simulateurs/per'],
    related: ['cnav', 'agirc-arrco', 'sam', 'per', 'taux-plein'],
    faqs: [
      { q: "Quel est le taux de remplacement moyen en France ?", a: "Pour un salarié du privé avec une carrière complète, le taux de remplacement moyen est d'environ 74 % du dernier salaire net (régime de base CNAV + Agirc-Arrco). Ce taux baisse avec la réforme des retraites et devrait passer sous 70 % pour les générations nées après 1973." },
      { q: "Comment améliorer son taux de remplacement ?", a: "Plusieurs leviers : alimenter un PER (déduction fiscale + capital à la retraite), souscrire une assurance-vie, racheter des trimestres manquants, ou retarder son départ pour bénéficier de la surcote. La surcote est de 1,25 % par trimestre travaillé au-delà du taux plein." },
      { q: "Le taux de remplacement est-il le même pour les fonctionnaires ?", a: "Non. Les fonctionnaires bénéficient d'un taux de remplacement plus élevé (environ 75 % du dernier traitement indiciaire brut) mais leur pension est calculée sur les 6 derniers mois de traitement, non les 25 meilleures années comme dans le privé. Les primes ne sont généralement pas intégrées dans le calcul." },
    ],
  },
  {
    slug: 'rachat-trimestres', term: 'Rachat de trimestres', full: 'Rachat de trimestres de retraite',
    aliases: ['rachat de trimestres', 'racheter des trimestres', 'versement pour la retraite', 'VFR'], category: 'Retraite',
    short: "Possibilité de compléter sa durée d'assurance en payant des cotisations pour des années d'études ou d'activité incomplètes.",
    long: [
      "Le rachat de trimestres (officiellement « Versement Pour la Retraite » ou VFR) permet de cotiser rétroactivement pour des périodes non cotisées : années d'études supérieures, début de carrière avec revenus faibles, ou années incomplètes.",
      "Vous pouvez racheter au maximum 12 trimestres. Le tarif dépend de votre âge au moment du rachat, de votre revenu et de l'option choisie (taux plein seul, ou taux plein + durée d'assurance + retraite complémentaire).",
      "La rentabilité du rachat est variable : plus vous rachetez tôt (coût bas) et plus votre espérance de vie est longue, plus c'est rentable. Il faut comparer le coût du rachat au gain mensuel de pension obtenu. La partie du rachat qui n'est pas déductible fiscalement peut être déduite du revenu imposable.",
    ],
    sims: ['/simulateurs/trimestres', '/simulateurs/cnav'],
    related: ['trimestre', 'taux-plein', 'decote', 'sam'],
    faqs: [
      { q: "Combien coûte le rachat d'un trimestre en 2026 ?", a: "Le tarif dépend de votre âge et de vos revenus. À titre d'exemple, pour un revenu annuel de 40 000 € : environ 3 500 € à 35 ans, 5 800 € à 45 ans, et 8 200 € à 55 ans (option taux plein seul). Le montant est déductible de votre revenu imposable, ce qui réduit le coût réel." },
      { q: "Combien de trimestres peut-on racheter ?", a: "Vous pouvez racheter au maximum 12 trimestres correspondant à des années d'études supérieures (ayant donné lieu à un diplôme) ou à des années civiles ayant donné lieu à moins de 4 trimestres validés. Les demandes s'effectuent auprès de votre caisse de retraite (CNAV pour les salariés)." },
      { q: "Est-il toujours rentable de racheter des trimestres ?", a: "Pas systématiquement. La rentabilité dépend du gain de pension mensuel, de votre espérance de vie et du financement choisi. Si vous avez déjà le taux plein, le rachat n'augmente que la durée d'assurance (pas le taux). En cas d'hésitation, simulez avec la CNAV ou un conseiller retraite." },
    ],
  },
  {
    slug: 'rente-viagere', term: 'Rente viagère', full: 'Rente viagère',
    aliases: ['rente viagère', 'rente viagere'], category: 'Retraite',
    short: "Revenu régulier versé à vie par un assureur en échange d'un capital. Option de sortie des contrats PER, PERP et assurance-vie.",
    long: [
      "Une rente viagère est un revenu périodique (mensuel, trimestriel…) versé par un assureur jusqu'au décès de l'assuré, en contrepartie d'un capital initial. Elle offre une sécurité absolue de revenu : vous ne pouvez pas « survivre » à votre argent.",
      "La rente viagère est disponible en sortie de PER, PERP, Madelin et d'assurance-vie. Son montant dépend du capital converti, de votre âge, de l'espérance de vie et des tables de mortalité de l'assureur. Options possibles : réversion au conjoint (rente réduite en cas de décès), annuités garanties (versement aux héritiers si décès précoce).",
      "L'alternative est le « retrait programmé » (déblocage par fractions du capital). La rente protège contre le risque de longévité mais immobilise définitivement le capital. La fiscalité dépend de l'âge à la conversion : entre 60 et 69 ans, seule 40 % de la rente est imposable.",
    ],
    sims: ['/simulateurs/rente-capital', '/simulateurs/per'],
    related: ['per', 'assurance-vie', 'taux-remplacement', 'rente'],
    faqs: [
      { q: "Comment est imposée une rente viagère ?", a: "La fraction imposable d'une rente viagère à titre onéreux (issue d'un PER, assurance-vie) dépend de l'âge à la date d'entrée en jouissance : 70 % avant 50 ans, 50 % entre 50 et 59 ans, 40 % entre 60 et 69 ans, 30 % à 70 ans ou plus. Cette fraction est ajoutée aux revenus imposables." },
      { q: "Rente ou retrait programmé : que choisir ?", a: "La rente est préférable si vous craignez de manquer d'argent en vivant très longtemps (au-delà de 85 ans) ou si vous n'avez pas d'autre revenu garanti. Le retrait programmé est plus flexible et conserve le capital pour les héritiers. Une solution mixte est souvent recommandée : convertir une partie en rente (pour couvrir les dépenses fixes) et garder le reste en capital." },
      { q: "Peut-on revenir sur une conversion en rente ?", a: "Non. La conversion en rente viagère est irrévocable. Une fois le capital transformé en rente, vous ne pouvez plus récupérer le capital en une fois. C'est pourquoi cette décision doit être mûrement réfléchie, idéalement avec l'aide d'un conseiller en gestion de patrimoine." },
    ],
  },
  {
    slug: 'point-agirc', term: 'Point Agirc-Arrco', full: 'Valeur du point Agirc-Arrco',
    aliases: ['valeur du point', 'point de retraite complémentaire', 'valeur du point Agirc-Arrco'], category: 'Retraite',
    short: "Unité de compte du régime complémentaire Agirc-Arrco : vos cotisations achètent des points, chaque point vaut un montant annuel de pension.",
    long: [
      "Le système Agirc-Arrco fonctionne en points : vos cotisations retraite complémentaire sont converties en points au moment du versement, puis à la retraite, vos points sont multipliés par la « valeur de service du point » pour calculer votre pension annuelle.",
      "En 2026, le prix d'achat d'un point est de 17,7848 € et la valeur de service est de 1,4196 €/an. Ces deux paramètres évoluent chaque année en fonction de l'inflation et des négociations entre partenaires sociaux.",
      "Pour estimer votre pension Agirc-Arrco : récupérez votre relevé de points sur le site Agirc-Arrco, puis multipliez par la valeur de service. Exemple : 50 000 points × 1,4196 €/an = 70 980 €/an de pension complémentaire brute.",
    ],
    sims: ['/simulateurs/agirc-arrco'],
    related: ['agirc-arrco', 'points-retraite', 'retraite-complementaire', 'taux-plein'],
  },
  {
    slug: 'retraite-supplementaire', term: 'Retraite supplémentaire', full: 'Retraite supplémentaire (Article 83, PERCO)',
    aliases: ['retraite supplémentaire', 'retraite article 83', 'article 83'], category: 'Retraite',
    short: "Épargne retraite mise en place par l'employeur (cotisation obligatoire ou volontaire), en complément des régimes légaux.",
    long: [
      "La retraite supplémentaire désigne les dispositifs d'épargne retraite collectifs mis en place par l'entreprise, en complément de la retraite de base (CNAV) et complémentaire (Agirc-Arrco). Les anciens contrats Article 83 (cotisations à versement défini) sont progressivement transformés en PER d'entreprise.",
      "Les versements de l'employeur et du salarié bénéficient d'avantages fiscaux et sociaux. Le PERCOL (nouveau nom du PERCO) permet une sortie en capital ou en rente. L'Article 83 imposait une sortie obligatoire en rente viagère.",
      "Ces dispositifs sont particulièrement avantageux quand l'employeur abonde les versements volontaires du salarié : un abondement de 100 % double mécaniquement le rendement immédiat de l'épargne.",
    ],
    sims: ['/simulateurs/per', '/simulateurs/epargne'],
    related: ['per', 'perco', 'pee', 'abondement', 'rente-viagere'],
  },
  {
    slug: 'pension-invalidite', term: "Pension d'invalidité", full: "Pension d'invalidité de la Sécurité sociale",
    aliases: ["pension d'invalidité", "invalidité"], category: 'Retraite',
    short: "Revenu de remplacement versé par l'Assurance maladie lorsqu'une maladie ou un accident réduit la capacité de travail d'au moins 2/3.",
    long: [
      "La pension d'invalidité est attribuée par la CPAM lorsque la capacité de gain ou de travail d'un assuré est réduite d'au moins deux tiers par suite d'un accident ou d'une maladie non professionnels. Elle remplace partiellement le revenu perdu.",
      "Il existe 3 catégories : catégorie 1 (invalide pouvant exercer une activité rémunérée, 30 % du SAM), catégorie 2 (invalide ne pouvant pas exercer, 50 % du SAM), catégorie 3 (invalide nécessitant l'assistance d'une tierce personne, 50 % du SAM + majoration tierce personne).",
      "À l'âge légal de départ en retraite, la pension d'invalidité est automatiquement remplacée par une retraite pour inaptitude au même montant, sans condition de trimestres ni de durée d'assurance.",
    ],
    sims: ['/simulateurs/cnav'],
    related: ['sam', 'taux-plein', 'minimum-contributif'],
  },

  // ── Fiscalité / Succession (nouveaux) ────────────────────────────────────
  {
    slug: 'droits-succession', term: 'Droits de succession', full: 'Droits de succession',
    aliases: ['droits de succession', 'impôt sur les successions', 'DMTG succession'], category: 'Impôts',
    short: "Impôt dû par les héritiers sur la part nette d'héritage reçue, après abattements et selon le lien de parenté avec le défunt.",
    long: [
      "Les droits de succession (ou DMTG) sont calculés sur la part nette de chaque héritier après déduction de l'abattement auquel il a droit. Les taux varient de 5 % à 45 % pour les enfants (en ligne directe), de 35 % à 45 % entre frères et sœurs, et peuvent atteindre 60 % entre personnes non parentes.",
      "En ligne directe (enfants, parents), chaque héritier bénéficie d'un abattement de 100 000 €. Entre époux et partenaires de PACS, il n'y a aucun droit de succession depuis la loi TEPA de 2007.",
      "Les actifs transmis via assurance-vie (primes versées avant 70 ans) bénéficient d'un régime hors succession avec un abattement spécifique de 152 500 € par bénéficiaire, ce qui en fait un outil de transmission particulièrement efficace.",
    ],
    sims: ['/simulateurs/succession', '/simulateurs/donation'],
    related: ['abattement', 'abattement-donation', 'assurance-vie-transmission', 'usufruit', 'nue-propriete'],
    faqs: [
      { q: "Quel est le barème des droits de succession entre parents et enfants en 2026 ?", a: "Après abattement de 100 000 € par enfant, les taux progressifs sont : 5 % jusqu'à 8 072 €, 10 % de 8 072 à 12 109 €, 15 % de 12 109 à 15 932 €, 20 % de 15 932 à 552 324 €, 30 % de 552 324 à 902 838 €, 40 % de 902 838 à 1 805 677 €, 45 % au-delà." },
      { q: "Les héritiers doivent-ils payer les droits de succession dans un certain délai ?", a: "Oui. La déclaration de succession doit être déposée dans les 6 mois suivant le décès (si décès en France) ou 12 mois (si décès à l'étranger). Les droits sont dus au moment du dépôt. Un étalement sur 3 ans (5 ans pour certains actifs illiquides) peut être demandé au Trésor public." },
      { q: "Comment réduire les droits de succession ?", a: "Principales stratégies : donations du vivant (renouvellent l'abattement tous les 15 ans), démembrement de propriété (transmettre la nue-propriété maintenant, l'usufruit s'éteint gratuitement au décès), assurance-vie (hors succession jusqu'à 152 500 € par bénéficiaire), SCI (facilite la transmission de l'immobilier avec une décote)." },
    ],
  },
  {
    slug: 'abattement-donation', term: 'Abattement donation', full: 'Abattement sur les donations',
    aliases: ['abattement donation', 'abattement 100 000 euros', 'franchise donation'], category: 'Impôts',
    short: "Montant exonéré de droits lors d'une donation. En ligne directe : 100 000 € par parent et par enfant, renouvelable tous les 15 ans.",
    long: [
      "Chaque parent peut donner 100 000 € à chaque enfant sans payer de droits de donation. Deux parents peuvent donc donner jusqu'à 200 000 € à un enfant en franchise totale. Cet abattement se renouvelle tous les 15 ans.",
      "D'autres abattements s'appliquent : 31 865 € pour un don à un petit-enfant (par grand-parent), 5 310 € pour un arrière-petit-enfant, 15 932 € entre frères et sœurs, 7 967 € entre neveux et nièces. Le « don familial de sommes d'argent » (don Sarkozy) permet en plus d'exonérer 31 865 € supplémentaires si le donateur a moins de 80 ans et le donataire au moins 18 ans.",
      "Au-delà de ces abattements, les mêmes barèmes que les droits de succession s'appliquent. Une stratégie de transmission anticipée permet de renouveler plusieurs fois l'abattement sur une vie (tous les 15 ans), multipliant ainsi le montant transmis en franchise.",
    ],
    sims: ['/simulateurs/donation', '/simulateurs/succession'],
    related: ['droits-succession', 'donation-partage', 'abattement', 'assurance-vie-transmission'],
    faqs: [
      { q: "L'abattement de 100 000 € sur les donations est-il cumulable avec l'assurance-vie ?", a: "Oui. L'abattement de 100 000 € en ligne directe s'applique aux donations et aux successions « classiques ». L'assurance-vie dispose de son propre abattement de 152 500 € par bénéficiaire (primes versées avant 70 ans), qui est totalement indépendant. Les deux se cumulent." },
      { q: "Que se passe-t-il si je dépasse l'abattement de 100 000 € ?", a: "La fraction excédant l'abattement est soumise au barème progressif des droits de mutation : 5 % jusqu'à 8 072 €, puis 10 %, 15 %, 20 %... jusqu'à 45 % pour les montants très élevés. Les droits sont à la charge du donataire (celui qui reçoit)." },
      { q: "L'abattement se renouvelle-t-il vraiment tous les 15 ans ?", a: "Oui. Si vous avez reçu une donation en 2010, vous pouvez de nouveau bénéficier de l'abattement complet de 100 000 € sur une donation reçue en 2025. Ce renouvellement est illimité sur une vie, ce qui permet d'optimiser la transmission sur plusieurs générations." },
    ],
  },
  {
    slug: 'donation-partage', term: 'Donation-partage', full: 'Donation-partage',
    aliases: ['donation-partage', 'donation partage'], category: 'Impôts',
    short: "Acte notarié permettant de répartir son patrimoine entre ses héritiers de son vivant, en figeant les valeurs et en prévenant les litiges.",
    long: [
      "La donation-partage est un acte notarié par lequel un parent distribue tout ou partie de ses biens entre ses enfants (et petits-enfants par intégration transgénérationnelle) de son vivant. Elle « cristallise » les valeurs à la date de l'acte, évitant les conflits au moment du décès.",
      "Son avantage principal est la sécurité juridique : les biens donnés ne sont pas rapportables à la succession avec leur valeur au décès, mais avec leur valeur au jour de la donation. Si une maison valait 200 000 € lors de la donation et en vaut 400 000 € au décès, les cohéritiers ne peuvent pas contester.",
      "Elle bénéficie des mêmes abattements que les donations simples (100 000 € par enfant et par parent), renouvelables tous les 15 ans. Elle permet aussi d'inclure le conjoint du donateur pour un double abondement.",
    ],
    sims: ['/simulateurs/donation', '/simulateurs/succession'],
    related: ['abattement-donation', 'droits-succession', 'reserve-hereditaire', 'usufruit'],
  },
  {
    slug: 'reserve-hereditaire', term: 'Réserve héréditaire', full: 'Réserve héréditaire',
    aliases: ['réserve héréditaire', 'réserve légale', 'part réservataire'], category: 'Impôts',
    short: "Part du patrimoine dont le défunt ne peut pas priver ses enfants (héritiers réservataires), protégée par la loi.",
    long: [
      "La réserve héréditaire est la portion du patrimoine qui est légalement garantie aux héritiers réservataires (les enfants, et à défaut le conjoint survivant). Elle varie selon le nombre d'enfants : 1/2 pour un enfant, 2/3 pour deux enfants, 3/4 pour trois enfants ou plus.",
      "La « quotité disponible » est le complément : la part dont le défunt peut librement disposer (par legs ou donations). Un parent de 3 enfants ne peut léguer par testament qu'un quart de ses biens à un tiers.",
      "Si des donations ont empiété sur la réserve, les héritiers réservataires peuvent exercer l'action en réduction pour récupérer leur dû. La donation-partage permet de sécuriser la transmission en cristallisant les valeurs et en réduisant les risques de conflits.",
    ],
    sims: ['/simulateurs/succession'],
    related: ['donation-partage', 'droits-succession', 'abattement-donation', 'usufruit'],
  },
  {
    slug: 'assurance-vie-transmission', term: 'Transmission via assurance-vie', full: "Transmission du patrimoine via assurance-vie",
    aliases: ['assurance-vie transmission', 'transmission assurance-vie', 'hors succession assurance-vie'], category: 'Impôts',
    short: "L'assurance-vie est le principal outil de transmission hors succession en France : jusqu'à 152 500 € par bénéficiaire exonérés de droits.",
    long: [
      "Les capitaux décès d'un contrat d'assurance-vie versés aux bénéficiaires désignés sont hors succession civile et bénéficient d'une fiscalité spécifique très avantageuse. Pour les primes versées avant 70 ans : chaque bénéficiaire reçoit les 152 500 premiers euros en franchise de droits, puis 20 % jusqu'à 700 000 € et 31,25 % au-delà.",
      "Pour les primes versées après 70 ans, le régime est moins favorable : l'abattement est de 30 500 € global (tous bénéficiaires confondus), et le surplus est soumis aux droits de succession classiques.",
      "La clause bénéficiaire est la clé : vous pouvez désigner n'importe quelle personne (enfant, neveu, ami, association), y compris des personnes qui auraient été lourdement taxées par les droits de succession classiques. C'est la raison pour laquelle l'assurance-vie est un instrument central de la planification successorale.",
    ],
    sims: ['/simulateurs/succession', '/simulateurs/epargne'],
    related: ['assurance-vie', 'clause-beneficiaire', 'droits-succession', 'abattement-donation'],
    faqs: [
      { q: "Quel est l'abattement assurance-vie par bénéficiaire en 2026 ?", a: "Pour les primes versées avant les 70 ans de l'assuré, chaque bénéficiaire désigné bénéficie d'un abattement de 152 500 €. Au-delà, le taux est de 20 % jusqu'à 700 000 € et 31,25 % au-delà. Le conjoint ou partenaire de PACS est totalement exonéré." },
      { q: "L'assurance-vie est-elle vraiment hors succession ?", a: "Partiellement. Les capitaux décès de l'assurance-vie sont hors succession civile (donc pas pris en compte pour le calcul de la réserve héréditaire) mais peuvent être réintégrés en cas de « primes manifestement exagérées ». Cette qualification est rare et nécessite une action judiciaire des héritiers." },
      { q: "Peut-on changer la clause bénéficiaire à tout moment ?", a: "Oui, vous pouvez modifier la clause bénéficiaire à tout moment, sauf si un bénéficiaire a déjà accepté le bénéfice du contrat (acceptation formelle nécessitant son accord). Il est conseillé de rédiger une clause détaillée et personnalisée plutôt que d'utiliser les clauses types des assureurs." },
    ],
  },
  {
    slug: 'taux-moyen-imposition', term: "Taux moyen d'imposition", full: "Taux moyen d'imposition (TMO)",
    aliases: ["taux moyen d'imposition", 'taux effectif imposition', 'taux moyen', 'TMO'], category: 'Impôts',
    short: "Rapport entre l'impôt total payé et le revenu imposable total. À ne pas confondre avec la Tranche Marginale d'Imposition (TMI).",
    long: [
      "Le taux moyen d'imposition est votre impôt total divisé par votre revenu net imposable. Exemple : 8 000 € d'impôt sur 50 000 € de revenu = taux moyen de 16 %. C'est le taux réel de prélèvement sur l'ensemble de vos revenus.",
      "Il diffère de la Tranche Marginale d'Imposition (TMI) qui est le taux appliqué au dernier euro de revenu. Avec une TMI à 30 %, vous ne payez pas 30 % sur tout votre revenu : les premières tranches sont taxées à 0 %, 11 %, puis 30 %.",
      "Le taux moyen est utile pour comparer sa pression fiscale globale et évaluer l'impact d'une déduction fiscale. Réduire son revenu imposable de 10 000 € économise (TMI × 10 000 €) d'impôts — et non (taux moyen × 10 000 €).",
    ],
    sims: ['/simulateurs/impot-revenu'],
    related: ['tmi', 'ir', 'rfr', 'prelevement-source', 'quotient-familial'],
    faqs: [
      { q: "Quelle est la différence entre TMI et taux moyen ?", a: "La TMI (Tranche Marginale d'Imposition) est le taux qui s'applique au dernier euro de revenu. Le taux moyen est le rapport entre l'impôt total et le revenu total. Un contribuable avec une TMI à 30 % et un taux moyen de 16 % paie 16 % sur l'ensemble de son revenu, mais la prochaine déduction fiscale lui économise 30 centimes par euro." },
      { q: "Comment réduire son taux moyen d'imposition ?", a: "Principales leviers : versements sur PER (déduits du revenu imposable, économie = versement × TMI), dons aux associations (réduction d'impôt 66 % ou 75 %), emploi à domicile (crédit d'impôt 50 %), déficit foncier (déductible des revenus fonciers puis du revenu global dans la limite de 10 700 €/an)." },
    ],
  },
  {
    slug: 'optimisation-fiscale', term: 'Optimisation fiscale', full: 'Optimisation fiscale légale',
    aliases: ['optimisation fiscale', 'défiscalisation'], category: 'Impôts',
    short: "Ensemble des stratégies légales permettant de réduire sa charge fiscale en utilisant les dispositifs prévus par la loi.",
    long: [
      "L'optimisation fiscale consiste à utiliser l'ensemble des mécanismes légaux pour payer moins d'impôts : déductions du revenu imposable (PER, charges foncières), réductions d'impôt (investissement Pinel, dons, emploi à domicile), et crédits d'impôt (garde d'enfants, crédit d'impôt recherche pour les entreprises).",
      "Les principales stratégies pour les particuliers : alimenter un PER (déduction du revenu imposable à hauteur de 10 % des revenus professionnels, plafond 37 094 € en 2026), investir en immobilier avec déficit foncier (limité à 10 700 €/an déductible du revenu global), et utiliser le PEA pour une fiscalité réduite sur les gains mobiliers après 5 ans.",
      "La frontière entre optimisation fiscale légale et abus de droit est définie par l'article L. 64 du LPF. Un montage devient problématique lorsqu'il recherche un avantage fiscal contraire à l'intention du législateur. L'administration fiscale peut alors requalifier l'opération.",
    ],
    sims: ['/simulateurs/impot-revenu', '/simulateurs/per'],
    related: ['tmi', 'deficit-foncier', 'credit-impot', 'niches-fiscales', 'per', 'pea'],
  },

  // ── Immobilier (nouveaux) ────────────────────────────────────────────────
  {
    slug: 'vefa', term: 'VEFA', full: "Vente en l'État Futur d'Achèvement",
    aliases: ['VEFA', "vente en l'état futur d'achèvement", 'immobilier neuf sur plan'], category: 'Immobilier',
    short: "Contrat d'achat d'un bien immobilier neuf qui n'est pas encore construit. L'acquéreur paie progressivement selon l'avancement des travaux.",
    long: [
      "La VEFA (Vente en l'État Futur d'Achèvement) est le contrat par lequel un acquéreur achète un logement neuf qui n'est pas encore construit. Il verse le prix en plusieurs appels de fonds progressifs selon l'avancement du chantier : 5 % à la réservation, 35 % aux fondations, 70 % au hors d'eau, 95 % à l'achèvement, 100 % à la livraison.",
      "L'acheteur bénéficie de garanties légales renforcées : garantie de parfait achèvement (1 an), garantie biennale (2 ans pour les éléments d'équipement), garantie décennale (10 ans pour la structure), et garantie d'achèvement obligatoire souscrite par le promoteur.",
      "Avantages fiscaux : frais de notaire réduits (2-3 % vs 7-8 % dans l'ancien), éligibilité au PTZ sur les logements neufs, et normes RT2020/RE2020 garantissant une meilleure performance énergétique. Le délai de livraison est généralement de 18 à 36 mois après la signature.",
    ],
    sims: ['/simulateurs/frais-notaire', '/simulateurs/ptz', '/simulateurs/emprunt-immobilier'],
    related: ['frais-notaire', 'ptz', 'dpe', 'taeg'],
    faqs: [
      { q: "Quels sont les frais de notaire pour un achat en VEFA ?", a: "Pour un logement neuf en VEFA, les frais de notaire sont d'environ 2 à 3 % du prix d'achat, contre 7 à 8 % dans l'ancien. Cette économie substantielle s'explique par la fiscalité réduite (TVA déjà payée par le promoteur) et l'absence de certaines taxes appliquées à l'ancien." },
      { q: "Peut-on se rétracter après la signature d'un contrat VEFA ?", a: "Oui. Après la signature du contrat de réservation, l'acquéreur dispose d'un délai de rétractation de 10 jours (loi SRU). Pendant ce délai, il peut annuler l'achat sans pénalité ni justification. Après ce délai, il perd le dépôt de garantie (max 5 % du prix) sauf motifs légaux (refus de prêt, etc.)." },
      { q: "Quels recours en cas de retard de livraison VEFA ?", a: "Le contrat VEFA doit prévoir une date prévisionnelle de livraison et des pénalités de retard (minimum 1/3000e du prix par jour). En cas de retard significatif ou d'abandon du chantier, la garantie financière d'achèvement oblige la banque garante à financer la fin des travaux ou à rembourser les acquéreurs." },
    ],
  },
  {
    slug: 'dpe', term: 'DPE', full: 'Diagnostic de Performance Énergétique',
    aliases: ['DPE', 'diagnostic de performance énergétique', 'classe énergétique'], category: 'Immobilier',
    short: "Document obligatoire lors de toute vente ou location, classant le logement de A (très performant) à G (passoire thermique) selon sa consommation d'énergie.",
    long: [
      "Le Diagnostic de Performance Énergétique (DPE) est un document obligatoire depuis 2006 remis à tout acquéreur ou locataire. Il indique la consommation d'énergie primaire (en kWh/m²/an) et les émissions de CO₂ (en kg CO₂eq/m²/an) du logement, sur une échelle de A à G.",
      "Depuis 2021, le DPE est devenu opposable juridiquement : si les informations sont erronées, l'acquéreur ou le locataire peut se retourner contre le vendeur ou le diagnostiqueur. Le DPE est valable 10 ans (sauf exceptions).",
      "Les passoires thermiques (G et F) font l'objet de restrictions croissantes : depuis 2025, les logements classés G sont interdits à la location en France. Les classes F seront interdites en 2028, puis les E en 2034. Cette réglementation impacte fortement la valeur des biens les moins performants.",
    ],
    sims: ['/simulateurs/emprunt-immobilier', '/simulateurs/rendement-locatif'],
    related: ['rendement-locatif', 'lmnp', 'vefa', 'deficit-foncier'],
    faqs: [
      { q: "Qu'est-ce qu'une passoire thermique ?", a: "Une passoire thermique est un logement classé F ou G au DPE, avec une consommation d'énergie supérieure à 330 kWh/m²/an. En France, on en compte environ 5,2 millions. Depuis 2025, les logements G sont gelés (loyer ne peut pas être augmenté) et interdits à la location pour les nouveaux contrats. En 2028, ce sera au tour des F." },
      { q: "Le DPE influe-t-il sur le prix d'un bien immobilier ?", a: "Oui, et de plus en plus. Une étude des Notaires de France montre qu'un logement classé F se vend en moyenne 10-15 % moins cher qu'un équivalent classé C dans la même zone. L'écart s'amplifie avec les nouvelles réglementations. À l'inverse, un bien rénové de G à C peut voir sa valeur augmenter significativement." },
      { q: "Comment améliorer son DPE ?", a: "Les travaux les plus efficaces : isolation des combles (gain de 2-3 classes pour un coût de 3 000-10 000 €), remplacement d'une chaudière fioul/gaz par une pompe à chaleur (gain de 1-2 classes), isolation des murs par l'extérieur (ITE). MaPrimeRénov' et les Certificats d'Économie d'Énergie (CEE) financent une partie des travaux." },
    ],
  },
  {
    slug: 'regime-reel-foncier', term: 'Régime réel foncier', full: 'Régime réel des revenus fonciers',
    aliases: ['régime réel foncier', 'régime réel', 'revenus fonciers réel'], category: 'Immobilier',
    short: "Régime d'imposition des revenus locatifs nus permettant de déduire les charges réelles (travaux, intérêts, taxes) au lieu d'un abattement forfaitaire de 30 %.",
    long: [
      "Les propriétaires qui louent un bien nu et perçoivent plus de 15 000 € de loyers par an sont obligatoirement au régime réel. En dessous, le micro-foncier s'applique par défaut (abattement de 30 %), mais on peut opter pour le réel si les charges dépassent 30 % des loyers.",
      "Au régime réel, sont déductibles : les intérêts d'emprunt et assurance, les travaux d'entretien et de réparation (mais pas de construction ou d'agrandissement), la taxe foncière, les charges de copropriété, les frais de gestion et d'assurance loyers impayés.",
      "Si les charges déductibles dépassent les loyers, un déficit foncier est créé. La fraction liée aux travaux (hors intérêts) est déductible du revenu global à hauteur de 10 700 €/an. Le solde est reportable sur les revenus fonciers des 10 années suivantes.",
    ],
    sims: ['/simulateurs/deficit-foncier', '/simulateurs/rendement-locatif'],
    related: ['micro-foncier', 'deficit-foncier', 'rendement-locatif', 'lmnp', 'tmi'],
  },
  {
    slug: 'location-meublee', term: 'Location meublée', full: 'Location meublée (LM)',
    aliases: ['location meublée', 'LMN', 'loueur meublé non professionnel'], category: 'Immobilier',
    short: "Location d'un bien avec mobilier permettant d'y vivre directement. Les revenus sont imposés comme BIC, avec un abattement de 50 % en micro-BIC.",
    long: [
      "La location meublée génère des Bénéfices Industriels et Commerciaux (BIC), non des revenus fonciers. Le logement doit comporter tous les meubles listés par décret (literie, cuisine équipée, rangements, table, chaises, luminaires…).",
      "En micro-BIC (revenus < 77 700 €/an), un abattement de 50 % est appliqué avant imposition (71 % pour les meublés de tourisme classés). Au régime réel, les charges réelles sont déductibles, y compris l'amortissement du bien et du mobilier, ce qui crée souvent un résultat fiscal nul.",
      "Le statut LMNP (Loueur Meublé Non Professionnel) s'applique si les revenus sont inférieurs à 23 000 €/an et ne représentent pas plus de 50 % des revenus du foyer. Au-delà, le statut LMP (professionnel) offre d'autres avantages mais aussi plus de contraintes.",
    ],
    sims: ['/simulateurs/rendement-locatif', '/simulateurs/deficit-foncier'],
    related: ['lmnp', 'micro-foncier', 'regime-reel-foncier', 'rendement-locatif'],
  },
  {
    slug: 'plus-value-exoneration', term: "Exonération plus-value immobilière", full: "Exonération de plus-value sur la résidence principale",
    aliases: ['exonération plus-value', 'plus-value résidence principale', 'exonération résidence principale'], category: 'Immobilier',
    short: "La cession de la résidence principale est totalement exonérée de plus-value, quelle que soit la durée de détention.",
    long: [
      "La vente de votre résidence principale bénéficie d'une exonération totale de plus-value immobilière, sans condition de durée de détention. C'est l'exonération la plus favorable du droit fiscal français. Pour bénéficier de cette exonération, le logement doit être votre résidence principale effective et habituelle au moment de la cession.",
      "Pour les résidences secondaires et biens locatifs, la plus-value est exonérée après 22 ans de détention (IR) et 30 ans (prélèvements sociaux), grâce aux abattements progressifs pour durée de détention. Avant ces seuils, l'impôt est de 19 % + 17,2 % de prélèvements sociaux sur la plus-value nette.",
      "Cas particuliers : la première vente d'une résidence secondaire est exonérée si vous n'êtes pas propriétaire de votre résidence principale depuis 4 ans et que vous rachetez une résidence principale dans les 24 mois. Les retraités et invalides sous conditions de ressources bénéficient aussi d'exonérations spécifiques.",
    ],
    sims: ['/simulateurs/frais-notaire'],
    related: ['plus-value-immobiliere', 'prelevements-sociaux', 'tmi'],
  },

  // ── Épargne / Placements (nouveaux) ──────────────────────────────────────
  {
    slug: 'regle-4-pourcent', term: 'Règle des 4 %', full: 'Règle des 4 % (retraite anticipée)',
    aliases: ['règle des 4 %', 'règle des 4%', '4 % rule', 'règle 4 pourcent'], category: 'FIRE',
    short: "Principe selon lequel retirer 4 % de son portefeuille chaque année permet de ne jamais l'épuiser sur 30 ans, basé sur l'étude Trinity de 1998.",
    long: [
      "La règle des 4 % (ou « 4% rule ») est issue de l'étude Trinity (1998) qui a analysé les retraits sur des portefeuilles actions/obligations américains sur des périodes de 30 ans. Conclusion : retirer 4 % du capital initial la première année, puis ajuster à l'inflation, a fonctionné dans 95 % des scénarios historiques.",
      "Elle est la base de calcul de l'objectif FIRE : pour vivre de 2 000 €/mois, il faut 2 000 × 12 / 0,04 = 600 000 € de capital. C'est pourquoi on dit aussi que le « nombre FIRE » est 25× vos dépenses annuelles.",
      "Limites importantes : l'étude est basée sur des marchés américains (rendements historiquement plus élevés), sur 30 ans (une retraite à 40 ans dure potentiellement 50+ ans), et ne tient pas compte des impôts ni des frais. En France, avec des marchés plus volatils et une fiscalité différente, un taux de 3 à 3,5 % est souvent recommandé pour plus de sécurité.",
    ],
    sims: ['/simulateurs/fire', '/simulateurs/epargne'],
    related: ['fire', 'swr', 'taux-epargne', 'numero-f', 'interets-composes'],
    faqs: [
      { q: "La règle des 4 % est-elle fiable pour un Français ?", a: "Elle est conservatrice mais pas parfaite. L'étude Trinity est basée sur des marchés américains. Pour les investisseurs en Europe, certaines recherches suggèrent qu'un taux de retrait de 3 à 3,5 % est plus prudent, surtout pour des retraites de 40+ ans. Un portefeuille diversifié mondialement est plus robuste qu'un portefeuille purement européen." },
      { q: "Quand la règle des 4 % peut-elle échouer ?", a: "La règle des 4 % échoue principalement à cause du « risque de séquence » : si les marchés s'effondrent juste après votre retraite et que vous continuez à retirer, vous vendez des actifs dépréciés. Une retraite prolongée (50+ ans), une inflation élevée ou un portefeuille trop défensif augmentent aussi le risque d'échec." },
      { q: "Peut-on ajuster la règle des 4 % selon sa situation ?", a: "Oui. Les approches flexibles (« variable withdrawal strategies ») recommandent de réduire les retraits de 10-15 % lors des baisses de marchés et de les augmenter lors des hausses. D'autres ajustent selon des « garde-fous » : si le portefeuille baisse sous un seuil, réduire les dépenses discrétionnaires temporairement." },
    ],
  },
  {
    slug: 'allocation-actifs', term: "Allocation d'actifs", full: "Allocation d'actifs (Asset Allocation)",
    aliases: ["allocation d'actifs", 'asset allocation', 'répartition de portefeuille'], category: 'Finances',
    short: "Répartition du portefeuille entre différentes classes d'actifs (actions, obligations, immobilier, liquidités) selon le profil de risque et l'horizon d'investissement.",
    long: [
      "L'allocation d'actifs est la décision la plus importante d'un investisseur : elle détermine environ 90 % de la performance à long terme et du risque du portefeuille, selon la recherche académique de Brinson, Hood et Beebower (1986).",
      "Les grandes classes d'actifs sont : actions (potentiel de rendement élevé, forte volatilité), obligations (revenus stables, risque moindre), immobilier (physique ou SCPI), liquidités et actifs monétaires (sécurité, rendement faible), et alternatives (or, private equity, crypto).",
      "Une règle empirique classique : le pourcentage d'obligations dans le portefeuille = votre âge (110 - âge = % en actions pour les profils dynamiques). Cette règle simpliste est critiquée car elle sous-estime l'horizon de placement réel. Un retraité à 65 ans peut avoir encore 30 ans devant lui.",
    ],
    sims: ['/simulateurs/patrimoine', '/simulateurs/fire', '/simulateurs/epargne'],
    related: ['diversification', 'volatilite', 'reequilibrage', 'etf', 'obligations'],
  },
  {
    slug: 'reequilibrage', term: 'Rééquilibrage', full: 'Rééquilibrage de portefeuille',
    aliases: ['rééquilibrage', 'rebalancing', 'rééquilibrage de portefeuille'], category: 'Finances',
    short: "Opération consistant à ramener la répartition du portefeuille à son allocation cible, en vendant les actifs sur-pondérés et en achetant ceux sous-pondérés.",
    long: [
      "Après quelques années, l'évolution différente des actifs modifie l'allocation d'un portefeuille. Si les actions ont surperformé, elles représentent désormais une part plus grande que prévu. Le rééquilibrage vend une partie des actions pour réinvestir en obligations (ou actif sous-pondéré), ramenant le portefeuille à son allocation cible.",
      "Le rééquilibrage est à la fois un outil de gestion du risque (on évite une concentration excessive) et potentiellement une source de performance (on vend haut et on achète bas automatiquement). Fréquence recommandée : annuelle ou déclenchée par seuil (si une classe dépasse ±5 % de sa cible).",
      "Fiscalement, le rééquilibrage dans un PEA ou un PER n'entraîne pas de taxation immédiate. En compte-titres ordinaire, les ventes d'actifs en plus-value génèrent de l'impôt (PFU de 30 % sur la plus-value nette). Le rééquilibrage doit donc être optimisé fiscalement.",
    ],
    sims: ['/simulateurs/patrimoine', '/simulateurs/fire'],
    related: ['allocation-actifs', 'diversification', 'etf', 'pea'],
  },
  {
    slug: 'risque-sequence', term: 'Risque de séquence', full: 'Risque de séquence des rendements',
    aliases: ['risque de séquence', 'sequence of returns risk', 'risque séquence'], category: 'FIRE',
    short: "Danger pour un rentier de subir une forte baisse des marchés en début de retraite, réduisant définitivement le capital disponible pour les décennies suivantes.",
    long: [
      "Le risque de séquence est le risque que la chronologie des rendements impacte négativement le patrimoine d'un rentier. Deux personnes avec le même rendement moyen sur 20 ans peuvent avoir des résultats très différents si les baisses interviennent en début (catastrophique) ou en fin (acceptable) de retraite.",
      "Exemple : un portefeuille de 1 000 000 € avec des retraits de 40 000 €/an. Si les marchés perdent 40 % lors des 3 premières années, le capital passe à ~560 000 €. Il faudra des rendements bien supérieurs à la moyenne pour se rétablir tout en continuant les retraits.",
      "Stratégies de protection : constituer 2-3 ans de dépenses en liquidités (« bucket strategy »), réduire les retraits lors des baisses de marchés, avoir une partie en obligations à court terme, et si possible reporter sa retraite ou réduire ses dépenses lors d'une crise au début.",
    ],
    sims: ['/simulateurs/fire', '/simulateurs/rente-capital'],
    related: ['swr', 'regle-4-pourcent', 'fire', 'allocation-actifs'],
  },
  {
    slug: 'pee', term: 'PEE', full: "Plan d'Épargne Entreprise",
    aliases: ['PEE', "plan d'épargne entreprise"], category: 'Finances',
    short: "Dispositif collectif d'épargne salariale proposé par l'employeur, permettant d'investir avec des avantages fiscaux et sociaux, souvent abondé.",
    long: [
      "Le Plan d'Épargne Entreprise (PEE) est un système d'épargne collectif proposé par l'entreprise à ses salariés. Les versements peuvent venir du salarié (versements volontaires, intéressement, participation, abondement de l'employeur). Les sommes sont bloquées 5 ans, sauf cas de déblocage anticipé légaux.",
      "Avantages fiscaux majeurs : l'abondement de l'employeur est exonéré d'impôt sur le revenu dans la limite de 3 fois le versement salarié et de 3 523,20 € en 2026. Les plus-values réalisées dans le PEE sont exonérées d'IR (mais soumises aux prélèvements sociaux de 17,2 %).",
      "Cas de déblocage anticipé : mariage/PACS, naissance du 3ème enfant, divorce/séparation, achat de résidence principale, surendettement, décès ou invalidité du salarié ou de son conjoint, fin du contrat de travail (sous conditions). À la sortie au bout de 5 ans, la plus-value est exonérée d'IR.",
    ],
    sims: ['/simulateurs/epargne', '/simulateurs/per'],
    related: ['perco', 'abondement', 'interessement', 'per', 'taux-epargne'],
    faqs: [
      { q: "Peut-on débloquer son PEE avant 5 ans ?", a: "Oui, dans des cas précis fixés par la loi : mariage ou PACS, naissance du 3e enfant, divorce ou séparation avec la garde d'au moins un enfant, achat ou agrandissement de la résidence principale, perte involontaire d'emploi, décès ou invalidité du salarié ou de son conjoint, surendettement. Hors de ces cas, les fonds restent bloqués." },
      { q: "L'abondement de l'employeur est-il imposable ?", a: "L'abondement de l'employeur au PEE est exonéré d'impôt sur le revenu dans la limite de 3 fois le versement du salarié, sans dépasser 3 523,20 € en 2026 (8 % du PASS). Au-delà, il est imposable. Il reste soumis aux prélèvements sociaux de 17,2 % lors du déblocage." },
    ],
  },
  {
    slug: 'perco', term: 'PERCO', full: "Plan d'Épargne Retraite Collectif",
    aliases: ['PERCO', "plan d'épargne retraite collectif", 'PERCOL'], category: 'Finances',
    short: "Ancien dispositif d'épargne retraite collectif en entreprise (remplacé par le PERCOL), déblocable à la retraite en rente ou en capital.",
    long: [
      "Le PERCO (Plan d'Épargne Retraite Collectif) était le principal dispositif collectif d'épargne retraite en entreprise. Depuis la loi PACTE de 2019, les nouveaux plans s'appellent PERCOL (Plan d'Épargne Retraite Collectif) et offrent plus de flexibilité. Les anciens PERCO continuent de fonctionner.",
      "Le PERCOL/PERCO est alimenté par l'intéressement, la participation, les versements volontaires du salarié et l'abondement de l'employeur. Contrairement au PEE, les fonds sont bloqués jusqu'à la retraite, sauf cas de déblocage anticipé exceptionnels (achat résidence principale, décès, invalidité, expiration des droits au chômage).",
      "À la retraite, la sortie peut se faire en rente viagère, en capital fractionné ou en capital unique. La sortie en capital est la nouveauté du PERCOL par rapport à l'ancien PERCO (qui imposait la rente). Sur le plan fiscal, les versements volontaires sont déductibles du revenu imposable dans la limite de l'enveloppe PER.",
    ],
    sims: ['/simulateurs/per', '/simulateurs/epargne'],
    related: ['per', 'pee', 'abondement', 'interessement', 'rente-viagere'],
  },
  {
    slug: 'abondement', term: 'Abondement', full: "Abondement employeur",
    aliases: ['abondement', 'abondement employeur'], category: 'Finances',
    short: "Contribution de l'employeur qui vient compléter les versements du salarié sur un PEE ou PERCOL, généralement entre 50 % et 300 %.",
    long: [
      "L'abondement est la somme versée par l'employeur en complément des versements du salarié sur un PEE ou PERCOL. Il est plafonné par la loi mais laissé à la discrétion de l'entreprise dans ces limites. C'est l'un des avantages salariaux les plus avantageux car il multiplie immédiatement le capital investi.",
      "Exemple : votre entreprise abonde à 100 % vos versements PEE jusqu'à 2 000 €/an. Si vous versez 2 000 €, l'entreprise ajoute 2 000 €, soit un capital de 4 000 € investi — un rendement immédiat de 100 % avant toute performance de marché.",
      "L'abondement est exonéré de cotisations sociales patronales et salariales (sauf CSG/CRDS) dans la limite légale : 3 fois le versement salarié et 3 523,20 € pour le PEE (2026). Il est aussi exonéré d'impôt sur le revenu pour le salarié dans ces limites.",
    ],
    sims: ['/simulateurs/epargne', '/simulateurs/per'],
    related: ['pee', 'perco', 'interessement', 'participation-entreprise'],
  },
  {
    slug: 'interessement', term: 'Intéressement', full: "Intéressement aux résultats de l'entreprise",
    aliases: ['intéressement', 'prime intéressement'], category: 'Finances',
    short: "Prime facultative liée aux résultats ou aux performances de l'entreprise, versée à tous les salariés et exonérée d'impôt si placée en épargne salariale.",
    long: [
      "L'intéressement est un dispositif facultatif permettant à l'entreprise de faire participer ses salariés à ses résultats ou performances (chiffre d'affaires, productivité, objectifs qualitatifs). Il est défini par accord d'entreprise pour 3 ans maximum.",
      "Les sommes versées sont exonérées de cotisations sociales (sauf CSG/CRDS 9,7 %). Si le salarié choisit de les verser sur un PEE ou PERCOL dans les 15 jours suivant la notification, elles sont également exonérées d'impôt sur le revenu (plafond : 75 % du PASS, soit 32 994 € en 2026).",
      "Si le salarié perçoit l'intéressement directement (pas d'épargne salariale), il est imposé comme revenu ordinaire. Il est donc généralement très avantageux de verser son intéressement en épargne salariale, surtout si l'employeur abonde.",
    ],
    sims: ['/simulateurs/epargne', '/simulateurs/impot-revenu'],
    related: ['pee', 'perco', 'abondement', 'participation-entreprise'],
  },
  {
    slug: 'participation-entreprise', term: 'Participation', full: "Participation aux bénéfices de l'entreprise",
    aliases: ['participation', 'participation aux bénéfices', 'participation salariale'], category: 'Finances',
    short: "Dispositif légalement obligatoire pour les entreprises de 50+ salariés qui redistribue une partie des bénéfices aux salariés selon une formule légale.",
    long: [
      "Contrairement à l'intéressement (facultatif), la participation est obligatoire dans les entreprises de 50 salariés et plus réalisant des bénéfices. Elle est calculée selon une formule légale : Participation = 0,5 × (Bénéfice net fiscal - 5 % des capitaux propres) × (Masse salariale / Valeur ajoutée).",
      "Les sommes sont bloquées 5 ans sur un PEE (ou 1 an si accord de participation avec sortie immédiate). Les mêmes règles fiscales que l'intéressement s'appliquent : exonération d'IR si placées en épargne salariale.",
      "Les salariés peuvent opter pour le déblocage immédiat (imposition comme revenu) ou le placement en épargne salariale (exonération d'IR). L'option par défaut légale est le placement sur le PEE si le salarié ne répond pas dans le délai imparti.",
    ],
    sims: ['/simulateurs/epargne', '/simulateurs/impot-revenu'],
    related: ['interessement', 'pee', 'abondement'],
  },
  {
    slug: 'private-equity', term: 'Private equity', full: 'Capital-investissement (Private equity)',
    aliases: ['private equity', 'capital-investissement', 'capital investissement'], category: 'Finances',
    short: "Investissement en capital dans des sociétés non cotées en bourse. Rendements potentiellement élevés, mais illiquidité et risque de perte en capital importants.",
    long: [
      "Le private equity (capital-investissement) désigne les investissements en capital dans des entreprises non cotées. Il prend plusieurs formes : capital-risque (startups), capital-développement (entreprises en croissance), LBO (rachat avec endettement), capital-retournement (entreprises en difficulté).",
      "Historiquement, le private equity a généré des rendements supérieurs aux marchés cotés (+3-5 % par an pour les meilleurs fonds), en contrepartie d'une illiquidité totale pendant 7-12 ans. L'accès était réservé aux institutionnels, mais des fonds accessibles aux particuliers (FCPR, FPCI) se développent depuis 2021 avec un ticket minimal réduit.",
      "En France, les FCPR (Fonds Communs de Placement à Risque) permettent aux particuliers d'investir en private equity avec des avantages fiscaux (exonération d'IR sur les plus-values après 5 ans de détention). Le risque de perte en capital peut aller jusqu'à 100 % pour les fonds de capital-risque early stage.",
    ],
    sims: ['/simulateurs/patrimoine'],
    related: ['etf', 'diversification', 'rendement-reel', 'scpi'],
  },

  // ── Budget / Statuts professionnels (nouveaux) ───────────────────────────
  {
    slug: 'micro-entrepreneur', term: 'Micro-entrepreneur', full: 'Statut de micro-entrepreneur (auto-entrepreneur)',
    aliases: ['micro-entrepreneur', 'auto-entrepreneur', 'auto entrepreneur', 'micro entrepreneur'], category: 'Budget',
    short: "Statut simplifié pour exercer une activité indépendante : cotisations sociales et impôt calculés sur le chiffre d'affaires encaissé, sans comptabilité complexe.",
    long: [
      "Le statut de micro-entrepreneur (anciennement auto-entrepreneur) est le régime simplifié de l'entrepreneur individuel. Il est ouvert à tous pour créer une activité complémentaire ou principale. Les cotisations sociales sont calculées en pourcentage du chiffre d'affaires encaissé : 12,3 % pour la vente de marchandises, 21,2 % pour les prestations de services BIC et 21,1 % pour les services BNC.",
      "Le versement libératoire de l'impôt (en option) permet de payer l'IR directement sur le CA : 1 % pour la vente, 1,7 % pour les services BIC, 2,2 % pour les services BNC. Cette option est avantageuse si le taux moyen d'imposition est supérieur à ces taux.",
      "Plafonds de CA en 2026 : 188 700 € pour les activités de vente, 77 700 € pour les prestations de services. Au-delà, passage obligatoire au régime réel. Limite : pas de déduction des charges réelles, donc défavorable si les charges représentent plus de 30-40 % du CA.",
    ],
    sims: ['/simulateurs/impot-revenu'],
    related: ['portage-salarial', 'tmi', 'taux-moyen-imposition', 'cotisation-retraite'],
    faqs: [
      { q: "Un micro-entrepreneur cotise-t-il pour la retraite ?", a: "Oui, mais moins qu'un salarié. Les cotisations retraite du micro-entrepreneur sont comprises dans le taux global de cotisations sociales. Pour la retraite de base, il cotise au SSI (ex-RSI) et à l'Agirc-Arrco pour la complémentaire. Cependant, les droits acquis sont souvent inférieurs à ceux d'un salarié à revenu égal, surtout si le CA est faible." },
      { q: "Quels sont les avantages du micro-entrepreneur par rapport au salarié ?", a: "Liberté totale de l'organisation du travail, charges sociales uniquement si CA (pas de cotisation minimale), création en 24h, comptabilité simplifiée (seul un livre de recettes est obligatoire), possibilité de cumuler avec un emploi salarié. Inconvénients : pas de chômage, protection sociale moindre, pas de déduction des frais réels." },
      { q: "Comment passer du statut micro-entrepreneur à un autre statut ?", a: "Si votre CA dépasse les plafonds, vous basculez automatiquement au régime réel après 2 ans de dépassement. Vous pouvez aussi opter volontairement pour une EURL, SASU ou société à n'importe quel moment. La transformation ou la création d'une société permet de déduire les charges réelles et de dissocier le patrimoine personnel et professionnel." },
    ],
  },
  {
    slug: 'portage-salarial', term: 'Portage salarial', full: 'Portage salarial',
    aliases: ['portage salarial'], category: 'Budget',
    short: "Statut hybride entre salarié et indépendant : une société de portage embauche le consultant, lui permettant de bénéficier de la protection du salariat.",
    long: [
      "Le portage salarial permet à un consultant indépendant d'exercer son activité tout en ayant le statut de salarié d'une société de portage. Le consultant facture ses clients, la société de portage encaisse les honoraires, prélève des frais de gestion (5-15 % du CA), verse les charges patronales et salariales, et reverse le net au consultant sous forme de salaire.",
      "Avantages : droits au chômage (ARE) en cas de fin de mission, protection sociale complète (maladie, retraite, prévoyance), pas de gestion administrative, accès au statut cadre. Idéal pour les consultants qui souhaitent tester une activité sans créer de société.",
      "Inconvénients : coût des frais de gestion (5-15 %), cotisations sociales élevées (≈ 45 % du CA), pas possible pour les activités réglementées (médecin, avocat, comptable). Comparatif avec micro-entreprise : le portage est plus protecteur mais coûte environ 2× plus en charges.",
    ],
    sims: ['/simulateurs/impot-revenu'],
    related: ['micro-entrepreneur', 'tmi', 'interessement'],
    faqs: [
      { q: "Le portage salarial donne-t-il droit au chômage ?", a: "Oui, c'est l'un des principaux avantages du portage salarial. En cas de fin de mission et de période de chômage entre deux missions, le consultant porté peut bénéficier de l'ARE (allocation chômage) selon les règles habituelles, à condition d'avoir cotisé suffisamment. C'est impossible avec une micro-entreprise." },
      { q: "Quelle différence entre portage salarial et micro-entreprise ?", a: "En portage salarial, vous êtes salarié : charges sociales ≈ 45 % du CA, droits au chômage, retraite complète, mutuelle d'entreprise possible. En micro-entreprise : charges 12-21 % du CA, pas de chômage, retraite partielle, gestion simplifiée. Le portage coûte plus cher mais protège mieux." },
    ],
  },
  {
    slug: 'cpf', term: 'CPF', full: 'Compte Personnel de Formation',
    aliases: ['CPF', 'compte personnel de formation', 'DIF', 'compte formation'], category: 'Budget',
    short: "Droit à la formation professionnelle alimenté en euros chaque année travaillée, utilisable pour financer des formations certifiantes tout au long de la vie.",
    long: [
      "Le Compte Personnel de Formation (CPF) remplace le DIF depuis 2015. Il est alimenté en euros chaque année : 500 €/an pour un salarié à temps plein jusqu'à 37 500 € de plafond, 800 €/an pour les personnes peu qualifiées (sans qualification ou niveau CAP). Les droits sont attachés à la personne, non à l'employeur.",
      "Les formations éligibles au CPF sont uniquement les formations certifiantes ou qualifiantes : diplômes, titres professionnels, CQP, CLEA, VAE, bilans de compétences, permis de conduire (B, camion, bus). Le crédit est utilisable sur la plateforme Mon Compte Formation.",
      "Depuis 2023, une participation forfaitaire de 100 € est demandée au salarié pour les formations financées par le CPF (sauf cas d'exonération). Les fonctionnaires ont un régime similaire mais distinct. Le CPF ne se cumule pas avec le plan de développement des compétences de l'entreprise.",
    ],
    sims: [],
    related: ['micro-entrepreneur', 'portage-salarial'],
  },
  {
    slug: 'cotisation-retraite', term: 'Cotisation retraite', full: 'Cotisation de retraite obligatoire',
    aliases: ['cotisation retraite', 'cotisations retraite', 'cotisation vieillesse'], category: 'Retraite',
    short: "Prélèvement obligatoire sur les revenus du travail qui finance les pensions actuelles et constitue des droits à la retraite future.",
    long: [
      "Les cotisations retraite sont des prélèvements obligatoires sur les revenus professionnels, répartis entre salarié et employeur. Pour un salarié du privé, la cotisation vieillesse est de 6,90 % (salarié) + 8,55 % (employeur) pour la retraite de base (CNAV), plus les cotisations Agirc-Arrco pour la complémentaire.",
      "Ces cotisations financent un système de retraite par répartition : les actifs d'aujourd'hui financent les retraités d'aujourd'hui, et accumulent en contrepartie des droits qui seront financés par les actifs futurs. C'est le principe de la solidarité intergénérationnelle.",
      "Les indépendants (micro-entrepreneurs, TNS) cotisent via le SSI (Sécurité Sociale des Indépendants) à des taux différents et souvent moins favorables. L'écart de droits accumulés peut être significatif : un indépendant avec un CA identique au salaire d'un salarié peut accumuler 20-30 % de droits en moins.",
    ],
    sims: ['/simulateurs/cnav', '/simulateurs/agirc-arrco'],
    related: ['cnav', 'agirc-arrco', 'pass', 'sam', 'taux-remplacement'],
  },
  {
    slug: 'plafond-epargne-retraite', term: 'Plafond épargne retraite', full: "Plafond de déduction de l'épargne retraite",
    aliases: ['plafond PER', 'plafond épargne retraite', 'plafond déduction retraite', 'enveloppe PER'], category: 'Retraite',
    short: "Montant maximum déductible du revenu imposable pour les versements sur un PER, PERP ou Madelin. En 2026 : 10 % des revenus professionnels, max 37 094 €.",
    long: [
      "Les versements volontaires sur un PER (Plan d'Épargne Retraite) sont déductibles du revenu imposable dans la limite de l'enveloppe fiscale retraite. Pour 2026, cette limite est de 10 % des revenus professionnels nets de frais (plafonnés à 8 PASS, soit 37 094 €) ou 10 % du PASS si ce montant est supérieur (soit 4 637 €).",
      "Les travailleurs non salariés (TNS, indépendants) bénéficient d'une enveloppe plus large : 10 % du bénéfice imposable limité à 8 PASS + 15 % entre 1 et 8 PASS, soit potentiellement jusqu'à 85 780 € de déduction (2026). C'est l'un des outils de défiscalisation les plus puissants pour les indépendants avec une forte TMI.",
      "L'enveloppe non utilisée est reportable sur 3 ans. Si vous n'avez pas utilisé votre plafond 2023, 2024 et 2025, vous pouvez en 2026 déduire jusqu'à 4 fois le plafond annuel. Consultez votre avis d'imposition pour connaître le solde reportable indiqué par l'administration fiscale.",
    ],
    sims: ['/simulateurs/per', '/simulateurs/impot-revenu'],
    related: ['per', 'tmi', 'optimisation-fiscale', 'pass'],
    faqs: [
      { q: "Quel est le plafond PER en 2026 pour un salarié ?", a: "Pour un salarié avec 50 000 € de revenus nets en 2025, le plafond de déduction PER est de 10 % × 50 000 = 5 000 €. Maximum absolu : 37 094 € (10 % de 8 PASS). Minimum : 4 637 € (10 % de 1 PASS). Si vous avez des plafonds non utilisés des 3 années précédentes, vous pouvez les cumuler." },
      { q: "Comment connaître son plafond PER disponible ?", a: "Votre plafond de déduction PER est indiqué sur votre avis d'imposition, dans la section 'Plafonds de déduction des cotisations versées en vue de la retraite'. Il tient compte des plafonds non utilisés des 3 années précédentes. Vous pouvez aussi le consulter sur votre espace personnel impots.gouv.fr." },
    ],
  },
  {
    slug: 'avantage-nature', term: 'Avantage en nature', full: 'Avantage en nature',
    aliases: ['avantage en nature', 'avantages en nature', 'avantage salaire'], category: 'Budget',
    short: "Bien ou service fourni par l'employeur gratuitement ou à prix réduit (voiture de fonction, logement, repas, téléphone) et valorisé comme revenu imposable.",
    long: [
      "Les avantages en nature sont des biens ou services mis à la disposition du salarié par l'employeur sans contrepartie ou à un tarif inférieur au marché. Les principaux : voiture de fonction (usage personnel), logement de fonction, repas fournis ou subventionnés, téléphone, outils informatiques.",
      "Ils sont soumis aux cotisations sociales et à l'impôt sur le revenu au même titre que le salaire. La valorisation peut être forfaitaire (ex : voiture de fonction : 9 % du coût d'achat TTC par an) ou au réel (valeur locative du marché).",
      "Exception : les tickets-restaurant échappent aux cotisations sociales dans la limite de la participation patronale, et à l'IR à hauteur de 7,18 € par titre (2026). Les outils nomades (téléphone, ordinateur) utilisés à la fois professionnellement et personnellement suivent des règles d'évaluation spécifiques.",
    ],
    sims: ['/simulateurs/impot-revenu'],
    related: ['interessement', 'tmi', 'micro-entrepreneur'],
  },

  // ── Finances (nouveaux) ──────────────────────────────────────────────────
  {
    slug: 'revenus-passifs', term: 'Revenus passifs', full: 'Revenus passifs',
    aliases: ['revenus passifs', 'revenu passif', 'revenus sans travailler'], category: 'Finances',
    short: "Revenus réguliers générés par des actifs (loyers, dividendes, retraits de portefeuille) sans nécessiter de travail actif quotidien.",
    long: [
      "Les revenus passifs désignent tous les flux financiers réguliers générés par des actifs détenus sans travail actif quotidien : loyers d'appartements, dividendes et coupons d'obligations, retraits programmés d'un portefeuille boursier (ETF, SCPI), royalties, revenus d'une activité en ligne automatisée.",
      "Dans le vocabulaire FIRE, « vivre de ses revenus passifs » signifie couvrir l'ensemble de ses dépenses grâce aux flux produits par son patrimoine, sans dépendre d'un salaire. C'est l'objectif de l'indépendance financière.",
      "La construction de revenus passifs nécessite du temps et du capital initial. Les principales sources : immobilier locatif (rendement brut 4-7 %), ETF actions (dividendes + plus-values, rendement historique 7-10 %/an), obligations (coupons 3-5 %). La diversification des sources réduit la dépendance à une seule classe d'actifs.",
    ],
    sims: ['/simulateurs/fire', '/simulateurs/epargne', '/simulateurs/rente-capital'],
    related: ['fire', 'rente', 'rente-viagere', 'scpi', 'dividende', 'regle-4-pourcent'],
  },
  {
    slug: 'plafond-annuel-securite-sociale', term: 'PASS', full: 'Plafond Annuel de la Sécurité Sociale',
    aliases: ['PASS', 'plafond annuel de la sécurité sociale', 'plafond sécurité sociale'], category: 'Finances',
    short: "Référence légale de la Sécurité sociale (46 368 € en 2026) qui sert de base au calcul de nombreux plafonds de cotisations et avantages sociaux.",
    long: [
      "Le Plafond Annuel de la Sécurité Sociale (PASS) est une valeur de référence réévaluée chaque année (46 368 € en 2026, 43 992 € en 2024). Il sert de base à de nombreux calculs : plafond des cotisations retraite, plafond du Livret A (pas de lien direct mais souvent confondu), calcul des allocations chômage, etc.",
      "Le PASS intervient dans le calcul des points Agirc-Arrco : les cotisations sur la tranche A (0 à 1 PASS) et la tranche B (1 à 8 PASS) ne génèrent pas les mêmes points. Il fixe aussi le plafond de déductibilité des versements PER.",
      "Valeurs dérivées courantes : 1 PASS/mois = 3 864 €, 1/4 PASS/mois = 966 €. Ces seuils conditionnent l'éligibilité à certaines aides (APL, minimum contributif, etc.).",
    ],
    sims: ['/simulateurs/cnav', '/simulateurs/agirc-arrco', '/simulateurs/per'],
    related: ['agirc-arrco', 'cnav', 'per', 'pass'],
  },
  {
    slug: 'trackers', term: 'Trackers (ETF)', full: 'Fonds indiciel coté (ETF / Tracker)',
    aliases: ['trackers', 'tracker', 'fonds indiciel'], category: 'Finances',
    short: "Fonds d'investissement coté en bourse répliquant fidèlement un indice (CAC 40, S&P 500…), avec des frais très faibles comparés aux fonds actifs.",
    long: [
      "Un tracker (ou ETF — Exchange Traded Fund) est un fonds d'investissement coté en bourse qui réplique la performance d'un indice de référence (CAC 40, MSCI World, S&P 500…). Il se distingue des fonds actifs par sa gestion passive : pas de stock-picking, frais très réduits (0,03 à 0,50 % par an vs 1,5-2 % pour les fonds actifs).",
      "Les études académiques montrent que 85-95 % des fonds actifs sous-performent leur indice sur 10 ans après frais. Les trackers permettent à un investisseur particulier de capter la performance de marchés entiers à moindre coût.",
      "En France, les ETF MSCI World sont éligibles au PEA (pour les ETF répliquant des indices comportant des sociétés américaines via une réplication synthétique), ce qui permet une exonération d'IR après 5 ans. Les ETF sont la principale recommandation des adeptes de la gestion indicielle passive.",
    ],
    sims: ['/simulateurs/patrimoine', '/simulateurs/fire', '/simulateurs/epargne'],
    related: ['etf', 'ter', 'dca', 'pea', 'diversification', 'opcvm'],
  },
  {
    slug: 'credit-immobilier', term: 'Crédit immobilier', full: 'Crédit immobilier',
    aliases: ['crédit immobilier', 'prêt immobilier', 'emprunt immobilier'], category: 'Immobilier',
    short: "Prêt bancaire à moyen ou long terme (7 à 30 ans) destiné à financer l'achat d'un bien immobilier, avec le bien en garantie.",
    long: [
      "Le crédit immobilier est un prêt accordé par une banque ou un établissement financier pour financer tout ou partie d'un achat immobilier. La durée varie de 7 à 30 ans (voire 35 ans pour certains dossiers spécifiques). Le bien acheté sert généralement de garantie (hypothèque ou caution).",
      "Les éléments clés : le taux d'intérêt nominal (fixe ou variable), l'assurance emprunteur (obligatoire), les frais de dossier et de garantie. Tous ces éléments sont agrégés dans le TAEG pour faciliter la comparaison. La mensualité comprend le remboursement du capital et les intérêts.",
      "La capacité d'emprunt est limitée par le taux d'endettement (max 35 % des revenus) et la durée. Un apport de 10-20 % est généralement requis pour couvrir les frais de notaire et réduire le risque pour la banque.",
    ],
    sims: ['/simulateurs/emprunt-immobilier', '/simulateurs/ptz', '/simulateurs/frais-notaire'],
    related: ['taeg', 'taea', 'taux-endettement', 'capacite-emprunt', 'apport', 'ptz'],
  },
  {
    slug: 'rebalancement', term: 'Rebalancement', full: 'Rebalancement de portefeuille',
    aliases: ['rebalancement', 'rééquilibrage annuel'], category: 'Finances',
    short: "Voir Rééquilibrage — opération périodique qui ramène un portefeuille à son allocation d'actifs cible après les évolutions de marché.",
    long: [
      "Le rebalancement (ou rééquilibrage) est l'opération consistant à ramener un portefeuille d'investissement à sa répartition cible entre différentes classes d'actifs (actions, obligations, immobilier, liquidités) après que leurs performances respectives ont modifié cette répartition.",
      "Exemple : un portefeuille cible 70 % actions / 30 % obligations. Après un rallye boursier, il peut se retrouver à 80 / 20. Le rebalancement vend 10 % d'actions et achète des obligations pour revenir à 70/30.",
      "Fréquence optimale selon les études : annuelle ou déclenchée par un seuil de dérive (±5 % de la cible). Un rebalancement trop fréquent génère des frais et des impôts, un rebalancement trop rare laisse dériver le risque.",
    ],
    sims: ['/simulateurs/patrimoine'],
    related: ['allocation-actifs', 'reequilibrage', 'diversification'],
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
