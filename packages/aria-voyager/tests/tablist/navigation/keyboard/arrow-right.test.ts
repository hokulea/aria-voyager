import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../../-shared';

describe('Navigate with `ArrowRight`', () => {
  const { tabs } = createTabs();
  const { firstItem, secondItem, thirdItem, lastItem } = getTabItems(tabs);

  test('start', async () => {
    await expect.poll(() => firstItem.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() => tabs.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1'))
      .toBeTruthy();
    await expect.poll(() => tabs.activeItem).toBeTruthy();

    firstItem.focus();
    await expect.poll(() => document.activeElement).toBe(firstItem);
  });

  test('use `ArrowRight` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    await expect.poll(() => secondItem.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== 1)
          .every((item) => item.getAttribute('tabindex') === '-1')
      )
      .toBeTruthy();
  });

  test('use `ArrowRight` key to activate third item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    await expect.poll(() => thirdItem.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== 2)
          .every((item) => item.getAttribute('tabindex') === '-1')
      )
      .toBeTruthy();
  });

  test('use `ArrowRight` key at the last item does nothing', async () => {
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{ArrowRight}');

    await expect.poll(() => lastItem.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() => tabs.items.slice(0, -1).every((item) => item.getAttribute('tabindex') === '-1'))
      .toBeTruthy();
  });
});

describe('navigate with `ArrowRight`, skipping disabled items', () => {
  const { tabs } = createTabs();
  const { firstItem, secondItem, thirdItem, fourthItem } = getTabItems(tabs);

  thirdItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.poll(() => firstItem.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() => tabs.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1'))
      .toBeTruthy();
    await expect.poll(() => tabs.activeItem).toBeTruthy();

    firstItem.focus();
    await expect.poll(() => document.activeElement).toBe(firstItem);
  });

  test('use `ArrowRight` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    await expect.poll(() => secondItem.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== 1)
          .every((item) => item.getAttribute('tabindex') === '-1')
      )
      .toBeTruthy();
  });

  test('use `ArrowRight` key to activate fourth item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    await expect.poll(() => fourthItem.getAttribute('tabindex')).toBe('0');
    await expect
      .poll(() =>
        tabs.items
          .filter((_, idx) => idx !== 3)
          .every((item) => item.getAttribute('tabindex') === '-1')
      )
      .toBeTruthy();
  });
});
