import { expect, test } from 'vitest';

import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { fireKey } from '#tests/test-support/events';

test('Navigate with `ArrowUp` (automatic mode)', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5'
  ]);

  const { firstItem, secondItem, thirdItem } = getItems(radioGroup);

  // First item is checked by default
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');

  // Navigate to third item
  firstItem.focus();
  await fireKey(container, 'ArrowDown');
  await fireKey(container, 'ArrowDown');

  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'true');

  await annotate('use `ArrowUp` key → moves focus and checks second item');
  await fireKey(container, 'ArrowUp');

  await expect.element(secondItem).toHaveAttribute('tabindex', '0');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'false');

  await annotate('use `Home` key → moves to first item');
  await fireKey(container, 'Home');

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');
});
