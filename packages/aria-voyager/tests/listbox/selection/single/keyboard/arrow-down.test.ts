import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupListbox } from '../../../-shared';

describe('Select with `ArrowDown`', () => {
  const ctx = setupListbox();

  test('focus list to select first item', async () => {
    ctx.list.focus();

    await expect.element(ctx.firstItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('use `ArrowDown` key to select second item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('use `ArrowDown` key to select third item', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');
  });

  test('use `ArrowDown` key, but keep third item selected (hit end of list)', async () => {
    await userEvent.keyboard('{ArrowDown}');

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');
  });
});
