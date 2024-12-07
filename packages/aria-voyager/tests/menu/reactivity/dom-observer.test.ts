import { describe, expect, test, vi } from 'vitest';

import { Menu } from '../../../src';
import { appendItemToMenu, getItems } from '../../components/menu';
import { createCodeMenu } from '../-shared';

describe('DOM Observer', () => {
  const { codeMenu } = createCodeMenu();
  const menu = new Menu(codeMenu);

  test('start', () => {
    expect(menu.items.length).toBe(11);
  });

  test('reads elements on appending', async () => {
    appendItemToMenu(codeMenu, 'Command Palette');

    await vi.waitUntil(() => getItems(codeMenu).length === 12);

    expect(menu.items.length).toBe(12);
  });

  describe('read options', () => {
    test('sets tabindex to -1 when the aria-disabled is `true`', async () => {
      expect(menu.items[0].getAttribute('tabindex')).toBe('0');
      expect(
        menu.items
          .slice(1)
          .map((item) => item.getAttribute('tabindex') === '-1')
          .every(Boolean)
      ).toBeTruthy();

      codeMenu.setAttribute('aria-disabled', 'true');

      await vi.waitUntil(() => codeMenu.getAttribute('aria-disabled') === 'true');

      expect(
        menu.items.map((item) => item.getAttribute('tabindex') === '-1').every(Boolean)
      ).toBeTruthy();
    });

    test('re-sets tabindex to 0 when the aria-disabled is removed', async () => {
      expect(
        menu.items.map((item) => item.getAttribute('tabindex') === '-1').every(Boolean)
      ).toBeTruthy();

      codeMenu.removeAttribute('aria-disabled');

      await vi.waitUntil(() => codeMenu.getAttribute('aria-disabled') === null);

      expect(menu.items[0].getAttribute('tabindex')).toBe('0');
      expect(
        menu.items
          .slice(1)
          .map((item) => item.getAttribute('tabindex') === '-1')
          .every(Boolean)
      ).toBeTruthy();
    });
  });
});
