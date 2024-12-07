import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits, getItems } from '../../-shared';

describe('navigates with `Home`', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('start', () => {
    expect(list.getAttribute('aria-activedescendant')).toBeNull();
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });

  test('focus list and activate last item', async () => {
    list.focus();
    expect(document.activeElement).toBe(list);
    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);

    await userEvent.keyboard('{End}');
    expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
  });

  test('use `Home` key to activate last item', async () => {
    await userEvent.keyboard('{Home}');

    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
    expect(firstItem.getAttribute('aria-current')).toBe('true');
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });
});

describe('navigates with `Home`, skip disabled item', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  firstItem.setAttribute('aria-disabled', 'true');

  test('start', () => {
    expect(list.getAttribute('aria-activedescendant')).toBeNull();
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });

  test('focus list and activate last item', async () => {
    list.focus();
    expect(document.activeElement).toBe(list);
    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);

    await userEvent.keyboard('{End}');
    expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
  });

  test('use `Home` key to activate last item', async () => {
    await userEvent.keyboard('{Home}');

    expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBe('true');
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });
});
