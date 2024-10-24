import { describe, expect, test, vi } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Menu > Navigation > With Keyboard', () => {
  describe('invoking a menu item closes all submenus', () => {
    const { codeMenu, shareMenu, socialMenu } = createCodeMenu();
    const menu = new Menu(codeMenu);
    const { fourthItem } = getItems(menu);
    const share = new Menu(shareMenu);
    const socialItem = share.items[1];
    const social = new Menu(socialMenu);
    const mastodonItem = social.items[1];

    expect(shareMenu.matches(':popover-open')).toBeFalsy();
    expect(socialMenu.matches(':popover-open')).toBeFalsy();

    test('open submenus', () => {
      fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
      socialItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

      expect(shareMenu.matches(':popover-open')).toBeTruthy();
      expect(socialMenu.matches(':popover-open')).toBeTruthy();
    });

    test('use `Enter` on a menu item closes all submenus', async () => {
      mastodonItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
      socialMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await vi.waitFor(() => {
        expect(shareMenu.matches(':popover-open')).toBeFalsy();
        expect(socialMenu.matches(':popover-open')).toBeFalsy();
      });
    });
  });
});
