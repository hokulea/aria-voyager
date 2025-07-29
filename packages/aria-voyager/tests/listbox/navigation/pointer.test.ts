import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../src';
import { createListWithFruits, getItems } from '../-shared';

describe('use pointer to activate items', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('start', async () => {
    await expect.poll(() => list.getAttribute('aria-activedescendant')).toBeNull();
    await expect.poll(() => firstItem.getAttribute('aria-current')).toBeNull();
    await expect.poll(() => secondItem.getAttribute('aria-current')).toBeNull();
    await expect.poll(() => thirdItem.getAttribute('aria-current')).toBeNull();
  }));

  test('clicking the list activates first item', async () => {
    await userEvent.click(list);

    await expect.poll(() => list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
    await expect.poll(() => firstItem.getAttribute('aria-current')).toBe('true');
    await expect.poll(() => secondItem.getAttribute('aria-current')).toBeNull();
    await expect.poll(() => thirdItem.getAttribute('aria-current')).toBeNull();
  });

  test('clicking the second item activates it', async () => {
    await userEvent.click(secondItem);

    await expect.poll(() => list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
    await expect.poll(() => firstItem.getAttribute('aria-current')).toBeNull();
    await expect.poll(() => secondItem.getAttribute('aria-current')).toBe('true');
    await expect.poll(() => thirdItem.getAttribute('aria-current')).toBeNull();
  });

  test('clicking the third item activates it', async () => {
    await userEvent.click(thirdItem);

    await expect.poll(() => list.getAttribute('aria-activedescendant')).toBe(thirdItem.id);
    await expect.poll(() => firstItem.getAttribute('aria-current')).toBeNull();
    await expect.poll(() => secondItem.getAttribute('aria-current')).toBeNull();
    await expect.poll(() => thirdItem.getAttribute('aria-current')).toBe('true');
  });
});
