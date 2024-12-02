import { expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits, getItems } from '../../-shared';

test('focus activates the first selection item', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem } = getItems(listbox);

  secondItem.setAttribute('aria-selected', 'true');
  listbox.readSelection();

  list.focus();

  expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
  expect(firstItem.getAttribute('aria-current')).toBeNull();
  expect(secondItem.getAttribute('aria-current')).toBe('true');
});
