import { describe, expect, test, vi } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Menu > Navigation > With Keyboard', () => {
  describe('open with `ArrowRight`', () => {
    const { codeMenu, shareMenu } = createCodeMenu();

    const menu = new Menu(codeMenu);

    expect(shareMenu.matches(':popover-open')).toBeFalsy();

    const { fourthItem } = getItems(menu);

    codeMenu.dispatchEvent(new FocusEvent('focusin'));

    test('use `ArrowRight` to open submenu', () => {
      codeMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      codeMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      codeMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      expect(fourthItem.getAttribute('tabindex')).toBe('0');

      codeMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      expect(shareMenu.matches(':popover-open')).toBeTruthy();
    });

    test('has focus on the first item of the submenu', async () => {
      const share = new Menu(shareMenu);
      const firstItem = share.items[0];

      await vi.waitFor(() => {
        expect(firstItem.getAttribute('tabindex')).toBe('0');
        expect(document.activeElement).toBe(firstItem);
      });
    });
  });
});
