import { expect, test } from 'vitest';

import { ReactiveUpdateStrategy, Tablist } from '#src';
import { appendTab, createTabElement, getItems } from '#tests/components/tabs';

test('add items when disabled', () => {
  const updater = new ReactiveUpdateStrategy();
  const { container, tablist } = createTabElement(document.body);

  tablist.setAttribute('aria-disabled', 'true');

  const tabs = new Tablist(tablist, { updater });

  updater.updateOptions();

  appendTab(container, 'Grapefruit', 'For summer');
  appendTab(container, 'Apple', 'With cinamon');
  appendTab(container, 'Banana', 'For Smoothie');

  const [firstItem] = getItems(tablist);

  firstItem.setAttribute('aria-selected', 'true');

  updater.updateItems();
  updater.updateSelection();

  for (const tab of tabs.items) expect(tab).toHaveAttribute('tabindex', '-1');

  expect(tabs.selection).toEqual([firstItem]);
});
