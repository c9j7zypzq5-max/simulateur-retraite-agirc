import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
import { TEMPLATES } from './src/schema/templates';

// Génère dist/sitemap.xml au build à partir des routes marketing indexables :
// la landing, la galerie et une fiche par modèle (source unique = TEMPLATES,
// donc le sitemap suit automatiquement l'ajout de modèles). Les écrans
// applicatifs sont exclus (voir public/robots.txt). apply: 'build' → n'affecte
// ni le dev ni les tests. __dirname est fourni par le loader de config Vite.
function sitemapPlugin() {
  const ORIGIN = 'https://app.simfinly.com';
  const entries: { path: string; priority: string }[] = [
    { path: '/', priority: '1.0' },
    { path: '/modeles', priority: '0.8' },
    ...TEMPLATES.map((tpl) => ({ path: `/modeles/${tpl.id}`, priority: '0.6' })),
  ];
  return {
    name: 'builder-sitemap',
    apply: 'build' as const,
    closeBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const urls = entries
        .map((e) => `  <url><loc>${ORIGIN}${e.path}</loc><lastmod>${today}</lastmod><priority>${e.priority}</priority></url>`)
        .join('\n');
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
      writeFileSync(resolve(__dirname, 'dist/sitemap.xml'), xml);
    },
  };
}

// Deux entrées : index.html = SPA du builder (app.simfinly.com),
// s.html = runtime public léger (app.simfinly.com/s/{slug}, routé par chemin
// — voir vercel.json ; le rewrite /s/(.*) → /s.html n'existe qu'en
// production/preview Vercel, pas en dev local).
export default defineConfig({
  plugins: [react(), sitemapPlugin()],
  build: {
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'index.html'),
        s: resolve(__dirname, 's.html'),
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'api/**/*.test.js'],
  },
});
