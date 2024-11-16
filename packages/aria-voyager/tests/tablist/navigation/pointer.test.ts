import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../-shared';

describe('use pointer to activate items', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, secondItem, thirdItem } = getTabItems(tabs);

  test('start', () => {
    expect(firstItem.getAttribute('tabindex')).toBe('0');
    expect(
      tabs.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
    expect(tabs.activeItem).toBeTruthy();
  });

  test('select not an item does nothing', async () => {
    await userEvent.click(tablist);

    expect(tabs.activeItem).toBeTruthy();
    expect(
      tabs.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('select second item', async () => {
    await userEvent.click(secondItem);

    expect(secondItem.getAttribute('tabindex')).toBe('0');
    expect(
      tabs.items
        .filter((_, idx) => idx !== 1)
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('select third item', async () => {
    await userEvent.click(thirdItem);

    expect(thirdItem.getAttribute('tabindex')).toBe('0');
    expect(
      tabs.items
        .filter((_, idx) => idx !== 2)
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });
});
