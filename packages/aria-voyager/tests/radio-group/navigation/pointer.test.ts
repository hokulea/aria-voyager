import { expect, test } from 'vitest';

import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { firePointer, focusControl } from '#tests/test-support/events';

test('Use pointer to check items', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3'
  ]);

  const { firstItem, secondItem, thirdItem } = getItems(radioGroup);

  // First item is checked by default
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'false');

  await annotate('click second item → checks it, unchecks first');
  await focusControl(container);
  await firePointer(secondItem);

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'false');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'true');
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'false');

  await annotate('click third item → checks it, unchecks second');
  await firePointer(thirdItem);

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'false');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'false');
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'true');

  await annotate('click already checked item → stays checked');
  await firePointer(thirdItem);

  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'true');

  radioGroup.dispose();
});
