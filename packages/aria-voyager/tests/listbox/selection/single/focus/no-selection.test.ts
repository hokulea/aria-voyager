import { describe, expect, test } from 'vitest';

import { setupListbox } from '../../../-shared';

describe('select first item when focus', () => {
  const ctx = setupListbox();

  test('select first item when focus', async () => {
    ctx.list.focus();

    await expect.element(ctx.firstItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-selected');
  });
});
