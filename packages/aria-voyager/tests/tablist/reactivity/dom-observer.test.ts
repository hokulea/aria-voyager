import { userEvent } from '@vitest/browser/context';
import { describe, expect, test, vi } from 'vitest';

import { appendTab, getItems } from '../../components/tabs';
import { createTabs, getTabItems } from '../-shared';

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

    await vi.waitUntil(() => secondItem.getAttribute('aria-selected') === 'true');

    expect(tabs.selection[0]).toBe(secondItem);
  });

  test('removes items that contain selection', async () => {
    expect(tabs.selection.length).toBe(1);
    expect(tabs.items.length).toBe(6);

    tablist.removeChild(secondItem);

    await vi.waitUntil(() => getItems(tablist).length === 5);

    expect(tabs.items.length).toBe(5);
    expect(tabs.selection.length).toBe(1);
    expect(tabs.selection[0]).toBe(firstItem);
  });

  describe('read options', () => {
    test('detects vertical orientation', async () => {
      expect(tabs.options.orientation).toBe('horizontal');

      tablist.setAttribute('aria-orientation', 'vertical');

      await vi.waitUntil(() => tablist.getAttribute('aria-orientation') === 'vertical');

      expect(tabs.options.orientation).toBe('vertical');
    });

    test('detects horizontal orientation', async () => {
      expect(tabs.options.orientation).toBe('vertical');

      tablist.removeAttribute('aria-orientation');

      await vi.waitUntil(() => !tablist.hasAttribute('aria-orientation'));

      expect(tabs.options.orientation).toBe('horizontal');
    });

    test('sets tabindex to -1 when the aria-disabled is `true`', async () => {
      await userEvent.click(firstItem);

      expect(firstItem.getAttribute('tabindex')).toBe('0');

      tablist.setAttribute('aria-disabled', 'true');

      await vi.waitUntil(() => tablist.getAttribute('aria-disabled') === 'true');

      expect(
        tabs.items.map((item) => item.getAttribute('tabindex') === '-1').every(Boolean)
      ).toBeTruthy();
    });

    test('re-sets tabindex to 0 when the aria-disabled is removed', async () => {
      expect(
        tabs.items.map((item) => item.getAttribute('tabindex') === '-1').every(Boolean)
      ).toBeTruthy();

      tablist.removeAttribute('aria-disabled');

      await vi.waitUntil(() => tablist.getAttribute('aria-disabled') === null);

      expect(firstItem.getAttribute('tabindex')).toBe('0');
      expect(
        tabs.items
          .slice(1)
          .map((item) => item.getAttribute('tabindex') === '-1')
          .every(Boolean)
      ).toBeTruthy();
    });
  });
});
