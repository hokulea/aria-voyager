import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupCodeMenu } from '#tests/menu/-shared';

describe('Close with `ArrowLeft`', () => {
  const ctx = setupCodeMenu();

  test('open share menu', async () => {
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(false);

    ctx.firstItem.focus();

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowRight}');
    await expect.element(ctx.shareFirstItem).toHaveAttribute('tabindex', '0');
    expect(document.activeElement).toBe(ctx.shareFirstItem);
  });

  test('use `ArrowLeft` to close submenu', async () => {
    await userEvent.keyboard('{ArrowLeft}');
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(false);
  });

  test('has focus moved to the trigger of the submenu', () => {
    expect(document.activeElement).toBe(ctx.fourthItem);
  });
});
