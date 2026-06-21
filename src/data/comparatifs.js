// Pages comparatives « X vs Y » : contenu éditorial ciblant des requêtes à forte
// intention (« PER ou assurance-vie », « louer ou acheter »…). Chaque page relie
// deux simulateurs et des termes du lexique, renforçant le maillage interne.
//
// Fichier de DONNÉES PURES (pas d'import React) : il est aussi consommé côté build
// (scripts/generate-static-html.mjs) et sitemap (api/sitemap.js) via api/_routes.js.
//
// Champs : slug, title (H1), shortTitle (listes), emoji, category, intro,
//   a/b { name, pour[], contre[] }, criteres[{ label, a, b }],
//   sections[{ h2, body[] }], verdict, sims[chemins], terms[slugs lexique].

export const COMPARATIFS = [
  {
    slug: 'per-vs-assurance-vie',
    title: 'PER ou assurance-vie : que choisir pour épargner ?',
    shortTitle: 'PER vs assurance-vie',
    emoji: '⚖️',
    category: 'Finances',
    intro: "PER et assurance-vie sont les deux enveloppes reines de l'épargne long terme en France. L'un défiscalise à l'entrée et bloque l'épargne jusqu'à la retraite ; l'autre reste disponible et offre une fiscalité douce après 8 ans. Comparons-les pour savoir laquelle privilégier selon votre situation.",
    a: {
      name: 'PER',
      pour: ["Déduction des versements du revenu imposable", "Idéal si votre tranche marginale (TMI) est élevée", "Sortie en capital ou en rente à la retraite"],
      contre: ["Épargne bloquée jusqu'à la retraite (sauf cas)", "Fiscalité à la sortie sur les versements déduits", "Avantage faible si TMI basse"],
    },
    b: {
      name: 'Assurance-vie',
      pour: ["Épargne disponible à tout moment", "Fiscalité avantageuse après 8 ans (abattement)", "Transmission hors succession jusqu'à 152 500 € par bénéficiaire"],
      contre: ["Pas de déduction fiscale à l'entrée", "Prélèvements sociaux de 17,2 % sur les gains", "Rendement des fonds euros en baisse"],
    },
    criteres: [
      { label: "Avantage fiscal à l'entrée", a: "Oui (déduction des versements)", b: "Non" },
      { label: "Disponibilité de l'épargne", a: "Bloquée jusqu'à la retraite", b: "Disponible à tout moment" },
      { label: "Fiscalité à la sortie", a: "Versements imposés au barème, gains au PFU", b: "Abattement annuel après 8 ans" },
      { label: "Transmission", a: "Fiscalité variable selon l'âge", b: "Cadre très favorable (152 500 €/bénéficiaire)" },
      { label: "Public idéal", a: "TMI à 30 % ou plus, horizon retraite", b: "Tous profils, projets à moyen terme" },
    ],
    sections: [
      {
        h2: "Le PER : défiscaliser aujourd'hui pour la retraite",
        body: [
          "Le Plan d'Épargne Retraite permet de déduire vos versements de votre revenu imposable. L'économie d'impôt est proportionnelle à votre tranche marginale d'imposition : plus elle est élevée, plus le PER est intéressant. En contrepartie, l'épargne est bloquée jusqu'à la retraite, hors cas de déblocage anticipé (achat de la résidence principale, accidents de la vie).",
          "À la sortie, la part correspondant aux versements déduits est réimposée. Le PER est donc surtout pertinent si vous pensez avoir une TMI plus faible à la retraite qu'aujourd'hui.",
        ],
      },
      {
        h2: "L'assurance-vie : souplesse et transmission",
        body: [
          "L'assurance-vie n'offre aucune déduction à l'entrée, mais votre épargne reste disponible et bénéficie, après 8 ans, d'un abattement annuel sur les gains (4 600 € pour une personne seule, 9 200 € pour un couple). C'est l'outil le plus polyvalent pour un projet à moyen ou long terme.",
          "Son atout majeur reste la transmission : les capitaux versés avant 70 ans sont transmis hors succession dans la limite de 152 500 € par bénéficiaire.",
        ],
      },
      {
        h2: "Faut-il choisir ?",
        body: [
          "Les deux enveloppes sont complémentaires. Une stratégie fréquente consiste à utiliser le PER pour défiscaliser quand la TMI est élevée, tout en alimentant une assurance-vie pour conserver de la souplesse et préparer la transmission.",
        ],
      },
    ],
    verdict: "Si votre TMI est élevée et que votre objectif est clairement la retraite, le PER maximise l'avantage fiscal. Pour de la souplesse, un horizon plus court ou la transmission, l'assurance-vie l'emporte. Idéalement, combinez les deux. Simulez chaque scénario ci-dessous.",
    sims: ['/simulateurs/per', '/simulateurs/assurance-vie'],
    terms: ['per', 'assurance-vie', 'tmi', 'pfu'],
  },
  {
    slug: 'louer-ou-acheter',
    title: 'Louer ou acheter sa résidence principale ?',
    shortTitle: 'Louer ou acheter',
    emoji: '🏠',
    category: 'Immobilier',
    intro: "Faut-il continuer à louer ou se lancer dans l'achat de sa résidence principale ? La réponse dépend de la durée de détention, du niveau des taux, des frais d'acquisition et du loyer que vous économisez. Voici les critères pour trancher, simulateurs à l'appui.",
    a: {
      name: 'Louer',
      pour: ["Liberté de mobilité (mutation, projet de vie)", "Aucun frais de notaire ni gros entretien", "Épargne disponible plutôt qu'immobilisée"],
      contre: ["Loyer « à fonds perdu »", "Aucune constitution de patrimoine", "Exposé aux hausses de loyer"],
    },
    b: {
      name: 'Acheter',
      pour: ["Constitution d'un patrimoine", "Stabilité et liberté d'aménagement", "Plus de loyer une fois le crédit remboursé"],
      contre: ["Frais d'acquisition élevés (7-8 % dans l'ancien)", "Coût du crédit et de l'entretien", "Moins de mobilité"],
    },
    criteres: [
      { label: "Horizon recommandé", a: "Court / incertain (< 5 ans)", b: "Long (> 7-8 ans)" },
      { label: "Coût d'entrée", a: "Dépôt de garantie", b: "Apport + frais de notaire" },
      { label: "Constitution de patrimoine", a: "Via l'épargne placée", b: "Via le remboursement du crédit" },
      { label: "Flexibilité", a: "Forte", b: "Faible" },
      { label: "Risque", a: "Hausse des loyers", b: "Baisse des prix, travaux imprévus" },
    ],
    sections: [
      {
        h2: "Le poids des frais et de la durée",
        body: [
          "Acheter implique des frais d'acquisition importants (environ 7 à 8 % du prix dans l'ancien) qu'il faut « amortir » dans le temps. En dessous de 5 à 7 ans de détention, la revente risque de ne pas couvrir ces frais : la location est alors souvent plus rationnelle.",
          "Au-delà, le remboursement du capital emprunté constitue une épargne forcée qui fait pencher la balance vers l'achat.",
        ],
      },
      {
        h2: "Le coût d'opportunité de l'apport",
        body: [
          "L'argent immobilisé dans un achat (apport, frais) aurait pu être investi ailleurs. Pour comparer honnêtement, mettez en regard le rendement potentiel de cette épargne placée avec l'économie de loyer générée par l'achat.",
        ],
      },
    ],
    verdict: "En dessous de 5 ans ou en cas d'incertitude sur votre lieu de vie, la location garde l'avantage. Pour un projet stable de long terme, l'achat construit un patrimoine et supprime le loyer à terme. Estimez votre mensualité et vos frais ci-dessous pour décider.",
    sims: ['/simulateurs/emprunt-immobilier', '/simulateurs/frais-notaire'],
    terms: ['taeg', 'ptz', 'capacite-emprunt'],
  },
  {
    slug: 'freelance-ou-salarie',
    title: 'Freelance ou salarié : quel statut rapporte le plus ?',
    shortTitle: 'Freelance vs salarié',
    emoji: '💼',
    category: 'Finances',
    intro: "Passer freelance peut augmenter le revenu net… ou pas. Tout dépend du statut (micro-entreprise, portage, société), des charges sociales et de la protection que vous recherchez. Comparons le salariat et l'indépendance pour y voir clair.",
    a: {
      name: 'Salarié',
      pour: ["Protection sociale complète (chômage, maladie)", "Revenu stable et congés payés", "Aucune gestion administrative"],
      contre: ["Revenu net plafonné par la grille", "Peu de leviers d'optimisation", "Lien de subordination"],
    },
    b: {
      name: 'Freelance',
      pour: ["Revenu net potentiellement supérieur", "Liberté d'organisation et de tarification", "Leviers d'optimisation (frais, statut)"],
      contre: ["Pas d'assurance chômage (hors portage)", "Revenu variable et impayés possibles", "Gestion administrative et comptable"],
    },
    criteres: [
      { label: "Protection sociale", a: "Complète (chômage inclus)", b: "Partielle selon le statut" },
      { label: "Stabilité du revenu", a: "Élevée", b: "Variable" },
      { label: "Revenu net à facturation égale", a: "Référence", b: "Souvent supérieur" },
      { label: "Charge administrative", a: "Nulle", b: "Réelle (déclarations, compta)" },
      { label: "Liberté", a: "Limitée", b: "Forte" },
    ],
    sections: [
      {
        h2: "Comparer à revenu équivalent",
        body: [
          "La vraie question n'est pas le chiffre d'affaires mais le net dans la poche, à protection comparable. Un freelance doit provisionner sa retraite, sa prévoyance et l'absence de chômage : ces postes réduisent l'écart apparent avec le salariat.",
          "Le statut choisi (micro-BNC, entreprise individuelle au réel, portage salarial, société) change radicalement le calcul des cotisations et de l'impôt.",
        ],
      },
      {
        h2: "Au-delà de l'argent",
        body: [
          "Le choix se joue aussi sur la tolérance au risque, le besoin de stabilité et l'envie d'autonomie. Beaucoup combinent les deux mondes via le portage salarial, qui offre le statut de salarié tout en travaillant en indépendant.",
        ],
      },
    ],
    verdict: "Le freelance peut dégager un net supérieur, mais au prix d'une protection à reconstituer et d'une charge de gestion. Comparez votre situation précise avec le simulateur freelance vs salarié ci-dessous.",
    sims: ['/simulateurs/freelance-vs-salarie', '/simulateurs/salaire'],
    terms: ['tmi', 'micro-entreprise', 'cotisations-sociales'],
  },
];

export const COMPARATIFS_BY_SLUG = Object.fromEntries(COMPARATIFS.map(c => [c.slug, c]));
