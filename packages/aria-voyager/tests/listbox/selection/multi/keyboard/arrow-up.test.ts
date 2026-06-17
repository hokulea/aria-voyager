import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Listbox } from '#src';

import { createMultiSelectListWithFruits, getItems } from '../../../-shared';

test('Select with `ArrowUp` and `Shift`', async ({ annotate }) => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);
  const keys = userEvent.setup();

  await annotate('focus list and activate last item');
  list.focus();
  await userEvent.keyboard('{End}');
  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await annotate('use `ArrowUp` and `Shift` key to select third and second item');
  await keys.keyboard('{Shift>}{ArrowUp}');
  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');

  await annotate('use `ArrowUp` and `Shift` key to select third to first item');
  await keys.keyboard('{ArrowUp}');
  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
});
