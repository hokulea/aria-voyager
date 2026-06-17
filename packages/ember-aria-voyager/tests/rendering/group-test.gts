import { tracked } from '@glimmer/tracking';
import { focus, render, rerender, triggerEvent, triggerKeyEvent } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { ariaGroup } from '#src';

module('Rendering | Modifier | {{ariaGroup}}', (hooks) => {
  setupRenderingTest(hooks);

  module('rudiments', function () {
    test('role and tabindex are set', async function (assert) {
      await render(
        <template>
          <div {{ariaGroup}} data-test-group>
            <button type="button">Cut</button>
            <button type="button">Copy</button>
            <button type="button">Paste</button>
          </div>
        </template>
      );

      assert.dom('[data-test-group]').hasAttribute('role', 'group');
      assert.dom('[data-test-group]').hasAttribute('tabindex', '0');
      assert.dom('button:first-of-type').hasAttribute('tabindex', '0');
      assert.dom('button:nth-of-type(2)').hasAttribute('tabindex', '-1');
      assert.dom('button:last-of-type').hasAttribute('tabindex', '-1');
    });

    test('no tabindex on children when disabled', async function (assert) {
      // eslint-disable-next-line unicorn/no-unreadable-new-expression
      const context = new (class {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        @tracked disabled = false;
      })();

      await render(
        <template>
          <div {{ariaGroup disabled=context.disabled}} data-test-group>
            <button type="button">Cut</button>
            <button type="button">Copy</button>
            <button type="button">Paste</button>
          </div>
        </template>
      );

      assert.dom('[data-test-group]').doesNotHaveAria('disabled');
      assert.dom('[data-test-group]').hasAttribute('tabindex', '0');
      assert.dom('button:first-of-type').hasAttribute('tabindex', '0');

      context.disabled = true;

      await rerender();

      assert.dom('[data-test-group]').hasAria('disabled', 'true');
      assert.dom('[data-test-group]').hasAttribute('tabindex', '-1');
      assert.dom('button:first-of-type').hasAttribute('tabindex', '-1');
    });
  });

  module('Reactivity', () => {
    test('items and disabled are reactive', async (assert) => {
      // eslint-disable-next-line unicorn/no-unreadable-new-expression
      const context = new (class {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        @tracked disabled = false;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        @tracked items = ['apple', 'banana'];
      })();

      await render(
        <template>
          <div {{ariaGroup items=context.items disabled=context.disabled}} data-test-group>
            {{#each context.items as |item|}}
              <button type="button">{{item}}</button>
            {{/each}}
          </div>
        </template>
      );

      assert.dom('[data-test-group]').doesNotHaveAria('disabled');
      assert.dom('button').exists({ count: 2 });
      assert.dom('button:first-of-type').hasAttribute('tabindex', '0');

      context.disabled = true;

      await rerender();

      assert.dom('[data-test-group]').hasAria('disabled', 'true');
      assert.dom('[data-test-group]').hasAttribute('tabindex', '-1');
      assert.dom('button:first-of-type').hasAttribute('tabindex', '-1');

      context.items = ['apple', 'banana', 'pineapple'];

      await rerender();

      assert.dom('button').exists({ count: 3 });
      assert.dom('button:first-of-type').hasAttribute('tabindex', '-1');
    });
  });

  module('Navigation', function () {
    test('it supports keyboard navigation', async function (assert) {
      await render(
        <template>
          <div {{ariaGroup}} data-test-group>
            <button type="button">Cut</button>
            <button type="button">Copy</button>
            <button type="button">Paste</button>
          </div>
        </template>
      );

      await focus('[data-test-group]');

      assert.dom('button:first-of-type').hasAttribute('tabindex', '0', 'First item is activated');

      await triggerKeyEvent('[data-test-group]', 'keydown', 'ArrowDown');

      assert
        .dom('button:nth-of-type(2)')
        .hasAttribute('tabindex', '0', '`ArrowDown` activates second item');
      assert
        .dom('button:first-of-type')
        .hasAttribute('tabindex', '-1', '... and deactivates first item');

      await triggerKeyEvent('[data-test-group]', 'keydown', 'ArrowRight');

      assert
        .dom('button:last-of-type')
        .hasAttribute('tabindex', '0', '`ArrowRight` activates last item');

      await triggerKeyEvent('[data-test-group]', 'keydown', 'ArrowUp');

      assert
        .dom('button:nth-of-type(2)')
        .hasAttribute('tabindex', '0', '`ArrowUp` activates second item');

      await triggerKeyEvent('[data-test-group]', 'keydown', 'ArrowLeft');

      assert
        .dom('button:first-of-type')
        .hasAttribute('tabindex', '0', '`ArrowLeft` activates first item');

      await triggerKeyEvent('[data-test-group]', 'keydown', 'End');

      assert.dom('button:last-of-type').hasAttribute('tabindex', '0', '`End` activates last item');

      await triggerKeyEvent('[data-test-group]', 'keydown', 'Home');

      assert
        .dom('button:first-of-type')
        .hasAttribute('tabindex', '0', '`Home` activates first item');
    });

    test('it supports pointer navigation', async function (assert) {
      await render(
        <template>
          <div {{ariaGroup}} data-test-group>
            <button type="button">Cut</button>
            <button type="button">Copy</button>
            <button type="button">Paste</button>
          </div>
        </template>
      );

      await focus('[data-test-group]');

      assert.dom('button:first-of-type').hasAttribute('tabindex', '0', 'First item is activated');

      await triggerEvent('button:nth-of-type(2)', 'pointerup');

      assert
        .dom('button:nth-of-type(2)')
        .hasAttribute('tabindex', '0', '`pointerup` activates second item');
      assert
        .dom('button:first-of-type')
        .hasAttribute('tabindex', '-1', '... and deactivates first item');

      await triggerEvent('button:last-of-type', 'pointerup');

      assert
        .dom('button:last-of-type')
        .hasAttribute('tabindex', '0', '`pointerup` activates last item');
      assert
        .dom('button:nth-of-type(2)')
        .hasAttribute('tabindex', '-1', '... and deactivates second item');
    });
  });
});
