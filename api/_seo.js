// Contenu SEO pré-rendu (H1 + intro) injecté EN DUR dans le HTML statique de
// chaque simulateur au build (scripts/generate-static-html.mjs). Objectif : du
// vrai texte crawlable présent sans exécution JS — complète le JSON-LD déjà
// injecté. Le bloc est placé dans #root ; React le remplace au montage côté
// client (rendu client, pas d'hydratation → aucun risque d'incohérence).
//
// Clé = chemin de route. Intro = 2-3 phrases factuelles et descriptives.
import { COMPARATIFS } from '../src/data/comparatifs.js';

export const SEO_CONTENT = {
  '/simulateurs/agirc-arrco': {
    h1: "Simulateur retraite complémentaire Agirc-Arrco 2026",
    intro: "Estimez votre pension complémentaire Agirc-Arrco à partir de votre salaire, vos points acquis et votre âge de départ. Le calcul intègre la valeur du point, le coefficient de solidarité (bonus-malus), la GMP des cadres et une revalorisation projetée, pour une estimation nette mensuelle en quelques secondes.",
  },
  '/simulateurs/cnav': {
    h1: "Simulateur retraite de base CNAV — régime général",
    intro: "Calculez votre pension de base du régime général (CNAV) selon votre salaire annuel moyen, vos trimestres validés et votre âge de départ. Le simulateur applique le taux plein, la décote ou la surcote et estime votre future retraite de base, à compléter par vos régimes complémentaires.",
  },
  '/simulateurs/fonction-publique': {
    h1: "Simulateur retraite de la fonction publique",
    intro: "Évaluez votre pension de fonctionnaire d'État, territorial ou hospitalier à partir de votre indice majoré, votre durée de services et vos bonifications. Le calcul distingue catégorie sédentaire et active et intègre la décote/surcote selon votre âge de départ.",
  },
  '/simulateurs/independants': {
    h1: "Simulateur retraite des indépendants et TNS",
    intro: "Artisan, commerçant ou profession libérale : estimez votre retraite de base (SSI) et complémentaire selon vos revenus professionnels, vos années cotisées et votre âge de départ. Une projection claire de votre future pension de travailleur non salarié.",
  },
  '/simulateurs/ircantec': {
    h1: "Simulateur retraite IRCANTEC — contractuels publics",
    intro: "Agents non titulaires de la fonction publique et élus locaux : estimez votre retraite complémentaire IRCANTEC. Le simulateur convertit vos cotisations en points, applique la valeur de service du point et projette votre pension complémentaire annuelle et mensuelle.",
  },
  '/simulateurs/retraite-progressive': {
    h1: "Simulateur de retraite progressive",
    intro: "Vous envisagez de réduire votre activité avant la retraite complète ? Estimez le montant de votre pension partielle pendant la retraite progressive et l'impact de ce temps partiel sur votre future pension définitive, tous régimes confondus.",
  },
  '/simulateurs/cnavpl': {
    h1: "Simulateur retraite des professions libérales (CIPAV)",
    intro: "Estimez votre retraite de base et votre complémentaire CIPAV si vous exercez une profession libérale non réglementée. Le calcul tient compte de vos revenus, de vos années de cotisation et de votre âge de départ pour projeter votre pension.",
  },
  '/simulateurs/msa': {
    h1: "Simulateur retraite agricole MSA",
    intro: "Exploitant ou salarié agricole : calculez votre retraite de base MSA et votre retraite complémentaire obligatoire (RCO). Le simulateur projette votre pension selon vos revenus, votre statut et votre durée de carrière agricole.",
  },
  '/simulateurs/emprunt-immobilier': {
    h1: "Simulateur d'emprunt immobilier",
    intro: "Calculez la mensualité, la capacité d'emprunt, le coût total du crédit et le taux d'endettement de votre projet immobilier. Le simulateur inclut les frais de notaire, le cas primo-accédant et un tableau d'amortissement détaillé année par année.",
  },
  '/simulateurs/rendement-locatif': {
    h1: "Simulateur de rendement locatif",
    intro: "Évaluez la rentabilité brute et nette d'un investissement locatif à partir du prix, du loyer, des charges, de la fiscalité et des frais de gestion. Un calcul clair pour comparer vos opportunités d'investissement immobilier.",
  },
  '/simulateurs/ptz': {
    h1: "Simulateur PTZ 2025 — Prêt à Taux Zéro",
    intro: "Estimez le montant de votre Prêt à Taux Zéro selon votre zone, la composition de votre foyer et vos revenus. Le simulateur détermine votre tranche, la quotité finançable et le montant du PTZ, selon le barème 2025 (décret n° 2025-299).",
  },
  '/simulateurs/impot-revenu': {
    h1: "Simulateur d'impôt sur le revenu 2026",
    intro: "Estimez votre impôt sur le revenu net, votre tranche marginale d'imposition (TMI) et votre taux moyen selon votre situation familiale et votre revenu imposable. Le calcul applique le barème progressif et la décote pour une estimation fiable.",
  },
  '/simulateurs/plus-value-immobiliere': {
    h1: "Simulateur de plus-value immobilière",
    intro: "Calculez l'imposition de la plus-value lors de la vente d'un bien immobilier selon le prix d'achat, le prix de vente et la durée de détention. Le simulateur applique les abattements pour durée et estime l'impôt sur le revenu et les prélèvements sociaux dus.",
  },
  '/simulateurs/budget': {
    h1: "Simulateur de budget 50/30/20",
    intro: "Répartissez votre budget mensuel selon la règle d'or 50/30/20 : besoins, envies et épargne. Visualisez en temps réel l'équilibre de vos finances et votre taux d'épargne, avec des conseils personnalisés selon votre situation.",
  },
  '/simulateurs/salaire': {
    h1: "Simulateur salaire net / brut et carrière",
    intro: "Convertissez votre salaire brut en net, projetez son évolution sur plusieurs décennies et mesurez l'impact de l'inflation sur votre pouvoir d'achat réel. Un outil pour anticiper votre progression de rémunération.",
  },
  '/simulateurs/epargne': {
    h1: "Simulateur d'épargne et intérêts composés",
    intro: "Projetez la croissance de votre épargne sur le long terme grâce aux intérêts composés et à des versements réguliers. Visualisez le capital atteint selon le rendement, la durée et l'effort d'épargne mensuel.",
  },
  '/simulateurs/fire': {
    h1: "Simulateur FIRE — indépendance financière",
    intro: "Calculez le patrimoine nécessaire pour vivre de vos investissements et l'âge auquel vous atteindrez l'indépendance financière. Le simulateur applique la règle des 4 %, les paliers Lean/Coast/Fat FIRE et trace votre trajectoire année par année.",
  },
  '/simulateurs/frais-notaire': {
    h1: "Simulateur de frais de notaire 2025",
    intro: "Calculez les frais de notaire (frais d'acquisition) de votre achat immobilier : droits de mutation, émoluments du notaire, contribution de sécurité immobilière et débours. Le simulateur distingue l'ancien (~7-8 % du prix) et le neuf (~2-3 %) pour une estimation instantanée.",
  },
  '/simulateurs/per': {
    h1: "Simulateur PER — Plan d'Épargne Retraite",
    intro: "Estimez l'économie d'impôt liée à vos versements sur un PER et le capital projeté à la retraite. Le calcul applique le plafond de déduction (10 % des revenus, PASS 2025) selon votre tranche marginale d'imposition et votre horizon de placement.",
  },
  '/simulateurs/pension-reversion': {
    h1: "Simulateur de pension de réversion 2025",
    intro: "Estimez la pension de réversion du conjoint survivant : 54 % de la retraite de base (CNAV) et 60 % de la complémentaire Agirc-Arrco. Le calcul intègre la condition de ressources (plafond 2025 selon votre situation) et l'âge minimum de 55 ans pour une estimation mensuelle claire.",
  },
  '/simulateurs/synthese-retraite': {
    h1: "Synthèse retraite tous régimes — votre pension totale",
    intro: "Additionnez les pensions de tous vos régimes de retraite (CNAV, Agirc-Arrco, fonction publique, indépendants, IRCANTEC, MSA, CIPAV) pour estimer votre retraite totale. Idéal pour les polypensionnés : pension brute et nette mensuelle, total annuel et taux de remplacement par rapport à votre dernier salaire.",
  },
  '/simulateurs/patrimoine': {
    h1: "Simulateur de patrimoine global",
    intro: "Consolidez l'ensemble de votre patrimoine — financier, immobilier et retraite — pour visualiser votre richesse nette et sa répartition par classe d'actifs. Une vue d'ensemble claire de votre situation patrimoniale.",
  },
  '/simulateurs/comparateur': {
    h1: "Comparateur d'actifs — ETF, actions, crypto",
    intro: "Comparez la performance historique d'ETF, d'actions et de cryptomonnaies sur la période de votre choix, à partir de données réelles. Retour total, rendement annualisé (CAGR), versements programmés et indice base 100 pour des comparaisons lisibles.",
  },
  '/simulateurs/assurance-vie': {
    h1: "Simulateur d'assurance-vie — rendement et fiscalité",
    intro: "Projetez la croissance de votre assurance-vie et estimez la fiscalité de vos gains au rachat : avantage des 8 ans de détention, abattement annuel, prélèvement forfaitaire et prélèvements sociaux de 17,2 %, selon les paramètres 2025.",
  },
  '/simulateurs/credit-conso': {
    h1: "Simulateur de crédit à la consommation",
    intro: "Calculez la mensualité, le coût total et le total des intérêts de votre crédit conso selon le montant emprunté, le TAEG et la durée. Le simulateur inclut une assurance facultative et un tableau d'amortissement.",
  },
  '/simulateurs/cout-en-heures': {
    h1: "Simulateur : le vrai prix en heures de vie",
    intro: "Convertissez n'importe quel achat en heures de travail réelles. À partir de votre salaire, découvrez le coût véritable d'un bien ou d'un abonnement, exprimé en temps de vie plutôt qu'en euros.",
  },
  '/simulateurs/vie-en-semaines': {
    h1: "Simulateur : ma vie en semaines",
    intro: "Visualisez l'intégralité de votre vie sous forme de grille, une case par semaine. Combien de semaines avez-vous vécues, combien vous en reste-t-il ? Une perspective marquante sur le temps qui passe.",
  },
  // Retraite par métier — 30 professions
  '/retraite/fonctionnaire': {
    h1: "Retraite du fonctionnaire 2026 — calcul de la pension, âge et taux",
    intro: "Les fonctionnaires de l'État, des collectivités territoriales et de l'hôpital public bénéficient d'un régime spécial géré par le SRE ou la CNRACL. La pension est calculée sur le traitement indiciaire brut avec un taux maximum de 75 %, hors primes. L'âge légal est 64 ans en catégorie sédentaire et 59 ans en catégorie active (policiers, pompiers, infirmiers hospitaliers).",
  },
  '/retraite/infirmiere': {
    h1: "Retraite infirmière 2026 — FPH, CARPIMKO ou CNAV selon votre statut",
    intro: "La retraite d'une infirmière varie selon son statut : hospitalière publique FPH classée en catégorie active (départ à 59 ans avec 17 ans de services), libérale relevant de la CARPIMKO (taux plein à 67 ans ou 62 ans avec durée complète), ou salariée du privé cotisant au régime général CNAV et à Agirc-Arrco (départ à 64 ans).",
  },
  '/retraite/enseignant': {
    h1: "Retraite enseignant 2026 — calcul sur l'indice, RAFP et âge légal",
    intro: "Les enseignants de l'Éducation nationale (professeurs des écoles, certifiés, agrégés, MCF) sont des fonctionnaires de la FPE en catégorie sédentaire. Leur pension est calculée sur le traitement indiciaire brut (taux max 75 %), sans les primes, qui alimentent le RAFP. L'âge légal est progressivement porté à 64 ans pour les générations nées après 1968.",
  },
  '/retraite/agriculteur': {
    h1: "Retraite agriculteur 2026 — MSA, RCO et revalorisation des petites pensions",
    intro: "Les agriculteurs exploitants et salariés agricoles relèvent de la MSA (Mutualité Sociale Agricole). Le régime comprend une retraite de base et la Retraite Complémentaire Obligatoire (RCO). La loi Chassaigne a relevé les pensions minimales à 85 % du SMIC net, soit environ 1 130 €/mois en 2026 pour une carrière complète.",
  },
  '/retraite/medecin-liberal': {
    h1: "Retraite médecin libéral 2026 — CARMF, ASV et stratégie d'épargne",
    intro: "Les médecins libéraux cotisent à la CARMF qui gère trois régimes : la retraite de base CNAVPL, le régime complémentaire par points et l'Allocation Supplémentaire Vieillesse (ASV). L'ASV est particulièrement avantageuse en secteur 1 car l'Assurance maladie prend en charge deux tiers des cotisations. Le taux de remplacement est de 30 à 45 % des revenus libéraux.",
  },
  '/retraite/avocat': {
    h1: "Retraite avocat 2026 — CNBF, part forfaitaire et complémentaire par points",
    intro: "Les avocats disposent d'un régime autonome géré par la CNBF (Caisse Nationale des Barreaux Français). La retraite de base comprend une part forfaitaire et une part proportionnelle aux revenus. Le régime complémentaire fonctionne par points. L'âge légal de départ est fixé à 65 ans pour le taux plein automatique.",
  },
  '/retraite/artisan': {
    h1: "Retraite artisan 2026 — SSI (ex-RSI), RCI et validation des trimestres",
    intro: "Les artisans cotisent à la Sécurité Sociale des Indépendants (SSI, anciennement RSI). Le régime comprend une retraite de base SSI et une retraite complémentaire RCI par points. Pour valider 4 trimestres par an, le revenu doit dépasser 600 fois le SMIC horaire (~6 500 € en 2026). L'âge légal est 64 ans depuis la réforme 2023.",
  },
  '/retraite/commercant': {
    h1: "Retraite commerçant 2026 — SSI, RCI et stratégie de cession du fonds",
    intro: "Les commerçants relèvent du même régime que les artisans : SSI pour la retraite de base et RCI pour la complémentaire par points. L'âge légal est 64 ans. La cession du fonds de commerce constitue souvent le principal actif retraite, potentiellement exonérée de plus-value via l'article 151 septies du CGI.",
  },
  '/retraite/pharmacien': {
    h1: "Retraite pharmacien libéral 2026 — CAVP, calcul et optimisation",
    intro: "Les pharmaciens titulaires d'officine cotisent à la CAVP (Caisse d'Assurance Vieillesse des Pharmaciens) pour leur complémentaire par points, et à la CNAVPL pour la retraite de base. L'âge du taux plein est 67 ans ou 62 ans avec la durée requise. La cession de l'officine représente souvent plusieurs centaines de milliers d'euros d'actif retraite.",
  },
  '/retraite/chirurgien-dentiste': {
    h1: "Retraite chirurgien-dentiste libéral 2026 — CARCDSF et cession de cabinet",
    intro: "Les chirurgiens-dentistes libéraux cotisent à la CARCDSF pour leur complémentaire par points et à la CNAVPL pour la retraite de base. Le taux de remplacement est de 25 à 40 % des revenus libéraux. La cession du cabinet dentiste (400 000 à 1 000 000 € selon le CA) constitue le principal actif retraite pour beaucoup de praticiens.",
  },
  '/retraite/sage-femme': {
    h1: "Retraite sage-femme 2026 — FPH catégorie active, CARCDSF et CNAV",
    intro: "La retraite d'une sage-femme dépend de son statut : hospitalière publique FPH en catégorie active (départ à 59 ans), libérale relevant de la CARCDSF (taux plein à 67 ans ou 62 ans), ou salariée du privé (CNAV + Agirc-Arrco, départ à 64 ans). Les gardes de nuit donnent droit à des bonifications de durée d'assurance à la FPH.",
  },
  '/retraite/veterinaire': {
    h1: "Retraite vétérinaire libéral 2026 — CARPV, calcul de pension et cession",
    intro: "Les vétérinaires libéraux cotisent à la CARPV (Caisse Autonome de Retraite et de Prévoyance des Vétérinaires) pour leur complémentaire par points et à la CNAVPL pour la retraite de base. Le taux de remplacement est de 30 à 45 % des revenus libéraux. La cession de la clinique vétérinaire peut bénéficier d'exonérations fiscales.",
  },
  '/retraite/notaire': {
    h1: "Retraite notaire 2026 — CRPCEN pour clercs, régime libéral pour titulaires",
    intro: "Les clercs de notaire et salariés des offices relèvent de la CRPCEN (régime spécial avec âge de départ à 62 ans et taux max 75 %). Les notaires titulaires libéraux cotisent à la CNAVPL et au régime complémentaire du notariat. La distinction clercs/titulaires est fondamentale pour comprendre les droits à la retraite.",
  },
  '/retraite/expert-comptable': {
    h1: "Retraite expert-comptable libéral 2026 — CAVEC et classes de cotisation",
    intro: "Les experts-comptables libéraux cotisent à la CAVEC (Caisse d'Assurance Vieillesse des Experts-Comptables) pour leur complémentaire par points et à la CNAVPL pour la retraite de base. La CAVEC propose plusieurs classes de cotisation (A à H) qui déterminent les points acquis annuellement. Le taux de remplacement est de 30 à 45 %.",
  },
  '/retraite/architecte': {
    h1: "Retraite architecte libéral 2026 — CIPAV, classes de cotisation et pension",
    intro: "Les architectes libéraux cotisent à la CIPAV (Caisse Interprofessionnelle de Prévoyance et d'Assurance Vieillesse) pour leur complémentaire par points et à la CNAVPL pour la retraite de base. La CIPAV propose des classes de cotisation A à H. L'âge du taux plein est 67 ans ou 62 ans avec la durée d'assurance complète.",
  },
  '/retraite/ingenieur-cadre': {
    h1: "Retraite cadre ingénieur 2026 — CNAV + Agirc-Arrco et coefficient de solidarité",
    intro: "Les ingénieurs et cadres du secteur privé cotisent au régime général CNAV et à Agirc-Arrco. Depuis 2019, un coefficient de solidarité de -10 % s'applique pendant 3 ans sur la pension Agirc-Arrco pour les cadres partant dès 64 ans. Pour l'éviter, il faut attendre 67 ans ou cotiser 4 trimestres supplémentaires après l'âge légal.",
  },
  '/retraite/policier': {
    h1: "Retraite policier 2026 — CNRACL catégorie active, départ à 57 ans",
    intro: "Les policiers nationaux relèvent de la CNRACL en catégorie active. Ils peuvent partir à 57 ans avec 17 ans minimum de services actifs. La bonification du cinquième leur accorde 1 an de durée d'assurance supplémentaire pour chaque 5 ans de services actifs. La pension est calculée sur le traitement indiciaire brut avec un taux maximum de 75 %.",
  },
  '/retraite/militaire': {
    h1: "Retraite militaire 2026 — pension militaire et départ dès 17 ans de services",
    intro: "Les militaires de carrière bénéficient d'un régime de pension militaire géré par le SRE. Les sous-officiers peuvent partir dès 17 ans de services, les officiers dès 27 ans ou à 52 ans. La pension est calculée sur la solde indiciaire brute avec des bonifications pour les campagnes OPEX et les services en zones difficiles.",
  },
  '/retraite/pompier': {
    h1: "Retraite pompier professionnel 2026 — CNRACL, départ à 57 ans et bonification",
    intro: "Les sapeurs-pompiers professionnels sont des fonctionnaires territoriaux classés en catégorie active de la CNRACL. Ils peuvent partir à 57 ans avec 17 ans de services actifs. La bonification du cinquième leur accorde 1 an supplémentaire pour chaque 5 ans de services. La pension est calculée sur le traitement indiciaire brut (taux max 75 %).",
  },
  '/retraite/gendarme': {
    h1: "Retraite gendarme 2026 — pension militaire, départ anticipé et OPEX",
    intro: "Les gendarmes sont des militaires relevant du Service des retraites de l'État. Les sous-officiers peuvent partir dès 17 ans de services, les officiers dès 27 ans ou à 52 ans. La pension est calculée sur la solde indiciaire brute avec des bonifications pour les opérations extérieures (OPEX) et les missions à risque.",
  },
  '/retraite/aide-soignante': {
    h1: "Retraite aide-soignante 2026 — FPH catégorie active et C2P secteur privé",
    intro: "Les aides-soignantes de l'hôpital public sont classées en catégorie active FPH et peuvent partir à 59 ans avec 17 ans de services actifs. Celles du secteur privé cotisent au régime général CNAV (départ à 64 ans) et peuvent bénéficier du Compte Professionnel de Prévention (C2P) pour les facteurs de pénibilité reconnus.",
  },
  '/retraite/magistrat': {
    h1: "Retraite magistrat 2026 — FPE catégorie sédentaire, SRE et limite d'âge",
    intro: "Les magistrats de l'ordre judiciaire sont des fonctionnaires de la FPE en catégorie sédentaire. Leur pension est gérée par le SRE et calculée sur le traitement indiciaire brut (taux max 75 %). L'âge légal est 64 ans depuis la réforme 2023. La limite d'âge (départ obligatoire) est fixée à 67 ans, avec possibilité d'un statut de magistrat honoraire.",
  },
  '/retraite/chauffeur-routier': {
    h1: "Retraite chauffeur routier 2026 — C2P, carrières longues et pénibilité",
    intro: "Les chauffeurs routiers cotisent au régime général CNAV et à Agirc-Arrco. Leur métier expose à plusieurs facteurs de pénibilité reconnus par le C2P (travail de nuit, vibrations, températures extrêmes). Avec suffisamment de points C2P, un départ jusqu'à 2 ans avant l'âge légal est possible. Le dispositif carrières longues permet de partir dès 58 ans.",
  },
  '/retraite/caissiere': {
    h1: "Retraite caissière 2026 — carrières longues, C2P et impact du temps partiel",
    intro: "Les caissières et employées de commerce cotisent au régime général CNAV et à Agirc-Arrco. Le dispositif carrières longues permet un départ dès 58 à 62 ans pour celles ayant commencé à travailler avant 20 ans. Le temps partiel peut pénaliser la validation des trimestres si le salaire annuel est inférieur à 600 fois le SMIC horaire.",
  },
  '/retraite/ouvrier-usine': {
    h1: "Retraite ouvrier industrie 2026 — C2P, pénibilité et départ anticipé",
    intro: "Les ouvriers industriels cotisent au régime général CNAV et à Agirc-Arrco. Leur métier expose à de nombreux facteurs de pénibilité reconnus par le C2P (travail de nuit, 3x8, vibrations, bruit, températures). Ces points permettent un départ jusqu'à 2 ans avant l'âge légal. Une incapacité permanente suite à un accident du travail permet de partir à 60 ou 62 ans.",
  },
  '/retraite/chef-entreprise': {
    h1: "Retraite chef d'entreprise 2026 — TNS ou assimilé-salarié selon statut",
    intro: "La retraite d'un chef d'entreprise dépend de son statut : gérant majoritaire de SARL (TNS, SSI, taux de remplacement 30-45 %) ou président de SAS/SASU (assimilé-salarié, CNAV + Agirc-Arrco, taux de remplacement 55-70 %). La cession de l'entreprise et le PER individuel sont les principaux leviers pour compenser un régime de base insuffisant.",
  },
  '/retraite/auto-entrepreneur': {
    h1: "Retraite auto-entrepreneur 2026 — SSI, cotisations sur CA et droits accumulés",
    intro: "Les auto-entrepreneurs cotisent à la SSI sur leur chiffre d'affaires brut. Les cotisations retraite représentent 12 à 22 % du CA selon l'activité. Pour valider 4 trimestres par an, le CA doit dépasser 18 500 € (services) ou 32 500 € (vente). Un CA faible génère peu de droits — le PER individuel est indispensable pour compenser.",
  },
  '/retraite/intermittent': {
    h1: "Retraite intermittent du spectacle 2026 — CNAV, Audiens et périodes de chômage",
    intro: "Les intermittents du spectacle cotisent au régime général CNAV et au régime complémentaire Audiens. Pour valider 1 trimestre, ils doivent percevoir 150 fois le SMIC horaire de cachets bruts. Les allocations chômage spécifiques (ARE intermittents) génèrent des trimestres assimilés mais n'entrent pas dans le calcul du salaire de référence.",
  },
  '/retraite/expatrie': {
    h1: "Retraite expatrié français 2026 — CFE, conventions bilatérales et totalisation",
    intro: "Les Français travaillant à l'étranger peuvent s'affilier volontairement à la CFE pour maintenir leurs droits à la retraite en France. La France a signé des conventions bilatérales avec plus de 40 pays permettant la totalisation des périodes cotisées. Sans convention ni CFE, les années à l'étranger ne génèrent aucun trimestre pour la retraite française.",
  },
  '/retraite/diplomate': {
    h1: "Retraite diplomate fonctionnaire 2026 — SRE, bonifications et traitement indiciaire",
    intro: "Les diplomates français sont des fonctionnaires de la FPE en catégorie sédentaire. Leur pension est calculée par le SRE sur le traitement indiciaire brut (taux max 75 %). Des bonifications de durée d'assurance s'ajoutent pour les services à l'étranger selon les zones et les missions. Les indemnités de résidence à l'étranger n'entrent pas dans la pension de base.",
  },
  '/retraite/calendrier-generations': {
    h1: "Âge de départ à la retraite par année de naissance — tableau complet 2026",
    intro: "Retrouvez l'âge légal de départ, la durée de cotisation requise et l'âge du taux plein automatique pour toutes les générations nées entre 1955 et 1968, après les réformes de 2010 (Woerth), 2014 (Touraine) et 2023 (Borne). Sources officielles CNAV et COR.",
  },
  '/retraite/a-40-ans': {
    h1: "Préparer sa retraite à 40 ans — guide 2026",
    intro: "À 40 ans, vous disposez encore de 24 ans de capitalisation avant l'âge légal de 64 ans. C'est la période optimale pour ouvrir un PER, vérifier vos trimestres et poser les bases d'une retraite solide. Guide complet : PER, immobilier locatif, bilan de carrière et stratégie d'épargne.",
  },
  '/retraite/a-50-ans': {
    h1: "Préparer sa retraite à 50 ans — guide 2026",
    intro: "À 50 ans, il reste environ 14 ans avant la retraite. C'est le moment du bilan de carrière, des décisions sur le rachat de trimestres et de l'optimisation du PER avant 55 ans. Découvrez comment maximiser votre pension et simuler votre date de départ optimale.",
  },
  '/retraite/carriere-longue': {
    h1: "Retraite carrière longue 2026 — conditions et âge de départ",
    intro: "Le dispositif carrière longue permet de partir à la retraite avant 64 ans si vous avez commencé à travailler tôt. En 2026, les âges de départ varient de 58 à 63 ans selon votre génération et le nombre de trimestres cotisés. Découvrez les conditions précises et simulez votre départ anticipé.",
  },
  '/retraite/parent-au-foyer': {
    h1: "Retraite parent au foyer 2026 — MDA, AVPF et droits",
    intro: "Les parents au foyer bénéficient de deux dispositifs retraite : la Majoration de Durée d'Assurance (4 trimestres par enfant) et l'Assurance Vieillesse des Parents au Foyer (AVPF) versée par la CAF. Comprendre ces droits est essentiel pour ne pas sacrifier sa pension.",
  },
  '/retraite/guide-complet-2026': {
    h1: "Guide complet retraite 2026 : calcul, simulateurs et optimisation",
    intro: "Tout comprendre sur la retraite en 2026 : âge légal 64 ans (génération 1968+), calcul CNAV (SAM × 50 % × trimestres) et Agirc-Arrco (points × 1,4107 €), décote et surcote, rachat de trimestres, taux de remplacement. Guides par profession inclus.",
  },
  '/retraite/points-agirc-arrco': {
    h1: "Points Agirc-Arrco 2026 : valeur du point, calcul et malus",
    intro: "Le point Agirc-Arrco vaut 1,4107 € en 2026 (+2,2 %). Votre pension complémentaire = nombre de points × valeur du point. Guide complet : comment s'accumulent les points, coefficient de solidarité (-10 %), bonus de fidélité (+10 à +30 %) et simulateur gratuit.",
  },
  '/retraite/calcul-pension-reversion': {
    h1: "Pension de réversion 2026 : calcul, taux et conditions",
    intro: "La pension de réversion représente 54 % de la retraite de base (CNAV) et 60 % de la complémentaire Agirc-Arrco. Qui y a droit, à quel âge, sous quelles conditions de ressources ? Guide complet avec simulateur pour estimer votre montant.",
  },
  '/immobilier/frais-notaire': {
    h1: "Frais de notaire 2026 : taux, calcul et comment les réduire",
    intro: "Les frais de notaire représentent 7 à 8 % du prix d'un bien ancien (2 à 3 % dans le neuf). Décomposition exacte des postes, tableau par tranches de prix et 3 stratégies légales pour les minimiser. Simulateur de calcul gratuit.",
  },
  '/widgets': {
    h1: "Widgets embarquables gratuits — simulateurs financiers à intégrer",
    intro: "Intégrez gratuitement les simulateurs de simfinly.com sur votre site ou blog en quelques secondes. Cinq widgets disponibles : épargne et intérêts composés, emprunt immobilier, indépendance financière (FIRE), budget 50/30/20 et retraite CNAV. Copiez-collez le code HTML et c'est tout — aucune inscription, aucune limite d'utilisation.",
  },
  '/barometre-retraite': {
    h1: "Baromètre Retraite France 2026 — Chiffres clés et tendances",
    intro: "Pension moyenne en France, taux de remplacement par régime, âge moyen de départ à la retraite et projections démographiques jusqu'en 2050 : toutes les données essentielles pour comprendre votre futur système de retraite. Sources : DREES, Conseil d'Orientation des Retraites (COR), INSEE.",
  },
  '/recherche': {
    h1: "Recherche — simulateurs, guides et articles financiers",
    intro: "Recherchez parmi les simulateurs financiers, guides thématiques et définitions du lexique de simfinly.com. Trouvez rapidement le bon outil ou la bonne explication pour vos questions sur la retraite, l'épargne, l'immobilier ou la fiscalité.",
  },
  '/outils/qr-code': {
    h1: "Générateur de QR code personnalisé gratuit",
    intro: "Créez un QR code sur mesure : choisissez les couleurs, saisissez le texte ou le lien de votre choix et ajoutez votre logo ou un emoji au centre. Le code est généré dans votre navigateur — aucune donnée envoyée — et téléchargeable en PNG haute résolution, gratuitement et sans inscription.",
  },
  '/comparatifs': {
    h1: "Comparatifs financiers",
    intro: "Des comparaisons claires pour vos grandes décisions : PER ou assurance-vie, louer ou acheter, freelance ou salarié. Chaque comparatif détaille les avantages et inconvénients critère par critère et renvoie vers les simulateurs pour chiffrer votre situation.",
  },
  '/simulateurs/donation': {
    h1: "Simulateur donation vs succession — optimisation fiscale 2026",
    intro: "Comparez donation et succession pour transmettre votre patrimoine au meilleur coût fiscal. Le simulateur calcule les droits applicables selon les abattements légaux (100 000 € par parent et par enfant, renouvelables tous les 15 ans) et vous aide à choisir entre donner de son vivant ou laisser hériter.",
  },
  '/simulateurs/divorce': {
    h1: "Simulateur partage de patrimoine et prestation compensatoire — divorce 2026",
    intro: "Évaluez le partage des biens et la prestation compensatoire lors d'un divorce selon le régime matrimonial (communauté réduite aux acquêts ou séparation de biens). Le simulateur estime l'équilibre patrimonial après séparation et les droits de partage applicables.",
  },
  '/simulateurs/freelance-vs-salarie': {
    h1: "Simulateur freelance vs salarié — revenus nets comparés 2026",
    intro: "Comparez votre revenu net en tant que freelance (micro-entreprise, EURL, SASU) et en tant que salarié à partir d'un chiffre d'affaires ou d'un salaire brut identique. Le simulateur intègre cotisations sociales, impôt sur le revenu et charges pour un arbitrage éclairé.",
  },
  '/simulateurs/epargne-salariale': {
    h1: "Simulateur épargne salariale PEE / PERCO / PERO — gain fiscal 2026",
    intro: "Estimez le gain fiscal et social de votre épargne salariale (PEE, PERCO, PERO) grâce à l'abondement employeur, l'exonération de cotisations et la déductibilité fiscale des versements. Un outil pour comparer les dispositifs et maximiser votre complément de rémunération net.",
  },
  '/simulateurs/deficit-foncier': {
    h1: "Simulateur déficit foncier 2026 — économie d'impôt sur les travaux",
    intro: "Calculez l'économie d'impôt générée par vos travaux de rénovation locative grâce au mécanisme du déficit foncier. Le simulateur intègre le plafond de 10 700 €/an imputable sur le revenu global, le report du surplus sur 10 ans et l'impact sur votre tranche marginale d'imposition.",
  },
  '/simulateurs/retraite-anticipee': {
    h1: "Simulateur retraite anticipée 2026 — carrières longues et conditions d'éligibilité",
    intro: "Vérifiez si vous êtes éligible à la retraite anticipée pour carrière longue (départ dès 58 ou 60 ans), calculez votre pension prévisionnelle et l'impact d'un départ avant l'âge légal. Le simulateur applique les règles de la réforme 2023 (loi Borne) selon votre année de naissance.",
  },
  '/simulateurs/trimestres': {
    h1: "Simulateur trimestres retraite 2026 — durée d'assurance et taux plein",
    intro: "Comptabilisez vos trimestres cotisés et assimilés (chômage, maladie, maternité, MDA, service militaire) pour connaître votre durée d'assurance totale et l'âge auquel vous atteindrez le taux plein. Le simulateur applique les durées requises de la réforme 2023 selon votre génération.",
  },
  '/simulateurs/rente-capital': {
    h1: "Simulateur rente viagère vs retrait programmé — arbitrage retraite",
    intro: "Comparez la rente viagère et les retraits programmés pour votre capital retraite (PER, assurance-vie). Le simulateur calcule le revenu mensuel net, le point mort et le cumul sur 20 ans selon votre tranche marginale et votre espérance de vie, pour choisir le meilleur mode de décaissement.",
  },
  '/simulateurs/inflation': {
    h1: "Simulateur inflation et pouvoir d'achat personnalisé 2026",
    intro: "Mesurez l'impact de l'inflation sur votre budget poste par poste (alimentation, énergie, logement, santé, transports). Projetez l'érosion de votre pouvoir d'achat sur 10 à 30 ans selon des taux d'inflation différenciés par catégorie, et identifiez les leviers pour protéger vos finances.",
  },
  '/simulateurs/succession': {
    h1: "Simulateur droits de succession 2026 — barème officiel par lien de parenté",
    intro: "Calculez les droits de succession français selon le lien de parenté (enfants, frères/sœurs, neveux, tiers) et l'actif net successoral. Le simulateur applique les abattements légaux 2026 et les taux progressifs du barème officiel pour une estimation instantanée des droits dus.",
  },
  '/simulateurs/pension-legale': {
    h1: "Simulateur pension légale Belgique (ONSS) 2025 — salarié et indépendant",
    intro: "Estimez votre pension légale belge selon votre statut (salarié ou indépendant), votre durée de carrière et votre salaire moyen. Le simulateur applique les barèmes ONSS 2025 et distingue la pension de retraite et la pension de survie pour les conjoints survivants.",
  },
  '/simulateurs/comparaison-reforme': {
    h1: "Simulateur réforme retraite 2023 — comparaison avant/après loi Borne",
    intro: "Comparez votre âge de départ et votre pension selon les règles avant et après la réforme des retraites de 2023 (loi Borne). Mesurez l'impact du relèvement de l'âge légal à 64 ans et de l'allongement de la durée de cotisation requise sur votre situation personnelle.",
  },
  '/simulateurs/lpp-deuxieme-pilier': {
    h1: "Simulateur LPP — 2e pilier suisse (accessible depuis la France)",
    intro: "Estimez votre avoir de vieillesse LPP et votre rente du 2e pilier si vous travaillez ou avez travaillé en Suisse. Salaire coordonné, taux d'intérêt LPP 2025 et projection de rente selon votre durée de cotisation — utile pour les frontaliers franco-suisses.",
  },
  '/simulateurs/impot-revenu-ch': {
    h1: "Simulateur impôt sur le revenu Suisse — fédéral et cantonal 2025",
    intro: "Calculez votre impôt fédéral direct et votre impôt cantonal en Suisse selon votre canton de résidence, votre revenu imposable et votre situation familiale. Barèmes officiels 2025 pour les 26 cantons, utile pour les résidents suisses et les frontaliers fiscalement domiciliés en Suisse.",
  },
  '/simulateurs/prevoyance-ch': {
    h1: "Simulateur pilier 3a — prévoyance individuelle suisse 2025",
    intro: "Projetez le capital accumulé dans votre pilier 3a et calculez l'économie d'impôt annuelle sur vos versements. Le simulateur utilise le plafond 2025 (CHF 7 258 pour les salariés) et votre tranche cantonale d'imposition — accessible aux frontaliers domiciliés en Suisse.",
  },
  '/simulateurs/succession-ch': {
    h1: "Simulateur droits de succession Suisse 2025 — par canton et lien de parenté",
    intro: "Estimez les droits de succession selon le canton suisse, le lien de parenté (enfants, conjoints, collatéraux, tiers) et l'actif net transmis. Les enfants et le conjoint survivant sont exonérés dans la quasi-totalité des cantons : le simulateur détaille les exceptions et les barèmes 2025.",
  },
  '/simulateurs/retraite-luxembourg': {
    h1: "Simulateur retraite Luxembourg (CNAP) 2025 — pension et taux de remplacement",
    intro: "Estimez votre pension du régime général luxembourgeois (CNAP) selon votre durée de carrière, votre salaire moyen et votre âge de départ. Conçu pour les frontaliers franco-luxembourgeois et les expatriés : possibilité de partir dès 60 ans avec 40 années d'assurance.",
  },
};

