import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { setupCodeMenu } from '#tests/menu/-shared';

describe('Hover out to trigger keeps submenu open', () => {
  const ctx = setupCodeMenu();

  test('hover item to show submenu', async () => {
    await userEvent.hover(ctx.fourthItem);

    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(true);
  });

  test('hover into submenu moves focus', async () => {
    await userEvent.hover(ctx.shareFirstItem);

    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(true);
  });

  test('hover back to trigger moves focus and keeps the submenu open', async () => {
    ctx.shareMenu.dispatchEvent(
      new PointerEvent('pointerout', { bubbles: true, relatedTarget: ctx.fourthItem })
    );

    await expect.poll(() => ctx.shareMenu.matches(':popover-open')).toBe(true);

    // eslint-disable-next-line @typescript-eslint/await-thenable
    await expect.poll(() => expect.element(ctx.fourthItem).toHaveFocus());
  });
});
