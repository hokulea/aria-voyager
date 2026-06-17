import { describe, expect, test } from 'vitest';

import { ReactiveUpdateStrategy } from '#src';
import { appendItemToMenu } from '#tests/components/menu';
import { setupCodeMenu } from '#tests/menu/-shared';

describe('Reactive Updater', () => {
  const updater = new ReactiveUpdateStrategy();
  const ctx = setupCodeMenu({
    menuOptions: { updater }
  });

  test('start', () => {
    expect(ctx.menu.items.length).toBe(15);
  });

  test('reads elements on appending', () => {
    appendItemToMenu(ctx.codeMenu, 'Command Palette');

    updater.updateItems();

    expect(ctx.menu.items.length).toBe(16);
  });

  describe('read options', () => {
    test('sets tabindex to -1 when the aria-disabled is `true`', async () => {
      expect(ctx.menu.items[0].getAttribute('tabindex')).toBe('0');

      for (const item of ctx.menu.items.slice(1)) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }

      ctx.codeMenu.setAttribute('aria-disabled', 'true');

      updater.updateOptions();

      for (const item of ctx.menu.items) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    });

    test('re-sets tabindex to 0 when the aria-disabled is removed', async () => {
      for (const item of ctx.menu.items) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }

      ctx.codeMenu.removeAttribute('aria-disabled');

      updater.updateOptions();

      expect(ctx.menu.items[0].getAttribute('tabindex')).toBe('0');

      for (const item of ctx.menu.items.slice(1)) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    });
  });
});
