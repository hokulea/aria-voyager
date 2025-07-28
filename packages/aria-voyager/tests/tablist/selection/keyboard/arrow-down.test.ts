import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '#tests/tablist/-shared';

describe('Select with `ArrowDown`', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, secondItem, thirdItem, lastItem } = getTabItems(tabs);

  tablist.setAttribute('aria-orientation', 'vertical');

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `ArrowDown` key to activate third item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.filter((_, idx) => idx !== 2)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `ArrowDown` key at the last item does nothing', async () => {
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(lastItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.slice(0, -1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });
});

describe('select with `ArrowDown`, skipping disabled items', () => {
  const { tabs, tablist } = createTabs();
  const { firstItem, secondItem, thirdItem, fourthItem } = getTabItems(tabs);

  tablist.setAttribute('aria-orientation', 'vertical');
  thirdItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.slice(1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }

    expect(tabs.activeItem).toBeTruthy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });

  test('use `ArrowDown` key to activate fourth item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(fourthItem).toHaveAttribute('aria-selected', 'true');

    for (const item of tabs.items.filter((_, idx) => idx !== 3)) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }
  });
});
