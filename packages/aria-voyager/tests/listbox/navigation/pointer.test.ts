import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../src';
import { createListWithFruits, getItems } from '../-shared';

describe('use pointer to activate items', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('start', () => {
    expect(list.getAttribute('aria-activedescendant')).toBeNull();
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });

  test('clicking the list activates first item', async () => {
    await userEvent.click(list);

    expect(list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
    expect(firstItem.getAttribute('aria-current')).toBe('true');
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });

  test('clicking the second item activates it', async () => {
    await userEvent.click(secondItem);

    expect(list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBe('true');
    expect(thirdItem.getAttribute('aria-current')).toBeNull();
  });

  test('clicking the third item activates it', async () => {
    await userEvent.click(thirdItem);

    expect(list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
    expect(firstItem.getAttribute('aria-current')).toBeNull();
    expect(secondItem.getAttribute('aria-current')).toBeNull();
    expect(thirdItem.getAttribute('aria-current')).toBe('true');
  });
});
