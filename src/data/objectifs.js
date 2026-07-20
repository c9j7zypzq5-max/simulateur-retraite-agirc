// Parcours guidés par objectif de vie — source unique de vérité.
//
// Consommé par :
//   - les pages client (src/pages/Objectifs.jsx, Objectif.jsx, ObjectifSynthese.jsx)
//   - le bandeau de progression (src/components/ParcoursBanner.jsx)
//   - le build SEO (api/_meta.js, api/_seo.js, scripts/generate-static-html.mjs)
// → pas de JSX ni d'accès à window au niveau module (le fichier est importé en Node).
//
// Chaque étape référence un simulateur EXISTANT par sa route canonique FR : le
// parcours orchestre les pages simulateurs telles quelles (déjà prérendues et
// indexées), il ne les duplique pas. `prefill(answers, results)` construit les
// paramètres compris par readShareParams() (`?s=<base64 JSON>`) du simulateur
// cible — mêmes clés que l'objet `params` passé à sa ShareBar.

// Retire les valeurs vides pour ne préremplir que ce qui a été réellement saisi.
function clean(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && !(typeof v === 'number' && !isFinite(v))) out[k] = v;
  }
  return Object.keys(out).length ? out : null;
}

// Capacité d'épargne mensuelle déduite d'un passage par le simulateur budget
// (params = entrées sauvegardées par la capture de parcours dans ShareBar).
function epargneDispoDepuisBudget(results) {
  const p = results?.['/simulateurs/budget']?.params;
  if (!p || !p.revenus) return null;
  const dispo = p.revenus - (p.fixe || 0) - (p.variable || 0);
  return dispo > 0 ? Math.round(dispo) : null;
}

