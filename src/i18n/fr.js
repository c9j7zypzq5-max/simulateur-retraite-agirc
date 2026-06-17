// Dictionnaire français (locale par défaut). Source de vérité des libellés UI
// partagés. Les autres langues répliquent cette structure (mêmes clés).
//
// Convention de clés : regroupées par zone (nav, footer, sections…), en
// camelCase. On migre progressivement les chaînes en dur des composants vers ce
// fichier — le Footer sert de pilote.
export default {
  nav: {
    guides: 'Guides',
    blog: 'Blog',
    lexique: 'Lexique',
    apropos: 'À propos',
    methodologie: 'Méthodologie',
    widgets: 'Widgets',
    mentionsLegales: 'Mentions légales',
    confidentialite: 'Politique de confidentialité',
    contact: 'Contact',
  },
  footer: {
    rights: '© 2026 simfinly.com — Simulation non contractuelle',
  },
  sections: {
    relatedSimulators: 'Simulateurs liés',
    usefulDefinitions: 'Définitions utiles',
    relatedGuides: 'Guides liés',
    readOnBlog: 'À lire sur le blog',
    allLexique: 'Tout le lexique →',
  },
};
