import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Modules virtuels « allégés » du glossaire et des guides : seuls les champs
// dont ont besoin les composants présents sur (presque) toutes les pages —
// infobulles <Terme>, auto-liaison des termes, termes et guides liés du pied
// de page, recherche de l'accueil. Dérivés au build des fichiers de données
// (source unique, rien à synchroniser à la main) : ~44 Ko au lieu de ~183 Ko
// pour le glossaire. Les pages du lexique/des guides gardent les modules complets.
const LITE_MODULES = {
  'virtual:glossaire-lite': {
    file: 'src/data/glossaire.js',
    build: ({ GLOSSARY }) => {
      const lite = GLOSSARY.map(({ slug, term, full, short, aliases, sims, category }) => ({ slug, term, full, short, aliases, sims, category }))
      // Mêmes dérivations que src/data/glossaire.js (ordre des matchers compris).
      return `export const GLOSSARY = ${JSON.stringify(lite)};
export const GLOSSARY_BY_SLUG = Object.fromEntries(GLOSSARY.map(t => [t.slug, t]));
export const TERM_MATCHERS = GLOSSARY
  .flatMap(t => [t.term, ...(t.aliases || [])].map(m => ({ match: m, slug: t.slug })))
  .sort((a, b) => b.match.length - a.match.length);
`
    },
  },
  'virtual:metiers-lite': {
    file: 'src/data/metiers.js',
    build: ({ METIERS_LIST }) => {
      const lite = METIERS_LIST.map(({ slug, icon, title, subtitle }) => ({ slug, icon, title, subtitle }))
      return `export const METIERS_LIST = ${JSON.stringify(lite)};\n`
    },
  },
  'virtual:guides-lite': {
    file: 'src/data/guides.js',
    build: ({ GUIDES }) => {
      const lite = GUIDES.map(({ slug, title, icon, category, sims }) => ({ slug, title, icon, category, sims }))
      return `export const GUIDES = ${JSON.stringify(lite)};\n`
    },
  },
}

// FAQ d'un simulateur : `import FAQ from 'virtual:faq:/simulateurs/fire'` ne
// contient que les questions de cette page (src/data/faqs.js en regroupe ~45,
// soit ~36 Ko gzip qu'importait chaque simulateur pour en afficher une poignée).
const FAQ_PREFIX = 'virtual:faq:'
const FAQ_FILE = 'src/data/faqs.js'

function liteDataModules() {
  const importFresh = async (ctx, rel) => {
    const file = fileURLToPath(new URL(rel, import.meta.url))
    ctx.addWatchFile(file)
    // Paramètre anti-cache : relit le fichier modifié en dev (HMR).
    return import(`${pathToFileURL(file).href}?t=${Date.now()}`)
  }
  return {
    name: 'lite-data-modules',
    resolveId(id) { if (LITE_MODULES[id] || id.startsWith(FAQ_PREFIX)) return '\0' + id },
    async load(id) {
      if (!id.startsWith('\0')) return
      const name = id.slice(1)
      if (name.startsWith(FAQ_PREFIX)) {
        const { FAQS } = await importFresh(this, FAQ_FILE)
        const route = name.slice(FAQ_PREFIX.length)
        return `export default ${JSON.stringify(FAQS[route]) ?? 'undefined'};\n`
      }
      const def = LITE_MODULES[name]
      if (!def) return
      return def.build(await importFresh(this, def.file))
    },
  }
}

export default defineConfig({
  plugins: [react(), liteDataModules()],
  test: {
    // builder/ est un projet autonome (ses propres dépendances, sa propre config
    // Vitest) : ses tests tournent depuis builder/ (job CI dédié). Les ramasser
    // ici échoue faute de ses dépendances (expr-eval-fork…) à la racine.
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**', 'builder/**'],
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
          // Chunks séparés : une page qui n'a besoin que du glossaire (lexique)
          // ne télécharge plus guides + comparatifs, et inversement.
          if (id.includes('src/data/glossaire')) return 'glossaire-data';
          if (id.includes('src/data/guides')) return 'guides-data';
          if (id.includes('src/data/comparatifs')) return 'comparatifs-data';
          if (id.includes('src/data/metiers') || id.includes('src/data/situations')) return 'metiers-data';
        },
      },
    },
  },
})
