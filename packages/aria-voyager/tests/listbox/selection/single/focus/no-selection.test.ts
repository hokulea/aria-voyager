import { expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createListWithFruits, getItems } from '../../../-shared';

test('select first item when focus', async () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem } = getItems(listbox);

  list.focus();

  await expect.poll(() => firstItem.getAttribute('aria-selected')).toBe('true');
  await expect.poll(() => secondItem.getAttribute('aria-selected')).toBeNull();
});
