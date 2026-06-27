// Pages comparatives « X vs Y » : contenu éditorial ciblant des requêtes à forte
// intention (« PER ou assurance-vie », « louer ou acheter »…). Chaque page relie
// deux simulateurs et des termes du lexique, renforçant le maillage interne.
//
// Fichier de DONNÉES PURES (pas d'import React) : il est aussi consommé côté build
// (scripts/generate-static-html.mjs) et sitemap (api/sitemap.js) via api/_routes.js.
//
// Champs : slug, title (H1), shortTitle (listes), emoji, category, intro,
//   a/b { name, pour[], contre[] }, criteres[{ label, a, b }],
//   sections[{ h2, body[] }], verdict, sims[chemins], terms[slugs lexique].

export const COMPARATIFS = [
  {
    slug: 'per-vs-assurance-vie',
    title: 'PER ou assurance-vie : que choisir pour épargner ?',
    shortTitle: 'PER vs assurance-vie',
    emoji: '⚖️',
    category: 'Finances',
    intro: "PER et assurance-vie sont les deux enveloppes reines de l'épargne long terme en France. L'un défiscalise à l'entrée et bloque l'épargne jusqu'à la retraite ; l'autre reste disponible et offre une fiscalité douce après 8 ans. Comparons-les pour savoir laquelle privilégier selon votre situation.",
    a: {
      name: 'PER',
      pour: ["Déduction des versements du revenu imposable", "Idéal si votre tranche marginale (TMI) est élevée", "Sortie en capital ou en rente à la retraite"],
      contre: ["Épargne bloquée jusqu'à la retraite (sauf cas)", "Fiscalité à la sortie sur les versements déduits", "Avantage faible si TMI basse"],
    },
    b: {
      name: 'Assurance-vie',
      pour: ["Épargne disponible à tout moment", "Fiscalité avantageuse après 8 ans (abattement)", "Transmission hors succession jusqu'à 152 500 € par bénéficiaire"],
      contre: ["Pas de déduction fiscale à l'entrée", "Prélèvements sociaux de 17,2 % sur les gains", "Rendement des fonds euros en baisse"],
    },
    criteres: [
      { label: "Avantage fiscal à l'entrée", a: "Oui (déduction des versements)", b: "Non" },
      { label: "Disponibilité de l'épargne", a: "Bloquée jusqu'à la retraite", b: "Disponible à tout moment" },
      { label: "Fiscalité à la sortie", a: "Versements imposés au barème, gains au PFU", b: "Abattement annuel après 8 ans" },
      { label: "Transmission", a: "Fiscalité variable selon l'âge", b: "Cadre très favorable (152 500 €/bénéficiaire)" },
      { label: "Public idéal", a: "TMI à 30 % ou plus, horizon retraite", b: "Tous profils, projets à moyen terme" },
    ],
    sections: [
      {
        h2: "Le PER : défiscaliser aujourd'hui pour la retraite",
        body: [
          "Le Plan d'Épargne Retraite permet de déduire vos versements de votre revenu imposable. L'économie d'impôt est proportionnelle à votre tranche marginale d'imposition : plus elle est élevée, plus le PER est intéressant. En contrepartie, l'épargne est bloquée jusqu'à la retraite, hors cas de déblocage anticipé (achat de la résidence principale, accidents de la vie).",
          "À la sortie, la part correspondant aux versements déduits est réimposée. Le PER est donc surtout pertinent si vous pensez avoir une TMI plus faible à la retraite qu'aujourd'hui.",
        ],
      },
      {
        h2: "L'assurance-vie : souplesse et transmission",
        body: [
          "L'assurance-vie n'offre aucune déduction à l'entrée, mais votre épargne reste disponible et bénéficie, après 8 ans, d'un abattement annuel sur les gains (4 600 € pour une personne seule, 9 200 € pour un couple). C'est l'outil le plus polyvalent pour un projet à moyen ou long terme.",
          "Son atout majeur reste la transmission : les capitaux versés avant 70 ans sont transmis hors succession dans la limite de 152 500 € par bénéficiaire.",
        ],
      },
      {
        h2: "Faut-il choisir ?",
        body: [
          "Les deux enveloppes sont complémentaires. Une stratégie fréquente consiste à utiliser le PER pour défiscaliser quand la TMI est élevée, tout en alimentant une assurance-vie pour conserver de la souplesse et préparer la transmission.",
        ],
      },
    ],
    verdict: "Si votre TMI est élevée et que votre objectif est clairement la retraite, le PER maximise l'avantage fiscal. Pour de la souplesse, un horizon plus court ou la transmission, l'assurance-vie l'emporte. Idéalement, combinez les deux. Simulez chaque scénario ci-dessous.",
    sims: ['/simulateurs/per', '/simulateurs/assurance-vie'],
    terms: ['per', 'assurance-vie', 'tmi', 'pfu'],
  },
  {
    slug: 'louer-ou-acheter',
    title: 'Louer ou acheter sa résidence principale ?',
    shortTitle: 'Louer ou acheter',
    emoji: '🏠',
    category: 'Immobilier',
    intro: "Faut-il continuer à louer ou se lancer dans l'achat de sa résidence principale ? La réponse dépend de la durée de détention, du niveau des taux, des frais d'acquisition et du loyer que vous économisez. Voici les critères pour trancher, simulateurs à l'appui.",
    a: {
      name: 'Louer',
      pour: ["Liberté de mobilité (mutation, projet de vie)", "Aucun frais de notaire ni gros entretien", "Épargne disponible plutôt qu'immobilisée"],
      contre: ["Loyer « à fonds perdu »", "Aucune constitution de patrimoine", "Exposé aux hausses de loyer"],
    },
    b: {
      name: 'Acheter',
      pour: ["Constitution d'un patrimoine", "Stabilité et liberté d'aménagement", "Plus de loyer une fois le crédit remboursé"],
      contre: ["Frais d'acquisition élevés (7-8 % dans l'ancien)", "Coût du crédit et de l'entretien", "Moins de mobilité"],
    },
    criteres: [
      { label: "Horizon recommandé", a: "Court / incertain (< 5 ans)", b: "Long (> 7-8 ans)" },
      { label: "Coût d'entrée", a: "Dépôt de garantie", b: "Apport + frais de notaire" },
      { label: "Constitution de patrimoine", a: "Via l'épargne placée", b: "Via le remboursement du crédit" },
      { label: "Flexibilité", a: "Forte", b: "Faible" },
      { label: "Risque", a: "Hausse des loyers", b: "Baisse des prix, travaux imprévus" },
    ],
    sections: [
      {
        h2: "Le poids des frais et de la durée",
        body: [
          "Acheter implique des frais d'acquisition importants (environ 7 à 8 % du prix dans l'ancien) qu'il faut « amortir » dans le temps. En dessous de 5 à 7 ans de détention, la revente risque de ne pas couvrir ces frais : la location est alors souvent plus rationnelle.",
          "Au-delà, le remboursement du capital emprunté constitue une épargne forcée qui fait pencher la balance vers l'achat.",
        ],
      },
      {
        h2: "Le coût d'opportunité de l'apport",
        body: [
          "L'argent immobilisé dans un achat (apport, frais) aurait pu être investi ailleurs. Pour comparer honnêtement, mettez en regard le rendement potentiel de cette épargne placée avec l'économie de loyer générée par l'achat.",
        ],
      },
    ],
    verdict: "En dessous de 5 ans ou en cas d'incertitude sur votre lieu de vie, la location garde l'avantage. Pour un projet stable de long terme, l'achat construit un patrimoine et supprime le loyer à terme. Estimez votre mensualité et vos frais ci-dessous pour décider.",
    sims: ['/simulateurs/emprunt-immobilier', '/simulateurs/frais-notaire'],
    terms: ['taeg', 'ptz', 'capacite-emprunt'],
  },
  {
    slug: 'freelance-ou-salarie',
    title: 'Freelance ou salarié : quel statut rapporte le plus ?',
    shortTitle: 'Freelance vs salarié',
    emoji: '💼',
    category: 'Finances',
    intro: "Passer freelance peut augmenter le revenu net… ou pas. Tout dépend du statut (micro-entreprise, portage, société), des charges sociales et de la protection que vous recherchez. Comparons le salariat et l'indépendance pour y voir clair.",
    a: {
      name: 'Salarié',
      pour: ["Protection sociale complète (chômage, maladie)", "Revenu stable et congés payés", "Aucune gestion administrative"],
      contre: ["Revenu net plafonné par la grille", "Peu de leviers d'optimisation", "Lien de subordination"],
    },
    b: {
      name: 'Freelance',
      pour: ["Revenu net potentiellement supérieur", "Liberté d'organisation et de tarification", "Leviers d'optimisation (frais, statut)"],
      contre: ["Pas d'assurance chômage (hors portage)", "Revenu variable et impayés possibles", "Gestion administrative et comptable"],
    },
    criteres: [
      { label: "Protection sociale", a: "Complète (chômage inclus)", b: "Partielle selon le statut" },
      { label: "Stabilité du revenu", a: "Élevée", b: "Variable" },
      { label: "Revenu net à facturation égale", a: "Référence", b: "Souvent supérieur" },
      { label: "Charge administrative", a: "Nulle", b: "Réelle (déclarations, compta)" },
      { label: "Liberté", a: "Limitée", b: "Forte" },
    ],
    sections: [
      {
        h2: "Comparer à revenu équivalent",
        body: [
          "La vraie question n'est pas le chiffre d'affaires mais le net dans la poche, à protection comparable. Un freelance doit provisionner sa retraite, sa prévoyance et l'absence de chômage : ces postes réduisent l'écart apparent avec le salariat.",
          "Le statut choisi (micro-BNC, entreprise individuelle au réel, portage salarial, société) change radicalement le calcul des cotisations et de l'impôt.",
        ],
      },
      {
        h2: "Au-delà de l'argent",
        body: [
          "Le choix se joue aussi sur la tolérance au risque, le besoin de stabilité et l'envie d'autonomie. Beaucoup combinent les deux mondes via le portage salarial, qui offre le statut de salarié tout en travaillant en indépendant.",
        ],
      },
    ],
    verdict: "Le freelance peut dégager un net supérieur, mais au prix d'une protection à reconstituer et d'une charge de gestion. Comparez votre situation précise avec le simulateur freelance vs salarié ci-dessous.",
    sims: ['/simulateurs/freelance-vs-salarie', '/simulateurs/salaire'],
    terms: ['tmi', 'micro-entreprise', 'cotisations-sociales'],
  },
  {
    slug: 'pea-vs-compte-titres',
    title: 'PEA ou compte-titres : quelle enveloppe pour investir en Bourse ?',
    shortTitle: 'PEA vs compte-titres',
    emoji: '📈',
    category: 'Finances',
    intro: "PEA et compte-titres ordinaire (CTO) sont les deux grandes enveloppes pour investir en actions. L'un offre une fiscalité très avantageuse après 5 ans mais impose des restrictions ; l'autre est universel mais fiscalement moins favorable. Voici comment choisir.",
    a: {
      name: 'PEA',
      pour: ["Exonération d'impôt sur les plus-values après 5 ans (hors prélèvements sociaux)", "Idéal pour les ETF actions européennes", "Dividendes et plus-values capitalisent en franchise d'impôt"],
      contre: ["Limité à 150 000 € de versements", "Uniquement actions et ETF éligibles (Europe + certains OPCVM)", "Tout retrait avant 5 ans clôture le plan"],
    },
    b: {
      name: 'Compte-titres (CTO)',
      pour: ["Aucune limite de versement", "Accès à tous les marchés mondiaux (actions US, ETF monde, obligations, SCPI…)", "Pas de restriction sur les retraits"],
      contre: ["Plus-values taxées au PFU de 30 % chaque année (ou barème sur option)", "Dividendes soumis à l'imposition annuelle", "Aucun avantage fiscal structurel"],
    },
    criteres: [
      { label: "Plafond de versement", a: "150 000 €", b: "Illimité" },
      { label: "Fiscalité après 5 ans", a: "0 % d'impôt (+ 17,2 % PS)", b: "PFU 30 % sur chaque cession" },
      { label: "Univers d'investissement", a: "Actions UE + ETF éligibles", b: "Monde entier (actions, ETF, oblig.)" },
      { label: "Flexibilité des retraits", a: "Retrait < 5 ans = clôture du plan", b: "Libre à tout moment" },
      { label: "Public idéal", a: "Investisseur long terme sur actions EU", b: "Investisseur mondial ou gros patrimoine" },
    ],
    sections: [
      {
        h2: "Le PEA : l'enveloppe fiscale idéale pour les ETF",
        body: [
          "Après 5 ans, les retraits du PEA sont exonérés d'impôt sur le revenu. Seuls les prélèvements sociaux de 17,2 % restent dus. C'est un avantage considérable pour l'investisseur à long terme : sur 20 ans, la différence peut représenter plusieurs dizaines de milliers d'euros.",
          "Le PEA est particulièrement adapté aux ETF indiciels (MSCI World éligible, ETF Eurostoxx, CAC 40…). Attention : les ETF US (S&P 500 en USD) ne sont pas directement éligibles, mais des ETF UCITS répliquant le S&P 500 ou le MSCI World le sont.",
        ],
      },
      {
        h2: "Le CTO : la liberté sans frontière",
        body: [
          "Le compte-titres donne accès à l'ensemble des marchés mondiaux et à tous les supports (obligations, fonds, SCPI…). Il est indispensable pour investir au-delà du plafond PEA ou sur des actifs non éligibles.",
          "Sa fiscalité est moins favorable : chaque cession génère une taxation au PFU de 30 %. Mais une option pour le barème de l'IR peut être avantageuse si la tranche marginale est faible.",
        ],
      },
      {
        h2: "La stratégie combinée",
        body: [
          "La plupart des investisseurs adoptent les deux : maximiser le PEA sur des ETF monde éligibles, puis utiliser le CTO pour déborder ou accéder à d'autres actifs. Cela optimise à la fois la fiscalité et la liberté d'allocation.",
        ],
      },
    ],
    verdict: "Priorité au PEA pour tout investisseur long terme : la fiscalité après 5 ans est imbattable. Ajoutez un CTO si vous souhaitez investir au-delà du plafond ou sur des actifs non éligibles. Simulez la croissance de votre portefeuille ci-dessous.",
    sims: ['/simulateurs/epargne', '/simulateurs/comparateur'],
    terms: ['pea', 'pfu', 'etf', 'dividende'],
  },
  {
    slug: 'scpi-vs-immobilier-direct',
    title: 'SCPI ou immobilier direct : quel investissement locatif choisir ?',
    shortTitle: 'SCPI vs immobilier direct',
    emoji: '🏢',
    category: 'Immobilier',
    intro: "Investir dans la pierre peut se faire en direct (achat d'un bien, gestion locative) ou via des SCPI (Sociétés Civiles de Placement Immobilier), parfois appelées « pierre-papier ». Les deux ont des avantages bien distincts selon votre capital, votre temps et votre tolérance au risque.",
    a: {
      name: 'SCPI',
      pour: ["Zéro gestion locative (société de gestion s'en charge)", "Diversification immédiate sur des centaines d'actifs", "Accessible dès 1 000 € (parts)", "Revenus réguliers trimestriels ou mensuels"],
      contre: ["Rendement net dilué par les frais de souscription (8-12 %)", "Liquidité limitée (marché secondaire parfois lent)", "Aucun levier via crédit en direct (sauf crédit SCPI)"],
    },
    b: {
      name: 'Immobilier direct',
      pour: ["Levier du crédit immobilier (emprunt à 3-4 %)", "Plus-value à la revente potentiellement élevée", "Contrôle total : choix du bien, travaux, loyer"],
      contre: ["Concentration sur un seul actif", "Gestion chronophage (locataires, travaux, litiges)", "Ticket d'entrée élevé (frais de notaire, apport)"],
    },
    criteres: [
      { label: "Ticket d'entrée", a: "À partir de 1 000 €", b: "30 000 – 50 000 € (apport min.)" },
      { label: "Gestion", a: "Déléguée totalement", b: "À assurer soi-même ou via agence" },
      { label: "Diversification", a: "Élevée (dizaines d'actifs)", b: "Faible (un bien)" },
      { label: "Rendement brut moyen", a: "4 – 6 % (taux de distribution)", b: "3 – 7 % selon localisation" },
      { label: "Levier crédit", a: "Possible mais complexe", b: "Naturel via prêt immobilier" },
    ],
    sections: [
      {
        h2: "SCPI : la simplicité de la pierre-papier",
        body: [
          "La SCPI muturalise des dizaines ou centaines d'actifs (bureaux, commerces, logements, entrepôts) gérés par des professionnels. Le souscripteur touche des revenus trimestriels proportionnels à ses parts, sans aucune contrainte de gestion. C'est la solution idéale pour un investisseur passif ou sans apport suffisant pour l'immobilier direct.",
          "Le principal inconvénient reste les frais d'entrée élevés (8-12 % selon la SCPI), qui pèsent sur le rendement à court terme. L'horizon de placement recommandé est de 8 à 10 ans minimum.",
        ],
      },
      {
        h2: "Immobilier direct : le levier et la plus-value",
        body: [
          "L'immobilier en direct permet d'utiliser le crédit bancaire pour amplifier le rendement (effet de levier). Un apport de 20 % peut générer un rendement sur fonds propres bien supérieur au taux de distribution d'une SCPI. C'est la stratégie patrimoniale classique pour se constituer un patrimoine avec un apport modéré.",
          "La contrepartie est réelle : gestion locative, entretien, risque de vacance, concentration du risque. Faire appel à une agence réduit les contraintes mais capte 7-10 % des loyers.",
        ],
      },
    ],
    verdict: "Les SCPI conviennent à l'investisseur passif cherchant des revenus réguliers sans contrainte de gestion. L'immobilier direct maximise le levier et la plus-value pour un investisseur impliqué. Comparez le rendement locatif de votre projet immobilier avec notre simulateur.",
    sims: ['/simulateurs/rendement-locatif', '/simulateurs/emprunt-immobilier'],
    terms: ['scpi', 'rendement-locatif', 'effet-de-levier'],
  },
  {
    slug: 'fonds-euros-vs-etf',
    title: 'Fonds euros vs ETF : où placer son épargne long terme ?',
    shortTitle: 'Fonds euros vs ETF',
    emoji: '⚡',
    category: 'Finances',
    intro: "Fonds euros et ETF sont les deux grandes options pour placer son épargne dans une assurance-vie ou un PEA. L'un garantit le capital mais offre un rendement limité ; l'autre expose au risque de marché mais peut générer des performances bien supérieures sur le long terme.",
    a: {
      name: 'Fonds euros',
      pour: ["Capital garanti à 100 % (hors frais de gestion)", "Rendement régulier et prévisible", "Idéal pour l'épargne de précaution ou les horizons courts"],
      contre: ["Rendement faible (1,5 – 3 % en 2024)", "Sous-performance face à l'inflation sur le long terme", "Accès souvent conditionné à une part d'UC"],
    },
    b: {
      name: 'ETF (trackers)',
      pour: ["Performance historique supérieure sur 10 ans et plus (7-9 % annualisé pour les indices monde)", "Diversification mondiale immédiate", "Frais de gestion très bas (0,1 – 0,5 % par an)"],
      contre: ["Capital non garanti (perte possible en cas de krach)", "Volatilité à court terme", "Demande de tolérer les baisses temporaires"],
    },
    criteres: [
      { label: "Garantie du capital", a: "Oui", b: "Non (soumis au marché)" },
      { label: "Rendement moyen 10 ans", a: "1,5 – 3 % / an", b: "7 – 10 % / an (MSCI World)" },
      { label: "Risque", a: "Très faible", b: "Modéré à élevé (selon l'indice)" },
      { label: "Frais annuels", a: "0,6 – 1 % (fonds euro)", b: "0,1 – 0,5 % (ETF)" },
      { label: "Horizon idéal", a: "< 5 ans", b: "> 8 ans" },
    ],
    sections: [
      {
        h2: "Fonds euros : la sécurité avant tout",
        body: [
          "Le fonds euros garanti par l'assureur : le capital versé est protégé, les gains sont définitivement acquis chaque année (effet cliquet). C'est la solution recommandée pour une épargne que l'on peut avoir besoin dans moins de 5 ans.",
          "Depuis 2022, les rendements des fonds euros se sont améliorés (2-3 % pour les meilleurs), mais peinent à battre l'inflation sur le long terme. Le fonds euros reste une composante de sécurité, pas un moteur de croissance.",
        ],
      },
      {
        h2: "ETF : l'arme de la croissance sur le long terme",
        body: [
          "Un ETF MSCI World investi de manière régulière depuis 20 ans a délivré environ 8-9 % de rendement annualisé. En intérêts composés, c'est une multiplication par 5 ou 6 du capital. La clé est l'horizon de temps : il faut pouvoir traverser les krachs sans vendre.",
          "Dans une assurance-vie ou un PEA, les ETF profitent d'une fiscalité différée, ce qui amplifie encore les intérêts composés. Les ETF à dividendes réinvestis (capitalisant) sont particulièrement efficaces dans ce contexte.",
        ],
      },
      {
        h2: "La bonne stratégie : combiner les deux",
        body: [
          "La répartition optimale dépend de votre horizon et de votre tolérance au risque. Une règle simple : mettre en fonds euros ce dont vous pourriez avoir besoin dans 5 ans, et en ETF le reste. En approchant de la retraite, sécuriser progressivement en transférant des ETF vers le fonds euros.",
        ],
      },
    ],
    verdict: "Sur un horizon de 10 ans et plus, les ETF ont historiquement surperformé les fonds euros. Pour les projets à court terme ou les profils prudents, le fonds euros reste indispensable. Simulez la différence de croissance avec notre simulateur épargne.",
    sims: ['/simulateurs/epargne', '/simulateurs/assurance-vie'],
    terms: ['etf', 'assurance-vie', 'dividende', 'pea'],
  },
  {
    slug: 'lmnp-vs-location-nue',
    title: 'LMNP ou location nue : quel régime fiscal pour louer votre bien ?',
    shortTitle: 'LMNP vs location nue',
    emoji: '🛋️',
    category: 'Immobilier',
    intro: "Un même bien peut être loué meublé (LMNP ou LMP) ou nu (location vide). Le régime fiscal est radicalement différent : l'un permet d'amortir le bien et de réduire fortement l'imposition ; l'autre est plus simple mais fiscalement moins optimisé. Voici comment choisir.",
    a: {
      name: 'LMNP (meublé)',
      pour: ["Amortissement du bien et des meubles (réduit l'assiette imposable)", "Revenus souvent peu ou pas imposés pendant 10 à 20 ans", "Loyers plus élevés qu'en location nue (15-30 %)"],
      contre: ["Gestion plus complexe (comptabilité, déclaration BIC)", "Turnover plus élevé des locataires", "Nécessite d'équiper le logement"],
    },
    b: {
      name: 'Location nue',
      pour: ["Gestion simplifiée (micro-foncier ou régime réel)", "Baux plus longs (3 ans min.) et locataires plus stables", "Possibilité de déduire le déficit foncier (jusqu'à 10 700 €/an)"],
      contre: ["Loyers plus faibles que le meublé", "Revenus fonciers taxés au barème (+ 17,2 % PS)", "Pas d'amortissement du bien"],
    },
    criteres: [
      { label: "Imposition des revenus", a: "BIC (avec amortissements réduisant l'assiette)", b: "Revenus fonciers au barème IR + 17,2 % PS" },
      { label: "Amortissement du bien", a: "Oui (sur 25-40 ans)", b: "Non" },
      { label: "Niveau de loyer", a: "15-30 % plus élevé", b: "Référence" },
      { label: "Durée minimale du bail", a: "1 an (9 mois pour étudiant)", b: "3 ans" },
      { label: "Complexité fiscale", a: "Élevée (expert-comptable conseillé)", b: "Faible (micro-foncier possible)" },
    ],
    sections: [
      {
        h2: "LMNP : l'optimisation fiscale par l'amortissement",
        body: [
          "En LMNP au régime réel, vous pouvez amortir la valeur du bien (hors terrain) et des meubles sur leur durée de vie comptable. Résultat : le résultat BIC est souvent nul ou déficitaire pendant de nombreuses années, malgré des loyers perçus. Les impôts sur ces loyers sont donc proches de zéro pendant toute cette période.",
          "C'est la stratégie la plus efficace fiscalement pour un investisseur soumis à une TMI de 30 % ou plus. La contrepartie : nécessité de tenir une comptabilité BIC (souvent via un expert-comptable, ~300-500 €/an).",
        ],
      },
      {
        h2: "Location nue : la simplicité du régime foncier",
        body: [
          "En location nue, les loyers sont des revenus fonciers imposés au barème progressif de l'IR, auxquels s'ajoutent les prélèvements sociaux de 17,2 %. Avec un micro-foncier (revenus < 15 000 €), un abattement forfaitaire de 30 % s'applique. Au régime réel, les charges réelles et les intérêts d'emprunt sont déductibles.",
          "Un avantage spécifique : le déficit foncier (charges > loyers) peut s'imputer sur le revenu global jusqu'à 10 700 €/an, ce qui peut générer une économie d'impôt immédiate en cas de gros travaux.",
        ],
      },
    ],
    verdict: "Pour un investisseur imposé à 30 % ou plus, le LMNP au réel est presque toujours gagnant fiscalement sur 10 à 15 ans. La location nue convient mieux aux faibles revenus fonciers ou aux biens difficiles à meubler. Simulez votre rendement locatif net ci-dessous.",
    sims: ['/simulateurs/rendement-locatif', '/simulateurs/deficit-foncier'],
    terms: ['lmnp', 'rendement-locatif', 'tmi', 'deficit-foncier'],
  },
  {
    slug: 'rembourser-credit-ou-investir',
    title: 'Rembourser son crédit immobilier par anticipation ou investir le surplus ?',
    shortTitle: 'Rembourser vs investir',
    emoji: '⚖️',
    category: 'Finances',
    intro: "Vous disposez d'une épargne disponible. Faut-il l'utiliser pour rembourser par anticipation votre crédit immobilier, ou l'investir pour profiter des marchés ? La réponse dépend du taux de votre prêt, de votre horizon et de votre tolérance au risque.",
    a: {
      name: 'Rembourser par anticipation',
      pour: ["Économie certaine sur les intérêts restants", "Réduction du risque global (moins de dette)", "Libération de cash-flow mensuel plus tôt"],
      contre: ["Pénalités de remboursement anticipé (IRA, max 3 % du capital ou 6 mois d'intérêts)", "Capital immobilisé dans un actif illiquide", "Coût d'opportunité si les marchés performent mieux"],
    },
    b: {
      name: 'Investir le surplus',
      pour: ["Potentiel de rendement supérieur au taux du crédit (ETF historiquement 7-9 % /an)", "Liquidité conservée (capital disponible si besoin)", "Bénéfice des intérêts composés sur le long terme"],
      contre: ["Risque de perte en capital à court terme", "Rendement incertain (contrairement à l'économie d'intérêts)", "Nécessite de maintenir la discipline sur le long terme"],
    },
    criteres: [
      { label: "Rendement garanti", a: "Oui (= taux du crédit)", b: "Non (espéré mais incertain)" },
      { label: "Rendement attendu", a: "= Taux du crédit (2-4 %)", b: "= Rendement marché (5-9 %)" },
      { label: "Liquidité", a: "Nulle (capital remboursé)", b: "Forte (capital disponible)" },
      { label: "Risque", a: "Nul", b: "Modéré à élevé" },
      { label: "Recommandé si taux crédit", a: "> 4 % (rarement mieux ailleurs)", b: "< 3 % (marchés souvent plus rentables)" },
    ],
    sections: [
      {
        h2: "La règle mathématique",
        body: [
          "La décision rationnelle est simple : si le rendement attendu de l'investissement est supérieur au taux du crédit (net de fiscalité), l'investissement l'emporte. Historiquement, un ETF MSCI World a délivré 7-9 % par an, soit bien plus que la plupart des taux immobiliers contractés avant 2023 (1-2 %).",
          "Depuis 2022-2024, les taux immobiliers ont remonté à 3,5-4,5 %. L'équation devient plus serrée, surtout en tenant compte de la fiscalité sur les gains investis.",
        ],
      },
      {
        h2: "La dimension psychologique et pratique",
        body: [
          "Être sans dette procure une sérénité réelle qui a de la valeur. Si la perspective d'un crédit vous stresse ou si votre taux est supérieur à 4 %, rembourser est une décision raisonnable même si elle n'est pas toujours optimale mathématiquement.",
          "Attention aux indemnités de remboursement anticipé (IRA) : elles sont plafonnées légalement mais réduisent l'intérêt du remboursement partiel. Négociez-les ou orientez-vous vers des remboursements en fin d'année.",
        ],
      },
    ],
    verdict: "Pour un taux de crédit inférieur à 3 %, investir l'excédent est quasi systématiquement gagnant sur 10 ans. Pour un taux supérieur à 4 %, le remboursement anticipé devient une option sérieuse. Simulez les deux scénarios avec notre simulateur épargne.",
    sims: ['/simulateurs/epargne', '/simulateurs/emprunt-immobilier'],
    terms: ['taeg', 'effet-de-levier', 'etf'],
  },
  {
    slug: 'pel-vs-livret-a',
    title: 'PEL ou Livret A : quelle épargne réglementée choisir ?',
    shortTitle: 'PEL vs Livret A',
    emoji: '💰',
    category: 'Finances',
    intro: "PEL et Livret A sont deux produits d'épargne réglementée sûrs et sans risque. Le Livret A est le plus souple ; le PEL bloque l'épargne mais offre un taux garanti et des droits à prêt immobilier. Lequel correspond à votre projet ?",
    a: {
      name: 'PEL (Plan Épargne Logement)',
      pour: ["Taux garanti pendant toute la durée du plan (2,25 % depuis 2024)", "Droits à prêt immobilier à taux préférentiel", "Complément d'intérêts en cas de prêt PEL"],
      contre: ["Versements minimums contraignants (540 €/an, 45 €/mois)", "Épargne peu liquide (retrait = clôture du plan)", "Plafond de 61 200 €", "Plus de prime d'État depuis 2018"],
    },
    b: {
      name: 'Livret A',
      pour: ["Disponibilité totale (retrait à tout moment)", "Aucun minimum de versement", "Taux 2025 : 2,4 % (net d'impôt et de prélèvements sociaux)", "Exonéré d'impôt sur le revenu et de prélèvements sociaux"],
      contre: ["Taux révisable (peut baisser)", "Plafond de 22 950 €", "Aucun avantage spécifique au projet immobilier"],
    },
    criteres: [
      { label: "Taux 2025 (net)", a: "2,25 % brut (soumis à IR + PS si ouvert après 2011)", b: "2,4 % net (exonéré)" },
      { label: "Disponibilité", a: "Faible (retrait = clôture)", b: "Totale" },
      { label: "Plafond", a: "61 200 €", b: "22 950 €" },
      { label: "Avantage immobilier", a: "Oui (droits à prêt PEL)", b: "Non" },
      { label: "Contrainte de versement", a: "540 €/an minimum", b: "Aucune" },
    ],
    sections: [
      {
        h2: "Le Livret A : l'épargne de précaution idéale",
        body: [
          "Le Livret A est le produit d'épargne le plus souple du marché : pas de minimum, retraits immédiats, exonération totale d'impôt. Son taux est fixé par les pouvoirs publics (2,4 % en 2025) et révisé en principe deux fois par an. C'est le premier placement recommandé pour constituer une épargne de précaution (3 à 6 mois de charges).",
        ],
      },
      {
        h2: "Le PEL : intéressant si vous préparez un achat immobilier",
        body: [
          "Le PEL génère des droits à prêt immobilier à un taux fixé à la souscription. En période de taux élevés, les droits à prêt PEL (actuellement à 3,45 %) peuvent être compétitifs. Il est donc pertinent si vous prévoyez un achat immobilier dans 4 à 10 ans.",
          "Attention : les PEL ouverts depuis 2011 sont soumis à l'impôt sur le revenu et aux prélèvements sociaux. Le taux net effectif est donc inférieur à 2,25 %.",
        ],
      },
    ],
    verdict: "Le Livret A l'emporte pour l'épargne courante : taux net supérieur, disponibilité totale. Le PEL est pertinent uniquement si vous préparez un projet immobilier dans 4 à 10 ans et souhaitez sécuriser des droits à prêt. Dans le doute, priorité au Livret A.",
    sims: ['/simulateurs/epargne', '/simulateurs/emprunt-immobilier'],
    terms: ['livret-a', 'pel', 'taeg'],
  },
  {
    slug: 'assurance-vie-vs-pea',
    title: 'Assurance-vie vs PEA : quelle enveloppe privilégier pour investir ?',
    shortTitle: 'Assurance-vie vs PEA',
    emoji: '🏆',
    category: 'Finances',
    intro: "Assurance-vie et PEA sont les deux enveloppes fiscales de référence pour investir sur le long terme. Elles se complètent plus qu'elles ne s'opposent, mais leurs avantages sont distincts : l'une excelle sur la transmission et la souplesse, l'autre sur la pureté fiscale des actions.",
    a: {
      name: 'Assurance-vie',
      pour: ["Accès à tous les supports : fonds euros, ETF, SCPI, UC", "Avantage successoral unique (152 500 €/bénéficiaire hors succession)", "Disponible à tout moment (rachats partiels possibles)", "Applicable dès 8 ans : abattement annuel sur les gains (4 600 € / 9 200 €)"],
      contre: ["Frais de gestion sur UC souvent plus élevés (0,5-1 %/an en plus)", "Fiscalité à la sortie (17,2 % PS + imposition résiduelle)", "Aucun accès direct aux ETF US non UCITS"],
    },
    b: {
      name: 'PEA',
      pour: ["Fiscalité optimale après 5 ans : 0 % d'IR (+ 17,2 % PS seulement)", "Frais très bas (courtier en ligne : 0 frais de garde)", "Idéal pour l'investissement passif en ETF actions"],
      contre: ["Limité à 150 000 € de versements", "Uniquement actions et ETF éligibles", "Pas d'avantage successoral particulier", "Retrait avant 5 ans entraîne la clôture du plan"],
    },
    criteres: [
      { label: "Fiscalité après 5 ans / 8 ans", a: "Abattement + PFU réduit à 7,5 %", b: "0 % d'IR après 5 ans (+ PS 17,2 %)" },
      { label: "Univers d'investissement", a: "Universel (fonds euros, ETF, SCPI, UC)", b: "Actions UE + ETF éligibles" },
      { label: "Plafond", a: "Illimité", b: "150 000 €" },
      { label: "Avantage successoral", a: "Très fort (152 500 €/bénéficiaire)", b: "Aucun avantage spécifique" },
      { label: "Liquidité", a: "Totale (rachats partiels)", b: "Possible mais retrait < 5 ans = clôture" },
    ],
    sections: [
      {
        h2: "Quand choisir le PEA",
        body: [
          "Le PEA est l'outil le plus efficace pour investir en actions sur le long terme. Après 5 ans, les plus-values et dividendes ne sont pas imposés à l'IR, seuls les prélèvements sociaux de 17,2 % sont dus. Pour un investisseur en ETF MSCI World avec un horizon de 15 à 20 ans, le PEA permet de maximiser l'effet des intérêts composés.",
        ],
      },
      {
        h2: "Quand choisir l'assurance-vie",
        body: [
          "L'assurance-vie s'impose pour la transmission patrimoniale : les capitaux versés avant 70 ans bénéficient d'une exonération jusqu'à 152 500 € par bénéficiaire, hors succession. C'est aussi l'unique enveloppe permettant d'accéder au fonds euros (capital garanti) et aux SCPI en indirect.",
          "Au-delà du plafond PEA (150 000 €), l'assurance-vie permet de continuer à investir avec une fiscalité raisonnablement favorable (surtout après 8 ans).",
        ],
      },
      {
        h2: "La stratégie gagnante : les deux ensemble",
        body: [
          "Ouvrir un PEA tôt pour démarrer le compte à rebours des 5 ans, et placer l'excédent en assurance-vie. Une fois le plafond PEA atteint, continuer sur l'assurance-vie. Pour la transmission, concentrer les capitaux en assurance-vie en désignant ses bénéficiaires.",
        ],
      },
    ],
    verdict: "Le PEA gagne sur la pureté fiscale pour les actions. L'assurance-vie gagne sur la transmission et l'accès au fonds euros. Idéalement, utilisez les deux : PEA pour les ETF, assurance-vie pour le reste et la transmission. Simulez votre projet avec nos calculateurs.",
    sims: ['/simulateurs/assurance-vie', '/simulateurs/epargne'],
    terms: ['pea', 'assurance-vie', 'etf', 'pfu'],
  },
];

export const COMPARATIFS_BY_SLUG = Object.fromEntries(COMPARATIFS.map(c => [c.slug, c]));
