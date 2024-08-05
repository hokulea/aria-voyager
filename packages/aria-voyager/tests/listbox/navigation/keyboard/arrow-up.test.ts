import { describe, expect, it } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits } from '../../-shared';

describe('navigate with `ArrowUp`', () => {
  const list = createListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  expect(list.getAttribute('aria-activedescendant')).toBeNull();
  expect(firstItem.getAttribute('aria-current')).toBeNull();
  expect(secondItem.getAttribute('aria-current')).toBeNull();
  expect(thirdItem.getAttribute('aria-current')).toBeNull();

  it('use `ArrowUp` key when there is no active item does nothing', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

    expect(list.getAttribute('aria-activedescendant')).toBeNull();
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });

  it('use `End` key to activate last item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

    expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBe('true');
  });

  it('use `ArrowUp` key to activate second item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

    expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBe('true');
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });

  it('use `ArrowUp` key to activate first item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
    expect(firstItem.getAttribute('aria-current')).toBe('true');
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });

  it('use `ArrowUp` key to, but keep first item activated (hit beginning of list)', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
    expect(firstItem.getAttribute('aria-current')).toBe('true');
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });
});

describe('navigate with `ArrowUp`, skip disabled item', () => {
  const list = createListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  expect(list.getAttribute('aria-activedescendant')).toBeNull();
  expect(firstItem.getAttribute('aria-current')).toBeNull();
  expect(secondItem.getAttribute('aria-current')).toBeNull();
  expect(thirdItem.getAttribute('aria-current')).toBeNull();

  secondItem.setAttribute('aria-disabled', 'true');

  it('use `End` key to activate last item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

    expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBe('true');
  });

  it('use `ArrowUp` key to activate first item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
    expect(firstItem.getAttribute('aria-current')).toBe('true');
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });
});
