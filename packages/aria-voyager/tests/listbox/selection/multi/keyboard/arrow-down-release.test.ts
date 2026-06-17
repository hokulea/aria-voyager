import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createMultiSelectListWithFruits, getItems } from '#tests/listbox/-shared';

import { fireKey, fireKeyUp } from '#tests/test-support/events';

test('Select with `ArrowDown` and release `Shift`', async ({ annotate }) => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await annotate('focus the list to activate first item');
  list.focus();
  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await annotate('use `ArrowDown` and `Shift` key to select from first to second item');
  await fireKey(list, 'ArrowDown', { shiftKey: true });
  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await annotate('Release shift');
  await fireKeyUp(list, 'Shift');
  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');
});
