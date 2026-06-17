import { describe, expect, test } from 'vitest';

import { setupListbox } from '../../-shared';

describe('focus activates the first item', () => {
  const ctx = setupListbox();

  test('focus activates the first item', async () => {
    ctx.list.dispatchEvent(new FocusEvent('focusin'));

    expect(ctx.list.getAttribute('aria-activedescendant')).toBe(ctx.firstItem.id);
    await expect.element(ctx.firstItem).toHaveAttribute('aria-current', 'true');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-current');
  });
});
