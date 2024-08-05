import { describe, expect, it } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits } from '../../../-shared';

describe('select all', () => {
  const list = createMultiSelectListWithFruits();

  const listbox = new Listbox(list);

  expect(
    listbox.items.map((item) => item.getAttribute('aria-selected')).every(Boolean)
  ).toBeFalsy();

  it('use `Meta` + `A` key to select all items', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'KeyA', metaKey: true }));

    expect(
      listbox.items.map((item) => item.getAttribute('aria-selected')).every(Boolean)
    ).toBeTruthy();
  });
});
