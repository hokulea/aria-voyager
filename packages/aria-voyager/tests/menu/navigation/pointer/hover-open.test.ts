import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { setupCodeMenu } from '#tests/menu/-shared';

describe('Hover opens submenu', () => {
  const ctx = setupCodeMenu();

  test('start', async () => {
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(false);
    expect(ctx.menu.activeItem).toBeUndefined();
  });

  test('hover item to show submenu', async () => {
    await userEvent.hover(ctx.fourthItem);

    await expect.element(ctx.fourthItem).toHaveFocus();
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(true);
  });
});
