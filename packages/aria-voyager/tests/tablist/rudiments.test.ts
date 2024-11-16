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

    expect(tablist.getAttribute('role')).toBe('tablist');
  });

  test('sets tabindex on the first item', () => {
    const { tabs } = createTabs();

    const { firstItem } = getTabItems(tabs);

    expect(firstItem.getAttribute('tabindex')).toBe('0');
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
