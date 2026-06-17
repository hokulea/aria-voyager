import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupListbox } from '../../-shared';

describe('Select with Pointer', () => {
  const ctx = setupListbox({ multiSelect: true });

  test('start', async () => {
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('select second item', async () => {
    await userEvent.click(ctx.secondItem);

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('select third item with `Meta` key', async () => {
    // https://github.com/hokulea/aria-voyager/issues/259
    // const user = userEvent.setup();

    // await user.keyboard('{Meta>}');
    // await user.click(ctx.thirdItem);
    // await user.keyboard('{/Meta}');

    ctx.thirdItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, metaKey: true }));

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');
  });

  test('deselect second item with `Meta` key', async () => {
    ctx.secondItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, metaKey: true }));

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');
  });

  test('select third to first item with `Shift` key', async () => {
    ctx.firstItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, shiftKey: true }));

    await expect.element(ctx.firstItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');
  });
});
