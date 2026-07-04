// Feature flags — mettre à true pour réactiver en production.
// ACCOUNT_ENABLED : connexion, compte, Pro, Tableau de bord, Synthèse patrimoniale.
// « Mes simulations » (sauvegarde locale via useSimHistory) ne dépend PAS de ce
// flag : c'est du pur localStorage, ça fonctionne déjà sans compte.
export const ACCOUNT_ENABLED = false;
