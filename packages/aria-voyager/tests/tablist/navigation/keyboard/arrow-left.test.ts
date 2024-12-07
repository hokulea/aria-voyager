import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../../-shared';

describe('Navigate with `ArrowLeft`', () => {
  const { tabs } = createTabs();
  const { firstItem, secondLastItem, thirdLastItem, lastItem } = getTabItems(tabs);

  test('start', () => {
    expect(firstItem.getAttribute('tabindex')).toBe('0');
    expect(
      tabs.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
    expect(tabs.activeItem).toBeTruthy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowUp` at first item does nothing', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    expect(firstItem.getAttribute('tabindex')).toBe('0');
    expect(
      tabs.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    expect(lastItem.getAttribute('tabindex')).toBe('0');
    expect(
      tabs.items.slice(0, -1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    expect(secondLastItem.getAttribute('tabindex')).toBe('0');
    expect(
      tabs.items
        .filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `ArrowUp` key to activate third last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    expect(thirdLastItem.getAttribute('tabindex')).toBe('0');
    expect(
      tabs.items
        .filter((_, idx) => idx !== tabs.items.indexOf(thirdLastItem))
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });
});

describe('navigate with `ArrowLeft`, skipping disabled items', () => {
  const { tabs } = createTabs();
  const { firstItem, fourthLastItem, secondLastItem, thirdLastItem, lastItem } = getTabItems(tabs);

  thirdLastItem.setAttribute('aria-disabled', 'true');

  test('start', () => {
    expect(firstItem.getAttribute('tabindex')).toBe('0');
    expect(
      tabs.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
    expect(tabs.activeItem).toBeTruthy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    expect(lastItem.getAttribute('tabindex')).toBe('0');
    expect(
      tabs.items.slice(0, -1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `ArrowLeft` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    expect(secondLastItem.getAttribute('tabindex')).toBe('0');
    expect(
      tabs.items
        .filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `ArrowLeft` key to activate fourth last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    expect(fourthLastItem.getAttribute('tabindex')).toBe('0');
    expect(
      tabs.items
        .filter((_, idx) => idx !== tabs.items.indexOf(fourthLastItem))
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });
});
