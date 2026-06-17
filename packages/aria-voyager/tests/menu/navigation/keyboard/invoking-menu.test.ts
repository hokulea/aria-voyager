import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupCodeMenu } from '#tests/menu/-shared';

describe('Invoking a menu item closes all submenus', () => {
  const ctx = setupCodeMenu({ withTrigger: true });

  test('start', async () => {
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBeFalsy();
    await expect.poll(() => ctx.socialMenu.matches(':popover-open')).toBeFalsy();
  });

  test('open the menus', async () => {
    await userEvent.click(ctx.triggerButton);

    await expect.poll(() => ctx.codeMenu.matches(':popover-open')).toBe(true);

    // does not work under playwright
    // https://github.com/hokulea/aria-voyager/issues/264
    // await userEvent.hover(ctx.fourthItem);
    // await userEvent.hover(ctx.shareSecondItem);

    ctx.fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
    ctx.shareSecondItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(true);
    await expect.poll(() => ctx.socialMenu.matches(':popover-open')).toBe(true);
  });

  test('use `Enter` on a menu item closes all submenus', async () => {
    await userEvent.hover(ctx.social.items[1]);
    await userEvent.keyboard('{Enter}');

    await expect.poll(() => ctx.codeMenu.matches(':popover-open')).toBe(false);
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(false);
    await expect.poll(() => ctx.socialMenu.matches(':popover-open')).toBe(false);
  });
});
