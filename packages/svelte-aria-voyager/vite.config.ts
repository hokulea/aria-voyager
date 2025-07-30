import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

// https://vite.dev/config/
// https://vitest.dev/config/
// https://vitest.dev/guide/browser/config.html
export default defineConfig({
  plugins: [svelte()],
  test: {
    setupFiles: ['./tests/test-setup.ts'],
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['text', 'html', ['lcov', { projectRoot: '../../' }], 'json']
    },
    browser: {
      enabled: true,
      headless: true,
      screenshotFailures: false,
      provider: 'playwright',
      instances: [{ browser: 'firefox' }, { browser: 'chromium' }, { browser: 'webkit' }]
    }
  }
});
