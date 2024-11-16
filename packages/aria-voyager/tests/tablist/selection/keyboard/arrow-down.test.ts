import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../../-shared';

describe('select with `ArrowDown`', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, secondItem, thirdItem, lastItem } = getTabItems(tabs);

  tablist.setAttribute('aria-orientation', 'vertical');

  test('start', () => {
    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected'))).toBeFalsy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(
      tabs.items.filter((_, idx) => idx !== 1).every((item) => item.hasAttribute('aria-selected'))
    ).toBeFalsy();
  });

  test('use `ArrowDown` key to activate third item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
    expect(
      tabs.items.filter((_, idx) => idx !== 2).every((item) => item.hasAttribute('aria-selected'))
    ).toBeFalsy();
  });

  test('use `ArrowDown` key at the last item does nothing', async () => {
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{ArrowDown}');

    expect(lastItem.getAttribute('aria-selected')).toBe('true');
    expect(tabs.items.slice(0, -1).every((item) => item.hasAttribute('aria-selected'))).toBeFalsy();
  });
});

describe('select with `ArrowDown`, skipping disabled items', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, secondItem, thirdItem, fourthItem } = getTabItems(tabs);

  tablist.setAttribute('aria-orientation', 'vertical');
  thirdItem.setAttribute('aria-disabled', 'true');

  test('start', () => {
    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected'))).toBeFalsy();
    expect(tabs.activeItem).toBeTruthy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(
      tabs.items.filter((_, idx) => idx !== 1).every((item) => item.hasAttribute('aria-selected'))
    ).toBeFalsy();
  });

  test('use `ArrowDown` key to activate fourth item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    expect(fourthItem.getAttribute('aria-selected')).toBe('true');
    expect(
      tabs.items.filter((_, idx) => idx !== 3).every((item) => item.hasAttribute('aria-selected'))
    ).toBeFalsy();
  });
});
