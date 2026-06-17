import { describe, expect, test } from 'vitest';

import { setupListbox } from '../../-shared';

describe('focus activates the first selection item', () => {
  const ctx = setupListbox();

  test('focus activates the first selection item', async () => {
    ctx.secondItem.setAttribute('aria-selected', 'true');
    ctx.listbox.readSelection();

    ctx.list.focus();

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.secondItem.id);
    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-current');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-current', 'true');
  });
});
