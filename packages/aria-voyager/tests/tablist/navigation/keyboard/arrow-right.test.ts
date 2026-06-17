import { expect, test } from 'vitest';

import { createTabs, getTabItems } from '#tests/tablist/-shared';

import { fireKey } from '#tests/test-support/events';

test('Navigate with `ArrowRight`', async ({ annotate }) => {
  const { tablist, tabs } = createTabs();
  const { firstItem, secondItem, thirdItem, lastItem } = getTabItems(tabs);

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  expect(tabs.activeItem).toBeTruthy();

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `ArrowRight` key to activate second item');
  await fireKey(tablist, 'ArrowRight');

  await expect.element(secondItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowRight` key to activate third item');
  await fireKey(tablist, 'ArrowRight');

  await expect.element(thirdItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await expect.poll(() => expect.element(item).toHaveAttribute('tabindex', '-1'));
  }

  await annotate('use `ArrowRight` key at the last item does nothing');
  await fireKey(tablist, 'End');
  await fireKey(tablist, 'ArrowRight');

  await expect.element(lastItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.slice(0, -1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});

test('navigate with `ArrowRight`, skipping disabled items', async ({ annotate }) => {
  const { tablist, tabs } = createTabs();
  const { firstItem, secondItem, thirdItem, fourthItem } = getTabItems(tabs);

  thirdItem.setAttribute('aria-disabled', 'true');

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  expect(tabs.activeItem).toBeTruthy();

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `ArrowRight` key to activate second item');
  await fireKey(tablist, 'ArrowRight');

  await expect.element(secondItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowRight` key to activate fourth item');
  await fireKey(tablist, 'ArrowRight');

  await expect.element(fourthItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== 3)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});
