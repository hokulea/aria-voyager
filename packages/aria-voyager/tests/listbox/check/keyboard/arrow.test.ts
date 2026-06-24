import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

import { fireKey, firePointer, focusControl } from '#tests/test-support/events';

test('ArrowDown without Shift clears range', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { behavior: { check: true } });
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await focusControl(list);
  await fireKey(list, 'ArrowDown', { shiftKey: true });

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');

  await annotate('ArrowDown without Shift clears range');
  await fireKey(list, 'ArrowDown');

  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(thirdItem).toHaveAttribute('aria-current', 'true');
});

test('ArrowDown does not toggle checked state', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { behavior: { check: true } });
  const { firstItem, secondItem } = getItems(listbox);

  await focusControl(list);
  await firePointer(firstItem);

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');

  await annotate('ArrowDown moves focus without toggling check');
  await fireKey(list, 'ArrowDown');

  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');
});

test('Shift+ArrowDown extends range without toggling check', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { behavior: { check: true } });
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await focusControl(list);
  await fireKey(list, 'ArrowDown', { shiftKey: true });

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'false');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');

  await annotate('Shift+ArrowDown extends range, no check toggle');
  await fireKey(list, 'ArrowDown', { shiftKey: true });

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'false');
});
