import { expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits } from '../../../-shared';

test('select first selection item when focus', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  secondItem.setAttribute('aria-selected', 'true');
  thirdItem.setAttribute('aria-selected', 'true');
  listbox.readSelection();

  list.dispatchEvent(new FocusEvent('focusin'));

  expect(firstItem.getAttribute('aria-selected')).toBeNull();
  expect(secondItem.getAttribute('aria-selected')).toBe('true');
  expect(thirdItem.getAttribute('aria-selected')).toBe('true');
});
