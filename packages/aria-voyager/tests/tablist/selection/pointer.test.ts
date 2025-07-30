import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../-shared';

describe('Use pointer to select items', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, secondItem, thirdItem } = getTabItems(tabs);

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('select not an item does nothing', async () => {
    await userEvent.click(tablist);
    expect(tabs.activeItem).toBeTruthy();

    for (const item of tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('select second item', async () => {
    await userEvent.click(secondItem);

    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('select third item', async () => {
    await userEvent.click(thirdItem);

    await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.filter((_, idx) => idx !== 2)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });
});
