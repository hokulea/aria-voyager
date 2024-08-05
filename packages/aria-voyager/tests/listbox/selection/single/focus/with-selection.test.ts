import { expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createListWithFruits } from '../../../-shared';

test('select first selection item when focus', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];

  secondItem.setAttribute('aria-selected', 'true');
  listbox.readSelection();

  list.dispatchEvent(new FocusEvent('focusin'));

  expect(firstItem.getAttribute('aria-selected')).toBeNull();
  expect(secondItem.getAttribute('aria-selected')).toBe('true');
});
