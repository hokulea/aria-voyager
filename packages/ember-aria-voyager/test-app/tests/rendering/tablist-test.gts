import { tracked } from '@glimmer/tracking';
import { hash } from '@ember/helper';
import { render, rerender } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { tablist } from 'ember-aria-voyager';

import {
  testTablistKeyboardAutomaticSelection,
  testTablistKeyboardManualSelection,
  testTablistKeyboardNavigation,
  testTablistPointerNavigation,
  testTablistPointerSelection
} from 'ember-aria-voyager/test-support';

import type { TOC } from '@ember/component/template-only';
import type { Orientation } from 'aria-voyager';

const range = (amount: number) => [...Array(amount).keys()];

// eslint-disable-next-line @typescript-eslint/naming-convention
const Tabs: TOC<{ Element: HTMLElement; Args: { amount: number } }> = <template>
  <div>
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
    await render(<template><Tabs @amount={{5}} {{tablist}} /></template>);

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
        <template><Tabs @amount={{5}} {{tablist disabled=context.disabled}} /></template>
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
        <template><Tabs @amount={{5}} {{tablist orientation=context.orientation}} /></template>
      );

      assert.dom('[role="tablist"]').doesNotHaveAria('orientation');

      context.orientation = 'vertical';

      await rerender();

      assert.dom('[role="tablist"]').hasAria('orientation', 'vertical');
    });
  });

  module('Navigation', () => {
    test('it supports keyboard navigation', async (assert) => {
      await render(<template><Tabs @amount={{5}} {{tablist}} /></template>);

      await testTablistKeyboardNavigation(assert);
    });

    test('it supports mouse navigation', async (assert) => {
      await render(<template><Tabs @amount={{5}} {{tablist}} /></template>);

      await testTablistPointerNavigation(assert);
    });
  });

  module('Selection', () => {
    test('it supports automatic keyboard selection', async (assert) => {
      await render(<template><Tabs @amount={{5}} {{tablist}} /></template>);

      await testTablistKeyboardAutomaticSelection(assert);
    });

    test('it supports manual keyboard selection', async (assert) => {
      await render(
        <template>
          <Tabs @amount={{5}} {{tablist behavior=(hash singleSelection="manual")}} />
        </template>
      );

      await testTablistKeyboardManualSelection(assert);
    });

    test('it supports pointer selection', async (assert) => {
      await render(<template><Tabs @amount={{5}} {{tablist}} /></template>);

      await testTablistPointerSelection(assert);
    });
  });
});
