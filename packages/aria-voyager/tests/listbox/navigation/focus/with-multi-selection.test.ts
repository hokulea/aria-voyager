import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupListbox } from '../../-shared';

describe('Focus activates first item of selection (Multi Select)', () => {
  const ctx = setupListbox({ multiSelect: true });

  test('select two items', async () => {
    // await user.click(ctx.secondItem);

    // https://github.com/hokulea/aria-voyager/issues/259
    const user = userEvent.setup();

    await user.click(ctx.secondItem);
    await user.keyboard('{Shift>}');
    await user.click(ctx.thirdItem);
    await user.keyboard('{/Shift}');

    // ctx.secondItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    // ctx.thirdItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, shiftKey: true }));

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');

    for (const item of ctx.listbox.items) {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await expect.poll(() => expect.element(item).not.toHaveAttribute('aria-current'));
    }
  });

  test('refocus keeps selection', async () => {
    await userEvent.tab();
    await userEvent.tab({ shift: true });

    expect(ctx.list).toHaveAttribute('aria-activedescendant', ctx.secondItem.id);
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-current', 'true');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-current');
  });
});
