import { describe, expect, test } from 'vitest';

import { setupListbox } from '../../../-shared';

describe('Select no items on focus', () => {
  const ctx = setupListbox({ multiSelect: true });

  test('Select no items on focus', async () => {
    ctx.list.dispatchEvent(new FocusEvent('focusin'));

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).not.toHaveAttribute('aria-selected');
  });
});
