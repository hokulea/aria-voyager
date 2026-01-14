import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

describe('Select with `ArrowDown`', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('focus list to select first item', async () => {
    list.focus();

    await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('use `ArrowDown` key to select second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('use `ArrowDown` key to select third item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
  });

  test('use `ArrowDown` key, but keep third item selected (hit end of list)', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
  });
});
