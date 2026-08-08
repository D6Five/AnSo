import { test as setup, expect } from '@playwright/test';

/**
 * The password gate is the first thing every device meets, so it is the first
 * thing tested: prove the gate shows nothing but a login form, that the wrong
 * password bounces, and that the right one opens the app. The session cookie
 * is saved for every other test to reuse.
 */

setup('password gate blocks, then admits, then remembers', async ({ page }) => {
  await page.goto('/');

  // Locked out: a password field and no app.
  const password = page.locator('input[name="password"]');
  await expect(password).toBeVisible();
  await expect(page.getByText('Who is exploring')).toHaveCount(0);

  // Wrong password bounces back to the form with a message.
  await password.fill('not-the-password');
  await page.getByRole('button', { name: 'Enter' }).click();
  await expect(page.getByText('That password is not right.')).toBeVisible();

  // Right password lands on the profile picker.
  await page.locator('input[name="password"]').fill('e2e-test-password');
  await page.getByRole('button', { name: 'Enter' }).click();
  await expect(page.getByText('Who is exploring today?')).toBeVisible();

  await page.context().storageState({ path: 'playwright/.auth/session.json' });
});
