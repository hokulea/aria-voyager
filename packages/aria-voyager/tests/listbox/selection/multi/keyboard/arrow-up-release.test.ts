import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '#src';
import { createMultiSelectListWithFruits, getItems } from '#tests/listbox/-shared';

describe('Select with `ArrowUp` and release `Shift`', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  const keys = userEvent.setup();

  test('use `End` key to activate last item', async () => {
    list.focus();
    await userEvent.keyboard('{End}');

    // these assertions will wait for the expected state due to built-in retrying
    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).not.toHaveAttribute('aria-selected');
    await expect.element(thirdItem).not.toHaveAttribute('aria-selected');
  });

  test('use `ArrowUp` and `Shift` key to select third and second item', async () => {
    await keys.keyboard('{Shift>}{ArrowUp}');

    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
  });

  test('Release shift', async () => {
    await keys.keyboard('{/Shift}');

    await expect.element(firstItem).not.toHaveAttribute('aria-selected');
    await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
    await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');
  });
});
