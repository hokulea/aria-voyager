import { describe, expect, it } from 'vitest';

import { Listbox } from '../../../../../src';
import { createListWithFruits } from '../../../-shared';

describe('select with `ArrowUp`', () => {
  const list = createListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  it('use `End` key to select last item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBeNull();
    expect(thirdItem.getAttribute('aria-selected')).toBe('true');
  });

  it('use `ArrowUp` key to select second item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  it('use `ArrowUp` key to select first item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(secondItem.getAttribute('aria-selected')).toBeNull();
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  it('use `ArrowUp` key to, but keep first item selected (hit beginning of list)', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(secondItem.getAttribute('aria-selected')).toBeNull();
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });
});
