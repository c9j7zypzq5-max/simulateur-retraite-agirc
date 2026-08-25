// Métadonnées de routes SANS dépendance aux données de contenu (glossaire,
// guides, comparatifs, métiers). Ce module est importé par le code CLIENT
// (usePageMeta, Footer, ShareBar…) : il doit rester léger pour ne pas embarquer
// les gros chunks de contenu dans le bundle initial de chaque page.
// Le reste (slugs de contenu, JSON-LD, hreflang) vit dans api/_routes.js,
// consommé uniquement au build et par les fonctions serverless.

export const BASE = 'https://www.simfinly.com';

// Méta par route : title (HTML statique), cat (og:image par catégorie),
// prio / freq (sitemap).
export const ROUTE_META = {
  '/':                                    { title: 'simfinly.com — 35+ simulateurs gratuits retraite, immobilier, finances', emoji: '📊', cat: '',          prio: '1.0', freq: 'weekly'  },
  // Retraite
  '/simulateurs/agirc-arrco':             { title: 'Simulateur Agirc-Arrco 2026 — combien de points vaut ma retraite ?',   emoji: '🏆', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/cnav':                    { title: 'Calculer sa retraite de base CNAV 2026 — simulation gratuite',         emoji: '🏛', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/fonction-publique':       { title: 'Simulateur retraite fonctionnaire 2026 — CNRACL, pension nette',      emoji: '⚖️', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/independants':            { title: 'Simulateur retraite indépendant TNS 2026 — SSI + RCI, calcul gratuit', emoji: '💼', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/ircantec':                { title: 'Simulateur Ircantec 2026 — calcul des points et de la pension',  emoji: '🏢', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/retraite-progressive':    { title: 'Simulateur retraite progressive 2026 — mi-temps, à quoi ai-je droit ?', emoji: '📅', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/cnavpl':                  { title: 'Simulateur retraite CIPAV 2026 — professions libérales, calcul gratuit', emoji: '👨‍⚕️', cat: 'Retraite', prio: '0.9', freq: 'monthly' },
  '/simulateurs/msa':                     { title: 'Simulateur retraite agricole MSA 2026 — exploitants, RCO & minimum',  emoji: '🌾', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/per':                     { title: 'Simulateur PER 2026 — économie d\'impôt immédiate & capital à la retraite', emoji: '💼', cat: 'Retraite',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/synthese-retraite':       { title: 'Synthèse retraite tous régimes 2026 — calculez votre pension totale',  emoji: '🧮', cat: 'Retraite',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/retraite-anticipee':      { title: 'Partir à la retraite avant 64 ans en 2026 — carrières longues & conditions', emoji: '⏩', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/pension-reversion':       { title: 'Simulateur pension de réversion 2026 — à combien ai-je droit ?',      emoji: '💞', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/rente-capital':           { title: 'Rente viagère vs retrait programmé 2026 — que choisir à la retraite ?', emoji: '⚖️', cat: 'Retraite',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/comparaison-reforme':     { title: 'Réforme retraite 2023 — quel impact sur votre pension ? Simulation',  emoji: '📊', cat: 'Retraite',   prio: '0.7', freq: 'monthly' },
  // Simulateurs Suisse
  '/simulateurs/lpp-deuxieme-pilier':     { title: 'Simulateur LPP 2e pilier Suisse 2025 — avoir & rente projetés',        emoji: '🏦', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/impot-revenu-ch':         { title: 'Simulateur impôt revenu Suisse — fédéral + cantonal 2025',             emoji: '📋', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/prevoyance-ch':           { title: 'Simulateur pilier 3a Suisse — capital & déduction fiscale 2025',       emoji: '🏦', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  // Immobilier
  '/simulateurs/emprunt-immobilier':      { title: 'Simulateur prêt immobilier 2026 — mensualités, capacité et TAEG',     emoji: '🏠', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  '/simulateurs/rendement-locatif':       { title: 'Calculer la rentabilité locative 2026 — rendement brut & net',         emoji: '📊', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  '/simulateurs/ptz':                     { title: 'Simulateur PTZ 2026 — suis-je éligible ? Quel montant ?',             emoji: '🏡', cat: 'Immobilier', prio: '0.8', freq: 'monthly' },
  '/simulateurs/frais-notaire':           { title: 'Calculateur frais de notaire 2026 — ancien vs neuf, calcul gratuit',   emoji: '🖋', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  // Impôts
  '/simulateurs/impot-revenu':            { title: 'Calculateur impôt sur le revenu 2026 — TMI, taux moyen, simulation',   emoji: '📋', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/plus-value-immobiliere':  { title: 'Simulateur plus-value immobilière 2026 — combien d\'impôt ?',          emoji: '📈', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/deficit-foncier':         { title: 'Déficit foncier 2026 — calculez l\'économie d\'impôt sur vos travaux', emoji: '🏚', cat: 'Impôts',     prio: '0.8', freq: 'monthly' },
  '/simulateurs/succession':              { title: 'Simulateur droits de succession 2026 — calcul par héritier',           emoji: '🎁', cat: 'Impôts',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/donation':                { title: 'Simulateur donation 2026 — abattement 100 000 € & droits à payer',     emoji: '🎁', cat: 'Impôts',     prio: '0.8', freq: 'monthly' },
  // Finances
  '/simulateurs/inflation':               { title: "Simulateur inflation & pouvoir d'achat personnalisé 2026",             emoji: '📈', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/budget':                  { title: 'Simulateur budget 50/30/20 — répartition & taux d\'épargne',           emoji: '📊', cat: 'Budget',     prio: '0.9', freq: 'monthly' },
  '/simulateurs/salaire':                 { title: 'Simulateur salaire net/brut 2026 — évolution de carrière',             emoji: '💼', cat: 'Finances',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/epargne':                 { title: 'Simulateur épargne & intérêts composés — projection long terme',       emoji: '💰', cat: 'Finances',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/fire':                    { title: 'Simulateur FIRE — indépendance financière & retraite anticipée',       emoji: '🔥', cat: 'FIRE',       prio: '0.9', freq: 'monthly' },
  '/simulateurs/patrimoine':              { title: 'Simulateur patrimoine global 2026 — richesse nette & répartition',     emoji: '💎', cat: 'Finances',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/comparateur':             { title: "Comparateur d'actifs — ETF, actions, crypto : performance historique", emoji: '📊', cat: 'Finances',   prio: '0.9', freq: 'weekly'  },
  '/simulateurs/assurance-vie':           { title: 'Simulateur assurance-vie — rendement & fiscalité au rachat',           emoji: '🛡️', cat: 'Finances',  prio: '0.8', freq: 'monthly' },
  '/simulateurs/epargne-salariale':       { title: 'Simulateur épargne salariale PEE PERCO PERO — gain fiscal',            emoji: '🏢', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/credit-conso':            { title: 'Simulateur crédit à la consommation — mensualité & coût total',        emoji: '💳', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/freelance-vs-salarie':    { title: 'Simulateur freelance vs salarié — revenus nets comparés 2026',         emoji: '💼', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  // Patrimoine & Juridique
  '/simulateurs/divorce':                 { title: 'Simulateur divorce & partage de patrimoine — prestation compensatoire', emoji: '⚖️', cat: 'Patrimoine', prio: '0.7', freq: 'monthly' },
  // Simulateurs BE-spécifiques
  '/simulateurs/pension-legale':          { title: 'Simulateur pension légale Belgique (ONSS) 2025 — salarié & indépendant', emoji: '🏦', cat: 'Retraite',  prio: '0.9', freq: 'monthly' },
  // Nouveaux simulateurs
  '/simulateurs/flat-tax':               { title: 'Simulateur flat tax / PFU 2026 — PFU 31,4 % ou barème progressif ?',   emoji: '📊', cat: 'Impôts',    prio: '0.9', freq: 'monthly' },
  '/simulateurs/trimestres':              { title: 'Simulateur trimestres retraite 2026 — durée d\'assurance & taux plein', emoji: '📅', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/simulateurs/succession-ch':           { title: 'Simulateur droits de succession Suisse 2025 — par canton', emoji: '🏔', cat: 'Impôts',     prio: '0.8', freq: 'monthly' },
  '/simulateurs/retraite-luxembourg':     { title: 'Retraite Luxembourg (CNAP) 2026 — simulateur frontaliers & pension', emoji: '🇱🇺', cat: 'Retraite', prio: '0.9', freq: 'monthly' },
  // Vie & Temps
  '/simulateurs/cout-en-heures':          { title: 'Simulateur prix en heures de vie — vrai coût d\'un achat',             emoji: '⏰', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/simulateurs/vie-en-semaines':         { title: 'Simulateur ma vie en semaines — visualiser son temps',                 emoji: '📅', cat: 'Finances',   prio: '0.8', freq: 'monthly' },
  '/outils/qr-code':                      { title: 'Générateur de QR code personnalisé — couleur, logo, texte libre',      emoji: '🔳', cat: '', prio: '0.7', freq: 'monthly' },
  // Retraite par métier (30 professions)
  '/retraite/fonctionnaire':         { title: 'Retraite fonctionnaire 2026 — âge, calcul, taux et pension nette',        emoji: '🏛️', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/infirmiere':            { title: 'Retraite infirmière 2026 — CNAV, FPH ou CARPIMKO',                        emoji: '🏥', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/enseignant':            { title: 'Retraite enseignant 2026 — âge, calcul de la pension et RAFP',            emoji: '📚', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/agriculteur':           { title: 'Retraite agriculteur 2026 — MSA, calcul et revalorisation',               emoji: '🌾', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/medecin-liberal':       { title: 'Retraite médecin libéral 2026 — CARMF, ASV et calcul de pension',         emoji: '⚕️', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/avocat':                { title: 'Retraite avocat 2026 — CNBF, calcul de la pension et cotisations',        emoji: '⚖️', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/artisan':               { title: 'Retraite artisan 2026 — SSI, RCI et validation des trimestres',           emoji: '🔨', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/commercant':            { title: 'Retraite commerçant 2026 — SSI, RCI et calcul de pension',                emoji: '🏪', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/pharmacien':            { title: 'Retraite pharmacien libéral 2026 — CAVP, calcul et âge de départ',        emoji: '💊', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/chirurgien-dentiste':   { title: 'Retraite dentiste libéral 2026 — CARCDSF, calcul et âge de départ',      emoji: '🦷', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/sage-femme':            { title: 'Retraite sage-femme 2026 — CARCDSF, FPH et calcul de pension',           emoji: '👶', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/veterinaire':           { title: 'Retraite vétérinaire libéral 2026 — CARPV, calcul et âge de départ',     emoji: '🐾', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/notaire':               { title: 'Retraite notaire 2026 — CRPCEN, calcul et âge de départ',                emoji: '📜', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/expert-comptable':      { title: 'Retraite expert-comptable 2026 — CAVEC, calcul et âge de départ',        emoji: '📊', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/architecte':            { title: 'Retraite architecte libéral 2026 — CIPAV, calcul et âge de départ',      emoji: '📐', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/ingenieur-cadre':       { title: 'Retraite cadre ingénieur 2026 — Agirc-Arrco, calcul et pension nette',   emoji: '💼', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/policier':              { title: 'Retraite policier 2026 — CNRACL, catégorie active et calcul de pension',  emoji: '🚔', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/militaire':             { title: 'Retraite militaire 2026 — pension militaire, calcul et âge de départ',   emoji: '🎖️', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/pompier':               { title: 'Retraite pompier professionnel 2026 — CNRACL, catégorie active',         emoji: '🚒', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/gendarme':              { title: 'Retraite gendarme 2026 — pension militaire, calcul et âge de départ',    emoji: '🫡', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/aide-soignante':        { title: 'Retraite aide-soignante 2026 — FPH catégorie active, calcul et pension', emoji: '🩺', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/magistrat':             { title: 'Retraite magistrat 2026 — SRE, calcul de pension et âge de départ',      emoji: '⚖️', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/chauffeur-routier':     { title: 'Retraite chauffeur routier 2026 — pénibilité, C2P et départ anticipé',   emoji: '🚛', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/caissiere':             { title: 'Retraite caissière 2026 — carrières longues, C2P et départ anticipé',    emoji: '🛒', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/ouvrier-usine':         { title: 'Retraite ouvrier industrie 2026 — pénibilité, C2P et départ anticipé',   emoji: '🏭', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/chef-entreprise':       { title: "Retraite chef d'entreprise 2026 — TNS, assimilé-salarié et stratégie",   emoji: '🏢', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/auto-entrepreneur':     { title: "Retraite auto-entrepreneur 2026 — SSI, points retraite et optimisation", emoji: '💻', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/intermittent':          { title: 'Retraite intermittent du spectacle 2026 — CNAV, Audiens et calcul',      emoji: '🎭', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/expatrie':              { title: "Retraite expatrié français 2026 — CFE, conventions bilatérales et droits", emoji: '✈️', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/diplomate':             { title: "Retraite diplomate fonctionnaire 2026 — SRE, bonifications et calcul",   emoji: '🏳️', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/kinesitherapeute':      { title: 'Retraite kinésithérapeute 2026 — CARPIMKO, calcul et âge de départ',    emoji: '🦵', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/chauffeur-vtc':         { title: 'Retraite chauffeur VTC 2026 — SSI, calcul et cotisations',              emoji: '🚕', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  // Retraite par situation de vie et calendrier
  '/retraite/calendrier-generations': { title: 'Âge départ retraite par année de naissance 2026 — tableau complet',      emoji: '📅', cat: 'Retraite', prio: '0.9', freq: 'monthly' },
  '/retraite/a-40-ans':              { title: 'Préparer sa retraite à 40 ans 2026 — PER, épargne et stratégie',          emoji: '🕐', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/a-50-ans':              { title: 'Préparer sa retraite à 50 ans 2026 — bilan, rachats, PER',                emoji: '📅', cat: 'Retraite', prio: '0.8', freq: 'monthly' },
  '/retraite/carriere-longue':       { title: 'Retraite carrière longue 2026 — conditions, âge de départ et calcul',     emoji: '⏩', cat: 'Retraite', prio: '0.9', freq: 'monthly' },
  '/retraite/parent-au-foyer':              { title: "Retraite parent au foyer 2026 — MDA, AVPF et droits complets",           emoji: '👶', cat: 'Retraite',   prio: '0.8', freq: 'monthly' },
  '/retraite/guide-complet-2026':           { title: 'Guide retraite 2026 — calcul, simulateurs et optimisation complète',     emoji: '📖', cat: 'Retraite',   prio: '1.0', freq: 'monthly' },
  '/retraite/points-agirc-arrco':           { title: 'Points Agirc-Arrco 2026 — valeur du point et calcul de la pension',       emoji: '🏆', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/retraite/calcul-pension-reversion':     { title: 'Pension de réversion 2026 — calcul, taux et conditions',                 emoji: '💞', cat: 'Retraite',   prio: '0.9', freq: 'monthly' },
  '/immobilier/frais-notaire':              { title: 'Frais de notaire 2026 — taux, calcul et comment les réduire',            emoji: '🏠', cat: 'Immobilier', prio: '0.9', freq: 'monthly' },
  '/impots/simulateur-impot-revenu':        { title: "Impôt sur le revenu 2026 — barème, calcul et réductions | simfinly",     emoji: '💰', cat: 'Fiscalité',  prio: '0.9', freq: 'monthly' },
  '/epargne/guide-per-2026':               { title: 'PER 2026 — guide complet, avantages fiscaux et comparatif assurance-vie', emoji: '📈', cat: 'Épargne',    prio: '0.9', freq: 'monthly' },
  '/immobilier/guide-complet-2026':        { title: 'Guide immobilier 2026 — emprunt, frais de notaire, PTZ et fiscalité',     emoji: '🏘️', cat: 'Immobilier', prio: '1.0', freq: 'monthly' },
  '/impots/guide-complet-2026':            { title: 'Guide impôts 2026 — barème, flat tax, plus-value et succession',          emoji: '📋', cat: 'Impôts',     prio: '1.0', freq: 'monthly' },
  '/epargne/guide-complet-2026':           { title: 'Guide FIRE et épargne 2026 — indépendance financière et Monte Carlo',     emoji: '🔥', cat: 'FIRE',       prio: '1.0', freq: 'monthly' },
  // Contenu éditorial
  '/blog':                                { title: 'Blog finances personnelles — retraite, immobilier, épargne, FIRE',     emoji: '📰', cat: '',          prio: '0.8', freq: 'weekly'  },
  '/lexique':                             { title: 'Lexique financier — définitions TAEG, PER, TMI, FIRE…',               emoji: '📖', cat: '',          prio: '0.7', freq: 'monthly' },
  '/guides':                              { title: 'Guides finances personnelles — retraite, immobilier, épargne',         emoji: '📚', cat: '',          prio: '0.8', freq: 'monthly' },
  '/comparatifs':                         { title: 'Comparatifs financiers — PER, achat vs location, freelance',          emoji: '⚖️', cat: '',          prio: '0.7', freq: 'monthly' },
  '/methodologie':                        { title: 'Méthodologie & sources — calculs simfinly.com',                        emoji: '🔬', cat: '',          prio: '0.4', freq: 'yearly'  },
  '/widgets':                             { title: 'Widgets gratuits à intégrer — simulateurs embarquables',               emoji: '🧩', cat: '',          prio: '0.5', freq: 'yearly'  },
  '/barometre-retraite':                  { title: 'Baromètre Retraite 2026 — Chiffres clés et tendances | simfinly.com',  emoji: '📊', cat: '',          prio: '0.7', freq: 'monthly' },
  '/recherche':                           { title: 'Recherche — simulateurs, guides et articles | simfinly.com',            emoji: '🔍', cat: '',          prio: '0.3', freq: 'weekly'  },
  '/a-propos':                            { title: 'À propos — simfinly.com',                                             emoji: '📊', cat: '',          prio: '0.3', freq: 'yearly'  },
  '/contact':                             { title: 'Contact — simfinly.com',                                              emoji: '✉️', cat: '',          prio: '0.3', freq: 'yearly'  },
  '/mentions-legales':                    { title: 'Mentions légales — simfinly.com',                                      emoji: '📊', cat: '',          prio: '0.2', freq: 'yearly'  },
  '/politique-de-confidentialite':        { title: 'Politique de confidentialité — simfinly.com',                         emoji: '📊', cat: '',          prio: '0.2', freq: 'yearly'  },
};

export const OG_IMAGE_BY_CAT = {
  Retraite:   '/og-retraite.png',
  Immobilier: '/og-immobilier.png',
  Impôts:     '/og-impots.png',
  Finances:   '/og-finances.png',
  FIRE:       '/og-finances.png',
  Budget:     '/og-finances.png',
};
export const OG_IMAGE_DEFAULT = '/og-image.png';

export function ogImageForRoute(route) {
  const meta = ROUTE_META[route];
  return (meta && OG_IMAGE_BY_CAT[meta.cat]) || OG_IMAGE_DEFAULT;
}
