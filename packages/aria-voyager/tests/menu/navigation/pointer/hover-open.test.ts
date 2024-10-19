import { describe, expect, test, vi } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Menu > Navigation > With Pointer', () => {
  describe('Hover opens submenu', () => {
    const { codeMenu, shareMenu } = createCodeMenu();

    const menu = new Menu(codeMenu);

    const { fourthItem } = getItems(menu);

    expect(shareMenu.matches(':popover-open')).toBeFalsy();
    expect(menu.activeItem).toBeUndefined();

    test('hover item to show submenu', () => {
      fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
      expect(shareMenu.matches(':popover-open')).toBeTruthy();
    });

    test('keeps focus on trigger item', async () => {
      await vi.waitFor(() => {
        expect(document.activeElement).toBe(fourthItem);
      });
    });
  });
});