// Pages comparatives : H1 + intro dérivés des données (src/data/comparatifs.js),
// ajoutés à SEO_CONTENT pour le prérendu statique de chaque /comparatifs/:slug.
for (const c of COMPARATIFS) {
  SEO_CONTENT[`/comparatifs/${c.slug}`] = { h1: c.title, intro: c.intro };
}

// Contenu SEO suisse (H1 + intro) pour les pages /ch/...
export const SEO_CONTENT_CH = {
  '/': {
    h1: "Simulateurs financiers gratuits pour la Suisse",
    intro: "LPP et 2e pilier, pilier 3a, impôt fédéral et cantonal, épargne et FIRE en CHF. Des simulateurs gratuits adaptés au droit suisse, sans inscription.",
  },
  '/simulateurs/lpp-deuxieme-pilier': {
    h1: "Simulateur LPP — votre 2e pilier suisse",
    intro: "Estimez votre avoir de vieillesse LPP et votre rente du 2e pilier selon votre salaire coordonné, vos années de cotisation et les taux d'intérêt LPP 2025. Un outil gratuit pour anticiper votre retraite professionnelle en Suisse.",
  },
  '/simulateurs/impot-revenu-ch': {
    h1: "Simulateur d'impôt sur le revenu Suisse — fédéral + cantonal",
    intro: "Calculez votre impôt fédéral direct et votre impôt cantonal selon votre canton de résidence, votre revenu imposable et votre situation familiale. Barèmes officiels 2025 pour les 26 cantons suisses.",
  },
  '/simulateurs/prevoyance-ch': {
    h1: "Simulateur pilier 3a — prévoyance individuelle Suisse",
    intro: "Projetez le capital accumulé dans votre pilier 3a et calculez l'économie d'impôt annuelle sur vos versements. Le simulateur utilise le plafond 2025 (CHF 7 258 pour les salariés) et votre tranche cantonale d'imposition.",
  },
  '/simulateurs/epargne': {
    h1: "Simulateur d'épargne et intérêts composés en CHF",
    intro: "Projetez la croissance de votre épargne en francs suisses grâce aux intérêts composés et à des versements réguliers. Visualisez le capital atteint selon le rendement, la durée et l'effort d'épargne mensuel en CHF.",
  },
  '/simulateurs/fire': {
    h1: "Simulateur FIRE en CHF — indépendance financière (Suisse)",
    intro: "Calculez le patrimoine en CHF nécessaire pour vivre de vos investissements et l'âge auquel vous atteignez l'indépendance financière en Suisse. Le simulateur applique la règle des 4 % et trace les paliers Lean, Coast et Fat FIRE.",
  },
  '/simulateurs/budget': {
    h1: "Simulateur budget 50/30/20 en CHF",
    intro: "Répartissez votre budget mensuel en francs suisses selon la règle 50/30/20 : 50 % besoins, 30 % envies, 20 % épargne. Taux d'épargne en temps réel et conseils adaptés à votre situation financière.",
  },
  '/simulateurs/patrimoine': {
    h1: "Simulateur de patrimoine global en CHF",
    intro: "Consolidez vos actifs financiers, immobiliers et retraite en francs suisses pour visualiser votre richesse nette totale et sa répartition par classe d'actifs.",
  },
  '/simulateurs/emprunt-immobilier': {
    h1: "Simulateur d'emprunt immobilier en CHF (Suisse)",
    intro: "Calculez la mensualité, la capacité d'emprunt et le coût total de votre crédit immobilier en francs suisses. Le simulateur inclut le taux d'endettement et un tableau d'amortissement détaillé.",
  },
  '/simulateurs/rendement-locatif': {
    h1: "Simulateur de rendement locatif en CHF",
    intro: "Évaluez la rentabilité brute et nette d'un investissement locatif en Suisse, en CHF. Cash flow mensuel, retour sur fonds propres et comparaison des opportunités d'investissement immobilier.",
  },
  '/simulateurs/assurance-vie': {
    h1: "Simulateur d'épargne et assurance-vie en CHF",
    intro: "Projetez la croissance de votre épargne en francs suisses et estimez le capital disponible à l'échéance. Un outil pour planifier votre épargne à long terme en contexte suisse.",
  },
  '/simulateurs/rente-capital': {
    h1: "Simulateur rente viagère vs retrait programmé en CHF",
    intro: "Comparez la rente viagère et les retraits programmés pour votre capital retraite en CHF. Revenu mensuel net, point mort et cumul sur 20 ans pour choisir la meilleure option de décaissement.",
  },
  '/simulateurs/inflation': {
    h1: "Simulateur inflation et pouvoir d'achat en CHF",
    intro: "Mesurez l'impact de l'inflation sur votre budget en francs suisses, poste de dépense par poste de dépense. Projetez l'érosion de votre pouvoir d'achat sur 10 à 30 ans selon votre panier personnalisé.",
  },
  '/simulateurs/comparateur': {
    h1: "Comparateur d'actifs ETF, actions, crypto en CHF",
    intro: "Comparez la performance historique d'ETF, d'actions et de cryptomonnaies sur la période de votre choix, en CHF. Retour total, CAGR, versements programmés et indice base 100.",
  },
  '/simulateurs/credit-conso': {
    h1: "Simulateur de crédit à la consommation en CHF",
    intro: "Calculez la mensualité, le coût total et les intérêts de votre crédit conso en francs suisses selon le montant, le TAEG et la durée. Tableau d'amortissement inclus.",
  },
  '/simulateurs/cout-en-heures': {
    h1: "Simulateur : le vrai prix en heures de vie (CHF)",
    intro: "Convertissez n'importe quel achat en heures de travail réelles, en CHF. Découvrez le coût véritable d'un bien ou d'un abonnement exprimé en temps plutôt qu'en francs.",
  },
  '/simulateurs/vie-en-semaines': {
    h1: "Simulateur : ma vie en semaines",
    intro: "Visualisez l'intégralité de votre vie sous forme de grille, une case par semaine. Semaines vécues, semaines restantes et étés encore à venir — une perspective forte sur le temps qui passe.",
  },
};

