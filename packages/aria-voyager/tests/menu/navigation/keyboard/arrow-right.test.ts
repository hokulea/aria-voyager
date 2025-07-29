import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Open with `ArrowRight`', () => {
  const { codeMenu, shareMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, fourthItem } = getItems(menu);
  const share = new Menu(shareMenu);
  const codeItem = share.items[0];

  test('start', async () => {
    await expect.poll(() => shareMenu.matches(':popover-open')).toBeFalsy();

    firstItem.focus();
    await expect.poll(() => expect.element(firstItem)).toBeFocused();
  });

  test('use `ArrowRight` to open submenu', async () => {
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await expect.poll(() => expect.element(fourthItem)).toHaveAttribute('tabindex', '0');

    await userEvent.keyboard('{ArrowRight}');
    await expect.poll(() => shareMenu.matches(':popover-open')).toBeTruthy();
    await expect.poll(() => expect.element(codeItem)).toHaveAttribute('tabindex', '0');
    await expect.poll(() => expect.element(codeItem)).toBeFocused();
  });
});
