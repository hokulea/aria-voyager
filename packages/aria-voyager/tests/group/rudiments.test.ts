import { expect, test } from 'vitest';

import { createButtonGroup, getGroupItems } from '#tests/group/-shared';

test('renders', () => {
  const { group } = createButtonGroup();

  expect(group.items.length).toBe(5);
});

test('setup', async ({ annotate }) => {
  const { container, group } = createButtonGroup();
  const { firstItem } = getGroupItems(group);

  await expect.element(container).not.toHaveAttribute('tabindex');
  await expect.element(container).toHaveAttribute('role', 'group');

  await annotate('sets tabindex on the first item');
  await expect.element(firstItem).toHaveAttribute('tabindex', '0');

  await annotate('items have tabindex');

  for (const item of group.items) {
    await expect.element(item).toHaveAttribute('tabindex');
  }
});

test('disabled', async () => {
  const { container, group } = createButtonGroup();

  container.setAttribute('aria-disabled', 'true');

  for (const item of group.items) {
    await expect.element(item).toHaveAttribute('tabindex', '-1');
  }
});
