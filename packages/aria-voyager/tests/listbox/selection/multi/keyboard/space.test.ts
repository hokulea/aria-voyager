import { describe, expect, it } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits } from '../../../-shared';

describe('toggle selection with `Space` key', () => {
  const list = createMultiSelectListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];

  list.dispatchEvent(new FocusEvent('focusin'));

  expect(firstItem.getAttribute('aria-selected')).toBeNull();

  it('use `Space` to select active item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(firstItem.getAttribute('aria-selected')).toBe('true');
  });

  it('use `Space` to deselect active item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(firstItem.getAttribute('aria-selected')).toBeNull();
  });
});
