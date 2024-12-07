import { expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits, getItems } from '../../-shared';

test('focus activates the first item', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem } = getItems(listbox);

  list.dispatchEvent(new FocusEvent('focusin'));

  expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  expect(firstItem.getAttribute('aria-current')).toBe('true');
  expect(secondItem.getAttribute('aria-current')).toBeNull();
});
