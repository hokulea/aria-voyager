import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { createTabs, getTabItems } from '#tests/tablist/-shared';

describe('Use pointer to activate items', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, secondItem, thirdItem } = getTabItems(tabs);

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');

    for (const item of tabs.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    expect(tabs.activeItem).toBeTruthy();
  });

  // does not run in CLI mode
  // update vitest and activate again
  test.skip('select not an item does nothing', async () => {
    await userEvent.click(tablist);

    expect(tabs.activeItem).toBeTruthy();

    for (const item of tabs.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('select second item', async () => {
    await userEvent.click(secondItem);

    await expect.element(secondItem).toHaveAttribute('tabindex', '0');

    for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('select third item', async () => {
    await userEvent.click(thirdItem);

    await expect.element(thirdItem).toHaveAttribute('tabindex', '0');

    for (const item of tabs.items.filter((_, idx) => idx !== 2)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});
