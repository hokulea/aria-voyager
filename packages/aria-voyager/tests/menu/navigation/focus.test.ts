import { describe, expect, test } from 'vitest';
import { setupCodeMenu } from '#tests/menu/-shared';

describe('When Focus', () => {
  const ctx = setupCodeMenu();

  test('start', async () => {
    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

    for (const item of ctx.menu.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    expect(ctx.menu.activeItem).toBeUndefined();
  });

  test('focus activates the first item', () => {
    ctx.codeMenu.dispatchEvent(new FocusEvent('focusin'));

    expect(ctx.menu.activeItem).toBe(ctx.firstItem);
  });
});
