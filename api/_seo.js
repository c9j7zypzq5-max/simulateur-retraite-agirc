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
