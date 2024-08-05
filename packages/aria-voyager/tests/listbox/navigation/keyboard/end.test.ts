import { describe, expect, it } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits } from '../../-shared';

describe('navigates with `End`', () => {
  const list = createListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  expect(list.getAttribute('aria-activedescendant')).toBeNull();
  expect(firstItem.getAttribute('aria-current')).toBeNull();
  expect(secondItem.getAttribute('aria-current')).toBeNull();
  expect(thirdItem.getAttribute('aria-current')).toBeNull();

  list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

  it('moves aria-activedescendant', () => {
    expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
  });

  it('marks items with aria-current', () => {
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBe('true');
  });
});

describe('navigates with `End`, skip disabled item', () => {
  const list = createListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  expect(list.getAttribute('aria-activedescendant')).toBeNull();
  expect(firstItem.getAttribute('aria-current')).toBeNull();
  expect(secondItem.getAttribute('aria-current')).toBeNull();
  expect(thirdItem.getAttribute('aria-current')).toBeNull();

  thirdItem.setAttribute('aria-disabled', 'true');

  list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

  it('moves aria-activedescendant', () => {
    expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
  });

  it('marks items with aria-current', () => {
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBe('true');
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });
});
