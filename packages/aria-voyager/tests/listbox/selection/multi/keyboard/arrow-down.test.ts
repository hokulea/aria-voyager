import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits, getItems } from '../../../-shared';

describe('Select with `ArrowDown` and `Shift`', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  const keys = userEvent.setup();

  test('focus the list to activate first item', async () => {
    list.focus();

    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBeNull();
    await expect.poll(() => secondItem.getAttribute('aria-selected')).toBeNull();
    await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBeNull();
  }));

  test('use `ArrowDown` and `Shift` key to select from first to second item', async () => {
    await keys.keyboard('{Shift>}{ArrowDown}');

    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBe('true');
    await expect.poll(() => secondItem.getAttribute('aria-selected')).toBe('true');
    await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  test('use `ArrowDown` and `Shift` key to select from first to third item', async () => {
    await keys.keyboard('{ArrowDown}');

    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBe('true');
    await expect.poll(() => secondItem.getAttribute('aria-selected')).toBe('true');
    await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBe('true');
  });
});
