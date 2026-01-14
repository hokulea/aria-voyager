import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Listbox } from '#src';
import { createMultiSelectListWithFruits, getItems } from '#tests/listbox/-shared';

describe('Select with `ArrowUp` and `Shift`', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  const keys = userEvent.setup();

  test('focus list and activate last item', async () => {
    list.focus();
    await userEvent.keyboard('{End}');

    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('use `ArrowUp` and `Shift` key to select third and second item', async () => {
    await keys.keyboard('{Shift>}{ArrowUp}');

    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
  });

  test('use `ArrowUp` and `Shift` key to select thirdt to first item', async () => {
    await keys.keyboard('{ArrowUp}');

    await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
  });
});
