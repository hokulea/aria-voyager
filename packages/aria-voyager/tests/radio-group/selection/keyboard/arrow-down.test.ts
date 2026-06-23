import { expect, test, vi } from 'vitest';

import { ItemEmitStrategy } from '#src/index.js';
import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { fireKey, focusControl } from '#tests/test-support/events';
import { allItemsToHaveAttributeBut } from '#tests/test-support/items';

test('Select with `ArrowDown`', async ({ annotate }) => {
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

  const { firstItem, secondItem, thirdItem, fourthItem, fifthItem, lastItem } =
    getItems(radioGroup);
  const items = [firstItem, secondItem, thirdItem, fourthItem, fifthItem];

  await focusControl(firstItem);
  expect(document.activeElement).toBe(firstItem);

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', firstItem);

  await annotate('use `ArrowDown` key to select second item');
  await fireKey(container, 'ArrowDown');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', secondItem);
  expect(listeners.select).toHaveBeenCalledWith([secondItem]);

  await annotate('use `ArrowDown` key to select third item');
  await fireKey(container, 'ArrowDown');
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', thirdItem);
  expect(listeners.select).toHaveBeenCalledWith([thirdItem]);

  await annotate('use `End` key to select last item');
  await fireKey(container, 'End');
  await expect.element(lastItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', lastItem);

  await annotate('use `ArrowDown` at last item → stays on last');
  await fireKey(container, 'ArrowDown');
  await expect.element(lastItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', lastItem);
});

test('Select with `ArrowDown`, skip disabled item', async ({ annotate }) => {
  await annotate('Arrange');

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

  const { firstItem, secondItem, thirdItem } = getItems(radioGroup);
  const items = [firstItem, secondItem, thirdItem];

  secondItem.setAttribute('aria-disabled', 'true');

  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', firstItem);

  await annotate('focus radio group to select first item');
  await focusControl(firstItem);
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', firstItem);

  await annotate('use `ArrowDown` key to select third item');
  await fireKey(container, 'ArrowDown');
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', thirdItem);
  expect(listeners.select).toHaveBeenCalledWith([thirdItem]);
});
