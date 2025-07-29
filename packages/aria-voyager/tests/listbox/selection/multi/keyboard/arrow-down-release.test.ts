import { userEvent } from '@vitest/browser/context';
import { describe, expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits, getItems } from '../../../-shared';

describe('Select with `ArrowDown` and release `Shift`', () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  const keys = userEvent.setup();

  test('focus the list to activate first item', async () => {
    list.focus();

    await expect.poll(() => expect.element(firstItem)).not.toHaveAttribute('aria-selected');
    await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-selected');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-selected');
  });

  test('use `ArrowDown` and `Shift` key to select from first to second item', async () => {
    await keys.keyboard('{Shift>}{ArrowDown}');

    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('aria-selected', 'true');
    await expect.poll(() => expect.element(secondItem)).toHaveAttribute('aria-selected', 'true');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-selected');
  });

  test('Release shift', async () => {
    await keys.keyboard('{/Shift}');

    await expect.poll(() => expect.element(firstItem)).toHaveAttribute('aria-selected', 'true');
    await expect.poll(() => expect.element(secondItem)).toHaveAttribute('aria-selected', 'true');
    await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-selected');
  });
});
