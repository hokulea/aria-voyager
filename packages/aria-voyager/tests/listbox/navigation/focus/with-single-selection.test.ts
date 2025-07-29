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

  await expect
    .poll(() => expect.element(list))
    .toHaveAttribute('aria-activedescendant', secondItem.id);
  await expect.poll(() => expect.element(firstItem)).not.toHaveAttribute('aria-current');
  await expect.poll(() => expect.element(secondItem)).toHaveAttribute('aria-current', 'true');
});
