// Parcours complet de la « définition de terminé » : connexion → nouveau
// calculateur depuis le template prêt → publication → page publique →
// soumission → visible dans l'écran Soumissions.

import { test, expect } from '@playwright/test';

const EMAIL = process.env.E2E_EMAIL;
const PASSWORD = process.env.E2E_PASSWORD;

test.skip(!EMAIL || !PASSWORD, 'E2E_EMAIL / E2E_PASSWORD requis (compte de test confirmé)');

test('créer → publier → soumettre', async ({ page }) => {
  // Connexion
  await page.goto('/login');
  await page.getByLabel('Email').fill(EMAIL!);
  await page.getByLabel('Mot de passe').fill(PASSWORD!);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await page.waitForURL('**/');

  // Nouveau calculateur depuis le template mensualités de prêt
  await page.getByRole('button', { name: /Mensualités de prêt/ }).click();
  await page.waitForURL('**/editor/*');
  await expect(page.getByText('Mensualité', { exact: true })).toBeVisible();

  // Personnalisation minimale + autosave
  await page.locator('input[type=text]').first().fill(`E2E ${Date.now()}`);
  await expect(page.getByText(/Enregistré/)).toBeVisible({ timeout: 5_000 });

  // Publication → snippets
  await page.getByRole('button', { name: 'Publier' }).click();
  const publicLink = await page.locator('input[readonly]').first().inputValue();
  expect(publicLink).toContain('/s/');

  // Page publique : rendu + badge (plan gratuit) + soumission
  await page.goto(publicLink);
  await expect(page.getByText('Mensualité', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Créé avec Simfinly/ })).toBeVisible();
  await page.getByRole('button', { name: 'Enregistrer cette simulation' }).click();
  await expect(page.getByText('✓ Enregistré')).toBeVisible();

  // La soumission apparaît dans l'écran Soumissions
  await page.goto('/submissions');
  await expect(page.locator('table tbody tr').first()).toBeVisible();
});
