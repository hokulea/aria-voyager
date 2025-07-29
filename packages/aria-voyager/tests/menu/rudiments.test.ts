import { describe, expect, test } from 'vitest';

import { Menu } from '../../src';
import { createMenuElement } from '../components/menu';
import { createCodeMenu } from './-shared';

describe('Menu', () => {
  test('renders', async () => {
    const { codeMenu } = createCodeMenu();
    const menu = new Menu(codeMenu);

    expect(menu.items.length).toBe(11);
  });

  describe('setup', () => {
    test('has menu role', async () => {
      const menu = createMenuElement(document.body);

      new Menu(menu);

      await expect.poll(() => menu.getAttribute('role')).toBe('menu');
    });

    test('sets tabindex on the first item', async () => {
      const { codeMenu } = createCodeMenu();

      new Menu(codeMenu);

      const firstItem = codeMenu.querySelector('[role="menuitem"]') as HTMLElement;

      await expect.poll(() => firstItem.getAttribute('tabindex')).toBe('0');
    });

    test('reads items', async () => {
      const { codeMenu } = createCodeMenu();

      const menu = new Menu(codeMenu);

      expect(menu.items.length).toBe(11);
    });

    test('items have tabindex', async () => {
      const { codeMenu } = createCodeMenu();

      const menu = new Menu(codeMenu);

    await expect.poll(() => menu.items.map((item) => item.getAttribute('tabindex')).every(Boolean)).toBeTruthy();
    });
  });

  describe('disabled', () => {
    test('focus does not work', async () => {
      const { codeMenu } = createCodeMenu();

      codeMenu.setAttribute('aria-disabled', 'true');

      const menu = new Menu(codeMenu);

    await expect.poll(() => menu.items.map((item) => item.getAttribute('tabindex') === '-1').every(Boolean)).toBeTruthy();
    });
  });
});
