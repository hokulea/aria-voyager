import { describe, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

import { appendTab, getItems } from '#tests/components/tabs';
import { createTabs, getTabItems } from '#tests/tablist/-shared';

describe('DOM Observer', () => {
  const { container, tablist, tabs } = createTabs();
  const { firstItem, secondItem } = getTabItems(tabs);

  test('reads elements on appending', async () => {
    appendTab(container, 'Grapefruit', 'For summer');

    await vi.waitUntil(() => getItems(tablist).length === 6);

    expect(tabs.items.length).toBe(6);
  });

  test('reads selection on external update', async () => {
    expect(tabs.selection[0]).toBe(firstItem);

    firstItem.removeAttribute('aria-selected');
    secondItem.setAttribute('aria-selected', 'true');

    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');

    expect(tabs.selection[0]).toBe(secondItem);
  });

  test('removes items that contain selection', async () => {
    expect(tabs.selection.length).toBe(1);
    expect(tabs.items.length).toBe(6);

    secondItem.remove();

    await vi.waitUntil(() => getItems(tablist).length === 5);

    expect(tabs.items.length).toBe(5);
    expect(tabs.selection.length).toBe(1);
    expect(tabs.selection[0]).toBe(firstItem);
  });

  describe('read options', () => {
    test('detects vertical orientation', async () => {
      expect(tabs.options.orientation).toBe('horizontal');

      tablist.setAttribute('aria-orientation', 'vertical');

      await expect.element(tablist).toHaveAttribute('aria-orientation', 'vertical');

      expect(tabs.options.orientation).toBe('vertical');
    });

    test('detects horizontal orientation', async () => {
      expect(tabs.options.orientation).toBe('vertical');

      tablist.removeAttribute('aria-orientation');

      await expect.element(tablist).not.toHaveAttribute('aria-orientation');

      expect(tabs.options.orientation).toBe('horizontal');
    });

    test('sets tabindex to -1 when the aria-disabled is `true`', async () => {
      await userEvent.click(firstItem);

      await expect.element(firstItem).toHaveAttribute('tabindex', '0');

      tablist.setAttribute('aria-disabled', 'true');

      await expect.element(tablist).toHaveAttribute('aria-disabled', 'true');

      for (const item of tabs.items) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    });

    test('re-sets tabindex to 0 when the aria-disabled is removed', async () => {
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
  });
});
