import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

import { fireKey } from '#tests/test-support/events';

test('select with `ArrowUp`', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await annotate('focus list and activate last item');
  list.focus();
  await fireKey(list, 'End');
  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');

  await annotate('use `ArrowUp` key to select second item');
  await fireKey(list, 'ArrowUp');
  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await annotate('use `ArrowUp` key to select first item');
  await fireKey(list, 'ArrowUp');
  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await annotate('use `ArrowUp` key, but keep first item selected (hit beginning of list)');
  await fireKey(list, 'ArrowUp');
  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');
});
