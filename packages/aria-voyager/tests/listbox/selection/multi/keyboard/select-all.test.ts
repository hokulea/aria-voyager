import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createMultiSelectListWithFruits, getItems } from '#tests/listbox/-shared';

import { fireKey } from '#tests/test-support/events';

test('use `Meta` + `A` key to select all items', async () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);

  for (const item of listbox.items) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  list.focus();
  await fireKey(list, 'a', { metaKey: true });

  for (const item of listbox.items) {
    await expect.element(item).toHaveAttribute('aria-selected', 'true');
  }
});

test('use `Meta` + `A` key to select all items, skip disabled', async () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  secondItem.setAttribute('aria-disabled', 'true');

  for (const item of listbox.items) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  list.focus();
  await fireKey(list, 'a', { metaKey: true });

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
});
