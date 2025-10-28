import { test, expect } from '@playwright/test';

test.describe('Bingo Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/', {waitUntil: 'domcontentloaded'});
  });

  test('should have the correct page title', async ({ page }) => {
    // Verify the page title
    await expect(page).toHaveTitle('Bingo');
  });
});

