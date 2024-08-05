import { describe, expect, it } from 'vitest';

import { Listbox } from '../../../../../src';
import { createListWithFruits } from '../../../-shared';

describe('select with `ArrowDown`', () => {
  const list = createListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  it('focus list to select first item', () => {
    list.dispatchEvent(new FocusEvent('focusin'));

    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(secondItem.getAttribute('aria-selected')).toBeNull();
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  it('use `ArrowDown` key to select second item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  it('use `ArrowDown` key to select third item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBeNull();
    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
  });

  it('use `ArrowDown` key, but keep third item selected (hit end of list)', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBeNull();
    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
  });
});
