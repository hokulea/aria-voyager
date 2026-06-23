import { tracked } from '@glimmer/tracking';
import { render, rerender, triggerEvent } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import Sinon from 'sinon';

import { ariaMenu } from '#src';
import { testMenuKeyboardNavigation, testMenuPointerNavigation } from '#test-support';

import type { TOC } from '@ember/component/template-only';

interface CodeMenuSignature {
  Element: HTMLDivElement;
  Args: {
    disabled?: boolean;
  };
}

const CodeMenu: TOC<CodeMenuSignature> = <template>
  <div role="menu" ...attributes {{ariaMenu disabled=(if @disabled @disabled false)}}>
    <span>Refactor</span>
    <button type="button" role="menuitem">Format Document</button>
    <button type="button" role="menuitem">Refactor...</button>
    <button type="button" role="menuitem">Source Action...</button>
    <hr />
    <button type="button" role="menuitem" popovertarget="sharemenu">Share</button>
    <div role="menu" id="sharemenu" popover {{ariaMenu}}>
      <button type="button" role="menuitem">Code</button>
      <button type="button" role="menuitem" popovertarget="socialmenu">Social</button>
      <div role="menu" id="socialmenu" popover {{ariaMenu}}>
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
    <div role="presentation">
      <button type="button" role="menuitemcheckbox" aria-checked="true">Primary Side Bar</button>
      <button type="button" role="menuitemcheckbox" aria-checked="true">Secondary Side Bar</button>
      <button type="button" role="menuitemcheckbox" aria-checked="true">Status Bar</button>
      <button type="button" role="menuitemcheckbox" aria-checked="true">Panels</button>
    </div>
    <hr />
    <button type="button" role="menuitem" popovertarget="panelpositionmenu">Panel Position</button>
    <div role="menu" id="panelpositionmenu" popover {{ariaMenu}}>
      <button type="button" role="menuitemradio" aria-checked="false">Top</button>
      <button type="button" role="menuitemradio" aria-checked="false">Left</button>
      <button type="button" role="menuitemradio" aria-checked="false">Right</button>
      <button type="button" role="menuitemradio" aria-checked="true">Bottom</button>
    </div>
  </div>
</template>;

interface EditorMenuSignature {
  Element: HTMLDivElement;
  Args: {
    selection?: string[];
    select?: (selection: HTMLElement[]) => void;
    check?: (selection: HTMLElement[]) => void;
  };
}

function isSelected(item: string, selection: string[]) {
  return selection.includes(item);
}

