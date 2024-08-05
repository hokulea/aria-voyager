import { expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createListWithFruits } from '../../../-shared';

test('select first item when focus', () => {
  const list = createListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];

  list.dispatchEvent(new FocusEvent('focusin'));

  expect(firstItem.getAttribute('aria-selected')).toBe('true');
  expect(secondItem.getAttribute('aria-selected')).toBeNull();
});
