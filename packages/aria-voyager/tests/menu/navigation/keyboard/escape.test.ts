import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { Menu } from '#src';
import { createCodeMenu, getItems } from '#tests/menu/-shared';

describe('Close with `Escape`', () => {
  const { codeMenu, shareMenu } = createCodeMenu();

  const menu = new Menu(codeMenu);
  const share = new Menu(shareMenu);
  const codeItem = share.items[0];
  const { firstItem, fourthItem } = getItems(menu);

  test('start', async () => {
    expect(shareMenu.matches(':popover-open')).toBeFalsy();
    firstItem.focus();

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowRight}');

    expect(shareMenu.matches(':popover-open')).toBeTruthy();
    await expect.element(codeItem).toHaveAttribute('tabindex', '0');
    expect(document.activeElement).toBe(codeItem);
  });

  test('use `Escape` to close submenu', async () => {
    await userEvent.keyboard('{Escape}');

    shareMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(shareMenu.matches(':popover-open')).toBeFalsy();
    expect(document.activeElement).toBe(fourthItem);
  });
});
