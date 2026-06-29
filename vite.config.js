import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
  },
  // Générateur vidéo désactivé en production (préserve le quota Vercel tant que
  // le site n'est pas monétisé) ; actif en preview et en local.
  define: {
    __VIDEO_ENABLED__: JSON.stringify(process.env.VERCEL_ENV !== 'production'),
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('react-dom') || id.includes('react/')) return 'react';
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('recharts') || id.includes('d3-')) return 'charts';
          if (id.includes('stripe')) return 'stripe';
          if (id.includes('src/data/glossaire') || id.includes('src/data/guides') || id.includes('src/data/comparatifs')) return 'content-data';
          if (id.includes('src/data/metiers') || id.includes('src/data/situations')) return 'metiers-data';
        },
      },
    },
  },
})
