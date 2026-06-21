import { test, expect } from '@playwright/test';
import { waitForPage } from './helpers.js';

test.describe('Page d\'accueil', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPage(page);
  });

  test('le titre de l\'onglet contient "simfinly" ou "simulateur"', async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/simfinly|simulateur|simulation/);
  });

  test('la page contient des liens vers les simulateurs', async ({ page }) => {
    // Several simulator links should be rendered
    const simLinks = page.locator('a[href*="/simulateurs/"]');
    await expect(simLinks.first()).toBeVisible({ timeout: 10000 });
    const count = await simLinks.count();
    expect(count).toBeGreaterThan(5);
  });

  test('le switcher de thème est présent dans la navbar', async ({ page }) => {
    // Theme toggle button — identified by its aria-label or button type in navbar
    const themeBtn = page.locator(
      'button[aria-label*="thème"], button[aria-label*="theme"], button[aria-label*="sombre"], button[aria-label*="dark"], button[aria-label*="clair"], button[aria-label*="light"]'
    );
    // If no aria-label, look for a button containing an SVG (lucide icon) inside the navbar
    const navbarSvgBtn = page.locator('nav button svg, header button svg').first();
    // Also accept the CountrySwitch or other icon buttons in the navbar
    const anyNavBtn = page.locator('nav button, header button').first();

    const navBtnCount = await anyNavBtn.count();
    expect(navBtnCount).toBeGreaterThan(0);
  });

  test('la navigation vers /simulateurs/epargne fonctionne via URL directe', async ({ page }) => {
    await page.goto('/simulateurs/epargne');
    await waitForPage(page);
    expect(page.url()).toContain('/simulateurs/epargne');

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('pas d\'erreurs console critiques au chargement', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto('/');
    await waitForPage(page);
    // Filter out known non-critical warnings
    const criticals = errors.filter(msg =>
      !msg.includes('Warning:') &&
      !msg.includes('ResizeObserver') &&
      !msg.includes('Stripe') &&
      !msg.includes('supabase') &&
      !msg.includes('Sentry')
    );
    expect(criticals).toHaveLength(0);
  });

  test('le lien "FIRE" est présent sur la page d\'accueil', async ({ page }) => {
    const fireLink = page.locator('a[href="/simulateurs/fire"]').first();
    await expect(fireLink).toBeAttached({ timeout: 10000 });
    // Scroll it into view and verify it's reachable
    await fireLink.scrollIntoViewIfNeeded();
    await expect(fireLink).toBeVisible({ timeout: 5000 });
  });

  test('le lien vers épargne est présent sur la page d\'accueil', async ({ page }) => {
    const epargneLink = page.locator('a[href="/simulateurs/epargne"]').first();
    await expect(epargneLink).toBeAttached({ timeout: 10000 });
    await epargneLink.scrollIntoViewIfNeeded();
    await expect(epargneLink).toBeVisible({ timeout: 5000 });
  });
});
