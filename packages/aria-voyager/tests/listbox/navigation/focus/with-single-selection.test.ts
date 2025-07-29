import { expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits, getItems } from '../../-shared';

test('focus activates the first selection item', async () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem } = getItems(listbox);

  secondItem.setAttribute('aria-selected', 'true');
  listbox.readSelection();

  list.focus();

  await expect.poll(() => list.getAttribute('aria-activedescendant')).toBe(secondItem.id);
  await expect.poll(() => firstItem.getAttribute('aria-current')).toBeNull();
  await expect.poll(() => secondItem.getAttribute('aria-current')).toBe('true');
});
