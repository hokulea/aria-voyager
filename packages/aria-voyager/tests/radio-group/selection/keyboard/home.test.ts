import { expect, test, vi } from 'vitest';

import { ItemEmitStrategy } from '#src/index.js';
import { createRadioGroup, getItems } from '#tests/radio-group/-shared';

import { fireKey, focusControl } from '#tests/test-support/events';
import { allItemsToHaveAttributeBut } from '#tests/test-support/items';

test('Select with `Home`', async ({ annotate }) => {
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

  await focusControl(firstItem);
  expect(document.activeElement).toBe(firstItem);
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', firstItem);

  await annotate('use `End` key to select last item');
  await fireKey(container, 'End');
  await expect.element(fifthItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', fifthItem);
  expect(listeners.select).toHaveBeenCalledWith([fifthItem]);

  await annotate('use `Home` key to select first item');
  await fireKey(container, 'Home');
  await expect.element(firstItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', firstItem);
  expect(listeners.select).toHaveBeenCalledWith([firstItem]);
});

test('Select with `Home`, skip disabled item', async ({ annotate }) => {
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
  const items = [secondItem, thirdItem, fourthItem, fifthItem];

  firstItem.setAttribute('aria-disabled', 'true');
  radioGroup.readItems();

  await focusControl(secondItem);
  expect(document.activeElement).toBe(secondItem);
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', secondItem);

  await annotate('use `End` key to select last item');
  await fireKey(container, 'End');
  await expect.element(fifthItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', fifthItem);
  expect(listeners.select).toHaveBeenCalledWith([fifthItem]);

  await annotate('use `Home` key to select second item');
  await fireKey(container, 'Home');
  await expect.element(secondItem).toHaveAttribute('aria-checked', 'true');
  await allItemsToHaveAttributeBut(items, 'aria-checked', 'false', secondItem);
  expect(listeners.select).toHaveBeenCalledWith([secondItem]);
});
