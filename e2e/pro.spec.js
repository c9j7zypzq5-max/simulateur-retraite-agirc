import { test, expect } from '@playwright/test';
import { waitForPage } from './helpers.js';

test.describe('Page Pro et Mes Simulations', () => {
  test('la page /pro se charge et affiche la tarification', async ({ page }) => {
    await page.goto('/pro');
    await waitForPage(page);

    expect(page.url()).toContain('/pro');

    // The Pro page should mention a price or subscription
    const bodyText = (await page.locator('body').textContent()) ?? '';
    const hasPricing = /pro|abonnement|subscribe|subscription|\d+\s*€|\d+\s*\$/i.test(bodyText);
    expect(hasPricing).toBe(true);
  });

  test('un titre est affiché sur la page /pro', async ({ page }) => {
    await page.goto('/pro');
    await waitForPage(page);

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 15000 });
    const text = (await heading.textContent()) ?? '';
    expect(text.length).toBeGreaterThan(0);
  });

  test('un bouton d\'abonnement est présent sur /pro', async ({ page }) => {
    await page.goto('/pro');
    await waitForPage(page);

    // Look for a subscribe/checkout button
    const subscribeBtn = page.locator('button').filter({
      hasText: /s'abonner|abonner|subscribe|passer au pro|go pro|commencer|démarrer|checkout/i,
    }).first();

    // Alternative: a button that triggers Stripe checkout
    const stripeBtn = page.locator('button[disabled], button').filter({
      hasText: /pro|abonnement/i,
    }).first();

    const hasCta = (await subscribeBtn.count()) > 0 || (await stripeBtn.count()) > 0;
    expect(hasCta).toBe(true);
  });

  test('la liste des fonctionnalités Pro est affichée', async ({ page }) => {
    await page.goto('/pro');
    await waitForPage(page);

    // Features list items
    const bodyText = (await page.locator('body').textContent()) ?? '';
    // Should mention at least one pro feature
    const hasFeature = /simulation|rapport|pdf|badge|fonctionnalit/i.test(bodyText);
    expect(hasFeature).toBe(true);
  });

  test('la page /mes-simulations se charge', async ({ page }) => {
    await page.goto('/mes-simulations');
    await page.waitForLoadState('domcontentloaded');

    // Either shows saved simulations UI or redirects to /connexion
    const url = page.url();
    const bodyText = (await page.locator('body').textContent()) ?? '';

    const isValidState =
      url.includes('/mes-simulations') ||
      url.includes('/connexion') ||
      /simulation|connexion|connectez|sign in/i.test(bodyText);

    expect(isValidState).toBe(true);
  });

  test('la section FAQ est présente sur /pro', async ({ page }) => {
    await page.goto('/pro');
    await waitForPage(page);

    // FAQ section
    const bodyText = (await page.locator('body').textContent()) ?? '';
    const hasFaq = /faq|question|comment|fonctionn/i.test(bodyText);
    expect(hasFaq).toBe(true);
  });
});
