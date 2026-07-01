// Centralized FAQ data keyed by route. Imported by:
//   - src/pages/simulateurs/*.jsx (accordion UI via FaqSection)
//   - api/_routes.js (FAQPage JSON-LD injected into <head> at build time)
// NOTE: BE-specific routes use suffix -be (e.g. /simulateurs/succession-be)
// to distinguish them from their FR counterparts when the content differs.

export const FAQS = {
  '/simulateurs/agirc-arrco': [
  { q: "Quand est versée la retraite complémentaire Agirc-Arrco ?", a: "La pension complémentaire est versée mensuellement, à compter du premier jour du mois suivant la date d'effet de votre retraite. Elle est versée simultanément à votre retraite de base (CNAV). Comptez 3 à 6 mois entre la demande et les premiers paiements, le temps de la liquidation du dossier." },
  { q: "Puis-je partir à la retraite avant 67 ans avec l'Agirc-Arrco ?", a: "Oui, dès 62 ans (ou 60 ans en carrière longue). Mais sans avoir atteint le taux plein, un coefficient de solidarité de −10 % s'applique pendant 3 ans sur votre pension complémentaire. Pour l'éviter : attendre 67 ans, ou différer votre départ d'un an pour bénéficier d'un bonus de +10 % pendant 1 an. Exceptions : inaptes, invalides, bénéficiaires de l'AAH ou ayant au moins 4 trimestres de chômage non indemnisé." },
  { q: "Comment sont revalorisés les points Agirc-Arrco chaque année ?", a: "Chaque novembre, les partenaires sociaux (syndicats et patronat) révisent la valeur de service du point. Elle évolue en principe comme l'inflation (indice des prix à la consommation hors tabac) pour préserver le pouvoir d'achat des retraités. En 2026, la valeur de service est fixée à 1,4098 €/point." },
  { q: "Qu'est-ce que le coefficient de solidarité de −10 % ?", a: "Introduit en 2019, c'est une minoration temporaire de votre pension complémentaire pendant 3 ans si vous partez sans avoir atteint le taux plein. Son objectif est d'inciter les salariés à travailler au moins un trimestre de plus. Il ne s'applique pas aux personnes inaptes, invalides, bénéficiaires de l'AAH ou ayant au moins 4 trimestres de chômage non indemnisé." },
  { q: "Les fonctionnaires cotisent-ils à l'Agirc-Arrco ?", a: "Non. L'Agirc-Arrco est exclusivement réservé aux salariés du secteur privé et aux contractuels de droit privé. Les fonctionnaires titulaires relèvent du RAFP (Régime de retraite additionnelle de la Fonction Publique), qui fonctionne aussi par points mais est géré séparément." },
  { q: "Puis-je cumuler emploi et retraite Agirc-Arrco ?", a: "Oui. En cumul emploi-retraite total (toutes retraites liquidées), aucun plafond de revenus ne s'applique et les nouvelles cotisations génèrent des droits supplémentaires depuis 2023. En cumul partiel (retraite anticipée sans taux plein), vos revenus cumulés ne doivent pas dépasser 160 % du SMIC ou votre dernier salaire." },
  { q: "Comment consulter mes points Agirc-Arrco accumulés ?", a: "Sur info-retraite.fr (Relevé de Situation Individuelle gratuit) ou directement sur agirc-arrco.fr après création d'un espace personnel. Un relevé vous est automatiquement envoyé tous les 5 ans à partir de 35 ans." },
  { q: "La retraite complémentaire Agirc-Arrco est-elle imposable ?", a: "Oui, elle est soumise à l'impôt sur le revenu comme la retraite de base. Les prélèvements sociaux s'élèvent à environ 10,1 % pour la plupart des retraités : CSG (8,3 %), CRDS (0,5 %), Casa (0,3 %) et cotisation maladie (1 %). C'est pourquoi notre simulateur affiche une pension nette à 83 % de la pension brute." },
],

  '/simulateurs/assurance-vie': [
      { q: "Comment fonctionne un contrat d'assurance-vie ?", a: "L'assurance-vie est une enveloppe d'épargne dans laquelle vous versez librement des sommes investies sur un fonds en euros (capital garanti, rendement modéré) et/ou des unités de compte (potentiellement plus rémunératrices mais risquées). Les sommes restent disponibles : vous pouvez effectuer des rachats à tout moment. La fiscalité ne s'applique qu'aux gains, lors d'un rachat." },
      { q: "Pourquoi le cap des 8 ans est-il décisif ?", a: "Après 8 ans de détention, vous bénéficiez d'un abattement annuel sur les gains rachetés de 4 600 € (personne seule) ou 9 200 € (couple soumis à imposition commune). Au-delà de l'abattement, les gains issus de primes ≤ 150 000 € sont taxés à seulement 7,5 % d'impôt (au lieu de 12,8 %), auxquels s'ajoutent les prélèvements sociaux de 17,2 %. Avant 8 ans, les gains subissent le PFU de 30 %." },
      { q: "PFU ou barème de l'impôt sur le revenu ?", a: "Par défaut, les gains des contrats sont soumis au prélèvement forfaitaire unique (PFU). Mais vous pouvez opter, lors de la déclaration, pour l'imposition au barème progressif de l'impôt sur le revenu si elle vous est plus favorable (typiquement si votre TMI est de 0 % ou 11 %). Cette option est globale et s'applique à l'ensemble de vos revenus de capitaux mobiliers de l'année." },
      { q: "Les prélèvements sociaux de 17,2 % sont-ils toujours dus ?", a: "Oui. Quel que soit l'âge du contrat, les prélèvements sociaux de 17,2 % s'appliquent aux gains. Sur le fonds en euros, ils sont généralement prélevés chaque année « au fil de l'eau » ; sur les unités de compte, ils sont prélevés lors du rachat ou du dénouement. L'abattement après 8 ans ne concerne que la part « impôt sur le revenu », pas les prélèvements sociaux." },
      { q: "Quel est l'avantage successoral de l'assurance-vie ?", a: "L'assurance-vie est un outil de transmission privilégié. Pour les versements effectués avant vos 70 ans, chaque bénéficiaire désigné profite d'un abattement de 152 500 € sur les capitaux transmis, au-delà duquel s'applique une taxation forfaitaire. Les sommes sont transmises hors succession dans la limite de ces règles, ce qui en fait un dispositif très utilisé pour organiser sa transmission." },
      { q: "Ce simulateur est-il officiel ?", a: "Non. Il s'agit d'une estimation indicative basée sur les paramètres fiscaux 2025. Le calcul suppose un rendement constant et net de frais de gestion, des versements postérieurs à 2017 et des primes inférieures à 150 000 €. La fiscalité réelle dépend de votre situation et des dates exactes de versement. Rapprochez-vous de votre assureur ou d'un conseiller." },
    ],

  '/simulateurs/budget': [
  { q: "Qu'est-ce que la règle des 50/30/20 ?", a: "La règle 50/30/20 propose d'allouer 50 % des revenus nets aux besoins essentiels (logement, alimentation, transport), 30 % aux envies (loisirs, restaurants, abonnements) et 20 % à l'épargne ou au remboursement de dettes." },
  { q: "Doit-on viser exactement 50 % pour les besoins ?", a: "Non, c'est un objectif indicatif. Dans des villes chères où le loyer dépasse 40 % du salaire, il est normal d'ajuster : réduire la part « envies » ou augmenter les revenus à terme. L'important est de maintenir une épargne positive." },
  { q: "Quels montants compter dans les « besoins » ?", a: "Tout ce qui est incompressible : loyer ou crédit immobilier, charges (électricité, eau, internet), assurances obligatoires, transports domicile-travail, alimentation de base et remboursements de prêts en cours." },
  { q: "Comment améliorer mon taux d'épargne ?", a: "Deux leviers : réduire les dépenses variables (surtout les envies) ou augmenter vos revenus. Un taux d'épargne de 10 % est un bon départ ; 20 % ou plus accélère significativement la constitution d'un patrimoine à long terme." },
  { q: "Le simulateur tient-il compte des impôts ?", a: "Non, entrez vos revenus nets mensuels après impôts et prélèvements sociaux. Si vous êtes salarié, utilisez directement le net fiscal ou le net perçu après prélèvement à la source." },
  { q: "Quelle est la différence entre épargne de précaution et investissement ?", a: "L'épargne de précaution (3 à 6 mois de charges sur Livret A ou LDDS) couvre les imprévus sans pénalité. L'investissement à long terme (PEA, assurance-vie, immobilier) vise la croissance du patrimoine et s'effectue une fois le matelas de sécurité constitué." },
],

  '/simulateurs/cnav': [
  { q: "Comment sont calculés les trimestres CNAV ?", a: "Un trimestre est validé pour chaque tranche de salaire équivalant à 150 fois le SMIC horaire brut, quel que soit le nombre de jours travaillés. En 2025, il faut gagner environ 1 690 € brut par trimestre pour valider un trimestre. On peut valider au maximum 4 trimestres par année civile." },
  { q: "Comment est calculé le Salaire Annuel Moyen (SAM) ?", a: "Le SAM est la moyenne de vos 25 meilleures années de salaire brut, chaque année étant plafonnée au PASS (Plafond Annuel de la Sécurité Sociale, soit 48 060 € en 2026). Ce simulateur utilise votre salaire actuel comme approximation. Pour un calcul précis, consultez votre relevé de carrière sur info-retraite.fr." },
  { q: "Qu'est-ce que le taux plein à la CNAV ?", a: "Le taux plein (50 % du SAM) est accordé lorsque vous cumulez le nombre de trimestres requis (entre 167 et 172 selon votre année de naissance) ET que vous avez atteint l'âge légal de départ (62 à 64 ans selon la génération). Il est aussi accordé automatiquement à 67 ans, quelle que soit la durée de cotisation." },
  { q: "Qu'est-ce que la décote et la surcote CNAV ?", a: "Si vous partez avant d'avoir tous vos trimestres et avant 67 ans, une décote de 0,625 % par trimestre manquant s'applique, dans la limite de 20 trimestres (soit −12,5 % maximum). À l'inverse, chaque trimestre cotisé après l'obtention du taux plein génère une surcote de +1,25 %, sans plafond." },
  { q: "Qu'est-ce que le minimum contributif ?", a: "Le minimum contributif est un plancher de pension CNAV garanti aux assurés ayant cotisé toute leur carrière sur de faibles revenus. En 2025, il s'élève à 879,31 €/mois pour une carrière complète (majoré à 963,13 € si vous avez cotisé au moins 120 trimestres sur la base du salaire réel)." },
  { q: "Comment fonctionne la retraite progressive CNAV ?", a: "La retraite progressive permet de percevoir une fraction de sa pension tout en continuant à travailler à temps partiel. Elle est accessible dès 60 ans (62 ans à terme) avec au moins 150 trimestres validés. La fraction de pension est égale à la quotité de temps non travaillé. C'est une solution pour aménager sa fin de carrière en douceur." },
],

  '/simulateurs/cnavpl': [
  { q: "Qu'est-ce que la CNAVPL ?", a: "La Caisse Nationale d'Assurance Vieillesse des Professions Libérales gère la retraite de base de tous les professionnels libéraux non membres de sections spécifiques (avocats, médecins, notaires, etc. ont leurs propres caisses). Elle couvre notamment les consultants, formateurs, architectes, et autres libéraux non réglementés." },
  { q: "Comment se calculent les points CNAVPL ?", a: "Les cotisations versées à la CNAVPL achètent des points selon un rapport cotisation/valeur d'achat annuel. En 2025, la valeur d'achat d'un point est de 7,04 €. La pension annuelle = nombre de points × valeur de service (0,5714 €/point en 2025). Le nombre de points dépend du revenu professionnel et de la durée de cotisation." },
  { q: "Quelle est la différence entre CNAVPL et les sections professionnelles ?", a: "La CNAVPL gère la retraite de BASE des libéraux non réglementés. Chaque profession réglementée a sa section autonome (CIPAV pour les architectes/consultants, CARMF pour les médecins, CNBF pour les avocats, etc.) qui gèrent à la fois la retraite de base et complémentaire propre à la profession." },
  { q: "Peut-on racheter des trimestres à la CNAVPL ?", a: "Oui, les libéraux peuvent racheter jusqu'à 12 trimestres d'études supérieures ou de début de carrière (années incomplètes). Le coût dépend de l'âge au rachat et du revenu. Deux options : rachat « taux seul » (améliore la décote) ou « taux et durée » (plus coûteux mais améliore aussi le calcul de la pension)." },
  { q: "Comment est calculée la retraite de base des libéraux ?", a: "Comme pour le régime général (CNAV), la pension de base des libéraux = SAM (Salaire Annuel Moyen des 25 meilleures années) × taux (50 % au taux plein) × (trimestres cotisés / trimestres requis pour le taux plein). La durée requise dépend de l'année de naissance (168 à 172 trimestres selon la génération)." },
  { q: "Les libéraux ont-ils droit à la retraite complémentaire ?", a: "Oui. En plus de la retraite de base (CNAVPL ou section), tous les libéraux cotisent à une retraite complémentaire : pour les non-réglementés, c'est la CIPAV (pour la plupart) ou la complémentaire de la section. La pension complémentaire s'exprime en points, valorisés à la liquidation." },
],

  '/simulateurs/comparaison-reforme': [
  {
    q: "Qu'est-ce que la réforme des retraites de 2023 (loi Borne) ?",
    a: "La loi Borne, promulguée le 14 avril 2023, relève progressivement l'âge légal de départ à la retraite de 62 à 64 ans selon l'année de naissance. Elle augmente également la durée de cotisation requise pour obtenir le taux plein. La montée en charge est progressive : les personnes nées à partir de 1967 sont les premières à être pleinement concernées par l'âge légal à 64 ans.",
  },
  {
    q: "À quel âge puis-je partir à la retraite après la réforme ?",
    a: "L'âge légal dépend de votre année de naissance : 62 ans pour les personnes nées avant 1962, puis il augmente progressivement de 3 mois par génération pour atteindre 64 ans pour les personnes nées en 1967 et après. Avant réforme, l'âge légal était de 62 ans pour toutes les générations.",
  },
  {
    q: "La réforme impacte-t-elle le montant de ma pension ?",
    a: "Indirectement, oui. Si vous deviez partir avant 62 ans dans le système antérieur, la réforme repousse votre départ et peut légèrement augmenter votre pension via une proratisation plus favorable. Mais pour la majorité, qui partait déjà à 62 ans ou plus, l'impact est surtout un allongement de la durée de travail. Le montant de la pension au taux plein reste calculé selon la même formule (SAM × 50 % × prorata).",
  },
  {
    q: "Qu'est-ce que le taux plein et la décote ?",
    a: "Le taux plein (50 % du Salaire Annuel Moyen, plafonné au PASS) est accordé quand vous avez cumulé le nombre de trimestres requis ET atteint l'âge légal. Si vous partez avant d'avoir tous vos trimestres, une décote de 0,625 % par trimestre manquant s'applique (max 20 trimestres, soit −12,5 %). Le taux plein est automatique à 67 ans, quelle que soit la durée cotisée.",
  },
  {
    q: "Quelles sont les exceptions à la réforme de 2023 ?",
    a: "Plusieurs dispositifs dérogatoires subsistent : le dispositif Retraite Anticipée pour Carrières Longues (RACL) permet aux personnes ayant commencé à travailler avant 21 ans de partir à 60 ans (avant 17 ans → 58 ans). Les personnes en invalidité, inaptitude au travail, ou exposées à des facteurs de pénibilité bénéficient aussi de règles spécifiques. Les fonctionnaires en catégorie active ont leurs propres barèmes.",
  },
],

  '/simulateurs/cout-en-heures': [
      { q: "Pourquoi parler de « vie » plutôt que d'argent ?", a: "L'argent est une ressource renouvelable, le temps ne l'est pas. Convertir un prix en heures de travail permet de mieux évaluer si un achat en vaut vraiment la peine. Cette idée vient du livre « Your Money or Your Life » de Vicki Robin." },
      { q: "Pourquoi diviser par 52 semaines ?", a: "Nous utilisons 52 semaines par an pour calculer votre taux horaire : (salaire mensuel × mois travaillés) ÷ 52 semaines ÷ heures par semaine. Si vous travaillez 11 mois, ajustez le paramètre correspondant." },
      { q: "Les charges sociales sont-elles incluses ?", a: "Ce simulateur utilise votre salaire net (après charges et impôts). C'est le seul montant qui compte pour vous : c'est l'argent que vous pouvez réellement dépenser ou épargner." },
      { q: "Comment utiliser ce simulateur au quotidien ?", a: "Avant tout achat non essentiel, calculez son coût en heures. Si un restaurant à 80 € représente 4 heures de votre vie, vous décidez en conscience. Avec le temps, cette habitude transforme votre relation à la dépense." },
    ],

  '/simulateurs/credit-conso': [
      {
        q: "Quelle différence entre TAEG et taux nominal ?",
        a: "Le taux nominal (ou taux débiteur) ne reflète que les intérêts du prêt. Le TAEG (Taux Annuel Effectif Global) intègre, en plus des intérêts, l'ensemble des frais obligatoires : frais de dossier, frais de garantie et, le cas échéant, l'assurance si elle est exigée. C'est le TAEG qui permet de comparer objectivement deux offres de crédit, car il reflète le coût réel total.",
      },
      {
        q: "Qu'est-ce que le taux d'usure ?",
        a: "Le taux d'usure est le TAEG maximum légal qu'un prêteur peut appliquer. Il est révisé chaque trimestre par la Banque de France et varie selon le type de crédit, le montant emprunté et la durée. Tout crédit proposé à un taux supérieur est considéré comme usuraire et donc illégal. Ce plafond protège les emprunteurs contre des conditions abusives.",
      },
      {
        q: "Comment la durée influence-t-elle le coût ?",
        a: "Allonger la durée réduit la mensualité, ce qui soulage le budget mensuel, mais augmente mécaniquement le coût total du crédit : vous payez des intérêts plus longtemps. À l'inverse, une durée courte fait grimper la mensualité mais réduit fortement les intérêts. Il faut arbitrer entre confort de remboursement et coût global.",
      },
      {
        q: "L'assurance emprunteur est-elle obligatoire ?",
        a: "Pour un crédit à la consommation, l'assurance emprunteur (décès, invalidité, parfois perte d'emploi) est généralement facultative, contrairement au crédit immobilier où elle est exigée en pratique. Elle augmente la mensualité mais sécurise le remboursement en cas d'aléa. Vous restez libre de l'accepter ou non, et de choisir un autre assureur que le prêteur.",
      },
      {
        q: "Quelle différence avec un crédit immobilier ?",
        a: "Le crédit à la consommation finance des biens ou besoins courants (voiture, travaux, trésorerie) pour des montants plafonnés (jusqu'à 75 000 €) et des durées plus courtes (souvent 12 à 84 mois). Le crédit immobilier finance l'achat d'un logement sur des montants et des durées bien plus importants, avec une garantie hypothécaire et une assurance obligatoire. Les TAEG et les règles diffèrent sensiblement.",
      },
      {
        q: "Ce simulateur est-il officiel ?",
        a: "Non. Il s'agit d'une estimation indicative basée sur une mensualité d'amortissement constant. Le coût réel dépend du TAEG effectivement accordé, des frais annexes et de l'assurance choisie. Le tableau d'amortissement est simplifié (lignes annuelles). Rapprochez-vous d'un établissement prêteur pour une offre personnalisée et un TAEG conforme au taux d'usure en vigueur.",
      },
    ],

  '/simulateurs/deficit-foncier': [
  {
    q: "Qu'est-ce que le déficit foncier et comment fonctionne-t-il ?",
    a: "Le déficit foncier est le résultat négatif obtenu quand les charges d'un bien immobilier loué (intérêts d'emprunt, travaux, frais de gestion, taxe foncière…) dépassent les loyers perçus. Ce déficit peut être déduit du revenu global imposable dans la limite de 10 700 € par an (ou 21 400 € dans certains dispositifs). Le surplus est reportable sur les revenus fonciers des 10 années suivantes. C'est un puissant levier de réduction d'impôt pour les investisseurs immobiliers.",
  },
  {
    q: "Quels travaux sont déductibles en déficit foncier ?",
    a: "Seuls les travaux de réparation, d'entretien et d'amélioration sont déductibles en déficit foncier. Les travaux de construction, reconstruction ou d'agrandissement ne sont pas déductibles (ils augmentent la valeur du bien et relèvent des plus-values). Exemples de travaux déductibles : réfection de toiture, remplacement de chaudière, isolation, ravalement de façade, mise aux normes électriques, rénovation de salle de bain. Conservez toutes les factures.",
  },
  {
    q: "Quelle est la limite des 10 700 € et comment s'applique-t-elle ?",
    a: "La limite de 10 700 € représente le maximum de déficit foncier imputable sur votre revenu global (salaires, retraites…) en une seule année. Si votre déficit dépasse cette limite, l'excédent est automatiquement reporté sur vos revenus fonciers des 10 années suivantes. Attention : cette limite concerne uniquement le déficit lié aux travaux et charges autres que les intérêts d'emprunt ; les intérêts d'emprunt, eux, ne peuvent être déduits que des revenus fonciers, sans possibilité d'imputation sur le revenu global.",
  },
  {
    q: "Peut-on cumuler déficit foncier et autres dispositifs fiscaux ?",
    a: "Le déficit foncier s'applique uniquement au régime réel d'imposition des revenus fonciers. Il n'est pas compatible avec le régime micro-foncier (abattement de 30 % sur loyers bruts, accessible si revenus fonciers < 15 000 €). Il peut être utilisé en parallèle avec d'autres dispositifs comme le statut LMNP (location meublée, régime BIC), mais les deux ne se cumulent pas sur un même bien. La loi Denormandie ou Malraux offrent par ailleurs des réductions d'impôt supplémentaires sur certains travaux.",
  },
  {
    q: "Qu'est-ce que le régime « louer abordable » et son plafond de 21 400 € ?",
    a: "Depuis 2022, le dispositif Loc'Avantages (renommé « louer abordable ») permet, sous conditions, de bénéficier d'un plafond de déficit foncier relevé à 21 400 € au lieu de 10 700 €. Pour en bénéficier, le propriétaire doit signer une convention avec l'Anah (Agence Nationale de l'Habitat), louer le bien à un loyer inférieur au marché (de 15 % à 45 % selon le niveau), et réaliser des travaux de rénovation. Ce dispositif cumule l'avantage du déficit foncier majoré et une réduction d'impôt supplémentaire.",
  },
  {
    q: "Les prélèvements sociaux s'appliquent-ils aussi au déficit foncier ?",
    a: "Oui, les prélèvements sociaux (17,2 %) s'appliquent aux revenus fonciers nets positifs. En cas de déficit foncier, il n'y a pas de revenus fonciers imposables, donc pas de prélèvements sociaux à payer sur ces revenus. L'économie calculée par ce simulateur intègre donc l'économie d'IR (à votre TMI) ET l'économie de prélèvements sociaux sur la part de déficit imputée, ce qui majore significativement le bénéfice fiscal réel.",
  },
  {
    q: "Pendant combien de temps peut-on reporter un déficit foncier ?",
    a: "Le déficit foncier non utilisé (partie dépassant 10 700 € ou non imputée) est reportable sur les revenus fonciers des 10 années suivantes. Ce report est automatique et doit être déclaré chaque année. Attention : si vous vendez le bien ou cessez de le louer avant l'expiration des 3 ans suivant l'imputation du déficit, l'administration peut remettre en cause l'avantage fiscal obtenu. Il est donc conseillé de conserver le bien loué pendant au moins 3 ans après la déduction.",
  },
],

  '/simulateurs/divorce': [
  { q: "Qu'est-ce que le régime de communauté réduite aux acquêts ?", a: "C'est le régime matrimonial légal par défaut en France. Les biens acquis pendant le mariage (acquêts) sont communs et partagés 50/50 en cas de divorce. Les biens possédés avant le mariage ou reçus par donation/héritage restent des « propres » qui ne sont pas partagés." },
  { q: "Comment est calculée la pension alimentaire ?", a: "Il n'existe pas de formule légale obligatoire en France, mais le Ministère de la Justice publie un barème indicatif basé sur le revenu net du débiteur et le nombre d'enfants. Le juge reste libre de fixer un montant différent selon la situation réelle de chaque famille. Ce simulateur utilise ce barème indicatif." },
  { q: "La prestation compensatoire est-elle systématique ?", a: "Non. Elle est accordée par le juge uniquement si le divorce crée une disparité significative dans les conditions de vie des époux. Elle prend en compte : la durée du mariage, les sacrifices professionnels consentis, les revenus et patrimoines respectifs, l'âge et l'état de santé. Elle peut être refusée même en cas d'écart de revenus important." },
  { q: "Qu'est-ce que les droits de partage ?", a: "Les droits de partage sont une taxe perçue par l'État lors de la liquidation du régime matrimonial. Depuis 2022, ils sont fixés à 1,1% de la valeur du patrimoine commun partagé (contre 2,5% auparavant). Un bien immobilier commun de 300 000 € génère donc 3 300 € de droits de partage." },
  { q: "Ces estimations sont-elles fiables ?", a: "Ce simulateur donne des ordres de grandeur indicatifs pour vous aider à anticiper votre situation financière. Les montants réels seront fixés par le juge aux affaires familiales ou dans la convention homologuée (divorce par consentement mutuel). Consultez impérativement un avocat spécialisé en droit de la famille pour votre situation." },
],

  '/simulateurs/donation': [
  {
    q: "Pourquoi donner de son vivant plutôt qu'hériter ?",
    a: "La donation permet de transmettre un patrimoine en franchise de droits grâce aux abattements légaux, rechargés tous les 15 ans. Un parent avec 2 enfants peut ainsi transmettre jusqu'à 200 000 € tous les 15 ans sans aucun droit à payer (100 000 € par enfant). En succession, ces mêmes abattements s'appliquent mais les donations des 15 dernières années sont rapportées fiscalement, réduisant ce qui reste disponible.",
  },
  {
    q: "Qu'est-ce que le rapport fiscal des donations antérieures ?",
    a: "Toute donation effectuée dans les 15 ans précédant un décès ou une nouvelle donation doit être « rapportée » fiscalement : sa valeur s'impute sur l'abattement disponible. Si vous avez donné 60 000 € il y a 8 ans à votre enfant, il ne lui reste plus que 40 000 € d'abattement disponible sur les 100 000 €. Passé 15 ans, l'ardoise est remise à zéro.",
  },
  {
    q: "Comment fonctionne l'abattement du conjoint en donation ?",
    a: "Contrairement à la succession où le conjoint est totalement exonéré, la donation au conjoint ou partenaire PACS est taxée au-delà d'un abattement de 80 724 €. Ce montant est rechargeable tous les 15 ans. Le barème applicable est celui en ligne directe (jusqu'à 45 % pour les très hautes valeurs). Attention : certaines formes juridiques de donation au conjoint (donation au dernier vivant) obéissent à d'autres règles.",
  },
  {
    q: "Qu'est-ce que la donation-partage et pourquoi est-elle avantageuse ?",
    a: "La donation-partage est un acte notarié qui permet de répartir de son vivant tout ou partie de son patrimoine entre ses héritiers (enfants, petits-enfants). Son avantage majeur : les biens donnés sont évalués à la date de la donation et non à la date du décès pour le calcul des droits et des soultes. Ainsi, si un bien immobilier prend de la valeur, la plus-value après donation n'est plus taxable. Elle gèle aussi l'évaluation pour le calcul de la réserve héréditaire.",
  },
  {
    q: "Y a-t-il d'autres abattements ou exonérations en matière de donation ?",
    a: "Oui, plusieurs dispositifs complémentaires existent : le don familial de sommes d'argent (exonéré jusqu'à 31 865 € tous les 15 ans, versé par un parent/grand-parent de moins de 80 ans à un enfant/petit-enfant majeur), les présents d'usage (cadeaux proportionnés à la fortune du donateur, non taxables), et la réduction de droits pour charge de famille (si le donataire a 3 enfants ou plus). Ces abattements se cumulent avec l'abattement principal.",
  },
  {
    q: "Que se passe-t-il si la donation dépasse l'abattement disponible ?",
    a: "La fraction dépassant l'abattement est taxée selon le barème progressif. En ligne directe (enfant), le taux commence à 5 % et monte jusqu'à 45 % pour les parts dépassant 1 805 677 €. Les droits sont dus au moment de la donation et doivent être payés par le donataire (ou pris en charge par le donateur, mais cette prise en charge constitue elle-même un don taxable). Un notaire peut vous aider à optimiser le calendrier des donations.",
  },
  {
    q: "Faut-il un notaire pour faire une donation ?",
    a: "Un acte notarié est obligatoire pour : les donations de biens immobiliers, les donations-partages, les donations avec réserve d'usufruit, et les donations entre époux. Pour les dons manuels (sommes d'argent, valeurs mobilières remises en main propre), aucun acte notarié n'est requis, mais il est fortement conseillé de déposer un formulaire Cerfa 2735 auprès du fisc pour tracer la donation et ouvrir le délai de 15 ans. Un notaire reste recommandé pour tout don significatif.",
  },
  {
    q: "La donation avec réserve d'usufruit, comment ça marche ?",
    a: "Le donateur peut donner la nue-propriété d'un bien en conservant l'usufruit (le droit d'en jouir ou d'en percevoir les revenus jusqu'à son décès). Les droits de donation sont alors calculés sur la valeur de la seule nue-propriété, qui dépend de l'âge du donateur (un barème fiscal fixe la valeur de l'usufruit selon l'âge : 60 % avant 61 ans, 50 % entre 61 et 70 ans, etc.). Au décès de l'usufruitier, la pleine propriété est reconstituée sans droits supplémentaires.",
  },
],

  '/simulateurs/emprunt-immobilier': [
      { q: "Quel apport minimum est recommandé ?", a: "Les banques exigent généralement un apport d'au moins 10 % du prix d'achat pour couvrir les frais de notaire et réduire le risque. Un apport de 20 % ou plus améliore significativement les conditions d'emprunt (taux, durée). Sans apport, le dossier est très difficile à financer hors cas exceptionnels." },
      { q: "Comment est calculée la mensualité ?", a: "La mensualité est calculée selon la formule des annuités constantes : M = C × r × (1+r)ⁿ / ((1+r)ⁿ − 1), où C est le capital emprunté, r le taux mensuel (taux annuel ÷ 12) et n le nombre total de mensualités. Elle reste fixe tout au long du prêt à taux fixe." },
      { q: "Comment est calculé le taux d'endettement et quel est le plafond légal ?", a: "Le taux d'endettement (ou taux d'effort) = mensualités de crédit ÷ revenus nets × 100. Depuis janvier 2022, le HCSF (Haut Conseil de Stabilité Financière) impose un plafond légal de 35 % pour les banques françaises. Au-delà, le dossier est refusé dans la grande majorité des cas." },
      { q: "Qu'est-ce que le PTZ (primo-accédant) ?", a: "Le Prêt à Taux Zéro (PTZ) est réservé aux primo-accédants achetant leur première résidence principale. Il finance jusqu'à 50 % de l'opération dans les zones tendues (A, Abis, B1) avec un taux à 0 %. Ce simulateur l'approxime à 10 % du capital à 1,95 % — les conditions réelles varient selon la zone, les revenus et le type de logement." },
      { q: "Quelle durée d'emprunt choisir ?", a: "Une durée plus longue réduit la mensualité mais augmente le coût total des intérêts. Les banques françaises prêtent généralement jusqu'à 25 ans (27 ans pour le neuf avec travaux). Règle pratique : remboursez le moins longtemps possible tout en restant sous 35 % de taux d'endettement. Les durées de 20-25 ans sont les plus courantes." },
      { q: "Comment sont estimés les frais de notaire ?", a: "Pour un logement ancien : ~7,5 % du prix (droits de mutation 5,8 %, émoluments notaire, frais de dossier). Pour le neuf : ~2,5 % (droits réduits car la TVA est déjà payée). Ces taux sont approximatifs — le simulateur en donne une estimation, votre notaire établira le montant exact." },
      { q: "Assurance emprunteur : est-ce obligatoire ?", a: "L'assurance de prêt n'est pas légalement obligatoire, mais toutes les banques l'exigent en pratique. Elle couvre le décès, l'invalidité et parfois la perte d'emploi. Depuis la loi Lemoine (2022), vous pouvez changer d'assurance à tout moment, ce qui peut générer des économies significatives sur la durée." },
    ],

  '/simulateurs/epargne': [
      { q: "Comment fonctionnent les intérêts composés ?", a: "Les intérêts composés signifient que vous gagnez des intérêts sur vos intérêts. Chaque mois, le taux est appliqué à votre capital cumulé (capital initial + versements + intérêts antérieurs). Plus la durée est longue, plus cette composition joue en votre faveur (effet boule de neige)." },
      { q: "Quel taux de rendement supposer ?", a: "Cela dépend de votre placement : comptes épargne (0,5-1,5 %), fonds euros en assurance-vie (2-3 %), obligataires (3-5 %), actions/bourse (5-10 % en moyenne historique). Consultez votre conseiller pour un taux adapté à votre profil." },
      { q: "Quelle est la différence entre capital final et total versé ?", a: "Le total versé est la somme de votre capital initial et de tous vos versements mensuels. Le capital final ajoute les intérêts générés par votre épargne. La différence entre les deux est votre gain en intérêts." },
      { q: "Comment maximiser ses intérêts composés ?", a: "Commencez tôt (plus de temps = plus de composition), versez régulièrement (les versements mensuels bénéficient aussi de la composition), augmentez vos versements progressivement, et choisissez des placements avec un bon rendement adapté à votre risque toléré." },
    ],

  '/simulateurs/epargne-salariale': [
  {
    q: "Qu'est-ce que l'abondement employeur dans un PEE ?",
    a: "L'abondement est une contribution financière versée par votre employeur en complément de vos propres versements sur le Plan d'Épargne Entreprise (PEE) ou le PERCO/PERO. Il est encadré par la loi : l'employeur ne peut pas abonder plus de 3 fois votre versement, et le total de l'abondement ne peut dépasser 8 % du PASS (Plafond Annuel de la Sécurité Sociale), soit 3 844,80 € en 2025. C'est un avantage considérable : si votre employeur abonde à 100 %, chaque euro que vous versez est doublé.",
  },
  {
    q: "L'abondement est-il soumis à l'impôt sur le revenu ?",
    a: "Non, l'abondement versé par l'employeur est totalement exonéré d'impôt sur le revenu, dans la limite légale de 8 % du PASS. Il est également exonéré de cotisations sociales salariales (mais soumis à CSG/CRDS à 9,7 %). Cette double exonération fait de l'abondement l'un des avantages salariaux les plus avantageux fiscalement.",
  },
  {
    q: "Quelle est la différence entre PEE, PERCO et PERO ?",
    a: "Le PEE (Plan d'Épargne Entreprise) est bloqué 5 ans, avec une sortie en capital exonérée d'IR (hors prélèvements sociaux). Le PERCO (Plan d'Épargne Retraite Collectif) est bloqué jusqu'à la retraite, avec une sortie en rente ou en capital. Le PERO (Plan d'Épargne Retraite Obligatoire) fonctionne sur le même principe que le PERCO mais avec des versements obligatoires pour certaines catégories. Dans tous les cas, l'abondement est soumis aux mêmes règles légales.",
  },
  {
    q: "Quand peut-on débloquer son PEE avant les 5 ans ?",
    a: "La loi prévoit plusieurs cas de déblocage anticipé du PEE avant l'échéance des 5 ans : mariage ou PACS, naissance ou adoption d'un 3e enfant, divorce ou séparation, invalidité, décès du titulaire ou de son conjoint, rupture du contrat de travail (licenciement, démission, retraite), création ou reprise d'entreprise, achat de la résidence principale, surendettement. Ces déblocages restent exonérés d'impôt sur le revenu.",
  },
  {
    q: "Les versements volontaires dans le PEE sont-ils déductibles de l'IR ?",
    a: "Non, contrairement au PER individuel, les versements volontaires que vous effectuez dans un PEE ne sont pas déductibles de votre impôt sur le revenu. En revanche, les sommes issues de la participation, de l'intéressement ou de l'abondement employeur sont exonérées d'IR à l'entrée. Lors de la sortie, la plus-value réalisée est exonérée d'IR (mais soumise aux prélèvements sociaux de 17,2 %).",
  },
  {
    q: "Comment choisir entre verser dans son PEE et dans son PER individuel ?",
    a: "Le PEE est plus souple (déblocage à 5 ans) et bénéficie de l'abondement employeur, qui peut représenter un rendement immédiat très élevé. Le PER individuel permet en revanche de déduire les versements de l'IR, ce qui est intéressant si votre TMI est élevé (30 % ou plus). La stratégie optimale consiste souvent à maximiser l'abondement du PEE en premier, puis à compléter avec un PER si vous êtes dans une tranche élevée d'imposition.",
  },
  {
    q: "Quel rendement réaliste attendre de son PEE ?",
    a: "Le rendement dépend entièrement des fonds choisis. Les fonds monétaires offrent peu (2-3 % en période de taux hauts), les fonds obligataires 3-5 %, les fonds actions 5-9 % sur longue période. Beaucoup de PEE proposent des fonds investis en actions de l'entreprise, souvent avec une décote d'achat. Le simulateur utilise un rendement annuel moyen supposé constant, mais la réalité est plus volatile. Diversifiez vos supports si votre PEE le permet.",
  },
],

  '/simulateurs/fire': [
  { q: "Qu'est-ce que la règle des 4 % ?", a: "La règle des 4 % stipule que vous pouvez retirer 4 % de votre portefeuille chaque année sans l'épuiser sur 30 ans. Elle est issue de l'étude Trinity (1998) basée sur les marchés américains. En pratique, votre capital FIRE = dépenses annuelles × 25. Par exemple, pour vivre avec 30 000 €/an, il vous faut 750 000 € de capital investi." },
  { q: "Quelle différence entre Lean FIRE, Barista FIRE et Fat FIRE ?", a: "Lean FIRE désigne l'indépendance financière avec un budget frugal (< 25 000 €/an). Barista FIRE permet de couvrir les dépenses de base grâce au capital tout en gardant un emploi partiel pour les « extras ». Fat FIRE vise un mode de vie confortable (> 80 000 €/an) nécessitant un capital nettement plus important." },
  { q: "Comment calculer mon taux d'épargne pour le FIRE ?", a: "Votre taux d'épargne = épargne mensuelle / revenu net mensuel × 100. Plus il est élevé, plus vous atteindrez le FIRE rapidement : à 50 % d'épargne, l'indépendance financière est possible en environ 17 ans depuis zéro ; à 70 %, en moins de 9 ans. Ce simulateur calcule automatiquement votre taux à partir des montants saisis." },
  { q: "Quels placements pour vivre de ses rentes en France ?", a: "En France, un portefeuille FIRE repose généralement sur des ETF indiciels world (Assurance-vie ou PEA pour l'optimisation fiscale), de l'immobilier locatif, et une épargne sécurisée (livrets). Le PEA est particulièrement adapté après 5 ans (flat tax réduite à 17,2 %). L'assurance-vie permet des retraits avec abattement de 4 600 € (ou 9 200 € pour un couple) par an au-delà de 8 ans." },
  { q: "Le FIRE est-il réaliste en France avec les impôts ?", a: "Oui, mais il faut anticiper la fiscalité sur les revenus du capital : prélèvement forfaitaire unique (PFU) de 30 % sur les dividendes et plus-values hors enveloppes fiscales. En optimisant via PEA (17,2 % après 5 ans) et assurance-vie, l'impact fiscal peut être réduit significativement. La France offre aussi une protection sociale (santé, retraite) qui diminue le capital nécessaire par rapport aux pays sans protection sociale." },
  { q: "Qu'est-ce que le Coast FIRE ?", a: "Le Coast FIRE est le point où votre capital actuel, sans apport supplémentaire, atteindra votre objectif FIRE à l'âge de retraite souhaité, grâce à la seule croissance des marchés. Une fois ce seuil atteint, vous n'avez plus besoin d'épargner pour la retraite : il suffit de couvrir vos dépenses courantes par votre activité." },
],

  '/simulateurs/fonction-publique': [
  { q: "Quel est le taux maximum de pension dans la fonction publique ?", a: "Le taux maximum est de 75 % du traitement indiciaire brut (hors primes). Ce taux est atteint lorsque vous avez validé les trimestres requis (172 pour les nés après 1964) et que vous partez à l'âge légal ou après. La réforme 2023 a aligné progressivement les règles avec le régime général." },
  { q: "Qu'est-ce que la catégorie active ?", a: "Les agents de catégorie active exercent des métiers à risques particuliers (policiers, pompiers, personnel soignant, surveillants pénitentiaires…). Ils bénéficient d'un droit à départ anticipé de 5 ans par rapport aux agents sédentaires. L'âge légal est donc de 59 ans pour les nés en 1965+." },
  { q: "Les primes sont-elles prises en compte dans la pension ?", a: "Non. La pension de base fonction publique est calculée exclusivement sur le traitement indiciaire brut (hors primes, heures supplémentaires, NBI). C'est pour compenser cela que le régime RAFP (Retraite Additionnelle de la Fonction Publique) a été créé : il prend en compte une partie des primes." },
  { q: "Quelle différence avec le régime CNRACL ?", a: "Le régime CNRACL s'applique aux fonctionnaires territoriaux et hospitaliers. Le régime de la Fonction Publique d'État (SRE) s'applique aux fonctionnaires civils et militaires de l'État. Les règles de calcul sont très proches ; ce simulateur s'applique aux deux régimes (sédentaires ou actifs)." },
],

  '/simulateurs/frais-notaire': [
  {
    q: "Que comprennent les « frais de notaire » ?",
    a: "Contrairement à une idée répandue, l'essentiel des frais de notaire ne va pas au notaire. Ils se composent à environ 80 % de droits de mutation (impôts reversés à l'État et aux collectivités), puis des émoluments du notaire (sa rémunération réglementée), de la contribution de sécurité immobilière et des débours (frais avancés pour le compte du client). On parle plus justement de « frais d'acquisition ».",
  },
  {
    q: "Pourquoi les frais sont-ils plus faibles dans le neuf ?",
    a: "Dans l'immobilier neuf (VEFA ou première vente), les droits de mutation sont réduits à 0,715 % au lieu d'environ 5,80 % dans l'ancien. Les frais d'acquisition tombent alors à 2-3 % du prix, contre 7-8 % dans l'ancien. En contrepartie, le prix au mètre carré du neuf est généralement plus élevé et la TVA (20 %) est déjà incluse dans le prix de vente.",
  },
  {
    q: "Les frais de notaire portent-ils sur le mobilier ?",
    a: "Non. Si le bien est vendu avec des meubles (cuisine équipée, électroménager…), leur valeur peut être déduite du prix servant de base aux droits de mutation, ce qui réduit les frais. Cette déduction doit rester raisonnable et justifiable (généralement plafonnée autour de 5 % du prix) pour ne pas être requalifiée par l'administration fiscale.",
  },
  {
    q: "Peut-on négocier les frais de notaire ?",
    a: "Les droits de mutation et la contribution de sécurité immobilière sont des taxes fixes, non négociables. En revanche, depuis 2016 le notaire peut accorder une remise sur ses émoluments pour la part du prix supérieure à 100 000 €, dans la limite de 20 %. Pour les biens de forte valeur, cette remise peut représenter plusieurs centaines d'euros.",
  },
  {
    q: "Ce simulateur est-il officiel ?",
    a: "Non. Il fournit une estimation indicative basée sur les barèmes 2024-2025. Le montant exact figure dans le décompte établi par le notaire et peut varier selon le département (taux de droits de mutation), la nature du bien et les débours réels. Rapprochez-vous d'un notaire pour un calcul précis.",
  },
],

  '/simulateurs/freelance-vs-salarie': [
  { q: "Pourquoi le CA freelance doit-il être plus élevé que le brut salarié ?", a: "En tant que salarié, votre employeur paie ~42% de charges patronales en plus de votre brut. Un freelance doit donc facturer suffisamment pour couvrir ses propres charges sociales (21-22% du CA) et ses frais professionnels. Un brut salarié de 50 000 € coûte ~71 000 € à l'employeur, ce qui est le CA minimal à viser pour comparer à armes égales." },
  { q: "Quelle différence entre micro-BIC et micro-BNC ?", a: "Le régime micro-BIC (Bénéfices Industriels et Commerciaux) s'applique aux activités commerciales et artisanales avec un abattement de 50% sur le CA. Le micro-BNC (Bénéfices Non Commerciaux) concerne les professions libérales (consultant, coach, formateur…) avec un abattement plus faible de 34% — mais les taux de cotisation sont similaires (~21%)." },
  { q: "Quand le micro-entrepreneur devient-il moins intéressant ?", a: "Au-delà de 77 700 € de CA pour les services (BIC) ou 77 700 € en BNC (seuils 2025), le régime micro ne s'applique plus automatiquement. De plus, si vos charges réelles dépassent l'abattement forfaitaire (ex : 60% de charges réelles vs 50% forfaitaire BIC), le régime réel est plus avantageux." },
  { q: "Le portage salarial est-il intéressant ?", a: "Le portage permet de bénéficier du statut salarié (chômage, retraite complémentaire) tout en travaillant comme indépendant. La contrepartie est une commission de 8-12% prélevée par la société de portage sur le CA, ce qui réduit le net disponible. C'est souvent moins rentable que la micro-entreprise mais plus protecteur." },
  { q: "Ces calculs prennent-ils en compte la retraite ?", a: "Partiellement : les cotisations sociales calculées incluent la retraite de base. Cependant, un salarié cotise aussi à la retraite complémentaire Agirc-Arrco (via les charges sociales), tandis qu'un micro-entrepreneur génère peu de droits retraite complémentaire. Sur le long terme, le salarié accumule plus de droits retraite pour le même revenu net." },
],

  '/simulateurs/flat-tax': [
  { q: "Qu'est-ce que la flat tax (PFU) ?", a: "Le Prélèvement Forfaitaire Unique (PFU), appelé « flat tax », est un prélèvement global qui s'applique à la plupart des revenus du capital mobilier : dividendes, intérêts, plus-values sur valeurs mobilières. Il se compose d'un taux d'impôt sur le revenu de 12,8 % et de prélèvements sociaux. Il est prélevé directement par l'établissement financier lors du versement des revenus." },
  { q: "Quel est le taux de la flat tax en 2026 ?", a: "En 2026, le taux du PFU est de 31,4 % : 12,8 % au titre de l'impôt sur le revenu et 18,6 % de prélèvements sociaux (PS). La hausse des PS de 17,2 % à 18,6 % est intervenue avec la loi de financement de la Sécurité sociale 2026. Le taux reste global et libératoire pour l'IR : il n'y a pas de déclaration supplémentaire à faire." },
  { q: "Quand choisir le barème progressif plutôt que la flat tax ?", a: "L'option pour le barème de l'impôt sur le revenu peut être avantageuse si votre TMI est inférieur à 12,8 % (tranches 0 % ou 11 %). Elle est aussi intéressante pour les dividendes, qui bénéficient d'un abattement de 40 % au barème (absent en PFU). En revanche, le barème est global : vous ne pouvez pas l'appliquer à certains revenus seulement — il s'applique à l'ensemble de vos revenus de capitaux mobiliers de l'année." },
  { q: "Comment fonctionne l'abattement de 40 % sur les dividendes ?", a: "En optant pour le barème progressif, les dividendes d'actions françaises ou européennes bénéficient d'un abattement de 40 % avant imposition à l'IR. De plus, 6,8 % de CSG payée dans l'année précédente est déductible du revenu imposable (CSG déductible). La formule d'imposition IR est donc : dividendes × (1 − 40 % − 6,8 %) × TMI, soit dividendes × 53,2 % × TMI." },
  { q: "La flat tax s'applique-t-elle aux revenus PEA et assurance-vie ?", a: "Non pour le PEA : les plus-values et dividendes retirés après 5 ans sont exonérés d'impôt sur le revenu (seuls les 17,2 % de PS s'appliquent avant 2026, 18,6 % depuis 2026). Pour l'assurance-vie : les gains issus de primes versées après septembre 2017 subissent le PFU (7,5 % d'IR après 8 ans de détention, ou 12,8 % avant). Les deux enveloppes restent fiscalement privilégiées par rapport aux comptes titres ordinaires." },
  { q: "Qu'est-ce que la CSG déductible et comment en bénéficier ?", a: "Lorsque vous optez pour le barème progressif, 6,8 points de CSG sur vos revenus du capital de l'année précédente sont déductibles de votre revenu imposable. Cette déduction est automatique : elle apparaît sur votre avis d'imposition. Elle n'est pas disponible si vous restez au PFU (régime forfaitaire), car la flat tax est libératoire de l'IR." },
  { q: "Qu'est-ce que la CEHR et est-elle cumulable avec la flat tax ?", a: "La Contribution Exceptionnelle sur les Hauts Revenus (CEHR) s'ajoute à l'impôt pour les foyers dont le revenu fiscal dépasse 250 000 € (personne seule) ou 500 000 € (couple). Son taux est de 3 % entre 250 000 € et 500 000 €, puis 4 % au-delà. Elle est due que vous choisissiez le PFU ou le barème. Le simulateur ne l'intègre pas : son calcul dépend du revenu global du foyer." },
  { q: "L'option barème est-elle irrévocable ?", a: "Non. Vous choisissez chaque année, lors de votre déclaration de revenus (cases 2OP pour l'option barème), si vous optez ou non pour le barème progressif. La décision est prise a posteriori : vous pouvez comparer les deux options et cocher la case qui vous avantage. En l'absence de case cochée, le PFU s'applique par défaut." },
],

  '/simulateurs/impot-revenu': [
  { q: "Comment fonctionne le barème progressif de l'impôt 2026 ?", a: "Le barème IR 2026 (revenus 2025 déclarés en 2026) comporte 5 tranches : 0 % jusqu'à 11 600 €, 11 % de 11 600 € à 29 579 €, 30 % de 29 579 € à 84 577 €, 41 % de 84 577 € à 181 917 €, et 45 % au-delà. Ce barème s'applique au revenu net imposable après abattement de 10 % sur les salaires et après division par le nombre de parts fiscales." },
  { q: "Quelle est la différence entre TMI et taux moyen d'imposition ?", a: "Le TMI (Taux Marginal d'Imposition) est le taux appliqué à votre dernier euro de revenu imposable. Le taux moyen est votre impôt total divisé par votre revenu imposable. Par exemple, avec un revenu imposable de 50 000 €, votre TMI peut être 30 % (tranche) mais votre taux moyen seulement 14 %, car les premières tranches sont imposées à 0 % et 11 %." },
  { q: "Qu'est-ce que le quotient familial ?", a: "Le quotient familial permet de diviser le revenu imposable par le nombre de parts pour calculer l'impôt, puis de le multiplier par ce même nombre de parts. Un célibataire a 1 part, un couple marié ou pacsé 2 parts. Chaque enfant à charge ajoute 0,5 part (les 2 premiers) puis 1 part à partir du 3e. Le gain fiscal par demi-part est plafonné à 1 759 € (2026)." },
  { q: "Comment déclarer mes revenus locatifs à l'impôt ?", a: "Les revenus de location nue (non meublée) sont déclarés en revenus fonciers. Si < 15 000 €/an, le régime micro-foncier s'applique avec un abattement forfaitaire de 30 %. Au-delà ou sur option, le régime réel permet de déduire toutes les charges réelles (travaux, intérêts d'emprunt, assurance, gestion). Les locations meublées relèvent des BIC (micro ou réel)." },
  { q: "Quelles principales réductions et crédits d'impôt sont disponibles ?", a: "Parmi les plus courants : crédit d'impôt pour emploi à domicile (50 % des dépenses, plafond 12 000 €), crédit d'impôt garde d'enfants (50 % des frais de crèche/assistante maternelle), réduction pour dons aux associations (66 % ou 75 % selon l'organisme), et réduction Pinel pour investissement locatif neuf (taux dégressif selon durée d'engagement)." },
  { q: "Qu'est-ce que la décote sur l'impôt sur le revenu ?", a: "La décote est une réduction automatique pour les contribuables modestes dont l'IR calculé est faible. En 2026 (revenus 2025), elle s'applique si l'IR brut est inférieur à 1 982 € (célibataire) ou 3 277 € (couple). La décote = 897 € (ou 1 483 €) moins 45,25 % de l'IR brut. Elle disparaît progressivement au-delà des seuils." },
],

  '/simulateurs/impot-revenu-be': [
  { q: "Quelle est la différence entre l'IPP et l'IR français ?", a: "L'IPP (Impôt des Personnes Physiques) est l'impôt belge sur le revenu. Il comporte 4 tranches (25 %, 40 %, 45 %, 50 %) contre 5 tranches en France. Le taux marginal maximum est de 50 % en Belgique vs 45 % en France. L'IPP comprend aussi des centimes additionnels communaux (en moyenne 7 %) qui s'ajoutent à l'impôt fédéral." },
  { q: "Qu'est-ce que la quotité exemptée d'impôt ?", a: "La quotité exemptée est la tranche de revenu totalement exonérée d'IPP. Elle s'élève à 10 160 € de base (EI 2025) pour chaque contribuable. Elle se traduit par une réduction d'impôt calculée au taux de 25 %. Des majorations s'appliquent en fonction du nombre d'enfants à charge." },
  { q: "Comment fonctionne le quotient conjugal ?", a: "Le quotient conjugal permet au conjoint qui gagne davantage de transférer 30 % de son revenu (plafonné à 12 550 €) vers son partenaire, chacun étant ensuite imposé séparément. Cela réduit l'imposition globale du ménage en limitant l'effet de la progressivité. Il ne s'applique que si le revenu du partenaire est inférieur à 30 % du total du ménage." },
  { q: "Que sont les centimes additionnels communaux ?", a: "Les communes belges perçoivent un pourcentage supplémentaire calculé sur l'impôt fédéral (en général entre 0 % et 9 %). La moyenne nationale est d'environ 7 %. Certaines communes (Lasne, Koksijde…) ont des taux très bas ; d'autres (Liège, Mons…) approchent le maximum. Ce taux est indiqué sur votre avertissement-extrait de rôle." },
  { q: "Qu'est-ce que le forfait de frais professionnels ?", a: "En Belgique, les frais professionnels peuvent être déduits de façon forfaitaire (30 % du revenu, plafond ~5 040 €) ou au réel si vos dépenses professionnelles sont supérieures. Le forfait est automatiquement appliqué si vous ne déclarez pas vos frais réels. Les travailleurs indépendants ont un calcul différent." },
],

  '/simulateurs/impot-revenu-ch': [
  {
    q: "Comment fonctionne l'impôt fédéral direct (IFD) en Suisse ?",
    a: "L'IFD est un impôt progressif prélevé par la Confédération sur le revenu net des personnes physiques. Le barème 2025 part de 0 % pour les revenus inférieurs à 18 000 CHF et monte à 11,5 % pour les revenus dépassant 176 000 CHF. Les couples mariés bénéficient du splitting : le revenu est divisé par deux, l'impôt calculé puis multiplié par deux, ce qui réduit l'effet de la progressivité.",
  },
  {
    q: "Qu'est-ce que l'impôt cantonal et l'impôt communal ?",
    a: "En plus de l'IFD, chaque canton et commune perçoit ses propres impôts sur le revenu, calculés sur la base du revenu imposable cantonal (qui peut différer légèrement de la base fédérale). Les taux varient fortement selon le canton : Zoug est le moins imposé, Neuchâtel parmi les plus élevés. Ce simulateur utilise une approximation basée sur un multiplicateur de l'IFD.",
  },
  {
    q: "Quelles déductions puis-je appliquer en Suisse ?",
    a: "Les principales déductions pour un salarié comprennent : les frais professionnels (forfait 3 % du salaire, min 2 000 CHF, max 4 000 CHF), les cotisations sociales obligatoires (AVS/AI/APG ≈ 5,3 % du salaire brut), les primes d'assurance maladie LAMal (déduction forfaitaire), les versements au pilier 3a (max 7 056 CHF), les intérêts de dettes et les frais de garde d'enfants.",
  },
  {
    q: "Pourquoi l'impôt varie-t-il autant selon le canton ?",
    a: "La Suisse applique le principe du fédéralisme fiscal : chaque canton fixe librement ses taux d'imposition. Un contribuable gagnant 100 000 CHF peut payer presque deux fois plus d'impôts à Neuchâtel qu'à Zoug. En plus du canton, la commune de domicile ajoute un impôt supplémentaire (multiplicateur communal). Ce système crée une concurrence fiscale entre cantons.",
  },
  {
    q: "Comment sont traités les couples mariés ?",
    a: "En Suisse fédérale, les couples mariés et partenaires enregistrés bénéficient d'un tarif préférentiel (tarif du ménage ou splitting). Pour l'IFD, le revenu commun est divisé par deux, l'impôt calculé sur cette moitié puis multiplié par deux — ce qui réduit l'imposition par rapport à deux célibataires. Attention : dans certains cantons, les couples mariés à deux revenus peuvent être défavorisés par rapport aux concubins.",
  },
],

  '/simulateurs/independants': [
  { q: "Quelle est la différence entre le régime de base SSI et le RCI ?", a: "Le régime de base SSI (Sécurité Sociale des Indépendants) est aligné sur le régime général CNAV depuis 2020 : mêmes règles de validation de trimestres et même formule de calcul, plafonné au PASS. Le RCI (Régime Complémentaire des Indépendants) est un régime par points, similaire à l'Agirc-Arrco des salariés." },
  { q: "Quels sont les profils concernés par ce simulateur ?", a: "Ce simulateur s'adresse aux artisans, commerçants et industriels affiliés à la SSI (ex-RSI). Les professions libérales réglementées (médecins, avocats, architectes…) relèvent de la CNAVPL et de caisses autonomes spécifiques (CARMF, CNBF, CIPAV…), qui feront l'objet d'un simulateur dédié à venir." },
  { q: "Comment valider des trimestres en tant qu'indépendant ?", a: "Un trimestre est validé pour chaque tranche de 600 SMIC horaires de revenu cotisé (soit environ 6 594 € en 2026). Il est donc possible de valider 4 trimestres avec un revenu annuel d'environ 26 376 €, même si ce revenu est inférieur au PASS." },
  { q: "La micro-entreprise (auto-entrepreneur) est-elle couverte ?", a: "Oui. Les micro-entrepreneurs sont affiliés à la SSI et cotisent à la retraite sur la base de leur chiffre d'affaires (après abattement forfaitaire). Le taux de cotisation retraite varie selon l'activité (12,8 % à 22 %). Ce simulateur vous permet d'approximer votre pension si vous renseignez votre revenu net après abattement." },
],

  '/simulateurs/inflation': [
  {
    q: "Qu'est-ce que l'inflation par catégorie ?",
    a: "L'inflation n'est pas uniforme : l'alimentation, l'énergie et les services de santé augmentent souvent plus vite que la moyenne. L'INSEE mesure l'Indice des Prix à la Consommation (IPC) en pondérant chaque catégorie selon son poids dans le budget des ménages français.",
  },
  {
    q: "Comment se calcule le taux d'inflation moyen pondéré ?",
    a: "Chaque catégorie est pondérée par sa part dans votre budget. Si l'alimentation représente 25 % de vos dépenses et son inflation est de 4 %, sa contribution au taux moyen est de 0,25 × 4 % = 1 %. Le taux moyen est la somme de ces contributions.",
  },
  {
    q: "Quel taux d'inflation utiliser pour ses projections ?",
    a: "La Banque Centrale Européenne (BCE) vise une inflation de 2 % à moyen terme. Mais selon votre mode de vie, votre inflation personnelle peut être plus élevée : les ménages à faibles revenus subissent souvent une inflation plus forte car ils consacrent une plus grande part à l'alimentation et à l'énergie.",
  },
  {
    q: "Comment protéger son épargne de l'inflation ?",
    a: "L'investissement en actions sur le long terme (ETF monde, par exemple) a historiquement produit des rendements supérieurs à l'inflation. L'immobilier offre aussi une protection naturelle. Les fonds euros d'assurance-vie ou le Livret A protègent partiellement selon les taux en vigueur.",
  },
],

  '/simulateurs/ircantec': [
  { q: "Qui est concerné par l'IRCANTEC ?", a: "L'IRCANTEC (Institution de Retraite Complémentaire des Agents Non Titulaires de l'État et des Collectivités) couvre les agents contractuels de la fonction publique (État, collectivités territoriales, hôpitaux) ainsi que les élus locaux. Les fonctionnaires titulaires, eux, ne cotisent pas à l'IRCANTEC mais relèvent des régimes SRE ou CNRACL." },
  { q: "Comment fonctionne le régime par points IRCANTEC ?", a: "Chaque année, vos cotisations (salarié + employeur) sont divisées par la valeur d'achat du point (8,06 € en 2026) pour obtenir un nombre de points. À la retraite, ces points sont multipliés par la valeur de service du point (0,54076 €/point/an en 2026) pour calculer votre pension annuelle complémentaire." },
  { q: "L'IRCANTEC est-il cumulable avec d'autres régimes ?", a: "Oui. L'IRCANTEC est une retraite complémentaire. Les contractuels de l'État perçoivent également une retraite de base CNAV (régime général). Les contractuels territoriaux ou hospitaliers peuvent relever du régime de base de leur collectivité. L'IRCANTEC s'ajoute à ces pensions de base." },
  { q: "Comment est revalorisée la valeur de service du point IRCANTEC ?", a: "La valeur de service est revalorisée annuellement par décret, en général en lien avec l'évolution des prix (inflation). En 2026, elle s'établit à 0,54076 €/point/an. Ce simulateur permet d'appliquer une revalorisation projetée pour estimer l'impact de l'inflation sur votre future pension." },
],

  '/simulateurs/lpp-deuxieme-pilier': [
  {
    q: "Qu'est-ce que le 2e pilier (LPP) en Suisse ?",
    a: "Le 2e pilier (Loi sur la prévoyance professionnelle, LPP) est l'épargne retraite obligatoire liée à votre emploi en Suisse. Avec l'AVS (1er pilier), il forme la base de votre retraite. Les cotisations sont versées par l'employeur et le salarié à parts égales dans une caisse de pension. L'objectif est de maintenir environ 60 % de votre dernier salaire à la retraite.",
  },
  {
    q: "Comment est calculé le salaire coordonné ?",
    a: "Le salaire coordonné est la part de votre salaire soumise aux cotisations LPP obligatoires. Il correspond à votre salaire annuel brut (plafonné à 88 200 CHF) duquel on déduit la déduction de coordination (25 725 CHF en 2025). Cette déduction représente la part couverte par l'AVS. Le minimum du salaire coordonné assurable est de 3 675 CHF.",
  },
  {
    q: "Que sont les bonifications de vieillesse ?",
    a: "Les bonifications de vieillesse sont les cotisations annuelles versées au 2e pilier, exprimées en % du salaire coordonné. Elles augmentent avec l'âge : 7 % de 25 à 34 ans, 10 % de 35 à 44 ans, 15 % de 45 à 54 ans, et 18 % de 55 à 65 ans. La moitié est payée par l'employeur, l'autre moitié déduite de votre salaire.",
  },
  {
    q: "Qu'est-ce que le taux de conversion de 6,8 % ?",
    a: "Le taux de conversion est le pourcentage appliqué à votre avoir de vieillesse accumulé pour calculer votre rente annuelle à la retraite. À 65 ans, un capital de 100 000 CHF donne une rente de 6 800 CHF par an (567 CHF/mois). Ce taux légal (6,8 %) s'applique à la part obligatoire LPP ; les caisses de pension peuvent appliquer un taux différent pour la part surobligatoire.",
  },
  {
    q: "Puis-je retirer mon 2e pilier en capital plutôt qu'en rente ?",
    a: "Oui, la loi suisse vous permet de retirer tout ou partie de votre avoir de vieillesse en capital à la retraite, plutôt qu'une rente viagère. Le retrait en capital offre plus de flexibilité mais transfère le risque de longévité sur vous. Ce retrait est imposé comme un revenu extraordinaire (taux réduit) l'année du retrait. Certaines caisses de pension limitent ou n'offrent pas cette option.",
  },
],

  '/simulateurs/msa': [
  { q: "Qui est affilié à la MSA ?", a: "La Mutualité Sociale Agricole (MSA) couvre tous les salariés agricoles (exploitations, coopératives, entreprises du secteur) et les non-salariés agricoles (exploitants, chefs d'exploitation). Le statut d'exploitant agricole requiert une superficie minimale ou un revenu professionnel agricole suffisant." },
  { q: "Comment sont calculés les trimestres au régime agricole ?", a: "Pour les salariés agricoles : 1 trimestre par tranche de 150 × SMIC horaire cotisée dans l'année, comme pour le régime général CNAV (maximum 4 trimestres/an). Pour les exploitants : les trimestres sont validés sur la base du revenu agricole professionnel ou de la surface exploitée." },
  { q: "Quelle est la différence entre AMEXA et AVA ?", a: "L'AMEXA (Assurance Maladie des Exploitants Agricoles) couvre la santé des non-salariés agricoles. L'AVA (Assurance Vieillesse Agricole) est la retraite de base des exploitants. S'y ajoute la COREVA (retraite complémentaire facultative) et la RCO (retraite complémentaire obligatoire depuis 2003)." },
  { q: "Quel est le montant de la retraite minimum pour un exploitant agricole ?", a: "Depuis 2022 (loi Chassaigne), la retraite minimum d'un chef d'exploitation ayant une carrière complète est portée à 85 % du SMIC net, soit environ 1 035 € nets par mois en 2025. Cette garantie s'applique à la pension totale (base + complémentaire)." },
  { q: "La retraite agricole est-elle différente selon le statut (salarié vs exploitant) ?", a: "Oui. Les salariés agricoles relèvent du régime général de base (CNAV), avec une retraite complémentaire MSA-Cadres ou MSA-Non cadres similaire à Agirc-Arrco. Les exploitants non-salariés ont leur propre régime de base (AVA) et la RCO (retraite complémentaire obligatoire par points)." },
  { q: "Peut-on cumuler emploi et retraite agricole ?", a: "Oui, le cumul emploi-retraite est possible en agriculture comme dans les autres régimes. Après liquidation de toutes les retraites (base et complémentaires) au taux plein, vous pouvez exercer une activité salariée ou non-salariée agricole sans plafond de revenus, et continuer à cotiser (sans générer de nouveaux droits)." },
],

  '/simulateurs/patrimoine': [
  { q: "Comment calculer son patrimoine net ?", a: "Le patrimoine net = actifs totaux (épargne, immobilier, placements, retraite capitalisée) − passifs (crédits immobiliers, dettes en cours). Seule la valeur nette des biens compte : si votre résidence principale vaut 300 000 € avec 150 000 € de crédit restant, elle contribue 150 000 € à votre patrimoine." },
  { q: "Faut-il inclure la résidence principale dans son patrimoine ?", a: "Oui, mais avec nuance. La résidence principale est un actif non rentable tant qu'elle n'est pas vendue. Beaucoup de conseillers préfèrent analyser le patrimoine « hors résidence principale » pour mesurer la richesse réellement mobilisable." },
  { q: "Qu'est-ce qu'un patrimoine équilibré ?", a: "Un patrimoine équilibré diversifie les classes d'actifs : immobilier (25-40 %), actions via PEA ou assurance-vie (30-40 %), épargne de précaution liquide (5-10 %) et autres (SCPI, private equity…). La répartition idéale dépend de l'âge, des revenus et du profil de risque." },
  { q: "À quel âge devrait-on avoir quel niveau de patrimoine ?", a: "Une règle empirique : votre patrimoine devrait être égal à votre revenu annuel brut × votre âge / 10. À 40 ans avec 50 000 € de revenus, cela donne 200 000 €. Ce n'est qu'un repère ; les héritages, les prix immobiliers locaux et la situation familiale jouent un rôle majeur." },
  { q: "L'assurance-vie est-elle incluse dans le patrimoine ?", a: "Oui, la valeur de rachat d'un contrat d'assurance-vie est un actif. En cas de décès, les capitaux transmis aux bénéficiaires (exonérés jusqu'à 152 500 € par bénéficiaire pour les versements avant 70 ans) n'entrent pas dans la succession classique." },
  { q: "Doit-on inclure l'épargne retraite (PER, PERP) ?", a: "Oui, les encours de votre PER (Plan d'Épargne Retraite) sont une composante de votre patrimoine, bien que bloqués jusqu'à la retraite (sauf cas de déblocage anticipé). Incluez la valeur liquidative actuelle, non la rente future estimée." },
],

  '/simulateurs/pension-legale': [
  { q: "Comment est calculée la pension légale en Belgique ?", a: "La pension légale (= premier pilier) est calculée sur la base de votre salaire annuel moyen (plafonné à 58 380 €) sur toute votre carrière, du nombre d'années de carrière (45 ans = carrière complète) et d'un taux de 60 % (isolé) ou 75 % (ménage/soutien de famille). La formule : pension mensuelle = (salaire moyen × taux × années / 45) / 12." },
  { q: "Quel est l'âge légal de retraite en Belgique ?", a: "L'âge légal est de 65 ans pour les personnes nées avant 1963, 66 ans (2025–2029), et 67 ans à partir de 2030 pour celles nées après 1964. Il est possible de partir plus tôt (retraite anticipée) dès 60 ans avec une très longue carrière (42 à 44 ans selon l'année) mais avec une pension réduite." },
  { q: "Qu'est-ce que le taux ménage et le taux isolé ?", a: "Le taux isolé (60 %) s'applique aux personnes seules ou dont le conjoint a sa propre pension. Le taux ménage (75 %) s'applique si votre conjoint n'a pas de revenu propre et ne bénéficie pas de sa propre pension. Le taux ménage donne une pension plus élevée mais disparaît si le conjoint commence à percevoir ses propres revenus ou sa propre pension." },
  { q: "Qu'est-ce que le bonus pension ?", a: "Le bonus pension récompense ceux qui travaillent au-delà de leur carrière complète (45 ans) ou de leur âge légal de retraite. Chaque année supplémentaire travaillée après 45 ans de carrière donne droit à une majoration de 2 % de la pension par an (plafonné à 5 ans supplémentaires, soit +10 % maximum)." },
  { q: "Puis-je cumuler une pension légale et un travail ?", a: "Oui, depuis 2015, la Belgique permet le cumul retraite/travail sans limite de revenus pour les pensionnés ayant une carrière complète (45 ans) ou étant âgés de plus de 65 ans. Des plafonds s'appliquent dans les autres cas. Le travail pendant la pension peut même générer des droits supplémentaires." },
  { q: "Quels sont les autres piliers de la pension en Belgique ?", a: "La pension belge repose sur 3 piliers : 1er pilier = pension légale ONSS (ce simulateur) ; 2e pilier = pension complémentaire d'entreprise (EIP, CPTI, fonds de pension) ; 3e pilier = épargne pension individuelle (épargne-pension, assurance-vie, VAPZE pour indépendants). La pension complémentaire peut représenter un complément significatif selon votre contrat." },
],

  '/simulateurs/pension-reversion': [
  {
    q: "Qui peut bénéficier d'une pension de réversion ?",
    a: "La pension de réversion est réservée à l'époux ou ex-époux survivant d'une personne décédée ayant cotisé à la retraite. Le mariage est obligatoire : ni le PACS ni le concubinage n'ouvrent droit à réversion. Pour le régime de base, il faut avoir au moins 55 ans et des ressources inférieures à un plafond ; pour la complémentaire Agirc-Arrco, 55 ans suffisent (sans condition de ressources) mais le remariage supprime le droit.",
  },
  {
    q: "Quel est le taux de la pension de réversion ?",
    a: "Il dépend du régime. Pour la retraite de base du régime général (CNAV), la réversion correspond à 54 % de la pension de base du défunt. Pour la retraite complémentaire Agirc-Arrco des salariés du privé, le taux est de 60 % de la pension complémentaire. Les deux peuvent se cumuler si le défunt cotisait aux deux régimes.",
  },
  {
    q: "Comment fonctionne la condition de ressources ?",
    a: "Seule la réversion de base (CNAV) est soumise à condition de ressources. En 2025, les ressources annuelles du survivant ne doivent pas dépasser 24 710 € pour une personne seule (39 537 € pour un couple). Si le total des ressources et de la réversion dépasse ce plafond, la réversion de base est réduite du montant du dépassement. La réversion complémentaire Agirc-Arrco, elle, n'est pas concernée.",
  },
  {
    q: "À partir de quel âge perçoit-on la réversion ?",
    a: "L'âge minimum est de 55 ans, aussi bien pour le régime de base que pour l'Agirc-Arrco. Avant cet âge, le conjoint survivant peut, sous conditions (enfants à charge, invalidité), percevoir une allocation veuvage temporaire, mais pas la pension de réversion proprement dite.",
  },
  {
    q: "Ce simulateur est-il officiel ?",
    a: "Non. Il s'agit d'une estimation indicative basée sur les barèmes 2025 (taux de 54 % et 60 %, plafonds de ressources). Le calcul réel dépend de la carrière du défunt, de tous ses régimes (fonction publique, indépendants…) et de la situation précise du survivant. Adressez-vous à votre caisse de retraite pour un calcul officiel.",
  },
],

  '/simulateurs/per': [
  {
    q: "Qu'est-ce que le Plan d'Épargne Retraite (PER) ?",
    a: "Le PER est un produit d'épargne de long terme créé par la loi PACTE (2019) destiné à se constituer un complément de revenu pour la retraite. Les sommes versées sont investies (fonds en euros, unités de compte) et bloquées jusqu'au départ en retraite, sauf cas de déblocage anticipé. Son principal atout est la déductibilité fiscale des versements volontaires.",
  },
  {
    q: "Comment fonctionne le plafond de déduction des versements ?",
    a: "Les versements volontaires sont déductibles du revenu imposable dans la limite d'un plafond annuel : 10 % de vos revenus professionnels nets de l'année précédente (dans la limite de 8 PASS, soit 38 448 € en 2026), ou 10 % du PASS (4 806 €) si ce montant est plus favorable. Les plafonds non utilisés des trois années précédentes peuvent être reportés et un couple peut mutualiser ses plafonds.",
  },
  {
    q: "Comment sont imposées les sommes à la sortie ?",
    a: "À la retraite, vous choisissez une sortie en capital, en rente, ou un mélange. Si vous avez déduit vos versements à l'entrée : en sortie en capital, la part correspondant aux versements est imposée au barème de l'impôt sur le revenu, et les gains au prélèvement forfaitaire unique (PFU 30 %). En sortie en rente viagère, la rente est imposée comme une pension (régime des rentes à titre gratuit).",
  },
  {
    q: "Mon épargne est-elle bloquée jusqu'à la retraite ?",
    a: "Oui en principe, mais la loi prévoit des cas de déblocage anticipé : achat de la résidence principale, ou accidents de la vie (invalidité, décès du conjoint, expiration des droits au chômage, surendettement, cessation d'activité non salariée après liquidation judiciaire). En dehors de ces cas, les sommes restent indisponibles jusqu'au départ en retraite.",
  },
  {
    q: "Faut-il sortir en capital ou en rente ?",
    a: "La sortie en capital offre une liberté totale d'usage des fonds mais une fiscalité concentrée sur l'année de retrait. La rente viagère garantit un revenu régulier à vie, mais le capital est définitivement converti et la fiscalité s'étale dans le temps. Le choix dépend de votre besoin de liquidité, de votre espérance de vie estimée et de votre TMI à la retraite.",
  },
  {
    q: "Ce simulateur est-il officiel ?",
    a: "Non. Il s'agit d'une estimation indicative basée sur les paramètres 2026 (PASS, plafonds de déduction). L'économie d'impôt réelle dépend de votre taux marginal exact et le capital projeté suppose un rendement constant, ce qui n'est jamais garanti sur les marchés. Rapprochez-vous d'un conseiller pour une étude personnalisée.",
  },
],

  '/simulateurs/plus-value-immobiliere': [
  { q: "La résidence principale est-elle exonérée de plus-value ?", a: "Oui, totalement. La vente de la résidence principale est exonérée d'impôt sur la plus-value, sans condition de durée de détention. Elle doit être votre résidence principale au moment de la vente (ou au plus tard le 31 décembre de l'année de la vente si vous avez déménagé récemment)." },
  { q: "Comment calcule-t-on la plus-value imposable ?", a: "Plus-value brute = prix de vente − prix d'achat. On peut majorer le prix d'achat des frais d'acquisition (forfait 7,5 % ou frais réels), des travaux (forfait 15 % si détenu > 5 ans ou factures réelles), et des frais de voirie. La plus-value nette bénéficie ensuite des abattements pour durée de détention." },
  { q: "Quels sont les abattements selon la durée de détention ?", a: "Pour l'IR (19 %) : 6 % par an de la 6e à la 21e année, puis 4 % la 22e → exonération totale après 22 ans. Pour les prélèvements sociaux (17,2 %) : 1,65 %/an de la 6e à la 21e, 1,6 % la 22e, 9 %/an de la 23e à la 30e → exonération totale après 30 ans." },
  { q: "Qu'est-ce que la taxe sur les plus-values élevées ?", a: "Une surtaxe progressive s'applique aux plus-values nettes imposables supérieures à 50 000 € (hors résidence principale et terrains à bâtir) : 2 % entre 50 001 et 100 000 €, jusqu'à 6 % au-delà de 260 000 €. Elle s'ajoute à l'IR (19 %) et aux prélèvements sociaux (17,2 %)." },
  { q: "Y a-t-il d'autres cas d'exonération ?", a: "Oui : première cession de résidence secondaire si vous n'avez pas été propriétaire de votre résidence principale dans les 4 dernières années (exonération partielle), cession < 15 000 €, vente au profit d'organismes de logement social, ou retraités/invalides aux faibles revenus." },
  { q: "Comment est taxée la plus-value sur un bien loué (LMNP) ?", a: "En LMNP réel, les amortissements déduits viennent augmenter la plus-value imposable (réintégration des amortissements). En revanche, si le bien est loué nu (revenus fonciers), la règle des abattements sur durée de détention s'applique normalement, sans réintégration d'amortissements." },
],

  '/simulateurs/prevoyance-ch': [
  {
    q: "Qu'est-ce que le pilier 3a en Suisse ?",
    a: "Le pilier 3a (prévoyance individuelle liée) est le troisième niveau d'épargne retraite en Suisse. Il permet aux salariés et indépendants de verser chaque année un montant dans un compte bancaire ou une police d'assurance dédié, en bénéficiant d'une déduction fiscale immédiate. Les fonds sont bloqués jusqu'à la retraite (65 ans pour les hommes, 64 ans pour les femmes, bientôt 65 ans pour tous).",
  },
  {
    q: "Quels sont les plafonds de déduction pour 2025 ?",
    a: "Pour 2025, les plafonds sont : 7 056 CHF/an pour les salariés affiliés à une caisse de pension (LPP) ; 20 % du revenu net indépendant, avec un maximum de 35 280 CHF, pour les indépendants sans 2e pilier. Ces montants sont révisés périodiquement par le Conseil fédéral en fonction de l'évolution de l'AVS.",
  },
  {
    q: "Quelle est la différence entre compte 3a bancaire et police d'assurance 3a ?",
    a: "Un compte 3a bancaire offre une grande flexibilité : vous pouvez verser le montant souhaité (jusqu'au plafond), gérer des fonds de placement, et retirer facilement. Une police d'assurance 3a combine épargne et couverture risques (décès, invalidité), mais engage sur une durée fixe avec des pénalités si vous résiliez avant terme. Pour la pure performance long terme, les fonds 3a en actions sont souvent préférables.",
  },
  {
    q: "Comment est imposé le retrait du pilier 3a ?",
    a: "Le capital accumulé dans le pilier 3a est imposé lors du retrait à un taux réduit, séparé du revenu ordinaire. Le taux varie selon le canton et le montant retiré, mais il est généralement de 5–10 % du capital. Pour minimiser l'impôt, il est conseillé d'échelonner les retraits sur plusieurs années et de détenir plusieurs comptes 3a ouverts à des années différentes.",
  },
  {
    q: "Puis-je retirer le 3a avant la retraite ?",
    a: "Oui, dans certains cas précis : achat d'une résidence principale en Suisse, financement d'une activité indépendante, départ définitif de Suisse, invalidité, ou décès (les ayants droit touchent le capital). En dehors de ces cas, le capital est bloqué jusqu'à 5 ans avant l'âge légal de retraite. Un retrait anticipé déclenche l'imposition du capital.",
  },
],

  '/simulateurs/ptz': [
  {
    q: "Qu'est-ce que le prêt à taux zéro (PTZ) ?",
    a: "Le PTZ est un prêt sans intérêt ni frais de dossier, accordé sous conditions de ressources aux primo-accédants (personnes n'ayant pas été propriétaires de leur résidence principale au cours des deux dernières années) pour financer l'achat de leur résidence principale. Il complète un prêt principal et ne peut pas financer la totalité de l'opération.",
  },
  {
    q: "Quels logements sont éligibles au PTZ en 2025 ?",
    a: "Depuis le décret du 29 mars 2025, le PTZ est rouvert à tous les logements neufs (appartements comme maisons individuelles) sur l'ensemble du territoire. Les logements anciens restent éligibles uniquement en zones B2 et C, à condition de réaliser des travaux représentant au moins 25 % du coût total de l'opération. L'acquisition d'un logement social par son locataire est aussi possible.",
  },
  {
    q: "Comment est déterminé le montant du PTZ ?",
    a: "Le montant = quotité × coût de l'opération retenu (plafonné selon la zone et le nombre d'occupants). La quotité dépend de votre tranche de revenus : 50 % pour les ménages les plus modestes (tranche 1), 40 % pour les tranches 2 et 3, et 20 % pour la tranche 4. La tranche se détermine en divisant votre revenu fiscal de référence par un coefficient familial.",
  },
  {
    q: "Quels sont les plafonds de revenus ?",
    a: "L'éligibilité dépend du revenu fiscal de référence de l'année N-2 (ou du coût total ÷ 9 s'il est plus élevé), rapporté à un coefficient familial qui augmente avec le nombre d'occupants. Le plafond le plus élevé (tranche 4) atteint 49 000 € de revenu pondéré en zone A/B1. Au-delà, le foyer n'est pas éligible.",
  },
  {
    q: "Comment se rembourse le PTZ ?",
    a: "Le PTZ bénéficie d'un différé de remboursement : pendant cette période (jusqu'à plusieurs années selon vos revenus), vous ne remboursez rien sur le PTZ. La durée totale (différé + remboursement) s'échelonne entre 20 et 25 ans. Plus vos revenus sont modestes, plus le différé est long.",
  },
  {
    q: "Ce simulateur est-il officiel ?",
    a: "Non. Il s'agit d'une estimation indicative basée sur le barème 2025 (décret n° 2025-299). Le montant exact dépend de critères précis vérifiés par votre banque et le SGFGAS (zone exacte de la commune, composition du foyer, coût retenu de l'opération). Rapprochez-vous d'un établissement prêteur pour une étude personnalisée.",
  },
],

  '/simulateurs/rendement-locatif': [
      { q: "Quelle est la différence entre rendement brut et net ?", a: "Le rendement brut = (loyers annuels / prix d'achat) × 100. Le rendement net déduit les charges : taxe foncière, charges de copropriété non récupérables, assurance PNO, frais de gestion (7-10 % des loyers), vacance locative et provisions pour travaux. Le rendement net est typiquement 2 à 3 points inférieur au brut." },
      { q: "Qu'est-ce que le rendement net-net (après fiscalité) ?", a: "Le rendement net-net tient compte de la fiscalité des loyers. En régime réel, les charges et intérêts d'emprunt sont déductibles, ce qui peut créer un déficit foncier (plafonné à 10 700 €/an sur le revenu global). Au micro-foncier (recettes < 15 000 €/an), l'abattement forfaitaire de 30 % s'applique automatiquement." },
      { q: "Quel rendement locatif brut viser en 2025 ?", a: "Un rendement brut de 6 % ou plus est généralement considéré comme intéressant pour une location nue en France. Les zones tendues (Paris, Lyon, Bordeaux) offrent souvent 3-4 % brut mais plus de sécurité locative et de plus-value potentielle. Les villes moyennes et périphéries permettent d'atteindre 7-10 % brut avec des risques plus élevés." },
      { q: "Comment est imposée la location nue ?", a: "Les revenus fonciers s'ajoutent au revenu imposable. En dessous de 15 000 €/an : micro-foncier avec 30 % d'abattement. Au-delà ou sur option : régime réel avec déduction de toutes les charges. Les loyers supportent aussi les prélèvements sociaux (17,2 %)." },
      { q: "Qu'est-ce que la location meublée (LMNP) ?", a: "La location meublée non professionnelle (LMNP) relève des BIC. Au micro-BIC (recettes < 77 700 €/an), l'abattement est de 50 %. Au régime réel, l'amortissement du bien (sur 25-40 ans) et du mobilier permet souvent de générer un résultat nul ou déficitaire, éliminant la fiscalité pendant de nombreuses années." },
      { q: "Comment calculer la rentabilité d'un investissement locatif avec emprunt ?", a: "Le cash-flow mensuel = loyers − mensualité de crédit − charges non récupérables − taxe foncière mensuelle. Un cash-flow positif ou nul est l'objectif minimal. L'effet de levier du crédit améliore le rendement sur fonds propres si le coût du crédit (taux) est inférieur au rendement brut de l'actif." },
    ],

  '/simulateurs/rente-capital': [
  {
    q: "Quelle est la différence entre rente viagère et retrait programmé ?",
    a: "La rente viagère convertit votre capital en un revenu mensuel garanti jusqu'à votre décès, quoi qu'il arrive. Le retrait programmé conserve votre capital et vous permet de retirer une mensualité sur une durée déterminée, avec la possibilité de transmettre le capital restant à votre décès.",
  },
  {
    q: "Qu'est-ce que le taux de conversion d'une rente ?",
    a: "Le taux de conversion (ou taux de rente) est le pourcentage annuel de votre capital converti en rente. Par exemple, avec un capital de 200 000 € et un taux de 4,5 %, vous recevrez 9 000 €/an soit 750 €/mois brut. Ce taux dépend de votre âge, de votre sexe et des conditions de marché (taux techniques de l'assureur).",
  },
  {
    q: "Comment est imposée la rente viagère ?",
    a: "La rente viagère issue d'un PER est imposée comme un revenu ordinaire (barème IR). Pour une rente issue d'une assurance-vie (rente à titre onéreux), seule une fraction est imposable : 40 % entre 60 et 69 ans, 30 % à partir de 70 ans — et les prélèvements sociaux s'appliquent sur cette même fraction.",
  },
  {
    q: "À quel âge la rente devient-elle plus avantageuse ?",
    a: "Le 'point de bascule' dépend des rendements, du taux de conversion et de votre espérance de vie. En général, si vous vivez plus de 20-25 ans après le départ, la rente viagère est plus avantageuse car elle continue indéfiniment. Le retrait programmé est préférable si vous souhaitez transmettre un capital ou anticipez une durée de retraite courte.",
  },
  {
    q: "Peut-on combiner les deux approches ?",
    a: "Oui, c'est souvent recommandé : convertir une partie du capital en rente pour couvrir les dépenses incompressibles (loyer, alimentation) et garder une autre partie en retrait programmé pour les dépenses variables et la transmission. Cette approche hybride réduit le risque de survie tout en conservant une flexibilité.",
  },
],

  '/simulateurs/retraite-anticipee': [
  {
    q: "Qu'est-ce que le dispositif carrières longues (RACL) ?",
    a: "Le dispositif de Retraite Anticipée pour Carrières Longues (RACL) permet de partir à la retraite avant l'âge légal si vous avez commencé à travailler jeune. Après la réforme de 2023, vous pouvez partir à 60 ans si vous avez débuté avant 21 ans (avec 5 trimestres cotisés avant vos 21 ans), ou à 58 ans si vous avez commencé avant 17 ans. Dans les deux cas, vous devez avoir cotisé la durée requise pour votre génération plus 2 trimestres supplémentaires.",
  },
  {
    q: "Comment fonctionne la décote ?",
    a: "La décote s'applique si vous partez à la retraite avant d'avoir atteint le taux plein (durée de cotisation complète). Chaque trimestre manquant entraîne une réduction de 1,25 % de votre pension, dans la limite de 20 trimestres (soit -25 % au maximum). Attention : la décote s'applique même si vous partez à l'âge légal si vous n'avez pas tous vos trimestres.",
  },
  {
    q: "Qu'est-ce que la surcote ?",
    a: "La surcote récompense les assurés qui continuent à travailler après avoir atteint le taux plein (âge légal + durée de cotisation complète). Chaque trimestre supplémentaire cotisé au-delà du taux plein augmente la pension de 1,25 %, sans plafond légal. C'est une incitation financière significative à prolonger son activité.",
  },
  {
    q: "Quelle est la durée de cotisation pour le taux plein ?",
    a: "La durée requise dépend de votre année de naissance. La réforme 2023 a progressivement augmenté cette durée : 168 trimestres (42 ans) pour les générations 1958-1960, 169 pour 1961-1963, 170 pour 1964-1965, 171 pour 1966-1967, et 172 trimestres (43 ans) pour les générations 1968 et après. Les générations nées avant 1958 gardent 166 trimestres.",
  },
  {
    q: "Comment est calculée ma pension CNAV de base ?",
    a: "La formule simplifiée est : Salaire annuel moyen (SAM, basé sur vos 25 meilleures années, plafonné au PMSS) × 50 % × (trimestres cotisés / durée requise pour le taux plein). Le PMSS 2025 est de 3 864 €/mois. Si vous avez tous vos trimestres, le coefficient prorata vaut 1. La pension est ensuite ajustée par la décote ou surcote. Ce simulateur utilise le salaire mensuel brut actuel comme proxy du SAM.",
  },
  {
    q: "Les trimestres assimilés (chômage, maladie) comptent-ils pour la RACL ?",
    a: "Les trimestres assimilés (chômage indemnisé, maladie, maternité, invalidité) comptent pour la durée d'assurance (qui détermine le taux plein) mais PAS pour le critère de début de carrière dans le dispositif carrières longues. Ce dernier exige des trimestres cotisés réels (par une activité salariée ou non salariée). Vérifiez votre relevé de carrière sur info-retraite.fr.",
  },
  {
    q: "Puis-je cumuler emploi et retraite après mon départ ?",
    a: "Oui, le cumul emploi-retraite (CER) est possible sous conditions. En CER intégral (vous avez liquidé toutes vos retraites et êtes au taux plein), vos revenus d'activité sont illimités et vous pouvez acquérir de nouveaux droits depuis 2023. En CER partiel, le cumul est plafonné à votre dernier salaire ou 160 % du SMIC. Renseignez-vous auprès de votre caisse de retraite.",
  },
  {
    q: "L'âge légal va-t-il encore changer ?",
    a: "La réforme du système de retraites de 2023 (loi Borne) a fixé le calendrier de montée en charge jusqu'à 64 ans pour les générations 1967 et postérieures. Des débats politiques sont régulièrement ouverts sur ce sujet, mais les modifications éventuelles ne peuvent s'appliquer qu'aux générations pas encore en âge de partir. Pour les personnes proches de la retraite, les règles actuelles s'appliquent.",
  },
],

  '/simulateurs/retraite-luxembourg': [
  { q: "Comment fonctionne la retraite au Luxembourg (CNAP) ?", a: "Le régime général luxembourgeois (CNAP — Caisse Nationale d'Assurance Pension) est un régime par répartition. La pension est calculée sur la base des années de cotisation et du revenu moyen. Le taux de remplacement est l'un des plus élevés d'Europe : environ 73 % du dernier salaire en moyenne pour une carrière complète de 40 ans." },
  { q: "Quel est l'âge légal de retraite au Luxembourg ?", a: "L'âge légal est 65 ans pour une pension normale. Il est possible de partir à 60 ans avec 40 années d'assurance (retraite anticipée ordinaire), ou à 57 ans avec 40 années effectives de cotisation (retraite anticipée pour longues carrières). Il n'y a pas de réforme d'âge prévue à ce stade." },
  { q: "Comment est calculée la pension luxembourgeoise ?", a: "La pension est proportionnelle aux revenus cotisés et à la durée de carrière : environ 1,85 % du revenu moyen mensuel par année de cotisation, avec un forfait supplémentaire par année. Une pension minimale est garantie pour ceux qui ont cotisé au moins 40 ans." },
  { q: "Les frontaliers français ont-ils droit à la retraite luxembourgeoise ?", a: "Oui. Les travailleurs frontaliers qui ont cotisé au Luxembourg ont droit à une pension CNAP proportionnelle à leurs années de cotisation luxembourgeoises. La pension est ensuite versée en France, mais reste soumise à l'impôt luxembourgeois sous la plupart des conventions fiscales." },
  { q: "Puis-je cumuler pension luxembourgeoise et pension française ?", a: "Oui, le règlement européen (CE 883/2004) organise la coordination des régimes. Chaque pays calcule une pension 'nationale' proportionnelle aux années cotisées dans ce pays. Vous percevrez une pension de chaque régime auquel vous avez cotisé, dans les conditions d'âge propres à chacun." },
],

  '/simulateurs/retraite-progressive': [
  { q: "Qui peut bénéficier de la retraite progressive ?", a: "La retraite progressive est ouverte aux salariés du secteur privé (et depuis 2023 aux fonctionnaires) ayant atteint l'âge légal diminué de 2 ans (soit 62 ans pour les nés en 1965+) ET justifiant d'au moins 150 trimestres validés. Vous devez travailler à temps partiel (entre 40 % et 80 % d'un temps plein)." },
  { q: "Comment est calculée la fraction de pension versée ?", a: "La fraction de pension = 1 − quotité de travail. Par exemple, si vous travaillez à 60 %, vous percevez 40 % de vos droits à pension acquis au moment de la liquidation. Cette fraction est recalculée en cas de changement de quotité." },
  { q: "La retraite progressive améliore-t-elle la pension finale ?", a: "Oui, de deux façons : (1) vous continuez à valider des trimestres, ce qui augmente votre durée d'assurance ; (2) vous pouvez cumuler une surcote si vous aviez déjà le taux plein. Au moment de votre départ définitif, vos droits sont recalculés en tenant compte de toute votre carrière, y compris la période progressive." },
  { q: "La retraite progressive est-elle cumulable avec tous les régimes ?", a: "La retraite progressive existe dans le régime général CNAV (salariés du privé) et depuis la réforme 2023 dans la fonction publique. Les indépendants (SSI) peuvent également en bénéficier. Elle n'est pas applicable aux régimes spéciaux. Dans tous les cas, la pension partielle et le revenu d'activité se cumulent sans plafond pendant la période progressive." },
],

  '/simulateurs/salaire': [
  { q: "Quel est le taux de cotisations sociales salarié en France en 2025 ?", a: "Le taux global de cotisations salariales pour un non-cadre est d'environ 22-23 % du brut (maladie, vieillesse, chômage, CSG/CRDS). Pour un cadre, il est légèrement supérieur (24-25 %) du fait de la cotisation Agirc-Arrco T2 et de la prévoyance obligatoire cadre (APEC)." },
  { q: "Comment passer du salaire brut au net ?", a: "Net ≈ Brut × (1 − taux de cotisations salariales). En pratique, multipliez le brut par ~0,77 (non-cadre) ou ~0,75 (cadre) pour obtenir le net avant impôt. Le prélèvement à la source (PAS) est ensuite déduit du net imposable, donnant le net en poche." },
  { q: "Quelle est la différence entre net imposable et net en poche ?", a: "Le net imposable inclut la CSG déductible (6,8 %) et sert de base au calcul de l'impôt sur le revenu. Le net en poche (net fiscal) est le montant versé sur le compte après prélèvement à la source (PAS). L'écart varie selon votre tranche marginale d'imposition." },
  { q: "Le 13e mois est-il soumis aux cotisations sociales ?", a: "Oui, le 13e mois (prime annuelle contractuelle) est un salaire comme les autres : il est soumis aux cotisations sociales (patronales et salariales) et à l'impôt sur le revenu. Il n'existe pas d'exonération spécifique pour le 13e mois, contrairement à certaines primes d'intéressement ou participation." },
  { q: "Qu'est-ce que le SMIC en 2025 ?", a: "Le SMIC brut mensuel 2025 est de 1 801,80 € (base 35 h/semaine), soit environ 1 426 € net. Il est revalorisé chaque 1er janvier et peut être revalorisé en cours d'année si l'inflation dépasse 2 %. Le taux horaire brut est de 11,88 €." },
  { q: "Comment fonctionne la réduction Fillon (allègement général) ?", a: "La réduction générale de cotisations patronales (dite « Fillon ») s'applique aux salaires ≤ 1,6 SMIC et réduit les charges patronales jusqu'à 32 % du brut pour les entreprises de plus de 50 salariés. Cet allègement est automatiquement calculé par l'employeur et n'apparaît pas sur le bulletin de paie du salarié." },
],

  '/simulateurs/succession': [
  { q: "Comment fonctionne l'abattement pour un enfant ?", a: "Chaque enfant bénéficie d'un abattement de 100 000 € sur sa part successorale. Cet abattement se recharge tous les 15 ans. Les dons effectués dans les 15 années précédant le décès viennent en réduction de cet abattement." },
  { q: "Le conjoint est-il vraiment exonéré à 100 % ?", a: "Oui, depuis la loi TEPA de 2007, le conjoint survivant et le partenaire de PACS sont totalement exonérés de droits de succession, quelle que soit la valeur du patrimoine transmis." },
  { q: "Qu'est-ce que l'actif net successoral ?", a: "L'actif net successoral est la valeur totale du patrimoine transmis après déduction des dettes (emprunts immobiliers en cours, factures impayées, frais funéraires). C'est la base de calcul des droits." },
  { q: "Les dons antérieurs réduisent-ils l'abattement ?", a: "Oui : les donations effectuées dans les 15 ans précédant le décès s'imputent sur l'abattement disponible. Une donation de 50 000 € faite il y a 10 ans réduit l'abattement enfant de 100 000 € à 50 000 €. Au-delà de 15 ans, l'abattement est totalement rechargé." },
  { q: "Comment se calculent les droits entre frères et sœurs ?", a: "L'abattement est de 15 932 €. Les droits s'appliquent à taux de 35 % jusqu'à 24 430 € et 45 % au-delà. Ce taux élevé explique pourquoi les donations ou assurances-vie sont souvent utilisées pour transmettre à des collatéraux." },
  { q: "Peut-on réduire les droits de succession ?", a: "Oui, plusieurs stratégies existent : donations de son vivant (toutes les 15 ans, l'abattement se recharge), démembrement de propriété (donner la nue-propriété en conservant l'usufruit), assurance-vie (hors succession jusqu'à 152 500 € par bénéficiaire pour les primes versées avant 70 ans). Consultez un notaire pour votre situation." },
],

  '/simulateurs/succession-be': [
  { q: "Quelle est la différence majeure avec les droits de succession en France ?", a: "En France, les héritiers bénéficient d'un abattement de 100 000 € par enfant avant tout calcul. En Belgique, il n'existe pas d'abattement standard de ce type : les droits s'appliquent dès le 1er euro (par tranche progressive). Les taux belges de ligne directe commencent à 3 % (Wallonie) ou 3 % (Bruxelles) et montent jusqu'à 30 %, ce qui est moins élevé qu'en France (jusqu'à 45 % en ligne directe)." },
  { q: "Pourquoi les droits varient-ils selon la région belge ?", a: "Les droits de succession en Belgique sont régionaux : chaque région (Wallonie, Bruxelles-Capitale, Flandre) fixe ses propres taux et règles. La Flandre a par exemple supprimé les droits entre partenaires cohabitants légaux et offre des réductions importantes pour la transmission de l'habitation familiale. Ce simulateur couvre Wallonie et Bruxelles-Capitale." },
  { q: "Le conjoint est-il exonéré en Belgique ?", a: "Oui, le conjoint marié et le cohabitant légal sont entièrement exonérés de droits de succession dans les 3 régions belges. Cette exonération s'applique indépendamment du montant de l'héritage." },
  { q: "Existe-t-il des réductions ou planification possible ?", a: "Oui : la donation est un outil clé. En Wallonie et à Bruxelles, les donations immobilières sont taxées à 3,3 % (ligne directe) et les donations mobilières à 3 % (ligne directe). Après un délai de carence (3 ans en général), ces biens ne font plus partie de la succession. Les assurances-vie peuvent aussi permettre une transmission hors succession." },
  { q: "La maison familiale bénéficie-t-elle d'un régime particulier ?", a: "En Wallonie, la résidence principale transmise en ligne directe entre époux ou cohabitants légaux bénéficie d'une exonération totale de droits de succession. À Bruxelles, une réduction d'impôt s'applique pour la partie inférieure à 160 000 €. Ces régimes incitatifs visent à maintenir les familles dans leur logement." },
],

  '/simulateurs/succession-ch': [
  { q: "Les enfants paient-ils des droits de succession en Suisse ?", a: "Dans la grande majorité des cantons suisses, les descendants en ligne directe (enfants, petits-enfants) sont totalement exonérés de droits de succession. Seul Appenzell Rhodes-Intérieures impose encore les enfants à un taux symbolique. Le conjoint survivant est également exonéré dans tous les cantons." },
  { q: "Est-ce que la Confédération prélève des droits de succession ?", a: "Non. En Suisse, il n'existe pas de droits de succession fédéraux. Seuls les cantons (et parfois les communes) peuvent percevoir ces taxes. Chaque canton a sa propre loi, ce qui explique les disparités importantes entre Zoug (très peu taxé) et Neuchâtel (taux plus élevés pour les tiers)." },
  { q: "Qu'est-ce que la réserve héréditaire en droit suisse ?", a: "La réserve héréditaire protège certains héritiers légaux contre une déshérison totale. En droit suisse (réforme 2023), les enfants ont droit à 50 % de leur part légale comme réserve. Le conjoint survivant bénéficie d'une réserve de 25 % de sa part légale." },
  { q: "Peut-on réduire les droits de succession par donation de son vivant ?", a: "Oui. Les donations entre vifs permettent de transmettre son patrimoine de manière anticipée. En Suisse, les règles varient selon les cantons : certains assimilent les donations récentes à la succession, d'autres les exonèrent. La planification successorale avec un notaire est recommandée pour les patrimoines importants." },
],

  '/simulateurs/synthese-retraite': [
  { q: "Comment fonctionne la synthèse tous régimes ?", a: "La plupart des actifs cotisent à plusieurs régimes : le régime de base (CNAV pour les salariés, RSI/SSI pour les indépendants, CNRACL pour les fonctionnaires) + un régime complémentaire (Agirc-Arrco pour les salariés du privé, IRCANTEC pour les contractuels publics). La synthèse additionne les pensions estimées de chaque régime pour obtenir la pension totale." },
  { q: "Quelle est la pension moyenne en France ?", a: "En 2024, la pension moyenne tous régimes confondus s'élève à environ 1 530 € bruts par mois (1 680 € pour les hommes, 1 390 € pour les femmes). Ces montants incluent les régimes de base et complémentaires. Le montant net perçu est en général 15-20 % inférieur (CSG, CRDS, mutuelle)." },
  { q: "Peut-on recevoir une pension de plusieurs régimes simultanément ?", a: "Oui, absolument. Une carrière mixte (salarié privé puis fonctionnaire, ou salarié puis indépendant) donne lieu à des pensions provenant de chaque régime au prorata de la carrière cotisée dans chacun. Il faut liquider chaque régime séparément et ils versent leurs pensions indépendamment." },
  { q: "Comment est calculée la pension de réversion ?", a: "La pension de réversion du régime général (CNAV) correspond à 54 % de la retraite du défunt, sous condition de ressources (plafond 2025 : 24 232 €/an pour une personne seule). La réversion Agirc-Arrco est de 60 % des points du défunt, sans condition de ressources." },
  { q: "Qu'est-ce que le minimum contributif ?", a: "Le minimum contributif (MICO) garantit une pension de base CNAV minimale pour ceux qui ont cotisé toute leur carrière avec de faibles salaires. En 2025, il s'élève à 876,91 € par mois pour une carrière complète au taux plein (majoré à 963,31 € si 120 trimestres cotisés avec revenus > 0,5 SMIC)." },
  { q: "La retraite est-elle imposable ?", a: "Oui, les pensions de retraite sont soumises à l'impôt sur le revenu, après abattement de 10 % (plafonné à 4 123 € par foyer en 2025). Elles supportent également la CSG à 8,3 % (avec possibilité de taux réduit à 3,8 % ou exonération selon les revenus) et la CRDS à 0,5 %." },
],

  '/simulateurs/trimestres': [
  { q: "Quelle est la différence entre trimestres cotisés et assimilés ?", a: "Les trimestres cotisés sont ceux où des cotisations ont été versées à la Sécurité sociale (emploi, travail indépendant). Les trimestres assimilés sont attribués pour certaines périodes sans activité : chômage, maladie, maternité, service militaire, invalidité. Ils comptent pour la durée d'assurance (taux plein) mais pas tous pour la retraite de base." },
  { q: "Combien de trimestres faut-il pour partir à taux plein ?", a: "La durée requise dépend de votre année de naissance. Pour les générations nées à partir de 1965, il faut 172 trimestres (43 ans) suite à la réforme 2023. Pour les générations 1960 et avant, 167 trimestres (41 ans et 9 mois) suffisent." },
  { q: "Que se passe-t-il si je n'ai pas tous mes trimestres à l'âge légal ?", a: "Vous pouvez continuer à travailler jusqu'à atteindre le nombre requis, ou partir à 67 ans au taux plein automatique quelle que soit la durée validée. Partir avant avec des trimestres manquants entraîne une décote de 1,25 % par trimestre manquant (max 20 trimestres décotés)." },
  { q: "Les trimestres de chômage comptent-ils vraiment ?", a: "Oui. Les périodes de chômage indemnisé (Pôle emploi / France Travail) ouvrent droit à des trimestres assimilés : 50 jours indemnisés = 1 trimestre (dans la limite de 4 par an). Le chômage non indemnisé ne donne pas de trimestres." },
  { q: "Combien de trimestres MDA puis-je obtenir par enfant ?", a: "Pour chaque enfant né ou adopté après le 1er janvier 2010, les parents cumulent 4 trimestres de majoration (2 pour la maternité + 2 pour l'éducation). Pour les enfants nés avant 2010, la femme bénéficiait automatiquement de 4 trimestres par enfant. Un maximum de 4 trimestres par enfant est accordé." },
],

  '/simulateurs/vie-en-semaines': [
      { q: "Pourquoi visualiser sa vie en semaines ?", a: "L'auteur Tim Urban (Wait But Why) a popularisé cette visualisation pour montrer, de façon concrète, combien de temps il reste. La grille rend tangible ce que notre cerveau a du mal à appréhender : le temps est fini, et il passe vite." },
      { q: "D'où vient l'espérance de vie ?", a: "Les chiffres par défaut (80 ans pour les hommes, 85 ans pour les femmes) sont basés sur les données INSEE 2024 pour la France. Ils ne tiennent pas compte de votre état de santé, de vos habitudes ou de vos antécédents familiaux — ajustez-les selon votre situation." },
      { q: "Est-ce que ce simulateur peut être anxiogène ?", a: "Pour certaines personnes, oui. Si vous le ressentez ainsi, nous vous encourageons à regarder ce qui est déjà accompli (cases dorées) plutôt que ce qui reste. L'objectif est la clarté, pas l'anxiété. Vos semaines restantes sont un capital précieux à investir consciemment." },
      { q: "Comment utiliser cette visualisation ?", a: "Certaines personnes impriment leur grille et la collent au bureau. D'autres se posent chaque trimestre : 'Est-ce que j'utilise mes semaines de façon alignée avec mes priorités ?' L'outil n'est pas là pour juger, mais pour aider à décider." },
    ],

};
