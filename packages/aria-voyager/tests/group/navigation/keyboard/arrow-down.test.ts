import { expect, test } from 'vitest';

import { createButtonGroup, getGroupItems } from '#tests/group/-shared';

import { fireKey } from '#tests/test-support/events';

test('Navigate with `ArrowDown`', async ({ annotate }) => {
  const { container, group } = createButtonGroup();
  const { firstItem, secondItem, thirdItem, lastItem } = getGroupItems(group);

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `ArrowDown` key to activate second item');
  await fireKey(container, 'ArrowDown');

  await expect.element(secondItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.filter((_, idx) => idx !== 1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowDown` key to activate third item');
  await fireKey(container, 'ArrowDown');

  await expect.element(thirdItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.filter((_, idx) => idx !== 2)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowDown` key at the last item does nothing');
  await fireKey(container, 'End');
  await fireKey(container, 'ArrowDown');

  await expect.element(lastItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.slice(0, -1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});

test('navigate with `ArrowDown`, skipping disabled items', async ({ annotate }) => {
  const { container, group } = createButtonGroup();
  const { firstItem, secondItem, thirdItem, fourthItem } = getGroupItems(group);

  thirdItem.setAttribute('aria-disabled', 'true');

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `ArrowDown` key to activate second item');
  await fireKey(container, 'ArrowDown');

  await expect.element(secondItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.filter((_, idx) => idx !== 1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowDown` key to activate fourth item');
  await fireKey(container, 'ArrowDown');

  await expect.element(fourthItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.filter((_, idx) => idx !== 3)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});
