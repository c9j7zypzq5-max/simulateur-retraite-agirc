import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROUTES = [
  '/simulateurs/agirc-arrco', '/simulateurs/cnav', '/simulateurs/fonction-publique',
  '/simulateurs/independants', '/simulateurs/ircantec', '/simulateurs/retraite-progressive',
  '/simulateurs/cnavpl', '/simulateurs/msa', '/simulateurs/emprunt-immobilier',
  '/simulateurs/rendement-locatif', '/simulateurs/impot-revenu', '/simulateurs/plus-value-immobiliere',
  '/simulateurs/epargne', '/simulateurs/fire', '/simulateurs/cout-en-heures',
  '/simulateurs/vie-en-semaines', '/simulateurs/budget', '/simulateurs/salaire',
  '/simulateurs/ptz', '/simulateurs/per',
  '/a-propos', '/mentions-legales', '/politique-de-confidentialite',
  '/blog', '/blog/comment-calculer-retraite-2025',
  '/blog/fire-france-independance-financiere', '/blog/simuler-emprunt-immobilier'
];

const distDir = path.resolve(__dirname, '../dist');
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

for (const route of ROUTES) {
  const dir = path.join(distDir, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);
}

console.log(`✓ Généré ${ROUTES.length} fichiers HTML statiques`);
