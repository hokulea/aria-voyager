import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { setupCodeMenu } from '#tests/menu/-shared';

describe('Invoking a menu item closes all submenus', () => {
  const ctx = setupCodeMenu();

  test('start', async () => {
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(false);
    await expect.poll(() => ctx.socialMenu.matches(':popover-open')).toBe(false);
  });

  test('open the sub-submenu', async () => {
    // https://github.com/hokulea/aria-voyager/issues/264
    // await userEvent.hover(ctx.fourthItem);
    // await userEvent.hover(ctx.shareSecondItem);

    ctx.fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
    ctx.shareSecondItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(true);
    await expect.poll(() => ctx.socialMenu.matches(':popover-open')).toBe(true);
  });

  test('clicking a menu item closes all submenus', async () => {
    await userEvent.click(ctx.social.items[1]);

    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(false);
    await expect.poll(() => ctx.socialMenu.matches(':popover-open')).toBe(false);
  });
});
