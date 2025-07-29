import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits, getItems } from '../../../-shared';

describe('Select with `ArrowUp` and `Shift`', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  const keys = userEvent.setup();

  test('focus list and activate last item', async () => {
    list.focus();
    await userEvent.keyboard('{End}');

    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBeNull();
    await expect.poll(() => secondItem.getAttribute('aria-selected')).toBeNull();
    await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  test('use `ArrowUp` and `Shift` key to select third and second item', async () => {
    await keys.keyboard('{Shift>}{ArrowUp}');

    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBeNull();
    await expect.poll(() => secondItem.getAttribute('aria-selected')).toBe('true');
    await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBe('true');
  });

  test('use `ArrowUp` and `Shift` key to select thirdt to first item', async () => {
    await keys.keyboard('{ArrowUp}');

    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBe('true');
    await expect.poll(() => secondItem.getAttribute('aria-selected')).toBe('true');
    await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBe('true');
  });
});
