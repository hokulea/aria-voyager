import { userEvent } from '@vitest/browser/context';
import { expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits, getItems } from '../../../-shared';

test('select from third to first item with `Home` and `Shift` key', async () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await expect.poll(() => firstItem.getAttribute('aria-selected')).toBeNull();
  await expect.poll(() => secondItem.getAttribute('aria-selected')).toBeNull();
  await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBeNull();

  await userEvent.click(thirdItem);

  await expect.poll(() => firstItem.getAttribute('aria-selected')).toBeNull();
  await expect.poll(() => secondItem.getAttribute('aria-selected')).toBeNull();
  await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBe('true');

  await userEvent.keyboard('{Shift>}{Home}');

  await expect.poll(() => firstItem.getAttribute('aria-selected')).toBe('true');
  await expect.poll(() => secondItem.getAttribute('aria-selected')).toBe('true');
  await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBe('true');
});
