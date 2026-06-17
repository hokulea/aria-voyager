import path from 'node:path';

import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
// https://vitest.dev/config/
// https://vitest.dev/guide/browser/config.html
export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path.resolve(import.meta.dirname, 'src/index.ts'),
      name: 'aria-voyager',
      fileName: 'index',
      formats: ['es', 'cjs']
    }
  },
  optimizeDeps: {
    // Force re-bundling of dependencies on every run, ignoring cache
    // This prevents stale cache from causing test failures
    // force: true
  },
  test: {
    setupFiles: ['./tests/setup.ts'],
    retry: 1,
    testTimeout: 5000,
    isolate: true,
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: [
        'text',
        'html',
        ['lcov', { projectRoot: '../../' }],
        'json',
        ...(process.env.GITHUB_ACTIONS === 'true' ? ['github-actions'] : [])
      ]
    },
    fileParallelism: !process.env.CI,
    browser: {
      enabled: true,
      headless: true,
      screenshotFailures: false,
      provider: playwright({
        // launchOptions: {
        //   // slowMo: 100
        //   slowMo: 50
        // }
      }),
      instances: [
        { browser: 'firefox' },
        // tests are flaky in playwright + chromium/webkit
        { browser: 'chromium' },
        { browser: 'webkit' }
      ]
    }
  }
});
