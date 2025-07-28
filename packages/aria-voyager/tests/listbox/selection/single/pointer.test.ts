import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

describe('With Pointer', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('start', async () => {
    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('select second item', async () => {
    await userEvent.click(secondItem);

    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('select third item', async () => {
    await userEvent.click(thirdItem);

    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
  });
});
