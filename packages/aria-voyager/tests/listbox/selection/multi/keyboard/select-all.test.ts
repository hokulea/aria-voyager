import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits } from '../../../-shared';

describe('Select all', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);

  test('use `Meta` + `A` key to select all items', async () => {
    expect(
      listbox.(await Promise.all(items.map(async (item) => await expect.element(item).toHaveAttribute('aria-selected')))).every(Boolean)
    ).toBeFalsy();

    list.focus();
    await userEvent.keyboard('{Meta>}a');

    expect(
      listbox.(await Promise.all(items.map(async (item) => await expect.element(item).toHaveAttribute('aria-selected')))).every(Boolean)
    ).toBeTruthy();
  });
});
