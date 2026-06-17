import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { ReactiveUpdateStrategy } from '#src';
import { appendTab, removeTab } from '#tests/components/tabs';
import { setupTabs } from '#tests/tablist/-shared';

// simulating a framework with a reactive library
describe('Reactive Updater', () => {
  const updater = new ReactiveUpdateStrategy();
  const ctx = setupTabs({ updater });

  test('reads elements on appending', () => {
    expect(ctx.tabs.items.length).toBe(5);

    appendTab(ctx.container, 'Grapefruit', 'for summer');

    updater.updateItems();

    expect(ctx.tabs.items.length).toBe(6);
  });

  test('reads selection on external update', () => {
    const focusDecoy = document.createElement('button');

    document.body.append(focusDecoy);
    focusDecoy.focus();

    expect(ctx.tabs.selection[0]).toBe(ctx.firstItem);
    expect(ctx.secondItem).toHaveAttribute('tabindex', '-1');

    document.body.focus();

    ctx.firstItem.removeAttribute('aria-selected');
    ctx.secondItem.setAttribute('aria-selected', 'true');

    updater.updateSelection();

    expect(ctx.tabs.selection[0]).toBe(ctx.secondItem);
    expect(ctx.secondItem).toHaveAttribute('tabindex', '0');
  });

  describe('read options', () => {
    test('detects vertical orientation', () => {
      expect(ctx.tabs.options.orientation).toBe('horizontal');

      ctx.tablist.setAttribute('aria-orientation', 'vertical');

      updater.updateOptions();

      expect(ctx.tabs.options.orientation).toBe('vertical');
    });

    test('detects horizontal orientation', () => {
      expect(ctx.tabs.options.orientation).toBe('vertical');

      ctx.tablist.removeAttribute('aria-orientation');

      updater.updateOptions();

      expect(ctx.tabs.options.orientation).toBe('horizontal');
    });

    test('sets tabindex to -1 when the aria-disabled is `true`', async () => {
      await userEvent.click(ctx.firstItem);

      await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

      ctx.tablist.setAttribute('aria-disabled', 'true');

      updater.updateOptions();

      for (const item of ctx.tabs.items) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    });

    test('re-sets tabindex to 0 when the aria-disabled is removed', async () => {
      for (const item of ctx.tabs.items) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }

      ctx.tablist.removeAttribute('aria-disabled');

      updater.updateOptions();

      await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

      for (const item of ctx.tabs.items.slice(1)) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    });
  });

  describe('items', () => {
    test('adding items to a disabled tablist will receive tabindex -1', async () => {
      const { lastItem, secondLastItem } = {
        lastItem: ctx.lastItem,
        secondLastItem: ctx.secondLastItem
      };

      removeTab(lastItem);
      removeTab(secondLastItem);

      ctx.tablist.setAttribute('aria-disabled', 'true');
      updater.updateOptions();

      for (const item of ctx.tabs.items) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }

      appendTab(ctx.container, 'Tab 4', 'Content 4');
      appendTab(ctx.container, 'Tab 5', 'Content 5');

      ctx.firstItem.setAttribute('aria-selected', 'false');
      lastItem.setAttribute('aria-selected', 'true');

      updater.updateSelection();

      updater.updateItems();

      for (const item of ctx.tabs.items) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    });
  });
});
