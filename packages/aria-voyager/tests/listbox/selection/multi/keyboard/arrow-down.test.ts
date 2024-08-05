import { describe, expect, it } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits } from '../../../-shared';

describe('select with `ArrowDown` and `Shift`', () => {
  const list = createMultiSelectListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  // activate first item
  it('focus the list to activate first item', () => {
    list.dispatchEvent(new FocusEvent('focusin'));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBeNull();
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  it('use `ArrowDown` and `Shift` key to select from first to second item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true }));

    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  it('use `ArrowDown` and `Shift` key to select from first to third item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true }));

    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
  });
});

describe('select with `ArrowDown` and release `Shift`', () => {
  const list = createMultiSelectListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  // activate first item
  it('focus the list to activate first item', () => {
    list.dispatchEvent(new FocusEvent('focusin'));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBeNull();
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  it('use `ArrowDown` and `Shift` key to select from first to second item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true }));

    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  it('Release shift', () => {
    list.dispatchEvent(new KeyboardEvent('keyup'));

    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });
});
