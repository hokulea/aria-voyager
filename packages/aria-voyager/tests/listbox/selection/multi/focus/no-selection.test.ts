import { expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits } from '../../../-shared';

test('select no items on focus', () => {
  const list = createMultiSelectListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];

  list.dispatchEvent(new FocusEvent('focusin'));

  expect(firstItem.getAttribute('aria-selected')).toBeNull();
  expect(secondItem.getAttribute('aria-selected')).toBeNull();
});
