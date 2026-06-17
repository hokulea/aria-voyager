import { tracked } from '@glimmer/tracking';
import { focus, render, rerender, triggerEvent, triggerKeyEvent } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { ariaRadioGroup } from '#src';

module('Rendering | Modifier | {{ariaRadioGroup}}', (hooks) => {
  setupRenderingTest(hooks);

  module('rudiments', function () {
    test('role and tabindex are set', async function (assert) {
      await render(
        <template>
          <div {{ariaRadioGroup}} data-test-group>
            <button type="button" role="radio" aria-checked="false">Top</button>
            <button type="button" role="radio" aria-checked="false">Bottom</button>
            <button type="button" role="radio" aria-checked="false">Left</button>
          </div>
        </template>
      );

      assert.dom('[data-test-group]').hasAttribute('role', 'radiogroup');
      assert.dom('[data-test-group]').hasAttribute('tabindex', '0');
      assert.dom('button:first-of-type').hasAttribute('tabindex', '0');
      assert.dom('button:nth-of-type(2)').hasAttribute('tabindex', '-1');
      assert.dom('button:last-of-type').hasAttribute('tabindex', '-1');
    });

    test('first radio is checked by default', async function (assert) {
      await render(
        <template>
          <div {{ariaRadioGroup}} data-test-group>
            <button type="button" role="radio" aria-checked="false">Top</button>
            <button type="button" role="radio" aria-checked="false">Bottom</button>
            <button type="button" role="radio" aria-checked="false">Left</button>
          </div>
        </template>
      );

      assert.dom('button:first-of-type').hasAttribute('aria-checked', 'true');
      assert.dom('button:nth-of-type(2)').hasAttribute('aria-checked', 'false');
      assert.dom('button:last-of-type').hasAttribute('aria-checked', 'false');
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
          <div {{ariaRadioGroup disabled=context.disabled}} data-test-group>
            <button type="button" role="radio" aria-checked="false">Top</button>
            <button type="button" role="radio" aria-checked="false">Bottom</button>
            <button type="button" role="radio" aria-checked="false">Left</button>
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

    test('@items are reactive', async function (assert) {
      // eslint-disable-next-line unicorn/no-unreadable-new-expression
      const context = new (class {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        @tracked items = ['Top', 'Bottom'];
      })();

      await render(
        <template>
          <div {{ariaRadioGroup items=context.items}} data-test-group>
            {{#each context.items as |item|}}
              <button type="button" role="radio" aria-checked="false">{{item}}</button>
            {{/each}}
          </div>
        </template>
      );

      assert.dom('button').exists({ count: 2 });
      assert.dom('button:first-of-type').hasAttribute('tabindex', '0');

      context.items = ['Top', 'Bottom', 'Left'];

      await rerender();

      assert.dom('button').exists({ count: 3 });
      assert.dom('button:first-of-type').hasAttribute('tabindex', '0');
    });
  });

  module('Selection', function () {
    test('select callback is called on pointer click', async function (assert) {
      // eslint-disable-next-line unicorn/no-unreadable-new-expression
      const context = new (class {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        selected?: HTMLElement;

        select = (item: HTMLElement) => {
          this.selected = item;
        };
      })();

      await render(
        <template>
          <div {{ariaRadioGroup select=context.select}} data-test-group>
            <button type="button" role="radio" aria-checked="false">Top</button>
            <button type="button" role="radio" aria-checked="false">Bottom</button>
            <button type="button" role="radio" aria-checked="false">Left</button>
          </div>
        </template>
      );

      await focus('[data-test-group]');
      await triggerEvent('button:nth-of-type(2)', 'pointerup');

      assert.strictEqual(context.selected?.textContent, 'Bottom');
      assert.dom('button:nth-of-type(2)').hasAttribute('aria-checked', 'true');
      assert.dom('button:first-of-type').hasAttribute('aria-checked', 'false');
    });

    test('select callback is called on arrow key navigation', async function (assert) {
      // eslint-disable-next-line unicorn/no-unreadable-new-expression
      const context = new (class {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        selected?: HTMLElement;

        select = (item: HTMLElement) => {
          this.selected = item;
        };
      })();

      await render(
        <template>
          <div {{ariaRadioGroup select=context.select}} data-test-group>
            <button type="button" role="radio" aria-checked="false">Top</button>
            <button type="button" role="radio" aria-checked="false">Bottom</button>
            <button type="button" role="radio" aria-checked="false">Left</button>
          </div>
        </template>
      );

      await focus('[data-test-group]');
      await triggerKeyEvent('[data-test-group]', 'keydown', 'ArrowDown');

      assert.strictEqual(context.selected?.textContent, 'Bottom');
      assert.dom('button:nth-of-type(2)').hasAttribute('aria-checked', 'true');
    });
  });

  module('Groups', function () {
    test('data-group creates independent radio groups', async function (assert) {
      await render(
        <template>
          <div {{ariaRadioGroup}} data-test-group>
            <button
              type="button"
              role="radio"
              aria-checked="false"
              data-group="alignment"
              data-test-top
            >Top</button>
            <button
              type="button"
              role="radio"
              aria-checked="false"
              data-group="alignment"
              data-test-bottom
            >Bottom</button>
            <button
              type="button"
              role="radio"
              aria-checked="false"
              data-group="position"
              data-test-left
            >Left</button>
            <button
              type="button"
              role="radio"
              aria-checked="false"
              data-group="position"
              data-test-right
            >Right</button>
          </div>
        </template>
      );

      // Each group has first item checked
      assert.dom('[data-test-top]').hasAttribute('aria-checked', 'true');
      assert.dom('[data-test-bottom]').hasAttribute('aria-checked', 'false');
      assert.dom('[data-test-left]').hasAttribute('aria-checked', 'true');
      assert.dom('[data-test-right]').hasAttribute('aria-checked', 'false');

      await focus('[data-test-group]');
      await triggerEvent('[data-test-bottom]', 'pointerup');

      // Only alignment group changed
      assert.dom('[data-test-top]').hasAttribute('aria-checked', 'false');
      assert.dom('[data-test-bottom]').hasAttribute('aria-checked', 'true');
      // Position group unchanged
      assert.dom('[data-test-left]').hasAttribute('aria-checked', 'true');
      assert.dom('[data-test-right]').hasAttribute('aria-checked', 'false');
    });
  });

  module('Navigation', function () {
    test('it supports keyboard navigation', async function (assert) {
      await render(
        <template>
          <div {{ariaRadioGroup}} data-test-group>
            <button type="button" role="radio" aria-checked="false">Top</button>
            <button type="button" role="radio" aria-checked="false">Bottom</button>
            <button type="button" role="radio" aria-checked="false">Left</button>
          </div>
        </template>
      );

      await focus('[data-test-group]');

      assert.dom('button:first-of-type').hasAttribute('tabindex', '0', 'First item is activated');
      assert
        .dom('button:first-of-type')
        .hasAttribute('aria-checked', 'true', 'First item is checked');

      await triggerKeyEvent('[data-test-group]', 'keydown', 'ArrowDown');

      assert
        .dom('button:nth-of-type(2)')
        .hasAttribute('tabindex', '0', '`ArrowDown` activates second item');
      assert
        .dom('button:nth-of-type(2)')
        .hasAttribute('aria-checked', 'true', '`ArrowDown` checks second item');
      assert
        .dom('button:first-of-type')
        .hasAttribute('tabindex', '-1', '... and deactivates first item');
      assert
        .dom('button:first-of-type')
        .hasAttribute('aria-checked', 'false', '... and unchecks first item');

      await triggerKeyEvent('[data-test-group]', 'keydown', 'ArrowRight');

      assert
        .dom('button:last-of-type')
        .hasAttribute('tabindex', '0', '`ArrowRight` activates last item');
      assert
        .dom('button:last-of-type')
        .hasAttribute('aria-checked', 'true', '`ArrowRight` checks last item');

      await triggerKeyEvent('[data-test-group]', 'keydown', 'ArrowUp');

      assert
        .dom('button:nth-of-type(2)')
        .hasAttribute('tabindex', '0', '`ArrowUp` activates second item');
      assert
        .dom('button:nth-of-type(2)')
        .hasAttribute('aria-checked', 'true', '`ArrowUp` checks second item');

      await triggerKeyEvent('[data-test-group]', 'keydown', 'ArrowLeft');

      assert
        .dom('button:first-of-type')
        .hasAttribute('tabindex', '0', '`ArrowLeft` activates first item');
      assert
        .dom('button:first-of-type')
        .hasAttribute('aria-checked', 'true', '`ArrowLeft` checks first item');

      await triggerKeyEvent('[data-test-group]', 'keydown', 'End');

      assert.dom('button:last-of-type').hasAttribute('tabindex', '0', '`End` activates last item');
      assert
        .dom('button:last-of-type')
        .hasAttribute('aria-checked', 'true', '`End` checks last item');

      await triggerKeyEvent('[data-test-group]', 'keydown', 'Home');

      assert
        .dom('button:first-of-type')
        .hasAttribute('tabindex', '0', '`Home` activates first item');
      assert
        .dom('button:first-of-type')
        .hasAttribute('aria-checked', 'true', '`Home` checks first item');
    });

    test('it supports pointer navigation', async function (assert) {
      await render(
        <template>
          <div {{ariaRadioGroup}} data-test-group>
            <button type="button" role="radio" aria-checked="false">Top</button>
            <button type="button" role="radio" aria-checked="false">Bottom</button>
            <button type="button" role="radio" aria-checked="false">Left</button>
          </div>
        </template>
      );

      await focus('[data-test-group]');

      assert.dom('button:first-of-type').hasAttribute('tabindex', '0', 'First item is activated');
      assert
        .dom('button:first-of-type')
        .hasAttribute('aria-checked', 'true', 'First item is checked');

      await triggerEvent('button:nth-of-type(2)', 'pointerup');

      assert
        .dom('button:nth-of-type(2)')
        .hasAttribute('tabindex', '0', '`pointerup` activates second item');
      assert
        .dom('button:nth-of-type(2)')
        .hasAttribute('aria-checked', 'true', '`pointerup` checks second item');
      assert
        .dom('button:first-of-type')
        .hasAttribute('tabindex', '-1', '... and deactivates first item');
      assert
        .dom('button:first-of-type')
        .hasAttribute('aria-checked', 'false', '... and unchecks first item');

      await triggerEvent('button:last-of-type', 'pointerup');

      assert
        .dom('button:last-of-type')
        .hasAttribute('tabindex', '0', '`pointerup` activates last item');
      assert
        .dom('button:last-of-type')
        .hasAttribute('aria-checked', 'true', '`pointerup` checks last item');
      assert
        .dom('button:nth-of-type(2)')
        .hasAttribute('tabindex', '-1', '... and deactivates second item');
      assert
        .dom('button:nth-of-type(2)')
        .hasAttribute('aria-checked', 'false', '... and unchecks second item');
    });
  });
});
