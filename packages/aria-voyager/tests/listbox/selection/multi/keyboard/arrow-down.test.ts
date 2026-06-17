import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupListbox } from '../../../-shared';

describe('Select with `ArrowDown` and `Shift`', () => {
  const ctx = setupListbox({ multiSelect: true });

  const keys = userEvent.setup();

  test('focus the list to activate first item', async () => {
    ctx.list.focus();

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('use `ArrowDown` and `Shift` key to select from first to second item', async () => {
    await keys.keyboard('{Shift>}{ArrowDown}');

    await expect.element(ctx.firstItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('use `ArrowDown` and `Shift` key to select from first to third item', async () => {
    await keys.keyboard('{ArrowDown}');

    await expect.element(ctx.firstItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');
  });
});
