/// <reference types="vitest/config" />
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  test: {
    // if the types are not picked up, add `vitest-browser-svelte` to
    // "compilerOptions.types" in your tsconfig or
    // import `vitest-browser-svelte` manually so TypeScript can pick it up
    setupFiles: ['./tests/test-setup.ts'],
    // browser: {
    //   name: 'chromium',
    //   enabled: true
    // },
    browser: {
      enabled: true,
      screenshotFailures: false,
      // name: 'firefox',
      provider: 'preview',
      instances: [{ browser: 'chromium' }]
    },
    open: false
  }
});
