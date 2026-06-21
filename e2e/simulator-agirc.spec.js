import { test, expect } from '@playwright/test';
import { waitForPage } from './helpers.js';

test.describe('Simulateur Agirc-Arrco', () => {
  test('la page se charge correctement', async ({ page }) => {
    await page.goto('/simulateurs/agirc-arrco');
    await waitForPage(page);

    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/agirc|retraite|complémentaire/);
  });

  test('le titre de la page (h1) est présent', async ({ page }) => {
    await page.goto('/simulateurs/agirc-arrco');
    await waitForPage(page);

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible({ timeout: 15000 });
    const text = (await heading.textContent()) ?? '';
    expect(text.length).toBeGreaterThan(0);
  });

  test('les inputs du simulateur sont visibles', async ({ page }) => {
    await page.goto('/simulateurs/agirc-arrco');
    await waitForPage(page);

    // The Agirc simulator uses NumInput with id="salaire"
    const salaryInput = page.locator('#salaire');
    await expect(salaryInput).toBeVisible({ timeout: 15000 });

    const anneesFaitesInput = page.locator('#annees-faites');
    await expect(anneesFaitesInput).toBeVisible({ timeout: 10000 });
  });

  test('saisir un salaire de 3 333 € affiche un résultat de pension', async ({ page }) => {
    await page.goto('/simulateurs/agirc-arrco');
    await waitForPage(page);

    // The salary input has id="salaire"
    const salaryInput = page.locator('#salaire');
    await expect(salaryInput).toBeVisible({ timeout: 15000 });

    // Set salary to 3333 (≈ 40 000 €/an)
    await salaryInput.fill('3333');
    await salaryInput.blur();
    await page.waitForTimeout(500);

    // A pension result (in € format) should appear somewhere on the page
    const bodyText = await page.locator('body').textContent();
    // The result can be "pension brute" or "pension nette"
    const hasPension = /pension|points|retraite/i.test(bodyText);
    expect(hasPension).toBe(true);

    // Look for a monetary amount being rendered (French locale: "1 234 €")
    expect(bodyText).toMatch(/\d[\d\s]+[€]/);
  });

  test('le toggle Non-cadre / Cadre est accessible dans les paramètres avancés', async ({ page }) => {
    await page.goto('/simulateurs/agirc-arrco');
    await waitForPage(page);

    // The toggle is inside an AccordionSection titled "Paramètres avancés"
    // Open the accordion first
    const accordionBtn = page.locator('button').filter({
      hasText: /paramètres avancés/i,
    }).first();
    await expect(accordionBtn).toBeVisible({ timeout: 15000 });
    await accordionBtn.click();

    // After opening, the toggle buttons Non-cadre and Cadre should be visible
    const nonCadreBtn = page.getByRole('button', { name: 'Non-cadre', exact: true });
    const cadreBtn = page.getByRole('button', { name: 'Cadre', exact: true });
    await expect(nonCadreBtn).toBeVisible({ timeout: 10000 });
    await expect(cadreBtn).toBeVisible({ timeout: 5000 });

    // Test the toggle
    await cadreBtn.click();
    await expect(cadreBtn).toHaveAttribute('aria-pressed', 'true', { timeout: 3000 });
  });

  test('la section FAQ est présente et ouvrable', async ({ page }) => {
    await page.goto('/simulateurs/agirc-arrco');
    await waitForPage(page);

    // FAQ items have buttons with aria-expanded (different from the nav hamburger which is hidden)
    // Scroll to find the FAQ section
    const faqBtn = page.locator('button[aria-expanded]').filter({
      hasText: /quand|puis-je|comment|retraite|agirc|points|fonctionnaie/i,
    }).first();
    await faqBtn.scrollIntoViewIfNeeded();
    await expect(faqBtn).toBeVisible({ timeout: 15000 });

    // Click to expand
    await faqBtn.click();
    const expanded = await faqBtn.getAttribute('aria-expanded');
    expect(expanded).toBe('true');
  });

  test('le bandeau de réassurance est présent', async ({ page }) => {
    await page.goto('/simulateurs/agirc-arrco');
    await waitForPage(page);

    const bodyText = await page.locator('body').textContent();
    // The reassurance bar lists: "Données officielles", "Valeur du point", etc.
    expect(bodyText).toMatch(/données officielles|valeur du point|calcul.*local/i);
  });
});
