import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../../-shared';

describe('Select with `ArrowLeft`', () => {
  const { tabs } = createTabs();
  const { firstItem, secondLastItem, thirdLastItem, lastItem } = getTabItems(tabs);

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowUp` at first item does nothing', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(lastItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.slice(0, -1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.element(secondLastItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `ArrowUp` key to activate third last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.element(thirdLastItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.filter((_, idx) => idx !== tabs.items.indexOf(thirdLastItem))) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });
});

describe('select with `ArrowLeft`, skipping disabled items', () => {
  const { tabs } = createTabs();
  const { firstItem, fourthLastItem, secondLastItem, thirdLastItem, lastItem } = getTabItems(tabs);

  thirdLastItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.element(lastItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.slice(0, -1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `ArrowLeft` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.element(secondLastItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `ArrowLeft` key to activate fourth last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.element(fourthLastItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.filter((_, idx) => idx !== tabs.items.indexOf(fourthLastItem))) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });
});
