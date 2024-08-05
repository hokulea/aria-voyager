import { expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits } from '../../-shared';

test('focus activates the first item', () => {
  const list = createListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];

  list.dispatchEvent(new FocusEvent('focusin'));

  expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  expect(firstItem.getAttribute('aria-current')).toBe('true');
  expect(secondItem.getAttribute('aria-current')).toBeNull();
});
