import node from '@gossi/config-eslint/node';

export default [
  ...node(import.meta.dirname),
  {
    files: ['tests/**/*.ts'],
    rules: {
      'unicorn/no-duplicate-loops': 'off',
      'unicorn/better-dom-traversing': 'off'
    }
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'unicorn/consistent-class-member-order': 'off'
    }
  }
];
