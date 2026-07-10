import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Deux entrées : index.html = SPA du builder (app.simfinly.com),
// s.html = runtime public léger (app.simfinly.com/s/{slug}, routé par chemin
// — voir vercel.json ; le rewrite /s/(.*) → /s.html n'existe qu'en
// production/preview Vercel, pas en dev local).
export default defineConfig({
  plugins: [react()],
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
    include: ['src/**/*.test.ts'],
  },
});
