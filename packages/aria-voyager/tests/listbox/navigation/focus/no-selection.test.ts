import { expect, test } from 'vitest';

import { Listbox } from '../../../../src';
import { createListWithFruits, getItems } from '../../-shared';

test('focus activates the first item', async () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem } = getItems(listbox);

  list.dispatchEvent(new FocusEvent('focusin'));

  await expect.element(list).toHaveAttribute('aria-activedescendant', firstItem.id);
  await expect.element(firstItem).toHaveAttribute('aria-current', 'true');
  await expect.element(secondItem).not.toHaveAttribute('aria-current');
});
