// Rasterise les visuels Open Graph SVG (public/og-*.svg) en PNG 1200×630.
// Les réseaux sociaux (Facebook, LinkedIn, X…) supportent mal le SVG en og:image ;
// le PNG est l'aperçu de partage réellement affiché.
//
// À relancer après modification d'un og-*.svg :  node scripts/generate-og-png.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

const svgs = fs.readdirSync(publicDir).filter(f => /^og-.*\.svg$/.test(f));

for (const file of svgs) {
  const svg = fs.readFileSync(path.join(publicDir, file), 'utf-8');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: { loadSystemFonts: true },
    background: '#060e1c',
  });
  const png = resvg.render().asPng();
  const out = file.replace(/\.svg$/, '.png');
  fs.writeFileSync(path.join(publicDir, out), png);
  console.log(`✓ ${file} → ${out} (${(png.length / 1024).toFixed(0)} ko)`);
}

console.log(`✓ ${svgs.length} visuels Open Graph rasterisés en PNG`);
