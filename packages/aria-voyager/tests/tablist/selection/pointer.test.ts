import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { createTabs, getTabItems } from '#tests/tablist/-shared';

describe('Use pointer to select items', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, secondItem, thirdItem } = getTabItems(tabs);

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');
    await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  // seems like, when clicking the tablist with playwright, then it also clicks
  // the last button in there. This behavior is different, than in a browser
  test.skip('select not an item does nothing', async () => {
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