// Contenu SEO belge (H1 + intro) pour les pages /be/...
export const SEO_CONTENT_BE = {
  '/': {
    h1: "Simulateurs financiers gratuits pour la Belgique",
    intro: "Pension légale ONSS, IPP, droits de succession, épargne et FIRE en EUR. Des simulateurs gratuits adaptés à la législation belge 2025, sans inscription.",
  },
  '/simulateurs/pension-legale': {
    h1: "Simulateur pension légale Belgique (ONSS)",
    intro: "Estimez votre pension légale belge selon votre carrière, votre statut (salarié, indépendant) et votre âge de départ. Le simulateur applique les barèmes ONSS 2025 pour la pension de retraite et, le cas échéant, la pension de survie.",
  },
  '/simulateurs/impot-revenu': {
    h1: "Simulateur IPP 2025 — impôt des personnes physiques Belgique",
    intro: "Calculez votre impôt des personnes physiques (IPP) belge selon votre revenu imposable, votre situation familiale et les barèmes 2025. Estimation nette après déduction des charges professionnelles forfaitaires.",
  },
  '/simulateurs/succession': {
    h1: "Simulateur droits de succession Belgique",
    intro: "Calculez les droits de succession belges selon la Région (Flandre, Wallonie, Bruxelles-Capitale), le lien de parenté et l'actif net de la succession. Barèmes 2025 officiels, avec dettes et déductions déductibles.",
  },
  '/simulateurs/epargne': {
    h1: "Simulateur d'épargne et intérêts composés en EUR (Belgique)",
    intro: "Projetez la croissance de votre épargne en euros sur le long terme grâce aux intérêts composés. Capital final selon le rendement, la durée et l'effort d'épargne mensuel.",
  },
  '/simulateurs/fire': {
    h1: "Simulateur FIRE — indépendance financière (Belgique)",
    intro: "Calculez le patrimoine nécessaire pour vivre de vos investissements en Belgique et l'âge auquel vous atteignez l'indépendance financière. Règle des 4 %, paliers Lean, Coast et Fat FIRE.",
  },
  '/simulateurs/budget': {
    h1: "Simulateur budget 50/30/20 — finances personnelles Belgique",
    intro: "Répartissez votre budget mensuel selon la règle 50/30/20 : besoins, envies, épargne. Taux d'épargne en temps réel et conseils adaptés à la situation belge.",
  },
  '/simulateurs/patrimoine': {
    h1: "Simulateur de patrimoine global — richesse nette Belgique",
    intro: "Consolidez vos actifs financiers et immobiliers pour visualiser votre richesse nette totale et sa répartition par classe d'actifs, en contexte belge.",
  },
  '/simulateurs/emprunt-immobilier': {
    h1: "Simulateur d'emprunt immobilier Belgique",
    intro: "Calculez la mensualité, la capacité d'emprunt et le coût total de votre crédit hypothécaire en Belgique. Le simulateur inclut le taux d'endettement et un tableau d'amortissement annuel.",
  },
  '/simulateurs/rendement-locatif': {
    h1: "Simulateur de rendement locatif Belgique",
    intro: "Évaluez la rentabilité brute et nette d'un investissement locatif en Belgique. Cash flow mensuel, retour sur fonds propres et comparaison des opportunités immobilières belges.",
  },
  '/simulateurs/assurance-vie': {
    h1: "Simulateur épargne-pension et assurance groupe Belgique",
    intro: "Projetez la croissance de votre épargne-pension ou assurance groupe en Belgique et estimez le capital disponible à l'échéance. Un outil pour planifier votre complément de retraite.",
  },
  '/simulateurs/rente-capital': {
    h1: "Simulateur rente viagère vs retrait programmé — retraite Belgique",
    intro: "Comparez la rente viagère et les retraits programmés pour votre capital retraite. Revenu mensuel net, point mort et cumul sur 20 ans pour choisir le meilleur mode de décaissement.",
  },
  '/simulateurs/inflation': {
    h1: "Simulateur inflation et pouvoir d'achat — Belgique 2025",
    intro: "Mesurez l'impact de l'inflation sur votre budget en euros, par poste de dépense. Projetez l'érosion de votre pouvoir d'achat sur 10 à 30 ans selon l'indice des prix à la consommation belge.",
  },
  '/simulateurs/comparateur': {
    h1: "Comparateur d'actifs ETF, actions, crypto — Belgique",
    intro: "Comparez la performance historique d'ETF, d'actions et de cryptomonnaies sur la période de votre choix. Retour total, CAGR, versements programmés et indice base 100.",
  },
  '/simulateurs/credit-conso': {
    h1: "Simulateur de crédit à la consommation Belgique",
    intro: "Calculez la mensualité, le coût total et les intérêts de votre crédit à la consommation selon le montant, le TAEG et la durée. Adapté au marché belge, tableau d'amortissement inclus.",
  },
  '/simulateurs/cout-en-heures': {
    h1: "Simulateur : le vrai prix en heures de vie (Belgique)",
    intro: "Convertissez n'importe quel achat en heures de travail réelles. Découvrez le coût véritable d'un bien ou d'un abonnement exprimé en temps plutôt qu'en euros.",
  },
};

