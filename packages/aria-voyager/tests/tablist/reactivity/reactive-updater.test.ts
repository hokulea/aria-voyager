import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { ReactiveUpdateStrategy } from '#src';
import { appendTab, removeTab } from '#tests/components/tabs';
import { createTabs, getTabItems } from '#tests/tablist/-shared';

test('Reactive Updater', async ({ annotate }) => {
  const updater = new ReactiveUpdateStrategy();
  const { container, tablist, tabs } = createTabs({ updater });
  const { firstItem, secondItem } = getTabItems(tabs);

  expect(tabs.items.length).toBe(5);

  await annotate('reads elements on appending');
  appendTab(container, 'Grapefruit', 'for summer');

  updater.updateItems();

  expect(tabs.items.length).toBe(6);

  await annotate('reads selection on external update');

  const focusDecoy = document.createElement('button');

  document.body.append(focusDecoy);
  focusDecoy.focus();

  expect(tabs.selection[0]).toBe(firstItem);
  expect(secondItem).toHaveAttribute('tabindex', '-1');

  document.body.focus();

  firstItem.removeAttribute('aria-selected');
  secondItem.setAttribute('aria-selected', 'true');

  updater.updateSelection();

  expect(tabs.selection[0]).toBe(secondItem);
  expect(secondItem).toHaveAttribute('tabindex', '0');

  await annotate('detects vertical orientation');
  expect(tabs.options.orientation).toBe('horizontal');

  tablist.setAttribute('aria-orientation', 'vertical');

  updater.updateOptions();

  expect(tabs.options.orientation).toBe('vertical');

  await annotate('detects horizontal orientation');
  expect(tabs.options.orientation).toBe('vertical');

  tablist.removeAttribute('aria-orientation');

  updater.updateOptions();

  expect(tabs.options.orientation).toBe('horizontal');

  await annotate('sets tabindex to -1 when the aria-disabled is `true`');
  await userEvent.click(firstItem);

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  tablist.setAttribute('aria-disabled', 'true');

  updater.updateOptions();

  for (const item of tabs.items) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('re-sets tabindex to 0 when the aria-disabled is removed');

  for (const item of tabs.items) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  tablist.removeAttribute('aria-disabled');

  updater.updateOptions();

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('adding items to a disabled tablist will receive tabindex -1');

  const { lastItem, secondLastItem } = {
    lastItem: tabs.items.at(-1) as HTMLElement,
    secondLastItem: tabs.items.at(-2) as HTMLElement
  };

  removeTab(lastItem);
  removeTab(secondLastItem);

  tablist.setAttribute('aria-disabled', 'true');
  updater.updateOptions();

  for (const item of tabs.items) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  appendTab(container, 'Tab 4', 'Content 4');
  appendTab(container, 'Tab 5', 'Content 5');

  firstItem.setAttribute('aria-selected', 'false');
  lastItem.setAttribute('aria-selected', 'true');

  updater.updateSelection();

  updater.updateItems();

  for (const item of tabs.items) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});
