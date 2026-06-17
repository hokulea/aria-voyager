import { expect, test } from 'vitest';

import { createTabs, getTabItems } from '#tests/tablist/-shared';

import { fireKey } from '#tests/test-support/events';

test('Select with `ArrowDown`', async ({ annotate }) => {
  const { tablist, tabs } = createTabs();
  const { firstItem, secondItem, thirdItem, lastItem } = getTabItems(tabs);

  tablist.setAttribute('aria-orientation', 'vertical');

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `ArrowDown` key to activate second item');
  await fireKey(tablist, 'ArrowDown');

  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  await annotate('use `ArrowDown` key to activate third item');
  await fireKey(tablist, 'ArrowDown');

  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.filter((_, idx) => idx !== 2)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  await annotate('use `ArrowDown` key at the last item does nothing');
  await fireKey(tablist, 'End');
  await fireKey(tablist, 'ArrowDown');

  await expect.element(lastItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.slice(0, -1)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }
});

test('select with `ArrowDown`, skipping disabled items', async ({ annotate }) => {
  const { tablist, tabs } = createTabs();
  const { firstItem, secondItem, thirdItem, fourthItem } = getTabItems(tabs);

  tablist.setAttribute('aria-orientation', 'vertical');
  thirdItem.setAttribute('aria-disabled', 'true');

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  expect(tabs.activeItem).toBeTruthy();

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `ArrowDown` key to activate second item');
  await fireKey(tablist, 'ArrowDown');

  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  await annotate('use `ArrowDown` key to activate fourth item');
  await fireKey(tablist, 'ArrowDown');

  await expect.element(fourthItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.filter((_, idx) => idx !== 3)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }
});
