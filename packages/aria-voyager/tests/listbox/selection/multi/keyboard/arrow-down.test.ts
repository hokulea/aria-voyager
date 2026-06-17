import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Listbox } from '#src';
import { createMultiSelectListWithFruits, getItems } from '#tests/listbox/-shared';

test('Select with `ArrowDown` and `Shift`', async ({ annotate }) => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);
  const keys = userEvent.setup();

  await annotate('focus the list to activate first item');
  list.focus();
  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await annotate('use `ArrowDown` and `Shift` key to select from first to second item');
  await keys.keyboard('{Shift>}{ArrowDown}');
  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await annotate('use `ArrowDown` to select from first to third item');
  await keys.keyboard('{ArrowDown}');
  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
});
