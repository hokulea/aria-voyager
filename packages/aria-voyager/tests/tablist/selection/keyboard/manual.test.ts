import { expect, test } from 'vitest';

import { createTabs, getTabItems } from '#tests/tablist/-shared';

import { fireKey } from '#tests/test-support/events';

test('Select manually with spacebar', async ({ annotate }) => {
  const { tablist, tabs } = createTabs({
    behavior: {
      singleSelection: 'manual'
    }
  });
  const { firstItem, secondItem, thirdItem, fourthItem } = getTabItems(tabs);

  thirdItem.setAttribute('aria-disabled', 'true');

  expect(firstItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `ArrowRight` key to activate second item');
  await fireKey(tablist, 'ArrowRight');

  expect(firstItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  expect(secondItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use `ArrowRight` key to activate fourth item');
  await fireKey(tablist, 'ArrowRight');

  expect(firstItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.slice(1)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }

  expect(fourthItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== 3)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use spacebar to select fourth item');
  await fireKey(tablist, ' ');

  expect(fourthItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.filter((_, idx) => idx !== 4)) {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await expect.poll(() => expect.element(item).not.toHaveAttribute('aria-selected'));
  }

  await annotate('use `ArrowLeft` key to activate second item');
  await fireKey(tablist, 'ArrowLeft');

  expect(fourthItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.filter((_, idx) => idx !== 4)) {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await expect.poll(() => expect.element(item).not.toHaveAttribute('aria-selected'));
  }

  expect(secondItem).toHaveAttribute('tabindex', '0');

  for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }

  await annotate('use spacebar to select second item');
  await fireKey(tablist, ' ');

  expect(secondItem).toHaveAttribute('aria-selected', 'true');

  for (const item of tabs.items.filter((_, idx) => idx !== 1)) {
    await expect.element(item).not.toHaveAttribute('aria-selected');
  }
});
