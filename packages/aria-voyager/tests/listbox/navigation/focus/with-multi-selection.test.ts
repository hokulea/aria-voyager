import { expect, test } from 'vitest';

import { Listbox } from '#src';
import { createMultiSelectListWithFruits, getItems } from '#tests/listbox/-shared';

import { blurControl, firePointer, focusControl } from '#tests/test-support/events';

test('Focus activates first item of selection (Multi Select)', async ({ annotate }) => {
  const list = createMultiSelectListWithFruits();
  const listbox = new Listbox(list);
  const { firstItem, secondItem, thirdItem } = getItems(listbox);

  await annotate('select two items');

  await focusControl(secondItem);
  await firePointer(secondItem);
  await focusControl(thirdItem);
  await firePointer(thirdItem, { shiftKey: true });

  await expect.element(firstItem).not.toHaveAttribute('aria-selected');
  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');
  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');

  for (const item of listbox.items) {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await expect.poll(() => expect.element(item).not.toHaveAttribute('aria-current'));
  }

  await annotate('refocus keeps selection');
  await focusControl(list);
  await blurControl(list);

  expect(list).toHaveAttribute('aria-activedescendant', secondItem.id);
  await expect.element(firstItem).not.toHaveAttribute('aria-current');
  await expect.element(secondItem).toHaveAttribute('aria-current', 'true');
  await expect.element(thirdItem).not.toHaveAttribute('aria-current');
});
