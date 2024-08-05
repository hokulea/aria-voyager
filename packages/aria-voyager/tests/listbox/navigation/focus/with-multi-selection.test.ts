import { expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createMultiSelectListWithFruits } from '../../-shared';

test('focus activates first item of selection (Multi Select)', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  secondItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
  thirdItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, shiftKey: true }));

  expect(firstItem.getAttribute('aria-selected')).toBeNull();
  expect(secondItem.getAttribute('aria-selected')).toBe('true');
  expect(thirdItem.getAttribute('aria-selected')).toBe('true');

  expect(listbox.items.map((item) => item.getAttribute('aria-current')).every(Boolean)).toBeFalsy();

  list.dispatchEvent(new FocusEvent('focusin'));

  expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
  expect(firstItem.getAttribute('aria-current')).toBeNull();
  expect(secondItem.getAttribute('aria-current')).toBe('true');
  expect(thirdItem.getAttribute('aria-current')).toBeNull();
});
