import { resolve } from 'node:path';

import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
// https://vitest.dev/config/
// https://vitest.dev/guide/browser/config.html
export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'aria-voyager',
      fileName: 'index',
      formats: ['es', 'cjs']
    }
  },
  test: {
    // open: true,
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['text', 'html', ['lcov', { projectRoot: '../../' }], 'json']
    },
    browser: {
      enabled: true,
      screenshotFailures: false,
      provider: 'preview',
      instances: [
        // https://github.com/hokulea/aria-voyager/issues/396
        // { browser: 'firefox' },
        // tests are flaky in chromium + playwright
        // { browser: 'chromium' },
        { browser: 'webkit' }
      ]
    }
  }
});
