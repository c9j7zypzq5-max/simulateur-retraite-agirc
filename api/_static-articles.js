// Articles de fond statiques — fallback quand Redis est vide ou indisponible.
// Ces articles sont toujours servis par /api/articles et /api/article, garantissant
// que le blog n'est jamais vide pour les crawlers AdSense et Google.
// Les slugs correspondent à BLOG_SLUGS dans _routes.js.

export const STATIC_ARTICLES = [
  {
    slug: 'comment-calculer-retraite-2025',
    title: 'Comment calculer sa retraite en 2026 : le guide complet',
    category: 'Retraite',
    readTime: 7,
    publishedAt: '2025-09-15T10:00:00Z',
    intro: "Salaire annuel moyen, trimestres cotisés, taux plein : trois variables qui déterminent le montant de votre future pension. On décortique le calcul officiel pour le régime général (CNAV) et la complémentaire Agirc-Arrco.",
    content: `<h2>Les trois piliers du calcul CNAV</h2>
<p>La pension de base du régime général repose sur une formule simple : <strong>SAM × taux × prorata</strong>. Comprendre chacun de ces facteurs est indispensable pour anticiper votre future retraite.</p>
<ul>
<li><strong>Le SAM</strong> (Salaire Annuel Moyen) est la moyenne de vos 25 meilleures années de revenus bruts, plafonnée chaque année au PASS (Plafond Annuel de la Sécurité Sociale, soit 47 100 € en 2026).</li>
<li><strong>Le taux</strong> est de 50 % au maximum (taux plein). Il est réduit en cas de décote si vous partez avant d'avoir tous vos trimestres, ou majoré d'une surcote si vous travaillez au-delà.</li>
<li><strong>Le prorata</strong> compare vos trimestres validés au nombre requis pour votre génération (entre 167 et 172 selon l'année de naissance).</li>
</ul>
<h2>La durée d'assurance : trimestres cotisés et assimilés</h2>
<p>On distingue les <em>trimestres cotisés</em> (travail salarié ou indépendant) et les <em>trimestres assimilés</em> (chômage indemnisé, maladie longue durée, maternité, invalidité, service militaire). Ces deux catégories s'additionnent pour former votre durée d'assurance totale, qui conditionne le taux plein et l'âge de départ.</p>
<p>Depuis la réforme de 2023, l'âge légal monte progressivement de 62 à 64 ans selon la génération. Mais l'âge légal ne suffit pas : il faut aussi avoir le bon nombre de trimestres, ou accepter une décote définitive de 0,625 % par trimestre manquant.</p>
<h2>La complémentaire Agirc-Arrco : les points</h2>
<p>Pour les salariés du privé, la retraite complémentaire Agirc-Arrco s'exprime en <strong>points</strong> accumulés tout au long de la carrière. La pension annuelle est égale au nombre de points multiplié par la <em>valeur de service du point</em> (1,4159 € en 2026). Elle s'ajoute à la pension CNAV pour former votre revenu de retraite global.</p>
<p>Un mécanisme de <em>coefficient de solidarité</em> (−10 % pendant 3 ans) s'applique si vous partez juste après le taux plein CNAV : retarder votre départ d'un an y échappe et vous fait gagner un <em>bonus</em> de 10 %.</p>
<h2>Comment estimer dès maintenant</h2>
<p>La simulation la plus fiable reste celle de votre relevé de carrière sur info-retraite.fr, qui agrège tous vos régimes. Simfinly.com vous permet de tester rapidement différents scénarios (âge de départ, revalorisation, rachat de trimestres) pour visualiser l'impact sur votre pension avant de consulter un conseiller.</p>`,
    faqs: [
      { q: "Comment calculer le montant de ma retraite de base ?", a: "La pension CNAV = SAM × taux × (trimestres validés / trimestres requis). Le SAM est la moyenne de vos 25 meilleures années de revenus bruts plafonnés au PASS (47 100 € en 2026). Le taux maximum est de 50 % au taux plein, obtenu si vous avez validé tous vos trimestres requis (entre 167 et 172 selon votre génération)." },
      { q: "Qu'est-ce que le coefficient de solidarité Agirc-Arrco ?", a: "Le coefficient de solidarité est une réduction temporaire de 10 % sur la pension Agirc-Arrco pendant 3 ans si vous partez juste à l'âge du taux plein CNAV. Pour l'éviter, décalez votre départ d'au moins un an après le taux plein — vous échappez à la réduction et bénéficiez même d'un bonus de 10 %." },
      { q: "Comment obtenir le taux plein à la retraite ?", a: "Le taux plein (50 % du SAM) nécessite deux conditions : atteindre l'âge légal de départ (entre 62 et 64 ans selon la génération) ET avoir validé le nombre de trimestres requis. Si vous n'avez pas tous vos trimestres, vous pouvez attendre 67 ans pour bénéficier du taux plein automatique, quelle que soit votre durée d'assurance." },
      { q: "Qu'est-ce que le Salaire Annuel Moyen (SAM) et comment est-il calculé ?", a: "Le SAM est la moyenne de vos 25 meilleures années de revenus bruts, chacune plafonnée au PASS (47 100 € en 2026). Seules les années avec au moins un trimestre validé entrent dans le calcul. Maximiser ses meilleures années de carrière est donc la clé pour obtenir un SAM élevé et donc une meilleure pension." },
    ],
  },
  {
    slug: 'fire-france-independance-financiere',
    title: "FIRE en France : atteindre l'indépendance financière, ce qu'il faut savoir",
    category: 'FIRE',
    readTime: 7,
    publishedAt: '2025-10-10T09:00:00Z',
    intro: "La règle des 4 %, les enveloppes fiscales, le taux d'épargne décisif : tout ce qu'il faut savoir pour viser l'indépendance financière (FIRE) en France.",
    content: `<h2>Qu'est-ce que le FIRE ?</h2>
<p>Le mouvement <strong>FIRE</strong> (Financial Independence, Retire Early) désigne la stratégie consistant à accumuler un capital suffisant pour couvrir ses dépenses à vie grâce aux revenus générés par ce patrimoine, sans dépendre d'un emploi. L'objectif n'est pas forcément de ne plus travailler, mais de choisir librement.</p>
<p>La formule de base est simple : viser un capital égal à <strong>25 fois vos dépenses annuelles</strong>. Ce ratio découle de la <em>règle des 4 %</em> : en retirant 4 % du capital chaque année et en ajustant à l'inflation, l'étude Trinity (États-Unis, 1998) a montré qu'un portefeuille diversifié peut durer 30 ans dans la très grande majorité des scénarios historiques.</p>
<h2>Adapter la règle au contexte français</h2>
<p>Plusieurs paramètres méritent d'être ajustés en France :</p>
<ul>
<li><strong>Horizon plus long</strong> : viser une retraite très anticipée implique 40 ou 50 ans de retraits. Beaucoup d'experts français recommandent un taux de 3 à 3,5 % pour réduire le risque de ruine.</li>
<li><strong>Fiscalité</strong> : les prélèvements sociaux (17,2 %) et l'impôt sur les plus-values s'appliquent aux retraits. En utilisant le PEA ou l'assurance-vie après 8 ans, on réduit la facture fiscale.</li>
<li><strong>Retraite obligatoire</strong> : contrairement aux États-Unis, vous accumulerez des droits à la retraite pendant votre vie active, qui réduiront le capital FIRE nécessaire après 62-64 ans.</li>
</ul>
<h2>Le levier décisif : le taux d'épargne</h2>
<p>Plus que le rendement de vos placements, c'est votre <strong>taux d'épargne</strong> qui détermine la vitesse d'accumulation. Avec 10 % d'épargne, l'indépendance financière prend plusieurs dizaines d'années. À 50 %, la trajectoire peut se réduire à une quinzaine d'années.</p>
<p>Les intérêts composés jouent sur la durée : 500 € épargnés mensuellement à 6 % pendant 25 ans donnent un capital d'environ 346 000 €. Commencer tôt et réinvestir systématiquement les gains est le moteur de la méthode.</p>
<h2>Par où commencer ?</h2>
<p>Calculez d'abord vos dépenses annuelles réelles, puis déterminez votre objectif FIRE. Estimez ensuite le nombre d'années nécessaires selon votre épargne mensuelle et un rendement réaliste (4-7 % pour un portefeuille ETF diversifié, après inflation). Le simulateur FIRE de simfinly.com intègre l'inflation, la fiscalité française et la règle de retrait pour vous donner une trajectoire personnalisée.</p>`,
  faqs: [
    { q: "Combien faut-il épargner pour atteindre l'indépendance financière en France ?", a: "La règle des 4 % recommande d'accumuler 25 fois vos dépenses annuelles. Avec 2 000 €/mois de dépenses, il faut 600 000 €. En France, prévoyez 28-30 fois vos dépenses pour tenir compte de la fiscalité (PFU 30 % sur les gains) et de l'inflation." },
    { q: "Quel placement utiliser pour le FIRE en France ?", a: "La combinaison la plus courante : assurance-vie (fonds euros + UC) pour la liquidité fiscalement avantageuse après 8 ans, PEA pour les actions européennes (exonération après 5 ans), et PER pour défiscaliser pendant la phase d'accumulation. L'immobilier locatif (LMNP) complète souvent le portefeuille." },
    { q: "La retraite anticipée est-elle possible avant 50 ans en France ?", a: "Oui, mais sans accès aux retraites obligatoires (CNAV, Agirc-Arrco) avant l'âge légal. Le FIRE avant 50 ans repose entièrement sur un patrimoine financier suffisant. En pratique, la plupart des FIRE français visent 45-55 ans avec un patrimoine de 600 000 à 1,5 M€." },
    { q: "Comment gérer la fiscalité des retraits en phase FIRE ?", a: "En France, optimisez l'ordre des retraits : d'abord l'assurance-vie (abattement annuel 4 600 €/9 200 €), puis le PEA (exonéré d'IR après 5 ans), enfin le compte-titres ordinaire. Planifiez pour rester sous les tranches marginales d'imposition élevées." },
  ],
  },
  {
    slug: 'simuler-emprunt-immobilier',
    title: "Simuler son emprunt immobilier : mensualités, TAEG et capacité d'emprunt",
    category: 'Immobilier',
    readTime: 6,
    publishedAt: '2025-10-28T09:00:00Z',
    intro: "Avant de signer une offre de prêt, comprendre le TAEG, le taux d'endettement et les frais annexes est indispensable. Le guide pratique pour simuler son crédit immobilier.",
    content: `<h2>Le TAEG : le seul taux qui compte pour comparer</h2>
<p>Les banques communiquent souvent sur leur <em>taux nominal</em>, mais c'est le <strong>TAEG</strong> (Taux Annuel Effectif Global) qui donne le coût réel d'un crédit : il intègre le taux d'intérêt, l'assurance emprunteur, les frais de dossier et les frais de garantie (hypothèque ou caution). Deux offres avec le même taux nominal peuvent avoir des TAEG très différents selon l'assurance.</p>
<p>La Banque de France publie chaque trimestre le <em>taux d'usure</em> : tout prêt avec un TAEG supérieur est illégal. Si votre profil est risqué (santé, âge), votre assurance peut faire dépasser ce plafond.</p>
<h2>Le taux d'endettement : la condition sine qua non</h2>
<p>Les banques et le HCSF (Haut Conseil de Stabilité Financière) plafonent le taux d'endettement à <strong>35 % des revenus nets</strong> (assurance incluse). Au-dessus, le dossier est refusé dans la quasi-totalité des cas. Ce ratio s'améliore avec un apport plus important ou une durée plus longue — mais allonger la durée augmente le coût total des intérêts.</p>
<ul>
<li>Un apport de <strong>10 %</strong> est généralement le minimum exigé (frais de notaire couverts).</li>
<li>La stabilité professionnelle (CDI, fonctionnaire) est un critère déterminant.</li>
<li>Le <em>reste à vivre</em> — ce qu'il reste après les mensualités — complète l'analyse.</li>
</ul>
<h2>Les frais à ne pas oublier</h2>
<p>Au-delà du crédit lui-même, un achat immobilier génère des frais annexes incontournables :</p>
<ul>
<li><strong>Frais de notaire</strong> : environ 7-8 % dans l'ancien, 2-3 % dans le neuf.</li>
<li><strong>Frais de garantie</strong> : caution (Crédit Logement) ou hypothèque.</li>
<li><strong>Frais de dossier</strong> : variables selon les banques.</li>
<li><strong>PTZ</strong> : si vous êtes primo-accédant et éligible aux conditions de ressources, le Prêt à Taux Zéro peut couvrir jusqu'à 50 % de l'achat dans le neuf en zones tendues.</li>
</ul>
<h2>Simulez avant de négocier</h2>
<p>Le simulateur d'emprunt immobilier de simfinly.com calcule la mensualité, le coût total du crédit, le taux d'endettement et le tableau d'amortissement à partir de votre montant, taux et durée. Comparez plusieurs scénarios (durée, apport, assurance déléguée) pour aborder la négociation bancaire avec tous les arguments.</p>`,
  faqs: [
    { q: "Quelle mensualité pour un emprunt de 200 000 € sur 20 ans en 2026 ?", a: "À un taux de 3,5 % (taux moyen 2026 pour 20 ans), la mensualité hors assurance est d'environ 1 160 €/mois. Le coût total des intérêts sur 20 ans représente environ 78 000 €. Utilisez le simulateur emprunt de simfinly.com pour obtenir le calcul exact selon votre taux." },
    { q: "Quel apport faut-il pour un crédit immobilier en 2026 ?", a: "Les banques exigent en général 10 % du prix d'achat en apport personnel minimum, pour couvrir au moins les frais de notaire (7-8 % dans l'ancien, 2-3 % dans le neuf). Un apport de 20-30 % obtient les meilleurs taux et améliore votre dossier bancaire." },
    { q: "Le taux d'endettement maximum est-il de 35 % en 2026 ?", a: "Oui, depuis 2021 la Banque de France recommande un taux d'endettement maximum de 35 % (mensualités / revenus nets), assurance emprunteur incluse. Les banques peuvent déroger à cette règle pour 20 % des dossiers, principalement en faveur des primo-accédants et des résidences principales." },
    { q: "Faut-il choisir un taux fixe ou variable en 2026 ?", a: "En 2026, avec des taux qui se stabilisent après la hausse de 2022-2023, le taux fixe reste privilégié pour la sécurité et la visibilité. Le taux variable (capé) peut être intéressant si vous envisagez de revendre dans moins de 7 ans, car le spread initial est souvent plus faible." },
  ],
  },
  {
    slug: 'reforme-retraites-suspension-2026',
    title: 'Réforme des retraites 2023 : ce qui change vraiment pour votre départ',
    category: 'Retraite',
    readTime: 6,
    publishedAt: '2026-01-08T10:00:00Z',
    intro: "L'âge légal passe progressivement de 62 à 64 ans selon la génération. Voici l'impact concret de la loi Borne sur votre âge de départ, votre pension et les exceptions.",
    content: `<h2>Le calendrier génération par génération</h2>
<p>La loi Borne, promulguée en avril 2023, fait monter l'âge légal de départ à la retraite de 62 à <strong>64 ans</strong> de façon progressive, à raison de 3 mois supplémentaires par génération à partir de celle née en 1961 :</p>
<ul>
<li>Nés en 1960 et avant : <strong>62 ans</strong> (inchangé)</li>
<li>Nés en 1961 : 62 ans et 3 mois</li>
<li>Nés en 1963 : 63 ans et 3 mois</li>
<li>Nés en 1965 : 63 ans et 9 mois</li>
<li>Nés en 1968 et après : <strong>64 ans</strong></li>
</ul>
<p>L'âge du taux plein automatique, lui, reste fixé à <strong>67 ans</strong> quelle que soit la génération.</p>
<h2>La durée de cotisation également relevée</h2>
<p>Parallèlement à l'âge légal, la durée de cotisation requise pour le taux plein augmente : elle atteint <strong>172 trimestres</strong> (43 ans) pour les générations nées à partir de 1965, contre 167 pour celles nées avant 1961. Cette évolution est progressive.</p>
<h2>Les exceptions et dispositifs maintenus</h2>
<p>La réforme préserve ou crée des dispositifs permettant un départ anticipé :</p>
<ul>
<li><strong>Carrières longues</strong> : les assurés ayant commencé à travailler avant 16, 18 ou 20 ans peuvent partir avant l'âge légal, sous conditions de durée cotisée.</li>
<li><strong>Inaptitude et invalidité</strong> : départ à 62 ans maintenu.</li>
<li><strong>Pénibilité (C2P)</strong> : des points acquis via le compte professionnel de prévention permettent toujours de partir plus tôt.</li>
</ul>
<h2>Quel impact sur ma pension ?</h2>
<p>Si la réforme repousse votre âge légal, elle augmente aussi mécaniquement le nombre de trimestres que vous pourrez valider avant de partir. Cela peut légèrement améliorer le montant de votre pension. L'outil de comparaison avant/après réforme de simfinly.com vous permet de chiffrer cet écart pour votre génération et votre niveau de salaire.</p>`,
  faqs: [
    { q: "La réforme des retraites de 2023 est-elle toujours en vigueur en 2026 ?", a: "La réforme de 2023 (âge légal à 64 ans) reste officiellement en vigueur en 2026, malgré les tentatives politiques d'abrogation. La loi n'a pas été modifiée. L'âge légal de départ reste 64 ans pour les générations nées à partir de 1968, avec une montée en charge progressive depuis septembre 2023." },
    { q: "Peut-on encore partir à 62 ans à la retraite en 2026 ?", a: "Oui, si vous remplissez les conditions de carrière longue (LCAR) : avoir commencé à travailler avant 20 ans et disposer du nombre de trimestres requis (168-172 selon l'année de naissance). Le départ reste possible à 58, 60, ou 62 ans selon les dispositifs carrière longue. Utilisez le simulateur CNAV de simfinly.com pour vérifier votre éligibilité." },
    { q: "Que change la réforme pour les fonctionnaires ?", a: "Les fonctionnaires de la catégorie active (infirmiers, policiers, pompiers...) voient leur âge légal décalé de 2 ans également. Les catégories actives passent de 57 à 59 ans. Les fonctionnaires sédentaires de 62 à 64 ans. Les bonifications d'ancienneté et de service sont maintenues." },
    { q: "Qu'est-ce que la pension minimum à 1 200 € promise par la réforme ?", a: "La réforme de 2023 a revalorisé la pension minimum à 85 % du SMIC net pour une carrière complète, soit environ 1 200 €/mois en 2026. En pratique, seuls les assurés ayant eu de faibles salaires toute leur carrière et disposant de tous leurs trimestres bénéficient de cette revalorisation." },
  ],
  },
  {
    slug: 'bareme-impot-revenu-2026',
    title: "Barème de l'impôt sur le revenu 2026 : tranches, TMI et calcul pas à pas",
    category: 'Fiscalité',
    readTime: 5,
    publishedAt: '2026-01-12T10:00:00Z',
    intro: "Le barème 2026 appliqué aux revenus de 2025 : cinq tranches de 0 à 45 %, comment calculer son impôt net et comprendre la différence entre TMI et taux moyen.",
    content: `<h2>Les cinq tranches du barème 2026</h2>
<p>Le barème de l'impôt sur le revenu est progressif : chaque tranche s'applique uniquement à la part du revenu qui y tombe, <strong>jamais sur l'ensemble du revenu</strong>. Pour les revenus de 2025 (déclarés en 2026, barème revalorisé de 1,8 %) :</p>
<ul>
<li>De 0 à 11 497 € : <strong>0 %</strong></li>
<li>De 11 497 € à 29 315 € : <strong>11 %</strong></li>
<li>De 29 315 € à 83 823 € : <strong>30 %</strong></li>
<li>De 83 823 € à 180 294 € : <strong>41 %</strong></li>
<li>Au-delà de 180 294 € : <strong>45 %</strong></li>
</ul>
<p>Ces seuils s'appliquent au revenu net imposable <em>par part</em> du quotient familial. Un couple marié ou pacsé a 2 parts ; chaque enfant ajoute 0,5 part (1 part à partir du 3e).</p>
<h2>TMI vs taux moyen : la différence fondamentale</h2>
<p>La <strong>TMI</strong> (Tranche Marginale d'Imposition) est le taux qui s'applique à votre dernier euro de revenu. Elle sert à évaluer l'impact fiscal d'une décision (rachat PER, dividende, prime). Le <strong>taux moyen</strong> est le ratio impôt total / revenu imposable — c'est le taux que vous payez réellement en moyenne, toujours inférieur à la TMI.</p>
<h2>La décote : un mécanisme anti-rupture</h2>
<p>Pour éviter un effet de seuil trop brutal à la sortie de la première tranche, une <em>décote</em> s'applique aux foyers à revenu modeste. En pratique, un célibataire dont l'impôt brut est inférieur à environ 1 929 € bénéficie d'une réduction qui peut annuler totalement son impôt.</p>
<h2>Calculez en quelques secondes</h2>
<p>Le simulateur d'impôt sur le revenu de simfinly.com calcule votre impôt net, votre TMI et votre taux moyen selon votre revenu imposable, votre situation familiale et vos éventuelles réductions. Testez l'impact d'un versement PER ou d'une déduction pour optimiser votre déclaration.</p>`,
    faqs: [
      { q: "Quelles sont les tranches d'imposition en 2026 ?", a: "Le barème 2026 (revenus 2025) comporte 5 tranches : 0 % jusqu'à 11 497 €, 11 % de 11 497 € à 29 315 €, 30 % de 29 315 € à 83 823 €, 41 % de 83 823 € à 180 294 €, et 45 % au-delà. Ces seuils s'appliquent au revenu net imposable par part du quotient familial." },
      { q: "Quelle est la différence entre TMI et taux moyen d'imposition ?", a: "La TMI (Tranche Marginale d'Imposition) est le taux appliqué à votre dernier euro de revenu — elle sert à évaluer l'impact d'une décision fiscale (versement PER, dividende). Le taux moyen est le ratio impôt total / revenu total, toujours inférieur à la TMI. Un revenu imposable de 40 000 € (célibataire) donne une TMI de 30 % mais un taux moyen d'environ 12 %." },
      { q: "Comment fonctionne la décote fiscale ?", a: "La décote réduit l'impôt des foyers modestes pour éviter un effet de seuil brutal. En 2026, un célibataire dont l'impôt brut est inférieur à environ 1 929 € bénéficie d'une décote calculée automatiquement par l'administration, pouvant aller jusqu'à l'annulation totale de l'impôt. Elle est déjà intégrée dans le calcul de l'impôt sur le revenu net." },
      { q: "Le quotient familial réduit-il vraiment l'impôt ?", a: "Oui, le quotient familial divise le revenu imposable par le nombre de parts (2 pour un couple, +0,5 par enfant). L'impôt calculé sur la part est multiplié par le nombre de parts. Cette mécanique réduit l'impôt grâce à la progressivité du barème, mais l'avantage fiscal par demi-part est plafonné à 1 771 € en 2026." },
    ],
  },
  {
    slug: 'epargne-reglementee-2026-livret-a-lep',
    title: "Livret A, LEP, LDDS en 2026 : taux, plafonds et stratégie d'épargne",
    category: 'Épargne',
    readTime: 5,
    publishedAt: '2026-01-18T09:00:00Z',
    intro: "Depuis le 1er février 2026, le Livret A est à 2,4 % et le LEP à 3,5 %. Comment maximiser votre épargne réglementée défiscalisée avant d'aller chercher du rendement ailleurs ?",
    content: `<h2>Les taux en vigueur au 1er février 2026</h2>
<p>La Banque de France fixe le taux du Livret A chaque semestre selon une formule indexée sur l'inflation et l'Euribor. Au 1er février 2026, les taux sont :</p>
<ul>
<li><strong>Livret A</strong> : 2,4 % net (défiscalisé, plafonné à 22 950 €)</li>
<li><strong>LDDS</strong> (Livret de Développement Durable et Solidaire) : 2,4 % net (plafonné à 12 000 €)</li>
<li><strong>LEP</strong> (Livret d'Épargne Populaire) : 3,5 % net (plafonné à 10 000 €, sous conditions de ressources)</li>
<li><strong>PEL</strong> : 1,75 % brut pour les plans ouverts depuis janvier 2024 (fiscalisé après 12 ans)</li>
</ul>
<h2>Commencer par le LEP si vous y êtes éligible</h2>
<p>Le LEP offre systématiquement le meilleur rendement garanti de l'épargne réglementée, mais il est réservé aux foyers sous plafond de ressources (revenu fiscal de référence inférieur à environ 21 393 € pour une personne seule en 2025). Si vous y avez droit, il est prioritaire : 3,5 % net sans risque est difficile à battre à court terme.</p>
<h2>Remplir son Livret A et son LDDS avant d'aller ailleurs</h2>
<p>La logique d'allocation classique : LEP d'abord (si éligible), puis Livret A, puis LDDS pour le financement de projets durables. Ces enveloppes défiscalisées constituent l'épargne de précaution idéale (3 à 6 mois de charges). Au-delà des plafonds, les placements à long terme (PEA, assurance-vie, PER) prennent le relais avec un potentiel de rendement supérieur, mais avec plus de risque.</p>
<h2>Projeter son épargne réglementée</h2>
<p>Le simulateur d'épargne de simfinly.com vous permet de comparer l'accumulation sur Livret A, assurance-vie ou ETF sur différents horizons. Intégrez l'inflation pour visualiser votre rendement réel et décider du bon moment pour diversifier vers des supports plus dynamiques.</p>`,
  faqs: [
    { q: "Quel est le taux du Livret A en 2026 ?", a: "Le taux du Livret A est fixé à 2,4 % en 2026, après la baisse de février 2025 (il était à 3 % en 2024). Ce taux est net d'impôts et de prélèvements sociaux car les intérêts du Livret A sont entièrement exonérés. Le plafond reste de 22 950 €." },
    { q: "Qui peut ouvrir un LEP (Livret d'Épargne Populaire) en 2026 ?", a: "Le LEP est réservé aux personnes dont le revenu fiscal de référence ne dépasse pas un plafond (environ 22 400 € pour une personne seule en 2026). Son taux est supérieur au Livret A (3 % en 2026) et son plafond est de 10 000 €. Si vous y êtes éligible, le LEP doit être votre priorité avant le Livret A." },
    { q: "Peut-on avoir plusieurs Livrets A ?", a: "Non, un seul Livret A par personne physique est autorisé par la loi. Ouvrir plusieurs Livrets A est interdit et expose à des pénalités fiscales (imposition des intérêts). Le plafond familial peut être atteint en ouvrant un Livret A pour chaque membre du foyer (y compris les enfants mineurs) et en complétant avec le LDDS." },
    { q: "Faut-il remplir son Livret A avant d'investir en Bourse ?", a: "La règle classique : constituez d'abord une épargne de précaution de 3-6 mois de dépenses en Livret A (ou LEP) avant tout investissement en actions. Cette épargne doit être liquide et sans risque. Au-delà de cette réserve, les placements à long terme (PEA, assurance-vie, PER) offrent des rendements espérés supérieurs." },
  ],
  },
  {
    slug: 'ptz-2026-elargi-tout-le-territoire',
    title: 'PTZ 2026 élargi à tout le territoire : montants, zones et conditions',
    category: 'Immobilier',
    readTime: 6,
    publishedAt: '2026-02-03T10:00:00Z',
    intro: "Depuis le 1er avril 2025, le Prêt à Taux Zéro est accessible sur tout le territoire et dans l'ancien sous conditions. Qui peut en bénéficier, pour quel montant, et comment le simuler ?",
    content: `<h2>Le PTZ en 2026 : élargissement et simplification</h2>
<p>Le Prêt à Taux Zéro (PTZ) est un prêt complémentaire sans intérêt accordé aux <strong>primo-accédants</strong> (n'ayant pas été propriétaires de leur résidence principale au cours des 2 dernières années). Depuis le 1er avril 2025, son périmètre a été élargi par le décret n° 2025-299 :</p>
<ul>
<li>Il est désormais accessible dans <strong>toutes les zones</strong> (A, A bis, B1, B2 et C), y compris les zones rurales qui en étaient exclues.</li>
<li>L'<strong>ancien</strong> est éligible partout (avec ou sans travaux), sous réserve que le logement devienne la résidence principale.</li>
<li>Le logement neuf reste éligible avec des quotités renforcées en zones tendues.</li>
</ul>
<h2>Les montants et quotités</h2>
<p>Le montant du PTZ dépend de la <strong>zone géographique</strong>, de la <strong>composition du foyer</strong> et des <strong>revenus</strong>. La quotité (part du prix finançable par le PTZ) peut atteindre :</p>
<ul>
<li><strong>50 %</strong> pour un logement neuf en zone A/A bis</li>
<li><strong>40 %</strong> pour un logement neuf en zones B et C</li>
<li><strong>20 à 40 %</strong> pour l'ancien selon la zone</li>
</ul>
<p>Le plafond d'opération (prix × quotité) est plafonné selon la zone et le nombre de personnes. Le remboursement est différé pendant une période de 5 à 15 ans selon les revenus, puis étalé sur 10 à 15 ans.</p>
<h2>Les conditions de ressources</h2>
<p>Le PTZ est soumis à des plafonds de revenus (revenu fiscal de référence N-2). Ces plafonds varient selon la zone et la composition du foyer. Au-delà, le prêt n'est pas accessible. En dessous, les revenus les plus faibles bénéficient du différé de remboursement le plus long.</p>
<h2>Vérifiez votre éligibilité</h2>
<p>Le simulateur PTZ de simfinly.com calcule votre montant potentiel selon votre zone, vos revenus et la composition de votre foyer. Intégrez-le à votre plan de financement pour mesurer l'économie réelle sur le coût total de l'acquisition.</p>`,
  faqs: [
    { q: "Qui peut bénéficier du PTZ en 2026 ?", a: "Le PTZ 2026 (élargi à tout le territoire pour les logements neufs) est réservé aux primo-accédants (n'avoir pas été propriétaire de sa résidence principale dans les 2 dernières années) avec des revenus sous les plafonds zonés (ex : zone A bis, couple sans enfant : 88 000 €). Le logement doit devenir la résidence principale dans les 12 mois." },
    { q: "Quel est le montant maximum du PTZ en 2026 ?", a: "Le PTZ peut représenter jusqu'à 50 % du coût total de l'opération pour les zones A bis et A, 40 % pour la zone B1, et 20 % pour les zones B2 et C. Le montant maximum dépend du nombre de personnes et de la zone. Pour un 3 pièces en zone A bis (4 personnes), le montant PTZ peut atteindre 138 000 €." },
    { q: "Peut-on cumuler PTZ et prêt Action Logement ?", a: "Oui, le PTZ est cumulable avec le prêt Action Logement (ex-1 % logement, jusqu'à 30 000 € à taux réduit), un éco-PTZ si l'opération est performante énergétiquement, et les aides locales (certaines régions ont leurs propres prêts à 0 %). Vous pouvez donc cumuler plusieurs prêts bonifiés pour réduire le coût total." },
    { q: "Le PTZ doit-il être remboursé en cas de revente ?", a: "Si vous revendez avant la fin du PTZ, le capital restant dû devient immédiatement exigible. Vous devrez rembourser la partie restante du PTZ lors de la vente, ce qui est généralement couvert par le produit de vente si la valeur du bien a maintenu ou augmenté. Les conditions de remboursement anticipé sont sans pénalité sur le PTZ." },
  ],
  },
  {
    slug: 'assurance-vie-2026-fonds-euros-fiscalite',
    title: 'Assurance-vie en 2026 : rendements des fonds euros et fiscalité après 8 ans',
    category: 'Épargne',
    readTime: 6,
    publishedAt: '2026-02-17T10:00:00Z',
    intro: "Les fonds euros ont servi entre 2,5 et 4 % en 2025. On fait le point sur les rendements, la fiscalité après 8 ans et les arbitrages unités de compte pour optimiser son assurance-vie.",
    content: `<h2>Les fonds euros : retour en grâce avec la remontée des taux</h2>
<p>Après une décennie de rendements proches de zéro, les <strong>fonds en euros</strong> des contrats d'assurance-vie ont retrouvé de l'attractivité avec la remontée des taux d'intérêt. En 2025, les meilleurs contrats ont servi entre 3 et 4 % nets de frais de gestion, hors prélèvements sociaux (17,2 % prélevés annuellement sur les intérêts du fonds euros).</p>
<p>Le fonds euros reste l'unique support à <strong>capital garanti</strong> au sein d'un contrat d'assurance-vie. Il convient à l'épargne de moyen terme ou à la fraction sécurisée d'un portefeuille diversifié.</p>
<h2>La fiscalité après 8 ans : l'avantage clé</h2>
<p>L'assurance-vie est connue pour son régime fiscal avantageux, qui se déclenche après 8 ans de détention du contrat :</p>
<ul>
<li><strong>Abattement annuel</strong> sur les gains lors d'un rachat : 4 600 € pour une personne seule, 9 200 € pour un couple soumis à imposition commune.</li>
<li>Au-delà de l'abattement, les gains issus de primes inférieures à 150 000 € sont taxés à <strong>7,5 %</strong> d'impôt (contre 12,8 % en PFU avant 8 ans), plus 17,2 % de prélèvements sociaux.</li>
<li>Les rachats dans la limite de l'abattement sont totalement défiscalisés au titre de l'IR.</li>
</ul>
<h2>Fonds euros ou unités de compte : comment doser ?</h2>
<p>Les <em>unités de compte</em> (UC) — ETF, fonds immobiliers (SCPI), fonds actions — offrent un potentiel de rendement supérieur sur le long terme, mais sans garantie du capital. La règle générale : plus l'horizon est long, plus on peut se permettre une part importante d'UC.</p>
<ul>
<li><strong>Horizon court (moins de 5 ans)</strong> : priorité au fonds euros.</li>
<li><strong>Horizon long (10 ans et plus)</strong> : 60-80 % d'UC peut être pertinent pour un profil dynamique.</li>
</ul>
<h2>Calculez votre projection</h2>
<p>Le simulateur d'assurance-vie de simfinly.com projette votre capital selon le taux, les versements et la durée, et calcule la fiscalité à la sortie avant et après 8 ans pour vous aider à optimiser vos rachats.</p>`,
  faqs: [
    { q: "Quel est le rendement des fonds euros en 2026 ?", a: "Les fonds euros affichent en moyenne 2,6 à 3,8 % de rendement net en 2026 (selon les assureurs et les contrats). Les meilleurs contrats distribués en ligne dépassent 3,5 %. Ce rendement est net de frais de gestion mais avant prélèvements sociaux (17,2 %) qui sont prélevés annuellement sur les intérêts." },
    { q: "Quelle fiscalité s'applique aux retraits d'assurance-vie après 8 ans ?", a: "Après 8 ans, les gains retirés bénéficient d'un abattement annuel de 4 600 € (célibataire) ou 9 200 € (couple). Au-delà de cet abattement, le taux d'imposition sur les gains est de 7,5 % (+ 17,2 % de prélèvements sociaux) pour les versements avant 150 000 €, et 12,8 % au-delà." },
    { q: "Peut-on retirer son argent d'une assurance-vie à tout moment ?", a: "Oui, les retraits (rachats partiels ou totaux) sont possibles à tout moment, sans condition. Il n'y a pas de blocage. La fiscalité varie selon l'ancienneté du contrat : plus avantageuse après 8 ans. En cas de besoin urgent, le délai de traitement est généralement de 5-10 jours ouvrés après la demande de rachat." },
    { q: "Quelle est la différence entre assurance-vie et PER pour préparer la retraite ?", a: "L'assurance-vie est plus flexible (rachats à tout moment), la fiscalité à 8 ans est avantageuse pour tous. Le PER bloque l'épargne jusqu'à la retraite (sauf cas exceptionnels) mais offre une déductibilité fiscale des versements (jusqu'à 10 % des revenus). PER = levier fiscal pendant l'activité. Assurance-vie = flexibilité et transmission optimisée." },
  ],
  },
  {
    slug: 'per-2026-plafonds-deduction-nouveautes',
    title: 'PER en 2026 : plafonds de déduction, stratégie fiscale et cas pratiques',
    category: 'Épargne',
    readTime: 6,
    publishedAt: '2026-02-24T10:00:00Z',
    intro: "Le plafond PER 2026 atteint 37 680 € pour les salariés. Comment maximiser la déduction fiscale selon votre TMI et combiner PER individuel, PERcol et PERin pour préparer sa retraite ?",
    content: `<h2>Le plafond de déduction PER en 2026</h2>
<p>Les versements sur un Plan d'Épargne Retraite (PER) individuel ou collectif sont déductibles du revenu imposable dans la limite d'un <strong>plafond annuel</strong> calculé à partir du PASS (Plafond Annuel de la Sécurité Sociale, 47 100 € en 2026).</p>
<p>Pour un salarié, le plafond PER est égal au plus grand des deux montants suivants :</p>
<ul>
<li>10 % des revenus professionnels de l'année N-1, dans la limite de 10 % de 8 PASS = <strong>37 680 €</strong></li>
<li>10 % de 1 PASS = <strong>4 710 €</strong> (plancher)</li>
</ul>
<p>Pour les indépendants (TNS), le plafond est plus généreux : jusqu'à 85 780 € selon les revenus. Les plafonds non utilisés des 3 années précédentes peuvent être <em>reportés</em> : vérifiez votre avis d'imposition, rubrique "Plafonds épargne retraite".</p>
<h2>À quelle TMI le PER est-il rentable ?</h2>
<p>L'intérêt du PER dépend de votre <strong>tranche marginale d'imposition</strong> actuelle et de celle que vous anticiper avoir à la retraite :</p>
<ul>
<li><strong>TMI 11 %</strong> : l'avantage à l'entrée est limité. L'assurance-vie est souvent plus souple.</li>
<li><strong>TMI 30 %</strong> : économie de 300 € pour chaque 1 000 € versés. Très souvent gagnant.</li>
<li><strong>TMI 41 % ou 45 %</strong> : l'avantage fiscal est massif ; le PER est presque toujours optimal.</li>
</ul>
<h2>Cas pratique : un versement de 5 000 € à 41 % de TMI</h2>
<p>Un versement de 5 000 € sur un PER réduit votre revenu imposable de 5 000 €. À 41 % de TMI, l'économie d'impôt est de <strong>2 050 €</strong> l'année même. Ce capital est ensuite investi et bénéficie des intérêts composés. À la retraite, si votre TMI est tombée à 11 ou 30 %, la sortie en capital sera fiscalement avantageuse — et la sortie en rente, partiellement exonérée.</p>
<h2>Simulez votre économie</h2>
<p>Le simulateur PER de simfinly.com calcule l'économie d'impôt immédiate, la projection du capital à la retraite et la comparaison avant/après impôt pour différents scénarios de sortie (capital, rente, mixte).</p>`,
    faqs: [
      { q: "Quel est le plafond de déduction PER en 2026 ?", a: "Pour un salarié, le plafond 2026 est le plus élevé entre 10 % de vos revenus professionnels N-1 (dans la limite de 8 PASS, soit 37 680 €) et 10 % de 1 PASS (plancher à 4 710 €). Les plafonds non utilisés des 3 dernières années sont reportables — consultez votre avis d'imposition rubrique 'Plafonds épargne retraite'." },
      { q: "À partir de quelle tranche d'imposition le PER est-il rentable ?", a: "Le PER est particulièrement rentable à partir d'une TMI de 30 % : chaque 1 000 € versés génèrent 300 € d'économie d'impôt immédiate. À 41 % ou 45 %, l'avantage est encore plus fort. À 11 % de TMI, l'avantage fiscal est plus faible et l'assurance-vie peut être une alternative plus souple selon les objectifs." },
      { q: "Peut-on sortir du PER en capital avant la retraite ?", a: "Oui, mais uniquement dans des cas de déblocage anticipé légaux : achat de la résidence principale, invalidité de 2e ou 3e catégorie, décès du conjoint ou partenaire PACS, surendettement, fin de droits au chômage, cessation d'activité non salariée suite à liquidation judiciaire. Hors ces cas, le capital est bloqué jusqu'à la retraite." },
      { q: "Quelle est la différence entre PERin, PERcol et PERcat ?", a: "Le PERin (individuel) est ouvert à titre personnel auprès d'une banque ou assureur. Le PERcol (collectif) est proposé par l'employeur et peut recevoir l'intéressement et la participation. Le PERcat (obligatoire) est réservé à des catégories de salariés. Tous bénéficient de la même déductibilité fiscale à l'entrée, mais diffèrent par leurs sources d'alimentation." },
    ],
  },
  {
    slug: 'calcul-trimestres-retraite-guide-complet',
    title: 'Calculer ses trimestres de retraite : cotisés, assimilés, MDA et rachat',
    category: 'Retraite',
    readTime: 7,
    publishedAt: '2026-03-10T10:00:00Z',
    intro: "Chômage, maternité, maladie, service militaire : quels trimestres comptent vraiment pour le taux plein ? Le guide complet pour calculer votre durée d'assurance 2026.",
    content: `<h2>Trimestres cotisés vs trimestres assimilés</h2>
<p>La durée d'assurance se compose de deux catégories qui s'additionnent pour atteindre le taux plein :</p>
<ul>
<li><strong>Trimestres cotisés</strong> : validés grâce à une activité professionnelle (salarié, indépendant). Un trimestre est acquis par tranche de 150 SMIC horaires bruts, soit environ 1 690 € brut en 2026. On peut en valider au maximum 4 par année civile.</li>
<li><strong>Trimestres assimilés</strong> : validés sans cotisation directe. Ils couvrent le chômage indemnisé (1 trimestre par période de 50 jours), les arrêts maladie longue durée, les congés maternité et paternité, l'invalidité et le service militaire.</li>
</ul>
<h2>Les Majorations de Durée d'Assurance (MDA)</h2>
<p>Les <strong>MDA</strong> accordent des trimestres supplémentaires pour l'éducation des enfants :</p>
<ul>
<li>4 trimestres par enfant pour la maternité ou l'adoption (attribués à la mère par défaut, partageables avec le père depuis 2010).</li>
<li>4 trimestres supplémentaires pour l'éducation (jusqu'aux 4 ans de l'enfant), partageables entre les parents.</li>
</ul>
<p>L'<strong>AVPF</strong> (Assurance Vieillesse des Parents au Foyer) accorde en plus des trimestres aux aidants familiaux ayant réduit leur activité pour s'occuper d'un enfant de moins de 3 ans ou d'un proche dépendant.</p>
<h2>Le rachat de trimestres</h2>
<p>Il est possible de <em>racheter</em> jusqu'à 12 trimestres correspondant à des années d'études supérieures ou à des années incomplètes en début de carrière. Le coût dépend de l'âge au moment du rachat et du revenu. Deux options existent :</p>
<ul>
<li><strong>Rachat "taux seul"</strong> : améliore la décote mais n'allonge pas la durée d'assurance.</li>
<li><strong>Rachat "taux et durée"</strong> : plus coûteux, améliore à la fois la décote et le prorata.</li>
</ul>
<h2>Calculez votre durée d'assurance</h2>
<p>Le simulateur de trimestres de simfinly.com additionne toutes vos périodes (emploi, chômage, maladie, maternité, MDA, service militaire…) et compare votre total à la durée requise pour votre génération. Il vous indique le nombre de trimestres manquants et l'âge estimé du taux plein.</p>`,
    faqs: [
      { q: "Combien de trimestres faut-il pour partir à la retraite en 2026 ?", a: "Pour les générations nées à partir de 1968 (âge légal 64 ans), il faut 172 trimestres (43 ans) pour obtenir le taux plein. Pour les générations précédentes, ce nombre varie de 167 à 172 trimestres. Chaque année travaillée en tant que salarié valide jusqu\'à 4 trimestres (un trimestre tous les 150 SMIC horaires, soit ~1 690 € bruts en 2026)." },
      { q: "Peut-on valider des trimestres sans travailler ?", a: "Oui. Les trimestres \'assimilés\' comptent comme des trimestres cotisés : chômage indemnisé (50 jours = 1 trimestre), maladie/maternité/accident de travail indemnisé, service national, invalidité. Les enfants permettent aussi de valider des trimestres (AVPF, majoration de durée d\'assurance). Ces trimestres assimilés n\'améliorent pas le SAM (salaire de référence) mais permettent d\'atteindre la durée requise pour le taux plein." },
    ],
  },
  {
    slug: 'retraite-infirmiere-fonctionnaire-hospitalier',
    title: 'Retraite infirmière à l\'hôpital (FPH) en 2026 : âge, calcul CNRACL et RAFP',
    category: 'Retraite',
    readTime: 7,
    publishedAt: '2026-03-20T10:00:00Z',
    intro: "Infirmière titulaire de la FPH ou contractuelle ? L'âge de départ, le calcul de la pension CNRACL et les spécificités du régime de la fonction publique hospitalière décryptés.",
    content: `<h2>Le régime CNRACL : spécificités de la fonction publique hospitalière</h2>
<p>Les infirmières titulaires de la Fonction Publique Hospitalière (FPH) sont affiliées à la <strong>CNRACL</strong> (Caisse Nationale de Retraite des Agents des Collectivités Locales), un régime spécial distinct du régime général. La réforme de 2023 les rapproche progressivement du droit commun mais les particularités propres au statut de la FPH perdurent.</p>
<h2>Catégorie active ou sédentaire : la distinction clé</h2>
<p>L'âge légal de départ dépend directement de la catégorie d'appartenance :</p>
<ul>
<li><strong>Catégorie active</strong> (ayant exercé au moins 17 ans en services actifs avant la réforme 2023) : départ possible dès <strong>57 ans</strong> pour les générations nées avant 1975. Pour les générations suivantes, l'âge remonte progressivement jusqu'à 59 ans pour les nées en 1978 et après.</li>
<li><strong>Catégorie sédentaire</strong> (infirmières ayant intégré le corps des ISGS depuis 2012, reclassées en catégorie B) : régime aligné sur le droit commun, départ à <strong>64 ans</strong> pour les générations 1968 et après.</li>
</ul>
<p>La distinction est cruciale. Vérifiez votre catégorie auprès de votre établissement ou sur MaCNRACL.fr avant toute planification de départ.</p>
<h2>La formule de calcul de la pension CNRACL</h2>
<p>La pension annuelle CNRACL se calcule ainsi : <strong>Traitement indiciaire brut × 75 % × (trimestres validés / trimestres requis)</strong>.</p>
<ul>
<li>Le <strong>traitement de référence</strong> est le traitement soumis à retenue pour pension, calculé sur les 6 derniers mois. Il exclut les primes et indemnités.</li>
<li>Le <strong>taux maximum</strong> est de 75 % (contre 50 % pour le régime général).</li>
<li>La <strong>durée requise</strong> est identique au régime général : 167 à 172 trimestres selon la génération.</li>
</ul>
<p>Important : les primes représentent souvent 20-30 % du salaire brut d'une infirmière hospitalière mais ne sont pas intégrées dans la base de calcul CNRACL. C'est la source principale de l'écart entre salaire en activité et pension.</p>
<h2>Le RAFP : compensation partielle des primes</h2>
<p>Le <strong>RAFP</strong> (Régime Additionnel de la Fonction Publique) est un régime par points dont la base de cotisation comprend les éléments non soumis à retenue pour pension — primes, indemnités, heures supplémentaires — dans la limite de 20 % du traitement indiciaire. Il génère une rente mensuelle de 100 à 250 € selon la carrière, qui vient partiellement compenser la non-prise en compte des primes dans la pension principale.</p>
<h2>Infirmière contractuelle : régime général + Agirc-Arrco</h2>
<p>Les infirmières <strong>contractuelles</strong> de la FPH n'ont pas la qualité de fonctionnaire titulaire : elles relèvent du régime général (CNAV) et de l'Agirc-Arrco. L'âge légal est celui de la réforme 2023 (64 ans pour les générations 1968+). En cas de titularisation ultérieure, les périodes contractuelles peuvent être prises en compte sous conditions.</p>
<h2>Estimez votre pension</h2>
<p>Le simulateur retraite infirmière de simfinly.com distingue catégorie active et sédentaire, calcule la pension CNRACL sur la base de votre indice de rémunération et y additionne la rente RAFP estimée. Comparez différents âges de départ pour mesurer le coût d'un départ anticipé.</p>`,
  faqs: [
    { q: "À quel âge une infirmière hospitalière peut-elle partir à la retraite en 2026 ?", a: "Une infirmière fonctionnaire hospitalière (catégorie active) peut partir à 59 ans depuis la réforme de 2023 (ancien âge : 57 ans). Pour partir à 59 ans, elle doit justifier de 17 ans de services actifs. Le maintien en catégorie active exige d'exercer effectivement des soins auprès des patients." },
    { q: "Comment est calculée la pension de retraite d'une infirmière fonctionnaire ?", a: "La pension CNRACL se calcule : (traitement indiciaire de base × 75 %) × (durée des services / durée de référence). La durée de référence est 172 trimestres pour la génération 1968. Le traitement de base est le dernier traitement brut des 6 derniers mois. La NBI (nouvelle bonification indiciaire) n'entre pas dans le calcul." },
    { q: "Une infirmière peut-elle cumuler pension FPH et revenus d'activité libérale ?", a: "Oui, le cumul emploi-retraite est possible. Après liquidation de la pension CNRACL, une infirmière peut exercer en libéral ou salarié. Les revenus sont soumis à cotisations sociales normales. Si elle reprend une activité de fonctionnaire, la pension peut être suspendue selon les conditions de cumul." },
    { q: "Quelle est la différence entre retraite CNRACL et retraite CNAVTS pour les infirmières ?", a: "Les infirmières hospitalières titulaires relèvent de la CNRACL (Caisse nationale de retraite des agents des collectivités locales). Les infirmières libérales cotisent à la CNAVTS (sécurité sociale) + CARPIMKO (caisse professionnelle). Les non-titulaires hospitaliers (contractuels) relèvent du régime général (CNAV)." },
  ],
  },
  {
    slug: 'retraite-enseignant-education-nationale-calcul',
    title: 'Retraite enseignant Éducation nationale en 2026 : CNRACL, RAFP et calcul',
    category: 'Retraite',
    readTime: 7,
    publishedAt: '2026-03-25T10:00:00Z',
    intro: "Les enseignants titulaires du public relèvent de la CNRACL. Comment se calcule leur pension, quelle est la place du RAFP et quelle différence avec les enseignants du privé sous contrat ?",
    content: `<h2>Le régime des enseignants titulaires : CNRACL</h2>
<p>Les enseignants titulaires de l'Éducation nationale (professeurs des écoles, certifiés, agrégés, PLP…) relèvent de la <strong>CNRACL</strong> pour leur pension principale, complétée par le <strong>RAFP</strong> pour les primes. Ils sont classés en <em>catégorie sédentaire</em> : pas de départ anticipé au titre de la pénibilité.</p>
<h2>Âge de départ : 64 ans pour les générations 1968+</h2>
<p>Depuis la réforme de 2023, l'âge légal est progressivement porté à <strong>64 ans</strong> pour les enseignants nés à partir de 1968. L'âge du taux plein automatique reste fixé à 67 ans pour toutes les générations. La durée requise atteint 172 trimestres (43 ans) pour les générations nées à partir de 1965.</p>
<h2>La formule de calcul</h2>
<p><strong>Pension = Traitement indiciaire brut des 6 derniers mois × taux × prorata</strong></p>
<ul>
<li><strong>Traitement indiciaire brut</strong> : traitement soumis à cotisation retraite, hors NBI, primes et indemnités.</li>
<li><strong>Taux maximum</strong> : 75 %. Un enseignant avec la durée requise complète touche 75 % de son dernier traitement indiciaire.</li>
<li><strong>Prorata</strong> : trimestres validés CNRACL / trimestres requis pour le taux plein.</li>
</ul>
<p>Pour un professeur certifié en fin de carrière, le traitement indiciaire brut est d'environ 3 400-3 800 € mensuels (hors primes). La pension CNRACL correspondrait à environ 2 550-2 850 € bruts.</p>
<h2>Le RAFP : les primes converties en rente</h2>
<p>Le <strong>RAFP</strong> est alimenté par les cotisations sur les primes et indemnités (HSA, HSE, ISOE, prime REP…) dans la limite de 20 % du traitement indiciaire. Il génère une rente mensuelle supplémentaire de 100 à 300 € selon la carrière. Pour un enseignant en fin de carrière, l'ensemble pension CNRACL + rente RAFP représente généralement 70-80 % du revenu net total en activité (salaire + primes).</p>
<h2>Enseignants du privé sous contrat : régime général</h2>
<p>Les enseignants du <strong>privé sous contrat</strong> (établissements catholiques, laïcs…) sont rémunérés par l'État mais relèvent du régime général (CNAV) et de l'Agirc-Arrco. L'âge légal et les règles de calcul sont ceux du droit commun. Leurs droits sont souvent inférieurs à ceux de leurs collègues du public à salaire indiciaire équivalent, en raison du plafonnement du SAM au PASS.</p>
<h2>Calculez votre pension</h2>
<p>Le simulateur retraite enseignant de simfinly.com calcule votre pension CNRACL selon votre indice de rémunération, votre durée de service et votre génération. Comparez les scénarios de départ à 62 ans (carrière longue si applicable), 64 ans et 67 ans pour chiffrer le gain ou la perte selon votre situation.</p>`,
  faqs: [
    { q: "Quel est l'âge de retraite d'un enseignant fonctionnaire en 2026 ?", a: "Un enseignant de l'Éducation nationale (catégorie sédentaire) part à la retraite à 64 ans minimum depuis la réforme de 2023. La durée de cotisation requise est 172 trimestres (génération 1968 et après). Un enseignant ayant commencé à 24 ans devra travailler jusqu'à 67 ans s'il n'a pas ses 172 trimestres à 64 ans." },
    { q: "Comment est calculée la pension de retraite d'un professeur ?", a: "Pension SFP = traitement indiciaire brut × taux de liquidation × coefficient de proratisation. Le taux maximum est 75 % pour une carrière complète. Les primes (ISOE, ISAE) ne sont pas intégrées dans la pension SFP mais compensées partiellement par la RAFP (Retraite Additionnelle de la Fonction Publique, env. 50-150 €/mois)." },
    { q: "La RAFP (retraite additionnelle) est-elle significative pour les enseignants ?", a: "La RAFP représente en général 50 à 200 €/mois pour un enseignant avec une carrière complète, selon son taux de primes. Elle est liquidée sous forme de capital si les droits sont faibles (moins de 4 points/an pendant moins de 15 ans) ou de rente. Elle est versée en plus de la pension SFP." },
    { q: "Un enseignant peut-il racheter des trimestres pour partir plus tôt ?", a: "Oui, les rachats de trimestres (années d'études, années incomplètes) sont possibles pour les enseignants fonctionnaires, dans la limite de 12 trimestres. Le coût est calculé selon un barème officiel lié à l'âge et au traitement. Les rachats effectués tôt dans la carrière sont moins coûteux." },
  ],
  },
  {
    slug: 'retraite-agriculteur-msa-exploitant',
    title: 'Retraite agriculteur exploitant en 2026 : MSA, RCO et revalorisation',
    category: 'Retraite',
    readTime: 6,
    publishedAt: '2026-04-02T10:00:00Z',
    intro: "Les agriculteurs exploitants cotisent à la MSA. Comment fonctionne leur retraite de base et complémentaire agricole (RCO), et quel est l'impact de la revalorisation des petites retraites agricoles ?",
    content: `<h2>Le régime MSA : base et complémentaire</h2>
<p>Les agriculteurs non-salariés (exploitants, aides familiaux) relèvent de la <strong>Mutualité Sociale Agricole (MSA)</strong>. Leur retraite se compose de deux étages :</p>
<ul>
<li><strong>Retraite de base MSA</strong> : calculée en points depuis 1994 (en annuités pour les périodes antérieures). Chaque année de cotisation génère des points proportionnels au revenu professionnel.</li>
<li><strong>Retraite Complémentaire Obligatoire (RCO)</strong> : régime par points obligatoire créé en 2003, qui s'ajoute à la base pour tous les chefs d'exploitation.</li>
</ul>
<h2>La revalorisation des petites retraites agricoles</h2>
<p>Historiquement, les pensions des agriculteurs étaient très basses. Deux lois ont corrigé la situation :</p>
<ul>
<li><strong>Loi Chassaigne 2021</strong> : retraite minimale portée à 85 % du SMIC net pour les chefs d'exploitation avec carrière complète, soit environ 1 035 € nets en 2026.</li>
<li><strong>Loi Chassaigne 2 (2023)</strong> : extension aux aides familiaux et conjoints collaborateurs d'exploitation.</li>
</ul>
<p>Si votre carrière est complète et que votre pension calculée est inférieure au plancher, elle est automatiquement relevée à ce minimum garanti.</p>
<h2>Calcul de la retraite de base MSA</h2>
<p>La pension de base MSA est égale au <strong>nombre de points accumulés × valeur du point</strong>. Les points sont attribués chaque année en fonction du revenu professionnel agricole déclaré. Les années de faibles revenus génèrent peu de points, ce qui explique les petites pensions dans la profession.</p>
<p>Pour les périodes antérieures à 1994, le système des annuités s'appliquait. Ces deux sous-systèmes cohabitent dans le calcul global de chaque retraité agricole.</p>
<h2>La RCO : retraite complémentaire obligatoire</h2>
<p>La RCO a été rendue obligatoire en 2003. Elle génère des points sur la base d'une assiette forfaitaire ou des revenus professionnels réels. À la retraite, le capital de points est converti en rente selon la valeur de service du point, revalorisée chaque année par arrêté ministériel.</p>
<h2>L'âge de départ et les spécificités agricoles</h2>
<p>L'âge légal s'aligne progressivement sur le droit commun (64 ans pour les générations 1968+). Les exploitants ayant commencé à travailler très jeune (avant 18 ans) peuvent bénéficier du dispositif <em>carrières longues</em> pour partir avant l'âge légal. Les trimestres de service militaire et les périodes d'aide familiale dûment déclarées sont pris en compte.</p>
<h2>Simulez votre retraite agricole</h2>
<p>Le simulateur retraite agricole de simfinly.com calcule votre pension MSA de base, votre rente RCO estimée et vérifie si vous avez droit au minimum garanti. Intégrez vos périodes d'aide familiale, de service militaire et vos années d'installation pour obtenir une estimation complète.</p>`,
  faqs: [
    { q: "Quel est l'âge de retraite des agriculteurs exploitants en 2026 ?", a: "L'âge légal de retraite des agriculteurs affiliés à la MSA est 64 ans depuis la réforme de 2023 (62 ans auparavant). Des dispositifs de départ anticipé existent pour carrière longue (début avant 20 ans) et pour pénibilité. La pension complète nécessite 172 trimestres (génération 1968)." },
    { q: "Comment est calculée la retraite d'un agriculteur exploitant MSA ?", a: "La pension MSA se compose de deux parties : (1) la retraite de base proportionnelle aux revenus (identique au régime général CNAV), et (2) la retraite complémentaire (RCO) obligatoire depuis 2003. La pension minimale garantie est en cours de revalorisation vers 85 % du SMIC pour une carrière complète." },
    { q: "Qu'est-ce que la retraite complémentaire obligatoire (RCO) agricole ?", a: "La RCO est une retraite complémentaire par points obligatoire pour les non-salariés agricoles (chef d'exploitation, aide familiale). Les cotisations ouvrent des droits à points depuis 2003. Pour les agriculteurs plus anciens, une compensation en points a été attribuée pour les années antérieures à 2003 (mais dans des conditions variables)." },
    { q: "Un agriculteur peut-il cumuler retraite et exploitation en 2026 ?", a: "Oui, depuis la loi 2023, le cumul emploi-retraite est assoupli. Un retraité agricole peut maintenir une activité d'exploitant limitée et percevoir intégralement sa pension. Au-delà d'un certain seuil de revenus, des cotisations supplémentaires sont dues sans créer de nouveaux droits à retraite." },
  ],
  },
  {
    slug: 'droits-succession-suisse-cantons-heritiers',
    title: 'Droits de succession en Suisse en 2026 : impôts par canton et exonérations',
    category: 'Fiscalité',
    readTime: 6,
    publishedAt: '2026-04-08T10:00:00Z',
    intro: "La Suisse n'a pas d'impôt fédéral sur les successions : chaque canton fixe ses propres taux. Tour d'horizon des règles cantonales et des exonérations pour les héritiers directs.",
    content: `<h2>Pas d'impôt fédéral sur les successions en Suisse</h2>
<p>Contrairement à la France, la Suisse ne dispose d'<strong>aucun impôt fédéral sur les successions</strong>. La matière fiscale est entièrement déléguée aux cantons. Chaque canton — et parfois chaque commune — fixe ses propres taux, abattements et exonérations. Cette diversité peut conduire à des différences considérables selon le lieu de résidence du défunt.</p>
<h2>Les cantons sans impôt en ligne directe</h2>
<p>La grande majorité des cantons suisses exonèrent totalement les héritiers en <strong>ligne directe</strong> (enfants, petits-enfants, parents) : Zurich, Berne, Lucerne, Zoug, Fribourg, Soleure, Bâle-Ville, Bâle-Campagne, Schaffhouse, Saint-Gall, Grisons, Argovie, Thurgovie, Tessin, Valais et Jura appliquent un taux de <strong>0 %</strong> pour les descendants directs. Quelques exceptions notables : Vaud taxe les enfants à 3,5 % au-delà d'un abattement, et Neuchâtel applique un taux progressif.</p>
<h2>Conjoints et partenaires enregistrés : exonération totale</h2>
<p>Dans tous les cantons sans exception, les <strong>conjoints mariés</strong> et partenaires enregistrés (équivalent suisse du PACS) bénéficient d'une exonération totale des droits de succession. Le mariage reste donc le moyen le plus sûr de transmettre un patrimoine sans impôt entre partenaires en Suisse.</p>
<h2>Les héritiers éloignés : des taux pouvant atteindre 50 %</h2>
<p>La situation est radicalement différente pour les héritiers non liés par le sang direct :</p>
<ul>
<li><strong>Frères et sœurs</strong> : taux variables de 6 % (Berne) à 25 % (Genève).</li>
<li><strong>Neveux, nièces</strong> : taux de 12 % à 40 % selon le canton.</li>
<li><strong>Héritiers non apparentés</strong> (concubins non pacsés, amis) : taux pouvant atteindre <strong>40-50 %</strong> dans certains cantons comme Genève ou Vaud.</li>
</ul>
<h2>La résidence du défunt détermine le droit applicable</h2>
<p>En Suisse, c'est le <strong>dernier domicile du défunt</strong> qui détermine le canton compétent — à l'exception des immeubles, soumis au droit du canton où ils sont situés. Un résident genevois laissant un immeuble à Zurich verra son immeuble taxé selon le droit zurichois (0 % pour les enfants) mais ses avoirs mobiliers selon le droit genevois.</p>
<h2>Simulez les droits de succession suisses</h2>
<p>Le simulateur droits de succession Suisse de simfinly.com calcule l'impôt dû canton par canton selon le lien de parenté, le montant de l'héritage et la nature des biens. Comparez plusieurs cantons pour des successions impliquant des biens dans des cantons différents.</p>`,
  faqs: [
    { q: "Y a-t-il un impôt de succession entre époux en Suisse ?", a: "Non, dans tous les cantons suisses, la transmission entre époux est exonérée de droits de succession (et dans la grande majorité des cantons, entre parents et enfants aussi). Les Cantons de Vaud, Genève, Neuchâtel et quelques autres exemptent également les enfants directs. La Suisse est globalement bien plus favorable que la France en matière de succession." },
    { q: "Quel canton suisse est le plus favorable pour la succession ?", a: "Les cantons de Zoug, Schwyz, Uri, et Obwald n'ont pas du tout d'impôt sur les successions entre non-proches. Pour les héritiers non-apparentés (comme les concubins), les taux varient de 10 à 50 % selon le canton. Genève et Vaud appliquent des taux progressifs pour les héritiers éloignés." },
    { q: "La Suisse taxe-t-elle les héritages reçus de l'étranger ?", a: "Un héritier résident en Suisse reçoit un héritage étranger : la Suisse ne taxe pas cet héritage dans la plupart des cas (elle impose en fonction du domicile du défunt ou du bien, pas du bénéficiaire). Mais si le défunt était Suisse résidant en France, l'héritage peut être taxé par la France. Il faut vérifier la convention fiscale franco-suisse." },
    { q: "Comment éviter les droits de succession en Suisse pour les non-proches ?", a: "En Suisse, les stratégies courantes incluent : les donations du vivant (pas imposées entre proches et peu taxées entre tiers dans de nombreux cantons), la constitution d'une fondation privée (pour patrimoines importants), et le choix du canton de résidence (Zoug, Schwyz offrent une grande latitude). Un notaire suisse et un fiscaliste sont indispensables." },
  ],
  },
  {
    slug: 'age-depart-retraite-generation-2026',
    title: 'Âge de départ à la retraite par génération en 2026 : le tableau complet',
    category: 'Retraite',
    readTime: 6,
    publishedAt: '2026-04-15T10:00:00Z',
    intro: "Né en 1960, 1965 ou 1975 ? L'âge légal de départ, la durée requise pour le taux plein et l'âge du taux plein automatique diffèrent selon votre année de naissance. Le tableau complet 2026.",
    content: `<h2>Le calendrier complet génération par génération</h2>
<p>La réforme des retraites de 2023 (loi Borne) a modifié l'âge légal et la durée de cotisation requise. Voici le tableau officiel pour les générations de 1958 à 1968 et après :</p>
<table style="width:100%;border-collapse:collapse;font-size:14px">
<thead><tr style="background:#EAF0FF"><th style="padding:8px;text-align:left;border:1px solid #d6e2fb">Génération</th><th style="padding:8px;text-align:center;border:1px solid #d6e2fb">Âge légal</th><th style="padding:8px;text-align:center;border:1px solid #d6e2fb">Trimestres requis</th><th style="padding:8px;text-align:center;border:1px solid #d6e2fb">Taux plein auto.</th></tr></thead>
<tbody>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Avant 1958</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">62 ans</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">167</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">67 ans</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">1961</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">62 ans 3 mois</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">169</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">67 ans</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">1962</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">62 ans 6 mois</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">169</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">67 ans</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">1963</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">62 ans 9 mois</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">169</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">67 ans</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">1964</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">63 ans</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">170</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">67 ans</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">1965</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">63 ans 3 mois</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">170</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">67 ans</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">1966</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">63 ans 6 mois</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">171</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">67 ans</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">1967</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">63 ans 9 mois</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">171</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">67 ans</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>1968 et après</strong></td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb"><strong>64 ans</strong></td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb"><strong>172</strong></td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">67 ans</td></tr>
</tbody></table>
<h2>Âge légal vs âge du taux plein automatique</h2>
<p>L'<strong>âge légal</strong> est l'âge minimum pour partir à la retraite. Mais partir à l'âge légal sans avoir tous ses trimestres entraîne une <em>décote</em> permanente de 0,625 % par trimestre manquant (soit 2,5 % par an, jusqu'à 25 % pour 10 ans manquants).</p>
<p>L'<strong>âge du taux plein automatique</strong> (67 ans pour toutes les générations) est l'âge auquel la décote est effacée automatiquement, même sans avoir tous les trimestres requis. Partir à 67 ans garantit 50 % du SAM sur la retraite de base quels que soient les trimestres validés.</p>
<h2>La surcote : l'avantage de travailler plus longtemps</h2>
<p>Travailler au-delà de l'âge légal après avoir atteint la durée requise permet d'obtenir une <strong>surcote</strong> de 1,25 % par trimestre supplémentaire (5 % par an). Un départ 2 ans après le taux plein augmente la pension de 10 %, définitivement.</p>
<h2>Simulez votre départ optimal</h2>
<p>Le simulateur CNAV de simfinly.com calcule pour votre génération l'âge de départ, la pension avec et sans décote, et compare les scénarios de 60 à 70 ans pour vous aider à choisir le moment optimal.</p>`,
    faqs: [
      { q: "À quel âge puis-je partir à la retraite si je suis né en 1965 ?", a: "Si vous êtes né en 1965, votre âge légal de départ est de 63 ans et 3 mois. Vous avez besoin de 170 trimestres (42,5 ans) pour obtenir le taux plein. Si vous n'avez pas ces trimestres à cet âge, vous pouvez attendre 67 ans pour bénéficier du taux plein automatique, quelle que soit votre durée d'assurance." },
      { q: "Qu'est-ce que la décote et comment la calculer ?", a: "La décote est une réduction permanente de 0,625 % par trimestre manquant (2,5 % par an) si vous partez avant d'avoir tous vos trimestres requis. Elle est définitive. La décote maximale est de 25 % (40 trimestres manquants). À l'inverse, la surcote est un bonus de 1,25 % par trimestre supplémentaire travaillé après le taux plein." },
      { q: "Puis-je partir à la retraite avant 64 ans en 2026 ?", a: "Oui, sous certaines conditions. Les carrières longues (début avant 16, 18 ou 20 ans) permettent de partir entre 58 et 63 ans. L'inaptitude au travail permet un départ à 62 ans. Le compte professionnel de prévention (C2P) pour pénibilité peut également ouvrir des droits anticipés. La retraite progressive permet de percevoir une fraction de pension dès 60 ans." },
      { q: "Qu'est-ce que l'âge du taux plein automatique à 67 ans ?", a: "À 67 ans, la décote est effacée automatiquement quelle que soit la durée d'assurance. Un assuré ayant peu de trimestres validés peut tout de même toucher 50 % de son SAM en attendant cet âge. Les 67 ans s'appliquent à toutes les générations — c'est le filet de sécurité du système de retraite français." },
    ],
  },
  {
    slug: 'pension-reversion-calcul-conditions-2026',
    title: 'Pension de réversion en 2026 : calcul, conditions et taux selon le régime',
    category: 'Retraite',
    readTime: 6,
    publishedAt: '2026-04-22T10:00:00Z',
    intro: "La pension de réversion est versée au conjoint survivant d'un retraité décédé. Taux de 54 % au régime général, 60 % à l'Agirc-Arrco, mais sous conditions d'âge et de ressources.",
    content: `<h2>Qu'est-ce que la pension de réversion ?</h2>
<p>La <strong>pension de réversion</strong> est une fraction de la retraite du défunt versée au conjoint survivant. Elle existe dans presque tous les régimes français mais avec des règles différentes selon les caisses. Elle n'est pas automatique : il faut en faire la demande auprès de chaque caisse concernée.</p>
<h2>Le régime général (CNAV) : 54 % sous conditions de ressources</h2>
<p>Au régime général, la pension de réversion est égale à <strong>54 % de la pension brute</strong> du défunt. Conditions :</p>
<ul>
<li><strong>Avoir été marié</strong> : le PACS et le concubinage n'ouvrent pas droit à la réversion CNAV.</li>
<li><strong>Avoir au moins 55 ans</strong> (pas de condition d'âge pour les veuves avec enfants à charge).</li>
<li><strong>Plafond de ressources</strong> : vos revenus annuels ne doivent pas dépasser 23 441 € (personne seule, 2026). En cas de remariage ou cohabitation, les ressources du partenaire s'ajoutent.</li>
</ul>
<p>La réversion est <strong>cumulable avec vos propres droits à la retraite</strong> dans la limite du plafond de ressources. Au-delà du plafond, elle est réduite proportionnellement.</p>
<h2>L'Agirc-Arrco : 60 % sans condition de ressources</h2>
<ul>
<li>Taux de <strong>60 %</strong> des points Agirc-Arrco du défunt.</li>
<li><strong>Pas de condition de ressources</strong> pour la réversion complémentaire.</li>
<li>Condition d'âge : <strong>55 ans minimum</strong>.</li>
<li>Condition de mariage : même règle que le régime général.</li>
</ul>
<h2>Les régimes spéciaux</h2>
<ul>
<li><strong>CNRACL (fonctionnaires)</strong> : 50 % de la pension, sans condition de ressources, avec condition d'âge à 60 ans.</li>
<li><strong>MSA agricole</strong> : taux de 54 % comme le régime général.</li>
<li><strong>SSI (indépendants)</strong> : 54 % pour la base, plus réversion complémentaire.</li>
</ul>
<h2>Réversion et remariage</h2>
<p>En cas de <strong>remariage</strong>, la pension de réversion CNAV est <strong>suspendue</strong> depuis 2003. En revanche, la réversion Agirc-Arrco est <strong>maintenue même en cas de remariage</strong> pour les pensions acquises avant 2017.</p>
<h2>Estimez votre pension de réversion</h2>
<p>Le simulateur de réversion de simfinly.com calcule la pension de réversion CNAV et Agirc-Arrco selon la retraite du défunt, votre âge et vos ressources. Il vérifie si le plafond est dépassé et calcule la réversion nette mensuelle.</p>`,
    faqs: [
      { q: "Qui a droit à la pension de réversion en France ?", a: "La pension de réversion CNAV est réservée aux personnes ayant été mariées avec le défunt — le PACS et le concubinage n'ouvrent pas droit. Il faut également avoir au moins 55 ans (sauf si des enfants à charge sont présents). La durée du mariage n'est pas une condition d'éligibilité au régime général." },
      { q: "Quel est le montant de la pension de réversion au régime général ?", a: "La pension de réversion CNAV est égale à 54 % de la pension brute de base du défunt. Elle est ensuite réduite si vos revenus annuels dépassent 23 441 € (personne seule, 2026). Au-delà de ce plafond, la réversion est réduite proportionnellement. La réversion Agirc-Arrco (complémentaire) est de 60 % sans condition de ressources." },
      { q: "Peut-on cumuler la réversion avec sa propre retraite ?", a: "Oui, la réversion CNAV est cumulable avec vos propres droits à la retraite, mais dans la limite du plafond de ressources (23 441 € par an pour une personne seule en 2026). La réversion Agirc-Arrco est intégralement cumulable avec vos propres droits, sans plafond de ressources." },
      { q: "La pension de réversion est-elle maintenue en cas de remariage ?", a: "Non pour la CNAV : la pension de réversion est suspendue depuis 2003 en cas de remariage ou vie en couple. En revanche, la réversion Agirc-Arrco est maintenue même en cas de remariage pour les pensions acquises avant 2017. Vérifiez bien les règles de chaque caisse dont dépendait le défunt." },
    ],
  },
  {
    slug: 'retraite-progressive-mode-emploi-2026',
    title: 'Retraite progressive en 2026 : mode d\'emploi, conditions et simulation',
    category: 'Retraite',
    readTime: 6,
    publishedAt: '2026-04-29T10:00:00Z',
    intro: "La retraite progressive permet de toucher une fraction de sa retraite tout en continuant à travailler à temps partiel. Conditions d'accès, calcul de la fraction et avantages du dispositif.",
    content: `<h2>Qu'est-ce que la retraite progressive ?</h2>
<p>La <strong>retraite progressive</strong> permet de percevoir une fraction de sa retraite tout en continuant à exercer une activité à temps partiel. Ce n'est pas une préretraite : vous continuez à cotiser, ce qui améliore votre future pension définitive. C'est un dispositif peu connu mais très avantageux pour lisser la transition entre vie active et retraite complète.</p>
<h2>Conditions pour y accéder en 2026</h2>
<p>Trois conditions simultanées :</p>
<ul>
<li><strong>Avoir au moins 60 ans</strong> (soit 2 ans avant l'âge légal de 62 ans, maintenu après réforme 2023 pour ce dispositif).</li>
<li><strong>Avoir validé au moins 150 trimestres</strong> (37,5 ans) de durée d'assurance tous régimes confondus.</li>
<li><strong>Exercer à temps partiel</strong> entre 40 % et 80 % d'un temps plein.</li>
</ul>
<p>Les travailleurs indépendants (artisans, commerçants, professions libérales) y ont accès depuis 2022 sous conditions légèrement différentes.</p>
<h2>Le calcul de la fraction de pension</h2>
<p>La fraction de pension versée est proportionnelle au temps non travaillé :</p>
<ul>
<li>Vous travaillez à <strong>60 %</strong> d'un temps plein → vous percevez <strong>40 %</strong> de votre retraite estimée.</li>
<li>Vous travaillez à <strong>80 %</strong> → vous percevez <strong>20 %</strong> de votre retraite estimée.</li>
</ul>
<p>La retraite estimée est calculée au moment de la demande comme si vous partiez ce jour-là, avec vos trimestres actuels. Plus vous avez de trimestres validés, plus la fraction reçue est élevée en valeur absolue.</p>
<h2>Les avantages du dispositif</h2>
<ol>
<li><strong>Revenus maintenus</strong> : la fraction de retraite + le salaire à temps partiel permettent souvent de maintenir un revenu global proche du plein temps.</li>
<li><strong>Droits qui continuent d'augmenter</strong> : les cotisations sur le salaire partiel s'ajoutent aux droits acquis. La pension définitive sera recalculée à la hausse.</li>
<li><strong>Flexibilité</strong> : vous pouvez mettre fin à la retraite progressive à tout moment pour reprendre à temps plein ou partir définitivement.</li>
</ol>
<h2>Simulez votre retraite progressive</h2>
<p>Le simulateur de retraite progressive de simfinly.com calcule la fraction de pension selon votre quotité de travail, vos trimestres et votre salaire. Comparez le revenu total (salaire partiel + pension progressive) à votre salaire actuel pour décider si le dispositif est avantageux.</p>`,
    faqs: [
      { q: "À quel âge peut-on demander la retraite progressive ?", a: "La retraite progressive est accessible dès 60 ans (contre 64 ans pour la retraite normale), avec au moins 150 trimestres validés. Elle permet de percevoir entre 20 % et 80 % de sa pension définitive tout en continuant à travailler à temps partiel, et de continuer à accumuler des droits à la retraite. À la liquidation définitive, la pension est recalculée en tenant compte des cotisations versées pendant la phase progressive." },
      { q: "La retraite progressive réduit-elle la pension définitive ?", a: "Non — c\'est l\'un des principaux avantages. Pendant la phase progressive, vous continuez à accumuler des trimestres et des points. La pension définitive est recalculée lors de la liquidation totale en tenant compte de toute la carrière, y compris les périodes en retraite progressive. En pratique, partir en retraite progressive augmente souvent la pension définitive par rapport à un départ brutal, car les cotisations versées à temps partiel continuent de générer des droits." },
    ],
  },
  {
    slug: 'partir-retraite-avant-64-ans-carriere-longue-2026',
    title: 'Partir à la retraite avant 64 ans en 2026 : carrière longue et dispositifs',
    category: 'Retraite',
    readTime: 6,
    publishedAt: '2026-06-24T10:00:00Z',
    intro: "La réforme 2023 fixe l'âge légal à 64 ans pour les générations 1968+, mais des dispositifs permettent de partir avant. Carrière longue, pénibilité, inaptitude : conditions et simulations.",
    content: `<h2>Le dispositif carrières longues : le plus courant</h2>
<p>Le dispositif <strong>carrières longues</strong> permet aux assurés ayant commencé à travailler jeune de partir avant l'âge légal de 64 ans. Depuis la réforme 2023, il est organisé en quatre bornes :</p>
<table style="width:100%;border-collapse:collapse;font-size:14px">
<thead><tr style="background:#EAF0FF"><th style="padding:8px;text-align:left;border:1px solid #d6e2fb">Début de carrière avant</th><th style="padding:8px;text-align:center;border:1px solid #d6e2fb">Départ possible dès</th><th style="padding:8px;text-align:center;border:1px solid #d6e2fb">Trimestres requis</th></tr></thead>
<tbody>
<tr><td style="padding:8px;border:1px solid #e5e7eb">16 ans</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb"><strong>58 ans</strong></td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">Durée requise + 8</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">18 ans</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb"><strong>60 ans</strong></td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">Durée requise + 8</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">20 ans</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb"><strong>62 ans</strong></td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">Durée requise</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">21 ans</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb"><strong>63 ans</strong></td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">Durée requise</td></tr>
</tbody></table>
<p>La notion de <em>trimestres cotisés</em> est stricte ici : seuls les trimestres effectivement cotisés (hors assimilés) sont retenus, à l'exception du chômage involontaire (2 trimestres maximum).</p>
<h2>La retraite pour inaptitude au travail</h2>
<p>Les assurés reconnus <strong>inaptes au travail</strong> (incapacité permanente ≥ 50 %, pension d'invalidité 2e ou 3e catégorie) peuvent partir à <strong>62 ans</strong> avec le taux plein automatique, même si leur durée de cotisation est incomplète.</p>
<h2>La pénibilité via le Compte Professionnel de Prévention (C2P)</h2>
<p>Les facteurs de pénibilité (travail de nuit, travail répétitif, températures extrêmes, bruit…) génèrent des <strong>points C2P</strong> permettant d'anticiper son départ d'un trimestre par point, jusqu'à 8 trimestres (2 ans) d'anticipation maximum.</p>
<h2>La retraite anticipée pour handicap</h2>
<p>Les assurés avec un taux d'incapacité d'au moins 50 % peuvent partir à partir de <strong>55 ans</strong>, sous conditions de durée de cotisation et d'incapacité permanente reconnue par la MDPH.</p>
<h2>Calculez votre départ anticipé possible</h2>
<p>Le simulateur de départ anticipé de simfinly.com vérifie si vous remplissez les conditions pour le dispositif carrières longues selon votre année de naissance, l'âge de début de carrière et vos trimestres cotisés. Il calcule la pension que vous percevriez selon différents âges de départ.</p>`,
    faqs: [
      { q: "Peut-on partir à la retraite avant 64 ans en 2026 ?", a: "Oui, sous trois conditions principales : (1) Carrières longues (RACL) : si vous avez commencé à travailler avant 21 ans et validé suffisamment de trimestres, vous pouvez partir à 60-63 ans selon votre âge de début de carrière ; (2) Incapacité permanente : taux ≥ 50 % permet un départ à 62 ans au taux plein ; (3) Pénibilité via le C2P (compte professionnel de prévention) : des droits convertibles en trimestres anticipés pour les expositions aux 6 facteurs de pénibilité." },
      { q: "Combien de trimestres faut-il pour la carrière longue ?", a: "Pour partir à 60 ans (début avant 16 ans), il faut avoir validé au minimum 4 trimestres avant 16 ans ET atteindre la durée requise pour le taux plein (172 trimestres pour les générations 1968+) augmentée de 8 trimestres. Pour partir à 62 ans (début avant 18 ans), il faut 5 trimestres avant 18 ans + durée du taux plein. Pour 63 ans (début avant 21 ans) : 5 trimestres avant 21 ans + durée du taux plein." },
    ],
  },
  {
    slug: 'donation-abattement-100000-euros-2026',
    title: 'Donation parents-enfants 2026 : abattement 100 000 € et calcul des droits',
    category: 'Fiscalité',
    readTime: 6,
    publishedAt: '2026-05-06T10:00:00Z',
    intro: "Donner à ses enfants jusqu'à 100 000 € tous les 15 ans sans payer de droits. Comment fonctionne l'abattement légal, les dons manuels et la donation-partage pour transmettre son patrimoine.",
    content: `<h2>L'abattement de 100 000 € : le socle de la donation</h2>
<p>Chaque parent peut donner à chacun de ses enfants jusqu'à <strong>100 000 €</strong> en exonération totale de droits de donation, tous les 15 ans. Cet abattement se recharge intégralement au bout de 15 ans. Une famille avec deux enfants peut ainsi transmettre jusqu'à 400 000 € tous les 15 ans sans payer un centime de droits. Il s'applique à toutes les formes de donations : argent, bien immobilier, actions, parts de société.</p>
<h2>Le don familial de sommes d'argent : 31 865 € supplémentaires</h2>
<p>En plus de l'abattement général, un <strong>abattement spécifique de 31 865 €</strong> s'applique aux dons de sommes d'argent (chèque, virement), cumulable avec l'abattement de 100 000 €, sous conditions :</p>
<ul>
<li>Le donateur doit avoir moins de <strong>80 ans</strong>.</li>
<li>Le bénéficiaire doit être majeur.</li>
</ul>
<p>Cumulé, un parent de moins de 80 ans peut donner <strong>131 865 €</strong> à chaque enfant sans droits.</p>
<h2>Le barème des droits au-delà des abattements</h2>
<ul>
<li>Jusqu'à 8 072 € : <strong>5 %</strong></li>
<li>De 8 072 € à 15 932 € : <strong>10-15 %</strong></li>
<li>De 15 932 € à 552 324 € : <strong>20 %</strong></li>
<li>De 552 324 € à 902 838 € : <strong>30 %</strong></li>
<li>Au-delà : <strong>40-45 %</strong></li>
</ul>
<h2>La donation-partage : l'outil privilégié pour les familles</h2>
<p>La <strong>donation-partage</strong> permet de répartir son patrimoine entre plusieurs enfants en une seule opération notariée. Les biens donnés sont évalués au jour de la donation, pas au décès : les plus-values ultérieures profitent aux bénéficiaires sans droits supplémentaires. Elle prévient aussi les conflits entre héritiers.</p>
<h2>Déclaration obligatoire au-delà de 15 000 €</h2>
<p>Toute donation supérieure à <strong>15 000 €</strong> doit être déclarée à l'administration fiscale dans le mois suivant (formulaire 2735). En dessous, la déclaration est recommandée pour faire courir le délai de rappel des 15 ans.</p>
<h2>Simulez votre donation</h2>
<p>Le simulateur de donation de simfinly.com calcule les droits selon le montant, le lien de parenté et les abattements déjà utilisés sur les 15 dernières années. Il compare donation simple, don de sommes d'argent et donation-partage pour optimiser la transmission.</p>`,
    faqs: [
      { q: "Combien peut-on donner à son enfant sans impôt en 2026 ?", a: "En ligne directe (parent → enfant), l\'abattement est de 100 000 € par donateur et par donataire, renouvelable tous les 15 ans. Un couple peut donc donner 200 000 € à chaque enfant sans droits de donation (100 000 € du père + 100 000 € de la mère). En réalisant des donations tous les 15 ans, une famille peut transmettre plusieurs centaines de milliers d\'euros en totale franchise de droits." },
      { q: "Faut-il déclarer une donation de moins de 100 000 € ?", a: "Les dons manuels (argent, biens mobiliers) n\'ont pas à être déclarés spontanément si leur montant reste sous l\'abattement. Mais si le bénéficiaire les révèle (lors d\'une succession, d\'un contrôle fiscal...) et si le délai de 15 ans n\'est pas écoulé, ils seront pris en compte pour calculer les droits. Il est donc conseillé de déclarer même les donations inférieures à 100 000 € pour marquer le point de départ du délai de 15 ans." },
    ],
  },
  {
    slug: 'frais-notaire-achat-immobilier-calcul-2026',
    title: 'Frais de notaire 2026 : calcul détaillé dans l\'ancien et le neuf',
    category: 'Immobilier',
    readTime: 5,
    publishedAt: '2026-05-13T10:00:00Z',
    intro: "Lors d'un achat immobilier, les frais de notaire représentent 7-8 % dans l'ancien et 2-3 % dans le neuf. Composition détaillée et calcul précis pour anticiper votre budget.",
    content: `<h2>Les frais de notaire : trois composantes distinctes</h2>
<p>L'expression "frais de notaire" désigne l'ensemble des sommes versées au notaire, dont la grande majorité ne lui revient pas. Ils se décomposent en :</p>
<ul>
<li><strong>Droits de mutation</strong> (taxe départementale + communale) : environ 5,8 % du prix dans l'ancien, reversés à la collectivité. C'est la part la plus importante.</li>
<li><strong>Émoluments du notaire</strong> : rémunération réglementée selon barème officiel, environ 0,8-1 % du prix.</li>
<li><strong>Débours et formalités</strong> : frais administratifs, publications, cadastre. Environ 0,5-0,8 % du prix.</li>
</ul>
<h2>L'ancien : 7 à 8 % du prix</h2>
<p>Pour un bien ancien (plus de 5 ans), les droits de mutation s'élèvent à <strong>5,80 %</strong> dans la quasi-totalité des départements. S'y ajoutent émoluments et débours pour un total de 7-8 %.</p>
<p>Exemple pour un appartement à <strong>300 000 €</strong> :</p>
<ul>
<li>Droits de mutation : ≈ 17 400 €</li>
<li>Émoluments notaire : ≈ 3 000 €</li>
<li>Débours : ≈ 1 500 €</li>
<li><strong>Total : environ 21 900 €</strong></li>
</ul>
<h2>Le neuf : 2 à 3 % du prix</h2>
<p>Pour un logement neuf (premier acquéreur, TVA incluse dans le prix), les droits de mutation sont réduits à <strong>0,715 %</strong>. Les frais totaux se limitent à 2-3 % du prix, une économie significative justifiant en partie le prix au m² souvent plus élevé dans le neuf.</p>
<h2>Peut-on réduire les frais de notaire ?</h2>
<p>Les droits de mutation ne se négocient pas. Le notaire peut accorder une remise jusqu'à 20 % sur la partie de son émolument dépassant 150 000 €. La seule véritable économie courante : déduire la valeur du <em>mobilier</em> du prix de vente (meubles valorisés dans le compromis réduisent l'assiette des droits de mutation).</p>
<h2>Calculez vos frais de notaire</h2>
<p>Le simulateur frais de notaire de simfinly.com calcule précisément droits de mutation, émoluments et débours selon le prix, le département et le type de bien. Intégrez les frais d'agence et le PTZ pour avoir une vision complète de votre financement.</p>`,
    faqs: [
      { q: "Quels sont les frais de notaire en 2026 pour un achat dans l'ancien ?", a: "Pour un bien ancien, les frais de notaire représentent environ 7 à 8 % du prix d\'achat. Ils se décomposent en : droits de mutation (taxe départementale ~4,5 % + taxe communale 1,2 % + CSI 0,1 %), émoluments du notaire (~1 % selon barème dégressif), frais de formalités et débours (~1 %). Sur un appartement à 250 000 €, comptez environ 18 000-20 000 € de frais de notaire." },
      { q: "Peut-on réduire les frais de notaire légalement ?", a: "Oui, trois leviers légaux existent : (1) Déduire la valeur des meubles inclus dans la vente (cuisine équipée, électroménager) du prix du bien — les droits de mutation ne s\'appliquent pas aux meubles. Une cuisine à 8 000 € incluse réduit la base taxable d\'autant. (2) Choisir un bien en zone à taxe départementale réduite — certains départements ont voté un taux de 3,8 % au lieu de 4,5 %. (3) Si le prix dépasse 150 000 €, demander la remise de 20 % sur les émoluments du notaire (légalement autorisé depuis 2016)." },
    ],
  },
  {
    slug: 'deficit-foncier-travaux-deductibles-2026',
    title: 'Déficit foncier en 2026 : travaux déductibles, plafond 10 750 € et calcul',
    category: 'Fiscalité',
    readTime: 6,
    publishedAt: '2026-05-20T10:00:00Z',
    intro: "Le déficit foncier permet de déduire les travaux de rénovation de votre revenu global à hauteur de 10 750 €/an. Conditions, plafonds et calcul pour optimiser votre investissement locatif.",
    content: `<h2>Qu'est-ce que le déficit foncier ?</h2>
<p>Le <strong>déficit foncier</strong> est le mécanisme fiscal qui permet à un propriétaire bailleur en régime réel d'imputer les charges (notamment les travaux) dépassant les loyers perçus, non seulement sur les revenus fonciers futurs, mais aussi sur son <em>revenu global</em> (salaires, pensions…). C'est l'un des rares outils permettant de réduire l'impôt au-delà des revenus locatifs.</p>
<h2>Quels travaux sont déductibles ?</h2>
<ul>
<li><strong>Travaux déductibles</strong> : entretien, réparation et amélioration. Exemples : ravalement de façade, remplacement de chaudière, réfection toiture, mise aux normes électrique, isolation thermique.</li>
<li><strong>Travaux non déductibles</strong> : construction, reconstruction, agrandissement. Ils s'incorporent au prix d'acquisition pour le calcul de la plus-value à la revente.</li>
</ul>
<h2>Le plafond de 10 750 € sur le revenu global</h2>
<p>Fonctionnement de l'imputation :</p>
<ol>
<li>Les charges (travaux + intérêts d'emprunt + autres) sont déduites des loyers bruts.</li>
<li>Si déficit : la fraction due aux <strong>intérêts d'emprunt</strong> est reportée sur les revenus fonciers des 10 années suivantes uniquement.</li>
<li>La fraction due aux <strong>autres charges (travaux)</strong> est imputable sur le revenu global dans la limite de <strong>10 750 € par an</strong>. L'excédent est reportable sur les revenus fonciers des 10 années suivantes.</li>
</ol>
<h2>Exemple chiffré</h2>
<p>Loyers perçus : 8 000 €/an. Travaux : 20 000 €. Charges totales : 18 000 €. Déficit : <strong>10 000 €</strong>.</p>
<p>Imputation sur revenu global : 10 000 € (inférieur au plafond de 10 750 €). À 30 % de TMI, économie d'impôt : <strong>3 000 €</strong>.</p>
<h2>La condition de conservation du bien (3 ans)</h2>
<p>Pour bénéficier du déficit foncier sur le revenu global, le bien doit rester <strong>en location non meublée pendant au moins 3 ans</strong> suivant la dernière imputation. Vente ou passage en location meublée avant ce délai entraîne la réintégration du déficit imputé.</p>
<h2>Calculez votre déficit foncier</h2>
<p>Le simulateur de déficit foncier de simfinly.com calcule l'économie d'impôt selon vos loyers, charges, travaux et TMI. Il visualise l'impact annuel et le report sur les 10 prochaines années pour calibrer votre plan de rénovation.</p>`,
    faqs: [
      { q: "Quels travaux créent du déficit foncier en 2026 ?", a: "Sont déductibles en régime réel les dépenses de réparation et d\'entretien (ravalement, plomberie, électricité, toiture), les dépenses d\'amélioration des locaux d\'habitation (isolation, fenêtres double vitrage), et les charges de copropriété. Ne sont pas déductibles : les travaux d\'agrandissement, de construction ou de reconstruction, et le prix d\'achat du bien. La limite annuelle de déficit imputable sur le revenu global est de 10 700 € (doublée à 21 400 € pour les travaux de rénovation énergétique éligibles MaPrimeRénov\')." },
      { q: "Comment déclarer un déficit foncier dans sa déclaration de revenus ?", a: "Le déficit foncier se déclare en case 4BC (déficits fonciers imputables sur le revenu global, limité à 10 700 €/an) et 4BB (déficits reportables sur les revenus fonciers des 10 années suivantes). La fraction du déficit due aux intérêts d\'emprunt ne peut être imputée que sur les revenus fonciers (pas sur le revenu global). Attention : si vous vendez le bien dans les 3 ans suivant l\'imputation, le fisc peut remettre en cause la déduction." },
    ],
  },
  {
    slug: 'succession-enfants-abattement-droits-2026',
    title: 'Droits de succession enfants en 2026 : abattement 100 000 € et barème',
    category: 'Fiscalité',
    readTime: 6,
    publishedAt: '2026-05-27T10:00:00Z',
    intro: "En ligne directe, l'abattement est de 100 000 € par enfant tous les 15 ans. Au-delà, un barème progressif de 5 à 45 % s'applique. Calcul complet et stratégies pour réduire la facture fiscale.",
    content: `<h2>L'abattement de 100 000 € par enfant</h2>
<p>Chaque enfant héritant d'un parent bénéficie d'un <strong>abattement de 100 000 €</strong> sur sa part nette. Cet abattement est personnel et se recharge tous les 15 ans : une donation effectuée plus de 15 ans avant le décès ne vient pas réduire l'abattement disponible sur la succession.</p>
<h2>Le barème des droits en ligne directe</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px">
<thead><tr style="background:#EAF0FF"><th style="padding:8px;text-align:left;border:1px solid #d6e2fb">Part taxable après abattement</th><th style="padding:8px;text-align:center;border:1px solid #d6e2fb">Taux</th></tr></thead>
<tbody>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Jusqu'à 8 072 €</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">5 %</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">De 8 072 € à 12 109 €</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">10 %</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">De 12 109 € à 15 932 €</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">15 %</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">De 15 932 € à 552 324 €</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">20 %</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">De 552 324 € à 902 838 €</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">30 %</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">Au-delà de 902 838 €</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">40-45 %</td></tr>
</tbody></table>
<h2>Exemple : succession de 500 000 € avec deux enfants</h2>
<p>Part de chaque enfant : 250 000 €. Abattement : 100 000 €. Part taxable : <strong>150 000 €</strong>.</p>
<p>Droits sur 150 000 € : 5 % × 8 072 € + 10 % × 4 037 € + 15 % × 3 823 € + 20 % × 134 068 € = <strong>28 195 € par enfant</strong> (56 390 € au total).</p>
<h2>Le conjoint survivant : exonéré depuis 2007</h2>
<p>Le conjoint survivant est <strong>totalement exonéré</strong> de droits de succession depuis la loi TEPA de 2007, quelle que soit la valeur de l'héritage. Le partenaire pacsé bénéficie de la même exonération. Le concubin, en revanche, est taxé à 60 % (après abattement de 1 594 €).</p>
<h2>Les stratégies pour réduire les droits</h2>
<ul>
<li><strong>Donations régulières</strong> : utiliser l'abattement de 100 000 € tous les 15 ans + le don de sommes d'argent (31 865 €).</li>
<li><strong>Assurance-vie</strong> : abattement spécifique de 152 500 € par bénéficiaire pour les primes versées avant 70 ans.</li>
<li><strong>Démembrement de propriété</strong> : donner la nue-propriété tout en conservant l'usufruit. Au décès, la pleine propriété revient aux enfants sans droits supplémentaires.</li>
</ul>
<h2>Calculez les droits de succession</h2>
<p>Le simulateur de succession de simfinly.com calcule les droits selon l'actif net, le nombre d'enfants, les donations antérieures et le régime matrimonial. Il intègre l'abattement assurance-vie et compare plusieurs scénarios de transmission.</p>`,
    faqs: [
      { q: "Quel est l'abattement successoral pour les enfants en 2026 ?", a: "Chaque enfant bénéficie d\'un abattement de 100 000 € sur la part qu\'il recueille dans la succession de chacun de ses parents. Pour un enfant unique héritant de 300 000 €, les droits s\'appliquent sur 200 000 € (après abattement de 100 000 €) au barème progressif (5 % à 45 %). Les donations consenties par le défunt dans les 15 ans précédant le décès s\'imputent sur cet abattement." },
      { q: "Comment réduire les droits de succession pour ses enfants ?", a: "Plusieurs stratégies légales existent : (1) Donations régulières pour consommer l\'abattement de 100 000 € tous les 15 ans ; (2) Démembrement de propriété (donation nue-propriété, l\'usufruit s\'éteint gratuitement au décès) ; (3) Assurance-vie (versements avant 70 ans bénéficient d\'un abattement de 152 500 € par bénéficiaire, hors succession) ; (4) SCI familiale pour faciliter la transmission de l\'immobilier. Le simulateur succession de simfinly calcule les droits exacts selon la configuration familiale et le patrimoine." },
    ],
  },
  {
    slug: 'epargne-salariale-pee-perco-abondement-2026',
    title: 'Épargne salariale 2026 : PEE, PERcol et abondement — mode d\'emploi',
    category: 'Épargne',
    readTime: 6,
    publishedAt: '2026-06-17T10:00:00Z',
    intro: "Intéressement, participation, PEE et PERcol : l'épargne salariale permet d'investir avec des exonérations fiscales et l'abondement de l'employeur. Mode d'emploi complet 2026.",
    content: `<h2>Les quatre piliers de l'épargne salariale</h2>
<ul>
<li><strong>Intéressement</strong> : prime liée aux résultats de l'entreprise, exonérée d'impôt si investie en PEE ou PERcol.</li>
<li><strong>Participation</strong> : redistribution obligatoire d'une fraction des bénéfices pour les entreprises de 50+ salariés. Exonérée d'IR si bloquée 5 ans.</li>
<li><strong>PEE</strong> (Plan d'Épargne Entreprise) : enveloppe d'investissement sur 5 ans minimum, exonérée d'IR à la sortie.</li>
<li><strong>PERcol / PERECO</strong> (Plan d'Épargne Retraite Collectif) : successeur du PERCO, dédié à la retraite.</li>
</ul>
<h2>L'abondement : l'argent gratuit de l'employeur</h2>
<p>L'<strong>abondement</strong> est la contribution de l'employeur qui complète votre versement volontaire dans le PEE ou PERcol :</p>
<ul>
<li>Jusqu'à <strong>300 % de votre versement volontaire</strong>.</li>
<li>Plafonné à 8 % du PASS/an pour le PEE (<strong>3 768 €</strong> en 2026) et 16 % du PASS pour le PERcol (<strong>7 536 €</strong>).</li>
<li>L'abondement est <strong>exonéré de charges sociales et d'impôt sur le revenu</strong> : c'est du salaire défiscalisé.</li>
</ul>
<p>Exemple : si votre employeur abonde à 100 % jusqu'à 1 500 €, verser 1 500 € sur le PEE vous rapporte 3 000 € investis pour 1 500 € déboursés — avant tout rendement.</p>
<h2>PEE vs PERcol : les différences clés</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px">
<thead><tr style="background:#dcfce7"><th style="padding:8px;text-align:left;border:1px solid #bbf7d0">Critère</th><th style="padding:8px;text-align:center;border:1px solid #bbf7d0">PEE</th><th style="padding:8px;text-align:center;border:1px solid #bbf7d0">PERcol</th></tr></thead>
<tbody>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Blocage</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">5 ans</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">Jusqu'à la retraite</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">Fiscalité sortie</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">Exonéré d'IR (PS dus)</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">IR sur capital (si déductible)</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Déblocage anticipé</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">8 cas légaux</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">Achat résidence principale</td></tr>
</tbody></table>
<h2>Les 8 cas de déblocage anticipé du PEE</h2>
<p>Mariage/PACS, naissance du 3e enfant, divorce avec garde, invalidité, décès, création d'entreprise, acquisition de la résidence principale, rupture du contrat de travail.</p>
<h2>Projeter son épargne salariale</h2>
<p>Le simulateur d'épargne salariale de simfinly.com calcule la valeur de votre PEE ou PERcol selon vos versements, l'abondement et un rendement estimé. Comparez la performance nette avec un livret A ou une assurance-vie.</p>`,
  faqs: [
    { q: "Que vaut le PEE (Plan d'Épargne Entreprise) en 2026 ?", a: "Le PEE est un placement collectif bloqué 5 ans (sauf déblocage exceptionnel) sur lequel l'entreprise verse un abondement (jusqu'à 3 fois les versements volontaires, dans la limite de 8 % du PASS = 3 768 € en 2026). Les investissements sont exonérés d'IR à la sortie (mais soumis aux prélèvements sociaux 17,2 %)." },
    { q: "Quand peut-on débloquer son PEE de manière anticipée ?", a: "Les cas de déblocage anticipé du PEE (sans attendre 5 ans) incluent : mariage/PACS, naissance/adoption du 3e enfant, divorce/séparation, invalidité, décès, rupture du contrat de travail (licenciement, démission), création d'entreprise, achat de la résidence principale. Ces cas permettent de récupérer les sommes sans pénalité fiscale." },
    { q: "Quelle différence entre PERCO et PER collectif (PERECO) en 2026 ?", a: "Depuis 2019, les PERCO ont été transformés en PER collectifs (PERECO). Le principe reste similaire : épargne retraite collective avec abondement entreprise. La principale différence est que le PER collectif permet une sortie en capital à la retraite (contrairement au PERCO qui imposait une sortie en rente par défaut). Les versements volontaires dans un PERECO sont déductibles du revenu imposable." },
    { q: "L'abondement de l'entreprise est-il toujours exonéré de charges ?", a: "L'abondement versé par l'entreprise est exonéré de charges sociales dans la limite de 8 % du PASS (3 768 € en 2026) pour le PEE, et de 16 % du PASS pour le PERECO. Il est toutefois soumis à la CSG/CRDS (9,7 %). Pour le salarié, l'abondement reçu est exonéré d'impôt sur le revenu, c'est donc un avantage net très significatif." },
  ],
  },
  // === Vague 3 — Articles prioritaires (commit 4A) ===
  {
    slug: 'investir-bourse-debutant-2026',
    title: 'Investir en Bourse pour débutant en 2026 : par où commencer ?',
    category: 'Finances',
    readTime: 8,
    publishedAt: '2026-06-01T09:00:00Z',
    intro: "Actions, ETF, PEA ou compte-titres : comment investir ses premiers euros en Bourse sans se perdre ni prendre de risques inconsidérés. Le guide structuré pour débutants en 2026.",
    content: `<h2>Pourquoi investir en Bourse plutôt que sur un livret ?</h2>
<p>Le Livret A à 2,4 % (2026) offre un rendement garanti mais souvent inférieur à l'inflation sur le long terme. La Bourse, en revanche, a historiquement rapporté 7-10 % par an en moyenne sur 20 ans (indice MSCI World) — mais avec de la volatilité. La règle de base : n'investissez en Bourse que les fonds dont vous n'aurez pas besoin avant <strong>5 à 10 ans minimum</strong>.</p>
<p>L'inflation érode le capital liquide : 10 000 € sur livret à 2,4 % pendant 10 ans donnent ~12 700 €, mais avec une inflation à 2 %, votre pouvoir d'achat réel n'augmente presque pas. À l'inverse, 10 000 € investis à 7 % annuel donnent ~19 700 € réels.</p>
<h2>ETF ou actions individuelles ? Le choix du débutant</h2>
<p>Les <strong>ETF indiciels</strong> (trackers) répliquent un indice boursier (CAC 40, MSCI World, S&P 500). Leurs avantages pour un débutant sont décisifs :</p>
<ul>
<li><strong>Diversification instantanée</strong> : un seul ETF MSCI World expose à 1 500 entreprises dans 23 pays.</li>
<li><strong>Frais ultra-faibles</strong> : 0,07-0,30 %/an vs 1-2 % pour les OPCVM actifs.</li>
<li><strong>Performance</strong> : 80-90 % des fonds actifs font moins bien que leur indice de référence sur 10 ans.</li>
</ul>
<p>Les actions individuelles nécessitent une analyse approfondie de l'entreprise (fondamentaux, secteur, concurrence). Réservez-les à une petite fraction de votre portefeuille (<10 %) si vous souhaitez vous exercer.</p>
<h2>PEA ou compte-titres ordinaire ?</h2>
<p>Le <strong>PEA</strong> (Plan d'Épargne en Actions) est l'enveloppe fiscale à privilégier pour investir en actions européennes :</p>
<ul>
<li>Exonération d'IR sur les plus-values et dividendes après 5 ans (seuls les prélèvements sociaux de 17,2 % restent dus).</li>
<li>Plafond de versements : 150 000 €.</li>
<li>Éligible à la plupart des ETF sur indices européens et mondiaux.</li>
</ul>
<p>Le <strong>compte-titres ordinaire</strong> (CTO) n'a pas de plafond et permet d'investir sur tous les marchés mondiaux, mais les gains sont soumis à la flat tax de 30 % (ou barème IR si plus avantageux). Utilisez-le en complément du PEA pour les ETF non éligibles PEA (S&P 500 USD, marchés émergents...).</p>
<h2>La méthode DCA pour débuter sereinement</h2>
<p>Le Dollar Cost Averaging (DCA) consiste à investir un montant fixe régulièrement (ex : 200 €/mois), quel que soit le niveau du marché. Cette stratégie élimine le risque de "point d'entrée" : vous achetez plus d'actions quand les marchés baissent, moins quand ils montent. Sur 10-20 ans, le DCA bat statistiquement l'investissement en une seule fois (lump sum) dans les scénarios défavorables.</p>
<p>Commencez avec le simulateur d'épargne de simfinly.com pour projeter la valeur de votre portefeuille selon différents rendements et horizons.</p>`,
    faqs: [
      { q: "Par quoi commencer pour investir en bourse en 2026 ?", a: "La meilleure approche pour un débutant : (1) Ouvrir un PEA (Plan d\'Épargne en Actions) dans une banque en ligne (Boursorama, Fortuneo, Saxo Bank) — plafond 150 000 €, défiscalisé après 5 ans ; (2) Investir dans un ETF MSCI World (ex : Amundi MSCI World UCITS ETF) qui réplique 1 600 entreprises mondiales à ~0,20 % de frais annuels ; (3) Commencer avec un montant mensuel régulier (DCA : Dollar Cost Averaging) de 100-500 € ; (4) Ne pas vendre lors des baisses — rester investi sur 10+ ans." },
      { q: "Quel est le meilleur support pour débuter en bourse en France ?", a: "Le PEA est le meilleur cadre pour les débutants français : exonération d\'impôt sur les plus-values après 5 ans (seuls les prélèvements sociaux à 17,2 % restent), plafond de 150 000 €, et uniquement des actions européennes et ETF éligibles. L\'assurance-vie en unités de compte offre plus de flexibilité (pas de limite géographique) avec une fiscalité avantageuse après 8 ans. Le compte-titres ordinaire est adapté si vous souhaitez dépasser le plafond PEA ou investir dans des actifs non éligibles." },
    ],
  },
  {
    slug: 'choisir-assurance-vie-2026',
    title: 'Choisir la meilleure assurance-vie en 2026 : critères, frais et stratégie',
    category: 'Épargne',
    readTime: 7,
    publishedAt: '2026-06-02T09:00:00Z',
    intro: "Fonds euros, unités de compte, frais sur versements, gestion pilotée : comment sélectionner un contrat d'assurance-vie adapté à vos objectifs en 2026.",
    content: `<h2>Fonds euros ou unités de compte ?</h2>
<p>Tout contrat d'assurance-vie propose deux types de supports :</p>
<ul>
<li><strong>Fonds euros</strong> : capital garanti, rendement autour de 2,5-3,5 % en 2025 selon les assureurs. Idéal pour l'épargne de précaution et la stabilité.</li>
<li><strong>Unités de compte (UC)</strong> : supports investis sur les marchés (ETF, SCPI, obligations). Capital non garanti mais potentiel de rendement supérieur (5-8 % sur 10 ans pour un profil diversifié).</li>
</ul>
<p>La règle pratique : plus l'horizon est long (10+ ans), plus la part UC peut être élevée. À moins de 5 ans d'un objectif, privilégiez les fonds euros.</p>
<h2>Les frais à comparer en priorité</h2>
<p>Les frais impactent directement votre rendement final. Les points à vérifier :</p>
<ul>
<li><strong>Frais sur versements</strong> : 0 % sur les contrats en ligne, jusqu'à 3-4 % sur les contrats bancaires traditionnels. Sur 100 000 € versés, 3 % de frais = 3 000 € perdus immédiatement.</li>
<li><strong>Frais de gestion annuels</strong> : 0,5-0,9 % sur fonds euros, 0,6-1 % sur UC. La différence de 0,5 % par an représente des milliers d'euros sur 20 ans.</li>
<li><strong>Frais d'arbitrage</strong> : gratuits sur les meilleurs contrats en ligne.</li>
</ul>
<h2>Gestion libre ou gestion pilotée ?</h2>
<p>En <strong>gestion libre</strong>, vous choisissez vous-même la répartition entre fonds euros et UC. Nécessite un minimum d'implication. En <strong>gestion pilotée</strong> (ou sous mandat), le gestionnaire adapte automatiquement l'allocation selon un profil (prudent, équilibré, dynamique). Plus simple mais avec des frais supplémentaires (0,2-0,5 %/an).</p>
<p>Pour les débutants ou les personnes peu disponibles, la gestion pilotée est recommandée — à condition que les frais totaux restent raisonnables (moins de 1,5 % par an tout compris).</p>
<h2>La fiscalité après 8 ans</h2>
<p>Après 8 ans de détention, les retraits bénéficient d'un <strong>abattement annuel de 4 600 € (célibataire) ou 9 200 € (couple)</strong> sur les gains. Au-delà, les gains sont taxés à 7,5 % d'IR + 17,2 % de prélèvements sociaux (contre 30 % avant 8 ans). L'assurance-vie est aussi un outil de transmission : chaque bénéficiaire désigné reçoit jusqu'à 152 500 € en franchise de droits de succession.</p>`,
    faqs: [
      { q: "Comment choisir une assurance-vie en 2026 ?", a: "Les 4 critères clés : (1) Rendement du fonds euros — optez pour un assureur dont le fonds euros a rapporté > 2,5 % en 2025 (Garance, Spirica, Apicil sont parmi les meilleurs) ; (2) Frais — préférez une assurance-vie sans frais d'entrée, avec des frais de gestion sur UC < 0,85 %/an ; (3) Diversité des UC — accès aux ETF actions monde, aux SCPI, aux fonds thématiques ; (4) Gestion pilotée vs libre — si vous débutez, la gestion pilotée allocue automatiquement selon votre profil de risque." },
      { q: "Faut-il déclarer son assurance-vie au fisc chaque année ?", a: "Non, les plus-values et revenus générés dans une assurance-vie ne sont pas imposables tant que vous ne faites pas de rachat (retrait). Vous déclarez uniquement la fraction imposable lors des retraits. Depuis 2018, les gains sur versements post-27/09/2017 sont imposés au PFU (30 %) si le rachat a lieu dans les 8 ans, ou à 17,5 % au-delà (7,5 % IR + 9,7 % PS sur la fraction > 150 000 €). Vous déclarez le montant des contrats dépassant 7 500 € aux services fiscaux lors de votre déclaration annuelle." },
    ],
  },
  {
    slug: 'dpe-renovation-travaux-2026',
    title: 'DPE, rénovation et travaux en 2026 : aides MaPrimeRénov et impact sur la valeur',
    category: 'Immobilier',
    readTime: 7,
    publishedAt: '2026-06-03T09:00:00Z',
    intro: "Logement classé F ou G, rénovation énergétique, MaPrimeRénov 2026 : comment financer vos travaux et améliorer votre DPE pour vendre, louer ou économiser sur vos factures.",
    content: `<h2>Qu'est-ce que le DPE et pourquoi il est crucial en 2026 ?</h2>
<p>Le Diagnostic de Performance Énergétique (DPE) classe les logements de A (très performant) à G (passoire thermique) selon la consommation d'énergie et les émissions de CO₂. En 2026, les conséquences d'un mauvais DPE sont concrètes :</p>
<ul>
<li>Les logements classés <strong>G sont interdits à la location</strong> depuis 2025 (décret tertiaire).</li>
<li>Les logements <strong>F sont interdits à la location pour les nouveaux baux</strong> depuis 2028.</li>
<li>Un DPE dégradé peut réduire la valeur de revente de <strong>10-20 %</strong> selon les études SeLoger et Les Notaires de France.</li>
</ul>
<h2>MaPrimeRénov 2026 : les montants disponibles</h2>
<p>MaPrimeRénov est la principale aide de l'État pour la rénovation énergétique. En 2026, elle s'articule en deux volets :</p>
<ul>
<li><strong>MaPrimeRénov Efficacité</strong> : pour les gestes d'isolation (murs, toiture, fenêtres) ou le changement de chauffage. Montant : 40-70 % des dépenses selon les revenus, plafonnée par geste.</li>
<li><strong>MaPrimeRénov Décarbonation</strong> : pour le remplacement d'une chaudière gaz/fioul par une pompe à chaleur ou un poêle à granulés. Aide jusqu'à 10 000 € pour les ménages modestes.</li>
</ul>
<p>L'éco-PTZ (Prêt à Taux Zéro) pour la rénovation peut compléter jusqu'à 50 000 € sans intérêts, remboursable sur 20 ans.</p>
<h2>Quel retour sur investissement pour la rénovation ?</h2>
<p>Isoler ses combles (coût : 2 000-6 000 €) permet d'économiser en moyenne 15-20 % sur la facture de chauffage annuelle. Pour une maison à 2 500 €/an de chauffage, l'économie est de 375-500 €/an. Le retour sur investissement (sans aide) est de 4-16 ans. Avec les aides (30-70 %), le ROI tombe à 2-5 ans pour les foyers modestes.</p>
<p>Pour les propriétaires bailleurs, rénover un F ou G en D ou E permet de relever les loyers de 3-8 % et d'éviter l'interdiction de location. L'investissement se rentabilise via les loyers supplémentaires et l'évitement des pénalités.</p>
<h2>Comment simuler le bénéfice d'une rénovation ?</h2>
<p>Commencez par un audit énergétique (obligatoire pour les passoires thermiques vendues) qui chiffre précisément les gains possibles par type de travaux. Les simulateurs France Rénov' et de simfinly.com permettent d'estimer l'aide disponible selon vos revenus, le type de logement et les travaux envisagés.</p>`,
  faqs: [
    { q: "Quelle aide pour rénover un logement classé F ou G en 2026 ?", a: "Pour les passoires thermiques (étiquettes F/G), MaPrimeRénov' 2026 finance jusqu'à 70 % des travaux de rénovation globale (ménages très modestes). Le reste à charge peut être couvert par l'éco-PTZ (jusqu'à 50 000 €, sans intérêts). Les CEE (Certificats d'Économies d'Énergie) apportent un bonus supplémentaire selon les travaux." },
    { q: "La vente d'une passoire thermique est-elle interdite en 2026 ?", a: "Non, la vente de logements F/G n'est pas interdite en 2026. En revanche, leur location à de nouveaux locataires est progressivement encadrée : les G les plus énergivores (G+) ne peuvent plus être mis en location depuis 2025. L'interdiction s'étend aux G en 2025 et aux F à partir de 2028." },
    { q: "Combien coûte un DPE en 2026 ?", a: "Un DPE (Diagnostic de Performance Énergétique) réalisé par un diagnostiqueur certifié coûte entre 100 et 250 € selon la taille du bien et la région. Il est obligatoire pour toute vente ou location depuis 2006, et sa validité est de 10 ans (sauf si des travaux importants ont été réalisés depuis). Les DPE réalisés avant 2021 sont caducs depuis le 1er janvier 2025." },
    { q: "Quels travaux permettent de passer d'étiquette G à D ou C ?", a: "Les travaux les plus efficaces pour améliorer l'étiquette DPE : isolation des combles (gain de 1-2 lettres), isolation des murs (gain de 1-2 lettres), remplacement de la chaudière fioul par une pompe à chaleur (gain de 1-3 lettres), et remplacement des fenêtres simples vitrage (gain partiel). Un audit énergétique préalable (obligatoire pour F/G) identifie les priorités." },
  ],
  },
  {
    slug: 'retraite-medecin-liberal-carmf-2026',
    title: 'Retraite du médecin libéral en 2026 : CARMF, ASV et calcul de la pension',
    category: 'Retraite',
    readTime: 8,
    publishedAt: '2026-06-04T09:00:00Z',
    intro: "La retraite du médecin libéral repose sur 3 régimes : CARMF (régime de base + complémentaire) et l'Allocation Supplémentaire de Vieillesse (ASV). Comment calculer sa pension et optimiser son départ ?",
    content: `<h2>Les trois piliers de la retraite médicale libérale</h2>
<p>Un médecin libéral conventionné cotise à <strong>trois régimes distincts</strong> gérés par la CARMF (Caisse Autonome de Retraite des Médecins de France) :</p>
<ul>
<li><strong>Régime de base</strong> : pension proportionnelle aux revenus, plafonnée et à points. Cotisation annuelle en 2026 : environ 5 000-8 500 € selon le revenu.</li>
<li><strong>Régime complémentaire</strong> : à points. Cotisation liée aux revenus non commerciaux (BNC).</li>
<li><strong>ASV</strong> (Allocation Supplémentaire de Vieillesse) : financée à 2/3 par la CPAM (Assurance Maladie) et 1/3 par le médecin. Exclusive aux médecins conventionnés de secteur 1 et 2. Cotisation fixe annuelle (~5 000 €/an en 2026).</li>
</ul>
<h2>L'ASV : le régime spécifique aux médecins conventionnés</h2>
<p>L'ASV est un avantage majeur de la convention médicale. La <strong>CPAM finance 2/3 de la cotisation</strong> : pour 1 € cotisé par le médecin, l'Assurance Maladie en verse 2. Ce mécanisme accélère l'accumulation des droits. La pension ASV à taux plein peut atteindre <strong>30 000-40 000 € brut annuels</strong> pour une carrière complète en secteur 1.</p>
<p>Le secteur 2 bénéficie d'une ASV, mais avec une cotisation personnelle plus élevée et des droits légèrement réduits. Le secteur 3 (non conventionné) ne cotise pas à l'ASV.</p>
<h2>Âge de départ et durée de cotisation</h2>
<p>Les médecins libéraux relèvent du régime des professions libérales — l'âge légal est identique au régime général : <strong>64 ans</strong> pour les générations nées à partir de 1968. La durée requise pour le taux plein varie selon la génération (168-172 trimestres).</p>
<p>Particularité : un médecin peut continuer à exercer et cotiser au-delà de 64 ans et bénéficier d'une <em>surcote</em> sur les régimes CARMF. Il est aussi possible de liquidier l'ASV à partir de 62 ans tout en continuant à exercer (cumul emploi-retraite libéral).</p>
<h2>Estimer sa pension CARMF et ASV</h2>
<p>La pension totale d'un médecin libéral à taux plein est typiquement de <strong>4 000-7 000 €/mois brut</strong> selon le niveau de revenus et la durée de carrière. Le simulateur retraite médecin libéral de simfinly.com projette vos droits CARMF et ASV selon votre spécialité, secteur et revenus annuels BNC.</p>`,
  faqs: [
    { q: "Comment fonctionne la retraite des médecins libéraux via la CARMF ?", a: "La CARMF (Caisse Autonome de Retraite des Médecins de France) gère trois régimes : (1) le régime de base aligné sur le régime général (CNAV), (2) le régime complémentaire ASV (Allocation Supplémentaire de Vieillesse, spécifique aux conventionnés), et (3) le régime de prévoyance. Les cotisations sont calculées sur les revenus nets BNC." },
    { q: "Quel est l'âge de retraite d'un médecin libéral en 2026 ?", a: "Un médecin libéral peut partir à la retraite à 64 ans (âge légal post-réforme 2023). Pour une pension à taux plein CARMF, il faut 172 trimestres (génération 1968). Les médecins peuvent continuer à exercer au-delà de 70 ans (pas de limite d'âge en libéral) et cumuler pension et revenus." },
    { q: "Qu'est-ce que l'ASV (Allocation Supplémentaire de Vieillesse) pour les médecins ?", a: "L'ASV est une retraite complémentaire spécifique aux médecins conventionnés secteurs 1 et 2. Elle est financée à 2/3 par l'Assurance Maladie et 1/3 par le médecin. Les cotisations ASV ouvrent des droits à points. Un médecin généraliste avec une carrière complète reçoit environ 800-1 200 €/mois d'ASV en plus de la retraite de base." },
    { q: "Comment optimiser sa retraite de médecin libéral ?", a: "Les stratégies principales : ouvrir un PER Madelin le plus tôt possible (déductible des BNC, jusqu'à 85 % du PASS soit ~40 000 €/an), maximiser les versements volontaires CARMF, envisager une SELARL pour lisser les revenus et cotiser plus efficacement, et planifier la cession de patientèle (valorisée 30-80 k€) comme complément de capital." },
  ],
  },
  {
    slug: 'retraite-artisan-commercant-ssi-2026',
    title: 'Retraite artisan et commerçant (SSI) en 2026 : calcul, taux et pension nette',
    category: 'Retraite',
    readTime: 7,
    publishedAt: '2026-06-05T09:00:00Z',
    intro: "Artisans et commerçants cotisent à la SSI (ex-RSI) pour leur retraite de base et complémentaire. Comment calculer sa pension, optimiser ses revenus et préparer sa sortie d'activité ?",
    content: `<h2>Le régime SSI pour les artisans et commerçants</h2>
<p>Depuis 2018, le Régime Social des Indépendants (RSI) a été intégré à la <strong>SSI</strong> (Sécurité Sociale des Indépendants), gérée par les organismes du régime général (CPAM, Urssaf). Artisans et commerçants cotisent sur leur revenu professionnel pour deux piliers :</p>
<ul>
<li><strong>Retraite de base</strong> : fonctionne comme le régime général CNAV, avec la même formule SAM × taux × prorata. Les cotisations sont calculées sur le bénéfice net (BIC).</li>
<li><strong>Retraite complémentaire obligatoire (RCI)</strong> : à points, spécifique aux artisans et commerçants. Taux de cotisation : environ 7 % du revenu professionnel au-delà du PASS.</li>
</ul>
<h2>Les particularités du calcul de la retraite SSI</h2>
<p>Le principal enjeu pour un artisan/commerçant est de <strong>valider ses trimestres</strong> : un trimestre est validé pour chaque tranche de revenus égale à 150 SMIC horaires (environ 1 690 € brut en 2026). Avec un revenu annuel de 6 760 €, vous validez 4 trimestres — le minimum pour une année pleine.</p>
<p>Les années avec des revenus très faibles (début d'activité, difficultés) peuvent ne valider que 1 ou 2 trimestres, ce qui impacte le prorata de la pension finale. Le SAM est calculé sur les 25 meilleures années de revenus, comme au régime général.</p>
<h2>Taux de remplacement : un défi pour les indépendants</h2>
<p>Le taux de remplacement (ratio pension/dernier revenu) est souvent plus faible pour les artisans et commerçants que pour les salariés. Raison principale : les revenus déclarés (bénéfice net) sont parfois inférieurs au chiffre d'affaires réel, car les charges professionnelles sont déduites. La pension de retraite est calculée sur ces revenus nets.</p>
<p>Pour compenser, les indépendants ont accès à une épargne retraite déductible plus généreuse via le <strong>PER TNS</strong> : jusqu'à 85 780 € de versements déductibles par an (10 % du bénéfice imposable + 15 % de la fraction entre 1 et 8 PASS).</p>
<h2>Préparer sa sortie d'activité</h2>
<p>Un artisan/commerçant peut opter pour la <strong>retraite progressive</strong> s'il réduit son activité, ou céder son entreprise (exonérations de plus-values sous conditions). La cession du fonds de commerce peut générer une plus-value partiellement défiscalisée qui complète la retraite. Le simulateur retraite artisan de simfinly.com projette votre pension SSI selon vos revenus annuels BIC et votre âge de départ.</p>`,
  faqs: [
    { q: "Comment fonctionne le SSI (ex-RSI) pour la retraite des artisans et commerçants ?", a: "Le SSI (Sécurité Sociale des Indépendants), intégré au régime général depuis 2020, gère les cotisations retraite des artisans et commerçants. Ils cotisent au régime de base (CNAV, comme les salariés) et au régime complémentaire SSI (RCI). Les taux de cotisation sont calculés sur le revenu professionnel net." },
    { q: "Quel est le montant de la retraite d'un artisan ou commerçant ?", a: "Un artisan/commerçant avec 40 ans de carrière et un revenu moyen de 30 000 €/an reçoit environ 1 200-1 600 €/mois de pension totale (base CNAV + complémentaire RCI). Le taux de remplacement est d'environ 50-60 %, moins élevé que les salariés en raison de revenus déclarés souvent plus faibles." },
    { q: "Un artisan à la retraite peut-il continuer à exercer ?", a: "Oui, le cumul emploi-retraite est possible pour les artisans. Depuis 2023, il est plus avantageux : les cotisations versées après la liquidation ouvrent de nouveaux droits à retraite. L'artisan peut exercer à titre accessoire et percevoir sa pension complète dès lors que sa pension est liquidée à taux plein." },
    { q: "Quelle est la différence de retraite entre artisan et auto-entrepreneur ?", a: "Un auto-entrepreneur cotise un pourcentage forfaitaire de son CA (12,3 % pour les activités de vente, 22 % pour les services). Ces cotisations sont souvent insuffisantes pour des droits retraite significatifs. Un artisan en régime réel BIC cotise sur ses bénéfices réels et peut déduire ses charges, générant généralement de meilleurs droits retraite à revenus équivalents." },
  ],
  },
  {
    slug: 'comprendre-cotisations-sociales-2026',
    title: 'Comprendre les cotisations sociales en 2026 : qui paye quoi et pourquoi',
    category: 'Budget',
    readTime: 6,
    publishedAt: '2026-06-06T09:00:00Z',
    intro: "Entre les cotisations salariales, patronales et les prélèvements sociaux, le bulletin de paie est souvent illisible. Le guide complet pour comprendre ce que vous cotisez et ce que ça vous ouvre comme droits.",
    content: `<h2>Cotisations salariales vs cotisations patronales</h2>
<p>En France, les charges sociales sont divisées en deux parts :</p>
<ul>
<li><strong>Cotisations salariales</strong> (prélevées sur votre salaire brut) : environ 22-23 % du salaire brut. Elles financent la maladie, la vieillesse (CNAV + complémentaire), le chômage et la prévoyance. Ce sont elles qui apparaissent comme retenues sur votre bulletin de paie.</li>
<li><strong>Cotisations patronales</strong> (payées par l'employeur en plus du brut) : environ 42-45 % du salaire brut. Elles financent les mêmes risques + les accidents du travail, la formation professionnelle, la taxe d'apprentissage. L'employeur les verse directement à l'Urssaf.</li>
</ul>
<p>Concrètement : pour un salarié coûtant 3 000 € brut à l'employeur (coût total ~4 300 €), le net avant impôt est ~2 300 €, et le net après prélèvement à la source ~1 900-2 100 €.</p>
<h2>Les prélèvements sociaux : CSG et CRDS</h2>
<p>La CSG (Contribution Sociale Généralisée, 9,2 %) et la CRDS (Contribution au Remboursement de la Dette Sociale, 0,5 %) sont prélevées sur une assiette large incluant les revenus du capital (dividendes, intérêts, plus-values) à 17,2 %. Contrairement aux cotisations sociales, elles n'ouvrent pas de droits spécifiques — elles financent la protection sociale de façon globale.</p>
<h2>Ce que vos cotisations financent</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px">
<thead><tr style="background:#EAF0FF"><th style="padding:8px;text-align:left;border:1px solid #d6e2fb">Cotisation</th><th style="padding:8px;text-align:left;border:1px solid #d6e2fb">Droits ouverts</th></tr></thead>
<tbody>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Maladie/maternité</td><td style="padding:8px;border:1px solid #e5e7eb">Remboursements CPAM, indemnités journalières</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">Vieillesse CNAV</td><td style="padding:8px;border:1px solid #e5e7eb">Trimestres et pension de base</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Agirc-Arrco</td><td style="padding:8px;border:1px solid #e5e7eb">Points de retraite complémentaire</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">Chômage (Assédic)</td><td style="padding:8px;border:1px solid #e5e7eb">Allocation chômage en cas de perte d'emploi</td></tr>
</tbody></table>
<h2>Simuler son revenu net</h2>
<p>Pour calculer votre salaire net à partir d'un brut, ou votre coût total employeur, le simulateur de simfinly.com intègre les taux 2026 selon le statut (cadre ou non-cadre) et prend en compte les allègements de cotisations patronales sur les bas salaires (allègement Fillon).</p>`,
  faqs: [
    { q: "Quelle est la différence entre cotisations salariales et patronales ?", a: "Les cotisations salariales sont prélevées sur le salaire brut du salarié (environ 22-25 % pour un cadre) et réduisent son salaire net. Les cotisations patronales sont à la charge de l'employeur (environ 42-45 % du salaire brut) et s'ajoutent au coût total du travail. Le total représente environ 65-70 % du salaire net pour le coût employeur." },
    { q: "À quoi servent les cotisations sociales en France ?", a: "Les cotisations sociales financent : la retraite (CNAV, Agirc-Arrco), la maladie (remboursements soins, indemnités journalières), la famille (allocations familiales, congé parental), le chômage (ARE, allocation de retour à l'emploi), et la dépendance (CASA). En France, le système est contributif : plus on cotise, plus on a de droits." },
    { q: "Combien coûtent les cotisations sociales d'un TNS (travailleur non-salarié) ?", a: "Un TNS (artisan, commerçant, profession libérale) cotise environ 45 % de son revenu net professionnel (contre 65-70 % du salaire net pour un salarié+employeur). Les TNS bénéficient de taux légèrement plus bas mais ont des prestations moins élevées (pas de chômage, prévoyance plus faible). L'auto-entrepreneur cotise moins mais reçoit aussi moins de droits." },
    { q: "Peut-on réduire ses cotisations sociales légalement ?", a: "Oui, plusieurs dispositifs légaux permettent de réduire la base de cotisation : en SELARL ou SAS pour les professions libérales (optimisation de la rémunération vs dividendes), le régime micro-entrepreneur (forfait fixe), les exonérations pour les créateurs d'entreprise (ACRE les premières années). Ces stratégies doivent être validées par un expert-comptable." },
  ],
  },
  {
    slug: 'retraite-cadre-agirc-arrco-calcul',
    title: 'Retraite du cadre en 2026 : calcul CNAV + Agirc-Arrco et coefficient de solidarité',
    category: 'Retraite',
    readTime: 7,
    publishedAt: '2026-06-07T09:00:00Z',
    intro: "Les cadres cotisent à la fois au régime général CNAV et à l'Agirc-Arrco. Comment calculer sa pension complète, optimiser le timing du départ et éviter le coefficient de solidarité de -10 % ?",
    content: `<h2>La structure de la retraite cadre : deux régimes superposés</h2>
<p>Un cadre salarié accumule des droits dans deux régimes :</p>
<ul>
<li><strong>CNAV (régime général)</strong> : pension de base calculée sur le SAM (25 meilleures années, plafonnées au PASS) × taux × prorata. Maximum : 50 % du PASS, soit ~1 963 €/mois brut en 2026.</li>
<li><strong>Agirc-Arrco (complémentaire)</strong> : points accumulés tout au long de la carrière. Valeur du point : 1,4159 € en 2026. Un cadre avec un salaire de 60 000 €/an pendant 30 ans peut accumuler 30 000-50 000 points, soit ~3 500-5 800 €/mois de pension complémentaire.</li>
</ul>
<p>La pension totale cadre typique est de <strong>2 500-5 000 €/mois brut</strong> selon la carrière et le niveau de salaire.</p>
<h2>Le coefficient de solidarité Agirc-Arrco : le piège à éviter</h2>
<p>Si vous liquidez votre retraite exactement à l'âge du taux plein CNAV, Agirc-Arrco applique un <strong>coefficient de solidarité de −10 %</strong> pendant 3 ans sur la pension complémentaire. Pour une pension complémentaire de 3 000 €/mois, cela représente une perte de 300 €/mois × 36 mois = <strong>10 800 € perdus</strong>.</p>
<p>Solutions pour l'éviter :</p>
<ul>
<li><strong>Retarder d'un an</strong> : partir un an après le taux plein efface la pénalité et déclenche un bonus de +10 % pendant un an.</li>
<li><strong>Retraite progressive</strong> : réduire progressivement son activité dès 60 ans tout en accumulant des points Agirc-Arrco.</li>
</ul>
<h2>Optimiser le timing de départ</h2>
<p>Pour un cadre né en 1965 (taux plein à 63 ans 3 mois, 170 trimestres requis), le scénario optimal est souvent de partir à <strong>64 ans 3 mois</strong> : un an de décalage efface le coefficient de solidarité et génère une surcote CNAV de 5 %. Sur une espérance de vie de 20 ans après la retraite, ce délai d'un an peut valoir 50 000-80 000 € de pensions supplémentaires.</p>
<p>Le simulateur cadre de simfinly.com calcule la pension totale CNAV + Agirc-Arrco et compare les scénarios de départ entre 62 et 67 ans pour votre génération et votre niveau de salaire.</p>`,
    faqs: [
      { q: "Comment est calculée la retraite Agirc-Arrco pour un cadre ?", a: "La retraite Agirc-Arrco est calculée en points : chaque année, vos cotisations (tranche A : 0-PASS, tranche B : 1×PASS à 8×PASS, ancienne tranche C : >8×PASS) achètent des points au prix d\'acquisition (19,763 € en 2026 pour la tranche A). À la retraite, votre total de points est multiplié par la valeur du point (1,4107 € en 2026). Un cadre ayant accumulé 3 000 points touchera 3 000 × 1,4107 = 4 232 €/mois de complémentaire." },
      { q: "Qu'est-ce que le coefficient de solidarité Agirc-Arrco ?", a: "Le coefficient de solidarité est une réduction temporaire de 10 % sur la pension Agirc-Arrco pendant 3 ans, pour les assurés qui partent dès l\'âge légal en ayant leurs trimestres. Il peut être évité en travaillant 1 à 4 trimestres de plus selon le profil. En contrepartie, travailler après l\'âge légal permet d\'obtenir un bonus de fidélité de +10 % (1 trimestre de plus), +20 % (2 trimestres) ou +30 % (3 trimestres et plus). La décision de partir ou non affecte donc la pension Agirc-Arrco de manière significative." },
    ],
  },
  {
    slug: 'pea-comment-ouvrir-investir-2026',
    title: 'PEA en 2026 : comment ouvrir, investir et optimiser son Plan d\'Épargne en Actions',
    category: 'Finances',
    readTime: 7,
    publishedAt: '2026-06-08T09:00:00Z',
    intro: "Le PEA est l'enveloppe fiscale idéale pour investir en actions. Ouverture, plafond, éligibilité des ETF, fiscalité après 5 ans : tout ce qu'il faut savoir pour démarrer en 2026.",
    content: `<h2>Pourquoi le PEA est l'enveloppe actions à ouvrir en priorité</h2>
<p>Le Plan d'Épargne en Actions (PEA) bénéficie d'une fiscalité exceptionnelle après 5 ans de détention : les plus-values et dividendes sont <strong>exonérés d'impôt sur le revenu</strong> (seuls les prélèvements sociaux de 17,2 % restent dus). Comparé à la flat tax de 30 % d'un compte-titres ordinaire, l'économie est substantielle : sur 50 000 € de plus-values, le PEA économise ~6 400 € d'IR.</p>
<p>Le PEA peut être ouvert auprès d'une banque ou d'un courtier en ligne. Les plafonds : 150 000 € pour un PEA classique, 225 000 € pour un PEA-PME (complémentaire). Seul un PEA par personne est autorisé.</p>
<h2>Ouvrir son PEA : les étapes</h2>
<ol>
<li><strong>Choisir l'établissement</strong> : les courtiers en ligne (Boursorama, Fortuneo, Trade Republic) sont moins chers que les banques traditionnelles (frais de courtage 0-0,5 % vs 1-2 % en banque).</li>
<li><strong>Fournir les documents</strong> : pièce d'identité, justificatif de domicile, RIB. L'ouverture en ligne prend 10-15 minutes.</li>
<li><strong>Effectuer un premier versement</strong> : dès 1 € pour déclencher le compteur de 5 ans.</li>
</ol>
<h2>Quels ETF choisir sur PEA ?</h2>
<p>Les ETF éligibles au PEA doivent être domiciliés dans l'Union Européenne et répondre à des critères de composition. Les plus populaires :</p>
<ul>
<li><strong>Amundi MSCI World UCITS ETF</strong> (CW8) : exposition mondiale aux marchés développés, TER 0,38 %.</li>
<li><strong>Lyxor CAC 40 ETF</strong> : exposition aux 40 plus grandes capitalisations françaises, TER 0,25 %.</li>
<li><strong>Amundi MSCI Emerging Markets</strong> : marchés émergents éligibles PEA via swap, TER 0,20 %.</li>
</ul>
<h2>Retrait et fiscalité</h2>
<p>Avant 5 ans, tout retrait <strong>clôture le PEA</strong> et les gains sont taxés à 30 % (flat tax). Après 5 ans, les retraits partiels sont possibles sans clôture, et les gains ne supportent que les 17,2 % de prélèvements sociaux. Il est possible de convertir le PEA en rente viagère défiscalisée après 5 ans. Le simulateur d'épargne de simfinly.com projette la valeur de votre PEA et l'économie fiscale selon l'horizon et le rendement.</p>`,
    faqs: [
      { q: "Quelle est la différence entre un PEA bancaire et un PEA assurance ?", a: "Le PEA bancaire (ouvert en banque ou courtier) est le plus courant : vous détenez directement des actions et ETF dans un compte-titres. Le PEA-assurance (ouvert auprès d'un assureur) fonctionne comme une assurance-vie investie en unités de compte — il offre plus de flexibilité dans les supports disponibles mais avec des frais souvent plus élevés. Les deux plafonds sont identiques (150 000 €) et partagent les mêmes avantages fiscaux après 5 ans." },
      { q: "Peut-on investir dans des ETF monde avec un PEA ?", a: "Oui, c'est possible grâce aux ETF monde de synthèse (réplication indirecte). Des ETF comme l'Amundi MSCI World UCITS ETF ou le Lyxor MSCI World ETF sont éligibles au PEA bien que l'indice MSCI World contienne des actions non-européennes. Ils utilisent des swaps de performance pour répliquer l'indice tout en détenant des actions européennes. Ces ETF offrent une exposition mondiale (États-Unis, Europe, Japon...) dans une enveloppe fiscalement avantageuse." },
    ],
  },
  {
    slug: 'micro-entrepreneur-retraite-droits',
    title: 'Retraite du micro-entrepreneur en 2026 : cotisations, points et droits acquis',
    category: 'Retraite',
    readTime: 7,
    publishedAt: '2026-06-09T09:00:00Z',
    intro: "Un micro-entrepreneur cotise à la SSI sur son chiffre d'affaires. Mais combien de trimestres valide-t-il vraiment ? Comment prévoir sa retraite quand on est auto-entrepreneur ?",
    content: `<h2>Comment le micro-entrepreneur cotise-t-il pour la retraite ?</h2>
<p>Un auto-entrepreneur cotise à la <strong>SSI</strong> (Sécurité Sociale des Indépendants) sur son chiffre d'affaires brut, via un taux forfaitaire selon le secteur d'activité :</p>
<ul>
<li>Vente de marchandises : 12,3 % du CA (dont ~6,5 % pour la retraite de base + complémentaire)</li>
<li>Prestations de services BIC : 21,2 % du CA (dont ~11 % pour la retraite)</li>
<li>Professions libérales : 21,1 % du CA</li>
</ul>
<p>Ces taux incluent toutes les cotisations sociales (maladie, CSG/CRDS, allocations familiales, retraite). La part retraite est environ <strong>30-35 % du total des cotisations</strong>.</p>
<h2>Validation des trimestres : le point critique</h2>
<p>Pour valider un trimestre, un micro-entrepreneur doit avoir généré un CA minimum correspondant à <strong>150 × SMIC horaire</strong> (≈ 1 690 € en 2026). En cas d'activité à temps plein, les seuils à atteindre pour valider 4 trimestres :</p>
<ul>
<li>Vente de marchandises : CA ≥ <strong>26 130 €/an</strong></li>
<li>Prestations de services : CA ≥ <strong>15 120 €/an</strong></li>
<li>Professions libérales : CA ≥ <strong>15 120 €/an</strong></li>
</ul>
<p>En dessous de ces seuils, vous ne validez pas 4 trimestres complets — ce qui peut allonger l'âge de départ ou réduire la pension.</p>
<h2>La retraite complémentaire des auto-entrepreneurs</h2>
<p>Les auto-entrepreneurs bénéficient d'un <strong>régime complémentaire obligatoire</strong> (RCI pour artisans/commerçants, ou régime spécifique pour libéraux). Les points accumulés dépendent du CA déclaré et du taux de cotisation. Sur un CA de 30 000 €/an pendant 20 ans en prestations de services, la pension complémentaire peut atteindre 200-400 €/mois.</p>
<h2>Compléter sa retraite en tant qu'auto-entrepreneur</h2>
<p>Les droits accumulés par les micro-entrepreneurs sont souvent insuffisants pour une retraite confortable si l'auto-entreprise est l'unique activité sur toute la carrière. Les solutions : ouvrir un PER individuel (déductible si TMI ≥ 30 %), valider des trimestres manquants via un rachat, ou combiner micro-entreprise et emploi salarié pendant une partie de la carrière. Le simulateur retraite de simfinly.com calcule vos droits SSI selon votre CA annuel et votre secteur.</p>`,
    faqs: [
      { q: "Un auto-entrepreneur cotise-t-il vraiment pour la retraite ?", a: "Oui, mais à un taux et sur une base différents des salariés. En 2026, un auto-entrepreneur (micro-entrepreneur) verse des cotisations sociales de 12,3 % (prestations de services) ou 6,4 % (activité libérale relevant du régime micro-BNC). Une fraction de ces cotisations alimente le régime de retraite SSI (Sécurité Sociale des Indépendants). Problème : pour valider 4 trimestres par an, il faut réaliser un chiffre d'affaires minimum (~8 000 € en services, ~16 000 € en ventes)." },
      { q: "Comment améliorer sa retraite en tant qu'auto-entrepreneur ?", a: "Deux leviers principaux : (1) Ouvrir un PER (Plan d'Épargne Retraite) : les versements sont déductibles du bénéfice imposable, c'est la stratégie la plus efficace pour les micro-entrepreneurs avec un CA conséquent ; (2) Vérifier et compléter ses trimestres manquants via le rachat de trimestres si nécessaire. À terme, si le CA dépasse les plafonds micro (77 700 € en services / 188 700 € en ventes), passer au régime réel optimise généralement les droits retraite." },
    ],
  },

  // === Vague 3 — Articles prioritaires (commit 4B) ===
  {
    slug: 'loi-de-finances-2026-changements',
    title: 'Loi de finances 2026 : les principaux changements fiscaux à connaître',
    category: 'Fiscalité',
    readTime: 7,
    publishedAt: '2026-06-10T09:00:00Z',
    intro: "Barème IR, niches fiscales, immobilier, succession : ce que la loi de finances 2026 change concrètement pour les ménages et les investisseurs.",
    content: `<h2>Revalorisation du barème de l'impôt sur le revenu</h2>
<p>La loi de finances 2026 a revalorisé les tranches du barème IR de <strong>1,8 %</strong> pour tenir compte de l'inflation. Les nouveaux seuils (revenus 2025, déclaration 2026) :</p>
<ul>
<li>0 % jusqu'à 11 497 € (contre 11 294 € en 2025)</li>
<li>11 % de 11 497 € à 29 315 € (contre 28 797 €)</li>
<li>30 % de 29 315 € à 83 823 € (contre 82 341 €)</li>
<li>41 % de 83 823 € à 180 294 € (contre 177 106 €)</li>
<li>45 % au-delà de 180 294 €</li>
</ul>
<p>Cette revalorisation évite la "fiscal creep" (augmentation automatique de l'impôt sans hausse réelle du pouvoir d'achat) et réduit légèrement l'IR des foyers dont les revenus n'ont pas augmenté plus vite que l'inflation.</p>
<h2>Les changements sur les niches fiscales</h2>
<p>La loi de finances 2026 apporte plusieurs ajustements :</p>
<ul>
<li><strong>Plafond PER</strong> : porté à 37 680 € pour les salariés (10 % de 8 PASS), contre 37 094 € en 2025.</li>
<li><strong>Crédit d'impôt garde d'enfant</strong> : plafond relevé à 3 500 € (vs 3 500 € en 2025 — inchangé).</li>
<li><strong>Abattement assurance-vie après 8 ans</strong> : maintenu à 4 600 € (célibataire) et 9 200 € (couple).</li>
<li><strong>Loi Pinel</strong> : dispositif en extinction, prorogé avec des taux réduits pour les acquisitions signées avant 2024.</li>
</ul>
<h2>Les mesures concernant l'immobilier</h2>
<p>La loi de finances 2026 maintient le PTZ élargi (décret 2025) à tout le territoire y compris dans l'ancien. Le dispositif de déficit foncier reste plafonné à 10 700 €/an sur le revenu global (21 400 € pour rénovation énergétique). Aucune modification du régime des plus-values immobilières (exonération après 22 ans de propriété, 30 ans pour les prélèvements sociaux).</p>
<h2>Retraite et cotisations</h2>
<p>Le PASS (Plafond Annuel de la Sécurité Sociale) 2026 est fixé à 47 100 € (+3,5 % vs 2025). Ce plafond conditionne de nombreux calculs : cotisations retraite, plafonds PER, prestations sociales. Le simulateur IR de simfinly.com intègre le barème 2026 actualisé pour calculer votre impôt sur les revenus 2025.</p>`,
  faqs: [
    { q: "Quel est le nouveau barème de l'impôt sur le revenu 2026 ?", a: "Le barème IR 2026 a été revalorisé de +1,6 % pour tenir compte de l'inflation. Les tranches 2026 : 0 % jusqu'à 11 294 €, 11 % de 11 294 à 28 797 €, 30 % de 28 797 à 82 341 €, 41 % de 82 341 à 177 106 €, 45 % au-delà. La déclaration des revenus 2025 est effectuée avec ce barème." },
    { q: "Le PTZ a-t-il été élargi par la loi de finances 2026 ?", a: "Oui, la loi de finances 2026 a pérennisé et élargi le PTZ à l'ensemble du territoire pour les logements neufs (y compris les zones B2 et C qui étaient exclues). Les plafonds de ressources ont été légèrement relevés et le taux peut atteindre 50 % en zone tendue pour les ménages modestes." },
    { q: "Quel est le PASS 2026 et pourquoi est-il important ?", a: "Le Plafond Annuel de la Sécurité Sociale (PASS) 2026 est fixé à 47 100 € (contre 46 368 € en 2025, soit +1,6 %). Il sert de base de calcul pour les plafonds de cotisation retraite (PER : 10 % du PASS = 4 710 €), les seuils du régime micro-social, les indemnités journalières, et de nombreuses autres prestations sociales." },
    { q: "Quelles sont les principales mesures fiscales de la LFI 2026 pour les ménages ?", a: "Principales mesures 2026 : (1) Revalorisation barème IR +1,6 % ; (2) Crédit d'impôt pour rénovation énergétique maintenu (MaPrimeRénov') ; (3) Exonération de plus-values immobilières pour les cessions à des bailleurs sociaux prorogée ; (4) Plafond de déduction PER revalorisé à 37 680 € (8 × PASS). Consultez le simulateur impôt de simfinly.com pour vos simulations." },
  ],
  },
  {
    slug: 'scpi-investir-pierre-papier-2026',
    title: 'SCPI en 2026 : investir en pierre-papier, rendements et risques',
    category: 'Immobilier',
    readTime: 7,
    publishedAt: '2026-06-11T09:00:00Z',
    intro: "Les SCPI (Sociétés Civiles de Placement Immobilier) permettent d'investir dans l'immobilier sans gérer de locataires. Rendement, fiscalité, risques et comparaison avec l'immobilier direct.",
    content: `<h2>Qu'est-ce qu'une SCPI ?</h2>
<p>Une <strong>SCPI</strong> (Société Civile de Placement Immobilier) est un fonds d'investissement qui collecte des capitaux pour acquérir et gérer un parc immobilier professionnel (bureaux, commerces, entrepôts, résidences spécialisées). En achetant des parts, vous devenez copropriétaire indirectement d'un portefeuille immobilier diversifié — sans vous occuper de la gestion.</p>
<p>Les revenus locatifs (après frais de gestion) sont reversés aux associés sous forme de dividendes trimestriels. Le <strong>taux de distribution</strong> moyen en 2025 est de 4,5-5 % (avant fiscalité). Certaines SCPI spécialisées (santé, logistique) ont distribué 5-6 %.</p>
<h2>Les avantages de la pierre-papier</h2>
<ul>
<li><strong>Accessibilité</strong> : investir dès 200-1 000 € par part, sans apport immobilier conséquent.</li>
<li><strong>Diversification</strong> : 1 part = exposition à des dizaines ou centaines de biens dans plusieurs régions ou pays.</li>
<li><strong>Pas de gestion</strong> : la société de gestion s'occupe de tout (locataires, entretien, travaux).</li>
<li><strong>Revenus réguliers</strong> : distributions trimestrielles, pratiques pour compléter une retraite.</li>
</ul>
<h2>Les risques à connaître</h2>
<ul>
<li><strong>Illiquidité</strong> : revendre ses parts peut prendre des mois, surtout en période de tension sur les marchés immobiliers (comme en 2023-2024).</li>
<li><strong>Perte en capital possible</strong> : la valeur des parts peut baisser si le marché immobilier se détériore (baisse des prix observée en 2023).</li>
<li><strong>Frais d'entrée élevés</strong> : 8-12 % du prix de souscription. Il faut conserver ses parts <strong>8-10 ans minimum</strong> pour amortir ces frais.</li>
</ul>
<h2>Fiscalité des SCPI</h2>
<p>Les revenus de SCPI sont des revenus fonciers : ils s'ajoutent à vos revenus imposables et sont taxés à votre TMI + 17,2 % de prélèvements sociaux. Pour alléger la fiscalité, il est possible de loger ses parts de SCPI dans une assurance-vie ou un PER — la fiscalité de l'enveloppe s'applique alors, souvent plus avantageuse. Le simulateur d'investissement locatif de simfinly.com calcule le rendement net de fiscalité selon votre TMI et le mode de détention.</p>`,
    faqs: [
      { q: "Quel est le rendement moyen d'une SCPI en 2026 ?", a: "Le rendement moyen des SCPI (Taux de Distribution sur Valeur de Marché — TDVM) s'établit autour de 4,5-5 % en 2026 selon les typologies. Les SCPI bureaux historiques ont subi des baisses de valeurs de parts en 2023-2024, mais les SCPI diversifiées, de santé et de logistique maintiennent de bons rendements. Ce rendement brut ne tient pas compte de la fiscalité applicable selon votre situation (revenus fonciers soumis à l'IR et aux PS)." },
      { q: "SCPI en direct, en assurance-vie ou en démembrement : quelle est la meilleure option ?", a: "En direct : accès à toutes les SCPI, mais revenus soumis à l'IR + 17,2 % PS (taux marginal élevé). En assurance-vie : les loyers capitalisent dans l'enveloppe sans imposition immédiate, fiscalité douce à la sortie après 8 ans — idéal pour TMI 30 %+. En démembrement (nue-propriété) : achat à prix réduit (10-40 % selon durée), reconstitution automatique à terme, rendement potentiel élevé sans revenus imposables pendant la durée du démembrement — excellent pour les hauts TMI voulant se constituer un capital retraite." },
    ],
  },
  {
    slug: 'budget-50-30-20-methode',
    title: 'La méthode budgétaire 50/30/20 : comment l\'appliquer en France en 2026',
    category: 'Budget',
    readTime: 6,
    publishedAt: '2026-06-12T09:00:00Z',
    intro: "La règle 50/30/20 est la méthode budgétaire la plus répandue : 50 % pour les besoins, 30 % pour les envies, 20 % pour l'épargne. Comment l'adapter à la réalité française ?",
    content: `<h2>Le principe de la règle 50/30/20</h2>
<p>Popularisée par la sénatrice américaine Elizabeth Warren, la règle 50/30/20 divise les revenus nets (après impôts) en trois catégories :</p>
<ul>
<li><strong>50 % pour les besoins</strong> (needs) : loyer, charges, alimentation, transports, assurances, crédits en cours.</li>
<li><strong>30 % pour les envies</strong> (wants) : restaurants, loisirs, abonnements, voyages, shopping non essentiel.</li>
<li><strong>20 % pour l'épargne et le remboursement de dettes</strong> : livrets, investissements, remboursement de crédit conso anticipé.</li>
</ul>
<p>Cette règle est un point de départ, pas une loi absolue. Elle fonctionne bien pour des revenus médians, mais doit être ajustée selon le coût de la vie local.</p>
<h2>Adapter la règle au contexte français</h2>
<p>En France, le coût du logement dans les grandes métropoles (Paris, Lyon, Bordeaux) peut dépasser seul les 30-40 % du revenu net. La règle brute est donc difficile à appliquer. Des adaptations réalistes :</p>
<ul>
<li>Si votre loyer dépasse 30 % du revenu, ajustez le budget "envies" à la baisse plutôt que de réduire l'épargne.</li>
<li>Avec un crédit immobilier en cours, l'idéal est que la mensualité reste sous 35 % (limite HCSF) — ce qui correspond environ au "50 %" des besoins.</li>
<li>L'objectif minimum d'épargne est 10 % pour une épargne de précaution viable, 15-20 % pour préparer sa retraite.</li>
</ul>
<h2>Comment appliquer concrètement la méthode</h2>
<ol>
<li><strong>Calculez votre revenu net mensuel</strong> (salaire net après impôt).</li>
<li><strong>Listez vos dépenses fixes</strong> (besoins) et vérifiez qu'elles ne dépassent pas 50 %.</li>
<li><strong>Automatisez l'épargne</strong> dès le versement du salaire (virement automatique vers livret ou investissement).</li>
<li><strong>Le reste</strong> est disponible pour les envies — sans culpabilité.</li>
</ol>
<h2>Outils pour suivre son budget</h2>
<p>Le simulateur de budget de simfinly.com vous aide à catégoriser vos dépenses, visualiser la répartition 50/30/20 et identifier les postes à optimiser. La méthode "se payer en premier" (épargner avant de dépenser) est la clé : une fois l'épargne automatisée, le reste du budget est entièrement disponible sans calcul permanent.</p>`,
    faqs: [
      { q: "La règle 50/30/20 est-elle réaliste en France ?", a: "Elle reste un excellent point de départ, mais doit être adaptée. En Île-de-France, le logement dépasse souvent 35-40 % du revenu net seul, ce qui rend les 50 % impossible à respecter strictement. La version française adaptée : 50-55 % pour les besoins (incluant le logement), 25-30 % pour les envies, et au minimum 10-15 % pour l'épargne. L'essentiel est de maintenir l'épargne automatique et d'ajuster les 'envies' en conséquence." },
      { q: "Comment automatiser son épargne avec la méthode 50/30/20 ?", a: "La clé est de mettre en place un virement automatique le jour de réception du salaire vers un compte épargne dédié (Livret A, LDDS, ou PER). Si votre salaire net est de 2 500 €, programmez un virement automatique de 500 € (20 %) vers votre épargne dès le 1er de chaque mois. Avec votre banque ou une néo-banque comme Boursorama, Fortuneo ou Monabanq, vous pouvez configurer ces virements automatiques gratuitement. Le reste (2 000 €) couvre naturellement besoins et envies sans suivi quotidien." },
    ],
  },
  {
    slug: 'regle-4-pourcent-fire-france',
    title: 'Règle des 4 % et FIRE en France : est-elle encore valide en 2026 ?',
    category: 'FIRE',
    readTime: 7,
    publishedAt: '2026-06-13T09:00:00Z',
    intro: "La règle des 4 % est la pierre angulaire du mouvement FIRE. Mais est-elle adaptée au contexte français (fiscalité, espérance de vie, retraite obligatoire) ? Analyse et alternatives.",
    content: `<h2>D'où vient la règle des 4 % ?</h2>
<p>La règle des 4 % est issue de l'étude Trinity (1998) : sur 30 ans d'historique boursier américain, un portefeuille diversifié actions/obligations résiste dans 95 % des cas à un retrait annuel de 4 % du capital initial, ajusté chaque année de l'inflation.</p>
<p>Concrètement : pour dépenser 30 000 €/an, il faut un capital de 30 000 ÷ 4 % = <strong>750 000 €</strong>. C'est votre "nombre FIRE".</p>
<h2>Les limites françaises de la règle des 4 %</h2>
<p>L'étude Trinity utilisait des données américaines sur 30 ans. Pour la France en 2026, plusieurs ajustements s'imposent :</p>
<ul>
<li><strong>Horizon plus long</strong> : se retirer à 40 ans implique 50 ans de retraits, pas 30. Les études prolongées montrent que 3-3,5 % est plus sûr sur 50 ans.</li>
<li><strong>Fiscalité française</strong> : les prélèvements sociaux (17,2 %) et l'IR sur les revenus de retraits s'ajoutent. Pour obtenir 30 000 € nets, il faut retirer ~36 000 € bruts selon la fiscalité, ce qui ramène le taux de retrait effectif à ~3,3 %.</li>
<li><strong>Retraite obligatoire</strong> : contrairement aux États-Unis, vous percevrez une retraite CNAV/Agirc-Arrco ou libérale dès 62-67 ans. Ce revenu réduit le capital FIRE nécessaire pendant la phase post-65 ans.</li>
</ul>
<h2>Le taux de retrait adapté à la France</h2>
<p>Pour un Français cherchant l'indépendance financière avant 50 ans, les praticiens recommandent généralement un taux de retrait de <strong>3 à 3,5 %</strong> (capital FIRE = 28-33× les dépenses annuelles). Si vous prévoyez une retraite obligatoire après 62 ans, vous pouvez réduire le capital cible en déduisant la valeur actualisée de ces futures pensions.</p>
<h2>Simulation personnalisée</h2>
<p>Le simulateur FIRE de simfinly.com calcule votre capital cible en intégrant l'inflation française, la fiscalité sur les revenus mobiliers, et la retraite obligatoire prévue. Testez différents taux de retrait (3 %, 3,5 %, 4 %) et horizons de retrait (30, 40, 50 ans) pour trouver votre équilibre sécurité/objectif de capital.</p>`,
    faqs: [
      { q: "Combien faut-il de capital pour appliquer la règle des 4 % en France ?", a: "Pour dépenser 30 000 €/an avec la règle des 4 %, il faut 750 000 € de capital. Mais en tenant compte de la fiscalité française (17,2 % de prélèvements sociaux + IR), il vaut mieux viser 3-3,5 % de taux de retrait : soit 860 000 à 1 000 000 € pour le même niveau de vie. Si vous avez une future retraite CNAV/Agirc-Arrco estimée à 15 000 €/an, le capital FIRE supplémentaire nécessaire n'est que pour les 15 000 € restants (soit 375 000-500 000 €)." },
      { q: "La règle des 4 % est-elle trop risquée pour une retraite anticipée à 40 ans ?", a: "Pour un horizon de 50+ ans, les études récentes (comme celle de Pfau ou de ERN) montrent qu'un taux de 4 % offre seulement 80-85 % de probabilité de succès sur 50 ans avec un portefeuille 60/40. Un taux de 3 à 3,5 % monte cette probabilité à 95-98 %. En pratique, la plupart des adeptes du FIRE combinent : taux de retrait de 3-3,5 % en phase accumulation, revenus partiels les premières années (side income), et retraite obligatoire après 62-67 ans qui couvre une partie des dépenses." },
    ],
  },
  {
    slug: 'donation-nue-propriete-strategie',
    title: 'Donation en nue-propriété : stratégie, calcul et avantages fiscaux en 2026',
    category: 'Fiscalité',
    readTime: 7,
    publishedAt: '2026-06-14T09:00:00Z',
    intro: "Donner la nue-propriété d'un bien à ses enfants tout en gardant l'usufruit : calcul des droits réduits, barème selon l'âge et reconstitution automatique au décès.",
    content: `<h2>Qu'est-ce que la donation en nue-propriété ?</h2>
<p>La donation en nue-propriété consiste à <strong>démembrer la propriété d'un bien</strong> : le donateur conserve l'<em>usufruit</em> (droit d'utiliser le bien ou d'en percevoir les revenus jusqu'à son décès) et donne la <em>nue-propriété</em> à ses enfants. Au décès de l'usufruitier, les nus-propriétaires récupèrent la <strong>pleine propriété sans aucun droits supplémentaires</strong>.</p>
<p>L'intérêt fiscal est majeur : les droits de donation sont calculés sur la <strong>valeur de la nue-propriété seule</strong>, qui est inférieure à la valeur totale du bien. La valeur de la nue-propriété dépend de l'âge de l'usufruitier au moment de la donation.</p>
<h2>Le barème fiscal de la nue-propriété (article 669 du CGI)</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px">
<thead><tr style="background:#FEF3C7"><th style="padding:8px;text-align:left;border:1px solid #FDE68A">Âge de l'usufruitier</th><th style="padding:8px;text-align:center;border:1px solid #FDE68A">Valeur de l'usufruit</th><th style="padding:8px;text-align:center;border:1px solid #FDE68A">Valeur de la nue-propriété</th></tr></thead>
<tbody>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Moins de 21 ans</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">90 %</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">10 %</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">De 51 à 60 ans</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">60 %</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">40 %</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">De 61 à 70 ans</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">50 %</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">50 %</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">De 71 à 80 ans</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">40 %</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">60 %</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Plus de 81 ans</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">20 %</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">80 %</td></tr>
</tbody></table>
<h2>Exemple concret à 60 ans</h2>
<p>Un parent de 60 ans donne la nue-propriété d'un appartement valant 300 000 € à son enfant. La nue-propriété représente 50 % = 150 000 €. Avec l'abattement de 100 000 € par parent par enfant, les droits de donation s'appliquent sur 50 000 €. Au barème des donations en ligne directe, cela donne environ <strong>4 194 € de droits</strong> — contre ~30 000 € si la pleine propriété avait été donnée.</p>
<h2>Points d'attention</h2>
<p>La donation en nue-propriété est irrévocable (sauf accord mutuel). L'usufruitier reste redevable de la taxe foncière et des charges de copropriété courantes. Les travaux "gros œuvre" sont à la charge du nu-propriétaire. Un acte notarié est obligatoire. Simulez les droits avec le calculateur de donation de simfinly.com avant de consulter un notaire.</p>`,
  faqs: [
    { q: "Qu'est-ce que la donation en nue-propriété et comment fonctionne-t-elle ?", a: "La donation en nue-propriété consiste à donner la nue-propriété d'un bien à ses héritiers tout en conservant l'usufruit (droit d'usage et de perception des revenus) sa vie durant. Le donateur continue de vivre dans le bien ou d'en percevoir les loyers. À son décès, l'héritier récupère la pleine propriété sans payer de droits de succession supplémentaires." },
    { q: "Pourquoi la donation en démembrement est-elle fiscalement avantageuse ?", a: "La taxation porte uniquement sur la valeur de la nue-propriété (et non la pleine propriété), déterminée selon un barème lié à l'âge du donateur. Plus le donateur est jeune, plus la nue-propriété est faible (ex : à 55 ans, la nue-propriété vaut 50 % de la valeur totale). Les droits de donation sont donc calculés sur une base réduite." },
    { q: "Quel est le barème de l'usufruit selon l'âge du donateur ?", a: "Selon l'article 669 du CGI, la valeur de l'usufruit et de la nue-propriété varie selon l'âge de l'usufruitier : moins de 21 ans (usufruit : 90 %, nue-propriété : 10 %), 31-40 ans (70 %/30 %), 41-50 ans (60 %/40 %), 51-60 ans (50 %/50 %), 61-70 ans (40 %/60 %), 71-80 ans (30 %/70 %), plus de 90 ans (10 %/90 %)." },
    { q: "Quels risques comporte la donation en démembrement ?", a: "Les principaux risques : (1) le nu-propriétaire ne peut pas vendre sans l'accord de l'usufruitier (indivision forcée sur les décisions importantes) ; (2) en cas de dégradation de l'usufruit ou de conflit familial, la gestion devient complexe ; (3) si le donateur a besoin de liquidités, il ne peut pas vendre le bien sans l'accord de ses héritiers. Prévoir ces aspects dans un pacte de famille notarié." },
  ],
  },
  {
    slug: 'plafond-per-deduction-2026',
    title: 'Plafond PER 2026 : comment maximiser sa déduction fiscale sur le revenu',
    category: 'Épargne',
    readTime: 6,
    publishedAt: '2026-06-15T09:00:00Z',
    intro: "En 2026, le plafond de déduction PER atteint 37 680 € pour les salariés. Comment calculer son enveloppe disponible, utiliser les plafonds reportés et optimiser sa déduction ?",
    content: `<h2>Comment est calculé le plafond PER en 2026 ?</h2>
<p>Le plafond de déduction des versements PER est calculé sur la base du PASS (47 100 € en 2026). Pour un salarié, le plafond est le plus élevé de :</p>
<ul>
<li><strong>10 % des revenus professionnels N-1</strong>, dans la limite de 10 % × 8 PASS = <strong>37 680 €</strong> maximum</li>
<li><strong>10 % du PASS = 4 710 €</strong> (plancher, même sans revenus importants)</li>
</ul>
<p>Pour les travailleurs non-salariés (TNS), le plafond est plus généreux : jusqu'à 10 % du bénéfice imposable dans la limite de 8 PASS + 15 % de la fraction du bénéfice entre 1 et 8 PASS, soit un maximum de <strong>85 780 €</strong> en 2026.</p>
<h2>Les plafonds reportables sur 3 ans</h2>
<p>Si vous n'utilisez pas tout votre plafond PER une année, le <strong>solde non utilisé est reportable sur les 3 années suivantes</strong>. Ce mécanisme est très avantageux si votre situation financière s'améliore : vous pouvez rattraper plusieurs années de plafond en une seule fois.</p>
<p>Votre plafond disponible (y compris reports) figure sur votre <strong>avis d'imposition</strong>, rubrique "Plafonds épargne retraite". Vérifiez-le avant chaque versement PER — beaucoup de contribuables sous-utilisent cette capacité.</p>
<h2>Optimiser son versement PER selon la TMI</h2>
<p>L'avantage du PER est proportionnel à votre Tranche Marginale d'Imposition :</p>
<ul>
<li>TMI 11 % : économie de 110 € pour 1 000 € versés</li>
<li>TMI 30 % : économie de 300 € — seuil de rentabilité élevé</li>
<li>TMI 41 % : économie de 410 € — optimal pour les hauts revenus</li>
<li>TMI 45 % : économie de 450 € — défiscalisation massive possible</li>
</ul>
<h2>PER individuel, PERcol ou les deux ?</h2>
<p>Le plafond PER est <strong>commun à tous les types de PER</strong> (individuel, collectif, catégoriel). Les versements volontaires sur un PERcol (abondement employeur mis à part) consomment le même plafond que le PERin. L'intéressement et la participation versés sur un PERcol <strong>ne consomment pas</strong> le plafond de déduction PER — ils bénéficient d'une exonération propre. Le simulateur PER de simfinly.com calcule votre économie d'impôt exacte selon votre TMI et vos revenus.</p>`,
    faqs: [
      { q: "Où trouver son plafond PER disponible ?", a: "Votre plafond PER disponible (y compris les reports des 3 dernières années) figure sur votre dernier avis d'imposition, à la rubrique 'Plafonds épargne retraite non utilisés'. Si vous n'avez pas encore déclaré en 2026, consultez l'avis 2025 (revenus 2024). Sur impots.gouv.fr, dans votre espace personnel, la rubrique 'Documents > Avis d'imposition' vous donne accès à cette information. Votre courtier PER peut aussi souvent vous afficher cette information directement." },
      { q: "Peut-on utiliser les plafonds non utilisés des années précédentes ?", a: "Oui, les plafonds non utilisés sont reportables sur les 3 années suivantes — c'est l'un des grands avantages du PER. Exemple : si votre plafond 2023 était de 8 000 € et que vous n'avez versé que 3 000 €, les 5 000 € non utilisés sont reportables jusqu'en 2026. Ce mécanisme est très puissant si votre revenu a augmenté : vous pouvez rattraper plusieurs années de plafond en un seul versement et réaliser une déduction fiscale massive. Vérifiez toujours votre avis d'imposition avant de verser." },
    ],
  },
  {
    slug: 'epargne-precaution-combien-garder',
    title: 'Épargne de précaution : combien garder sur son livret en 2026 ?',
    category: 'Budget',
    readTime: 5,
    publishedAt: '2026-06-16T09:00:00Z',
    intro: "3 mois ou 6 mois de dépenses ? Célibataire ou famille ? Salarié ou indépendant ? Le guide pour calibrer son épargne de précaution et savoir quand commencer à investir.",
    content: `<h2>À quoi sert l'épargne de précaution ?</h2>
<p>L'épargne de précaution est une réserve liquide destinée à faire face aux imprévus sans devoir vendre des placements à long terme (actions, immobilier) au mauvais moment. Exemples d'imprévus : perte d'emploi, réparation automobile, panne d'électroménager, frais médicaux, problème locatif.</p>
<p>Sans épargne de précaution, le premier accident de la vie force à recourir au crédit conso (taux de 10-20 %) ou à liquider des placements à perte. C'est la base de toute gestion financière saine — avant tout investissement.</p>
<h2>Combien faut-il mettre de côté ?</h2>
<p>La règle courante : <strong>3 mois de dépenses fixes</strong> au minimum, <strong>6 mois</strong> en situation à risque élevé.</p>
<ul>
<li><strong>Salarié en CDI stable</strong> : 3 mois de dépenses fixes suffisent (délai moyen de retrouver un emploi).</li>
<li><strong>Salarié en CDD ou intérimaire</strong> : 4-6 mois (période d'emploi plus volatile).</li>
<li><strong>Indépendant, freelance, auto-entrepreneur</strong> : 6-12 mois (revenus variables, pas d'accès aux ASSEDIC en cas de faillite).</li>
<li><strong>Propriétaire avec crédit immobilier</strong> : ajouter 2-3 mois pour couvrir les dépenses de copropriété ou entretien imprévus.</li>
</ul>
<h2>Où placer son épargne de précaution ?</h2>
<p>L'épargne de précaution doit être <strong>disponible immédiatement</strong> et <strong>sans risque de perte</strong>. Les supports adaptés en 2026 :</p>
<ul>
<li><strong>Livret A</strong> : 2,4 % net, plafonné à 22 950 €, accessible immédiatement. Idéal pour la majorité des ménages.</li>
<li><strong>LEP</strong> (si éligible) : 3,5 % net, plafonné à 10 000 €. Prioritaire si votre revenu fiscal de référence est sous le plafond.</li>
<li><strong>LDDS</strong> : 2,4 % net, plafonné à 12 000 €. Bon complément.</li>
</ul>
<p>Les fonds euros d'assurance-vie (délai de retrait de 72h) peuvent servir de complément pour les montants dépassant les plafonds des livrets. Une fois votre épargne de précaution constituée, le reste peut être investi dans des supports plus rémunérateurs à long terme.</p>`,
    faqs: [
      { q: "Faut-il garder son épargne de précaution sur le Livret A ou un compte courant ?", a: "Préférez le Livret A pour la grande majorité de votre épargne de précaution : il est disponible à tout moment (virement reçu en 24-48h), garanti par l'État, et rapporte 2,4 % net d'impôt en 2026. Sur votre compte courant, ne conservez que 1 à 2 mois de dépenses — assez pour absorber les dépenses immédiates sans attendre un virement depuis le Livret A. Si vous avez plus de 22 950 € à mettre de côté, complétez avec le LDDS (12 000 €) puis un fonds euros en assurance-vie." },
      { q: "L'épargne de précaution doit-elle être séparée de l'épargne retraite ?", a: "Oui, absolument. Votre épargne de précaution est votre coussin de sécurité à court terme — elle ne doit jamais être investie dans des supports risqués ou peu liquides (actions, PEA, PER). Constituez d'abord votre épargne de précaution (Livret A + LDDS), puis commencez à investir le surplus long terme. Mélanger les deux objectifs dans le même compte mène à des erreurs : soit vous investissez trop peu, soit vous vendez des placements en mauvais moment pour couvrir un imprévu." },
    ],
  },
  {
    slug: 'taux-remplacement-calcul-2026',
    title: 'Taux de remplacement retraite 2026 : calcul et exemples selon la profession',
    category: 'Retraite',
    readTime: 6,
    publishedAt: '2026-06-17T09:00:00Z',
    intro: "Le taux de remplacement mesure la baisse de revenu entre le dernier salaire et la première pension. Comment est-il calculé et que vaut-il selon votre statut et votre niveau de salaire ?",
    content: `<h2>Définition du taux de remplacement</h2>
<p>Le <strong>taux de remplacement</strong> est le ratio entre la première pension nette perçue et le dernier salaire net avant la retraite. Il exprime la baisse du revenu lors du passage à la retraite.</p>
<p>Formule : Taux de remplacement = (Pension nette / Dernier salaire net) × 100</p>
<p>Un taux de 70 % signifie que votre pension est égale à 70 % de votre dernier salaire net. Plus vous gagnez, plus le taux de remplacement est généralement bas (plafonnement des droits au PASS).</p>
<h2>Les taux de remplacement moyens par profil (2026)</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px">
<thead><tr style="background:#EAF0FF"><th style="padding:8px;text-align:left;border:1px solid #d6e2fb">Profil</th><th style="padding:8px;text-align:center;border:1px solid #d6e2fb">Taux de remplacement brut</th><th style="padding:8px;text-align:center;border:1px solid #d6e2fb">Taux net estimé</th></tr></thead>
<tbody>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Salarié SMIC, carrière complète</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">~85 %</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">~90 %</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">Salarié 2× SMIC, carrière complète</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">~73 %</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">~75 %</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Cadre supérieur (60 000-80 000 €/an)</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">~55-65 %</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">~60-70 %</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">Fonctionnaire (traitement moyen)</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">~75 %</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">~80 %</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Artisan/commerçant (revenu moyen)</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">~50-60 %</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">~55-65 %</td></tr>
</tbody></table>
<h2>Pourquoi le taux de remplacement est plus faible pour les hauts revenus</h2>
<p>Le régime général plafonne la retraite de base au PASS (47 100 € en 2026). Pour un cadre gagnant 80 000 €/an, la base de calcul de la CNAV est limitée à 47 100 €, mais l'Agirc-Arrco compense partiellement via les points accumulés sur la tranche B (PASS à 8×PASS). Malgré cela, le taux de remplacement brut reste inférieur à celui d'un salarié au SMIC.</p>
<h2>Estimer son taux de remplacement</h2>
<p>Le simulateur retraite de simfinly.com calcule le taux de remplacement brut et net selon votre salaire actuel, vos trimestres et votre âge de départ prévu. Identifiez le complément d'épargne nécessaire (PER, assurance-vie, SCPI) pour atteindre le niveau de revenu souhaité à la retraite.</p>`,
    faqs: [
      { q: "Quel est le taux de remplacement moyen en France en 2026 ?", a: "Le taux de remplacement net moyen en France est d'environ 66 % pour un salarié du privé à salaire médian, selon le COR (Conseil d'Orientation des Retraites). Ce taux est parmi les plus élevés d'Europe, mais masque de fortes disparités : les bas salaires (SMIC) ont des taux de 85-90 % (régime général non plafonné), tandis que les hauts revenus (cadres supérieurs à 80 000 €+) n'atteignent que 45-55 % (plafonnement au PASS)." },
      { q: "Comment améliorer son taux de remplacement futur ?", a: "Plusieurs leviers permettent de combler l'écart : (1) PER individuel — déductible à l'entrée, converti en rente à la retraite, très efficace pour les TMI de 30 %+; (2) Assurance-vie — épargne flexible avec fiscalité avantageuse après 8 ans; (3) Immobilier locatif — revenus complémentaires à la retraite; (4) Rachat de trimestres manquants — améliore la proratisation CNAV. Utilisez le simulateur CNAV de simfinly.com pour estimer votre taux de remplacement actuel et simuler ces stratégies." },
    ],
  },

  // === Vague 3 — Articles prioritaires (commit 4C) ===
  {
    slug: 'lmnp-regime-reel-amortissement-2026',
    title: 'LMNP au régime réel en 2026 : amortissement, fiscalité et simulation',
    category: 'Immobilier',
    readTime: 7,
    publishedAt: '2026-06-18T09:00:00Z',
    intro: "Le régime réel LMNP permet d'amortir le bien immobilier et d'annuler l'impôt sur les loyers meublés pendant 10-15 ans. Mécanisme, conditions et calcul pas à pas.",
    content: `<h2>LMNP : c'est quoi exactement ?</h2>
<p>Le statut de <strong>Loueur Meublé Non Professionnel (LMNP)</strong> s'applique à tout propriétaire qui loue un bien meublé (avec équipements suffisants pour y vivre) et dont les recettes annuelles ne dépassent pas 23 000 € ou 50 % des revenus du foyer. Au-delà, c'est le statut LMP (professionnel).</p>
<p>Le régime réel LMNP permet de déduire toutes les charges réelles <strong>ET d'amortir le bien immobilier</strong> comptablement, ce qui permet souvent d'afficher un résultat fiscal nul ou négatif pendant 10-20 ans — sans décaissement réel.</p>
<h2>L'amortissement : le moteur fiscal du LMNP réel</h2>
<p>En régime réel, vous pouvez amortir le prix d'achat du bien (hors terrain, qui représente environ 15-20 % de la valeur) et les meubles sur leur durée de vie estimée :</p>
<ul>
<li><strong>Gros œuvre (structure)</strong> : amortissement sur 50-80 ans</li>
<li><strong>Façade et étanchéité</strong> : 25-30 ans</li>
<li><strong>Équipements intérieurs (plomberie, électricité)</strong> : 15-20 ans</li>
<li><strong>Mobilier</strong> : 5-10 ans</li>
</ul>
<p>Exemple : un appartement acheté 200 000 € (terrain estimé à 20 000 €). Le composant "structure" de 80 000 € est amorti sur 50 ans = 1 600 €/an. Les autres composants génèrent des dotations supplémentaires. Au total, les amortissements annuels peuvent atteindre 5 000-8 000 € sur ce bien.</p>
<h2>Calcul du résultat LMNP réel</h2>
<p>Résultat = Loyers − Charges réelles − Amortissements. Si le résultat est nul ou négatif, vous ne payez <strong>aucun IR ni prélèvements sociaux</strong> sur vos loyers meublés. Le déficit LMNP est reportable sur les bénéfices LMNP des 10 années suivantes (il n'est pas imputable sur le revenu global, contrairement au déficit foncier).</p>
<h2>Avantages et pièges du LMNP réel</h2>
<p>Avantages : neutralité fiscale totale pendant 10-15 ans, revenus locatifs nets d'impôts, plus-value à la vente calculée sans déduire les amortissements (retour à la plus-value classique). Principal piège : la comptabilité est obligatoire, avec bilan annuel et liasse fiscale (BIC réel) — faites appel à un expert-comptable spécialisé (coût : 500-1 200 €/an). Le simulateur rendement locatif de simfinly.com intègre l'amortissement LMNP pour calculer la rentabilité nette réelle.</p>`,
  faqs: [
    { q: "Comment fonctionne l'amortissement en LMNP régime réel ?", a: "En LMNP régime réel, vous amortissez le bien immobilier (hors terrain, non amortissable) sur 25-40 ans et les meubles sur 5-10 ans. Un bien de 200 000 € (dont 20 000 € de terrain) donne 180 000 € amortissables : à 3,3 %/an = 5 940 €/an de charge déductible sans décaissement. C'est cet amortissement qui crée souvent un déficit BIC fictif." },
    { q: "Peut-on créer un déficit en LMNP et le reporter ?", a: "En LMNP régime réel, le déficit BIC (pertes > loyers) n'est pas imputable sur le revenu global mais est reportable indéfiniment sur les futurs bénéfices BIC du même bien. En pratique, pendant 10-15 ans avec un emprunt, le LMNP réel produit souvent un déficit reportable, rendant les loyers entièrement défiscalisés." },
    { q: "Faut-il un expert-comptable pour le LMNP régime réel ?", a: "La déclaration 2031 (BIC réel) est techniquement complexe : bilan, compte de résultat, tableau d'amortissement. Un expert-comptable spécialisé LMNP coûte 500-1 200 €/an, est lui-même déductible, et optimise les amortissements (composants : structure, toiture, installations...). Pour 1-2 biens, le logiciel spécialisé (JD2M, Dext) peut suffire." },
    { q: "La vente d'un bien en LMNP déclenche-t-elle une plus-value professionnelle ?", a: "Non, si vous restez en statut LMNP (non-professionnel), la plus-value à la revente est une plus-value des particuliers, avec abattement pour durée de détention (exonération totale après 22 ans pour l'IR, 30 ans pour les prélèvements sociaux). En revanche, si vous basculez en LMP (professionnel), la plus-value devient professionnelle avec une règle de réintégration des amortissements déduits." },
  ],
  },
  {
    slug: 'retraite-auto-entrepreneur-ssi-calcul',
    title: 'Retraite de l\'auto-entrepreneur 2026 : calcul SSI, trimestres et pension estimée',
    category: 'Retraite',
    readTime: 6,
    publishedAt: '2026-06-19T09:00:00Z',
    intro: "Combien de trimestres un auto-entrepreneur valide-t-il avec son CA ? Quelle pension peut-il espérer ? Calcul détaillé selon le secteur d'activité et le niveau de chiffre d'affaires.",
    content: `<h2>Les cotisations retraite de l'auto-entrepreneur en 2026</h2>
<p>Un auto-entrepreneur cotise à la SSI sur son chiffre d'affaires déclaré. Les taux globaux de cotisations sociales incluent la part retraite :</p>
<ul>
<li><strong>Commerce/vente</strong> : 12,3 % du CA (dont ~6,5 % retraite de base + complémentaire)</li>
<li><strong>Artisanat/services BIC</strong> : 21,2 % du CA</li>
<li><strong>Professions libérales BNC</strong> : 21,1 % du CA</li>
<li><strong>Libéraux CIPAV</strong> : 21,2 % du CA</li>
</ul>
<h2>Validation des trimestres : les seuils de CA</h2>
<p>Un trimestre est validé pour chaque tranche de CA équivalente à 150 × SMIC horaire brut = ~1 690 € de revenus cotisés. Pour un auto-entrepreneur, on convertit le CA en revenu cotisé via un taux d'assiette.</p>
<p>CA annuels nécessaires pour valider 4 trimestres (taux plein annuel) :</p>
<ul>
<li>Commerce : CA ≥ ~26 130 €/an</li>
<li>Services BIC/artisanat : CA ≥ ~15 120 €/an</li>
<li>Libéral CIPAV : CA ≥ ~14 800 €/an</li>
</ul>
<h2>Simulation de pension : exemple concret</h2>
<p>Un auto-entrepreneur en services BIC avec 25 000 € de CA pendant 30 ans (de 35 à 65 ans) :</p>
<ul>
<li>Valide 4 trimestres/an → 120 trimestres total (sur 172 requis à taux plein pour la génération 1980)</li>
<li>Trimestres manquants : 52 → départ avec décote ou attendre 67 ans</li>
<li>SAM estimé (25 meilleures années de revenus cotisés réduits) : ~8 000-12 000 €/an</li>
<li>Pension CNAV estimée : ~4 000-6 000 €/an brut (340-500 €/mois)</li>
<li>Pension RCI complémentaire : ~200-350 €/mois</li>
</ul>
<h2>Comment améliorer ses droits en tant qu'auto-entrepreneur</h2>
<p>Les solutions pour compenser la faiblesse des droits acquis : (1) Ouvrir un PER individuel et verser chaque mois pour compenser avec une rente ou un capital à la retraite. (2) Si vous cumulez micro-entreprise et emploi salarié, vos droits CNAV s'additionnent. (3) Passer au régime réel si votre activité le permet — assiette de cotisations plus favorable pour les charges réelles élevées. Le simulateur retraite auto-entrepreneur de simfinly.com calcule vos droits selon votre CA annuel et votre secteur.</p>`,
  faqs: [
    { q: "Un auto-entrepreneur cotise-t-il vraiment pour la retraite ?", a: "Oui, mais souvent peu. L'auto-entrepreneur verse un pourcentage forfaitaire de son CA (12,3 % pour la vente, 22 % pour les services) qui inclut les cotisations retraite. Avec un CA de 20 000 €/an (services), il cotise environ 4 400 €, dont seulement une partie va à la retraite — ce qui génère environ 5 à 7 trimestres validés et peu de points retraite." },
    { q: "Combien de trimestres valide un auto-entrepreneur par an ?", a: "Un auto-entrepreneur valide 4 trimestres/an s'il atteint le seuil minimal de revenus : environ 6 570 €/an de CA (pour les activités de services en 2026). En dessous, le nombre de trimestres validés est proportionnel. Avec un petit CA (sous le seuil), des années entières peuvent ne valider aucun trimestre de retraite." },
    { q: "Quelle retraite complémentaire pour les auto-entrepreneurs professions libérales ?", a: "Les auto-entrepreneurs exerçant une profession libérale cotisent à la CIPAV (Caisse Interprofessionnelle de Prévoyance et d'Assurance Vieillesse) pour leur retraite complémentaire. Les cotisations CIPAV sont calculées sur le CA avec un taux fixe. La retraite complémentaire CIPAV est souvent modeste : prévoir un PER ou une assurance-vie pour compléter." },
    { q: "Comment améliorer sa future retraite quand on est auto-entrepreneur ?", a: "Stratégies pour compléter une retraite auto-entrepreneur insuffisante : (1) ouvrir un PER (déductible dans la limite de 10 % des revenus) ; (2) investir dans l'immobilier locatif pour des revenus complémentaires à la retraite ; (3) envisager de basculer en EURL ou SASU pour avoir un statut salarié et des droits retraite plus élevés si votre CA le justifie." },
  ],
  },
  {
    slug: 'risque-sequence-fire-rentier',
    title: 'Risque de séquence FIRE : le piège des premières années de rente',
    category: 'FIRE',
    readTime: 6,
    publishedAt: '2026-06-20T09:00:00Z',
    intro: "Le risque de séquence est la principale menace pour un rentier FIRE : des mauvaises performances en début de retraite peuvent ruiner un portefeuille même mathématiquement viable. Comment s'en protéger ?",
    content: `<h2>Qu'est-ce que le risque de séquence ?</h2>
<p>Le risque de séquence (sequence of returns risk) désigne le danger lié à <strong>l'ordre dans lequel surviennent les performances boursières</strong>. Si les premières années de votre retraite coïncident avec un krach boursier, votre portefeuille peut se dégrader de façon irréversible — même si la performance moyenne sur 30 ans est identique à un scénario favorable.</p>
<p>Exemple illustratif : Deux rentiers partent avec 500 000 €, retirent 20 000 €/an, ont la même performance moyenne de 5 % sur 30 ans. L'un connaît +20 % les 5 premières années puis −30 %, l'autre l'inverse. Le premier se retrouve à court après 22 ans, le second à plus de 1 000 000 € au bout de 30 ans.</p>
<h2>Pourquoi les premières années sont critiques</h2>
<p>En début de rente, votre capital est à son maximum. Un krach de 40 % sur un portefeuille de 500 000 € = −200 000 €. Si vous continuez à retirer 20 000 €/an pendant la baisse, votre capital ne se reconstitue jamais complètement lors du rebond, car la base d'actifs est réduite. Plus vous avez prélevé en période de baisse, moins les hausses suivantes profitent.</p>
<h2>Stratégies pour réduire le risque de séquence</h2>
<ul>
<li><strong>Cash buffer (réserve liquide)</strong> : conserver 1-2 ans de dépenses sur livret. En cas de krach, prélevez sur le livret plutôt que de vendre des actions à la baisse.</li>
<li><strong>Réduction temporaire des retraits</strong> : baisser ses dépenses de 10-15 % lors des années de forte baisse (si possible) pour laisser le portefeuille se reconstituer.</li>
<li><strong>Allocation défensive en début de rente</strong> : maintenir 20-30 % de fonds euros ou obligations les 5 premières années pour amortir les chocs, puis rééquilibrer progressivement vers les actions.</li>
<li><strong>Revenus alternatifs</strong> : si vous avez des revenus partiels (activités annexes, loyers, retraite obligatoire future), la pression sur le portefeuille est réduite pendant les phases de baisse.</li>
</ul>
<h2>Simulation avec Monte Carlo</h2>
<p>Le simulateur FIRE de simfinly.com intègre une simulation Monte Carlo pour tester la robustesse de votre plan sur 10 000 scénarios historiques. Identifiez le taux de réussite de votre plan selon votre capital, vos dépenses et votre horizon — et ajustez si le taux de succès est inférieur à 90 %.</p>`,
  faqs: [
    { q: "Qu'est-ce que le risque de séquence de rendements (sequence of returns risk) ?", a: "Le risque de séquence désigne le danger que des rendements négatifs surviennent en début de retraite (quand le patrimoine est au maximum) plutôt qu'en fin. Retirer 4 % d'un portefeuille qui chute de 30 % la première année, c'est vendre des actifs décotés et réduire définitivement la base de croissance future — un effet bien plus dévastateur qu'une baisse 10 ans plus tard." },
    { q: "Comment protéger son portefeuille FIRE du risque de séquence ?", a: "Les stratégies classiques : (1) bucket strategy (2-3 ans de dépenses en cash/fonds euros, isolés de la volatilité) ; (2) allocation glide path (augmenter progressivement les obligations/fonds euros autour de la date de FIRE) ; (3) taux de retrait flexible (réduire les retraits en cas de baisse des marchés) ; (4) revenus alternatifs (location, freelance) pour éviter de puiser dans le portefeuille les mauvaises années." },
    { q: "La règle des 4 % est-elle sûre en France face au risque de séquence ?", a: "La règle des 4 % a été calculée sur données US (1926-1994, portefeuille 50/50 actions/obligations, horizon 30 ans). En France, avec la fiscalité (PFU 30 %), une inflation historiquement plus variable, et un horizon de retraite potentiellement de 40+ ans, beaucoup de planificateurs FIRE français utilisent un taux plus conservateur de 3-3,5 %." },
    { q: "Un FIRE raté peut-il être récupéré ?", a: "Oui, si votre portefeuille s'épuise plus vite que prévu (mauvaise séquence), plusieurs options : reprendre une activité partielle (barista FIRE), réduire les dépenses temporairement, vendre l'immobilier pour rentrer du capital, ou accéder plus tôt aux retraites obligatoires (à 64 ans). Le FIRE n'est pas irréversible — un 'plan B' prévu dès le départ réduit considérablement le risque psychologique." },
  ],
  },
  {
    slug: 'abattement-succession-enfants-2026',
    title: 'Succession enfants en 2026 : abattements, barème et droits à payer',
    category: 'Fiscalité',
    readTime: 7,
    publishedAt: '2026-06-21T09:00:00Z',
    intro: "Chaque enfant bénéficie d'un abattement de 100 000 € sur la succession de chaque parent. Au-delà, le barème progressif s'applique. Calcul complet et stratégies pour réduire les droits.",
    content: `<h2>L'abattement de 100 000 € par enfant et par parent</h2>
<p>En France, la transmission aux enfants bénéficie d'un <strong>abattement de 100 000 €</strong> par enfant et par parent, renouvelé tous les 15 ans. Cet abattement s'applique à la fois aux successions et aux donations. Pour un couple avec 2 enfants, la transmission possible en franchise totale est :</p>
<ul>
<li>100 000 € × 2 parents × 2 enfants = <strong>400 000 €</strong> transmissibles sans droits</li>
<li>Renouvelé tous les 15 ans : potentiel de 800 000 € sur 30 ans</li>
</ul>
<p>En plus, un <strong>don familial de sommes d'argent</strong> (don Sarkozy) permet 31 865 € supplémentaires, cumulable avec les 100 000 €, si le donateur a moins de 80 ans et le bénéficiaire au moins 18 ans.</p>
<h2>Le barème des droits de succession en ligne directe</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px">
<thead><tr style="background:#EAF0FF"><th style="padding:8px;text-align:left;border:1px solid #d6e2fb">Part nette taxable</th><th style="padding:8px;text-align:center;border:1px solid #d6e2fb">Taux</th></tr></thead>
<tbody>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Moins de 8 072 €</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">5 %</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">De 8 072 € à 12 109 €</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">10 %</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">De 12 109 € à 15 932 €</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">15 %</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">De 15 932 € à 552 324 €</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">20 %</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">De 552 324 € à 902 838 €</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">30 %</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">De 902 838 € à 1 805 677 €</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">40 %</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Plus de 1 805 677 €</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">45 %</td></tr>
</tbody></table>
<h2>Exemple de calcul : patrimoine de 500 000 €, deux enfants</h2>
<p>Patrimoine net à transmettre : 500 000 €. Deux enfants reçoivent 250 000 € chacun. Abattement 100 000 € chacun → 150 000 € taxable chacun. Droits par enfant : 5 % × 8 072 € + 10 % × 4 037 € + 15 % × 3 823 € + 20 % × (150 000 − 15 932) € ≈ <strong>29 700 €</strong> chacun. Soit ~59 400 € au total.</p>
<h2>Réduire les droits : stratégies disponibles</h2>
<p>Anticiper les transmissions par donations (100 000 € tous les 15 ans), utiliser l'assurance-vie pour les versements avant 70 ans (152 500 € par bénéficiaire hors droits), ou le démembrement de propriété. Le simulateur de succession de simfinly.com calcule les droits selon la composition familiale, le patrimoine et les donations déjà effectuées.</p>`,
  faqs: [
    { q: "Quel est l'abattement en ligne directe sur les successions en 2026 ?", a: "Chaque enfant (et chaque parent) bénéficie d'un abattement de 100 000 € sur la part d'héritage reçue, tous les 15 ans. Au-delà de cet abattement, le barème progressif s'applique : 5 % jusqu'à 8 072 €, 10 % de 8 072 à 12 109 €, 15 % jusqu'à 15 932 €, 20 % jusqu'à 552 324 €, 30 %, 40 %, puis 45 % au-delà de 1 805 677 €." },
    { q: "Comment utiliser la donation pour réduire les droits de succession ?", a: "Chaque parent peut donner 100 000 € à chaque enfant sans droits, tous les 15 ans (abattement donation en ligne directe). Un couple avec 2 enfants peut donc transmettre 400 000 € tous les 15 ans sans aucun impôt. En donnant tôt (à 55-60 ans), il est possible de réaliser 2 séries de donations avant le décès." },
    { q: "Y a-t-il un abattement spécial pour les handicapés en matière de succession ?", a: "Oui, les héritiers atteints d'une infirmité qui les empêche de travailler dans des conditions normales bénéficient d'un abattement supplémentaire de 159 325 € en 2026, qui s'ajoute à l'abattement de droit commun (100 000 € en ligne directe). Cet abattement est cumulable et s'applique aussi sur les donations." },
    { q: "L'assurance-vie échappe-t-elle aux droits de succession ?", a: "Oui, l'assurance-vie versée avant 70 ans bénéficie d'un abattement de 152 500 € par bénéficiaire, hors droits de succession (prélèvement de 20 % au-delà, puis 31,25 % au-delà de 700 000 €). Les versements effectués après 70 ans bénéficient d'un abattement global de 30 500 € (tous bénéficiaires confondus), les intérêts étant exonérés. L'assurance-vie est donc un outil de transmission puissant, complémentaire aux donations." },
  ],
  },
  {
    slug: 'retraite-militaire-calcul-pension',
    title: 'Retraite militaire en 2026 : calcul de la pension SRE, durée et réversion',
    category: 'Retraite',
    readTime: 7,
    publishedAt: '2026-06-22T09:00:00Z',
    intro: "Les militaires bénéficient d'un régime de retraite spécifique (SRE) permettant de partir dès 17 ans de service. Calcul de la pension, bonifications et droits à réversion.",
    content: `<h2>Le régime de retraite militaire : le SRE</h2>
<p>Les militaires relèvent du <strong>Service des Retraites de l'État (SRE)</strong>, régime distinct du régime général. Ses caractéristiques principales :</p>
<ul>
<li><strong>Départ anticipé possible</strong> : dès 17 ans de service pour les sous-officiers et hommes du rang, 27 ans pour les officiers.</li>
<li><strong>Pas d'âge légal de départ</strong> fixe (contrairement au régime général) — la durée de service est le critère principal.</li>
<li><strong>Limite d'âge</strong> : entre 59 et 67 ans selon le grade (les généraux peuvent servir jusqu'à 67 ans).</li>
</ul>
<h2>Calcul de la pension militaire</h2>
<p>La pension militaire = <strong>Traitement brut de référence × Taux de liquidation</strong>.</p>
<p>Le <strong>traitement de référence</strong> est le traitement indiciaire brut du dernier emploi perçu pendant au moins 6 mois. Le <strong>taux de liquidation</strong> est de 2 % par annuité de service, avec un maximum de 75 % (soit 37,5 annuités). Des bonifications s'ajoutent selon la nature du service.</p>
<h2>Les bonifications : des annuités supplémentaires</h2>
<ul>
<li><strong>Services aériens et sous-marins</strong> : bonification de 1 mois par mois de vol ou de plongée.</li>
<li><strong>Opérations extérieures (OPEX)</strong> : bonification de 1 mois par mois en opération depuis 2015.</li>
<li><strong>Campagnes militaires</strong> : bonification historique, toujours applicable selon les textes.</li>
<li><strong>Enfants</strong> : 1 an par enfant (max 3 ans) pour les militaires femmes et les couples depuis 2012.</li>
</ul>
<h2>La réversion et les droits des conjoints</h2>
<p>La réversion militaire est de <strong>50 % de la pension du défunt</strong>, sans condition de ressources ni d'âge (contrairement au régime général). Le conjoint survivant perçoit 50 % de la pension dès le décès, quelle que soit son âge. En cas de remariage, la réversion est maintenue (contrairement au régime général). Le simulateur retraite militaire de simfinly.com calcule la pension selon le grade, les années de service et les bonifications applicables.</p>`,
  faqs: [
    { q: "Comment est calculée la pension de retraite d'un militaire ?", a: "La pension militaire = traitement brut de base × (nombre d'annuités liquidables / nombre d'annuités maximum) × coefficient. Les militaires du rang et sous-officiers ont un taux de liquidation de 2 %/annuité, avec un plafond à 75 %. Des bonifications (pensions de retraite supplémentaires pour OPEX, service actif) s'ajoutent. La durée minimum de service est 17 ans pour une pension à vie." },
    { q: "À quel âge part à la retraite un militaire en France ?", a: "L'âge de retraite varie selon le grade : militaires du rang (soldats, caporaux) : 52 ans ; sous-officiers : 57 ans ; officiers subalternes : 57 ans ; officiers supérieurs : 59-62 ans selon le grade. Ces âges sont généralement inférieurs aux fonctionnaires civils en raison des contraintes spécifiques (mobilité, disponibilité, OPEX)." },
    { q: "Qu'est-ce que la bonification OPEX pour la retraite militaire ?", a: "Les militaires engagés en Opérations Extérieures (OPEX) bénéficient d'une bonification de 1 mois supplémentaire par mois de service actif en OPEX (dans la limite fixée par arrêté). Ces bonifications s'ajoutent aux annuités de base et permettent d'atteindre le maximum plus rapidement, ou d'obtenir une pension supérieure." },
    { q: "Un militaire retraité peut-il cumuler sa pension et un emploi civil ?", a: "Oui, le cumul emploi-retraite est possible pour les militaires. Un militaire retraité peut exercer une activité privée ou fonctionnaire civile sans restriction (depuis 2015 pour les pensions à jouissance immédiate). Les revenus d'activité et la pension s'additionnent sans plafond de cumul pour les pensions à taux plein. C'est un avantage notable par rapport à d'autres régimes." },
  ],
  },
  {
    slug: 'private-equity-investir-france',
    title: 'Private equity en France en 2026 : comment investir et à partir de quel montant',
    category: 'Finances',
    readTime: 7,
    publishedAt: '2026-06-23T09:00:00Z',
    intro: "Le private equity (capital-investissement) était réservé aux institutionnels. Depuis 2024, il est accessible aux particuliers via les fonds ELTIF 2.0 et les FCPR. Rendements, risques et conditions d'accès.",
    content: `<h2>Qu'est-ce que le private equity ?</h2>
<p>Le <strong>private equity</strong> (capital-investissement) consiste à investir dans des entreprises non cotées en Bourse — des PME en croissance, des startups, ou des entreprises en restructuration. En contrepartie d'un blocage du capital (5-10 ans), les investisseurs visent des rendements supérieurs aux marchés cotés : historiquement <strong>10-15 % par an</strong> pour les meilleurs fonds sur longue période.</p>
<p>Jusqu'à récemment réservé aux investisseurs institutionnels et fortunés, le private equity s'ouvre aux particuliers depuis la réforme ELTIF 2.0 (2024) et l'essor des plateformes d'accès démocratisé.</p>
<h2>Comment investir en private equity en France</h2>
<p>Les véhicules accessibles aux particuliers en 2026 :</p>
<ul>
<li><strong>FCPR</strong> (Fonds Commun de Placement à Risque) : fonds agréés AMF, accessible dès 1 000-10 000 € selon les plateformes. Exonération d'IR sur les plus-values après 5 ans (prélèvements sociaux dus).</li>
<li><strong>ELTIF 2.0</strong> (European Long-Term Investment Fund) : format européen harmonisé, accessible dès 1 €, distribué par les banques et assureurs depuis 2024.</li>
<li><strong>FIP / FCPI</strong> (Fonds d'Investissement de Proximité / d'Innovation) : réduction d'IR de 18-25 % à la souscription, mais performance historique très variable.</li>
<li><strong>Via assurance-vie</strong> : certains contrats permettent d'accéder à des UC private equity (FCPR, fonds de co-investissement).</li>
</ul>
<h2>Risques et précautions</h2>
<p>Le private equity comporte des risques spécifiques :</p>
<ul>
<li><strong>Illiquidité</strong> : le capital est bloqué 5-10 ans. Pas de sortie possible avant l'échéance.</li>
<li><strong>Risque de perte en capital</strong> : les entreprises non cotées peuvent faire faillite. La diversification au sein du fonds atténue ce risque.</li>
<li><strong>Frais élevés</strong> : 1,5-2 % de frais de gestion annuels + commission de performance (20-25 % des gains au-delà d'un hurdle rate).</li>
</ul>
<p>Recommandation : n'allouez pas plus de 5-10 % de votre patrimoine financier au private equity. Priorisez les fonds avec un track record éprouvé (>10 ans) et une politique de co-investissement claire. Le simulateur de patrimoine de simfinly.com intègre le private equity dans l'allocation globale avec projection selon les rendements attendus.</p>`,
  faqs: [
    { q: "Comment un particulier peut-il investir en private equity en France ?", a: "En France, les particuliers accèdent au private equity via : (1) les FCPR (Fonds Communs de Placement à Risques) et FPCI (Fonds Professionnels de Capital Investissement, >100 000 €) ; (2) les unités de compte private equity dans l'assurance-vie (ticket d'entrée 5 000-10 000 €) ; (3) les plateformes de crowdfunding equity (participations directes, risque plus élevé)." },
    { q: "Quels sont les rendements historiques du private equity en France ?", a: "Le private equity affiche historiquement des rendements supérieurs aux marchés cotés : 12-18 % par an en moyenne selon les millésimes et les fonds. Mais ces chiffres moyens masquent une dispersion énorme : les meilleurs fonds peuvent faire 25-30 %, les moins bons 5-8 %. La sélection du fonds est cruciale et les petits investisseurs n'ont accès qu'aux fonds de moindre qualité en général." },
    { q: "Quelle est la fiscalité du private equity en France ?", a: "La fiscalité dépend du véhicule : FCPR via assurance-vie (fiscalité AV standard après 8 ans) ; FCPR en compte-titres (PFU 30 % sur les plus-values) ; FPCI pour professionnels (régime des plus-values professionnelles ou particuliers selon le cadre). Certains FCPR éligibles 'FCPR fiscal' permettent une exonération d'IR sous conditions de conservation 5 ans." },
    { q: "Quelle liquidité offre le private equity ?", a: "Le private equity est fondamentalement illiquide : les fonds ont une durée fixe de 8-12 ans (période d'investissement 3-5 ans, puis cession progressive). Les investisseurs ne peuvent généralement pas récupérer leur capital avant la fin du fonds. Des marchés secondaires existent (cession de parts) mais avec une décote de 10-30 %. Il faut n'investir que du capital dont on n'a pas besoin à court terme." },
  ],
  },
  {
    slug: 'vefa-achat-neuf-plan-2026',
    title: 'VEFA en 2026 : acheter sur plan, garanties et pièges à éviter',
    category: 'Immobilier',
    readTime: 7,
    publishedAt: '2026-06-24T09:00:00Z',
    intro: "La VEFA (Vente en l'état futur d'achèvement) permet d'acheter un bien immobilier neuf avant sa construction. Modalités de paiement, garanties légales et points de vigilance.",
    content: `<h2>Comment fonctionne la VEFA ?</h2>
<p>La <strong>VEFA</strong> (Vente en l'État Futur d'Achèvement) est le cadre légal de l'achat d'un bien immobilier neuf sur plan. L'acheteur signe un contrat de réservation puis l'acte de vente notarié, et paie le bien <strong>progressivement au fur et à mesure de l'avancement des travaux</strong>.</p>
<p>L'échelonnement légal des appels de fonds :</p>
<ul>
<li>5 % à la signature du contrat de réservation</li>
<li>25 % à l'achèvement des fondations</li>
<li>50 % à la mise hors d'eau (toiture)</li>
<li>70 % à l'achèvement des cloisons</li>
<li>95 % à l'achèvement des travaux</li>
<li>5 % (solde) à la livraison et levée des réserves</li>
</ul>
<h2>Les garanties légales de la VEFA</h2>
<p>La VEFA offre un cadre protecteur pour l'acheteur :</p>
<ul>
<li><strong>Garantie financière d'achèvement (GFA)</strong> : obligatoire. En cas de défaillance du promoteur, un organisme garantit l'achèvement du bien ou le remboursement des sommes versées.</li>
<li><strong>Garantie de parfait achèvement</strong> : 1 an après la livraison, le promoteur doit corriger tous les défauts signalés au procès-verbal de réception.</li>
<li><strong>Garantie biennale (bon fonctionnement)</strong> : 2 ans pour les équipements (volets, robinetterie, portail…).</li>
<li><strong>Garantie décennale</strong> : 10 ans pour les défauts compromettant la solidité du bâtiment.</li>
</ul>
<h2>Les avantages fiscaux du neuf</h2>
<p>Acheter en VEFA présente des avantages financiers par rapport à l'ancien :</p>
<ul>
<li><strong>Frais de notaire réduits</strong> : 2-3 % dans le neuf vs 7-8 % dans l'ancien.</li>
<li><strong>Exonération de taxe foncière</strong> : pendant 2 ans après l'achèvement du bien (dans la plupart des communes).</li>
<li><strong>Éligibilité PTZ renforcée</strong> : quotité plus élevée pour les primo-accédants en zones tendues.</li>
<li><strong>TVA réduite à 5,5 %</strong> dans les zones ANRU (Politique de la Ville) pour les primo-accédants sous plafonds de ressources.</li>
</ul>
<h2>Les pièges à éviter</h2>
<p>Principaux risques de la VEFA : retards de livraison (prévoyez 6-12 mois de décalage), qualité inférieure aux promesses du promoteur (visitez des chantiers du même promoteur), modifications unilatérales des plans (vérifiez les clauses du contrat). Au procès-verbal de livraison, notez <strong>toutes les réserves</strong> par écrit — c'est le moment pour obtenir les corrections. Le simulateur emprunt immobilier de simfinly.com intègre le différé de remboursement pendant la période de construction VEFA.</p>`,
  faqs: [
    { q: "Qu'est-ce qu'une VEFA et quelles sont les garanties de l'acheteur ?", a: "La Vente en l'État Futur d'Achèvement (VEFA) est un contrat par lequel l'acheteur acquiert un bien sur plan, avant ou pendant sa construction. Les garanties légales obligatoires : garantie de parfait achèvement (1 an), garantie biennale (2 ans pour les équipements), garantie décennale (10 ans pour la structure), et garantie de livraison hors prix à la date convenue (GFA)." },
    { q: "Quels frais de notaire pour un achat en VEFA ?", a: "Les frais de notaire pour un logement neuf (VEFA) sont réduits par rapport à l'ancien : environ 2 à 3 % du prix d'achat (contre 7-8 % dans l'ancien). Ces frais incluent les droits de mutation (0,715 % en neuf vs 5,81 % en ancien), la rémunération du notaire, et les émoluments. Cette économie est un avantage majeur du neuf vs l'ancien." },
    { q: "Quelles sont les étapes de paiement en VEFA ?", a: "Le paiement en VEFA est échelonné selon l'avancement des travaux : 35 % à l'achèvement des fondations, 70 % à la mise hors d'eau (toiture posée), 95 % à l'achèvement des travaux, 100 % à la livraison (sous réserve de levée des réserves). Si des réserves importantes sont constatées à la livraison, 5 % peuvent être consignés chez notaire." },
    { q: "Peut-on se rétracter après avoir signé un contrat VEFA ?", a: "Oui, pour un logement destiné à la résidence principale, l'acheteur bénéficie d'un délai de rétractation de 10 jours après signature du contrat de réservation. Pendant ce délai, l'acheteur peut se désister sans motif ni pénalité. Après ce délai, la rétractation n'est possible que dans les cas prévus au contrat (non-obtention du prêt, modification substantielle du projet)." },
  ],
  },
  {
    slug: 'location-meublee-lmnp-fiscalite',
    title: 'Location meublée et LMNP en 2026 : micro-BIC ou régime réel, quel choix ?',
    category: 'Immobilier',
    readTime: 6,
    publishedAt: '2026-06-25T09:00:00Z',
    intro: "Louer en meublé ouvre le statut LMNP avec deux régimes fiscaux : micro-BIC (abattement de 50 %) ou régime réel (déduction des charges et amortissement). Quel régime choisir ?",
    content: `<h2>LMNP : les deux régimes fiscaux</h2>
<p>Un loueur meublé non professionnel (recettes < 23 000 € ou < 50 % des revenus du foyer) peut opter entre deux régimes :</p>
<ul>
<li><strong>Micro-BIC</strong> : abattement forfaitaire de 50 % sur les loyers bruts (71 % pour les meublés de tourisme classés). Simple, sans comptabilité, mais moins avantageux si les charges réelles dépassent 50 % des loyers.</li>
<li><strong>Régime réel</strong> : déduction de toutes les charges réelles (intérêts d'emprunt, taxe foncière, assurances, travaux) + <strong>amortissement du bien et des meubles</strong>. Plus complexe (nécessite un expert-comptable) mais souvent très avantageux.</li>
</ul>
<h2>Quand le régime réel est-il plus avantageux ?</h2>
<p>Le régime réel surpasse le micro-BIC si vos charges réelles (incluant les amortissements) dépassent 50 % des loyers. Dans la pratique, avec un crédit immobilier en cours, les intérêts + amortissement dépassent presque toujours 50 % sur les premières années — le régime réel est alors systématiquement optimal.</p>
<p>Exemple : loyers annuels = 12 000 €. Charges réelles (intérêts, taxe foncière, assurance, copro) = 4 000 €. Amortissement annuel du bien = 5 000 €. Total = 9 000 €. Résultat imposable = 12 000 − 9 000 = 3 000 € (vs 6 000 € en micro-BIC). Économie d'impôt à 30 % de TMI : 900 €/an.</p>
<h2>Le seuil de basculement micro/réel</h2>
<p>Depuis 2023, le seuil du micro-BIC est à 77 700 € de loyers annuels (au-delà, le régime réel est obligatoire). En dessous, vous pouvez choisir. Le choix se fait sur la déclaration de revenus — l'option pour le réel est tacitement reconduite chaque année.</p>
<h2>La question de l'expert-comptable</h2>
<p>Le régime réel LMNP nécessite une déclaration 2031 (BIC réel) avec un bilan et un compte de résultat. Un expert-comptable spécialisé coûte 500-1 200 €/an mais optimise les amortissements, assure la conformité et gère les reports de déficits. Ce coût est lui-même déductible. Le simulateur rendement locatif de simfinly.com compare la rentabilité nette micro-BIC vs réel selon vos paramètres.</p>`,
  faqs: [
    { q: "Quels meubles obligatoires pour louer en meublé en France ?", a: "La liste légale des meubles obligatoires (décret 2015) comprend : literie avec couette/couverture, volets/rideaux occultants dans les chambres, plaques de cuisson, four (micro-ondes accepté), réfrigérateur avec compartiment congélateur, vaisselle, ustensiles de cuisine, table, sièges, étagères de rangement, luminaires, matériel d'entretien. Toute location sans ces éléments est juridiquement une location nue." },
    { q: "Quel bail utilise-t-on pour une location meublée ?", a: "La location meublée utilise un bail de 1 an renouvelable (contre 3 ans en vide). Pour les étudiants, le bail peut être de 9 mois. Le préavis du locataire est de 1 mois seulement (contre 3 mois en vide), ce qui offre plus de flexibilité au locataire. Le propriétaire doit donner 3 mois de préavis pour reprendre le bien." },
    { q: "Le statut LMNP est-il cumulable avec une activité salariée ?", a: "Oui, le statut LMNP est parfaitement compatible avec une activité salariée principale. Les recettes locatives meublées (BIC) sont déclarées séparément des salaires. En régime réel, les déficits BIC (charges + amortissement > loyers) sont reportables sur les futurs BIC mais non imputables sur les salaires. Le seuil LMNP (< 23 000 € de loyers ou < 50 % des revenus) doit être respecté." },
    { q: "Quelle est la différence entre LMNP et LMP (Loueur Meublé Professionnel) ?", a: "Le LMP (Loueur Meublé Professionnel) s'applique si les recettes meublées dépassent 23 000 €/an ET représentent plus de 50 % des revenus du foyer. Le LMP offre : imputation des déficits sur le revenu global (pas seulement les BIC futurs), exonération d'IFI sous conditions, et régime des plus-values professionnelles à la vente. Mais le LMP génère des cotisations sociales TNS (environ 40 % des bénéfices)." },
  ],
  },

  // === Vague 3 — Complément pour atteindre 50 articles ===
  {
    slug: 'investir-bourse-long-terme-strategie',
    title: 'Investir en Bourse sur le long terme : stratégies et erreurs à éviter',
    category: 'Finances',
    readTime: 7,
    publishedAt: '2026-06-26T09:00:00Z',
    intro: "Patience, diversification et discipline : les trois piliers de l'investissement boursier long terme. Comment construire un portefeuille résilient et éviter les pièges classiques.",
    content: `<h2>Pourquoi l'horizon long terme change tout</h2>
<p>Sur une période de 1-3 ans, les marchés boursiers peuvent perdre 40-50 % et mettre des années à se rétablir. Sur 20-30 ans, <strong>aucune période historique n'a jamais abouti à une perte</strong> sur un portefeuille diversifié (données MSCI World 1969-2026). C'est pourquoi l'horizon est le premier facteur d'une stratégie actions : ne misez en Bourse que les capitaux dont vous n'aurez pas besoin avant 10 ans minimum.</p>
<p>L'effet des intérêts composés devient exponentiel sur de longues périodes. 10 000 € investis à 7 % annuel donnent : 19 671 € après 10 ans, 38 697 € après 20 ans, 76 123 € après 30 ans. Chaque décennie supplémentaire double (grossièrement) le capital.</p>
<h2>La diversification : la seule règle absolue</h2>
<p>La diversification réduit le risque sans sacrifier le rendement attendu. Les piliers :</p>
<ul>
<li><strong>Géographique</strong> : MSCI World (États-Unis + Europe + Japon) > CAC 40 seul</li>
<li><strong>Sectorielle</strong> : technology + santé + industrie + finance > tech seule</li>
<li><strong>Temporelle</strong> : investir chaque mois (DCA) > investir en une seule fois</li>
<li><strong>Par classe d'actif</strong> : actions + immobilier (SCPI) + obligations > actions seules pour les profils défensifs</li>
</ul>
<h2>Les erreurs comportementales les plus coûteuses</h2>
<p>Les études DALBAR (comportement des investisseurs) montrent que les particuliers obtiennent en moyenne 3-4 % de moins que le marché à cause d'erreurs comportementales :</p>
<ul>
<li><strong>Vendre lors des krachs</strong> : cristallise les pertes et rate le rebond. Les 10 meilleurs jours des 20 dernières années ont contribué à plus de 50 % de la performance totale.</li>
<li><strong>Market timing</strong> : personne ne sait prévoir les marchés à court terme — même les professionnels.</li>
<li><strong>Surpondérer son pays</strong> (home bias) : les Français sur-allouent au CAC 40 qui représente <2 % de la capitalisation mondiale.</li>
</ul>
<h2>La stratégie simple qui bat 90 % des gérants</h2>
<p>Investir mensuellement dans un ETF MSCI World via un PEA, ne jamais vendre lors des baisses, rééquilibrer une fois par an. C'est tout. Cette stratégie passive bat historiquement 80-90 % des fonds actifs sur 10 ans, avec des frais 10× inférieurs. Le simulateur d'épargne de simfinly.com projette votre portefeuille selon cette approche avec différents rendements et horizons.</p>`,
    faqs: [
      { q: "Quelle est la meilleure stratégie d'investissement en bourse sur le long terme ?", a: "La stratégie passive avec DCA (investissement mensuel régulier) dans des ETF indiciels diversifiés bat historiquement 80-90 % des fonds gérés activement sur 10+ ans, avec des frais 10× inférieurs. Concrètement : ouvrir un PEA + assurance-vie, investir mensuellement dans un ETF MSCI World et un ETF obligataire selon son allocation cible, rééquilibrer annuellement, ne jamais vendre en cas de krach. L'horizon est la variable la plus importante : au-delà de 10 ans, la probabilité de gain est supérieure à 95 % sur indices diversifiés." },
      { q: "Comment éviter les principales erreurs des investisseurs débutants ?", a: "Les 4 erreurs les plus courantes : (1) Vendre lors des baisses — les marchés se reprennent toujours, et les 10 meilleurs jours des 20 dernières années représentent 50 %+ de la performance totale ; (2) Trop concentrer sur une action ou un secteur — un ETF monde évite ce piège ; (3) Market timing — personne ne sait prévoir les marchés à court terme ; (4) Frais trop élevés — un ETF à 0,2 % l'an vs un fonds actif à 2 % fait une différence de 50 000 € sur 100 000 € investis sur 20 ans à 7 % annuel." },
    ],
  },
  {
    slug: 'per-vs-assurance-vie-comparaison-2026',
    title: 'PER vs assurance-vie en 2026 : quel placement choisir selon votre situation ?',
    category: 'Épargne',
    readTime: 7,
    publishedAt: '2026-06-27T09:00:00Z',
    intro: "PER et assurance-vie sont complémentaires plutôt que concurrents. Fiscalité à l'entrée vs à la sortie, disponibilité, succession : comment choisir selon votre profil et vos objectifs.",
    content: `<h2>Le PER et l'assurance-vie : deux logiques différentes</h2>
<p>Le <strong>PER</strong> (Plan d'Épargne Retraite) offre un avantage fiscal à l'<em>entrée</em> : les versements sont déductibles du revenu imposable. En contrepartie, les retraits à la retraite sont imposables (revenus + prélèvements sociaux sur les plus-values). Le PER est donc optimal si votre TMI actuelle est plus élevée que celle prévue à la retraite.</p>
<p>L'<strong>assurance-vie</strong> offre un avantage fiscal à la <em>sortie</em> : pas de déduction à l'entrée, mais les retraits après 8 ans bénéficient d'un abattement annuel (4 600 €/personne) et d'une fiscalité réduite (7,5 % + 17,2 % PS). L'assurance-vie est plus flexible (retraits possibles à tout moment sans pénalité) et plus avantageuse en succession (abattement de 152 500 € par bénéficiaire).</p>
<h2>Tableau comparatif PER vs assurance-vie</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px">
<thead><tr style="background:#EAF0FF"><th style="padding:8px;text-align:left;border:1px solid #d6e2fb">Critère</th><th style="padding:8px;text-align:center;border:1px solid #d6e2fb">PER</th><th style="padding:8px;text-align:center;border:1px solid #d6e2fb">Assurance-vie</th></tr></thead>
<tbody>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Avantage fiscal</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">À l'entrée (déduction IR)</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">À la sortie (abattement + taux réduit)</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">Disponibilité</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">Bloqué jusqu'à la retraite (sauf cas légaux)</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">Disponible à tout moment</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Succession</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">Droits de succession classiques</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">152 500 € par bénéficiaire hors droits</td></tr>
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb">Idéal pour</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">TMI élevée (≥ 30 %), retraite lointaine</td><td style="padding:8px;text-align:center;border:1px solid #e5e7eb">Flexibilité, transmission, TMI faible</td></tr>
</tbody></table>
<h2>La stratégie optimale selon votre situation</h2>
<ul>
<li><strong>TMI 30 % ou plus, retraite à 15+ ans</strong> : PER prioritaire, puis assurance-vie pour la liquidité et la succession.</li>
<li><strong>TMI 11 %</strong> : assurance-vie privilégiée (l'avantage fiscal du PER est faible).</li>
<li><strong>Objectif succession</strong> : assurance-vie pour les versements avant 70 ans (abattement de 152 500 €/bénéficiaire).</li>
<li><strong>Retraite dans moins de 10 ans</strong> : les deux selon votre TMI, mais privilégiez la liquidité.</li>
</ul>
<h2>La complémentarité idéale</h2>
<p>Dans une stratégie optimale : PER pour défiscaliser les années à fort salaire, assurance-vie pour la liquidité et la transmission. Ces deux enveloppes se complètent naturellement — la majorité des épargnants français en phase d'accumulation patrimoniale ont intérêt à ouvrir et alimenter les deux. Le comparateur simfinly.com simule l'économie fiscale et le capital final pour votre situation personnelle.</p>`,
    faqs: [
      { q: "PER ou assurance-vie : lequel choisir en 2026 ?", a: "La réponse dépend de votre TMI et de vos objectifs : si votre TMI est ≥ 30 % et que vous n'avez pas besoin des fonds avant la retraite, le PER est généralement supérieur (déduction fiscale immédiate = économie de 30-45 % sur chaque euro versé). Si vous avez besoin de flexibilité, si votre TMI est faible (0-11 %), ou si la transmission est un objectif clé, l'assurance-vie est préférable (disponibilité permanente, abattement de 152 500 € par bénéficiaire). La combinaison PER + assurance-vie est souvent la stratégie optimale." },
      { q: "Peut-on sortir d'un PER avant la retraite ?", a: "Oui, dans 6 cas de déblocage anticipé légaux : (1) Acquisition de la résidence principale — le plus utilisé ; (2) Invalidité (2e ou 3e catégorie) du titulaire, du conjoint ou des enfants ; (3) Décès du conjoint ou du partenaire PACS ; (4) Liquidation judiciaire de l'entreprise (TNS) ; (5) Situation de surendettement ; (6) Expiration des droits à l'assurance chômage. En dehors de ces cas, le PER est bloqué jusqu'à la retraite." },
    ],
  },


  {
    slug: 'french-pension-system-explained-2026',
    title: 'French Pension System Explained 2026 — Complete Guide for Expats',
    category: 'Retraite',
    readTime: 8,
    publishedAt: '2026-01-15T10:00:00Z',
    intro: "France has one of the world's most complex pension systems. This guide explains the three-tier structure (CNAV, Agirc-Arrco, optional savings), retirement ages, qualifying conditions, and how to calculate your French pension as an expat or salaried employee.",
    content: `<h2>How the French Pension System Works</h2>
<p>France operates a <strong>pay-as-you-go (répartition)</strong> pension system: current workers' contributions fund today's retirees. There is no individual savings account — your pension is a collective promise backed by the state and social partners.</p>
<p>The system has <strong>three tiers</strong>:</p>
<ul>
<li><strong>Tier 1 — CNAV (basic pension)</strong>: For private-sector employees. Maximum pension is 50% of your average salary over your 25 best years, capped at the PASS ceiling (€47,100 in 2026).</li>
<li><strong>Tier 2 — Agirc-Arrco (complementary pension)</strong>: Points-based system for private employees. You accumulate points throughout your career; each point is worth €1.4159/year in 2026.</li>
<li><strong>Tier 3 — Voluntary savings (PER)</strong>: Tax-deductible retirement savings account. Contributions reduce your taxable income in the year they are made.</li>
</ul>
<h2>Retirement Age in France (2026)</h2>
<p>Following the controversial 2023 reform (loi Borne), the legal retirement age is being progressively raised from 62 to <strong>64 years</strong> for those born in 1968 or later. The key dates:</p>
<ul>
<li>Born before 1 September 1961: legal retirement age = 62</li>
<li>Born 1961–1967: progressive increase (+3 months per generation)</li>
<li>Born 1968 and later: legal retirement age = <strong>64 years</strong></li>
</ul>
<p>However, the legal age alone does not guarantee a full pension. You must also have accumulated the required number of quarters (<em>trimestres</em>) — 172 quarters (43 years) for those born in 1968+.</p>
<h2>How Your French Pension Is Calculated</h2>
<p>The CNAV basic pension formula is: <strong>Pension = SAM × rate × (validated quarters / required quarters)</strong></p>
<ul>
<li><strong>SAM</strong> (Salaire Annuel Moyen): average of your 25 highest earnings years, capped at the PASS each year</li>
<li><strong>Rate</strong>: maximum 50% (full rate / taux plein). Reduced by 1.25% per missing quarter (décote), or increased by 1.25% per extra quarter after full rate (surcote)</li>
<li><strong>Pro-rata</strong>: quarters validated vs. quarters required for your generation</li>
</ul>
<p>Example: SAM €35,000 × 50% × (168/172) = €16,860/year = <strong>€1,405/month</strong> before social contributions.</p>
<h2>What Counts as a Quarter (Trimestre)?</h2>
<p>You validate one quarter for every €1,940 earned (2026), up to 4 quarters per year regardless of when you earned them. Periods that also count as quarters include: unemployment benefits (up to 4/year), maternity/paternity leave, sick leave, military service, and disability.</p>
<h2>Rights for Expats and Cross-Border Workers</h2>
<p>France has bilateral social security agreements with 40+ countries including the US, UK, Canada, and all EU member states. These agreements allow <em>totalization</em>: periods worked in both countries are combined to determine eligibility, though each country pays its own pension separately.</p>
<p>If you worked in France and another EU country, your rights are protected under EU regulation 883/2004. Use our <a href="/simulateurs/cnav">CNAV simulator</a> to estimate your French pension based on years worked in France.</p>
<h2>How to Check Your French Pension Rights</h2>
<p>Create an account on <strong>info-retraite.fr</strong> — this official portal aggregates your pension rights across all French regimes. You can view your career record (relevé de carrière), correct errors, and simulate your future pension for different retirement ages.</p>`,
    faqs: [
      { q: "At what age can I retire in France if I was born in 1970?", a: "If you were born in 1970, your legal retirement age in France is 64 years (since the 2023 Borne reform). You will need 172 quarters (43 years) of contributions for the full pension rate. Without 172 quarters, a reduction (décote) of 1.25% per missing quarter applies until the automatic full rate at age 67." },
      { q: "Can I receive a French pension if I only worked in France for 10 years?", a: "Yes. France has no minimum period for accumulating pension rights — every quarter worked counts. For 10 years (40 quarters) worked in France, you would receive a pro-rated French pension based on 40/172 quarters. If your home country has a bilateral agreement with France, the periods may be combined to determine eligibility age." },
      { q: "What is the difference between CNAV and Agirc-Arrco?", a: "CNAV is the basic (tier 1) pension for private-sector employees — calculated as a percentage of your average salary. Agirc-Arrco is the mandatory complementary (tier 2) pension — calculated in points accumulated throughout your career. Both are paid in retirement and together represent the bulk of a French salaried employee's pension income." },
      { q: "How much will I get from the French pension system?", a: "The average total pension in France is around €1,500/month gross (DREES 2024 data). For cadres (managers), the median is closer to €2,100/month. The replacement rate (pension vs. final salary) averages 63% across all workers. Use the simfinly.com CNAV simulator to get a personal estimate based on your specific career." },
    ],
  },
  {
    slug: 'fire-movement-france-2026',
    title: 'FIRE Movement in France 2026 — Financial Independence Guide',
    category: 'FIRE',
    readTime: 7,
    publishedAt: '2026-02-10T10:00:00Z',
    intro: "How to achieve Financial Independence and Retire Early (FIRE) in France: the 4% rule adapted to French taxes, the best tax-efficient wrappers (PEA, assurance-vie, PER), and realistic FIRE numbers for French residents.",
    content: `<h2>What Is FIRE and Why France Changes the Math</h2>
<p>The FIRE movement — Financial Independence, Retire Early — aims to accumulate a portfolio large enough that investment returns cover living expenses indefinitely. The classic rule: save 25× your annual expenses, then withdraw 4% per year.</p>
<p>In France, several factors require adjusting the standard formula:</p>
<ul>
<li><strong>Social contributions (prélèvements sociaux)</strong>: 17.2% on investment income and capital gains — higher than most countries</li>
<li><strong>Income tax on gains</strong>: 12.8% flat tax (PFU) or progressive income tax scale — your choice</li>
<li><strong>Longer life expectancy</strong>: French men live to 80, women to 85+ — a 40-year early retirement is realistic, requiring a more conservative withdrawal rate</li>
</ul>
<p>For France, most FIRE practitioners target a <strong>3 to 3.5% withdrawal rate</strong> rather than 4%, meaning a portfolio of 28–33× annual expenses instead of 25×.</p>
<h2>The Best French Tax Wrappers for FIRE</h2>
<p><strong>PEA (Plan d'Épargne en Actions)</strong>: After 5 years, capital gains and dividends are exempt from income tax (only 17.2% social contributions remain). Annual contribution ceiling: €150,000. Best for equity investing. The PEA is arguably the most tax-efficient long-term equity wrapper in Europe.</p>
<p><strong>Assurance-vie</strong>: After 8 years, withdrawals benefit from a €4,600 annual allowance (€9,200 for couples) on gains — fully tax-exempt up to this amount. Gains above this pay 7.5% income tax + 17.2% social contributions. No contribution ceiling. Best for asset diversification and estate planning.</p>
<p><strong>PER (Plan d'Épargne Retraite)</strong>: Contributions are tax-deductible (up to ~10% of income). Withdrawals at retirement are taxed as income. Best for high earners in their 40s-50s who want to lower their tax bill now.</p>
<h2>Calculating Your FIRE Number in France</h2>
<p>Step 1 — Estimate your annual expenses in retirement. Include: rent/mortgage, food, transport, health, travel, and a buffer for taxes on withdrawals.</p>
<p>Step 2 — Multiply by 28–33 (conservative FIRE for France). Example: €30,000/year expenses × 30 = <strong>€900,000 portfolio target</strong>.</p>
<p>Step 3 — Factor in the French state pension. Even if you retire at 45, you accumulate pension rights until you stop working. The state pension received at 64+ reduces how much you need to draw from your portfolio — effectively lowering your FIRE number.</p>
<p>Use the <a href="/simulateurs/fire">simfinly FIRE simulator</a> to calculate your personal FIRE number with French tax assumptions built in.</p>
<h2>FIRE Strategies That Work in France</h2>
<p><strong>Lean FIRE</strong>: Target €20,000–25,000/year (frugal lifestyle), FIRE number ~€600,000–750,000. Achievable in 12–18 years with a 50% savings rate from a median salary.</p>
<p><strong>Fat FIRE</strong>: Target €50,000–80,000/year, FIRE number €1.5M–2.5M. Typically requires a high income or very long accumulation phase.</p>
<p><strong>Barista FIRE</strong>: Partial independence — cover 60–70% of expenses from portfolio, supplement with part-time income. Dramatically reduces the required portfolio size and preserves French social benefits (health insurance, pension rights).</p>`,
    faqs: [
      { q: "What is the 4% rule and does it work in France?", a: "The 4% rule (Trinity study, 1998) says a portfolio of 25× annual expenses should last 30 years with 4% annual withdrawals. In France, the effective withdrawal rate after French social contributions (17.2%) and income tax is lower. Most French FIRE practitioners use 3–3.5% (i.e., 28–33× expenses) for a 40+ year retirement horizon." },
      { q: "Which is better for FIRE in France: PEA or assurance-vie?", a: "Both complement each other. The PEA is better for equity-heavy portfolios (lower cost, tax-free after 5 years). Assurance-vie is better for diversified allocations including bonds, real estate (SCPIs), and for estate planning. An optimal French FIRE portfolio typically uses both: PEA maxed first for equities, then assurance-vie for the remainder." },
      { q: "Can I retire early in France and still receive a French state pension later?", a: "Yes. If you stop working at 40, you keep all the pension quarters already validated. You will simply receive a smaller French pension at 64 (or 67 for full rate without enough quarters) proportional to the quarters you accumulated. Many FIRE practitioners in France count on the state pension as a safety net that reduces sequence-of-returns risk in their 60s onward." },
    ],
  },
  {
    slug: 'french-income-tax-explained-2026',
    title: 'French Income Tax 2026 — Complete Guide for Expats and Residents',
    category: 'Fiscalité',
    readTime: 7,
    publishedAt: '2026-03-05T10:00:00Z',
    intro: "How French income tax works in 2026: progressive tax brackets, the quotient familial system, deductions available to expats, and how to use simfinly's free income tax simulator to calculate your exact bill.",
    content: `<h2>How French Income Tax Works</h2>
<p>France uses a <strong>progressive income tax</strong> (impôt sur le revenu, IR) with 5 brackets. Unlike many countries, France taxes the household (<em>foyer fiscal</em>) rather than the individual. The tax base is divided by a family quotient (number of "parts") before the rate is applied, then multiplied back — this system benefits families with children and significantly reduces tax for couples.</p>
<h2>2026 Income Tax Brackets</h2>
<table>
<tr><th>Taxable income per part</th><th>Tax rate</th></tr>
<tr><td>Up to €11,497</td><td>0%</td></tr>
<tr><td>€11,497 – €29,315</td><td>11%</td></tr>
<tr><td>€29,315 – €83,823</td><td>30%</td></tr>
<tr><td>€83,823 – €180,294</td><td>41%</td></tr>
<tr><td>Above €180,294</td><td>45%</td></tr>
</table>
<p>These rates apply to your <em>net taxable income per part</em>. Your marginal rate (TMI — Taux Marginal d'Imposition) is the rate applied to your last euro of income. Your average rate is always lower than your TMI.</p>
<h2>The Quotient Familial — Why Couples and Families Pay Less</h2>
<p>A single person = 1 part. A married or PACS couple = 2 parts. Each child adds 0.5 parts (first two children) or 1 part (from the third child). This significantly reduces tax:</p>
<ul>
<li>Single, €60,000 income: income/1 part = €60,000 → pays ~€10,000 tax</li>
<li>Married couple, same €60,000 combined: income/2 parts = €30,000/part → pays ~€3,600 total tax</li>
</ul>
<h2>Social Contributions (Prélèvements Sociaux)</h2>
<p>In addition to income tax, France levies social contributions on investment income and capital gains (but not on earned salary, which is covered separately via payroll contributions):</p>
<ul>
<li><strong>CSG</strong>: 9.2% on capital gains and investment income</li>
<li><strong>CRDS</strong>: 0.5%</li>
<li><strong>Solidarity levy</strong>: 7.5%</li>
<li><strong>Total prélèvements sociaux</strong>: <strong>17.2%</strong></li>
</ul>
<p>These are separate from income tax. Capital gains on equities are taxed at 12.8% income tax + 17.2% social contributions = 30% flat (PFU — Prélèvement Forfaitaire Unique). You can opt for the progressive income tax scale instead if it is more favorable.</p>
<h2>Key Deductions Available</h2>
<p><strong>10% professional expenses deduction</strong>: Applied automatically before calculating your taxable income (capped at €14,426). Most employees benefit from this without filing anything.</p>
<p><strong>PER contributions</strong>: Deductible from income up to 10% of your net professional income (max ~€35,000 for 2026). A major tax lever for high earners.</p>
<p><strong>Charitable donations</strong>: 66–75% tax credit on eligible donations.</p>
<p><strong>Energy renovation tax credits</strong> (MaPrimeRénov): Direct subsidies, not deductions, for home energy improvements.</p>
<h2>How to File Your French Income Tax Return</h2>
<p>French residents must file their return online at impots.gouv.fr. The deadline is typically in late May–June, with the exact date varying by département. First-time filers and new arrivals in France must create an account on impots.gouv.fr and declare their worldwide income if they are French tax residents.</p>
<p>Use the <a href="/simulateurs/impot-revenu">simfinly income tax simulator</a> to calculate your French tax bill, effective rate, and marginal rate for 2026 based on your specific household situation.</p>`,
    faqs: [
      { q: "At what income level do you start paying income tax in France?", a: "In 2026, a single person (1 tax part) starts paying income tax when their net taxable income exceeds €11,497. In practice, after the automatic 10% professional expenses deduction, a gross salary of approximately €12,800/year triggers income tax for a single person." },
      { q: "How much income tax will I pay on €50,000 salary in France?", a: "A single employee earning €50,000 gross salary pays approximately €4,000–5,500 in income tax (after the 10% professional deduction, quotient of 1 part). The exact amount depends on other deductions (PER, childcare, etc.). Use the simfinly income tax simulator for a precise calculation including marginal rate and quotient." },
      { q: "Do expats pay French income tax on foreign income?", a: "If you are a French tax resident (living in France for more than 183 days/year, or with your main economic interests in France), you are taxed on your worldwide income. However, France has double-tax treaties with 130+ countries to prevent being taxed twice. Income earned in your home country is typically reported in France but credited with foreign tax paid." },
      { q: "What is the PFU (flat tax) in France?", a: "The PFU (Prélèvement Forfaitaire Unique), also called flat tax, is a 30% combined rate applied to investment income: 12.8% income tax + 17.2% social contributions (prélèvements sociaux). It applies to dividends, interest, and capital gains from securities. You can opt out of the flat tax and use the progressive income tax scale if your marginal rate is below 30%." },
    ],
  },

  {
    slug: 'buying-property-france-expat-guide-2026',
    title: 'Buying Property in France as an Expat (2026 Guide)',
    intro: 'A comprehensive guide for foreigners and expats looking to buy real estate in France — from notaire fees to mortgage rules.',
    category: 'Immobilier',
    readTime: 9,
    publishedAt: '2026-03-10',
    lang: 'en',
    body: `<p>France consistently attracts foreign buyers — from British retirees to American professionals relocating for work. But buying property here as a non-resident comes with specific rules, costs, and processes that differ significantly from the UK, US, or other markets. This guide covers everything you need to know to buy property in France in 2026.</p>
<h2>Can Foreigners Buy Property in France?</h2>
<p>Yes, there are <strong>no restrictions on foreigners buying property in France</strong>, whether EU citizens or non-EU nationals. You do not need residency, a visa, or a work permit to purchase property. The same legal process and protections apply to all buyers regardless of nationality.</p>
<h2>The Buying Process: Step by Step</h2>
<p><strong>Step 1 — Find a property and make an offer.</strong> Once your offer is accepted verbally, you move to a preliminary contract.</p>
<p><strong>Step 2 — Compromis de vente (preliminary contract).</strong> This legally binding document locks in the price and conditions. You typically pay a 5–10% deposit. You have a 10-day cooling-off period after signing.</p>
<p><strong>Step 3 — Mortgage approval (if financed).</strong> French banks require mortgage approval before the final sale can proceed. This typically takes 6–8 weeks.</p>
<p><strong>Step 4 — Acte authentique (final deed).</strong> Signed before a notaire (a public officer, not a private lawyer). Ownership transfers at this moment, and you receive the keys.</p>
<p>The total process typically takes <strong>3 to 4 months</strong> from offer to completion.</p>
<h2>Notaire Fees (Frais de Notaire)</h2>
<p>In France, the buyer pays the notaire fees, which include government transfer taxes and registration fees. For existing (old) properties, these fees run <strong>7–8% of the purchase price</strong>. For new-build properties (less than 5 years old), fees are much lower: <strong>2–3%</strong>.</p>
<p>On a €300,000 existing property, expect to pay €21,000–24,000 in notaire fees on top of the purchase price. Use the <a href="/simulateurs/frais-notaire">simfinly notaire fees simulator</a> for an exact calculation.</p>
<h2>Getting a French Mortgage as a Foreigner</h2>
<p>French banks do lend to foreigners, but conditions differ:</p>
<ul>
<li><strong>Non-residents</strong>: Many French banks require a 20–30% down payment (vs 10% for residents). Some specialist lenders go to 80% LTV for non-residents.</li>
<li><strong>Income documentation</strong>: French banks assess your total debt-to-income ratio. Your monthly total debt repayments (including the new mortgage) should not exceed 35% of your net income.</li>
<li><strong>Currency risk</strong>: If you earn in non-euro currency, banks may apply a haircut to your income when calculating eligibility.</li>
<li><strong>Life insurance</strong>: French mortgages require life insurance (assurance décès-invalidité). This adds 0.1–0.4% per year to your effective borrowing cost.</li>
</ul>
<p>Specialist brokers (like CAFPI, Pretto, or Meilleurtaux) can negotiate across multiple lenders, which is particularly useful for foreign buyers. Use the <a href="/simulateurs/credit-immobilier">simfinly mortgage simulator</a> to model your repayments.</p>
<h2>Property Taxes You Will Pay</h2>
<p><strong>Taxe foncière</strong>: Annual property tax paid by the owner, regardless of whether you rent it out. Varies widely by commune — roughly €1,500–4,000/year for a typical apartment in a major city.</p>
<p><strong>Taxe d'habitation</strong>: Abolished for primary residences as of 2023. Still applies to secondary residences and holiday homes — at up to 60% surcharge in "zone tendue" (high-demand areas).</p>
<p><strong>IFI (Impôt sur la Fortune Immobilière)</strong>: Applies if your net real estate assets in France exceed €1.3 million. Rates range from 0.5% to 1.5%.</p>
<h2>Buying to Let: Rental Income Taxation</h2>
<p>Non-residents who rent out French property are taxed in France on rental income:</p>
<ul>
<li><strong>Unfurnished rental (location nue)</strong>: Income taxed under "revenus fonciers". Micro-foncier regime (flat 30% deduction) available if gross rent ≤ €15,000/year. Otherwise régime réel (deduct actual expenses, mortgage interest, works).</li>
<li><strong>Furnished rental (LMNP)</strong>: More favorable. Régime micro-BIC (50% deduction) or régime réel (depreciate the property and furniture). Very popular with foreign investors.</li>
<li><strong>Non-residents</strong> pay a minimum 20% income tax rate on French rental income, plus 17.2% social contributions (reduced to 7.5% for EU/EEA residents covered by a social security system).</li>
</ul>
<h2>Key Mistakes Foreign Buyers Make</h2>
<ul>
<li>Forgetting notaire fees in their budget (7–8% is a big addition)</li>
<li>Not getting a French bank account early (required for mortgage and utility setup)</li>
<li>Skipping the DPE energy rating check (new 2025 rules prohibit renting properties rated G)</li>
<li>Underestimating the taxe d'habitation for secondary residences in tourist zones</li>
</ul>
<p>Ready to model your purchase? Use the <a href="/simulateurs/frais-notaire">notaire fees calculator</a> and the <a href="/simulateurs/credit-immobilier">mortgage simulator</a> to build your full buying budget.</p>`,
    faqs: [
      { q: "Can a British citizen buy property in France after Brexit?", a: "Yes. Brexit did not change property ownership rights for British nationals in France. UK citizens can still buy freely, own property, and rent it out. The main change is that UK citizens can now spend a maximum of 90 days in any 180-day period in France without a visa — this affects how long you can stay, not your right to own property." },
      { q: "How much does it cost to buy a property in France?", a: "On top of the purchase price, budget 7–8% for notaire fees (transfer taxes + legal fees) for existing properties, or 2–3% for new-build properties under 5 years old. You also need a bank account, and possibly a mortgage arrangement fee (0.5–1% of loan amount). The simfinly notaire fees simulator gives exact figures by property price and type." },
      { q: "Do I need a French bank account to buy property?", a: "Yes, a French bank account is effectively required for the property purchase process — payments to the notaire must come from a French account. You should open an account several months before you plan to buy. BNP Paribas, Société Générale, and Crédit Agricole all offer non-resident accounts. Some challenger banks (N26, Wise) also have IBAN that can be accepted." },
      { q: "What is the role of the notaire in a French property transaction?", a: "The notaire is a state-appointed legal officer (not a private lawyer) who oversees property transfers in France. Unlike in the UK where solicitors work adversarially, a single notaire can represent both buyer and seller. The notaire verifies title, checks for mortgages or liens, collects and distributes funds, and registers the new ownership with the land registry (Service de la Publicité Foncière). Their fees are regulated by law." },
    ],
  },
  {
    slug: 'assurance-vie-france-complete-guide-2026',
    title: 'French Assurance-Vie: The Complete Guide for Expats (2026)',
    intro: 'Assurance-vie is France\'s most popular savings vehicle — with unique tax benefits after 8 years. Here\'s how it works for expats and foreign investors.',
    category: 'Épargne',
    readTime: 8,
    publishedAt: '2026-04-05',
    lang: 'en',
    body: `<p>Assurance-vie is the most widely held financial product in France, with over €1,900 billion in assets under management. Despite the name ("life insurance"), it functions primarily as an investment account with exceptional tax advantages — especially after 8 years. For expats living in France, understanding assurance-vie is essential for tax-efficient wealth management.</p>
<h2>What Is an Assurance-Vie?</h2>
<p>An assurance-vie is a contract between you (the subscriber) and an insurance company. You invest money, which grows tax-deferred inside the contract. You can invest in:</p>
<ul>
<li><strong>Fonds en euros</strong>: A guaranteed capital fund that earns roughly 2.5–4% per year (2026 rate varies by insurer). Zero risk — capital is guaranteed.</li>
<li><strong>Unités de compte (UC)</strong>: Investment units linked to equities, bonds, real estate (SCPI), ETFs. Higher return potential, no capital guarantee.</li>
<li><strong>Mixed allocation</strong>: Most modern contracts let you split between fonds en euros and UC.</li>
</ul>
<p>You can withdraw at any time — assurance-vie is not a locked product. But the tax treatment changes dramatically based on how long you've held the contract.</p>
<h2>The Tax Advantage: Why 8 Years Matters</h2>
<p>When you withdraw money from assurance-vie, only the <em>gains</em> portion is taxed (not your invested capital). The tax rate depends on the contract's age:</p>
<table>
<thead><tr><th>Contract age</th><th>Tax on gains</th><th>Social contributions</th><th>Total</th></tr></thead>
<tbody>
<tr><td>Under 4 years</td><td>12.8% (PFU)</td><td>17.2%</td><td>30%</td></tr>
<tr><td>4–8 years</td><td>12.8% (PFU)</td><td>17.2%</td><td>30%</td></tr>
<tr><td>Over 8 years</td><td>7.5% above allowance</td><td>17.2%</td><td>24.7%</td></tr>
</tbody>
</table>
<p><strong>After 8 years</strong>, you also benefit from an annual tax allowance on gains: <strong>€4,600/year</strong> for a single person, <strong>€9,200/year</strong> for a couple. This means you can withdraw gains up to this amount completely tax-free (still subject to 17.2% social contributions).</p>
<h2>Succession Benefits</h2>
<p>Assurance-vie is exceptional for estate planning in France:</p>
<ul>
<li>For funds invested <strong>before age 70</strong>: each beneficiary receives up to <strong>€152,500 free of succession tax</strong>. Above this, a flat rate of 20% applies (31.25% above €700,000).</li>
<li>For funds invested <strong>after age 70</strong>: €30,500 total allowance shared across all beneficiaries; gains remain tax-free regardless.</li>
<li>The contract <strong>bypasses the normal inheritance rules</strong> (réserve héréditaire) to a significant extent, allowing you to leave money to non-family members or step-children without inheritance tax penalties.</li>
</ul>
<h2>Assurance-Vie vs PEA vs PER</h2>
<table>
<thead><tr><th></th><th>Assurance-Vie</th><th>PEA</th><th>PER</th></tr></thead>
<tbody>
<tr><td>Contribution limit</td><td>None</td><td>€150,000</td><td>~10% of income</td></tr>
<tr><td>Investment universe</td><td>Fonds €, UC (global)</td><td>European equities only</td><td>Fonds €, UC (global)</td></tr>
<tr><td>Tax-free after</td><td>8 years</td><td>5 years</td><td>Retirement (locked until then)</td></tr>
<tr><td>Withdrawals</td><td>Any time</td><td>Any time (after 5y: tax-free gains)</td><td>Locked until retirement</td></tr>
<tr><td>Tax deduction on contributions</td><td>No</td><td>No</td><td>Yes (reduces taxable income)</td></tr>
<tr><td>Succession advantage</td><td>Excellent (€152,500/beneficiary)</td><td>Standard inheritance rules</td><td>Good (similar to AV for beneficiaries)</td></tr>
</tbody>
</table>
<p>Use the <a href="/simulateurs/per">simfinly PER vs Assurance-vie simulator</a> to model which vehicle makes more sense for your tax situation.</p>
<h2>How to Open an Assurance-Vie in France</h2>
<p>You need to be a French tax resident to open most assurance-vie contracts in France (some insurers accept non-residents, but terms are restrictive). The major platforms are:</p>
<ul>
<li><strong>Online insurers</strong>: Linxea, Yomoni, Nalo, Goodvest — low fees (0.5–1.3%/year total), good fund selection</li>
<li><strong>Bank-based contracts</strong>: BNP Paribas Cardif, Société Générale, Crédit Agricole — higher fees (1.5–2.5%/year), more hands-on service</li>
<li><strong>Minimum investment</strong>: typically €500–1,000 to open a contract</li>
</ul>
<h2>Assurance-Vie for Non-Residents</h2>
<p>If you hold an assurance-vie contract and then move abroad (become a non-French tax resident), the contract continues to run. However:</p>
<ul>
<li>Tax on withdrawals shifts to the rules of your new country of residence (or a double-tax treaty applies)</li>
<li>The 17.2% prélèvements sociaux do not apply to non-residents on most income (including assurance-vie gains)</li>
<li>French succession rules still apply to the contract at death if you are domiciled in France at the time of death</li>
</ul>
<h2>Key Numbers for 2026</h2>
<ul>
<li>Average fonds en euros yield: 2.6–3.8% (depending on insurer)</li>
<li>Tax-free annual withdrawal allowance after 8 years: €4,600 (single) / €9,200 (couple)</li>
<li>Succession allowance per beneficiary (pre-70 investments): €152,500</li>
<li>Flat tax (PFU) on gains under 8 years: 12.8%</li>
<li>Reduced tax on gains over 8 years: 7.5% (above annual allowance)</li>
</ul>
<p>Open your assurance-vie as early as possible — the 8-year clock starts the day you open the contract, even if you invest very little initially. Use the <a href="/simulateurs/epargne">simfinly savings simulator</a> to model your long-term growth.</p>`,
    faqs: [
      { q: "Is assurance-vie really life insurance?", a: "Despite the name, assurance-vie in France is primarily an investment savings vehicle, not traditional life insurance. It does include a death benefit (your beneficiaries receive the contract value at your death), but its main appeal is tax-deferred investment growth and favorable succession tax treatment. It bears little resemblance to term life insurance." },
      { q: "Can I withdraw from assurance-vie at any time?", a: "Yes — assurance-vie contracts in France have no lock-in period. You can withdraw (partial or full surrender) at any time. However, the tax on gains is much more favorable after 8 years, so most investors wait. Withdrawals within the first 8 years are taxed at 30% on the gains portion (12.8% income tax + 17.2% social contributions)." },
      { q: "What happens to my assurance-vie if I leave France?", a: "The contract continues to exist even if you become a non-French tax resident. Your country of residence at withdrawal will determine the applicable tax (subject to any France double-tax treaty). The 17.2% prélèvements sociaux generally do not apply to non-residents. The contract remains valid and grows tax-deferred regardless of where you live." },
      { q: "How does assurance-vie compare to an ISA in the UK?", a: "Both are tax-advantaged savings accounts. Key differences: (1) AV has no annual contribution limit (ISA: £20,000/year); (2) AV is tax-deferred (pay tax on withdrawal), ISA is tax-exempt permanently; (3) AV has exceptional succession benefits (€152,500/beneficiary free of inheritance tax); (4) AV fonds en euros offer capital-guaranteed returns unavailable in an ISA; (5) ISA gains are completely tax-free, while AV gains after 8 years are taxed at just 7.5% above a €4,600 annual allowance." },
    ],
  },
];

export const STATIC_BY_SLUG = Object.fromEntries(STATIC_ARTICLES.map(a => [a.slug, a]));
