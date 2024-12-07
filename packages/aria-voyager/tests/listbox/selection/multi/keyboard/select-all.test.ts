import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits } from '../../../-shared';

describe('Select all', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);

  test('use `Meta` + `A` key to select all items', async () => {
    expect(
      listbox.items.map((item) => item.getAttribute('aria-selected')).every(Boolean)
    ).toBeFalsy();

    list.focus();
    await userEvent.keyboard('{Meta>}a');

    expect(
      listbox.items.map((item) => item.getAttribute('aria-selected')).every(Boolean)
    ).toBeTruthy();
  });
});
