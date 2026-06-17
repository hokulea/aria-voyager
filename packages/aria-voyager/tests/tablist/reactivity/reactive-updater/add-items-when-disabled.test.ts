import { describe, expect, test } from 'vitest';

import { ReactiveUpdateStrategy } from '#src';
import { appendTab, getItems } from '#tests/components/tabs';
import { setupTabs } from '#tests/tablist/-shared';

describe('add items when disabled', () => {
  const updater = new ReactiveUpdateStrategy();
  const ctx = setupTabs({ updater, tabCount: 0 });

  test('add items when disabled', () => {
    ctx.tablist.setAttribute('aria-disabled', 'true');

    updater.updateOptions();

    appendTab(ctx.container, 'Grapefruit', 'For summer');
    appendTab(ctx.container, 'Apple', 'With cinamon');
    appendTab(ctx.container, 'Banana', 'For Smoothie');

    const [firstItem] = getItems(ctx.tablist);

    firstItem.setAttribute('aria-selected', 'true');

    updater.updateItems();
    updater.updateSelection();

    for (const tab of ctx.tabs.items) expect(tab).toHaveAttribute('tabindex', '-1');

    expect(ctx.tabs.selection).toEqual([firstItem]);
  });
});
