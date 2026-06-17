import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { setupListbox } from '../../../-shared';

describe('Select all', () => {
  const ctx = setupListbox({ multiSelect: true });

  test('use `Meta` + `A` key to select all items', async () => {
    for (const item of ctx.listbox.items) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }

    ctx.list.focus();
    await userEvent.keyboard('{Meta>}a');

    for (const item of ctx.listbox.items) {
      await expect.element(item).toHaveAttribute('aria-selected', 'true');
    }
  });
});
