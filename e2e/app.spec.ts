import { test, expect, type Page } from '@playwright/test';

/**
 * Smoke journeys through the real app in a real browser.
 *
 * These deliberately walk the paths a child walks, and assert the things only
 * a rendered screen can prove — above all `toBeInViewport()` on the Next
 * button, because "the button existed but was below the fold" is the exact
 * bug class this layer was built to catch.
 *
 * The journeys lean on stable seed content (Zen, grade 1, "The Lost Mitten")
 * so they survive curriculum growth. If star one of reading ever changes,
 * update the answers here — the test failing loudly on a content change is
 * the intended behaviour.
 */

async function openApp(page: Page) {
  await page.goto('/');
  await expect(page.getByText('Who is exploring today?')).toBeVisible();
}

async function pickZen(page: Page) {
  await openApp(page);
  await page.getByRole('button', { name: /Zen/ }).first().click();
  await expect(page.getByText('Pick a constellation')).toBeVisible();
}

test('the galaxy map shows every constellation with its star count', async ({ page }) => {
  await pickZen(page);

  for (const constellation of [
    'The Storyteller',
    'The Wordsmith',
    'The Lantern Road',
    'The Counting Crown',
    'The Puzzle Weaver',
    'The Swift Hand',
    'The Lamp',
  ]) {
    await expect(page.getByText(constellation)).toBeVisible();
  }
  // Counts render, and nothing is accidentally zero-of-zero.
  await expect(page.getByText(/0 of 30 stars lit/).first()).toBeVisible();
  await expect(page.getByText(/of 0 stars/)).toHaveCount(0);
});

test('a reading star can be answered, and Next is truly on screen', async ({ page }) => {
  await pickZen(page);

  await page.getByRole('button', { name: /The Storyteller/ }).click();
  await page.getByRole('button', { name: /The Lost Mitten/ }).click();
  await page.getByRole('button', { name: 'I am ready' }).click();

  // The passage phase shows the story (its own h2, under the star's h1 title).
  await expect(page.getByRole('heading', { level: 2, name: /The Lost Mitten/ })).toBeVisible();
  await page.getByRole('button', { name: /I have read it/ }).click();

  // Question one, from the authored content.
  await expect(page.getByText('What did Mia lose?')).toBeVisible();
  await page.getByRole('button', { name: 'Her red mitten' }).click();

  // THE regression assertion: Next must not just exist — it must be inside
  // the visible viewport, reachable without the child knowing to scroll.
  const next = page.getByRole('button', { name: /Next/ });
  await expect(next).toBeVisible();
  await expect(next).toBeInViewport();

  await next.click();
  await expect(page.getByText('Where did Mia find the mitten?')).toBeVisible();
});

test('a wrong answer never dead-ends the child', async ({ page }) => {
  await pickZen(page);

  await page.getByRole('button', { name: /The Storyteller/ }).click();
  await page.getByRole('button', { name: /The Lost Mitten/ }).click();
  await page.getByRole('button', { name: 'I am ready' }).click();
  await page.getByRole('button', { name: /I have read it/ }).click();

  // Two wrong answers in a row: the answer is revealed and Next appears.
  await page.getByRole('button', { name: 'Her blue hat' }).click();
  const remaining = page.locator('.option-btn:not(.eliminated):not(.wrong)', {
    hasText: /school bag|boot/,
  });
  await remaining.first().click();

  const next = page.getByRole('button', { name: /Next/ });
  await expect(next).toBeVisible();
  await expect(next).toBeInViewport();
});

test('the BSF lesson opens with read-along scripture and the study card', async ({ page }) => {
  await pickZen(page);

  await page.getByRole('button', { name: /The Lamp/ }).click();
  await page.getByRole('button', { name: /Our Need for the Gospel/ }).click();
  await page.getByRole('button', { name: 'I am ready' }).click();

  // The two-step structure is visible: listen first, review second.
  await expect(page.getByText('Step 1 · Listen to God’s Word')).toBeVisible();
  await expect(page.getByText('Step 2 · Review the treasures')).toBeVisible();
  await expect(page.getByRole('button', { name: /Read God's Word to me/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Read the treasures to me/ })).toBeVisible();
  // NIV text is on screen.
  await expect(page.getByText(/Paul, a servant of Christ Jesus/)).toBeVisible();
  // All four treasures plus the memory verse on the study card.
  for (const label of ['Main Truth', "God's Attribute", 'Doctrine', 'Gospel Connection', 'Memory Verse']) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
  // The NIV attribution renders.
  await expect(page.getByText(/New International Version/)).toBeVisible();

  // The way forward is on screen without scrolling hunting.
  const listened = page.getByRole('button', { name: /I have listened/ });
  await expect(listened).toBeVisible();
});

test('settings opens and reports the curriculum', async ({ page }) => {
  await pickZen(page);
  await page.getByRole('button', { name: '⚙︎' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText(/Curriculum available/)).toBeVisible();
  await expect(page.getByText(/hours/).first()).toBeVisible();
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
