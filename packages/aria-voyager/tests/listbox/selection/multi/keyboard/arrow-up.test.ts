import { describe, expect, it } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits } from '../../../-shared';

describe('select with `ArrowUp` and `Shift`', () => {
  const list = createMultiSelectListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  it('use `End` key to activate last item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBeNull();
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  it('use `ArrowUp` and `Shift` key to select third and second item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', shiftKey: true }));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
  });

  it('use `ArrowUp` and `Shift` key to select thirdt to first item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', shiftKey: true }));

    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
  });
});

describe('select with `ArrowUp` and release `Shift`', () => {
  const list = createMultiSelectListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  it('use `End` key to activate last item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBeNull();
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  it('use `ArrowUp` and `Shift` key to select third and second item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', shiftKey: true }));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
  });

  it('Release shift', () => {
    list.dispatchEvent(new KeyboardEvent('keyup'));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
  });
});
