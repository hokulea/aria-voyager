import { describe, expect, test } from 'vitest';

import { Tablist } from '../../src';
import { createTabs, getTabItems } from './-shared';

test('renders', () => {
  const { tabs } = createTabs();

  expect(tabs.items.length).toBe(5);
});

describe('setup', () => {
  test('has menu role', () => {
    const { tablist } = createTabs();

    await expect.element(tablist).toHaveAttribute('role', 'tablist');
  });

  test('sets tabindex on the first item', () => {
    const { tabs } = createTabs();

    const { firstItem } = getTabItems(tabs);

    await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  });

  test('items have tabindex', () => {
    const { tabs } = createTabs();

    expect(tabs.items.map((item) => item.getAttribute('tabindex')).every(Boolean)).toBeTruthy();
  });
});

describe('disabled', () => {
  test('focus does not work', () => {
    const { tablist } = createTabs();

    tablist.setAttribute('aria-disabled', 'true');

    const tabs = new Tablist(tablist);

    expect(
      tabs.items.map((item) => item.getAttribute('tabindex') === '-1').every(Boolean)
    ).toBeTruthy();
  });
});
