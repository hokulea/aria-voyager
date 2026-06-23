import { expect, test, vi } from 'vitest';

import { ItemEmitStrategy } from '#src/index.js';
import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { firePointer, focusControl } from '#tests/test-support/events';
import { allItemsToHaveAttributeBut } from '#tests/test-support/items';

test('Use pointer to select items', async ({ annotate }) => {
  const { radioGroup } = createRadioGroup(document.body, ['Option 1', 'Option 2', 'Option 3']);

  const listeners = {
    select: vi.fn(),
    activateItem: vi.fn()
  };

  new ItemEmitStrategy(radioGroup, listeners);

  const { firstItem, secondItem, thirdItem } = getItems(radioGroup);
  const items = [firstItem, secondItem, thirdItem];

  await focusControl(firstItem);
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', firstItem);

  await annotate('click second item to select it but all others');
  await firePointer(secondItem);
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', secondItem);
  expect(listeners.select).toHaveBeenCalledWith([secondItem]);

  await annotate('click third item to select it but all others');
  await firePointer(thirdItem);
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', thirdItem);
  expect(listeners.select).toHaveBeenCalledWith([thirdItem]);

  // fire pointer twice on an already focussed item causes webkit to halt
  // @TODO: fix me
  // await annotate('click already selectd item stays active');
  // await firePointer(thirdItem);
  // await expect.element(thirdItem).toHaveAttribute('aria-checked', 'true');
  // await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', thirdItem);
  // expect(listeners.select).toHaveBeenCalledWith([thirdItem]);

  radioGroup.dispose();
});
