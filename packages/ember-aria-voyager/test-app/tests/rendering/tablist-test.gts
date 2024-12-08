import { tracked } from '@glimmer/tracking';
import { hash } from '@ember/helper';
import { render, rerender } from '@ember/test-helpers';
import { click } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { ariaTablist } from 'ember-aria-voyager';
import sinon from 'sinon';

import {
  testTablistKeyboardAutomaticSelection,
  testTablistKeyboardManualSelection,
  testTablistKeyboardNavigation,
  testTablistPointerNavigation,
  testTablistPointerSelection
} from 'ember-aria-voyager/test-support';
import { selectTab } from 'ember-aria-voyager/test-support';

import type { TOC } from '@ember/component/template-only';
import type { Orientation } from 'aria-voyager';

const range = (amount: number) => [...Array(amount).keys()];

// eslint-disable-next-line @typescript-eslint/naming-convention
const Tabs: TOC<{ Element: HTMLElement; Args: { amount: number } }> = <template>
  <div data-test-tab>
    <div role="tablist" ...attributes>
      {{#each (range @amount) as |i|}}
        <p role="tab" id="tab-{{i}}" aria-controls="panel-{{i}}">Tab {{i}}</p>
      {{/each}}
    </div>
    {{#each (range @amount) as |i|}}
      <div role="tabpanel" id="panel-{{i}}" aria-labelledby="tab-{{i}}">Tab {{i}}</div>
    {{/each}}
  </div>
</template>;

module('Rendering | Modifier | {{tablist}}', (hooks) => {
  setupRenderingTest(hooks);

  test('tabindex attribute is set', async (assert) => {
    await render(<template><Tabs @amount={{5}} {{ariaTablist}} /></template>);

    assert.dom('[role="tab"]').hasAttribute('tabindex', '0');
  });

  module('Reactivity', () => {
    test('disabling sets tabindex to -1', async (assert) => {
      const context = new (class {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
        // @ts-ignore
        @tracked disabled = false;
      })();

      await render(
        <template><Tabs @amount={{5}} {{ariaTablist disabled=context.disabled}} /></template>
      );

      assert.dom('[role="tab"]').hasAttribute('tabindex', '0');

      context.disabled = true;

      await rerender();

      assert.dom('[role="tab"]').hasAttribute('tabindex', '-1');
    });

    test('orientation changes are passed down', async (assert) => {
      const context = new (class {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
        // @ts-ignore
        @tracked orientation?: Orientation = undefined;
      })();

      await render(
        <template><Tabs @amount={{5}} {{ariaTablist orientation=context.orientation}} /></template>
      );

      assert.dom('[role="tablist"]').doesNotHaveAria('orientation');

      context.orientation = 'vertical';

      await rerender();

      assert.dom('[role="tablist"]').hasAria('orientation', 'vertical');
    });
  });

  module('Navigation', () => {
    test('it supports keyboard navigation', async (assert) => {
      await render(<template><Tabs @amount={{5}} {{ariaTablist}} /></template>);

      await testTablistKeyboardNavigation(assert);
    });

    test('it supports mouse navigation', async (assert) => {
      await render(<template><Tabs @amount={{5}} {{ariaTablist}} /></template>);

      await testTablistPointerNavigation(assert);
    });

    test('it updates about navigation', async (assert) => {
      const handleNavigation = sinon.spy();

      await render(
        <template><Tabs @amount={{5}} {{ariaTablist activateItem=handleNavigation}} /></template>
      );

      const tab = document.querySelector('[role="tab"]:nth-child(2)') as HTMLElement;

      await selectTab(tab);

      assert.ok(handleNavigation.calledOnceWith(tab));
    });
  });

  module('Selection', () => {
    test('it supports automatic keyboard selection', async (assert) => {
      await render(<template><Tabs @amount={{5}} {{ariaTablist}} /></template>);

      await testTablistKeyboardAutomaticSelection(assert);
    });

    test('it supports manual keyboard selection', async (assert) => {
      await render(
        <template>
          <Tabs @amount={{5}} {{ariaTablist behavior=(hash singleSelection="manual")}} />
        </template>
      );

      await testTablistKeyboardManualSelection(assert);
    });

    test('it supports pointer selection', async (assert) => {
      await render(<template><Tabs @amount={{5}} {{ariaTablist}} /></template>);

      await testTablistPointerSelection(assert);
    });

    test('it updates about selection', async (assert) => {
      const handleUpdate = sinon.spy();

      await render(<template><Tabs @amount={{5}} {{ariaTablist select=handleUpdate}} /></template>);

      const tab = document.querySelector('[role="tab"]:nth-child(2)') as HTMLElement;

      await selectTab(tab);

      assert.ok(handleUpdate.calledOnceWith(tab));
    });
  });
});
