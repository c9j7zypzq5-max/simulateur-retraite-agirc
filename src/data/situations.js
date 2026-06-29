// Données des pages retraite par situation de vie (/retraite/situation/:slug)
// Structure : { slug, icon, title, subtitle, metaTitle, metaDesc, intro,
//               simulateurPath, simulateurLabel, stats[], sections[], faq[] }

export const SITUATIONS = {

  'a-40-ans': {
    slug: 'a-40-ans',
    icon: '🕐',
    title: 'Retraite à 40 ans — que faire maintenant ?',
    subtitle: '24 ans devant vous · Capitalisez sur le temps',
    metaTitle: 'Préparer sa retraite à 40 ans 2026 — PER, épargne et stratégie',
    metaDesc: "À 40 ans, vous avez encore 24 ans pour agir. Guide complet 2026 : PER, immobilier locatif, simulation des droits retraite et stratégies pour maximiser votre pension.",
    intro: "À 40 ans, la retraite semble lointaine — mais c'est précisément l'âge optimal pour agir. Vous disposez encore de 24 ans de cotisations et de capitalisation. Chaque euro épargné maintenant travaillera deux fois plus longtemps qu'un euro épargné à 55 ans.",
    simulateurPath: '/simulateurs/synthese-retraite',
    simulateurLabel: 'Estimer ma future pension tous régimes',
    stats: [
      { label: 'Années avant 64 ans', value: '~24 ans', note: 'durée de capitalisation maximale' },
      { label: 'Plafond PER 2026', value: '10 % PASS', note: 'déductible du revenu imposable' },
      { label: 'Impact 200 €/mois PER', value: '+320 €/mois', note: 'rente estimée à 64 ans (6 % net)' },
      { label: 'Taux remplacement cible', value: '70-80 %', note: 'avec épargne complémentaire PER' },
    ],
    sections: [
      {
        title: 'Faites le point sur vos droits acquis',
        content: "À 40 ans, vous avez généralement 18 à 20 ans de cotisations derrière vous. Connectez-vous à **Mon Compte Retraite** (info-retraite.fr) pour obtenir votre Relevé de Situation Individuelle (RIS). Vérifiez les trimestres validés, repérez d'éventuels oublis ou erreurs (stages, premier emploi, périodes de chômage).\n\nUne erreur corrigée maintenant peut valoir 50 à 200 €/mois de pension supplémentaire à 64 ans. Passé 50 ans, les corrections deviennent plus complexes.",
      },
      {
        title: 'Le PER : votre levier fiscal avant 55 ans',
        content: "Le Plan d'Épargne Retraite est particulièrement puissant quand on l'ouvre jeune. À 40 ans, les versements sont déductibles de votre revenu imposable (jusqu'au plafond annuel) ET le capital a 24 ans pour fructifier.\n\n**Exemple concret :** 300 €/mois à partir de 40 ans → ~115 000 € à 64 ans (hypothèse 5 % net annuel). La même somme placée à partir de 50 ans ne donne que ~65 000 €.\n\nLes déblocages anticipés (achat résidence principale, invalidité, décès du conjoint) restent possibles. Le PER n'est pas un coffre-fort inaccessible.",
      },
      {
        title: 'Immobilier locatif : l\'actif qui s\'autofinance',
        content: "Un appartement acheté à crédit à 40 ans sera remboursé à 60-65 ans — pile au moment de la retraite. Pendant 20 ans, les loyers couvrent (en tout ou partie) les mensualités.\n\n**Calcul type :** Appartement T2 à 150 000 € → loyer de 650 €/mois → rendement brut 5,2 %. Après remboursement, ce loyer complète votre pension sans effort supplémentaire.\n\nCombinez rendement locatif (simulateur) et estimation du déficit foncier pour optimiser la fiscalité des travaux.",
      },
      {
        title: 'Ce qu\'il faut éviter',
        content: "**Ne pas casser son PER** à la première difficulté : les intérêts composés sont détruits, la déduction fiscale remboursée, et l'avantage temporel perdu.\n\n**Ne pas miser uniquement sur la retraite obligatoire :** pour un salarié actuel, le taux de remplacement tombe à 63 % en moyenne. Avec des primes non cotisées, souvent 45-55 %. L'épargne personnelle n'est pas optionnelle — elle est nécessaire.\n\n**Ne pas attendre 50 ans** pour agir : chaque année perdue = 10-15 % de capital en moins à la retraite.",
      },
    ],
    faq: [
      { q: "À 40 ans, est-il trop tôt pour m'inquiéter de ma retraite ?", a: "Non, c'est l'âge idéal. 24 ans d'épargne permettent aux intérêts composés de tripler votre capital. Attendre 50 ans, c'est perdre environ 40 % du capital final pour le même effort mensuel." },
      { q: "Combien dois-je épargner par mois à 40 ans pour ma retraite ?", a: "Pour viser 1 000 €/mois de rente complémentaire à 64 ans, il faut épargner environ 250-350 €/mois à partir de 40 ans (hypothèse 5 % net annuel). Avec un PER, l'avantage fiscal réduit l'effort réel de 15 à 30 % selon votre TMI." },
      { q: "PER ou assurance-vie à 40 ans, que choisir ?", a: "PER si votre TMI est ≥ 30 % : la déduction fiscale immédiate est décisive. Assurance-vie si vous pensez avoir besoin des fonds avant 64 ans (disponibilité totale). Idéalement : les deux, avec le PER comme socle retraite et l'assurance-vie comme épargne polyvalente." },
      { q: "Mon relevé de carrière montre des trous. Que faire à 40 ans ?", a: "Signalez-les via Mon Compte Retraite. Les périodes de chômage indemnisées, les stages rémunérés et les congés maternité doivent générer des trimestres. Si c'est un emploi salarié non déclaré ou une erreur de l'employeur, un recours est possible jusqu'à 5 ans après les faits." },
    ],
  },

  'a-50-ans': {
    slug: 'a-50-ans',
    icon: '📅',
    title: 'Retraite à 50 ans — le bilan décisif',
    subtitle: '14 ans pour optimiser · Dernières grandes décisions',
    metaTitle: 'Préparer sa retraite à 50 ans 2026 — bilan, PER, rachats de trimestres',
    metaDesc: "Guide complet 2026 pour préparer sa retraite à 50 ans : faire le bilan de carrière, racheter des trimestres, optimiser le PER avant 55 ans et choisir sa date de départ.",
    intro: "À 50 ans, la retraite entre dans le champ du concret. Il reste 14 ans avant l'âge légal de 64 ans (ou moins si vous êtes éligible à la carrière longue). C'est la dernière période pour prendre les décisions importantes : racheter des trimestres, optimiser le PER, repositionner ses investissements.",
    simulateurPath: '/simulateurs/synthese-retraite',
    simulateurLabel: 'Simuler ma retraite tous régimes',
    stats: [
      { label: 'Années avant 64 ans', value: '~14 ans', note: 'fenêtre d\'action encore large' },
      { label: 'Coût rachat trimestre', value: '3 000-9 000 €', note: 'selon âge et revenu, déductible' },
      { label: 'Déblocage PER', value: 'dès 64 ans', note: 'ou achat résidence principale' },
      { label: 'Taux remplacement moyen', value: '63 %', note: 'hors épargne complémentaire' },
    ],
    sections: [
      {
        title: 'Le bilan de carrière : votre priorité immédiate',
        content: "Commandez votre **Relevé de Situation Individuelle (RIS)** sur info-retraite.fr. À 50 ans, tous vos régimes (CNAV, Agirc-Arrco, Ircantec, etc.) y figurent. Vérifiez :\n\n- Le nombre de trimestres validés (objectif : 172 pour les nés après 1964)\n- L'absence de trimestres manquants sur les premières années de carrière\n- La prise en compte de vos périodes à l'étranger si applicable\n\nUne correction peut prendre 2 à 3 ans — ne tardez pas.",
      },
      {
        title: 'Racheter des trimestres : une décision à chiffrer',
        content: "Le rachat de trimestres (article L. 351-14-1 CSS) permet de compenser des années d'études ou d'activité réduite. À 50 ans, le coût d'un trimestre oscille entre 3 000 et 9 000 € selon votre revenu — mais ce rachat est déductible de vos revenus imposables.\n\n**Calculez le retour sur investissement :** un trimestre racheté pour 5 000 € qui augmente la pension de 40 €/mois = seuil de rentabilité à 10,4 ans après le départ (104 mois). Si vous espérez vivre 25 ans à la retraite, c'est rentable.\n\nLa décision doit aussi tenir compte de votre capacité de départ anticipé (carrière longue) et de votre taux de liquidation actuel.",
      },
      {
        title: 'Le PER après 50 ans : plus ciblé',
        content: "À 50 ans, le PER reste pertinent mais la mécanique change : vous avez moins d'années pour capitaliser, mais votre TMI est probablement à son maximum (pics de carrière). La déduction fiscale est donc la plus précieuse de votre vie.\n\n**Stratégie optimale :** concentrez les versements sur les 5 dernières années avant la retraite (55-64 ans) quand votre revenu est maximal. Vous profitez du TMI le plus élevé à l'entrée et d'un TMI souvent plus faible à la sortie (rente imposable).\n\nAttention : si vous partez avant 64 ans (carrière longue), planifiez le déblocage PER en conséquence.",
      },
      {
        title: 'Simuler sa date de départ optimale',
        content: "À 50 ans, vous pouvez calculer précisément votre date de taux plein : age légal (64 ans) OU date à laquelle vous validez 172 trimestres, selon la première occurrence.\n\n**Trois scénarios à simuler avec notre outil :**\n1. Départ au taux plein automatique à 67 ans (pas de décote, quel que soit le nombre de trimestres)\n2. Départ dès les 172 trimestres atteints\n3. Départ à 64 ans avec éventuelle décote (< 172 trimestres)\n\nLa différence entre ces scénarios peut représenter 100 à 400 €/mois de pension à vie.",
      },
    ],
    faq: [
      { q: "À 50 ans, puis-je encore avoir une bonne retraite même si je n'ai pas épargné ?", a: "Oui, mais l'effort doit être ciblé. Maximisez les versements PER (plafond annuel), envisagez un achat immobilier locatif si votre capacité d'emprunt le permet, et vérifiez votre éligibilité à la carrière longue. 14 ans c'est court pour construire mais suffisant pour corriger une trajectoire." },
      { q: "Est-il rentable de racheter des trimestres à 50 ans ?", a: "Cela dépend du coût, de l'impact sur la pension et de votre espérance de vie. En règle générale : si un trimestre racheté augmente la pension d'au moins 40 €/mois et coûte moins de 7 500 €, le retour sur investissement est atteint en 15 ans — souvent rentable. Utilisez le simulateur de trimestres pour calculer votre cas précis." },
      { q: "Puis-je partir à la retraite avant 64 ans si j'ai commencé à travailler tôt ?", a: "Oui, via le dispositif carrière longue. Si vous avez validé 5 trimestres avant vos 20 ans, vous pouvez partir dès 58 à 62 ans selon votre génération. La page dédiée retraite carrière longue détaille les conditions 2026." },
      { q: "À 50 ans, faut-il encore investir en bourse pour la retraite ?", a: "Oui, mais en adaptant le risque. À 50 ans, un portefeuille 60 % actions / 40 % obligations reste raisonnable — vous avez 14 ans devant vous. À 58 ans, commencez à sécuriser progressivement : passer à 40/60 puis 20/80 à l'approche de la retraite." },
    ],
  },

  'carriere-longue': {
    slug: 'carriere-longue',
    icon: '⏩',
    title: 'Retraite anticipée — carrière longue 2026',
    subtitle: 'Départ dès 58 ans · Conditions et calcul',
    metaTitle: 'Retraite carrière longue 2026 — conditions, âge de départ et calcul',
    metaDesc: "Retraite carrière longue 2026 : conditions (5 trimestres avant 20 ans), âges de départ selon génération (58-62 ans), trimestres requis et démarches. Guide complet.",
    intro: "Le dispositif retraite pour carrière longue permet de partir avant l'âge légal de 64 ans si vous avez commencé à travailler tôt. En 2026, les conditions se sont précisées après la réforme 2023 : l'âge de départ varie de 58 à 62 ans selon votre génération et le nombre de trimestres cotisés.",
    simulateurPath: '/simulateurs/retraite-anticipee',
    simulateurLabel: 'Simuler ma retraite anticipée carrière longue',
    stats: [
      { label: 'Départ le plus tôt', value: '58 ans', note: 'pour les assurés nés avant 1966' },
      { label: 'Condition clé', value: '5 trimestres', note: 'validés avant les 20 ans' },
      { label: 'Trimestres requis', value: '168-172', note: 'selon génération et âge de départ' },
      { label: 'Décote', value: '0 %', note: 'taux plein garanti si conditions remplies' },
    ],
    sections: [
      {
        title: 'Les conditions pour bénéficier de la carrière longue',
        content: "Pour partir en retraite anticipée via la carrière longue, **trois conditions cumulatives** doivent être remplies :\n\n1. **Avoir commencé tôt :** avoir cotisé au moins 5 trimestres avant la fin de l'année de vos 20 ans (4 trimestres si vous êtes né au 4e trimestre)\n2. **Avoir cotisé suffisamment :** durée totale de cotisation requise selon votre âge de départ (168 à 172 trimestres)\n3. **Demander la liquidation :** formuler explicitement la demande de départ anticipé auprès de vos caisses de retraite\n\nLes trimestres de chômage indemnisé comptent (dans la limite de 4 par an), mais les périodes d'études ne comptent généralement pas — sauf rachat.",
      },
      {
        title: 'Âges de départ par génération en 2026',
        content: "Après la réforme Borne de 2023 et les décrets d'application, voici les âges de départ :\n\n**Départ à 58 ans :** nés avant le 1er janvier 1966, avec cotisation débutée avant 14 ans\n**Départ à 60 ans :** cotisation débutée avant 16 ans, 168 trimestres au total requis\n**Départ à 62 ans :** cotisation débutée avant 18 ans, 168 trimestres au total requis\n**Départ à 63 ans :** cotisation débutée avant 20 ans, avec 172 trimestres (nés à partir de 1968)\n\nÀ chaque palier, le taux plein est garanti — aucune décote ne s'applique.",
      },
      {
        title: 'Comment préparer sa demande',
        content: "**12 mois avant le départ souhaité :**\n- Demandez votre Relevé de Situation Individuelle (info-retraite.fr)\n- Vérifiez que tous vos trimestres sont bien comptabilisés\n- Faites une simulation via le simulateur retraite anticipée\n\n**6 mois avant le départ :**\n- Déposez la demande officielle auprès du régime principal (CNAV ou CNRACL)\n- Joignez les justificatifs de début de carrière (bulletins de salaire, attestation employeur)\n- Renseignez vos régimes complémentaires (Agirc-Arrco, Ircantec...)\n\n**Attention :** certains régimes complémentaires (Agirc-Arrco) appliquent un coefficient de solidarité si vous partez avant 64 ans — vérifiez l'impact dans le simulateur.",
      },
      {
        title: 'Le coefficient de solidarité Agirc-Arrco',
        content: "Si vous liquidez votre retraite Agirc-Arrco avant 64 ans, un **coefficient de solidarité de 10 %** s'applique pendant 3 ans (ou jusqu'à 67 ans si vous partez très tôt).\n\nCe coefficient réduit temporairement votre pension complémentaire : si vous touchiez 800 €/mois d'Agirc-Arrco, vous ne touchez que 720 €/mois pendant 3 ans.\n\n**Exception :** si vous liquidez simultanément à taux plein (172 trimestres) ET après 64 ans, le coefficient ne s'applique pas. Pour les carrières longues partant avant 64 ans, il est quasi inévitable — sauf report volontaire au-delà de 64 ans.",
      },
    ],
    faq: [
      { q: "Comment savoir si je suis éligible à la retraite carrière longue ?", a: "Consultez votre Relevé de Situation Individuelle sur info-retraite.fr. Il indique l'âge minimal estimé de départ. Vous pouvez aussi appeler la CNAV (3960) pour une étude personnalisée. L'éligibilité dépend principalement de vos 5 trimestres avant 20 ans et du total de vos trimestres." },
      { q: "Les trimestres de chômage comptent-ils pour la carrière longue ?", a: "Oui, les trimestres de chômage indemnisé (Pôle Emploi) comptent à raison de 1 trimestre par tranche de 50 jours, dans la limite de 4 trimestres par an. En revanche, le chômage non indemnisé ne génère aucun droit. Les stages en entreprise rémunérés peuvent générer des trimestres si les cotisations ont été prélevées." },
      { q: "Peut-on partir en retraite carrière longue si on a été indépendant ?", a: "Oui. Les indépendants (artisans, commerçants, professions libérales) peuvent bénéficier du dispositif si leurs trimestres SSI/RSI/CNAV démontrent un début de carrière avant 20 ans. Le calcul est identique au régime général. Attention aux trimestres de début d'activité indépendante : si les revenus étaient faibles, ils peuvent ne pas générer de trimestres." },
      { q: "Mon départ à 62 ans en carrière longue pénalise-t-il ma pension Agirc-Arrco ?", a: "Oui, via le coefficient de solidarité de 10 % pendant 3 ans. Sur une pension complémentaire de 800 €/mois, cela représente une perte de 2 880 € sur 3 ans. Après 3 ans (ou à 65 ans au plus tard), la pension revient à son montant normal. Simulez l'impact précis avec le simulateur retraite anticipée." },
    ],
  },

  'parent-au-foyer': {
    slug: 'parent-au-foyer',
    icon: '👶',
    title: 'Retraite parent au foyer — droits et calcul',
    subtitle: 'MDA · AVPF · Pension de réversion',
    metaTitle: "Retraite parent au foyer 2026 — MDA, AVPF et droits complets",
    metaDesc: "Droits retraite pour les parents au foyer en 2026 : Majoration Durée Assurance (4 trimestres/enfant), AVPF, pension de réversion et stratégie pour ne pas sacrifier sa pension.",
    intro: "Arrêter de travailler pour élever ses enfants génère des droits retraite spécifiques : la Majoration de Durée d'Assurance (MDA) et l'Assurance Vieillesse des Parents au Foyer (AVPF). Ces dispositifs permettent de valider des trimestres même sans activité professionnelle — mais leurs conditions sont strictes.",
    simulateurPath: '/simulateurs/cnav',
    simulateurLabel: 'Simuler ma retraite de base CNAV',
    stats: [
      { label: 'MDA par enfant', value: '4 trimestres', note: 'majoration automatique à la naissance' },
      { label: 'AVPF maximum', value: '8 trimestres/an', note: 'équivalent SMIC cotisé par la CAF' },
      { label: 'Pension réversion', value: '54 %', note: 'de la pension du conjoint au décès' },
      { label: 'Âge légal', value: '64 ans', note: 'inchangé pour les parents au foyer' },
    ],
    sections: [
      {
        title: "La Majoration de Durée d'Assurance (MDA)",
        content: "La **MDA** est un dispositif automatique : chaque enfant né ou adopté après le 1er juillet 2006 ouvre droit à une majoration de 4 trimestres pour la mère ET 4 trimestres pour le père (2 trimestres chacun si les parents se les partagent).\n\nCes trimestres s'ajoutent à votre durée d'assurance sans avoir besoin de cotiser. Concrètement, pour 3 enfants, vous pouvez obtenir jusqu'à 12 trimestres (3 ans) supplémentaires.\n\n**Attention :** la MDA augmente la durée d'assurance mais pas le salaire annuel moyen (SAM) — elle réduit la décote ou permet de partir plus tôt, mais n'augmente pas directement le montant de votre pension.",
      },
      {
        title: "L'AVPF — Assurance Vieillesse des Parents au Foyer",
        content: "L'**AVPF** est le mécanisme le plus avantageux : la CAF cotise à votre place à l'Assurance Vieillesse comme si vous étiez salarié au SMIC. Chaque année d'affiliation = trimestres ET salaire porté au compte (au SMIC).\n\nConditions pour en bénéficier en 2026 :\n- Percevoir certaines allocations familiales (AEEH, PreParE à taux partiel, AJPP...)\n- Avoir des revenus du foyer sous le plafond fixé par la CAF\n- Avoir réduit ou cessé votre activité professionnelle\n\nL'AVPF est versée automatiquement par la CAF à la CNAV — vous n'avez rien à demander si vous êtes éligible. Vérifiez dans votre RIS que ces trimestres AVPF apparaissent bien.",
      },
      {
        title: "Les pièges à éviter",
        content: "**Piège 1 — Croire que la MDA suffit :** la MDA donne des trimestres mais pas de salaire de référence. Si vous avez travaillé peu ou avez un SAM (Salaire Annuel Moyen) faible, votre pension sera calculée sur ce SAM faible, même avec beaucoup de trimestres.\n\n**Piège 2 — Négliger l'AVPF :** beaucoup de parents au foyer ne savent pas qu'ils bénéficient de l'AVPF. Vérifiez votre RIS et contactez la CAF pour confirmer vos droits.\n\n**Piège 3 — Ne pas reprise d'activité :** chaque année travaillée après les enfants reconstitue un revenu de référence. Une reprise partielle ou progressive est souvent plus payante qu'un arrêt complet pour la pension finale.",
      },
      {
        title: "La pension de réversion : un filet de sécurité",
        content: "Si votre conjoint décède, vous avez droit à **54 % de sa pension brute** (régime général) sous conditions de ressources. En 2026, le plafond de ressources est de 23 441 €/an (seul) ou 37 506 €/an (en couple après remariage).\n\n**Agirc-Arrco :** 60 % de la retraite complémentaire du défunt, sans condition de ressources, à condition d'avoir été mariés et non divorcés.\n\nEn cas de divorce, la pension de réversion CNAV se calcule au prorata de la durée de mariage. Si vous vous êtes remariés, la réversion est partagée entre les ex-conjoints.\n\nSimulez le montant avec notre simulateur pension de réversion.",
      },
    ],
    faq: [
      { q: "Combien de trimestres supplémentaires ai-je avec 3 enfants ?", a: "Avec 3 enfants nés après juillet 2006, vous bénéficiez de 4 trimestres MDA par enfant soit 12 trimestres (3 ans). Si vous avez aussi bénéficié de l'AVPF pendant vos congés parentaux (4 ans par exemple), vous pouvez avoir jusqu'à 16 trimestres supplémentaires. Ces droits s'ajoutent à vos trimestres travaillés." },
      { q: "Parent au foyer 10 ans, quelle sera ma pension ?", a: "Si vos 10 ans d'absence sont couverts par l'AVPF, la CNAV vous attribue des trimestres et un salaire au SMIC pour ces années. Votre SAM (les 25 meilleures années) intégrera ces années SMIC. Sans AVPF, vos 10 ans de foyer ne rapportent que des trimestres MDA — votre SAM sera tiré vers le bas par les années à zéro revenu. La simulation sur info-retraite.fr donne le résultat précis pour votre situation." },
      { q: "AVPF et travail à temps partiel, est-ce compatible ?", a: "Oui, sous conditions. Si vous travaillez à temps partiel et percevez une allocation éligible (comme le PAJE), vous pouvez bénéficier de l'AVPF complémentaire. La CAF compare votre revenu partiel au SMIC et cotise pour la différence. C'est une excellente formule : vous cumulez vos propres cotisations + l'AVPF complémentaire." },
      { q: "Que se passe-t-il pour ma retraite si je divorce après avoir été parent au foyer ?", a: "Vos droits AVPF et MDA acquis pendant le mariage restent définitifs — le divorce ne les supprime pas. En revanche, vous perdez le droit à la pension de réversion de votre ex-conjoint si vous vous remariez. Si vous ne vous remariez pas, vous avez droit à une fraction de la réversion proportionnelle à la durée de mariage." },
    ],
  },

};

export const SITUATIONS_LIST = Object.values(SITUATIONS);
export const SITUATIONS_BY_SLUG = SITUATIONS;
