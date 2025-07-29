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
    await expect.element(shareMenu).not.toBeVisible();

    firstItem.focus();

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowRight}');
    await expect.element(codeItem).toHaveAttribute('tabindex', '0');
    await expect.element(codeItem).toBeFocused();
  });

  test('use `ArrowLeft` to close submenu', async () => {
    await userEvent.keyboard('{ArrowLeft}');
    await expect.element(shareMenu).not.toBeVisible();
  });

  test('has focus moved to the trigger of the submenu', async () => {
    await expect.element(fourthItem).toBeFocused();
  });
});
