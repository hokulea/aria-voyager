import { setApplication } from '@ember/test-helpers';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';

import Application from 'ember-aria-voyager-test-app/app';
import config from 'ember-aria-voyager-test-app/config/environment';
import setupSinon from 'ember-sinon-qunit';

import { forceModulesToBeLoaded, sendCoverage } from 'ember-cli-code-coverage/test-support';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

setupSinon();

start();

QUnit.done(async function () {
  forceModulesToBeLoaded();
  await sendCoverage();
});
