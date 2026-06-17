import { expect, test } from 'vitest';

import { createTabs, getTabItems } from '#tests/tablist/-shared';

import { fireKey } from '#tests/test-support/events';

test('Navigate with `ArrowLeft`', async ({ annotate }) => {
  const { tablist, tabs } = createTabs();
  const { firstItem, lastItem, secondLastItem, thirdLastItem } = getTabItems(tabs);

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  expect(tabs.activeItem).toBeTruthy();

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `ArrowUp` at first item does nothing');
  await fireKey(tablist, 'ArrowLeft');

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `END` to jump to the last item');
  await fireKey(tablist, 'End');

  await expect.element(lastItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.slice(0, -1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowUp` key to activate second last item');
  await fireKey(tablist, 'ArrowLeft');

  await expect.element(secondLastItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowUp` key to activate third last item');
  await fireKey(tablist, 'ArrowLeft');

  await expect.element(thirdLastItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== tabs.items.indexOf(thirdLastItem))) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});

test('navigate with `ArrowLeft`, skipping disabled items', async ({ annotate }) => {
  const { tablist, tabs } = createTabs();
  const { firstItem, lastItem, secondLastItem, thirdLastItem, fourthLastItem } = getTabItems(tabs);

  thirdLastItem.setAttribute('aria-disabled', 'true');

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  expect(tabs.activeItem).toBeTruthy();

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `END` to jump to the last item');
  await fireKey(tablist, 'End');

  await expect.element(lastItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.slice(0, -1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowLeft` key to activate second last item');
  await fireKey(tablist, 'ArrowLeft');

  await expect.element(secondLastItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowLeft` key to activate fourth last item');
  await fireKey(tablist, 'ArrowLeft');

  await expect.element(fourthLastItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== tabs.items.indexOf(fourthLastItem))) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});
