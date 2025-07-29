import { expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits, getItems } from '../../-shared';

test('focus activates the first item', async () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem } = getItems(listbox);

  list.dispatchEvent(new FocusEvent('focusin'));

  await expect.poll(() => list.getAttribute('aria-activedescendant')).toBe(firstItem.id);
  await expect.poll(() => firstItem.getAttribute('aria-current')).toBe('true');
  await expect.poll(() => secondItem.getAttribute('aria-current')).toBeNull();
});
