import { expect, test } from 'vitest';

import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { firePointer, focusControl } from '#tests/test-support/events';
import { allItemsToHaveAttributeBut } from '#tests/test-support/items';

test('Use pointer to select items', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3'
  ]);

  const { firstItem, secondItem, thirdItem } = getItems(radioGroup);
  const items = [firstItem, secondItem, thirdItem];

  await focusControl(container);
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', firstItem);

  await annotate('click second item to select it but all others');
  await firePointer(secondItem);
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', secondItem);

  await annotate('click third item to select it but all others');
  await firePointer(thirdItem);
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', thirdItem);

  await annotate('click already selectd item stays active');
  await firePointer(thirdItem);
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', thirdItem);

  radioGroup.dispose();
});
