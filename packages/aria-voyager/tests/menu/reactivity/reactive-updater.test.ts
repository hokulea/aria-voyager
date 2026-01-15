import { describe, expect, test } from 'vitest';

import { Menu, ReactiveUpdateStrategy } from '#src';
import { appendItemToMenu } from '#tests/components/menu';
import { createCodeMenu } from '#tests/menu/-shared';

describe('Reactive Updater', () => {
  const { codeMenu } = createCodeMenu();
  const updater = new ReactiveUpdateStrategy();
  const menu = new Menu(codeMenu, {
    updater
  });

  test('start', () => {
    expect(menu.items.length).toBe(15);
  });

  test('reads elements on appending', () => {
    appendItemToMenu(codeMenu, 'Command Palette');

    updater.updateItems();

    expect(menu.items.length).toBe(16);
  });

  describe('read options', () => {
    test('sets tabindex to -1 when the aria-disabled is `true`', async () => {
      expect(menu.items[0].getAttribute('tabindex')).toBe('0');

      for (const item of menu.items.slice(1)) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }

      codeMenu.setAttribute('aria-disabled', 'true');

      updater.updateOptions();

      for (const item of menu.items) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    });

    test('re-sets tabindex to 0 when the aria-disabled is removed', async () => {
      for (const item of menu.items) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }

      codeMenu.removeAttribute('aria-disabled');

      updater.updateOptions();

      expect(menu.items[0].getAttribute('tabindex')).toBe('0');

      for (const item of menu.items.slice(1)) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    });
  });
});
