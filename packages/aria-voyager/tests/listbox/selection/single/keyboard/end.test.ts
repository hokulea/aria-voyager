import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createListWithFruits, getItems } from '../../../-shared';

describe('Select last item with `End` key', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('focus list to select first item', async () => {
    list.focus();

    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBe('true');
    await expect.poll(() => secondItem.getAttribute('aria-selected')).toBeNull();
    await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBeNull();
  }));

  test('use `End` to select last item', async () => {
    await userEvent.keyboard('{End}');

    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBeNull();
    await expect.poll(() => secondItem.getAttribute('aria-selected')).toBeNull();
    await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBe('true');
  });
});
