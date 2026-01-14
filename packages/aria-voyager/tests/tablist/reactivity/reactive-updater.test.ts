import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { ReactiveUpdateStrategy } from '#src';
import { appendTab, removeTab } from '#tests/components/tabs';
import { createTabs, getTabItems } from '#tests/tablist/-shared';

// simulating a framework with a reactive library
describe('Reactive Updater', () => {
  const updater = new ReactiveUpdateStrategy();

  const { container, tablist, tabs } = createTabs({
    updater
  });

  const { firstItem, secondItem } = getTabItems(tabs);

  test('reads elements on appending', () => {
    expect(tabs.items.length).toBe(5);

    appendTab(container, 'Grapefruit', 'for summer');

    updater.updateItems();

    expect(tabs.items.length).toBe(6);
  });

  test('reads selection on external update', () => {
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
  });

  describe('read options', () => {
    test('detects vertical orientation', () => {
      expect(tabs.options.orientation).toBe('horizontal');

      tablist.setAttribute('aria-orientation', 'vertical');

      updater.updateOptions();

      expect(tabs.options.orientation).toBe('vertical');
    });

    test('detects horizontal orientation', () => {
      expect(tabs.options.orientation).toBe('vertical');

      tablist.removeAttribute('aria-orientation');

      updater.updateOptions();

      expect(tabs.options.orientation).toBe('horizontal');
    });

    test('sets tabindex to -1 when the aria-disabled is `true`', async () => {
      await userEvent.click(firstItem);

      await expect.element(firstItem).toHaveAttribute('tabindex', '0');

      tablist.setAttribute('aria-disabled', 'true');

      updater.updateOptions();

      for (const item of tabs.items) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    });

    test('re-sets tabindex to 0 when the aria-disabled is removed', async () => {
      for (const item of tabs.items) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }

      tablist.removeAttribute('aria-disabled');

      updater.updateOptions();

      await expect.element(firstItem).toHaveAttribute('tabindex', '0');

      for (const item of tabs.items.slice(1)) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    });
  });

  describe('items', () => {
    test('adding items to a disabled tablist will receive tabindex -1', async () => {
      const { lastItem, secondLastItem } = getTabItems(tabs);

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
  });
});
