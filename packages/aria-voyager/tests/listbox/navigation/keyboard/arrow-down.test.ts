import { describe, expect, it } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits } from '../../-shared';

describe('navigate with `ArrowDown`', () => {
  const list = createListWithFruits();

  new Listbox(list);

  const firstItem = list.children[0];
  const secondItem = list.children[1];
  const thirdItem = list.children[2];

  expect(list.getAttribute('aria-activedescendant')).toBeNull();
  expect(firstItem.getAttribute('aria-current')).toBeNull();
  expect(secondItem.getAttribute('aria-current')).toBeNull();
  expect(thirdItem.getAttribute('aria-current')).toBeNull();

  it('use `ArrowDown` key when there is no active item does nothing', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(list.getAttribute('aria-activedescendant')).toBeNull();
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });

  it('use `Home` key to activate first item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));

    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(secondItem.getAttribute('aria-selected')).toBeNull();
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  it('use `ArrowDown` key to activate second item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBe('true');
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });

  it('use `ArrowDown` key to activate third item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBe('true');
  });

  it('use `ArrowDown` key, but keep third item activated (hit end of list)', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBe('true');
  });
});

describe('navigate with `ArrowDown`, skip disabled item', () => {
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

  it('use `Home` key to activate first item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));

    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(secondItem.getAttribute('aria-selected')).toBeNull();
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  it('use `ArrowDown` key to activate third item', () => {
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBe('true');
  });
});
