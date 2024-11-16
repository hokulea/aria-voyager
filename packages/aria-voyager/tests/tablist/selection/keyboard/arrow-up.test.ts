import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../../-shared';

describe('select with `ArrowUp`', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, secondLastItem, thirdLastItem, lastItem } = getTabItems(tabs);

  tablist.setAttribute('aria-orientation', 'vertical');

  test('start', () => {
    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected'))).toBeFalsy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowUp` at first item does nothing', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected'))).toBeFalsy();
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    expect(lastItem.getAttribute('aria-selected')).toBe('true');
    expect(tabs.items.slice(0, -1).every((item) => item.hasAttribute('aria-selected'))).toBeFalsy();
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(secondLastItem.getAttribute('aria-selected')).toBe('true');
    expect(
      tabs.items
        .filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))
        .every((item) => item.hasAttribute('aria-selected'))
    ).toBeFalsy();
  });

  test('use `ArrowUp` key to activate third last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(thirdLastItem.getAttribute('aria-selected')).toBe('true');
    expect(
      tabs.items
        .filter((_, idx) => idx !== tabs.items.indexOf(thirdLastItem))
        .every((item) => item.hasAttribute('aria-selected'))
    ).toBeFalsy();
  });
});

describe('select with `ArrowUp`, skipping disabled items', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, fourthLastItem, secondLastItem, thirdLastItem, lastItem } = getTabItems(tabs);

  tablist.setAttribute('aria-orientation', 'vertical');
  thirdLastItem.setAttribute('aria-disabled', 'true');

  test('start', () => {
    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(tabs.items.slice(1).every((item) => item.hasAttribute('aria-selected'))).toBeFalsy();
    expect(tabs.activeItem).toBeTruthy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    expect(lastItem.getAttribute('aria-selected')).toBe('true');
    expect(tabs.items.slice(0, -1).every((item) => item.hasAttribute('aria-selected'))).toBeFalsy();
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(secondLastItem.getAttribute('aria-selected')).toBe('true');
    expect(
      tabs.items
        .filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))
        .every((item) => item.hasAttribute('aria-selected'))
    ).toBeFalsy();
  });

  test('use `ArrowUp` key to activate fourth last item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    expect(fourthLastItem.getAttribute('aria-selected')).toBe('true');
    expect(
      tabs.items
        .filter((_, idx) => idx !== tabs.items.indexOf(fourthLastItem))
        .every((item) => item.hasAttribute('aria-selected'))
    ).toBeFalsy();
  });
});
