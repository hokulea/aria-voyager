import { expect, test } from 'vitest';

import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { fireKey } from '#tests/test-support/events';

test('Navigate with `ArrowLeft` (automatic mode)', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3'
  ]);

  const { firstItem, secondItem, thirdItem } = getItems(radioGroup);

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');

  // Navigate to third item
  firstItem.focus();
  await fireKey(container, 'ArrowRight');
  await fireKey(container, 'ArrowRight');

  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'true');

  await annotate('use `ArrowLeft` key → moves focus and checks second item');
  await fireKey(container, 'ArrowLeft');

  await expect.element(secondItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'false');

  await annotate('use `ArrowLeft` key → moves focus and checks first item');
  await fireKey(container, 'ArrowLeft');

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');
});