// Contenu SEO en anglais (H1 + intro) pour les pages /en/...
export const SEO_CONTENT_EN = {
  '/': {
    h1: "Free Financial Calculators",
    intro: "Online financial calculators to plan your savings, reach financial independence, optimise your budget and more. Instant results, no sign-up required.",
  },
  '/simulateurs/epargne': {
    h1: "Compound Interest Calculator",
    intro: "Project how your savings grow over time with compound interest and regular monthly contributions. See the final balance for any interest rate, duration and savings effort.",
  },
  '/simulateurs/fire': {
    h1: "FIRE Calculator — Financial Independence, Retire Early",
    intro: "Calculate the net worth you need to live off your investments and the age at which you reach financial independence. Based on the 4% rule, with Lean FIRE, Coast FIRE and Fat FIRE milestones plotted year by year.",
  },
  '/simulateurs/budget': {
    h1: "50/30/20 Budget Calculator",
    intro: "Split your monthly income with the 50/30/20 rule: 50% needs, 30% wants, 20% savings. See your budget balance and savings rate in real time, with personalised tips for each category.",
  },
  '/simulateurs/patrimoine': {
    h1: "Net Worth Calculator",
    intro: "Consolidate your financial assets, real estate and retirement savings to see your total net worth and how it breaks down by asset class. A clear overview of your overall financial position.",
  },
  '/simulateurs/cout-en-heures': {
    h1: "Cost in Hours of Work Calculator",
    intro: "Turn any purchase into real hours of your life. Based on your salary, discover the true cost of a product or subscription expressed in time rather than money.",
  },
  '/simulateurs/vie-en-semaines': {
    h1: "Your Life in Weeks Calculator",
    intro: "Visualize your entire life as a grid, one square per week. See how many weeks you have lived, how many remain and how many summers are still ahead. A striking perspective on the time that passes, inspired by the Your Life in Weeks concept.",
  },
  '/simulateurs/emprunt-immobilier': {
    h1: "French Mortgage Calculator",
    intro: "Work out the monthly payment, borrowing capacity, total cost and debt-to-income ratio of a French mortgage. The calculator includes notary fees, the first-time buyer zero-rate loan (PTZ) and a detailed year-by-year amortization schedule.",
  },
  '/simulateurs/rendement-locatif': {
    h1: "Rental Yield Calculator (France)",
    intro: "Calculate the gross and net yield of a French rental investment from the price, rent, costs and taxation. The simulator factors in notary fees, service charges, property tax, management fees and gives the monthly cash flow and return on equity.",
  },
  '/simulateurs/assurance-vie': {
    h1: "French Life Insurance (Assurance-Vie) Calculator",
    intro: "Project the growth of a French life insurance policy and estimate the tax on your gains at withdrawal. The calculation applies the 8-year advantage, the annual allowance (€4,600 single / €9,200 couple), the 30% flat tax and the 17.2% social levies, using 2025 figures.",
  },
  '/simulateurs/credit-conso': {
    h1: "Personal Loan Calculator",
    intro: "Calculate the monthly payment, total cost and total interest of a personal loan from the amount borrowed, the APR and the term. Includes optional insurance and a full amortization schedule.",
  },
  '/simulateurs/comparateur': {
    h1: "Asset Comparison Tool — ETFs, Stocks, Crypto",
    intro: "Compare the historical performance of ETFs, stocks and cryptocurrencies over any period from real data. Total return, annualised CAGR, recurring contributions and a base-100 index for clean side-by-side comparisons.",
  },
  '/outils/qr-code': {
    h1: "Free Custom QR Code Generator",
    intro: "Create a custom QR code: choose the colors, enter any text or URL and add your logo or an emoji in the center. Generated in your browser — no data sent — and downloadable as high-resolution PNG, completely free with no sign-up.",
  },
  '/simulateurs/cnav': {
    h1: "French State Pension Calculator (CNAV) 2026",
    intro: "Estimate your French general-scheme pension (Assurance Retraite / CNAV) based on your career, average annual earnings and retirement age. The calculator applies the official formula: quarters validated, reference annual salary and replacement rate.",
  },
  '/simulateurs/retraite-luxembourg': {
    h1: "Luxembourg Pension Calculator (CNAP) 2025 — net pension & replacement rate",
    intro: "Estimate your Luxembourg general-scheme pension (CNAP — Caisse Nationale d'Assurance Pension) based on your career length, insured salary and planned retirement age. Designed for cross-border workers and expatriates employed in Luxembourg.",
  },
};

