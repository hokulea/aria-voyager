import { tracked } from '@glimmer/tracking';
import { render, rerender } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { menu } from 'ember-aria-voyager';

import {
  testMenuKeyboardNavigation,
  testMenuPointerNavigation
} from 'ember-aria-voyager/test-support';

import type { TOC } from '@ember/component/template-only';

interface CodeMenuSignature {
  Element: HTMLDivElement;
  Args: {
    disabled?: boolean;
  };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const CodeMenu: TOC<CodeMenuSignature> = <template>
  <div role="menu" ...attributes {{menu disabled=(if @disabled @disabled false)}}>
    <span>Refactor</span>
    <button type="button" role="menuitem">Format Document</button>
    <button type="button" role="menuitem">Refactor...</button>
    <button type="button" role="menuitem">Source Action...</button>
    <hr />
    <button type="button" role="menuitem" popovertarget="sharemenu">Share</button>
    <div role="menu" id="sharemenu" popover {{menu}}>
      <button type="button" role="menuitem">Code</button>
      <button type="button" role="menuitem" popovertarget="socialmenu">Social</button>
      <div role="menu" id="socialmenu" popover {{menu}}>
        <button type="button" role="menuitem">Twitter</button>
        <button type="button" role="menuitem">Mastodon</button>
        <button type="button" role="menuitem">Bsky</button>
      </div>
    </div>
    <hr />
    <button type="button" role="menuitem">Cut</button>
    <button type="button" role="menuitem">Copy</button>
    <button type="button" role="menuitem">Paste</button>
    <hr />
    <span>Appearance</span>
    <div>
      <button type="button" role="menuitemcheckbox" aria-checked="true">Primary Side Bar</button>
      <button type="button" role="menuitemcheckbox" aria-checked="true">Secondary Side Bar</button>
      <button type="button" role="menuitemcheckbox" aria-checked="true">Status Bar</button>
      <button type="button" role="menuitemcheckbox" aria-checked="true">Panels</button>
    </div>
    <hr />
    <button type="button" role="menuitem" popovertarget="panelpositionmenu">Panel Position</button>
    <div role="menu" id="panelpositionmenu" popover {{menu}}>
      <button type="button" role="menuitemradio" aria-checked="false">Top</button>
      <button type="button" role="menuitemradio" aria-checked="false">Left</button>
      <button type="button" role="menuitemradio" aria-checked="false">Right</button>
      <button type="button" role="menuitemradio" aria-checked="true">Bottom</button>
    </div>
  </div>
</template>;

module('Rendering | Modifier | {{menu}}', (hooks) => {
  setupRenderingTest(hooks);

  module('rudiments', function () {
    test('tabindex attribute is set', async function (assert) {
      await render(
        <template>
          <button type="button" popovertarget="refactormenu">Refactor</button>
          <CodeMenu id="refactormenu" popover />
        </template>
      );

      assert.dom('[role="menuitem"]:first-of-type').hasAttribute('tabindex', '0');
    });

    test('no tabindex attribute when disabled', async function (assert) {
      const context = new (class {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
        // @ts-ignore
        @tracked disabled = false;
      })();

      await render(
        <template>
          <button type="button" popovertarget="refactormenu">Refactor</button>
          <CodeMenu @disabled={{context.disabled}} id="refactormenu" popover />
        </template>
      );

      assert.dom('[role="menuitem"]:first-of-type').hasAttribute('tabindex', '0');

      context.disabled = true;

      await rerender();

      assert.dom('[role="menuitem"]:first-of-type').hasAttribute('tabindex', '-1');
    });
  });

  module('Navigation', function () {
    test('it supports keyboard navigation', async function (assert) {
      await render(
        <template>
          <button type="button" popovertarget="refactormenu">Refactor</button>
          <CodeMenu id="refactormenu" popover />
        </template>
      );

      await testMenuKeyboardNavigation(assert);
    });

    test('it supports pointer navigation', async function (assert) {
      await render(
        <template>
          <button type="button" popovertarget="refactormenu">Refactor</button>
          <CodeMenu id="refactormenu" popover />
        </template>
      );

      await testMenuPointerNavigation(assert);
    });
  });
});
