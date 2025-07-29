import { userEvent } from '@vitest/browser/context';
import { describe, expect, test, vi } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits, getItems } from '../../../-shared';

describe('Select with `ArrowUp` and release `Shift`', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  const keys = userEvent.setup();

  test('use `End` key to activate last item', async () => {
    list.focus();
    await userEvent.keyboard('{End}');

    // this await pleases playwright to pass the test when run as part of the
    // whole suite. Whem run alone, its all fine.
    // Some race conditions?
    await vi.waitFor(() => {
      await expect.poll(() => firstItem.getAttribute('aria-selected')).toBeNull();
      await expect.poll(() => secondItem.getAttribute('aria-selected')).toBeNull();
      await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBeNull();
    });
  });

  test('use `ArrowUp` and `Shift` key to select third and second item', async () => {
    await keys.keyboard('{Shift>}{ArrowUp}');

    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBeNull();
    await expect.poll(() => secondItem.getAttribute('aria-selected')).toBe('true');
    await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBe('true');
  });

  test('Release shift', async () => {
    await keys.keyboard('{/Shift}');

    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBeNull();
    await expect.poll(() => secondItem.getAttribute('aria-selected')).toBe('true');
    await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBe('true');
  });
});
