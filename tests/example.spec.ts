import { test, expect } from '@playwright/test';

test.describe('Bingo App', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');

    // Wait for Angular to load
    await page.waitForLoadState('networkidle');

    // Check if the page loaded successfully
    await expect(page).toHaveTitle(/Bingo/i);
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');

    // Wait for Angular to load
    await page.waitForLoadState('networkidle');

    // Add more specific tests based on your app's features
    // For example, if you have a header or navigation elements:
    // await expect(page.locator('app-root')).toBeVisible();
  });
});

