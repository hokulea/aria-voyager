import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Close with `Escape`', () => {
  const { codeMenu, shareMenu } = createCodeMenu();

  const menu = new Menu(codeMenu);
  const share = new Menu(shareMenu);
  const codeItem = share.items[0];
  const { firstItem, fourthItem } = getItems(menu);

  test('start', async () => {
    await expect.element(shareMenu).not.toBeVisible();
    firstItem.focus();

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowRight}');

    await expect.element(shareMenu).toBeVisible();
    await expect.element(codeItem).toHaveAttribute('tabindex', '0');
    await expect.element(codeItem).toBeFocused();
  });

  test('use `Escape` to close submenu', async () => {
    await userEvent.keyboard('{Escape}');

    shareMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    await expect.element(shareMenu).not.toBeVisible();
    await expect.element(fourthItem).toBeFocused();
  });
});
