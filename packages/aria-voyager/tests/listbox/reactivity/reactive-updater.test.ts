import { describe, expect, test } from 'vitest';

import { Listbox, ReactiveUpdateStrategy } from '../../../src';
import { appendItemToList } from '../../components/list';
import { createListWithFruits, getItems } from '../-shared';

// simulating a framework with a reactive library
describe('Reactive Updater', () => {
  const list = createListWithFruits();
  const updater = new ReactiveUpdateStrategy();
  const listbox = new Listbox(list, {
    updater
  });

  test('start', () => {
    expect(listbox.items.length).toBe(3);
  });

  test('reads elements on appending', () => {
    appendItemToList('Grapefruit', list);

    updater.updateItems();

    expect(listbox.items.length).toBe(4);
  });

  test('reads selection on external update', () => {
    const { secondItem } = getItems(listbox);

    expect(listbox.selection.length).toBe(0);

    secondItem.setAttribute('aria-selected', 'true');

    updater.updateSelection();

    expect(listbox.selection.length).toBe(1);
    expect(list).toHaveAttribute('aria-activedescendant', secondItem.id);
  });

  describe('read options', () => {
    test('detects multi-select', () => {
      expect(listbox.options.multiple).toBeFalsy();

      list.setAttribute('aria-multiselectable', 'true');

      updater.updateOptions();

      expect(listbox.options.multiple).toBeTruthy();
    });

    test('detects single-select', () => {
      expect(listbox.options.multiple).toBeTruthy();

      list.removeAttribute('aria-multiselectable');

      updater.updateOptions();

      expect(listbox.options.multiple).toBeFalsy();
    });

    test('sets tabindex to -1 when the aria-disabled is `true`', () => {
      expect(list.getAttribute('tabindex')).toBe('0');

      list.setAttribute('aria-disabled', 'true');

      updater.updateOptions();

      expect(list.getAttribute('tabindex')).toBe('-1');
    });

    test('re-sets tabindex to 0 when the aria-disabled is removed', () => {
      expect(list.getAttribute('tabindex')).toBe('-1');

      list.removeAttribute('aria-disabled');

      updater.updateOptions();

      expect(list.getAttribute('tabindex')).toBe('0');
    });
  });
});
