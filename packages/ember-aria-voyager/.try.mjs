export default scenarios();

function scenarios() {
  return {
    scenarios: [
      // the two older won't work as the tests use functions as helpers and the
      // polyfill does not work under vite
      // compatEmberScenario('ember-lts-3.28', '^3.28.0'),
      // compatEmberScenario('ember-lts-4.4', '~4.4.0'),
      compatEmberScenario('ember-lts-4.12', '^4.12.0'),
      compatEmberScenario('ember-lts-5.4', '~5.4.0'),
      compatEmberScenario('ember-lts-5.12', '^5.12.0'),
      compatEmberScenario('ember-lts-6.4', '~6.4.0'),
      latestEmberScenario('latest'),
      latestEmberScenario('beta'),
      latestEmberScenario('alpha')
    ]
  };
}

function latestEmberScenario(tag) {
  return {
    name: `ember-${tag}`,
    npm: {
      devDependencies: {
        'ember-source': `npm:ember-source@${tag}`
      }
    }
  };
}

function emberCliBuildJS() {
  return `const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');
module.exports = async function (defaults) {
  const { buildOnce } = await import('@embroider/vite');
  let app = new EmberApp(defaults);
  return compatBuild(app, buildOnce);
};`;
}

function reexport(name) {
  return `export { ${name} as default } from 'ember-aria-voyager';`;
}

function compatEmberScenario(name, emberVersion) {
  let cliVersion = '^5.12.0';

  if (emberVersion.includes('3.28')) {
    cliVersion = '^4.12.0';
  }

  return {
    name,
    npm: {
      devDependencies: {
        'ember-source': emberVersion,
        '@embroider/compat': '^4.0.3',
        'ember-cli': cliVersion,
        'ember-auto-import': '^2.10.0',
        '@ember/optional-features': '^2.2.0'
      },
      'ember-addon': {
        version: 2,
        type: 'addon',
        main: 'addon-main.cjs'
        // 'app-js': {
        //   './modifiers/aria-listbox.js': './dist/_app_/modifiers/aria-listbox.js',
        //   './modifiers/aria-menu.js': './dist/_app_/modifiers/aria-menu.js',
        //   './modifiers/aria-tablist.js': './dist/_app_/modifiers/aria-tablist.js'
        // }
      }
    },
    env: {
      ENABLE_COMPAT_BUILD: true
    },
    files: {
      'ember-cli-build.cjs': emberCliBuildJS(),
      'modifiers/aria-listbox.js': reexport('ariaListbox'),
      'modifiers/aria-menu.js': reexport('ariaMenu'),
      'modifiers/aria-tablist.js': reexport('ariaTablist'),
      'addon-main.cjs': `'use strict';

      const { addonV1Shim } = require('@embroider/addon-shim');

      module.exports = addonV1Shim(__dirname);
      `,
      'config/optional-features.json': JSON.stringify({
        'application-template-wrapper': false,
        'default-async-observers': true,
        'jquery-integration': false,
        'template-only-glimmer-components': true,
        'no-implicit-route-model': true
      })
    }
  };
}
