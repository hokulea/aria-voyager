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
    setupFiles: ['vitest-browser-svelte'],
    browser: {
      name: 'chromium',
      enabled: true
    },
    open: false
  }
});
