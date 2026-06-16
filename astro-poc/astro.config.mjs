import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// PoC : démontre le rendu statique (SSG) des pages de contenu + des « islands »
// React pour l'interactif. fs.allow('..') autorise l'import du contenu réel des
// articles depuis ../scripts (hors racine du PoC).
export default defineConfig({
  site: 'https://www.mesimulateurs.fr',
  integrations: [react()],
  vite: { server: { fs: { allow: ['..'] } } },
});
