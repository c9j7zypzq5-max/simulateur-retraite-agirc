import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**', 'builder/e2e/**'],
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
          // Bornes de chemin précises : un simple id.includes('react/') capture
          // aussi n'importe quel paquet scoped se terminant par "/react" (ex.
          // @sentry/react, dont le chemin contient "react/build/..."), ce qui le
          // forçait dans ce chunk partagé chargé sur CHAQUE page.
          if (/[\\/]node_modules[\\/]react-dom[\\/]/.test(id) || /[\\/]node_modules[\\/]react[\\/]/.test(id)) return 'react';
          // PAS de règle manuelle pour @supabase : forcer ce module dans un chunk
          // nommé faisait que Rollup le traitait comme un chunk "partagé" éligible
          // au modulepreload sur TOUTE page, même si son seul importeur restant
          // (AuthProvider, ShareBar) n'utilise qu'un import() dynamique conditionné
          // à ACCOUNT_ENABLED. Laisser le chunking automatique de Rollup respecte
          // correctement la frontière async — le SDK Supabase (~55 Ko gzippés)
          // n'est alors plus jamais téléchargé tant qu'ACCOUNT_ENABLED = false.
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('recharts') || id.includes('d3-')) return 'charts';
          if (id.includes('stripe')) return 'stripe';
          // Un chunk PAR jeu de données, jamais un chunk « contenu » fourre-tout :
          // AutoLinkText (présent via ui.jsx sur toutes les pages) ne charge que
          // le glossaire, mais un chunk commun lui faisait aussi télécharger
          // guides + comparatifs — ~160 Ko inutiles sur chaque page simulateur.
          // glossaireIndex AVANT glossaire : la seconde règle capturerait sinon
          // l'index (« src/data/glossaire » est un préfixe de « …glossaireIndex »),
          // les fusionnant dans un même chunk — ce qui annule tout le bénéfice.
          // Index légers d'abord : « src/data/glossaire » est un préfixe de
          // « …glossaireIndex », la règle large capturerait sinon l'index et le
          // fusionnerait avec sa source, annulant tout le bénéfice.
          if (id.includes('src/data/glossaireIndex')) return 'glossaire-index';
          if (id.includes('src/data/guidesIndex')) return 'guides-index';
          if (id.includes('src/data/metiersIndex')) return 'metiers-index';
          if (id.includes('src/data/glossaire')) return 'glossaire-data';
          if (id.includes('src/data/guides')) return 'guides-data';
          if (id.includes('src/data/comparatifs')) return 'comparatifs-data';
          if (id.includes('src/data/metiers') || id.includes('src/data/situations')) return 'metiers-data';
        },
      },
    },
  },
})
