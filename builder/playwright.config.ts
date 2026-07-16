import { defineConfig } from '@playwright/test';

// E2e du parcours créer→publier→soumettre (exigence de la spec produit).
// Nécessite un compte de test confirmé sur le projet Supabase :
//   E2E_EMAIL=... E2E_PASSWORD=... npx playwright test
// (le test se skippe proprement sans ces variables — la confirmation email
// de l'inscription ne peut pas être automatisée sans accès à la boîte mail).
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:5199',
  },
  webServer: {
    command: 'npx vite --port 5199',
    url: 'http://localhost:5199',
    reuseExistingServer: true,
  },
});
