import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createMultiSelectListWithFruits } from '#tests/listbox/-shared';

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
