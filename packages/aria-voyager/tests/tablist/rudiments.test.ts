import { describe, expect, test } from 'vitest';

import { Tablist } from '../../src';
import { createTabs, getTabItems } from './-shared';

test('renders', () => {
  const { tabs } = createTabs();

  expect(tabs.items.length).toBe(5);
});

describe('setup', () => {
  test('has menu role', async () => {
    const { tablist } = createTabs();

    await expect.poll(() => expect.element(tablist)).toHaveAttribute('role', 'tablist');
  });

  test('sets tabindex on the first item', async () => {
    const { tabs } = createTabs();

    const { firstItem } = getTabItems(tabs);

    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('tabindex', '0');
  });

  test('items have tabindex', async () => {
    const { tabs } = createTabs();

    await expect
      .poll(() => tabs.items.map((item) => item.getAttribute('tabindex')).every(Boolean))
      .toBeTruthy();
  });
});

describe('disabled', () => {
  test('focus does not work', async () => {
    const { tablist } = createTabs();

    tablist.setAttribute('aria-disabled', 'true');

    const tabs = new Tablist(tablist);

    await expect
      .poll(() => tabs.items.map((item) => item.getAttribute('tabindex') === '-1').every(Boolean))
      .toBeTruthy();
  });
});
