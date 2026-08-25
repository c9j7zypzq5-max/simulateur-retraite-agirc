// Contenu SEO pré-rendu (H1 + intro) injecté EN DUR dans le HTML statique de
// chaque simulateur au build (scripts/generate-static-html.mjs). Objectif : du
// vrai texte crawlable présent sans exécution JS — complète le JSON-LD déjà
// injecté. Le bloc est placé dans #root ; React le remplace au montage côté
// client (rendu client, pas d'hydratation → aucun risque d'incohérence).
//
// Clé = chemin de route. Intro = 2-3 phrases factuelles et descriptives.
import { COMPARATIFS, COMPARATIFS_BY_SLUG } from '../src/data/comparatifs.js';
import { METIERS_BY_SLUG } from '../src/data/metiers.js';
import { GLOSSARY_BY_SLUG } from '../src/data/glossaire.js';
import { GUIDES_BY_SLUG } from '../src/data/guides.js';
import { FAQS } from '../src/data/faqs.js';
import { EDITORIAL_BY_ROUTE } from '../src/data/editorial.js';
import { sourcesForRoute } from '../src/data/sourcesOfficielles.js';
import { ROUTE_META } from './_meta.js';

export const SEO_CONTENT = {
  '/': {
    h1: "Simulateurs financiers gratuits : retraite, immobilier, impôts, épargne",
    intro: "simfinly.com réunit plus de 35 simulateurs 100 % gratuits pour estimer votre retraite (Agirc-Arrco, CNAV, fonction publique), votre prêt immobilier, vos impôts, votre épargne et votre indépendance financière. Calculs instantanés, sans inscription et sans donnée conservée.",
    links: [
      ['/simulateurs/agirc-arrco', 'Simulateur retraite complémentaire Agirc-Arrco'],
      ['/simulateurs/cnav', 'Retraite de base CNAV (régime général)'],
      ['/simulateurs/fonction-publique', 'Retraite de la fonction publique'],
      ['/simulateurs/emprunt-immobilier', 'Simulateur de prêt immobilier'],
      ['/simulateurs/impot-revenu', 'Calculateur d’impôt sur le revenu'],
      ['/simulateurs/epargne', 'Épargne & intérêts composés'],
      ['/simulateurs/fire', 'Indépendance financière (FIRE)'],
      ['/retraite/guide-complet-2026', 'Guide complet de la retraite 2026'],
      ['/immobilier/guide-complet-2026', 'Guide complet immobilier 2026'],
      ['/impots/guide-complet-2026', 'Guide complet impôts 2026'],
      ['/epargne/guide-complet-2026', 'Guide complet FIRE et épargne 2026'],
    ],
  },
  '/simulateurs/flat-tax': {
    h1: "Simulateur flat tax (PFU) 2026 — ou option barème ?",
    intro: "Comparez l'imposition de vos revenus du capital — dividendes, intérêts, plus-values mobilières — entre la flat tax (PFU à 31,4 % en 2026 : 12,8 % d'impôt + 18,6 % de prélèvements sociaux) et l'option pour le barème progressif avec abattement de 40 % sur les dividendes et CSG déductible. Le simulateur identifie l'option la plus avantageuse selon votre taux marginal d'imposition.",
  },
  '/methodologie': {
    h1: "Méthodologie de calcul des simulateurs",
    intro: "Comment simfinly.com calcule ses estimations : formules utilisées, barèmes officiels 2026 (retraite, impôt, prélèvements sociaux), sources de données et limites de chaque simulateur. Tous les calculs s'exécutent dans votre navigateur, sans transmission de vos données.",
  },
  '/contact': {
    h1: "Contacter simfinly.com",
    intro: "Une question sur un simulateur, une erreur à signaler, une demande de partenariat ou de presse ? Écrivez-nous à contact@simfinly.com — nous répondons généralement sous 48 h ouvrées.",
  },
  '/simulateurs/agirc-arrco': {
    h1: "Simulateur retraite complémentaire Agirc-Arrco 2026 — points et pension",
    description: "Calculez votre retraite complémentaire Agirc-Arrco 2026 : points acquis, valeur du point à 1,4386 €, majoration enfants et estimation nette mensuelle. Gratuit, sans inscription.",
    intro: "Estimez votre pension complémentaire Agirc-Arrco à partir de votre salaire, de vos points acquis et de votre âge de départ. Le calcul convertit vos cotisations en points via la valeur d'achat 2026 (20,1877 €), puis multiplie le total par la valeur de service du point (1,4386 € en 2026) pour obtenir votre pension annuelle. Il intègre la répartition Tranche 1 / Tranche 2, la GMP des cadres, la majoration de 10 % pour trois enfants et une revalorisation projetée, jusqu'à une estimation nette mensuelle après CSG, CRDS et Casa.",
    links: [
      ['/retraite/points-agirc-arrco', 'Points Agirc-Arrco : valeur du point et méthode de calcul'],
      ['/simulateurs/cnav', 'Retraite de base CNAV à ajouter à votre complémentaire'],
      ['/simulateurs/synthese-retraite', 'Synthèse retraite tous régimes'],
      ['/simulateurs/pension-reversion', 'Réversion Agirc-Arrco du conjoint survivant (60 %)'],
      ['/simulateurs/retraite-progressive', 'Retraite progressive et Agirc-Arrco'],
    ],
  },
  '/simulateurs/cnav': {
    h1: "Simulateur retraite de base CNAV — régime général",
    intro: "Calculez votre pension de base du régime général (CNAV) selon votre salaire annuel moyen, vos trimestres validés et votre âge de départ. Le simulateur applique le taux plein, la décote ou la surcote et estime votre future retraite de base, à compléter par vos régimes complémentaires.",
  },
  '/simulateurs/fonction-publique': {
    h1: "Simulateur retraite fonction publique 2026 — État, territorial, hospitalier",
    description: "Calculez votre retraite de fonctionnaire 2026 : pension civile SRE ou CNRACL, catégorie active ou sédentaire, décote, surcote et estimation nette. Gratuit, sans inscription.",
    intro: "Estimez votre pension de fonctionnaire d'État (SRE), territorial ou hospitalier (CNRACL) à partir de votre traitement indiciaire brut, de votre durée de services et de vos bonifications. Le calcul applique la formule officielle — traitement des six derniers mois, durée de référence de 172 trimestres, taux maximum de 75 % — distingue catégorie sédentaire et catégorie active, et intègre la décote ou la surcote selon votre âge de départ. Enseignants, personnels hospitaliers, policiers et agents territoriaux relèvent tous de cette même formule.",
    links: [
      ['/simulateurs/pension-reversion', 'Pension de réversion du conjoint de fonctionnaire (50 %)'],
      ['/simulateurs/ircantec', 'Retraite Ircantec des agents contractuels'],
      ['/simulateurs/synthese-retraite', 'Carrière mixte public-privé : synthèse tous régimes'],
      ['/simulateurs/retraite-progressive', 'Retraite progressive dans la fonction publique'],
      ['/retraite/fonctionnaire', 'Fiche métier : la retraite des fonctionnaires'],
    ],
  },
  '/simulateurs/independants': {
    h1: "Simulateur retraite des indépendants et TNS",
    intro: "Artisan, commerçant ou profession libérale : estimez votre retraite de base (SSI) et complémentaire selon vos revenus professionnels, vos années cotisées et votre âge de départ. Une projection claire de votre future pension de travailleur non salarié.",
  },
  '/simulateurs/ircantec': {
    h1: "Simulateur retraite Ircantec 2026 — points, valeur du point et pension",
    description: "Calculez votre retraite Ircantec 2026 : points en tranche A et B, salaire de référence 5,787 €, valeur de service 0,56053 €. Gratuit, sans inscription.",
    intro: "Agents non titulaires de la fonction publique, vacataires, praticiens hospitaliers et élus locaux : estimez votre retraite complémentaire Ircantec. Le simulateur découpe votre rémunération en tranche A et tranche B par rapport au plafond de la Sécurité sociale, applique les taux théoriques de 5,60 % et 15,60 %, puis convertit le résultat en points via le salaire de référence 2026 (5,787 €). Le total des points est multiplié par la valeur de service du point (0,56053 € au 1er janvier 2026) pour projeter votre pension complémentaire annuelle, mensuelle, brute et nette.",
    links: [
      ['/simulateurs/cnav', 'Retraite de base CNAV à ajouter à votre Ircantec'],
      ['/simulateurs/fonction-publique', 'Pension civile si vous avez été titularisé'],
      ['/simulateurs/synthese-retraite', 'Synthèse retraite tous régimes'],
      ['/simulateurs/pension-reversion', 'Réversion Ircantec du conjoint survivant (50 %)'],
      ['/lexique/ircantec', 'Ircantec : définition et fonctionnement'],
    ],
  },
  '/simulateurs/retraite-progressive': {
    h1: "Simulateur retraite progressive 2026 — calcul de la pension partielle",
    description: "Calculez votre revenu en retraite progressive 2026 : fraction de pension selon votre temps partiel, salaire conservé et effet sur la pension définitive. Gratuit.",
    intro: "Vous envisagez de réduire votre activité avant la retraite complète ? Estimez le montant de votre pension partielle pendant la retraite progressive et son cumul avec le salaire de votre temps partiel. Le dispositif est ouvert dès 62 ans pour les générations 1965 et suivantes, sous réserve de 150 trimestres validés et d'une activité comprise entre 40 % et 80 % d'un temps complet. La fraction de pension versée est le complément de votre quotité travaillée : à 60 % d'activité, vous percevez 40 % de vos pensions de base et complémentaire. Le simulateur chiffre aussi l'effet des trimestres et points acquis pendant la période sur votre pension définitive, salariés du privé comme agents publics.",
    links: [
      ['/simulateurs/cnav', 'Retraite de base CNAV servant au calcul de la fraction'],
      ['/simulateurs/agirc-arrco', 'Part complémentaire Agirc-Arrco'],
      ['/simulateurs/fonction-publique', 'Retraite progressive dans la fonction publique'],
      ['/comparatifs/cumul-emploi-retraite-vs-retraite-progressive', 'Retraite progressive ou cumul emploi-retraite ?'],
      ['/simulateurs/retraite-anticipee', 'Départ anticipé et carrières longues'],
    ],
  },
  '/simulateurs/cnavpl': {
    h1: "Simulateur retraite CIPAV 2026 — professions libérales, base et complémentaire",
    description: "Calculez votre retraite CIPAV 2026 : points du régime de base CNAVPL, classe de cotisation complémentaire, décote et surcote. Gratuit, sans inscription.",
    intro: "Architecte, géomètre-expert, ostéopathe, psychologue, moniteur de ski ou guide-conférencier : estimez votre retraite de base CNAVPL et votre complémentaire CIPAV. Le simulateur convertit vos revenus professionnels en points de base — dans la limite des plafonds annuels propres à chaque tranche — puis applique la valeur de service 2026 du point de base (0,6599 €). Il ajoute la complémentaire CIPAV, calculée par classes de cotisation avec un coût d'achat du point de 47,40 € et une valeur de service de 2,89 €, et intègre la décote ou la surcote selon votre âge de départ et vos trimestres validés.",
    links: [
      ['/simulateurs/independants', 'Retraite des indépendants (SSI) si vous avez quitté la CIPAV'],
      ['/simulateurs/synthese-retraite', 'Synthèse retraite tous régimes'],
      ['/simulateurs/per', 'PER : compenser une retraite de base plafonnée'],
      ['/retraite/architecte', 'La retraite des architectes'],
      ['/simulateurs/pension-reversion', 'Réversion du conjoint survivant'],
    ],
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
    h1: "Simulateur PTZ 2026 — Prêt à Taux Zéro",
    intro: "Estimez le montant de votre Prêt à Taux Zéro selon votre zone, la composition de votre foyer et vos revenus. Le simulateur détermine votre tranche, la quotité finançable et le montant du PTZ, selon le barème 2026 (décret n° 2025-299).",
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
    h1: "Simulateur de frais de notaire 2026",
    intro: "Calculez les frais de notaire (frais d'acquisition) de votre achat immobilier : droits de mutation, émoluments du notaire, contribution de sécurité immobilière et débours. Le simulateur distingue l'ancien (~7-8 % du prix) et le neuf (~2-3 %) pour une estimation instantanée.",
  },
  '/simulateurs/per': {
    h1: "Simulateur PER — Plan d'Épargne Retraite",
    intro: "Estimez l'économie d'impôt liée à vos versements sur un PER et le capital projeté à la retraite. Le calcul applique le plafond de déduction (10 % des revenus, PASS 2026) selon votre tranche marginale d'imposition et votre horizon de placement.",
  },
  '/simulateurs/pension-reversion': {
    h1: "Simulateur pension de réversion 2026 — calcul du conjoint survivant",
    description: "Calculez votre pension de réversion 2026 : 54 % de la base (CNAV/Carsat) + 60 % de l'Agirc-Arrco, ou 50 % dans la fonction publique. Gratuit, sans inscription.",
    intro: "Calculez la pension de réversion à laquelle vous avez droit en tant que conjoint survivant, tous régimes confondus. Salarié du privé (CNAV/Carsat) : 54 % de la retraite de base sous condition de ressources (25 001,60 €/an pour une personne seule en 2026), plus 60 % de la complémentaire Agirc-Arrco sans condition de ressources. Fonctionnaire (SRE, CNRACL) et agent contractuel (Ircantec) : 50 %, sans condition de ressources. Le simulateur applique aussi l'âge minimum de 55 ans du régime général et l'effet d'un remariage.",
    links: [
      ['/retraite/calcul-pension-reversion', 'Guide complet : calcul de la pension de réversion 2026'],
      ['/simulateurs/cnav', 'Retraite de base CNAV du défunt (régime général)'],
      ['/simulateurs/agirc-arrco', 'Retraite complémentaire Agirc-Arrco du défunt'],
      ['/simulateurs/fonction-publique', 'Retraite de la fonction publique (SRE, CNRACL)'],
      ['/simulateurs/ircantec', 'Retraite Ircantec des contractuels publics'],
      ['/simulateurs/synthese-retraite', 'Synthèse retraite tous régimes'],
    ],
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
    intro: "Projetez la croissance de votre assurance-vie et estimez la fiscalité de vos gains au rachat : avantage des 8 ans de détention, abattement annuel, prélèvement forfaitaire et prélèvements sociaux de 17,2 %, selon les paramètres 2026.",
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
    h1: "Retraite cadre ingénieur 2026 — CNAV + Agirc-Arrco",
    intro: "Les ingénieurs et cadres du secteur privé cotisent au régime général CNAV et à Agirc-Arrco. Le coefficient de solidarité qui minorait la pension Agirc-Arrco en cas de départ anticipé a été supprimé en avril 2024 — seule la pension CNAV de base reste soumise à une décote si le cadre part sans ses trimestres.",
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
  '/epargne/guide-per-2026': {
    h1: "PER 2026 : guide complet du Plan d'Épargne Retraite",
    intro: "Tout sur le PER en 2026 : déduction fiscale jusqu'à 35 194 €, 3 types (PERIN, PERCOL, PERO), sortie en capital ou rente, 6 cas de déblocage anticipé (dont résidence principale) et comparatif détaillé PER vs assurance-vie avec simulateur gratuit.",
  },
  '/impots/simulateur-impot-revenu': {
    h1: "Impôt sur le revenu 2026 : barème, calcul et réductions",
    intro: "Barème IR 2026 complet : 5 tranches de 0 % à 45 %. Comment calculer son impôt en 4 étapes, comprendre la tranche marginale d'imposition (TMI), le quotient familial, et réduire sa note fiscale avec PER, dons et emploi à domicile. Simulateur gratuit.",
  },
  '/retraite/guide-complet-2026': {
    h1: "Guide complet retraite 2026 : calcul, simulateurs et optimisation",
    intro: "Tout comprendre sur la retraite en 2026 : âge légal jusqu'à 64 ans (palier définitif génération 1969+, calendrier gelé pour 1964-1968 par la LFSS 2026), calcul CNAV (SAM × 50 % × trimestres) et Agirc-Arrco (points × 1,4386 €), décote et surcote, rachat de trimestres, taux de remplacement. Guides par profession inclus.",
  },
  '/retraite/points-agirc-arrco': {
    h1: "Points Agirc-Arrco 2026 : valeur du point et calcul de la pension",
    intro: "Le point Agirc-Arrco vaut 1,4386 € en 2026. Votre pension complémentaire = nombre de points × valeur du point. Guide complet : comment s'accumulent les points, la GMP des cadres, la majoration 3 enfants et simulateur gratuit.",
  },
  '/retraite/calcul-pension-reversion': {
    h1: "Pension de réversion 2026 : calcul, taux et conditions",
    intro: "La pension de réversion représente 54 % de la retraite de base (CNAV) et 60 % de la complémentaire Agirc-Arrco. Qui y a droit, à quel âge, sous quelles conditions de ressources ? Guide complet avec simulateur pour estimer votre montant.",
  },
  '/immobilier/frais-notaire': {
    h1: "Frais de notaire 2026 : taux, calcul et comment les réduire",
    intro: "Les frais de notaire représentent 7 à 8 % du prix d'un bien ancien (2 à 3 % dans le neuf). Décomposition exacte des postes, tableau par tranches de prix et 3 stratégies légales pour les minimiser. Simulateur de calcul gratuit.",
  },
  '/immobilier/guide-complet-2026': {
    h1: "Guide complet immobilier 2026 : emprunt, frais de notaire, PTZ et fiscalité",
    intro: "Tout sur l'achat immobilier en 2026 : capacité d'emprunt (35 % de taux d'endettement max), frais de notaire (6,32 % de droits de mutation dans la majorité des départements), PTZ jusqu'à 50 % de l'opération, rendement locatif net et plus-value. Simulateurs gratuits inclus.",
  },
  '/impots/guide-complet-2026': {
    h1: "Guide complet impôts 2026 : barème, flat tax, plus-value et succession",
    intro: "Tout sur la fiscalité en 2026 : barème de l'impôt sur le revenu (5 tranches, 0 à 45 %), flat tax à 31,4 % ou option barème, plus-value immobilière, abattements de succession et donation. Simulateurs gratuits inclus.",
  },
  '/epargne/guide-complet-2026': {
    h1: "Guide complet FIRE et épargne 2026 : indépendance financière et simulation Monte Carlo",
    intro: "Tout sur l'indépendance financière (FIRE) et l'épargne en 2026 : règle des 4 % (capital cible = 25x les dépenses annuelles), taux d'épargne, simulation Monte Carlo sur l'historique réel du S&P 500, PEA vs assurance-vie. Simulateurs gratuits inclus.",
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
    description: "Calculez les droits de succession 2026 : abattement de 100 000 € par enfant, barème progressif de 5 à 45 % en ligne directe, conjoint exonéré. Gratuit.",
    links: [
      ['/simulateurs/donation', 'Anticiper : simulateur de droits de donation'],
      ['/simulateurs/assurance-vie', 'Assurance-vie : transmission hors succession'],
      ['/lexique/droits-succession', 'Droits de succession : définition'],
      ['/lexique/clause-beneficiaire', 'Clause bénéficiaire : la rédiger correctement'],
      ['/simulateurs/frais-notaire', 'Frais de notaire sur un bien hérité'],
    ],
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
    h1: "Simulateur retraite Luxembourg (CNAP) 2026 — pension et taux de remplacement",
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
// FAQ anglaise pré-rendue, par route. Le dictionnaire FAQS (src/data/faqs.js)
// est en français : il n'est injecté que dans les pages FR. Les rares routes EN
// à fort volume de recherche ont donc leur propre FAQ ici.
export const FAQS_EN = {
  '/simulateurs/retraite-luxembourg': [
    {
      q: "What is the statutory retirement age in Luxembourg?",
      a: "The statutory (legal) retirement age for the CNAP old-age pension is 65. Early retirement is possible from 60 if you have completed 40 years of insurance, and from 57 for long careers made up entirely of compulsory contributions. Claiming before 65 does not apply a permanent reduction the way it does in some countries: the pension is simply based on the years of insurance actually completed by that date.",
    },
    {
      q: "How is a Luxembourg pension calculated?",
      a: "The CNAP pension combines two components. The flat-rate component depends only on your length of insurance, and reaches its full amount after 40 years. The earnings-related component is roughly 1.85 % of your average insured salary for each year of contribution. Insured earnings are capped at five times the social minimum wage. Add-ons then apply, including an increase of about 5 % per child, up to three children.",
    },
    {
      q: "What is the minimum pension in Luxembourg?",
      a: "The guaranteed minimum old-age pension is €2,436.04 gross per month for a complete 40-year insurance career, at index 992.24 (1 June 2026). It is reduced by one fortieth for each year missing below 40. You must have at least 20 years of insurance to qualify: below that threshold, no minimum pension is guaranteed and only the amount actually earned is paid.",
    },
    {
      q: "Can cross-border workers claim a Luxembourg pension?",
      a: "Yes. Frontaliers living in France, Belgium or Germany but employed in Luxembourg build up CNAP rights exactly like residents. Under EU coordination rules, each country where you were insured pays its own pension for the periods completed there, and periods completed in other EU states are taken into account when checking whether you meet minimum-duration conditions. You claim through the pension institution of your country of residence.",
    },
    {
      q: "Is this an official CNAP calculator?",
      a: "No. This is an independent estimate based on the published CNAP parameters, provided free of charge and without sign-up. It assumes a regular career and a stable average salary, and does not model every add-on or transitional rule. For a binding figure, request an official estimate from the CNAP.",
    },
  ],
};

export const SEO_CONTENT_EN = {
  '/contact': {
    h1: "Contact simfinly.com",
    intro: "A question about a calculator, an error to report, a partnership or press enquiry? Write to us at contact@simfinly.com — we usually reply within 48 business hours.",
  },
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
    intro: "Project the growth of a French life insurance policy and estimate the tax on your gains at withdrawal. The calculation applies the 8-year advantage, the annual allowance (€4,600 single / €9,200 couple), the 30% flat tax and the 17.2% social levies, using 2026 figures.",
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
    h1: "Luxembourg Pension Calculator (CNAP) 2026 — retirement age, minimum pension & amount",
    description: "Free CNAP pension calculator for Luxembourg. Statutory retirement age is 65 (early from 57 or 60), the minimum pension is €2,436.04 gross per month for 40 years of insurance. Estimate yours.",
    intro: "Estimate your Luxembourg old-age pension from the general scheme run by the CNAP (Caisse Nationale d'Assurance Pension), based on your insured salary, your years of insurance and your planned retirement age. The statutory retirement age in Luxembourg is 65, with early retirement possible from 60 with 40 years of insurance, or from 57 for long careers. Your pension combines two components: a flat-rate component tied to your length of insurance, and an earnings-related component of about 1.85 % of your average insured salary per year of contribution. If you reach at least 20 years of insurance, a guaranteed minimum pension applies: €2,436.04 gross per month for a full 40-year career, reduced by one fortieth for each missing year. Built for cross-border workers (frontaliers) from France, Belgium and Germany, and for expatriates employed in Luxembourg.",
    links: [
      ['/en/simulators/life-in-weeks', 'Life in weeks — visualise your time'],
      ['/en/simulators/wealth', 'Net worth calculator'],
      ['/en/simulators/pension-reversion', 'Survivor pension calculator'],
    ],
  },
};

// Bloc HTML SEO (sans dépendance, échappé) pour une route donnée.
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Bloc placé dans #root (remplacé par React au montage côté client).
// seoHtmlForArticle garde le masquage historique (SR_ONLY) ; seoHtmlForRoute
// rend désormais son contenu VISIBLE (SEO_WRAP). Le contenu enrichi ci-dessous
// (FAQ, sections métier) est identique à ce que l'app affiche une fois montée :
// le masquer par CSS (clip-rect) alors qu'il est volumineux s'apparenterait à du
// texte caché (risque de pénalité). Wrapper neutre, lisible même sans JS.
const SR_ONLY = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
const SEO_WRAP = 'max-width:820px;margin:0 auto;padding:24px 20px;line-height:1.6';

// Rendu léger d'un texte (échappé) : paragraphes séparés par les doubles sauts de
// ligne, **gras** converti, sauts simples en <br>. Utilisé pour les sections métier.
function renderRichText(text) {
  return escapeHtml(text)
    .split(/\n{2,}/)
    .map(p => `<p>${p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</p>`)
    .join('');
}

// Contenu enrichi d'une page métier (/retraite/:slug) : chiffres clés, sections et
// FAQ déjà rédigés dans src/data/metiers.js (invisibles sans JS jusqu'ici).
function metierBodyHtml(m) {
  let out = '';
  if (Array.isArray(m.stats) && m.stats.length) {
    out += '<ul>' + m.stats.map(s =>
      `<li><strong>${escapeHtml(s.label)} :</strong> ${escapeHtml(s.value)}${s.note ? ' ' + escapeHtml(s.note) : ''}</li>`
    ).join('') + '</ul>';
  }
  if (Array.isArray(m.sections)) {
    out += m.sections.map(s => `<h2>${escapeHtml(s.title)}</h2>${renderRichText(s.content)}`).join('');
  }
  if (Array.isArray(m.faq)) {
    out += m.faq.map(f => `<h2>${escapeHtml(f.q)}</h2><p>${escapeHtml(f.a)}</p>`).join('');
  }
  return out;
}

// Blocs pré-rendus des pages de contenu (lexique, guides, comparatifs) : générés
// depuis leurs données — ces routes n'ont pas d'entrée SEO_CONTENT et livraient
// jusqu'ici un #root vide aux crawlers.
function lexiqueBodyHtml(t) {
  let out = `<h1>${escapeHtml(t.term)} : définition</h1><p>${escapeHtml(t.short)}</p>`;
  out += (t.long || []).map(p => `<p>${escapeHtml(p)}</p>`).join('');
  out += (t.faqs || []).map(f => `<h2>${escapeHtml(f.q)}</h2><p>${escapeHtml(f.a)}</p>`).join('');
  return out;
}

function guideBodyHtml(g) {
  let out = `<h1>${escapeHtml(g.title)}</h1><p>${escapeHtml(g.intro)}</p>`;
  if (Array.isArray(g.steps) && g.steps.length) {
    out += '<ol>' + g.steps.map(s => `<li><strong>${escapeHtml(s.name)}.</strong> ${escapeHtml(s.text)}</li>`).join('') + '</ol>';
  }
  out += (g.sections || []).map(s =>
    `<h2>${escapeHtml(s.h2)}</h2>` + (s.body || []).map(p => `<p>${escapeHtml(p)}</p>`).join('')
  ).join('');
  return out;
}

function comparatifBodyHtml(c) {
  let out = `<h1>${escapeHtml(c.title)}</h1><p>${escapeHtml(c.intro)}</p>`;
  for (const side of [c.a, c.b]) {
    if (!side) continue;
    out += `<h2>${escapeHtml(side.name)} : points forts et limites</h2>`;
    if (side.pour?.length)   out += '<ul>' + side.pour.map(p => `<li>✔ ${escapeHtml(p)}</li>`).join('') + '</ul>';
    if (side.contre?.length) out += '<ul>' + side.contre.map(p => `<li>✘ ${escapeHtml(p)}</li>`).join('') + '</ul>';
  }
  out += (c.sections || []).map(s =>
    `<h2>${escapeHtml(s.h2)}</h2>` + (s.body || []).map(p => `<p>${escapeHtml(p)}</p>`).join('')
  ).join('');
  if (c.verdict) out += `<h2>Verdict</h2><p>${escapeHtml(c.verdict)}</p>`;
  return out;
}

export function seoHtmlForRoute(route, locale = 'fr', country = 'fr') {
  let dict;
  if (locale === 'en') dict = SEO_CONTENT_EN;
  else if (country === 'ch') dict = SEO_CONTENT_CH;
  else if (country === 'be') dict = SEO_CONTENT_BE;
  else dict = SEO_CONTENT;
  const c = dict[route];

  // Pages de contenu sans entrée SEO_CONTENT : bloc généré depuis les données (FR).
  if (!c) {
    if (locale === 'fr' && country === 'fr') {
      if (route.startsWith('/lexique/')) {
        const t = GLOSSARY_BY_SLUG[route.slice('/lexique/'.length)];
        if (t) return `<div id="seo-prerender" style="${SEO_WRAP}">${lexiqueBodyHtml(t)}</div>`;
      }
      if (route.startsWith('/guides/')) {
        const g = GUIDES_BY_SLUG[route.slice('/guides/'.length)];
        if (g) return `<div id="seo-prerender" style="${SEO_WRAP}">${guideBodyHtml(g)}</div>`;
      }
      if (route.startsWith('/comparatifs/')) {
        const cp = COMPARATIFS_BY_SLUG[route.slice('/comparatifs/'.length)];
        if (cp) return `<div id="seo-prerender" style="${SEO_WRAP}">${comparatifBodyHtml(cp)}</div>`;
      }
    }
    return '';
  }

  let body = `<h1>${escapeHtml(c.h1)}</h1><p>${escapeHtml(c.intro)}</p>`;

  // Liens internes (page d'accueil) : maillage crawlable vers les pages phares.
  if (Array.isArray(c.links) && c.links.length) {
    body += '<ul>' + c.links.map(([href, label]) =>
      `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`
    ).join('') + '</ul>';
  }

  // FAQ anglaise pré-rendue pour les routes EN qui en déclarent une.
  if (locale === 'en') {
    const faqEn = FAQS_EN[route];
    if (Array.isArray(faqEn) && faqEn.length) {
      body += faqEn.map(f => `<h2>${escapeHtml(f.q)}</h2><p>${escapeHtml(f.a)}</p>`).join('');
    }
  }

  // Contenu approfondi propre au FR (le même texte alimente déjà l'app et le JSON-LD).
  if (locale === 'fr' && country === 'fr') {
    if (route.startsWith('/retraite/')) {
      const m = METIERS_BY_SLUG[route.slice('/retraite/'.length)];
      if (m) body += metierBodyHtml(m);
    }
    // Éditorial « À propos » (même contenu que le composant) rendu crawlable.
    const editorial = EDITORIAL_BY_ROUTE[route];
    if (Array.isArray(editorial) && editorial.length) {
      body += editorial.map(s => {
        const link = Array.isArray(s.link)
          ? ` <a href="${escapeHtml(s.link[0])}">${escapeHtml(s.link[1])}</a>.`
          : '';
        return `<h2>${escapeHtml(s.title)}</h2><p>${escapeHtml(s.text)}${link}</p>`;
      }).join('');
    }
    const faq = FAQS[route];
    if (Array.isArray(faq) && faq.length) {
      body += faq.map(f => `<h2>${escapeHtml(f.q)}</h2><p>${escapeHtml(f.a)}</p>`).join('');
    }
    // Sources officielles (E-E-A-T) : mêmes références que la section affichée
    // par le Footer côté client.
    if (route.startsWith('/simulateurs/') || route.startsWith('/retraite/')) {
      const sources = sourcesForRoute(route, ROUTE_META[route]?.cat);
      if (sources.length) {
        body += `<h2>Sources officielles</h2><ul>` + sources.map(s =>
          `<li><a href="${escapeHtml(s.url)}" rel="noopener">${escapeHtml(s.name)}</a></li>`
        ).join('') + `</ul>`;
      }
    }
  }

  return `<div id="seo-prerender" style="${SEO_WRAP}">${body}</div>`;
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
