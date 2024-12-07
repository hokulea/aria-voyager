import { expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createListWithFruits, getItems } from '../../../-shared';

test('select first item when focus', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem } = getItems(listbox);

  list.focus();

  expect(firstItem.getAttribute('aria-selected')).toBe('true');
  expect(secondItem.getAttribute('aria-selected')).toBeNull();
});
