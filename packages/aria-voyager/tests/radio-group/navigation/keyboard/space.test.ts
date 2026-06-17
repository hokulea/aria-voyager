import { expect, test } from 'vitest';

import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { fireKey } from '#tests/test-support/events';

test('Space key checks the active item', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3'
  ]);

  const { firstItem, secondItem } = getItems(radioGroup);

  // First item is checked by default
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `ArrowDown` to move focus to second item');
  await fireKey(container, 'ArrowDown');

  // In automatic mode, arrow keys also check
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'false');

  await annotate('use `Space` on already checked item → stays checked');
  await fireKey(container, ' ');

  await expect.element(secondItem).toHaveAttribute('aria-checked', 'true');
});
