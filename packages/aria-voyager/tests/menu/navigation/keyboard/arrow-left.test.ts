import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Close with `ArrowLeft`', () => {
  const { codeMenu, shareMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const share = new Menu(shareMenu);
  const codeItem = share.items[0];
  const { firstItem, fourthItem } = getItems(menu);

  test('open share menu', async () => {
    await expect.poll(() => shareMenu.matches(':popover-open')).toBeFalsy();

    firstItem.focus();

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowRight}');
    await expect.poll(() => codeItem.getAttribute('tabindex')).toBe('0');
    await expect.poll(() => document.activeElement).toBe(codeItem);
  });

  test('use `ArrowLeft` to close submenu', async () => {
    await userEvent.keyboard('{ArrowLeft}');
    await expect.poll(() => shareMenu.matches(':popover-open')).toBeFalsy();
  });

  test('has focus moved to the trigger of the submenu', async () => {
    await expect.poll(() => document.activeElement).toBe(fourthItem);
  });
});
