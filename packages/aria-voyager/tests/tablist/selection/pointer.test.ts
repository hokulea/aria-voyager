import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

import { createTabs, getTabItems } from '#tests/tablist/-shared';

test('Use pointer to select items', async ({ annotate }) => {
  const { tabs } = createTabs();
  const { firstItem, secondItem, thirdItem } = getTabItems(tabs);

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  await expect.element(firstItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  await annotate('select second item');
  await userEvent.click(secondItem);

  await expect.element(secondItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  await annotate('select third item');
  await userEvent.click(thirdItem);

  await expect.element(thirdItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.filter((_, idx) => idx !== 2)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }
});
