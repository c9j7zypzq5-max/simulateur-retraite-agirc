/**
 * Shared helpers for Playwright E2E tests.
 */

/**
 * Dismiss the cookie consent banner if present.
 * Silently no-ops if no banner is visible.
 */
export async function dismissCookieBanner(page) {
  try {
    const btn = page.locator(
      '[data-testid="cookie-accept"], button:has-text("Accepter"), button:has-text("OK"), button:has-text("Accept")'
    );
    if ((await btn.count()) > 0) await btn.first().click();
  } catch {
    // Banner not present — ignore
  }
}

/**
 * Wait for the page to reach networkidle and dismiss any cookie banner.
 */
export async function waitForPage(page) {
  await page.waitForLoadState('networkidle');
  await dismissCookieBanner(page);
}
