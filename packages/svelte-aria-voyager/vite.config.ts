/// <reference types="vitest/config" />
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  test: {
    setupFiles: ['./tests/test-setup.ts'],
    browser: {
      enabled: true,
      screenshotFailures: false,
      provider: 'preview',
      // name: 'firefox'
      instances: [
        // { browser: 'firefox' },
        { browser: 'chromium' },
        { browser: 'webkit' }
      ]
    }
  }
});
