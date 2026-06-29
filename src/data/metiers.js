// Données des pages retraite par métier (/retraite/:metier)
// Structure : { slug, icon, title, subtitle, metaTitle, metaDesc, intro,
//               simulateurPath, simulateurLabel, stats[], sections[], faq[] }

export const METIERS = {

  fonctionnaire: {
    slug: 'fonctionnaire',
    icon: '🏛️',
    title: 'Retraite du fonctionnaire',
    subtitle: "Régime spécial · Fonction publique d'État, territoriale et hospitalière",
    metaTitle: 'Retraite fonctionnaire 2026 — âge, calcul, taux et pension nette',
    metaDesc: "Calculez votre pension de retraite fonctionnaire : traitement de référence, taux de liquidation, décote, surcote et RAFP. Guide complet 2026.",
    intro: "Les fonctionnaires (État, territoriale, hospitalière) bénéficient d'un régime spécial géré par le SRE ou la CNRACL. La pension est calculée sur le traitement indiciaire brut, hors primes, avec un taux maximum de 75 %.",
    simulateurPath: '/simulateurs/fonction-publique',
    simulateurLabel: 'Simulateur Retraite Fonction Publique',
    stats: [
      { label: 'Âge légal', value: '64 ans', note: '(catégorie active : 59 ans)' },
      { label: 'Taux maximum', value: '75 %', note: 'du traitement indiciaire brut' },
      { label: 'Durée requise', value: '172 trimestres', note: 'pour les nés en 1965+' },
      { label: 'Surcote', value: '+1,25 %', note: 'par trimestre supplémentaire' },
    ],
    sections: [
      {
        title: "Comment est calculée la pension d'un fonctionnaire ?",
        content: "La pension brute = Traitement indiciaire × Taux de liquidation × Coefficient de proratisation.\n\nLe taux dépend des trimestres validés rapporté à 172 (nés après 1964), plafonné à 75 %. Décote : 0,625 %/trimestre manquant. Surcote : 1,25 %/trimestre supplémentaire.\n\n**Les primes ne comptent pas** dans la pension de base — elles alimentent le RAFP.",
      },
      {
        title: 'Catégorie active vs sédentaire',
        content: "Les agents de **catégorie active** (policiers, pompiers, infirmiers hospitaliers) bénéficient d'un départ à 59 ans au lieu de 64 ans.\n\nLes agents de **catégorie sédentaire** (enseignants, administratifs) sont soumis aux mêmes règles que le régime général depuis la réforme 2023.",
      },
      {
        title: "Qu'est-ce que le RAFP ?",
        content: "Le RAFP (Retraite Additionnelle de la Fonction Publique) est un régime par points obligatoire pour tous les fonctionnaires. Il prend en compte les primes et indemnités à hauteur de 20 % du traitement brut. La pension RAFP représente quelques dizaines d'euros par mois pour une carrière complète.",
      },
    ],
    faq: [
      { q: "À quel âge un fonctionnaire peut-il partir à la retraite ?", a: "Depuis la réforme 2023, l'âge légal est progressivement relevé à 64 ans pour les agents sédentaires nés à partir de 1968. Les agents de catégorie active conservent un avantage de 5 ans : ils peuvent partir dès 59 ans." },
      { q: "Comment sont calculés les trimestres dans la fonction publique ?", a: "Un trimestre est validé par 90 jours de service effectif. Les congés maladie, maternité et formation sont généralement assimilés à des services. Les périodes de temps partiel sont comptabilisées au prorata." },
      { q: "Les enseignants sont-ils catégorie active ou sédentaire ?", a: "Les enseignants sont en catégorie sédentaire depuis 2023. Ils partent à 64 ans. En contrepartie, leurs primes (ISOE) sont intégrées dans le RAFP." },
      { q: "Puis-je cumuler pension fonctionnaire et activité privée ?", a: "Oui, dans les mêmes conditions que le régime général. Depuis 2024, une reprise d'activité après liquidation peut ouvrir droit à une seconde liquidation et donc à une surcote supplémentaire." },
      { q: "Mon conjoint a droit à quelle pension de réversion ?", a: "Le conjoint survivant d'un fonctionnaire a droit à 50 % de la pension principale, sans condition de ressources ni d'âge minimum — plus avantageux que le régime général (54 % avec plafond de ressources)." },
    ],
  },

  infirmiere: {
    slug: 'infirmiere',
    icon: '🏥',
    title: 'Retraite infirmière',
    subtitle: 'CNAV · FPH (catégorie active) · Secteur libéral (CARPIMKO)',
    metaTitle: 'Retraite infirmière 2026 — CNAV, FPH ou CARPIMKO : âge et calcul',
    metaDesc: "Guide complet pour la retraite des infirmières : hôpital public (catégorie active 59 ans), secteur libéral (CARPIMKO) ou salariat privé (CNAV). 2026.",
    intro: "La retraite d'une infirmière dépend de son statut : hospitalière publique FPH (départ à 59 ans), libérale CARPIMKO, ou salariée privée CNAV + Agirc-Arrco. Chaque régime a ses propres règles d'âge et de calcul.",
    simulateurPath: '/simulateurs/cnav',
    simulateurLabel: 'Simulateur Retraite CNAV',
    stats: [
      { label: 'FPH (publique)', value: '59 ans', note: 'catégorie active hospitalière' },
      { label: 'Secteur privé', value: '64 ans', note: 'régime général CNAV' },
      { label: 'CARPIMKO', value: '67 ans', note: 'ou 62 ans avec carrière complète' },
      { label: 'Taux remplacement', value: '~50-65 %', note: 'selon le régime et la carrière' },
    ],
    sections: [
      {
        title: 'Infirmière hospitalière (FPH) : catégorie active',
        content: "Les infirmières de l'hôpital public font partie de la **catégorie active** FPH. Elles peuvent partir dès 59 ans après 17 ans de services actifs.\n\nLa pension est calculée sur le traitement indiciaire brut (taux max 75 %). Primes et heures supplémentaires n'entrent pas dans la pension de base.",
      },
      {
        title: 'Infirmière libérale : régime CARPIMKO',
        content: "Les infirmiers libéraux cotisent à la **CARPIMKO** : retraite de base (CNAVPL) + complémentaire par points + invalidité-décès.\n\nÂge du taux plein : 67 ans ou 62 ans avec la durée complète. Le taux de remplacement est souvent inférieur à celui du régime général pour les faibles revenus.",
      },
      {
        title: 'Infirmière salariée du privé : CNAV + Agirc-Arrco',
        content: "Les infirmières en cliniques privées, EHPAD ou structures associatives cotisent au régime général (**CNAV**) et au régime complémentaire **Agirc-Arrco**. Âge légal : 64 ans. Taux de remplacement net : 55–70 % selon la carrière.",
      },
    ],
    faq: [
      { q: "À quel âge part à la retraite une infirmière à l'hôpital public ?", a: "Une infirmière FPH est classée en catégorie active. Elle peut partir dès 59 ans si elle a accompli au moins 17 ans de services actifs. Sans cette condition, elle doit attendre 64 ans." },
      { q: "Comment fonctionne la retraite CARPIMKO pour les infirmiers libéraux ?", a: "La CARPIMKO comprend un régime de base (aligné CNAVPL), une retraite complémentaire par points et une couverture invalidité. L'âge du taux plein est 67 ans ou 62 ans avec la durée requise." },
      { q: "Une infirmière peut-elle cumuler plusieurs régimes de retraite ?", a: "Oui. Si elle a exercé successivement en libéral puis en hospitalier (ou inversement), elle cumule des droits dans chaque régime, chaque caisse calculant sa pension proportionnellement aux années cotisées." },
      { q: "Les nuits et week-ends donnent-ils des avantages retraite ?", a: "Dans la FPH, les services de nuit donnent droit à des bonifications de durée d'assurance. Une nuit (21h-6h) équivaut à 1 trimestre pour 90 nuits travaillées dans certains régimes." },
    ],
  },

  enseignant: {
    slug: 'enseignant',
    icon: '📚',
    title: 'Retraite enseignant',
    subtitle: 'Éducation nationale · Catégorie sédentaire · RAFP',
    metaTitle: 'Retraite enseignant 2026 — âge, calcul de la pension et RAFP',
    metaDesc: "Simulez la retraite d'un enseignant (professeur des écoles, collège, lycée, université) : âge légal 64 ans, taux max 75 %, calcul sur l'indice brut et RAFP.",
    intro: "Les enseignants de l'Éducation nationale (professeurs des écoles, certifiés, agrégés, MCF) relèvent de la FPE en catégorie sédentaire. Ils partent à 64 ans avec un taux maximum de 75 % de leur traitement indiciaire brut.",
    simulateurPath: '/simulateurs/fonction-publique',
    simulateurLabel: 'Simulateur Retraite Fonction Publique',
    stats: [
      { label: 'Âge légal', value: '64 ans', note: 'nés après 1968 (réforme 2023)' },
      { label: 'Taux maximum', value: '75 %', note: 'du traitement indiciaire brut' },
      { label: 'Durée requise', value: '172 trimestres', note: 'pour les nés en 1965+' },
      { label: 'RAFP', value: '≈ 20–80 €/mois', note: 'selon carrière et primes' },
    ],
    sections: [
      {
        title: "Comment est calculée la pension d'un enseignant ?",
        content: "La pension est calculée sur le **traitement indiciaire brut** (indice majoré × valeur du point d'indice), sans les primes (ISOE, HSA, REP+…).\n\nFormule : Traitement brut × Taux de liquidation\nTaux = (trimestres validés / 172) × 75 %, plafonné à 75 %. Décote : 0,625 %/trimestre manquant. Surcote : 1,25 %/trimestre excédentaire.",
      },
      {
        title: "Pourquoi les primes ne comptent-elles pas ?",
        content: "**Aucune prime** (ISOE, heures supplémentaires, REP+, prime de directeur…) n'entre dans le calcul de la pension de base.\n\nEn contrepartie, une partie de ces primes est versée au **RAFP** (Retraite Additionnelle de la Fonction Publique), qui génère 20 à 80 €/mois selon le volume de primes sur 35 ans de carrière.",
      },
      {
        title: "Enseignant du privé sous contrat : quelles règles ?",
        content: "Les enseignants du privé sous contrat cotisent au **régime général CNAV** et à **Agirc-Arrco**, pas à la FPE. Ils partent à 64 ans selon les règles du régime général, avec un taux de remplacement calculé sur le salaire moyen des 25 meilleures années.",
      },
    ],
    faq: [
      { q: "À quel âge un professeur des écoles peut-il partir à la retraite ?", a: "Depuis la réforme 2023, l'âge légal est progressivement porté à 64 ans pour les enseignants nés à partir de 1968. Un départ anticipé est possible via le dispositif carrières longues pour ceux ayant commencé très tôt." },
      { q: "Un enseignant agrégé a-t-il une meilleure retraite ?", a: "Oui. L'agrégé bénéficie d'un indice de traitement plus élevé qu'un certifié, ce qui augmente mécaniquement la pension de base. En hors classe, l'indice majoré peut dépasser 900, contre ~750 pour un certifié hors classe." },
      { q: "Les années de stages et vacations comptent-elles ?", a: "Les années en tant que contractuel ou vacataire avant la titularisation peuvent être rachetées sous conditions. Les stages de fonctionnaire sont pris en compte dès lors que des cotisations ont été versées." },
      { q: "Un MCF ou professeur des universités suit-il les mêmes règles ?", a: "Oui. MCF et professeurs des universités relèvent de la FPE, catégorie sédentaire. Les règles de calcul sont identiques, mais leur traitement indiciaire de référence est généralement plus élevé qu'un enseignant du secondaire." },
      { q: "Peut-on racheter des années d'études ?", a: "Oui, jusqu'à 3 ans d'études supérieures validées par un diplôme peuvent être rachetés auprès du SRE. Le coût varie selon l'âge et le traitement au moment de la demande." },
    ],
  },

  agriculteur: {
    slug: 'agriculteur',
    icon: '🌾',
    title: 'Retraite agriculteur',
    subtitle: 'MSA · Régime des non-salariés agricoles',
    metaTitle: 'Retraite agriculteur 2026 — MSA, calcul de la pension et revalorisation',
    metaDesc: "Guide complet sur la retraite des agriculteurs exploitants et salariés agricoles : MSA, retraite complémentaire obligatoire RCO, âge légal et taux plein. 2026.",
    intro: "Les agriculteurs exploitants et salariés agricoles relèvent de la MSA (Mutualité Sociale Agricole). Le régime a été réformé pour relever les pensions des exploitants, longtemps parmi les plus faibles de France.",
    simulateurPath: '/simulateurs/msa',
    simulateurLabel: 'Simulateur Retraite MSA',
    stats: [
      { label: 'Âge légal', value: '64 ans', note: '(62 ans pour carrières longues)' },
      { label: 'Pension min. exploitant', value: '≈ 1 130 €/mois', note: 'avec carrière complète (2026)' },
      { label: 'RCO', value: 'Obligatoire', note: 'depuis 2003 pour exploitants' },
      { label: 'Durée requise', value: '172 trimestres', note: 'nés en 1965+' },
    ],
    sections: [
      {
        title: 'Le régime MSA : base et RCO',
        content: "Le régime comprend deux niveaux :\n\n1. **Retraite de base** : calculée en points à partir des revenus professionnels cotisés.\n2. **RCO (Retraite Complémentaire Obligatoire)** : régime par points créé en 2003 pour les exploitants, financé par des cotisations obligatoires.\n\nLes salariés agricoles cotisent aussi à **Agirc-Arrco** comme les salariés du privé.",
      },
      {
        title: 'Les réformes pour améliorer les petites retraites agricoles',
        content: "La loi Chassaigne (2021) a revalorisé les pensions à 85 % du SMIC net (~1 035 €/mois) pour une carrière complète.\n\nUne seconde loi a étendu ces mesures aux conjoints collaborateurs et aux aides familiaux. En 2026, la pension minimale d'un exploitant avec 40 ans de carrière avoisine **1 130 €/mois**.",
      },
      {
        title: 'Particularités des salariés agricoles',
        content: "Les salariés agricoles (ouvriers, employés de coopératives, saisonniers) suivent des règles proches du régime général :\n- Retraite de base via la MSA (équivalent CNAV)\n- Retraite complémentaire via Agirc-Arrco\n- Âge légal 64 ans\n\nLes saisonniers sous 150 heures/trimestre peuvent avoir des lacunes dans leur durée d'assurance.",
      },
    ],
    faq: [
      { q: "Un agriculteur peut-il partir avant 64 ans ?", a: "Oui, via les carrières longues (début avant 20 ans et durée cotisée suffisante), l'invalidité ou le handicap reconnu. Les exploitants ayant commencé jeunes en agriculture familiale peuvent partir à 60 ou 62 ans." },
      { q: "Comment sont calculés les points MSA pour un exploitant ?", a: "Les points de retraite de base sont calculés sur le revenu professionnel agricole. Chaque année, une cotisation sur ce revenu génère des points. Pension = nombre de points × valeur du point. La RCO fonctionne de même avec son propre barème." },
      { q: "Mon conjoint qui travaille sur l'exploitation a-t-il des droits à la retraite ?", a: "Oui. Depuis 1999, les conjoints collaborateurs s'affilient obligatoirement à la MSA. Le statut de conjoint collaborateur ne peut plus être exercé que 5 ans, après quoi le conjoint doit opter pour co-exploitant ou associé." },
      { q: "Qu'est-ce que la RCO ?", a: "La Retraite Complémentaire Obligatoire est un régime par points créé en 2003 pour relever les pensions des non-salariés agricoles. Après 40 ans de carrière, la RCO représente environ 200 à 300 €/mois selon le niveau de cotisation." },
      { q: "Les années d'aide familial avant installation comptent-elles ?", a: "Elles peuvent être prises en compte sous conditions : elles doivent avoir donné lieu à cotisations ou être rachetées. Depuis la loi Chassaigne, ces périodes anciennes sont mieux reconnues pour la revalorisation minimale." },
    ],
  },

  'medecin-liberal': {
    slug: 'medecin-liberal',
    icon: '⚕️',
    title: 'Retraite médecin libéral',
    subtitle: 'CARMF · Caisse Autonome de Retraite des Médecins de France',
    metaTitle: 'Retraite médecin libéral 2026 — CARMF, ASV et calcul de pension',
    metaDesc: "Guide complet retraite médecin libéral 2026 : CARMF (base CNAVPL, complémentaire, ASV), âge de départ, cotisations et taux de remplacement selon secteur conventionnel.",
    intro: "Les médecins libéraux cotisent à la CARMF qui gère trois régimes : la retraite de base (CNAVPL), le régime complémentaire par points, et l'Allocation Supplémentaire Vieillesse (ASV). Le taux de remplacement est de 30–45 % des revenus libéraux.",
    simulateurPath: '/simulateurs/cnavpl',
    simulateurLabel: 'Simulateur Retraite Professions Libérales',
    stats: [
      { label: 'Âge taux plein', value: '67 ans', note: 'ou 62 ans si durée complète' },
      { label: 'ASV secteur 1', value: '~800–1 500 €/mois', note: 'Assurance maladie paie 2/3' },
      { label: 'Cotisation totale', value: '~20–25 % du revenu', note: 'base + complémentaire + ASV' },
      { label: 'Taux remplacement', value: '~30–45 %', note: 'des revenus libéraux' },
    ],
    sections: [
      {
        title: "Les trois régimes de la CARMF",
        content: "1. **Retraite de base CNAVPL** : commun à toutes les professions libérales réglementées, cotisations plafonnées au PASS, calcul en annuités.\n\n2. **Régime complémentaire CARMF** : par points, cotisations proportionnelles au revenu au-delà du PASS.\n\n3. **ASV (Allocation Supplémentaire Vieillesse)** : spécifique aux médecins conventionnés, financé à parts égales médecin + Assurance maladie. C'est souvent le régime le plus avantageux.",
      },
      {
        title: "Impact du secteur conventionnel sur l'ASV",
        content: "- **Secteur 1** (tarifs opposables) : la CPAM prend en charge **2/3 des cotisations ASV** — avantage considérable.\n- **Secteur 2** (dépassements libres) : le médecin paie 100 % des cotisations ASV.\n- **Secteur 3** (non conventionné) : pas d'ASV, seulement CNAVPL + complémentaire CARMF.",
      },
      {
        title: "Préparer sa retraite en tant que médecin libéral",
        content: "Avec un taux de remplacement de 30–45 %, un PER individuel est indispensable (déductible jusqu'à 10 % des revenus nets, dans la limite de 8 PASS). Les contrats Madelin restent valables si souscrits avant 2020. L'immobilier (LMNP, SCI) et l'assurance-vie complètent utilement.",
      },
    ],
    faq: [
      { q: "Quel est l'âge de départ à la retraite pour un médecin libéral ?", a: "Le taux plein automatique est à 67 ans. Un départ est possible dès 62 ans avec 172 trimestres validés. Il n'existe pas de limite d'âge pour cesser l'activité libérale, et beaucoup de médecins poursuivent au-delà de 65 ans." },
      { q: "Comment fonctionne l'ASV pour les médecins ?", a: "L'ASV est un régime financé par le médecin ET par l'Assurance maladie. En secteur 1, la CPAM prend en charge 2/3 des cotisations, ce qui en fait un avantage majeur. Un généraliste secteur 1 avec carrière complète peut recevoir 800 à 1 200 €/mois d'ASV." },
      { q: "Un médecin peut-il cumuler retraite et exercice libéral ?", a: "Oui. Depuis 2023, le cumul est libéralisé : on peut continuer à exercer après liquidation de la retraite, et les cotisations versées après 67 ans peuvent ouvrir de nouveaux droits à pension." },
      { q: "Quelle est la différence entre CARMF et CNAVPL ?", a: "La CNAVPL gère la retraite de base de toutes les professions libérales. La CARMF est la caisse spécifique aux médecins, qui gère leur régime complémentaire et l'ASV. Les deux régimes se cumulent pour former la pension totale." },
    ],
  },

  avocat: {
    slug: 'avocat',
    icon: '⚖️',
    title: 'Retraite avocat',
    subtitle: 'CNBF · Caisse Nationale des Barreaux Français',
    metaTitle: 'Retraite avocat 2026 — CNBF, calcul de la pension et cotisations',
    metaDesc: "Guide retraite avocat 2026 : CNBF (part forfaitaire + proportionnelle + complémentaire par points), âge légal 65 ans, cotisations et taux de remplacement.",
    intro: "Les avocats disposent d'un régime autonome géré par la CNBF (Caisse Nationale des Barreaux Français) : retraite de base (forfaitaire + proportionnelle) et régime complémentaire par points. L'âge légal de départ est 65 ans.",
    simulateurPath: '/simulateurs/independants',
    simulateurLabel: 'Simulateur Retraite Indépendants',
    stats: [
      { label: 'Âge légal', value: '65 ans', note: 'taux plein automatique' },
      { label: 'Retraite de base max.', value: '≈ 1 400 €/mois', note: 'part forfaitaire + proportionnelle' },
      { label: 'Complémentaire', value: 'Variable', note: 'selon points accumulés' },
      { label: 'Cotisation base', value: 'Forfaitaire + %', note: 'sur revenus au-delà du seuil' },
    ],
    sections: [
      {
        title: 'La retraite de base CNBF : deux parts',
        content: "La retraite de base CNBF comprend :\n\n1. **Part forfaitaire** : montant fixe par année de cotisation, indépendant du niveau de revenus — assure un plancher pour les avocats à faibles revenus.\n2. **Part proportionnelle** : calculée sur les revenus professionnels dans la limite d'un plafond CNBF. Les deux parts se cumulent pour former la retraite de base.",
      },
      {
        title: 'Le régime complémentaire CNBF',
        content: "Régime par points : les cotisations annuelles achètent des points, multipliés à la retraite par la valeur du point CNBF. Un avocat avec 30 ans de carrière et des revenus confortables peut espérer 800 à 1 500 €/mois de complémentaire.",
      },
      {
        title: 'Avocats salariés et collaborateurs libéraux',
        content: "Les **avocats salariés** (cabinet ou entreprise) cotisent à la CNBF + CNAV + Agirc-Arrco — ils cumulent des droits dans plusieurs régimes.\n\nLes **collaborateurs libéraux** sont non-salariés : ils cotisent uniquement à la CNBF selon les règles indépendantes.",
      },
    ],
    faq: [
      { q: "À quel âge un avocat peut-il partir à la retraite ?", a: "L'âge légal CNBF est 65 ans avec taux plein automatique. Un départ anticipé est possible avec décote. Contrairement au régime général, il n'existe pas de dispositif carrières longues permettant de partir à 58–62 ans." },
      { q: "Un avocat peut-il cumuler retraite et continuer à plaider ?", a: "Oui. Le cumul emploi-retraite est possible. L'avocat peut liquider sa retraite CNBF tout en continuant à exercer." },
      { q: "Comment sont calculées les cotisations à la CNBF ?", a: "Une cotisation forfaitaire de base (même montant pour tous) + une cotisation proportionnelle aux revenus au-delà d'un seuil. Le taux global est d'environ 14 % des revenus dans la tranche concernée." },
      { q: "La CNBF couvre-t-elle l'invalidité et le décès ?", a: "Oui. La CNBF gère un régime de prévoyance distinct : incapacité de travail, invalidité permanente et décès/réversion. Des contrats Madelin complémentaires peuvent renforcer cette couverture." },
    ],
  },

  artisan: {
    slug: 'artisan',
    icon: '🔨',
    title: 'Retraite artisan',
    subtitle: 'SSI · Sécurité Sociale des Indépendants (ex-RSI)',
    metaTitle: 'Retraite artisan 2026 — SSI, RCI et validation des trimestres',
    metaDesc: "Calculez la retraite d'un artisan : régime de base SSI, complémentaire RCI, âge légal 64 ans, validation des trimestres sur revenu. Guide 2026.",
    intro: "Les artisans (boulangers, plombiers, menuisiers, coiffeurs…) cotisent à la SSI (ex-RSI). Le régime comprend une retraite de base SSI et une complémentaire RCI par points. Les trimestres sont validés selon le revenu annuel.",
    simulateurPath: '/simulateurs/independants',
    simulateurLabel: 'Simulateur Retraite Indépendants',
    stats: [
      { label: 'Âge légal', value: '64 ans', note: 'réforme 2023' },
      { label: 'Durée requise', value: '172 trimestres', note: 'nés en 1965+' },
      { label: 'Taux plein', value: '50 %', note: 'du revenu annuel moyen' },
      { label: 'Pension moyenne', value: '~900 €/mois', note: 'artisan avec carrière complète' },
    ],
    sections: [
      {
        title: "Comment valider des trimestres en tant qu'artisan ?",
        content: "Pour valider 4 trimestres dans une année, un artisan doit percevoir un revenu d'au moins **600 fois le SMIC horaire** (~6 500 € en 2026). Ce seuil est bien inférieur au CA réel.\n\nEn dessous du seuil, les trimestres sont proratisés (1 trimestre pour 150 × SMIC horaire).",
      },
      {
        title: 'La retraite complémentaire RCI des artisans',
        content: "La **RCI (Retraite Complémentaire des Indépendants)** est le régime par points des artisans et commerçants. Les cotisations annuelles génèrent des points multipliés par la valeur du point RCI. Un artisan avec 40 ans de carrière à revenu moyen peut espérer 800 à 1 100 €/mois au total.",
      },
      {
        title: "Dispositifs pour améliorer sa retraite",
        content: "Face à un taux de remplacement souvent inférieur à 50 %, les artisans peuvent souscrire un **PER individuel** (déductible des BIC jusqu'à 10 % du revenu professionnel), investir dans l'immobilier (LMNP), ou optimiser la cession de leur fonds de commerce.",
      },
    ],
    faq: [
      { q: "Un artisan auto-entrepreneur a-t-il les mêmes droits retraite ?", a: "Non. Un auto-entrepreneur artisan cotise au SSI sur son CA (pas sur le revenu net). Les cotisations retraite représentent ~12 % du CA pour la base et ~7 % pour la complémentaire. La pension générée est faible si le CA est réduit." },
      { q: "Peut-on racheter des trimestres en tant qu'artisan ?", a: "Oui. Il est possible de racheter des cotisations pour des années incomplètes ou d'effectuer un versement pour la retraite (VFR). Le coût dépend de l'âge au moment du rachat et du revenu de référence." },
      { q: "Comment fonctionne la retraite si j'ai été artisan et salarié ?", a: "Les droits s'accumulent dans chaque régime : SSI + RCI côté artisan, CNAV + Agirc-Arrco côté salarié. Chaque caisse verse sa part de pension indépendamment." },
      { q: "Quand faut-il demander sa retraite d'artisan ?", a: "La demande doit être faite auprès de la SSI au moins 4 mois avant la date souhaitée — idéalement 6 mois avant pour vérifier et corriger les droits. La liquidation ne se fait pas automatiquement à l'âge légal." },
    ],
  },

  commercant: {
    slug: 'commercant',
    icon: '🏪',
    title: 'Retraite commerçant',
    subtitle: 'SSI · Sécurité Sociale des Indépendants (ex-RSI)',
    metaTitle: 'Retraite commerçant 2026 — SSI, RCI et calcul de pension',
    metaDesc: "Guide retraite commerçant 2026 : régime SSI ex-RSI, complémentaire RCI, validation des trimestres, départ à 64 ans. Calcul et stratégie d'épargne.",
    intro: "Les commerçants relèvent de la SSI au même titre que les artisans. Le régime de retraite est identique : base SSI et complémentaire RCI. L'âge légal de départ est 64 ans depuis la réforme 2023.",
    simulateurPath: '/simulateurs/independants',
    simulateurLabel: 'Simulateur Retraite Indépendants',
    stats: [
      { label: 'Âge légal', value: '64 ans', note: 'réforme 2023 (loi Borne)' },
      { label: 'Durée requise', value: '172 trimestres', note: 'génération 1965+' },
      { label: 'Taux de base', value: '50 %', note: 'du revenu annuel moyen (25 meilleures années)' },
      { label: 'Pension moyenne', value: '~850–1 200 €/mois', note: 'base + RCI, carrière complète' },
    ],
    sections: [
      {
        title: 'Régime de retraite des commerçants : base SSI et RCI',
        content: "**Retraite de base SSI** : calculée sur le revenu professionnel annuel moyen des 25 meilleures années, dans la limite du PASS. Formule identique au régime général : revenu moyen × taux × (trimestres validés / trimestres requis).\n\n**RCI (Retraite Complémentaire des Indépendants)** : régime par points, cotisations proportionnelles aux revenus.",
      },
      {
        title: 'Spécificités : cession du fonds de commerce',
        content: "La **cession du fonds de commerce** est souvent l'actif retraite principal du commerçant. Le produit de la vente peut être réinvesti dans un PER (déductible fiscalement, si non encore à la retraite). Les exonérations de plus-value pour petites entreprises (art. 151 septies CGI) peuvent s'appliquer.",
      },
      {
        title: 'Commerçant avec employés : épargne salariale',
        content: "Un commerçant qui se verse une rémunération de gérant peut accéder à l'épargne salariale d'entreprise (PEE, PERCO). L'abondement patronal permet d'augmenter l'effort d'épargne net d'impôt et de charges — particulièrement efficace en SARL à IS.",
      },
    ],
    faq: [
      { q: "La retraite d'un commerçant est-elle différente de celle d'un artisan ?", a: "Non. Artisans et commerçants cotisent tous à la SSI et à la RCI selon les mêmes barèmes. La différence tient à la nature de l'activité déclarée au guichet des formalités, pas au régime de retraite." },
      { q: "Un gérant de SARL commerçant est-il TNS ou assimilé-salarié ?", a: "Un gérant majoritaire (> 50 % des parts) est TNS et cotise à la SSI. Un gérant minoritaire ou égalitaire est assimilé-salarié et cotise au régime général CNAV + Agirc-Arrco." },
      { q: "Comment la retraite est-elle calculée si mon revenu fluctue beaucoup ?", a: "La base SSI est calculée sur les 25 meilleures années de revenus (dans la limite du PASS). Les années à faibles revenus ne pèsent pas si vous avez plus de 25 années cotisées. Les forts revenus sont plafonnés au PASS (46 368 € en 2026)." },
      { q: "Quel est le montant moyen de retraite pour un commerçant ?", a: "Entre 850 et 1 200 €/mois au total (base + RCI) pour une carrière complète, selon les revenus. Ce montant souligne l'importance d'une épargne retraite complémentaire dès le début de l'activité." },
    ],
  },

  pharmacien: {
    slug: 'pharmacien',
    icon: '💊',
    title: 'Retraite pharmacien',
    subtitle: "CAVP · Caisse d'Assurance Vieillesse des Pharmaciens",
    metaTitle: 'Retraite pharmacien libéral 2026 — CAVP, calcul et âge de départ',
    metaDesc: "Guide retraite pharmacien libéral 2026 : CAVP (base CNAVPL + complémentaire par points), âge 67 ans ou 62 ans avec durée complète, cotisations et taux de remplacement.",
    intro: "Les pharmaciens titulaires d'officine cotisent à la CAVP (Caisse d'Assurance Vieillesse des Pharmaciens). La retraite comprend un régime de base CNAVPL et un régime complémentaire CAVP par points. Le taux de remplacement est de 30–40 % des revenus libéraux.",
    simulateurPath: '/simulateurs/cnavpl',
    simulateurLabel: 'Simulateur Retraite Professions Libérales',
    stats: [
      { label: 'Âge taux plein', value: '67 ans', note: 'ou 62 ans avec durée complète' },
      { label: 'Régime de base', value: 'CNAVPL', note: 'commun aux professions libérales' },
      { label: 'Complémentaire', value: 'CAVP points', note: 'spécifique aux pharmaciens' },
      { label: 'Taux remplacement', value: '~30–40 %', note: 'selon revenus et durée' },
    ],
    sections: [
      {
        title: 'CNAVPL et CAVP : les deux étages',
        content: "**CNAVPL (base)** : commun à toutes les professions libérales. Cotisations plafonnées au PASS, calcul en annuités sur les meilleures années de revenus.\n\n**CAVP (complémentaire)** : régime par points. Les cotisations annuelles achètent des points. Pension = total de points × valeur du point CAVP. Cotisations proportionnelles aux revenus, sans plafonnement strict.",
      },
      {
        title: 'Pharmaciens salariés adjoints',
        content: "Les pharmaciens adjoints salariés cotisent au **régime général CNAV** et à **Agirc-Arrco** — pas à la CAVP. Leur taux de remplacement est généralement meilleur mais leurs revenus bruts souvent inférieurs à ceux d'un titulaire.\n\nUn pharmacien ayant commencé comme adjoint avant de reprendre une officine cumule des droits dans les deux régimes.",
      },
      {
        title: "Stratégies d'épargne retraite pour les pharmaciens",
        content: "Le fonds de commerce de l'officine constitue souvent le principal actif retraite — une cession bien préparée peut générer plusieurs centaines de milliers d'euros (exonérations art. 151 septies CGI). Le PER individuel (déductible des BNC) et l'immobilier professionnel complètent utilement.",
      },
    ],
    faq: [
      { q: "À quel âge un pharmacien titulaire peut-il partir à la retraite ?", a: "Le taux plein automatique est à 67 ans. Un départ est possible dès 62 ans avec 172 trimestres validés. Des décotes s'appliquent en cas de départ anticipé." },
      { q: "Que se passe-t-il si un pharmacien cède son officine avant la retraite ?", a: "La plus-value peut bénéficier d'exonérations (art. 151 septies CGI selon le prix de cession). Le produit peut être placé sur un PER avant la liquidation de la retraite pour déduire fiscalement." },
      { q: "Un pharmacien peut-il cotiser volontairement plus à la CAVP ?", a: "Oui. La CAVP propose des rachats de points pour années de faibles revenus ou études. Il est aussi possible de cotiser au-delà du minimum obligatoire pour améliorer la pension complémentaire." },
      { q: "La pension de réversion s'applique-t-elle à la CAVP ?", a: "Oui. En cas de décès, le conjoint survivant a droit à une pension de réversion. Les conditions varient selon le régime. La CNAVPL prévoit une réversion à 54 % de la pension de base sous conditions de ressources." },
    ],
  },

  'chirurgien-dentiste': {
    slug: 'chirurgien-dentiste',
    icon: '🦷',
    title: 'Retraite chirurgien-dentiste',
    subtitle: 'CARCDSF · Caisse Autonome de Retraite des Chirurgiens-Dentistes et des Sages-Femmes',
    metaTitle: 'Retraite dentiste libéral 2026 — CARCDSF, calcul et âge de départ',
    metaDesc: "Guide retraite chirurgien-dentiste 2026 : CARCDSF (base CNAVPL + complémentaire par points), âge 67 ans ou 62 ans, cotisations, taux de remplacement et cession de cabinet.",
    intro: "Les chirurgiens-dentistes libéraux cotisent à la CARCDSF pour leur complémentaire et à la CNAVPL pour la retraite de base. L'âge du taux plein est 67 ans, ou 62 ans avec la durée d'assurance complète.",
    simulateurPath: '/simulateurs/cnavpl',
    simulateurLabel: 'Simulateur Retraite Professions Libérales',
    stats: [
      { label: 'Âge taux plein', value: '67 ans', note: 'ou 62 ans avec durée requise' },
      { label: 'Régime de base', value: 'CNAVPL', note: 'commun professions libérales' },
      { label: 'Complémentaire', value: 'CARCDSF', note: 'régime par points' },
      { label: 'Taux remplacement', value: '~25–40 %', note: 'selon revenus et carrière' },
    ],
    sections: [
      {
        title: 'Structure de la retraite des dentistes libéraux',
        content: "**CNAVPL (base)** : commun à toutes les professions libérales, cotisations plafonnées au PASS, calcul en annuités.\n\n**CARCDSF (complémentaire)** : régime par points. Les cotisations proportionnelles aux BNC génèrent des points dont la valeur est revalorisée chaque année.",
      },
      {
        title: 'Impact du niveau de revenus sur la pension',
        content: "Les dentistes libéraux ont un revenu moyen de ~130 000 €/an. Pourtant, leur taux de remplacement reste faible (25–40 %) car les régimes libéraux sont moins généreux que le régime général pour les hauts revenus.\n\nUn PER individuel alimenté tout au long de la carrière est indispensable pour viser 3 000–4 000 €/mois net à la retraite.",
      },
      {
        title: 'Transmission du cabinet et retraite',
        content: "Pour beaucoup de dentistes, la **cession du cabinet** est le principal actif retraite (400 000 à 1 000 000 € selon localisation et CA). La cession peut bénéficier d'exonérations fiscales (art. 151 septies et 238 quindecies CGI). Il est conseillé de préparer la cession 3–5 ans à l'avance.",
      },
    ],
    faq: [
      { q: "Un dentiste salarié a-t-il le même régime de retraite ?", a: "Non. Un dentiste salarié (centre de santé, clinique, hôpital) cotise au régime général CNAV et à Agirc-Arrco, pas à la CARCDSF. Son taux de remplacement est généralement meilleur mais ses revenus bruts souvent inférieurs." },
      { q: "Peut-on racheter des trimestres à la CARCDSF ?", a: "Oui. Des rachats de points ou de cotisations sont possibles pour certaines périodes (études, début de carrière à faibles revenus). Le coût dépend de l'âge et du niveau de cotisation choisi." },
      { q: "Qu'est-ce que la CARCDSF couvre en dehors de la retraite ?", a: "La CARCDSF propose aussi un régime de prévoyance : incapacité de travail, invalidité permanente et décès. Des contrats Madelin complémentaires peuvent renforcer cette couverture." },
      { q: "Quel est le montant moyen de retraite pour un dentiste libéral ?", a: "Avec une carrière libérale complète (35–40 ans), un dentiste peut espérer 2 500 à 4 000 €/mois brut (CNAVPL + CARCDSF), selon ses revenus et cotisations — soit moins de 40 % du revenu moyen de la profession." },
    ],
  },


  'sage-femme': {
    slug: 'sage-femme',
    icon: '👶',
    title: 'Retraite sage-femme',
    subtitle: 'CARCDSF · Libéral / FPH (catégorie active)',
    metaTitle: 'Retraite sage-femme 2026 — CARCDSF, FPH et calcul de pension',
    metaDesc: "Guide retraite sage-femme 2026 : libérale (CARCDSF), hospitalière publique FPH (catégorie active 59 ans) ou salariée privée. Âge, cotisations et taux de remplacement.",
    intro: "La retraite d'une sage-femme dépend de son statut : libérale (CARCDSF), hospitalière publique FPH classée en catégorie active (départ à 59 ans), ou salariée du privé (CNAV + Agirc-Arrco). Chaque régime a ses propres règles.",
    simulateurPath: '/simulateurs/cnavpl',
    simulateurLabel: 'Simulateur Retraite Professions Libérales',
    stats: [
      { label: 'FPH (publique)', value: '59 ans', note: 'catégorie active hospitalière' },
      { label: 'Libérale CARCDSF', value: '67 ans', note: 'ou 62 ans avec durée complète' },
      { label: 'Secteur privé', value: '64 ans', note: 'CNAV + Agirc-Arrco' },
      { label: 'Taux remplacement', value: '~40–65 %', note: 'selon statut et carrière' },
    ],
    sections: [
      {
        title: 'Sage-femme hospitalière : catégorie active FPH',
        content: "Les sages-femmes de l'hôpital public sont classées en **catégorie active** de la FPH. Elles peuvent partir dès **59 ans** après 17 ans de services actifs, contre 64 ans pour la catégorie sédentaire.\n\nLa pension est calculée sur le traitement indiciaire brut (taux max 75 %). Les gardes et nuits génèrent des bonifications de durée d'assurance.",
      },
      {
        title: 'Sage-femme libérale : régime CARCDSF',
        content: "Les sages-femmes libérales cotisent à la **CARCDSF** (Caisse Autonome de Retraite des Chirurgiens-Dentistes et des Sages-Femmes). Elle comprend :\n- Retraite de base CNAVPL\n- Régime complémentaire par points CARCDSF\n- Régime de prévoyance\n\nL'âge du taux plein est 67 ans ou 62 ans avec la durée complète.",
      },
      {
        title: 'Cumul de régimes possible',
        content: "Une sage-femme ayant exercé successivement à l'hôpital public puis en libéral (ou inversement) cumule des droits dans chaque régime. Chaque caisse calcule sa pension proportionnellement aux années cotisées. Ce cumul est courant dans la profession.",
      },
    ],
    faq: [
      { q: "À quel âge part à la retraite une sage-femme hospitalière ?", a: "Une sage-femme FPH est classée en catégorie active. Elle peut partir dès 59 ans avec au moins 17 ans de services actifs. Sans cette condition, l'âge légal est 64 ans." },
      { q: "Comment fonctionne la CARCDSF pour les sages-femmes libérales ?", a: "La CARCDSF gère la retraite complémentaire par points des sages-femmes libérales (et des dentistes). Les cotisations proportionnelles aux revenus BNC génèrent des points. L'âge du taux plein est 67 ans ou 62 ans avec la durée requise." },
      { q: "Les gardes et nuits donnent-ils des avantages retraite à la FPH ?", a: "Oui. Dans la FPH, les services de nuit et les gardes donnent droit à des bonifications de durée d'assurance. Ces avantages contribuent à atteindre plus vite la durée requise pour la catégorie active." },
      { q: "Une sage-femme peut-elle accumuler des droits dans plusieurs régimes ?", a: "Oui. Si elle a exercé en libéral et à l'hôpital public, elle cumule des droits à la CARCDSF et à la FPH. Chaque caisse verse sa pension au moment de la liquidation." },
    ],
  },

  veterinaire: {
    slug: 'veterinaire',
    icon: '🐾',
    title: 'Retraite vétérinaire',
    subtitle: 'CARPV · Caisse Autonome de Retraite et de Prévoyance des Vétérinaires',
    metaTitle: 'Retraite vétérinaire libéral 2026 — CARPV, calcul et âge de départ',
    metaDesc: "Guide retraite vétérinaire libéral 2026 : CARPV (base CNAVPL + complémentaire par points), âge 67 ans ou 62 ans, cotisations sur revenus BNC et taux de remplacement.",
    intro: "Les vétérinaires libéraux cotisent à la CARPV (Caisse Autonome de Retraite et de Prévoyance des Vétérinaires) pour leur complémentaire, et à la CNAVPL pour la retraite de base. L'âge du taux plein est 67 ans, ou 62 ans avec la durée d'assurance requise.",
    simulateurPath: '/simulateurs/cnavpl',
    simulateurLabel: 'Simulateur Retraite Professions Libérales',
    stats: [
      { label: 'Âge taux plein', value: '67 ans', note: 'ou 62 ans avec durée requise' },
      { label: 'Régime de base', value: 'CNAVPL', note: 'commun professions libérales' },
      { label: 'Complémentaire', value: 'CARPV', note: 'régime par points' },
      { label: 'Taux remplacement', value: '~30–45 %', note: 'selon revenus et durée' },
    ],
    sections: [
      {
        title: 'Les deux régimes de retraite des vétérinaires libéraux',
        content: "**CNAVPL (base)** : commun à toutes les professions libérales réglementées. Cotisations plafonnées au PASS, calcul en annuités sur les meilleures années de revenus.\n\n**CARPV (complémentaire)** : régime par points propre aux vétérinaires. Les cotisations proportionnelles aux BNC génèrent des points dont la valeur de service est fixée chaque année par le conseil d'administration de la CARPV.",
      },
      {
        title: 'Vétérinaires salariés et fonctionnaires',
        content: "Un vétérinaire salarié (clinique, grande distribution, agroalimentaire) cotise au régime général CNAV et à Agirc-Arrco — pas à la CARPV. Les vétérinaires fonctionnaires (armée, agriculture, inspection sanitaire) relèvent de la Fonction Publique d'État.\n\nUn vétérinaire ayant cumulé statuts salarié et libéral dispose de droits dans plusieurs régimes.",
      },
      {
        title: "Préparer sa retraite : clinique et épargne personnelle",
        content: "La **cession de la clinique vétérinaire** constitue souvent le premier actif retraite. Elle peut bénéficier d'exonérations de plus-value (art. 151 septies CGI). Un PER individuel alimenté régulièrement (déductible des BNC) complète la CARPV pour maintenir le niveau de vie à la retraite.",
      },
    ],
    faq: [
      { q: "À quel âge un vétérinaire libéral peut-il partir à la retraite ?", a: "Le taux plein automatique est à 67 ans. Un départ est possible dès 62 ans avec 172 trimestres validés (génération 1965+). Des décotes s'appliquent pour un départ avant le taux plein." },
      { q: "Comment sont calculées les cotisations à la CARPV ?", a: "Les cotisations CARPV sont proportionnelles aux revenus professionnels BNC, avec un taux fixé chaque année. Il existe une cotisation forfaitaire minimale pour les débuts de carrière à faibles revenus. Les cotisations sont déductibles des BNC." },
      { q: "Que couvre la CARPV en dehors de la retraite ?", a: "La CARPV propose un régime de prévoyance : incapacité temporaire de travail, invalidité permanente et décès. Ces garanties sont essentielles pour un vétérinaire libéral dont l'activité physique peut être exposée à des risques." },
      { q: "Un vétérinaire peut-il cumuler retraite et activité libérale ?", a: "Oui. Le cumul emploi-retraite est possible dans les mêmes conditions que pour les autres professions libérales. L'activité peut être maintenue à temps partiel après liquidation de la retraite CARPV et CNAVPL." },
    ],
  },

  notaire: {
    slug: 'notaire',
    icon: '📜',
    title: 'Retraite notaire',
    subtitle: 'CRPCEN · Caisse de Retraite et de Prévoyance des Clercs et Employés de Notaires',
    metaTitle: 'Retraite notaire 2026 — CRPCEN, calcul et âge de départ',
    metaDesc: "Guide retraite notaire 2026 : CRPCEN pour clercs et salariés notariaux, régime autonome du notariat, retraite de base et complémentaire, âge légal et cotisations.",
    intro: "Le notariat dispose d'un régime de retraite autonome géré par la CRPCEN (Caisse de Retraite et de Prévoyance des Clercs et Employés de Notaires). Ce régime couvre les clercs de notaire et les salariés de l'étude. Les notaires titulaires libéraux relèvent d'un régime distinct.",
    simulateurPath: '/simulateurs/independants',
    simulateurLabel: 'Simulateur Retraite Indépendants',
    stats: [
      { label: 'Âge légal', value: '62 ans', note: 'CRPCEN (régime autonome)' },
      { label: 'Taux max.', value: '75 %', note: 'du salaire de référence' },
      { label: 'Durée requise', value: '42 ans', note: 'pour le taux plein CRPCEN' },
      { label: 'Cotisation salarié', value: '~12 %', note: 'du salaire brut' },
    ],
    sections: [
      {
        title: 'Le régime CRPCEN : un régime spécial avantageux',
        content: "La CRPCEN est un **régime spécial** qui fonctionne en annuités, à l'instar du régime de la fonction publique. L'âge légal est 62 ans (plus favorable que le régime général). Le taux maximum de pension est de 75 % du salaire de référence (moyenne des 3 dernières années ou des 25 meilleures, selon le plus favorable).\n\nLes clercs de notaire et salariés de l'étude bénéficient de règles de calcul plus avantageuses que le régime général grâce à ce statut de régime spécial.",
      },
      {
        title: "Notaires titulaires : un régime distinct de la CRPCEN",
        content: "Les **notaires titulaires** (associés ou individuels) exercent comme professions libérales réglementées et cotisent à la **CNAVPL** (retraite de base) et à une caisse de retraite complémentaire propre au notariat. Ils ne relèvent pas de la CRPCEN, réservée aux salariés de l'étude.\n\nLa distinction clercs/notaires titulaires est fondamentale pour comprendre les droits à la retraite.",
      },
      {
        title: 'Cumul de droits et carrières mixtes',
        content: "Un clercs de notaire devenu notaire titulaire cumule des droits à la CRPCEN (années salariales) et dans le régime libéral (CNAVPL + complémentaire notariale) pour les années en tant que titulaire. Chaque régime verse sa pension proportionnellement aux années cotisées.",
      },
    ],
    faq: [
      { q: "La CRPCEN s'applique-t-elle aux notaires associés ?", a: "Non. La CRPCEN couvre les clercs de notaire et les salariés des offices notariaux. Les notaires associés ou individuels (titulaires) relèvent de la CNAVPL et du régime complémentaire du notariat, comme les autres professions libérales réglementées." },
      { q: "À quel âge un clerc de notaire peut-il partir à la retraite ?", a: "L'âge légal à la CRPCEN est 62 ans (plus avantageux que les 64 ans du régime général). Un départ anticipé est possible pour carrière longue. La durée requise pour le taux plein est de 42 ans de cotisation." },
      { q: "Quel est le montant de la pension à la CRPCEN ?", a: "La pension CRPCEN est calculée à 75 % du salaire de référence pour une carrière complète de 42 ans. Ce taux est nettement plus généreux que le régime général (50 % du salaire annuel moyen des 25 meilleures années)." },
      { q: "La CRPCEN couvre-t-elle aussi la prévoyance ?", a: "Oui. La CRPCEN gère un régime de prévoyance complet : maladie, maternité, invalidité et décès. Elle fait office de régime de base et de complémentaire santé, ce qui distingue les salariés du notariat des autres travailleurs du secteur privé." },
    ],
  },

  'expert-comptable': {
    slug: 'expert-comptable',
    icon: '📊',
    title: 'Retraite expert-comptable',
    subtitle: 'CAVEC · Caisse d\'Assurance Vieillesse des Experts-Comptables',
    metaTitle: 'Retraite expert-comptable 2026 — CAVEC, calcul et âge de départ',
    metaDesc: "Guide retraite expert-comptable libéral 2026 : CAVEC (base CNAVPL + complémentaire), âge 67 ans ou 62 ans avec durée complète, cotisations et stratégie d'épargne.",
    intro: "Les experts-comptables libéraux cotisent à la CAVEC (Caisse d'Assurance Vieillesse des Experts-Comptables) pour leur retraite complémentaire, et à la CNAVPL pour la retraite de base. L'âge du taux plein est 67 ans, ou 62 ans avec la durée d'assurance complète.",
    simulateurPath: '/simulateurs/cnavpl',
    simulateurLabel: 'Simulateur Retraite Professions Libérales',
    stats: [
      { label: 'Âge taux plein', value: '67 ans', note: 'ou 62 ans avec durée requise' },
      { label: 'Régime de base', value: 'CNAVPL', note: 'commun professions libérales' },
      { label: 'Complémentaire', value: 'CAVEC', note: 'par points, choix de la classe' },
      { label: 'Taux remplacement', value: '~30–45 %', note: 'selon revenus et classe de cotisation' },
    ],
    sections: [
      {
        title: 'CNAVPL et CAVEC : la structure des droits',
        content: "**CNAVPL (base)** : commun à toutes les professions libérales. Cotisations plafonnées au PASS, calcul en annuités.\n\n**CAVEC (complémentaire)** : régime par points avec plusieurs **classes de cotisation** au choix. L'expert-comptable choisit sa classe (et donc son niveau de cotisation) en début de carrière, ce qui détermine les points acquis annuellement.",
      },
      {
        title: "Le système de classes de cotisation CAVEC",
        content: "La CAVEC propose plusieurs classes de cotisation (A, B, C, D…), correspondant à des montants de cotisation annuels croissants. Chaque classe donne droit à un nombre de points différent.\n\nChoisir une classe élevée en début de carrière maximise les points accumulés mais augmente les charges immédiates. Ce choix est stratégique car il détermine en grande partie le montant de la pension complémentaire.",
      },
      {
        title: 'Experts-comptables salariés',
        content: "Les experts-comptables salariés (en cabinet ou en entreprise) cotisent au régime général CNAV et à Agirc-Arrco. Ils ne relèvent pas de la CAVEC. Leur protection retraite est celle de tout salarié du secteur privé, souvent avec un meilleur taux de remplacement pour les bas et moyens revenus.",
      },
    ],
    faq: [
      { q: "À quel âge un expert-comptable libéral peut-il partir à la retraite ?", a: "Le taux plein automatique est à 67 ans. Un départ est possible dès 62 ans avec la durée d'assurance requise (172 trimestres pour les nés en 1965+). Des décotes s'appliquent avant le taux plein." },
      { q: "Comment choisir sa classe de cotisation à la CAVEC ?", a: "Le choix de la classe de cotisation CAVEC est une décision stratégique : une classe élevée génère plus de points mais augmente les charges. Il est conseillé de choisir en fonction de ses revenus actuels et de sa projection retraite souhaitée, idéalement avec l'aide d'un conseiller financier." },
      { q: "Un expert-comptable peut-il racheter des droits à la CAVEC ?", a: "Oui. Des rachats de points ou de cotisations sont possibles pour certaines périodes (études, faibles revenus en début de carrière). Le coût dépend de l'âge au moment du rachat et de la classe de cotisation ciblée." },
      { q: "Quelle est la différence entre CAVEC et CNAVPL pour un expert-comptable ?", a: "La CNAVPL gère la retraite de base de toutes les professions libérales. La CAVEC est la caisse spécifique aux experts-comptables, qui gère leur régime complémentaire par points. Les deux régimes se cumulent pour former la pension totale." },
    ],
  },

  architecte: {
    slug: 'architecte',
    icon: '📐',
    title: 'Retraite architecte',
    subtitle: 'CIPAV · Caisse Interprofessionnelle de Prévoyance et d\'Assurance Vieillesse',
    metaTitle: 'Retraite architecte libéral 2026 — CIPAV, calcul et âge de départ',
    metaDesc: "Guide retraite architecte libéral 2026 : CIPAV (base CNAVPL + complémentaire par points), classes de cotisation, âge 67 ans ou 62 ans, cotisations et stratégie patrimoniale.",
    intro: "Les architectes libéraux cotisent à la CIPAV (Caisse Interprofessionnelle de Prévoyance et d'Assurance Vieillesse) pour leur retraite complémentaire, et à la CNAVPL pour la retraite de base. La CIPAV couvre aussi d'autres professions libérales non réglementées.",
    simulateurPath: '/simulateurs/cnavpl',
    simulateurLabel: 'Simulateur Retraite Professions Libérales',
    stats: [
      { label: 'Âge taux plein', value: '67 ans', note: 'ou 62 ans avec durée requise' },
      { label: 'Régime de base', value: 'CNAVPL', note: 'commun professions libérales' },
      { label: 'Complémentaire', value: 'CIPAV', note: 'classes A à H' },
      { label: 'Taux remplacement', value: '~30–45 %', note: 'selon classe et durée' },
    ],
    sections: [
      {
        title: 'CNAVPL et CIPAV : les deux régimes de l\'architecte libéral',
        content: "**CNAVPL (base)** : commun à toutes les professions libérales, plafonnée au PASS.\n\n**CIPAV (complémentaire)** : régime par points avec des **classes de cotisation A à H**. La classe est choisie en début de carrière (ou révisée) et détermine le nombre de points acquis annuellement. Les architectes à hauts revenus ont intérêt à choisir une classe élevée.",
      },
      {
        title: 'CIPAV : une caisse réformée pour plus de transparence',
        content: "La CIPAV a été fortement critiquée et réformée dans les années 2010 pour des problèmes de gestion. Depuis la réforme de 2018, les professions libérales non réglementées dont le code APE n'est pas dans la liste spécifique sont désormais rattachées à la SSI, allégeant la CIPAV.\n\nLes architectes restent affiliés à la CIPAV, dont la gestion s'est améliorée depuis la réforme.",
      },
      {
        title: 'Architecte salarié et architecte fonctionnaire',
        content: "Un architecte salarié (cabinet ou maîtrise d'ouvrage) cotise au régime général CNAV + Agirc-Arrco. Un architecte fonctionnaire (collectivité territoriale, État) relève du régime de la fonction publique (CNRACL ou SRE). Seul l'architecte libéral est affilié à la CIPAV.",
      },
    ],
    faq: [
      { q: "À quel âge un architecte libéral peut-il partir à la retraite ?", a: "Le taux plein automatique est à 67 ans. Un départ est possible dès 62 ans avec la durée d'assurance requise. Des décotes s'appliquent en cas de départ anticipé avant le taux plein." },
      { q: "Comment choisir sa classe de cotisation CIPAV ?", a: "La classe de cotisation CIPAV (A à H) détermine le nombre de points acquis annuellement. Un architecte en début de carrière peut opter pour une classe basse, puis monter en classe au fur et à mesure que ses revenus progressent. La révision de classe est possible chaque année." },
      { q: "Un architecte peut-il changer de régime de retraite en cours de carrière ?", a: "Non, le rattachement à la CIPAV est lié au statut libéral d'architecte. En revanche, un architecte qui prend le statut de salarié bascule sur le régime général. Les droits acquis dans chaque régime sont conservés et les pensions versées séparément." },
      { q: "La CIPAV couvre-t-elle aussi l'invalidité et le décès ?", a: "Oui. La CIPAV propose un régime de prévoyance : invalidité totale ou partielle, décès et pension de réversion. Ces garanties sont distinctes du régime de retraite. Des contrats complémentaires peuvent renforcer la couverture." },
    ],
  },

  'ingenieur-cadre': {
    slug: 'ingenieur-cadre',
    icon: '💼',
    title: 'Retraite ingénieur et cadre',
    subtitle: 'CNAV + Agirc-Arrco · Régime salarié du secteur privé',
    metaTitle: 'Retraite cadre ingénieur 2026 — Agirc-Arrco, calcul et pension nette',
    metaDesc: "Guide retraite cadre ingénieur 2026 : CNAV (régime de base) + Agirc-Arrco (complémentaire), coefficient de solidarité, âge 64 ans, GMP et simulation de pension nette.",
    intro: "Les ingénieurs et cadres du secteur privé cotisent au régime général CNAV et à Agirc-Arrco. Depuis la fusion Agirc-Arrco en 2019, il n'existe plus de régime spécifique cadres — tous les salariés du privé cotisent au même régime, avec des règles communes sur les points et le coefficient de solidarité.",
    simulateurPath: '/simulateurs/agirc-arrco',
    simulateurLabel: 'Simulateur Retraite Agirc-Arrco',
    stats: [
      { label: 'Âge légal', value: '64 ans', note: 'réforme 2023' },
      { label: 'Coefficient solidarité', value: '-10 %', note: '3 ans si départ dès 64 ans' },
      { label: 'Taux remplacement net', value: '~60–75 %', note: 'cadre moyen, carrière complète' },
      { label: 'Durée requise', value: '172 trimestres', note: 'nés en 1965+' },
    ],
    sections: [
      {
        title: 'CNAV + Agirc-Arrco : les deux piliers du cadre salarié',
        content: "**CNAV (retraite de base)** : calculée sur le salaire annuel moyen des 25 meilleures années, dans la limite du PASS. Le taux est de 50 % en cas de taux plein. Pour un cadre supérieur, la part du revenu au-delà du PASS n'est pas prise en compte dans la CNAV — d'où l'importance d'Agirc-Arrco.\n\n**Agirc-Arrco (complémentaire)** : régime par points sur l'ensemble du salaire. Chaque année, les cotisations (salarié + employeur) achètent des points dont la valeur de service est revalorisée annuellement.",
      },
      {
        title: 'Le coefficient de solidarité Agirc-Arrco',
        content: "Depuis 2019, un **coefficient de solidarité de -10 %** s'applique pendant 3 ans sur la pension Agirc-Arrco si le cadre part dès 64 ans (ou l'âge légal). Pour éviter cette minoration, il faut attendre 67 ans ou cotiser 4 trimestres supplémentaires après 64 ans.\n\nCette règle est spécifique à Agirc-Arrco et n'affecte pas la pension CNAV de base.",
      },
      {
        title: 'Optimiser la retraite d\'un cadre : PER et épargne salariale',
        content: "Pour un cadre dont le revenu dépasse le PASS, le régime de base CNAV ne couvre que partiellement les revenus — d'où un taux de remplacement souvent inférieur à 50 % sur l'ensemble du salaire pour les hauts revenus.\n\nLes leviers complémentaires : **PER collectif** (PERCO, avec abondement employeur), **PER individuel** (déductible jusqu'à 10 % des revenus), **assurance-vie** et **actionnariat salarié** (FCPE, stock-options).",
      },
    ],
    faq: [
      { q: "Un cadre doit-il attendre 67 ans pour avoir sa pleine retraite Agirc-Arrco ?", a: "Pas nécessairement. Le coefficient de solidarité de -10 % s'applique 3 ans si le cadre part à 64 ans (l'âge légal). Il peut l'éviter en attendant 67 ans, ou en travaillant au moins 4 trimestres supplémentaires après l'âge légal." },
      { q: "Comment sont calculés les points Agirc-Arrco pour un cadre ?", a: "Les points sont calculés sur la totalité du salaire brut (tranche 1 dans la limite du PASS + tranche 2 au-delà). Les taux de cotisation sont différents selon les tranches. Les points s'accumulent chaque année et sont multipliés par la valeur du point au moment de la liquidation." },
      { q: "Qu'est-ce que la GMP (Garantie Minimale de Points) ?", a: "La GMP a été supprimée lors de la fusion Agirc-Arrco en 2019. Elle garantissait un minimum de points aux cadres dont le salaire était inférieur à un certain seuil. Depuis 2019, toutes les tranches s'appliquent uniformément sans garantie minimale." },
      { q: "Quel est le taux de remplacement net d'un cadre ingénieur ?", a: "Pour un cadre au salaire moyen (~50 000 €/an), le taux de remplacement net (pension nette / dernier salaire net) est d'environ 60–70 % avec une carrière complète. Ce taux baisse pour les très hauts salaires car la CNAV est plafonnée au PASS." },
    ],
  },

  policier: {
    slug: 'policier',
    icon: '🚔',
    title: 'Retraite policier',
    subtitle: 'CNRACL · Catégorie active · Police nationale',
    metaTitle: 'Retraite policier 2026 — CNRACL, catégorie active et calcul de pension',
    metaDesc: "Guide retraite policier 2026 : CNRACL catégorie active, âge de départ avancé (57 ans), calcul sur traitement indiciaire brut, bonifications pour services actifs et NBI.",
    intro: "Les policiers nationaux (gardiens de la paix, officiers, commissaires) relèvent de la CNRACL en catégorie active. Ils bénéficient d'un départ anticipé à 57 ans et d'un calcul de pension sur le traitement indiciaire brut, avec des bonifications pour services actifs.",
    simulateurPath: '/simulateurs/fonction-publique',
    simulateurLabel: 'Simulateur Retraite Fonction Publique',
    stats: [
      { label: 'Âge légal actif', value: '57 ans', note: 'police nationale (services actifs)' },
      { label: 'Durée active min.', value: '27 ans', note: 'de services actifs requis' },
      { label: 'Taux maximum', value: '75 %', note: 'du traitement indiciaire brut' },
      { label: 'Bonification 1/5', value: '+1 an/5 ans', note: "d'ancienneté en service actif" },
    ],
    sections: [
      {
        title: 'Catégorie active police : départ à 57 ans',
        content: "Les personnels actifs de la Police nationale (gardiens, brigadiers, officiers, commissaires) bénéficient d'un droit à départ anticipé à **57 ans**, à condition d'avoir accompli au moins **17 ans de services actifs** (pour partir avant 60 ans) ou **27 ans** pour l'âge bonifié.\n\nCette règle est plus avantageuse que les 59 ans de la FPH ou les 64 ans du régime général.",
      },
      {
        title: 'La bonification du 1/5 pour les services actifs',
        content: "Les policiers bénéficient de la **bonification du cinquième** : pour chaque période de 5 ans de services actifs, ils gagnent 1 an supplémentaire de durée d'assurance. Cette bonification peut représenter jusqu'à 5 ans sur une carrière de 25 ans de services actifs.\n\nElle permet d'atteindre la durée requise pour le taux plein plus rapidement que les agents sédentaires.",
      },
      {
        title: 'Calcul de la pension policier',
        content: "La pension est calculée sur le **traitement indiciaire brut** (hors primes, comme tous les fonctionnaires) selon la formule : Traitement × Taux de liquidation × Coefficient de proratisation.\n\nLes primes (prime de résultat, prime de nuit, allocation de fidélisation…) alimentent le RAFP mais n'entrent pas dans la pension de base.",
      },
    ],
    faq: [
      { q: "À quel âge un policier peut-il partir à la retraite ?", a: "Un gardien de la paix peut partir à la retraite à 57 ans s'il a accompli 17 ans de services actifs. L'âge normal de départ est 57 ans pour les catégories actives de la Police nationale, avec la bonification du 1/5 qui peut avancer encore davantage l'âge effectif de départ." },
      { q: "Qu'est-ce que la bonification du 1/5 pour les policiers ?", a: "La bonification du cinquième est un avantage accordé aux fonctionnaires de catégorie active : pour chaque 5 ans de services actifs, ils gagnent 1 an de durée d'assurance supplémentaire. Sur 25 ans de services, cela représente 5 ans de bonification." },
      { q: "Les primes de nuit et de dimanche entrent-elles dans le calcul de la pension ?", a: "Non. Comme pour tous les fonctionnaires, les primes (prime de résultat, indemnités de nuit, prime de risque…) n'entrent pas dans le calcul de la pension de base. Elles alimentent le RAFP (Retraite Additionnelle de la Fonction Publique), qui génère une petite pension complémentaire." },
      { q: "Un policier municipal a-t-il les mêmes droits à la retraite qu'un policier national ?", a: "Non. Les policiers municipaux sont des agents territoriaux qui relèvent de la CNRACL. Selon leur emploi, ils peuvent être classés en catégorie active (s'ils effectuent des missions de police) ou sédentaire. Les avantages de départ anticipé sont moins étendus que pour la Police nationale." },
    ],
  },

  militaire: {
    slug: 'militaire',
    icon: '🎖️',
    title: 'Retraite militaire',
    subtitle: "Service des retraites de l'État · Régime des pensions militaires",
    metaTitle: 'Retraite militaire 2026 — pension militaire, calcul et âge de départ',
    metaDesc: "Guide retraite militaire 2026 : pension militaire calculée sur l'indice, durée de services, bonifications pour campagnes, départ possible dès 17 ans de services. Armée de terre, marine, air.",
    intro: "Les militaires (armée de terre, marine nationale, armée de l'air, gendarmerie) bénéficient d'un régime de pension militaire géré par le Service des retraites de l'État. Il se distingue radicalement du régime général par la possibilité de partir dès 17 ans de services pour les militaires du rang.",
    simulateurPath: '/simulateurs/fonction-publique',
    simulateurLabel: 'Simulateur Retraite Fonction Publique',
    stats: [
      { label: 'Départ possible', value: 'Dès 17 ans', note: 'de services pour MdR/sous-officiers' },
      { label: 'Officiers', value: 'Dès 27 ans', note: 'de services ou 52 ans' },
      { label: 'Taux maximum', value: '75 %', note: "de la solde indiciaire brute" },
      { label: 'Pension minimale', value: 'Garantie', note: 'pour les plus de 15 ans de services' },
    ],
    sections: [
      {
        title: "Un régime radicalement différent : la pension militaire",
        content: "Les pensions militaires sont régies par le Code des pensions militaires de retraite. La règle fondamentale est la **durée de services** : les militaires du rang et sous-officiers peuvent partir dès **17 ans de services**. Les officiers peuvent partir à partir de **27 ans de services** ou à 52 ans.\n\nContrairement au régime général, il n'y a pas d'âge légal minimal au sens strict — c'est la durée de service qui prime.",
      },
      {
        title: 'Calcul de la pension militaire',
        content: "La pension est calculée sur la **solde indiciaire brute** (hors primes et indemnités) selon la formule :\n\n**Pension = Solde indiciaire × Taux de liquidation**\n\nLe taux est de 2 % par année de service (pour les générations les plus récentes), dans la limite de 75 %. Des **bonifications** s'ajoutent pour les campagnes OPEX, le service en mer, les missions à risque.",
      },
      {
        title: 'Bonifications et avantages spécifiques',
        content: "Les militaires bénéficient de plusieurs bonifications :\n- **Campagnes OPEX** : +1 an par an de service en opération extérieure\n- **Service actif naval** : bonification pour les marins embarqués\n- **Service à l'étranger** : coefficients multiplicateurs selon la zone\n\nCes bonifications peuvent représenter plusieurs années de durée d'assurance supplémentaire sur une carrière.",
      },
    ],
    faq: [
      { q: "Un militaire peut-il partir à la retraite à 40 ans ?", a: "Oui. Un militaire du rang ou sous-officier ayant accompli 17 ans de services peut partir dès cet âge — potentiellement à 35-40 ans selon l'âge d'engagement. La pension est calculée sur les années de service, sans attendre 64 ans." },
      { q: "Comment sont calculées les bonifications OPEX ?", a: "Chaque période d'opération extérieure (OPEX) donne droit à des bonifications de durée d'assurance. En règle générale, 1 an en OPEX équivaut à 2 ans de services pour le calcul de la pension, selon les zones et les missions." },
      { q: "Un officier a-t-il les mêmes conditions de départ qu'un sous-officier ?", a: "Non. Les officiers peuvent partir à partir de 27 ans de services ou à 52 ans (selon leur corps). Les conditions sont plus strictes que pour les militaires du rang et sous-officiers (17 ans de services), mais restent bien plus avantageuses que le régime général." },
      { q: "Un militaire peut-il cumuler pension militaire et travail dans le secteur privé ?", a: "Oui. Le cumul emploi-retraite est possible pour les militaires retraités. Beaucoup commencent une deuxième carrière dans le secteur privé après leur départ militaire, cumulant ainsi une pension militaire et de nouveaux droits au régime général CNAV + Agirc-Arrco." },
    ],
  },

  pompier: {
    slug: 'pompier',
    icon: '🚒',
    title: 'Retraite pompier professionnel',
    subtitle: 'CNRACL · Catégorie active · Sapeurs-pompiers professionnels',
    metaTitle: 'Retraite pompier professionnel 2026 — CNRACL, catégorie active et pension',
    metaDesc: "Guide retraite pompier professionnel 2026 : CNRACL catégorie active, départ dès 57 ans, bonification du 1/5, calcul sur traitement indiciaire et NBI opérationnel.",
    intro: "Les sapeurs-pompiers professionnels sont des fonctionnaires territoriaux relevant de la CNRACL en catégorie active. Ils bénéficient d'un départ anticipé à 57 ans après 17 ans de services actifs, et de la bonification du cinquième sur leur durée d'assurance.",
    simulateurPath: '/simulateurs/fonction-publique',
    simulateurLabel: 'Simulateur Retraite Fonction Publique',
    stats: [
      { label: 'Âge légal actif', value: '57 ans', note: 'après 17 ans de services actifs' },
      { label: 'Bonification 1/5', value: '+1 an/5 ans', note: "d'ancienneté en service actif" },
      { label: 'Taux maximum', value: '75 %', note: 'du traitement indiciaire brut' },
      { label: 'Durée service actif', value: '17 ans min.', note: 'pour départ anticipé' },
    ],
    sections: [
      {
        title: 'CNRACL catégorie active pour les pompiers professionnels',
        content: "Les **sapeurs-pompiers professionnels** (SPP) sont des fonctionnaires territoriaux classés en **catégorie active** de la CNRACL. Cela leur permet de partir à la retraite à **57 ans** (au lieu de 64 ans en catégorie sédentaire) sous réserve de 17 ans minimum de services actifs.\n\nLes pompiers volontaires (SPV) ne sont pas des fonctionnaires et n'ont pas accès à la CNRACL.",
      },
      {
        title: 'Bonification du 1/5 et durée d\'assurance',
        content: "Comme pour les autres catégories actives (policiers, gardiens de prison…), les pompiers professionnels bénéficient de la **bonification du cinquième** : 1 an de durée supplémentaire pour chaque 5 ans de services actifs.\n\nSur 25 ans de services actifs, cela représente 5 ans de bonification — soit potentiellement atteindre la durée complète à 52-53 ans.",
      },
      {
        title: 'Calcul de la pension pompier',
        content: "La pension est calculée sur le **traitement indiciaire brut** (hors primes, NBI, indemnités de risque…). Les primes et indemnités alimentent le RAFP.\n\nFormule : Traitement indiciaire × Taux de liquidation × Coefficient de proratisation\nTaux max : 75 % pour une carrière complète.",
      },
    ],
    faq: [
      { q: "À quel âge un pompier professionnel peut-il partir à la retraite ?", a: "Un sapeur-pompier professionnel peut partir à 57 ans s'il a accompli au moins 17 ans de services actifs. Sans cette condition, l'âge légal est 64 ans en catégorie sédentaire. La bonification du 1/5 peut encore avancer l'âge effectif de départ." },
      { q: "Les pompiers volontaires ont-ils des droits à la retraite spécifiques ?", a: "Les sapeurs-pompiers volontaires (SPV) ne sont pas fonctionnaires. Ils perçoivent une allocation vétérance après 20 ans de service volontaire, mais ne cotisent pas à la CNRACL. Leurs droits à la retraite dépendent de leur activité professionnelle principale." },
      { q: "Les NBI (Nouvelle Bonification Indiciaire) entrent-elles dans le calcul de la pension ?", a: "Non. La NBI et les autres indemnités spécifiques n'entrent pas dans le calcul de la pension de base. Elles alimentent le RAFP (Retraite Additionnelle de la Fonction Publique), qui génère une pension complémentaire modeste." },
      { q: "Un pompier professionnel peut-il cumuler retraite et autre activité ?", a: "Oui. Le cumul emploi-retraite est possible dans les mêmes conditions que pour les autres fonctionnaires. Beaucoup de pompiers partant à 57 ans exercent une seconde carrière dans le privé ou en tant que consultant sécurité." },
    ],
  },

  gendarme: {
    slug: 'gendarme',
    icon: '🫡',
    title: 'Retraite gendarme',
    subtitle: "Service des retraites de l'État · Pension militaire · Gendarmerie nationale",
    metaTitle: 'Retraite gendarme 2026 — pension militaire, calcul et âge de départ',
    metaDesc: "Guide retraite gendarme 2026 : pension militaire (SRE), départ dès 17 ans de services pour sous-officiers, bonification du 1/5, calcul sur solde indiciaire et OPEX.",
    intro: "Les gendarmes relèvent du statut militaire et bénéficient du régime des pensions militaires géré par le Service des retraites de l'État (SRE). Les sous-officiers de gendarmerie peuvent partir dès 17 ans de services, les officiers dès 27 ans.",
    simulateurPath: '/simulateurs/fonction-publique',
    simulateurLabel: 'Simulateur Retraite Fonction Publique',
    stats: [
      { label: 'Sous-officiers', value: 'Dès 17 ans', note: 'de services actifs' },
      { label: 'Officiers', value: 'Dès 27 ans', note: 'de services ou 52 ans' },
      { label: 'Taux maximum', value: '75 %', note: 'de la solde indiciaire brute' },
      { label: 'Bonification OPEX', value: '+1 an/an', note: "d'opération extérieure" },
    ],
    sections: [
      {
        title: 'Statut militaire des gendarmes : régime de pension spécifique',
        content: "Les **gendarmes** sont des militaires, contrairement aux policiers (fonctionnaires civils). Ils relèvent du **Code des pensions militaires de retraite** géré par le SRE.\n\nLes sous-officiers (gendarmes, maréchaux des logis) peuvent partir dès **17 ans de services**. Les officiers partent à partir de **27 ans de services** ou à **52 ans** selon leur grade.",
      },
      {
        title: 'Calcul de la pension de gendarme',
        content: "La pension est calculée sur la **solde indiciaire brute** (hors primes, indemnités de sujétion spéciale, NBI…) :\n\n**Pension = Solde × Taux de liquidation**\n\nLe taux est de 2 % par année de service, dans la limite de 75 %. Des bonifications s'ajoutent pour les campagnes OPEX, le service en zones difficiles, et certains emplois spéciaux (GIGN, motocyclistes…).",
      },
      {
        title: 'Gendarmerie et cumul emploi-retraite',
        content: "Beaucoup de gendarmes retraités entament une seconde carrière dans le secteur privé (sécurité, conseil, transport…) ou dans d'autres fonctions publiques (agent territorial, sapeur-pompier…). Le cumul pension militaire + nouveaux droits CNAV est possible et courant.",
      },
    ],
    faq: [
      { q: "Un gendarme a-t-il le même régime de retraite qu'un policier ?", a: "Non. Les gendarmes sont des militaires (régime des pensions militaires, SRE) tandis que les policiers nationaux sont des fonctionnaires civils (CNRACL, catégorie active). Les conditions de départ sont similaires (avantageuses) mais les régimes sont distincts." },
      { q: "À quel âge un gendarme peut-il partir à la retraite ?", a: "Un sous-officier de gendarmerie peut partir dès 17 ans de services (potentiellement à 35-38 ans selon l'âge d'engagement). Un officier peut partir à 27 ans de services ou à 52 ans. Ces conditions sont bien plus avantageuses que le régime général." },
      { q: "Les bonifications OPEX fonctionnent-elles de la même façon pour les gendarmes ?", a: "Oui. Les gendarmes déployés en OPEX bénéficient des mêmes bonifications que les autres militaires : en général, 1 an de service en OPEX équivaut à 2 ans de durée d'assurance pour le calcul de la pension." },
      { q: "Un gendarme à la retraite peut-il reprendre une activité ?", a: "Oui. Le cumul emploi-retraite est possible. Un gendarme retraité peut travailler dans le secteur privé ou public. S'il cotise à un nouveau régime (CNAV, Agirc-Arrco), il accumule de nouveaux droits à pension complémentaires de sa pension militaire." },
    ],
  },


  'aide-soignante': {
    slug: 'aide-soignante',
    icon: '🩺',
    title: 'Retraite aide-soignante',
    subtitle: 'CNRACL · FPH catégorie active / CNAV secteur privé',
    metaTitle: 'Retraite aide-soignante 2026 — FPH catégorie active, calcul et pension',
    metaDesc: "Guide retraite aide-soignante 2026 : FPH catégorie active (départ à 59 ans), CNRACL, calcul sur traitement indiciaire, et régime général CNAV pour le secteur privé.",
    intro: "Les aides-soignantes hospitalières publiques sont classées en catégorie active de la FPH (CNRACL). Elles peuvent partir dès 59 ans avec 17 ans de services actifs. Celles du secteur privé relèvent du régime général CNAV + Agirc-Arrco.",
    simulateurPath: '/simulateurs/fonction-publique',
    simulateurLabel: 'Simulateur Retraite Fonction Publique',
    stats: [
      { label: 'FPH (publique)', value: '59 ans', note: 'catégorie active hospitalière' },
      { label: 'Secteur privé', value: '64 ans', note: 'CNAV régime général' },
      { label: 'Taux maximum', value: '75 %', note: 'du traitement indiciaire brut (FPH)' },
      { label: 'Durée min. active', value: '17 ans', note: "pour départ anticipé à 59 ans" },
    ],
    sections: [
      {
        title: 'Aide-soignante FPH : catégorie active',
        content: "Les aides-soignantes de la Fonction Publique Hospitalière sont classées en **catégorie active** (décret n° 2013-1290). Elles peuvent partir à **59 ans** si elles ont accompli au moins **17 ans de services actifs**.\n\nLa pension est calculée sur le traitement indiciaire brut (taux max 75 %). Les gardes de nuit et week-ends génèrent des bonifications de durée d'assurance.",
      },
      {
        title: 'Aide-soignante en EHPAD privé ou clinique : régime général',
        content: "Les aides-soignantes employées dans des EHPAD privés, cliniques ou structures associatives cotisent au **régime général CNAV** et à **Agirc-Arrco**. L'âge légal est 64 ans. Le taux de remplacement net est de 55–65 % selon la carrière et le niveau de salaire.",
      },
      {
        title: 'Pénibilité et dispositifs complémentaires',
        content: "Le métier d'aide-soignante expose à des facteurs de pénibilité reconnus (port de charges, postures contraignantes, travail de nuit). Le **Compte Professionnel de Prévention (C2P)** permet aux aides-soignantes du privé d'acquérir des points utilisables pour un départ anticipé, une formation ou un passage à temps partiel sans perte de salaire.",
      },
    ],
    faq: [
      { q: "À quel âge part à la retraite une aide-soignante à l'hôpital public ?", a: "Une aide-soignante FPH est classée en catégorie active. Elle peut partir à 59 ans si elle a accompli au moins 17 ans de services actifs. Sans cette condition, l'âge légal est 64 ans." },
      { q: "Les nuits et week-ends améliorent-ils les droits retraite d'une aide-soignante ?", a: "À la FPH, les services de nuit donnent droit à des bonifications de durée d'assurance (1 trimestre pour 90 nuits travaillées dans certains cas). Dans le secteur privé, ils activent des points C2P utilisables pour un départ anticipé." },
      { q: "Une aide-soignante peut-elle bénéficier du dispositif carrières longues ?", a: "Oui, dans le secteur privé. Si une aide-soignante a commencé à travailler avant 20 ans et a validé la durée requise, elle peut partir entre 58 et 62 ans via le dispositif carrières longues (CNAV)." },
      { q: "Le Compte Professionnel de Prévention (C2P) s'applique-t-il aux aides-soignantes ?", a: "Oui, pour celles du secteur privé. Les facteurs de pénibilité reconnus (travail de nuit, horaires décalés, port de charges…) génèrent des points C2P. Ces points peuvent être utilisés pour un départ anticipé d'1 ou 2 ans." },
    ],
  },

  magistrat: {
    slug: 'magistrat',
    icon: '⚖️',
    title: 'Retraite magistrat',
    subtitle: "Service des retraites de l'État · Corps judiciaire",
    metaTitle: 'Retraite magistrat 2026 — SRE, calcul de pension et âge de départ',
    metaDesc: "Guide retraite magistrat 2026 : régime de la Fonction Publique d'État, calcul sur traitement indiciaire, âge légal 64 ans, RAFP et règles spécifiques au corps judiciaire.",
    intro: "Les magistrats de l'ordre judiciaire (juges, parquetiers) relèvent de la Fonction Publique d'État en catégorie sédentaire. Leur pension est calculée par le Service des retraites de l'État sur le traitement indiciaire brut, avec un taux maximum de 75 %.",
    simulateurPath: '/simulateurs/fonction-publique',
    simulateurLabel: 'Simulateur Retraite Fonction Publique',
    stats: [
      { label: 'Âge légal', value: '64 ans', note: 'catégorie sédentaire FPE' },
      { label: 'Taux maximum', value: '75 %', note: 'du traitement indiciaire brut' },
      { label: 'Durée requise', value: '172 trimestres', note: 'nés en 1965+' },
      { label: 'Limite d\'âge', value: '67 ans', note: 'sauf prolongation exceptionnelle' },
    ],
    sections: [
      {
        title: 'Régime de retraite des magistrats : FPE catégorie sédentaire',
        content: "Les magistrats de l'ordre judiciaire sont des fonctionnaires de l'État en catégorie sédentaire. Ils partent à **64 ans** (réforme 2023) avec un taux maximum de 75 % du traitement indiciaire brut.\n\nLa pension est calculée sur le dernier traitement indiciaire brut (indice majoré × valeur du point d'indice), sans inclure les indemnités de fonctions ou primes.",
      },
      {
        title: 'La limite d\'âge et la prolongation',
        content: "La limite d'âge des magistrats est fixée à **67 ans** (départ obligatoire). Des dérogations sont possibles jusqu'à 68 ans dans certains cas exceptionnels (corps des conseillers honoraires, magistrats de la Cour de cassation…).\n\nLe **RAFP** (Retraite Additionnelle de la Fonction Publique) complète la pension de base avec une part des indemnités et primes.",
      },
      {
        title: 'Particularités du statut de magistrat',
        content: "Les magistrats bénéficient de règles spécifiques liées à leur inamovibilité : ils ne peuvent être déplacés sans leur consentement. À la retraite, certains peuvent devenir **magistrats honoraires**, ce qui leur permet de participer à des formations de jugement sans percevoir de rémunération (au-delà de la pension).",
      },
    ],
    faq: [
      { q: "À quel âge un magistrat doit-il partir à la retraite ?", a: "L'âge légal de départ est 64 ans depuis la réforme 2023. La limite d'âge (départ obligatoire) est fixée à 67 ans pour la plupart des magistrats. Des dérogations exceptionnelles peuvent aller jusqu'à 68 ans pour certains corps." },
      { q: "La retraite d'un magistrat est-elle calculée sur les 25 meilleures années comme au régime général ?", a: "Non. Les magistrats sont des fonctionnaires de la FPE : leur pension est calculée sur le dernier traitement indiciaire brut (et non sur les 25 meilleures années). C'est un avantage important pour ceux dont le traitement progresse en fin de carrière." },
      { q: "Un magistrat peut-il devenir magistrat honoraire à la retraite ?", a: "Oui. Les magistrats retraités peuvent être nommés magistrats honoraires par décret. Ils peuvent alors siéger dans des formations de jugement. L'exercice est bénévole mais peut être valorisant pour ceux souhaitant rester actifs dans le monde judiciaire." },
      { q: "Les indemnités de fonctions entrent-elles dans le calcul de la pension ?", a: "Non. Comme pour tous les fonctionnaires, les indemnités (indemnités de fonctions, primes de résultats judiciaires…) n'entrent pas dans la pension de base. Elles alimentent le RAFP, qui génère une pension complémentaire modeste." },
    ],
  },

  'chauffeur-routier': {
    slug: 'chauffeur-routier',
    icon: '🚛',
    title: 'Retraite chauffeur routier',
    subtitle: 'CNAV + Agirc-Arrco · Pénibilité · Secteur privé',
    metaTitle: 'Retraite chauffeur routier 2026 — pénibilité, C2P et départ anticipé',
    metaDesc: "Guide retraite chauffeur routier 2026 : CNAV + Agirc-Arrco, Compte Professionnel de Prévention (C2P), départ anticipé pour pénibilité, carrières longues et calcul de pension.",
    intro: "Les chauffeurs routiers sont des salariés du secteur privé qui cotisent au régime général CNAV et à Agirc-Arrco. Leur métier expose à des facteurs de pénibilité reconnus (travail de nuit, vibrations, port de charges) ouvrant droit au Compte Professionnel de Prévention (C2P).",
    simulateurPath: '/simulateurs/cnav',
    simulateurLabel: 'Simulateur Retraite CNAV',
    stats: [
      { label: 'Âge légal', value: '64 ans', note: 'régime général réforme 2023' },
      { label: 'Départ anticipé', value: 'Possible', note: 'C2P jusqu\'à -2 ans' },
      { label: 'Carrières longues', value: '58-62 ans', note: 'si début avant 20 ans' },
      { label: 'Taux remplacement', value: '~55–70 %', note: 'selon carrière et salaire' },
    ],
    sections: [
      {
        title: 'CNAV + Agirc-Arrco : les deux piliers de la retraite des routiers',
        content: "Les chauffeurs routiers salariés cotisent au **régime général CNAV** (retraite de base sur le salaire des 25 meilleures années, dans la limite du PASS) et à **Agirc-Arrco** (complémentaire par points sur la totalité du salaire).\n\nL'âge légal est 64 ans depuis la réforme 2023. Le taux de remplacement net est de 55–70 % pour une carrière complète.",
      },
      {
        title: 'Compte Professionnel de Prévention (C2P) et pénibilité',
        content: "Le métier de chauffeur routier expose à plusieurs **facteurs de pénibilité reconnus** par le C2P :\n- Travail de nuit\n- Travail en équipes successives alternantes\n- Vibrations mécaniques (conducteurs PL)\n\nChaque facteur génère des **points C2P** (1 à 8 points par an). Ces points peuvent être utilisés pour partir à la retraite 2 ans plus tôt (au minimum 10 points), se former, ou passer à mi-temps.",
      },
      {
        title: "Carrières longues : partir avant 64 ans",
        content: "Un chauffeur routier ayant commencé à travailler avant 20 ans peut bénéficier du **dispositif carrières longues** et partir dès 58 à 62 ans selon la durée cotisée. Ce dispositif est particulièrement courant dans le transport routier où beaucoup commencent leur carrière jeunes.",
      },
    ],
    faq: [
      { q: "Un chauffeur routier peut-il partir avant 64 ans ?", a: "Oui, par deux voies : le Compte Professionnel de Prévention (C2P) qui permet de partir jusqu'à 2 ans avant l'âge légal grâce aux points pénibilité, et le dispositif carrières longues pour ceux ayant commencé avant 20 ans (départ possible à 58-62 ans)." },
      { q: "Comment fonctionne le C2P pour les chauffeurs routiers ?", a: "Le C2P génère des points pour chaque facteur de pénibilité exposé. Un chauffeur de nuit peut cumuler jusqu'à 8 points par an. Avec 10 points, il peut demander un trimestre de départ anticipé. Avec 40 points, il peut partir 2 ans avant l'âge légal." },
      { q: "Les primes et heures supplémentaires entrent-elles dans le calcul de la retraite ?", a: "Oui, en partie. Dans le régime général, les primes soumises à cotisations sociales entrent dans le calcul du salaire annuel moyen. Les heures supplémentaires cotisées génèrent également des droits. En revanche, les défraiements (repas, nuitées) sont exonérés de cotisations et n'entrent pas." },
      { q: "Quelle est la différence de retraite entre un chauffeur de poids lourd et de messagerie ?", a: "La différence est surtout liée aux salaires (et donc aux cotisations), pas au type de camion. Un conducteur PL longue distance a souvent des facteurs de pénibilité supplémentaires (vibrations, nuit) qui génèrent plus de points C2P qu'un livreur en messagerie urbaine." },
    ],
  },

  caissiere: {
    slug: 'caissiere',
    icon: '🛒',
    title: 'Retraite caissière',
    subtitle: 'CNAV + Agirc-Arrco · Carrières longues · Secteur privé',
    metaTitle: 'Retraite caissière 2026 — carrières longues, C2P et départ anticipé',
    metaDesc: "Guide retraite caissière et employée de commerce 2026 : CNAV régime général, dispositif carrières longues, Compte Professionnel de Prévention, temps partiel et pension.",
    intro: "Les caissières et employées de commerce sont des salariées du secteur privé cotisant au régime général CNAV et à Agirc-Arrco. Beaucoup ont commencé à travailler jeunes et peuvent bénéficier du dispositif carrières longues pour partir avant 64 ans.",
    simulateurPath: '/simulateurs/cnav',
    simulateurLabel: 'Simulateur Retraite CNAV',
    stats: [
      { label: 'Âge légal', value: '64 ans', note: 'réforme 2023' },
      { label: 'Carrières longues', value: 'Dès 58 ans', note: 'si début avant 16-18 ans' },
      { label: 'C2P pénibilité', value: 'Possible', note: 'travail de nuit, postures' },
      { label: 'Impact temps partiel', value: 'Attention', note: 'trimestres proratisés si bas salaire' },
    ],
    sections: [
      {
        title: "Régime général et impact du temps partiel",
        content: "Les caissières cotisent au **régime général CNAV** et à **Agirc-Arrco**. Un point d'attention : le **temps partiel** peut entraîner des lacunes dans la validation des trimestres si le salaire annuel est inférieur à 600 × SMIC horaire.\n\nUne caissière à mi-temps au SMIC valide 3 trimestres au lieu de 4 — ce qui peut retarder l'obtention du taux plein.",
      },
      {
        title: 'Carrières longues : partir avant 64 ans',
        content: "Le **dispositif carrières longues** est particulièrement adapté aux caissières ayant commencé à travailler jeunes :\n- Début avant 16 ans → départ possible dès 58 ans\n- Début avant 18 ans → dès 60 ans\n- Début avant 20 ans → dès 62 ans\n\nCe dispositif permet de partir avec une pension à taux plein sans attendre 64 ans.",
      },
      {
        title: 'Pénibilité et Compte Professionnel de Prévention',
        content: "Certaines caissières sont exposées à des facteurs de pénibilité reconnus :\n- **Postures pénibles** : debout prolongé, station assise contrainte (caisses basse)\n- **Travail de nuit** : grandes surfaces ouvertes la nuit\n\nCes facteurs génèrent des **points C2P** permettant un départ anticipé ou un passage à mi-temps sans perte de salaire.",
      },
    ],
    faq: [
      { q: "Une caissière peut-elle partir avant 64 ans ?", a: "Oui, via le dispositif carrières longues si elle a commencé à travailler avant 20 ans et validé la durée requise (172 trimestres + 8 trimestres supplémentaires). Elle peut aussi utiliser les points C2P accumulés pour un départ jusqu'à 2 ans avant l'âge légal." },
      { q: "Le temps partiel pénalise-t-il la retraite d'une caissière ?", a: "Oui si le salaire annuel est inférieur à 600 × SMIC horaire (~6 500 €). Dans ce cas, la caissière valide moins de 4 trimestres par an, ce qui allonge la durée pour atteindre le taux plein. Il est conseillé de vérifier chaque année son relevé de carrière." },
      { q: "Les congés maladie comptent-ils comme des trimestres validés ?", a: "Oui. Les indemnités journalières de maladie versées par la Sécurité sociale sont assimilées à des périodes d'activité pour la validation des trimestres (dans la limite de 60 jours). Un arrêt maladie long n'efface pas les droits retraite acquis." },
      { q: "Une caissière qui a travaillé à temps partiel pendant 30 ans aura-t-elle une bonne retraite ?", a: "Pas nécessairement. Un temps partiel prolongé à faible salaire génère une pension CNAV basse (calculée sur les 25 meilleures années de revenus) et peu de points Agirc-Arrco. La pension peut être inférieure au minimum contributif (environ 800 €/mois en 2026)." },
    ],
  },

  'ouvrier-usine': {
    slug: 'ouvrier-usine',
    icon: '🏭',
    title: 'Retraite ouvrier industrie',
    subtitle: 'CNAV + Agirc-Arrco · Pénibilité · Carrières longues',
    metaTitle: 'Retraite ouvrier industrie 2026 — pénibilité, C2P et départ anticipé',
    metaDesc: "Guide retraite ouvrier industrie 2026 : CNAV régime général, Compte Professionnel de Prévention (C2P), facteurs de pénibilité reconnus, carrières longues et calcul de pension.",
    intro: "Les ouvriers d'industrie (métallurgie, automobile, chimie, agroalimentaire…) cotisent au régime général CNAV et à Agirc-Arrco. Leur métier expose à de nombreux facteurs de pénibilité reconnus par le C2P, permettant souvent un départ anticipé.",
    simulateurPath: '/simulateurs/cnav',
    simulateurLabel: 'Simulateur Retraite CNAV',
    stats: [
      { label: 'Âge légal', value: '64 ans', note: 'régime général réforme 2023' },
      { label: 'C2P départ anticipé', value: 'Jusqu\'à -2 ans', note: 'selon points accumulés' },
      { label: 'Carrières longues', value: '58-62 ans', note: 'si début avant 20 ans' },
      { label: 'Facteurs pénibilité', value: 'Jusqu\'à 6', note: 'facteurs reconnus par le C2P' },
    ],
    sections: [
      {
        title: 'Les facteurs de pénibilité pour les ouvriers industriels',
        content: "Le **Compte Professionnel de Prévention (C2P)** reconnaît 6 facteurs de pénibilité particulièrement fréquents dans l'industrie :\n\n1. Travail de nuit\n2. Travail en équipes successives alternantes (3x8)\n3. Travail en milieu hyperbare\n4. Températures extrêmes\n5. Bruit intense (> 81 dB)\n6. Vibrations mécaniques\n\nChaque facteur génère des points C2P (1 à 8/an selon exposition). Les points sont utilisables pour partir plus tôt, se former ou passer à mi-temps.",
      },
      {
        title: 'Carrières longues : partir avant 64 ans',
        content: "Beaucoup d'ouvriers commencent leur carrière jeunes (apprentissage à 16-18 ans). Le **dispositif carrières longues** permet un départ anticipé :\n- Avant 16 ans → départ dès 58 ans\n- Avant 18 ans → dès 60 ans\n- Avant 20 ans → dès 62 ans\n\nCette combinaison C2P + carrières longues rend souvent possible un départ à 58-62 ans pour les ouvriers industriels.",
      },
      {
        title: 'Incapacité permanente et retraite anticipée',
        content: "Les ouvriers ayant subi un **accident du travail ou une maladie professionnelle** avec un taux d'incapacité permanente d'au moins 10 % peuvent partir en retraite anticipée à 60 ans (ou 62 ans si taux < 20 %). Cette règle spécifique permet de partir avant l'âge légal sans décote.",
      },
    ],
    faq: [
      { q: "Un ouvrier en 3x8 peut-il partir avant 64 ans ?", a: "Oui. Le travail en équipes successives alternantes (3x8) est un facteur de pénibilité reconnu qui génère des points C2P. Avec suffisamment de points (40 points = 2 ans de départ anticipé), un ouvrier en 3x8 peut partir à 62 ans au lieu de 64 ans." },
      { q: "Comment les points C2P s'accumulent-ils pour un ouvrier industriel ?", a: "Pour un ouvrier exposé à 2 facteurs (ex : nuit + vibrations), il peut accumuler jusqu'à 8 points par an. Sur 10 ans, il aura 80 points, soit le maximum utilisable pour un départ anticipé de 2 ans et de la formation." },
      { q: "Un accident du travail avec séquelles permet-il de partir plus tôt ?", a: "Oui. Un taux d'incapacité permanente (IPP) d'au moins 20 % suite à un AT/MP permet de partir à 60 ans sans décote. Avec un taux entre 10 et 20 %, le départ est possible à 62 ans. La pension est calculée au taux plein quel que soit le nombre de trimestres validés." },
      { q: "La retraite d'un ouvrier à hauts risques est-elle la même que celle d'un bureau ?", a: "Le calcul de la pension CNAV et Agirc-Arrco est identique — ce qui compte ce sont les cotisations versées. La différence tient aux possibilités de départ anticipé (C2P, carrières longues, AT/MP) qui sont beaucoup plus accessibles aux ouvriers industriels qu'aux cadres de bureau." },
    ],
  },

  'chef-entreprise': {
    slug: 'chef-entreprise',
    icon: '🏢',
    title: 'Retraite chef d\'entreprise',
    subtitle: 'SSI ou CNAV · TNS ou assimilé-salarié selon statut juridique',
    metaTitle: "Retraite chef d'entreprise 2026 — TNS, assimilé-salarié et stratégie",
    metaDesc: "Guide retraite chef d'entreprise 2026 : gérant majoritaire SARL (SSI), président SAS (CNAV + Agirc-Arrco), PER, épargne salariale et optimisation fiscale de la retraite.",
    intro: "La retraite d'un chef d'entreprise dépend de son statut juridique : gérant majoritaire de SARL (TNS, SSI), président de SAS/SASU (assimilé-salarié, CNAV + Agirc-Arrco), ou entrepreneur individuel (SSI). Chaque statut a des implications majeures sur la retraite.",
    simulateurPath: '/simulateurs/independants',
    simulateurLabel: 'Simulateur Retraite Indépendants',
    stats: [
      { label: 'Gérant maj. SARL', value: 'SSI (TNS)', note: 'cotisations ~45 % du revenu net' },
      { label: 'Président SAS/SASU', value: 'Assimilé-salarié', note: 'CNAV + Agirc-Arrco' },
      { label: 'Âge légal', value: '64 ans', note: 'pour tous les statuts' },
      { label: 'Taux remplacement SSI', value: '~30–45 %', note: 'selon revenus et durée' },
    ],
    sections: [
      {
        title: 'Gérant majoritaire SARL vs président SAS : deux mondes différents',
        content: "**Gérant majoritaire de SARL** (> 50 % des parts) : statut TNS, cotise à la SSI et à la RCI. Cotisations plus basses (~45 % des revenus nets) mais protection sociale moindre. Taux de remplacement : 30–45 %.\n\n**Président de SAS/SASU** : assimilé-salarié, cotise au régime général CNAV et à Agirc-Arrco. Cotisations plus élevées (~70 % du salaire brut) mais meilleure retraite et chômage. Taux de remplacement : 55–70 %.",
      },
      {
        title: "Optimiser la retraite d'un chef d'entreprise : PER et épargne salariale",
        content: "Face à un taux de remplacement insuffisant (surtout pour les TNS), plusieurs leviers :\n\n**PER individuel** : déductible fiscalement des revenus (BIC, BNC ou rémunération de gérant), plafond élevé (jusqu'à 8 PASS)\n\n**Épargne salariale** (PEE, PERCO) : si l'entreprise a des salariés — l'abondement est déductible des charges\n\n**Immobilier professionnel** : posséder ses locaux et percevoir un loyer à la retraite",
      },
      {
        title: 'La cession d\'entreprise : un actif retraite à part entière',
        content: "Pour de nombreux chefs d'entreprise, la **cession de l'entreprise** est le principal actif retraite. Les exonérations de plus-value professionnelle (art. 238 quindecies CGI pour les petites entreprises, art. 150-0 D ter pour les dirigeants) peuvent réduire significativement la fiscalité de la cession.\n\nIl est recommandé de préparer la cession 3 à 5 ans à l'avance avec un avocat fiscaliste et un notaire.",
      },
    ],
    faq: [
      { q: "Quel statut est le plus avantageux pour la retraite : SARL ou SAS ?", a: "Le président de SAS (assimilé-salarié) a généralement une meilleure protection retraite car il cotise au régime général (meilleur taux de remplacement). Le gérant de SARL (TNS) paie moins de cotisations mais reçoit moins à la retraite. Le choix dépend aussi des revenus ciblés et de la stratégie patrimoniale globale." },
      { q: "Un chef d'entreprise peut-il se constituer une retraite via son entreprise ?", a: "Oui. Via un PER collectif avec abondement, l'intéressement et la participation (déductibles des charges), ou en se versant une rémunération générant des cotisations retraite. Pour les TNS, le PER individuel est souvent la solution la plus simple et efficace fiscalement." },
      { q: "Comment la cession d'entreprise est-elle taxée et optimisée ?", a: "La plus-value de cession peut être exonérée partiellement ou totalement selon le régime fiscal choisi (art. 151 septies pour les petites entreprises, départ à la retraite sous conditions — art. 150-0 D ter). Un accompagnement fiscal spécialisé est indispensable pour optimiser la sortie." },
      { q: "Un dirigeant qui ne se verse pas de salaire cotise-t-il pour la retraite ?", a: "Très peu. Un gérant majoritaire de SARL qui ne se verse pas de rémunération verse des cotisations minimales forfaitaires à la SSI (~1 100 €/an en 2026) qui génèrent quelques droits. Un président de SAS non rémunéré ne cotise pas du tout au régime général." },
    ],
  },

  'auto-entrepreneur': {
    slug: 'auto-entrepreneur',
    icon: '💻',
    title: 'Retraite auto-entrepreneur',
    subtitle: 'SSI · Micro-entrepreneur · Cotisations sur chiffre d\'affaires',
    metaTitle: "Retraite auto-entrepreneur 2026 — SSI, points retraite et optimisation",
    metaDesc: "Guide retraite auto-entrepreneur (micro-entrepreneur) 2026 : SSI, cotisations sur CA, validation des trimestres, points accumulés et stratégie pour améliorer sa pension.",
    intro: "Les auto-entrepreneurs (micro-entrepreneurs) cotisent à la Sécurité Sociale des Indépendants (SSI) via un prélèvement sur leur chiffre d'affaires. Les cotisations retraite sont proportionnelles au CA déclaré, ce qui génère souvent peu de droits si le CA est faible.",
    simulateurPath: '/simulateurs/independants',
    simulateurLabel: 'Simulateur Retraite Indépendants',
    stats: [
      { label: 'Cotisation retraite base', value: '~12 % du CA', note: 'pour les activités BIC vente' },
      { label: 'Cotisation retraite base', value: '~22 % du CA', note: 'pour les prestations de services' },
      { label: 'Âge légal', value: '64 ans', note: 'réforme 2023' },
      { label: 'Trimestres', value: 'Proratisés', note: 'selon CA annuel / seuil SMIC' },
    ],
    sections: [
      {
        title: "Comment les cotisations retraite sont-elles calculées pour un auto-entrepreneur ?",
        content: "Un auto-entrepreneur ne cotise pas sur un revenu net mais sur son **chiffre d'affaires brut** :\n- Activités de vente de marchandises : ~12 % du CA (dont ~6 % pour la retraite de base + complémentaire)\n- Prestations de services BIC : ~21 % du CA\n- Professions libérales BNC : ~22 % du CA\n\nCes taux incluent toutes les cotisations sociales, pas seulement la retraite.",
      },
      {
        title: 'Validation des trimestres : le piège du CA insuffisant',
        content: "Pour valider 4 trimestres dans une année, un auto-entrepreneur doit réaliser un CA suffisant :\n- Vente de marchandises : ~**32 500 €/an** de CA\n- Prestations de services : ~**18 500 €/an** de CA\n\nEn dessous de ces seuils, les trimestres sont proratisés. Un auto-entrepreneur avec un petit CA complémentaire validera moins de 4 trimestres par an.",
      },
      {
        title: 'Stratégies pour améliorer sa retraite en micro-entreprise',
        content: "Face à des droits retraite souvent limités :\n\n**PER individuel** : déductible des revenus (même en régime micro), plafond de déduction basé sur les revenus déclarés (BIC/BNC après abattement)\n\n**Passage en régime réel** : si les charges réelles dépassent l'abattement forfaitaire, un passage en régime réel permet de déduire plus et de cotiser sur un revenu net plus proche de la réalité économique",
      },
    ],
    faq: [
      { q: "Un auto-entrepreneur avec un petit CA aura-t-il vraiment une retraite ?", a: "Peu. Un auto-entrepreneur réalisant 10 000 €/an de CA en prestations de services valide environ 2 trimestres par an et génère une pension très faible. Il est indispensable d'épargner par ailleurs (PER, assurance-vie) pour compenser ce déficit de cotisations." },
      { q: "Peut-on être auto-entrepreneur et salarié en même temps pour la retraite ?", a: "Oui. Un auto-entrepreneur salarié par ailleurs cotise aux deux régimes : SSI pour son activité micro et régime général CNAV + Agirc-Arrco pour son salariat. Les droits s'accumulent dans les deux régimes, mais les cotisations SSI restent prélevées sur le CA micro, même si des droits CNAV sont déjà en cours." },
      { q: "Comment valider 4 trimestres par an en auto-entrepreneur ?", a: "Il faut dépasser le seuil de validation : ~18 500 € de CA annuel pour les prestations de services, ~32 500 € pour la vente de marchandises. En dessous, les trimestres sont proratisés (1 trimestre pour 4 625 € de CA en services en 2026)." },
      { q: "L'abattement forfaitaire du micro-régime réduit-il les droits retraite ?", a: "Non. Les cotisations SSI d'un auto-entrepreneur sont calculées sur le CA brut (pas après abattement). L'abattement n'a d'impact que sur l'impôt sur le revenu. Les droits retraite sont donc proportionnels au CA déclaré, sans réduction liée à l'abattement forfaitaire." },
    ],
  },

  intermittent: {
    slug: 'intermittent',
    icon: '🎭',
    title: 'Retraite intermittent du spectacle',
    subtitle: 'CNAV + Audiens · Régime général + Assurance chômage spécifique',
    metaTitle: 'Retraite intermittent du spectacle 2026 — CNAV, Audiens et calcul',
    metaDesc: "Guide retraite intermittent du spectacle 2026 : CNAV régime général, Audiens (retraite complémentaire spécifique), validation des heures, cachets et droits à la retraite.",
    intro: "Les intermittents du spectacle (artistes, techniciens) cotisent au régime général CNAV et au régime complémentaire Audiens. Leur retraite est calculée comme celle de tout salarié du secteur privé, mais la validation des trimestres dépend des cachets et heures travaillées.",
    simulateurPath: '/simulateurs/cnav',
    simulateurLabel: 'Simulateur Retraite CNAV',
    stats: [
      { label: 'Régime de base', value: 'CNAV', note: 'régime général salarié' },
      { label: 'Complémentaire', value: 'Audiens', note: 'caisse spécifique spectacle' },
      { label: 'Âge légal', value: '64 ans', note: 'réforme 2023' },
      { label: 'Validation trimestre', value: '150 × SMIC', note: 'horaire de cachets bruts' },
    ],
    sections: [
      {
        title: 'Comment valider des trimestres en intermittence ?',
        content: "Pour valider 1 trimestre, un intermittent doit percevoir des **cachets ou salaires bruts équivalents à 150 fois le SMIC horaire** (environ 1 625 € brut en 2026). Pour 4 trimestres par an, il faut donc 6 500 € brut de cachets annuels.\n\nLes **allocations chômage** (allocation d'aide au retour à l'emploi, ARE) versées par Unédic au titre du régime spécifique intermittents ne génèrent pas de trimestres cotisés — elles génèrent des trimestres assimilés.",
      },
      {
        title: 'Audiens : la caisse de retraite complémentaire du spectacle',
        content: "**Audiens** est le groupe de protection sociale du spectacle, audiovisuel, communication et publicité. Elle gère la retraite complémentaire des intermittents (et autres salariés du secteur) selon les règles Agirc-Arrco.\n\nLes droits Audiens s'accumulent exactement comme les droits Agirc-Arrco de tout salarié privé. Pas de régime spécial — simplement une caisse déléguée pour le secteur.",
      },
      {
        title: 'Les périodes de chômage : trimestres assimilés',
        content: "Les périodes d'indemnisation chômage (ARE) donnent droit à des **trimestres assimilés**, non cotisés. Ces trimestres comptent pour la durée d'assurance (taux plein) mais pas pour le salaire de référence (calcul de la pension de base CNAV).\n\nUn intermittent avec beaucoup de périodes chômage peut avoir la durée requise mais une pension de base faible, calculée sur les 25 meilleures années de revenus réels.",
      },
    ],
    faq: [
      { q: "Les allocations chômage des intermittents donnent-elles des droits retraite ?", a: "Oui, des trimestres assimilés (pas cotisés). Ils comptent pour atteindre la durée d'assurance requise mais n'entrent pas dans le calcul du salaire annuel moyen pour la pension de base CNAV. L'impact sur le montant de la pension est donc limité." },
      { q: "Un intermittent avec peu de cachets aura-t-il une bonne retraite ?", a: "Rarement. Peu de cachets = peu de cotisations = trimestres partiels et salaire annuel moyen bas. Le calcul CNAV sur les 25 meilleures années peut donner une pension très faible. Il est conseillé de compléter avec un PER individuel dès les premières années d'activité." },
      { q: "Comment Audiens calcule-t-il la retraite complémentaire d'un intermittent ?", a: "Audiens applique exactement les règles Agirc-Arrco : les cotisations sur les cachets achètent des points de retraite. Le nombre de points multiplié par la valeur du point (révisée chaque année) donne la pension complémentaire." },
      { q: "Un intermittent peut-il racheter des trimestres ?", a: "Oui, comme tout assuré au régime général. Le rachat de trimestres (pour des années incomplètes) est possible auprès de la CNAV. Le coût dépend de l'âge et du revenu de référence. C'est souvent utile pour les intermittents avec beaucoup de trimestres partiels." },
    ],
  },

  expatrie: {
    slug: 'expatrie',
    icon: '✈️',
    title: 'Retraite expatrié',
    subtitle: 'CFE · Caisse des Français de l\'Étranger · Conventions bilatérales',
    metaTitle: "Retraite expatrié français 2026 — CFE, conventions bilatérales et droits",
    metaDesc: "Guide retraite expatrié français 2026 : CFE (cotisations volontaires), conventions bilatérales de sécurité sociale, totalisation des périodes et rapatriement des droits étrangers.",
    intro: "Les Français travaillant à l'étranger peuvent cotiser volontairement à la CFE (Caisse des Français de l'Étranger) pour maintenir leurs droits à la retraite en France. Les conventions bilatérales de sécurité sociale permettent aussi de totaliser les périodes cotisées à l'étranger.",
    simulateurPath: '/simulateurs/cnav',
    simulateurLabel: 'Simulateur Retraite CNAV',
    stats: [
      { label: 'CFE volontaire', value: 'Opt-in', note: 'cotisation facultative pour les expatriés' },
      { label: 'Conventions', value: '40+ pays', note: 'accords bilatéraux de sécurité sociale' },
      { label: 'Totalisation', value: 'Possible', note: 'cumul des périodes franco-étrangères' },
      { label: 'Âge légal', value: '64 ans', note: 'pour la pension CNAV' },
    ],
    sections: [
      {
        title: 'La CFE : cotiser en France depuis l\'étranger',
        content: "La **CFE (Caisse des Français de l'Étranger)** propose une affiliation volontaire aux Français résidant à l'étranger. Cela permet de continuer à cotiser à l'assurance vieillesse française (CNAV) pendant la période d'expatriation, pour ne pas perdre de droits à la retraite.\n\nLes cotisations CFE sont calculées sur la base d'un revenu forfaitaire ou réel selon l'option choisie. L'adhésion est individuelle et doit être faite dans les 6 mois du départ de France.",
      },
      {
        title: "Conventions bilatérales : totaliser les périodes cotisées à l'étranger",
        content: "La France a signé des **conventions bilatérales de sécurité sociale** avec plus de 40 pays (UE, USA, Canada, Japon, Maroc, Sénégal…). Ces accords permettent la **totalisation des périodes** : les années cotisées à l'étranger sont prises en compte pour le calcul du taux plein en France.\n\nSans convention, les années à l'étranger sont perdues du point de vue de la durée d'assurance CNAV.",
      },
      {
        title: 'Rapatriement des droits retraite étrangers',
        content: "Un expatrié rentrant en France après plusieurs années à l'étranger dispose de droits à la retraite dans chaque pays où il a cotisé. Chaque caisse étrangère verse sa pension propre à l'âge légal du pays concerné. Il n'est pas possible de transférer des droits étrangers vers la CNAV — chaque régime verse sa partie indépendamment.",
      },
    ],
    faq: [
      { q: "Faut-il s'affilier à la CFE pour conserver ses droits retraite quand on part à l'étranger ?", a: "Ce n'est pas obligatoire mais fortement conseillé pour les longues expatriations. Sans CFE ni convention bilatérale, les années à l'étranger ne génèrent aucun trimestre en France. L'adhésion doit se faire dans les 6 mois du départ." },
      { q: "Comment fonctionne la totalisation des périodes avec les pays de l'UE ?", a: "Dans l'Union européenne, les périodes cotisées dans n'importe quel État membre sont totalisables pour le calcul du taux plein en France. Chaque pays calcule sa pension sur les années réellement cotisées chez lui, mais utilise le total international pour déterminer si le taux plein est atteint." },
      { q: "Un expatrié peut-il racheter des trimestres non cotisés pour les années à l'étranger ?", a: "Oui. Les Français ayant travaillé à l'étranger sans convention bilatérale peuvent racheter des trimestres auprès de la CNAV (rachat pour périodes à l'étranger). Le coût dépend de l'âge et du revenu de référence — cette option est souvent très utile au retour en France." },
      { q: "Un expatrié rentrant en France à 55 ans peut-il encore cotiser suffisamment pour la retraite ?", a: "Oui. S'il reprend une activité salariée ou indépendante en France, il cotise au régime général jusqu'à 64 ans (ou plus). Avec les trimestres CNAV, les éventuels trimestres CFE, et les périodes étrangères totalisées via conventions, il peut atteindre le taux plein." },
    ],
  },

  diplomate: {
    slug: 'diplomate',
    icon: '🏳️',
    title: 'Retraite diplomate',
    subtitle: "Service des retraites de l'État · Fonction Publique d'État · Corps diplomatique",
    metaTitle: 'Retraite diplomate fonctionnaire 2026 — SRE, bonifications et calcul',
    metaDesc: "Guide retraite diplomate 2026 : Fonction Publique d'État, Service des retraites de l'État (SRE), bonifications pour services à l'étranger, calcul sur traitement indiciaire.",
    intro: "Les diplomates français (ambassadeurs, conseillers, agents du Quai d'Orsay) sont des fonctionnaires de l'État relevant du Service des retraites de l'État (SRE). Leur pension est calculée sur le traitement indiciaire brut avec des bonifications spécifiques pour les services à l'étranger.",
    simulateurPath: '/simulateurs/fonction-publique',
    simulateurLabel: 'Simulateur Retraite Fonction Publique',
    stats: [
      { label: 'Âge légal', value: '64 ans', note: 'FPE catégorie sédentaire' },
      { label: 'Taux maximum', value: '75 %', note: 'du traitement indiciaire brut' },
      { label: 'Bonifications', value: 'Variables', note: 'selon zones géographiques et fonctions' },
      { label: 'Durée requise', value: '172 trimestres', note: 'nés en 1965+' },
    ],
    sections: [
      {
        title: 'Régime des fonctionnaires d\'État : SRE et RAFP',
        content: "Les diplomates sont des fonctionnaires de l'État en catégorie sédentaire. Leur pension est gérée par le **Service des retraites de l'État (SRE)** selon les règles de la FPE :\n\n- Pension calculée sur le **traitement indiciaire brut** (hors primes, indemnités de résidence à l'étranger, IHRSS…)\n- Taux maximum : 75 % du traitement indiciaire\n- Durée requise : 172 trimestres (nés en 1965+)\n- Le **RAFP** prend en charge les primes et indemnités",
      },
      {
        title: 'Bonifications pour services à l\'étranger',
        content: "Les diplomates bénéficient de **bonifications de durée d'assurance** pour les services accomplis à l'étranger. Ces bonifications varient selon :\n- La **zone géographique** (zones à risques, pays en développement, postes difficiles)\n- La **nature des fonctions** (ambassadeur, consul, chef de mission…)\n- La durée de la mission\n\nCes bonifications peuvent représenter plusieurs années de durée d'assurance supplémentaire.",
      },
      {
        title: 'Indemnités à l\'étranger et RAFP',
        content: "Les diplomates reçoivent des **indemnités de résidence à l'étranger** (IRE) et d'autres allocations spécifiques qui ne rentrent pas dans le calcul de la pension de base. Ces indemnités alimentent partiellement le **RAFP** (dans la limite de 20 % du traitement brut).\n\nLa différence entre le traitement en France et les indemnités à l'étranger est souvent importante — ce qui explique l'intérêt d'une épargne personnelle complémentaire pendant les postes à l'étranger.",
      },
    ],
    faq: [
      { q: "Les années passées à l'étranger comptent-elles doublement pour la retraite d'un diplomate ?", a: "Non, pas automatiquement. Les diplomates bénéficient de bonifications de durée d'assurance selon les zones et les missions, mais pas d'un doublement systématique. Les règles précises dépendent du corps et des textes réglementaires applicables à chaque poste." },
      { q: "Les indemnités de résidence à l'étranger sont-elles prises en compte dans la pension ?", a: "Non. Seul le traitement indiciaire brut entre dans le calcul de la pension de base. Les indemnités de résidence à l'étranger, les allocations de séjour et autres avantages en nature n'entrent pas dans la pension de base — ils alimentent partiellement le RAFP." },
      { q: "Un diplomate peut-il bénéficier des congés bonifiés pour sa retraite ?", a: "Les congés bonifiés (accordés aux fonctionnaires originaires des DOM-TOM) peuvent, selon les conditions, être assimilés à des services effectifs et donc comptabilisés dans la durée d'assurance. Les règles précises dépendent du statut particulier de chaque agent." },
      { q: "À quel âge un ambassadeur doit-il partir à la retraite ?", a: "La limite d'âge pour les ambassadeurs et les agents du corps diplomatique est généralement fixée à 67 ans (comme pour les hauts fonctionnaires de l'État), sauf dérogation. L'âge légal de départ reste 64 ans depuis la réforme 2023." },
    ],
  },

};

export const METIERS_LIST = Object.values(METIERS);
export const METIERS_BY_SLUG = METIERS;


