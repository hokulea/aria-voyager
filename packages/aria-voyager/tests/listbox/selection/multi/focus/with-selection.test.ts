import { describe, expect, test } from 'vitest';

import { setupListbox } from '../../../-shared';

describe('Select first selection item when focus', () => {
  const ctx = setupListbox({ multiSelect: true });

  test('Select first selection item when focus', async () => {
    ctx.secondItem.setAttribute('aria-selected', 'true');
    ctx.thirdItem.setAttribute('aria-selected', 'true');
    ctx.listbox.readSelection();

    ctx.list.dispatchEvent(new FocusEvent('focusin'));

    await expect.element(ctx.firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(ctx.secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(ctx.thirdItem).toHaveAttribute('aria-selected', 'true');
  });
});
