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

      await expect.element(menu).toHaveAttribute('role', 'menu');
    });

    test('sets tabindex on the first item', async () => {
      const { codeMenu } = createCodeMenu();

      new Menu(codeMenu);

      const firstItem = codeMenu.querySelector('[role="menuitem"]') as HTMLElement;

      await expect.element(firstItem).toHaveAttribute('tabindex', '0');
    });

    test('reads items', async () => {
      const { codeMenu } = createCodeMenu();

      const menu = new Menu(codeMenu);

      expect(menu.items.length).toBe(11);
    });

    test('items have tabindex', async () => {
      const { codeMenu } = createCodeMenu();

      const menu = new Menu(codeMenu);

      for (const item of menu.items) {
        await expect.element(item).toHaveAttribute('tabindex');
      }
    });
  });

  describe('disabled', () => {
    test('focus does not work', async () => {
      const { codeMenu } = createCodeMenu();

      codeMenu.setAttribute('aria-disabled', 'true');

      const menu = new Menu(codeMenu);

      for (const item of menu.items) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    });
  });
});
