import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Node is the default; DOM tests opt in with a `@vitest-environment jsdom`
    // pragma at the top of the file.
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.mjs'],
    // The server integration suite boots a real HTTP server once.
    testTimeout: 15000,
  },
});
