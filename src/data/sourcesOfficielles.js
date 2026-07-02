// Sources officielles citées en bas des simulateurs et pages métiers (E-E-A-T :
// pour du contenu financier YMYL, citer ses sources est un signal de confiance
// fort, pour Google comme pour les lecteurs). Uniquement des domaines racines
// institutionnels — pas d'URL profonde susceptible de casser.
// Consommé par le Footer (affichage) et api/_seo.js (bloc pré-rendu statique).

const S = {
  infoRetraite:   { name: "Info-Retraite — GIP Union Retraite", url: "https://www.info-retraite.fr" },
  cnav:           { name: "L'Assurance retraite (CNAV)", url: "https://www.lassuranceretraite.fr" },
  agircArrco:     { name: "Agirc-Arrco — régime complémentaire", url: "https://www.agirc-arrco.fr" },
  servicePublic:  { name: "Service-Public.fr", url: "https://www.service-public.fr" },
  impotsGouv:     { name: "impots.gouv.fr — administration fiscale", url: "https://www.impots.gouv.fr" },
  legifrance:     { name: "Légifrance — textes officiels", url: "https://www.legifrance.gouv.fr" },
  msa:            { name: "MSA — sécurité sociale agricole", url: "https://www.msa.fr" },
  ircantec:       { name: "Ircantec — caisse des contractuels publics", url: "https://www.ircantec.retraites.fr" },
  sre:            { name: "Retraites de l'État (SRE)", url: "https://retraitesdeletat.gouv.fr" },
  cnracl:         { name: "CNRACL — retraite des agents territoriaux et hospitaliers", url: "https://www.cnracl.retraites.fr" },
  urssaf:         { name: "Urssaf — cotisations des indépendants", url: "https://www.urssaf.fr" },
  anil:           { name: "ANIL — agence nationale pour l'information sur le logement", url: "https://www.anil.org" },
  amf:            { name: "AMF — Autorité des marchés financiers", url: "https://www.amf-france.org" },
  economieGouv:   { name: "economie.gouv.fr — ministère de l'Économie", url: "https://www.economie.gouv.fr" },
};

// Fallback par catégorie (ROUTE_META.cat) : couvre tous les simulateurs.
export const SOURCES_BY_CAT = {
  Retraite:   [S.infoRetraite, S.cnav, S.servicePublic],
  "Impôts":   [S.impotsGouv, S.servicePublic, S.legifrance],
  Immobilier: [S.servicePublic, S.anil, S.impotsGouv],
  Finances:   [S.amf, S.economieGouv, S.servicePublic],
  FIRE:       [S.amf, S.economieGouv],
  Budget:     [S.economieGouv, S.servicePublic],
};

// Surcharges par route quand une caisse ou institution précise fait autorité.
export const SOURCES_BY_ROUTE = {
  '/simulateurs/agirc-arrco':        [S.agircArrco, S.infoRetraite, S.cnav],
  '/simulateurs/cnav':               [S.cnav, S.infoRetraite, S.servicePublic],
  '/simulateurs/fonction-publique':  [S.sre, S.cnracl, S.infoRetraite],
  '/simulateurs/ircantec':           [S.ircantec, S.infoRetraite],
  '/simulateurs/msa':                [S.msa, S.infoRetraite],
  '/simulateurs/independants':       [S.urssaf, S.infoRetraite, S.servicePublic],
  '/simulateurs/impot-revenu':       [S.impotsGouv, S.legifrance, S.servicePublic],
  '/simulateurs/flat-tax':           [S.impotsGouv, S.legifrance],
  '/simulateurs/plus-value-immobiliere': [S.impotsGouv, S.servicePublic],
  '/simulateurs/succession':         [S.impotsGouv, S.servicePublic, S.legifrance],
  '/simulateurs/donation':           [S.impotsGouv, S.servicePublic],
  '/retraite/fonctionnaire':         [S.sre, S.cnracl, S.infoRetraite],
  '/retraite/agriculteur':           [S.msa, S.infoRetraite],
};

// Sources d'une route : surcharge spécifique, sinon fallback catégorie.
export function sourcesForRoute(route, cat) {
  return SOURCES_BY_ROUTE[route] || SOURCES_BY_CAT[cat] || [];
}
