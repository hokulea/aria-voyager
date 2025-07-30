import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../../-shared';

describe('Navigate with `ArrowDown`', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, secondItem, thirdItem, lastItem } = getTabItems(tabs);

  tablist.setAttribute('aria-orientation', 'vertical');

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');
    expect(
      tabs.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
    expect(tabs.activeItem).toBeTruthy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(secondItem).toHaveAttribute('tabindex', '0');
    expect(
      tabs.items
        .filter((_, idx) => idx !== 1)
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `ArrowDown` key to activate third item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(thirdItem).toHaveAttribute('tabindex', '0');
    expect(
      tabs.items
        .filter((_, idx) => idx !== 2)
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `ArrowDown` key at the last item does nothing', async () => {
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(lastItem).toHaveAttribute('tabindex', '0');
    expect(
      tabs.items.slice(0, -1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });
});

describe('navigate with `ArrowDown`, skipping disabled items', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, secondItem, thirdItem, fourthItem } = getTabItems(tabs);

  tablist.setAttribute('aria-orientation', 'vertical');
  thirdItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');
    expect(
      tabs.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
    expect(tabs.activeItem).toBeTruthy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(secondItem).toHaveAttribute('tabindex', '0');
    expect(
      tabs.items
        .filter((_, idx) => idx !== 1)
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });

  test('use `ArrowDown` key to activate fourth item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(fourthItem).toHaveAttribute('tabindex', '0');
    expect(
      tabs.items
        .filter((_, idx) => idx !== 3)
        .every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();
  });
});
