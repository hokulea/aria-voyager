import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createListWithFruits } from '#tests/listbox/-shared';

import { fireKey, focusControl } from '#tests/test-support/events';

test('Meta+A range-selects all items, does not toggle check', async () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { behavior: { check: true } });

  await focusControl(list);
  await fireKey(list, 'a', { metaKey: true });

  for (const item of listbox.items) {
    await expect.element(item).toHaveAttribute('aria-selected', 'true');
    await expect.element(item).toHaveAttribute('aria-checked', 'false');
  }
});

test('Space after Meta+A batch-toggles all', async () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { behavior: { check: true } });

  await focusControl(list);
  await fireKey(list, 'a', { metaKey: true });

  for (const item of listbox.items) {
    await expect.element(item).toHaveAttribute('aria-selected', 'true');
    await expect.element(item).toHaveAttribute('aria-checked', 'false');
  }

  await fireKey(list, ' ');

  for (const item of listbox.items) {
    await expect.element(item).toHaveAttribute('aria-checked', 'true');
  }
});
