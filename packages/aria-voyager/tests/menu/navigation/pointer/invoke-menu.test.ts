import { describe, expect, test, vi } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenuWithTriggerButton, getItems } from '../../-shared';

describe('Menu > Navigation > With Pointer', () => {
  describe('invoking a menu item closes the menu', () => {
    const { codeMenu, shareMenu, socialMenu, triggerButton } = createCodeMenuWithTriggerButton();
    const menu = new Menu(codeMenu);
    const { fourthItem } = getItems(menu);
    const share = new Menu(shareMenu);
    const socialItem = share.items[1];
    const social = new Menu(socialMenu);
    const mastodonItem = social.items[1];

    expect(codeMenu.matches(':popover-open')).toBeFalsy();
    expect(shareMenu.matches(':popover-open')).toBeFalsy();
    expect(socialMenu.matches(':popover-open')).toBeFalsy();

    test('open the menus', () => {
      triggerButton.click();
      expect(codeMenu.matches(':popover-open')).toBeTruthy();

      fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
      socialItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

      expect(shareMenu.matches(':popover-open')).toBeTruthy();
      expect(socialMenu.matches(':popover-open')).toBeTruthy();
    });

    test('clicking a menu item closes the menu', async () => {
      mastodonItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
      mastodonItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

      await vi.waitFor(() => {
        expect(codeMenu.matches(':popover-open')).toBeFalsy();
        expect(shareMenu.matches(':popover-open')).toBeFalsy();
        expect(socialMenu.matches(':popover-open')).toBeFalsy();
      });
    });
  });

  describe('invoking a descending menu item closes the menu', () => {
    const { codeMenu, refactorHeader, triggerButton } = createCodeMenuWithTriggerButton();
    const menu = new Menu(codeMenu);
    const { secondItem } = getItems(menu);

    expect(codeMenu.matches(':popover-open')).toBeFalsy();

    test('open the menus', () => {
      triggerButton.click();
      expect(codeMenu.matches(':popover-open')).toBeTruthy();
    });

    test('clicking a non-menu item keeps the menu open', () => {
      refactorHeader.click();
      expect(codeMenu.matches(':popover-open')).toBeTruthy();
    });

    test('clicking a descendend menu item closes the menu', async () => {
      secondItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

      await vi.waitFor(() => {
        expect(codeMenu.matches(':popover-open')).toBeFalsy();
      });
    });
  });
});
