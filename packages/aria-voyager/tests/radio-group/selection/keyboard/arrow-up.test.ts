import { expect, test, vi } from 'vitest';

import { ItemEmitStrategy } from '#src/index.js';
import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { fireKey, focusControl } from '#tests/test-support/events';
import { allItemsToHaveAttributeBut } from '#tests/test-support/items';

test('Select with `ArrowUp`', async ({ annotate }) => {
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

  await annotate('use `ArrowUp` key to select second item');
  await fireKey(container, 'ArrowUp');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', secondItem);
  expect(listeners.select).toHaveBeenCalledWith([secondItem]);

  await annotate('use `ArrowDown` key to select first item');
  await fireKey(container, 'ArrowUp');
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', firstItem);
  expect(listeners.select).toHaveBeenCalledWith([firstItem]);
});

test('Select with `ArrowUp`, skip disabled item', async ({ annotate }) => {
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

  secondItem.setAttribute('aria-disabled', 'true');

  await focusControl(firstItem);
  expect(document.activeElement).toBe(firstItem);
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', firstItem);

  await annotate('use `End` key to select last item');
  await fireKey(container, 'End');
  await expect.element(thirdItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', thirdItem);
  expect(listeners.select).toHaveBeenCalledWith([thirdItem]);

  await annotate('use `ArrowUp` key to select first item');
  await fireKey(container, 'ArrowUp');
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', firstItem);
  expect(listeners.select).toHaveBeenCalledWith([firstItem]);
});
