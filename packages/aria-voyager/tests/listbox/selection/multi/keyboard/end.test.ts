import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createMultiSelectListWithFruits, getItems } from '#tests/listbox/-shared';

import { fireKey, firePointer } from '#tests/test-support/events';

test('Select from first to third item with `End` and `Shift` key', async () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await firePointer(firstItem);

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await fireKey(list, 'End', { shiftKey: true });

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
});

test('Select from first to last with `End` and `Shift`, skip disabled item', async () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  secondItem.setAttribute('aria-disabled', 'true');

  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await firePointer(firstItem);

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await fireKey(list, 'End', { shiftKey: true });

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
});
