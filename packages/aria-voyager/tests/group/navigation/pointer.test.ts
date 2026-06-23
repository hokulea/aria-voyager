import { expect, test } from 'vitest';

import { createButtonGroup, getGroupItems } from '#tests/group/-shared';

import { firePointer } from '#tests/test-support/events';

test('Use pointer to activate items', async ({ annotate }) => {
  const { group } = createButtonGroup();
  const { firstItem, secondItem, thirdItem } = getGroupItems(group);

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('select second item');
  await firePointer(secondItem);

  await expect.element(secondItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.filter((_, idx) => idx !== 1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('select third item');
  await firePointer(thirdItem);

  await expect.element(thirdItem).toHaveAttribute('tabindex', '0');

  for (const item of group.items.filter((_, idx) => idx !== 2)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});
