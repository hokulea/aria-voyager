import { expect, test, vi } from 'vitest';

import { Listbox } from '#src';
import { appendItemToList } from '#tests/components/list';

import { createListWithFruits, getItems } from '../-shared';

test('DOM Observer', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);

  expect(listbox.items.length).toBe(3);

  await annotate('reads elements on appending');
  appendItemToList('Grapefruit', list);
  await vi.waitUntil(() => listbox.items.length === 4);
  expect(listbox.items.length).toBe(4);

  await annotate('reads selection on external update');

  const { secondItem } = getItems(listbox);

  expect(listbox.selection.length).toBe(0);
  secondItem.setAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  expect(listbox.selection.length).toBe(1);

  await annotate('removes items that contain selection');
  expect(listbox.selection.length).toBe(1);
  expect(listbox.items.length).toBe(4);
  secondItem.remove();
  await vi.waitUntil(() => listbox.items.length === 3);
  expect(listbox.items.length).toBe(3);
  expect(listbox.selection.length).toBe(0);

  await annotate('detects multi-select');
  expect(listbox.options.multiple).toBeFalsy();
  list.setAttribute('aria-multiselectable', 'true');
  await expect.element(list).toHaveAttribute('aria-multiselectable', 'true');
  expect(listbox.options.multiple).toBeTruthy();

  await annotate('detects single-select');
  expect(listbox.options.multiple).toBeTruthy();
  list.removeAttribute('aria-multiselectable');
  await expect.element(list).not.toHaveAttribute('aria-multiselectable');
  expect(listbox.options.multiple).toBeFalsy();

  await annotate('sets tabindex to -1 when aria-disabled is true');
  await expect.element(list).toHaveAttribute('tabindex', '0');
  list.setAttribute('aria-disabled', 'true');
  await expect.element(list).toHaveAttribute('aria-disabled', 'true');
  await expect.element(list).toHaveAttribute('tabindex', '-1');

  await annotate('re-sets tabindex to 0 when aria-disabled is removed');
  await expect.element(list).toHaveAttribute('tabindex', '-1');
  list.removeAttribute('aria-disabled');
  await expect.element(list).not.toHaveAttribute('aria-disabled');
  await expect.element(list).toHaveAttribute('tabindex', '0');
});
