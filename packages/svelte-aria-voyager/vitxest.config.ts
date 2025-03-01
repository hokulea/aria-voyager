import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // if the types are not picked up, add `vitest-browser-svelte` to
    // "compilerOptions.types" in your tsconfig or
    // import `vitest-browser-svelte` manually so TypeScript can pick it up
    setupFiles: ['vitest-browser-svelte'],
    browser: {
      name: 'chromium',
      enabled: true
    }
  }
});
