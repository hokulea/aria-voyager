import { describe, expect, test } from 'vitest';

import { Menu } from '../../../../src';
import { createCodeMenu, getItems } from '../../-shared';

describe('Menu > Navigation > With Keyboard', () => {
  describe('navigate with `ArrowUp`', () => {
    const { codeMenu } = createCodeMenu();

    const menu = new Menu(codeMenu);

    const { firstItem, secondLastItem, thirdLastItem, lastItem } = getItems(menu);

    expect(firstItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();

    codeMenu.dispatchEvent(new FocusEvent('focusin'));

    test('use `ArrowUp` at first item does nothing', () => {
      codeMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

      expect(firstItem.getAttribute('tabindex')).toBe('0');
      expect(
        menu.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
      ).toBeTruthy();
    });

    test('use `END` to jump to the last item', () => {
      codeMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

      expect(lastItem.getAttribute('tabindex')).toBe('0');
      expect(
        menu.items.slice(0, -1).every((item) => item.getAttribute('tabindex') === '-1')
      ).toBeTruthy();
    });

    test('use `ArrowUp` key to activate second last item', () => {
      codeMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

      expect(secondLastItem.getAttribute('tabindex')).toBe('0');
      expect(
        menu.items
          .filter((_, idx) => idx !== menu.items.indexOf(secondLastItem))
          .every((item) => item.getAttribute('tabindex') === '-1')
      ).toBeTruthy();
    });

    test('use `ArrowUp` key to activate third last item', () => {
      codeMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

      expect(thirdLastItem.getAttribute('tabindex')).toBe('0');
      expect(
        menu.items
          .filter((_, idx) => idx !== menu.items.indexOf(thirdLastItem))
          .every((item) => item.getAttribute('tabindex') === '-1')
      ).toBeTruthy();
    });
  });

  describe('navigate with `ArrowUp`, skip disabled items', () => {
    const { codeMenu } = createCodeMenu();

    const menu = new Menu(codeMenu);

    const { firstItem, fourthLastItem, secondLastItem, thirdLastItem, lastItem } = getItems(menu);

    expect(firstItem.getAttribute('tabindex')).toBe('0');
    expect(
      menu.items.slice(1).every((item) => item.getAttribute('tabindex') === '-1')
    ).toBeTruthy();

    thirdLastItem.setAttribute('aria-disabled', 'true');

    codeMenu.dispatchEvent(new FocusEvent('focusin'));

    test('use `END` to jump to the last item', () => {
      codeMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

      expect(lastItem.getAttribute('tabindex')).toBe('0');
      expect(
        menu.items.slice(0, -1).every((item) => item.getAttribute('tabindex') === '-1')
      ).toBeTruthy();
    });

    test('use `ArrowUp` key to activate second last item', () => {
      codeMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

      expect(secondLastItem.getAttribute('tabindex')).toBe('0');
      expect(
        menu.items
          .filter((_, idx) => idx !== menu.items.indexOf(secondLastItem))
          .every((item) => item.getAttribute('tabindex') === '-1')
      ).toBeTruthy();
    });

    test('use `ArrowUp` key to activate fourth last item', () => {
      codeMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

      expect(fourthLastItem.getAttribute('tabindex')).toBe('0');
      expect(
        menu.items
          .filter((_, idx) => idx !== menu.items.indexOf(fourthLastItem))
          .every((item) => item.getAttribute('tabindex') === '-1')
      ).toBeTruthy();
    });
  });
});
