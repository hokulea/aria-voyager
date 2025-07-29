import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../-shared';

describe('Use pointer to select items', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, secondItem, thirdItem } = getTabItems(tabs);

  test('start', async () => {
    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBe('true');
    await expect.poll(() => tabs.items.slice(1).every((item) => item.getAttribute('aria-selected'))).toBeFalsy();
  });

  test('select not an item does nothing', async () => {
    await userEvent.click(tablist);
    await expect.poll(() => tabs.activeItem).toBeTruthy();

    await expect.poll(() => tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected'))).toBeFalsy();
  });

  test('select second item', async () => {
    await userEvent.click(secondItem);

    await expect.poll(() => secondItem.getAttribute('aria-selected')).toBe('true');
    await expect.poll(() => tabs.items.filter((_, idx) => idx !== 1).every((item) => item.hasAttribute('aria-selected'))).toBeFalsy();
  });

  test('select third item', async () => {
    await userEvent.click(thirdItem);

    await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBe('true');
    await expect.poll(() => tabs.items.filter((_, idx) => idx !== 2).every((item) => item.hasAttribute('aria-selected'))).toBeFalsy();
  });
});
