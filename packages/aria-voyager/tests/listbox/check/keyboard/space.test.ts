import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

import { fireKey, focusControl } from '#tests/test-support/events';

test('Space with no selection toggles active item', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { check: true });
  const { firstItem } = getItems(listbox);

  await focusControl(list);

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'false');

  await fireKey(list, ' ');

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');

  await annotate('Space again unchecks');
  await fireKey(list, ' ');

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'false');
});

test('Space with selection batch-toggles range', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { check: true });
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await focusControl(list);
  await fireKey(list, 'ArrowDown', { shiftKey: true });

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(thirdItem).not.toHaveAttribute('aria-selected');

  await annotate('Space batch-toggles the range');
  await fireKey(list, ' ');

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'false');

  await annotate('Space again unchecks all');
  await fireKey(list, ' ');

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'false');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');
});

test('Space preserves aria-selected range', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { check: true });
  const { firstItem, secondItem } = getItems(listbox);

  await focusControl(list);
  await fireKey(list, 'ArrowDown', { shiftKey: true });

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');

  await annotate('Space does not change selection');
  await fireKey(list, ' ');

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
});
