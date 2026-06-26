// Thematic "next step" recommendations keyed by route.
// Used by SimRecommendations on each simulator page.
// Max 3 items per route; ordered by relevance.

export const RECOMMENDATIONS = {
  // ── Retraite ───────────────────────────────────────────────────────────────
  '/simulateurs/agirc-arrco': [
    { icon: "🏛", label: "Retraite de base (CNAV)", description: "La complémentaire Agirc-Arrco s'additionne à votre pension de base. Calculez les deux pour une vision complète.", to: "/simulateurs/cnav", cta: "Simuler la CNAV →" },
    { icon: "💼", label: "Préparez votre retraite avec un PER", description: "Les versements sur un PER sont déductibles de votre revenu imposable. Estimez l'économie d'impôt.", to: "/simulateurs/per", cta: "Simuler le PER →" },
    { icon: "📅", label: "Vérifiez vos trimestres", description: "Connaître votre durée d'assurance permet de savoir quand vous pouvez partir à taux plein.", to: "/simulateurs/trimestres", cta: "Compter mes trimestres →" },
  ],
  '/simulateurs/cnav': [
    { icon: "🏆", label: "Retraite complémentaire Agirc-Arrco", description: "La CNAV s'additionne à la complémentaire Agirc-Arrco. Calculez les deux pour votre pension totale.", to: "/simulateurs/agirc-arrco", cta: "Simuler Agirc-Arrco →" },
    { icon: "📅", label: "Vérifiez vos trimestres", description: "Connaître votre durée d'assurance vous indique à quel âge vous pourrez partir à taux plein.", to: "/simulateurs/trimestres", cta: "Compter mes trimestres →" },
    { icon: "💼", label: "Préparez un PER", description: "Le Plan d'Épargne Retraite complète votre pension et réduit votre impôt dès maintenant.", to: "/simulateurs/per", cta: "Simuler le PER →" },
  ],
  '/simulateurs/trimestres': [
    { icon: "⏩", label: "Retraite anticipée — suis-je éligible ?", description: "Avec suffisamment de trimestres, vous pouvez partir avant 64 ans. Vérifiez vos droits.", to: "/simulateurs/retraite-anticipee", cta: "Vérifier l'éligibilité →" },
    { icon: "🏛", label: "Simulez votre pension CNAV", description: "Connaître vos trimestres validés est le premier pas pour estimer votre retraite de base.", to: "/simulateurs/cnav", cta: "Simuler la CNAV →" },
    { icon: "💼", label: "Optimisez avec un PER", description: "Un PER permet de compléter votre retraite tout en défiscalisant vos versements dès maintenant.", to: "/simulateurs/per", cta: "Simuler le PER →" },
  ],
  '/simulateurs/retraite-anticipee': [
    { icon: "📅", label: "Comptez vos trimestres", description: "Vérifiez votre durée d'assurance totale (cotisés + assimilés) pour connaître votre situation exacte.", to: "/simulateurs/trimestres", cta: "Compter mes trimestres →" },
    { icon: "🏛", label: "Estimez votre pension CNAV", description: "Simulez votre retraite de base selon votre salaire de référence et votre âge de départ.", to: "/simulateurs/cnav", cta: "Simuler la CNAV →" },
    { icon: "🏆", label: "Ajoutez la complémentaire", description: "La complémentaire Agirc-Arrco s'additionne à votre pension de base pour une estimation complète.", to: "/simulateurs/agirc-arrco", cta: "Simuler Agirc-Arrco →" },
  ],
  '/simulateurs/retraite-progressive': [
    { icon: "🏛", label: "Estimez votre pension CNAV complète", description: "Simulez ce que donnera votre pension de base à temps plein, pour comparer avec la retraite progressive.", to: "/simulateurs/cnav", cta: "Simuler la CNAV →" },
    { icon: "📅", label: "Vérifiez vos trimestres", description: "La retraite progressive est accessible à condition d'avoir validé un nombre suffisant de trimestres.", to: "/simulateurs/trimestres", cta: "Compter mes trimestres →" },
    { icon: "💼", label: "Complétez avec un PER", description: "Un Plan d'Épargne Retraite peut combler la différence pendant vos années à temps partiel.", to: "/simulateurs/per", cta: "Simuler le PER →" },
  ],
  '/simulateurs/comparaison-reforme': [
    { icon: "📅", label: "Comptez vos trimestres", description: "La réforme modifie la durée d'assurance requise. Vérifiez exactement où vous en êtes.", to: "/simulateurs/trimestres", cta: "Compter mes trimestres →" },
    { icon: "⏩", label: "Retraite anticipée — carrières longues", description: "Vérifiez si vous pouvez partir avant l'âge légal grâce aux dispositifs de carrière longue.", to: "/simulateurs/retraite-anticipee", cta: "Vérifier l'éligibilité →" },
    { icon: "🏛", label: "Estimez votre pension CNAV", description: "Calculez la pension de base que vous percevrez selon votre âge et vos années de carrière.", to: "/simulateurs/cnav", cta: "Simuler la CNAV →" },
  ],
  '/simulateurs/fonction-publique': [
    { icon: "📅", label: "Vérifiez vos trimestres", description: "Les trimestres validés dans la fonction publique conditionnent votre âge de départ à taux plein.", to: "/simulateurs/trimestres", cta: "Compter mes trimestres →" },
    { icon: "🏢", label: "Simulez votre IRCANTEC", description: "Si vous avez été agent non-titulaire, vous avez peut-être des droits IRCANTEC à ajouter.", to: "/simulateurs/ircantec", cta: "Simuler l'IRCANTEC →" },
    { icon: "💼", label: "Préparez un PER", description: "Le PER est ouvert aux fonctionnaires et permet de défiscaliser jusqu'à 10 % du revenu brut.", to: "/simulateurs/per", cta: "Simuler le PER →" },
  ],
  '/simulateurs/ircantec': [
    { icon: "⚖️", label: "Retraite de la fonction publique", description: "L'IRCANTEC s'additionne souvent à une pension civile ou militaire. Calculez les deux.", to: "/simulateurs/fonction-publique", cta: "Simuler →" },
    { icon: "🏛", label: "Estimez votre retraite de base CNAV", description: "Si vous avez alterné secteur privé et public, vous avez des droits CNAV à ajouter.", to: "/simulateurs/cnav", cta: "Simuler la CNAV →" },
    { icon: "💼", label: "Complétez avec un PER", description: "Un Plan d'Épargne Retraite complète votre pension et réduit votre impôt.", to: "/simulateurs/per", cta: "Simuler le PER →" },
  ],
  '/simulateurs/cnavpl': [
    { icon: "🏛", label: "Retraite de base CNAV", description: "Si vous avez cotisé au régime général avant votre activité libérale, vous avez des droits CNAV.", to: "/simulateurs/cnav", cta: "Simuler la CNAV →" },
    { icon: "💼", label: "Défiscalisez avec un PER", description: "Le PER Madelin vous permet de déduire vos versements de votre revenu professionnel.", to: "/simulateurs/per", cta: "Simuler le PER →" },
    { icon: "📅", label: "Vérifiez vos trimestres", description: "Connaître votre durée d'assurance globale permet d'optimiser votre âge de départ.", to: "/simulateurs/trimestres", cta: "Compter mes trimestres →" },
  ],
  '/simulateurs/msa': [
    { icon: "🏛", label: "Retraite de base CNAV", description: "Les périodes en secteur non-agricole s'ajoutent à votre carrière MSA. Estimez le cumul.", to: "/simulateurs/cnav", cta: "Simuler la CNAV →" },
    { icon: "💼", label: "Préparez un PER", description: "Le Plan d'Épargne Retraite est accessible aux exploitants agricoles et permet de défiscaliser.", to: "/simulateurs/per", cta: "Simuler le PER →" },
    { icon: "📅", label: "Vérifiez vos trimestres", description: "Connaître votre durée d'assurance totale (secteurs confondus) permet d'optimiser votre départ.", to: "/simulateurs/trimestres", cta: "Compter mes trimestres →" },
  ],
  '/simulateurs/independants': [
    { icon: "🏛", label: "Retraite de base CNAV", description: "Les indépendants cotisent aussi au régime général. Estimez votre pension de base.", to: "/simulateurs/cnav", cta: "Simuler la CNAV →" },
    { icon: "💼", label: "Défiscalisez avec un PER", description: "Le PER permet aux indépendants de déduire leurs versements jusqu'à 10 % du bénéfice imposable.", to: "/simulateurs/per", cta: "Simuler le PER →" },
    { icon: "💼", label: "Freelance ou salarié — comparez", description: "Comparez votre revenu net en freelance versus en CDI pour optimiser votre arbitrage.", to: "/simulateurs/freelance-vs-salarie", cta: "Comparer →" },
  ],
  '/simulateurs/per': [
    { icon: "🏆", label: "Estimez votre retraite Agirc-Arrco", description: "Visualisez la complémentaire que vous percevrez pour dimensionner l'effort d'épargne PER nécessaire.", to: "/simulateurs/agirc-arrco", cta: "Simuler Agirc-Arrco →" },
    { icon: "🛡️", label: "Comparez avec l'assurance-vie", description: "Le PER et l'assurance-vie sont complémentaires mais ont des fiscalités différentes. Comparez.", to: "/simulateurs/assurance-vie", cta: "Simuler →" },
    { icon: "🏢", label: "Épargne salariale (PEE / PERCO)", description: "L'épargne salariale peut alimenter un PERO. Estimez le gain fiscal cumulé.", to: "/simulateurs/epargne-salariale", cta: "Simuler →" },
  ],
  '/simulateurs/pension-reversion': [
    { icon: "🏛", label: "Simulez votre pension CNAV", description: "La réversion CNAV dépend de la pension de base du défunt. Estimez la pension originale.", to: "/simulateurs/cnav", cta: "Simuler la CNAV →" },
    { icon: "🏆", label: "Retraite complémentaire Agirc-Arrco", description: "La réversion Agirc-Arrco complète la réversion CNAV. Calculez les deux.", to: "/simulateurs/agirc-arrco", cta: "Simuler Agirc-Arrco →" },
    { icon: "🎁", label: "Préparez la transmission", description: "L'assurance-vie et la succession permettent de compléter la protection du conjoint survivant.", to: "/simulateurs/succession", cta: "Simuler la succession →" },
  ],
  '/simulateurs/synthese-retraite': [
    { icon: "⚖️", label: "Rente ou retrait programmé ?", description: "Une fois votre capital retraite constitué, choisissez entre la rente viagère et les retraits programmés.", to: "/simulateurs/rente-capital", cta: "Comparer →" },
    { icon: "💼", label: "Maximisez le PER", description: "Estimez combien vous pouvez verser sur un PER pour booster votre capital tout en défiscalisant.", to: "/simulateurs/per", cta: "Simuler le PER →" },
    { icon: "📅", label: "Vérifiez vos trimestres", description: "La durée d'assurance conditionne votre taux et votre âge de départ. Vérifiez votre situation.", to: "/simulateurs/trimestres", cta: "Compter mes trimestres →" },
  ],
  '/simulateurs/retraite-luxembourg': [
    { icon: "🏛", label: "Cumulez avec la CNAV française", description: "En tant que frontalier, vous avez peut-être des droits CNAV en France. Estimez les deux pensions.", to: "/simulateurs/cnav", cta: "Simuler la CNAV →" },
    { icon: "🏆", label: "Agirc-Arrco si carrière mixte", description: "Si vous avez travaillé en France avant le Luxembourg, calculez aussi votre complémentaire.", to: "/simulateurs/agirc-arrco", cta: "Simuler Agirc-Arrco →" },
    { icon: "⚖️", label: "Rente ou retrait programmé ?", description: "Avec votre capital pension, comparez la rente viagère et les retraits programmés.", to: "/simulateurs/rente-capital", cta: "Comparer →" },
  ],
  '/simulateurs/lpp-deuxieme-pilier': [
    { icon: "🏦", label: "Pilier 3a — prévoyance individuelle", description: "Le 3e pilier (3a) complète votre LPP avec des avantages fiscaux. Estimez le capital accumulé.", to: "/simulateurs/prevoyance-ch", cta: "Simuler le 3a →" },
    { icon: "📋", label: "Impôt sur le revenu en Suisse", description: "Calculez votre impôt fédéral et cantonal pour dimensionner vos déductions de prévoyance.", to: "/simulateurs/impot-revenu-ch", cta: "Calculer l'impôt →" },
    { icon: "💰", label: "Simulez votre épargne", description: "Projetez la croissance de votre épargne libre pour compléter votre prévoyance.", to: "/simulateurs/epargne", cta: "Simuler l'épargne →" },
  ],
  '/simulateurs/prevoyance-ch': [
    { icon: "🏦", label: "Simulez votre LPP (2e pilier)", description: "Le 3a complète le 2e pilier LPP. Calculez les deux pour estimer votre capital retraite total.", to: "/simulateurs/lpp-deuxieme-pilier", cta: "Simuler le LPP →" },
    { icon: "📋", label: "Impôt cantonal — déduction 3a", description: "Estimez l'économie d'impôt générée par vos versements 3a selon votre canton.", to: "/simulateurs/impot-revenu-ch", cta: "Calculer l'impôt →" },
    { icon: "💰", label: "Simulez votre épargne", description: "Projetez la croissance de votre épargne libre (hors prévoyance) sur le long terme.", to: "/simulateurs/epargne", cta: "Simuler →" },
  ],

  // ── Immobilier ─────────────────────────────────────────────────────────────
  '/simulateurs/emprunt-immobilier': [
    { icon: "🏡", label: "Simulez le PTZ 2026", description: "Le prêt à taux zéro peut financer jusqu'à 50 % de votre acquisition selon votre zone et revenus.", to: "/simulateurs/ptz", cta: "Simuler le PTZ →" },
    { icon: "🖋", label: "Estimez les frais de notaire", description: "Les frais de notaire représentent 7 à 8 % du prix en ancien. Ajoutez-les à votre budget.", to: "/simulateurs/frais-notaire", cta: "Calculer →" },
    { icon: "📊", label: "Calculez le rendement locatif", description: "Envisagez l'investissement locatif : estimez le rendement brut, net et le cash-flow mensuel.", to: "/simulateurs/rendement-locatif", cta: "Calculer le rendement →" },
  ],
  '/simulateurs/rendement-locatif': [
    { icon: "🏠", label: "Simulez votre emprunt", description: "Calculez la mensualité, la capacité d'emprunt et le coût total de votre crédit immobilier.", to: "/simulateurs/emprunt-immobilier", cta: "Simuler l'emprunt →" },
    { icon: "🏚", label: "Déficit foncier — économie d'impôt", description: "Les travaux de rénovation peuvent générer un déficit foncier réduisant votre impôt sur le revenu.", to: "/simulateurs/deficit-foncier", cta: "Calculer →" },
    { icon: "📈", label: "Plus-value immobilière", description: "Estimez l'impôt sur la plus-value si vous revendez le bien après quelques années.", to: "/simulateurs/plus-value-immobiliere", cta: "Calculer →" },
  ],
  '/simulateurs/ptz': [
    { icon: "🏠", label: "Simulez votre emprunt total", description: "Le PTZ se cumule avec un prêt principal. Calculez la mensualité et la capacité d'emprunt globale.", to: "/simulateurs/emprunt-immobilier", cta: "Simuler l'emprunt →" },
    { icon: "🖋", label: "Estimez les frais de notaire", description: "Frais de notaire réduits dans le neuf (2–3 %) mais non nuls. Intégrez-les à votre plan.", to: "/simulateurs/frais-notaire", cta: "Calculer →" },
    { icon: "📊", label: "Investissement locatif", description: "Si vous revendez après quelques années, calculez le rendement locatif avant la plus-value.", to: "/simulateurs/rendement-locatif", cta: "Calculer le rendement →" },
  ],
  '/simulateurs/frais-notaire': [
    { icon: "🏠", label: "Simulez votre emprunt", description: "Calculez la mensualité et le coût total de votre crédit une fois les frais de notaire intégrés.", to: "/simulateurs/emprunt-immobilier", cta: "Simuler l'emprunt →" },
    { icon: "🏡", label: "Simulez le PTZ 2026", description: "Le prêt à taux zéro peut couvrir une partie de votre acquisition. Vérifiez votre éligibilité.", to: "/simulateurs/ptz", cta: "Simuler le PTZ →" },
    { icon: "📊", label: "Rendement locatif", description: "Intégrez les frais de notaire dans votre calcul de rentabilité pour un investissement locatif.", to: "/simulateurs/rendement-locatif", cta: "Calculer →" },
  ],
  '/simulateurs/plus-value-immobiliere': [
    { icon: "📊", label: "Rendement locatif avant la vente", description: "Estimez la rentabilité de votre bien avant de décider de le vendre.", to: "/simulateurs/rendement-locatif", cta: "Calculer →" },
    { icon: "🏚", label: "Déficit foncier — réduire l'impôt", description: "Des travaux avant la vente peuvent réduire la base taxable de la plus-value.", to: "/simulateurs/deficit-foncier", cta: "Calculer →" },
    { icon: "🎁", label: "Donation ou succession ?", description: "Comparez la donation du bien de son vivant versus la transmission par succession.", to: "/simulateurs/donation", cta: "Comparer →" },
  ],
  '/simulateurs/deficit-foncier': [
    { icon: "📊", label: "Calculez votre rendement locatif", description: "Estimez la rentabilité brute et nette, cash-flow et retour sur fonds propres de votre bien.", to: "/simulateurs/rendement-locatif", cta: "Calculer →" },
    { icon: "📋", label: "Simulez votre impôt sur le revenu", description: "Vérifiez comment le déficit foncier réduit votre TMI et votre impôt global.", to: "/simulateurs/impot-revenu", cta: "Simuler l'impôt →" },
    { icon: "📈", label: "Plus-value à la revente", description: "Calculez l'imposition sur la plus-value si vous vendez le bien après les travaux.", to: "/simulateurs/plus-value-immobiliere", cta: "Calculer →" },
  ],

  // ── Impôts & Transmission ───────────────────────────────────────────────────
  '/simulateurs/impot-revenu': [
    { icon: "💼", label: "Réduisez l'impôt avec un PER", description: "Les versements sur un PER réduisent directement votre revenu imposable. Estimez l'économie.", to: "/simulateurs/per", cta: "Simuler le PER →" },
    { icon: "🎁", label: "Donation vs succession", description: "Anticipez la transmission de votre patrimoine pour optimiser la fiscalité globale.", to: "/simulateurs/donation", cta: "Comparer →" },
    { icon: "🏚", label: "Déficit foncier", description: "Si vous avez un bien locatif, les travaux peuvent générer un déficit foncier déductible.", to: "/simulateurs/deficit-foncier", cta: "Calculer →" },
  ],
  '/simulateurs/succession': [
    { icon: "🎁", label: "Donation vs succession", description: "Donner de son vivant peut réduire fortement les droits de transmission. Comparez les deux.", to: "/simulateurs/donation", cta: "Comparer →" },
    { icon: "📋", label: "Simulez votre impôt sur le revenu", description: "Anticipez l'impact fiscal global sur vos héritiers selon leur tranche marginale d'imposition.", to: "/simulateurs/impot-revenu", cta: "Simuler →" },
    { icon: "🛡️", label: "Assurance-vie hors succession", description: "L'assurance-vie permet de transmettre jusqu'à 152 500 € par bénéficiaire hors succession.", to: "/simulateurs/assurance-vie", cta: "Simuler →" },
  ],
  '/simulateurs/donation': [
    { icon: "🎁", label: "Droits de succession", description: "Comparez l'imposition de la transmission par succession si vous ne donnez pas de votre vivant.", to: "/simulateurs/succession", cta: "Simuler la succession →" },
    { icon: "🛡️", label: "Assurance-vie hors succession", description: "L'assurance-vie permet de transmettre jusqu'à 152 500 € par bénéficiaire sans droits.", to: "/simulateurs/assurance-vie", cta: "Simuler →" },
    { icon: "📋", label: "Simulez votre impôt sur le revenu", description: "Vérifiez l'impact fiscal global de votre stratégie de transmission.", to: "/simulateurs/impot-revenu", cta: "Simuler →" },
  ],
  '/simulateurs/divorce': [
    { icon: "📋", label: "Simulez votre impôt après divorce", description: "Le changement de situation fiscale modifie votre quotient familial et votre impôt. Estimez-le.", to: "/simulateurs/impot-revenu", cta: "Simuler l'impôt →" },
    { icon: "💼", label: "Reconstruire votre épargne", description: "Projetez la croissance de votre épargne reconstruite après la séparation.", to: "/simulateurs/epargne", cta: "Simuler →" },
    { icon: "💞", label: "Pension de réversion", description: "Si vous avez été mariés, la réversion peut être due même après divorce. Estimez les droits.", to: "/simulateurs/pension-reversion", cta: "Simuler →" },
  ],
  '/simulateurs/succession-ch': [
    { icon: "📋", label: "Impôt sur le revenu en Suisse", description: "Calculez votre impôt cantonal pour évaluer la charge fiscale globale de votre patrimoine.", to: "/simulateurs/impot-revenu-ch", cta: "Calculer l'impôt →" },
    { icon: "🏦", label: "Pilier 3a — capital hors succession", description: "Les avoirs de prévoyance (3a) sortent souvent de la succession. Estimez leur impact.", to: "/simulateurs/prevoyance-ch", cta: "Simuler le 3a →" },
    { icon: "💰", label: "Simulez votre épargne", description: "Projetez la croissance de votre patrimoine transmissible sur le long terme.", to: "/simulateurs/epargne", cta: "Simuler →" },
  ],
  '/simulateurs/impot-revenu-ch': [
    { icon: "🏦", label: "Déduisez votre pilier 3a", description: "Les versements 3a réduisent votre revenu imposable cantonal. Estimez l'économie.", to: "/simulateurs/prevoyance-ch", cta: "Simuler le 3a →" },
    { icon: "🏔", label: "Droits de succession par canton", description: "Comprenez l'imposition successorale dans votre canton pour optimiser votre patrimoine.", to: "/simulateurs/succession-ch", cta: "Simuler →" },
    { icon: "🏦", label: "Simulez votre LPP", description: "Le 2e pilier LPP réduit aussi votre revenu cotisable. Visualisez son impact.", to: "/simulateurs/lpp-deuxieme-pilier", cta: "Simuler le LPP →" },
  ],

  // ── Finances & Épargne ─────────────────────────────────────────────────────
  '/simulateurs/epargne': [
    { icon: "🔥", label: "Calculez votre FIRE", description: "Avec votre épargne mensuelle, à quel âge pouvez-vous vivre de vos investissements ?", to: "/simulateurs/fire", cta: "Calculer le FIRE →" },
    { icon: "💼", label: "Défiscalisez avec un PER", description: "En investissant dans un PER, vous épargnez ET réduisez votre impôt sur le revenu.", to: "/simulateurs/per", cta: "Simuler le PER →" },
    { icon: "💎", label: "Calculez votre patrimoine global", description: "Consolidez l'ensemble de vos actifs pour une vision complète de votre richesse nette.", to: "/simulateurs/patrimoine", cta: "Calculer →" },
  ],
  '/simulateurs/fire': [
    { icon: "💰", label: "Simulez votre épargne", description: "Ajustez votre versement mensuel pour atteindre votre objectif FIRE plus rapidement.", to: "/simulateurs/epargne", cta: "Simuler →" },
    { icon: "💎", label: "Calculez votre patrimoine global", description: "Visualisez comment vos actifs actuels contribuent à votre objectif d'indépendance.", to: "/simulateurs/patrimoine", cta: "Calculer →" },
    { icon: "📈", label: "Comparez les actifs ETF / actions", description: "Choisissez les bons supports pour votre capital FIRE selon leur performance historique.", to: "/simulateurs/comparateur", cta: "Comparer →" },
  ],
  '/simulateurs/patrimoine': [
    { icon: "🔥", label: "Calculez votre FIRE", description: "Utilisez votre patrimoine net comme point de départ pour estimer votre âge d'indépendance.", to: "/simulateurs/fire", cta: "Calculer le FIRE →" },
    { icon: "💰", label: "Simulez votre épargne", description: "Projetez comment votre patrimoine évoluera selon votre effort d'épargne mensuel.", to: "/simulateurs/epargne", cta: "Simuler →" },
    { icon: "🛡️", label: "Optimisez votre assurance-vie", description: "L'assurance-vie est l'enveloppe d'épargne préférée des Français. Estimez sa croissance.", to: "/simulateurs/assurance-vie", cta: "Simuler →" },
  ],
  '/simulateurs/budget': [
    { icon: "💰", label: "Simulez votre épargne", description: "Chaque euro épargné selon la règle 50/30/20 peut être investi. Projetez la croissance.", to: "/simulateurs/epargne", cta: "Simuler l'épargne →" },
    { icon: "🔥", label: "Calculez votre FIRE", description: "Avec votre taux d'épargne actuel, calculez à quel âge vous pouvez atteindre l'indépendance.", to: "/simulateurs/fire", cta: "Calculer le FIRE →" },
    { icon: "💼", label: "Simulez votre salaire net", description: "Connaître votre salaire net exact est essentiel pour bien calibrer votre budget.", to: "/simulateurs/salaire", cta: "Calculer →" },
  ],
  '/simulateurs/assurance-vie': [
    { icon: "💼", label: "Comparez avec le PER", description: "PER et assurance-vie sont complémentaires. Le PER défiscalise à l'entrée, l'AV à la sortie.", to: "/simulateurs/per", cta: "Simuler le PER →" },
    { icon: "🔥", label: "Calculez votre FIRE", description: "L'assurance-vie est souvent le support du capital FIRE. Vérifiez si votre capital est suffisant.", to: "/simulateurs/fire", cta: "Calculer le FIRE →" },
    { icon: "🎁", label: "Transmission hors succession", description: "L'assurance-vie permet de transmettre jusqu'à 152 500 € par bénéficiaire hors droits.", to: "/simulateurs/succession", cta: "Simuler →" },
  ],
  '/simulateurs/epargne-salariale': [
    { icon: "💼", label: "Complétez avec un PER", description: "Le PERO (Plan d'Épargne Retraite Obligatoire) complète le PEE/PERCO avec un horizon retraite.", to: "/simulateurs/per", cta: "Simuler le PER →" },
    { icon: "💰", label: "Projetez votre épargne", description: "Simulez la croissance totale de votre épargne PEE/PERCO sur le long terme.", to: "/simulateurs/epargne", cta: "Simuler →" },
    { icon: "📋", label: "Simulez votre impôt sur le revenu", description: "Vérifiez comment l'abondement et les déblocages de l'épargne salariale impactent votre impôt.", to: "/simulateurs/impot-revenu", cta: "Simuler →" },
  ],
  '/simulateurs/credit-conso': [
    { icon: "📊", label: "Gérez votre budget 50/30/20", description: "Vérifiez que la mensualité du crédit ne dépasse pas votre enveloppe 'besoins' recommandée.", to: "/simulateurs/budget", cta: "Gérer mon budget →" },
    { icon: "💰", label: "Épargnez plutôt qu'emprunter ?", description: "Comparez le coût total du crédit à une épargne préalable pour le même achat.", to: "/simulateurs/epargne", cta: "Simuler l'épargne →" },
    { icon: "💼", label: "Simulez votre salaire net", description: "Connaître votre revenu net exact permet de vérifier votre capacité de remboursement.", to: "/simulateurs/salaire", cta: "Calculer →" },
  ],
  '/simulateurs/salaire': [
    { icon: "📊", label: "Gérez votre budget 50/30/20", description: "Répartissez votre salaire net selon la règle 50/30/20 : besoins, envies, épargne.", to: "/simulateurs/budget", cta: "Gérer mon budget →" },
    { icon: "💼", label: "Freelance vs salarié — comparez", description: "Comparez votre revenu net en CDI versus en freelance pour optimiser votre statut.", to: "/simulateurs/freelance-vs-salarie", cta: "Comparer →" },
    { icon: "📋", label: "Simulez votre impôt sur le revenu", description: "Calculez votre TMI et votre impôt à partir de votre salaire annuel brut.", to: "/simulateurs/impot-revenu", cta: "Simuler →" },
  ],
  '/simulateurs/freelance-vs-salarie': [
    { icon: "💼", label: "Simulez votre salaire net en CDI", description: "Calculez précisément votre salaire net, les charges et la retraite constituée en CDI.", to: "/simulateurs/salaire", cta: "Calculer →" },
    { icon: "💼", label: "Retraite des indépendants (SSI)", description: "En freelance, estimez votre future retraite SSI pour anticiper l'effort d'épargne supplémentaire.", to: "/simulateurs/independants", cta: "Simuler →" },
    { icon: "📋", label: "Simulez votre impôt sur le revenu", description: "Comparez la charge fiscale globale entre les deux statuts.", to: "/simulateurs/impot-revenu", cta: "Simuler →" },
  ],
  '/simulateurs/inflation': [
    { icon: "💰", label: "Simulez votre épargne", description: "Vérifiez si votre rendement d'épargne surpasse l'inflation pour préserver votre pouvoir d'achat.", to: "/simulateurs/epargne", cta: "Simuler →" },
    { icon: "📊", label: "Ajustez votre budget 50/30/20", description: "L'inflation réduit votre budget réel. Recalibrez vos enveloppes selon les nouveaux prix.", to: "/simulateurs/budget", cta: "Gérer mon budget →" },
    { icon: "🔥", label: "Anticipez l'inflation dans le FIRE", description: "Intégrez l'inflation à votre calcul d'indépendance financière pour un objectif réaliste.", to: "/simulateurs/fire", cta: "Calculer le FIRE →" },
  ],
  '/simulateurs/comparateur': [
    { icon: "💰", label: "Simulez votre épargne mensuelle", description: "Définissez un effort mensuel et projetez la croissance avec les actifs que vous venez de comparer.", to: "/simulateurs/epargne", cta: "Simuler →" },
    { icon: "🔥", label: "Calculez votre FIRE", description: "Avec le rendement historique de vos actifs, estimez votre âge d'indépendance financière.", to: "/simulateurs/fire", cta: "Calculer le FIRE →" },
    { icon: "💎", label: "Calculez votre patrimoine global", description: "Consolidez tous vos actifs pour une vision complète de votre richesse nette.", to: "/simulateurs/patrimoine", cta: "Calculer →" },
  ],
  '/simulateurs/cout-en-heures': [
    { icon: "📊", label: "Gérez votre budget 50/30/20", description: "Répartissez vos dépenses en heures de vie pour prioriser ce qui compte vraiment.", to: "/simulateurs/budget", cta: "Gérer mon budget →" },
    { icon: "🔥", label: "Calculez votre FIRE", description: "Si chaque heure de travail a un coût, calculez combien d'heures il vous faut pour être libre.", to: "/simulateurs/fire", cta: "Calculer le FIRE →" },
    { icon: "💼", label: "Simulez votre salaire net", description: "Connaître votre salaire horaire net exact rend cette calculatrice encore plus précise.", to: "/simulateurs/salaire", cta: "Calculer →" },
  ],
  '/simulateurs/vie-en-semaines': [
    { icon: "🔥", label: "Calculez votre FIRE", description: "Combien de semaines vous reste-t-il avant d'atteindre l'indépendance financière ?", to: "/simulateurs/fire", cta: "Calculer le FIRE →" },
    { icon: "📊", label: "Gérez votre budget", description: "Chaque semaine bien budgétée rapproche de vos objectifs. Répartissez avec la règle 50/30/20.", to: "/simulateurs/budget", cta: "Gérer mon budget →" },
    { icon: "💰", label: "Simulez votre épargne", description: "Visualisez combien d'épargne vous pouvez accumuler sur les semaines qui vous restent.", to: "/simulateurs/epargne", cta: "Simuler →" },
  ],
  '/simulateurs/pension-legale': [
    { icon: "⚖️", label: "Rente ou retrait programmé ?", description: "Une fois votre capital pension estimé, choisissez entre la rente viagère et les retraits programmés.", to: "/simulateurs/rente-capital", cta: "Comparer →" },
    { icon: "💰", label: "Simulez votre épargne", description: "Complétez votre pension légale avec un effort d'épargne personnel projeté sur le long terme.", to: "/simulateurs/epargne", cta: "Simuler →" },
    { icon: "🎁", label: "Simulez la succession belge", description: "Préparez la transmission de votre patrimoine selon les barèmes régionaux belges.", to: "/simulateurs/succession", cta: "Simuler →" },
  ],
};
