// Rasterise le visuel Open Graph du builder (public/og-cover.svg) en PNG
// 1200×630. Les réseaux sociaux (Facebook, LinkedIn, X…) supportent mal le
// SVG en og:image ; le PNG est l'aperçu réellement affiché.
//
// @resvg/resvg-js n'est pas une dépendance du builder (il vit à la racine du
// repo, utilisé par scripts/generate-og-png.mjs du site principal). Ce script
// est un utilitaire manuel : le lancer depuis la racine du repo après toute
// modification de og-cover.svg :
//
//   node builder/scripts/generate-og.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');
const svg = fs.readFileSync(path.join(publicDir, 'og-cover.svg'), 'utf-8');

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true },
  background: '#0B1020',
});
const png = resvg.render().asPng();
fs.writeFileSync(path.join(publicDir, 'og-cover.png'), png);
console.log(`✓ og-cover.svg → og-cover.png (${(png.length / 1024).toFixed(0)} ko)`);
