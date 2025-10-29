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

  test('should display a 5x5 bingo grid', async ({ page }) => {
    // Verify the grid has 25 buttons (including the center star)
    const buttons = page.locator('button').filter({ hasNotText: 'Generate Number' });
    await expect(buttons).toHaveCount(25);
  });

  test('should have a disabled center button with star', async ({ page }) => {
    // Find the center button (13th button in the grid, index 12)
    const centerButton = page.locator('button').filter({ hasNotText: 'Generate Number' }).nth(12);
    await expect(centerButton).toBeDisabled();
    await expect(centerButton).toHaveText('★');
  });

  test('should mark button as active when clicked', async ({ page }) => {
    // Click the first button in the grid
    const firstButton = page.locator('button').filter({ hasNotText: 'Generate Number' }).first();
    await firstButton.click();

    // Verify it has the active state (you may need to adjust the selector based on your CSS)
    await expect(firstButton).toHaveAttribute('class', /active/);
  });

  test('should create BINGO by clicking 5 buttons in the top row', async ({ page }) => {
    // Click all 5 buttons in the top row (indices 0-4)
    const buttons = page.locator('button').filter({ hasNotText: 'Generate Number' });

    for (let i = 0; i < 5; i++) {
      await buttons.nth(i).click();
    }

    // Verify BINGO message appears
    await expect(page.locator('text=🎉 BINGO! 🎉')).toBeVisible();
  });

  test('should create BINGO by clicking 5 buttons in the left column', async ({ page }) => {
    // Click all 5 buttons in the leftmost column (indices 0, 5, 10, 15, 20)
    const buttons = page.locator('button').filter({ hasNotText: 'Generate Number' });

    const columnIndices = [0, 5, 10, 15, 20];
    for (const index of columnIndices) {
      await buttons.nth(index).click();
    }

    // Verify BINGO message appears
    await expect(page.locator('text=🎉 BINGO! 🎉')).toBeVisible();
  });

  test('should create BINGO by clicking diagonal from top-left to bottom-right', async ({ page }) => {
    // Click diagonal buttons (indices 0, 6, 12, 18, 24)
    // Note: index 12 is the center star which is disabled, so it should already count
    const buttons = page.locator('button').filter({ hasNotText: 'Generate Number' });

    const diagonalIndices = [0, 6, 18, 24]; // Skip 12 as it's the center star
    for (const index of diagonalIndices) {
      await buttons.nth(index).click();
    }

    // Verify BINGO message appears
    await expect(page.locator('text=🎉 BINGO! 🎉')).toBeVisible();
  });

  test('should toggle button state when clicked multiple times', async ({ page }) => {
    const firstButton = page.locator('button').filter({ hasNotText: 'Generate Number' }).first();

    // Click to activate
    await firstButton.click();
    await expect(firstButton).toHaveAttribute('class', /active/);

    // Click again to deactivate
    await firstButton.click();
    await expect(firstButton).toHaveAttribute('class', /cell-inactive/);
  });

  test('should have "Use Words" checkbox unchecked by default', async ({ page }) => {
    const useWordsCheckbox = page.getByRole('checkbox', { name: 'Use Words' });
    await expect(useWordsCheckbox).not.toBeChecked();
  });

  test('should change to corporate words when "Use Words" is checked', async ({ page }) => {
    const useWordsCheckbox = page.getByRole('checkbox', { name: 'Use Words' });

    // Check the checkbox
    await useWordsCheckbox.check();
    await expect(useWordsCheckbox).toBeChecked();

    // Verify the title changes to "CORPORATE BINGO!"
    await expect(page.locator('h1')).toHaveText('CORPORATE BINGO!');

    // Verify buttons show words instead of numbers (check a few buttons contain text, not just digits)
    const buttons = page.locator('button').filter({ hasNotText: 'Generate' });
    const firstButtonText = await buttons.first().textContent();

    // Corporate words should be alphabetic, not just digits
    expect(firstButtonText).toMatch(/[A-Za-z]/);
  });

  test('should change button text to "Generate Word" when "Use Words" is checked', async ({ page }) => {
    const useWordsCheckbox = page.getByRole('checkbox', { name: 'Use Words' });

    // Initially should say "Generate Number"
    await expect(page.getByRole('button', { name: 'Generate Number' })).toBeVisible();

    // Check the checkbox
    await useWordsCheckbox.check();

    // Button text should change to "Generate Word"
    await expect(page.getByRole('button', { name: 'Generate Word' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate Number' })).not.toBeVisible();
  });

  test('should revert to numbers when "Use Words" is unchecked', async ({ page }) => {
    const useWordsCheckbox = page.getByRole('checkbox', { name: 'Use Words' });

    // Check and then uncheck
    await useWordsCheckbox.check();
    await expect(page.locator('h1')).toHaveText('CORPORATE BINGO!');

    await useWordsCheckbox.uncheck();

    // Title should revert to "BINGO!"
    await expect(page.locator('h1')).toHaveText('BINGO!');

    // Button should revert to "Generate Number"
    await expect(page.getByRole('button', { name: 'Generate Number' })).toBeVisible();
  });

  test('should have "Live" checkbox unchecked by default', async ({ page }) => {
    const liveCheckbox = page.getByRole('checkbox', { name: 'Live' });
    await expect(liveCheckbox).not.toBeChecked();

    // Timer should not be visible
    await expect(page.locator('text=/⏱️/')).not.toBeVisible();
  });

  test('should display a timer when "Live" is checked', async ({ page }) => {
    const liveCheckbox = page.getByRole('checkbox', { name: 'Live' });

    // Check the checkbox
    await liveCheckbox.check();
    await expect(liveCheckbox).toBeChecked();

    // Verify timer appears
    await expect(page.locator('text=/⏱️/')).toBeVisible();

    // Verify timer has a time format (e.g., "⏱️ 00:01")
    const timerText = await page.locator('text=/⏱️/').textContent();
    expect(timerText).toMatch(/⏱️\s+\d{2}:\d{2}/);
  });

  test('should increment timer when "Live" is checked', async ({ page }) => {
    const liveCheckbox = page.getByRole('checkbox', { name: 'Live' });

    // Check the checkbox
    await liveCheckbox.check();

    // Get initial timer value
    const initialTimerText = await page.locator('text=/⏱️/').textContent();

    // Wait for 2 seconds
    await page.waitForTimeout(2000);

    // Get updated timer value
    const updatedTimerText = await page.locator('text=/⏱️/').textContent();

    // Timer should have changed (increased)
    expect(updatedTimerText).not.toBe(initialTimerText);
  });

  test('should hide timer when "Live" is unchecked', async ({ page }) => {
    const liveCheckbox = page.getByRole('checkbox', { name: 'Live' });

    // Check and then uncheck
    await liveCheckbox.check();
    await expect(page.locator('text=/⏱️/')).toBeVisible();

    await liveCheckbox.uncheck();

    // Timer should disappear
    await expect(page.locator('text=/⏱️/')).not.toBeVisible();
  });

  test('should work with both "Use Words" and "Live" checked together', async ({ page }) => {
    const useWordsCheckbox = page.getByRole('checkbox', { name: 'Use Words' });
    const liveCheckbox = page.getByRole('checkbox', { name: 'Live' });

    // Check both checkboxes
    await useWordsCheckbox.check();
    await liveCheckbox.check();

    // Verify both features are active
    await expect(page.locator('h1')).toHaveText('CORPORATE BINGO!');
    await expect(page.locator('text=/⏱️/')).toBeVisible();

    // Verify the grid shows words (not numbers)
    const buttons = page.locator('button').filter({ hasNotText: 'Generate' });
    const firstButtonText = await buttons.first().textContent();
    expect(firstButtonText).toMatch(/[A-Za-z]/);
  });

  test('should create BINGO with words when "Use Words" is checked', async ({ page }) => {
    const useWordsCheckbox = page.getByRole('checkbox', { name: 'Use Words' });

    // Check the checkbox
    await useWordsCheckbox.check();

    // Click all 5 buttons in the top row
    const buttons = page.locator('button').filter({ hasNotText: 'Generate' });

    for (let i = 0; i < 5; i++) {
      await buttons.nth(i).click();
    }

    // Verify BINGO message appears
    await expect(page.locator('text=🎉 BINGO! 🎉')).toBeVisible();
  });

});



