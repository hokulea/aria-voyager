import { describe, expect, test } from 'vitest';

import { Tablist } from '#src';
import { createTabs, getTabItems } from '#tests/tablist/-shared';

test('renders', () => {
  const { tabs } = createTabs();

  expect(tabs.items.length).toBe(5);
});

describe('setup', () => {
  test('has menu role', async () => {
    const { tablist } = createTabs();

    await expect.element(tablist).toHaveAttribute('role', 'tablist');
  });

  test('sets tabindex on the first item', async () => {
    const { tabs } = createTabs();

    const { firstItem } = getTabItems(tabs);

    await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  });

  test('items have tabindex', async () => {
    const { tabs } = createTabs();

    for (const item of tabs.items) {
      await expect.element(item).toHaveAttribute('tabindex');
    }
  });
});

describe('disabled', () => {
  test('focus does not work', async () => {
    const { tablist } = createTabs();

    tablist.setAttribute('aria-disabled', 'true');

    const tabs = new Tablist(tablist);

    for (const item of tabs.items) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});
