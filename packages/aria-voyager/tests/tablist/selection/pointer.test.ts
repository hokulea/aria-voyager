import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../-shared';

describe('Use pointer to select items', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, secondItem, thirdItem } = getTabItems(tabs);

  test('start', () => {
    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(tabs.items.slice(1).every((item) => item.getAttribute('aria-selected'))).toBeFalsy();
  });

  test('select not an item does nothing', async () => {
    await userEvent.click(tablist);
    expect(tabs.activeItem).toBeTruthy();

    expect(tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected'))).toBeFalsy();
  });

  test('select second item', async () => {
    await userEvent.click(secondItem);

    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(
      tabs.items.filter((_, idx) => idx !== 1).every((item) => item.hasAttribute('aria-selected'))
    ).toBeFalsy();
  });

  test('select third item', async () => {
    await userEvent.click(thirdItem);

    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
    expect(
      tabs.items.filter((_, idx) => idx !== 2).every((item) => item.hasAttribute('aria-selected'))
    ).toBeFalsy();
  });
});
