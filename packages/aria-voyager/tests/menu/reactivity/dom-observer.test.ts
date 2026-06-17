import { describe, expect, test, vi } from 'vitest';

import { appendItemToMenu, getItems } from '#tests/components/menu';
import { setupCodeMenu } from '#tests/menu/-shared';

describe('DOM Observer', () => {
  const ctx = setupCodeMenu();

  test('start', () => {
    expect(ctx.menu.items.length).toBe(15);
  });

  test('reads elements on appending', async () => {
    appendItemToMenu(ctx.codeMenu, 'Command Palette');

    await vi.waitUntil(() => getItems(ctx.codeMenu).length === 16);

    expect(ctx.menu.items.length).toBe(16);
  });

  describe('read options', () => {
    test('sets tabindex to -1 when the aria-disabled is `true`', async () => {
      await expect.element(ctx.menu.items[0]).toHaveAttribute('tabindex', '0');

      for (const item of ctx.menu.items.slice(1)) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }

      ctx.codeMenu.setAttribute('aria-disabled', 'true');

      await expect.element(ctx.codeMenu).toHaveAttribute('aria-disabled', 'true');

      for (const item of ctx.menu.items) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    });

    test('re-sets tabindex to 0 when the aria-disabled is removed', async () => {
      for (const item of ctx.menu.items) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }

      ctx.codeMenu.removeAttribute('aria-disabled');

      await expect.element(ctx.codeMenu).not.toHaveAttribute('aria-disabled');

      await expect.element(ctx.menu.items[0]).toHaveAttribute('tabindex', '0');

      for (const item of ctx.menu.items.slice(1)) {
        await expect.element(item).toHaveAttribute('tabindex', '-1');
      }
    });
  });
});
