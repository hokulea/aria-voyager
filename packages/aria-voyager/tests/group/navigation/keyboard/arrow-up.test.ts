import { expect, test } from 'vitest';

import { createButtonGroup, getGroupItems } from '#tests/group/-shared';

import { fireKey } from '#tests/test-support/events';

test('Navigate with `ArrowUp`', async ({ annotate }) => {
  const { container, group } = createButtonGroup();
  const { firstItem, secondLastItem, thirdLastItem, lastItem } = getGroupItems(group);

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `ArrowUp` at first item does nothing');
  await fireKey(container, 'ArrowUp');

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `End` to jump to the last item');
  await fireKey(container, 'End');

  await expect.element(lastItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.slice(0, -1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowUp` key to activate second last item');
  await fireKey(container, 'ArrowUp');

  await expect.element(secondLastItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.filter((_, idx) => idx !== group.items.indexOf(secondLastItem))) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowUp` key to activate third last item');
  await fireKey(container, 'ArrowUp');

  await expect.element(thirdLastItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.filter((_, idx) => idx !== group.items.indexOf(thirdLastItem))) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});

test('navigate with `ArrowUp`, skipping disabled items', async ({ annotate }) => {
  const { container, group } = createButtonGroup();
  const { firstItem, fourthLastItem, secondLastItem, thirdLastItem, lastItem } =
    getGroupItems(group);

  thirdLastItem.setAttribute('aria-disabled', 'true');

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `End` to jump to the last item');
  await fireKey(container, 'End');

  await expect.element(lastItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.slice(0, -1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowUp` key to activate second last item');
  await fireKey(container, 'ArrowUp');

  await expect.element(secondLastItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.filter((_, idx) => idx !== group.items.indexOf(secondLastItem))) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowUp` key to activate fourth last item');
  await fireKey(container, 'ArrowUp');

  await expect.element(fourthLastItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.filter((_, idx) => idx !== group.items.indexOf(fourthLastItem))) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});
