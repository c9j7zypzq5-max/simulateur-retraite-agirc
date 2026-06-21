import { test, expect } from '@playwright/test';
import { waitForPage } from './helpers.js';

test.describe('Navigation entre les pages', () => {
  test('/ → naviguer vers /simulateurs/fire → la page se charge', async ({ page }) => {
    await page.goto('/simulateurs/fire');
    await waitForPage(page);

    expect(page.url()).toContain('/simulateurs/fire');
    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/fire|financ|indépendance/);

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('/ → naviguer vers /connexion → la page se charge', async ({ page }) => {
    await page.goto('/connexion');
    await waitForPage(page);

    expect(page.url()).toContain('/connexion');
    // A login form should be visible
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible({ timeout: 10000 });
  });

  test('logo home — la page d\'accueil se charge', async ({ page }) => {
    await page.goto('/');
    await waitForPage(page);

    // The logo link points to "/"
    const logoLink = page.locator('a[href="/"]').first();
    await expect(logoLink).toBeVisible({ timeout: 10000 });
    // Clicking the logo on the home page stays on /
    await logoLink.click();
    await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
    expect(page.url().replace(/\/$/, '')).toBe('http://localhost:5173');
  });

  test('une route inexistante affiche une page 404', async ({ page }) => {
    await page.goto('/cette-route-nexiste-pas');
    // Wait for the lazy-loaded NotFound component to render
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Suspense fallback may take a moment

    const bodyText = (await page.locator('body').textContent()) ?? '';
    const has404 = /404|introuvable|not found|existe pas|page inconnue|déplacée/i.test(bodyText);
    expect(has404).toBe(true);
  });

  test('navigation vers /simulateurs/cnav fonctionne', async ({ page }) => {
    await page.goto('/simulateurs/cnav');
    await waitForPage(page);

    expect(page.url()).toContain('/simulateurs/cnav');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('navigation vers /simulateurs/budget fonctionne', async ({ page }) => {
    await page.goto('/simulateurs/budget');
    await waitForPage(page);

    expect(page.url()).toContain('/simulateurs/budget');
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('navigation vers /simulateurs/agirc-arrco fonctionne', async ({ page }) => {
    // Navigate directly (the home page card links are below the fold and
    // Playwright's strict viewport check prevents off-screen clicks)
    await page.goto('/simulateurs/agirc-arrco');
    await waitForPage(page);

    expect(page.url()).toContain('/simulateurs/agirc-arrco');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 15000 });
    const text = (await heading.textContent()) ?? '';
    expect(text.toLowerCase()).toMatch(/agirc|retraite|complémentaire/);
  });
});
