import { describe, expect, it } from 'vitest';

import { Listbox } from '../../../../src';
import { createMultiSelectListWithFruits } from '../../-shared';

describe('Select with Pointer', () => {
  const list = createMultiSelectListWithFruits();

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

  it('select third item with `Meta` key', () => {
    thirdItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, metaKey: true }));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
  });

  it('deselect second item with `Meta` key', () => {
    secondItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, metaKey: true }));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBeNull();
    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
  });

  it('select third to first item with `Shift` key', () => {
    firstItem.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, shiftKey: true }));

    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
  });
});
