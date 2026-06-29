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
];

export const STATIC_BY_SLUG = Object.fromEntries(STATIC_ARTICLES.map(a => [a.slug, a]));
