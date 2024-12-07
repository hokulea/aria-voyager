/// <reference types="vitest" />

import { resolve } from 'node:path';

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'aria-voyager',
      // the proper extensions will be added
      fileName: 'index'
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
      name: 'firefox',
      provider: 'preview'
    }
  }
});
