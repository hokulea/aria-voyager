import { expect, test, vi } from 'vitest';

import { ItemEmitStrategy } from '#src/index.js';
import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { fireKey, focusControl } from '#tests/test-support/events';
import { allItemsToHaveAttributeBut } from '#tests/test-support/items';

test('Select with `End`', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3'
  ]);

  const listeners = {
    select: vi.fn(),
    activateItem: vi.fn()
  };

  new ItemEmitStrategy(radioGroup, listeners);

  const { firstItem, secondItem, thirdItem } = getItems(radioGroup);
  const items = [firstItem, secondItem, thirdItem];

  await focusControl(firstItem);
  expect(document.activeElement).toBe(firstItem);
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', firstItem);

  await annotate('use `End` key to select last item');
  await fireKey(container, 'End');
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', thirdItem);
  expect(listeners.select).toHaveBeenCalledWith([thirdItem]);
});

test('Select with `End`, skip disabled item', async ({ annotate }) => {
  const { container, radioGroup } = createRadioGroup(document.body, [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5'
  ]);

  const listeners = {
    select: vi.fn(),
    activateItem: vi.fn()
  };

  new ItemEmitStrategy(radioGroup, listeners);

  const { firstItem, secondItem, thirdItem, fourthItem, fifthItem } = getItems(radioGroup);
  const items = [firstItem, secondItem, thirdItem, fourthItem, fifthItem];

  fifthItem.setAttribute('aria-disabled', 'true');
  radioGroup.readItems();

  await focusControl(firstItem);
  expect(document.activeElement).toBe(firstItem);
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', firstItem);

  await annotate('use `End` key to select second last item');
  await fireKey(container, 'End');
  await expect.element(fourthItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', fourthItem);
  expect(listeners.select).toHaveBeenCalledWith([fourthItem]);
});
