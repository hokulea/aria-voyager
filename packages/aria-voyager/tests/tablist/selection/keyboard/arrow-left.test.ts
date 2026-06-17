import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { createTabs, getTabItems } from '#tests/tablist/-shared';

test('Select with `ArrowLeft`', async ({ annotate }) => {
  const { tabs } = createTabs();
  const { firstItem, lastItem, secondLastItem, thirdLastItem } = getTabItems(tabs);

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `ArrowUp` at first item does nothing');
  await userEvent.keyboard('{ArrowLeft}');

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  await annotate('use `END` to jump to the last item');
  await userEvent.keyboard('{End}');

  await expect.element(lastItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.slice(0, -1)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  await annotate('use `ArrowUp` key to activate second last item');
  await userEvent.keyboard('{ArrowLeft}');

  await expect.element(secondLastItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  await annotate('use `ArrowUp` key to activate third last item');
  await userEvent.keyboard('{ArrowLeft}');

  await expect.element(thirdLastItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.filter((_, idx) => idx !== tabs.items.indexOf(thirdLastItem))) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }
});

test('select with `ArrowLeft`, skipping disabled items', async ({ annotate }) => {
  const { tabs } = createTabs();
  const { firstItem, lastItem, secondLastItem, thirdLastItem, fourthLastItem } = getTabItems(tabs);

  thirdLastItem.setAttribute('aria-disabled', 'true');

  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `END` to jump to the last item');
  await userEvent.keyboard('{End}');

  await expect.element(lastItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.slice(0, -1)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  await annotate('use `ArrowLeft` key to activate second last item');
  await userEvent.keyboard('{ArrowLeft}');

  await expect.element(secondLastItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  await annotate('use `ArrowLeft` key to activate fourth last item');
  await userEvent.keyboard('{ArrowLeft}');

  await expect.element(fourthLastItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.filter((_, idx) => idx !== tabs.items.indexOf(fourthLastItem))) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }
});
