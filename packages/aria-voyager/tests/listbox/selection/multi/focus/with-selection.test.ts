import { expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits, getItems } from '../../../-shared';

test('Select first selection item when focus', async () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  secondItem.setAttribute('aria-selected', 'true');
  thirdItem.setAttribute('aria-selected', 'true');
  listbox.readSelection();

  list.dispatchEvent(new FocusEvent('focusin'));

  await expect.poll(() => firstItem.getAttribute('aria-selected')).toBeNull();
  await expect.poll(() => secondItem.getAttribute('aria-selected')).toBe('true');
  await expect.poll(() => thirdItem.getAttribute('aria-selected')).toBe('true');
});
