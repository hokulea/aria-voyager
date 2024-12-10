import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { ReactiveUpdateStrategy } from '../../../src';
import { appendTab } from '../../components/tabs';
import { createTabs, getTabItems } from '../-shared';

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

      expect(firstItem.getAttribute('tabindex')).toBe('0');

      tablist.setAttribute('aria-disabled', 'true');

      updater.updateOptions();

      expect(
        tabs.items.map((item) => item.getAttribute('tabindex') === '-1').every(Boolean)
      ).toBeTruthy();
    });

    test('re-sets tabindex to 0 when the aria-disabled is removed', () => {
      expect(
        tabs.items.map((item) => item.getAttribute('tabindex') === '-1').every(Boolean)
      ).toBeTruthy();

      tablist.removeAttribute('aria-disabled');

      updater.updateOptions();

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
