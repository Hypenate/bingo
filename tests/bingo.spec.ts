import { test, expect } from '@playwright/test';

test.describe('Bingo Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display the app root component', async ({ page }) => {
    // Check if the Angular app root is present
    const appRoot = page.locator('app-root');
    await expect(appRoot).toBeVisible();
  });

  test('should have the correct page title', async ({ page }) => {
    // Verify the page title
    await expect(page).toHaveTitle(/Bingo/i);
  });

  // Add more tests specific to your Bingo application features
  // Example tests you might want to add:

  // test('should generate a bingo card', async ({ page }) => {
  //   const generateButton = page.getByRole('button', { name: /generate/i });
  //   await generateButton.click();
  //
  //   const bingoCard = page.locator('.bingo-card');
  //   await expect(bingoCard).toBeVisible();
  // });

  // test('should mark a cell when clicked', async ({ page }) => {
  //   const cell = page.locator('.bingo-cell').first();
  //   await cell.click();
  //
  //   await expect(cell).toHaveClass(/marked/);
  // });
});

