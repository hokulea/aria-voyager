import { expect, test } from 'vitest';

import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { fireKey } from '#tests/test-support/events';

test('Navigate with `ArrowDown` (automatic mode)', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5'
  ]);

  const { firstItem, secondItem, thirdItem, lastItem } = getItems(radioGroup);

  // First item is checked by default
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');

  firstItem.focus();
  expect(document.activeElement).toBe(firstItem);

  await annotate('use `ArrowDown` key → moves focus and checks second item');
  await fireKey(container, 'ArrowDown');

  await expect.element(secondItem).toHaveAttribute('tabindex', '0');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'false');

  await annotate('use `ArrowDown` key → moves focus and checks third item');
  await fireKey(container, 'ArrowDown');

  await expect.element(thirdItem).toHaveAttribute('tabindex', '0');
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');

  await annotate('use `End` key → moves to last item');
  await fireKey(container, 'End');

  await expect.element(lastItem).toHaveAttribute('tabindex', '0');
  await expect.element(lastItem).toHaveAttribute('aria-checked', 'true');

  await annotate('use `ArrowDown` at last item → stays on last');
  await fireKey(container, 'ArrowDown');

  await expect.element(lastItem).toHaveAttribute('aria-checked', 'true');
});
