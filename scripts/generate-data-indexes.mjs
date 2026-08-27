// Génère les index légers des gros jeux de données de contenu.
//
// Problème résolu : glossaire.js (~200 Ko), guides.js (~65 Ko) et metiers.js
// (~140 Ko) portent tout le contenu éditorial de leurs pages dédiées. Or trois
// usages présents hors de ces pages n'ont besoin que de quelques champs :
//
//   • AutoLinkText (via ui.jsx) et <Terme>   → glossaire, sur TOUTES les pages
//   • bloc « définitions utiles » du Footer  → glossaire, sur les simulateurs
//   • bloc « guides associés » du Footer     → guides,    sur les simulateurs
//   • liste des métiers de la page d'accueil → metiers,   sur l'accueil
//
// Ces usages chargeaient le jeu de données complet : des centaines de Ko de
// définitions longues, de FAQ et de sections pour afficher une liste de liens.
//
// Les fichiers source restent la source unique de vérité, éditée à la main avec
// leurs commentaires. Les index en sont dérivés ; les tests correspondants
// échouent si les deux divergent. Régénérer : npm run gen:indexes
// (exécuté automatiquement par npm run build).

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GLOSSARY } from '../src/data/glossaire.js';
import { GUIDES } from '../src/data/guides.js';
import { METIERS_LIST } from '../src/data/metiers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = (name) => path.join(__dirname, '..', 'src', 'data', name);

// Champs conservés dans chaque index. Toute addition ici alourdit le bundle des
// pages concernées : ne les étendre que pour un besoin réellement transverse.
export const INDEX_FIELDS = {
  glossaire: ['slug', 'term', 'full', 'aliases', 'short', 'sims'],
  guides: ['slug', 'title', 'icon', 'sims'],
  metiers: ['slug', 'icon', 'title'],
};

export function pick(entry, fields) {
  const out = {};
  for (const f of fields) {
    if (entry[f] !== undefined) out[f] = entry[f];
  }
  return out;
}

function header(source, quoi) {
  return `// FICHIER GÉNÉRÉ — ne pas modifier à la main.
// Source : src/data/${source} · Régénérer : npm run gen:indexes
//
// ${quoi}
`;
}

const outputs = [
  {
    file: 'glossaireIndex.js',
    body: header(
      'glossaire.js',
      `Index léger du lexique : uniquement les champs nécessaires à l'auto-liaison
// des termes, à l'infobulle <Terme> et au bloc « définitions utiles » du Footer.
// Ces usages sont présents sur toutes les pages ; charger glossaire.js en entier
// pour eux faisait télécharger les définitions longues et les FAQ dont seules
// les pages /lexique ont besoin.`
    ) + `
export const GLOSSARY_INDEX = ${JSON.stringify(GLOSSARY.map(t => pick(t, INDEX_FIELDS.glossaire)), null, 2)};

export const GLOSSARY_INDEX_BY_SLUG = Object.fromEntries(GLOSSARY_INDEX.map(t => [t.slug, t]));

// Liste plate { match, slug } triée par longueur décroissante : les expressions
// longues priment (« plus-value immobilière » avant « plus-value »).
export const TERM_MATCHERS = GLOSSARY_INDEX
  .flatMap(t => [t.term, ...(t.aliases || [])].map(m => ({ match: m, slug: t.slug })))
  .sort((a, b) => b.match.length - a.match.length);
`,
  },
  {
    file: 'guidesIndex.js',
    body: header(
      'guides.js',
      `Index léger des guides : de quoi afficher le bloc « guides associés » du
// Footer sur les pages simulateur, sans embarquer les sections complètes de
// chaque guide.`
    ) + `
export const GUIDES_INDEX = ${JSON.stringify(GUIDES.map(g => pick(g, INDEX_FIELDS.guides)), null, 2)};
`,
  },
  {
    file: 'metiersIndex.js',
    body: header(
      'metiers.js',
      `Index léger des fiches métier : de quoi afficher la liste des métiers de la
// page d'accueil, sans embarquer les sections et FAQ de chaque fiche.`
    ) + `
export const METIERS_INDEX = ${JSON.stringify(METIERS_LIST.map(m => pick(m, INDEX_FIELDS.metiers)), null, 2)};
`,
  },
];

for (const { file, body } of outputs) {
  const out = dataFile(file);
  fs.writeFileSync(out, body);
  const source = file.replace('Index.js', '.js');
  const srcKo = fs.statSync(dataFile(source)).size / 1024;
  console.log(`✓ ${file} — ${(body.length / 1024).toFixed(0)} Ko (source ${source} : ${srcKo.toFixed(0)} Ko)`);
}
