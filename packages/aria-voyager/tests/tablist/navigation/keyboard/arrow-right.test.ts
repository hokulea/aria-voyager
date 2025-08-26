import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { createTabs, getTabItems } from '../../-shared';

describe('Navigate with `ArrowRight`', () => {
  const { tabs } = createTabs();
  const { firstItem, secondItem, thirdItem, lastItem } = getTabItems(tabs);

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');

    for (const item of tabs.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    expect(tabs.activeItem).toBeTruthy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowRight` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    await expect.element(secondItem).toHaveAttribute('tabindex', '0');

    for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowRight` key to activate third item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    await expect.element(thirdItem).toHaveAttribute('tabindex', '0');

    for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await expect.poll(() => expect.element(item).toHaveAttribute('tabindex', '-1'));
    }
  });

  test('use `ArrowRight` key at the last item does nothing', async () => {
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{ArrowRight}');

    await expect.element(lastItem).toHaveAttribute('tabindex', '0');

    for (const item of tabs.items.slice(0, -1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});

describe('navigate with `ArrowRight`, skipping disabled items', () => {
  const { tabs } = createTabs();
  const { firstItem, secondItem, thirdItem, fourthItem } = getTabItems(tabs);

  thirdItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.element(firstItem).toHaveAttribute('tabindex', '0');

    for (const item of tabs.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    expect(tabs.activeItem).toBeTruthy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowRight` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    await expect.element(secondItem).toHaveAttribute('tabindex', '0');

    for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });

  test('use `ArrowRight` key to activate fourth item', async () => {
    await userEvent.keyboard('{ArrowRight}');

    await expect.element(fourthItem).toHaveAttribute('tabindex', '0');

    for (const item of tabs.items.filter((_, idx) => idx !== 3)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});
