import { describe, expect, it } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits } from '../../-shared';

describe('With Pointer', () => {
  const list = createListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  expect(firstItem.getAttribute('aria-selected')).toBeNull();
  expect(secondItem.getAttribute('aria-selected')).toBeNull();
  expect(thirdItem.getAttribute('aria-selected')).toBeNull();

  it('select second item', () => {
    secondItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  it('select third item', () => {
    thirdItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBeNull();
    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
  });
});
