// Articles d'actualité 2026 rédigés à la main, à publier via /api/publish-article
// (cf. scripts/seed-actualites.mjs). Chiffres vérifiés en juin 2026 auprès des
// sources officielles (economie.gouv.fr, service-public.fr, LFSS 2026).
//
// Le contenu n'utilise que les balises autorisées : h2, p, ul, li, strong, em.
// Les termes connus (PTZ, PER, TMI, Livret A…) sont auto-liés vers le lexique
// côté client ; on ne met donc pas de balises <a> ici.

export const ACTUALITES = [
  {
    slug: 'reforme-retraites-suspension-2026',
    title: 'Réforme des retraites suspendue : ce qui change au 1er septembre 2026',
    category: 'Retraite',
    readTime: 6,
    intro:
      "La loi de financement de la Sécurité sociale pour 2026 suspend l'accélération de la réforme de 2023. Concrètement, la hausse de l'âge légal et de la durée de cotisation est gelée jusqu'en 2028 : voici qui est concerné et ce que cela change pour votre départ.",
    content: `
<h2>Une suspension, pas une annulation</h2>
<p>La loi de financement de la Sécurité sociale (LFSS) pour 2026 a acté la <strong>suspension</strong> de la réforme des retraites de 2023. Attention au vocabulaire : il ne s'agit pas d'une abrogation. Le calendrier d'augmentation de l'âge légal et de la durée d'assurance est <strong>gelé</strong>, à compter du 1er septembre 2026 et jusqu'en 2028. Les décrets d'application ont été publiés au Journal officiel en mai 2026.</p>
<p>En clair : le relèvement progressif de l'âge de départ vers 64 ans est mis en pause, mais le cadre général de la réforme reste inscrit dans la loi. La question d'une reprise — ou d'un nouvel aménagement — se reposera après 2028.</p>

<h2>L'âge légal et la durée de cotisation gelés</h2>
<p>Pendant la suspension, deux paramètres cessent de progresser :</p>
<ul>
<li><strong>L'âge légal de départ</strong> : la montée vers 64 ans est interrompue. Un trimestre est « rendu » par génération concernée, des assurés nés en 1964 jusqu'à ceux nés en 1968.</li>
<li><strong>La durée d'assurance requise</strong> pour le taux plein : elle est réduite d'un trimestre pour les générations visées (par exemple 171 trimestres au lieu de 172 pour la génération 1965).</li>
</ul>
<p>Les personnes nées en 1969 ou après restent, à ce stade, soumises aux paramètres cibles de la réforme de 2023, la suspension étant prévue jusqu'en 2028.</p>

<h2>Les carrières longues aussi concernées</h2>
<p>Le gel s'applique également au dispositif <strong>carrières longues</strong>, qui permet un départ anticipé à ceux ayant commencé à travailler tôt (avant 16, 18, 20 ou 21 ans selon les cas). Les bornes d'âge de ce dispositif suivent la pause appliquée à l'âge légal.</p>

<h2>Faut-il revoir votre date de départ ?</h2>
<p>Si vous êtes né entre 1964 et 1968 et envisagiez un départ dans les prochaines années, la suspension peut <strong>avancer de quelques mois</strong> votre date de départ à taux plein, ou réduire le nombre de trimestres qu'il vous reste à valider. L'effet exact dépend de votre année de naissance et de votre relevé de carrière.</p>
<p>Trois réflexes utiles :</p>
<ul>
<li>Vérifiez votre relevé de carrière sur votre compte de l'Assurance retraite, et signalez tout trimestre manquant.</li>
<li>Distinguez bien le régime de base (CNAV) et la <strong>retraite complémentaire</strong> Agirc-Arrco, qui obéissent à des règles différentes (notamment le bonus/malus temporaire).</li>
<li>Anticipez l'impact fiscal : une pension s'ajoute à vos autres revenus et peut modifier votre tranche marginale.</li>
</ul>

<h2>Estimez votre future pension</h2>
<p>Pour y voir clair sur votre situation personnelle, le mieux reste de chiffrer plusieurs scénarios de départ. Nos simulateurs gratuits de retraite de base (CNAV) et de retraite complémentaire Agirc-Arrco vous donnent une estimation instantanée, sans inscription, pour comparer un départ à l'âge légal et un départ retardé.</p>
`.trim(),
  },

  {
    slug: 'bareme-impot-revenu-2026',
    title: 'Impôt sur le revenu 2026 : le nouveau barème revalorisé de 0,9 %',
    category: 'Fiscalité',
    readTime: 5,
    intro:
      "La loi de finances pour 2026 revalorise les tranches du barème de l'impôt sur le revenu de 0,9 % pour neutraliser l'inflation. Voici les nouveaux seuils applicables à vos revenus 2025 et comment ils influencent votre impôt.",
    content: `
<h2>Pourquoi le barème est revalorisé chaque année</h2>
<p>Le barème de l'impôt sur le revenu est <strong>indexé sur l'inflation</strong>. Sans cette revalorisation, une simple hausse de salaire alignée sur les prix vous ferait mécaniquement payer plus d'impôt, voire basculer dans une tranche supérieure : c'est l'effet de « gel du barème ». Pour 2026, la loi de finances relève les seuils de <strong>0,9 %</strong>, appliqués aux revenus de 2025 déclarés au printemps 2026.</p>

<h2>Les tranches applicables aux revenus 2025</h2>
<p>Le barème progressif 2026 comporte cinq tranches. Les taux restent inchangés (0 %, 11 %, 30 %, 41 % et 45 %) ; seuls les seuils évoluent :</p>
<ul>
<li><strong>0 %</strong> jusqu'à 11 600 €</li>
<li><strong>11 %</strong> de 11 600 € à 29 579 €</li>
<li><strong>30 %</strong> de 29 579 € à 84 577 €</li>
<li><strong>41 %</strong> de 84 577 € à 181 917 €</li>
<li><strong>45 %</strong> au-delà de 181 917 €</li>
</ul>
<p>Ces seuils s'entendent <strong>par part de quotient familial</strong>. C'est une erreur fréquente de croire qu'on est imposé d'un coup au taux de sa tranche : seule la fraction du revenu qui dépasse chaque seuil est taxée au taux correspondant.</p>

<h2>Taux marginal et taux moyen : ne pas confondre</h2>
<p>Votre <strong>tranche marginale d'imposition</strong> (TMI) est le taux qui s'applique à votre dernier euro gagné. Votre <em>taux moyen</em>, lui, est presque toujours plus bas : il rapporte l'impôt total à l'ensemble de vos revenus. Connaître sa TMI est essentiel pour arbitrer un placement : c'est elle qui détermine l'économie d'impôt d'un versement sur un PER, par exemple.</p>

<h2>Décote et quotient familial</h2>
<p>Deux mécanismes peuvent réduire l'addition. Le <strong>quotient familial</strong> divise le revenu imposable par le nombre de parts (selon la composition du foyer) avant d'appliquer le barème. La <strong>décote</strong>, elle, allège l'impôt des foyers faiblement imposés, juste au-dessus du seuil d'entrée dans l'impôt.</p>

<h2>Calculez votre impôt 2026 en une minute</h2>
<p>Plutôt que d'estimer à la louche, le plus simple est de tester le barème sur vos chiffres. Notre simulateur d'impôt sur le revenu applique gratuitement les tranches 2026, le quotient familial et la décote, et vous affiche à la fois votre impôt, votre taux moyen et votre tranche marginale.</p>
`.trim(),
  },

  {
    slug: 'epargne-reglementee-2026-livret-a-lep',
    title: 'Livret A à 1,5 %, LEP à 2,5 % : l\'épargne réglementée en 2026',
    category: 'Épargne',
    readTime: 5,
    intro:
      "Depuis le 1er février 2026, le Livret A rapporte 1,5 % et le LEP 2,5 %. Avec une révision attendue cet été, voici comment tirer le meilleur de vos livrets et où placer votre épargne de précaution.",
    content: `
<h2>Les taux en vigueur depuis février 2026</h2>
<p>Au 1er février 2026, les taux de l'épargne réglementée ont été ajustés :</p>
<ul>
<li><strong>Livret A</strong> : 1,5 % net, plafond de versements à 22 950 €.</li>
<li><strong>LDDS</strong> (Livret de développement durable et solidaire) : 1,5 % net, plafond à 12 000 €.</li>
<li><strong>LEP</strong> (Livret d'épargne populaire) : 2,5 % net, plafond à 10 000 €.</li>
</ul>
<p>Tous trois sont <strong>totalement défiscalisés</strong> : ni impôt sur le revenu, ni prélèvements sociaux sur les intérêts. Leur capital est garanti et disponible à tout moment, ce qui en fait le support idéal pour l'<strong>épargne de précaution</strong>.</p>

<h2>Le LEP, le livret le mieux rémunéré… s'il vous est ouvert</h2>
<p>Avec 2,5 %, le LEP bat largement le Livret A. Il est toutefois <strong>soumis à conditions de revenus</strong> : l'éligibilité dépend de votre revenu fiscal de référence. Pour 2026, les plafonds ont été revalorisés de 0,9 % (de l'ordre de 23 028 € pour une part). Si vous y avez droit, c'est le premier livret à remplir avant le Livret A. Beaucoup de foyers éligibles n'en profitent pas, faute de l'avoir demandé à leur banque.</p>

<h2>Une nouvelle révision attendue au 1er août 2026</h2>
<p>Le taux du Livret A n'est pas figé : la <strong>Banque de France</strong> recalcule la formule quatre fois par an (mi-janvier, mi-avril, mi-juillet et mi-octobre), pour une application le 1er du mois suivant. Selon les estimations de juin 2026, le taux théorique calculé ressortait autour de <strong>1,6 %</strong>, ce qui laisse entrevoir une possible légère remontée au 1er août. Rien n'est garanti : la décision finale revient au gouvernement, sur recommandation de la Banque de France.</p>

<h2>Au-delà des livrets : faire travailler son surplus</h2>
<p>Les livrets réglementés sont parfaits pour une épargne disponible (3 à 6 mois de dépenses). Mais une fois ce matelas constitué, leur rendement net peine à suivre l'inflation sur le long terme. Pour un horizon plus lointain, d'autres enveloppes prennent le relais :</p>
<ul>
<li>L'<strong>assurance-vie</strong>, souple et fiscalement avantageuse après 8 ans.</li>
<li>Le <strong>PER</strong>, pour préparer la retraite tout en réduisant son impôt à l'entrée.</li>
<li>Le <strong>PEA</strong>, pour investir en actions européennes avec une fiscalité allégée après 5 ans.</li>
</ul>

<h2>Visualisez la croissance de votre épargne</h2>
<p>Pour mesurer l'effet des intérêts composés selon le taux et la durée, testez notre simulateur d'épargne : il projette gratuitement la valeur future de vos versements, livret par livret, et illustre pourquoi la régularité compte plus que le montant de départ.</p>
`.trim(),
  },

  {
    slug: 'ptz-2026-elargi-tout-le-territoire',
    title: 'PTZ 2026 : le prêt à taux zéro élargi à tout le territoire',
    category: 'Immobilier',
    readTime: 5,
    intro:
      "Le prêt à taux zéro est de nouveau accessible pour tous les logements neufs, partout en France, et ses plafonds de revenus ont été relevés en 2026. De quoi financer une partie de votre résidence principale sans intérêts : le point sur les nouvelles règles.",
    content: `
<h2>Un PTZ de nouveau ouvert à tout le neuf</h2>
<p>Le <strong>prêt à taux zéro</strong> (PTZ) est un crédit sans intérêts ni frais de dossier, destiné à financer une partie de l'achat de la <strong>résidence principale</strong> des primo-accédants. Depuis avril 2025, il a été <strong>élargi à tous les logements neufs</strong> — appartements comme maisons — sur l'ensemble du territoire, alors qu'il était auparavant restreint à certaines zones. En 2026, ce cadre élargi se confirme.</p>

<h2>Qui peut en bénéficier ?</h2>
<p>Le PTZ reste réservé aux <strong>primo-accédants</strong> : il faut ne pas avoir été propriétaire de sa résidence principale au cours des deux années précédant le prêt (sauf situations particulières, comme le handicap). Il vient toujours <strong>en complément d'un prêt principal</strong> : il ne finance jamais la totalité de l'opération.</p>

<h2>Des plafonds de revenus relevés en 2026</h2>
<p>Le montant du PTZ dépend de vos revenus, de la zone du logement et de la composition du foyer. Bonne nouvelle pour 2026 : les <strong>plafonds de ressources ont été revalorisés</strong> (de l'ordre de 8 à 13 % selon les zones), ce qui élargit le nombre de ménages éligibles. La part de l'opération finançable par le PTZ varie selon le profil :</p>
<ul>
<li>Jusqu'à <strong>50 %</strong> du coût pour un appartement neuf, et pour l'ancien en zones B2 et C.</li>
<li>Autour de <strong>30 %</strong> pour une maison individuelle neuve.</li>
</ul>

<h2>Et l'ancien ?</h2>
<p>Dans l'ancien, le PTZ reste plus encadré : il vise surtout les <strong>zones B2 et C</strong> (communes moins tendues) et impose des <strong>travaux de rénovation</strong> représentant une part significative du coût total — généralement au moins 25 % de l'opération — afin d'améliorer la performance énergétique du logement.</p>

<h2>Différé de remboursement</h2>
<p>Le PTZ se rembourse sur une longue durée, avec une <strong>période de différé</strong> pendant laquelle vous ne remboursez pas le PTZ : plus vos revenus sont modestes, plus ce différé est long, ce qui allège l'effort des premières années. De quoi réduire la mensualité globale en début de crédit.</p>

<h2>Simulez votre achat immobilier</h2>
<p>Pour savoir combien vous pouvez emprunter et estimer votre PTZ, combinez nos deux outils gratuits : le simulateur de PTZ chiffre le montant auquel vous pourriez prétendre, et le simulateur d'emprunt immobilier calcule votre mensualité, votre capacité d'emprunt et le coût total du crédit.</p>
`.trim(),
  },
];
