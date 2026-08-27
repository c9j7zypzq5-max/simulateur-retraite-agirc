// FICHIER GÉNÉRÉ — ne pas modifier à la main.
// Source : src/data/glossaire.js · Régénérer : npm run gen:indexes
//
// Index léger du lexique : uniquement les champs nécessaires à l'auto-liaison
// des termes, à l'infobulle <Terme> et au bloc « définitions utiles » du Footer.
// Ces usages sont présents sur toutes les pages ; charger glossaire.js en entier
// pour eux faisait télécharger les définitions longues et les FAQ dont seules
// les pages /lexique ont besoin.

export const GLOSSARY_INDEX = [
  {
    "slug": "taeg",
    "term": "TAEG",
    "full": "Taux Annuel Effectif Global",
    "aliases": [
      "TAEG"
    ],
    "short": "Coût total d'un crédit exprimé en % par an : intérêts, assurance et frais inclus. Sert à comparer les offres.",
    "sims": [
      "/simulateurs/emprunt-immobilier",
      "/simulateurs/credit-conso"
    ]
  },
  {
    "slug": "taea",
    "term": "TAEA",
    "full": "Taux Annuel Effectif de l'Assurance",
    "aliases": [
      "TAEA"
    ],
    "short": "Part du coût de l'assurance emprunteur dans le crédit, exprimée en % par an.",
    "sims": [
      "/simulateurs/emprunt-immobilier"
    ]
  },
  {
    "slug": "ptz",
    "term": "PTZ",
    "full": "Prêt à Taux Zéro",
    "aliases": [
      "PTZ"
    ],
    "short": "Prêt sans intérêt accordé sous conditions de ressources pour financer une première résidence principale.",
    "sims": [
      "/simulateurs/ptz",
      "/simulateurs/emprunt-immobilier"
    ]
  },
  {
    "slug": "taux-endettement",
    "term": "Taux d'endettement",
    "full": "Taux d'endettement",
    "aliases": [
      "taux d'endettement"
    ],
    "short": "Part de vos revenus consacrée au remboursement de vos crédits. Généralement plafonné à 35 %.",
    "sims": [
      "/simulateurs/emprunt-immobilier"
    ]
  },
  {
    "slug": "capacite-emprunt",
    "term": "Capacité d'emprunt",
    "full": "Capacité d'emprunt",
    "aliases": [
      "capacité d'emprunt"
    ],
    "short": "Montant maximal que vous pouvez emprunter compte tenu de vos revenus, charges et de la durée du prêt.",
    "sims": [
      "/simulateurs/emprunt-immobilier"
    ]
  },
  {
    "slug": "apport",
    "term": "Apport personnel",
    "full": "Apport personnel",
    "aliases": [
      "apport personnel"
    ],
    "short": "Somme que vous financez vous-même dans un achat, en complément du prêt. Souvent ~10 % minimum.",
    "sims": [
      "/simulateurs/emprunt-immobilier",
      "/simulateurs/ptz"
    ]
  },
  {
    "slug": "frais-notaire",
    "term": "Frais de notaire",
    "full": "Frais de notaire (frais d'acquisition)",
    "aliases": [
      "frais de notaire",
      "frais d'acquisition"
    ],
    "short": "Frais liés à l'achat immobilier (~7-8 % dans l'ancien, ~2-3 % dans le neuf), surtout des taxes.",
    "sims": [
      "/simulateurs/emprunt-immobilier"
    ]
  },
  {
    "slug": "amortissement",
    "term": "Amortissement",
    "full": "Amortissement du capital",
    "aliases": [
      "amortissement"
    ],
    "short": "Remboursement progressif du capital emprunté. En début de prêt, la mensualité paie surtout des intérêts.",
    "sims": [
      "/simulateurs/emprunt-immobilier",
      "/simulateurs/credit-conso"
    ]
  },
  {
    "slug": "rendement-locatif",
    "term": "Rendement locatif",
    "full": "Rendement locatif",
    "aliases": [
      "rendement locatif"
    ],
    "short": "Rapport entre les loyers annuels et le prix du bien. On distingue rendement brut et net.",
    "sims": [
      "/simulateurs/rendement-locatif"
    ]
  },
  {
    "slug": "lmnp",
    "term": "LMNP",
    "full": "Loueur en Meublé Non Professionnel",
    "aliases": [
      "LMNP"
    ],
    "short": "Statut fiscal de la location meublée permettant d'amortir le bien et de réduire l'impôt sur les loyers.",
    "sims": [
      "/simulateurs/rendement-locatif"
    ]
  },
  {
    "slug": "tmi",
    "term": "TMI",
    "full": "Tranche Marginale d'Imposition",
    "aliases": [
      "TMI"
    ],
    "short": "Taux d'imposition appliqué à la dernière tranche de vos revenus (0, 11, 30, 41 ou 45 %).",
    "sims": [
      "/simulateurs/impot-revenu",
      "/simulateurs/per"
    ]
  },
  {
    "slug": "ir",
    "term": "IR",
    "full": "Impôt sur le Revenu",
    "aliases": [
      "impôt sur le revenu"
    ],
    "short": "Impôt progressif calculé sur les revenus du foyer après application du quotient familial.",
    "sims": [
      "/simulateurs/impot-revenu"
    ]
  },
  {
    "slug": "quotient-familial",
    "term": "Quotient familial",
    "full": "Quotient familial",
    "aliases": [
      "quotient familial"
    ],
    "short": "Nombre de parts du foyer fiscal servant à diviser le revenu pour calculer l'impôt.",
    "sims": [
      "/simulateurs/impot-revenu"
    ]
  },
  {
    "slug": "pfu",
    "term": "PFU",
    "full": "Prélèvement Forfaitaire Unique (flat tax)",
    "aliases": [
      "PFU",
      "flat tax"
    ],
    "short": "Imposition forfaitaire de 31,4 % sur les revenus du capital (12,8 % d'impôt + 18,6 % de prélèvements sociaux depuis 2026).",
    "sims": [
      "/simulateurs/assurance-vie",
      "/simulateurs/comparateur"
    ]
  },
  {
    "slug": "prelevements-sociaux",
    "term": "Prélèvements sociaux",
    "full": "Prélèvements sociaux",
    "aliases": [
      "prélèvements sociaux"
    ],
    "short": "Contributions (CSG, CRDS…) prélevées sur les revenus du capital : 18,6 % pour la plupart, 17,2 % pour quelques exceptions.",
    "sims": [
      "/simulateurs/assurance-vie",
      "/simulateurs/plus-value-immobiliere"
    ]
  },
  {
    "slug": "csg",
    "term": "CSG",
    "full": "Contribution Sociale Généralisée",
    "aliases": [
      "CSG"
    ],
    "short": "Prélèvement social finançant la protection sociale, dû sur la plupart des revenus.",
    "sims": [
      "/simulateurs/salaire",
      "/simulateurs/impot-revenu",
      "/simulateurs/cnav"
    ]
  },
  {
    "slug": "crds",
    "term": "CRDS",
    "full": "Contribution au Remboursement de la Dette Sociale",
    "aliases": [
      "CRDS"
    ],
    "short": "Prélèvement social de 0,5 % destiné à résorber la dette de la Sécurité sociale.",
    "sims": [
      "/simulateurs/salaire"
    ]
  },
  {
    "slug": "plus-value-immobiliere",
    "term": "Plus-value immobilière",
    "full": "Plus-value immobilière",
    "aliases": [
      "plus-value immobilière"
    ],
    "short": "Gain réalisé à la revente d'un bien, taxé après abattements pour durée de détention.",
    "sims": [
      "/simulateurs/plus-value-immobiliere"
    ]
  },
  {
    "slug": "abattement",
    "term": "Abattement",
    "full": "Abattement fiscal",
    "aliases": [
      "abattement"
    ],
    "short": "Réduction appliquée à une base imposable avant calcul de l'impôt.",
    "sims": [
      "/simulateurs/assurance-vie",
      "/simulateurs/plus-value-immobiliere",
      "/simulateurs/succession"
    ]
  },
  {
    "slug": "agirc-arrco",
    "term": "Agirc-Arrco",
    "full": "Régime de retraite complémentaire Agirc-Arrco",
    "aliases": [
      "Agirc-Arrco",
      "Agirc Arrco"
    ],
    "short": "Retraite complémentaire obligatoire des salariés du privé, fonctionnant par points.",
    "sims": [
      "/simulateurs/agirc-arrco"
    ]
  },
  {
    "slug": "cnav",
    "term": "CNAV",
    "full": "Caisse Nationale d'Assurance Vieillesse",
    "aliases": [
      "CNAV"
    ],
    "short": "Régime de base de la retraite des salariés du privé (« régime général »).",
    "sims": [
      "/simulateurs/cnav"
    ]
  },
  {
    "slug": "ircantec",
    "term": "IRCANTEC",
    "full": "Institution de Retraite Complémentaire des Agents Non Titulaires",
    "aliases": [
      "IRCANTEC"
    ],
    "short": "Retraite complémentaire par points des agents non titulaires du secteur public.",
    "sims": [
      "/simulateurs/ircantec"
    ]
  },
  {
    "slug": "pass",
    "term": "PASS",
    "full": "Plafond Annuel de la Sécurité Sociale",
    "aliases": [
      "PASS"
    ],
    "short": "Montant de référence (48 060 € en 2026, soit 4 005 €/mois) servant de plafond aux cotisations retraite.",
    "sims": [
      "/simulateurs/agirc-arrco",
      "/simulateurs/cnav",
      "/simulateurs/per"
    ]
  },
  {
    "slug": "taux-plein",
    "term": "Taux plein",
    "full": "Retraite à taux plein",
    "aliases": [
      "taux plein"
    ],
    "short": "Taux maximal de la retraite de base (50 %), sans décote, sous condition de trimestres ou d'âge.",
    "sims": [
      "/simulateurs/cnav",
      "/simulateurs/agirc-arrco"
    ]
  },
  {
    "slug": "decote",
    "term": "Décote",
    "full": "Décote de retraite",
    "aliases": [
      "décote"
    ],
    "short": "Réduction définitive de la pension CNAV en cas de départ sans le nombre de trimestres requis.",
    "sims": [
      "/simulateurs/cnav",
      "/simulateurs/agirc-arrco"
    ]
  },
  {
    "slug": "surcote",
    "term": "Surcote",
    "full": "Surcote de retraite",
    "aliases": [
      "surcote"
    ],
    "short": "Majoration définitive de la pension CNAV de 1,25 % par trimestre travaillé au-delà du taux plein.",
    "sims": [
      "/simulateurs/cnav",
      "/simulateurs/retraite-progressive"
    ]
  },
  {
    "slug": "trimestre",
    "term": "Trimestre",
    "full": "Trimestre de retraite",
    "aliases": [
      "trimestre"
    ],
    "short": "Unité de durée d'assurance. Il en faut entre 167 et 172 (selon l'année de naissance) pour le taux plein.",
    "sims": [
      "/simulateurs/cnav",
      "/simulateurs/trimestres"
    ]
  },
  {
    "slug": "sam",
    "term": "SAM",
    "full": "Salaire Annuel Moyen",
    "aliases": [
      "salaire annuel moyen"
    ],
    "short": "Moyenne de vos 25 meilleures années de salaire, base du calcul de la retraite de base.",
    "sims": [
      "/simulateurs/cnav"
    ]
  },
  {
    "slug": "points-retraite",
    "term": "Points de retraite",
    "full": "Points de retraite",
    "aliases": [
      "points de retraite"
    ],
    "short": "Unités acquises via les cotisations dans les régimes complémentaires ; converties en pension à la liquidation.",
    "sims": [
      "/simulateurs/agirc-arrco",
      "/simulateurs/ircantec"
    ]
  },
  {
    "slug": "per",
    "term": "PER",
    "full": "Plan d'Épargne Retraite",
    "aliases": [
      "PER"
    ],
    "short": "Enveloppe d'épargne retraite : les versements sont déductibles du revenu imposable, dans un plafond.",
    "sims": [
      "/simulateurs/per"
    ]
  },
  {
    "slug": "smic",
    "term": "SMIC",
    "full": "Salaire Minimum Interprofessionnel de Croissance",
    "aliases": [
      "SMIC"
    ],
    "short": "Salaire horaire minimum légal. Sert notamment à valider les trimestres de retraite.",
    "sims": [
      "/simulateurs/salaire"
    ]
  },
  {
    "slug": "pea",
    "term": "PEA",
    "full": "Plan d'Épargne en Actions",
    "aliases": [
      "PEA"
    ],
    "short": "Enveloppe pour investir en actions européennes, exonérée d'impôt sur les gains après 5 ans.",
    "sims": [
      "/simulateurs/comparateur",
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "assurance-vie",
    "term": "Assurance-vie",
    "full": "Assurance-vie",
    "aliases": [
      "assurance-vie",
      "assurance vie"
    ],
    "short": "Placement souple à fiscalité avantageuse après 8 ans, avec abattement annuel sur les gains.",
    "sims": [
      "/simulateurs/assurance-vie"
    ]
  },
  {
    "slug": "etf",
    "term": "ETF",
    "full": "Exchange Traded Fund (tracker)",
    "aliases": [
      "ETF",
      "tracker"
    ],
    "short": "Fonds indiciel coté en bourse qui réplique un indice (ex. S&P 500, MSCI World) à frais réduits.",
    "sims": [
      "/simulateurs/comparateur",
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "interets-composes",
    "term": "Intérêts composés",
    "full": "Intérêts composés",
    "aliases": [
      "intérêts composés"
    ],
    "short": "Mécanisme où les intérêts génèrent eux-mêmes des intérêts, accélérant la croissance dans le temps.",
    "sims": [
      "/simulateurs/epargne",
      "/simulateurs/fire"
    ]
  },
  {
    "slug": "capitalisation",
    "term": "Capitalisation",
    "full": "Capitalisation",
    "aliases": [
      "capitalisation"
    ],
    "short": "Réinvestissement des revenus (intérêts, dividendes) pour faire croître le capital plutôt que les distribuer.",
    "sims": [
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "cagr",
    "term": "CAGR",
    "full": "Taux de croissance annuel moyen",
    "aliases": [
      "CAGR"
    ],
    "short": "Rendement annualisé moyen d'un placement sur une période, lissant les variations.",
    "sims": [
      "/simulateurs/comparateur"
    ]
  },
  {
    "slug": "fire",
    "term": "FIRE",
    "full": "Financial Independence, Retire Early",
    "aliases": [
      "FIRE"
    ],
    "short": "Mouvement visant l'indépendance financière pour pouvoir cesser de travailler bien avant l'âge de la retraite.",
    "sims": [
      "/simulateurs/fire"
    ]
  },
  {
    "slug": "swr",
    "term": "Règle des 4 %",
    "full": "Taux de retrait sûr (règle des 4 %)",
    "aliases": [
      "règle des 4 %",
      "règle des 4%",
      "SWR"
    ],
    "short": "Hypothèse selon laquelle retirer 4 % de son capital par an permet de le faire durer ~30 ans.",
    "sims": [
      "/simulateurs/fire"
    ]
  },
  {
    "slug": "taux-epargne",
    "term": "Taux d'épargne",
    "full": "Taux d'épargne",
    "aliases": [
      "taux d'épargne"
    ],
    "short": "Part de vos revenus que vous épargnez chaque mois. Levier n°1 vers l'indépendance financière.",
    "sims": [
      "/simulateurs/budget",
      "/simulateurs/fire",
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "livret-a",
    "term": "Livret A",
    "full": "Livret A",
    "aliases": [
      "Livret A"
    ],
    "short": "Livret d'épargne réglementé, sans risque, défiscalisé et disponible à tout moment.",
    "sims": [
      "/simulateurs/epargne",
      "/simulateurs/budget"
    ]
  },
  {
    "slug": "ldds",
    "term": "LDDS",
    "full": "Livret de Développement Durable et Solidaire",
    "aliases": [
      "LDDS"
    ],
    "short": "Livret réglementé proche du Livret A, défiscalisé, plafonné à 12 000 €.",
    "sims": [
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "pel",
    "term": "PEL",
    "full": "Plan d'Épargne Logement",
    "aliases": [
      "PEL"
    ],
    "short": "Épargne bloquée rémunérée ouvrant droit à un prêt immobilier à taux fixé à l'ouverture.",
    "sims": [
      "/simulateurs/emprunt-immobilier",
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "fonds-euros",
    "term": "Fonds en euros",
    "full": "Fonds en euros",
    "aliases": [
      "fonds en euros",
      "fonds euros"
    ],
    "short": "Support d'assurance-vie à capital garanti, sécurisé mais peu rémunérateur.",
    "sims": [
      "/simulateurs/assurance-vie"
    ]
  },
  {
    "slug": "unites-de-compte",
    "term": "Unités de compte",
    "full": "Unités de compte (UC)",
    "aliases": [
      "unités de compte",
      "unité de compte"
    ],
    "short": "Supports d'assurance-vie investis en actions, fonds ou immobilier : plus de potentiel, mais risque de perte.",
    "sims": [
      "/simulateurs/assurance-vie",
      "/simulateurs/comparateur"
    ]
  },
  {
    "slug": "scpi",
    "term": "SCPI",
    "full": "Société Civile de Placement Immobilier",
    "aliases": [
      "SCPI"
    ],
    "short": "« Pierre-papier » : on achète des parts d'un parc immobilier géré, pour toucher des loyers sans gestion directe.",
    "sims": [
      "/simulateurs/rendement-locatif",
      "/simulateurs/patrimoine"
    ]
  },
  {
    "slug": "dca",
    "term": "DCA",
    "full": "Dollar Cost Averaging (investissement programmé)",
    "aliases": [
      "DCA"
    ],
    "short": "Investir une somme fixe à intervalles réguliers pour lisser le prix d'achat et réduire le risque de timing.",
    "sims": [
      "/simulateurs/epargne",
      "/simulateurs/comparateur"
    ]
  },
  {
    "slug": "diversification",
    "term": "Diversification",
    "full": "Diversification",
    "aliases": [
      "diversification"
    ],
    "short": "Répartir ses placements (classes d'actifs, zones, secteurs) pour réduire le risque global.",
    "sims": [
      "/simulateurs/patrimoine",
      "/simulateurs/comparateur"
    ]
  },
  {
    "slug": "volatilite",
    "term": "Volatilité",
    "full": "Volatilité",
    "aliases": [
      "volatilité"
    ],
    "short": "Mesure de l'ampleur des variations d'un placement : plus elle est élevée, plus le risque est grand.",
    "sims": [
      "/simulateurs/comparateur"
    ]
  },
  {
    "slug": "inflation",
    "term": "Inflation",
    "full": "Inflation",
    "aliases": [
      "inflation"
    ],
    "short": "Hausse générale des prix qui érode le pouvoir d'achat de l'épargne au fil du temps.",
    "sims": [
      "/simulateurs/epargne",
      "/simulateurs/salaire"
    ]
  },
  {
    "slug": "rendement-reel",
    "term": "Rendement réel",
    "full": "Rendement réel",
    "aliases": [
      "rendement réel"
    ],
    "short": "Rendement d'un placement après déduction de l'inflation : le vrai gain de pouvoir d'achat.",
    "sims": [
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "effet-levier",
    "term": "Effet de levier",
    "full": "Effet de levier du crédit",
    "aliases": [
      "effet de levier"
    ],
    "short": "Utiliser l'emprunt pour investir plus que son apport et amplifier la rentabilité des fonds propres.",
    "sims": [
      "/simulateurs/rendement-locatif",
      "/simulateurs/emprunt-immobilier"
    ]
  },
  {
    "slug": "ifi",
    "term": "IFI",
    "full": "Impôt sur la Fortune Immobilière",
    "aliases": [
      "IFI"
    ],
    "short": "Impôt annuel sur le patrimoine immobilier net supérieur à 1,3 million d'euros.",
    "sims": [
      "/simulateurs/patrimoine"
    ]
  },
  {
    "slug": "rfr",
    "term": "RFR",
    "full": "Revenu Fiscal de Référence",
    "aliases": [
      "revenu fiscal de référence"
    ],
    "short": "Indicateur global de vos revenus utilisé pour l'accès à de nombreux dispositifs et plafonds.",
    "sims": [
      "/simulateurs/impot-revenu",
      "/simulateurs/ptz",
      "/simulateurs/cnav"
    ]
  },
  {
    "slug": "prelevement-source",
    "term": "Prélèvement à la source",
    "full": "Prélèvement à la source (PAS)",
    "aliases": [
      "prélèvement à la source"
    ],
    "short": "Collecte de l'impôt sur le revenu directement sur le salaire ou la pension, en temps réel.",
    "sims": [
      "/simulateurs/impot-revenu",
      "/simulateurs/salaire"
    ]
  },
  {
    "slug": "deficit-foncier",
    "term": "Déficit foncier",
    "full": "Déficit foncier",
    "aliases": [
      "déficit foncier"
    ],
    "short": "Excédent de charges sur les loyers, déductible du revenu global et reportable, pour réduire l'impôt.",
    "sims": [
      "/simulateurs/rendement-locatif"
    ]
  },
  {
    "slug": "usufruit",
    "term": "Usufruit",
    "full": "Usufruit",
    "aliases": [
      "usufruit"
    ],
    "short": "Droit d'utiliser un bien et d'en percevoir les revenus, sans en être pleinement propriétaire.",
    "sims": [
      "/simulateurs/patrimoine"
    ]
  },
  {
    "slug": "nue-propriete",
    "term": "Nue-propriété",
    "full": "Nue-propriété",
    "aliases": [
      "nue-propriété"
    ],
    "short": "Propriété d'un bien sans le droit d'en jouir : le nu-propriétaire récupère la pleine propriété au décès de l'usufruitier.",
    "sims": [
      "/simulateurs/patrimoine"
    ]
  },
  {
    "slug": "aspa",
    "term": "ASPA",
    "full": "Allocation de Solidarité aux Personnes Âgées",
    "aliases": [
      "ASPA"
    ],
    "short": "« Minimum vieillesse » : revenu minimal garanti aux retraités les plus modestes.",
    "sims": [
      "/simulateurs/cnav"
    ]
  },
  {
    "slug": "minimum-contributif",
    "term": "Minimum contributif",
    "full": "Minimum contributif (Mico)",
    "aliases": [
      "minimum contributif"
    ],
    "short": "Pension de base minimale pour les salariés ayant cotisé à taux plein avec de faibles revenus.",
    "sims": [
      "/simulateurs/cnav"
    ]
  },
  {
    "slug": "cumul-emploi-retraite",
    "term": "Cumul emploi-retraite",
    "full": "Cumul emploi-retraite",
    "aliases": [
      "cumul emploi-retraite"
    ],
    "short": "Possibilité de reprendre une activité rémunérée tout en percevant sa retraite.",
    "sims": [
      "/simulateurs/cnav",
      "/simulateurs/retraite-progressive"
    ]
  },
  {
    "slug": "taux-usure",
    "term": "Taux d'usure",
    "full": "Taux d'usure",
    "aliases": [
      "taux d'usure"
    ],
    "short": "TAEG maximum légal qu'un prêteur peut appliquer, révisé chaque trimestre par la Banque de France.",
    "sims": [
      "/simulateurs/emprunt-immobilier",
      "/simulateurs/credit-conso"
    ]
  },
  {
    "slug": "taux-nominal",
    "term": "Taux nominal",
    "full": "Taux nominal (taux débiteur)",
    "aliases": [
      "taux nominal",
      "taux débiteur"
    ],
    "short": "Taux d'intérêt « brut » d'un crédit, hors assurance et frais. À ne pas confondre avec le TAEG.",
    "sims": [
      "/simulateurs/emprunt-immobilier",
      "/simulateurs/credit-conso"
    ]
  },
  {
    "slug": "lean-fire",
    "term": "Lean FIRE",
    "full": "Lean FIRE",
    "aliases": [
      "Lean FIRE"
    ],
    "short": "Variante du FIRE visant l'indépendance avec un budget modeste, donc un capital cible plus faible.",
    "sims": [
      "/simulateurs/fire"
    ]
  },
  {
    "slug": "fat-fire",
    "term": "Fat FIRE",
    "full": "Fat FIRE",
    "aliases": [
      "Fat FIRE"
    ],
    "short": "Indépendance financière avec un niveau de vie confortable, donc un capital cible élevé.",
    "sims": [
      "/simulateurs/fire"
    ]
  },
  {
    "slug": "coast-fire",
    "term": "Coast FIRE",
    "full": "Coast FIRE",
    "aliases": [
      "Coast FIRE"
    ],
    "short": "Avoir déjà assez investi pour que les intérêts composés financent seuls votre retraite, sans nouvel apport.",
    "sims": [
      "/simulateurs/fire",
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "barista-fire",
    "term": "Barista FIRE",
    "full": "Barista FIRE",
    "aliases": [
      "Barista FIRE"
    ],
    "short": "Semi-retraite : un petit emploi couvre une partie des dépenses (et la mutuelle), le reste venant des placements.",
    "sims": [
      "/simulateurs/fire"
    ]
  },
  {
    "slug": "obligation",
    "term": "Obligation",
    "full": "Obligation",
    "aliases": [
      "obligation"
    ],
    "short": "Titre de dette : en prêtant à un État ou une entreprise, vous percevez des intérêts (coupons).",
    "sims": [
      "/simulateurs/comparateur",
      "/simulateurs/patrimoine"
    ]
  },
  {
    "slug": "dividende",
    "term": "Dividende",
    "full": "Dividende",
    "aliases": [
      "dividende"
    ],
    "short": "Part des bénéfices d'une entreprise versée à ses actionnaires.",
    "sims": [
      "/simulateurs/comparateur"
    ]
  },
  {
    "slug": "action",
    "term": "Action",
    "full": "Action (titre de propriété)",
    "aliases": [
      "action en bourse"
    ],
    "short": "Part de propriété d'une entreprise cotée ; potentiel de gain élevé mais volatilité importante.",
    "sims": [
      "/simulateurs/comparateur",
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "ter",
    "term": "TER",
    "full": "Total Expense Ratio (frais de gestion)",
    "aliases": [
      "TER"
    ],
    "short": "Frais de gestion annuels d'un fonds ou ETF, exprimés en %. Plus ils sont bas, mieux c'est.",
    "sims": [
      "/simulateurs/comparateur"
    ]
  },
  {
    "slug": "opcvm",
    "term": "OPCVM",
    "full": "Organisme de Placement Collectif en Valeurs Mobilières",
    "aliases": [
      "OPCVM"
    ],
    "short": "Fonds d'investissement (SICAV, FCP) regroupant l'argent de plusieurs épargnants, géré par des professionnels.",
    "sims": [
      "/simulateurs/comparateur"
    ]
  },
  {
    "slug": "cel",
    "term": "CEL",
    "full": "Compte Épargne Logement",
    "aliases": [
      "CEL"
    ],
    "short": "Épargne réglementée souple ouvrant droit à un prêt immobilier, complément du PEL.",
    "sims": [
      "/simulateurs/emprunt-immobilier",
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "lep",
    "term": "LEP",
    "full": "Livret d'Épargne Populaire",
    "aliases": [
      "LEP"
    ],
    "short": "Livret réglementé réservé aux revenus modestes, au taux supérieur au Livret A et défiscalisé.",
    "sims": [
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "micro-foncier",
    "term": "Micro-foncier",
    "full": "Régime micro-foncier",
    "aliases": [
      "micro-foncier"
    ],
    "short": "Régime fiscal simplifié des loyers (location nue) avec un abattement forfaitaire de 30 %.",
    "sims": [
      "/simulateurs/rendement-locatif"
    ]
  },
  {
    "slug": "assurance-emprunteur",
    "term": "Assurance emprunteur",
    "full": "Assurance emprunteur",
    "aliases": [
      "assurance emprunteur"
    ],
    "short": "Assurance couvrant le remboursement du prêt en cas de décès, invalidité ou incapacité.",
    "sims": [
      "/simulateurs/emprunt-immobilier"
    ]
  },
  {
    "slug": "credit-impot",
    "term": "Crédit d'impôt",
    "full": "Crédit d'impôt",
    "aliases": [
      "crédit d'impôt"
    ],
    "short": "Avantage fiscal remboursé même si vous n'êtes pas imposable (contrairement à la réduction d'impôt).",
    "sims": [
      "/simulateurs/impot-revenu"
    ]
  },
  {
    "slug": "reste-a-vivre",
    "term": "Reste à vivre",
    "full": "Reste à vivre",
    "aliases": [
      "reste à vivre"
    ],
    "short": "Ce qu'il reste chaque mois une fois les charges fixes et crédits payés.",
    "sims": [
      "/simulateurs/budget",
      "/simulateurs/emprunt-immobilier"
    ]
  },
  {
    "slug": "budget-50-30-20",
    "term": "Règle 50/30/20",
    "full": "Règle budgétaire 50/30/20",
    "aliases": [
      "règle 50/30/20",
      "50/30/20"
    ],
    "short": "Méthode de budgétisation : 50 % des revenus pour les besoins, 30 % pour les envies, 20 % pour l'épargne.",
    "sims": [
      "/simulateurs/budget"
    ]
  },
  {
    "slug": "epargne-precaution",
    "term": "Épargne de précaution",
    "full": "Épargne de précaution (fonds d'urgence)",
    "aliases": [
      "épargne de précaution",
      "fonds d'urgence",
      "matelas de sécurité"
    ],
    "short": "Réserve liquide de 3 à 6 mois de dépenses pour faire face aux imprévus sans s'endetter.",
    "sims": [
      "/simulateurs/budget",
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "budget-base-zero",
    "term": "Budget base zéro",
    "full": "Méthode du budget base zéro",
    "aliases": [
      "budget base zéro"
    ],
    "short": "Méthode où chaque euro de revenu est affecté à une dépense ou à l'épargne, jusqu'à atteindre zéro.",
    "sims": [
      "/simulateurs/budget"
    ]
  },
  {
    "slug": "retraite-progressive",
    "term": "Retraite progressive",
    "full": "Retraite progressive",
    "aliases": [
      "retraite progressive"
    ],
    "short": "Dispositif permettant de liquider une partie de sa retraite tout en continuant à travailler à temps partiel.",
    "sims": [
      "/simulateurs/agirc-arrco",
      "/simulateurs/cnav"
    ]
  },
  {
    "slug": "carriere-longue",
    "term": "Carrière longue",
    "full": "Dispositif carrière longue",
    "aliases": [
      "carrière longue",
      "départ anticipé carrière longue"
    ],
    "short": "Dispositif permettant de partir à la retraite avant l'âge légal pour les personnes ayant commencé à travailler jeunes.",
    "sims": [
      "/simulateurs/cnav",
      "/simulateurs/agirc-arrco"
    ]
  },
  {
    "slug": "reversion",
    "term": "Pension de réversion",
    "full": "Pension de réversion",
    "aliases": [
      "pension de réversion",
      "réversion"
    ],
    "short": "Fraction de la pension d'un assuré décédé reversée à son conjoint survivant, sous conditions.",
    "sims": [
      "/simulateurs/pension-reversion",
      "/simulateurs/cnav",
      "/simulateurs/agirc-arrco"
    ]
  },
  {
    "slug": "droits-derives",
    "term": "Droits dérivés",
    "full": "Droits dérivés à la retraite",
    "aliases": [
      "droits dérivés"
    ],
    "short": "Droits à la retraite acquis non pas par son propre travail, mais via le conjoint (réversion, majoration).",
    "sims": [
      "/simulateurs/cnav"
    ]
  },
  {
    "slug": "sci",
    "term": "SCI",
    "full": "Société Civile Immobilière",
    "aliases": [
      "SCI",
      "société civile immobilière"
    ],
    "short": "Structure juridique permettant à plusieurs personnes de détenir et gérer un patrimoine immobilier en commun.",
    "sims": [
      "/simulateurs/rendement-locatif"
    ]
  },
  {
    "slug": "garantie-loyers-impayes",
    "term": "GLI",
    "full": "Garantie Loyers Impayés",
    "aliases": [
      "GLI",
      "garantie loyers impayés",
      "assurance loyers impayés"
    ],
    "short": "Assurance souscrite par le bailleur couvrant les impayés de loyer et les dégradations locatives.",
    "sims": [
      "/simulateurs/rendement-locatif"
    ]
  },
  {
    "slug": "viager",
    "term": "Viager",
    "full": "Vente en viager",
    "aliases": [
      "viager",
      "vente en viager"
    ],
    "short": "Vente immobilière où l'acheteur (débirentier) verse une rente viagère au vendeur (crédirentier) jusqu'à son décès.",
    "sims": [
      "/simulateurs/rendement-locatif"
    ]
  },
  {
    "slug": "copropriete",
    "term": "Copropriété",
    "full": "Copropriété",
    "aliases": [
      "copropriété",
      "charges de copropriété"
    ],
    "short": "Régime de propriété d'un immeuble partagé entre plusieurs propriétaires, chacun détenant des tantièmes.",
    "sims": [
      "/simulateurs/emprunt-immobilier"
    ]
  },
  {
    "slug": "patrimoine-net",
    "term": "Patrimoine net",
    "full": "Patrimoine net (valeur nette)",
    "aliases": [
      "patrimoine net",
      "valeur nette",
      "net worth"
    ],
    "short": "Total de vos actifs (épargne, immobilier, placements) moins le total de vos dettes.",
    "sims": [
      "/simulateurs/patrimoine",
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "frais-gestion",
    "term": "Frais de gestion",
    "full": "Frais de gestion (TER)",
    "aliases": [
      "frais de gestion",
      "frais annuels"
    ],
    "short": "Coût annuel prélevé par un fonds ou une assurance-vie, exprimé en % des encours. Réduit mécaniquement le rendement.",
    "sims": [
      "/simulateurs/epargne",
      "/simulateurs/comparateur"
    ]
  },
  {
    "slug": "rente",
    "term": "Rente",
    "full": "Rente viagère ou financière",
    "aliases": [
      "rente",
      "rente viagère"
    ],
    "short": "Revenu périodique versé à vie (viagère) ou pour une durée déterminée, issu d'un capital converti.",
    "sims": [
      "/simulateurs/epargne",
      "/simulateurs/per"
    ]
  },
  {
    "slug": "crowdfunding",
    "term": "Crowdfunding",
    "full": "Financement participatif",
    "aliases": [
      "crowdfunding",
      "financement participatif",
      "crowdlending"
    ],
    "short": "Financement de projets (immobilier, entreprises) par une foule d'investisseurs particuliers via des plateformes en ligne.",
    "sims": [
      "/simulateurs/comparateur"
    ]
  },
  {
    "slug": "plus-value-mobiliere",
    "term": "Plus-value mobilière",
    "full": "Plus-value sur valeurs mobilières",
    "aliases": [
      "plus-value mobilière",
      "plus-values mobilières"
    ],
    "short": "Gain réalisé lors de la vente de titres (actions, ETF, obligations) soumis en principe au PFU de 30 %.",
    "sims": [
      "/simulateurs/impot-revenu"
    ]
  },
  {
    "slug": "niches-fiscales",
    "term": "Niches fiscales",
    "full": "Niches fiscales (avantages fiscaux)",
    "aliases": [
      "niches fiscales",
      "niche fiscale"
    ],
    "short": "Dispositifs légaux permettant de réduire son impôt : déductions, réductions et crédits d'impôt.",
    "sims": [
      "/simulateurs/impot-revenu",
      "/simulateurs/per"
    ]
  },
  {
    "slug": "flat-tax",
    "term": "Flat tax",
    "full": "Flat tax (Prélèvement Forfaitaire Unique)",
    "aliases": [
      "flat tax",
      "PFU"
    ],
    "short": "Imposition forfaitaire de 30 % (12,8 % IR + 17,2 % PS) sur les revenus du capital mobilier.",
    "sims": [
      "/simulateurs/impot-revenu"
    ]
  },
  {
    "slug": "numero-f",
    "term": "Nombre F",
    "full": "Nombre F (F.U. Number)",
    "aliases": [
      "nombre F",
      "F number",
      "F.U. number"
    ],
    "short": "Capital minimum permettant de ne plus dépendre d'un emploi indésirable, calculé selon la règle des 4 %.",
    "sims": [
      "/simulateurs/fire",
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "frugalisme",
    "term": "Frugalisme",
    "full": "Frugalisme",
    "aliases": [
      "frugalisme",
      "frugaliste"
    ],
    "short": "Philosophie de vie consistant à réduire volontairement ses dépenses pour accélérer l'indépendance financière.",
    "sims": [
      "/simulateurs/fire",
      "/simulateurs/budget",
      "/simulateurs/cout-en-heures"
    ]
  },
  {
    "slug": "chelo",
    "term": "CHELO",
    "full": "Coût en Heures de Liberté Obtenues",
    "aliases": [
      "CHELO",
      "coût en heures"
    ],
    "short": "Méthode qui exprime le prix d'un achat en heures de travail nécessaires pour le financer.",
    "sims": [
      "/simulateurs/cout-en-heures"
    ]
  },
  {
    "slug": "taux-remplacement",
    "term": "Taux de remplacement",
    "full": "Taux de remplacement retraite",
    "aliases": [
      "taux de remplacement",
      "taux de remplacement retraite"
    ],
    "short": "Rapport entre la première pension et le dernier salaire net. En France il oscille entre 50 % et 75 % selon la carrière.",
    "sims": [
      "/simulateurs/cnav",
      "/simulateurs/agirc-arrco",
      "/simulateurs/per"
    ]
  },
  {
    "slug": "rachat-trimestres",
    "term": "Rachat de trimestres",
    "full": "Rachat de trimestres de retraite",
    "aliases": [
      "rachat de trimestres",
      "racheter des trimestres",
      "versement pour la retraite",
      "VFR"
    ],
    "short": "Possibilité de compléter sa durée d'assurance en payant des cotisations pour des années d'études ou d'activité incomplètes.",
    "sims": [
      "/simulateurs/trimestres",
      "/simulateurs/cnav"
    ]
  },
  {
    "slug": "rente-viagere",
    "term": "Rente viagère",
    "full": "Rente viagère",
    "aliases": [
      "rente viagère",
      "rente viagere"
    ],
    "short": "Revenu régulier versé à vie par un assureur en échange d'un capital. Option de sortie des contrats PER, PERP et assurance-vie.",
    "sims": [
      "/simulateurs/rente-capital",
      "/simulateurs/per"
    ]
  },
  {
    "slug": "point-agirc",
    "term": "Point Agirc-Arrco",
    "full": "Valeur du point Agirc-Arrco",
    "aliases": [
      "valeur du point",
      "point de retraite complémentaire",
      "valeur du point Agirc-Arrco"
    ],
    "short": "Unité de compte du régime complémentaire Agirc-Arrco : vos cotisations achètent des points, chaque point vaut un montant annuel de pension.",
    "sims": [
      "/simulateurs/agirc-arrco"
    ]
  },
  {
    "slug": "retraite-supplementaire",
    "term": "Retraite supplémentaire",
    "full": "Retraite supplémentaire (Article 83, PERCO)",
    "aliases": [
      "retraite supplémentaire",
      "retraite article 83",
      "article 83"
    ],
    "short": "Épargne retraite mise en place par l'employeur (cotisation obligatoire ou volontaire), en complément des régimes légaux.",
    "sims": [
      "/simulateurs/per",
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "pension-invalidite",
    "term": "Pension d'invalidité",
    "full": "Pension d'invalidité de la Sécurité sociale",
    "aliases": [
      "pension d'invalidité",
      "invalidité"
    ],
    "short": "Revenu de remplacement versé par l'Assurance maladie lorsqu'une maladie ou un accident réduit la capacité de travail d'au moins 2/3.",
    "sims": [
      "/simulateurs/cnav"
    ]
  },
  {
    "slug": "droits-succession",
    "term": "Droits de succession",
    "full": "Droits de succession",
    "aliases": [
      "droits de succession",
      "impôt sur les successions",
      "DMTG succession"
    ],
    "short": "Impôt dû par les héritiers sur la part nette d'héritage reçue, après abattements et selon le lien de parenté avec le défunt.",
    "sims": [
      "/simulateurs/succession",
      "/simulateurs/donation"
    ]
  },
  {
    "slug": "abattement-donation",
    "term": "Abattement donation",
    "full": "Abattement sur les donations",
    "aliases": [
      "abattement donation",
      "abattement 100 000 euros",
      "franchise donation"
    ],
    "short": "Montant exonéré de droits lors d'une donation. En ligne directe : 100 000 € par parent et par enfant, renouvelable tous les 15 ans.",
    "sims": [
      "/simulateurs/donation",
      "/simulateurs/succession"
    ]
  },
  {
    "slug": "donation-partage",
    "term": "Donation-partage",
    "full": "Donation-partage",
    "aliases": [
      "donation-partage",
      "donation partage"
    ],
    "short": "Acte notarié permettant de répartir son patrimoine entre ses héritiers de son vivant, en figeant les valeurs et en prévenant les litiges.",
    "sims": [
      "/simulateurs/donation",
      "/simulateurs/succession"
    ]
  },
  {
    "slug": "reserve-hereditaire",
    "term": "Réserve héréditaire",
    "full": "Réserve héréditaire",
    "aliases": [
      "réserve héréditaire",
      "réserve légale",
      "part réservataire"
    ],
    "short": "Part du patrimoine dont le défunt ne peut pas priver ses enfants (héritiers réservataires), protégée par la loi.",
    "sims": [
      "/simulateurs/succession"
    ]
  },
  {
    "slug": "assurance-vie-transmission",
    "term": "Transmission via assurance-vie",
    "full": "Transmission du patrimoine via assurance-vie",
    "aliases": [
      "assurance-vie transmission",
      "transmission assurance-vie",
      "hors succession assurance-vie"
    ],
    "short": "L'assurance-vie est le principal outil de transmission hors succession en France : jusqu'à 152 500 € par bénéficiaire exonérés de droits.",
    "sims": [
      "/simulateurs/succession",
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "taux-moyen-imposition",
    "term": "Taux moyen d'imposition",
    "full": "Taux moyen d'imposition (TMO)",
    "aliases": [
      "taux moyen d'imposition",
      "taux effectif imposition",
      "taux moyen",
      "TMO"
    ],
    "short": "Rapport entre l'impôt total payé et le revenu imposable total. À ne pas confondre avec la Tranche Marginale d'Imposition (TMI).",
    "sims": [
      "/simulateurs/impot-revenu"
    ]
  },
  {
    "slug": "optimisation-fiscale",
    "term": "Optimisation fiscale",
    "full": "Optimisation fiscale légale",
    "aliases": [
      "optimisation fiscale",
      "défiscalisation"
    ],
    "short": "Ensemble des stratégies légales permettant de réduire sa charge fiscale en utilisant les dispositifs prévus par la loi.",
    "sims": [
      "/simulateurs/impot-revenu",
      "/simulateurs/per"
    ]
  },
  {
    "slug": "vefa",
    "term": "VEFA",
    "full": "Vente en l'État Futur d'Achèvement",
    "aliases": [
      "VEFA",
      "vente en l'état futur d'achèvement",
      "immobilier neuf sur plan"
    ],
    "short": "Contrat d'achat d'un bien immobilier neuf qui n'est pas encore construit. L'acquéreur paie progressivement selon l'avancement des travaux.",
    "sims": [
      "/simulateurs/frais-notaire",
      "/simulateurs/ptz",
      "/simulateurs/emprunt-immobilier"
    ]
  },
  {
    "slug": "dpe",
    "term": "DPE",
    "full": "Diagnostic de Performance Énergétique",
    "aliases": [
      "DPE",
      "diagnostic de performance énergétique",
      "classe énergétique"
    ],
    "short": "Document obligatoire lors de toute vente ou location, classant le logement de A (très performant) à G (passoire thermique) selon sa consommation d'énergie.",
    "sims": [
      "/simulateurs/emprunt-immobilier",
      "/simulateurs/rendement-locatif"
    ]
  },
  {
    "slug": "regime-reel-foncier",
    "term": "Régime réel foncier",
    "full": "Régime réel des revenus fonciers",
    "aliases": [
      "régime réel foncier",
      "régime réel",
      "revenus fonciers réel"
    ],
    "short": "Régime d'imposition des revenus locatifs nus permettant de déduire les charges réelles (travaux, intérêts, taxes) au lieu d'un abattement forfaitaire de 30 %.",
    "sims": [
      "/simulateurs/deficit-foncier",
      "/simulateurs/rendement-locatif"
    ]
  },
  {
    "slug": "location-meublee",
    "term": "Location meublée",
    "full": "Location meublée (LM)",
    "aliases": [
      "location meublée",
      "LMN",
      "loueur meublé non professionnel"
    ],
    "short": "Location d'un bien avec mobilier permettant d'y vivre directement. Les revenus sont imposés comme BIC, avec un abattement de 50 % en micro-BIC.",
    "sims": [
      "/simulateurs/rendement-locatif",
      "/simulateurs/deficit-foncier"
    ]
  },
  {
    "slug": "plus-value-exoneration",
    "term": "Exonération plus-value immobilière",
    "full": "Exonération de plus-value sur la résidence principale",
    "aliases": [
      "exonération plus-value",
      "plus-value résidence principale",
      "exonération résidence principale"
    ],
    "short": "La cession de la résidence principale est totalement exonérée de plus-value, quelle que soit la durée de détention.",
    "sims": [
      "/simulateurs/frais-notaire"
    ]
  },
  {
    "slug": "regle-4-pourcent",
    "term": "Règle des 4 %",
    "full": "Règle des 4 % (retraite anticipée)",
    "aliases": [
      "règle des 4 %",
      "règle des 4%",
      "4 % rule",
      "règle 4 pourcent"
    ],
    "short": "Principe selon lequel retirer 4 % de son portefeuille chaque année permet de ne jamais l'épuiser sur 30 ans, basé sur l'étude Trinity de 1998.",
    "sims": [
      "/simulateurs/fire",
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "allocation-actifs",
    "term": "Allocation d'actifs",
    "full": "Allocation d'actifs (Asset Allocation)",
    "aliases": [
      "allocation d'actifs",
      "asset allocation",
      "répartition de portefeuille"
    ],
    "short": "Répartition du portefeuille entre différentes classes d'actifs (actions, obligations, immobilier, liquidités) selon le profil de risque et l'horizon d'investissement.",
    "sims": [
      "/simulateurs/patrimoine",
      "/simulateurs/fire",
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "reequilibrage",
    "term": "Rééquilibrage",
    "full": "Rééquilibrage de portefeuille",
    "aliases": [
      "rééquilibrage",
      "rebalancing",
      "rééquilibrage de portefeuille"
    ],
    "short": "Opération consistant à ramener la répartition du portefeuille à son allocation cible, en vendant les actifs sur-pondérés et en achetant ceux sous-pondérés.",
    "sims": [
      "/simulateurs/patrimoine",
      "/simulateurs/fire"
    ]
  },
  {
    "slug": "risque-sequence",
    "term": "Risque de séquence",
    "full": "Risque de séquence des rendements",
    "aliases": [
      "risque de séquence",
      "sequence of returns risk",
      "risque séquence"
    ],
    "short": "Danger pour un rentier de subir une forte baisse des marchés en début de retraite, réduisant définitivement le capital disponible pour les décennies suivantes.",
    "sims": [
      "/simulateurs/fire",
      "/simulateurs/rente-capital"
    ]
  },
  {
    "slug": "pee",
    "term": "PEE",
    "full": "Plan d'Épargne Entreprise",
    "aliases": [
      "PEE",
      "plan d'épargne entreprise"
    ],
    "short": "Dispositif collectif d'épargne salariale proposé par l'employeur, permettant d'investir avec des avantages fiscaux et sociaux, souvent abondé.",
    "sims": [
      "/simulateurs/epargne",
      "/simulateurs/per"
    ]
  },
  {
    "slug": "perco",
    "term": "PERCO",
    "full": "Plan d'Épargne Retraite Collectif",
    "aliases": [
      "PERCO",
      "plan d'épargne retraite collectif",
      "PERCOL"
    ],
    "short": "Ancien dispositif d'épargne retraite collectif en entreprise (remplacé par le PERCOL), déblocable à la retraite en rente ou en capital.",
    "sims": [
      "/simulateurs/per",
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "abondement",
    "term": "Abondement",
    "full": "Abondement employeur",
    "aliases": [
      "abondement",
      "abondement employeur"
    ],
    "short": "Contribution de l'employeur qui vient compléter les versements du salarié sur un PEE ou PERCOL, généralement entre 50 % et 300 %.",
    "sims": [
      "/simulateurs/epargne",
      "/simulateurs/per"
    ]
  },
  {
    "slug": "interessement",
    "term": "Intéressement",
    "full": "Intéressement aux résultats de l'entreprise",
    "aliases": [
      "intéressement",
      "prime intéressement"
    ],
    "short": "Prime facultative liée aux résultats ou aux performances de l'entreprise, versée à tous les salariés et exonérée d'impôt si placée en épargne salariale.",
    "sims": [
      "/simulateurs/epargne",
      "/simulateurs/impot-revenu"
    ]
  },
  {
    "slug": "participation-entreprise",
    "term": "Participation",
    "full": "Participation aux bénéfices de l'entreprise",
    "aliases": [
      "participation",
      "participation aux bénéfices",
      "participation salariale"
    ],
    "short": "Dispositif légalement obligatoire pour les entreprises de 50+ salariés qui redistribue une partie des bénéfices aux salariés selon une formule légale.",
    "sims": [
      "/simulateurs/epargne",
      "/simulateurs/impot-revenu"
    ]
  },
  {
    "slug": "private-equity",
    "term": "Private equity",
    "full": "Capital-investissement (Private equity)",
    "aliases": [
      "private equity",
      "capital-investissement",
      "capital investissement"
    ],
    "short": "Investissement en capital dans des sociétés non cotées en bourse. Rendements potentiellement élevés, mais illiquidité et risque de perte en capital importants.",
    "sims": [
      "/simulateurs/patrimoine"
    ]
  },
  {
    "slug": "micro-entrepreneur",
    "term": "Micro-entrepreneur",
    "full": "Statut de micro-entrepreneur (auto-entrepreneur)",
    "aliases": [
      "micro-entrepreneur",
      "auto-entrepreneur",
      "auto entrepreneur",
      "micro entrepreneur"
    ],
    "short": "Statut simplifié pour exercer une activité indépendante : cotisations sociales et impôt calculés sur le chiffre d'affaires encaissé, sans comptabilité complexe.",
    "sims": [
      "/simulateurs/impot-revenu"
    ]
  },
  {
    "slug": "portage-salarial",
    "term": "Portage salarial",
    "full": "Portage salarial",
    "aliases": [
      "portage salarial"
    ],
    "short": "Statut hybride entre salarié et indépendant : une société de portage embauche le consultant, lui permettant de bénéficier de la protection du salariat.",
    "sims": [
      "/simulateurs/impot-revenu"
    ]
  },
  {
    "slug": "cpf",
    "term": "CPF",
    "full": "Compte Personnel de Formation",
    "aliases": [
      "CPF",
      "compte personnel de formation",
      "DIF",
      "compte formation"
    ],
    "short": "Droit à la formation professionnelle alimenté en euros chaque année travaillée, utilisable pour financer des formations certifiantes tout au long de la vie.",
    "sims": []
  },
  {
    "slug": "cotisation-retraite",
    "term": "Cotisation retraite",
    "full": "Cotisation de retraite obligatoire",
    "aliases": [
      "cotisation retraite",
      "cotisations retraite",
      "cotisation vieillesse"
    ],
    "short": "Prélèvement obligatoire sur les revenus du travail qui finance les pensions actuelles et constitue des droits à la retraite future.",
    "sims": [
      "/simulateurs/cnav",
      "/simulateurs/agirc-arrco"
    ]
  },
  {
    "slug": "plafond-epargne-retraite",
    "term": "Plafond épargne retraite",
    "full": "Plafond de déduction de l'épargne retraite",
    "aliases": [
      "plafond PER",
      "plafond épargne retraite",
      "plafond déduction retraite",
      "enveloppe PER"
    ],
    "short": "Montant maximum déductible du revenu imposable pour les versements sur un PER, PERP ou Madelin. En 2026 : 10 % des revenus professionnels, max 37 094 €.",
    "sims": [
      "/simulateurs/per",
      "/simulateurs/impot-revenu"
    ]
  },
  {
    "slug": "avantage-nature",
    "term": "Avantage en nature",
    "full": "Avantage en nature",
    "aliases": [
      "avantage en nature",
      "avantages en nature",
      "avantage salaire"
    ],
    "short": "Bien ou service fourni par l'employeur gratuitement ou à prix réduit (voiture de fonction, logement, repas, téléphone) et valorisé comme revenu imposable.",
    "sims": [
      "/simulateurs/impot-revenu"
    ]
  },
  {
    "slug": "revenus-passifs",
    "term": "Revenus passifs",
    "full": "Revenus passifs",
    "aliases": [
      "revenus passifs",
      "revenu passif",
      "revenus sans travailler"
    ],
    "short": "Revenus réguliers générés par des actifs (loyers, dividendes, retraits de portefeuille) sans nécessiter de travail actif quotidien.",
    "sims": [
      "/simulateurs/fire",
      "/simulateurs/epargne",
      "/simulateurs/rente-capital"
    ]
  },
  {
    "slug": "plafond-annuel-securite-sociale",
    "term": "PASS",
    "full": "Plafond Annuel de la Sécurité Sociale",
    "aliases": [
      "PASS",
      "plafond annuel de la sécurité sociale",
      "plafond sécurité sociale"
    ],
    "short": "Référence légale de la Sécurité sociale (48 060 € en 2026) qui sert de base au calcul de nombreux plafonds de cotisations et avantages sociaux.",
    "sims": [
      "/simulateurs/cnav",
      "/simulateurs/agirc-arrco",
      "/simulateurs/per"
    ]
  },
  {
    "slug": "trackers",
    "term": "Trackers (ETF)",
    "full": "Fonds indiciel coté (ETF / Tracker)",
    "aliases": [
      "trackers",
      "tracker",
      "fonds indiciel"
    ],
    "short": "Fonds d'investissement coté en bourse répliquant fidèlement un indice (CAC 40, S&P 500…), avec des frais très faibles comparés aux fonds actifs.",
    "sims": [
      "/simulateurs/patrimoine",
      "/simulateurs/fire",
      "/simulateurs/epargne"
    ]
  },
  {
    "slug": "credit-immobilier",
    "term": "Crédit immobilier",
    "full": "Crédit immobilier",
    "aliases": [
      "crédit immobilier",
      "prêt immobilier",
      "emprunt immobilier"
    ],
    "short": "Prêt bancaire à moyen ou long terme (7 à 30 ans) destiné à financer l'achat d'un bien immobilier, avec le bien en garantie.",
    "sims": [
      "/simulateurs/emprunt-immobilier",
      "/simulateurs/ptz",
      "/simulateurs/frais-notaire"
    ]
  },
  {
    "slug": "rebalancement",
    "term": "Rebalancement",
    "full": "Rebalancement de portefeuille",
    "aliases": [
      "rebalancement",
      "rééquilibrage annuel"
    ],
    "short": "Voir Rééquilibrage — opération périodique qui ramène un portefeuille à son allocation d'actifs cible après les évolutions de marché.",
    "sims": [
      "/simulateurs/patrimoine"
    ]
  },
  {
    "slug": "obligations",
    "term": "Obligations",
    "full": "Obligations (titres de créance)",
    "aliases": [
      "obligation",
      "marché obligataire",
      "fonds obligataire"
    ],
    "short": "Titres de créance émis par un État ou une entreprise : l'investisseur prête de l'argent contre un intérêt (coupon) et le remboursement à l'échéance. Classe d'actifs moins volatile que les actions.",
    "sims": [
      "/simulateurs/patrimoine",
      "/simulateurs/comparateur"
    ]
  },
  {
    "slug": "retraite-complementaire",
    "term": "Retraite complémentaire",
    "full": "Retraite complémentaire obligatoire (Agirc-Arrco, Ircantec, RCI…)",
    "aliases": [
      "retraite complémentaire",
      "régime complémentaire",
      "complémentaire retraite",
      "pension complémentaire"
    ],
    "short": "Deuxième étage obligatoire de la retraite, versé en plus de la retraite de base : Agirc-Arrco pour les salariés du privé, Ircantec pour les contractuels publics, RCI pour les indépendants.",
    "sims": [
      "/simulateurs/agirc-arrco",
      "/simulateurs/ircantec",
      "/simulateurs/synthese-retraite"
    ]
  },
  {
    "slug": "clause-beneficiaire",
    "term": "Clause bénéficiaire",
    "full": "Clause bénéficiaire d'un contrat d'assurance-vie",
    "aliases": [
      "clause bénéficiaire",
      "bénéficiaire assurance-vie",
      "désignation de bénéficiaire"
    ],
    "short": "Disposition d'un contrat d'assurance-vie qui désigne la ou les personnes recevant le capital au décès de l'assuré — la clé de la transmission hors succession.",
    "sims": [
      "/simulateurs/succession",
      "/simulateurs/assurance-vie"
    ]
  }
];

export const GLOSSARY_INDEX_BY_SLUG = Object.fromEntries(GLOSSARY_INDEX.map(t => [t.slug, t]));

// Liste plate { match, slug } triée par longueur décroissante : les expressions
// longues priment (« plus-value immobilière » avant « plus-value »).
export const TERM_MATCHERS = GLOSSARY_INDEX
  .flatMap(t => [t.term, ...(t.aliases || [])].map(m => ({ match: m, slug: t.slug })))
  .sort((a, b) => b.match.length - a.match.length);
