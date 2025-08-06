import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits } from '../../../-shared';

describe('Select all', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);

  test('use `Meta` + `A` key to select all items', async () => {
    for (const item of listbox.items) {
      await expect.element(item).not.toHaveAttribute('aria-selected');
    }

    list.focus();
    await userEvent.keyboard('{Meta>}a');

    for (const item of listbox.items) {
      await expect.element(item).toHaveAttribute('aria-selected', 'true');
    }
  });
});
