import { expect, test } from 'vitest';

import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { fireKey } from '#tests/test-support/events';

test('Navigate with `ArrowRight` (automatic mode)', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3'
  ]);

  const { firstItem, secondItem, thirdItem } = getItems(radioGroup);

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');

  firstItem.focus();

  await annotate('use `ArrowRight` key → moves focus and checks second item');
  await fireKey(container, 'ArrowRight');

  await expect.element(secondItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'false');

  await annotate('use `ArrowRight` key → moves focus and checks third item');
  await fireKey(container, 'ArrowRight');

  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');
});