// Bloc HTML SEO (sans dépendance, échappé) pour une route donnée.
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Bloc placé dans #root (remplacé par React au montage). Visuellement masqué
// (motif accessibilité) pour éviter tout flash avant le rendu, mais bien présent
// dans le HTML brut pour les crawlers et le rendu sans JS.
const SR_ONLY = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';

export function seoHtmlForRoute(route, locale = 'fr', country = 'fr') {
  let dict;
  if (locale === 'en') dict = SEO_CONTENT_EN;
  else if (country === 'ch') dict = SEO_CONTENT_CH;
  else if (country === 'be') dict = SEO_CONTENT_BE;
  else dict = SEO_CONTENT;
  const c = dict[route];
  if (!c) return '';
  return `<div id="seo-prerender" style="${SR_ONLY}"><h1>${escapeHtml(c.h1)}</h1><p>${escapeHtml(c.intro)}</p></div>`;
}

// Nettoyage défensif du HTML d'article avant injection statique. Les articles ne
// contiennent normalement que h2/p/ul/li/strong/em, mais le contenu vient de Redis
// (endpoints publish-article / generate-article) : on retire tout élément actif et
// tout gestionnaire d'événement par précaution.
function sanitizeArticleHtml(html) {
  return String(html)
    .replace(/<\/?(?:script|style|iframe|object|embed|link|meta)\b[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript:/gi, '');
}

// Bloc SEO pré-rendu pour un article de blog : titre + intro + corps complet,
// injecté dans #root au build pour que le contenu soit crawlable sans exécuter le
// JS (React le remplace au montage). `extra` provient de Redis (title, intro,
// content). Renvoie '' si le corps n'est pas disponible (repli sans Redis).
export function seoHtmlForArticle(extra) {
  if (!extra || !extra.content) return '';
  const h1 = extra.title ? `<h1>${escapeHtml(extra.title)}</h1>` : '';
  const intro = extra.description ? `<p>${escapeHtml(extra.description)}</p>` : '';
  return `<div id="seo-prerender" style="${SR_ONLY}">${h1}${intro}${sanitizeArticleHtml(extra.content)}</div>`;
}
