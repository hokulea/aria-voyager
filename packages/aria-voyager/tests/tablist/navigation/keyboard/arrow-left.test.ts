import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../../-shared';

describe('Navigate with `ArrowLeft`', () => {
  const { tabs } = createTabs();
  const { firstItem, secondLastItem, thirdLastItem, lastItem } = getTabItems(tabs);

  test('start', async () => {
    await expect.poll(() => firstItem.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() => tabs.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1'))
      .toBeTruthy();
    await expect.poll(() => tabs.activeItem).toBeTruthy();

    firstItem.focus();
    await expect.poll(() => document.activeElement).toBe(firstItem);
  });

  test('use `ArrowUp` at first item does nothing', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.poll(() => firstItem.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() => tabs.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1'))
      .toBeTruthy();
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.poll(() => lastItem.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() => tabs.items.slice(0, -1).every((item) => item.getAttribute('tabindex') === '-1'))
      .toBeTruthy();
  });

  test('use `ArrowUp` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.poll(() => secondLastItem.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))
          .every((item) => item.getAttribute('tabindex') === '-1')
      )
      .toBeTruthy();
  });

  test('use `ArrowUp` key to activate third last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.poll(() => thirdLastItem.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== tabs.items.indexOf(thirdLastItem))
          .every((item) => item.getAttribute('tabindex') === '-1')
      )
      .toBeTruthy();
  });
});

describe('navigate with `ArrowLeft`, skipping disabled items', () => {
  const { tabs } = createTabs();
  const { firstItem, fourthLastItem, secondLastItem, thirdLastItem, lastItem } = getTabItems(tabs);

  thirdLastItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.poll(() => firstItem.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() => tabs.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1'))
      .toBeTruthy();
    await expect.poll(() => tabs.activeItem).toBeTruthy();

    firstItem.focus();
    await expect.poll(() => document.activeElement).toBe(firstItem);
  });

  test('use `END` to jump to the last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.poll(() => lastItem.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() => tabs.items.slice(0, -1).every((item) => item.getAttribute('tabindex') === '-1'))
      .toBeTruthy();
  });

  test('use `ArrowLeft` key to activate second last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.poll(() => secondLastItem.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== tabs.items.indexOf(secondLastItem))
          .every((item) => item.getAttribute('tabindex') === '-1')
      )
      .toBeTruthy();
  });

  test('use `ArrowLeft` key to activate fourth last item', async () => {
    await userEvent.keyboard('{ArrowLeft}');

    await expect.poll(() => fourthLastItem.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== tabs.items.indexOf(fourthLastItem))
          .every((item) => item.getAttribute('tabindex') === '-1')
      )
      .toBeTruthy();
  });
});
