import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Listbox } from '#src';
import { createMultiSelectListWithFruits } from '#tests/listbox/-shared';

test('use `Meta` + `A` key to select all items', async () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);

  for (const item of listbox.items) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  list.focus();
  await userEvent.keyboard('{Meta>}a');

  for (const item of listbox.items) {
    await expect.element(item).toHaveAttribute('aria-selected', 'true');
  }
});
