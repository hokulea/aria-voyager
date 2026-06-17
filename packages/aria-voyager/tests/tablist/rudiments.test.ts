import { expect, test } from 'vitest';

import { Tablist } from '#src';
import { createTabs, getTabItems } from '#tests/tablist/-shared';

test('renders', () => {
  const { tabs } = createTabs();

  expect(tabs.items.length).toBe(5);
});

test('setup', async ({ annotate }) => {
  const { tablist, tabs } = createTabs();
  const { firstItem } = getTabItems(tabs);

  await expect.element(tablist).toHaveAttribute('role', 'tablist');

  await annotate('sets tabindex on the first item');
  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  await annotate('items have tabindex');

  for (const item of tabs.items) {
    await expect.element(item).toHaveAttribute('tabindex');
  }
});

test('disabled', async () => {
  const { tablist } = createTabs();

  tablist.setAttribute('aria-disabled', 'true');

  const tabs = new Tablist(tablist);

  for (const item of tabs.items) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});
