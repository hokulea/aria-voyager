import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createMultiSelectListWithFruits, getItems } from '#tests/listbox/-shared';

import { fireKey } from '#tests/test-support/events';

test('Toggle selection with `Space` key', async ({ annotate }) => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem } = getItems(listbox);

  await annotate('focus list');
  list.focus();
  await expect.element(firstItem).not.toHaveAttribute('aria-selected');

  await annotate('use `Space` to select active item');
  await fireKey(list, ' ');
  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');

  await annotate('use `Space` to deselect active item');
  await fireKey(list, ' ');
  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
});
