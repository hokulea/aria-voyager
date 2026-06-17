import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

import { firePointer } from '#tests/test-support/events';

test('With Pointer', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await annotate('select second item');
  await firePointer(secondItem);
  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await annotate('select third item');
  await firePointer(thirdItem);
  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
});
