import { describe, expect, test } from 'vitest';

import { setupCodeMenu } from '#tests/menu/-shared';

describe('Hover through items opens and closes submenus', () => {
  const ctx = setupCodeMenu();

  test('start', async () => {
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(false);
  });

  test('hover third item', async () => {
    // does not work under playwright
    // https://github.com/hokulea/aria-voyager/issues/264
    // await userEvent.hover(ctx.thirdItem);

    ctx.thirdItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

    await expect.element(ctx.thirdItem).toHaveFocus();
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(false);
  });

  test('hover forth item opens its submenu', async () => {
    // does not work under playwright
    // https://github.com/hokulea/aria-voyager/issues/264
    // await userEvent.hover(ctx.fourthItem);

    ctx.fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

    await expect.element(ctx.fourthItem).toHaveFocus();
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(true);
  });

  test('hover fifth item closes previous submenu', async () => {
    // does not work under playwright
    // https://github.com/hokulea/aria-voyager/issues/264
    // await userEvent.hover(ctx.fifthItem);

    ctx.fifthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

    await expect.element(ctx.fifthItem).toHaveFocus();
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(false);
  });
});
