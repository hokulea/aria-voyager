import { tracked } from '@glimmer/tracking';
import { render, rerender } from '@ember/test-helpers';
import { settled } from '@ember/test-helpers';
import { focus } from '@ember/test-helpers';
import { triggerKeyEvent } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { ariaListbox } from 'ember-aria-voyager';
import sinon from 'sinon';

import {
  selectListbox,
  testListKeyboardNavigation,
  testListKeyboardSelection,
  testListPointerNavigation,
  testListPointerSelection
} from 'ember-aria-voyager/test-support';

import type { TestContext as BaseTestContext } from '@ember/test-helpers';

interface TestContext extends BaseTestContext {
  options: string[];
  select: sinon.SinonSpy;
  value: string;
}

module('Rendering | Modifier | {{listbox}}', (hooks) => {
  setupRenderingTest(hooks);

  test('tabindex attribute is set', async function (assert) {
    const options = ['apple', 'banana', 'pineapple'];

    await render(
      <template>
        <div role="listbox" {{ariaListbox items=options}}>
          {{#each options as |option|}}
            <p role="option" aria-selected="false">{{option}}</p>
          {{/each}}
        </div>
      </template>
    );

    assert.dom('[role="listbox"]').hasAttribute('tabindex', '0');
  });

  module('Reactivity', () => {
    test('disabling sets tabindex to -1', async function (this: TestContext, assert) {
      const options = ['apple', 'banana', 'pineapple'];
      const context = new (class {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
        // @ts-ignore
        @tracked disabled = false;
      })();

      await render(
        <template>
          <div role="listbox" {{ariaListbox items=options disabled=context.disabled}}>
            {{#each options as |option|}}
              <p role="option" aria-selected="false">{{option}}</p>
            {{/each}}
          </div>
        </template>
      );

      assert.dom('[role="listbox"]').hasAttribute('tabindex', '0');

      context.disabled = true;

      await rerender();

      assert.dom('[role="listbox"]').hasAttribute('tabindex', '-1');
    });

    test('selection updates', async (assert) => {
      const handleUpdate = sinon.spy();
      const options = ['apple', 'banana', 'pineapple'];
      const context = new (class {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
        // @ts-ignore
        @tracked selection?: string = undefined;
      })();

      const isSelected = (item: string, selection?: string) => {
        return item === selection;
      };

      await render(
        <template>
          <div
            role="listbox"
            {{ariaListbox items=options selection=context.selection select=handleUpdate}}
          >
            {{#each options as |option|}}
              <p
                role="option"
                aria-selected={{if (isSelected option context.selection) "true"}}
              >{{option}}</p>
            {{/each}}
          </div>
        </template>
      );

      context.selection = 'banana';

      await settled();
      await focus('[role="listbox"]');
      await triggerKeyEvent('[role="listbox"]', 'keydown', 'ArrowRight');

      assert.ok(handleUpdate.calledWith('pineapple'));
    });
  });

  module('Navigation', () => {
    test('it supports keyboard navigation', async function (this: TestContext, assert) {
      const options = ['apple', 'banana', 'pineapple'];

      await render(
        <template>
          <div role="listbox" {{ariaListbox items=options}}>
            {{#each options as |option|}}
              <p role="option" aria-selected="false">{{option}}</p>
            {{/each}}
          </div>
        </template>
      );

      await testListKeyboardNavigation(assert);
    });

    test('it supports mouse navigation', async function (this: TestContext, assert) {
      const options = ['apple', 'banana', 'pineapple'];

      await render(
        <template>
          <div role="listbox" {{ariaListbox items=options}}>
            {{#each options as |option|}}
              <p role="option" aria-selected="false">{{option}}</p>
            {{/each}}
          </div>
        </template>
      );

      await testListPointerNavigation(assert);
    });
  });

  module('Single Selection', () => {
    test('select with element', async function (this: TestContext, assert) {
      const selectSpy = sinon.spy();
      const options = ['apple', 'banana', 'pineapple'];

      await render(
        <template>
          <div role="listbox" {{ariaListbox select=selectSpy}} data-test-listbox>
            {{#each options as |option|}}
              <p role="option" aria-selected="false">{{option}}</p>
            {{/each}}
          </div>
        </template>
      );

      await selectListbox('[data-test-listbox]', 'pineapple');

      const elem = document.querySelector('[role="option"]:last-child') as HTMLElement;

      assert.ok(selectSpy.calledOnceWith(elem));
    });

    test('select with item', async function (this: TestContext, assert) {
      const selectSpy = sinon.spy();
      const options = [
        { id: 1, value: 'apple' },
        { id: 2, value: 'banana' },
        { id: 3, value: 'pineapple' }
      ];

      await render(
        <template>
          <div role="listbox" {{ariaListbox items=options select=selectSpy}} data-test-listbox>
            {{#each options as |option|}}
              <p role="option" aria-selected="false">{{option.value}}</p>
            {{/each}}
          </div>
        </template>
      );

      await selectListbox('[data-test-listbox]', 'banana');

      assert.ok(selectSpy.calledOnceWith(options[1]));
    });

    test('it supports keyboard selection', async function (this: TestContext, assert) {
      const options = ['apple', 'banana', 'pineapple'];

      await render(
        <template>
          <div role="listbox" {{ariaListbox items=options}}>
            {{#each options as |option|}}
              <p role="option" aria-selected="false">{{option}}</p>
            {{/each}}
          </div>
        </template>
      );

      await testListKeyboardSelection(assert);
    });

    test('it supports mouse selection', async function (this: TestContext, assert) {
      const options = ['apple', 'banana', 'pineapple'];

      await render(
        <template>
          <div role="listbox" {{ariaListbox items=options}}>
            {{#each options as |option|}}
              <p role="option" aria-selected="false">{{option}}</p>
            {{/each}}
          </div>
        </template>
      );

      await testListPointerSelection(assert);
    });
  });

  module('Multi Selection', () => {
    test('select with element', async function (this: TestContext, assert) {
      const selectSpy = sinon.spy();
      const options = ['apple', 'banana', 'pineapple'];

      await render(
        <template>
          <div role="listbox" {{ariaListbox select=selectSpy multi=true}} data-test-listbox>
            {{#each options as |option|}}
              <p role="option" aria-selected="false">{{option}}</p>
            {{/each}}
          </div>
        </template>
      );

      const apple = document.querySelector('[role="option"]:first-child') as HTMLElement;
      const banana = document.querySelector('[role="option"]:nth-child(2)') as HTMLElement;
      const pineapple = document.querySelector('[role="option"]:last-child') as HTMLElement;

      await selectListbox('[data-test-listbox]', 'banana');
      assert.ok(selectSpy.getCall(0).calledWith([banana]));

      await selectListbox('[data-test-listbox]', ['pineapple', 'apple'], true);
      assert.ok(selectSpy.getCall(1).calledWith([apple, banana, pineapple]));

      await selectListbox('[data-test-listbox]', ['pineapple', 'apple']);
      assert.ok(selectSpy.getCall(2).calledWith([apple, pineapple]));
    });

    test('select with item', async function (this: TestContext, assert) {
      const selectSpy = sinon.spy();
      const options = [
        { id: 1, value: 'apple' },
        { id: 2, value: 'banana' },
        { id: 3, value: 'pineapple' }
      ];

      await render(
        <template>
          <div
            role="listbox"
            {{ariaListbox items=options select=selectSpy multi=true}}
            data-test-listbox
          >
            {{#each options as |option|}}
              <p role="option" aria-selected="false">{{option.value}}</p>
            {{/each}}
          </div>
        </template>
      );

      await selectListbox('[data-test-listbox]', 'banana');
      assert.ok(selectSpy.getCall(0).calledWith([options[1]]));

      await selectListbox('[data-test-listbox]', ['pineapple', 'apple'], true);
      assert.ok(selectSpy.getCall(1).calledWith(options));

      await selectListbox('[data-test-listbox]', ['pineapple', 'apple']);
      assert.ok(selectSpy.getCall(2).calledWith([options[0], options[2]]));
    });

    test('it supports keyboard selection', async function (this: TestContext, assert) {
      const options = ['apple', 'banana', 'pineapple'];

      await render(
        <template>
          <div role="listbox" {{ariaListbox items=options multi=true}}>
            {{#each options as |option|}}
              {{! template-lint-disable require-mandatory-role-attributes  }}
              <p role="option">{{option}}</p>
            {{/each}}
          </div>
        </template>
      );

      await testListKeyboardSelection(assert);
    });

    test('it supports mouse selection', async function (this: TestContext, assert) {
      const options = ['apple', 'banana', 'pineapple'];

      await render(
        <template>
          <div role="listbox" {{ariaListbox items=options multi=true}}>
            {{#each options as |option|}}
              <p role="option" aria-selected="false">{{option}}</p>
            {{/each}}
          </div>
        </template>
      );

      await testListPointerSelection(assert);
    });
  });
});