const EditorMenu: TOC<EditorMenuSignature> = <template>
  <div role="menu" ...attributes {{ariaMenu select=@select check=@check}}>
    <button type="button" role="menuitem">Cut</button>
    <button type="button" role="menuitem">Copy</button>
    <button type="button" role="menuitem">Paste</button>
    <hr />
    <button
      type="button"
      role="menuitemradio"
      aria-checked={{if @selection (isSelected "Small" @selection) "false"}}
      ata-test-small
    >Small</button>
    <button
      type="button"
      role="menuitemradio"
      aria-checked={{if @selection (isSelected "Normal" @selection) "true"}}
      data-test-normal
    >Normal</button>
    <button
      type="button"
      role="menuitemradio"
      aria-checked={{if @selection (isSelected "Large" @selection) "false"}}
      data-test-large
    >Large</button>
    <hr />
    <span>Appearance</span>
    <div role="presentation">
      <button type="button" role="menuitemcheckbox" aria-checked="false" data-test-primary>
        Primary Side Bar
      </button>
      <button type="button" role="menuitemcheckbox" aria-checked="false" data-test-secondary>
        Secondary Side Bar
      </button>
      <button type="button" role="menuitemcheckbox" aria-checked="false" data-test-status>
        Status Bar
      </button>
      <button type="button" role="menuitemcheckbox" aria-checked="false" data-test-panels>
        Panels
      </button>
    </div>
    <div role="presentation">
      <button
        type="button"
        role="menuitemradio"
        aria-checked={{if @selection (isSelected "Left" @selection) "false"}}
        data-test-left
      >Left</button>
      <button
        type="button"
        role="menuitemradio"
        aria-checked={{if @selection (isSelected "Center" @selection) "false"}}
        data-test-center
      >Center</button>
      <button
        type="button"
        role="menuitemradio"
        aria-checked={{if @selection (isSelected "Right" @selection) "false"}}
        data-test-right
      >Right</button>
      <button
        type="button"
        role="menuitemradio"
        aria-checked={{if @selection (isSelected "Justified" @selection) "true"}}
        data-test-justified
      >Justified</button>
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
      // eslint-disable-next-line unicorn/no-unreadable-new-expression
      const context = new (class {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        @tracked disabled = false;
      })();

      await render(
        <template>
          <button type="button" popovertarget="refactormenu">Refactor</button>
          <CodeMenu @disabled={{context.disabled}} id="refactormenu" popover />
        </template>
      );

      assert.dom('[role="menu"]').doesNotHaveAria('disabled');
      assert.dom('[role="menuitem"]:first-of-type').hasAttribute('tabindex', '0');

      context.disabled = true;

      await rerender();

      assert.dom('[role="menu"]').hasAria('disabled', 'true');
      assert.dom('[role="menuitem"]:first-of-type').hasAttribute('tabindex', '-1');
    });
  });

  module('Reactivity', () => {
    test('@items to be reactive with @disabled', async (assert) => {
      // eslint-disable-next-line unicorn/no-unreadable-new-expression
      const context = new (class {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        @tracked disabled = false;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        @tracked items = ['jackfruit'];
      })();

      await render(
        <template>
          <div role="menu" {{ariaMenu items=context.items disabled=context.disabled}}>
            {{#each context.items as |i|}}
              <button type="button" role="menuitem">{{i}}</button>
            {{/each}}
          </div>
        </template>
      );

      assert.dom('[role="menu"]').doesNotHaveAria('disabled');
      assert.dom('[role="menuitem"]').exists({ count: 1 });
      assert.dom('[role="menuitem"]').hasAttribute('tabindex', '0');

      context.disabled = true;

      await rerender();

      assert.dom('[role="menu"]').hasAria('disabled', 'true');
      assert.dom('[role="menuitem"]').hasAttribute('tabindex', '-1');

      context.items = ['apple', 'banana', 'pineapple'];

      await rerender();

      assert.dom('[role="menuitem"]').exists({ count: 3 });
      assert.dom('[role="menuitem"]').hasAttribute('tabindex', '-1');
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

  module('Selection', () => {
    test('Trigger select()', async (assert) => {
      const selectSpy = Sinon.spy();

      await render(<template><EditorMenu @select={{selectSpy}} /></template>);

      await triggerEvent('[data-test-large]', 'pointerup');

      const firstSelection = (selectSpy.lastCall.firstArg as HTMLElement[]).map((elem) =>
        elem.textContent.trim()
      );

      assert.deepEqual(firstSelection, ['Large', 'Justified']);

      await triggerEvent('[data-test-left]', 'pointerup');

      const secondSelection = (selectSpy.lastCall.firstArg as HTMLElement[]).map((elem) =>
        elem.textContent.trim()
      );

      assert.deepEqual(secondSelection, ['Large', 'Left']);
    });

    test('Trigger check()', async (assert) => {
      const checkSpy = Sinon.spy();

      await render(<template><EditorMenu @check={{checkSpy}} /></template>);

      await triggerEvent('[data-test-primary]', 'pointerup');

      const firstSelection = (checkSpy.lastCall.firstArg as HTMLElement[]).map((elem) =>
        elem.textContent.trim()
      );

      assert.deepEqual(firstSelection, ['Primary Side Bar']);

      await triggerEvent('[data-test-panels]', 'pointerup');

      const secondSelection = (checkSpy.lastCall.firstArg as HTMLElement[]).map((elem) =>
        elem.textContent.trim()
      );

      assert.deepEqual(secondSelection, ['Primary Side Bar', 'Panels']);

      await triggerEvent('[data-test-primary]', 'pointerup');

      const thirdSelection = (checkSpy.lastCall.firstArg as HTMLElement[]).map((elem) =>
        elem.textContent.trim()
      );

      assert.deepEqual(thirdSelection, ['Panels']);
    });
  });
});
