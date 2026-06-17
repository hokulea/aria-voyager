import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupCodeMenu } from '#tests/menu/-shared';

describe('Close with `Escape`', () => {
  const ctx = setupCodeMenu();

  test('start', async () => {
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(false);
    ctx.firstItem.focus();

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowRight}');

    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(true);
    await expect.element(ctx.shareFirstItem).toHaveAttribute('tabindex', '0');
    expect(document.activeElement).toBe(ctx.shareFirstItem);
  });

  test('use `Escape` to close submenu', async () => {
    await userEvent.keyboard('{Escape}');

    ctx.shareMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(false);
    expect(document.activeElement).toBe(ctx.fourthItem);
  });
});
