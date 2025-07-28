import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '#src';
import { createListWithFruits, getItems } from '#tests/listbox/-shared';

describe('select first item with `Home` key', () => {
  const list = createListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  test('focus list and activate last item', async () => {
    list.focus();
    await userEvent.keyboard('{End}');

    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
  });

  test('use `Home` to select last item', async () => {
    await userEvent.keyboard('{Home}');

    await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(thirdItem).not.toHaveAttribute('aria-selected');
  });
});
