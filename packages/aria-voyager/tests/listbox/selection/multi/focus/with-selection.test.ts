import { expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits, getItems } from '../../../-shared';

test('Select first selection item when focus', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  secondItem.setAttribute('aria-selected', 'true');
  thirdItem.setAttribute('aria-selected', 'true');
  listbox.readSelection();

  list.dispatchEvent(new FocusEvent('focusin'));

  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
});
