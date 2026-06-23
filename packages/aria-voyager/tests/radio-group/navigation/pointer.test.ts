import { expect, test } from 'vitest';

import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { firePointer } from '#tests/test-support/events';
import { allItemsToHaveAttributeBut } from '#tests/test-support/items';

test('Use pointer to activate items', async ({ annotate }) => {
  const { radioGroup } = createRadioGroup(document.body, ['Option 1', 'Option 2', 'Option 3']);

  const { firstItem, secondItem, thirdItem } = getItems(radioGroup);
  const items = [firstItem, secondItem, thirdItem];

  await expect.element(firstItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', firstItem);

  await annotate('click second item to activate it but all others');
  await firePointer(secondItem);
  await expect.element(secondItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', secondItem);

  await annotate('click third item to activate it but all others');
  await firePointer(thirdItem);
  await expect.element(thirdItem).toHaveAttribute('tabindex', '0');
  await allItemsToHaveAttributeBut(items, 'tabindex', '-1', thirdItem);

  // fire pointer twice on an already focussed item causes webkit to halt
  // @TODO: fix me
  // await annotate('click already activated item stays active');
  // await firePointer(thirdItem);
  // await expect.element(thirdItem).toHaveAttribute('tabindex', '0');
  // await allItemsToHaveAttributeBut(items, 'tabindex', '-1', thirdItem);

  radioGroup.dispose();
});
