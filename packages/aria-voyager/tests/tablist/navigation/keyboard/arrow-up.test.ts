import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { createTabs, getTabItems } from '#tests/tablist/-shared';

test('Navigate with `ArrowUp`', async ({ annotate }) => {
  const { tablist, tabs } = createTabs();
  const { firstItem, lastItem, secondLastItem, thirdLastItem } = getTabItems(tabs);

  tablist.setAttribute('aria-orientation', 'vertical');

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  expect(tabs.activeItem).toBeTruthy();

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `ArrowUp` at first item does nothing');
  await userEvent.keyboard('{ArrowUp}');

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `END` to jump to the last item');
  await userEvent.keyboard('{End}');

  await expect.element(lastItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.slice(0, -1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowUp` key to activate second last item');
  await userEvent.keyboard('{ArrowUp}');

  await expect.element(secondLastItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowUp` key to activate third last item');
  await userEvent.keyboard('{ArrowUp}');

  await expect.element(thirdLastItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== tabs.items.indexOf(thirdLastItem))) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});

test('navigate with `ArrowUp`, skipping disabled items', async ({ annotate }) => {
  const { tablist, tabs } = createTabs();
  const { firstItem, lastItem, secondLastItem, thirdLastItem, fourthLastItem } = getTabItems(tabs);

  tablist.setAttribute('aria-orientation', 'vertical');
  thirdLastItem.setAttribute('aria-disabled', 'true');

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  expect(tabs.activeItem).toBeTruthy();

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `END` to jump to the last item');
  await userEvent.keyboard('{End}');

  await expect.element(lastItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.slice(0, -1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowUp` key to activate second last item');
  await userEvent.keyboard('{ArrowUp}');

  await expect.element(secondLastItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowUp` key to activate fourth last item');
  await userEvent.keyboard('{ArrowUp}');

  await expect.element(fourthLastItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== tabs.items.indexOf(fourthLastItem))) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});
