import { defineConfig } from '@playwright/test';

/**
 * End-to-end smoke tests against the REAL production server — the same
 * server.mjs Railway runs, serving the same dist/ build, behind the same
 * password gate. `npm run build` must have run first (CI does; locally the
 * e2e script handles it).
 *
 * Two screen sizes on purpose: the bugs this layer exists to catch — a Next
 * button rendered below the fold, a tappable thing that is not actually
 * tappable — only show up at real viewport sizes. 375×812 is the phone size
 * the family actually tests on.
 */

const PORT = 8091;

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['github'], ['html', { open: 'never' }]] : 'list',

  webServer: {
    command: 'node server.mjs',
    port: PORT,
    reuseExistingServer: !process.env.CI,
    env: {
      AUTH_PASSWORD: 'e2e-test-password',
      PORT: String(PORT),
      HOST: '127.0.0.1',
      DATA_DIR: './.e2e-data',
    },
  },

  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    // Logs in through the real form once and saves the session cookie.
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'desktop',
      dependencies: ['setup'],
      use: {
        viewport: { width: 1280, height: 800 },
        storageState: 'playwright/.auth/session.json',
      },
    },
    {
      name: 'mobile',
      dependencies: ['setup'],
      use: {
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
        storageState: 'playwright/.auth/session.json',
      },
    },
  ],
});
