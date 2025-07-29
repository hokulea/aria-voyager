import { expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createListWithFruits, getItems } from '../../../-shared';

test('select first selection item when focus', async () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem } = getItems(listbox);

  secondItem.setAttribute('aria-selected', 'true');
  listbox.readSelection();

  list.focus();

  await expect.poll(() => firstItem.getAttribute('aria-selected')).toBeNull();
  await expect.poll(() => secondItem.getAttribute('aria-selected')).toBe('true');
});
