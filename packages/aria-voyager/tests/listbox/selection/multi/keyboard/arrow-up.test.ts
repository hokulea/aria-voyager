import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupListbox } from '../../../-shared';

describe('Select with `ArrowUp` and `Shift`', () => {
  const ctx = setupListbox({ multiSelect: true });

  const keys = userEvent.setup();

  test('focus list and activate last item', async () => {
    ctx.list.focus();
    await userEvent.keyboard('{End}');

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('use `ArrowUp` and `Shift` key to select third and second item', async () => {
    await keys.keyboard('{Shift>}{ArrowUp}');

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');
  });

  test('use `ArrowUp` and `Shift` key to select thirdt to first item', async () => {
    await keys.keyboard('{ArrowUp}');

    await expect.element(ctx.firstItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');
  });
});
