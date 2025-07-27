import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/test-helper.ts'],
    include: ['./tests/**/*-test.{js,ts}'],
    exclude: ['./tests/rendering/**/*'], // Exclude Ember tests for now
    globals: true
  },
  esbuild: {
    target: 'esnext'
  }
});