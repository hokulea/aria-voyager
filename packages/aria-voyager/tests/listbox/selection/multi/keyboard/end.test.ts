import { userEvent } from '@vitest/browser/context';
import { expect, test } from 'vitest';

import { Listbox } from '../../../../../src';
import { createMultiSelectListWithFruits, getItems } from '../../../-shared';

test('Select from first to third item with `End` and `Shift` key', async () => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await expect.poll(() => expect.element(firstItem)).not.toHaveAttribute('aria-selected');
  await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-selected');
  await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-selected');

  await userEvent.click(firstItem);

  await expect.poll(() => expect.element(firstItem)).toHaveAttribute('aria-selected', 'true');
  await expect.poll(() => expect.element(secondItem)).not.toHaveAttribute('aria-selected');
  await expect.poll(() => expect.element(thirdItem)).not.toHaveAttribute('aria-selected');

  await userEvent.keyboard('{Shift>}{End}');

  await expect.poll(() => expect.element(firstItem)).toHaveAttribute('aria-selected', 'true');
  await expect.poll(() => expect.element(secondItem)).toHaveAttribute('aria-selected', 'true');
  await expect.poll(() => expect.element(thirdItem)).toHaveAttribute('aria-selected', 'true');
});
