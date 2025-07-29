import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits, getItems } from '../../../-shared';

describe('Toggle selection with `Space` key', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem } = getItems(listbox);

  test('focus list', async () => {
    list.focus();

    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBeNull();
  }));

  test('use `Space` to select active item', async () => {
    await userEvent.keyboard(' ');
    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBe('true');
  });

  test('use `Space` to deselect active item', async () => {
    await userEvent.keyboard(' ');
    await expect.poll(() => firstItem.getAttribute('aria-selected')).toBeNull();
  });
});
