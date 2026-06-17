import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupListbox } from '../../../-shared';

describe('select first item with `Home` key', () => {
  const ctx = setupListbox();

  test('focus list and activate last item', async () => {
    ctx.list.focus();
    await userEvent.keyboard('{End}');

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');
  });

  test('use `Home` to select last item', async () => {
    await userEvent.keyboard('{Home}');

    await expect.element(ctx.firstItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-selected');
  });
});
