import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { setupCodeMenu } from '#tests/menu/-shared';

describe('Hover activates item', () => {
  const ctx = setupCodeMenu();

  test('start', async () => {
    for (const item of ctx.menu.items.slice(1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }

    expect(ctx.menu.activeItem).toBeFalsy();
  });

  test('hovers first item to make it active', async () => {
    await userEvent.hover(ctx.firstItem);

    await expect.element(ctx.firstItem).toHaveAttribute('tabindex', '0');

    expect(ctx.menu.activeItem).toBe(ctx.firstItem);
  });

  test('hovers second item to make it active', async () => {
    await userEvent.hover(ctx.secondItem);

    await expect.element(ctx.secondItem).toHaveAttribute('tabindex', '0');

    expect(ctx.menu.activeItem).toBe(ctx.secondItem);

    for (const item of ctx.menu.items.filter((_, idx) => idx !== 1)) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});
