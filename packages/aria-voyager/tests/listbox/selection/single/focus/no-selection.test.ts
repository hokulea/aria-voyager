import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

test('select first item when focus', async () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem } = getItems(listbox);

  list.focus();

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
});
