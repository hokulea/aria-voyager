import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupListbox } from '../../../-shared';

describe('Select with `ArrowUp` and release `Shift`', () => {
  const ctx = setupListbox({ multiSelect: true });

  test('use `End` key to activate last item', async () => {
    ctx.list.focus();
    await userEvent.keyboard('{End}');

    // these assertions will wait for the expected state due to built-in retrying
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('use `ArrowUp` and `Shift` key to select third and second item', async () => {
    await userEvent.keyboard('{Shift>}{ArrowUp}');

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');
  });

  test('Release shift', async () => {
    await userEvent.keyboard('{/Shift}');

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');
  });
});
