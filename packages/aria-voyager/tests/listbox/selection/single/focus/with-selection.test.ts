import { describe, expect, test } from 'vitest';

import { setupListbox } from '../../../-shared';

describe('select first selection item when focus', () => {
  const ctx = setupListbox();

  test('select first selection item when focus', async () => {
    ctx.secondItem.setAttribute('aria-selected', 'true');
    ctx.listbox.readSelection();

    ctx.list.focus();

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');
  });
});
