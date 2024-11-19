import { describe, expect, test } from 'vitest';

import { Menu } from '../../src';
import { createMenuElement } from '../components/menu';
import { createCodeMenu } from './-shared';

describe('Menu', () => {
  test('renders', () => {
    const { codeMenu } = createCodeMenu();
    const menu = new Menu(codeMenu);

    expect(menu.items.length).toBe(11);
  });

  describe('setup', () => {
    test('has menu role', () => {
      const menu = createMenuElement(document.body);

      new Menu(menu);

      expect(menu.getAttribute('role')).toBe('menu');
    });

    test('sets tabindex on the first item', () => {
      const { codeMenu } = createCodeMenu();

      new Menu(codeMenu);

      const firstItem = codeMenu.querySelector('[role="menuitem"]') as HTMLElement;

      expect(firstItem.getAttribute('tabindex')).toBe('0');
    });

    test('reads items', () => {
      const { codeMenu } = createCodeMenu();

      const menu = new Menu(codeMenu);

      expect(menu.items.length).toBe(11);
    });

    test('items have tabindex', () => {
      const { codeMenu } = createCodeMenu();

      const menu = new Menu(codeMenu);

      expect(menu.items.map((item) => item.getAttribute('tabindex')).every(Boolean)).toBeTruthy();
    });
  });

  describe('disabled', () => {
    test('focus does not work', () => {
      const { codeMenu } = createCodeMenu();

      codeMenu.setAttribute('aria-disabled', 'true');

      const menu = new Menu(codeMenu);

      expect(
        menu.items.map((item) => item.getAttribute('tabindex') === '-1').every(Boolean)
      ).toBeTruthy();
    });
  });
});
