import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createMultiSelectListWithFruits, getItems } from '#tests/listbox/-shared';

import { fireKey, firePointer } from '#tests/test-support/events';

test('select from third to first item with `Home` and `Shift` key', async () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await firePointer(thirdItem);

  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');

  await fireKey(list, 'Home', { shiftKey: true });

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
});

test('Select from last to first with `Home` and `Shift`, skip disabled item', async () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  secondItem.setAttribute('aria-disabled', 'true');

  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await firePointer(thirdItem);

  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');

  await fireKey(list, 'Home', { shiftKey: true });

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
});
