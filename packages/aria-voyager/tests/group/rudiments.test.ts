import { describe, expect, test } from 'vitest';

import { createButtonGroup, getGroupItems } from '#tests/group/-shared';

test('renders', () => {
  const { group } = createButtonGroup();

  expect(group.items.length).toBe(5);
});

describe('setup', () => {
  test('has menu role', async () => {
    const { container } = createButtonGroup();

    await expect.element(container).toHaveAttribute('role', 'group');
  });

  test('sets tabindex on the first item', async () => {
    const { group } = createButtonGroup();

    const { firstItem } = getGroupItems(group);

    await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  });

  test('items have tabindex', async () => {
    const { group } = createButtonGroup();

    for (const item of group.items) {
      await expect.element(item).toHaveAttribute('tabindex');
    }
  });
});

describe('disabled', () => {
  test('focus does not work', async () => {
    const { container, group } = createButtonGroup();

    container.setAttribute('aria-disabled', 'true');

    for (const item of group.items) {
      await expect.element(item).toHaveAttribute('tabindex', '-1');
    }
  });
});
