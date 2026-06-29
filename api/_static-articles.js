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
  },
];

export const STATIC_BY_SLUG = Object.fromEntries(STATIC_ARTICLES.map(a => [a.slug, a]));
