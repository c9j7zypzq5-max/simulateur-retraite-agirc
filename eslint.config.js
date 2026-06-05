import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      // __VIDEO_ENABLED__ est injecté par Vite (define) au build.
      globals: { ...globals.browser, __VIDEO_ENABLED__: 'readonly' },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Pattern intentionnel et omniprésent dans les simulateurs : un useEffect de
      // montage lit les paramètres d'URL partagés (readShareParams) et initialise
      // l'état via setState. Acceptable ici → rétrogradé en avertissement.
      'react-hooks/set-state-in-effect': 'warn',
      // Règles consultatives (qualité) maintenues en avertissement pour garder un
      // `npm run lint` exploitable sans masquer les vraies erreurs (no-undef,
      // no-dupe-keys, etc. restent bloquantes).
      'no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/refs': 'warn',
      'react-refresh/only-export-components': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  {
    // Code Node : fonctions serverless (api/), scripts de build et config Vite.
    files: ['api/**/*.js', 'scripts/**/*.{js,mjs}', '*.config.js', 'vite.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
