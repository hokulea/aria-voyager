import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

import { fireKey, firePointer, focusControl } from '#tests/test-support/events';

test('Plain click toggles aria-checked', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { behavior: { check: true } });
  const { firstItem } = getItems(listbox);

  await annotate('click unchecked item');
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'false');
  await expect.element(firstItem).not.toHaveAttribute('aria-selected');

  await firePointer(firstItem);

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(firstItem).not.toHaveAttribute('aria-selected');

  await annotate('click checked item again');
  await firePointer(firstItem);

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'false');
  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
});

test('Plain click clears aria-selected range', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { behavior: { check: true } });
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await annotate('establish range across first and second');
  await focusControl(list);
  await fireKey(list, 'ArrowDown', { shiftKey: true });

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');

  await annotate('click third item clears range');
  await firePointer(thirdItem);

  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
});

test('Multiple clicks toggle independently', async () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { behavior: { check: true } });
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await firePointer(firstItem);
  await firePointer(thirdItem);

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'true');
});

test('Shift+Click batch-toggles range, none checked -> all checked', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { behavior: { check: true } });
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await annotate('establish range');
  await focusControl(list);
  await fireKey(list, 'ArrowDown', { shiftKey: true });

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'false');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');

  await annotate('Shift+Click third item batch-toggles range');
  await firePointer(thirdItem, { bubbles: true, shiftKey: true });

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'true');
});

test('Shift+Click batch-toggles range, one checked -> all unchecked', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { behavior: { check: true } });
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await annotate('check first item and establish range');
  await firePointer(firstItem);
  await focusControl(list);
  await fireKey(list, 'ArrowDown', { shiftKey: true });

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');
  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');

  await annotate('Shift+Click third item batch-toggles all unchecked');
  await firePointer(thirdItem, { bubbles: true, shiftKey: true });

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'false');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'false');
});

test('Meta+Click toggles both aria-selected and aria-checked', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { behavior: { check: true } });
  const { secondItem } = getItems(listbox);

  await focusControl(list);

  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');

  await annotate('Meta+Click second item adds to range and checks it');
  await firePointer(secondItem, { bubbles: true, metaKey: true });

  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'true');
});

test('Click on disabled item does nothing', async ({ annotate }) => {
  const list = createListWithFruits();
  const listbox = new Listbox(list, { behavior: { check: true } });
  const { secondItem } = getItems(listbox);

  secondItem.setAttribute('aria-disabled', 'true');

  await annotate('click disabled item');
  await firePointer(secondItem);

  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');
  await expect.element(secondItem).not.toHaveAttribute('aria-selected');
});