export const OBJECTIFS = [
  {
    slug: 'preparer-ma-retraite',
    enSlug: 'prepare-my-retirement',
    emoji: '🌅',
    recoContext: 'retraite',
    fr: {
      label: 'Préparer ma retraite',
      tagline: 'Estimez vos pensions, puis construisez le complément qui manque.',
      title: 'Comment préparer sa retraite ? Parcours guidé en 4 étapes',
      metaDescription: "Par où commencer pour préparer sa retraite à 40 ou 50 ans ? Un parcours guidé gratuit en 4 étapes : retraite de base CNAV, complémentaire Agirc-Arrco, PER et sortie en rente ou capital, avec synthèse finale.",
      h1: 'Comment préparer sa retraite ? Votre parcours guidé en 4 étapes',
      intro: [
        "Préparer sa retraite ne se résume pas à « ouvrir un PER » : la première question est de savoir combien vous toucherez réellement. Pour un salarié du privé, la pension vient de deux régimes obligatoires — la retraite de base du régime général (CNAV) et la complémentaire Agirc-Arrco — et l'écart entre le dernier salaire et la pension totale dépasse souvent 25 %.",
        "Ce parcours vous guide dans l'ordre logique : estimer votre retraite de base, puis votre complémentaire, mesurer l'écart avec votre niveau de vie actuel, et enfin dimensionner le complément d'épargne (PER, avec son avantage fiscal immédiat) et choisir entre rente viagère et retraits programmés au moment de la sortie.",
        "Vos saisies (salaire, années cotisées, âge de départ) se reportent d'une étape à l'autre, et une synthèse finale consolide les résultats. Tout est gratuit, sans inscription, et chaque simulateur reste utilisable indépendamment.",
      ],
      syntheseTitle: 'Synthèse retraite — récapitulatif de votre parcours',
      syntheseMetaDescription: "Le récapitulatif consolidé de votre parcours retraite : pension de base CNAV, complémentaire Agirc-Arrco, capital PER projeté et revenu mensuel à la sortie. Estimations indicatives, calculées dans votre navigateur.",
      syntheseH1: 'Votre synthèse retraite',
      syntheseIntro: "Ce récapitulatif rassemble les résultats des étapes de votre parcours « Préparer ma retraite » : pension de base, complémentaire, capital d'épargne retraite projeté et revenu mensuel à la sortie. Les montants sont des estimations indicatives calculées dans votre navigateur — rien n'est transmis ni conservé sur nos serveurs.",
    },
    en: {
      label: 'Prepare my retirement',
      tagline: 'Estimate your pensions, then build the missing complement.',
      title: 'How to Prepare for Retirement? A 4-Step Guided Journey | Simfinly',
      metaDescription: "Where to start preparing for retirement at 40 or 50? A free 4-step guided journey: French state pension, Agirc-Arrco complementary pension, retirement savings plan and annuity vs withdrawal, with a final summary.",
      h1: 'How to prepare for retirement? Your guided journey in 4 steps',
      intro: [
        "Preparing for retirement is not just about opening a savings plan: the first question is how much you will actually receive. For a private-sector employee in France, the pension comes from two mandatory schemes — the state pension (CNAV) and the Agirc-Arrco complementary pension — and the gap with your last salary often exceeds 25%.",
        "This journey guides you in the logical order: estimate your state pension, then your complementary pension, measure the gap with your current standard of living, and finally size the savings complement and choose between a life annuity and scheduled withdrawals.",
        "Your inputs (salary, contribution years, retirement age) carry over from one step to the next, and a final summary consolidates the results. Everything is free, with no sign-up, and each calculator remains usable on its own.",
      ],
      syntheseTitle: 'Retirement Summary — Your Journey Recap | Simfinly',
      syntheseMetaDescription: "The consolidated recap of your retirement journey: state pension, complementary pension, projected retirement savings and monthly income at payout. Indicative estimates, computed in your browser.",
      syntheseH1: 'Your retirement summary',
      syntheseIntro: "This recap gathers the results of your “Prepare my retirement” journey steps: state pension, complementary pension, projected retirement savings and monthly income at payout. Amounts are indicative estimates computed in your browser — nothing is sent to or stored on our servers.",
    },
    questions: [
      { key: 'salaire',      type: 'number', suffix: '€/mois', fr: 'Salaire brut mensuel',            en: 'Gross monthly salary' },
      { key: 'anneesFaites', type: 'number', suffix: 'ans',    fr: 'Années déjà cotisées',            en: 'Years already contributed' },
      { key: 'ageDepart',    type: 'number', suffix: 'ans',    fr: 'Âge de départ envisagé',          en: 'Planned retirement age' },
    ],
    steps: [
      {
        route: '/simulateurs/cnav',
        fr: { title: 'Estimer votre retraite de base (CNAV)', desc: "Le socle : la pension du régime général selon votre salaire, vos trimestres et votre âge de départ." },
        en: { title: 'Estimate your state pension (CNAV)', desc: 'The foundation: your general-scheme pension based on salary, quarters and retirement age.' },
        prefill: (a) => clean({ salaire: a.salaire, anneesFaites: a.anneesFaites, 'ageDépart': a.ageDepart }),
      },
      {
        route: '/simulateurs/agirc-arrco',
        fr: { title: 'Ajouter votre complémentaire Agirc-Arrco', desc: "Souvent un tiers de la pension d'un salarié du privé : vos points convertis en euros par mois." },
        en: { title: 'Add your Agirc-Arrco complementary pension', desc: 'Often a third of a private-sector pension: your points converted into euros per month.' },
        prefill: (a) => clean({ salaire: a.salaire, anneesFaites: a.anneesFaites, 'ageDépart': a.ageDepart }),
      },
      {
        route: '/simulateurs/per',
        fr: { title: "Dimensionner votre complément avec un PER", desc: "L'écart à combler devient un objectif d'épargne : capital projeté et économie d'impôt selon votre TMI." },
        en: { title: 'Size your complement with a retirement savings plan', desc: 'The gap to fill becomes a savings goal: projected capital and tax savings.' },
        prefill: (a) => clean({ revenu: a.salaire ? a.salaire * 12 : undefined, ageDepart: a.ageDepart }),
      },
      {
        route: '/simulateurs/rente-capital',
        fr: { title: 'Choisir entre rente et capital à la sortie', desc: "Le même capital, deux revenus différents : comparez rente viagère et retraits programmés." },
        en: { title: 'Choose between annuity and capital at payout', desc: 'The same capital, two different incomes: compare life annuity and scheduled withdrawals.' },
        prefill: () => null,
      },
    ],
  },
  {
    slug: 'acheter-un-bien-immobilier',
    enSlug: 'buy-a-home',
    emoji: '🏡',
    recoContext: 'emprunt',
    fr: {
      label: 'Acheter un bien immobilier',
      tagline: "Capacité d'emprunt, PTZ, frais de notaire : chiffrez votre projet de bout en bout.",
      title: 'Par où commencer pour acheter un bien immobilier ? Parcours guidé en 3 étapes',
      metaDescription: "Premier achat immobilier : par où commencer ? Un parcours guidé gratuit en 3 étapes — capacité d'emprunt et mensualités, droit au Prêt à Taux Zéro, frais de notaire — avec une synthèse finale de votre budget.",
      h1: 'Acheter un bien immobilier : votre parcours guidé en 3 étapes',
      intro: [
        "Avant de visiter des biens, il faut connaître trois chiffres : ce que la banque peut vous prêter, les aides auxquelles vous avez droit, et les frais annexes qui s'ajoutent au prix affiché. C'est dans cet ordre que ce parcours vous emmène, en partant simplement de vos revenus et du budget envisagé.",
        "Vous commencez par la capacité d'emprunt et la mensualité (taux d'endettement de 35 % maximum, assurance comprise), puis vous vérifiez votre éligibilité au Prêt à Taux Zéro — réservé aux primo-accédants sous conditions de ressources, il peut financer une part importante d'un logement neuf. Enfin, vous chiffrez les frais de notaire : environ 7 à 8 % du prix dans l'ancien, 2 à 3 % dans le neuf.",
        "Vos saisies (revenus, budget, apport) se reportent d'une étape à l'autre, et la synthèse finale récapitule mensualité, PTZ et frais pour donner une vision complète du coût de votre projet.",
      ],
      syntheseTitle: 'Synthèse achat immobilier — récapitulatif de votre parcours',
      syntheseMetaDescription: "Le récapitulatif consolidé de votre parcours d'achat immobilier : mensualité et capacité d'emprunt, montant de PTZ et frais de notaire. Estimations indicatives, calculées dans votre navigateur.",
      syntheseH1: 'Votre synthèse achat immobilier',
      syntheseIntro: "Ce récapitulatif rassemble les résultats des étapes de votre parcours « Acheter un bien immobilier » : mensualité et coût du crédit, Prêt à Taux Zéro et frais de notaire. Les montants sont des estimations indicatives calculées dans votre navigateur — rien n'est transmis ni conservé sur nos serveurs.",
    },
    en: {
      label: 'Buy a home',
      tagline: 'Borrowing capacity, zero-interest loan, notary fees: price your project end to end.',
      title: 'Where to Start When Buying a Home in France? A Guided Journey | Simfinly',
      metaDescription: "First home purchase in France: where to start? A free 3-step guided journey — borrowing capacity and monthly payments, zero-interest loan (PTZ) eligibility, notary fees — with a final budget summary.",
      h1: 'Buying a home: your guided journey in 3 steps',
      intro: [
        "Before visiting properties, you need three numbers: what the bank can lend you, the aid you are entitled to, and the extra costs added to the listed price. That is the order this journey follows, starting simply from your income and target budget.",
        "You start with borrowing capacity and the monthly payment (35% debt-ratio cap, insurance included), then check your eligibility for the French zero-interest loan (PTZ), reserved for first-time buyers under income conditions. Finally, you price the notary fees: about 7–8% of the price for an existing home, 2–3% for a new build.",
        "Your inputs (income, budget, down payment) carry over from one step to the next, and the final summary recaps monthly payment, PTZ and fees for a complete view of your project's cost.",
      ],
      syntheseTitle: 'Home Purchase Summary — Your Journey Recap | Simfinly',
      syntheseMetaDescription: "The consolidated recap of your home-buying journey: monthly payment and borrowing capacity, zero-interest loan amount and notary fees. Indicative estimates, computed in your browser.",
      syntheseH1: 'Your home purchase summary',
      syntheseIntro: "This recap gathers the results of your “Buy a home” journey steps: monthly payment and credit cost, zero-interest loan and notary fees. Amounts are indicative estimates computed in your browser — nothing is sent to or stored on our servers.",
    },
    questions: [
      { key: 'salaire', type: 'number', suffix: '€/mois', fr: 'Revenus nets mensuels du foyer', en: 'Household net monthly income' },
      { key: 'prix',    type: 'number', suffix: '€',      fr: "Budget d'achat envisagé",        en: 'Target purchase budget' },
      { key: 'apport',  type: 'number', suffix: '€',      fr: 'Apport personnel',               en: 'Down payment' },
    ],
    steps: [
      {
        route: '/simulateurs/emprunt-immobilier',
        fr: { title: "Mesurer votre capacité d'emprunt", desc: "Mensualité, taux d'endettement et coût total du crédit selon vos revenus, votre apport et la durée." },
        en: { title: 'Measure your borrowing capacity', desc: 'Monthly payment, debt ratio and total credit cost based on income, down payment and duration.' },
        prefill: (a) => clean({ prix: a.prix, apport: a.apport, salaire: a.salaire }),
      },
      {
        route: '/simulateurs/ptz',
        fr: { title: 'Vérifier votre droit au PTZ', desc: "Primo-accédant ? Selon la zone et vos revenus, le Prêt à Taux Zéro peut financer une partie du bien sans intérêts." },
        en: { title: 'Check your zero-interest loan (PTZ) eligibility', desc: 'First-time buyer? Depending on zone and income, the PTZ can finance part of the home interest-free.' },
        prefill: (a) => clean({ cout: a.prix }),
      },
      {
        route: '/simulateurs/frais-notaire',
        fr: { title: 'Chiffrer les frais de notaire', desc: "Droits de mutation, émoluments et débours : le vrai coût d'acquisition, ancien ou neuf." },
        en: { title: 'Price the notary fees', desc: 'Transfer duties, emoluments and disbursements: the real acquisition cost, existing or new build.' },
        prefill: (a) => clean({ prix: a.prix }),
      },
    ],
  },
  {
    slug: 'faire-fructifier-mon-argent',
    enSlug: 'grow-my-money',
    emoji: '📈',
    recoContext: 'epargne',
    fr: {
      label: 'Faire fructifier mon argent',
      tagline: "De la capacité d'épargne au choix des supports : investissez avec méthode.",
      title: 'Par où commencer pour investir son argent ? Parcours guidé en 4 étapes',
      metaDescription: "Comment placer et faire fructifier son argent quand on débute ? Un parcours guidé gratuit en 4 étapes : capacité d'épargne, intérêts composés, comparaison des supports (ETF, S&P 500) et enveloppe assurance-vie.",
      h1: 'Faire fructifier son argent : votre parcours guidé en 4 étapes',
      intro: [
        "Investir commence par une question que l'on saute trop souvent : combien pouvez-vous mettre de côté chaque mois sans vous mettre en difficulté ? Ce parcours démarre donc par votre budget, avant de parler de rendement ou de supports d'investissement.",
        "Une fois votre capacité d'épargne connue, vous visualisez ce que les intérêts composés en font sur 10, 20 ou 30 ans, puis vous comparez les grands supports — ETF mondiaux, S&P 500, actions — sur données historiques réelles. Enfin, vous évaluez l'assurance-vie, l'enveloppe préférée des Français, avec sa fiscalité allégée après 8 ans de détention.",
        "Vos saisies (épargne disponible, versement mensuel) se reportent d'une étape à l'autre, et la synthèse finale consolide capital projeté, performance comparée et fiscalité pour vous aider à passer à l'action.",
      ],
      syntheseTitle: 'Synthèse placement — récapitulatif de votre parcours',
      syntheseMetaDescription: "Le récapitulatif consolidé de votre parcours d'investissement : capacité d'épargne mensuelle, capital projeté par les intérêts composés, performance comparée des supports et projection assurance-vie.",
      syntheseH1: 'Votre synthèse placement',
      syntheseIntro: "Ce récapitulatif rassemble les résultats des étapes de votre parcours « Faire fructifier mon argent » : capacité d'épargne, projection à long terme, comparaison des supports et enveloppe assurance-vie. Les montants sont des estimations indicatives calculées dans votre navigateur — rien n'est transmis ni conservé sur nos serveurs.",
    },
    en: {
      label: 'Grow my money',
      tagline: 'From savings capacity to picking investments: invest with a method.',
      title: 'Where to Start Investing Your Money? A 4-Step Guided Journey | Simfinly',
      metaDescription: "How to invest and grow your money as a beginner? A free 4-step guided journey: savings capacity, compound interest, comparing investments (ETFs, S&P 500) and the French life-insurance wrapper.",
      h1: 'Growing your money: your guided journey in 4 steps',
      intro: [
        "Investing starts with a question too often skipped: how much can you set aside each month without putting yourself at risk? This journey therefore starts with your budget, before talking returns or investment vehicles.",
        "Once your savings capacity is known, you visualize what compound interest does to it over 10, 20 or 30 years, then compare the main vehicles — world ETFs, the S&P 500, stocks — on real historical data. Finally, you evaluate French life insurance, the country's favourite wrapper, with its lighter taxation after 8 years.",
        "Your inputs (available savings, monthly contribution) carry over from one step to the next, and the final summary consolidates projected capital, compared performance and taxation to help you take action.",
      ],
      syntheseTitle: 'Investing Summary — Your Journey Recap | Simfinly',
      syntheseMetaDescription: "The consolidated recap of your investing journey: monthly savings capacity, capital projected by compound interest, compared performance of investments and life-insurance projection.",
      syntheseH1: 'Your investing summary',
      syntheseIntro: "This recap gathers the results of your “Grow my money” journey steps: savings capacity, long-term projection, investment comparison and the life-insurance wrapper. Amounts are indicative estimates computed in your browser — nothing is sent to or stored on our servers.",
    },
    questions: [
      { key: 'revenus',         type: 'number', suffix: '€/mois', fr: 'Revenus nets mensuels',          en: 'Net monthly income' },
      { key: 'epargneActuelle', type: 'number', suffix: '€',      fr: 'Épargne déjà disponible',        en: 'Savings already available' },
      { key: 'versement',       type: 'number', suffix: '€/mois', fr: 'Versement mensuel envisagé',     en: 'Planned monthly contribution' },
    ],
    steps: [
      {
        route: '/simulateurs/budget',
        fr: { title: "Connaître votre capacité d'épargne", desc: "La règle 50/30/20 appliquée à vos revenus : combien pouvez-vous investir chaque mois ?" },
        en: { title: 'Know your savings capacity', desc: 'The 50/30/20 rule applied to your income: how much can you invest each month?' },
        prefill: (a) => clean({ revenus: a.revenus, epargneActuelle: a.epargneActuelle }),
      },
      {
        route: '/simulateurs/epargne',
        fr: { title: 'Projeter les intérêts composés', desc: "Votre épargne mensuelle sur 10, 20 ou 30 ans : le capital atteint selon le rendement." },
        en: { title: 'Project compound interest', desc: 'Your monthly savings over 10, 20 or 30 years: the capital reached depending on the return.' },
        prefill: (a, results) => clean({
          capitalInitial: a.epargneActuelle,
          versement: a.versement ?? epargneDispoDepuisBudget(results),
        }),
      },
      {
        route: '/simulateurs/comparateur',
        fr: { title: 'Comparer les supports (ETF, S&P 500…)', desc: "Performance historique réelle des grands supports : retour total et rendement annualisé." },
        en: { title: 'Compare investments (ETFs, S&P 500…)', desc: 'Real historical performance of the main vehicles: total return and annualized yield.' },
        prefill: (a) => clean({ montant: a.epargneActuelle }),
      },
      {
        route: '/simulateurs/assurance-vie',
        fr: { title: "Évaluer l'enveloppe assurance-vie", desc: "Croissance et fiscalité au rachat : l'avantage des 8 ans et les prélèvements sociaux, chiffrés." },
        en: { title: 'Evaluate the life-insurance wrapper', desc: 'Growth and taxation at withdrawal: the 8-year advantage and social levies, quantified.' },
        prefill: (a, results) => clean({
          initial: a.epargneActuelle,
          mensuel: a.versement ?? epargneDispoDepuisBudget(results),
        }),
      },
    ],
  },
];

export const OBJECTIFS_BY_SLUG = Object.fromEntries(
  OBJECTIFS.flatMap(o => [[o.slug, o], [o.enSlug, o]])
);

// Routes canoniques FR des pages du parcours (hub + landings + synthèses),
// consommées par api/_meta.js et api/_seo.js pour le prerender et le sitemap.
export const OBJECTIFS_HUB_ROUTE = '/objectifs';
export const objectifRoute = (o) => `/objectifs/${o.slug}`;
export const syntheseRoute = (o) => `/objectifs/${o.slug}/synthese`;
