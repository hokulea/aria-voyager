import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupCodeMenu } from '#tests/menu/-shared';

describe('Open with `Enter`', () => {
  const ctx = setupCodeMenu();

  test('start', async () => {
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBeFalsy();
    ctx.firstItem.focus();
  });

  test('use `Enter` to open submenu', async () => {
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await expect.element(ctx.fourthItem).toHaveAttribute('tabindex', '0');

    await userEvent.keyboard('{Enter}');
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(true);
    await expect.element(ctx.shareFirstItem).toHaveAttribute('tabindex', '0');
    expect(document.activeElement).toBe(ctx.shareFirstItem);
  });
});
