/**
 * Smoke tests dérivés automatiquement des routes déclarées dans src/App.jsx.
 *
 * Contexte : un audit manuel a trouvé 10 pages qui plantaient intégralement
 * sur toute visite normale (readShareParams() renvoie null) et 2 pages qui
 * plantaient dès qu'un lien de partage réel était ouvert (readShareParams()
 * renvoie un objet simple, pas un URLSearchParams — p.get n'existe pas).
 * Ces bugs dormaient depuis des mois, invisibles car la suite e2e existante
 * ne couvrait qu'une poignée de routes FR et n'était jamais exécutée en CI.
 *
 * Ce fichier ne liste aucune route à la main : il relit App.jsx pour
 * extraire chaque (chemin, composant) statique, et le fichier source de
 * chaque composant pour savoir s'il utilise readShareParams(). Toute
 * nouvelle route ajoutée à App.jsx est donc automatiquement couverte.
 */
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Pages qui nécessitent un état préalable (session connectée, rôle admin) —
// leur comportement "non connecté" est déjà couvert par e2e/auth-pages.spec.js
// et e2e/pro.spec.js ; les inclure ici produirait des faux positifs.
const EXCLUDE_COMPONENTS = new Set([
  'Compte', 'TableauDeBord', 'MesSimulations', 'WizardRetraite', 'AdminBlog',
]);

// ── Extrait chaque (chemin, composant) statique déclaré dans App.jsx ────────
// Dédupliqué par (composant, catégorie de préfixe) : un composant partagé
// entre FR/BE/CH/LU (ex. Epargne.jsx) n'est testé qu'une fois par catégorie
// réellement distincte côté logique (fr, en, be, ch, lu), pas une fois par
// URL — sinon le même code serait revisité 4x sans rien découvrir de plus.
function extractRoutes() {
  const appSrc = fs.readFileSync(path.join(ROOT, 'src/App.jsx'), 'utf-8');
  const re = /<Route\s+path="([^"]+)"\s+element=\{<(\w+)/g;
  const seen = new Map();
  let m;
  while ((m = re.exec(appSrc))) {
    const [, routePath, component] = m;
    if (routePath.includes(':')) continue; // routes dynamiques, non visitables telles quelles
    if (EXCLUDE_COMPONENTS.has(component)) continue;
    const category = routePath.startsWith('/en') ? 'en'
      : routePath.startsWith('/be') ? 'be'
      : routePath.startsWith('/ch') ? 'ch'
      : routePath.startsWith('/lu') ? 'lu'
      : routePath.startsWith('/qc') ? 'qc'
      : 'fr';
    const key = `${component}:${category}`;
    if (!seen.has(key)) seen.set(key, { component, routePath, category });
  }
  return [...seen.values()];
}

// ── Composants dont le fichier source appelle readShareParams() ────────────
// C'est exactement le pattern à l'origine des deux classes de bugs trouvées :
// crash sur visite normale (p === null) et crash sur lien de partage réel
// (p.get n'existe pas, readShareParams() renvoie un objet simple).
function componentsUsingShareParams() {
  const names = new Set();
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith('.jsx')) {
        const content = fs.readFileSync(p, 'utf-8');
        if (content.includes('readShareParams')) names.add(entry.name.replace(/\.jsx$/, ''));
      }
    }
  }
  walk(path.join(ROOT, 'src/pages'));
  walk(path.join(ROOT, 'src')); // couvre SimulateurRetraite.jsx (racine)
  return names;
}

const routes = extractRoutes();
const shareUsers = componentsUsingShareParams();

// Une route représentative par composant utilisant readShareParams() — la
// logique fromParams()/readShareParams() ne varie pas selon le pays/la
// locale de montage, donc tester chaque composant une fois (en préférant sa
// route FR canonique) suffit ; le retester sous /be/, /ch/, /lu/, /en/ ne
// découvrirait rien de plus pour CE bug précis.
function representativeShareRoutes() {
  const byComponent = new Map();
  for (const r of routes) {
    if (!shareUsers.has(r.component)) continue;
    const current = byComponent.get(r.component);
    if (!current || (current.category !== 'fr' && r.category === 'fr')) {
      byComponent.set(r.component, r);
    }
  }
  return [...byComponent.values()];
}

const CRASH_TEXT = ["n'a pas pu être chargée", "could not be loaded"];

async function assertNoCrash(page, label) {
  // expect.poll plutôt qu'une pause fixe : en mode dev, un chunk lazy peut
  // mettre plus ou moins longtemps à se compiler/monter selon la route (déjà
  // visitée ou non) — une pause fixe est soit trop courte (faux positifs),
  // soit inutilement longue pour les 200+ routes du crawl.
  await expect.poll(
    async () => (await page.locator('body').innerText()).length,
    { message: `page vide sur ${label}`, timeout: 8000 }
  ).toBeGreaterThan(100);
  const bodyText = await page.locator('body').innerText();
  for (const t of CRASH_TEXT) {
    expect(bodyText, `écran d'erreur affiché sur ${label}`).not.toContain(t);
  }
}

test.describe('Smoke — chaque route déclarée charge sans crash', () => {
  for (const { component, routePath } of routes) {
    test(`${routePath} (${component})`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      // 'domcontentloaded' plutôt que 'load' : ne bloque pas sur les
      // ressources tierces (AdSense/GTM) injoignables dans certains
      // environnements (CI, bac à sable), qui feraient sinon expirer
      // chaque test au timeout de navigation par défaut.
      await page.goto(routePath, { waitUntil: 'domcontentloaded' });
      await assertNoCrash(page, routePath);
      expect(errors, `erreur JS non interceptée sur ${routePath}: ${errors.join('; ')}`).toHaveLength(0);
    });
  }
});

test.describe('Smoke — lien de partage vide, sans crash (readShareParams)', () => {
  // "{}" encodé en base64 : reproduit exactement les deux bugs historiques
  // (p === null sur visite normale n'est PAS testé ici, déjà couvert par le
  // describe ci-dessus ; ceci couvre le second bug — p existe mais n'a pas
  // les méthodes/props attendues).
  const emptyShare = Buffer.from(JSON.stringify({})).toString('base64');

  for (const { component, routePath } of representativeShareRoutes()) {
    test(`${routePath}?s=<partage vide> (${component})`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(`${routePath}?s=${emptyShare}`, { waitUntil: 'domcontentloaded' });
      await assertNoCrash(page, `${routePath}?s=`);
      expect(errors, `erreur JS non interceptée sur ${routePath}?s= : ${errors.join('; ')}`).toHaveLength(0);
    });
  }
});
