import { expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits } from '../../-shared';

test('focus activates the first selection item', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];

  secondItem.setAttribute('aria-selected', 'true');
  listbox.readSelection();

  list.dispatchEvent(new FocusEvent('focusin'));

  expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
  expect(firstItem.getAttribute('aria-current')).toBeNull();
  expect(secondItem.getAttribute('aria-current')).toBe('true');
});
