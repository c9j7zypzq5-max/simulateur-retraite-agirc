import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
        },
      },
    },
  },
})
