import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Menu > Navigation > With Keyboard', () => {
  describe('navigates with `Home` and `End`', () => {
    const { codeMenu } = createCodeMenu();

    const menu = new Menu(codeMenu);

    const firstItem = menu.items[0];
    const lastItem = menu.items[menu.items.length - 1];

    expect(firstItem.getAttribute('tabindex')).toBe('0');
    expect(lastItem.getAttribute('tabindex')).toBe('-1');

    expect(menu.activeItem).toBeUndefined();

    test('focusing activates the first item', () => {
      codeMenu.dispatchEvent(new FocusEvent('focusin'));

      expect(menu.activeItem).toBe(firstItem);
    });

    test('activates the last item with END', () => {
      codeMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

      expect(lastItem.getAttribute('tabindex')).toBe('0');
      expect(
        menu.items.slice(0, -1).every((item) => item.getAttribute('tabindex') === '-1')
      ).toBeTruthy();
    });

    test('activates the first item with HOME', () => {
      codeMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));

      expect(firstItem.getAttribute('tabindex')).toBe('0');
      expect(
        menu.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
      ).toBeTruthy();
    });
  });

  describe('navigates with `Home` and `End`, skip disabled items', () => {
    const { codeMenu } = createCodeMenu();

    const menu = new Menu(codeMenu);

    const { firstItem, secondItem, secondLastItem, lastItem } = getItems(menu);

    expect(firstItem.getAttribute('tabindex')).toBe('0');
    expect(lastItem.getAttribute('tabindex')).toBe('-1');

    firstItem.setAttribute('aria-disabled', 'true');
    lastItem.setAttribute('aria-disabled', 'true');

    expect(menu.activeItem).toBeUndefined();

    test('focusing activates the first item', () => {
      codeMenu.dispatchEvent(new FocusEvent('focusin'));

      expect(menu.activeItem).toBe(secondItem);
    });

    test('activates the last item with END', () => {
      codeMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

      expect(secondLastItem.getAttribute('tabindex')).toBe('0');
      expect(
        menu.items
          .filter((_, idx) => idx !== menu.items.indexOf(secondLastItem))
          .every((item) => item.getAttribute('tabindex') === '-1')
      ).toBeTruthy();
    });

    test('activates the first item with HOME', () => {
      codeMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));

      expect(secondItem.getAttribute('tabindex')).toBe('0');
      expect(
        menu.items
          .filter((_, idx) => idx !== 1)
          .every((item) => item.getAttribute('tabindex') === '-1')
      ).toBeTruthy();
    });
  });
});
