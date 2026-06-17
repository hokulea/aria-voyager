import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import { appendTab, getItems } from '#tests/components/tabs';
import { createTabs, getTabItems } from '#tests/tablist/-shared';

test('DOM Observer', async ({ annotate }) => {
  const { container, tablist, tabs } = createTabs();
  const { firstItem, secondItem } = getTabItems(tabs);

  await annotate('reads elements on appending');
  appendTab(container, 'Grapefruit', 'For summer');

  await vi.waitUntil(() => getItems(tablist).length === 6);

  expect(tabs.items.length).toBe(6);

  await annotate('reads selection on external update');
  expect(tabs.selection[0]).toBe(firstItem);

  firstItem.removeAttribute('aria-selected');
  secondItem.setAttribute('aria-selected', 'true');

  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');

  expect(tabs.selection[0]).toBe(secondItem);

  await annotate('removes items that contain selection');
  expect(tabs.selection.length).toBe(1);
  expect(tabs.items.length).toBe(6);

  secondItem.remove();

  await vi.waitUntil(() => getItems(tablist).length === 5);

  expect(tabs.items.length).toBe(5);
  expect(tabs.selection.length).toBe(1);
  expect(tabs.selection[0]).toBe(firstItem);

  await annotate('detects vertical orientation');
  expect(tabs.options.orientation).toBe('horizontal');

  tablist.setAttribute('aria-orientation', 'vertical');

  await expect.element(tablist).toHaveAttribute('aria-orientation', 'vertical');

  expect(tabs.options.orientation).toBe('vertical');

  await annotate('detects horizontal orientation');
  expect(tabs.options.orientation).toBe('vertical');

  tablist.removeAttribute('aria-orientation');

  await expect.element(tablist).not.toHaveAttribute('aria-orientation');

  expect(tabs.options.orientation).toBe('horizontal');

  await annotate('sets tabindex to -1 when the aria-disabled is `true`');
  await userEvent.click(firstItem);

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  tablist.setAttribute('aria-disabled', 'true');

  await expect.element(tablist).toHaveAttribute('aria-disabled', 'true');

  for (const item of tabs.items) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('re-sets tabindex to 0 when the aria-disabled is removed');

  for (const item of tabs.items) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  tablist.removeAttribute('aria-disabled');

  await expect.element(tablist).not.toHaveAttribute('aria-disabled');

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});
