import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { createTabs, getTabItems } from '#tests/tablist/-shared';

test('Use pointer to activate items', async ({ annotate }) => {
  const { tabs } = createTabs();
  const { firstItem, secondItem, thirdItem } = getTabItems(tabs);

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  expect(tabs.activeItem).toBeTruthy();

  await annotate('select second item');
  await userEvent.click(secondItem);

  await expect.element(secondItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('select third item');
  await userEvent.click(thirdItem);

  await expect.element(thirdItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== 2)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});
