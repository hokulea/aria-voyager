import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Listbox } from '#src';
import { createMultiSelectListWithFruits, getItems } from '#tests/listbox/-shared';

describe('Select with `ArrowDown` and `Shift`', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  const keys = userEvent.setup();

  test('focus the list to activate first item', async () => {
    list.focus();

    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('use `ArrowDown` and `Shift` key to select from first to second item', async () => {
    await keys.keyboard('{Shift>}{ArrowDown}');

    await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('use `ArrowDown` and `Shift` key to select from first to third item', async () => {
    await keys.keyboard('{ArrowDown}');

    await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
  });
});
