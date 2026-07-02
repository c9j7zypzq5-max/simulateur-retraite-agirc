// Contenu éditorial « À propos de ce simulateur » par route, centralisé pour
// être partagé entre le composant (affichage utilisateur) ET le HTML pré-rendu
// (api/_seo.js → crawlable sans JS). Même principe que faqs.js : une seule
// source, pas de divergence possible entre l'app et le prérendu.
//
// Format : { title, text }[]. `title` → <h3>/<h2>, `text` → <p>.

export const EDITORIAL_BY_ROUTE = {
  '/simulateurs/agirc-arrco': [
    { title: "Un régime par points pour tous les salariés du privé", text: "L'Agirc-Arrco est le régime de retraite complémentaire obligatoire de l'ensemble des salariés du secteur privé en France. Il fonctionne par accumulation de points : chaque année, une fraction de vos cotisations salariales et patronales est convertie en points de retraite. Au moment de votre départ, le total de vos points est multiplié par la valeur de service du point pour calculer votre pension complémentaire annuelle." },
    { title: "Tranche 1 et Tranche 2 : une cotisation progressive", text: "Vos cotisations sont calculées sur deux tranches définies par rapport au Plafond Annuel de la Sécurité Sociale (PASS, 48 060 € en 2026, soit 4 005 €/mois). La Tranche 1 couvre la part de salaire jusqu'au PASS, avec un taux global de 7,87 %. La Tranche 2 s'applique sur la part entre 1 et 8 PASS, avec un taux de 21,59 %. Cette progressivité explique que les hauts salaires accumulent proportionnellement plus de points chaque année." },
    { title: "Valeur d'achat et valeur de service : deux piliers du système", text: "Le mécanisme repose sur deux valeurs distinctes. La valeur d'achat (20,1877 € en 2026) est le coût d'un point : elle détermine combien de points vous accumulez par euro de cotisation. La valeur de service (1,4386 €/point en 2026) est ce que vaut un point lors du versement de votre pension. Ces deux paramètres sont révisés chaque novembre par les partenaires sociaux pour tenir compte de l'inflation et de l'évolution des salaires." },
    { title: "Complémentaire et retraite de base : un duo indissociable", text: "La retraite Agirc-Arrco vient en complément de la retraite de base versée par la CNAV. Pour un salarié type, elle représente entre 30 % et 60 % du total de sa pension. Plus la carrière est longue et le salaire élevé, plus la part complémentaire est significative. La gestion est assurée paritairement par les organisations syndicales de salariés et les organisations patronales — sans intervention de l'État." },
  ],
};
