import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/template-registry.ts', 'src/test-support/index.ts'],
  external: [
    '@ember/template-compilation',
    '@ember/destroyable',
    '@ember/test-helpers',
    'ember-modifier'
  ],
  splitting: false,
  sourcemap: false,
  clean: true,
  format: ['cjs', 'esm'],
  dts: true
});
