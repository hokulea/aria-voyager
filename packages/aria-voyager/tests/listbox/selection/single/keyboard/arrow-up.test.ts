import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupListbox } from '../../../-shared';

describe('select with `ArrowUp`', () => {
  const ctx = setupListbox();

  test('focus list and activate last item', async () => {
    ctx.list.focus();
    await userEvent.keyboard('{End}');

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');
  });

  test('use `ArrowUp` key to select second item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('use `ArrowUp` key to select first item', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(ctx.firstItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('use `ArrowUp` key to, but keep first item selected (hit beginning of list)', async () => {
    await userEvent.keyboard('{ArrowUp}');

    await expect.element(ctx.firstItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-selected');
  });
});
