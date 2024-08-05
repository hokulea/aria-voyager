import { expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits } from '../../../-shared';

test('select from first to third item with `End` and `Shift` key', () => {
  const list = createMultiSelectListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  expect(firstItem.getAttribute('aria-selected')).toBeNull();
  expect(secondItem.getAttribute('aria-selected')).toBeNull();
  expect(thirdItem.getAttribute('aria-selected')).toBeNull();

  firstItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

  expect(firstItem.getAttribute('aria-selected')).toBe('true');
  expect(secondItem.getAttribute('aria-selected')).toBeNull();
  expect(thirdItem.getAttribute('aria-selected')).toBeNull();

  list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', shiftKey: true }));

  expect(firstItem.getAttribute('aria-selected')).toBe('true');
  expect(secondItem.getAttribute('aria-selected')).toBe('true');
  expect(thirdItem.getAttribute('aria-selected')).toBe('true');
});
