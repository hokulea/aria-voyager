import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits, getItems } from '../../../-shared';

describe('Select with `ArrowDown` and release `Shift`', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  const keys = userEvent.setup();

  test('focus the list to activate first item', () => {
    list.focus();

    expect(firstItem.getAttribute('aria-selected')).toBeNull();
    expect(secondItem.getAttribute('aria-selected')).toBeNull();
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  test('use `ArrowDown` and `Shift` key to select from first to second item', async () => {
    await keys.keyboard('{Shift>}{ArrowDown}');

    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });

  test('Release shift', async () => {
    await keys.keyboard('{/Shift}');

    expect(firstItem.getAttribute('aria-selected')).toBe('true');
    expect(secondItem.getAttribute('aria-selected')).toBe('true');
    expect(thirdItem.getAttribute('aria-selected')).toBeNull();
  });
});
