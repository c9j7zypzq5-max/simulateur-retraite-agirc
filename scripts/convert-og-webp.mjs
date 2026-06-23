import sharp from 'sharp';
import { readdirSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '../public');

const pngs = readdirSync(publicDir).filter(f => f.startsWith('og-') && f.endsWith('.png'));

for (const file of pngs) {
  const src = join(publicDir, file);
  const dest = join(publicDir, file.replace('.png', '.webp'));
  await sharp(src).webp({ quality: 90 }).toFile(dest);
  console.log(`✓ ${file} → ${basename(dest)}`);
}
console.log(`Converti ${pngs.length} fichiers OG PNG → WebP`);
