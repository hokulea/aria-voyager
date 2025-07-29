import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Navigate with `ArrowDown`', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, secondItem, thirdItem, lastItem } = getItems(menu);

  test('start', async () => {
    await expect.poll(() => firstItem.getAttribute('tabindex')).toBe('0');

    for (const item of menu.items.slice(1)) {
      await expect.poll(() => item.getAttribute('tabindex')).toBe('-1');
    }

    firstItem.focus();
    await expect.poll(() => document.activeElement === firstItem).toBeTruthy();
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.poll(() => secondItem.getAttribute('tabindex')).toBe('0');

    for (const item of menu.items.filter((_, idx) => idx !== 1)) {
      await expect.poll(() => item.getAttribute('tabindex')).toBe('-1');
    }
  });

  test('use `ArrowDown` key to activate third item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.poll(() => thirdItem.getAttribute('tabindex')).toBe('0');

    for (const item of menu.items.filter((_, idx) => idx !== 2)) {
      await expect.poll(() => item.getAttribute('tabindex')).toBe('-1');
    }
  });

  test('use `ArrowDown` key at the last item does nothing', async () => {
    await userEvent.keyboard('{End}');
    await userEvent.keyboard('{ArrowDown}');

    await expect.poll(() => lastItem.getAttribute('tabindex')).toBe('0');

    for (const item of menu.items.slice(0, -1)) {
      await expect.poll(() => item.getAttribute('tabindex')).toBe('-1');
    }
  });
});

describe('navigate with `ArrowDown`, skipping disabled items', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, secondItem, thirdItem, fourthItem } = getItems(menu);

  thirdItem.setAttribute('aria-disabled', 'true');

  test('start', async () => {
    await expect.poll(() => firstItem.getAttribute('tabindex')).toBe('0');

    for (const item of menu.items.slice(1)) {
      await expect.poll(() => item.getAttribute('tabindex')).toBe('-1');
    }

    firstItem.focus();
    await expect.poll(() => document.activeElement === firstItem).toBeTruthy();
  });

  test('use `ArrowDown` key to activate second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.poll(() => secondItem.getAttribute('tabindex')).toBe('0');

    for (const item of menu.items.filter((_, idx) => idx !== 1)) {
      await expect.poll(() => item.getAttribute('tabindex')).toBe('-1');
    }
  });

  test('use `ArrowDown` key to activate fourth item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.poll(() => fourthItem.getAttribute('tabindex')).toBe('0');

    for (const item of menu.items.filter((_, idx) => idx !== 3)) {
      await expect.poll(() => item.getAttribute('tabindex')).toBe('-1');
    }
  });
});
