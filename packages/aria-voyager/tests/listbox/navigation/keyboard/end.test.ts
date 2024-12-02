import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits, getItems } from '../../-shared';

describe('Navigates with `End`', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('start', () => {
    expect(list.getAttribute('aria-activedescendant')).toBeNull();
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });

  test('focus list to activate first item', () => {
    list.focus();
    expect(document.activeElement).toBe(list);
    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  });

  test('use `End` key to activate last item', async () => {
    await userEvent.keyboard('{End}');

    expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBe('true');
  });
});

describe('Navigates with `End`, skip disabled item', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  thirdItem.setAttribute('aria-disabled', 'true');

  test('start', () => {
    expect(list.getAttribute('aria-activedescendant')).toBeNull();
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });

  test('focus list to activate first item', () => {
    list.focus();
    expect(document.activeElement).toBe(list);
    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  });

  test('use `End` key to activate second last item', async () => {
    await userEvent.keyboard('{End}');

    expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBe('true');
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });
});
