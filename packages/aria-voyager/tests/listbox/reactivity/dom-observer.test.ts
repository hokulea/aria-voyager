import { describe, expect, test, vi } from 'vitest';

import { Listbox } from '#src';
import { appendItemToList, getItems } from '#tests/components/list';
import { createListWithFruits } from '#tests/listbox/-shared';

describe('DOM Observer', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);

  test('start', () => {
    expect(listbox.items.length).toBe(3);
  });

  test('reads elements on appending', async () => {
    appendItemToList('Grapefruit', list);

    await vi.waitUntil(() => getItems(list).length === 4);

    expect(listbox.items.length).toBe(4);
  });

  test('reads selection on external update', async () => {
    const secondItem = listbox.items[1];

    expect(listbox.selection.length).toBe(0);

    secondItem.setAttribute('aria-selected', 'true');

    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');

    expect(listbox.selection.length).toBe(1);
  });

  test('removes items that contain selection', async () => {
    expect(listbox.selection.length).toBe(1);
    expect(listbox.items.length).toBe(4);

    const secondItem = list.children[1];

    secondItem.remove();

    await vi.waitUntil(() => getItems(list).length === 3);

    expect(listbox.items.length).toBe(3);
    expect(listbox.selection.length).toBe(0);
  });

  describe('read options', () => {
    test('detects multi-select', async () => {
      expect(listbox.options.multiple).toBeFalsy();

      list.setAttribute('aria-multiselectable', 'true');

      await expect.element(list).toHaveAttribute('aria-multiselectable', 'true');

      expect(listbox.options.multiple).toBeTruthy();
    });

    test('detects single-select', async () => {
      expect(listbox.options.multiple).toBeTruthy();

      list.removeAttribute('aria-multiselectable');

      await expect.element(list).not.toHaveAttribute('aria-multiselectable');

      expect(listbox.options.multiple).toBeFalsy();
    });

    test('sets tabindex to -1 when the aria-disabled is `true`', async () => {
      await expect.element(list).toHaveAttribute('tabindex', '0');

      list.setAttribute('aria-disabled', 'true');

      await expect.element(list).toHaveAttribute('aria-disabled', 'true');

      await expect.element(list).toHaveAttribute('tabindex', '-1');
    });

    test('re-sets tabindex to 0 when the aria-disabled is removed', async () => {
      await expect.element(list).toHaveAttribute('tabindex', '-1');

      list.removeAttribute('aria-disabled');

      await expect.element(list).not.toHaveAttribute('aria-disabled');

      await expect.element(list).toHaveAttribute('tabindex', '0');
    });
  });
});
