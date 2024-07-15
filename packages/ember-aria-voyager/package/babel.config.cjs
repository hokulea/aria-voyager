module.exports = {
  presets: ['@babel/preset-typescript'],
  plugins: [
    // 'ember-template-imports/src/babel-plugin',
    '@embroider/addon-dev/template-colocation-plugin',
    [
      '@babel/plugin-transform-typescript',
      { allExtensions: true, onlyRemoveTypeImports: true, allowDeclareFields: true }
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    // '@babel/plugin-proposal-class-properties',
    // '@babel/plugin-transform-runtime'
    ...require('ember-cli-code-coverage').buildBabelPlugin()
  ]
};
