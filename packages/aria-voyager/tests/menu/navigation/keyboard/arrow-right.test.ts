import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

describe('Open with `ArrowRight`', () => {
  const { codeMenu, shareMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);
  const { firstItem, fourthItem } = getItems(menu);
  const share = new Menu(shareMenu);
  const codeItem = share.items[0];

  test('start', () => {
    expect(shareMenu.matches(':popover-open')).toBeFalsy();

    firstItem.focus();
    expect(document.activeElement).toBe(firstItem);
  });

  test('use `ArrowRight` to open submenu', async () => {
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await expect.element(fourthItem).toHaveAttribute('tabindex', '0');

    await userEvent.keyboard('{ArrowRight}');
    expect(shareMenu.matches(':popover-open')).toBeTruthy();
    await expect.element(codeItem).toHaveAttribute('tabindex', '0');
    expect(document.activeElement).toBe(codeItem);
  });
});
