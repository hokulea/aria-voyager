import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

import { fireKey } from '#tests/test-support/events';

test('Select with `ArrowDown`', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await annotate('focus list to select first item');
  list.focus();
  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await annotate('use `ArrowDown` key to select second item');
  await fireKey(list, 'ArrowDown');
  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await annotate('use `ArrowDown` key to select third item');
  await fireKey(list, 'ArrowDown');
  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');

  await annotate('use `ArrowDown` key, but keep third item selected (hit end of list)');
  await fireKey(list, 'ArrowDown');
  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
});
