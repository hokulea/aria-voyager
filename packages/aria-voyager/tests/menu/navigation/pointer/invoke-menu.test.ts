import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { setupCodeMenu } from '#tests/menu/-shared';

describe('Invoking a menu item closes the menu', () => {
  const ctx = setupCodeMenu({ withTrigger: true });

  test('start', async () => {
    await expect.poll(() => ctx.codeMenu.matches(':popover-open')).toBe(false);
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(false);
    await expect.poll(() => ctx.socialMenu.matches(':popover-open')).toBe(false);
  });

  test('open the menus', async () => {
    await userEvent.click(ctx.triggerButton);
    await expect.poll(() => ctx.codeMenu.matches(':popover-open')).toBe(true);

    // https://github.com/hokulea/aria-voyager/issues/264
    // await userEvent.hover(ctx.fourthItem);
    // await userEvent.hover(ctx.shareSecondItem);

    ctx.fourthItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
    ctx.shareSecondItem.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));

    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(true);
    await expect.poll(() => ctx.socialMenu.matches(':popover-open')).toBe(true);
  });

  test('clicking a menu item closes the menu', async () => {
    await userEvent.click(ctx.social.items[1]);

    await expect.poll(() => ctx.codeMenu.matches(':popover-open')).toBe(false);
    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(false);
    await expect.poll(() => ctx.socialMenu.matches(':popover-open')).toBe(false);
  });
});

describe('Invoking a descending menu item closes the menu', () => {
  const ctx = setupCodeMenu({ withTrigger: true });

  test('start', async () => {
    await expect.poll(() => ctx.codeMenu.matches(':popover-open')).toBe(false);
  });

  test('open the menus', async () => {
    await userEvent.click(ctx.triggerButton);
    await expect.poll(() => ctx.codeMenu.matches(':popover-open')).toBe(true);
  });

  test('clicking a non-menu item keeps the menu open', async () => {
    await userEvent.click(ctx.refactorHeader);
    await expect.poll(() => ctx.codeMenu.matches(':popover-open')).toBe(true);
  });

  test('clicking a descendend menu item closes the menu', async () => {
    await userEvent.click(ctx.secondItem);
    await expect.poll(() => ctx.codeMenu.matches(':popover-open')).toBe(false);
  });
});
