import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupListbox } from '../../../-shared';

describe('Toggle selection with `Space` key', () => {
  const ctx = setupListbox({ multiSelect: true });

  test('focus list', async () => {
    ctx.list.focus();

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
  });

  test('use `Space` to select active item', async () => {
    await userEvent.keyboard(' ');
    await expect.element(ctx.firstItem).toHaveAttribute('aria-selected', 'true');
  });

  test('use `Space` to deselect active item', async () => {
    await userEvent.keyboard(' ');
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
  });
});
