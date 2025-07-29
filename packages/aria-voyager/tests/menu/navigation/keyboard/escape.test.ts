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
    await expect.poll(() => shareMenu.matches(':popover-open')).toBeFalsy();
    firstItem.focus();

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowRight}');

    await expect.poll(() => shareMenu.matches(':popover-open')).toBeTruthy();
    await expect.poll(() => codeItem.getAttribute('tabindex')).toBe('0');
    await expect.poll(() => document.activeElement).toBe(codeItem);
  });

  test('use `Escape` to close submenu', async () => {
    await userEvent.keyboard('{Escape}');

    shareMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    await expect.poll(() => shareMenu.matches(':popover-open')).toBeFalsy();
    await expect.poll(() => document.activeElement).toBe(fourthItem);
  });
});
